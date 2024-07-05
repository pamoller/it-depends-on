import { parseImports } from "npm:parse-imports@^2.1.0";

function platform(): string {
    return Deno.env.get('PLATFORM') ?? Deno.build.os;
}

export function dirname(path: string): string {
    switch (platform()) {
        case "windows":
            return path.substring(0, path.lastIndexOf("\\"));
        default:
            return path.substring(0, path.lastIndexOf("/"));
    }
}

export function translate(path: string): string {
    switch (platform()) {
        case "windows":
            return path.replace(/\//g, "\\");
        default:
            return path;
    }
}

export function join(path: string[]) {
    switch (platform()) {
        case "windows":
            return path.join("\\");
        default:
            return path.join("/");
    }
}

export function xpath(...path: string[]): string {
    try {
        return Deno.realPathSync(join(path));
    } catch (e) {
        throw new Error(
            `imported resource "${translate(path.join("/"))}" does not exist`,
        );
    }
}

export function pathSeparator(): string {
    switch (platform()) {
        case "windows":
            return "\\";
        default:
            return "/";
    }
}

export async function* specifiers(path: string, relative=true) {
    const code = Deno.readTextFileSync(path);
    specifier:
    for (const $import of await parseImports(code)) {
        const type = $import.moduleSpecifier.type;
        const specifier = $import.moduleSpecifier.value ?? "";
        if (relative &&  type !== "relative" || !relative && type === "relative") {
            continue specifier;
        }
        yield specifier;
    }
}
