import { assertThrows } from "https://deno.land/std@0.55.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { replace, match, matchOnPath } from "../common/glob.ts";

describe("test glob functionality", () => {
  it("replace globs on a path", () => {
    [
      ["foo", "test", "foo", "foo"],
      ["foo", "test/bar", "test/*", "foo"],
      ["foo/*", "test/bar", "test/*", "foo/bar"],
      ["foo/*", "test/bar/baz", "test/bar/*", "foo/baz"],
      ["foo/*", "test/bar/baz", "test/*/*", "foo/bar"],
      ["foo/*/*", "test/bar/baz", "test/*/*", "foo/bar/baz"],
    ].forEach((x: string[]) => {
      console.log(x[0], x[1], x[2], x[3])
      assertEquals(replace(x[0], matchOnPath(x[1], x[2])), x[3]);
    });
    assertThrows(
      () => replace("foo/*/*", matchOnPath("test/bar/baz", "test/bar/*")),
      Error,
    );
  });

  it("replace globs on a string", () => {
    [
      //["foo", "test", "test", "foo"],
      //["foo", "test/bar", "test/*", "foo"],
      //["foo/*", "test/bar", "test/*", "foo/bar"],
      //["foo/*", "test/bar/baz", "test/bar/*", "foo/baz"],
      //["foo/*", "test/bar/baz", "test/*/*", "foo/bar"],
      //["foo/*/*", "/abcdef/test/bar/baz", "test/*/*", "foo/bar/baz"],
    ].forEach((x: string[]) => {
      assertEquals(replace(x[0], match(x[1], x[2])), x[3]);
    });
    //assertThrows(
    //  () => replace("foo/*/*", match("test/bar/baz", "test/bar/*")),
    //  Error,
    //);
  });
});