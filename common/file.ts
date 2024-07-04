import os from "https://deno.land/x/dos@v0.11.0/mod.ts";

export function dirname(path: string): string {
    return path.substring(0, path.lastIndexOf("/"));
}

export function normalize(path: string): string {
    switch (os.platform()) {
        case "windows":
            return translate(path);
        default:
            return path;
    }
}

export function translate(path: string): string {
    let unixPath = path.replace(/\\/g, "/");
    if (!unixPath.startsWith("file:///")) {
        unixPath = "file:///" + unixPath;
    }
    return unixPath;
}
