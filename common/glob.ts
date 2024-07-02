import { escape } from "https://deno.land/std@0.224.0/regexp/escape.ts";

export function matchOnPath(string: string, pattern: string): string[] {
    const normalized = pattern.replace(".", "");
    const regexp = (escape(normalized)).replace(/(\\\*)/g, "([^\/]*)") + "$";
    const result = new RegExp(regexp).exec(string) ?? [];
    result.shift();
    return result;
}

export function match(string: string, pattern: string): string[] {
    const regexp = (escape(pattern.replace("./", ""))).replace(/(\\\*)/g, "(.*?)");
    const result = new RegExp(regexp).exec(string) ?? [];
    result.shift();
    return result;
}

export function replace(string: string, globs: string[]): string {
    const cnt = countGlobs(string);
    let result = string;
    if (!cnt || globs.length === 0)
        return result;
    if (globs.length < cnt)
        throw new Error(`${string} contains too many globs *`);
    while (globs.length > 0 && result.includes("*")) {
        result = result.replace(/\*/, globs.shift() as string);
    }
    return result;
}

function countGlobs(str: string) {
    return str.split("*").length - 1;
}

export function globs(string: string, pattern: string): boolean {
    return "input" in match(string, pattern);
}