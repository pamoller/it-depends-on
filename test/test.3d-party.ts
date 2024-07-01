import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { directoryDependsOn } from "../rules/3d-party.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";

describe("limit usage of 3rd parth software", () => {
  it("test/ddd/buisiness is limited", async () => {
    assert(await directoryDependsOn("./test/ddd/business", "npm:mongodb"));
  });

  it("test/ddd/another is limited", async () => {
    await assertThrowsAsync(async () => {
      await directoryDependsOn("./test/ddd/another", "npm:mongodb");
    });
  });
});
