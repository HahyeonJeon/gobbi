import type { HookEntry } from './settings.js';

// --- Gobbi skill permissions ---

export const GOBBI_PERMISSIONS: string[] = [
  'Skill(gobbi)',
  'Skill(_orchestration)',
  'Skill(_gotcha)',
  'Skill(_claude)',
  'Skill(_skills)',
  'Skill(_agents)',
  'Skill(_rules)',
  'Skill(_project)',
  'Skill(_discuss)',
  'Skill(_ideation)',
  'Skill(_ideation-evaluation)',
  'Skill(_plan)',
  'Skill(_ideation-evaluation)',
  'Skill(_plan-evaluation)',
  'Skill(_plan-evaluation)',
  'Skill(_delegation)',
  'Skill(_execution)',
  'Skill(_execution-evaluation)',
  'Skill(_evaluation)',
  'Skill(_note)',
  'Skill(_note:*)',
  'Skill(_collection)',
  'Skill(_notification)',
  'Skill(__evaluation-project)',
  'Skill(__evaluation-architecture)',
  'Skill(__evaluation-performance)',
  'Skill(__evaluation-aesthetics)',
  'Skill(__evaluation-overall)',
  'Skill(_audit)',
  'Skill(__benchmark)',
  'Skill(_git)',
  'Skill(_slack)',
  'Skill(_telegram)',
  'Skill(_discord)',
  'Skill(__validate)',
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

