---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: project-memory-placeholder-vs-survivor
rounds: [1, "3a"]
locks: [Q2, "Q-A"]
---

# Project Memory: Placeholder vs. Survivor Set

## Discussion Summary

Q2 (Round 1) established the placeholder semantics. Q-A (Round 3a) revised Q2 after the leader discovered `.claude/{skills,agents}` are symlinks into `.gobbi/projects/gobbi/{skills,agents}/`.

**Q2 — Placeholder semantics (Round 1)**

Manager asked whether project-memory subdirs should be kept with content, wiped to empty dirs, or kept with one-line stub READMEs. User chose: empty dirs with one-line stub README per dir (recommended option). Scope initially covered all 17 project-memory subdirs.

**Q-A — Critical survivor-set correction (Round 3a)**

Leader iter1 surfaced a NEEDS_CONTEXT gap: `.claude/skills/*` and `.claude/agents/*` are tracked symlinks pointing into `.gobbi/projects/gobbi/{skills,agents}/`. If those target dirs are placeholdered (content wiped), the symlinks become broken. Manager surfaced the correction to the user.

User decision: Revise Q2 — keep content (do NOT placeholder) for exactly three subdirs: `skills/`, `agents/`, `rules/`. The other 13 subdirs (`archive/`, `backlogs/`, `decisions/`, `design/`, `features/`, `gotchas/`, `learnings/`, `mistakes/`, `notes/`, `plans/`, `references/`, `reviews/`, `tmp/`) become placeholder (content wiped, 1-line stub README). `adversarial-review/` is deleted entirely (not a standard subdir).

## Locked Decisions

| Lock | Decision |
|------|----------|
| Q2 | Empty dirs with one-line stub README per dir for all placeholdered subdirs |
| Q-A | KEEP CONTENT: `skills/`, `agents/`, `rules/` only; placeholder 13 others; delete `adversarial-review/` |

## Rationale for Survivor Set

- `skills/` and `agents/` are symlink targets from `.claude/`; content must survive for `.claude/skills/*` and `.claude/agents/*` to remain valid.
- `rules/` contains custom project rules that the redesigned skills reference; preserving it avoids needing to re-author rules from scratch in the rebuild.
- `design/`, `mistakes/`, and `backlogs/` were initially considered for the survivor set (F-P-01 cited `design/v050-{overview,cli}.md` links in `CLAUDE.md`; F-R-02 cited promoted mistake files), but Q-Survivor locked: fix citations instead of expanding the survivor set. `CLAUDE.md` gets a surgical 2-line excision; promoted mistakes are accepted as deleted.

## Related

- `ideation/artifacts/scope-contract.md` § Q-A survivor set + Q-Survivor
- `ideation/rawdata/discussion-log.md` § Rounds 1, 3a, and Round 4 (Q-Survivor)
- `ideation/staging/decisions/claude-md-dangling-links-post-sweep.md` (F-P-01)
- `ideation/staging/decisions/mistake-files-in-delete-set.md` (F-R-02)
