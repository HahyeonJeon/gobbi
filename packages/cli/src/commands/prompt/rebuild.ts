/**
 * gobbi prompt rebuild — materialize `spec.json` from the JSONL chain.
 *
 * Wave C.1.7 (issue #156). Recovery path for two cases (synthesis §12
 * C.1.7):
 *
 *   1. Crash mid-write: `gobbi prompt patch` committed the SQL
 *      transaction (event row + prompt_patches row) and appended the
 *      JSONL line, but SIGKILL fired before the temp+rename
 *      spec.json write. The next invocation refuses with the
 *      diagnostic that names this command. `gobbi prompt rebuild
 *      <prompt-id>` folds the chain and writes the post-fold spec
 *      via temp+rename.
 *
 *   2. Operator hand-edit: someone edited spec.json directly,
 *      diverging from the chain head. Detected by the same
 *      `pre_hash != last patch row's post_hash` check;
 *      `gobbi prompt rebuild <prompt-id>` restores the file.
 *
 * Pure recovery — does NOT mutate `prompt_patches` or `events`. The
 * SQLite tables are the truth; this command makes the on-disk
 * spec.json reflect them.
 *
 * # Validation
 *
 * Before writing, the rebuilt spec is `validateStepSpec`-checked. If
 * the fold result fails schema validation (a corrupted intermediate
 * patch produced an invalid spec earlier in the chain), the command
 * refuses to write and emits a diagnostic naming the offending
 * patchId. Operator's job to figure out next steps — typically
 * `git revert` of the bad patch, then re-apply the clean tail.
 */

import { existsSync, renameSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { canonicalize } from '../../lib/canonical-json.js';
import { foldChain } from '../../lib/prompt-evolution.js';
import { validateStepSpec } from '../../specs/_schema/v1.js';
import {
  PROMPT_ID_VALUES,
  isPromptId,
  promptEvolutionPath,
  resolveProjectName,
  specJsonPath,
  type PromptId,
} from './paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi prompt rebuild <prompt-id> [options]

Materialize a per-step spec.json from the JSONL evolution chain.
Recovery-only — does not mutate the chain or any SQLite table.

Arguments:
  <prompt-id>             One of: ${PROMPT_ID_VALUES.join(', ')}.

Options:
  --dry-run               Fold the chain and validate the result, but
                          write nothing. Prints the post-fold hash and
                          entry count.
  --help, -h              Show this help message.

Notes:
  - Refuses to write if the rebuilt spec fails schema validation.
  - Refuses to write if the JSONL chain is missing or corrupt.
  - Writes via temp+rename so partial-write SIGKILL leaves the
    on-disk spec.json intact.`;

// ---------------------------------------------------------------------------
// Public entry
// ---------------------------------------------------------------------------

export async function runPromptRebuild(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  let positionals: string[];
  let dryRun: boolean;

  try {
    const parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        'dry-run': { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    positionals = parsed.positionals;
    dryRun = parsed.values['dry-run'] === true;
  } catch (err) {
    process.stderr.write(
      `gobbi prompt rebuild: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  const promptIdArg = positionals[0];
  if (promptIdArg === undefined) {
    process.stderr.write(`gobbi prompt rebuild: missing <prompt-id>\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  if (!isPromptId(promptIdArg)) {
    process.stderr.write(
      `gobbi prompt rebuild: invalid prompt-id '${promptIdArg}' ` +
        `(valid: ${PROMPT_ID_VALUES.join(', ')})\n`,
    );
    process.exit(1);
  }
  const promptId: PromptId = promptIdArg;

  rebuildOne(promptId, dryRun);
}

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

export interface RebuildResult {
  readonly promptId: PromptId;
  readonly entryCount: number;
  readonly postHash: string;
  readonly written: boolean;
}

export function rebuildOne(promptId: PromptId, dryRun: boolean): RebuildResult {
  const projectName = resolveProjectName();
  const jsonlPath = promptEvolutionPath(projectName, promptId);

  if (!existsSync(jsonlPath)) {
    process.stderr.write(
      `gobbi prompt rebuild: prompt-evolution chain not found at ${jsonlPath}; nothing to rebuild from.\n`,
    );
    process.exit(1);
  }

  let folded;
  try {
    folded = foldChain(jsonlPath);
  } catch (err) {
    process.stderr.write(
      `gobbi prompt rebuild: chain fold failed: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.exit(1);
  }

  // Schema-validate before writing.
  const validation = validateStepSpec(folded.spec);
  if (!validation.ok) {
    process.stderr.write(
      `gobbi prompt rebuild: rebuilt spec fails schema validation — refusing to write.\n` +
        `The chain at ${jsonlPath} contains a patch that produced an invalid spec.\n` +
        `Errors:\n${JSON.stringify(validation.errors, null, 2)}\n`,
    );
    process.exit(1);
  }

  const result: RebuildResult = {
    promptId,
    entryCount: folded.entryCount,
    postHash: folded.lastPostHash,
    written: false,
  };

  if (dryRun) {
    printSummary(result);
    return result;
  }

  // Atomic write via temp+rename.
  const specPath = specJsonPath(promptId);
  const tmp = `${specPath}.tmp`;
  writeFileSync(tmp, canonicalize(folded.spec) + '\n', { encoding: 'utf8' });
  renameSync(tmp, specPath);

  const finalResult: RebuildResult = { ...result, written: true };
  printSummary(finalResult);
  return finalResult;
}

function printSummary(result: RebuildResult): void {
  const lines = [
    `gobbi prompt rebuild — ${result.written ? 'wrote' : 'dry-run'}`,
    `prompt-id:     ${result.promptId}`,
    `entry_count:   ${result.entryCount}`,
    `post_hash:     ${result.postHash}`,
  ];
  process.stdout.write(`${lines.join('\n')}\n`);
}
