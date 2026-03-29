import { cp, mkdir, chmod } from 'fs/promises';
import path from 'path';
import { mergeHookConfig, mergePermissions } from './settings.js';
import type { HookEntry } from './settings.js';

// --- Gobbi skill permissions ---

export const GOBBI_PERMISSIONS: string[] = [
  'Skill(gobbi)',
  'Skill(gobbi-orchestration)',
  'Skill(gobbi-gotcha)',
  'Skill(gobbi-claude)',
  'Skill(gobbi-claude-skills)',
  'Skill(gobbi-claude-agents)',
  'Skill(gobbi-discuss)',
  'Skill(gobbi-ideation)',
  'Skill(gobbi-ideation-evaluation)',
  'Skill(gobbi-plan)',
  'Skill(gobbi-plan-evaluation)',
  'Skill(gobbi-delegation)',
  'Skill(gobbi-execution)',
  'Skill(gobbi-execution-evaluation)',
  'Skill(gobbi-evaluation)',
  'Skill(gobbi-note)',
  'Skill(gobbi-note:*)',
  'Skill(gobbi-collection)',
  'Skill(gobbi-notification)',
  'WebSearch'
];

// --- Core hook definitions ---

export const CORE_SCRIPTS: string[] = ['session-metadata.sh'];

export const CORE_HOOK_ENTRIES: HookEntry[] = [
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

export const NOTIFICATION_SCRIPTS: string[] = [
  'load-notification-env.sh',
  'notify-send.sh',
  'notify-completion.sh',
  'notify-attention.sh',
  'notify-error.sh',
  'notify-subagent.sh',
  'notify-session.sh'
];

export const NOTIFICATION_HOOK_ENTRIES: HookEntry[] = [
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
 * @param scripts - Script filenames to copy.
 * @param srcDir - Source hooks directory.
 * @param destDir - Destination hooks directory.
 */
async function copyHookScripts(scripts: string[], srcDir: string, destDir: string): Promise<void> {
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
 * @param templatesDir - Source templates directory.
 * @param targetDir - Target project root.
 */
export async function installCoreHooks(templatesDir: string, targetDir: string): Promise<void> {
  const srcHooksDir = path.join(templatesDir, 'hooks');
  const destHooksDir = path.join(targetDir, '.claude', 'hooks');

  await copyHookScripts(CORE_SCRIPTS, srcHooksDir, destHooksDir);

  const settingsPath = path.join(targetDir, '.claude', 'settings.json');
  await mergeHookConfig(settingsPath, CORE_HOOK_ENTRIES);
  await mergePermissions(settingsPath, GOBBI_PERMISSIONS);
}

/**
 * Install notification hooks (always installed, written to settings.json).
 * Copies notification scripts and merges config into settings.json.
 * @param templatesDir - Source templates directory.
 * @param targetDir - Target project root.
 */
export async function installNotificationHooks(templatesDir: string, targetDir: string): Promise<void> {
  const srcHooksDir = path.join(templatesDir, 'hooks');
  const destHooksDir = path.join(targetDir, '.claude', 'hooks');

  await copyHookScripts(NOTIFICATION_SCRIPTS, srcHooksDir, destHooksDir);

  const settingsPath = path.join(targetDir, '.claude', 'settings.json');
  await mergeHookConfig(settingsPath, NOTIFICATION_HOOK_ENTRIES);
}
