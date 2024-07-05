import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import * as layer from "./rules/layer.ts";

describe("test layer policy", async () => {
    it("common is strictly self containing", async () => {
        assert(layer.directoryDependsOn("./common"));
    });

    it("rules and test are clients of common", async () => {
        assert(layer.directoryDependsOn("./rules", "./common"));
        assert(layer.directoryDependsOn("./test", "./common"));
    });
});
