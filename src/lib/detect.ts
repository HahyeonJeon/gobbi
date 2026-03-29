import { access } from 'fs/promises';
import path from 'path';

/**
 * Check if a path exists on the filesystem.
 * @param filePath - Absolute path to check.
 * @returns true if the path exists.
 */
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if gobbi v0.1.0 is installed (legacy marker: `.claude/skills/gobbi/SKILL.md`
 * exists AND no `.claude/gobbi.json`).
 * @param targetDir - The project root directory to check.
 * @returns true if v0.1.0 marker exists without current installation.
 */
export async function isInstalled(targetDir: string): Promise<boolean> {
  const markerPath = path.join(targetDir, '.claude', 'skills', 'gobbi', 'SKILL.md');
  return pathExists(markerPath);
}

/**
 * Check if legacy v0.2.0 is installed by looking for `.gobbi/gobbi.json`.
 * @param targetDir - The project root directory to check.
 * @returns true if `.gobbi/gobbi.json` exists.
 */
export async function isV2Installed(targetDir: string): Promise<boolean> {
  const markerPath = path.join(targetDir, '.gobbi', 'gobbi.json');
  return pathExists(markerPath);
}

/**
 * Check if the current architecture is installed by looking for `.claude/gobbi.json`.
 * @param targetDir - The project root directory to check.
 * @returns true if `.claude/gobbi.json` exists.
 */
export async function isCurrentInstalled(targetDir: string): Promise<boolean> {
  const markerPath = path.join(targetDir, '.claude', 'gobbi.json');
  return pathExists(markerPath);
}

/**
 * Determine which version of gobbi is installed.
 *
 * Detection order:
 * - `current`: `.claude/gobbi.json` exists
 * - `v2` (legacy): `.gobbi/gobbi.json` exists
 * - `v1`: `.claude/skills/gobbi/SKILL.md` exists AND no `.claude/gobbi.json`
 * - `none`: nothing detected
 *
 * @param targetDir - The project root directory to check.
 * @returns Version identifier.
 */
export async function getInstalledVersion(targetDir: string): Promise<'none' | 'v1' | 'v2' | 'current'> {
  if (await isCurrentInstalled(targetDir)) {
    return 'current';
  }
  if (await isV2Installed(targetDir)) {
    return 'v2';
  }
  if (await isInstalled(targetDir)) {
    return 'v1';
  }
  return 'none';
}
