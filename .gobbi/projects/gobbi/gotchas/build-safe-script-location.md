# build:safe runs from packages/cli only — not from repo root

---
priority: high
tech-stack: bun, typescript
enforcement: advisory
---

**Priority:** High — blocks any agent that runs verification at repo root.

## What happened

A PR-CFM-E executor invoked `bun run build:safe` from the worktree root (where most agents start their cwd). It returned `error: Script not found "build:safe"`. The agent initially mistook this for an environment issue.

## User feedback

The Planning evaluator (F-ARCH-1) caught this in the plan review: "`bun run build:safe` is only defined in `packages/cli/package.json` — running it at the worktree root produces `Script not found`, not a build error. Every T1-T6 verification block must prefix `cd packages/cli &&`."

## Correct approach

Always `cd packages/cli` (or use `bun run --cwd packages/cli build:safe`) before invoking the build:safe verification step:

- ✅ `cd packages/cli && bun run build:safe && bun test`
- ✅ `cd packages/cli && bun test src/__tests__/integration/some.test.ts`
- ❌ `bun run build:safe` from `/playinganalytics/git/gobbi/`
- ❌ `bun run build:safe` from `.gobbi/projects/gobbi/worktrees/<branch>/`

This applies to both `build:safe` AND `bun test` — the test suite is rooted at `packages/cli/`. Test paths in commands also become relative to packages/cli (e.g., `bun test src/__tests__/...` not `bun test packages/cli/src/__tests__/...`).

## Related

The `cross-session-gotcha-bundle.md` "build:safe must run before bun test" companion gotcha covers when to run it. This one covers where.
