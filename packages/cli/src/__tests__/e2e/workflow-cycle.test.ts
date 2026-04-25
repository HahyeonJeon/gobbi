/**
 * End-to-end workflow-cycle test — drives a full `gobbi workflow` lifecycle
 * through real `Bun.$` subprocesses against a freshly-minted temp directory.
 *
 * Scope (plan §E.7 L14 + research `e7-properties-and-e2e-patterns.md`):
 *
 *   1. init             — seeds metadata + .gobbi/project-config.json
 *   2. status           — initial snapshot at ideation
 *   3. COMPLETE x3      — ideation -> plan -> execution -> execution_eval
 *   4. PASS             — execution_eval -> memorization
 *   5. FINISH           — memorization -> done
 *   6. final status     — currentStep === 'done', event trail intact
 *
 * Each CLI invocation spawns a Bun subprocess via `$`, `cwd(tmpRoot)` so
 * `getRepoRoot()` falls back to `process.cwd()` (the temp dir is not a git
 * repo — see lib/repo.ts), and `.quiet()` suppresses stdout/stderr from the
 * parent process. `CLAUDE_SESSION_ID` is explicitly cleared on the child
 * env so the test's `--session-id` flag is the only session-id source — a
 * parent process running under Claude Code (with CLAUDE_SESSION_ID set)
 * would otherwise inherit that id and collide with the test's fresh
 * session.
 *
 * Cleanup runs in a `finally` block so a crashed run never leaves stale
 * artifacts under `os.tmpdir()`. The 60s timeout is generous for the
 * sequential subprocess chain (six invocations, each a cold `bun run`
 * startup plus the command's own work).
 */

import { test, expect } from 'bun:test';
import { $ } from 'bun';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { sessionDir as sessionDirForProject } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Module-relative path to the CLI entry point. `import.meta.dir` points at
// this file's directory (`packages/cli/src/__tests__/e2e/`); `../../cli.ts`
// hops back to `packages/cli/src/cli.ts`. Resolving once at module load
// keeps the subprocess invocations below readable.
// ---------------------------------------------------------------------------

const CLI_PATH: string = join(import.meta.dir, '..', '..', 'cli.ts');

/**
 * Parse a `workflow status --json` stdout buffer into the StatusSnapshot
 * shape the test asserts on. Typed loosely as `Record<string, unknown>`
 * because the test only inspects a handful of well-known fields and
 * re-importing the full StatusSnapshot interface across the e2e boundary
 * would couple this test file to the command's internal module graph.
 */
function parseStatus(buf: Buffer): Record<string, unknown> {
  const text = buf.toString('utf8');
  const parsed: unknown = JSON.parse(text);
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`status --json did not return an object: ${text}`);
  }
  return parsed as Record<string, unknown>;
}

