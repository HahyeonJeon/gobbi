import { fileURLToPath } from 'url';
import path from 'path';
import { readdir, rm, cp, chmod, access } from 'fs/promises';
import readline from 'readline';
import { isInstalled } from '../lib/detect.js';
import * as claudeMd from '../lib/claude-md.js';
import * as hooks from '../lib/hooks.js';
import { mergeHookConfig, mergePermissions } from '../lib/settings.js';

const CORE_HOOK_SCRIPTS = ['reload-gobbi.sh', 'session-metadata.sh'];

const KNOWN_NOTIFICATION_SCRIPTS = [
  'load-notification-env.sh',
  'notify-send.sh',
  'notify-completion.sh',
  'notify-attention.sh',
  'notify-error.sh',
  'notify-subagent.sh',
  'notify-session.sh'
];

/**
 * Run the gobbi update command — update gobbi in an existing installation.
 * @param {string} targetDir - The project root to update.
 * @param {object} options
 * @param {boolean} options.nonInteractive - Skip all prompts, use safe defaults.
 */
export async function runUpdate(targetDir, options = {}) {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.resolve(currentDir, '..', '..', 'templates');

  if (!(await isInstalled(targetDir))) {
    console.log('Gobbi is not installed in this project.');
    console.log("Run 'npx gobbi init' to install it first.");
    process.exit(1);
  }

  console.log('\nUpdating gobbi...\n');

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
      console.log('  [--] Preserved gobbi-hack/ (user customizations)');
      continue;
    }

    const src = path.join(skillsSrcDir, entry.name);
    const dest = path.join(skillsDestDir, entry.name);
    await rm(dest, { recursive: true, force: true });
    await cp(src, dest, { recursive: true });
    console.log(`  [ok] Updated ${entry.name}`);
    skillCount++;
  }

  console.log(`  [ok] Updated ${skillCount} skill directories`);

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

  console.log(`  [ok] Updated ${agentCount} agent definitions`);

  // --- Replace GOBBI.md ---
  const gobbiMdSrc = path.join(templatesDir, 'GOBBI.md');
  const gobbiMdDest = path.join(targetDir, '.claude', 'GOBBI.md');
  await cp(gobbiMdSrc, gobbiMdDest);
  console.log('  [ok] Updated GOBBI.md');

  // --- Verify CLAUDE.md trigger ---
  const triggerResult = await claudeMd.ensureTriggerLine(targetDir);
  if (triggerResult.alreadyPresent) {
    console.log('  [ok] CLAUDE.md trigger verified');
  } else if (triggerResult.modified) {
    console.log('  [ok] Added missing gobbi trigger to CLAUDE.md');
  }

  // --- Replace core hooks and update permissions ---
  await hooks.installCoreHooks(templatesDir, targetDir);
  console.log('  [ok] Updated core hooks (reload-gobbi.sh, session-metadata.sh)');
  console.log('  [ok] Updated skill permissions');

  // --- Preserve notification hooks ---
  console.log('  [--] Preserved notification hooks and settings');

  // --- Check for new hooks ---
  const templateHooksDir = path.join(templatesDir, 'hooks');
  const targetHooksDir = path.join(targetDir, '.claude', 'hooks');
  const templateHookEntries = await readdir(templateHooksDir);

  const newHooks = [];
  for (const script of templateHookEntries) {
    if (CORE_HOOK_SCRIPTS.includes(script) || KNOWN_NOTIFICATION_SCRIPTS.includes(script)) {
      continue;
    }

    const targetPath = path.join(targetHooksDir, script);
    try {
      await access(targetPath);
    } catch {
      newHooks.push(script);
    }
  }

  if (newHooks.length > 0) {
    if (!options.nonInteractive) {
      console.log(`  New hooks available: ${newHooks.join(', ')}`);
      const answer = await askQuestion('  Install new hooks? (y/N): ');
      if (answer.trim().toLowerCase() === 'y') {
        for (const script of newHooks) {
          const src = path.join(templateHooksDir, script);
          const dest = path.join(targetHooksDir, script);
          await cp(src, dest);
          await chmod(dest, 0o755);
        }

        // Add settings entries for newly installed hooks
        const settingsPath = path.join(targetDir, '.claude', 'settings.local.json');
        const hookEntries = hooks.NOTIFICATION_HOOK_ENTRIES.filter(entry => {
          const cmd = entry.config.hooks?.[0]?.command || '';
          return newHooks.some(script => cmd.includes(script));
        });
        if (hookEntries.length > 0) {
          await mergeHookConfig(settingsPath, hookEntries);
        }

        console.log(`  [ok] Installed ${newHooks.length} new hook(s)`);
      }
    } else {
      console.log('  [--] New hooks available but skipped (non-interactive mode)');
    }
  }

  // --- Summary ---
  console.log(`
Gobbi updated successfully!

Preserved:
  - .claude/skills/gobbi-hack/ (user customizations)
  - .claude/project/ (project state)
  - Notification hooks and settings`);
}

/**
 * Ask a question via readline and return the answer.
 * @param {string} prompt - The question to display.
 * @returns {Promise<string>} The user's answer.
 */
function askQuestion(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
