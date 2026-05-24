# Preparation Loop — Bundle C Readiness Check — iter1

**Session**: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
**Phase**: Preparation iter1
**Author**: leader (PI/PM)
**Status**: DRAFT — all 6 CLs ready; one minor citation-precision concern for CL-6 worth surfacing to manager

---

## Scope reference

- Locked Idea: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/artifacts/idea.md`
- Decisions summary: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/artifacts/decisions-summary.md`
- Locked Scope Contract: idea.md § Scope Contract (CL-1..CL-6, 6 deliverables) — feature `session-foundations-bundle-c` on branch `chore/session-2026-05-24-45388fa9`.
- 7 user-locked decisions: DL-1..DL-7 (Theme β = β-1; feature name; close f-struct-01 inline; absorb f-risk-01; M2 only; add CL-6; CL-6 = Option B).

---

## Readiness summary

**6 CLs assessed, 0 blockers, 0 re-Ideate triggers, 1 minor concern (CL-6 citation precision).** Every backlog file, template, skill file, design doc dependency, and tooling dependency required by CL-1..CL-6 is present, readable, and writable. The preparation session tree was missing at the worktree-relative path and was bootstrapped during this loop (`<sessionDir>/preparation/rawdata/`). One precision concern is surfaced for the manager: CL-6 cites `git/SKILL.md` § "Memory Access Matrix Critical-Rule" — the actual file has a `## Memory Access Matrix` H2 followed by an inline paragraph anchor `**Critical rule — write paths**:`; CL-6's inline-citation text in `orchestration/SKILL.md` should match the actual anchor exactly. Disposition: defer to Execution (executor cites the real anchor; no doc change needed in Preparation).

No `generate-now` skill staging is required — the only candidate (`gobbi-hook-authoring`) is explicitly out-of-Preparation-scope per the brief (CL-2 is Execution work; Preparation only verifies the template + target path are ready).

---

## Design + memory readiness

Sub-step B output. Items checked per the brief's per-CL readiness list. All items pass.

### CL-1 — Close f-struct-01 inline (PASS)

- **Backlog file** `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` — exists, frontmatter is editable, current `status: open`, `disposition: open`. Required edits per Idea SC-1: flip `status: open` → `closed`, add `closed_by: 159eb21`, append closure note citing `session-start.sh:73-77`. All editable in a single 3-line frontmatter edit.
- **Commit `159eb21`** — reachable from `develop` (verified: `git -C /playinganalytics/git/gobbi branch --contains 159eb21` lists `develop` + `chore/session-2026-05-24-45388fa9` + `feat/266-orch-workflow-improvements`). Commit subject: `feat: env-var audit + SessionStart hook (drop CLAUDE_SESSION_ID) (#265)`.
- **Witness** `session-start.sh:73-77` — file present at `/playinganalytics/git/gobbi/.claude/hooks/session-start.sh` (79 lines total, mode 0755).
- **Verdict**: PASS — no Preparation action required.

### CL-2 — Stage + promote `gobbi-hook-authoring` skill (PASS)

- **Template** `interview/templates/project-skill.md` — exists at `/playinganalytics/git/gobbi/.claude/skills/interview/templates/project-skill.md`, 92 lines, readable.
- **Project skills root** `.gobbi/projects/gobbi/skills/` — exists with 17 sub-skill directories (codex, delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up). The target sub-dir `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/` does NOT yet exist — correct precondition for CL-2 (Execution creates it).
- **Hook witnesses** — both readable:
  - `.claude/hooks/session-start.sh` — 79 lines, mode 0755, May 22.
  - `.claude/hooks/post-tool-use-agents.sh` — 251 lines, mode 0755, May 24.
