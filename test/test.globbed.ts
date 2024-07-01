import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { directoryDependsOn } from "../rules/local.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";

describe("test a ddd architecture", () => {
  it("test/ddd/common is self containing", async () => {
    assert(await directoryDependsOn("./test/ddd/*/model"), "is not self containing");
  }); 
});
