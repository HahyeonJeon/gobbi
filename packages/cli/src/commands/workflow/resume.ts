/**
 * gobbi workflow resume — skeleton (body deferred to PR D).
 *
 * PR C lands the flag-parsing, usage help, and session/store plumbing so
 * PR D's error-pathway compilers only replace the body. Today the body
 * throws a structured {@link ResumePendingError} whose `code` matches the
 * diagnostic family scheme — downstream tooling can discriminate the
 * pending state from real failures via `code === 'X001_RESUME_PR_D_PENDING'`.
 *
 * ## Scope (PR C)
 *
 *   - Flag parsing, help, session resolution, store open — all real.
 *   - Every path that reaches the resume body throws `ResumePendingError`.
 *
 * ## Exit semantics
 *
 *   - `0` — `--help` only.
 *   - `1` — session resolution failed OR the pending throw propagates to
 *           the CLI boundary (PR D swap turns this into the real
 *           error/resume exit codes).
 *   - `2` — argv parsing error (missing `--target`, unknown flag).
 *
 * ## Stub shape rationale
 *
 * The structured throw (rather than a silent placeholder `CompiledPrompt`)
 * follows best's discipline: `throw` fails loud when PR D forgets to swap
 * the body. The `X001_RESUME_PR_D_PENDING` code means future tooling can
 * parse the pending signal the same way it parses validate errors.
 */

import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { EventStore } from '../../workflow/store.js';
import type { DiagnosticCode } from '../../workflow/diagnostics.js';
import { resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Error type — carries the `X001_RESUME_PR_D_PENDING` sentinel.
// ---------------------------------------------------------------------------

/**
 * Thrown by the resume command while PR D's full-resume compilation is
 * outstanding. The `code` field is structurally identical to `Diagnostic.code`
 * so downstream tooling can parse the pending signal via the same
 * discrimination path it uses for validate errors.
 */
export class ResumePendingError extends Error {
  readonly code: DiagnosticCode = 'X001_RESUME_PR_D_PENDING';

  constructor(message: string) {
    super(message);
    this.name = 'ResumePendingError';
  }
}

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow resume --target <step> [options]

Resume a workflow from the error state into a named target step. The PR C
skeleton validates flags and opens the session store but the full resume
compilation is populated by PR D — invoking this command today throws
ResumePendingError (code: X001_RESUME_PR_D_PENDING).

Required:
  --target <step>        The step to resume into (ideation / plan / execution /
                         execution_eval / memorization)

Options:
  --force-memorization   Force resume into the memorization step regardless of
                         the pathway detector's preferred target (PR D honours
                         this flag)
  --session-id <id>      Override the active session id
  --json                 Reserved — PR D emits structured output on success
  --help, -h             Show this help message

Exit codes:
  0   --help only
  1   session resolution failed OR the resume body throws (PR D swaps in the
      real compiler and its exit semantics)
  2   argv parsing error (missing --target, unknown flag)`;

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  target: { type: 'string' },
  'force-memorization': { type: 'boolean', default: false },
  'session-id': { type: 'string' },
  json: { type: 'boolean', default: false },
} as const;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Overrides consumed by {@link runResumeWithOptions}. Exposed for tests
 * only; the CLI entry point {@link runResume} never passes overrides.
 */
export interface ResumeOverrides {
  /** Override the session directory; when set, --session-id / env are ignored. */
  readonly sessionDir?: string;
}

export async function runResume(args: string[]): Promise<void> {
  await runResumeWithOptions(args);
}

export async function runResumeWithOptions(
  args: string[],
  overrides: ResumeOverrides = {},
): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  try {
    const parsed = parseArgs({
      args,
      options: PARSE_OPTIONS,
      allowPositionals: false,
    });
    values = parsed.values;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi workflow resume: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  const target = typeof values.target === 'string' ? values.target : undefined;
  if (target === undefined || target === '') {
    process.stderr.write(
      `gobbi workflow resume: missing required flag --target <step>\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  // Session + store resolution is real today so PR D's body swap does not
  // need to re-plumb the filesystem layer. `runResumeWithOptions` reaches
  // the pending throw only on the happy path through these checks.
  const sessionDir =
    overrides.sessionDir ??
    resolveSessionDir(
      typeof values['session-id'] === 'string' ? values['session-id'] : undefined,
    );
  if (sessionDir === null) {
    process.stderr.write(
      `gobbi workflow resume: could not resolve an active session directory. ` +
        `Set CLAUDE_SESSION_ID or pass --session-id.\n`,
    );
    process.exit(1);
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    process.stderr.write(`gobbi workflow resume: no event store at ${dbPath}\n`);
    process.exit(1);
  }

  const store = new EventStore(dbPath);
  try {
    // Body deferred to PR D — see module docblock. The throw is intentional;
    // PR D replaces the throw with a real resume-pathway compilation path.
    // Known limitation (PR D): populate the real body (target-step validation,
    // compiler invocation, state rewrite, event emission).
    throw new ResumePendingError(
      'resume not implemented in PR C — populated in PR D (full resume compilers)',
    );
  } finally {
    store.close();
  }
}
