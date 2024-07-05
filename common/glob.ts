/**
 * glob.ts
 * 
 * This module provides functions for matching and replacing globs in strings.
 */
import { escape } from "jsr:@std/regexp@^0.224.1";
import * as string from "./string.ts";
import * as file from "./file.ts";

// did the pattern match the string?
export function globs(string: string, pattern: string): boolean {
    return "input" in match(string, pattern);
}

// match pattern in string
export function match(text: string, pattern: string): string[] {
    return string.match(text, escape(pattern).replace(/(\\\*)/g, "(.*?)") + "$");
}

// match pattern at the end of an expanded, absolute path
export function matchOnPath(path: string, pattern: string): string[] {
    pattern = pattern.replace(/^\.+/, "");
    console.log(999, "'"+path+"'", pattern, escape(pattern).replace(/(\\\*)/g, `([^\\${file.pathSeparator()}/]*)`));
    return string.match(path, escape(pattern).replace(/(\\\*)/g, `([^\\${file.pathSeparator()}/]*)`) + "$");
}

// replace globs in string
export function replace(string: string, globs: string[]): string {
    console.log(string, globs);
    const cnt = count(string);
    let result = string;
    if (!cnt || globs.length === 0) {
        return result;
    }
    while (globs.length > 0 && result.includes("*")) {
        result = result.replace(/\*/, globs.shift() as string);
    }
    return result;
}

function count(str: string) {
    return str.split("*").length - 1;
}

