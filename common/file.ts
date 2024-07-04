import os from "https://deno.land/x/dos@v0.11.0/mod.ts";

export function dirname(path: string): string {
    switch (os.platform()) {
        case "windows":
            return path.substring(0, path.lastIndexOf("\\"));
        default:
            return path.substring(0, path.lastIndexOf("/"));
    }
}

export function join(path: string[]) {
    switch (os.platform()) {
        case "windows":
            return path.join("\\");
        default:
            return path.join("/");
    }
}