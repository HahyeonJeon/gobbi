import { access } from 'fs/promises';
import path from 'path';

/**
 * Check if gobbi is already installed in the target directory.
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
