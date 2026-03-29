import { access } from 'fs/promises';
import path from 'path';

/**
 * Check if gobbi is already installed in the target directory.
 * Detects v0.1.0 installations by looking for the skill marker in `.claude/skills/gobbi/`.
 * @param targetDir - The project root directory to check.
 * @returns true if gobbi skill marker exists.
 */
export async function isInstalled(targetDir: string): Promise<boolean> {
  const markerPath = path.join(targetDir, '.claude', 'skills', 'gobbi', 'SKILL.md');
  try {
    await access(markerPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if gobbi v0.2.0 is installed by looking for `.gobbi/gobbi.json`.
 * @param targetDir - The project root directory to check.
 * @returns true if `.gobbi/gobbi.json` exists.
 */
export async function isV2Installed(targetDir: string): Promise<boolean> {
  const markerPath = path.join(targetDir, '.gobbi', 'gobbi.json');
  try {
    await access(markerPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Determine which version of gobbi is installed.
 * Checks for v0.2.0 first (`.gobbi/gobbi.json`), then falls back to v0.1.0
 * detection (`.claude/skills/gobbi/SKILL.md`).
 * @param targetDir - The project root directory to check.
 * @returns `'v2'` if v0.2.0 is installed, `'v1'` if v0.1.0 is installed, `'none'` otherwise.
 */
export async function getInstalledVersion(targetDir: string): Promise<'none' | 'v1' | 'v2'> {
  if (await isV2Installed(targetDir)) {
    return 'v2';
  }
  if (await isInstalled(targetDir)) {
    return 'v1';
  }
  return 'none';
}
