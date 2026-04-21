/**
 * gobbi config — unified settings CLI (Wave B stub; full surface lands in Wave C.1).
 *
 * Final surface (per ideation §5, collapsing the Pass-3 multi-verb CLI to two):
 *
 *   gobbi config get <key> [--level workspace|project|session] [--session-id <id>]
 *   gobbi config set <key> <value> [--level workspace|project|session] [--session-id <id>]
 *
 * Wave B decommissioned the SQLite + provenance infrastructure this file
 * used to drive. Wave C.1 rewrites the body against the new
 * `settings-io.ts::resolveSettings` + `writeSettingsAtLevel` primitives
 * and implements the deep-path walker + value coercion on the new shape.
 *
 * This stub keeps the exported `runConfig` signature stable so the CLI
 * registry in `cli.ts` continues to compile; invoking it prints a
 * "Pass 3 finalize in progress" message and exits 2.
 */

import { error } from '../lib/style.js';

const STUB_MESSAGE =
  'gobbi config: Pass 3 finalize in progress — the `get` / `set` surface lands in Wave C.1. ' +
  'Until then, edit the settings files directly: ' +
  '.gobbi/settings.json (workspace), .gobbi/project/settings.json (project), ' +
  '.gobbi/sessions/<id>/settings.json (session).';

/**
 * Top-level handler for `gobbi config`. Rewritten by Wave C.1.
 *
 * The signature matches the previous one (`args: string[]` from
 * `process.argv.slice(3)`) so the CLI registry continues to compile.
 */
export async function runConfig(args: string[]): Promise<void> {
  // `args` is deliberately consumed so tsc's noUnusedParameters is satisfied.
  void args;
  console.error(error(STUB_MESSAGE));
  process.exit(2);
}
