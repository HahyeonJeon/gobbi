import { fileURLToPath } from 'url';
import path from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { getInstalledVersion } from '../lib/detect.js';
import { clearGobbiItems, copySkills, copyAgents, copyHooks, copyGobbiMd } from '../lib/sync.js';
import { CORE_HOOK_ENTRIES, NOTIFICATION_HOOK_ENTRIES, GOBBI_PERMISSIONS } from '../lib/hooks.js';
import { mergeHookConfig, mergePermissions } from '../lib/settings.js';
import { printBanner, header, ok, error } from '../lib/style.js';

interface UpdateOptions {
  nonInteractive: boolean;
}

/**
 * Resolve the package root directory from the current module's location.
 * At runtime, this file is at dist/commands/update.js — go up two levels to package root.
 */
function resolvePackageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, '..', '..');
}

/**
 * Run the gobbi update command — refresh gobbi items from the package.
 * @param targetDir - The project root to update.
 * @param options - Command options.
 */
export async function runUpdate(targetDir: string, options: UpdateOptions): Promise<void> {
  // 1. Check installed version — must be current (.claude/gobbi.json)
  const version = await getInstalledVersion(targetDir);
  if (version !== 'current') {
    console.log(error('Gobbi is not installed in this project.'));
    console.log("Run 'npx @gobbi/core install' to install it first.");
    process.exit(1);
  }

  // 2. Resolve package root and .claude/ directory
  const packageRoot = resolvePackageRoot();
  const packageClaudeDir = path.join(packageRoot, '.claude');

  // 3. Read version from package.json
  const pkgPath = path.join(packageRoot, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { version: string };

  // 4. Print banner
  printBanner(pkg.version);
  console.log(header('Updating gobbi...'));
  console.log('');

  // 5. Clear gobbi items from target .claude/
  const claudeDir = path.join(targetDir, '.claude');
  await clearGobbiItems(claudeDir);

  // 6. Copy fresh from package .claude/ to target .claude/
  const skillCount = await copySkills(path.join(packageClaudeDir, 'skills'), path.join(claudeDir, 'skills'));
  console.log(ok(`Updated ${skillCount} skills`));

  const agentCount = await copyAgents(path.join(packageClaudeDir, 'agents'), path.join(claudeDir, 'agents'));
  console.log(ok(`Updated ${agentCount} agents`));

  const hookCount = await copyHooks(path.join(packageClaudeDir, 'hooks'), path.join(claudeDir, 'hooks'));
  console.log(ok(`Updated ${hookCount} hooks`));

  await copyGobbiMd(packageClaudeDir, claudeDir);
  console.log(ok('Updated GOBBI.md'));

  // 7. Reassemble settings
  const settingsPath = path.join(claudeDir, 'settings.json');
  await mergeHookConfig(settingsPath, CORE_HOOK_ENTRIES);
  await mergeHookConfig(settingsPath, NOTIFICATION_HOOK_ENTRIES);
  await mergePermissions(settingsPath, GOBBI_PERMISSIONS);
  console.log(ok('Settings reassembled'));

  // 8. Update .claude/gobbi.json timestamp
  await mkdir(claudeDir, { recursive: true });
  const manifest = {
    version: pkg.version,
    architecture: 'claude-source',
    updated: new Date().toISOString(),
  };
  await writeFile(path.join(claudeDir, 'gobbi.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  // 9. Print success
  console.log('');
  console.log(ok(`Updated gobbi to v${pkg.version}`));
}
