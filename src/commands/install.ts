import { fileURLToPath } from 'url';
import path from 'path';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { getInstalledVersion } from '../lib/detect.js';
import { clearGobbiItems, copySkills, copyAgents, copyHooks, copyGobbiMd } from '../lib/sync.js';
import { ensureTriggerLine } from '../lib/claude-md.js';
import { CORE_HOOK_ENTRIES, NOTIFICATION_HOOK_ENTRIES, GOBBI_PERMISSIONS } from '../lib/hooks.js';
import { mergeHookConfig, mergePermissions } from '../lib/settings.js';
import { initProjectDir } from '../lib/project.js';
import { printBanner, header, ok, error, skip, bold, dim } from '../lib/style.js';
import { ensureClaudeDirIgnored } from '../lib/gitignore.js';

interface InstallOptions {
  nonInteractive: boolean;
}

/**
 * Resolve the package root directory from the current module's location.
 * At runtime, this file is at dist/commands/install.js — go up two levels to package root.
 */
function resolvePackageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, '..', '..');
}

/**
 * Write .claude/gobbi.json with version info.
 * @param claudeDir - Absolute path to the .claude/ directory.
 * @param version - The gobbi version string.
 */
async function writeGobbiJson(claudeDir: string, version: string): Promise<void> {
  await mkdir(claudeDir, { recursive: true });
  const manifest = {
    version,
    architecture: 'claude-source',
  };
  await writeFile(path.join(claudeDir, 'gobbi.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

/**
 * Run the gobbi install command — install gobbi into the target project.
 * @param targetDir - The project root to install into.
 * @param options - Command options.
 */
export async function runInstall(targetDir: string, options: InstallOptions): Promise<void> {
  const packageRoot = resolvePackageRoot();
  const packageClaudeDir = path.join(packageRoot, '.claude');

  // Read version from package.json
  const pkgPath = path.join(packageRoot, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { version: string };

  // Check installed version
  const installedVersion = await getInstalledVersion(targetDir);

  if (installedVersion === 'current') {
    console.log(error("Gobbi is already installed. Run 'npx @gobbi/core update' to update."));
    process.exit(1);
  }

  printBanner(pkg.version);

  if (installedVersion === 'v2') {
    // Legacy .gobbi/ installation — migrate to .claude/ direct
    console.log(header('Migrating from legacy .gobbi/ installation...'));
    console.log('');
  } else if (installedVersion === 'v1') {
    console.log(header('Migrating from v0.1.0...'));
    console.log('');
  } else {
    console.log(header('Installing gobbi...'));
    console.log('');
  }

  // Ensure target .claude/ directories exist
  const claudeDir = path.join(targetDir, '.claude');
  await mkdir(path.join(claudeDir, 'skills'), { recursive: true });
  await mkdir(path.join(claudeDir, 'agents'), { recursive: true });
  await mkdir(path.join(claudeDir, 'hooks'), { recursive: true });

  // Clear existing gobbi items to avoid stale files
  await clearGobbiItems(claudeDir);

  // Copy skills, agents, hooks, README.md from package .claude/ to target .claude/
  const skillCount = await copySkills(path.join(packageClaudeDir, 'skills'), path.join(claudeDir, 'skills'));
  const agentCount = await copyAgents(path.join(packageClaudeDir, 'agents'), path.join(claudeDir, 'agents'));
  const hookCount = await copyHooks(path.join(packageClaudeDir, 'hooks'), path.join(claudeDir, 'hooks'));
  await copyGobbiMd(packageClaudeDir, claudeDir);

  console.log(ok(`Copied ${skillCount} skills`));
  console.log(ok(`Copied ${agentCount} agents`));
  console.log(ok(`Copied ${hookCount} hooks`));
  console.log(ok('Copied README.md'));
  console.log('');

  // Write .claude/gobbi.json with version info
  await writeGobbiJson(claudeDir, pkg.version);
  console.log(ok('Created gobbi.json'));

  // Assemble settings.json (merge hook configs and permissions)
  const settingsPath = path.join(claudeDir, 'settings.json');
  await mergeHookConfig(settingsPath, CORE_HOOK_ENTRIES);
  await mergeHookConfig(settingsPath, NOTIFICATION_HOOK_ENTRIES);
  await mergePermissions(settingsPath, GOBBI_PERMISSIONS);
  console.log(ok('Settings assembled'));

  // Ensure CLAUDE.md trigger line
  const triggerResult = await ensureTriggerLine(targetDir);
  if (triggerResult.created || triggerResult.modified) {
    console.log(ok('CLAUDE.md trigger updated'));
  } else {
    console.log(ok('CLAUDE.md trigger already present'));
  }
  console.log('');

  // Init project directory
  const projectResult = await initProjectDir(targetDir, options.nonInteractive);
  if (projectResult.created) {
    console.log(ok(`Created project directory: ${projectResult.name}`));
  } else if (options.nonInteractive) {
    console.log(skip('Skipped project directory (non-interactive mode)'));
  } else {
    console.log(skip('Skipped project directory'));
  }

  // Gitignore
  console.log('');
  const gitignoreResult = await ensureClaudeDirIgnored(targetDir, !options.nonInteractive);
  if (gitignoreResult.alreadyIgnored) {
    console.log(ok('.claude/ already in .gitignore'));
  } else if (gitignoreResult.added) {
    console.log(ok('Added .claude/ to .gitignore'));
  } else {
    console.log(dim('  Consider adding .claude/ to .gitignore'));
  }
  console.log('');

  // Clean up legacy .gobbi/ directory if migrating from v2
  if (installedVersion === 'v2') {
    await rm(path.join(targetDir, '.gobbi'), { recursive: true, force: true });
    console.log(ok('Removed legacy .gobbi/ directory'));
    console.log('');
  }

  // Success message
  console.log(bold('Gobbi installed successfully!'));
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Start a Claude Code session and type ${bold('/gobbi')} to begin.`);
  console.log(`  Run ${bold('/gobbi-notification')} in Claude Code to configure notifications.`);
}
