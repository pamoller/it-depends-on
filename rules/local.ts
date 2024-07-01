import { parseImports} from "npm:parse-imports";
import DependencyError from "../common/error.ts";
import { dirname, globDirectory, walkDirectory } from "../common/file.ts";

export async function directoryDependsOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  await globDirectory(dir, async (path: string, xdependencies: string[] ) => {
    const extended = [path, ...xdependencies];
    await walkDirectory(path, (path: string) => fileDependsOn(path, ...extended));
  }, dependencies);
  return true;
}


export async function fileDependsOn(path: string, ...dependencies: string[]): Promise<boolean> {
  const code = Deno.readTextFileSync(path);
  const directory = dirname(path);
  specifier:
  for (const $import of await parseImports(code)) {
    if ($import.moduleSpecifier.type !== "relative") 
      continue specifier 
    const specifier = $import.moduleSpecifier.value ?? "";
    for (const dependency of dependencies) {
      const specifierPath = await realPathFrom(directory, specifier);
      const dependencyPath = await realPathFrom(dependency);
      if (specifierPath.startsWith(dependencyPath))
        continue specifier
    }
    throw new DependencyError(`imported resource "${specifier}" in file "${path}" is a not registered specifier, allowed are: ${dependencies.join(", ")}`);
  }
  return true; 
}

export async function directoryDoesNotDependOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  await walkDirectory(dir, (path: string ) => fileDoesNotDependOn(path, ...dependencies));
  return true;
}

export async function fileDoesNotDependOn(path: string, ...dependencies: string[]): Promise<boolean> {
  const code = Deno.readTextFileSync(path);
  const directory = dirname(path);
  specifier:
  for (const $import of await parseImports(code)) {
    if ($import.moduleSpecifier.type !== "relative") 
      continue specifier 
    if (dependencies.length === 0)
      throw new DependencyError(`any imported resource is forbidden`);
    const specifier = $import.moduleSpecifier.value ?? "";
    for (const dependency of dependencies) {
        const specifierPath = await realPathFrom(directory, specifier);
        const dependencyPath = await realPathFrom(dependency);
        if (specifierPath.startsWith(dependencyPath))
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