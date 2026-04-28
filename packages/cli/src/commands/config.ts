/**
 * gobbi config — unified settings CLI.
 *
 * Three verbs:
 *
 *   gobbi config get  <key>         [--level workspace|project|session] [--session-id <id>]
 *   gobbi config set  <key> <value> [--level workspace|project|session] [--session-id <id>]
 *   gobbi config init               [--level workspace|project|session] [--session-id <id>]
 *                                   [--project <name>] [--force]
 *
 * `get` without `--level` returns the cascade-resolved value (see
 * `lib/settings-io.ts::resolveSettings`). `get` with `--level` reads ONLY
 * that level's file — no cascade fallthrough, exits 1 if the key is absent
 * at that level even if a default would supply it.
 *
 * `set` without `--level` defaults to `session` (matches `/gobbi` setup's
 * per-session answer persistence pattern). Value coercion: literal
 * `"true"` / `"false"` / `"null"` map to their JSON equivalents; values
 * whose first non-whitespace character is `[` or `{` are `JSON.parse`'d
 * (arrays and objects); plain integer / decimal strings are parsed as
 * numbers; anything else is passed through as a string.
 *
 * Deep-path writes walk the target level's on-disk tree, creating
 * intermediate records as needed, set the leaf, validate the full result
 * against the single AJV validator in `settings-validator.ts`, and atomic-
 * write via `writeSettingsAtLevel`.
 *
 * `init` writes the minimum-valid seed `{schemaVersion: 1}` to the chosen
 * level's `settings.json`. Default level is `workspace`. Refuses with
 * exit 2 when the file already exists; `--force` overwrites with a
 * stderr WARN line. Validates the seed via the AJV validator before
 * writing (atomic temp+rename, same pattern as `set`). The cascade
 * supplies all other defaults at resolve time, so the seed stays
 * minimum-shape on disk.
 *
 * Exit codes:
 *   - `0` — success (get: key found + JSON value on stdout; set/init: written).
 *   - `1` — get-only: key not found at the selected level / path. Silent
 *           stdout, no stderr line (matches `jq` / `kubectl get -o
 *           jsonpath` conventions for missing keys).
 *   - `2` — parse, validation, I/O, or invalid-argument error. Also: init
 *           refuses to overwrite without `--force`. Diagnostic line on
 *           stderr.
 *
 * Session-id resolution is plugin-neutral per the
 * `cli-vs-skill-session-id` gotcha: the CLI reads `$CLAUDE_SESSION_ID`
 * and accepts `--session-id <id>` explicitly. It does NOT know about
 * `$CODEX_COMPANION_SESSION_ID`; that discovery logic belongs to the
 * `/gobbi` orchestrator skill, which passes the resolved id through.
 * The `--session-id` flag takes priority over the env var when both are
 * present — explicit input overrides the ambient env.
 */

import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { basename } from 'node:path';

import { isRecord } from '../lib/guards.js';
import { getRepoRoot } from '../lib/repo.js';
import {
  ConfigCascadeError,
  type Settings,
  type SettingsLevel,
} from '../lib/settings.js';
import {
  loadSettingsAtLevel,
  projectSettingsPath,
  resolveSettings,
  sessionSettingsPath,
  workspaceSettingsPath,
  writeSettingsAtLevel,
} from '../lib/settings-io.js';
import {
  formatAjvErrors,
  validateSettings,
} from '../lib/settings-validator.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi config <verb> [options]

Verbs:
  get  <key>            Read a dot-path key from the resolved cascade (or a
                        single level with --level).
  set  <key> <value>    Write a dot-path key at one level (session by
                        default). Validates the full resulting tree before
                        atomic write.
  init                  Seed the minimum-valid settings file at one level
                        (workspace by default). Refuses without --force
                        when the file already exists.

Options:
  --level <lvl>         Target level: workspace | project | session.
  --session-id <id>     Session id for --level session. Takes priority over
                        CLAUDE_SESSION_ID env when both are present.
  --project <name>      Project name (init only). Defaults to
                        basename(repoRoot).
  --force               Overwrite an existing file (init only). Emits a
                        stderr WARN line.
  --help, -h            Show this help message.

Examples:
  gobbi config get git.pr.open
  gobbi config get workflow.ideation.discuss.mode --level workspace
  gobbi config set workflow.ideation.discuss.mode user
  gobbi config set notify.slack.events '["workflow.complete","error"]' --level workspace
  gobbi config init
  gobbi config init --level project --project foo
  gobbi config init --level session --session-id abc123 --force

