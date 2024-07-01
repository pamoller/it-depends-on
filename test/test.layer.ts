import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { directoryDependsOn } from "../rules/local.ts";

describe("layer policy", async () => {
  it("domains are self containing", async () => {
    assert(
      await directoryDependsOn("./test/ddd/*", "./test/ddd/common")
    );
  });
  it("models are self containing", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/*/domain/model",
        "./test/ddd/common/domain/model",
      )
    );
  });
  it("application layers depends on almost everything", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/*/application",
        "./test/ddd/*/domain/model",
        "./test/ddd/*/infrastructure",
        "./test/ddd/common",
      )
    );
  });
  it("infrastructure depends on the model", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/*/infrastructure",
        "./test/ddd/*/domain/model",
        "./test/ddd/common/domain/model",
        "./test/ddd/common/infrastructure",
      )
    );
  });
});