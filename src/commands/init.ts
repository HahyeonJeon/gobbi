import { fileURLToPath } from 'url';
import path from 'path';
import { readFile } from 'fs/promises';
import { isInstalled } from '../lib/detect.js';
import * as files from '../lib/files.js';
import * as claudeMd from '../lib/claude-md.js';
import * as hooks from '../lib/hooks.js';
import * as project from '../lib/project.js';
import { printBanner, header, ok, skip, error, printInitSuccess } from '../lib/style.js';

interface InitOptions {
  nonInteractive: boolean;
}

/**
 * Run the gobbi init command — install gobbi into the target project.
 * @param targetDir - The project root to install into.
 * @param options - Command options.
 */
export async function runInit(targetDir: string, options: InitOptions): Promise<void> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.resolve(currentDir, '..', '..', 'templates');

  if (await isInstalled(targetDir)) {
    console.log(error('Gobbi is already installed in this project.'));
    console.log("Run 'npx gobbi update' to update to the latest version.");
    process.exit(1);
  }

  // Read version and print banner
  const pkgPath = path.resolve(currentDir, '..', '..', 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { version: string };
  printBanner(pkg.version);

  console.log(header('Installing gobbi...'));
  console.log('');

  // Copy skills
  const skillCount = await files.copySkills(templatesDir, targetDir);
  console.log(ok(`Copied ${skillCount} skill directories`));

  // Copy agents
  const agentCount = await files.copyAgents(templatesDir, targetDir);
  console.log(ok(`Copied ${agentCount} agent definitions`));

  // Copy GOBBI.md
  await files.copyGobbiMd(templatesDir, targetDir);
  console.log(ok('Copied GOBBI.md'));

  // Ensure CLAUDE.md trigger
  const triggerResult = await claudeMd.ensureTriggerLine(targetDir);
  if (triggerResult.created) {
    console.log(ok('Created CLAUDE.md with gobbi trigger'));
  } else if (triggerResult.modified) {
    console.log(ok('Added gobbi trigger to existing CLAUDE.md'));
  } else if (triggerResult.alreadyPresent) {
    console.log(ok('CLAUDE.md trigger already present'));
  }

  // Install core hooks and permissions
  await hooks.installCoreHooks(templatesDir, targetDir);
  console.log(ok('Installed core hooks (reload-gobbi.sh, session-metadata.sh)'));
  console.log(ok('Configured skill permissions'));

  // Notification hooks
  const notifResult = await hooks.promptNotificationHooks(templatesDir, targetDir, options.nonInteractive);
  if (notifResult.installed) {
    console.log(ok('Installed notification hooks'));
  } else if (options.nonInteractive) {
    console.log(skip('Skipped notification hooks (non-interactive mode)'));
  } else {
    console.log(skip('Skipped notification hooks'));
  }

  // Project directory
  const projectResult = await project.initProjectDir(targetDir, options.nonInteractive);
  if (projectResult.created) {
    console.log(ok(`Created project directory: ${projectResult.name}`));
  } else if (options.nonInteractive) {
    console.log(skip('Skipped project directory (non-interactive mode)'));
  } else {
    console.log(skip('Skipped project directory'));
  }

  // Summary
  printInitSuccess();
}
