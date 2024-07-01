import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { directoryDependsOn } from "../rules/local.ts";

describe("test an ddd architecture", () => {
  it("test/ddd/common is self containing template domain", async () => {
    assert(await directoryDependsOn("./test/ddd/common/"), "is not self containing");
    assert(
      await directoryDependsOn(
        "./test/ddd/common/application",
        "./test/ddd/common/domain",
        "./test/ddd/common/infrastructure",
      ),
    );
    assert(await directoryDependsOn("./test/ddd/common/domain/model"));
    assert(
      await directoryDependsOn(
        "./test/ddd/common/infrastructure",
        "./test/ddd/common/domain",
      ),
    );
  });

  it("test/ddd/buisiness is a derived, self containing domain", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/business",
        "./test/ddd/common",
      ),
    );
    assert(
      await directoryDependsOn(
        "./test/ddd/business/domain/model",
        "./test/ddd/common/domain/model",
      ),
    );
    assert(
      await directoryDependsOn(
        "./test/ddd/business/application",
        "./test/ddd/business/infrastructure",
        "./test/ddd/business/domain/model",
        "./test/ddd/common",
      ),
    );
    assert(
      await directoryDependsOn(
        "./test/ddd/business/infrastructure",
        "./test/ddd/business/domain",
        "./test/ddd/business.config.ts",
        "./test/ddd/common",
      ),
    );
  });
});