test(
  'full workflow cycle: init -> ideation -> plan -> execution -> execution_eval -> memorization -> done',
  async () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'gobbi-e2e-'));
    const sessionId = 'e2e-happy-path';
    // Shared environment for every child: keep the parent's PATH (so `bun`
    // is discoverable) but blank the session-id env so the --session-id
    // flag is the only source.
    const childEnv: Record<string, string> = {
      ...process.env,
      CLAUDE_SESSION_ID: '',
      // Defensive: current workflow commands don't read
      // CLAUDE_TRANSCRIPT_PATH, but clearing it here prevents a future
      // class of env leak if any command starts resolving it implicitly.
      CLAUDE_TRANSCRIPT_PATH: '',
    };

    try {
      // -----------------------------------------------------------------
      // Step 1 — init. Creates metadata.json + project-config.json + the
      // event store, and emits workflow.start + workflow.eval.decide.
      // -----------------------------------------------------------------
      const initResult = await $`bun run ${CLI_PATH} workflow init --session-id ${sessionId} --task e2e`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(initResult.exitCode).toBe(0);

      const sessionDir = sessionDirForProject(
        tmpRoot,
        basename(tmpRoot),
        sessionId,
      );
      expect(existsSync(join(sessionDir, 'metadata.json'))).toBe(true);
      expect(existsSync(join(sessionDir, 'gobbi.db'))).toBe(true);
      // Pass 3 finalize: `ensureSettingsCascade` seeds a sparse workspace
      // `.gobbi/settings.json` on first init. The project-level file
      // `.gobbi/project/settings.json` is only created on legacy upgrade or
      // when the user writes to it via `gobbi config set --level project`.
      // The legacy `.gobbi/project-config.json` is upgraded (not renamed)
      // if present; a fresh tmpdir has no legacy file, so neither v1 nor v2
      // project-level paths exist after a clean init.
      expect(existsSync(join(tmpRoot, '.gobbi', 'settings.json'))).toBe(true);
      expect(
        existsSync(join(tmpRoot, '.gobbi', 'project', 'settings.json')),
      ).toBe(false);
      expect(existsSync(join(tmpRoot, '.gobbi', 'project-config.json'))).toBe(
        false,
      );

      // -----------------------------------------------------------------
      // Step 2 — initial status snapshot. Session should be at ideation
      // with eval disabled on both ideation and plan.
      // -----------------------------------------------------------------
      const statusInitial = await $`bun run ${CLI_PATH} workflow status --session-id ${sessionId} --json`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(statusInitial.exitCode).toBe(0);
      const snapInitial = parseStatus(statusInitial.stdout);
      expect(snapInitial['currentStep']).toBe('ideation');
      expect(snapInitial['currentSubstate']).toBe('discussing');
      expect(snapInitial['schemaVersion']).toBe(4);
      expect(snapInitial['sessionId']).toBe(sessionId);

      // -----------------------------------------------------------------
      // Step 3a — COMPLETE: ideation -> plan.
      // -----------------------------------------------------------------
      const completeIdeation = await $`bun run ${CLI_PATH} workflow transition COMPLETE --session-id ${sessionId}`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(completeIdeation.exitCode).toBe(0);
      expect(completeIdeation.stdout.toString('utf8')).toContain(
        'workflow.step.exit',
      );

      const afterIdeation = parseStatus(
        (
          await $`bun run ${CLI_PATH} workflow status --session-id ${sessionId} --json`
            .cwd(tmpRoot)
            .env(childEnv)
            .quiet()
        ).stdout,
      );
      expect(afterIdeation['currentStep']).toBe('planning');

      // -----------------------------------------------------------------
      // Step 3b — COMPLETE: plan -> execution.
      // -----------------------------------------------------------------
      const completePlan = await $`bun run ${CLI_PATH} workflow transition COMPLETE --session-id ${sessionId}`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(completePlan.exitCode).toBe(0);

      const afterPlan = parseStatus(
        (
          await $`bun run ${CLI_PATH} workflow status --session-id ${sessionId} --json`
            .cwd(tmpRoot)
            .env(childEnv)
            .quiet()
        ).stdout,
      );
      expect(afterPlan['currentStep']).toBe('execution');

      // -----------------------------------------------------------------
      // Step 3c — COMPLETE: execution -> execution_eval.
      //
      // execution_eval is reached unconditionally on STEP_EXIT regardless
      // of evalConfig; the verdict outcome is what drives the next leg.
      // -----------------------------------------------------------------
      const completeExecution = await $`bun run ${CLI_PATH} workflow transition COMPLETE --session-id ${sessionId}`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(completeExecution.exitCode).toBe(0);

      const afterExecution = parseStatus(
        (
          await $`bun run ${CLI_PATH} workflow status --session-id ${sessionId} --json`
            .cwd(tmpRoot)
            .env(childEnv)
            .quiet()
        ).stdout,
      );
      expect(afterExecution['currentStep']).toBe('execution_eval');

      // -----------------------------------------------------------------
      // Step 4 — PASS: execution_eval -> memorization.
      // -----------------------------------------------------------------
      const passVerdict = await $`bun run ${CLI_PATH} workflow transition PASS --session-id ${sessionId}`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(passVerdict.exitCode).toBe(0);
      expect(passVerdict.stdout.toString('utf8')).toContain(
        'decision.eval.verdict',
      );

      const afterVerdict = parseStatus(
        (
          await $`bun run ${CLI_PATH} workflow status --session-id ${sessionId} --json`
            .cwd(tmpRoot)
            .env(childEnv)
            .quiet()
        ).stdout,
      );
      expect(afterVerdict['currentStep']).toBe('memorization');
      expect(afterVerdict['lastVerdictOutcome']).toBe('pass');

      // -----------------------------------------------------------------
      // Step 5 — FINISH: memorization -> done.
      // -----------------------------------------------------------------
      const finish = await $`bun run ${CLI_PATH} workflow transition FINISH --session-id ${sessionId}`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(finish.exitCode).toBe(0);
      expect(finish.stdout.toString('utf8')).toContain('workflow.finish');

      // -----------------------------------------------------------------
      // Step 6 — final status. currentStep === 'done' with ideation, plan,
      // and execution on the completedSteps trail; violations must be
      // clean.
      // -----------------------------------------------------------------
      const finalStatus = await $`bun run ${CLI_PATH} workflow status --session-id ${sessionId} --json`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(finalStatus.exitCode).toBe(0);
      const snapFinal = parseStatus(finalStatus.stdout);
      expect(snapFinal['currentStep']).toBe('done');
      expect(snapFinal['currentSubstate']).toBeNull();
      const completed = snapFinal['completedSteps'];
      expect(Array.isArray(completed)).toBe(true);
      if (Array.isArray(completed)) {
        expect(completed).toContain('ideation');
        expect(completed).toContain('planning');
        expect(completed).toContain('execution');
      }
      expect(snapFinal['violationsTotal']).toBe(0);
      expect(snapFinal['lastVerdictOutcome']).toBe('pass');

      // -----------------------------------------------------------------
      // Event-trail spot-check via `workflow events --json`. The cycle
      // above must have appended AT LEAST: workflow.start,
      // workflow.eval.decide, 3x workflow.step.exit,
      // decision.eval.verdict, workflow.finish (7 events). We assert >= 7
      // rather than an exact count so future additive bookkeeping (e.g.
      // heartbeats stamped by stop.ts during the run) does not break the
      // test.
      // -----------------------------------------------------------------
      const eventsResult = await $`bun run ${CLI_PATH} workflow events --session-id ${sessionId} --json`
        .cwd(tmpRoot)
        .env(childEnv)
        .quiet();
      expect(eventsResult.exitCode).toBe(0);
      const rawEvents: unknown = JSON.parse(
        eventsResult.stdout.toString('utf8'),
      );
      expect(Array.isArray(rawEvents)).toBe(true);
      if (Array.isArray(rawEvents)) {
        expect(rawEvents.length).toBeGreaterThanOrEqual(7);
        const eventTypes = rawEvents
          .map((r) =>
            r !== null && typeof r === 'object' && 'type' in r
              ? (r as { type: unknown }).type
              : null,
          )
          .filter((t): t is string => typeof t === 'string');
        expect(eventTypes).toContain('workflow.start');
        expect(eventTypes).toContain('workflow.eval.decide');
        expect(eventTypes).toContain('workflow.step.exit');
        expect(eventTypes).toContain('decision.eval.verdict');
        expect(eventTypes).toContain('workflow.finish');
      }
    } finally {
      // Silence the cleanup crash path — the tempdir MUST go away even if
      // an assertion above threw. `force: true` swallows ENOENT when the
      // dir never materialised (defensive — we mkdtempSync above so it
      // always exists at this point).
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  },
  60_000,
);
