---
name: delegation-overhaul-ssot-shipped
description: Delegation-skill overhaul (14 findings) + repo-wide .gobbi skill-load-path SSOT reconciliation + Your system: hook routing shipped this session.
type: notes
scope: project
feature: null
status: active
created: 2026-07-08
session: 14fbc122-d84c-4a16-af52-3a6dc3b1894b
tags: [process, codex, docs-sync]
keywords: [delegation-skill, ssot, skill-load-path, hook-routing, dual-system-eval]
author: claude
features_touched: []
loops_completed: [ideation, planning, execution, wrap-up]
shipped: [skill-prose-template-drift, documented-trap-not-gated, template-embeds-unnamed-exception, session-header-dual-writer, delegation-brief-cited-nonexistent-skill-path, compaction-line-savings-overestimate, ssot-wording-borderline-lines, ssot-class-a-grep-guard-gap]
---

# Delegation Overhaul + `.gobbi` SSOT Reconciliation Shipped

## What happened

Ideation discovery on the `delegation` skill ran a dual-system review (Claude + Codex) that surfaced 14
findings: Load-Directives ordering gaps, missing structured-header slots in the fill templates, drift
between `SKILL.md`'s stated invariants and the four templates that operationalize them
(`leader.md` / `executor.md` / `evaluator.md` / `assistant.md`), and a stale skill-load-path convention
for native Codex. Planning decomposed the fix into ordered tasks; Execution implemented all of them
across 8 tasks, landing 11 commits on branch `claude-2026-07-08-14fbc122-d84c-4a16-af52-3a6dc3b1894b`
(base `f5f315cb` on `develop`). The work grew beyond the 14 findings into a full `.gobbi` skill-load-path
SSOT reconciliation: `.gobbi/projects/gobbi/skills/` was locked as the single skill-load path for BOTH
runtimes, with `.agents/skills` demoted to a Codex *discovery* symlink that must never be cited as a
load path — reversing prior guidance that had mandated `.agents/skills` for native Codex. Wrap-up's
dual-system evaluation of the resulting session ran Claude `PASS` / Codex `REVISE` on iter1 (a D2
structural-ordering consistency gap between the evaluator and assistant templates); iter2 fixed the
finding and both systems converged to `PASS`.

## What shipped

Commits `26ff349d`..`a19be2ca` (11 commits, 23 files changed, 411 insertions / 280 deletions,
`git -C <worktree> diff --stat f5f315cb..HEAD`) plus the Wrap-up promotion commit `62ed5153`:

- **D2 structural-order fix** — Load Directives moved structurally first in the evaluator template
  (the anti-trust block now follows it); the assistant template's mode-selector fill/delete guidance
  demoted to a manager-only appendix so the dispatched prompt opens with the identity line.
- **`Your system:` hook routing** — a new structured header routed into `session.json.agents[]` via
  BOTH `hooks/post-tool-use-agents.sh` (the mid-session seed) and `.claude/scripts/reconstruct-agents.sh`
  (the authoritative SessionEnd rebuild), verified with a fixture behavioral test proving the seeded
  value survives reconciliation rather than being silently dropped.
- **`.gobbi` SSOT reconciliation** — agent-writing / skill-writing guidance, the Codex compat guard, the
  5 Codex `.toml` wrapper skill-load mandates, `AGENTS.md` skill-load citations, and
  `codex/delegation.md`'s exec examples all reconciled to cite `.gobbi/projects/gobbi/skills/` as the
  load path for both runtimes.
- **`skills/delegation/SKILL.md`** compacted and reordered with the SSOT note and a new Pre-Dispatch
  Fill Checklist (the gate closing the "documented trap not enforced in the template" pattern found
  during discovery); the plugin mirror synced for the new `_dual-system-block` partial; the 4 delegation
  templates redesigned (Load-Directives reorder, `Your sub-step:` / write-root slots, evaluator +
  assistant fixes).
