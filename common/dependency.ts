import os from "https://deno.land/x/dos@v0.11.0/mod.ts";

export function translate(path: string): string {
    switch (os.platform()) {
        case "windows":
            return path.replace(/\//g, "\\");
        default:
            return path;
    }
}