Exit codes:
  0  success
  1  get: key not found at selected level / path (silent stdout)
  2  parse / validation / I/O / invalid-argument error (stderr diagnostic);
     init: file already exists without --force`;

const GET_USAGE = `Usage: gobbi config get <key> [--level workspace|project|session] [--session-id <id>]

Read a dot-path key. Without --level, returns the cascade-resolved value
(session > project > workspace > default). With --level, reads only that
level's file — no cascade fallthrough, no default fallback.

Options:
  --level <lvl>        workspace | project | session.
  --session-id <id>    Session id for --level session. Takes priority over
                       CLAUDE_SESSION_ID env when both are present; either
                       source is accepted for cascade resolution.
  --help, -h           Show this help message.

Examples:
  gobbi config get schemaVersion
  gobbi config get workflow.ideation.discuss.mode
  gobbi config get notify.slack.enabled --level workspace
  gobbi config get workflow.execution --level session --session-id abc123

Exit codes:
  0  key found (JSON value on stdout)
  1  key not found (silent stdout)
  2  parse / I/O / invalid-argument error`;

const SET_USAGE = `Usage: gobbi config set <key> <value> [--level workspace|project|session] [--session-id <id>]

Write a dot-path key. Without --level, writes to the session level (the
common target for /gobbi setup answers). Value coercion:

  "true" / "false"       -> booleans
  "null"                 -> null
  leading "[" or "{"     -> JSON.parse as array / object
  integer / decimal      -> number
  anything else          -> string

The full resulting tree is AJV-validated before an atomic write; invalid
values exit 2 with the validator errors on stderr and never touch disk.

Options:
  --level <lvl>        workspace | project | session (default: session).
  --session-id <id>    Session id for --level session (default target).
                       Takes priority over CLAUDE_SESSION_ID env when both
                       are present.
  --help, -h           Show this help message.

Examples:
  gobbi config set workflow.ideation.discuss.mode user
  gobbi config set git.baseBranch main --level workspace
  gobbi config set notify.slack.events '["workflow.complete","error"]' --level workspace
  gobbi config set notify.slack.enabled true --level workspace

Exit codes:
  0  success
  2  parse / validation / I/O / invalid-argument error`;

const INIT_USAGE = `Usage: gobbi config init [--level workspace|project|session] [--session-id <id>] [--project <name>] [--force]

Seed the minimum-valid \`{schemaVersion: 1}\` settings file at the chosen
level. The cascade supplies all other defaults at resolve time, so the
seed stays minimum-shape on disk.

Default level is \`workspace\` (no --session-id required). For \`session\`,
either --session-id or CLAUDE_SESSION_ID env is required. For \`project\`,
project name resolves via --project flag, then basename(repoRoot).

Refuses with exit 2 when the target file already exists. \`--force\`
overwrites and emits a stderr WARN line so the operator notices.

Options:
  --level <lvl>        workspace | project | session (default: workspace).
  --session-id <id>    Session id for --level session. Takes priority over
                       CLAUDE_SESSION_ID env when both are present.
  --project <name>     Project name for --level project | session. Defaults
                       to basename(repoRoot).
  --force              Overwrite an existing file. Emits a stderr WARN line.
  --help, -h           Show this help message.

Examples:
  gobbi config init
  gobbi config init --level workspace --force
  gobbi config init --level project --project foo
  gobbi config init --level session --session-id abc123

Exit codes:
  0  success
  2  parse / validation / I/O / invalid-argument error;
     refuse-without-force on existing file;
     missing session id when --level session is required`;

// ---------------------------------------------------------------------------
// parseArgs options — shared between get and set
// ---------------------------------------------------------------------------

const VERB_PARSE_OPTIONS = {
  level: { type: 'string' },
  'session-id': { type: 'string' },
  help: { type: 'boolean', short: 'h', default: false },
} as const;

const INIT_PARSE_OPTIONS = {
  level: { type: 'string' },
  'session-id': { type: 'string' },
  project: { type: 'string' },
  force: { type: 'boolean', default: false },
  help: { type: 'boolean', short: 'h', default: false },
} as const;

// ---------------------------------------------------------------------------
// Top-level dispatch
// ---------------------------------------------------------------------------

/**
 * `gobbi config` entry point. Receives the argv slice AFTER the `config`
 * token (i.e. `process.argv.slice(3)` from `cli.ts`). Dispatches on the
 * first positional to `runGet` / `runSet`; `--help` / absent verb prints
 * the top-level usage.
 */
