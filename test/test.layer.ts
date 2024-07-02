import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { directoryDependsOn } from "../rules/layer.ts";

describe("test the layer policy within ddd domains", async () => {
  it("domains are closed", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/*",
        "./test/ddd/common"
      )
    );
  });
  
  it("models are closed", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/*/domain/model",
        "./test/ddd/common/domain/model",
      )
    );
  });
  
  it("application layers are allowed to access almost everything in their domain", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/*/application",
        "./test/ddd/*/domain/model",
        "./test/ddd/*/infrastructure",
        "./test/ddd/common",
      )
    );
  });
  
  it("infrastructure layers are allowed to access its model", async () => {
    assert(
      await directoryDependsOn(
        "./test/ddd/*/infrastructure",
        "./test/ddd/*/config.ts",
        "./test/ddd/*/domain/model",
        "./test/ddd/common/domain/model",
        "./test/ddd/common/infrastructure",
      )
    );
  });
});