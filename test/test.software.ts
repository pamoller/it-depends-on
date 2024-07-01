import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { directoryDependsOn, directoryDoesNotDependOn } from "../rules/3d-party.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";

describe("test the validity of software dependencies", () => {
  it("limit business domain to mongodb", async () => {
    assert(await directoryDependsOn("./test/ddd/business/infrastructure", "npm:mongodb"));
  });

  it("allow software dependencies in infrasturcture layer only", async () => {
    //assert(await directoryDoesNotDependOn("./test/ddd/*/application"));
    //assert(await directoryDoesNotDependOn("./test/ddd/*/domain/model"));
  });

  it("test/ddd/another is limited", async () => {
    await assertThrowsAsync(async () => {
      await directoryDependsOn("./test/ddd/another", "npm:mongodb");
    });
  });
});
