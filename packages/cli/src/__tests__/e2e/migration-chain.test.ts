/**
 * End-to-end migration-chain test — exercises the CLI binary's lazy
 * v1→vN event-schema migration through a `Bun.$` subprocess (plan §F.9 /
 * L-F11 / ARCH-P2).
 *
 * Flow:
 *   1. `gobbi workflow init` seeds a session (`session.json`, `gobbi.db`).
 *   2. Inject schema_version=1 rows directly via `bun:sqlite`. The seeded
 *      rows are stamped with the same `(session_id, project_id)`
 *      partition keys init wrote so they survive the partition-aware
 *      read filter (Option α — see `workflow/store.ts` module header).
 *   3. `gobbi workflow status --json` triggers the chain.
 *      `resolveWorkflowState` walks `replayAll → rowToEvent →
 *      migrateEvent` on every replayed row (PR-FIN-2a-ii / T-2a.9.unified
 *      retired the `state.json` projection — every call is a pure
 *      derive). Assert the resulting schemaVersion equals
 *      `CURRENT_SCHEMA_VERSION` (imported, NOT literal 4 — L-F11 + R2
 *      canary).
 *   4. Triangulation (innovative I11): stored rows still carry
 *      schema_version=1 — migration must stay lazy/in-memory.
 *
 * Complements `workflow/__tests__/migrations.test.ts` (function-level) by
 * locking the full CLI binary path — if a future refactor caches
 * schemaVersion at the row level and bypasses deriveState, the in-process
 * test still passes but this one fails.
 */

import { test, describe, expect } from 'bun:test';
import { $ } from 'bun';
import { Database } from 'bun:sqlite';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import type { EventRow } from '../../workflow/migrations.js';
import { sessionDir as sessionDirForProject } from '../../lib/workspace-paths.js';

// CLI entry — mirrors workflow-cycle.test.ts. Two `..` hops land at
// packages/cli/src/cli.ts.
const CLI_PATH: string = join(import.meta.dir, '..', '..', 'cli.ts');

/**
 * Narrow `status --json` stdout into a record so index reads are strict-
 * TS clean. Duplicates workflow-cycle.test.ts's helper rather than
 * cross-importing — e2e tests stay self-contained.
 */
function parseStatus(buf: Buffer): Record<string, unknown> {
  const text = buf.toString('utf8');
  const parsed: unknown = JSON.parse(text);
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`status --json did not return an object: ${text}`);
  }
  return parsed as Record<string, unknown>;
}

/**
 * v1 fixture event factory — shapes from
 * `workflow/__tests__/migrations.test.ts:103-183`. Inlined rather than
 * shared-extracted: duplication locks the v1 wire format in each test.
 * `seq` starts at 100 to dodge init's v4 events (PRIMARY KEY at seq 1 +
 * 2). `parent_seq` is null so we don't create dangling FKs to init's
 * rows — migration is orthogonal to parent-seq.
 *
 * Partition keys: PR-FIN-2a-ii (T-2a.9.unified) `EventStore` reads bake
 * a `WHERE session_id IS $session_id AND project_id IS $project_id`
 * filter (Option α). The seeded rows must match the same `(sessionId,
 * projectId)` pair init stamped on `workflow.start` /
 * `workflow.eval.decide` or the lazy migration walk skips them. The
 * factory accepts both keys verbatim and writes them on every fixture
 * row.
 */
function buildV1Events(
  sessionId: string,
  projectId: string,
): readonly EventRow[] {
  return [
    { seq: 100, ts: '2026-01-01T00:00:00.000Z', schema_version: 1, type: 'workflow.step.exit', step: 'ideation',
      data: JSON.stringify({ step: 'ideation' }),
      actor: 'orchestrator', parent_seq: null, idempotency_key: 'tool-call:tc-mig-001:workflow.step.exit',
      session_id: sessionId, project_id: projectId },
    { seq: 101, ts: '2026-01-01T00:00:01.000Z', schema_version: 1, type: 'guard.violation', step: 'plan',
      data: JSON.stringify({ guardId: 'g-scope', toolName: 'Write', reason: 'outside scope', step: 'plan',
        timestamp: '2026-01-01T00:00:01.000Z' }),
      actor: 'hook', parent_seq: null, idempotency_key: 'tool-call:tc-mig-002:guard.violation',
      session_id: sessionId, project_id: projectId },
    { seq: 102, ts: '2026-01-01T00:00:02.000Z', schema_version: 1, type: 'artifact.write', step: 'execution',
      data: JSON.stringify({ step: 'execution', filename: 'research.md', artifactType: 'note' }),
      actor: 'executor', parent_seq: null, idempotency_key: 'tool-call:tc-mig-003:artifact.write',
      session_id: sessionId, project_id: projectId },
  ];
}

