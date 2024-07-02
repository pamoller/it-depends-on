import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.196.0/assert/mod.ts";
import { replace, match } from "../common/glob.ts";
import { assertThrows } from "https://deno.land/std@0.55.0/testing/asserts.ts";

describe("test common functionality", () => {
  it("expand dep", async () => {
    assertEquals(replaceFrom("test", "test", "foo"), "foo");
    assertEquals(replaceFrom("test/bar", "test/*", "foo"), "foo");
    assertEquals(replaceFrom("test/bar", "test/*", "foo/*"), "foo/bar");
    assertEquals(
      replaceFrom("test/bar/baz", "test/bar/*", "foo/*"),
      "foo/baz",
    );
    assertEquals(replaceFrom("test/bar/baz", "test/*/*", "foo/*"), "foo/bar");
    assertEquals(
      replaceFrom("test/bar/baz", "test/*/*", "foo/*/*"),
      "foo/bar/baz",
    );
    assertThrows(
      () => replaceFrom("test/bar/baz", "test/bar/*", "foo/*/*"),
      Error,
    );
  });

  function replaceFrom(
    template: string,
    pattern: string,
    string: string,
): string {
    return replace(string, match(template, pattern));
}


});
