import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";
import * as layer from "../rules/layer.ts";

describe("test the layer policy within ddd domains", async () => {
  it("domains are closed", async () => {
    assert(
      await layer.directoryDependsOn(
        "./test/ddd/*",
        "./test/ddd/common",
      ),
      "domain is not self containing",
    );
  });

  it("models are closed", async () => {
    assert(
      await layer.directoryDependsOn(
        "./test/ddd/*/domain/model",
        "./test/ddd/common/domain/model",
      ),
      "model is not self enclosing",
    );
  });

  it("application layers are allowed to access almost everything in their domain", async () => {
    assert(
      await layer.directoryDependsOn(
        "./test/ddd/*/application",
        "./test/ddd/*/domain/model",
        "./test/ddd/*/infrastructure",
        "./test/ddd/common",
      ),
      "accesses forbidden layer",
    );
  });

  it("infrastructure layers are allowed to access its model", async () => {
    assert(
      await layer.directoryDependsOn(
        "./test/ddd/*/infrastructure",
        "./test/ddd/*/config.ts",
        "./test/ddd/*/domain/model",
        "./test/ddd/common/domain/model",
        "./test/ddd/common/infrastructure",
      ),
    );
  });

  it("negative assumption", async () => {
    assert(
      await layer.directoryDoesNotDependOn(
        "./test/ddd/business",
        "./test/ddd/collaboration",
      ),
      "business depends derived domain collaboration",
    );
  });

  it("raise an error", async () => {
    await assertThrowsAsync(async () => {
      await layer.directoryDependsOn(
        "./test/ddd/*",
      ), "every domain may depend on common";
    });
  });
});
