import { parseImports } from "npm:parse-imports";
import { DependencyError } from "../common/error.ts";
import * as walk from "../common/walk.ts";

export async function directoryDependsOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  if (dependencies.length === 0)
    return true;
  await walk.onGlob(dir, async (directory: string) => {
    await walk.onDir(directory, (path: string ) => fileDependsOn(path, ...dependencies));
  });
  return true;
}


export async function fileDependsOn(path: string, ...dependencies: string[]): Promise<boolean> {
  const code = Deno.readTextFileSync(path);
  specifier:
  for (const $import of await parseImports(code)) {
    const specifier = $import.moduleSpecifier.value ?? "";
    const type = $import.moduleSpecifier.type; 
    if (type === "relative")
      continue specifier
    for (const dependency of dependencies) {
        if (dependency === specifier)
          continue specifier
    }
    throw new DependencyError(`imported resource "${specifier}" in file "${path}" is a not registered specifier, allowed are: ${dependencies.join(", ")}`);
  }
  return true; 
}

export async function directoryDoesNotDependOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  await walk.onGlob(dir, async (directory: string) => {
    await walk.onDir(directory, (path: string ) => fileDoesNotDependOn(path, ...dependencies));
  });
  return true;
}

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
    for (const dependency of dependencies) {
        if (dependency === specifier)
          throw new DependencyError(`imported resource "${specifier}" in file "${path}" is forbidden`);
    }
  }
  return true; 
}