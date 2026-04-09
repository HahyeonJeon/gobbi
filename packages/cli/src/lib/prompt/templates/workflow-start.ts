/**
 * Workflow-start prompt template.
 *
 * Replaces the _orchestration SKILL.md task routing: classify the
 * incoming task into a tier (trivial, structured-routine, non-trivial),
 * initialize notes, create the workflow checklist, and verify git
 * prerequisites when the worktree+PR workflow is active.
 *
 * Variables resolved from config (session settings), runtime
 * (project name, orchestration gotchas), and env (project dir).
 */

import type { PromptTemplate } from '../types.js';

export const WORKFLOW_START_TEMPLATE: PromptTemplate = {
  $schema: 'gobbi-prompt/workflow-start',
  version: '0.5.0',
  phase: 'workflow-start',

  layers: [
    {
      role: 'system',
      content: [
        'You are an orchestrator receiving workflow initialization instructions. Classify the user\'s task, initialize notes, and create a workflow checklist.',
      ].join('\n'),
    },
    {
      role: 'context',
      content: [
        'Trivial case range: {{trivialRange}}',
        'Evaluation mode: {{evaluationMode}}',
        'Git workflow: {{gitWorkflow}}',
        'Base branch: {{baseBranch}}',
        'Project name: {{projectName}}',
        '',
        'Orchestration gotchas:',
        '{{orchestrationGotchas}}',
      ].join('\n'),
    },
    {
      role: 'task',
      content: [
        'STEP 1: Classify the incoming task.',
        'The user has described a task. Classify it into one of three tiers:',
        '- Trivial: Within the trivial case range ({{trivialRange}}). Handle directly without delegation.',
        '- Structured routine: Can be fully specified without discussion. Has a known execution pattern. Skip Ideation, Planning, and Research.',
        '- Non-trivial: Requires exploration, trade-offs, or creative decomposition. Full 7-step workflow.',
        'When uncertain, default to non-trivial.',
        '',
        'STEP 2: For non-trivial or structured-routine tasks, initialize notes.',
        'Run: gobbi note init {{projectName}} <task-slug>',
        'The returned path is the note directory \u2014 pass it to every subagent.',
        '',
        'STEP 3: Create workflow task checklist.',
        'Use TaskCreate to create these tasks:',
        '  Step 1: Ideation \u2014 discuss, spawn PI agents (innovative + best), synthesize',
        '  Step 2: Planning \u2014 plan, discuss, evaluate, improve',
        '  Step 3: Research \u2014 spawn researchers (innovative + best), synthesize',
        '  Step 4: Execution \u2014 delegate subtasks to executors',
        '  Step 5: Collection \u2014 write notes, verify, record gotchas',
        '  Step 6: Memorization \u2014 save context for session continuity',
        '  Step 7: Review \u2014 spawn PI agents (innovative + best), verdict + docs',
        '  Phase transition \u2014 Ask user: FEEDBACK or FINISH?',
        '',
        'STEP 4: If git workflow is active ({{gitWorkflow}} = worktree-pr):',
        '- Verify gh CLI is authenticated: gh auth status',
        '- Verify base branch exists on remote: git ls-remote --heads origin {{baseBranch}}',
        '- Check for orphaned worktrees in {{projectDir}}/.claude/worktrees/',
        '- Create issue, worktree, and branch before first delegation',
        '',
        'Report your classification outcome.',
      ].join('\n'),
    },
  ],

  variables: {
    trivialRange: { source: 'config', path: 'trivialRange', required: true },
    evaluationMode: { source: 'config', path: 'evaluationMode', required: true },
    gitWorkflow: { source: 'config', path: 'gitWorkflow', required: true },
    baseBranch: { source: 'config', path: 'baseBranch', required: false, fallback: 'main' },
    projectName: { source: 'runtime', path: 'projectName', required: true },
    orchestrationGotchas: { source: 'runtime', path: 'orchestrationGotchas', required: false, fallback: 'No gotchas loaded.' },
    projectDir: { source: 'env', path: 'CLAUDE_PROJECT_DIR', required: true },
  },

  completion: {
    type: 'select-outcome',
    outcomes: [
      { id: 'trivial', description: 'Task is within trivial range \u2014 handle directly' },
      { id: 'structured-routine', description: 'Task follows a known pattern \u2014 skip ideation/plan/research' },
      { id: 'non-trivial', description: 'Task requires full 7-step workflow' },
    ],
  },

  transitions: {
    type: 'choice',
    choices: [
      { condition: { variable: 'taskTier', equals: 'trivial' }, next: '__terminal__' },
      { condition: { variable: 'taskTier', equals: 'structured-routine' }, next: 'gobbi prompt workflow-execution' },
    ],
    default: 'gobbi prompt workflow-ideation',
  },
};
