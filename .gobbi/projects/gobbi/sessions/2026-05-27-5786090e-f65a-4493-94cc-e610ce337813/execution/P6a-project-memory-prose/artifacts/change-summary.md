---
loop: execution
iter: 2
artifact_type: change-summary
created_at: 2026-05-27
status: final
supersedes: []
related:
  - ../evaluation/iter1/claude/overall.md
  - ../evaluation/iter1/codex/overall.md
  - ../evaluation/iter2/claude/overall.md
  - ../evaluation/iter2/codex/overall.md
  - ../staging/backlogs/project/design-template-stale-vs-adr-standard.md
---

# P6a Change Summary

Task: Prose conformance pass (§4.2/§4.3) + frontmatter-type correction on
`features/project-memory` docs (32 files).

---

## Scope

P6a covered the `features/project-memory` subtree — 32 docs spanning
`decisions/`, `checklists/`, `references/`, and `design/`. P6b (deferred to
next task) covers `features/workflow`.

The task was split from the original P6 when the manager confirmed that the
`features/project-memory` subtree alone warranted a full focused pass.

---

## Part A — Frontmatter type corrections (16 files)

### Trigger

Post-T8 promotion left a conformance gap: `type:` frontmatter values did not
match the directory the file lived in. The manager approved expanding scope to
fix these before the prose pass, so Part B could start from a clean baseline.

### What changed

Sixteen files had their `type:` field corrected to match their directory:

- 9 files in `decisions/` had `type: decision` set (previously wrong or
  absent).
- 2 files in `checklists/` had `type: checklist` set.
- 5 files in `references/` had `type: reference` set (previously used
  `ref_type:` or a wrong `type:` value; `ref_type:` was also stripped where
  it was a stale finding-disposition residue key).

Finding-disposition residue keys (`finding-id:`, `disposition:`, `promoted-at:`,
`promoted-from:`) were stripped from all 16 files. These keys are
staging-only fields defined in `memorization/SKILL.md § Staging-field
stripping on promotion` and must not persist in promoted project-memory docs.

### Files not touched in Part A

The remaining 16 files were already conformant on `type:` and had no residue
keys. They proceeded directly to Part B.

---

## Part B — §4.2 prose conformance (32 files)

### Standard applied

`rules.md § 4.2` (line 177) plus `dev-doc-standard.md` require:
- `decision` docs: Decision Record shape — Title / Date / Status / Context /
  Decision / Rationale / Consequences.
- `checklist` docs: Checklist shape — Purpose / When to run / Items.
- `reference` docs: Reference shape — Purpose / Source / Key points /
  Applicability.
- `design` docs: ADR shape — Context / Approach / Rationale / Alternatives
  considered / Consequences / Related.

Every doc was reviewed against its required shape and prose was added,
restructured, or tightened to achieve Form-A conformance.

### Commit f367095 — iter1 (31 files)

31 of 32 files were updated. The one file not touched (`decisions/
session-dir-naming.md`) was already Form-A conformant from a prior session's
work and needed no changes.

---

## iter2 — 2 design docs reshaped to ADR

### Trigger

Codex evaluation (iter1) finding F1 identified two design docs that had prose
conformance but lacked the canonical ADR section structure:

- `design/dev-doc-memory-standard.md`
- `design/memorization-moment-of-capture.md`

Both had been written as narrative documents in earlier sessions. The iter1
pass had improved their prose but had not imposed the ADR skeleton.

### What changed (commit ada3dd7)

Both docs were restructured to carry explicit ADR sections: Context / Approach
/ Rationale / Alternatives considered / Consequences / Related. All prior
content was preserved — the reshape was structural, not a content rewrite.

Manager re-verified post-commit: both files carry the ADR shape; no content
was lost; leak gate (grep for finding-disposition residue) returned clean.

---

## Notable contradiction surfaced

`rules.md § 4.2` (line 177) and `dev-doc-memory-standard.md` (line 50) both
state that `design` docs use ADR shape. However, `templates/design.md`
prescribes a different 8-section shape: Problem / Scope / Approach / Scenarios
/ Validation / Trade-offs / Open issues.

These two specifications contradict each other. The operative contract used in
this task is ADR (matches §4.2 + the two prior passed design docs from P3a and
P5a). A backlog was staged to reconcile the template:

`staging/backlogs/project/design-template-stale-vs-adr-standard.md`

---

## Commits

| Commit | Files changed | Content |
|--------|---------------|---------|
| `f367095` | 31 | Part A (16 type fixes + residue strip) + Part B prose on all 31 modified docs |
| `ada3dd7` | 2 | iter2: dev-doc-memory-standard.md + memorization-moment-of-capture.md reshaped to ADR |

Total: 32 files touched across both commits (the 31 from iter1 + the 2
reshaped in iter2, with 1 overlap: those 2 were already in the 31, so net
unique files = 32, of which 31 were modified in iter1 and 2 were further
refined in iter2).
