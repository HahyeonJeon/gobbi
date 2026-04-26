/**
 * gobbi prompt render — render a per-step `spec.json` in one of three forms.
 *
 * Wave C.1.5 (issue #156). Operator-only — emits to stdout, no
 * filesystem mutation. Three formats per synthesis §8:
 *
 *   - `--format=markdown`   Flat readable doc walking `StepBlocks` in
 *                           source order. Suitable for `gobbi prompt
 *                           render <step> --format=markdown | less`
 *                           reviews. No session.state, no
 *                           dynamic.context — this is the spec-as-spec.
 *   - `--format=composed`   The byte-exact `CompiledPrompt.text` plus
 *                           `staticPrefixHash`. Reuses
 *                           `assembly.ts::compile()` directly, NOT a
 *                           re-implementation, so the rendered output
 *                           is byte-identical to what the runtime
 *                           orchestrator would produce. Synthesis §8.1
 *                           critical invariant.
 *   - `--format=diff`       Unified diff between the markdown form at
 *                           a baseline patch-id and the markdown form
 *                           at HEAD. Folds the JSONL chain twice and
 *                           shells out to `git --no-pager diff
 *                           --no-index` so we ship zero new diff
 *                           dependencies.
 *
 * # Source vs. installed CLI
 *
 * Reads from the source `packages/cli/src/specs/<step>/spec.json` —
 * NOT the bundled `dist/`. Operators on the installed CLI cannot
 * render an installed prompt; they render the source repo. The
 * dispatcher comment in `commands/prompt.ts` carries this.
 */

import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import {
  compile,
  type CompileInput,
  type CompilePredicateRegistry,
  type DynamicContext,
} from '../../specs/assembly.js';
import { defaultBudgetAllocator } from '../../specs/budget.js';
import { validateStepSpec } from '../../specs/_schema/v1.js';
import type {
  StepSpec,
  StepBlocks,
  BlockContent,
  ConditionalBlock,
} from '../../specs/types.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowStep } from '../../workflow/state.js';
import { defaultPredicates } from '../../workflow/predicates.js';
import { foldChain } from '../../lib/prompt-evolution.js';
import {
  PROMPT_ID_VALUES,
  type PromptId,
  resolveSpecsRoot,
  resolveProjectName,
  promptEvolutionPath,
  isPromptId,
} from './paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi prompt render <prompt-id> [options]

Render a per-step spec.json in one of three forms.

Arguments:
  <prompt-id>             One of: ${PROMPT_ID_VALUES.join(', ')}.

Options:
  --format <format>       Render form. One of: markdown, composed, diff.
                          Default: markdown.
  --baseline <patch-id>   Required when --format=diff. The chain entry's
                          patchId to diff HEAD against.
  --allow-empty-diff      When --format=diff and the chain has only the
                          genesis line: exit 0 instead of refusing.
  --help, -h              Show this help message.

