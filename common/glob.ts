import { escape } from "https://deno.land/std@0.224.0/regexp/escape.ts";

export function match(string: string, pattern: string, path= true): string[] {
    // todo distinguis between path and string
    const regexp = (escape(pattern.replace("./", ""))).replace(/(\\\*)/g, path?"([^\/]*)":"(.*?)");
    const result = new RegExp(regexp).exec(string) ?? [];
    result.shift();
    console.log(66, result, regexp, string, pattern);
    return result;
}

export function replace(string: string, globs: string[]): string {
    const cnt = countGlobs(string);
    let result = string;
    console.log(88, string, globs, result);
    if (!cnt || globs.length === 0)
        return result;
    console.log(88, string, globs, result);
    if (globs.length < cnt)
        throw new Error(`${string} contains too many globs *`);
    console.log(88, string, globs, result);
    while (globs.length > 0 && result.includes("*")) {
        result = result.replace(/\*/, globs.shift() as string);
    }
    console.log(string, globs, result);
    return result;
}

function countGlobs(str: string) {
    return str.split("*").length - 1;
}

export function globs(string: string, pattern: string, path=true): boolean {
    return "input" in match(string, pattern, path);
}