- **Backlog `gobbi-hook-authoring-skill.md`** — exists at `.gobbi/projects/gobbi/backlogs/`, frontmatter `status: deferred` is editable for the post-merge flip to `closed` (per CK-3.5).
- **Exercise witness** (per SC-2.3) — this Preparation subagent spawn itself fires `post-tool-use-agents.sh` on `PostToolUseFailure|PostToolUse` for `Task|Agent` matcher; this loop's Wrap-up will leave `session.json.agents[]` non-empty.
- **M2-compliance gate** (per SC-2.2) — CL-2's executor must NOT cite `$CLAUDE_CODE_SESSION_ID` for `{session-id}` anywhere in the new skill body. This is Execution discipline; the template at `interview/templates/project-skill.md` does not prescribe a path-conventions wording, so the Path Conventions section is author-discretion — SC-2.2 degrades to "zero `$CLAUDE_CODE_SESSION_ID` mentions anywhere" if no PC section is included.
- **Verdict**: PASS — no Preparation action required.

### CL-3 — `mistake/SKILL.md` consolidated edits + watchlist backlog clarifier (PASS)

- **`mistake/SKILL.md`** — exists at `/playinganalytics/git/gobbi/.claude/skills/mistake/SKILL.md`. Two edit surfaces present and inspectable:
  - **Domain-tag examples list** — present at line 63 (P1 step 3: `e.g., docs-sync, process, security`) and line 90 (P3 step 5: same). CL-3's edit adds `hooks` to one or both lists. Note: the example list lives in prose, not in a formal "documented domain-tag examples" enumeration heading. CL-3's executor must pick the canonical location (recommended: P1 step 3 + P3 step 5 — both are the natural enumeration points).
  - **`{session-id}` Path Conventions row** — present at line 129: `- \`{session-id}\` — Claude Code session ID from \`$CLAUDE_CODE_SESSION_ID\``. The Path Conventions block is delimited by `**Path conventions**` bolded sub-heading (line 126), not by `## ` heading — SC-3.2's `awk` range was authored aware of this and uses `/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/` as the start anchor.
- **`hooks-domain-mistakes-watchlist.md`** — exists at `.gobbi/projects/gobbi/backlogs/`, frontmatter `status: deferred` editable; § "Suggested approach" already cites the `hooks` domain tag convention edit as a future step ("Add a `hooks` domain tag convention to `mistake/SKILL.md` so future P1 loads filter cleanly").
- **Single-task discipline** (D-7 revised) — CL-3 holds both edits in one executor task on `mistake/SKILL.md`; CL-5 explicitly excludes the file from its 11-list. No two-task race condition.
- **Verdict**: PASS — no Preparation action required.

### CL-4 — Theme β design doc (PASS)

- **Template** `memorization/templates/design.md` — exists at `/playinganalytics/git/gobbi/.claude/skills/memorization/templates/design.md`, 70 lines, readable.
- **Target dir** `.gobbi/projects/gobbi/design/` — exists; currently contains `README.md` only. The target file `session-lifecycle-worktree-boundaries.md` does NOT yet exist (correct precondition).
- **Backlog § "Suggested approach"** — readable; explicitly enumerates the 5-section shape (Problem / Approach / Surfaces / Validation / Lessons-learned-after-N=2) plus location + template. Effort estimate: medium / 1 focused session — matches CL-4's bounded scope.
- **Backlog `session-lifecycle-worktree-boundaries-design-doc.md`** — exists at `.gobbi/projects/gobbi/backlogs/`, frontmatter `status: deferred` editable for the post-merge flip to `closed` (per CK-6.5).
- **DL-1 inline shallow-by-design note** (per SC-4.2) — purely an authoring discipline; no Preparation precondition.
- **Verdict**: PASS — no Preparation action required.

### CL-5 — f-risk-01 M2 docs sweep across 11 skills (PASS, list confirmed)