export async function runConfig(args: string[]): Promise<void> {
  const first = args[0];

  if (first === undefined || first === '--help' || first === '-h') {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  if (first === 'get') {
    await runGet(args.slice(1));
    return;
  }

  if (first === 'set') {
    await runSet(args.slice(1));
    return;
  }

  if (first === 'init') {
    await runInit(args.slice(1));
    return;
  }

  process.stderr.write(`gobbi config: unknown verb "${first}"\n`);
  process.stderr.write(`${USAGE}\n`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// gobbi config get
// ---------------------------------------------------------------------------

async function runGet(args: string[]): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  let positionals: readonly string[];
  try {
    const parsed = parseArgs({
      args,
      options: VERB_PARSE_OPTIONS,
      allowPositionals: true,
      strict: true,
    });
    values = parsed.values;
    positionals = parsed.positionals;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi config get: ${message}\n`);
    process.stderr.write(`${GET_USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${GET_USAGE}\n`);
    return;
  }

  if (positionals.length === 0) {
    process.stderr.write(`gobbi config get: missing required argument <key>\n`);
    process.stderr.write(`${GET_USAGE}\n`);
    process.exit(2);
  }

  if (positionals.length > 1) {
    process.stderr.write(
      `gobbi config get: unexpected extra arguments: ${positionals.slice(1).join(' ')}\n`,
    );
    process.stderr.write(`${GET_USAGE}\n`);
    process.exit(2);
  }

  const key = positionals[0];
  if (key === undefined || key === '') {
    process.stderr.write(`gobbi config get: <key> must be a non-empty dot-path\n`);
    process.exit(2);
  }

  const level = parseLevel(values['level']);
  if (level === 'invalid') {
    process.stderr.write(
      `gobbi config get: --level must be one of workspace, project, session\n`,
    );
    process.exit(2);
  }

  const flagSessionId = typeof values['session-id'] === 'string' ? values['session-id'] : undefined;
  const envSessionId = process.env['CLAUDE_SESSION_ID'];
  const sessionId = resolveSessionId(flagSessionId, envSessionId);

  if (level === 'session' && (sessionId === undefined || sessionId === '')) {
    process.stderr.write(
      `gobbi config get: --level session requires CLAUDE_SESSION_ID env or --session-id\n` +
        `  (outside a session, use --level workspace or --level project to bypass)\n`,
    );
    process.exit(2);
  }

  const repoRoot = getRepoRoot();

  // `tree === null` is the deliberate signal for "explicit --level, file
  // absent" — mapped to exit 1 outside the try so the catch block only
  // sees genuine I/O / parse errors.
  let tree: Settings | null;
  try {
    if (level === undefined) {
      tree = resolveSettings({ repoRoot, ...(sessionId !== undefined ? { sessionId } : {}) });
    } else {
      tree = loadSettingsAtLevel(repoRoot, level, sessionId);
    }
  } catch (err) {
    emitCascadeError('get', err);
  }

  if (tree === null) {
    // --level explicit and file absent → key is definitionally missing at
    // that level. Exit 1 silently (no cascade fallthrough).
    process.exit(1);
  }

  const value = walkPath(tree, key);
  if (value === undefined) {
    // Missing key — silent stdout, exit 1.
    process.exit(1);
  }

  process.stdout.write(`${JSON.stringify(value)}\n`);
}

// ---------------------------------------------------------------------------
// gobbi config set
// ---------------------------------------------------------------------------

async function runSet(args: string[]): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  let positionals: readonly string[];
  try {
    const parsed = parseArgs({
      args,
      options: VERB_PARSE_OPTIONS,
      allowPositionals: true,
      strict: true,
    });
    values = parsed.values;
    positionals = parsed.positionals;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi config set: ${message}\n`);
    process.stderr.write(`${SET_USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${SET_USAGE}\n`);
    return;
  }

  if (positionals.length < 2) {
    process.stderr.write(
      `gobbi config set: missing required arguments; expected <key> <value>\n`,
    );
    process.stderr.write(`${SET_USAGE}\n`);
    process.exit(2);
  }

  if (positionals.length > 2) {
    process.stderr.write(
      `gobbi config set: unexpected extra arguments: ${positionals.slice(2).join(' ')}\n`,
    );
    process.stderr.write(`${SET_USAGE}\n`);
    process.exit(2);
  }

  const key = positionals[0];
  const rawValue = positionals[1];
  if (key === undefined || key === '' || rawValue === undefined) {
    process.stderr.write(`gobbi config set: <key> must be a non-empty dot-path\n`);
    process.exit(2);
  }

  const parsedLevel = parseLevel(values['level']);
  if (parsedLevel === 'invalid') {
    process.stderr.write(
      `gobbi config set: --level must be one of workspace, project, session\n`,
    );
    process.exit(2);
  }
  // Default write target is session (matches /gobbi setup's per-session
  // answer persistence pattern per ideation §5.2).
  const level: SettingsLevel = parsedLevel ?? 'session';

  const flagSessionId = typeof values['session-id'] === 'string' ? values['session-id'] : undefined;
  const envSessionId = process.env['CLAUDE_SESSION_ID'];
  const sessionId = resolveSessionId(flagSessionId, envSessionId);

  if (level === 'session' && (sessionId === undefined || sessionId === '')) {
    process.stderr.write(
      `gobbi config set: --level session requires CLAUDE_SESSION_ID env or --session-id\n` +
        `  (outside a session, use --level workspace or --level project to bypass)\n`,
    );
    process.exit(2);
  }

  let coerced: unknown;
  try {
    coerced = coerceValue(rawValue);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi config set: invalid JSON in <value>: ${message}\n`);
    process.exit(2);
  }

  const repoRoot = getRepoRoot();

  // Load the current level file (or seed the minimum valid shape when
  // absent). PR-FIN-1c: minimum shape is just `{schemaVersion: 1}`.
  let current: Settings;
  try {
    const loaded = loadSettingsAtLevel(repoRoot, level, sessionId);
    current = loaded ?? ({ schemaVersion: 1 } satisfies Settings);
  } catch (err) {
    emitCascadeError('set', err);
  }

  // Walk + set the leaf on a fresh copy. `current` is a validated
  // `Settings` (or the seeded `{schemaVersion: 1}`) — both are records,
  // so `isRecord` narrows cleanly without a cast.
  if (!isRecord(current)) {
    process.stderr.write(`gobbi config set: internal error — settings tree is not an object\n`);
    process.exit(2);
  }
  const updatedUnknown: unknown = setPath(current, key, coerced);

  // Validate before write. `writeSettingsAtLevel` validates again (belt-
  // and-braces against partial-file writes), but we surface the errors
  // here with the verb name so diagnostics are clearer.
  if (!validateSettings(updatedUnknown)) {
    const messages = formatAjvErrors(validateSettings.errors);
    process.stderr.write(
      `gobbi config set: validation failed for ${level}:\n${messages}\n`,
    );
    process.exit(2);
  }

  try {
    // `validateSettings` narrowed `updatedUnknown` to `Settings` above.
    writeSettingsAtLevel(repoRoot, level, updatedUnknown, sessionId);
  } catch (err) {
    emitCascadeError('set', err);
  }
}

// ---------------------------------------------------------------------------
// gobbi config init
// ---------------------------------------------------------------------------

/**
 * Seed the minimum-valid `{schemaVersion: 1}` settings file at the chosen
 * level. The cascade supplies all other defaults at resolve time so the
 * on-disk seed stays minimum-shape — adding more here would just create
 * future drift between the seed and `DEFAULTS`.
 *
 * Refuses without `--force` when the target file already exists. `--force`
 * overwrites and emits a stderr WARN line so an operator who runs init
 * twice notices that they clobbered prior content.
 *
 * Project name (for `--level project | session`) resolves via the same
 * ladder used by `workflow init` and `writeSettingsAtLevel`:
 *
 *   1. `--project <name>` flag.
 *   2. `basename(repoRoot)`.
 *
 * Session id (for `--level session`) resolves via the standard
 * flag → env ladder; both absent is exit 2 with the same recovery hint
 * `runGet` / `runSet` use.
 */
async function runInit(args: string[]): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  let positionals: readonly string[];
  try {
    const parsed = parseArgs({
      args,
      options: INIT_PARSE_OPTIONS,
      allowPositionals: true,
      strict: true,
    });
    values = parsed.values;
    positionals = parsed.positionals;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi config init: ${message}\n`);
    process.stderr.write(`${INIT_USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${INIT_USAGE}\n`);
    return;
  }

  if (positionals.length > 0) {
    process.stderr.write(
      `gobbi config init: unexpected extra arguments: ${positionals.join(' ')}\n`,
    );
    process.stderr.write(`${INIT_USAGE}\n`);
    process.exit(2);
  }

  // Default level is `workspace` — init is the scaffold verb, and the
  // workspace file is the most common bootstrap target. Session-level
  // init is the niche case (per-session overrides).
  const parsedLevel = parseLevel(values['level']);
  if (parsedLevel === 'invalid') {
    process.stderr.write(
      `gobbi config init: --level must be one of workspace, project, session\n`,
    );
    process.exit(2);
  }
  const level: SettingsLevel = parsedLevel ?? 'workspace';

  const flagSessionId =
    typeof values['session-id'] === 'string' ? values['session-id'] : undefined;
  const envSessionId = process.env['CLAUDE_SESSION_ID'];
  const sessionId = resolveSessionId(flagSessionId, envSessionId);

  if (level === 'session' && (sessionId === undefined || sessionId === '')) {
    process.stderr.write(
      `gobbi config init: --level session requires CLAUDE_SESSION_ID env or --session-id\n` +
        `  (outside a session, use --level workspace or --level project to bypass)\n`,
    );
    process.exit(2);
  }

  const force = values.force === true;
  const projectFlag =
    typeof values['project'] === 'string' && values['project'] !== ''
      ? values['project']
      : undefined;

  const repoRoot = getRepoRoot();
  const projectName = projectFlag ?? basename(repoRoot);

  // Compute the on-disk path BEFORE writing so the refuse-without-force
  // gate can inspect the existing file and the WARN line / error message
  // can name the exact path the operator would touch.
  let filePath: string;
  if (level === 'workspace') {
    filePath = workspaceSettingsPath(repoRoot);
  } else if (level === 'project') {
    filePath = projectSettingsPath(repoRoot, projectName);
  } else {
    // session — sessionId is non-empty per the gate above.
    filePath = sessionSettingsPath(repoRoot, projectName, sessionId as string);
  }

  if (existsSync(filePath)) {
    if (!force) {
      process.stderr.write(
        `gobbi config init: settings.json already exists at ${filePath}; pass --force to re-seed\n`,
      );
      process.exit(2);
    }
    process.stderr.write(
      `gobbi config init: WARN — overwriting existing settings.json at ${filePath} (--force)\n`,
    );
  }

  // Minimum-valid seed — everything else lands via the cascade at resolve
  // time. AJV validation runs inside `writeSettingsAtLevel`; we don't
  // duplicate it here.
  const seed: Settings = { schemaVersion: 1 };

  try {
    if (level === 'workspace') {
      writeSettingsAtLevel(repoRoot, 'workspace', seed);
    } else if (level === 'project') {
      writeSettingsAtLevel(repoRoot, 'project', seed, undefined, projectName);
    } else {
      writeSettingsAtLevel(
        repoRoot,
        'session',
        seed,
        sessionId as string,
        projectName,
      );
    }
  } catch (err) {
    emitCascadeError('init', err);
  }
}

// ---------------------------------------------------------------------------
// Helpers — path walk (get)
// ---------------------------------------------------------------------------

/**
 * Walk a dot-path down a tree. Returns the leaf value, an intermediate
 * subtree (object / array / null), or `undefined` when any segment is
 * missing or lands on a non-record before the walk terminates.
 *
 * The JSON serialization happens at the caller — both primitives and
 * subtrees print as `JSON.stringify(value)` so consumers can
 * unambiguously parse the output.
 */
function walkPath(tree: Settings, dotPath: string): unknown {
  const parts = dotPath.split('.');
  let current: unknown = tree;
  for (const part of parts) {
    if (!isRecord(current)) return undefined;
    if (!(part in current)) return undefined;
    current = current[part];
  }
  return current;
}

// ---------------------------------------------------------------------------
// Helpers — path set (set)
// ---------------------------------------------------------------------------

/**
 * Produce a new tree with `value` written at `dotPath`. Intermediate
 * records are created when absent. If an intermediate already exists but
 * is not a record (e.g. a primitive, `null`, or an array), it is
 * replaced with a fresh record — deliberate, and symmetrical with the
 * "arrays replace" semantic in `settings.ts::deepMerge`.
 *
 * Returns a new top-level object; does not mutate `tree`.
 */
function setPath(
  tree: Record<string, unknown>,
  dotPath: string,
  value: unknown,
): Record<string, unknown> {
  const parts = dotPath.split('.');

  function recurse(
    node: Record<string, unknown>,
    remaining: readonly string[],
  ): Record<string, unknown> {
    const [head, ...tail] = remaining;
    if (head === undefined) return node;

    if (tail.length === 0) {
      return { ...node, [head]: value };
    }

    const existing = node[head];
    const child: Record<string, unknown> = isRecord(existing) ? { ...existing } : {};
    return { ...node, [head]: recurse(child, tail) };
  }

  return recurse(tree, parts);
}

// ---------------------------------------------------------------------------
// Helpers — value coercion
// ---------------------------------------------------------------------------

/**
 * Coerce a CLI string argument to a typed JSON value, per ideation §4.4.
 *
 *   - Leading `[` → `JSON.parse` as array (throws if invalid JSON).
 *   - Leading `{` → `JSON.parse` as object (throws if invalid JSON).
 *   - `"true"` / `"false"` → boolean.
 *   - `"null"` → `null`.
 *   - Integer / decimal / signed-number string → `number`.
 *   - Anything else → string (returned verbatim).
 *
 * AJV schema-sensitive coercion is intentionally avoided — the validator
 * runs after the write walk and rejects type mismatches with an explicit
 * error. That keeps coercion context-free and predictable; users who
 * want to stringify an otherwise-number-shaped value can wrap the value
 * in JSON.stringify at the shell level (e.g. `'"60000"'`).
 *
 * Throws `SyntaxError` when a `[...]` / `{...}` input is not valid JSON.
 */
export function coerceValue(raw: string): unknown {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null') return null;

  const trimmed = raw.trimStart();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    // JSON.parse throws SyntaxError on invalid JSON; caller catches.
    return JSON.parse(raw) as unknown;
  }

  // Recognise plain decimal numbers. Avoid `Number(raw)` because it
  // coerces `""`, whitespace-only strings, and hex / binary / exp forms
  // in surprising ways; this regex restricts to signed integers and
  // decimals which matches the intent of CLI numeric input.
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(raw)) {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }

  return raw;
}

