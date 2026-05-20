# `paths.ts` needs Option A fallback for dev-mode worktrees

**Priority:** Medium
**Reference:** PR-FIN-2a-iii (issue #232) — locks the three-candidate chain in `packages/cli/src/specs/paths.ts`.

## What happened

In dev-mode (a fresh worktree where `bun test` runs from the worktree root), `cli.js` lives at `packages/cli/dist/cli.js`, but `dist/specs/` may be empty before `build:safe` runs its post-build `cp src/specs dist/specs` step. The pre-Option A resolver had only two candidates:

1. `<this-dir>/specs/` — the bundled-mode candidate. Misses on a fresh worktree because `dist/specs/` has not been seeded.
2. `<this-dir>/` — the source-mode candidate. Misses too: when `cli.js` is the entry point, `<this-dir>` is `dist/`, which has no `index.json` of its own.

Both candidates miss → `getSpecsDir` throws → every CLI command that loads the workflow graph (`graph.ts`, `next.ts`, `validate.ts`, `stop.ts`) blows up before doing useful work. The user-visible failure mode is `gobbi workflow next` exiting with `Cannot locate specs directory` immediately after a fresh `git worktree add`, with no obvious link to the missing `dist/specs/` copy.

This was filed proactively from the PR-FIN-2a-i and PR-FIN-2a-ii evaluation rounds (where the resolver's two-candidate brittleness was repeatedly observed) and addressed in PR-FIN-2a-iii.

## User feedback

(No direct correction this session — the issue was pre-empted by the evaluators in PR-FIN-2a-i / 2a-ii. This gotcha is filed so future agents working on `paths.ts`, the build pipeline, or worktree bootstrap know why a third candidate is necessary.)

## Correct approach

The resolver in `packages/cli/src/specs/paths.ts` now tries three candidates in order:

1. `<this-dir>/specs/` — bundled-mode (post-`build:safe`).
2. `<this-dir>/` — source-mode (`bun test` resolving `paths.ts` from `src/specs/`).
3. `<this-dir>/../src/specs/` — dev-worktree fallback. Only ever wins in repo-local worktrees where the bundled binary is invoked before `build:safe` populates `dist/specs/`. In a published npm package, `src/` is filtered by `package.json::files`, so candidate 3 fails gracefully and the throw fires — there is no dev-only resolution leaking into shipped artifacts.

The throw message lists all three attempted paths so the failure is self-diagnosing.

A path-stability unit test at `packages/cli/src/specs/__tests__/paths.test.ts` mocks `existsSync` to force all three candidates absent, parses the candidate paths back out of the throw message, and asserts each is absolute and stable across `process.cwd()` changes. The test does NOT assert existence — existence is mode-dependent (after `build:safe` runs, candidate 1 wins) and an existence assertion would either tautologically pass or flake based on whether `dist/specs/` had been seeded. Path-stability is the actual invariant: `paths.ts` uses `import.meta.url`-relative resolution, so candidate paths must not shift when the caller's cwd changes.

## How to apply

- Future edits to `paths.ts` MUST preserve all three candidates and the dist-first ordering. Do not collapse candidate 3 even if it "looks unused in CI" — CI runs `build:safe` first; humans on fresh worktrees do not.
- Future edits to the build pipeline MUST keep the `cp src/specs dist/specs` step in `build:safe`. If that step is removed, the production candidate 1 stops resolving and the resolver falls through to candidate 2 or 3, which may or may not be present in shipped tarballs.
- If a future change extends or replaces the candidate chain, update `paths.test.ts` to assert path-stability of every new candidate. Existence-based assertions remain off-limits.
