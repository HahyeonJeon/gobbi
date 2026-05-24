---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: accepted
feature: session-foundations-bundle-b
loop: planning
finding-id: symlink-restore-depth-wrong
type: design_flaw
domain: process
disposition: addressed
confidence: 98
severity: High
surfaced-by: claude+codex (convergent)
addressed-in: iter2 Fix 1
supersedes: null
mistake-candidate: true
---

# Symlink restore recipe used wrong `../` prefix depth (addressed in iter2)

## What went wrong

Planning iter1 § Execution intake notes prescribed `ln -sfn ../../.gobbi/...` (2-dot prefix) for restoring broken workspace symlinks. Actual `.claude/skills/<topic>/SKILL.md` symlinks use `../../../` (3-dot prefix). An executor following the iter1 recipe would have created symlinks pointing to the wrong target, breaking the workspace.

## Why it went wrong

The recipe was derived by memory/paraphrase from the Preparation edit-contract decision rather than empirically verified. The author assumed 2 levels of indirection (`.claude/skills/<topic>/`) = 2-dot prefix; but relative symlink paths count the hops from the symlink's own location to the target, requiring 3 dots for this specific directory depth.

## How to recognize

- Any symlink restore recipe that prescribes a fixed `../` count without citing an empirical `ls -la` verification is suspect.
- The correct workflow: run `ls -la .claude/skills/<any-existing-skill>/SKILL.md` first; observe the actual `->` target; match the prefix count.
- For `SKILL.md` directly under `.claude/skills/<topic>/`: 3 dots (`../../../`)
- For files under `.claude/skills/<topic>/<sub>/`: 4 dots (`../../../../`)

## Corrected approach

Symlink restore recipe (empirically verified 2026-05-24):
```
rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>
```

Depth disclaimer: "The exact `../../../` prefix depends on the file's depth — verify against an adjacent untouched symlink with `ls -la`."

Every planning brief that includes symlink restore instructions MUST embed the empirical witness (`ls -la` result) alongside the recipe.

## Related

- draft-iter2.md:520 (§ Execution intake notes Edit-tool default block)
- draft-iter2.md:447 (§ Agent assignment table edit-contract brief note)
- Preparation iter3 staging decisions `mirror-propagation-policy-mirror-canonical-symlinks.md`
