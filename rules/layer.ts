import { parseImports} from "npm:parse-imports";
import { DependencyError } from "../common/error.ts";
import { dirname } from "../common/file.ts";
import * as walk from "../common/walk.ts";

// recurse directory glob and scan file imports for missing dependencies
export async function directoryDependsOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  await walk.onExpansion(dir, async (dir: string, xdependencies: string[] ) => {
    const extended = [dir, ...xdependencies];
    await walk.onDir(dir, (path: string) => fileDependsOn(path, ...extended));
  }, dependencies);
  return true;
}

// scan file imports for missing dependencies
export async function fileDependsOn(path: string, ...dependencies: string[]): Promise<boolean> {
  const code = Deno.readTextFileSync(path);
  const dir = dirname(path);
  specifier:
  for (const $import of await parseImports(code)) {
    if ($import.moduleSpecifier.type !== "relative") 
      continue specifier 
    const specifier = $import.moduleSpecifier.value ?? "";
    for (const dep of dependencies) {
      const specifierPath = await realPathFrom(dir, specifier);
      const depPath = await realPathFrom(dep);
      if (specifierPath.startsWith(depPath))
        continue specifier
    }
    throw new DependencyError(`imported resource "${specifier}" in file "${path}" is a not registered specifier, allowed are: ${dependencies.join(", ")}`);
  }
  return true; 
}

// recurse directory glob and scan file imports for forbidden dependencies
export async function directoryDoesNotDependOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  await walk.onExpansion(dir, async (dir: string, xdependencies: string[] ) => {
    await walk.onDir(dir, (path: string) => fileDoesNotDependOn(path, ...xdependencies));
  }, dependencies);
  return true;
}

// scan file imports for forbidden dependencies
export async function fileDoesNotDependOn(path: string, ...dependencies: string[]): Promise<boolean> {
  const code = Deno.readTextFileSync(path);
  const dir = dirname(path);
  specifier:
  for (const $import of await parseImports(code)) {
    if ($import.moduleSpecifier.type !== "relative") 
      continue specifier 
    if (dependencies.length === 0)
      throw new DependencyError(`any imported resource is forbidden`);
    const specifier = $import.moduleSpecifier.value ?? "";
    for (const dep of dependencies) {
      const specifierPath = await realPathFrom(dir, specifier);
        const depPath = await realPathFrom(dep);
        if (specifierPath.startsWith(depPath))
          throw new DependencyError(`imported resource "${specifier}" in file "${path}" is forbidden`);
      }
  }
  return true; 
}

async function realPathFrom(...paths: string[]): Promise<string> {
  try {
    return await Deno.realPath(paths.join("/"));
  } catch(e) {
    throw new DependencyError(`imported resource "${paths.join("/")}" does not exist`);
  }
}