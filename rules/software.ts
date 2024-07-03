import { parseImports } from "npm:parse-imports@^2.1.0";
import { DependencyError } from "../common/error.ts";
import * as walk from "../common/walk.ts";
import { globs } from "../common/glob.ts";

// recurse directory glob and scan file imports for missing dependencies
export async function directoryDependsOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  if (dependencies.length === 0)
    return true;
  await walk.onGlob(dir, async (dir: string) => {
    await walk.onDir(dir, (path: string ) => fileDependsOn(path, ...dependencies));
  });
  return true;
}

// scan file imports for missing dependencies
export async function fileDependsOn(path: string, ...dependencies: string[]): Promise<boolean> {
  if (dependencies.length === 0)
    return true;
  const code = Deno.readTextFileSync(path);
  specifier:
  for (const $import of await parseImports(code)) {
    const specifier = $import.moduleSpecifier.value ?? "";
    const type = $import.moduleSpecifier.type;
    if (type === "relative")
      continue specifier
    for (const dep of dependencies) {
        if (globs(specifier, dep))
          continue specifier
    }
    throw new DependencyError(`imported resource "${specifier}" in file "${path}" is a not registered specifier, allowed are: ${dependencies.join(", ")}`);
  }
  return true; 
}

// recurse directory glob and scan file imports for forbidden dependencies
export async function directoryDoesNotDependOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  await walk.onGlob(dir, async (dir: string) => {
    await walk.onDir(dir, (path: string ) => fileDoesNotDependOn(path, ...dependencies));
  });
  return true;
}

// scan file imports for forbidden dependencies
export async function fileDoesNotDependOn(path: string, ...dependencies: string[]): Promise<boolean> {
  const code = Deno.readTextFileSync(path);
  specifier:
  for (const $import of await parseImports(code)) {
    const specifier = $import.moduleSpecifier.value ?? "";
    const type = $import.moduleSpecifier.type; 
    if (type === "relative")
      continue specifier
    if (dependencies.length === 0)
      throw new DependencyError(`any imported resource is forbidden`);
    for (const dep of dependencies) {
        if (globs(specifier, dep))
          throw new DependencyError(`imported resource "${specifier}" in file "${path}" is forbidden`);
    }
  }
  return true; 
}
