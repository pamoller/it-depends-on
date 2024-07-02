import { directoryDependsOn as directoryDependsOnLayer } from "./layer.ts";
import { directoryDependsOn as directoryDependsOnSoftware } from "./software.ts";

export async function directoryDependsOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  const local = dependencies.filter((dependency) => isRelativePath(dependency));
  await directoryDependsOnLayer(dir, ...local);
  const thrdParty = dependencies.filter((dependency) => !isRelativePath(dependency));
  await directoryDependsOnSoftware(dir, ...thrdParty);
  return true;
}

const isRelativePath = (path: string):boolean => path.startsWith("./") || path.startsWith("../");