import { DependencyError } from "../common/error.ts";
import * as walk from "../common/walk.ts";
import { globs } from "../common/glob.ts";
import { specifiers } from "../common/file.ts";

/**
 * This module contains functions to define and check layers of a software system for compliance
 * @module
 */

/** 
 * recurse and check imported specifiers for compliance 
 * 
 * @throws {DependencyError} when a file does not depend on the specified dependencies
 */
export async function directoryDependsOn(
  dir: string,
  ...dependencies: string[]
): Promise<boolean> {
  /*if (dependencies.length === 0) {
    return true;
  }*/
  await walk.onGlob(dir, async (dir: string) => {
    await walk.onDir(
      dir,
      (path: string) => fileDependsOn(path, ...dependencies),
    );
  });
  return true;
}

/** 
 * check imported specifiers for compliance 
 * 
 * @throws {DependencyError} when a file does not depend on the specified dependencies
 */
export async function fileDependsOn(
  path: string,
  ...dependencies: string[]
): Promise<boolean> {
  /*if (dependencies.length === 0) {
    return true;
  }*/
  specifier:
  for await (const specifier of specifiers(path, false)) {
    for (const dep of dependencies) {
      if (globs(specifier, dep)) {
        continue specifier;
      }
    }
    throw new DependencyError(
      `imported resource "${specifier}" in file "${path}" is a not registered specifier, allowed are: ${
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
  await walk.onGlob(dir, async (dir: string) => {
    await walk.onDir(
      dir,
      (path: string) => fileDoesNotDependOn(path, ...dependencies),
    );
  });
  return true;
}

/** 
 * check imported specifiers for compliance 
 * 
 * @throws {DependencyError} when a file does not depend on the specified dependencies
 */
export async function fileDoesNotDependOn(
  path: string,
  ...dependencies: string[]
): Promise<boolean> {
  for await (const specifier of specifiers(path, false)) {
    if (dependencies.length === 0) {
      throw new DependencyError(`any imported resource is forbidden`);
    }
    for (const dep of dependencies) {
      if (globs(specifier, dep)) {
        throw new DependencyError(
          `imported resource "${specifier}" in file "${path}" is forbidden`,
        );
      }
    }
  }
  return true;
}
