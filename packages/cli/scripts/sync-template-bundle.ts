#!/usr/bin/env bun
/**
 * Template-bundle mirror.
 *
 * Copies the canonical `.gobbi/projects/gobbi/{skills,agents,rules}/`
 * content from the workspace root into the CLI package directory
 * (`packages/cli/.gobbi/projects/gobbi/{skills,agents,rules}/`) so the
 * npm `files` field can ship the three directories inside the tarball.
 *
 * ## Why this exists
 *
 * The npm `files` field only includes paths that live under the
 * package directory. The source of truth for the template bundle lives
 * at the workspace root `.gobbi/projects/gobbi/` — a symlink from
 * `packages/cli/.gobbi/projects/gobbi/*` to the workspace-root copy
 * does NOT work: `npm pack` refuses to follow symlinks that escape the
 * package boundary into the tarball (verified via `npm pack --dry-run`
 * in PR #119 W5.3 execution).
 *
 * The chosen alternative — duplicate the content at pack time — keeps
 * one source-of-truth in the repo for dogfooding, and lets the tarball
 * remain self-contained for downstream consumers. The sync is
 * idempotent: a second run over unchanged inputs leaves the target
 * tree bit-identical.
 *
 * ## Scope boundary (checkpoint lock)
 *
 * Only `skills/`, `agents/`, and `rules/` are copied. Project docs
 * (design, decisions, references, etc.) are NOT distributed — the
 * template-bundle scope is locked to those three directories. Extending
 * the bundle requires a design decision, a bump of the manifest shape
 * in `commands/install.ts`, and an update here.
 *
 * ## Invocation
 *
 *   bun run scripts/sync-template-bundle.ts [workspaceRoot]
 *
 * Defaults to `<this script>/../..` (the workspace root two directories
 * above `packages/cli/`). Used as the `prepack` hook in
 * `packages/cli/package.json` so `npm pack` / `npm publish` always see
 * fresh content.
 */

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const TEMPLATE_KINDS = ['skills', 'agents', 'rules'] as const;

function workspaceRootDefault(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // packages/cli/scripts/ -> packages/cli/ -> packages/ -> <workspace root>
  return resolve(here, '..', '..', '..');
}

function packageRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // packages/cli/scripts/ -> packages/cli/
  return resolve(here, '..');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const workspaceRoot = process.argv[2] ?? workspaceRootDefault();
const sourceRoot = join(workspaceRoot, '.gobbi', 'projects', 'gobbi');
const destRoot = join(packageRoot(), '.gobbi', 'projects', 'gobbi');

if (!existsSync(sourceRoot)) {
  process.stderr.write(
    `sync-template-bundle: source does not exist: ${sourceRoot}\n`,
  );
  process.exit(1);
}

// Wipe only the three managed kind directories, NOT the entire
// destination. Downstream tools (e.g. a future bundle expansion that
// ships additional content here) would misbehave if we nuked siblings.
for (const kind of TEMPLATE_KINDS) {
  const destKind = join(destRoot, kind);
  if (existsSync(destKind)) rmSync(destKind, { recursive: true, force: true });
}
mkdirSync(destRoot, { recursive: true });

let fileCount = 0;
for (const kind of TEMPLATE_KINDS) {
  const src = join(sourceRoot, kind);
  const dst = join(destRoot, kind);
  if (!existsSync(src)) {
    process.stderr.write(
      `sync-template-bundle: warning — source kind missing: ${src}\n`,
    );
    continue;
  }
  try {
    if (!statSync(src).isDirectory()) {
      process.stderr.write(
        `sync-template-bundle: warning — source kind is not a directory: ${src}\n`,
      );
      continue;
    }
  } catch (err) {
    process.stderr.write(
      `sync-template-bundle: cannot stat ${src}: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    continue;
  }

  // `cpSync` with `recursive` handles the tree walk; file count is
  // informational so we walk separately for the diagnostic.
  cpSync(src, dst, { recursive: true, dereference: true });
  fileCount += countFiles(dst);
}

process.stdout.write(
  `sync-template-bundle: mirrored ${fileCount} file(s) from ${sourceRoot} to ${destRoot}\n`,
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countFiles(root: string): number {
  const stack = [root];
  let n = 0;
  while (stack.length > 0) {
    const top = stack.pop();
    if (top === undefined) break;
    let entries: readonly string[];
    try {
      entries = readdirSync(top);
    } catch {
      continue;
    }
    for (const e of entries) {
      const abs = join(top, e);
      let st: ReturnType<typeof statSync>;
      try {
        st = statSync(abs);
      } catch {
        continue;
      }
      if (st.isDirectory()) stack.push(abs);
      else if (st.isFile()) n++;
    }
  }
  return n;
}