- **11 skill files** — all present and readable; CCSI grep counts (per file):

  | # | Path | CCSI hits |
  |---|---|---|
  | 1 | `.claude/skills/wrap-up/SKILL.md` | 1 |
  | 2 | `.claude/skills/research/SKILL.md` | 1 |
  | 3 | `.claude/skills/orchestration/workflow/evaluation.md` | 1 |
  | 4 | `.claude/skills/planning/SKILL.md` | 1 |
  | 5 | `.claude/skills/execution/SKILL.md` | 1 |
  | 6 | `.claude/skills/ideation/SKILL.md` | 1 |
  | 7 | `.claude/skills/memorization/SKILL.md` | 1 |
  | 8 | `.claude/skills/interview/SKILL.md` | 1 |
  | 9 | `.claude/skills/evaluation/SKILL.md` | 1 |
  | 10 | `.claude/skills/preparation/SKILL.md` | 1 |
  | 11 | `.claude/skills/gobbi/SKILL.md` | 3 |

  All 10 single-hit files: the one occurrence is in the file's Path Conventions block (the row CL-5 rewrites). `gobbi/SKILL.md` has 3 hits — per Idea SC-5 anti-game clause, the env-health gate at `gobbi/SKILL.md:52` ("Verify $CLAUDE_CODE_SESSION_ID is non-empty") is a legitimate out-of-block occurrence; the Path Conventions row is one of the other two. CL-5's executor must edit only the Path Conventions row, leaving the env-health gate untouched. The SC-5 bounded `awk`/`grep` confines verification to the Path Conventions block.

- **List confirmation re leader iter3's "12 minus mistake = 11"** — the iter3 leader's count is correct: the original 12 was the full skill set listed in iter2 Per-Deliverable CL-5 may-touch; D-7 revised removed `mistake/SKILL.md` from CL-5's may-touch (now owned by CL-3) leaving 11 files. All 11 are SKILL.md files at canonical paths EXCEPT `orchestration/workflow/evaluation.md` which is a sub-document of `orchestration/SKILL.md` (not itself a SKILL.md). The brief flagged this as a possible concern; verification: `.claude/skills/orchestration/workflow/evaluation.md` is indeed a sub-document path, not a SKILL.md; this is intentional — the orchestration skill's workflow sub-tree carries per-loop phase docs (evaluation.md, ideation.md, planning.md, etc.) which each have their own Path Conventions block and need the M2 sweep. **List integrity confirmed; the leader's count of 11 is correct.**

- **`f-risk-01-subagent-ccsi-semantics.md` backlog** — exists at `.gobbi/projects/gobbi/backlogs/`; § "Candidate mitigations" readable; the M2 verbatim (option 2: "Manager always passes parent-session-id explicitly in subagent delegation prompts (current de facto practice, documented). Update skills to say 'use `{session-id}` from the delegation prompt's `session-id:` field; do NOT read `$CLAUDE_CODE_SESSION_ID` for this value.'") matches the Idea's locked canonical replacement string. Frontmatter `status: open` editable for CK-8's flip to `status: addressed` + `disposition: addressed` + `closed_by: <merge SHA>` + appended `## Resolution` section.

- **Verdict**: PASS — no Preparation action required.

### CL-6 — Orchestration row 5/5.5/6 path-resolution fix per DL-7 = Option B (PASS with one minor citation-precision concern)

- **`orchestration/SKILL.md` Step 1** — exists at `/playinganalytics/git/gobbi/.claude/skills/orchestration/SKILL.md`; rows 5, 5.5, and 6 are present in the procedure table with the exact relative-path pattern the bug witness identifies (rows 5 and 6 both spell paths as `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/...` without an inline tree qualifier). The "Row 5.5 — Direct-mode opt-out (LOCK #5)" footnote is present immediately after the procedure table and is editable. The row 5.5 cell already includes the 3-state idempotency machine, the SessionStart matcher `startup\|resume\|clear\|compact`, the branch-name shape, and the P2 invocation reference. CL-6's Option-B edit demands: renumber so the worktree-create cell becomes row 5, the state.json-init cell becomes row 5.5, the session.json-init cell stays row 6; add inline citations to `git/SKILL.md` § Memory Access Matrix Critical-Rule + `d-2-qualified-git-rule.md` in each of rows 5, 5.5, 6; reword the LOCK #5 footnote so "row 5.5 is skipped" becomes "row 5 is skipped" (matches DL-7 = Option B).

- **Bundle-B design docs (read-only inputs)** — all 3 present:
  - `d-1-worktree-row-5-5.md` (worktree-row-5.5 decision; locked historical memorial; filename stays unchanged).
  - `d-2-qualified-git-rule.md` (qualified absolute-root rule; cited inline by CL-6).
  - `d-4-per-iter-session-commit.md` (per-iter MEMORIZATION commit cadence that makes CL-6 consequential; not cited but is the witness for severity).