Notes:
  - Reads source spec.json at packages/cli/src/specs/<prompt-id>/spec.json.
    Operators on the installed CLI cannot render installed prompts; they
    render the source repo.
  - composed-form output is byte-identical to what the runtime
    orchestrator emits for the same CompileInput (synthesis §8.1).`;

// ---------------------------------------------------------------------------
// Public entry
// ---------------------------------------------------------------------------

export async function runPromptRender(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  let positionals: string[];
  let format: string;
  let baseline: string | undefined;
  let allowEmptyDiff: boolean;

  try {
    const parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        format: { type: 'string', default: 'markdown' },
        baseline: { type: 'string' },
        'allow-empty-diff': { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    positionals = parsed.positionals;
    format = parsed.values.format ?? 'markdown';
    baseline = parsed.values.baseline;
    allowEmptyDiff = parsed.values['allow-empty-diff'] === true;
  } catch (err) {
    process.stderr.write(
      `gobbi prompt render: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  const promptIdArg = positionals[0];
  if (promptIdArg === undefined) {
    process.stderr.write(`gobbi prompt render: missing <prompt-id>\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  if (!isPromptId(promptIdArg)) {
    process.stderr.write(
      `gobbi prompt render: invalid prompt-id '${promptIdArg}' ` +
        `(valid: ${PROMPT_ID_VALUES.join(', ')})\n`,
    );
    process.exit(1);
  }
  const promptId: PromptId = promptIdArg;

  if (format !== 'markdown' && format !== 'composed' && format !== 'diff') {
    process.stderr.write(
      `gobbi prompt render: unknown --format '${format}' ` +
        `(valid: markdown, composed, diff)\n`,
    );
    process.exit(2);
  }

  // ----- Render dispatch -------------------------------------------------
  if (format === 'markdown') {
    const spec = loadSpec(promptId);
    process.stdout.write(renderMarkdown(spec));
    return;
  }
  if (format === 'composed') {
    const spec = loadSpec(promptId);
    const composed = renderComposed(spec, promptId);
    process.stdout.write(composed);
    return;
  }
  // format === 'diff'
  if (baseline === undefined) {
    process.stderr.write(
      `gobbi prompt render: --baseline <patch-id> is required when --format=diff\n`,
    );
    process.exit(2);
  }
  await renderDiff(promptId, baseline, allowEmptyDiff);
}

// ---------------------------------------------------------------------------
// Spec loading
// ---------------------------------------------------------------------------

function loadSpec(promptId: PromptId): StepSpec {
  const here = dirname(fileURLToPath(import.meta.url));
  // commands/prompt/render.ts → ../../specs/<promptId>/spec.json
  const path = resolve(here, '..', '..', 'specs', promptId, 'spec.json');
  if (!existsSync(path)) {
    process.stderr.write(`gobbi prompt render: spec not found at ${path}\n`);
    process.exit(1);
  }
  const raw: unknown = JSON.parse(readFileSync(path, 'utf8'));
  const result = validateStepSpec(raw);
  if (!result.ok) {
    process.stderr.write(
      `gobbi prompt render: ${promptId}/spec.json fails schema validation:\n` +
        `${JSON.stringify(result.errors, null, 2)}\n`,
    );
    process.exit(1);
  }
  return result.value;
}

// ---------------------------------------------------------------------------
// markdown rendering — flat readable doc walking StepBlocks in source order
// ---------------------------------------------------------------------------

/**
 * Render a `StepBlocks` payload as a flat markdown doc. No session.state,
 * no dynamic.context — runtime-only sections are out of scope here.
 *
 * Section ordering matches `types.ts::StepBlocks`: static → conditional
 * → delegation → synthesis → completion → footer. Each block is an H2
 * `## <id>` heading.
 *
 * Exported for tests; the render command pipes it to stdout.
 */
export function renderMarkdown(spec: StepSpec): string {
  const lines: string[] = [];
  const meta = spec.meta;
  lines.push(`# ${meta.description}`);
  lines.push('');

  const blocks: StepBlocks = spec.blocks;

  for (const block of blocks.static) {
    lines.push(...renderBlock(block));
  }
  for (const block of blocks.conditional) {
    lines.push(...renderConditional(block));
  }
  for (const [key, block] of Object.entries(blocks.delegation)) {
    lines.push(`## delegation: ${key}`);
    lines.push('');
    lines.push(block.content.trimEnd());
    lines.push('');
  }
  for (const block of blocks.synthesis) {
    lines.push(...renderBlock(block));
  }

  // Completion as an H2 with a numbered criteria list.
  lines.push('## completion');
  lines.push('');
  lines.push(blocks.completion.instruction.trimEnd());
  lines.push('');
  if (blocks.completion.criteria.length > 0) {
    blocks.completion.criteria.forEach((c, i) => {
      lines.push(`${i + 1}. ${c}`);
    });
    lines.push('');
  }

  // Footer
  lines.push('## footer');
  lines.push('');
  lines.push(blocks.footer.trimEnd());
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function renderBlock(block: BlockContent): readonly string[] {
  return [`## ${block.id}`, '', block.content.trimEnd(), ''];
}

function renderConditional(block: ConditionalBlock): readonly string[] {
  return [
    `## ${block.id} (conditional: ${block.when})`,
    '',
    block.content.trimEnd(),
    '',
  ];
}

// ---------------------------------------------------------------------------
// composed rendering — calls assembly.compile() and emits text +
// staticPrefixHash header.
// ---------------------------------------------------------------------------

const FIXED_TIMESTAMP = '2026-04-26T12:00:00.000Z';
const GENEROUS_WINDOW = 200_000;

const predicates: CompilePredicateRegistry = defaultPredicates;

function buildCompileInput(spec: StepSpec, promptId: PromptId): CompileInput {
  // Match the deterministic-state convention from `footer.snap.test.ts`.
  // `currentStep` matches the prompt-id by default; this makes the
  // composed-render output reproducible across invocations.
  const currentStep: WorkflowStep = promptId as WorkflowStep;
  const state = {
    ...initialState(`session-render-${promptId}`),
    currentStep,
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

/**
 * Render the composed form. Produces:
 *
 *     # gobbi prompt render <promptId> --format=composed
 *     # staticPrefixHash: <hash>
 *
 *     <CompiledPrompt.text>
 *
 * Exported for tests.
 */
export function renderComposed(spec: StepSpec, promptId: PromptId): string {
  const input = buildCompileInput(spec, promptId);
  const out = compile(input, {
    allocator: defaultBudgetAllocator,
    contextWindowTokens: GENEROUS_WINDOW,
  });
  return [
    `# gobbi prompt render ${promptId} --format=composed`,
    `# staticPrefixHash: ${out.staticPrefixHash}`,
    '',
    out.text,
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// diff rendering — fold chain to baseline, fold chain to head, shell-diff.
// ---------------------------------------------------------------------------

async function renderDiff(
  promptId: PromptId,
  baselinePatchId: string,
  allowEmptyDiff: boolean,
): Promise<void> {
  const projectName = resolveProjectName();
  const specsRoot = resolveSpecsRoot();
  const jsonlPath = promptEvolutionPath(projectName, promptId);

  if (!existsSync(jsonlPath)) {
    process.stderr.write(
      `gobbi prompt render: prompt-evolution chain not found at ${jsonlPath}; ` +
        `run \`gobbi prompt patch\` to seed the chain or \`gobbi prompt rebuild\` to recover.\n`,
    );
    process.exit(1);
  }

  let head;
  try {
    head = foldChain(jsonlPath);
  } catch (err) {
    process.stderr.write(
      `gobbi prompt render: chain fold failed: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.exit(1);
  }

  // If the chain has only the genesis line, --format=diff has nothing
  // to compare against. Per Planning routed-resolution: refuse with a
  // clear message; --allow-empty-diff lets operators opt in.
  if (head.entryCount <= 1) {
    if (allowEmptyDiff) {
      process.stdout.write('');
      return;
    }
    process.stderr.write(
      `gobbi prompt render: prompt has no patches beyond genesis; nothing to diff. ` +
        `Use --allow-empty-diff to exit 0.\n`,
    );
    process.exit(1);
  }

  // Fold a truncated chain — every line up to AND INCLUDING the
  // baseline patchId — to produce the baseline spec. Achieved by
  // copying the JSONL up to the baseline line into a temp file and
  // calling foldChain on that.
  const baselineSpec = foldChainTruncated(jsonlPath, baselinePatchId);
  if (baselineSpec === null) {
    process.stderr.write(
      `gobbi prompt render: --baseline ${baselinePatchId} not found in the chain at ${jsonlPath}.\n`,
    );
    process.exit(1);
  }

  // Render markdown for both, then diff.
  const baselineMd = renderMarkdown(baselineSpec as StepSpec);
  const headMd = renderMarkdown(head.spec as StepSpec);

  const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-diff-'));
  try {
    const baselinePath = join(tmp, 'baseline.md');
    const headPath = join(tmp, 'head.md');
    writeFileSync(baselinePath, baselineMd, 'utf8');
    writeFileSync(headPath, headMd, 'utf8');
    let diff: string;
    try {
      const out = execFileSync(
        'git',
        ['--no-pager', 'diff', '--no-index', baselinePath, headPath],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
      );
      // git diff exits 0 when files are identical
      diff = out;
    } catch (err) {
      // git diff exits 1 when files differ — that is the expected path.
      const e = err as NodeJS.ErrnoException & { stdout?: Buffer | string; status?: number };
      if (e.status === 1 && e.stdout !== undefined) {
        diff = typeof e.stdout === 'string' ? e.stdout : e.stdout.toString('utf8');
      } else {
        process.stderr.write(
          `gobbi prompt render: git diff failed: ${e.message}\n`,
        );
        process.exit(1);
      }
    }
    process.stdout.write(diff);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
    // Side-effect noted: specsRoot is read at fold time but no other
    // mutation is performed here; the temp dir is the only filesystem
    // touch.
    void specsRoot;
  }
}

/**
 * Fold the chain up to and including the entry whose `patchId` equals
 * `baselinePatchId`. Returns `null` when the patch-id is absent. Used
 * by --format=diff to compute the baseline spec.
 *
 * Implementation: read the JSONL, truncate the line list at the match,
 * write to a temp JSONL, call `foldChain` on that. Reuses the chain
 * folder's diagnostics rather than reimplementing them.
 */
function foldChainTruncated(
  path: string,
  baselinePatchId: string,
): unknown | null {
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split('\n').filter((l) => l.length > 0);
  let cutIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    let parsed: { patchId?: unknown };
    try {
      parsed = JSON.parse(line) as { patchId?: unknown };
    } catch {
      // foldChain will surface this; we are best-effort here.
      continue;
    }
    if (parsed.patchId === baselinePatchId) {
      cutIndex = i;
      break;
    }
  }
  if (cutIndex < 0) return null;

  const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-fold-'));
  try {
    const truncatedPath = join(tmp, 'truncated.jsonl');
    writeFileSync(
      truncatedPath,
      lines.slice(0, cutIndex + 1).join('\n') + '\n',
      'utf8',
    );
    return foldChain(truncatedPath).spec;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
