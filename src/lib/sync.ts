import { readdir, cp, rm, unlink, mkdir, chmod, access } from 'fs/promises';
import path from 'path';
import { ensureTriggerLine } from './claude-md.js';
import { CORE_HOOK_ENTRIES, NOTIFICATION_HOOK_ENTRIES, GOBBI_PERMISSIONS, CORE_SCRIPTS, NOTIFICATION_SCRIPTS } from './hooks.js';
import { mergeHookConfig, mergePermissions } from './settings.js';
import { updateSyncTimestamp } from './manifest.js';

/**
 * Result of a sync operation, tracking what was copied and assembled.
 */
export interface SyncResult {
  skillsCopied: number;
  agentsCopied: number;
  hooksCopied: number;
  settingsAssembled: boolean;
  claudeMdUpdated: boolean;
}

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
 * Step 1: Clear gobbi-managed items from .claude/ before copying fresh versions.
 * - Removes gobbi-prefixed skill directories (except gobbi-hack)
 * - Removes gobbi-prefixed agent files
 * - Removes known hook scripts
 */
async function clearGobbiItems(targetDir: string): Promise<void> {
  const claudeDir = path.join(targetDir, '.claude');

  // Clear gobbi skills (except gobbi-hack, which is user-owned)
  const skillsDir = path.join(claudeDir, 'skills');
  if (await pathExists(skillsDir)) {
    const entries = await readdir(skillsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('gobbi') && entry.name !== 'gobbi-hack') {
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
 * Copy all skill directories from a source skills/ directory to .claude/skills/.
 * @returns Number of skill directories copied.
 */
async function copySkillsFrom(srcSkillsDir: string, destSkillsDir: string): Promise<number> {
  if (!(await pathExists(srcSkillsDir))) {
    return 0;
  }

  await mkdir(destSkillsDir, { recursive: true });
  const entries = await readdir(srcSkillsDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const src = path.join(srcSkillsDir, entry.name);
      const dest = path.join(destSkillsDir, entry.name);
      await cp(src, dest, { recursive: true });
      count++;
    }
  }

  return count;
}

/**
 * Copy all agent files from a source agents/ directory to .claude/agents/.
 * @returns Number of agent files copied.
 */
async function copyAgentsFrom(srcAgentsDir: string, destAgentsDir: string): Promise<number> {
  if (!(await pathExists(srcAgentsDir))) {
    return 0;
  }

  await mkdir(destAgentsDir, { recursive: true });
  const entries = await readdir(srcAgentsDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (entry.isFile()) {
      const src = path.join(srcAgentsDir, entry.name);
      const dest = path.join(destAgentsDir, entry.name);
      await cp(src, dest);
      count++;
    }
  }

  return count;
}

/**
 * Copy all hook scripts from a source hooks/ directory to .claude/hooks/,
 * setting executable permissions on each.
 * @returns Number of hook files copied.
 */
async function copyHooksFrom(srcHooksDir: string, destHooksDir: string): Promise<number> {
  if (!(await pathExists(srcHooksDir))) {
    return 0;
  }

  await mkdir(destHooksDir, { recursive: true });
  const entries = await readdir(srcHooksDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (entry.isFile()) {
      const src = path.join(srcHooksDir, entry.name);
      const dest = path.join(destHooksDir, entry.name);
      await cp(src, dest);
      await chmod(dest, 0o755);
      count++;
    }
  }

  return count;
}

/**
 * Step 2: Copy from all .gobbi/ sources (core, market packages, user) to .claude/.
 * @returns Counts of skills, agents, and hooks copied.
 */
async function copyAllSources(targetDir: string): Promise<{ skills: number; agents: number; hooks: number }> {
  const gobbiDir = path.join(targetDir, '.gobbi');
  const claudeDir = path.join(targetDir, '.claude');

  const destSkills = path.join(claudeDir, 'skills');
  const destAgents = path.join(claudeDir, 'agents');
  const destHooks = path.join(claudeDir, 'hooks');

  let skills = 0;
  let agents = 0;
  let hooks = 0;

  // Core sources
  skills += await copySkillsFrom(path.join(gobbiDir, 'core', 'skills'), destSkills);
  agents += await copyAgentsFrom(path.join(gobbiDir, 'core', 'agents'), destAgents);
  hooks += await copyHooksFrom(path.join(gobbiDir, 'core', 'hooks'), destHooks);

  // Market packages — each subdirectory under .gobbi/market/ is a package
  const marketDir = path.join(gobbiDir, 'market');
  if (await pathExists(marketDir)) {
    const packageDirs = await readdir(marketDir, { withFileTypes: true });
    for (const pkg of packageDirs) {
      if (pkg.isDirectory()) {
        const pkgPath = path.join(marketDir, pkg.name);
        skills += await copySkillsFrom(path.join(pkgPath, 'skills'), destSkills);
        agents += await copyAgentsFrom(path.join(pkgPath, 'agents'), destAgents);
        hooks += await copyHooksFrom(path.join(pkgPath, 'hooks'), destHooks);
      }
    }
  }

  // User sources
  skills += await copySkillsFrom(path.join(gobbiDir, 'user', 'skills'), destSkills);
  agents += await copyAgentsFrom(path.join(gobbiDir, 'user', 'agents'), destAgents);
  hooks += await copyHooksFrom(path.join(gobbiDir, 'user', 'hooks'), destHooks);

  return { skills, agents, hooks };
}

/**
 * Copy GOBBI.md from .gobbi/core/ to .claude/ if it exists.
 */
async function copyGobbiMd(targetDir: string): Promise<void> {
  const src = path.join(targetDir, '.gobbi', 'core', 'GOBBI.md');
  if (!(await pathExists(src))) {
    return;
  }

  const destDir = path.join(targetDir, '.claude');
  await mkdir(destDir, { recursive: true });
  await cp(src, path.join(destDir, 'GOBBI.md'));
}

/**
 * Synchronize .gobbi/ (source of truth) to .claude/ (where Claude Code reads).
 *
 * The sync algorithm:
 * 1. Clear gobbi-managed items from .claude/
 * 2. Copy from .gobbi/ sources (core, market packages, user) to .claude/
 * 3. Copy GOBBI.md
 * 4. Ensure CLAUDE.md trigger line
 * 5. Assemble settings.json (hook config + permissions)
 * 6. Update manifest lastSync timestamp
 *
 * This function is idempotent — running it multiple times produces the same result.
 *
 * @param targetDir - The project root directory containing .gobbi/ and .claude/.
 * @returns Summary of what was synced.
 */
export async function sync(targetDir: string): Promise<SyncResult> {
  // Step 1: Clear gobbi-managed items from .claude/
  await clearGobbiItems(targetDir);

  // Step 2: Copy from all .gobbi/ sources to .claude/
  const copied = await copyAllSources(targetDir);

  // Step 3: Copy GOBBI.md
  await copyGobbiMd(targetDir);

  // Step 4: Ensure CLAUDE.md trigger line
  const triggerResult = await ensureTriggerLine(targetDir);
  const claudeMdUpdated = triggerResult.created || triggerResult.modified;

  // Step 5: Assemble settings.json
  const settingsPath = path.join(targetDir, '.claude', 'settings.json');
  await mergeHookConfig(settingsPath, CORE_HOOK_ENTRIES);
  await mergeHookConfig(settingsPath, NOTIFICATION_HOOK_ENTRIES);
  await mergePermissions(settingsPath, GOBBI_PERMISSIONS);

  // Step 6: Update manifest lastSync timestamp
  await updateSyncTimestamp(path.join(targetDir, '.gobbi'));

  return {
    skillsCopied: copied.skills,
    agentsCopied: copied.agents,
    hooksCopied: copied.hooks,
    settingsAssembled: true,
    claudeMdUpdated,
  };
}
