import { fileURLToPath } from 'url';
import path from 'path';
import { readFile, readdir, rm, cp } from 'fs/promises';
import { isInstalled } from '../lib/detect.js';
import * as claudeMd from '../lib/claude-md.js';
import * as hooks from '../lib/hooks.js';
import { printBanner, header, ok, skip, error, printUpdateSuccess } from '../lib/style.js';

interface UpdateOptions {
  nonInteractive: boolean;
}

/**
 * Run the gobbi update command — update gobbi in an existing installation.
 * @param targetDir - The project root to update.
 * @param options - Command options.
 */
export async function runUpdate(targetDir: string, options: UpdateOptions): Promise<void> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.resolve(currentDir, '..', '..', 'templates');

  if (!(await isInstalled(targetDir))) {
    console.log(error('Gobbi is not installed in this project.'));
    console.log("Run 'npx gobbi init' to install it first.");
    process.exit(1);
  }

  // Read version and print banner
  const pkgPath = path.resolve(currentDir, '..', '..', 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { version: string };
  printBanner(pkg.version);

  console.log(header('Updating gobbi...'));
  console.log('');

  // --- Replace skill directories ---
  const skillsSrcDir = path.join(templatesDir, 'skills');
  const skillsDestDir = path.join(targetDir, '.claude', 'skills');
  const skillEntries = await readdir(skillsSrcDir, { withFileTypes: true });
  let skillCount = 0;

  for (const entry of skillEntries) {
    if (!entry.isDirectory() || !entry.name.startsWith('gobbi')) {
      continue;
    }

    if (entry.name === 'gobbi-hack') {
      console.log(skip('Preserved gobbi-hack/ (user customizations)'));
      continue;
    }

    const src = path.join(skillsSrcDir, entry.name);
    const dest = path.join(skillsDestDir, entry.name);
    await rm(dest, { recursive: true, force: true });
    await cp(src, dest, { recursive: true });
    console.log(ok(`Updated ${entry.name}`));
    skillCount++;
  }

  console.log(ok(`Updated ${skillCount} skill directories`));

  // --- Replace agent definitions ---
  const agentsSrcDir = path.join(templatesDir, 'agents');
  const agentsDestDir = path.join(targetDir, '.claude', 'agents');
  const agentEntries = await readdir(agentsSrcDir, { withFileTypes: true });
  let agentCount = 0;

  for (const entry of agentEntries) {
    if (!entry.isFile() || !entry.name.startsWith('gobbi-')) {
      continue;
    }

    const src = path.join(agentsSrcDir, entry.name);
    const dest = path.join(agentsDestDir, entry.name);
    await rm(dest, { force: true });
    await cp(src, dest);
    agentCount++;
  }

  console.log(ok(`Updated ${agentCount} agent definitions`));

  // --- Replace GOBBI.md ---
  const gobbiMdSrc = path.join(templatesDir, 'GOBBI.md');
  const gobbiMdDest = path.join(targetDir, '.claude', 'GOBBI.md');
  await cp(gobbiMdSrc, gobbiMdDest);
  console.log(ok('Updated GOBBI.md'));

  // --- Verify CLAUDE.md trigger ---
  const triggerResult = await claudeMd.ensureTriggerLine(targetDir);
  if (triggerResult.alreadyPresent) {
    console.log(ok('CLAUDE.md trigger verified'));
  } else if (triggerResult.modified) {
    console.log(ok('Added missing gobbi trigger to CLAUDE.md'));
  }

  // --- Replace core hooks and update permissions ---
  await hooks.installCoreHooks(templatesDir, targetDir);
  console.log(ok('Updated core hooks (session-metadata.sh)'));
  console.log(ok('Updated skill permissions'));

  // --- Replace notification hooks ---
  await hooks.installNotificationHooks(templatesDir, targetDir);
  console.log(ok('Updated notification hooks'));

  // --- Summary ---
  printUpdateSuccess();
}
