import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { directoryDoesNotDependOn, directoryDependsOn } from "../rules/software.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";

describe("test the validity of software dependencies", () => {
  it("allow software dependencies in infrasturcture layer only", async () => {
    assert(await directoryDoesNotDependOn("./test/ddd/*/application"));
    assert(await directoryDoesNotDependOn("./test/ddd/*/domain/model"));
  });

  it("limit domains", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/{common,business,collaboration}/infrastructure",
        "https://deno.land/std@0.2*/*",
        "npm:kafka^2*",
        "npm:mongodb^5*"
      ),
    );

    await assertThrowsAsync(async () => {
      await directoryDoesNotDependOn("./test/ddd/business/infrastructure")
    });

    assert(
      await directoryDependsOn(
        "./test/ddd/reporting/scripts",
        "https://deno.land/std@0.2*/*",
        "npm:postgre"
      ),
    );
  });


  it("test/ddd/another is limited", async () => {
    
  });
});
