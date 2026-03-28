import { fileURLToPath } from 'url';
import path from 'path';
import { isInstalled } from '../lib/detect.js';
import * as files from '../lib/files.js';
import * as claudeMd from '../lib/claude-md.js';
import * as hooks from '../lib/hooks.js';
import * as project from '../lib/project.js';

/**
 * Run the gobbi init command — install gobbi into the target project.
 * @param {string} targetDir - The project root to install into.
 * @param {object} options
 * @param {boolean} options.nonInteractive - Skip all prompts, use safe defaults.
 */
export async function runInit(targetDir, options = {}) {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.resolve(currentDir, '..', '..', 'templates');

  if (await isInstalled(targetDir)) {
    console.log('Gobbi is already installed in this project.');
    console.log("Run 'npx gobbi update' to update to the latest version.");
    process.exit(1);
  }

  console.log('\nInstalling gobbi...\n');

  // Copy skills
  const skillCount = await files.copySkills(templatesDir, targetDir);
  console.log(`  [ok] Copied ${skillCount} skill directories`);

  // Copy agents
  const agentCount = await files.copyAgents(templatesDir, targetDir);
  console.log(`  [ok] Copied ${agentCount} agent definitions`);

  // Copy GOBBI.md
  await files.copyGobbiMd(templatesDir, targetDir);
  console.log('  [ok] Copied GOBBI.md');

  // Ensure CLAUDE.md trigger
  const triggerResult = await claudeMd.ensureTriggerLine(targetDir);
  if (triggerResult.created) {
    console.log('  [ok] Created CLAUDE.md with gobbi trigger');
  } else if (triggerResult.modified) {
    console.log('  [ok] Added gobbi trigger to existing CLAUDE.md');
  } else if (triggerResult.alreadyPresent) {
    console.log('  [ok] CLAUDE.md trigger already present');
  }

  // Install core hooks
  await hooks.installCoreHooks(templatesDir, targetDir);
  console.log('  [ok] Installed core hooks (reload-gobbi.sh, session-metadata.sh)');

  // Notification hooks
  const notifResult = await hooks.promptNotificationHooks(templatesDir, targetDir, options.nonInteractive);
  if (notifResult.installed) {
    console.log('  [ok] Installed notification hooks');
  } else if (options.nonInteractive) {
    console.log('  [--] Skipped notification hooks (non-interactive mode)');
  } else {
    console.log('  [--] Skipped notification hooks');
  }

  // Project directory
  const projectResult = await project.initProjectDir(targetDir, options.nonInteractive);
  if (projectResult.created) {
    console.log(`  [ok] Created project directory: ${projectResult.name}`);
  } else if (options.nonInteractive) {
    console.log('  [--] Skipped project directory (non-interactive mode)');
  } else {
    console.log('  [--] Skipped project directory');
  }

  // Summary
  console.log(`
Gobbi installed successfully!

Next steps:
  1. Configure permissions in .claude/settings.local.json
     Add Skill() permissions for all gobbi skills you want to auto-approve.
  2. Start a Claude Code session and type /gobbi to begin.`);
}
