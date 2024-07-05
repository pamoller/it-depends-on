import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { match, matchOnPath, replace } from "../common/glob.ts";
import { translate } from "../common/file.ts";
describe("path are translated", () => {
  ["posix", "windows"].forEach((platform) => {
    Deno.env.set("PLATFORM", platform);
    it(`translates generic paths for platorm ${platform}`, () => {
      [
        ["foo", translate("/test"), "foo", translate("foo")],
        ["foo", translate("/test/bar"), "test/*", translate("foo")],
        ["foo/*", translate("/test/bar"), "test", translate("foo/*")],
        ["foo/*", translate("/test/bar"), "test/*", translate("foo/bar")],
        ["foo/*", translate("/test/bar"), "./test/*", translate("foo/bar")],
        ["foo/*", translate("/test/bar"), "/test/*", translate("foo/bar")],
        ['foo/*/*', translate("/test/bar"), "/test/*", translate("foo/bar/*")],
        [
          "foo/*",
          translate("/test/bar/baz"),
          "test/bar/*",
          translate("foo/baz"),
        ],
        [
          "foo/*",
          translate("/test/bar/baz"),
          "test/*/baz",
          translate("foo/bar"),
        ],
        ["foo/*", translate("/test/bar/baz"), "test/*/*", translate("foo/bar")],
        [
          "foo/*/*",
          translate("/test/bar/baz"),
          "test/*/*",
          translate("foo/bar/baz"),
        ],
        [
          "foo/*/*",
          translate("/root/abc/test/bar/baz"),
          "test/*/*",
          translate("foo/bar/baz"),
        ],
        [
          "foo/*/*/*",
          translate("/root/abc/test/bar/baz"),
          "test/*/*",
          translate("foo/bar/baz/*"),
        ],
      ].forEach((x: string[]) => {
        assertEquals(
          replace(translate(x[0]), matchOnPath(x[1], translate(x[2]))),
          x[3],
        );
      });
      Deno.env.delete("PLATFORM");
    });
  });

  it("function match translates well", () => {
    [
      ["foo", "test", "test", "foo"],
      ["foo", "test/bar", "test/*", "foo"],
      ["foo-*", "test/bar", "test/*", "foo-bar"],
      ["foo-*-*", "test/bar", "test/*", "foo-bar-*"],
      ["foo-*", "test/bar/baz", "test/bar/*", "foo-baz"],
      ["foo-*", "test/bar/baz", "test/*/baz", "foo-bar"],
      ["foo-*", "test/bar/baz", "test/*/*", "foo-bar"],
      ["foo-*-*", "test/bar/baz", "test/*/*", "foo-bar-baz"],
      ["foo-*-*-*", "test/bar/baz", "test/*/*", "foo-bar-baz-*"],
    ].forEach((x: string[]) => {
      assertEquals(replace(x[0], match(x[1], x[2])), x[3]);
    });
  });
});
