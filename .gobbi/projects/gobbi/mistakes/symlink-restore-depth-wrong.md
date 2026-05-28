---
name: symlink-restore-depth-wrong
description: Symlink restore recipe used wrong `../` prefix depth (2 hops) for `.claude/skills/<topic>/SKILL.md`; correct depth is 3 hops (`../../../`).
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [process, symlinks, skills]
domain: process
supersedes: null
superseded_by: null
---

# Symlink restore recipe used wrong `../` prefix depth for `.claude/skills/` paths

## What happened

Planning iter1 § Execution intake notes prescribed `ln -sfn ../../.gobbi/...` (2-dot prefix) for restoring broken workspace symlinks. Actual `.claude/skills/<topic>/SKILL.md` symlinks use `../../../` (3-dot prefix). An executor following the iter1 recipe would have created symlinks pointing to the wrong target, breaking the workspace.

## Why it happens

The recipe was derived by memory/paraphrase from the Preparation edit-contract decision rather than empirically verified. The author assumed 2 levels of indirection (`.claude/skills/<topic>/`) = 2-dot prefix; but relative symlink paths count the hops from the symlink's own location to the target, requiring 3 dots for this specific directory depth.

## Correct approach

Symlink restore recipe (empirically verified 2026-05-24):
```
rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>
```

Depth disclaimer: "The exact `../../../` prefix depends on the file's depth — verify against an adjacent untouched symlink with `ls -la`."

Every planning brief that includes symlink restore instructions MUST embed the empirical witness (`ls -la` result) alongside the recipe.

## How to detect

- Any symlink restore recipe that prescribes a fixed `../` count without citing an empirical `ls -la` verification is suspect.
- The correct workflow: run `ls -la .claude/skills/<any-existing-skill>/SKILL.md` first; observe the actual `->` target; match the prefix count.
- For `SKILL.md` directly under `.claude/skills/<topic>/`: 3 dots (`../../../`)
- For files under `.claude/skills/<topic>/<sub>/`: 4 dots (`../../../../`)

## Related

- [[edit-tool-refuses-symlink-paths]] — companion mistake on the Edit-tool default for `.claude/skills/` paths.

## Source

Originating session `2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac`: Planning iter2 draft (Execution intake notes' Edit-tool default block; Agent assignment table edit-contract brief note); Preparation iter3 staging decision `mirror-propagation-policy-mirror-canonical-symlinks.md`.
