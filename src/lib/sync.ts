import { readdir, cp, rm, unlink, mkdir, chmod, access } from 'fs/promises';
import path from 'path';
import { CORE_SCRIPTS, NOTIFICATION_SCRIPTS } from './hooks.js';

/**
 * Check whether a path exists and is accessible.
 * @param targetPath - Absolute path to check.
 * @returns true if the path exists.
 */
async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear gobbi-managed items from target .claude/ before fresh copy.
 * Removes:
 * - Skill directories starting with "gobbi" in skills/
 * - Agent files starting with "gobbi-" in agents/
 * - Known hook scripts in hooks/
 *
 * @param claudeDir - Absolute path to the .claude/ directory.
 */
export async function clearGobbiItems(claudeDir: string): Promise<void> {
  // Clear gobbi skill directories
  const skillsDir = path.join(claudeDir, 'skills');
  if (await pathExists(skillsDir)) {
    const entries = await readdir(skillsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('gobbi')) {
        await rm(path.join(skillsDir, entry.name), { recursive: true });
      }
    }
  }

  // Clear gobbi agent files
  const agentsDir = path.join(claudeDir, 'agents');
  if (await pathExists(agentsDir)) {
    const entries = await readdir(agentsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.startsWith('gobbi-')) {
        await unlink(path.join(agentsDir, entry.name));
      }
    }
  }

  // Clear known hook scripts
  const hooksDir = path.join(claudeDir, 'hooks');
  if (await pathExists(hooksDir)) {
    for (const script of [...CORE_SCRIPTS, ...NOTIFICATION_SCRIPTS]) {
      const scriptPath = path.join(hooksDir, script);
      try {
        await unlink(scriptPath);
      } catch {
        // Script doesn't exist — skip
      }
    }
  }
}

/**
 * Copy gobbi-prefixed skill directories from source to destination.
 * @param srcDir - Source skills directory.
 * @param destDir - Destination skills directory.
 * @returns Number of skill directories copied.
 */
export async function copySkills(srcDir: string, destDir: string): Promise<number> {
  if (!(await pathExists(srcDir))) {
    return 0;
  }

  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('gobbi')) {
      const src = path.join(srcDir, entry.name);
      const dest = path.join(destDir, entry.name);
      await cp(src, dest, { recursive: true });
      count++;
    }
  }

  return count;
}

/**
 * Copy gobbi-prefixed agent files from source to destination.
 * @param srcDir - Source agents directory.
 * @param destDir - Destination agents directory.
 * @returns Number of agent files copied.
 */
export async function copyAgents(srcDir: string, destDir: string): Promise<number> {
  if (!(await pathExists(srcDir))) {
    return 0;
  }

  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (entry.isFile() && entry.name.startsWith('gobbi-')) {
      const src = path.join(srcDir, entry.name);
      const dest = path.join(destDir, entry.name);
      await cp(src, dest);
      count++;
    }
  }

  return count;
}

/**
 * Copy hook script files from source to destination with chmod 755.
 * @param srcDir - Source hooks directory.
 * @param destDir - Destination hooks directory.
 * @returns Number of hook files copied.
 */
export async function copyHooks(srcDir: string, destDir: string): Promise<number> {
  if (!(await pathExists(srcDir))) {
    return 0;
  }

  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (entry.isFile()) {
      const src = path.join(srcDir, entry.name);
      const dest = path.join(destDir, entry.name);
      await cp(src, dest);
      await chmod(dest, 0o755);
      count++;
    }
  }

  return count;
}

/**
 * Copy GOBBI.md from source to destination.
 * @param srcDir - Source directory containing GOBBI.md.
 * @param destDir - Destination directory for GOBBI.md.
 */
export async function copyGobbiMd(srcDir: string, destDir: string): Promise<void> {
  const src = path.join(srcDir, 'GOBBI.md');
  if (!(await pathExists(src))) {
    return;
  }

  await mkdir(destDir, { recursive: true });
  await cp(src, path.join(destDir, 'GOBBI.md'));
}
