import { cp, mkdir, chmod } from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { mergeHookConfig } from './settings.js';

// --- Core hook definitions ---

const CORE_SCRIPTS = ['reload-gobbi.sh', 'session-metadata.sh'];

const CORE_HOOK_ENTRIES = [
  {
    event: 'PostCompact',
    config: {
      matcher: 'manual|auto',
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/reload-gobbi.sh',
        timeout: 5
      }]
    }
  },
  {
    event: 'SessionStart',
    config: {
      matcher: 'startup|resume|compact',
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/session-metadata.sh',
        timeout: 5
      }]
    }
  }
];

// --- Notification hook definitions ---

const NOTIFICATION_SCRIPTS = [
  'load-notification-env.sh',
  'notify-send.sh',
  'notify-completion.sh',
  'notify-attention.sh',
  'notify-error.sh',
  'notify-subagent.sh',
  'notify-session.sh'
];

export const NOTIFICATION_HOOK_ENTRIES = [
  {
    event: 'SessionStart',
    config: {
      matcher: 'startup|resume',
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/load-notification-env.sh',
        timeout: 5
      }]
    }
  },
  {
    event: 'Stop',
    config: {
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-completion.sh',
        timeout: 10,
        async: true
      }]
    }
  },
  {
    event: 'Notification',
    config: {
      matcher: 'permission_prompt|idle_prompt|elicitation_dialog',
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-attention.sh',
        timeout: 5,
        async: true
      }]
    }
  },
  {
    event: 'StopFailure',
    config: {
      matcher: 'rate_limit|authentication_failed|billing_error|server_error',
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-error.sh',
        timeout: 5,
        async: true
      }]
    }
  },
  {
    event: 'SubagentStop',
    config: {
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-subagent.sh',
        timeout: 5,
        async: true
      }]
    }
  },
  {
    event: 'SessionStart',
    config: {
      matcher: 'startup|resume',
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-session.sh',
        timeout: 5,
        async: true
      }]
    }
  },
  {
    event: 'SessionEnd',
    config: {
      matcher: 'logout|prompt_input_exit',
      hooks: [{
        type: 'command',
        command: 'bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-session.sh',
        timeout: 5,
        async: true
      }]
    }
  }
];

/**
 * Copy hook scripts from source to destination, setting executable permission.
 * @param {string[]} scripts - Script filenames to copy.
 * @param {string} srcDir - Source hooks directory.
 * @param {string} destDir - Destination hooks directory.
 */
async function copyHookScripts(scripts, srcDir, destDir) {
  await mkdir(destDir, { recursive: true });

  for (const script of scripts) {
    const src = path.join(srcDir, script);
    const dest = path.join(destDir, script);
    await cp(src, dest);
    await chmod(dest, 0o755);
  }
}

/**
 * Install core hooks (always installed, written to settings.json).
 * Copies hook scripts and merges config into settings.json.
 * @param {string} templatesDir - Source templates directory.
 * @param {string} targetDir - Target project root.
 */
export async function installCoreHooks(templatesDir, targetDir) {
  const srcHooksDir = path.join(templatesDir, 'hooks');
  const destHooksDir = path.join(targetDir, '.claude', 'hooks');

  await copyHookScripts(CORE_SCRIPTS, srcHooksDir, destHooksDir);

  const settingsPath = path.join(targetDir, '.claude', 'settings.json');
  await mergeHookConfig(settingsPath, CORE_HOOK_ENTRIES);
}

/**
 * Prompt for and optionally install notification hooks.
 * Written to settings.local.json. Skipped in non-interactive mode.
 * @param {string} templatesDir - Source templates directory.
 * @param {string} targetDir - Target project root.
 * @param {boolean} nonInteractive - If true, skip entirely.
 * @returns {Promise<{installed: boolean}>}
 */
export async function promptNotificationHooks(templatesDir, targetDir, nonInteractive) {
  if (nonInteractive) {
    return { installed: false };
  }

  const answer = await askQuestion('Install notification hooks? (y/N): ');
  const wantsNotifications = answer.trim().toLowerCase() === 'y';

  if (!wantsNotifications) {
    return { installed: false };
  }

  const srcHooksDir = path.join(templatesDir, 'hooks');
  const destHooksDir = path.join(targetDir, '.claude', 'hooks');

  await copyHookScripts(NOTIFICATION_SCRIPTS, srcHooksDir, destHooksDir);

  const settingsPath = path.join(targetDir, '.claude', 'settings.local.json');
  await mergeHookConfig(settingsPath, NOTIFICATION_HOOK_ENTRIES);

  return { installed: true };
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
