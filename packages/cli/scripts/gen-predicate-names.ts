#!/usr/bin/env bun
/**
 * Predicate-name codegen.
 *
 * Scans every `spec.json`, `index.json`, and `*.overlay.json` file under
 * `packages/cli/src/specs/` for predicate references and emits the typed
 * union at `packages/cli/src/workflow/predicates.generated.ts`.
 *
 * The union type is consumed by `workflow/predicates.ts` — the default
 * registry is typed as `satisfies Record<PredicateName, Predicate>`, which
 * makes missing predicates a typecheck error. This is the compile-time
 * half of B.3's two-layer cross-check; runtime validation in
 * `specs/assembly.ts` covers specs loaded dynamically from disk.
 *
 * Extraction rules (literal JSON walk, no schema awareness):
 *
 *   1. From step `spec.json` files:
 *      - `transitions[*].condition` — step-level transition predicates.
 *      - `blocks.conditional[*].when` — conditional-block predicates.
 *
 *   2. From `index.json` (graph):
 *      - `transitions[*].condition` — graph-level transition predicates.
 *
 *   3. From `*.overlay.json` files:
 *      - Structural transitions at `transitions[*].condition`
 *      - `$ops[*].value.when` / `.condition` — overlay-introduced predicates.
 *        (Overlays may `append` or `replace` blocks/transitions that carry
 *        new predicate references.)
 *
 * Determinism:
 *
 *   - Predicates are emitted in strict alphabetical order.
 *   - File header is fixed; body formatting is byte-stable.
 *   - Two runs over unchanged inputs produce byte-identical output.
 *
 * Idempotency:
 *
 *   - The script overwrites the target file. When the inputs do not
 *     change, the output bytes do not change either. Running in CI vs
 *     locally produces the same result.
 *
 * Invocation:
 *
 *   - `bun run scripts/gen-predicate-names.ts` (from `packages/cli/`).
 *   - Wired as `prebuild` and `pretypecheck` in `package.json` so the
 *     generated file is always current before typecheck or build.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Path resolution — module-relative so the script works from any cwd.
// ---------------------------------------------------------------------------

const THIS_FILE = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(THIS_FILE);
const CLI_ROOT = resolve(SCRIPT_DIR, '..');
const SPECS_ROOT = resolve(CLI_ROOT, 'src', 'specs');
const OUTPUT_PATH = resolve(CLI_ROOT, 'src', 'workflow', 'predicates.generated.ts');

// ---------------------------------------------------------------------------
// File discovery — recursive walk for spec/overlay/graph JSON files.
// ---------------------------------------------------------------------------

/**
 * Return every JSON file under `root` whose basename matches the spec
 * library conventions: `spec.json`, `index.json`, or `*.overlay.json`.
 * Skips `__tests__`, `_schema`, and `__snapshots__` trees so test fixtures
 * and JSON Schema definitions are never scanned.
 */
function findSpecJsonFiles(root: string): readonly string[] {
  const results: string[] = [];
  const skipDirs = new Set(['__tests__', '_schema', '__snapshots__', 'node_modules']);

  function walk(dir: string): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (skipDirs.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      if (extname(entry.name) !== '.json') continue;
      const name = entry.name;
      if (name === 'spec.json' || name === 'index.json' || name.endsWith('.overlay.json')) {
        results.push(full);
      }
    }
  }

  walk(root);
  results.sort();
  return results;
}

// ---------------------------------------------------------------------------
// Predicate extraction — literal JSON walk.
//
// Not schema-aware: we look for `condition` (string) and `when` (string)
// properties at any depth. This is intentionally permissive — any future
// section that names a predicate under those keys is picked up without a
// script edit. The caveat is that keys named `condition` / `when` used for
// non-predicate purposes would be swept in; none exist in the current spec
// surface, and adding one would be the signal to refine the extractor.
// ---------------------------------------------------------------------------

/**
 * Walk `value` recursively, collecting the string contents of every
 * `condition` and `when` property.
 */
