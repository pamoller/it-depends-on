import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.196.0/assert/mod.ts";
import { expandDependency } from "../common/file.ts";
import { assertThrows } from "https://deno.land/std@0.55.0/testing/asserts.ts";

describe("test common functionality", () => {
  it("expand dependency", async () => {
    assertEquals(expandDependency("test", "test", "foo"), "foo");
    assertEquals(expandDependency("test/bar", "test/*", "foo"), "foo");
    assertEquals(expandDependency("test/bar", "test/*", "foo/*"), "foo/bar");
    assertEquals(
      expandDependency("test/bar/baz", "test/bar/*", "foo/*"),
      "foo/baz",
    );
    assertEquals(expandDependency("test/bar/baz", "test/*/*", "foo/*"), "foo/bar");
    assertEquals(
      expandDependency("test/bar/baz", "test/*/*", "foo/*/*"),
      "foo/bar/baz",
    );
    assertThrows(
      () => expandDependency("test/bar/baz", "test/bar/*", "foo/*/*"),
      Error,
    );
  });

});
