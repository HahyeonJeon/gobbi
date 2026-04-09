/**
 * Session-start prompt template.
 *
 * Replaces the gobbi SKILL.md session setup: symlink verification,
 * existing config detection, setup questions, and project context.
 *
 * Variables resolved from env (session ID, project dir), command
 * (CLI version, existing config), and runtime (none required).
 */

import type { PromptTemplate } from '../types.js';

export const SESSION_START_TEMPLATE: PromptTemplate = {
  $schema: 'gobbi-prompt/session-start',
  version: '0.5.0',
  phase: 'session-start',

  layers: [
    {
      role: 'system',
      content: [
        'You are an orchestrator based on gobbi. You must delegate everything to specialist subagents except trivial cases.',
        '',
        'You are receiving this prompt via the gobbi prompt architecture. Follow the instructions below precisely. At the end, you will find completion outcomes and next steps.',
      ].join('\n'),
    },
    {
      role: 'context',
      content: [
        'Session ID: {{sessionId}}',
        'Project directory: {{projectDir}}',
        'CLI version: {{cliVersion}}',
        'Current session config: {{existingConfig}}',
      ].join('\n'),
    },
    {
      role: 'task',
      content: [
        'STEP 1: Ensure _gobbi-rule symlinks exist.',
        'Check whether {{projectDir}}/.claude/rules/_gobbi-rule.json and _gobbi-rule.md exist.',
        'If either is missing, create symlinks from .claude/rules/ pointing to the corresponding files in .claude/skills/_gobbi-rule-container/.',
        '',
        'STEP 2: Check for existing session settings.',
        'If the "Current session config" above is not empty, present the saved settings to the user using AskUserQuestion. Ask whether to reuse them or reconfigure.',
        'If the user chooses to reuse, report outcome "reused-existing".',
        'If no settings exist or user wants to reconfigure, continue to STEP 3.',
        '',
        'STEP 3: Ask setup questions.',
        'Use the AskUserQuestion tool with the exact parameters provided in the ASK USER section below.',
        'After receiving answers, persist all choices:',
        '  gobbi config set {{sessionId}} trivialRange <value>',
        '  gobbi config set {{sessionId}} evaluationMode <value>',
        '  gobbi config set {{sessionId}} gitWorkflow <value>',
        '  gobbi config set {{sessionId}} baseBranch <value> (if worktree-pr selected)',
        '  gobbi config set {{sessionId}} notify.slack true/false',
        '  gobbi config set {{sessionId}} notify.telegram true/false',
        '',
        'If git workflow (worktree + PR) is selected, ask for the base branch as a follow-up question.',
        'If notification channels are selected, check {{projectDir}}/.claude/.env for credentials.',
        '',
        'STEP 4: Detect project context.',
        'Check for {{projectDir}}/.claude/project/ directory.',
        'If a project subdirectory exists, read only README.md, design/, and gotchas/ for context.',
        'If no project directory exists, ask the user for a project name and create the standard structure.',
        '',
        'After completing all steps, report your completion outcome.',
      ].join('\n'),
    },
  ],

  variables: {
    sessionId: { source: 'env', path: 'CLAUDE_SESSION_ID', required: true },
    projectDir: { source: 'env', path: 'CLAUDE_PROJECT_DIR', required: true },
    cliVersion: { source: 'command', path: 'gobbi --version', required: false, fallback: 'unknown' },
    existingConfig: { source: 'command', path: 'gobbi config get $CLAUDE_SESSION_ID', required: false, fallback: '' },
  },

  askUser: [
    {
      question: 'What is the trivial case range for this session?',
      header: 'Trivial Case Range',
      options: [
        {
          label: 'Read-only (no code changes)',
          description: 'Reading files, explaining code, running status commands, searching codebase. Any code change must be delegated.',
        },
        {
          label: 'Simple code edits included',
          description: 'The above, plus single-file obvious changes (fix a typo, rename a variable, toggle a config value). Anything beyond must be delegated.',
        },
      ],
    },
    {
      question: 'What evaluation mode should this session use?',
      header: 'Evaluation Mode',
      options: [
        {
          label: 'Ask each time (Recommended)',
          description: 'Before each evaluation stage, the orchestrator asks whether to spawn evaluators.',
        },
        {
          label: 'Always evaluate',
          description: 'Skip the evaluation question, always spawn evaluators at every stage.',
        },
        {
          label: 'Skip evaluation',
          description: 'Never spawn evaluators unless you explicitly request one.',
        },
      ],
    },
    {
      question: 'What git workflow should this session use?',
      header: 'Git Workflow',
      options: [
        {
          label: 'Direct commit (default)',
          description: 'Work happens in the main working tree. Commits are created at FINISH.',
        },
        {
          label: 'Git workflow (worktree + PR)',
          description: 'Each task gets its own worktree and branch. Work is integrated via pull request.',
        },
      ],
    },
    {
      question: 'Which notification channels should be active?',
      header: 'Notification Channels',
      options: [
        { label: 'Slack', description: 'Notify via Slack bot message.' },
        { label: 'Telegram', description: 'Notify via Telegram bot message.' },
        { label: 'Discord', description: 'Notify via Discord webhook.' },
        { label: 'Skip notifications', description: 'No notifications this session.' },
      ],
      multiSelect: true,
    },
  ],

  completion: {
    type: 'select-outcome',
    outcomes: [
      { id: 'configured', description: 'New session configured from scratch' },
      { id: 'reused-existing', description: 'Reused existing session settings' },
    ],
  },

  transitions: {
    type: 'choice',
    choices: [],
    default: 'gobbi prompt workflow-start',
  },
};
