import { walk} from "https://deno.land/std@0.170.0/fs/walk.ts";
import { expandGlob } from "https://deno.land/std@0.224.0/fs/expand_glob.ts";
import { replace, match} from "./glob.ts";
import { DependencyError }from "./error.ts";

export async function onDir(
    dir: string,
    callback: (path: string) => void,
): Promise<void> {
    for await (const entry of walk(dir)) {
        if (entry.isFile && entry.path.endsWith(".ts")) {
            await callback(entry.path);
        }
    }
}

export async function onGlob(
    glob: string,
    callback: (path: string) => void
): Promise<void> {
    let count = 0;
    for await (const globEntry of expandGlob(glob)) {
        if (!globEntry.isDirectory) {
            continue;
        }
        count++;
        await callback(globEntry.path);
    }
    if (count < 1)
        throw new DependencyError(`globbed dir "${glob}" does not exist`);
}


export async function onExpansion(
    glob: string,
    callback: (path: string, dependencies: string[]) => void,
    dependencies: string[],
): Promise<void> {
    let count = 0;
    for await (const globEntry of expandGlob(glob)) {
        if (!globEntry.isDirectory) {
            continue;
        }
        count++;
        const expanded = dependencies.map((string: string): string =>
            replace(string, match(globEntry.path, glob))
        );
        await callback(globEntry.path, expanded);
    }
    if (count < 1)
        throw new DependencyError(`globbed dir "${glob}" does not exist`);
}