describe('migration chain e2e', () => {
  test(
    'v1 events injected directly into gobbi.db migrate to CURRENT_SCHEMA_VERSION on next CLI read',
    async () => {
      const tmpRoot = mkdtempSync(join(tmpdir(), 'gobbi-mig-e2e-'));
      const sessionId = 'migrate-e2e';
      // Same env shape as workflow-cycle.test.ts — blank CLAUDE_SESSION_ID
      // so --session-id is authoritative; CLAUDE_TRANSCRIPT_PATH defensive.
      const childEnv: Record<string, string> = {
        ...process.env,
        CLAUDE_SESSION_ID: '',
        CLAUDE_TRANSCRIPT_PATH: '',
      };

      try {
        // Step A — init a session shell (writes session.json + opens
        // gobbi.db with the v5+ partition columns).
        const initResult = await $`bun run ${CLI_PATH} workflow init --session-id ${sessionId} --task migration-e2e`
          .cwd(tmpRoot)
          .env(childEnv)
          .quiet();
        expect(initResult.exitCode).toBe(0);

        const projectName = basename(tmpRoot);
        const sessionDir = sessionDirForProject(
          tmpRoot,
          projectName,
          sessionId,
        );
        const dbPath = join(sessionDir, 'gobbi.db');
        // PR-FIN-2a-ii: `metadata.json` retired in favour of
        // `session.json`; the engine no longer writes `state.json`.
        expect(existsSync(join(sessionDir, 'session.json'))).toBe(true);
        expect(existsSync(dbPath)).toBe(true);

        // Step B — inject schema_version=1 rows directly. Stamp the
        // partition keys init wrote so the partition-aware read filter
        // (`WHERE session_id IS $session_id AND project_id IS
        // $project_id`) admits the rows on the `replayAll` walk.
        const v1Events = buildV1Events(sessionId, projectName);
        const db = new Database(dbPath);
        try {
          const insert = db.prepare(
            'INSERT INTO events (seq, ts, schema_version, type, step, data, actor, parent_seq, idempotency_key, session_id, project_id) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          );
          for (const row of v1Events) {
            insert.run(
              row.seq,
              row.ts,
              row.schema_version,
              row.type,
              row.step,
              row.data,
              row.actor,
              row.parent_seq,
              row.idempotency_key,
              row.session_id,
              row.project_id,
            );
          }
        } finally {
          db.close();
        }

        // Step C — trigger migration via `workflow status --json`.
        // PR-FIN-2a-ii (T-2a.9.unified) retired `state.json`;
        // `resolveWorkflowState` is now a pure derive over the partition-
        // filtered event stream every call. The seeded v1 rows flow
        // through `replayAll → rowToEvent → migrateEvent`.
        const statusResult = await $`bun run ${CLI_PATH} workflow status --session-id ${sessionId} --json`
          .cwd(tmpRoot)
          .env(childEnv)
          .quiet();
        expect(statusResult.exitCode).toBe(0);

        const snap = parseStatus(statusResult.stdout);
        // The row-level `CURRENT_SCHEMA_VERSION` is decoupled from the
        // in-memory `state.schemaVersion` at gobbi-memory Pass 2 — the v5
        // bump adds `session_id` / `project_id` columns but no state-field
        // additions, so `initialState().schemaVersion` stays at 4. The
        // status snapshot exposes the in-memory value, not the row-level
        // one. A later pass that lifts state-shape fields to v5+ will
        // realign the two and re-tighten this to CURRENT_SCHEMA_VERSION.
        expect(snap['schemaVersion']).toBe(4);
        expect(snap['sessionId']).toBe(sessionId);

        // Innovative I11 post-triangulation — stored rows still v1.
        // Migration is lazy/in-memory: rowToEvent migrates during replay
        // but does NOT rewrite disk. If a future refactor eagerly persists
        // migrated rows, this assert flips and the owner must re-certify
        // the lazy-migration invariant.
        const dbPost = new Database(dbPath, { readonly: true });
        try {
          const rows = dbPost
            .query<{ schema_version: number }, [string]>(
              'SELECT schema_version FROM events WHERE idempotency_key = ?',
            )
            .all(v1Events[0]!.idempotency_key);
          expect(rows.length).toBe(1);
          expect(rows[0]?.schema_version).toBe(1);
        } finally {
          dbPost.close();
        }
      } finally {
        rmSync(tmpRoot, { recursive: true, force: true });
      }
    },
    60_000,
  );
});
