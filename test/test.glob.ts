import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.196.0/assert/mod.ts";
import { replace, match, matchOnPath } from "../common/glob.ts";
import { translate } from "../common/file.ts";
describe("path are translated", () => {
  it("translates posix paths", () => {
    [
      ['foo', '/test', 'foo', 'foo'],
      ['foo', '/test/bar', 'test/*', 'foo'],
      ['foo/*', '/test/bar', 'test', 'foo/*'],
      ['foo/*', '/test/bar', 'test/*', 'foo/bar'],
      ['foo/*', '/test/bar', './test/*', 'foo/bar'],
      ['foo/*', '/test/bar', '/test/*', 'foo/bar'],
      ['foo/*/*', '/test/bar', '/test/*', 'foo/bar/*'],
      ['foo/*', '/test/bar/baz', 'test/bar/*', 'foo/baz'],
      ['foo/*', '/test/bar/baz', 'test/*/baz', 'foo/bar'],
      ['foo/*', '/test/bar/baz', 'test/*/*', 'foo/bar'],
      ['foo/*/*', '/test/bar/baz', 'test/*/*', 'foo/bar/baz'],
      ['foo/*/*', '/root/abc/test/bar/baz', 'test/*/*', 'foo/bar/baz'],
      ['foo/*/*/*', '/root/abc/test/bar/baz', 'test/*/*', 'foo/bar/baz/*'],
    ].forEach((x: string[]) => {
      assertEquals(replace(translate(x[0]), matchOnPath(x[1], translate(x[2]))), x[3]);
    });
  });

  it("translates windows paths", () => {
    Deno.env.set("PLATFORM", "windows");
    [
      ["foo", "\\test", "foo", "foo"],
      ["foo", "\\test\\bar", "test/*", "foo"],
      ["foo/*", "\\test\\bar", "test", "foo\\*"],
      ["foo/*", "\\test\\bar", "test/*", "foo\\bar"],
      ["foo/*", "\\test\\bar", "./test/*", "foo\\bar"],
      ["foo/*", "\\test\\bar", "/test/*", "foo\\bar"],
      ["foo/*/*", "\\test\\bar", "/test/*", "foo\\bar\\*"],
      ["foo/*", "\\test\\bar\\baz", "test/bar/*", "foo\\baz"],
      ["foo/*", "\\test\\bar\\baz", "test/*/baz", "foo\\bar"],
      ["foo/*", "\\test\\bar\\baz", "test/*/*", "foo\\bar"],
      ["foo/*/*", "\\test\\bar\\baz", "test/*/*", "foo\\bar\\baz"],
      ["foo/*/*", "C:\\abc\\test\\bar\\baz", "test/*/*", "foo\\bar\\baz"],
      ["foo/*/*/*", "D:\\abc\\test\\bar\\baz", "test/*/*", "foo\\bar\\baz\\*"],
    ].forEach((x: string[]) => {
      assertEquals(replace(translate(x[0]), matchOnPath(x[1], translate(x[2]))), x[3]);
    });
    Deno.env.delete("PLATFORM");
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