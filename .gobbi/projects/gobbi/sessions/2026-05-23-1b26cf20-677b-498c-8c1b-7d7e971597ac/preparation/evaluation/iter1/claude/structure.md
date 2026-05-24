# Preparation iter1 — STRUCTURE perspective (Claude)

Perspective: structure (template compliance, file layout, frontmatter discipline)
Verdict: **PASS**

## Frame

Per `preparation/SKILL.md` § 213-260, WORK must populate the rawdata template's required sections and stage every `generate-now` artifact under `sessions/{date}-{session-id}/preparation/staging/{type}/{slug}.md`. Each staged file should follow its template (`backlogs.md` / `decisions.md` / `design.md` from `memorization/templates/`).

## Findings

### F-S1 (Low, Confidence 100, general / docs-sync)

**All 7 staged files compose into the expected staging tree** — `staging/backlogs/project/` (4 files), `staging/decisions/` (2 files), `staging/design/` (1 file), `staging/skills/` (empty by design — no generate-now skills this loop).

Frontmatter coverage:
- 4 backlog files: all have `title / status / project / feature / task / anchor_session / created` — match the canonical backlogs template shape.
- 2 decision files: both have `date / session / status / feature / supersedes / superseded_by` — match decisions template.
- 1 design file: has `title / status / feature / related` — matches design template (slightly different format but acceptable).

### F-S2 (Low, Confidence 75, checklist_gap / docs-sync)

**Minor inconsistency in decision-file frontmatter shape vs design-file frontmatter shape.** The 2 decision files use `date / session / status / feature / supersedes / superseded_by` whereas the design file uses `title / status / feature / related`. The decision files lack a `title` field (the H1 carries the title) whereas the design file has `title`. Not a template violation per se — different templates have different fields — but a reader looking for consistency may stumble.

This is informational only.

### F-S3 (Low, Confidence 100, general / process)

**Required-sections compliance for draft-iter1.md is complete.** Per `preparation/SKILL.md` § 230 the WORK exit checklist requires:
- Scope reference ✓
- Readiness summary ✓
- Per-category readiness ✓
- Generated this loop ✓
- Deferred ✓
- Skipped ✓
- Mirror propagation policy ✓ (NEW this loop, sensibly added)
- Decisions log ✓
- WORK exit checklist ✓

Every section is populated. No `TODO` / `TBD` / `<...>` placeholders found (`grep -n "TODO\|TBD\|<\.\.\.>" draft-iter1.md` returns nothing).

### F-S4 (Low, Confidence 75, general / docs-sync)

**Per-tier file routing matches the routing table.** Backlogs go to `staging/backlogs/project/` (correct for project-scope items); decisions go to `staging/decisions/` (correct for `decisions.md` template); design file goes to `staging/design/` (correct for `design.md` template). No misrouted artifacts.

## Must-preserve list

- All staged file frontmatter — preserve the templated discipline; readers can rely on parseable headers.
- The Generated-this-loop / Deferred / Skipped tripartite layout in draft-iter1.md mirrors the DISCUSSION decision categories cleanly.
- The decisions log table (15 rows) is the audit trail; preserve its structure.

## Verdict

**PASS** (no Critical, no High; only minor structural notes).

