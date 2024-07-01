import { walk } from "https://deno.land/std@0.170.0/fs/walk.ts";
import { expandGlob } from "https://deno.land/std@0.224.0/fs/expand_glob.ts";

export function dirname(path: string): string {
    return path.substring(0, path.lastIndexOf("/"));
}

export async function globDirectory(dir: string, callback: (path: string) => void): Promise<void> {
    for await (const globEntry of expandGlob(dir)) {
        if (!globEntry.isDirectory) 
            continue
        callback(globEntry.path);
    }
}

export async function walkDirectory(dir: string, callback: (path: string) => void): Promise<void> {
    for await (const entry of walk(dir)) {
        if (entry.isFile && entry.path.endsWith(".ts")) {
            await callback(entry.path);
        }
    }
}