- **`git/SKILL.md` § Memory Access Matrix** — the section exists at line 17 of `/playinganalytics/git/gobbi/.claude/skills/git/SKILL.md`; the Critical Rule for write paths is a `**Critical rule — write paths**:` bolded sentence at line 33 (NOT a separate heading or `Critical-Rule` anchor). **Minor citation-precision concern**: the Idea cites the anchor as "`git/SKILL.md` § Memory Access Matrix Critical-Rule" with a hyphen; the actual file uses `## Memory Access Matrix` as the H2 heading and `**Critical rule — write paths**:` as the inline emphasis anchor. CL-6's inline citation text in `orchestration/SKILL.md` should reference what actually exists: "see `git/SKILL.md` § Memory Access Matrix (Critical rule — write paths)" or similar. This is purely a citation-text precision matter and does not change the locked Option-B semantics. **Disposition: defer to Execution.** The executor cites the real anchor; no Preparation doc change.

- **Mistake-candidate file** — `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` exists at the worktree-relative path (verified: file readable; 66 lines; frontmatter `mistake-candidate: true`; `domain: session-lifecycle`; `scope: project`; `severity: medium`; `confidence: 95`). CL-6 leaves this file in place; Wrap-up runs `gobbi mistake promote` post-session.

- **Verdict**: PASS-with-note — no Preparation action; one citation-precision concern surfaced for the manager / Execution brief.

---

## Execution skills readiness

Sub-step C output. The brief explicitly out-of-scopes generating the `gobbi-hook-authoring` skill content during this Preparation loop — CL-2 produces the skill in Execution. Preparation only verifies prerequisites.

### Required project skills (per Bundle C deliverables)

| # | Skill / Domain | Present? | Notes |
|---|---|---|---|
| 1 | `interview/templates/project-skill.md` (template for CL-2) | YES | 92 lines; readable; canonical |
| 2 | `memorization/templates/design.md` (template for CL-4) | YES | 70 lines; readable; canonical |
| 3 | `.claude/skills/mistake/SKILL.md` (CL-3 edit target + project-mistake discipline for the new project skill — Iron Law 8) | YES | 134 lines; both edit surfaces editable |
| 4 | `.claude/skills/orchestration/SKILL.md` (CL-6 edit target) | YES | Step 1 + LOCK #5 footnote editable |
| 5 | `.claude/skills/git/SKILL.md` (cited inline by CL-6; not edited) | YES | Memory Access Matrix at line 17; "Critical rule" inline anchor at line 33 |
| 6 | `.claude/skills/delegation/SKILL.md` (referenced by CL-2 for hook integration cite; not edited) | YES (not re-verified — out-of-bundle but quoted in orchestration row 6) | Brief did not require this scan; mentioning for completeness |
| 7 | `.claude/skills/preparation/SKILL.md` (active loop skill; also a CL-5 sweep target) | YES | dual-role file — readable for both functions |
| 8 | Workspace skills CL-5 sweeps (the 11 files enumerated above) | YES — all 11 | See CL-5 readiness table above |
| 9 | Bundle-B design docs (CL-6 inline cite + I-8/I-9 reads) | YES — d-1, d-2, d-4 all present | At `.gobbi/projects/gobbi/features/session-foundations-bundle-b/design/` |

### Tooling / environment

| Item | Present? | Notes |
|---|---|---|
| `codex` CLI on PATH | YES | `/home/jeonhh0061/.nvm/versions/node/v22.22.1/bin/codex`, `codex-cli 0.133.0`. Required for Planning + Execution dual-system EVALUATION. |
| `.claude/hooks/session-start.sh` (Bundle-B hook) | YES + executable | 79 lines, mode 0755. Active — fires on `startup\|resume\|clear\|compact`. |
| `.claude/hooks/post-tool-use-agents.sh` (Bundle-B hook) | YES + executable | 251 lines, mode 0755. Active — fires on `Task\|Agent` for `PostToolUse\|PostToolUseFailure`. Exercising this hook this very session counts as CL-2's "exercised by ≥1 real session" trigger (SC-2.3). |
| Worktree present at the expected path | YES | `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/` exists; session memory has been migrated here per the staged mistake-candidate's "Corrected approach" section. |
| Preparation session subtree | YES (bootstrapped this iter) | `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/preparation/rawdata/` was missing at iter1 entry and was created during this loop. WORK assumes the manager bootstraps the full `preparation/{rawdata,staging,evaluation}/` tree — Sub-step B's "tree exists" assumption is fulfilled. |

