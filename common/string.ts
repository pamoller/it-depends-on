export function match(string: string, regexp: string): string[] {
    console.log("match", string, regexp)
    const result = new RegExp(regexp).exec(string) ?? [];
    result.shift();
    return result;
}
