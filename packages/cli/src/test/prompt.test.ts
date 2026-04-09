/**
 * Tests for the prompt architecture library.
 *
 * Covers type guards, state management, variable resolution,
 * renderer, template registry, and transition graph.
 *
 * Uses Node's built-in test runner (`node:test`) and strict assertions.
 * Run via: npm test (which compiles first, then runs the compiled JS).
 */

import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  isPromptPhase,
  isPromptSchema,
  isVariableSource,
  isPromptTemplate,
  VALID_PROMPT_PHASES,
} from '../lib/prompt/types.js';
import type { PromptTemplate } from '../lib/prompt/types.js';
import {
  emptyPromptState,
  readPromptState,
  writePromptStateAtomic,
  updatePromptHistory,
} from '../lib/prompt/state.js';
import {
  interpolate,
  resolveVariable,
  resolveAllVariables,
  PromptResolutionError,
} from '../lib/prompt/variables.js';
import { renderPrompt } from '../lib/prompt/renderer.js';
import { getTemplate } from '../lib/prompt/templates/index.js';
import { SESSION_START_TEMPLATE } from '../lib/prompt/templates/session-start.js';
import { WORKFLOW_START_TEMPLATE } from '../lib/prompt/templates/workflow-start.js';
import {
  TRANSITION_GRAPH,
  getTransitionNode,
  getNextPhase,
} from '../lib/prompt/graph.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gobbi-prompt-test-'));
}

