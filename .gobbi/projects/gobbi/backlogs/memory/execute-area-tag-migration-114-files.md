---
name: execute-area-tag-migration-114-files
description: The deferred bulk move of all 114 flat by-area memory files (both tiers) into their namespaced paths under the locked final areas/tags — a dedicated follow-up session.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-23
session: 2026-06-23-d0185dba
tags: [memory, refactor, rename-sweep]
keywords: [migration, area-namespace, tag-namespace, both-tiers, layer2-source, move-once]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# Execute the area+tag migration — move all 114 flat by-area files

## Context
This session locked the final area + tag vocabulary (project-defined config-as-data) and de-hardcoded the plumbing (areas + tags), but DEFERRED the actual bulk file MOVE to keep "move once" — final areas/tags had to be locked first. This backlog is that deferred move: relocate every currently-flat by-area memory file into `{type}/{area}/{slug}.md` (project tier) and `features/{f}/{type}/{area}/{slug}.md` (feature tier) under the locked areas, repointing every inbound reference, with guards to zero.

## Why deferred
Move/repoint is gobbi's most error-prone operation (the #307 namespace sweep was REVISE'd three times). Splitting design+plumbing from the bulk move lets the final vocabulary be locked and validated first, so the move happens exactly once and the move session can focus solely on the mechanical relocation + reference repoint under an unambiguous pass criterion.

## When to pick up
Prerequisites (ALL must hold): (1) this session's de-hardcoding plumbing is merged — the validator reads the project config for BOTH areas and tags, and gobbi's `areas`/`tags` are declared in that config; (2) the locked final areas/tags from this session's Design (Q5/Q6) are in place; (3) the guard scripts exist (`check-markdown-links.sh`, `check-residual-vocab.sh`) plus the NEW `layer2-source:` resolution check. No further design — this is execution against the spec below.

## Suggested approach (the execution spec)
**Scope — 114 flat by-area files, BOTH tiers (re-`find` at execution time as the authority; counts below are this session's verified evidence):**
- Project tier = 34: `mistakes/` 16, `notes/` 6, `backlogs/` 11, `reports/` 1.
- Feature tier = 80: `features/git-workflow/` 29 (backlogs 1, decisions 4, design 7, references 9, plans 1, scenarios 2, checklists 2, discussions 2, changelogs 1); `features/workflow/` 51 (backlogs 1, decisions 19, design 7, references 8, plans 2, scenarios 1, checklists 5, discussions 8); `features/memory/` 0 (already clean).

**Procedure:**
1. Build the manifest: each flat file → its resolved `{type}/{area}/{slug}` via the §1.5 selection rule under gobbi's locked areas. State it as "every flat by-area file in both tiers" — a fresh `find` is the authority.
2. Enumerate ALL inbound reference classes per file BEFORE moving: path refs, prose, skill-name, inventory, wrapper-description, pipeline-label, in-fence example paths, cross-doc, inbound `required-mistakes:` PATH refs, AND `layer2-source:` PATH refs.
3. `layer2-source:` repoint (critical — all three named guards miss it): the 3 currently-flat mistakes that are live `layer2-source:` targets — `mistakes/file-move-needs-link-resolution-check.md`, `mistakes/planning-asserted-skill-without-verifying.md`, `mistakes/sweep-grep-literal-loop-name-blindspot.md` — are referenced by `skills/mistake/layer2-file-move-needs-link-resolution-check.md:14`, `layer2-planning-asserted-skill-without-verifying.md:14`, `layer2-sweep-grep-form-specific-blindspot.md:14`. After each move, repoint that `layer2-source:` path. (Folds the `stale-layer2-source-refs` backlog into this pass.)
4. `git mv` each file; apply the active-mistake-move carve-out (rules.md §1.5) for active mistakes — slug identity preserved.
5. Run guards to zero: `check-markdown-links.sh` (md-link resolution) + `check-residual-vocab.sh` (residual flat paths) + a NEW dedicated `layer2-source:` resolution check.
6. Write-safety: all moves via `git mv`; all edits via Bash heredoc / `perl -i` / `python3`, verified on disk (never trust Edit/Write on a worktree).
7. Pass criterion (expected-vs-regression): the validator baseline before this work is 685 violations / 133 files. Classify each post-move RED as EXPECTED (pre-existing legacy-frontmatter, tracked by `legacy-frontmatter-migration`) vs REGRESSION (a new violation the move introduced). PASS = zero regressions; expected legacy RED is acceptable and stays tracked to its own backlog.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-23-d0185dba-cd9b-45ad-93f6-7814c4f0ef4a/`

## Related

- [[memory-renamespace-helper]] — the helper that automates the move/repoint
- [[stale-layer2-source-refs]] — the layer2-source repoint, folded into this pass
- [[legacy-frontmatter-migration]] — the pre-existing validator RED this move must NOT be blamed for
