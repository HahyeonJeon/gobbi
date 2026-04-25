/**
 * End-to-end migration-chain test — exercises the CLI binary's lazy
 * v1→vN event-schema migration through a `Bun.$` subprocess (plan §F.9 /
 * L-F11 / ARCH-P2).
 *
 * Flow:
 *   1. `gobbi workflow init` seeds a session (metadata.json, gobbi.db at
 *      v4, state.json).
 *   2. Inject schema_version=1 rows directly via `bun:sqlite`.
 *   3. Delete state.json (ARCH-P2) so resolveWorkflowState can no longer
 *      short-circuit through readState — next CLI call falls through to
 *      store.replayAll → deriveState → rowToEvent → migrateEvent.
 *   4. `gobbi workflow status --json` triggers the chain. Assert the
 *      resulting schemaVersion equals CURRENT_SCHEMA_VERSION (imported,
 *      NOT literal 4 — L-F11 + R2 canary).
 *   5. Triangulation (innovative I11): stored rows still carry
 *      schema_version=1 — migration must stay lazy/in-memory.
 *
 * Complements `workflow/__tests__/migrations.test.ts` (function-level) by
 * locking the full CLI binary path — if a future refactor caches
 * schemaVersion on metadata.json and bypasses deriveState, the in-process
 * test still passes but this one fails.
 *
 * Option A (state.json delete + `workflow status`) chosen over Option B
 * (`workflow resume`) because resume requires currentStep==='error',
 * forcing extra fixture complexity; Option A is strictly simpler.
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
 * v1 fixture events, shapes from `workflow/__tests__/migrations.test.ts:103-183`.
 * Inlined rather than shared-extracted — duplication locks the v1 wire
 * format in each test. `seq` starts at 100 to dodge init's v4 events
 * (PRIMARY KEY at seq 1 + 2). `parent_seq` is null so we don't create
 * dangling FKs to init's rows — migration is orthogonal to parent-seq.
 */
const v1Events: readonly EventRow[] = [
  { seq: 100, ts: '2026-01-01T00:00:00.000Z', schema_version: 1, type: 'workflow.step.exit', step: 'ideation',
    data: JSON.stringify({ step: 'ideation' }),
    actor: 'orchestrator', parent_seq: null, idempotency_key: 'tool-call:tc-mig-001:workflow.step.exit',
    session_id: null, project_id: null },
  { seq: 101, ts: '2026-01-01T00:00:01.000Z', schema_version: 1, type: 'guard.violation', step: 'plan',
    data: JSON.stringify({ guardId: 'g-scope', toolName: 'Write', reason: 'outside scope', step: 'plan',
      timestamp: '2026-01-01T00:00:01.000Z' }),
    actor: 'hook', parent_seq: null, idempotency_key: 'tool-call:tc-mig-002:guard.violation',
    session_id: null, project_id: null },
  { seq: 102, ts: '2026-01-01T00:00:02.000Z', schema_version: 1, type: 'artifact.write', step: 'execution',
    data: JSON.stringify({ step: 'execution', filename: 'research.md', artifactType: 'note' }),
    actor: 'executor', parent_seq: null, idempotency_key: 'tool-call:tc-mig-003:artifact.write',
    session_id: null, project_id: null },
];

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
        // Step A — init a session shell (state.json at v4).
        const initResult = await $`bun run ${CLI_PATH} workflow init --session-id ${sessionId} --task migration-e2e`
          .cwd(tmpRoot)
          .env(childEnv)
          .quiet();
        expect(initResult.exitCode).toBe(0);

        const sessionDir = sessionDirForProject(
          tmpRoot,
          basename(tmpRoot),
          sessionId,
        );
        const dbPath = join(sessionDir, 'gobbi.db');
        const statePath = join(sessionDir, 'state.json');
        const stateBackupPath = join(sessionDir, 'state.json.backup');
        expect(existsSync(join(sessionDir, 'metadata.json'))).toBe(true);
        expect(existsSync(dbPath)).toBe(true);

        // Step B — inject schema_version=1 rows directly.
        const db = new Database(dbPath);
        try {
          const insert = db.prepare(
            'INSERT INTO events (seq, ts, schema_version, type, step, data, actor, parent_seq, idempotency_key) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
            );
          }
        } finally {
          db.close();
        }

        // ARCH-P2 fix + innovative I11 pre-triangulation: delete state.json
        // so the next CLI call falls through to deriveState. The pre-assert
        // locks the intent (we deliberately removed a file we know existed).
        expect(existsSync(statePath)).toBe(true);
        rmSync(statePath);
        rmSync(stateBackupPath, { force: true }); // defensive — init may add one later
        expect(existsSync(statePath)).toBe(false);

        // Step C — trigger migration via `workflow status --json`. With
        // state.json gone, resolveWorkflowState walks replayAll → rowToEvent
        // → migrateEvent on every seeded v1 row.
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