function removeTempDir(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

/**
 * Construct a minimal valid PromptTemplate for renderer tests.
 * Kept separate from real templates to test the renderer independently.
 */
function minimalTemplate(): PromptTemplate {
  return {
    $schema: 'gobbi-prompt/session-start',
    version: '0.1.0',
    phase: 'session-start',
    layers: [
      { role: 'system', content: 'System instructions for {{mode}}.' },
      { role: 'context', content: 'Context: project={{project}}.' },
      { role: 'task', content: 'Do the {{action}} now.' },
    ],
    variables: {},
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'done', description: 'Task complete' },
        { id: 'retry', description: 'Need another attempt' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'done' }, next: 'workflow-start' },
      ],
      default: 'workflow-start',
    },
    askUser: [
      {
        question: 'Pick a color',
        options: [
          { label: 'Red', description: 'A warm color' },
          { label: 'Blue', description: 'A cool color' },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Type Guards
// ---------------------------------------------------------------------------

describe('type guards', () => {
  it('isPromptPhase accepts valid phases', () => {
    assert.equal(isPromptPhase('session-start'), true);
    assert.equal(isPromptPhase('workflow-start'), true);
    assert.equal(isPromptPhase('workflow-ideation'), true);
  });

  it('isPromptPhase rejects invalid strings', () => {
    assert.equal(isPromptPhase('invalid'), false);
    assert.equal(isPromptPhase(''), false);
    assert.equal(isPromptPhase('session_start'), false);
  });

  it('isPromptSchema accepts valid schema identifiers', () => {
    assert.equal(isPromptSchema('gobbi-prompt/session-start'), true);
  });

  it('isPromptSchema rejects invalid schema identifiers', () => {
    assert.equal(isPromptSchema('gobbi-docs/skill'), false);
    assert.equal(isPromptSchema('gobbi-prompt/invalid'), false);
  });

  it('isVariableSource accepts valid sources', () => {
    assert.equal(isVariableSource('env'), true);
    assert.equal(isVariableSource('config'), true);
    assert.equal(isVariableSource('file'), true);
    assert.equal(isVariableSource('runtime'), true);
  });

  it('isVariableSource rejects invalid sources', () => {
    assert.equal(isVariableSource('database'), false);
    assert.equal(isVariableSource(''), false);
  });

  it('isPromptTemplate accepts a well-formed template', () => {
    const template = minimalTemplate();
    assert.equal(isPromptTemplate(template), true);
  });

  it('isPromptTemplate rejects objects missing required fields', () => {
    // Missing $schema
    assert.equal(
      isPromptTemplate({ version: '0.1.0', phase: 'session-start', layers: [], variables: {} }),
      false,
    );

    // Missing version
    assert.equal(
      isPromptTemplate({ $schema: 'gobbi-prompt/session-start', phase: 'session-start', layers: [], variables: {} }),
      false,
    );

    // Not an object at all
    assert.equal(isPromptTemplate('not-an-object'), false);
    assert.equal(isPromptTemplate(null), false);
    assert.equal(isPromptTemplate(42), false);
  });
});

// ---------------------------------------------------------------------------
// Prompt State
// ---------------------------------------------------------------------------

describe('prompt state', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs) {
      removeTempDir(dir);
    }
    tempDirs.length = 0;
  });

  function track(dir: string): string {
    tempDirs.push(dir);
    return dir;
  }

  it('emptyPromptState returns correct shape', () => {
    const state = emptyPromptState();
    assert.ok(typeof state.version === 'string');
    assert.ok(typeof state.session === 'object');
    assert.ok(typeof state.project === 'object');
    assert.ok(typeof state.workflow === 'object');
    assert.ok(Array.isArray(state.history));
  });

  it('emptyPromptState history is empty array', () => {
    const state = emptyPromptState();
    assert.equal(state.history.length, 0);
  });

  it('emptyPromptState workflow.currentPhase is null', () => {
    const state = emptyPromptState();
    assert.equal(state.workflow.currentPhase, null);
  });

  it('write + read round-trip returns deep-equal state', async () => {
    const dir = track(createTempDir());
    const filePath = path.join(dir, 'prompt-state.json');
    const original = emptyPromptState();

    await writePromptStateAtomic(filePath, original);
    const loaded = await readPromptState(filePath);

    assert.deepEqual(loaded, original);
  });

  it('readPromptState returns null for missing file', async () => {
    const dir = track(createTempDir());
    const filePath = path.join(dir, 'does-not-exist.json');
    const result = await readPromptState(filePath);
    assert.equal(result, null);
  });

  it('readPromptState returns null for invalid JSON', async () => {
    const dir = track(createTempDir());
    const filePath = path.join(dir, 'bad.json');
    fs.writeFileSync(filePath, '{{not json at all}}', 'utf8');
    const result = await readPromptState(filePath);
    assert.equal(result, null);
  });

  it('updatePromptHistory appends entry with correct phase and outcome', () => {
    const state = emptyPromptState();
    const updated = updatePromptHistory(state, 'session-start', 'configured');

    assert.equal(updated.history.length, 1);
    const entry = updated.history[0];
    assert.ok(entry !== undefined);
    assert.equal(entry.phase, 'session-start');
    assert.equal(entry.outcome, 'configured');
    assert.ok(typeof entry.timestamp === 'string');
  });

  it('updatePromptHistory does not mutate input state', () => {
    const state = emptyPromptState();
    const historyLengthBefore = state.history.length;

    updatePromptHistory(state, 'session-start', 'configured');

    assert.equal(state.history.length, historyLengthBefore);
  });
});

// ---------------------------------------------------------------------------
// Variable Resolution
// ---------------------------------------------------------------------------

