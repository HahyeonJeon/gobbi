import { fileURLToPath } from 'url';
import path from 'path';
import { readFile, readdir, cp, chmod, mkdir } from 'fs/promises';
import { getInstalledVersion } from '../lib/detect.js';
import { createGobbiDir, SUBDIRS } from '../lib/gobbi-dir.js';
import { createManifest, writeManifest } from '../lib/manifest.js';
import { migrateV1 } from '../lib/migrate.js';
import { sync } from '../lib/sync.js';
import { initProjectDir } from '../lib/project.js';
import { printBanner, header, ok, error, skip, bold, dim } from '../lib/style.js';
import { ensureClaudeDirIgnored } from '../lib/gitignore.js';

interface InstallOptions {
  nonInteractive: boolean;
}

/**
 * Copy plugins/gobbi-core/ content into .gobbi/core/ — skills, agents, hooks, and GOBBI.md.
 * @returns Counts of items copied.
 */
async function copyTemplatesToCore(
  templatesDir: string,
  targetDir: string,
): Promise<{ skills: number; agents: number; hooks: number }> {
  let skills = 0;
  let agents = 0;
  let hooks = 0;

  // Skills — directories starting with "gobbi"
  const skillsSrc = path.join(templatesDir, 'skills');
  const skillsDest = path.join(targetDir, SUBDIRS.coreSkills);
  await mkdir(skillsDest, { recursive: true });
  const skillEntries = await readdir(skillsSrc, { withFileTypes: true });
  for (const entry of skillEntries) {
    if (entry.isDirectory() && entry.name.startsWith('gobbi')) {
      await cp(path.join(skillsSrc, entry.name), path.join(skillsDest, entry.name), { recursive: true });
      skills++;
    }
  }

  // Agents — files starting with "gobbi-"
  const agentsSrc = path.join(templatesDir, 'agents');
  const agentsDest = path.join(targetDir, SUBDIRS.coreAgents);
  await mkdir(agentsDest, { recursive: true });
  const agentEntries = await readdir(agentsSrc, { withFileTypes: true });
  for (const entry of agentEntries) {
    if (entry.isFile() && entry.name.startsWith('gobbi-')) {
      await cp(path.join(agentsSrc, entry.name), path.join(agentsDest, entry.name));
      agents++;
    }
  }

  // Hooks — all files, chmod 755
  const hooksSrc = path.join(templatesDir, 'hooks');
  const hooksDest = path.join(targetDir, SUBDIRS.coreHooks);
  await mkdir(hooksDest, { recursive: true });
  const hookEntries = await readdir(hooksSrc, { withFileTypes: true });
  for (const entry of hookEntries) {
    if (entry.isFile()) {
      const destPath = path.join(hooksDest, entry.name);
      await cp(path.join(hooksSrc, entry.name), destPath);
      await chmod(destPath, 0o755);
      hooks++;
    }
  }

  // GOBBI.md
  const gobbiMdSrc = path.join(templatesDir, 'GOBBI.md');
  const gobbiMdDest = path.join(targetDir, SUBDIRS.core, 'GOBBI.md');
  await cp(gobbiMdSrc, gobbiMdDest);

  return { skills, agents, hooks };
}

/**
 * Run the gobbi install command — install or migrate gobbi into the target project.
 * @param targetDir - The project root to install into.
 * @param options - Command options.
 */
export async function runInstall(targetDir: string, options: InstallOptions): Promise<void> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.resolve(currentDir, '..', '..', 'plugins', 'gobbi-core');

  // Read version from package.json
  const pkgPath = path.resolve(currentDir, '..', '..', 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { version: string };

  // Check installed version
  const installedVersion = await getInstalledVersion(targetDir);

  if (installedVersion === 'v2') {
    console.log(error("Gobbi v0.2.0 is already installed. Run 'npx @gobbi/core update' to update."));
    process.exit(1);
  }

  if (installedVersion === 'v1') {
    // Migration path
    printBanner(pkg.version);
    console.log(header('Migrating from v0.1.0...'));
    console.log('');

    const migration = await migrateV1(targetDir);
    console.log(ok(`${migration.skillsMoved} skills moved`));
    console.log(ok(`${migration.agentsMoved} agents moved`));
    console.log(ok(`${migration.hooksMoved} hooks moved`));
    if (migration.gobbiMdMoved) {
      console.log(ok('GOBBI.md moved'));
    }
    console.log('');

    // Update core templates with latest from npm package
    console.log(header('Updating core templates...'));
    const counts = await copyTemplatesToCore(templatesDir, targetDir);
    console.log(ok(`${counts.skills} skills`));
    console.log(ok(`${counts.agents} agents`));
    console.log(ok(`${counts.hooks} hooks`));
    console.log(ok('GOBBI.md'));
    console.log('');

    // Create manifest if it doesn't exist yet
    const gobbiDir = path.join(targetDir, '.gobbi');
    const manifest = createManifest(pkg.version);
    await writeManifest(gobbiDir, manifest);
    console.log(ok('Created gobbi.json manifest'));
  } else {
    // Fresh install
    printBanner(pkg.version);
    console.log(header('Installing gobbi...'));
    console.log('');

    await createGobbiDir(targetDir);
    console.log(ok('Created .gobbi/ directory structure'));

    const gobbiDir = path.join(targetDir, '.gobbi');
    const manifest = createManifest(pkg.version);
    await writeManifest(gobbiDir, manifest);
    console.log(ok('Created gobbi.json manifest'));

    const counts = await copyTemplatesToCore(templatesDir, targetDir);
    console.log(ok(`Copied ${counts.skills} skills`));
    console.log(ok(`Copied ${counts.agents} agents`));
    console.log(ok(`Copied ${counts.hooks} hooks`));
    console.log(ok('Copied GOBBI.md'));
    console.log('');
  }

  // Run sync — populates .claude/ from .gobbi/
  console.log(header('Syncing to .claude/...'));
  const syncResult = await sync(targetDir);
  console.log(ok(`${syncResult.skillsCopied} skills synced`));
  console.log(ok(`${syncResult.agentsCopied} agents synced`));
  console.log(ok(`${syncResult.hooksCopied} hooks synced`));
  if (syncResult.claudeMdUpdated) {
    console.log(ok('CLAUDE.md trigger updated'));
  } else {
    console.log(ok('CLAUDE.md trigger already present'));
  }
  console.log(ok('Settings assembled'));
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
    console.log(dim('Consider adding .claude/ to .gitignore (it is generated from .gobbi/)'));
  }
  console.log('');

  // Success message
  console.log(bold('Gobbi installed successfully!'));
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Commit the ${bold('.gobbi/')} directory to your repository.`);
  console.log(`  2. Add ${bold('.claude/')} to your .gitignore.`);
  console.log(`  3. Start a Claude Code session and type ${bold('/gobbi')} to begin.`);
  console.log(`  Run ${bold('/gobbi-notification')} in Claude Code to configure notifications.`);
}
