# `bun test` requires a fresh `bun run build:safe` first

**Priority:** Medium
**Reference:** PR-FIN-2a-i rebase (PR #227); PR-FIN-5 (#226) introduced `build:safe` and the `dist/specs/index.json` ship-list checks.

## What happened

After rebasing PR-FIN-2a-i onto develop tip `e41dcb3` (post PR-FIN-5 merge), `bun test` from the worktree root reported 2 failures in `packages/cli/src/__tests__/integration/build-pipeline.test.ts`:

- `build pipeline (PR-FIN-5) > build:safe ships dist/specs/index.json next to dist/cli.js`
- `build pipeline (PR-FIN-5) > npm pack --dry-run lists dist/specs/index.json in the ship-list`

Running the same test file in isolation reported it green. The full-suite failures looked like real regressions. They weren't — the failures simply meant the `dist/specs/` directory hadn't been populated for that test run.

PR-FIN-5 added a `build:safe` script to `packages/cli/package.json` whose only difference from `build` is that it copies `src/specs/` into `dist/specs/` (stripping `__tests__/`). Two new tests assert that `dist/specs/index.json` exists. If `dist/specs/` is missing or stale, those two tests fail; if it's present and current, the rest of the suite is happy.

Plain `bun run build` (without `:safe`) does NOT populate `dist/specs/` because it only runs `bun build ./src/cli.ts`.

## User feedback

(Filed in the Overall-perspective evaluation of PR #227; this caught the orchestrator off-guard during the rebase verification gate and added a few minutes of detective work before the fix was obvious.)

## Correct approach

After any of the following events, run `cd packages/cli && bun run build:safe` BEFORE the full `bun test`:

- Initial worktree creation (the worktree's `dist/` is empty).
- `git checkout` to a different branch.
- A rebase that touches `packages/cli/src/specs/`.
- A merge that pulls in PR-FIN-5 or any later change to `build:safe`.
- After running `bun run gen:predicates` (regenerates predicates which the spec graph indirectly depends on).

The minimum command sequence post-rebase is:

```
cd packages/cli && bun run build:safe && cd .. && bun test
```

`bun run build` (no `:safe`) is fine for a quick incremental cli.js rebuild during inner-loop development, but it is NOT enough for the full test suite to pass.

## How to apply

- For executor agents: include `bun run build:safe` (not `bun run build`) in every verification gate that runs the full test suite.
- For orchestrators: after any rebase or branch checkout in a worktree, run `build:safe` once before declaring the suite green.
- For the next session: this caveat is real until the test suite is restructured to either (a) run `build:safe` as a pretest hook or (b) drop the disk-shipping assertion in favor of a build-output unit test. Until then, treat `build:safe` as a hard prerequisite of `bun test`.