describe('variable resolution', () => {
  const tempDirs: string[] = [];
  const savedEnvVars: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs) {
      removeTempDir(dir);
    }
    tempDirs.length = 0;
    for (const key of savedEnvVars) {
      delete process.env[key];
    }
    savedEnvVars.length = 0;
  });

  function track(dir: string): string {
    tempDirs.push(dir);
    return dir;
  }

  function setEnv(key: string, value: string): void {
    process.env[key] = value;
    savedEnvVars.push(key);
  }

  it('interpolate replaces {{key}} with value from resolved map', () => {
    const result = interpolate('Hello {{name}}!', { name: 'world' });
    assert.equal(result, 'Hello world!');
  });

  it('interpolate handles multiple variables in one string', () => {
    const result = interpolate('{{a}} and {{b}}', { a: 'X', b: 'Y' });
    assert.equal(result, 'X and Y');
  });

  it('interpolate replaces unresolved references with empty string', () => {
    const result = interpolate('Hello {{missing}}!', {});
    assert.equal(result, 'Hello !');
  });

  it('interpolate leaves strings without {{}} unchanged', () => {
    const result = interpolate('no variables here', { key: 'value' });
    assert.equal(result, 'no variables here');
  });

  it('resolveVariable with env source reads from process.env', async () => {
    setEnv('GOBBI_TEST_VAR', 'test-value');

    const result = await resolveVariable(
      'testVar',
      { source: 'env', path: 'GOBBI_TEST_VAR', required: true },
      {},
    );

    assert.equal(result, 'test-value');
  });

  it('resolveVariable with runtime source reads from runtime values map', async () => {
    const result = await resolveVariable(
      'myRuntime',
      { source: 'runtime', path: 'myKey', required: true },
      { myKey: 'runtime-value' },
    );

    assert.equal(result, 'runtime-value');
  });

  it('resolveVariable with file source reads file content', async () => {
    const dir = track(createTempDir());
    const filePath = path.join(dir, 'test-content.txt');
    fs.writeFileSync(filePath, 'file-content-here', 'utf8');

    const result = await resolveVariable(
      'fileVar',
      { source: 'file', path: filePath, required: true },
      {},
    );

    assert.equal(result, 'file-content-here');
  });

  it('resolveVariable returns null for missing env var', async () => {
    // Ensure the env var does not exist
    delete process.env['GOBBI_NONEXISTENT_VAR_12345'];

    const result = await resolveVariable(
      'missingVar',
      { source: 'env', path: 'GOBBI_NONEXISTENT_VAR_12345', required: true },
      {},
    );

    assert.equal(result, null);
  });

  it('resolveAllVariables throws PromptResolutionError for required variable that fails', async () => {
    // Ensure the env var does not exist
    delete process.env['GOBBI_REQUIRED_MISSING'];

    await assert.rejects(
      () => resolveAllVariables(
        {
          missing: { source: 'env', path: 'GOBBI_REQUIRED_MISSING', required: true },
        },
        {},
      ),
      (err: unknown) => {
        assert.ok(err instanceof PromptResolutionError);
        assert.equal(err.variableName, 'missing');
        assert.equal(err.source, 'env');
        return true;
      },
    );
  });

  it('resolveAllVariables uses fallback for optional variable that fails', async () => {
    delete process.env['GOBBI_OPTIONAL_MISSING'];

    const resolved = await resolveAllVariables(
      {
        optional: {
          source: 'env',
          path: 'GOBBI_OPTIONAL_MISSING',
          required: false,
          fallback: 'default-value',
        },
      },
      {},
    );

    assert.equal(resolved['optional'], 'default-value');
  });
});

// ---------------------------------------------------------------------------
// Prompt Renderer
// ---------------------------------------------------------------------------

