export function match(string: string, regexp: string): string[] {
    const result = new RegExp(regexp).exec(string) ?? [];
    result.shift();
    return result;
}
