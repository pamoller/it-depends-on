import { walk } from "https://deno.land/std@0.170.0/fs/walk.ts";
import { expandGlob } from "https://deno.land/std@0.224.0/fs/expand_glob.ts";
import DependencyError from "./error.ts";

export function dirname(path: string): string {
    return path.substring(0, path.lastIndexOf("/"));
}

export async function globDirectory(
    dir: string,
    callback: (path: string, dependencies: string[]) => void,
    dependencies: string[],
): Promise<void> {
    let count = 0;
    for await (const globEntry of expandGlob(dir)) {
        if (!globEntry.isDirectory) {
            continue;
        }
        count++;
        const xdependencies = dependencies.map((dependency: string): string =>
            mapDependency(globEntry.path, dir, dependency)
        );
        await callback(globEntry.path, xdependencies);
    }
    if (count < 1)
        throw new DependencyError(`globbed directory "${dir}" does not exist`);
}

export function mapDependency(
    globbedPath: string,
    globPattern: string,
    dependency: string,
): string {
    if (countChars(globPattern, "*") < countChars(dependency, "*")) {
        throw new DependencyError(
            `glob pattern "${globPattern}" is not a valid dependency pattern`,
        );
    }
    globPattern = globPattern.replace(/\*/g, "([^\/]+)");
    const matches = (new RegExp(globPattern)).exec(globbedPath);
    if (!matches) return dependency;
    matches.shift();
    while (matches.length > 0 && dependency.includes("*")) {
        dependency = dependency.replace(/\*/, matches.shift() as string);
    }
    return dependency;
}

function countChars(str: string, char: string) {
    return str.split(char).length - 1;
}

export async function walkDirectory(
    dir: string,
    callback: (path: string) => void,
): Promise<void> {
    for await (const entry of walk(dir)) {
        if (entry.isFile && entry.path.endsWith(".ts")) {
            await callback(entry.path);
        }
    }
}