function collectPredicateReferences(value: unknown, sink: Set<string>): void {
  if (value === null || value === undefined) return;
  if (typeof value !== 'object') return;

  if (Array.isArray(value)) {
    for (const element of value) {
      collectPredicateReferences(element, sink);
    }
    return;
  }

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if ((key === 'condition' || key === 'when') && typeof child === 'string') {
      if (child.length > 0) sink.add(child);
      continue;
    }
    collectPredicateReferences(child, sink);
  }
}

// ---------------------------------------------------------------------------
// Parse a JSON file and emit a descriptive error including the file path
// when malformed. The script must fail loud rather than silently produce a
// stale generated file.
// ---------------------------------------------------------------------------

function parseJsonFile(path: string): unknown {
  const raw = readFileSync(path, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[gen-predicate-names] failed to parse ${path}: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// Rendering — deterministic TypeScript output.
// ---------------------------------------------------------------------------

/**
 * Produce the TypeScript source for the generated file. Output is stable
 * across runs when `names` is the same sorted array.
 */
function renderOutput(names: readonly string[], sourceFiles: readonly string[]): string {
  const header = [
    '/**',
    ' * GENERATED FILE — DO NOT EDIT BY HAND.',
    ' *',
    ' * Produced by `packages/cli/scripts/gen-predicate-names.ts` from the',
    ' * predicate references in every `spec.json`, `index.json`, and',
    ' * `*.overlay.json` under `packages/cli/src/specs/`.',
    ' *',
    ' * The union lists every predicate name a spec, overlay, or graph edge',
    ' * references. `workflow/predicates.ts` asserts its default registry via',
    ' * `satisfies Record<PredicateName, Predicate>` — adding a reference in',
    ' * a spec without registering the predicate here becomes a typecheck',
    ' * error.',
    ' *',
    ' * Regenerate with `bun run scripts/gen-predicate-names.ts` (auto-runs as',
    ' * `prebuild` / `pretypecheck` in `packages/cli/package.json`).',
    ' */',
    '',
  ].join('\n');

  const unionBody =
    names.length === 0
      ? "export type PredicateName = never;\n"
      : `export type PredicateName =\n${names
          .map((n) => `  | '${n}'`)
          .join('\n')};\n`;

  const listBody = [
    '',
    '/**',
    ' * The sorted list of predicate names the codegen discovered. Exported',
    ' * for runtime validators that walk the spec library — the typed union',
    ' * above is the compile-time surface; this constant is the runtime',
    ' * mirror.',
    ' */',
    `export const PREDICATE_NAMES: readonly PredicateName[] = [${
      names.length === 0 ? '' : '\n'
    }${names.map((n) => `  '${n}',`).join('\n')}${
      names.length === 0 ? '' : '\n'
    }] as const;`,
    '',
  ].join('\n');

  const sourceManifest = [
    '/**',
    ' * Source files the codegen scanned. Listed for auditability; not',
    ' * consumed at runtime.',
    ' */',
    `const SOURCE_FILES: readonly string[] = [${
      sourceFiles.length === 0 ? '' : '\n'
    }${sourceFiles.map((f) => `  '${f}',`).join('\n')}${
      sourceFiles.length === 0 ? '' : '\n'
    }] as const;`,
    'void SOURCE_FILES;',
    '',
  ].join('\n');

  return `${header}${unionBody}${listBody}\n${sourceManifest}`;
}

// ---------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------

function main(): void {
  const files = findSpecJsonFiles(SPECS_ROOT);
  const predicates = new Set<string>();

  for (const file of files) {
    const parsed = parseJsonFile(file);
    collectPredicateReferences(parsed, predicates);
  }

  const sorted = Array.from(predicates).sort();
  const relativeSourceFiles = files
    .map((f) => relative(CLI_ROOT, f).split('\\').join('/'))
    .sort();
  const output = renderOutput(sorted, relativeSourceFiles);

  writeFileSync(OUTPUT_PATH, output, 'utf8');

  // Print a short summary — keep quiet enough for CI logs.
  const relOut = relative(CLI_ROOT, OUTPUT_PATH).split('\\').join('/');
  console.log(
    `[gen-predicate-names] wrote ${sorted.length} predicate name(s) to ${relOut} ` +
      `(from ${files.length} spec file(s))`,
  );
}

main();
