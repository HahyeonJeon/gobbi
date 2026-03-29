import { readdir, cp, rm, unlink, access } from 'fs/promises';
import path from 'path';
import { isInstalled } from './detect.js';
import { createGobbiDir, gobbiDirExists } from './gobbi-dir.js';
import { CORE_SCRIPTS, NOTIFICATION_SCRIPTS } from './hooks.js';

/** Result of a v0.1.0 to v0.2.0 migration. */
export interface MigrationResult {
  /** Whether the migration was performed. */
  migrated: boolean;
  /** Number of skill directories moved. */
  skillsMoved: number;
  /** Number of agent files moved. */
  agentsMoved: number;
  /** Number of hook scripts moved. */
  hooksMoved: number;
  /** Whether GOBBI.md was moved. */
  gobbiMdMoved: boolean;
}

/**
 * Check if a path exists on the filesystem.
 * @param filePath - Absolute path to check.
 * @returns true if the path exists.
 */
async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read directory entries, returning an empty array if the directory does not exist.
 * @param dirPath - Absolute path to the directory.
 * @returns Array of directory entries, or empty array if the directory is missing.
 */
async function safeReaddir(dirPath: string): Promise<import('fs').Dirent[]> {
  try {
    return await readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

/**
 * Detect if a project has a v0.1.0 installation that can be migrated.
 * A project qualifies when gobbi v0.1.0 is installed (`.claude/skills/gobbi/SKILL.md` exists)
 * and `.gobbi/` does NOT yet exist.
 * @param targetDir - The project root directory to check.
 * @returns true if the project has a v0.1.0 installation without a `.gobbi/` directory.
 */
export async function detectV1(targetDir: string): Promise<boolean> {
  const installed = await isInstalled(targetDir);
  if (!installed) {
    return false;
  }
  const hasGobbiDir = await gobbiDirExists(targetDir);
  return !hasGobbiDir;
}

/**
 * Migrate a v0.1.0 installation to the v0.2.0 `.gobbi/` directory structure.
 *
 * Moves gobbi-managed files from `.claude/` into `.gobbi/core/` (and `.gobbi/user/`
 * for gobbi-hack). Files not owned by gobbi (CLAUDE.md, settings.json, .env, etc.)
 * are left untouched.
 *
 * @param targetDir - The project root directory to migrate.
 * @returns A summary of what was moved during migration.
 */
export async function migrateV1(targetDir: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    migrated: false,
    skillsMoved: 0,
    agentsMoved: 0,
    hooksMoved: 0,
    gobbiMdMoved: false,
  };

  // 1. Create .gobbi/ structure
  await createGobbiDir(targetDir);

  // 2. Move gobbi-prefixed skill directories
  const skillsSrcDir = path.join(targetDir, '.claude', 'skills');
  const skillEntries = await safeReaddir(skillsSrcDir);

  for (const entry of skillEntries) {
    if (entry.isDirectory() && entry.name.startsWith('gobbi')) {
      const src = path.join(skillsSrcDir, entry.name);

      // gobbi-hack is user customization, goes to .gobbi/user/skills/
      const destBase = entry.name === 'gobbi-hack'
        ? path.join(targetDir, '.gobbi', 'user', 'skills', entry.name)
        : path.join(targetDir, '.gobbi', 'core', 'skills', entry.name);

      await cp(src, destBase, { recursive: true });
      await rm(src, { recursive: true });
      result.skillsMoved++;
    }
  }

  // 3. Move gobbi-prefixed agent files
  const agentsSrcDir = path.join(targetDir, '.claude', 'agents');
  const agentEntries = await safeReaddir(agentsSrcDir);

  for (const entry of agentEntries) {
    if (entry.isFile() && entry.name.startsWith('gobbi-')) {
      const src = path.join(agentsSrcDir, entry.name);
      const dest = path.join(targetDir, '.gobbi', 'core', 'agents', entry.name);
      await cp(src, dest);
      await unlink(src);
      result.agentsMoved++;
    }
  }

  // 4. Move known hook scripts
  const hooksSrcDir = path.join(targetDir, '.claude', 'hooks');

  for (const script of [...CORE_SCRIPTS, ...NOTIFICATION_SCRIPTS]) {
    const src = path.join(hooksSrcDir, script);
    if (await exists(src)) {
      const dest = path.join(targetDir, '.gobbi', 'core', 'hooks', script);
      await cp(src, dest);
      await unlink(src);
      result.hooksMoved++;
    }
  }

  // 5. Move GOBBI.md
  const gobbiMdSrc = path.join(targetDir, '.claude', 'GOBBI.md');
  if (await exists(gobbiMdSrc)) {
    const gobbiMdDest = path.join(targetDir, '.gobbi', 'core', 'GOBBI.md');
    await cp(gobbiMdSrc, gobbiMdDest);
    await unlink(gobbiMdSrc);
    result.gobbiMdMoved = true;
  }

  result.migrated = true;
  return result;
}
