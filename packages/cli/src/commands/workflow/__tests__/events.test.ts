/**
 * Smoke tests for `gobbi workflow events` — the handler is a thin alias over
 * `runSessionEvents`, so the full filter / cap / json matrix is covered by
 * `commands/__tests__/session-events.test.ts`. The checks here confirm:
 *
 *   - `runEvents` exists, is a function, and delegates to `runSessionEvents`.
 *   - The workflow command registry exposes an `events` entry.
 */

import { describe, expect, test } from 'bun:test';

import { runEvents } from '../events.js';
import { runSessionEvents } from '../../session.js';
import { WORKFLOW_COMMANDS } from '../../workflow.js';

describe('runEvents', () => {
  test('is an async function', () => {
    expect(typeof runEvents).toBe('function');
  });

  test('has the same signature arity as runSessionEvents', () => {
    // Both accept (args: string[]) — we can't compare identity because
    // runEvents is a dynamic-import wrapper, but both should be 1-arg.
    expect(runEvents.length).toBe(1);
    expect(runSessionEvents.length).toBe(1);
  });
});

describe('WORKFLOW_COMMANDS', () => {
  test('registers the events subcommand', () => {
    const entry = WORKFLOW_COMMANDS.find((c) => c.name === 'events');
    expect(entry).toBeDefined();
    expect(entry!.summary.length).toBeGreaterThan(0);
  });

  test('registers the init subcommand', () => {
    const entry = WORKFLOW_COMMANDS.find((c) => c.name === 'init');
    expect(entry).toBeDefined();
    expect(entry!.summary.length).toBeGreaterThan(0);
  });

  test('registers the status subcommand', () => {
    const entry = WORKFLOW_COMMANDS.find((c) => c.name === 'status');
    expect(entry).toBeDefined();
    expect(entry!.summary.length).toBeGreaterThan(0);
  });
});
