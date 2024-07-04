// Copyright 2024 pamoller. All rights reserved. MIT license.

/**
 * Library for unit testing your software architecture.
 *
 * ```ts
 * import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
 * import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
 * import * as layer from 'jsr:@pamoller/it-depends-on@^0.1.4/layer';
 * import * as software from 'jsr:@pamoller/it-depends-on@^0.1.4/software';
 * 
 * describe("test layer policy", async () => {
 *     it("common is self containing", async () => {
 *         assert(layer.directoryDoesNotDependOn("./common"));
 *     });
 * 
 *     it("rules and test are client of common", async () => {
 *         assert(layer.directoryDependsOn("./rules", "./common"));
 *         assert(layer.directoryDependsOn("./test", "./common"));
 *     });
 * }); ```
 *
 * @module
 */

export * as layer from "./rules/layer.ts";
export * as software from "./rules/software.ts";
