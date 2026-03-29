import { access, readdir, mkdir } from 'fs/promises';
import path from 'path';

export const GOBBI_DIR = '.gobbi';

export const SUBDIRS = {
  core: '.gobbi/core',
  coreSkills: '.gobbi/core/skills',
  coreAgents: '.gobbi/core/agents',
  coreHooks: '.gobbi/core/hooks',
  market: '.gobbi/market',
  user: '.gobbi/user',
  userSkills: '.gobbi/user/skills',
  userAgents: '.gobbi/user/agents',
  userHooks: '.gobbi/user/hooks',
  assembled: '.gobbi/assembled',
  assembledClaudeMd: '.gobbi/assembled/claude-md',
  assembledSettings: '.gobbi/assembled/settings',
} as const;

/** Create .gobbi/ and all subdirectories. */
export async function createGobbiDir(targetDir: string): Promise<void> {
  const dirs = Object.values(SUBDIRS);
  for (const subdir of dirs) {
    await mkdir(path.join(targetDir, subdir), { recursive: true });
  }
}

/** Check if .gobbi/ directory exists. */
export async function gobbiDirExists(targetDir: string): Promise<boolean> {
  try {
    await access(path.join(targetDir, GOBBI_DIR));
    return true;
  } catch {
    return false;
  }
}

/** Return absolute path for a .gobbi/ subpath. */
export function resolveGobbiPath(targetDir: string, subpath: keyof typeof SUBDIRS): string {
  return path.join(targetDir, SUBDIRS[subpath]);
}

/** Return directory names in .gobbi/market/. Empty array if missing. */
export async function listMarketPackages(targetDir: string): Promise<string[]> {
  try {
    const marketDir = path.join(targetDir, SUBDIRS.market);
    const entries = await readdir(marketDir, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}