- **This session's Wrap-up promotion** (commit `62ed5153`): 3 skill-owned traps appended to
  `skills/delegation/mistakes.md` (`skill-prose-template-drift`, `documented-trap-not-gated`,
  `template-embeds-unnamed-exception`); 1 project mistake
  (`mistakes/verification/session-header-dual-writer.md`); 2 learnings
  (`learnings/process/delegation-brief-cited-nonexistent-skill-path.md`,
  `learnings/process/compaction-line-savings-overestimate.md`); 2 backlog follow-ups
  (`backlogs/codex/ssot-wording-borderline-lines.md`, `backlogs/codex/ssot-class-a-grep-guard-gap.md`).
- All standing guards green over the post-promotion tree: `validate-frontmatter.sh` (454 files),
  `check-skill-mistakes.sh --all` (10 files, 60 references resolved), `check-markdown-links.sh` scoped
  to every touched/created file.

## What got stuck

Nothing is stuck — every in-scope finding was fixed and verified within this session. The one Codex
`REVISE` (D2 structural-ordering) was root-caused and fixed in iter2, not deferred.

## What shifted

- The session's scope widened from "fix 14 delegation findings" to "also reconcile the repo-wide
  `.gobbi` skill-load-path SSOT", because several of the 14 findings traced to the same root cause (an
  inconsistent skill-load-path convention between Claude Code and native Codex) and fixing them narrowly
  would have left the inconsistency live elsewhere in the repo.
- The manager's own executor briefs were found, mid-session, to cite `skills/claude/SKILL.md` — a path
  that does not exist on `develop` (it ships only on the unmerged PR #337) — reproducing the recorded
  `delegation-briefs-reference-nonexistent-rules-dir` trap at the manager's own authoring level. This is
  now a promoted learning (`delegation-brief-cited-nonexistent-skill-path`), not a blocking defect,
  because the Pre-Dispatch Fill Checklist added this session gates it going forward.

## Decisions to respect

- `.gobbi/projects/gobbi/skills/` is the single skill-load path for BOTH runtimes going forward.
  `.agents/skills` is a Codex discovery symlink only — never cite it as a Load-Directives load path.
  See `skills/delegation/mistakes.md#use-runtime-skill-surface-in-load-directives` (reversed 2026-07-08).
- Any new structured `Your <field>:` header MUST be added to both `hooks/post-tool-use-agents.sh`'s
  `extract_header` set and `.claude/scripts/reconstruct-agents.sh`'s equivalent builder in the same
  change — see `mistakes/verification/session-header-dual-writer.md`.
- A skill shipping both a policy doc (`SKILL.md`) and fill templates is one coupled artifact — a rule
  added to the prose is not "shipped" until the templates that operationalize it carry the matching
  slot. See `skills/delegation/mistakes.md#skill-prose-template-drift` and its two named instances.
- `codex/delegation.md`'s exec-example foreground timeout blocks were reviewed this session and kept
  intentionally — judged consistent with the canonical launch-runtime matrix from PR #340, not a
  residual gap needing a fix.
- The `skills/claude/SKILL.md` dangling reference some executor briefs carried resolves on its own once
  PR #337 merges to `develop`; it needs no separate fix in this session's branch.

## Next session

Two independent, unscheduled follow-ups are open: (1)
`backlogs/codex/ssot-wording-borderline-lines.md` — tighten 4 borderline / near-duplicate / narrow
wording spots in `.codex/AGENTS.md` and `codex/SKILL.md` that Codex's eval flagged (F-MED-002) but kept
conservative; (2) `backlogs/codex/ssot-class-a-grep-guard-gap.md` — add a committed grep guard (e.g. in
`check-codex-compatibility.sh`) so a future edit cannot silently reintroduce a class-A `.agents/skills`
load-path citation, replacing this session's one-time manual T7 sweep (F-MED-006). Either can run any
time; no hard prerequisite blocks them.

## Related

- [[session-header-dual-writer]] — the project mistake shipped this session
- [[delegation-brief-cited-nonexistent-skill-path]] — the learning shipped this session
- [[compaction-line-savings-overestimate]] — the learning shipped this session
- [[ssot-wording-borderline-lines]] — the backlog follow-up shipped this session
- [[ssot-class-a-grep-guard-gap]] — the backlog follow-up shipped this session
