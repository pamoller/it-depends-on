import { directoryDependsOn as directoryDependsOnLocal } from "./local.ts";
import { directoryDependsOn as directoryDependsOn3dParty } from "./3d-party.ts";

export async function directoryDependsOn(dir: string, ...dependencies: string[]): Promise<boolean> {
  const local = dependencies.filter((dependency) => isRelativePath(dependency));
  await directoryDependsOnLocal(dir, ...local);
  const thrdParty = dependencies.filter((dependency) => !isRelativePath(dependency));
  await directoryDependsOn3dParty(dir, ...thrdParty);
  return true;
}

const isRelativePath = (path: string):boolean => path.startsWith("./") || path.startsWith("../");