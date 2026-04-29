# `bun run build:safe` fails on fresh worktree (missing `dist/` directory)

**Priority:** Medium (rework needed)

**Tech-stack:** bun, gobbi-cli

## What happened

In a freshly-created git worktree (e.g., `git worktree add .gobbi/projects/gobbi/worktrees/pr-fin-1e ...`), running `bun run build:safe` fails:

```
$ bun run build:safe
$ bun run gen:predicates
$ bun build ./src/cli.ts --outdir ./dist.new --target bun --external playwright --external sharp
[builds successfully]
mv: cannot move './dist.new/cli.js' to './dist/cli.js': No such file or directory
error: script "build:safe" exited with code 1
```

The `build:safe` script (`packages/cli/package.json`) is:

```
bun run gen:predicates && bun build ./src/cli.ts --outdir ./dist.new --target bun --external ... && mv ./dist.new/cli.js ./dist/cli.js && rm -rf ./dist.new
```

The `mv` step fails because `dist/` is gitignored at the repo root and doesn't exist on a fresh worktree checkout. The build artifact at `dist.new/cli.js` is correctly produced; only the rename fails.

## User feedback

Discovered during PR-FIN-1e Wave 5 T8 verification. Worked around by `mkdir -p dist && mv dist.new/cli.js dist/cli.js && rmdir dist.new` manually. Logged for PR-FIN-5 backlog (gobbi-wide cleanup PR).

## Correct approach

Fix forward in PR-FIN-5 by adding `mkdir -p ./dist` to the `build:safe` script:

```
bun run gen:predicates && mkdir -p ./dist && bun build ./src/cli.ts --outdir ./dist.new --target bun --external playwright --external sharp && mv ./dist.new/cli.js ./dist/cli.js && rm -rf ./dist.new
```

Until then, on any fresh worktree where you need to run `build:safe`:
1. `mkdir -p packages/cli/dist` first
2. Then `bun run build:safe`

Or use the simpler `bun run build` (atomic-rename-free; writes directly to `dist/` and creates the directory implicitly via Bun's `--outdir`).

**Note:** this only matters for atomic-update concerns (the `dist.new` → `dist` rename guarantees no partial state during a global-link refresh). On a worktree where the global gobbi binary doesn't link to this dist, plain `bun run build` is sufficient.
