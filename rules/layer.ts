import { DependencyError } from "../common/error.ts";
import { dirname, translate, xpath, specifiers } from "../common/file.ts";
import * as walk from "../common/walk.ts";
/**
 * This module contains functions to define and check layers of a software system for compliance
 * 
 * @module
 */

/** 
 * recurse and check file specifiers for compliance 
 * 
 * @throws {DependencyError} when a file does not depend on the specified dependencies
 */
export async function directoryDependsOn(
  dir: string,
  ...dependencies: string[]
): Promise<boolean> {
  await walk.onExpansion(dir, async (dir: string, xdependencies: string[]) => {
    const extended = [dir, ...xdependencies];
    await walk.onDir(dir, (path: string) => fileDependsOn(path, ...extended));
  }, dependencies);
  return true;
}

/** 
 * check file imported specifiers for compliance 
 *
 * @throws {DependencyError} when a file does not depend on the specified dependencies
 */
export async function fileDependsOn(
  path: string,
  ...dependencies: string[]
): Promise<boolean> {
  const dir = dirname(translate(path));
  specifier:
  for await (const specifier of specifiers(path)) {
    for (const dep of dependencies) {
      const specifierPath = xpath(dir, translate(specifier));
      const depPath = xpath(translate(dep));
      if (specifierPath.startsWith(depPath)) {
        continue specifier;
      }
    }
    throw new DependencyError(
      `imported resource "${
        translate(specifier)
      }" in file "${path}" is a not registered specifier, allowed are: ${
        dependencies.join(", ")
      }`,
    );
  }
  return true;
}

/** 
 * recurse and check imported specifiers for compliance 
 * 
 * @throws {DependencyError} when a file does not depend on the specified dependencies
 */
export async function directoryDoesNotDependOn(
  dir: string,
  ...dependencies: string[]
): Promise<boolean> {
  await walk.onExpansion(dir, async (dir: string, xdependencies: string[]) => {
    await walk.onDir(
      dir,
      (path: string) => fileDoesNotDependOn(path, ...xdependencies),
    );
  }, dependencies);
  return true;
}

/** 
 * recurse and check imported specifiers for compliance 
 * 
 * @throws {DependencyError} when a file does not depend on the specified dependencies
 */
export async function fileDoesNotDependOn(
  path: string,
  ...dependencies: string[]
): Promise<boolean> {
  const dir = dirname(path);
  for await (const specifier of specifiers(path)) {
    if (dependencies.length === 0) {
      throw new DependencyError(`any imported resource is forbidden`);
    }
    for (const dep of dependencies) {
      const specifierPath = xpath(dir, translate(specifier));
      const depPath = xpath(translate(dep));
      if (specifierPath.startsWith(depPath)) {
        throw new DependencyError(
          `imported resource "${
            translate(specifier)
          }" in file "${path}" is forbidden`,
        );
      }
    }
  }
  return true;
}