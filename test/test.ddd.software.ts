import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";
import * as software from "../rules/software.ts";

describe("test the ddd layers complain software dependencies", () => {
  it("allow packages in infrastructure only", async () => {
    assert(await software.directoryDoesNotDependOn("./test/ddd/*/{application,domain}"));
  });

  it("limit the use of packages in infrastructure layers", async () => {
    assert(
      await software.directoryDependsOn(
        "./test/ddd/{common,business,collaboration}/infrastructure",
        "https://deno.land/std@0.2*/*",
        "npm:kafka^2*",
        "npm:mongodb^5*"
      ),
    );
    assert(
      await software.directoryDependsOn(
        "./test/ddd/reporting/scripts",
        "https://deno.land/std@0.2*/*",
        "npm:postgres"
      ),
    );    
  });
  
  it("infrastructure is implemented by packages", async () => {
    await assertThrowsAsync(async () => {
      await software.directoryDoesNotDependOn("./test/ddd/business/infrastructure")
    });
  });

});
