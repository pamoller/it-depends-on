export function match(string: string, pattern: string): string[] {
    const regexp = pattern.replace(/\*/g, "([^\/]+)");
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