### Gap list and dispositions

**Zero gaps in the strict "missing artifact" sense.** Every prerequisite for CL-1..CL-6 is in place. Two near-gaps are recorded for transparency:

| Item | Severity | Disposition | Rationale |
|---|---|---|---|
| `git/SKILL.md` Critical-Rule anchor wording — Idea says "Memory Access Matrix Critical-Rule"; file has "Memory Access Matrix" + inline "Critical rule — write paths" | Low | **defer-to-execution** | Citation-text precision is Execution-author's responsibility; the substantive rule is present at the exact location the Idea points to. Preparation cannot resolve this without changing locked Idea text, which is out-of-scope. Execution brief for CL-6 will note: "Cite as written in the file — `## Memory Access Matrix` (Critical rule — write paths)". |
| `gobbi-hook-authoring` project skill — does not yet exist | n/a (this is CL-2's deliverable, not a Preparation gap) | **defer-to-execution** | Per brief: Preparation only verifies template + target path; CL-2 in Execution produces the skill body. Template is ready (`interview/templates/project-skill.md`); target path is ready (`.gobbi/projects/gobbi/skills/` exists; sub-dir `gobbi-hook-authoring/` will be created by CL-2). |

**No `generate-now` skill staging required this loop.** The brief's narrow exception (Preparation may stage + promote a generated skill via `<worktreePath>/.../preparation/staging/skills/{slug}/SKILL.md`) is not exercised — `gobbi-hook-authoring` is explicitly out-of-Preparation-scope per the brief's Constraints / Scope section.

**No `re-ideate` triggers.** The Idea's 7 user-locked decisions all hold; the file system state is consistent with the locked scope; no missing decisions surfaced during the scan.

---

## Generated this loop

**Zero staged artifacts.** Preparation's narrow `generate-now` exception (per `preparation/SKILL.md` § Staging, not direct promotion — except for generated skills promoted before Planning) is not exercised this loop. Rationale:

- The only candidate skill (`gobbi-hook-authoring`) is the deliverable of CL-2 in Execution, not a Preparation prerequisite.
- All design / memory artifacts the Idea references already exist (templates, backlogs, hooks, design docs, the 11 swept skill files).
- The session subtree (`<worktreePath>/.../preparation/rawdata/`) was bootstrapped during this loop but does not count as a "staged artifact" — it is the loop's working directory.

**Files written this loop**:
- `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../preparation/rawdata/draft-iter1.md` (this file — the canonical preparation rawdata draft per the required-sections template).

---

## Out of scope gaps

Items intentionally not addressed by Preparation iter1; each carries a pointer and severity.

| Item | Severity | Pointer | Disposition |
|---|---|---|---|
| `gobbi-hook-authoring` skill body content (template Path Conventions section is optional per the template; CL-2 must author M2-compliant from creation regardless) | n/a (Execution deliverable) | Backlog `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` + Idea § CL-2 § In-Scope | **defer-to-execution** — CL-2's executor task. |
| `git/SKILL.md` § Memory Access Matrix anchor wording precision | Low | `/playinganalytics/git/gobbi/.claude/skills/git/SKILL.md:17,33` | **defer-to-execution** — CL-6 executor cites as-written. |
| `delegation/SKILL.md` not in CL-5 sweep (out of Bundle C) | n/a | Idea § In-Scope Out-of-Scope | **skip** — Iron Law 4 (locked scope). |
| `git/SKILL.md` itself not edited (only cited) | n/a | Idea § In-Scope Out-of-Scope | **skip** — Iron Law 4. |
| `mistake/SKILL.md` template path conventions update — domain-tag examples appear in 2 places (P1 step 3 + P3 step 5); CL-3 editing one or both is an authoring discretion | Low | `/playinganalytics/git/gobbi/.claude/skills/mistake/SKILL.md:63,90` | **defer-to-execution** — single-task discipline; CL-3 executor picks one canonical spot (recommended: add `hooks` to both occurrences for consistency since both lists are "examples"). |
| Bundle B HANDOFF "emergency stop" framing stale | n/a | Idea § Deferred § "Bundle B HANDOFF staleness" | **skip** — Wrap-up note; not a Bundle C deliverable. |
| iter1 evaluation-files audit-trail gap (Claude P1-002 from Ideation eval) | n/a | Idea § Deferred | **skip** — session-process deviation; Wrap-up captures. |
| Smoke-test gate T1.h post-merge check | n/a | Idea § Deferred | **skip** — Memorization-scope. |
| M1 / M3 alternatives for f-risk-01 | n/a | Idea § Deferred; DL-5 locks M2 | **skip** — Iron Law 4. |
| Skill-extraction for hooks-domain mistakes (N≥2 not yet met) | n/a | Idea § Deferred | **skip** — Iron Law 10. |

---

## Decisions log

This Preparation loop's DISCUSSION phase was manager-direct (per `preparation/SKILL.md` § DISCUSSION Phase Note). The manager did not run AskUserQuestion for any gap this loop because **no gap surfaced that required user decision**. All readiness checks PASSed; the one minor concern (CL-6 citation-precision) is deferred to Execution and does not warrant a user question — it is an authoring-detail Execution brief item, not a scope or design question.

| # | Decision | Source | Rationale |
|---|---|---|---|
| P-1 | Preparation iter1 advances without AUQ-driven gap-resolution decisions | leader Sub-step A → D collapsed; no gap | All readiness checks PASS; the only deferred items are Execution-authoring details (citation precision; CL-3 single-spot-vs-both for domain-tag examples) or Iron Law 4 out-of-scope skips. |
| P-2 | `gobbi-hook-authoring` skill is NOT staged-and-promoted during Preparation iter1 | brief Constraints / Scope; preparation/SKILL.md narrow-exception | The brief explicitly out-of-scopes generating the skill content in Preparation; CL-2 owns this in Execution. The narrow-exception is reserved for cases where Planning/Execution must load the generated skill in-session — Bundle C does not have that dependency (CL-2 itself produces the skill; no later CL depends on loading it). |
| P-3 | CL-6 citation-precision concern surfaced as Execution brief note, not as a user question | leader judgment per Iron Law 12 | Citation-text precision is a Specificity dimension at Execution-brief authoring time, not an Ideation re-open. Preparation EVALUATION will catch it if it materializes as a real ambiguity in the executor brief. |
| P-4 | Preparation session subtree bootstrap (`<worktreePath>/.../preparation/rawdata/`) is recorded as a loop-internal action, not a staged artifact | preparation/SKILL.md § WORK | The session tree is required infrastructure (per "WORK and MEMORIZATION assume the tree exists and surface an error if it does not"); creating it during iter1 is correct loop behavior. |

### RE-IDEATE triggers

**None.** All 7 user-locked decisions (DL-1..DL-7) remain coherent with the file-system state and the locked scope. No design choice is missing; no scope contradiction surfaced.

### Preparation-EVAL handoff

The Preparation EVALUATION phase that follows will run dual-system (Claude + Codex) across all 7 perspectives + Overall per `evaluation/SKILL.md`. Emphasis areas suggested for reviewer attention (no perspective pruning per loop discipline):

- **Project** — has every prerequisite for CL-1..CL-6 been verified at the locked-Idea level (yes — see PASS table per CL)?
- **Specificity** — is the CL-5 list (11 vs 12) verified by enumeration (yes — see § CL-5 readiness table)?
- **Witness** — is the CL-6 mistake-candidate file actually staged at the correct worktree-relative path (yes — verified above)?
- **Scope** — did Preparation accidentally absorb out-of-scope items (no — every entry in § Out of scope gaps is explicitly deferred or skipped, none absorbed)?
- **Risk** — does the citation-precision concern for CL-6 warrant user surface (leader's judgment: no — it is Execution-brief detail; EVAL may dispute and surface to user via Stage 3 cross-system reconciliation if both legs agree).

---

**End of preparation/rawdata/draft-iter1.md**
