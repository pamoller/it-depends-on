import os from "https://deno.land/x/dos@v0.11.0/mod.ts";

export function dirname(path: string): string {
    switch (os.platform()) {
        case "windows":
            return path.substring(0, path.lastIndexOf("\\"));
        default:
            return path.substring(0, path.lastIndexOf("/"));
    }
}

export function translate(path: string): string {
    switch (os.platform()) {
        case "windows":
            return path2windows(path);
        default:
            return path;
    }
}

export function path2windows(path: string): string {
    return path.replace(/\//g, "\\");
}

export function join(path: string[]) {
    switch (os.platform()) {
        case "windows":
            return path.join("\\");
        default:
            return path.join("/");
    }
}

export function xpath(...path: string[]): string {
    try {
      return Deno.realPathSync(join(path));
    } catch(e) {
      throw new Error(`imported resource "${translate(path.join("/"))}" does not exist`);
    }
  }

  export function pathSeparator(): string {
    switch (os.platform()) {
        case "windows":
            return "\\";
        default:
            return "/";
    }
  }