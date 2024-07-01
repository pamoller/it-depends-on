import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.196.0/assert/mod.ts";
import DependencyError from "../common/error.ts";
import { mapDependency } from "../common/file.ts";
import { assertThrows } from "https://deno.land/std@0.55.0/testing/asserts.ts";

describe("test a ddd architecture", () => {
  it("maps", async () => {
    assertEquals(mapDependency("test", "test", "foo"), "foo");
    assertEquals(mapDependency("test/bar", "test/*", "foo"), "foo");
    assertEquals(mapDependency("test/bar", "test/*", "foo/*"), "foo/bar");
    assertEquals(
      mapDependency("test/bar/baz", "test/bar/*", "foo/*"),
      "foo/baz",
    );
    assertEquals(mapDependency("test/bar/baz", "test/*/*", "foo/*"), "foo/bar");
    assertEquals(
      mapDependency("test/bar/baz", "test/*/*", "foo/*/*"),
      "foo/bar/baz",
    );
    assertThrows(
      () => mapDependency("test/bar/baz", "test/bar/*", "foo/*/*"),
      DependencyError,
    );
  });

});
