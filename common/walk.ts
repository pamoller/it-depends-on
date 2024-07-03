import { walk, expandGlob } from "jsr:@std/fs@^0.229.3";
import { replace, matchOnPath} from "./glob.ts";
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
            replace(string, matchOnPath(globEntry.path, glob))
        );
        await callback(globEntry.path, expanded);
    }
    if (count < 1)
        throw new DependencyError(`globbed dir "${glob}" does not exist`);
}