// ---------------------------------------------------------------------------
// Helpers — flag resolution
// ---------------------------------------------------------------------------

/**
 * Normalise `--level` input. Returns `undefined` when absent (cascade-
 * resolve mode for `get`; default-`session` for `set`), the literal
 * level on valid input, or the sentinel `'invalid'` on anything else so
 * callers can branch with exit 2.
 */
function parseLevel(raw: unknown): SettingsLevel | undefined | 'invalid' {
  if (raw === undefined) return undefined;
  if (raw === 'workspace' || raw === 'project' || raw === 'session') return raw;
  return 'invalid';
}

/**
 * Resolves session-id with the `--session-id` flag taking precedence over
 * the `$CLAUDE_SESSION_ID` env var. When both are present, the explicit flag
 * wins — more specific input overrides the ambient env.
 *
 * The CLI is plugin-neutral: it reads `$CLAUDE_SESSION_ID` and accepts
 * `--session-id` directly. It does NOT know about `$CODEX_COMPANION_SESSION_ID`.
 * The `/gobbi` orchestrator skill is responsible for env discovery (e.g.
 * `$CODEX_COMPANION_SESSION_ID`) and passes the discovered id via `--session-id`
 * per the `cli-vs-skill-session-id` gotcha.
 *
 * Returns `undefined` when neither source supplies a value.
 */
function resolveSessionId(
  flagValue: string | undefined,
  envValue: string | undefined,
): string | undefined {
  if (flagValue !== undefined && flagValue !== '') return flagValue;
  if (envValue !== undefined && envValue !== '') return envValue;
  return undefined;
}

// ---------------------------------------------------------------------------
// Helpers — error surfacing
// ---------------------------------------------------------------------------

/**
 * Surface a cascade error as a stderr diagnostic and exit 2. Dispatches
 * on `ConfigCascadeError.code` so the message tells the user what went
 * wrong at which tier (when known).
 *
 * The `verb` prefix (`get` / `set` / `init`) disambiguates CLI error
 * lines when users chain commands in a shell script.
 *
 * Returns `never` — the call always exits the process — so callers can
 * narrow control flow after invoking it.
 */
function emitCascadeError(verb: 'get' | 'set' | 'init', err: unknown): never {
  if (err instanceof ConfigCascadeError) {
    const tier = err.tier !== undefined ? ` [${err.tier}]` : '';
    process.stderr.write(`gobbi config ${verb}${tier}: ${err.message}\n`);
  } else {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi config ${verb}: ${message}\n`);
  }
  process.exit(2);
}