describe('prompt renderer', () => {
  const template = minimalTemplate();
  const resolved = { mode: 'test', project: 'gobbi', action: 'build' };

  it('plain text output contains [PHASE: header', () => {
    const output = renderPrompt(template, resolved, { markdown: false });
    assert.ok(output.includes('[PHASE:'));
  });

  it('plain text output contains --- SYSTEM ---, --- CONTEXT ---, --- TASK --- layer headers', () => {
    const output = renderPrompt(template, resolved, { markdown: false });
    assert.ok(output.includes('--- SYSTEM ---'));
    assert.ok(output.includes('--- CONTEXT ---'));
    assert.ok(output.includes('--- TASK ---'));
  });

  it('plain text output contains [COMPLETION: section', () => {
    const output = renderPrompt(template, resolved, { markdown: false });
    assert.ok(output.includes('[COMPLETION:'));
  });

  it('plain text output contains [NEXT STEPS] section', () => {
    const output = renderPrompt(template, resolved, { markdown: false });
    assert.ok(output.includes('[NEXT STEPS]'));
  });

  it('markdown output contains # Phase: header', () => {
    const output = renderPrompt(template, resolved, { markdown: true });
    assert.ok(output.includes('# Phase:'));
  });

  it('markdown output contains ## System, ## Context, ## Task headers', () => {
    const output = renderPrompt(template, resolved, { markdown: true });
    assert.ok(output.includes('## System'));
    assert.ok(output.includes('## Context'));
    assert.ok(output.includes('## Task'));
  });

  it('{{variables}} are replaced in rendered output', () => {
    const output = renderPrompt(template, resolved, { markdown: false });
    // Variables should be resolved — no raw {{}} in output
    assert.ok(!output.includes('{{mode}}'));
    assert.ok(!output.includes('{{project}}'));
    assert.ok(!output.includes('{{action}}'));
    // Resolved values should be present
    assert.ok(output.includes('test'));
    assert.ok(output.includes('gobbi'));
    assert.ok(output.includes('build'));
  });

  it('AskUser section renders question text and option labels', () => {
    const output = renderPrompt(template, resolved, { markdown: false });
    assert.ok(output.includes('Pick a color'));
    assert.ok(output.includes('Red'));
    assert.ok(output.includes('Blue'));
  });
});

// ---------------------------------------------------------------------------
// Prompt Templates
// ---------------------------------------------------------------------------

describe('prompt templates', () => {
  it('session-start template passes isPromptTemplate guard', () => {
    assert.equal(isPromptTemplate(SESSION_START_TEMPLATE), true);
  });

  it('workflow-start template passes isPromptTemplate guard', () => {
    assert.equal(isPromptTemplate(WORKFLOW_START_TEMPLATE), true);
  });

  it('getTemplate session-start returns a template', () => {
    const template = getTemplate('session-start');
    assert.ok(template !== undefined);
  });

  it('getTemplate workflow-start returns a template', () => {
    const template = getTemplate('workflow-start');
    assert.ok(template !== undefined);
  });

  it('getTemplate workflow-ideation returns undefined (not implemented)', () => {
    const template = getTemplate('workflow-ideation');
    assert.equal(template, undefined);
  });

  it('session-start template has 3 layers', () => {
    assert.equal(SESSION_START_TEMPLATE.layers.length, 3);
  });

  it('session-start template has askUser field with 4 questions', () => {
    assert.ok(SESSION_START_TEMPLATE.askUser !== undefined);
    assert.equal(SESSION_START_TEMPLATE.askUser.length, 4);
  });

  it('workflow-start template has 3 completion outcomes', () => {
    assert.equal(WORKFLOW_START_TEMPLATE.completion.outcomes.length, 3);
  });
});

// ---------------------------------------------------------------------------
// Transition Graph
// ---------------------------------------------------------------------------

describe('transition graph', () => {
  it('every phase in VALID_PROMPT_PHASES has a node in the graph', () => {
    for (const phase of VALID_PROMPT_PHASES) {
      assert.ok(
        phase in TRANSITION_GRAPH,
        `Missing graph node for phase: ${phase}`,
      );
    }
  });

  it('getTransitionNode session-start returns a node', () => {
    const node = getTransitionNode('session-start');
    assert.ok(node !== undefined);
    assert.equal(node.phase, 'session-start');
  });

  it('getTransitionNode returns undefined for invalid phase', () => {
    // Cast to satisfy TypeScript — testing runtime behavior for bad input
    const node = getTransitionNode('not-a-phase' as 'session-start');
    assert.equal(node, undefined);
  });

  it('getNextPhase session-start configured returns workflow-start', () => {
    const next = getNextPhase('session-start', 'configured');
    assert.equal(next, 'workflow-start');
  });

  it('getNextPhase workflow-start non-trivial returns workflow-ideation', () => {
    const next = getNextPhase('workflow-start', 'non-trivial');
    assert.equal(next, 'workflow-ideation');
  });
});
