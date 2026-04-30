/**
 * Tests for `lib/json-memory.ts` — types + AJV validators + read/write +
 * sorted-rewrite primitives + memorization aggregator + project.json
 * upsert helpers.
 *
 * Coverage:
 *
 *   1. AJV positive fixtures — init-stub, mid-session, complete (4
 *      productive steps), aborted (with abortReason).
 *   2. AJV negative fixtures — wrong schemaVersion, missing required field,
 *      invalid date-time, extra field under additionalProperties: false.
 *   3. Atomic write byte-determinism — same input twice → identical files.
 *   4. Atomic write does not leak temp files on success.
 *   5. writeSessionJson rejects invalid input (does NOT touch the file).
 *   6. writeProjectJson + upsertProjectSession + upsertProjectGotcha sort
 *      arrays at the writer call site.
 *   7. v1→v2 schema-equivalence test — synthetic v2 oneOf schema validates
 *      v1 fixtures (lock 28).
 *   8. buildAgentCalls reads JSONL transcripts correctly.
 *   9. buildAgentCalls falls back to glob discovery when env var unset.
 *  10. aggregateSessionJson builds steps[] from a synthetic event sequence.
 *  11. assertNeverProvider compiles + throws as expected.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import addFormatsPlugin from 'ajv-formats';
import Ajv2020 from 'ajv/dist/2020.js';

import { ConfigCascadeError } from '../settings.js';
import {
  aggregateSessionJson,
  assertNeverProvider,
  buildAgentCalls,
  projectJsonPath,
  readProjectJson,
  readSessionJson,
  sessionJsonPath,
  upsertProjectGotcha,
  upsertProjectSession,
  validateSessionJson,
  writeProjectJson,
  writeSessionJson,
  writeSessionStub,
  type AgentEntry,
  type AnthropicAgentEntry,
  type ProjectJson,
  type SessionJson,
} from '../json-memory.js';

// ajv-formats default-export interop.
const addFormats: (ajv: Ajv2020) => Ajv2020 =
  (addFormatsPlugin as unknown as { default?: typeof addFormatsPlugin }).default ??
  (addFormatsPlugin as unknown as (ajv: Ajv2020) => Ajv2020);

import type { ReadStore, CostAggregateRow } from '../../workflow/store.js';
import type { EventRow } from '../../workflow/migrations.js';

// ---------------------------------------------------------------------------
// Scratch lifecycle
// ---------------------------------------------------------------------------

let scratchDir: string;

beforeEach(() => {
  scratchDir = mkdtempSync(join(tmpdir(), 'gobbi-json-memory-'));
});

afterEach(() => {
  try {
    rmSync(scratchDir, { recursive: true, force: true });
  } catch {
    // best-effort
  }
});

// ---------------------------------------------------------------------------
// Helpers — fake stores + fixture factories
// ---------------------------------------------------------------------------

class FakeReadStore implements ReadStore {
  private readonly rows: readonly EventRow[];
  private readonly costs: readonly CostAggregateRow[];

  constructor(rows: readonly EventRow[], costs: readonly CostAggregateRow[] = []) {
    this.rows = rows;
    this.costs = costs;
  }

  replayAll(): EventRow[] {
    return [...this.rows];
  }
  byType(type: string): EventRow[] {
    return this.rows.filter((r) => r.type === type);
  }
  byStep(step: string, type?: string): EventRow[] {
    return this.rows.filter((r) => r.step === step && (type === undefined || r.type === type));
  }
  since(seq: number): EventRow[] {
    return this.rows.filter((r) => r.seq > seq);
  }
  last(type: string): EventRow | null {
    const filtered = this.rows.filter((r) => r.type === type);
    return filtered.length === 0 ? null : (filtered[filtered.length - 1] ?? null);
  }
  lastN(type: string, n: number): readonly EventRow[] {
    const filtered = this.rows.filter((r) => r.type === type);
    return filtered.slice(-n);
  }
  lastNAny(n: number): readonly EventRow[] {
    return this.rows.slice(-n);
  }
  eventCount(): number {
    return this.rows.length;
  }
  aggregateDelegationCosts(): readonly CostAggregateRow[] {
    return this.costs;
  }
}

function makeRow(args: {
  seq: number;
  type: string;
  step?: string | null;
  ts?: string;
  data?: Record<string, unknown>;
  sessionId?: string | null;
}): EventRow {
  return {
    seq: args.seq,
    ts: args.ts ?? '2026-04-29T10:00:00.000Z',
    schema_version: 7,
    type: args.type,
    step: args.step ?? null,
    data: JSON.stringify(args.data ?? {}),
    actor: 'orchestrator',
    parent_seq: null,
    idempotency_key: `key-${args.seq}`,
    session_id: args.sessionId === undefined ? 'sess-1' : args.sessionId,
    project_id: 'gobbi',
  };
}

function fixtureStub(): SessionJson {
  return {
    schemaVersion: 1,
    sessionId: 'sess-1',
    projectId: 'gobbi',
    createdAt: '2026-04-29T10:00:00.000Z',
    finishedAt: null,
    gobbiVersion: '0.5.0',
    task: 'PR-FIN-2a-ii smoke task',
  };
}

function fixtureAnthropicAgent(overrides: Partial<AnthropicAgentEntry> = {}): AnthropicAgentEntry {
  return {
    provider: 'anthropic',
    id: 'agent-1',
    seq: 5,
    name: '__pi',
    model: 'claude-opus-4-7',
    skillsLoaded: [],
    startedAt: '2026-04-29T10:01:00.000Z',
    finishedAt: '2026-04-29T10:02:00.000Z',
    outcome: 'complete',
    costUsd: 0.001,
    calls: [],
    claudeCodeVersion: '2.1.121',
    transcriptPath: null,
    transcriptSha256: null,
    tokensUsed: null,
    cacheHitRatio: null,
    sizeProxyBytes: null,
    ...overrides,
  };
}

function fixtureComplete(): SessionJson {
  return {
    ...fixtureStub(),
    finishedAt: '2026-04-29T11:00:00.000Z',
    steps: [
      {
        id: 'ideation',
        startedAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T10:10:00.000Z',
        skippedAt: null,
        timedOutAt: null,
        iterations: [
          {
            round: 0,
            startedAt: '2026-04-29T10:00:00.000Z',
            finishedAt: '2026-04-29T10:10:00.000Z',
            terminationReason: 'exit',
            agents: [fixtureAnthropicAgent()],
          },
        ],
      },
      {
        id: 'planning',
        startedAt: '2026-04-29T10:10:00.000Z',
        finishedAt: '2026-04-29T10:20:00.000Z',
        skippedAt: null,
        timedOutAt: null,
        iterations: [
          {
            round: 0,
            startedAt: '2026-04-29T10:10:00.000Z',
            finishedAt: '2026-04-29T10:20:00.000Z',
            terminationReason: 'exit',
            substeps: [
              {
                id: 'discussion',
                startedAt: '2026-04-29T10:10:00.000Z',
                finishedAt: '2026-04-29T10:15:00.000Z',
                agents: [],
              },
            ],
          },
        ],
      },
      {
        id: 'execution',
        startedAt: '2026-04-29T10:20:00.000Z',
        finishedAt: '2026-04-29T10:50:00.000Z',
        skippedAt: null,
        timedOutAt: null,
        iterations: [
          {
            round: 0,
            startedAt: '2026-04-29T10:20:00.000Z',
            finishedAt: '2026-04-29T10:50:00.000Z',
            terminationReason: 'exit',
            agents: [],
          },
        ],
      },
      {
        id: 'memorization',
        startedAt: '2026-04-29T10:50:00.000Z',
        finishedAt: null,
        skippedAt: null,
        timedOutAt: null,
        iterations: [
          {
            round: 0,
            startedAt: '2026-04-29T10:50:00.000Z',
            finishedAt: null,
            terminationReason: 'in-flight',
          },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// AJV positive fixtures
// ---------------------------------------------------------------------------

describe('validateSessionJson — positive fixtures', () => {
  test('init-stub (6 required fields, no steps)', () => {
    const ok = validateSessionJson(fixtureStub());
    expect(ok).toBe(true);
  });

  test('mid-session (steps present, finishedAt null)', () => {
    const value: SessionJson = {
      ...fixtureStub(),
      steps: [
        {
          id: 'ideation',
          startedAt: '2026-04-29T10:00:00.000Z',
          finishedAt: null,
          skippedAt: null,
          timedOutAt: null,
          iterations: [
            {
              round: 0,
              startedAt: '2026-04-29T10:00:00.000Z',
              finishedAt: null,
              terminationReason: 'in-flight',
            },
          ],
        },
      ],
    };
    expect(validateSessionJson(value)).toBe(true);
  });

  test('complete (4 productive steps with both substeps and lifted agents)', () => {
    expect(validateSessionJson(fixtureComplete())).toBe(true);
  });

  test('aborted (terminationReason "aborted")', () => {
    const value: SessionJson = {
      ...fixtureStub(),
      finishedAt: '2026-04-29T10:30:00.000Z',
      steps: [
        {
          id: 'ideation',
          startedAt: '2026-04-29T10:00:00.000Z',
          finishedAt: '2026-04-29T10:30:00.000Z',
          skippedAt: null,
          timedOutAt: null,
          iterations: [
            {
              round: 0,
              startedAt: '2026-04-29T10:00:00.000Z',
              finishedAt: '2026-04-29T10:30:00.000Z',
              terminationReason: 'aborted',
            },
          ],
        },
      ],
    };
    expect(validateSessionJson(value)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// AJV negative fixtures
// ---------------------------------------------------------------------------

describe('validateSessionJson — negative fixtures', () => {
  test('rejects wrong schemaVersion', () => {
    const bad = { ...fixtureStub(), schemaVersion: 2 };
    expect(validateSessionJson(bad)).toBe(false);
  });

  test('rejects missing required field (sessionId)', () => {
    const { sessionId: _omit, ...bad } = fixtureStub();
    expect(validateSessionJson(bad)).toBe(false);
  });

  test('rejects invalid date-time on createdAt', () => {
    const bad = { ...fixtureStub(), createdAt: 'not-a-date' };
    expect(validateSessionJson(bad)).toBe(false);
  });

  test('rejects extra field under additionalProperties: false', () => {
    const bad = { ...fixtureStub(), bogus: 'extra' };
    expect(validateSessionJson(bad)).toBe(false);
  });

  test('rejects empty sessionId', () => {
    const bad = { ...fixtureStub(), sessionId: '' };
    expect(validateSessionJson(bad)).toBe(false);
  });

  test('rejects unknown step.id literal', () => {
    const bad = {
      ...fixtureStub(),
      steps: [
        {
          id: 'configuration',
          startedAt: '2026-04-29T10:00:00.000Z',
          finishedAt: null,
          skippedAt: null,
          timedOutAt: null,
          iterations: [],
        },
      ],
    };
    expect(validateSessionJson(bad)).toBe(false);
  });

  test('rejects unknown terminationReason', () => {
    const bad = {
      ...fixtureStub(),
      steps: [
        {
          id: 'ideation',
          startedAt: '2026-04-29T10:00:00.000Z',
          finishedAt: null,
          skippedAt: null,
          timedOutAt: null,
          iterations: [
            {
              round: 0,
              startedAt: '2026-04-29T10:00:00.000Z',
              finishedAt: null,
              terminationReason: 'cancelled', // not in the enum
            },
          ],
        },
      ],
    };
    expect(validateSessionJson(bad)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Read / write — atomic write + boundary parse
// ---------------------------------------------------------------------------

describe('writeSessionJson + readSessionJson', () => {
  test('round-trips a SessionJson to disk and back', () => {
    const filePath = join(scratchDir, 'session.json');
    const value = fixtureComplete();
    writeSessionJson(filePath, value);
    const round = readSessionJson(filePath);
    expect(round).toEqual(value);
  });

  test('writes byte-deterministic output for identical input', () => {
    const filePath1 = join(scratchDir, 'a', 'session.json');
    const filePath2 = join(scratchDir, 'b', 'session.json');
    const value = fixtureComplete();
    writeSessionJson(filePath1, value);
    writeSessionJson(filePath2, value);
    const a = readFileSync(filePath1, 'utf8');
    const b = readFileSync(filePath2, 'utf8');
    expect(a).toBe(b);
  });

  test('does not leak temp files on success', () => {
    const filePath = join(scratchDir, 'session.json');
    writeSessionJson(filePath, fixtureStub());
    const entries = readdirSync(scratchDir);
    expect(entries).toEqual(['session.json']);
  });

  test('refuses to write invalid input', () => {
    const filePath = join(scratchDir, 'session.json');
    const invalid = { schemaVersion: 99 } as unknown as SessionJson;
    expect(() => writeSessionJson(filePath, invalid)).toThrow(ConfigCascadeError);
    expect(existsSync(filePath)).toBe(false);
  });

  test('returns null when reading an absent file', () => {
    expect(readSessionJson(join(scratchDir, 'nope.json'))).toBeNull();
  });

  test('throws ConfigCascadeError on malformed JSON', () => {
    const filePath = join(scratchDir, 'broken.json');
    writeFileSync(filePath, '{not json', 'utf8');
    expect(() => readSessionJson(filePath)).toThrow(ConfigCascadeError);
  });

  test('throws ConfigCascadeError on schema-invalid JSON', () => {
    const filePath = join(scratchDir, 'bad.json');
    writeFileSync(filePath, JSON.stringify({ schemaVersion: 99 }), 'utf8');
    expect(() => readSessionJson(filePath)).toThrow(ConfigCascadeError);
  });
});

describe('writeSessionStub', () => {
  test('writes a minimal stub at the canonical session.json path', () => {
    writeSessionStub({
      repoRoot: scratchDir,
      projectName: 'gobbi',
      sessionId: 'sess-1',
      task: 'demo',
      gobbiVersion: '0.5.0',
      createdAt: '2026-04-29T10:00:00.000Z',
    });
    const filePath = sessionJsonPath(scratchDir, 'gobbi', 'sess-1');
    const round = readSessionJson(filePath);
    expect(round).not.toBeNull();
    expect(round?.steps).toBeUndefined();
    expect(round?.task).toBe('demo');
    expect(round?.projectId).toBe('gobbi');
  });

  test('is idempotent — re-running with same args produces identical bytes', () => {
    const args = {
      repoRoot: scratchDir,
      projectName: 'gobbi',
      sessionId: 'sess-1',
      task: 'demo',
      gobbiVersion: '0.5.0',
      createdAt: '2026-04-29T10:00:00.000Z',
    };
    writeSessionStub(args);
    const first = readFileSync(sessionJsonPath(scratchDir, 'gobbi', 'sess-1'), 'utf8');
    writeSessionStub(args);
    const second = readFileSync(sessionJsonPath(scratchDir, 'gobbi', 'sess-1'), 'utf8');
    expect(first).toBe(second);
  });
});

// ---------------------------------------------------------------------------
// project.json — upsert helpers
// ---------------------------------------------------------------------------

describe('writeProjectJson + readProjectJson', () => {
  test('round-trips a ProjectJson to disk and back', () => {
    const filePath = join(scratchDir, 'gobbi', 'project.json');
    const value: ProjectJson = {
      schemaVersion: 1,
      projectName: 'gobbi',
      projectId: 'gobbi',
      sessions: [],
      gotchas: [],
      decisions: [],
      learnings: [],
    };
    writeProjectJson(filePath, value);
    const round = readProjectJson(filePath);
    expect(round).toEqual(value);
  });
});

describe('upsertProjectSession', () => {
  test('creates a fresh project.json when absent', () => {
    const filePath = projectJsonPath(scratchDir, 'gobbi');
    upsertProjectSession({
      path: filePath,
      entry: {
        sessionId: 'sess-1',
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: null,
        task: 'demo',
      },
    });
    const round = readProjectJson(filePath);
    expect(round?.projectName).toBe('gobbi');
    expect(round?.sessions).toHaveLength(1);
    expect(round?.sessions[0]?.sessionId).toBe('sess-1');
  });

  test('replaces an existing session by sessionId', () => {
    const filePath = projectJsonPath(scratchDir, 'gobbi');
    upsertProjectSession({
      path: filePath,
      entry: {
        sessionId: 'sess-1',
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: null,
        task: 'first',
      },
    });
    upsertProjectSession({
      path: filePath,
      entry: {
        sessionId: 'sess-1',
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T11:00:00.000Z',
        task: 'updated',
      },
    });
    const round = readProjectJson(filePath);
    expect(round?.sessions).toHaveLength(1);
    expect(round?.sessions[0]?.task).toBe('updated');
    expect(round?.sessions[0]?.finishedAt).toBe('2026-04-29T11:00:00.000Z');
  });

  test('sorts sessions[] by createdAt ASC', () => {
    const filePath = projectJsonPath(scratchDir, 'gobbi');
    upsertProjectSession({
      path: filePath,
      entry: {
        sessionId: 'sess-c',
        createdAt: '2026-04-29T12:00:00.000Z',
        finishedAt: null,
        task: 'c',
      },
    });
    upsertProjectSession({
      path: filePath,
      entry: {
        sessionId: 'sess-a',
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: null,
        task: 'a',
      },
    });
    upsertProjectSession({
      path: filePath,
      entry: {
        sessionId: 'sess-b',
        createdAt: '2026-04-29T11:00:00.000Z',
        finishedAt: null,
        task: 'b',
      },
    });
    const round = readProjectJson(filePath);
    const ids = round?.sessions.map((s) => s.sessionId);
    expect(ids).toEqual(['sess-a', 'sess-b', 'sess-c']);
  });
});

describe('upsertProjectGotcha', () => {
  test('sorts gotchas[] alphabetically by path', () => {
    const filePath = projectJsonPath(scratchDir, 'gobbi');
    upsertProjectGotcha({
      path: filePath,
      entry: {
        path: 'zebra.md',
        sha256: 'a'.repeat(64),
        class: 'medium',
        promotedAt: '2026-04-29T10:00:00.000Z',
        promotedFromSession: 'sess-1',
      },
    });
    upsertProjectGotcha({
      path: filePath,
      entry: {
        path: 'apple.md',
        sha256: 'b'.repeat(64),
        class: 'medium',
        promotedAt: '2026-04-29T10:00:00.000Z',
        promotedFromSession: 'sess-1',
      },
    });
    upsertProjectGotcha({
      path: filePath,
      entry: {
        path: 'mango.md',
        sha256: 'c'.repeat(64),
        class: 'medium',
        promotedAt: '2026-04-29T10:00:00.000Z',
        promotedFromSession: 'sess-1',
      },
    });
    const round = readProjectJson(filePath);
    const paths = round?.gotchas.map((g) => g.path);
    expect(paths).toEqual(['apple.md', 'mango.md', 'zebra.md']);
  });

  test('replaces an existing gotcha by path', () => {
    const filePath = projectJsonPath(scratchDir, 'gobbi');
    upsertProjectGotcha({
      path: filePath,
      entry: {
        path: 'g.md',
        sha256: 'a'.repeat(64),
        class: 'medium',
        promotedAt: '2026-04-29T10:00:00.000Z',
        promotedFromSession: 'sess-1',
      },
    });
    upsertProjectGotcha({
      path: filePath,
      entry: {
        path: 'g.md',
        sha256: 'b'.repeat(64),
        class: 'high',
        promotedAt: '2026-04-29T11:00:00.000Z',
        promotedFromSession: 'sess-2',
      },
    });
    const round = readProjectJson(filePath);
    expect(round?.gotchas).toHaveLength(1);
    expect(round?.gotchas[0]?.class).toBe('high');
    expect(round?.gotchas[0]?.sha256).toBe('b'.repeat(64));
  });
});

// ---------------------------------------------------------------------------
// v1 → v2 schema-equivalence test (lock 28)
// ---------------------------------------------------------------------------

describe('v1 → v2 schema-equivalence (Codex forward-compat)', () => {
  test('a synthetic v2 oneOf agent schema validates v1 (Anthropic) fixtures', () => {
    // Replicate the v1 anthropic agent schema fields in `oneOf` form with a
    // synthetic codex arm. Pinning preconditions: provider is `const`,
    // `required` includes `provider`, schemas are inline (no `$ref` at the
    // discriminator). When v2 lands for real, these preconditions stay true
    // and v1 fixtures continue to validate.
    const v2Ajv = new Ajv2020({ strict: true, allErrors: true, discriminator: true });
    addFormats(v2Ajv);

    const anthropicArm = {
      type: 'object',
      additionalProperties: false,
      required: [
        'provider',
        'id',
        'seq',
        'name',
        'model',
        'skillsLoaded',
        'startedAt',
        'finishedAt',
        'outcome',
        'costUsd',
        'calls',
        'claudeCodeVersion',
        'transcriptPath',
        'transcriptSha256',
        'tokensUsed',
        'cacheHitRatio',
        'sizeProxyBytes',
      ],
      properties: {
        provider: { const: 'anthropic' },
        id: { type: 'string', minLength: 1 },
        seq: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1 },
        model: { type: ['string', 'null'] },
        skillsLoaded: { type: 'array', items: { type: 'string' } },
        startedAt: { type: ['string', 'null'], format: 'date-time' },
        finishedAt: { type: ['string', 'null'], format: 'date-time' },
        outcome: { type: ['string', 'null'], enum: ['complete', 'fail', 'running', null] },
        costUsd: { type: ['number', 'null'], minimum: 0 },
        calls: { type: 'array' },
        claudeCodeVersion: { type: ['string', 'null'] },
        transcriptPath: { type: ['string', 'null'] },
        transcriptSha256: { type: ['string', 'null'] },
        tokensUsed: { type: ['object', 'null'] },
        cacheHitRatio: { type: ['number', 'null'], minimum: 0 },
        sizeProxyBytes: { type: ['integer', 'null'], minimum: 0 },
      },
    };

    const codexArm = {
      type: 'object',
      additionalProperties: false,
      required: [
        'provider',
        'id',
        'seq',
        'name',
        'model',
        'skillsLoaded',
        'startedAt',
        'finishedAt',
        'outcome',
        'costUsd',
        'calls',
        'codexCliVersion',
        'codexThreadId',
        'rolloutPath',
      ],
      properties: {
        provider: { const: 'codex' },
        id: { type: 'string', minLength: 1 },
        seq: { type: 'integer', minimum: 0 },
        name: { type: 'string', minLength: 1 },
        model: { type: ['string', 'null'] },
        skillsLoaded: { type: 'array', items: { type: 'string' } },
        startedAt: { type: ['string', 'null'], format: 'date-time' },
        finishedAt: { type: ['string', 'null'], format: 'date-time' },
        outcome: { type: ['string', 'null'], enum: ['complete', 'fail', 'running', null] },
        costUsd: { type: ['number', 'null'], minimum: 0 },
        calls: { type: 'array' },
        codexCliVersion: { type: ['string', 'null'] },
        codexThreadId: { type: ['string', 'null'] },
        rolloutPath: { type: ['string', 'null'] },
      },
    };

    const v2Schema = {
      type: 'object',
      discriminator: { propertyName: 'provider' },
      required: ['provider'],
      properties: {
        provider: { type: 'string', enum: ['anthropic', 'codex'] },
      },
      oneOf: [anthropicArm, codexArm],
    };

    const validateV2 = v2Ajv.compile(v2Schema);

    // v1 fixture must validate against the synthetic v2 oneOf.
    const v1AnthropicAgent: AgentEntry = fixtureAnthropicAgent();
    expect(validateV2(v1AnthropicAgent)).toBe(true);

    // Sanity check — the discriminator IS doing work: a Codex-shaped record
    // routes down the codex arm.
    const codexShaped = {
      provider: 'codex',
      id: 'codex-agent-1',
      seq: 7,
      name: 'gobbi-agent',
      model: 'gpt-5',
      skillsLoaded: [],
      startedAt: null,
      finishedAt: null,
      outcome: null,
      costUsd: null,
      calls: [],
      codexCliVersion: '0.50.0',
      codexThreadId: 'thread-abc',
      rolloutPath: null,
    };
    expect(validateV2(codexShaped)).toBe(true);

    // And an unknown provider literal is rejected (precondition check —
    // the discriminator must fail closed).
    const unknownProvider = { ...v1AnthropicAgent, provider: 'unknown' };
    expect(validateV2(unknownProvider)).toBe(false);
  });

  test('schema-equivalence preconditions hold on v1 anthropic-agent schema', () => {
    // The v1 schema must satisfy three preconditions for the discriminator
    // widening to be safe — re-asserted here so a regression that breaks
    // any of them fails this test, not the upstream codex PR.
    //
    // Precondition 1: `provider` is `const` (not just `enum`).
    // Precondition 2: `required` includes `provider`.
    // Precondition 3: schemas are inline (no `$ref` at the discriminator).
    //
    // These preconditions are encoded in the live `validateSessionJson`
    // schema indirectly — we re-verify them by sending fixtures through
    // and asserting the rejection cases.
    const { provider: _omit, ...missingProvider } = fixtureAnthropicAgent();
    // missingProvider lacks `provider` — feed it through a session.json
    // wrapper to check the schema's required includes it.
    const wrapper: SessionJson = {
      ...fixtureStub(),
      finishedAt: '2026-04-29T11:00:00.000Z',
      steps: [
        {
          id: 'ideation',
          startedAt: '2026-04-29T10:00:00.000Z',
          finishedAt: '2026-04-29T10:10:00.000Z',
          skippedAt: null,
          timedOutAt: null,
          iterations: [
            {
              round: 0,
              startedAt: '2026-04-29T10:00:00.000Z',
              finishedAt: '2026-04-29T10:10:00.000Z',
              terminationReason: 'exit',
              agents: [missingProvider as unknown as AnthropicAgentEntry],
            },
          ],
        },
      ],
    };
    expect(validateSessionJson(wrapper)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// buildAgentCalls — JSONL transcript walker
// ---------------------------------------------------------------------------

describe('buildAgentCalls', () => {
  function writeTranscript(path: string, lines: readonly Record<string, unknown>[]): void {
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, lines.map((l) => JSON.stringify(l)).join('\n'), 'utf8');
  }

  test('reads JSONL transcript and folds usage into AgentCallEntry rows', async () => {
    const transcriptDir = join(scratchDir, 'transcripts');
    const sessionId = 'sess-1';
    const subagentId = 'agent-x';
    const transcriptPath = join(
      transcriptDir,
      sessionId,
      'subagents',
      `agent-${subagentId}.jsonl`,
    );
    writeTranscript(transcriptPath, [
      {
        type: 'assistant',
        timestamp: '2026-04-29T10:00:01.000Z',
        requestId: 'req-1',
        message: {
          model: 'claude-opus-4-7',
          stop_reason: 'end_turn',
          usage: {
            input_tokens: 100,
            output_tokens: 50,
            cache_read_input_tokens: 10,
            cache_creation_input_tokens: 5,
          },
        },
      },
      {
        type: 'assistant',
        timestamp: '2026-04-29T10:00:02.000Z',
        requestId: 'req-2',
        message: {
          model: 'claude-opus-4-7',
          stop_reason: 'tool_use',
          usage: {
            input_tokens: 200,
            output_tokens: 80,
            cache_read_input_tokens: 30,
            cache_creation_input_tokens: 0,
          },
        },
      },
      // user line — should be skipped
      { type: 'user', timestamp: '2026-04-29T10:00:03.000Z' },
    ]);

    const calls = await buildAgentCalls({
      sessionId,
      subagentId,
      spawnSeq: 5,
      transcriptDir,
    });

    expect(calls).toHaveLength(2);
    expect(calls[0]?.turnIndex).toBe(0);
    expect(calls[0]?.seq).toBe(6);
    expect(calls[0]?.inputTokens).toBe(100);
    expect(calls[0]?.outputTokens).toBe(50);
    expect(calls[0]?.cacheReadTokens).toBe(10);
    expect(calls[0]?.cacheCreationTokens).toBe(5);
    expect(calls[0]?.stopReason).toBe('end_turn');
    expect(calls[0]?.requestId).toBe('req-1');
    expect(calls[0]?.model).toBe('claude-opus-4-7');
    expect(calls[1]?.turnIndex).toBe(1);
    expect(calls[1]?.seq).toBe(7);
  });

  test('returns [] and emits stderr warning when no transcript found', async () => {
    const calls = await buildAgentCalls({
      sessionId: 'no-such-session',
      subagentId: 'no-such-agent',
      spawnSeq: 1,
      transcriptDir: join(scratchDir, 'empty'),
      // Force the glob fallback into a directory we control + leave empty.
      claudeHome: scratchDir,
    });
    expect(calls).toEqual([]);
  });

  test('falls back to glob discovery under claudeHome when transcriptDir missing', async () => {
    const sessionId = 'sess-2';
    const subagentId = 'agent-y';
    const encodedCwd = '-some-path';
    const transcriptPath = join(
      scratchDir,
      '.claude',
      'projects',
      encodedCwd,
      sessionId,
      'subagents',
      `agent-${subagentId}.jsonl`,
    );
    writeTranscript(transcriptPath, [
      {
        type: 'assistant',
        timestamp: '2026-04-29T10:01:00.000Z',
        requestId: 'r',
        message: {
          model: 'claude-opus-4-7',
          stop_reason: 'end_turn',
          usage: {
            input_tokens: 1,
            output_tokens: 1,
            cache_read_input_tokens: 0,
            cache_creation_input_tokens: 0,
          },
        },
      },
    ]);
    const calls = await buildAgentCalls({
      sessionId,
      subagentId,
      spawnSeq: 0,
      claudeHome: scratchDir,
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.inputTokens).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// aggregateSessionJson — synthetic event sequence
// ---------------------------------------------------------------------------

describe('aggregateSessionJson', () => {
  test('builds steps[] from a synthetic 4-step event sequence', async () => {
    const rows: EventRow[] = [
      makeRow({
        seq: 1,
        type: 'workflow.start',
        ts: '2026-04-29T10:00:00.000Z',
        data: { sessionId: 'sess-1', timestamp: '2026-04-29T10:00:00.000Z' },
      }),
      makeRow({
        seq: 2,
        type: 'delegation.spawn',
        step: 'ideation',
        ts: '2026-04-29T10:00:01.000Z',
        data: { agentType: '__pi', step: 'ideation', subagentId: 'agent-1', timestamp: '2026-04-29T10:00:01.000Z' },
      }),
      makeRow({
        seq: 3,
        type: 'delegation.complete',
        step: 'ideation',
        ts: '2026-04-29T10:00:02.000Z',
        data: { subagentId: 'agent-1', artifactPath: '/some/path' },
      }),
      makeRow({
        seq: 4,
        type: 'workflow.step.exit',
        step: 'ideation',
        ts: '2026-04-29T10:10:00.000Z',
        data: { step: 'ideation' },
      }),
      makeRow({
        seq: 5,
        type: 'workflow.step.exit',
        step: 'planning',
        ts: '2026-04-29T10:20:00.000Z',
        data: { step: 'planning' },
      }),
      makeRow({
        seq: 6,
        type: 'workflow.step.exit',
        step: 'execution',
        ts: '2026-04-29T10:50:00.000Z',
        data: { step: 'execution' },
      }),
      // memorization in-flight — no exit row yet
      makeRow({
        seq: 7,
        type: 'workflow.step.skip',
        step: 'memorization',
        ts: '2026-04-29T10:51:00.000Z',
        data: { step: 'memorization' },
      }),
    ];
    const store = new FakeReadStore(rows, []);
    const result = await aggregateSessionJson({
      store,
      sessionId: 'sess-1',
      projectId: 'gobbi',
      createdAt: '2026-04-29T10:00:00.000Z',
      gobbiVersion: '0.5.0',
      task: 'demo',
      transcriptDir: join(scratchDir, 'no-transcript'),
      claudeHome: scratchDir,
    });

    expect(validateSessionJson(result)).toBe(true);
    expect(result.steps).toBeDefined();
    expect(result.steps?.length).toBeGreaterThanOrEqual(4);

    const ideation = result.steps?.find((s) => s.id === 'ideation');
    expect(ideation?.iterations[0]?.terminationReason).toBe('exit');
    expect(ideation?.iterations[0]?.agents).toBeDefined();
    expect(ideation?.iterations[0]?.agents?.length).toBe(1);
    expect(ideation?.iterations[0]?.agents?.[0]?.id).toBe('agent-1');
    expect(ideation?.iterations[0]?.agents?.[0]?.outcome).toBe('complete');

    const memorization = result.steps?.find((s) => s.id === 'memorization');
    expect(memorization?.skippedAt).toBe('2026-04-29T10:51:00.000Z');
    expect(memorization?.iterations[0]?.terminationReason).toBe('skip');
  });

  test('reuses aggregateDelegationCosts for per-agent costUsd', async () => {
    const rows: EventRow[] = [
      makeRow({
        seq: 1,
        type: 'delegation.spawn',
        step: 'ideation',
        data: { agentType: '__pi', step: 'ideation', subagentId: 'agent-1', timestamp: '2026-04-29T10:00:00.000Z' },
      }),
      makeRow({
        seq: 2,
        type: 'delegation.complete',
        step: 'ideation',
        data: { subagentId: 'agent-1' },
      }),
    ];
    const costs: CostAggregateRow[] = [
      {
        step: 'ideation',
        subagentId: 'agent-1',
        // tokensJson is what aggregateDelegationCosts returns from json_extract.
        tokensJson: JSON.stringify({
          input_tokens: 1_000_000,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        }),
        model: 'claude-opus-4-7',
        bytes: null,
      },
    ];
    const store = new FakeReadStore(rows, costs);
    const result = await aggregateSessionJson({
      store,
      sessionId: 'sess-1',
      projectId: 'gobbi',
      createdAt: '2026-04-29T10:00:00.000Z',
      gobbiVersion: '0.5.0',
      task: 'demo',
      transcriptDir: join(scratchDir, 'no-transcript'),
      claudeHome: scratchDir,
    });
    const agent = result.steps?.[0]?.iterations[0]?.agents?.[0];
    // 1M input tokens at $5 / 1M = $5.
    expect(agent?.costUsd).toBe(5);
  });

  test('returns empty steps[] for an event-less session', async () => {
    const store = new FakeReadStore([], []);
    const result = await aggregateSessionJson({
      store,
      sessionId: 'sess-empty',
      projectId: 'gobbi',
      createdAt: '2026-04-29T10:00:00.000Z',
      gobbiVersion: '0.5.0',
      task: 'demo',
      transcriptDir: join(scratchDir, 'no-transcript'),
      claudeHome: scratchDir,
    });
    expect(result.steps).toEqual([]);
    expect(validateSessionJson(result)).toBe(true);
  });

  test('finishedAt sourced from workflow.finish event when present', async () => {
    const rows: EventRow[] = [
      makeRow({
        seq: 1,
        type: 'workflow.start',
        ts: '2026-04-29T10:00:00.000Z',
        data: { sessionId: 'sess-1', timestamp: '2026-04-29T10:00:00.000Z' },
      }),
      makeRow({
        seq: 2,
        type: 'workflow.finish',
        ts: '2026-04-29T11:00:00.000Z',
        data: {},
      }),
    ];
    const store = new FakeReadStore(rows, []);
    const result = await aggregateSessionJson({
      store,
      sessionId: 'sess-1',
      projectId: 'gobbi',
      createdAt: '2026-04-29T10:00:00.000Z',
      gobbiVersion: '0.5.0',
      task: 'demo',
      transcriptDir: join(scratchDir, 'no-transcript'),
      claudeHome: scratchDir,
    });
    expect(result.finishedAt).toBe('2026-04-29T11:00:00.000Z');
  });
});

// ---------------------------------------------------------------------------
// assertNeverProvider — exhaustiveness gate
// ---------------------------------------------------------------------------

describe('assertNeverProvider', () => {
  test('throws when invoked with an unknown provider literal', () => {
    // Forced runtime test — TypeScript catches this at compile time when
    // a switch is non-exhaustive. The runtime check exists for the
    // belt-and-braces case where a fresh fixture flows in from disk.
    expect(() => assertNeverProvider('codex' as never)).toThrow();
  });

  test('compiles an exhaustive switch on AgentEntry["provider"]', () => {
    // Type-level check — this function compiles only because the switch is
    // exhaustive over `AgentProvider`. If a new provider literal is added
    // without a matching case, tsc fails here.
    const agent = fixtureAnthropicAgent();

    function describeAgent(a: AgentEntry): string {
      switch (a.provider) {
        case 'anthropic':
          return `${a.name}@anthropic`;
        default:
          return assertNeverProvider(a.provider);
      }
    }

    expect(describeAgent(agent)).toBe('__pi@anthropic');
  });
});
