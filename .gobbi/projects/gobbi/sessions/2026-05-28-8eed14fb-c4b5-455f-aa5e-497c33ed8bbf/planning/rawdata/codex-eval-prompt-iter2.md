# Codex Evaluation — Planning iter2 (Chat Mode + Auto Mode Redesign)

## Identity

You are the Codex evaluator for Planning iteration 2 of session
`2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf`.

You are a **separate, independent evaluator**. You did NOT produce the plan. Your
role is to find problems the creator missed. Critical, adversarial stance is
mandatory. Comfort is a warning sign.

---

## Worktree-Path Discipline (MANDATORY — read before searching any paths)

The following are pre-verified environment facts. Do NOT re-investigate them
or flag them as defects:

1. **`chat-mode.md` and `auto-mode.md` placeholder files** exist in the
   WORKTREE at
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/`
   and have `.claude/` symlinks. They do NOT exist in the main tree. This is
   expected — the worktree carries the placeholder files that Execution will
   fill. **Do NOT flag the absence of these files in the main tree.**

2. **`plugins/` directory does NOT exist at HEAD.** It was deleted in PR #264.
   No plugin-mirror task is required. **Do NOT flag the absence of
   `plugins/gobbi/skills/orchestration/` or any sub-path.**

3. **`claude` skill (`.claude/skills/claude/SKILL.md`) does NOT exist.** This
   is documented as FLAG-2 in `gobbi/SKILL.md` § Skill Map. The iter2 plan's
   F1 fix addresses this by removing the `claude` required-skill entry from all
   tasks and replacing it with a NOTE comment. **Do NOT re-flag the absence of
   the `claude` skill** — verify instead that every task's `required-skills`
   block correctly reflects the F1 fix (no `- claude` entry; NOTE comment
   present; proper reference to `gobbi/SKILL.md` line 187 FLAG-2).

---

## Task

Evaluate `draft-iter2.md` (633 lines) across all 7 perspectives + Overall
using the full 4-stage procedure from `evaluation/SKILL.md`.

This is **iteration 2** (`n = 2`). You MUST apply Stage 1 inheritance from
the iter1 Codex evaluation files at:
```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/
```

Files: `project.md`, `structure.md`, `performance.md`, `aesthetics.md`,
`usage.md`, `consistency.md`, `risk.md`, `overall.md`.

All iter1 findings had `disposition: open`. For each inherited finding, you
MUST judge its current disposition in iter2 (`addressed` / `open` /
`disputed` / `deferred` / `superseded`) based on actual evidence in
`draft-iter2.md`.

---

## Load Directives (in order)

1. **Principles skill:**
   `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`

2. **Project rules:**
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`

3. **Skills:**
   - `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
   - `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
   - `/playinganalytics/git/gobbi/.agents/skills/orchestration/workflow/planning.md`

4. **Mistakes (tags: docs-sync, process, orchestration, codex):**
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`

5. **Artifact under evaluation:**
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter2.md`

6. **Ideation artifact (prior-phase anchor):**
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`

---

## Output Paths

Write exactly 8 files. ALL paths use the **main-tree absolute path** below.
Do NOT use relative paths or `pwd`-derived paths. The worktree CWD is NOT
the session-write root.

Base directory:
```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter2/codex/
```

Files:
```
project.md
structure.md
performance.md
aesthetics.md
usage.md
consistency.md
risk.md
overall.md
```

Each per-perspective file MUST contain:
- `## Artifact Summary` section (Stage 0)
- `## Memory reads` section listing every path consumed
- `## Locked Frame (Stage 1)` section with scenarios and attached checklists
- Stage 2 evaluation results per scenario
- Inherited finding disposition table (for iter1 findings in this perspective)
- Typed findings (Type / Domain / Confidence / Severity / Evidence / Disposition)
- `VERDICT: PASS|REVISE|FAIL` line
- `## Low-confidence appendix` section (may be empty)

`overall.md` MUST contain a `VERDICT:` line (e.g., `VERDICT: PASS`).

---

## User-Locked Decisions (do NOT re-litigate)

These decisions are final. Verify they are reflected correctly; do not argue
against them:

| Lock | Content |
|---|---|
| R1 | `preparation.maxIterations: 0` → `state: Skipped` at loop-entry guard; no new settings field |
| R2+R3 | `workflow.chat.tasks[]` array-of-slices in BOTH `session.json` and `state.json` |
| R5 | Chat MEMORIZATION narrowed PASS path declared locally in `chat-mode.md`; `memorization/SKILL.md` stays untouched |
| D-A | task-record is session-local only; no promotion to project memory |
| D-B | Chat session layout = `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/` |
| F1 | `claude` skill removed from `required-skills`; replaced with NOTE comment citing `gobbi/SKILL.md` line 187 FLAG-2 |
| F2 | `plugins/` verified absent at HEAD (PR #264); no plugin-mirror instruction |
| F3 | All `# expect ...` comments converted to binary assertions; `PRE_T4_REV`/`PRE_T5_REV` captured via `git rev-parse HEAD` before edits, persisted via `/tmp/t4-pre.txt`/`/tmp/t5-pre.txt` |
| F4 | Prose references say "line 241 (second sentence)" not "lines 241-242"; grep-anchors in verification |
| F5 | T5 now carries symmetric `session.template.json` zero-deletions check |
| F6 | T1/T2/T3 each have pre-flight symlink check as first verification command |
| F7 | `develop..HEAD` used (not `main..HEAD`) in §4 acceptance test items #7 and #8 |
| F8 | T7 backlog slug `model-assignment-drift-delegation-vs-settings-default`; rule quoted inline |

---

## Special Focus Areas (leader's 3 focus points)

The leader has flagged these for particular scrutiny. You MUST address each
explicitly:

### Focus A: F3 PRE_T4_REV / PRE_T5_REV /tmp mechanism

Verify the `/tmp` persistence mechanism is robust:
- Is `PRE_T4_REV=$(git -C <worktree> rev-parse HEAD)` captured BEFORE any edit?
- Is the value reliably re-read from `/tmp/t4-pre.txt` in the downstream diff command?
- Does the `awk '{print $NF}'` extraction correctly parse the line written?
- Is there a race condition or inter-task /tmp collision risk?
- T4 writes `echo "Pre-T4 rev = $PRE_T4_REV" > /tmp/t4-pre.txt` — does the awk
  pattern `'{print $NF}'` correctly extract the SHA from that format?
- Does this mechanism survive if the executor runs tasks in a different shell session
  (i.e., is /tmp shared across shell invocations within the same codex run)?

### Focus B: F1 NOTE shape inside YAML `required-skills`

Verify each task's `required-skills` block after F1:
- Does each block have NO `- claude` entry?
- Does each block have a properly-formed NOTE comment (starting with `# NOTE:`)?
- Does the NOTE correctly reference `gobbi/SKILL.md` line 187 FLAG-2?
- Does the NOTE cite `.claude/CLAUDE.md` as the direct reference for `.claude/`
  doc-authoring discipline?
- Is the NOTE placement consistent across T1, T2, T3, T4, T5 (the tasks that
  previously required `claude`)?
- T6 (wrap-up assistant) and T7: do these correctly NOT have the `claude` entry
  either? (T6/T7 did not require `claude` in iter1 — confirm no accidental addition)

### Focus C: Byte-identical-modulo-F1-F8 claim

The iter2 plan claims "7-task structure / order / scope / locked decisions are
unchanged" and "surgical revision of draft-iter1.md applying F1-F8 only."

Verify:
- Are there any changes in iter2 beyond F1-F8?
- Is §6 Finding Disposition Table complete and accurate for all 8 findings?
- Do any sections appear in iter2 that were not in iter1 (new sections, new
  YAML fields, new risk items)?
- Do any sections from iter1 appear to be missing from iter2?
- Does the §5 self-review accurately describe what changed?

---

## Stage 1 Inheritance Summary (iter1 Codex findings)

All iter1 Codex findings had `disposition: open`. Inherit ALL of them at Stage 1
and judge dispositions at Stage 2.

| Finding ID | Perspective | Type | Severity | Summary |
|---|---|---|---|---|
| codex-overall-001 | Overall | design_flaw | High | 5 tasks require absent `claude` skill |
| codex-overall-002 | Overall | design_flaw | High | `plugins/` mirror instruction present |
| codex-overall-003 | Overall | assumption_risk | High | Non-binary verification + unresolved `<pre-T4-rev>`/`<pre-T5-rev>` |
| codex-overall-004 | Overall | checklist_gap | Medium | T5 additive-only check covers only `state.template.json` |
| codex-structure-001 | Structure | design_flaw | High | Same `claude` skill absence |
| codex-structure-002 | Structure | checklist_gap | Medium | T5 missing `session.template.json` diff check |
| codex-risk-001 | Risk | assumption_risk | High | Plan-level gate not binary (count-printing without assertions) |
| codex-risk-002 | Risk | assumption_risk | High | `<pre-T4-rev>` and `<pre-T5-rev>` undefined |
| codex-risk-003 | Risk | design_flaw | High | `plugins/` NEEDS_CONTEXT trap |
| codex-project-001 | Project | design_flaw | High | `plugins/` mirror check instructs executors |
| codex-project-002 | Project | checklist_gap | Medium | Plan-level gate omits T4 default-set semantics, models.* guard, T7 body/frontmatter, T6 outputs |
| codex-consistency-001 | Consistency | design_flaw | High | `claude` skill cited in cross-references and required-skills |
| codex-consistency-002 | Consistency | design_flaw | High | `plugins/` in Plan-level unknowns section |
| codex-usage-001 | Usage | design_flaw | High | `claude` skill absent but required |
| codex-usage-002 | Usage | assumption_risk | High | Unresolved baseline placeholders |
| codex-usage-003 | Usage | checklist_gap | Medium | Plan-level gate count commands non-asserting |

---

## Regression Flags

When judging iter2, flag any finding that is **worse** than iter1 on the same
dimension. These are regressions (Type: `general`, Domain: `regression`,
Confidence ≥ 75). Examples of what could constitute a regression:

- A binary assertion that was correct in iter1 but broken in iter2
- A cross-reference that resolved in iter1 but is now dangling
- A decision lock that was honored in iter1 but removed in iter2

---

## Session Write Paths

All session writes MUST use the absolute path above under
`planning/evaluation/iter2/codex/`. Do NOT use relative paths or
`pwd`-derived paths. The worktree CWD is NOT the session-write root.

Write the 8 output files directly to the codex output directory.

---

## Procedure Reminder

1. Load all directives above in order.
2. Read `draft-iter2.md` end-to-end (Stage 0).
3. Read all iter1 Codex per-perspective files for Stage 1 inheritance.
4. For each perspective (in order: Project → Structure → Performance → Aesthetics
   → Usage → Consistency → Risk): build Locked Frame (Stage 1), evaluate (Stage 2),
   write `{perspective}.md`.
5. Write `overall.md` (Stage 3).
6. Every output file MUST end with a `VERDICT:` line.

**The 7 canonical perspective filenames are the bare names only:**
`project.md`, `structure.md`, `performance.md`, `aesthetics.md`, `usage.md`,
`consistency.md`, `risk.md`. No prefix, no suffix.
