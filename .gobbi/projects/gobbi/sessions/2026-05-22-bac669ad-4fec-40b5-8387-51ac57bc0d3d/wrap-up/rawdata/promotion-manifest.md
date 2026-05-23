---
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
loop: wrap-up
step: rawdata
created: 2026-05-22
append-only: true
---

# Promotion Manifest

Append-only routing-decision log. One entry per staging file or Wrap-up-authored item. Each entry records: source → destination, routing rule applied, collision policy, status.

---

## Entry 1

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/staging/backlogs/project/f-struct-01-jq-sh-env-passthrough.md`
- **Destination:** `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md`
- **Routing rule:** `sessions/.../{loop}/staging/backlogs/project/{slug}.md` → `backlogs/{slug}.md` (always)
- **Collision policy:** new file (destination did not exist)
- **Status:** PROMOTED

---

## Entry 2

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/staging/backlogs/project/f-risk-01-subagent-ccsi-semantics.md`
- **Destination:** `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`
- **Routing rule:** `sessions/.../{loop}/staging/backlogs/project/{slug}.md` → `backlogs/{slug}.md` (always)
- **Collision policy:** new file (destination did not exist)
- **Status:** PROMOTED

---

## Entry 3

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/staging/decisions/ideation-decisions.md`
- **Destination:** `.gobbi/projects/gobbi/features/env-var-audit/decisions/ideation-decisions.md`
- **Routing rule:** `sessions/.../{loop}/staging/decisions/{slug}.md` (no special frontmatter) → `features/{feature-name}/decisions/{slug}.md` (default)
- **Collision policy:** new file; feature dir bootstrapped lazily
- **Status:** PROMOTED

---

## Entry 4

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/staging/discussions/ideation-discussion.md`
- **Destination:** `.gobbi/projects/gobbi/features/env-var-audit/discussions/ideation-discussion.md`
- **Routing rule:** `sessions/.../{loop}/staging/discussions/{slug}.md` → `features/{feature-name}/discussions/{slug}.md` (always)
- **Collision policy:** new file
- **Status:** PROMOTED

---

## Entry 5

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/staging/references/ideation-references.md`
- **Destination:** `.gobbi/projects/gobbi/features/env-var-audit/references/ideation-references.md`
- **Routing rule:** `sessions/.../{loop}/staging/references/{slug}.md` → `features/{feature-name}/references/{slug}.md` (always)
- **Collision policy:** new file
- **Status:** PROMOTED

---

## Entry 6

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/preparation/staging/decisions/preparation-decisions.md`
- **Destination:** `.gobbi/projects/gobbi/features/env-var-audit/decisions/preparation-decisions.md`
- **Routing rule:** `sessions/.../{loop}/staging/decisions/{slug}.md` (no special frontmatter) → `features/{feature-name}/decisions/{slug}.md` (default)
- **Collision policy:** new file
- **Status:** PROMOTED

---

## Entry 7

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/planning/staging/decisions/planning-decisions.md`
- **Destination:** `.gobbi/projects/gobbi/features/env-var-audit/decisions/planning-decisions.md`
- **Routing rule:** `sessions/.../{loop}/staging/decisions/{slug}.md` (no special frontmatter) → `features/{feature-name}/decisions/{slug}.md` (default)
- **Collision policy:** new file
- **Status:** PROMOTED

---

## Entry 8

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/execution/T1/staging/decisions/t1-decisions.md`
- **Destination:** `.gobbi/projects/gobbi/features/env-var-audit/decisions/t1-decisions.md`
- **Routing rule:** `sessions/.../{loop}/staging/decisions/{slug}.md` (no special frontmatter) → `features/{feature-name}/decisions/{slug}.md` (default)
- **Collision policy:** new file
- **Status:** PROMOTED

---

## Entry 9 — Mistake-candidate (Wrap-up authored)

- **Source:** authored in Wrap-up WORK per delegation prompt instruction (no prior staging file)
- **Destination:** `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- **Routing rule:** project-scoped mistake → `mistakes/{slug}.md` (scope confirmed by manager in delegation prompt)
- **Collision policy:** new file
- **Status:** PROMOTED

---

## Entry 10 — Mistake-candidate (Wrap-up authored)

- **Source:** authored in Wrap-up WORK per delegation prompt instruction (no prior staging file)
- **Destination:** `.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md`
- **Routing rule:** project-scoped mistake → `mistakes/{slug}.md` (scope confirmed by manager in delegation prompt)
- **Collision policy:** new file
- **Status:** PROMOTED

---

## Entry 11 — Per-session journal (Wrap-up Step 6 direct write)

- **Source:** synthesized by Wrap-up WORK Step 6 (not from staging)
- **Destination:** `.gobbi/projects/gobbi/notes/2026-05-22-env-var-audit-sessionstart-hook.md`
- **Routing rule:** Per-session journal entry → `notes/{date}-{slug}.md` (always — one entry per session)
- **Collision policy:** new file
- **Status:** PROMOTED

---

## Entry 12 — Wrap-up's own staging decisions log (manager-polish addendum 2026-05-23)

- **Source:** `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/wrap-up/staging/decisions/session-final.md`
- **Destination:** retained as Wrap-up internal session record; NOT promoted to project memory
- **Routing rule:** `sessions/.../wrap-up/staging/decisions/{slug}.md` → retained-in-session-only (Wrap-up's own staging output is the source-of-truth session-final record; promotion would create a duplicate of content already captured in the handoff + per-loop decisions files already promoted to features/env-var-audit/decisions/)
- **Collision policy:** N/A (no destination)
- **Status:** RETAINED-IN-SESSION (intentional non-promotion)
- **Rationale:** added per Wrap-up EVAL iter1 Codex finding C6 (manifest must cover ALL staged items, including Wrap-up's own staging). Promotion would duplicate already-promoted content. Documented explicitly here to satisfy "all items accounted for" guarantee.

---

## Inventory coverage check (corrected 2026-05-23 per Wrap-up EVAL findings)

**Staging file enumeration:**
- Prior-loop staging files: 8 — ideation (5: 2 backlogs + 1 decisions + 1 discussions + 1 references) + preparation (1 decisions) + planning (1 decisions) + execution/T1 (1 decisions).
- Wrap-up own staging file: 1 — session-final.md.
- **Total staging files: 9.**

**Wrap-up-authored items (not from prior staging):**
- 2 mistake-candidate files (Entries 9, 10).
- 1 per-session journal (Entry 11).
- **Total Wrap-up-authored: 3.**

**Manifest entries: 12** (Entries 1-12).

**Coverage breakdown:**
- Entries 1-8: 8 prior-loop staging files PROMOTED.
- Entries 9-10: 2 Wrap-up-authored mistakes PROMOTED.
- Entry 11: 1 Wrap-up-authored journal PROMOTED.
- Entry 12: 1 Wrap-up own staging file RETAINED-IN-SESSION (intentional non-promotion; rationale recorded).

**Accounting:** 9 staging files + 3 Wrap-up-authored items = 12 total items. 12 manifest entries match.

COVERAGE: COMPLETE. Every staged item has an explicit disposition (PROMOTED or RETAINED-IN-SESSION). No silent drops. Codex EVAL C6 finding closed.
