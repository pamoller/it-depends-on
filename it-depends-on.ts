import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import * as layer from "./rules/layer.ts";
import * as software from "./rules/software.ts";

describe("test layer compliance", async () => {
    it("common depends only on itself, jsr and npm", async () => {
        assert(await layer.directoryDependsOn("./common"));
        assert(await software.directoryDependsOn("./common", "jsr:*", "npm:*"));
    });

    it("rules is an exclusive client of common", async () => {
        assert(await layer.directoryDependsOn("./rules", "./common"));
        assert(await software.directoryDoesNotDependOn("./rules"));
    });
});
