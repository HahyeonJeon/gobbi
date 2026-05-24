# Draft Idea — Bundle C foundation follow-ups — iter3

**Session**: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
**Phase**: Ideation iter3 — consolidation of iter2 + 6 user-locked decisions (DL-1..DL-6) + dual-system iter2 REVISE remediation
**Author**: leader (PI/PM)
**Status**: CONSOLIDATED — all 7 DLs locked (DL-1..DL-7; DL-7 = CL-6 row-order fix Option B, user-locked 2026-05-24 post-iter3-draft via manager AUQ); ready for Ideation EVAL closure + MEMORIZATION
**Supersedes**: `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md`
**Path note**: All session-memory paths from iter3 forward are **worktree-relative**. `$worktreePath = /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9`. The session directory tree was moved from the main tree into the worktree per the mistake-candidate at `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` (CL-6's witness).

---

## TL;DR

Bundle C ships **6 deliverables under feature `session-foundations-bundle-c`** on branch `chore/session-2026-05-24-45388fa9`:

1. **CL-1 — Close f-struct-01 inline.** 3-line frontmatter edit on `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` (`status: open` → `closed`, `closed_by: 159eb21`, plus closure note citing `session-start.sh:73-77`).
2. **CL-2 — Stage + promote `gobbi-hook-authoring` project skill, authored M2-compliant from day one.** Author at `<worktreePath>/.gobbi/projects/gobbi/sessions/.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` per `interview/templates/project-skill.md`; promote to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via `preparation/SKILL.md` narrow-exception. **The new skill's Path Conventions section MUST use M2 wording from creation (does not cite `$CLAUDE_CODE_SESSION_ID` for the `{session-id}` value).** Sourced from N=2 in-tree hook witnesses (`session-start.sh` + `post-tool-use-agents.sh`) plus the current session's own exercise of `post-tool-use-agents.sh` (every Agent/Task tool call this session fires the hook — see SC-2.3 below).
3. **CL-3 — `mistake/SKILL.md` consolidated edits + watchlist backlog status update.** **Canonical owner of all `mistake/SKILL.md` edits in this bundle**: (a) add `hooks` to the documented domain-tag examples list, (b) update the `{session-id}` Path Conventions row to M2 wording (the row M2 sweep that previously lived in CL-5 for this one file lands here instead — see D-7 revised). Plus a backlog status clarifier on `hooks-domain-mistakes-watchlist.md`.
4. **CL-4 — Author Theme β design doc.** Write `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` using `memorization/templates/design.md` per the backlog § "Suggested approach" 5-section shape. **Lessons section carries an inline "shallow-by-design-per-DL-1" note** so the rationale survives in-doc (addresses R5-001 + P6-F2).
5. **CL-5 — f-risk-01 M2 docs sweep across 11 skills (not 12).** Each of `wrap-up`, `research`, `orchestration/workflow/evaluation`, `planning`, `execution`, `ideation`, `memorization`, `interview`, `evaluation`, `preparation`, `gobbi` is updated so its `{session-id}` path-conventions snippet reads "from the delegation prompt's `session-id:` field" and explicitly says "do NOT read `$CLAUDE_CODE_SESSION_ID` for this value (subagent context returns the subagent's own UUID, not the parent session's)." **`mistake/SKILL.md` is removed from this CL's may-touch and re-routed to CL-3 (D-7 revised).** M1 and M3 are explicitly NOT chosen. CL-5 also updates the f-risk-01 backlog disposition per the canonical SC-6 spec (now unambiguous).
6. **CL-6 — Orchestration row 5/5.5/6 path-resolution fix.** Edit `.claude/skills/orchestration/SKILL.md` Step 1 rows 5, 5.5, and 6 so the qualified absolute-root rule (cite `git/SKILL.md` § Memory Access Matrix Critical-Rule + `d-2-qualified-git-rule.md`) is documented inline AND the row 5-before-worktree-exists ordering problem is resolved per **DL-7 = Option B (user-locked 2026-05-24)**: promote row 5.5 to before row 5 (new row 5 = worktree create; new row 5.5 = state.json init; new row 6 = session.json init). Preparation produces the exact rewrite text for rows 5/5.5/6 + the LOCK #5 footnote per Option B. CL-6 also stages this session's session-dir-placed-outside-worktree mistake-candidate for `gobbi mistake promote` to elevate post-session.

Bundle C grew from 5 to 6 deliverables. The 6th is the smallest in net LOC but is the highest-leverage doc fix because it closes the recurrence path of the very bug this session experienced. Risk section quantifies the size honestly (now ~14–17 task units after Preparation; CL-6 is bounded per DL-7 = Option B).

---

## Decisions Locked (post-AUQ — user-binding)

All 5 iter2 locks stand. iter3 adds DL-6.

| DL # | Question | Locked answer | iter1/2 leader recommendation | Notes |
|---|---|---|---|---|
| DL-1 | Theme β timing | **β-1: Ship this session; self-count as N=2.** User accepted shallow-lessons trade-off. | β-2 (defer) | User diverged from leader. Lock supersedes LDP-4. |
| DL-2 | Bundle feature name | **`session-foundations-bundle-c`** | Same | Confirms iter1 LDP-6. |
| DL-3 | f-struct-01 disposition | **Close inline in Bundle C PR.** 3-line frontmatter edit + closure note citing `session-start.sh:73-77`. | Same | Confirms iter1 LDP-2 / D-3. |
| DL-4 | f-risk-01 disposition | **Absorb into Bundle C** (user confirmed via USER CHALLENGE follow-up). | Defer to its own dedicated Ideation. | User diverged from leader. Lock supersedes LDP-3. |
| DL-5 | f-risk-01 mitigation choice | **M2 — Codify delegation-prompt passing across the affected skills.** M1 and M3 explicitly NOT chosen. | n/a | New decision; codifies current de-facto practice. |
| **DL-6** | **Iter3 scope addition** | **Add CL-6 = orchestration row-5/6 path-resolution fix as a 6th deliverable.** User picked the more aggressive option ("Eval findings + orchestration row-5/6 fix as new CL-6") over more conservative alternatives. | leader did not pre-recommend; the bug was user-reported mid-iter2 | Option choice resolved by **DL-7** (next row). |
| **DL-7** | **CL-6 row-order fix Option** | **Option B — promote row 5.5 to before row 5** (user-locked 2026-05-24 via post-iter3-draft AUQ). | iter3 leader recommended B per D-9 reasoning (robustness vs Options A/C migration window; smallest blast radius; aligned with bundle-B D-2/D-4 invariants) | User accepted leader recommendation. Planning adopts Option B's row layout; no further A/B/C/D deliberation. |

---

## Scope Contract (locked)

```yaml
artifact_type: scope-contract
feature: session-foundations-bundle-c
goal: Land 6 cohering follow-ups — gobbi-hook-authoring skill (stage + promote, M2-compliant from creation), mistake/SKILL.md consolidated edits + hooks-watchlist backlog clarifier, session-lifecycle worktree-boundaries design doc, f-struct-01 inline close, f-risk-01 M2 delegation-prompt-passing docs sweep across 11 skills, and orchestration row-5/5.5/6 path-resolution fix (CL-6).
created-by: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
created-at: 2026-05-24T17:00:00Z
supersedes: <worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md
```

### In-Scope (6 deliverables)

1. **CL-1 — Close `f-struct-01-jq-sh-env-passthrough` inline.** Unchanged from iter2.
   - Witness: `.claude/hooks/session-start.sh:73-77` already implements Option A. Commit `159eb21`, env-var-audit PR #265, merged 2026-05-22.
   - Action: edit `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` frontmatter `status: open` → `closed`, add `closed_by: 159eb21`, append closure note.

2. **CL-2 — Stage + promote `gobbi-hook-authoring` project skill (M2-compliant from creation).**
   - Witness: N=2 in-tree hooks (`session-start.sh` 79 lines @ `159eb21` + `post-tool-use-agents.sh` 251 lines @ `dfb7d6d`). **Real-session exercise witness added per Codex P1-F2/P7-F1**: every Agent/Task tool call in this Ideation session (including iter1 leader, iter2 leader, iter2 dual-system evaluators × 8 perspectives × 2 systems = 16 spawns, and the iter3 leader spawn that produced this draft) fires `post-tool-use-agents.sh` on PostToolUse/PostToolUseFailure with matcher `Task|Agent`. Concrete verification anchor: `agents[]` upserts visible in `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../session.json` post-Wrap-up, plus hook-emitted lines in transcript jsonl.
   - Action: stamp `<worktreePath>/.gobbi/projects/gobbi/sessions/.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` using `interview/templates/project-skill.md`; promote to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via the `preparation/SKILL.md` narrow-exception.
   - **NEW scope requirement per Claude S3-001 + Claude O-001**: the new skill's Path Conventions section MUST be authored using M2 wording from creation. It MUST NOT cite `$CLAUDE_CODE_SESSION_ID` for the `{session-id}` value, and SHOULD include the same "from the delegation prompt's `session-id:` field; do NOT read `$CLAUDE_CODE_SESSION_ID`" disclaimer the 11-skill sweep applies elsewhere. Verified by SC-2.2 below.
   - Mistakes section stays sparse (zero hooks-domain mistakes exist on develop); grows substantive at N≥2 captures.
   - **NEW backlog file in may-touch per Codex P3-F1**: `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` is added to CL-2 may-touch to authorize the status flip from `deferred` → `closed` documented in Backlog Deltas.

3. **CL-3 — `mistake/SKILL.md` consolidated edits + hooks-watchlist backlog clarifier (canonical owner of all `mistake/SKILL.md` edits in Bundle C).**
   - Witnesses: (a) `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` § "Suggested approach" tail bullet ("Add a `hooks` domain tag convention to `mistake/SKILL.md`") for the domain-tag edit, and (b) DL-4 + DL-5 + I-3 for the `{session-id}` row edit on this same file.
   - Action: in a single executor task that opens `.claude/skills/mistake/SKILL.md` exactly once, apply two edits in one pass:
     1. Add `hooks` to the documented domain-tag examples list (single-line scope per iter1 DL-3).
     2. Update the `{session-id}` row in the file's Path Conventions block (currently at `.claude/skills/mistake/SKILL.md:129` reading `{session-id} — Claude Code session ID from $CLAUDE_CODE_SESSION_ID`) to the M2 wording: "from the delegation prompt's `session-id:` field; do NOT read `$CLAUDE_CODE_SESSION_ID` for this value (subagent context returns the subagent's own UUID, not the parent session's)".
   - Plus: update `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` status to clarify perpetual-capture-reminder semantics + N≥2 skill-extraction trigger.
   - **Bound**: no new artifact (no separate `watchlist.md` file); no speculative pitfalls listing — Iron Law 10 forbids it.
   - **Per D-7 revised**: CL-5 explicitly does NOT touch `.claude/skills/mistake/SKILL.md`. The 11-skill sweep is the 12-skill list minus `mistake/SKILL.md`; that one file is owned end-to-end by CL-3.

4. **CL-4 — Theme β: `session-lifecycle-worktree-boundaries.md` design doc.**
   - Witness: per backlog § "When to pick up" — "After T1 ships AND N=2 sessions have exercised the worktree-first pattern end-to-end". T1 shipped at `dfb7d6d`. User locked DL-1 = **β-1**: this session self-counts as N=2.
   - Action: write `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` using `memorization/templates/design.md`, per backlog § "Suggested approach" 5-section shape (problem / approach / surfaces / validation / lessons).
   - **NEW inline rationale requirement per Claude R5-001 + Codex P6-F2**: the lessons section MUST contain a one-sentence note: "Lessons section is intentionally sparse as of 2026-05-24 — authored before Wrap-up ran per Bundle C DL-1 (β-1). Deepen after subsequent worktree-pr sessions per R-7." The commit message MAY additionally carry the `lessons-section-depth: shallow-by-design-per-DL-1` tag, but the design doc body is the canonical surface.
   - **NEW backlog file in may-touch per Codex P3-F1**: `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` is added to CL-4 may-touch to authorize the status flip from `deferred` → `closed` documented in Backlog Deltas.

5. **CL-5 — f-risk-01 M2 docs sweep across 11 skills (was 12; `mistake/SKILL.md` moved to CL-3).**
   - Witness: `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` § "Candidate mitigations" M2 — verbatim.
   - Action: across each of the 11 affected skill files — `.claude/skills/wrap-up/SKILL.md`, `.claude/skills/research/SKILL.md`, `.claude/skills/orchestration/workflow/evaluation.md`, `.claude/skills/planning/SKILL.md`, `.claude/skills/execution/SKILL.md`, `.claude/skills/ideation/SKILL.md`, `.claude/skills/memorization/SKILL.md`, `.claude/skills/interview/SKILL.md`, `.claude/skills/evaluation/SKILL.md`, `.claude/skills/preparation/SKILL.md`, `.claude/skills/gobbi/SKILL.md` — update the **`{session-id}` row in that file's Path Conventions section** to the M2 wording.
   - **Wording is locked at Ideation, not deferred to Preparation (resolves Claude P4-001, Codex P4-F2).** The canonical replacement string for the `{session-id}` row is:
     > `{session-id} — Claude Code session ID supplied by the delegation prompt's `session-id:` header field (the parent session's id). Do NOT read `$CLAUDE_CODE_SESSION_ID` for this value: in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's.`
     Preparation may polish punctuation/sentence-flow per file but MUST preserve the two semantic clauses ("from the delegation prompt's `session-id:` field" + "do NOT read `$CLAUDE_CODE_SESSION_ID` ... subagent's own UUID, not the parent session's"). SC-5 verifies both clauses with per-file bounded checks (see Success Criteria).
   - **NEW backlog file in may-touch (already in iter2)**: `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` is in CL-5 may-touch for the canonical disposition update per SC-6.
   - **mistake/SKILL.md is NOT in CL-5 may-touch** (was in iter2; moved to CL-3 per D-7 revised).

6. **CL-6 — Orchestration row 5/5.5/6 path-resolution fix (NEW for iter3).**
   - Witness: this session's session-dir-placement bug — `<worktreePath>/.../ideation/staging/decisions/session-dir-placed-outside-worktree.md`. Confidence 95; severity medium; mistake-candidate already staged. Compounding witnesses: bundle-B design docs D-1 (`d-1-worktree-row-5-5.md`), D-2 (`d-2-qualified-git-rule.md`), D-4 (`d-4-per-iter-session-commit.md`) — D-4 in particular makes the bug consequential because per-iter MEMORIZATION commits run via `git -C "$worktreePath" add`; session memory at the main-tree path is invisible to those commits.
   - Action: edit `.claude/skills/orchestration/SKILL.md` Step 1 rows 5, 5.5, and 6 so:
     (a) the qualified absolute-root rule from `git/SKILL.md` § Memory Access Matrix Critical-Rule + `d-2-qualified-git-rule.md` is cited **inline** in each row — explicit text along the lines of "When `settings.git.workflow.mode == 'worktree-pr'`, write to `$worktreePath/.gobbi/projects/{project-name}/sessions/{date}-{session-id}/...`; when `direct`, write to the main-tree path. See `git/SKILL.md` § Memory Access Matrix Critical-Rule and `d-2-qualified-git-rule.md`."
     (b) the row-ordering problem is resolved per **DL-7 = Option B (user-locked 2026-05-24)**: promote row 5.5 to before row 5 (renumber: new row 5 = worktree create, new row 5.5 = state.json init, new row 6 = session.json init). When `worktree-pr`, every write lands inside the worktree from the start. When `direct`, the "create worktree" step is skipped per the existing LOCK #5 escape hatch; state.json + session.json then write to the main tree. Eliminates the migration semantic entirely. (**Alternatives A and C** — keep-current-order-with-migrate and keep-current-order-with-tmp-staging — were considered and rejected; see § Decisions Log D-9 and § Risk R-8 for the historical trade-off analysis.)
     (c) Stage this session's mistake-candidate at `<worktreePath>/.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` for Wrap-up promotion via `gobbi mistake promote` (post-session). The mistake-candidate file already exists; CL-6's contribution is to leave it in place + reference it from the orchestration-row docstring as the witness ("Triggered by mistake `session-dir-placed-outside-worktree` — 2026-05-24 session 45388fa9.").
   - Scope size: 1 file edited (`orchestration/SKILL.md` Step 1 table rows 5, 5.5, 6 + the "Row 5.5 — Direct-mode opt-out (LOCK #5)" footnote) + 1 mistake-candidate file left in place. Estimated ~40–80 LOC per DL-7 = Option B (Option B is the most prose-light because it doesn't introduce a "migrate" sub-step).

### Out-of-Scope (do not absorb)

- Implementation of any 3rd hook (would change the N=2 witness premise for CL-2).
- M1 or M3 mitigation paths for f-risk-01 — DL-5 locks M2; M1 and M3 explicitly rejected.
- Re-litigating DL-1 / DL-4 / DL-5 / DL-6 — user-locked. Iter3 EVALUATION must not surface these as open questions.
- Refactoring `session-start.sh` or `post-tool-use-agents.sh` — these are read-only inputs (witnesses) to CL-2.
- Editing `.claude/skills/mistake/SKILL.md` beyond CL-3's two consolidated edits — anything else on this file is out of scope (including any of the broader 11-skill sweep edits; CL-5 does not touch this file per D-7 revised).
- Smoke-test gate T1.h work — orchestration row 5.5 ships in develop; the smoke gate is Memorization-scope, not Ideation. Flag in Wrap-up briefing.
- Bundling additional backlog items (e.g., `normalize-path-conventions-h3`, `item-1-2-broader-delegation-contract-verifier`) — none has a fired trigger; Iron Law 10.
- Implementing the chosen CL-6 row-order text or LOCK #5 footnote rewording — that is Preparation/Planning scope. Ideation locks the option (post user-answer) + the citation requirement; Preparation produces the exact replacement text.
- Updating `git/SKILL.md` itself, `delegation/SKILL.md`, or any other skill outside the 11-list-minus-mistake + `orchestration/SKILL.md` — CL-5's sweep is bounded to the 11 named skill files; CL-6 is bounded to `orchestration/SKILL.md` Step 1 rows 5/5.5/6 (plus LOCK #5 footnote on the same Step 1 surface). Edits to `git/SKILL.md` itself land in a future bundle if needed (Iron Law 4).

### Decisions Locked (Scope Contract enumeration — exact mirror of post-AUQ table per Codex P2-F1)

- **DL-1** — β-1, ship Theme β this session; rationale: user authority on workflow cadence (Iron Law 9); shallow-lessons trade-off accepted; CL-4 carries inline note in lessons section to address Claude R5-001.
- **DL-2** — feature name = `session-foundations-bundle-c`; rationale: covers all 6 deliverables; matches iter1 leader proposal.
- **DL-3** — close f-struct-01 inline; rationale: fix already shipped in `159eb21`; docs-sync via Iron Law 8.
- **DL-4** — absorb f-risk-01 into Bundle C; rationale: user diverged from iter1 leader's defer; user authority on scope-vs-cadence; M2 chosen as the codification path keeps scope sane.
- **DL-5** — M2 mitigation only (delegation-prompt codification); M1 + M3 explicitly NOT chosen; rationale: minimal change, codifies current de-facto practice, no `session.json` I/O step required.
- **DL-6** — add CL-6 (orchestration row-5/5.5/6 fix) as 6th deliverable; rationale: user-reported bug today; closes a recurrence path. **Option choice resolved by DL-7** below.
- **DL-7** — CL-6 row-order fix = **Option B (promote row 5.5 to before row 5)**, user-locked 2026-05-24 via post-iter3-draft AUQ. User accepted leader recommendation per D-9 reasoning. Planning adopts Option B's row layout; no further Option A/B/C/D deliberation.

### Success Criteria (rewritten for precision per Codex P4-F1; per-file bounded checks for CL-5)

- **SC-1 (CL-1)**: `git show` on the Bundle C merge commit includes `f-struct-01-jq-sh-env-passthrough.md` with `status: closed` and `closed_by: 159eb21`. Grep: `grep -E '^status:' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` returns `status: closed`.

- **SC-2 (CL-2)** — three independent sub-checks:
  - **SC-2.1**: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` exists on develop post-merge; `head -10` shows YAML frontmatter with `name: gobbi-hook-authoring`; body has Core Principles + Procedures + Constraints + Output paths sections (verify via `grep -nE '^## '`).
  - **SC-2.2 (per Claude S3-001 + O-001)**: `awk '/^## Path conventions|^## Path Conventions/,/^## /' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md | grep -nE 'delegation prompt.*session-id|session-id.*delegation prompt'` returns ≥ 1 hit AND `awk '/^## Path conventions|^## Path Conventions/,/^## /' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md | grep -nE 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID'` returns ≥ 1 hit. (Bounded check: only within the Path Conventions section.) If the skill body has no Path Conventions section because the canonical template does not include one for hook-authoring scope, SC-2.2 degrades to: `grep -nE '\$CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` returns zero hits anywhere (no occurrence at all).
  - **SC-2.3 (per Codex P4-F3 + P7-F1)**: `grep -nE 'session-start\.sh|post-tool-use-agents\.sh' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` shows hits citing both witnesses by path. PLUS exercise witness: `jq '.agents | length' <worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../session.json` is non-zero post-Wrap-up (proves `post-tool-use-agents.sh` fired and upserted entries during this session — the "exercised by ≥1 real session" backlog trigger).

- **SC-3 (CL-3)** — two independent sub-checks (per Codex P2-F2 + P5-F1 — D-7 revised):
  - **SC-3.1 (hooks-domain edit)**: `grep -n 'hooks' .claude/skills/mistake/SKILL.md` shows `hooks` listed in the domain-tag examples; backlog file `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` status field clarifies perpetual-capture-reminder + N≥2 skill-extraction trigger.
  - **SC-3.2 (M2 row edit on `mistake/SKILL.md`)**: same per-file bounded checks as SC-5 but applied to `.claude/skills/mistake/SKILL.md`: `awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*|^## /' .claude/skills/mistake/SKILL.md | grep -nE 'delegation prompt.*session-id|session-id.*delegation prompt'` returns ≥ 1 hit AND the same `awk` ... | `grep -nE 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID'` returns ≥ 1 hit. (Note: in `mistake/SKILL.md`, the Path Conventions block is delimited by `**Path conventions**` bolded sub-heading, not by `## `; the awk range covers both.)
  - Single executor task per D-7 revised: both edits applied in one file open + one commit.

- **SC-4 (CL-4)** — two sub-checks:
  - **SC-4.1**: `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` exists on develop post-merge; structure conforms to `memorization/templates/design.md`; body has all 5 sections (problem / approach / surfaces / validation / lessons) per the backlog § "Suggested approach". Lessons section is non-empty.
  - **SC-4.2 (per Claude R5-001 + Codex P6-F2)**: `grep -nE 'shallow-by-design-per-DL-1|intentionally sparse|authored before Wrap-up' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` returns ≥ 1 hit (inline DL-1 rationale present in the design doc body, not only in commit message).

- **SC-5 (CL-5) — REWRITTEN per Codex P4-F1 with per-file bounded checks across the 11 affected skill files.** For each file `F` in the 11-list (`wrap-up`, `research`, `orchestration/workflow/evaluation`, `planning`, `execution`, `ideation`, `memorization`, `interview`, `evaluation`, `preparation`, `gobbi`):
  - **Bounded grep on the Path Conventions section** — extract the Path Conventions block from `F` and verify both semantic clauses appear within that block:
    ```
    awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*[^P]|^## /' <F> > /tmp/pcblock.txt
    grep -E 'delegation prompt.*session-id|session-id.*delegation prompt' /tmp/pcblock.txt  # M2 clause 1
    grep -E 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID' /tmp/pcblock.txt  # M2 clause 2
    ```
    Both greps must return ≥ 1 hit. The bounded range starts at the Path Conventions heading (either `## Path conventions`, `## Path Conventions`, or `**Path conventions**`) and ends at the next equivalent heading.
  - **Negative check (anti-game per Iron Law 11)**: outside the Path Conventions block, `$CLAUDE_CODE_SESSION_ID` may still appear for legitimate reasons (e.g., the `gobbi/SKILL.md` env-health gate at line 52 reads `Verify $CLAUDE_CODE_SESSION_ID is non-empty` for session-start bootstrap; the `ideation/SKILL.md` Path Conventions matrix references `$CLAUDE_CODE_SESSION_ID` once as the source for `{session-id}` and that one occurrence is what CL-5 rewrites). The bounded check above intentionally only constrains the Path Conventions block; out-of-block occurrences are not flagged.
  - **One-of-11 reference-wording spot check (per Claude R5-002)**: pick `wrap-up/SKILL.md` as the canonical reference. After CL-5 commits, the M2 clause 1 + M2 clause 2 substrings extracted from the Path Conventions block of `wrap-up/SKILL.md` MUST exactly match the same substrings extracted from at least 7 of the 11 files (allows minor sentence-flow polish on the remaining 4 per Preparation; satisfies Codex P4-F2's "lock semantic clauses, allow polish on draft wording" path).

- **SC-6 (CL-5 backlog disposition — CANONICAL per Claude C2-001 + P4-002, Codex P5-F2)** — the single source of truth replacing the three iter2 formulations:
  - Frontmatter changes on `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`: set `status: addressed` AND `disposition: addressed` (both fields, both values); add `closed_by: <Bundle C merge commit SHA>` once the PR merges.
  - Body change: append a section `## Resolution` citing the 11-skill sweep + the `mistake/SKILL.md` consolidated edit (CL-3) + the M2 codification decision (DL-5) + alternative considerations M1 / M3 not chosen.
  - The file remains in `backlogs/` (NOT deleted) so M1/M3 alternatives-considered rationale survives.
  - Backlog Deltas table § "Resulting status" (below) and the CL-5 verification anchor row in the Per-Deliverable table both restate SC-6 verbatim — single canonical spec across all sections.

- **SC-7 (bundle-wide)**: all 6 deliverables land in the same PR on `chore/session-2026-05-24-45388fa9`; Iron Law 8 satisfied (docs ship with implementation). PR description references the witness per Iron Law 10 for each of CL-1..CL-6.

- **SC-8 (CL-6, NEW)**:
  - **SC-8.1**: `.claude/skills/orchestration/SKILL.md` Step 1 rows 5, 5.5, and 6 each contain an inline reference to `git/SKILL.md` § Memory Access Matrix Critical-Rule AND to `d-2-qualified-git-rule.md`. Verify via `awk` range from `## Step 1 — Workflow Configuration` to `## Step 2 — Ideation Loop` extracts and `grep -E 'git/SKILL\.md.*Memory Access Matrix|d-2-qualified-git-rule'` returns ≥ 2 hits in that range (rows 5 + 5.5 + 6 may share a single inline citation, so the floor is 2 not 3).
  - **SC-8.2**: the row-ordering fix is applied per **DL-7 = Option B** (user-locked 2026-05-24): row 5 now creates the worktree (was 5.5); row 5.5 now initializes `state.json` (was 5); row 6 initializes `session.json` (unchanged label). Verification: `awk '/^### Step 1 — Workflow Configuration/,/^### Step 2 /' .claude/skills/orchestration/SKILL.md` shows the row table where row 5 invokes P2 (worktree create), row 5.5 writes `state.json` inside `$worktreePath/.gobbi/...`, and row 6 stamps `git.worktreePath` from the already-created worktree. No remaining references to Option A (`mv .*state\.json` migration) or Option C (`tmp/` staging) should appear in the Step 1 range — alternative options are excluded by DL-7.
  - **SC-8.3**: the staged mistake-candidate `<worktreePath>/.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` remains in place at session-end for `gobbi mistake promote`. (CL-6 does not delete it; Wrap-up does not promote until post-session; the staged file is the witness for SC-8.1 + SC-8.2.) Verify: `test -f <worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` returns 0.

### Deferred (recap)

- M1 / M3 mitigation paths for f-risk-01 — NOT chosen per DL-5; recorded in `f-risk-01-subagent-ccsi-semantics.md` body as "alternatives considered".
- Skill-extraction trigger for hooks-domain mistakes (N≥2 threshold not yet met) — remains deferred; CL-3's backlog update notes the trigger.
- Smoke-test gate T1.h — Memorization-scope; Wrap-up handles.
- Bundle B HANDOFF staleness — Wrap-up note; not a Bundle C deliverable.
- "Lessons learned" depth amendment for `session-lifecycle-worktree-boundaries.md` — DL-1 accepts shallow-by-design; future sessions may amend per R-7.
- Implementing the chosen CL-6 row-order text/wording — Preparation/Planning scope (Ideation locks option + citation requirement).
- Updating `git/SKILL.md` itself or `delegation/SKILL.md` — out of Bundle C; Iron Law 4.

---

## Per-Deliverable Scope-Bound Table

One row per deliverable. `files-may-touch` is the **complete authorized set** (per Codex P3-F1 + P6-F1: Backlog Deltas writes are now reflected in may-touch); `files-must-not-touch` is the executor brief's denylist; the verification anchor is the concrete check.

| CL # | Deliverable | Files-may-touch | Files-must-not-touch | Verification anchor |
|---|---|---|---|---|
| CL-1 | Close f-struct-01 inline | `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` (only) | `.claude/hooks/session-start.sh` (witness, read-only); any other backlog file; `.gobbi/projects/gobbi/skills/**` | SC-1 — `grep -E '^status: closed'` returns 1 line; `closed_by: 159eb21` in frontmatter; closure note cites `session-start.sh:73-77`. |
| CL-2 | Stage + promote `gobbi-hook-authoring` skill (M2-compliant from creation) | `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md`; `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md`; **`.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md`** (status flip — new per Codex P3-F1) | `.claude/skills/mistake/SKILL.md` (CL-3 owns it); any of the 11 CL-5 sweep targets; `.claude/skills/orchestration/SKILL.md` (CL-6 owns it); `.claude/hooks/**` | SC-2.1 (frontmatter + section headers), SC-2.2 (M2 wording in Path Conventions OR zero `$CLAUDE_CODE_SESSION_ID` mentions anywhere in the new skill), SC-2.3 (witness citations + `session.json.agents[].length > 0` exercise witness). |
| CL-3 | `mistake/SKILL.md` consolidated edits (domain-tag + M2 row) + hooks-watchlist backlog clarifier | `.claude/skills/mistake/SKILL.md` (two edits in one task — see D-7 revised); `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` | `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` (CL-2 owns it); any of the 11 CL-5 sweep targets (CL-5 owns those — see CL-5 row may-touch for the explicit enumeration that resolves Claude P1-001's aggregate-language finding); `.claude/skills/orchestration/SKILL.md` (CL-6 owns it); any other backlog file | SC-3.1 (`grep` on domain-tag list + backlog status clarifier) + SC-3.2 (bounded `awk`/`grep` on Path Conventions block for M2 clauses on `mistake/SKILL.md`). Single executor task — D-7 revised. |
| CL-4 | Theme β design doc + DL-1 inline rationale | `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` (new file); **`.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md`** (status flip — new per Codex P3-F1) | Any session.json file; any backlog file other than the design-doc backlog; any of the 11 CL-5 sweep targets; `.claude/skills/orchestration/SKILL.md` (CL-6) | SC-4.1 (file exists + 5 sections + lessons non-empty + links to `dfb7d6d`) + SC-4.2 (inline shallow-by-design note grepped from doc body). |
| CL-5 | f-risk-01 M2 docs sweep across 11 skills (not 12) + backlog disposition update | The **11** files explicitly enumerated (resolves Claude P1-001's aggregate-language concern by enumeration): `.claude/skills/wrap-up/SKILL.md`, `.claude/skills/research/SKILL.md`, `.claude/skills/orchestration/workflow/evaluation.md`, `.claude/skills/planning/SKILL.md`, `.claude/skills/execution/SKILL.md`, `.claude/skills/ideation/SKILL.md`, `.claude/skills/memorization/SKILL.md`, `.claude/skills/interview/SKILL.md`, `.claude/skills/evaluation/SKILL.md`, `.claude/skills/preparation/SKILL.md`, `.claude/skills/gobbi/SKILL.md`; PLUS `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` | **`.claude/skills/mistake/SKILL.md` (CL-3 owns it — per D-7 revised; removed from CL-5 list)**; `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` (CL-2 owns it); `.claude/skills/orchestration/SKILL.md` (CL-6 owns it); any other skill file; `.claude/skills/git/SKILL.md` (out of bundle); `.claude/skills/delegation/SKILL.md` (out of bundle) | SC-5 per-file bounded `awk`/`grep` on each of the 11 files' Path Conventions blocks (both M2 clauses present); SC-6 canonical backlog disposition. |
| CL-6 | Orchestration row 5/5.5/6 path-resolution fix (NEW) | `.claude/skills/orchestration/SKILL.md` (Step 1 rows 5, 5.5, 6 + the "Row 5.5 — Direct-mode opt-out (LOCK #5)" footnote, all within the same Step 1 surface); `<worktreePath>/.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` (left in place — staged mistake-candidate; Wrap-up promotes) | `.claude/skills/git/SKILL.md` (out of bundle — text is referenced, not edited); any of the 11 CL-5 sweep skills; `.claude/skills/mistake/SKILL.md` (CL-3); `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` (CL-2); any session.json or settings.json or state.json file; the bundle-B design docs `d-1-worktree-row-5-5.md` / `d-2-qualified-git-rule.md` / `d-4-per-iter-session-commit.md` (referenced, not edited — these are locked bundle-B decisions) | SC-8.1 (inline citation present, `awk` range), SC-8.2 (row-order matches DL-7 = Option B: new row 5 = worktree-create, new row 5.5 = state.json-init, row 6 = session.json-init), SC-8.3 (mistake-candidate staged file present at session-end). |

**Coordination notes (revised from iter2)**:
- The iter2 `mistake/SKILL.md` co-touch issue is RESOLVED via D-7 revised — only CL-3 touches that file. CL-5's may-touch explicitly excludes it; the CL-5 enumeration is 11 files, not 12.
- CL-6 touches `orchestration/SKILL.md` only; no other CL touches that file (CL-5's 11-list excludes it; `orchestration/workflow/evaluation.md` is a sibling sub-doc and is in CL-5, not the parent `orchestration/SKILL.md`).
- All backlog status flips named in Backlog Deltas are authorized by an explicit `files-may-touch` entry on the owning CL (per Codex P3-F1 resolution): CL-1 owns `f-struct-01`; CL-2 owns `gobbi-hook-authoring-skill`; CL-3 owns `hooks-domain-mistakes-watchlist`; CL-4 owns `session-lifecycle-worktree-boundaries-design-doc`; CL-5 owns `f-risk-01-subagent-ccsi-semantics`.

---

## Sequencing / DAG

Implementation order is sequential by default (Principle 3: BUILD FROM THE BASE UP); parallel-safe only where files are disjoint. Recommended order:

1. **CL-1** (smallest, gates nothing; produces fastest verifiable win; 1-file edit on a backlog).
2. **CL-6** (single-file edit on `orchestration/SKILL.md`; **sequenced second** because every subsequent session that runs `gobbi workflow init` benefits from the row-order fix — fixing it early in the bundle reduces the recurrence window. CL-6's edit is independent of CL-2..CL-5's surfaces; safe to parallelize file-wise but ordered second for narrative-flow reasons in Planning).
3. **CL-3** (one-file consolidated edit on `mistake/SKILL.md` + backlog clarifier; sequenced before CL-5 so that the canonical M2 wording lands first on the most-loaded skill — `mistake` is loaded by every fresh subagent — and provides a reference for the CL-5 sweep).
4. **CL-2** (skill stage + promote; one new file + backlog flip; sequenced before CL-4 because CL-4's design doc may reference the gobbi-hook-authoring skill as prior art).
5. **CL-4** (design doc; one new file + backlog flip; sequenced before CL-5 to keep all "new file" work clustered).
6. **CL-5** (11-file sweep; sequenced last because it's the largest; benefits from CL-3 having already applied the canonical M2 wording to `mistake/SKILL.md` which executor uses as the reference file).

**Parallelism**: in principle CL-1 + CL-6 + CL-3 + CL-2 + CL-4 all touch disjoint files and could parallelize. CL-5's 11-file sweep is internally serializable (one file at a time within the same executor task). Planning may choose to fan out 5 sub-tasks in parallel for CL-1+CL-6+CL-3+CL-2+CL-4, then run CL-5 as a single sequential sweep — but the default recommendation is sequential per Principle 3 (one task at a time, user-in-the-loop).

**Dependency edges**:
- CL-6 blocks NOTHING in Bundle C (it edits a file no other CL touches). CL-6 unblocks every future session from the row-5/6 misplacement bug.
- CL-3 SHOULD precede CL-5 (CL-3 establishes the canonical M2 wording on `mistake/SKILL.md`, which CL-5 mirrors across 11 files).
- CL-2 SHOULD precede CL-4 (CL-4 may reference the new gobbi-hook-authoring skill).
- CL-1 is fully independent.
- CL-6 is fully independent (file-wise) but ordered early for narrative reasons.

---

## Framed Problem (carried from iter2 with delta for CL-6)

**Root cause** (iter3 delta) — unchanged for CL-1..CL-5: "deferred-witness debt that has come due" applies to all 5 absorbed items (CL-1..CL-5). **New for iter3** (CL-6): a latent documentation gap in `orchestration/SKILL.md` Step 1 — rows 5 and 6 specify session-file paths as **relative** without an explicit tree qualifier, so when the manager resolves them against the current working directory in worktree-pr mode, the session directory lands in the wrong tree. Compounded by D-4's `git -C "$worktreePath" add` cadence: session memory outside `$worktreePath` is silently invisible to per-iter commits. The user encountered this exact bug at the start of this session; the iter1 + iter2 evaluation artifacts inherited the wrong location.

Per Codex P1-F1 — I am NOT re-framing CL-5 as "fired witness debt"; CL-5 is **user-authorized scope absorption from a backlog that itself recommended its own Ideation**. The framing now reads:
- CL-1, CL-2, CL-3, CL-4: fired witness debt that has come due (Bundle B deferred follow-ups whose triggers have fired).
- CL-5: **user-authorized scope absorption** (DL-4 + DL-5) — the f-risk-01 backlog itself recommended a separate Ideation, but the user diverged from that routing in favor of consolidating into Bundle C. M2 (the chosen mitigation) is internal documentation harmonization rather than behavioral change.
- CL-6: emergent witness debt (user-reported bug today + this session's own mistake-candidate file).

Evidence (carried from iter2 + new for iter3):
- `git log --oneline --since=2026-05-21 -- .claude/ .gobbi/projects/gobbi/` shows `dfb7d6d` (Bundle B), `7c0a6d0` (Bundle A), `159eb21` (env-var-audit) merged.
- `wc -l .claude/hooks/{session-start.sh,post-tool-use-agents.sh}` = 79 + 251.
- `.gobbi/projects/gobbi/mistakes/` listing: 15 files, zero `domain: hooks`.
- M2 verbatim from `f-risk-01-subagent-ccsi-semantics.md` § Candidate mitigations.
- **NEW for iter3**: `<worktreePath>/.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` exists (read in full, confidence 95, severity medium); orchestration/SKILL.md Step 1 rows 5/5.5/6 (read in full) — rows 5 and 6 use `.gobbi/projects/{project-name}/sessions/...` relative paths without inline tree qualifier; bundle-B design docs D-1 + D-2 + D-4 are the dependencies (read in full — D-1 documents the row-5.5 insertion, D-2 documents the qualified absolute-root rule, D-4 makes the consequence concrete via the per-iter commit cadence).

**Impact** — CL-6 adds one new persona: **future session managers**. Every session that runs `gobbi workflow init` in worktree-pr mode currently has a 100% rate of hitting this bug if the manager does not explicitly check the qualified absolute-root rule (which is not cited inline in rows 5/5.5/6 today). Bundle C's CL-6 closes the recurrence path; the documentation-level risk is eliminated session-by-session for every future worktree-pr session.

**Success criteria** — see § Scope Contract → § Success Criteria (SC-1 through SC-8).

**Prior attempts** — unchanged for CL-1..CL-5; for CL-6, bundle-B D-2 + D-4 are the prior art that defined the rule; CL-6 is the inline-documentation gap closer that the prior art assumed but did not explicitly fix in the Step 1 procedure table.

**Counterfactual / steel-man (iter3 delta for CL-6)** — Steel-man: "The session-dir bug is a one-time human/manager error during Configuration; it doesn't recur; the corrective move (move the session dir into the worktree) already happened; no doc fix needed." Counter-evidence: D-4 makes the bug consequential beyond cosmetic — per-iter commits at `git -C "$worktreePath" add` skip session memory outside `$worktreePath` silently. The bug is not "one-time" but "100% recurrence per worktree-pr session" until the orchestration text is fixed. Bundle B's design docs implicitly require the fix; CL-6 makes it explicit in the Step 1 table.

**Re-framing conclusion** — unchanged: literal ask is the right framing; SCOPE shifted upward per user authority (DL-4 absorbed f-risk-01 in iter2; DL-6 absorbed CL-6 in iter3).

---

## Research Insights (carried from iter2 with delta for CL-6)

### Internal Insights

**I-1** — N=2 hook witnesses exist on develop. Anchors CL-2.

**I-2** — `f-struct-01`'s suggested fix is present in shipped code. Anchors CL-1.

**I-3** — `f-risk-01`'s doc-level risk persists post-Bundles-A+B. Anchors CL-5.

**I-4** — Bundle B's HANDOFF claims "emergency stop" but the merged PR shipped all 10 tasks. Informs CL-4's design doc surfaces; flagged for Wrap-up.

**I-5** — Project mistakes show recent post-Bundle-B captures around worktree edits. Constrains Planning's task-count target.

**I-6** — Current de-facto delegation-prompt pattern already passes parent session-id explicitly. **Refined per Claude W7-001**: the primary witness for CL-5 is the f-risk-01 backlog + DL-4/DL-5 user locks; I-6 is **corroborating evidence** (verifiable in this session's own delegation-prompt header — `session-id: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f`), not primary grounding. The iter1-leader-prompt cross-check from iter2 I-6 is dropped as unverifiable by evaluators per W7-001.

**I-7 (NEW for iter3)** — `orchestration/SKILL.md` Step 1 row 5 specifies session-file paths as **relative** without inline tree qualifier
- **Source**: read of `.claude/skills/orchestration/SKILL.md` lines 102-104 — row 5: `Initialize state.json for the session by copying the state template into .gobbi/projects/{project-name}/sessions/{date}-{session-id}/state.json`; row 6: same pattern for `session.json`. Neither row cites `session.json.git.worktreePath` or the qualified absolute-root rule from `git/SKILL.md` § Memory Access Matrix Critical-Rule.
- **Insight**: The documentation gap that produced this session's misplacement bug is local to rows 5 and 6 (and the absence of inline citation to the d-2-qualified-git-rule). The fix is paragraph-level inline text + a row-order resolution (Option A/B/C).
- **Why**: Sizes CL-6 honestly (1 file, ~40–80 LOC per DL-7 = Option B).

**I-8 (NEW for iter3)** — bundle-B D-1 explicitly considered and rejected "Promote to row 5" with rationale "changes more than necessary"
- **Source**: read of `<worktreePath>/.gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-1-worktree-row-5-5.md` § Trade-offs considered, line 36: `Promote to row 5 — rejected: changes more than necessary`.
- **Insight**: Option B in CL-6 (promote 5.5 to before 5) was previously considered at bundle-B time and rejected — but the rejection was made **before** the misplacement bug was witnessed. The bug evidence reopens the trade-off because the "preserved semantic" D-1 cited as the rejection rationale was, in fact, buggy. Bundle B's D-1 didn't know what we know now.
- **Why (historical, pre-DL-7)**: The leader's Option B recommendation was **not** novel — it was the previously-rejected alternative, re-favored on new evidence (the misplacement-bug witness). The user was informed of this lineage before locking DL-7 = Option B.

**I-9 (NEW for iter3)** — bundle-B D-4 makes the row-5/6 misplacement actively harmful (not merely cosmetic)
- **Source**: read of `<worktreePath>/.gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-4-per-iter-session-commit.md` § Decision — per-iter MEMORIZATION commits run via `git -C "$worktreePath" add <session-memory-deltas>` + `git -C "$worktreePath" commit -m ...`.
- **Insight**: For these per-iter commits to actually include session memory, the session memory MUST live inside `$worktreePath`. Memory at the main-tree path is silently invisible to `git -C "$worktreePath" add`. The bug is not a doc-cosmetic problem — it breaks D-4's commit cadence.
- **Why**: Anchors CL-6's severity (not just inline citation; the row-order matters because D-4 requires the worktree-rooted layout).

### External Insights

**E-1** — Anthropic's published skill-authoring guidance for Claude Code. Anchors CL-2 template choice.

**E-2** — `printf '%q'` is Bash-specific. Direct input to CL-2's skill body's "Strict-mode preamble" + "jq quoting" sections.

(No new external insight for CL-5 or CL-6 — both are internal documentation harmonization. External research bounded per `research/SKILL.md` "Insights, not link dumps".)

---

## Scenarios (with iter3 delta)

**S-1 (golden, CL-2)** — A future contributor adds a third hook. They load the new `gobbi-hook-authoring` project skill and emit a hook that satisfies the pattern stack. Path Conventions section in the new skill (M2-compliant from creation per S3-001 fix) prevents the future contributor from caching subagent-UUID-derived paths.

**S-2 (golden, CL-4)** — A new contributor reads `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` and gets one-place answer; the inline shallow-by-design note explains why the lessons section is thin without forcing the reader to `git log`.

**S-3 (golden, CL-5)** — A future agent (any role) reading any of the 11 swept skills' Path Conventions block sees the M2 wording — bounded check per SC-5 ensures the disclaimer is adjacent on the same row.

**S-4 (edge, CL-3 single-file two-edit task)** — CL-3 holds both `mistake/SKILL.md` edits in one executor task per D-7 revised. CL-5's may-touch explicitly excludes the file. The two-task-on-one-file race condition that iter2 worried about is eliminated by routing.

**S-5 (failure, scope-drift on CL-5)** — During Bundle C execution, an executor sees one of the 11 skills' Path Conventions section and wants to "improve consistency" by reformatting unrelated rows. Iron Law 4 + Iron Law 10 violation; SC-5's bounded-per-file check + the `files-may-touch` denylist for CL-5 must catch this.

**S-6 (failure, M2 mis-application)** — During CL-5, executor implements M1 wording (cite `session.json.sessionId`) instead of M2 wording on one or two skills. SC-5 per-file bounded grep for M2 clauses catches this; the reference-wording spot check (SC-5 last clause) catches per-file drift.

**S-7 (adversarial, witness staleness — CL-2)** — A reviewer challenges the gobbi-hook-authoring skill's "two-tier extraction" pattern, citing that only `post-tool-use-agents.sh` uses it. Response: skill body labels two-tier extraction as a `post-tool-use-agents.sh`-specific pattern in a "Patterns by event type" section.

**S-8 (adversarial, DL-1 shallow-lessons — CL-4)** — A future reader challenges the design doc's "lessons" section for being thin. **iter3 update per Claude R5-001 + Codex P6-F2**: pre-recorded response now lives INLINE in the design doc body (one-sentence note in lessons section), not only in commit message. Inline note: "Lessons section is intentionally sparse as of 2026-05-24 — authored before Wrap-up ran per Bundle C DL-1 (β-1). Deepen after subsequent worktree-pr sessions per R-7." SC-4.2 verifies the inline note exists.

**S-9 (NEW for iter3, adversarial, CL-6 option choice — RESOLVED)** — A future maintainer asks: "Why did Bundle C pick Option B for the row-5/6 fix?" Response: DL-7 locks Option B (user-confirmed 2026-05-24 via manager AUQ). The audit trail is preserved in § Decisions Log D-9 (historical rationale: robustness vs A/C migration window; smallest blast radius; bundle-B D-2/D-4 invariant alignment) and in the Open Questions appendix (audit-form retention of the A/B/C/D options the leader presented for the user's selection).

**S-10 (NEW for iter3, failure, CL-6 partial-failure scenarios — historical, not live)** — Alternatives A and C (considered and rejected per DL-7) would have introduced a window in which the manager could crash between row 5 (main-tree write) and end-of-5.5 (migration into worktree); recovery would have required reconciling state.json + settings.json + session.json across two locations. DL-7's Option B avoids this scenario entirely by writing into the worktree from the start. This rationale is part of the historical record for why A/C were rejected; not a live scenario in the locked artifact.

---

## Implementation Checklist (anchored)

Per `ideation/SKILL.md` Sub-step D-2.

- **CK-1 (→ CL-1)**: Edit `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` frontmatter + append closure note. Anchored: I-2, DL-3.
- **CK-2 (→ CL-2 stage)**: Stamp `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` using `interview/templates/project-skill.md`. **NEW for iter3 (per S3-001)**: author the Path Conventions section (or skip if not present) using M2 wording — see CL-2 § In-Scope above. Anchored: I-1, E-1, E-2, S3-001.
- **CK-3 (→ CL-2 promote)**: Promote staged skill to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via `preparation/SKILL.md` narrow-exception. Anchored: I-1, I-5.
- **CK-3.5 (→ CL-2 backlog flip)**: Update `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` status `deferred` → `closed` once the promoted skill exists on develop post-merge. Anchored: backlog status discipline + Codex P3-F1.
- **CK-4 (→ CL-3 edit 1)**: Edit `.claude/skills/mistake/SKILL.md` to add `hooks` to the documented domain-tag examples list. Anchored: iter1 DL-3 + backlog § "Suggested approach" tail bullet.
- **CK-4.5 (→ CL-3 edit 2, NEW per D-7 revised)**: In the SAME executor task as CK-4, edit `.claude/skills/mistake/SKILL.md` line 129 (`{session-id} — Claude Code session ID from $CLAUDE_CODE_SESSION_ID`) to the canonical M2 wording per CL-5 § Wording is locked at Ideation. Both edits are committed together (single file open, single executor task, single commit). Anchored: DL-4, DL-5, P2-F2, P5-F1, D-7 revised.
- **CK-5 (→ CL-3 backlog clarifier)**: Update `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` status field. Anchored: backlog § "Why deferred".
- **CK-6 (→ CL-4)**: Write `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` using `memorization/templates/design.md`, per backlog § "Suggested approach". **NEW for iter3 (per R5-001)**: include inline shallow-by-design note in lessons section. Anchored: I-4, DL-1, R5-001.
- **CK-6.5 (→ CL-4 backlog flip)**: Update `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` status `deferred` → `closed` once the design doc exists on develop post-merge. Anchored: Codex P3-F1.
- **CK-7 (→ CL-5 docs sweep)**: For each of the **11** affected skill files (was 12; minus `mistake/SKILL.md` per D-7 revised), update the `{session-id}` Path Conventions row to the canonical M2 wording per CL-5 § Wording is locked at Ideation. Each file edit is verified by SC-5's per-file bounded grep. Anchored: I-3, I-6, DL-5, P4-F1, P4-F2.
- **CK-8 (→ CL-5 backlog update)**: Update `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` per SC-6 canonical spec (both `status:` and `disposition:` to `addressed`, append `## Resolution` section). Anchored: DL-4, DL-5, C2-001, P4-002.
- **CK-9 (→ CL-6)**: Edit `.claude/skills/orchestration/SKILL.md` Step 1 rows 5, 5.5, 6 + LOCK #5 footnote per **DL-7 = Option B** (user-locked 2026-05-24): promote 5.5 to before 5 (worktree-create first, then state.json init, then session.json init). Inline-cite `git/SKILL.md` § Memory Access Matrix Critical-Rule + `d-2-qualified-git-rule.md`. Leave staged mistake-candidate file in place for Wrap-up promotion. Anchored: I-7, I-8, I-9, DL-6, DL-7, mistake-candidate file as witness.
- **CK-10 (→ bundle-wide)**: PR description cites the witness for each of CL-1..CL-6 per Iron Law 10. Anchored: all of the above.

---

## Design (directional)

Carry-over from iter2 with delta; iter3 revises D-7 and adds D-8 + D-9.

**D-1 — Skill body sourcing pattern** — unchanged; anchors CL-2.

**D-2 — Watchlist resolution shape (smallest-witness-supports)** — unchanged; anchors CL-3's first edit.

**D-3 — f-struct-01 close-in-PR-with-Bundle-C** — unchanged; anchors CL-1.

**D-4 — f-risk-01 absorption with M2 mitigation** — unchanged from iter2; anchors CL-5. **iter3 delta**: M2 wording is **locked at Ideation** (per P4-001 + P4-F2 resolution); Preparation may polish sentence-flow but MUST preserve the two semantic clauses (per SC-5 reference-wording spot check).

**D-5 — Theme β shipped this session per DL-1 (β-1)** — unchanged. **iter3 delta**: inline shallow-by-design note required in lessons section (per R5-001 + P6-F2 resolution).

**D-6 — Task count cap from Bundle B Wrap-up mistake** — REVISED upward for iter3.
- **Decision (re-revised)**: Bundle C's task count is **≤ 14 implementation tasks** if CL-5 ships as a single sweep task + CL-6 ships as a single Option-B task, OR **≤ 17 tasks** if CL-5 fans out to per-file tasks. Recommended path: 1 task per CL (6 implementation tasks total + Preparation + Planning + Evaluation iterations).
- **Rationale**: I-5 (≤ 8 plan tasks discipline from Bundle B Wrap-up); CL-6 adds 1 more deliverable. Single-task-per-CL keeps the bundle near the ≤ 7-task target (6 tasks); fan-out for CL-5 only happens if Planning's evaluator finds the single-task scope too wide.
- **Validation**: Planning iter passes evaluation; no mid-Execution context-pressure escalations (per `manager-context-overflow-with-large-bundle.md`).

**D-7 (REVISED for iter3 — major change per P2-F2 + P5-F1) — `mistake/SKILL.md` is owned exclusively by CL-3, not co-owned with CL-5**
- **Decision (revised)**: All `mistake/SKILL.md` edits in Bundle C land via CL-3, in a single executor task that applies both edits (domain-tag addition + `{session-id}` row M2 update) in one file open + one commit. CL-5's may-touch removes `mistake/SKILL.md` entirely; CL-5 is now an 11-file sweep, not a 12-file sweep.
- **Rationale**: iter2's "two-CL-co-touch with a coordination flag" approach was contradictory in the Per-Deliverable table (both rows listed the file). Codex P2-F2 + P5-F1 both flagged this. Single ownership eliminates the contradiction; the executor task for CL-3 is the natural place to apply both `mistake/SKILL.md` edits because the file is the same and the edit set is small.
- **Validation**: Per-Deliverable table CL-3 may-touch lists `mistake/SKILL.md`; CL-5 may-touch does NOT; CL-5 enumeration is 11 files (per SC-5 + § Per-Deliverable Scope-Bound Table revised). SC-3.2 (bounded check on `mistake/SKILL.md` Path Conventions block) and SC-5 (bounded check on each of the 11 files) together verify the M2 row landed on all 12 originally-targeted files, just routed via two different CLs.

**D-8 (NEW for iter3) — Backlog file edits are authorized by explicit `files-may-touch` entries on the owning CL (per P3-F1)**
- **Decision**: Every backlog status flip listed in § Backlog Deltas is also enumerated as a `files-may-touch` entry on the owning CL's row in the Per-Deliverable Scope-Bound Table. iter2's omission of `gobbi-hook-authoring-skill.md` (CL-2's backlog) and `session-lifecycle-worktree-boundaries-design-doc.md` (CL-4's backlog) from those CLs' may-touch is closed in iter3.
- **Rationale**: Codex P3-F1 found that Backlog Deltas writes were not authorized in the table. The simpler fix (per Codex's two options) is to add the files to may-touch rather than defer to Wrap-up — because (a) the backlog status flips are coherent with each CL's commit, (b) Wrap-up's session-memory-promotion role is for `staging/` → project memory, not backlog status updates, and (c) Iron Law 8 (docs ship with implementation) wants the status flip in the same commit as the shipped artifact.
- **Validation**: P-3F1 verified — Per-Deliverable table CL-2 now lists `gobbi-hook-authoring-skill.md` in may-touch; CL-4 now lists `session-lifecycle-worktree-boundaries-design-doc.md` in may-touch. Codex P3-F2's clarification on the "agents never write to backlogs" rule is also captured in § Backlog Deltas note revised.

**D-9 (NEW for iter3) — Orchestration row 5/5.5/6 path-resolution fix; DL-7 = Option B (LOCKED)**
- **Decision**: CL-6 edits `.claude/skills/orchestration/SKILL.md` Step 1 to (a) cite the qualified absolute-root rule inline in each of rows 5/5.5/6 and (b) resolve the row-5-before-worktree-exists ordering per **DL-7 = Option B** (user-locked 2026-05-24 via post-iter3-draft AUQ): promote row 5.5 to before row 5 (new row 5 = worktree create, new row 5.5 = state.json init, new row 6 = session.json init).
- **Historical rationale for Option B over rejected alternatives A and C**:
  - **Robustness against partial failure** (S-10): Alternatives A and C would have introduced a window in which state.json existed at one location and had to migrate to another; a crash in that window would leave an inconsistent layout. Option B writes inside the worktree from the start; no migration; no crash window.
  - **Smallest blast radius across other docs**: Option B renumbers rows. Existing references to "row 5.5" in other skills had to be re-checked; per the bundle-B design docs, "row 5.5" is only referenced in `d-1-worktree-row-5-5.md` (a bundle-B design decision, locked historical memorial) and in `orchestration/SKILL.md` itself. Cross-file blast radius: minimal. Alternative A would have kept existing row numbers but added a "migrate at end of 5.5" sub-step that complicated the row 5.5 procedure (which already encodes a 3-state idempotency machine). Alternative C was A with an extra `tmp/` directory — strictly more complex.
  - **Consistency with bundle-B intent**: D-2's qualified absolute-root rule, D-4's per-iter commit cadence, and D-1's worktree creation all implicitly require everything session-related to live under `$worktreePath` in worktree-pr mode. Option B is the only candidate that achieves that invariant unconditionally without an intermediate inconsistent state. D-1 had explicitly considered "Promote to row 5" and rejected it as "changes more than necessary" — but the rejection was made before the misplacement bug was witnessed. The new witness reopened the trade-off (per I-8), and DL-7 lands on the evidence-aligned choice.
  - **Direct-mode handling**: Option B's reordering still respects the LOCK #5 escape hatch — if `settings.git.workflow.mode == "direct"`, the new row 5 (worktree create) is skipped entirely, and the new row 5.5 (state.json init) writes to the main tree. The LOCK #5 footnote rewording is minimal — change "row 5.5 is skipped" to "row 5 is skipped".
- **Residual trade-offs of Option B (accepted as part of DL-7)**:
  - Row numbering changes. Other documentation that anchors on "row 5" or "row 5.5" must be re-checked. Bundle-B's design doc filenames (`d-1-worktree-row-5-5.md`) include the row number; these are historical decisions and do not need rename (locked memorials of the decision-at-the-time). The current `orchestration/SKILL.md` is the only live surface where "row 5.5" appears as a row identifier; CL-6's edit covers this.
  - LOCK #5 footnote needs rewording. Bounded surface; covered in CL-6's may-touch (same `orchestration/SKILL.md` file).
- **Validation**: SC-8.1 + SC-8.2 (Option B verification spec; alternatives excluded).

### Validation strategy (loop-level, revised per Codex P2-F3 + P5-F3)

- **WORK (iter3)**: Leader writes this rawdata draft.
- **EVALUATION (iter3)**: Dual-system (Claude + Codex). **All seven perspectives + Overall** are evaluated by each system (per `evaluation/SKILL.md` "always all seven + Overall; no pruning"). iter2's "selected perspectives" wording was misaligned with the canonical evaluation skill (Codex P2-F3 + P5-F3); iter3 corrects this. Emphasis areas for reviewer attention (without pruning): Consistency (12→11 file routing change; Backlog Deltas may-touch alignment), Scope (CL-2 + CL-4 backlog may-touch additions; CL-6 new deliverable), Specificity (SC-5 per-file bounded checks; SC-6 canonical disposition; SC-8 CL-6 verification), Risk (CL-6 option choice; size-up to 6 deliverables), Witness/P10 (CL-6 mistake-candidate as primary witness; CL-2 exercise witness).
- **MEMORIZATION**: On PASS, write canonical `<worktreePath>/.../ideation/artifacts/` for Planning consumption. **Historical iter-budget note** (superseded): iter3's plan assumed `maxIterations: 3` as the loop cap; post-iter3 EVAL the user authorized a cap raise to 4 (iter4 verification of post-eval manager patches) and then to 5 (iter5 verification of audit-trail patches). The cap raises are recorded in `state.json` `iterBudgetOverride`.

---

## Risk Delta from iter2

iter2 locked 4 ship + 1 close = **5 shipping deliverables**. iter3 locks 5 ship + 1 close = **6 shipping deliverables**. The delta is CL-6 (orchestration row-5/5.5/6 fix).

### Honest sizing (recalculated per Codex P5-F2 from the authoritative may-touch list)

| Metric | iter1 estimate | iter2 estimate | **iter3 estimate** | Delta from iter2 |
|---|---|---|---|---|
| Shipping deliverables | 3 + 1 close | 4 + 1 close | **5 + 1 close** | +1 (CL-6) |
| Estimated executor tasks (Planning's call) | 5–6 | 7–15 | **6–17** (single-task-per-CL: 6; fan-out CL-5: up to 16 + CL-6 = 17) | +1 (CL-6 always 1 task) |
| Authoritative may-touch file count (per Per-Deliverable table) | n/a | undercount (~16 stated, ~21 actual after counting backlog files) | **17 files** (counted from may-touch entries — see breakdown below) | +1 (CL-6 = 1 file edited; mistake-candidate file already exists, no net new) |
| Estimated PR diff lines (order-of-magnitude) | ~300 LOC | ~700–900 LOC | **~800–1000 LOC** (CL-6 = 40–80 LOC per DL-7 = Option B) | +40–80 LOC |
| Iteration budget | iter ≤ 2 | iter ≤ 3 (this is iter3) | iter ≤ 3 (this is the last) | unchanged |

**Authoritative may-touch file count breakdown (17 files):**
- CL-1: 1 backlog file
- CL-2: 1 new skill file (`.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md`) + 1 staged-skill file in session memory + 1 backlog file = 3 entries (the staged file is session-internal, not part of the develop diff; net new on develop = 2)
- CL-3: 1 `mistake/SKILL.md` + 1 backlog file = 2 entries
- CL-4: 1 new design doc + 1 backlog file = 2 entries
- CL-5: 11 skill files + 1 backlog file = 12 entries
- CL-6: 1 `orchestration/SKILL.md` + 1 staged mistake-candidate (already exists; not a new write) = 1 net entry on develop
- Total counting session-staged + develop-shipping files: ~21; total develop-shipping files: ~17.

### Identified risks (carried + new)

- **R-1 (Planning decomposition decision)** — unchanged from iter2: CL-5 as 1 task vs 11 tasks. Recommended 1 task. CL-6 always 1 task (single file, single option choice).
- **R-2 (was: `mistake/SKILL.md` two-edit overlap; iter3: RESOLVED via D-7 revised)** — eliminated; CL-3 owns the file end-to-end.
- **R-3 (DL-1 shallow-lessons trade-off)** — user-accepted. iter3 mitigates with the inline shallow-by-design note in CL-4 (per R5-001 + P6-F2). S-8's pre-recorded response now lives in the design doc body, not only in commit message.
- **R-4 (DL-5 M2 vs M1 substitution drift during execution)** — unchanged; SC-5 per-file bounded check verifies M2 clauses present per file.
- **R-5 (12-skill → 11-skill sweep consistency)** — iter3 update: SC-5 reference-wording spot check (one of 11 acts as canonical; ≥ 7 of 11 must exactly match the substrings) gives Preparation room for minor polish while catching gross drift (per Codex P4-F2 + Claude R5-002).
- **R-6 (context overflow per Bundle B mistake)** — unchanged from iter2. Mitigations: single-task-per-CL preferred; iter cap = 3 (last iter); worktree-absolute paths in every executor brief; no additional backlog item bundling.
- **R-7 (Wrap-up still has to happen for DL-1 to land coherently)** — unchanged.
- **R-8 (NEW for iter3, CL-6 option choice irreversibility — RESOLVED by DL-7)** — Per DL-7 = Option B (locked), the rewritten orchestration row is the canonical procedure for every future worktree-pr session. Option B removes the migration window entirely and is the most one-way-door-friendly choice in steady state. Accepted trade-off: row numbering changes (one-time edit cost in `orchestration/SKILL.md`; bundle-B design doc filenames stay as historical memorials).
- **R-9 (NEW for iter3, CL-6 cross-doc anchor drift — narrowed by DL-7)** — Per DL-7 = Option B (locked), "row 5.5" references in other documents (currently only in `orchestration/SKILL.md` itself and in bundle-B's locked design doc filenames) must not produce stale pointers post-rewrite. The locked bundle-B filenames are historical memorials and are out-of-scope for renaming; the live `orchestration/SKILL.md` is in CL-6's may-touch and gets updated. R-9 risk reduces to: any non-bundle-B file outside CL-6's may-touch that happens to cite "row 5.5" as a live identifier — Preparation's Sub-step C should grep for this and surface any miss.

### What is NOT a risk

- f-risk-01 implementation risk: M2 is docs codification of existing manager behavior. Iron Law 7 verification (SC-5 bounded grep) catches drift.
- Skill template novelty for CL-2: E-1 anchors `interview/templates/project-skill.md`; no ambiguity.
- f-struct-01 verification: SC-1 is a `grep` on a 1-file 3-line edit. Trivial.
- CL-6 file-conflict risk: orchestration/SKILL.md is touched by no other CL. Disjoint surface.

---

## Backlog Deltas (revised per Codex P3-F1 + P3-F2)

The following backlog files change status as a result of Bundle C shipping. **Every status flip below is now authorized by an explicit `files-may-touch` entry on the owning CL** (per D-8 — closes Codex P3-F1).

| Backlog file | Pre-Bundle-C status | Post-Bundle-C status | Owner deliverable | Authorized via CL may-touch? |
|---|---|---|---|---|
| `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` | `status: open` | `status: closed`; `closed_by: 159eb21` added | CL-1 | YES (CL-1 row) |
| `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` | `status: deferred` | `status: closed` post-merge | CL-2 | YES (CL-2 row — NEW per P3-F1) |
| `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` | `status: deferred` | `status: in-progress` (clarified to perpetual-capture-reminder); does NOT close — N≥2 skill-extraction trigger remains pending | CL-3 | YES (CL-3 row) |
| `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` | `status: deferred` | `status: closed` post-merge | CL-4 | YES (CL-4 row — NEW per P3-F1) |
| `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` | `status: open`; `disposition: open` | `status: addressed`; `disposition: addressed`; `closed_by: <merge SHA>`; body appended with `## Resolution` section per SC-6 | CL-5 | YES (CL-5 row) |

**Note revised (per Codex P3-F2)**: the iter2 note about `mistake/SKILL.md` Memory Access Matrix forbidding agent writes to `.gobbi/projects/gobbi/backlogs/` was overbroad. The actual rule (per `mistake/SKILL.md`) governs **project memory** (i.e., `mistakes/` directory and feature memory) — NOT `.gobbi/projects/gobbi/backlogs/` files. **Authorized backlog edits may be committed inside the worktree branch as part of the same PR as the shipped deliverable** (Iron Law 8). The session-staging promotion pipeline is for mistake-candidates → mistakes/ destination, not for backlog file edits. Bundle C's executor edits to backlog files happen inside the worktree on `chore/session-2026-05-24-45388fa9` and ship via the same merge commit; this is consistent with Bundle A + Bundle B precedent (env-var-audit PR #265 + Bundle B PR #268 both included backlog status changes).

---

## Decisions Log

| # | Decision | Status | Source |
|---|---|---|---|
| iter1-LDP-1 | Cluster splits | SUPERSEDED by DL-4 + DL-1 + DL-6 | iter1 § TL;DR |
| iter1-LDP-2 | f-struct-01 close | CONFIRMED by DL-3 | iter1 I-2 |
| iter1-LDP-3 | f-risk-01 defer | OVERRIDDEN by DL-4 | iter1 I-3 |
| iter1-LDP-4 | Theme β β-1 vs β-2 | LOCKED β-1 by DL-1 | iter1 D-5 |
| iter1-LDP-5 | Watchlist resolves via smallest-witness-supports | CONFIRMED | iter1 D-2 |
| iter1-LDP-6 | Feature name | CONFIRMED by DL-2 | iter1 § Scope Contract |
| iter1-LDP-7 | Task count ≤ 5–6 | REVISED twice — iter2 D-6 (≤ 7 or ≤ 15); iter3 D-6 re-revised (≤ 6 or ≤ 17) | iter1 D-6; iter3 R-1 |
| iter1-LDP-8 | Bundle B HANDOFF "emergency stop" framing stale | LEADER-NOTED (Wrap-up) | iter1 I-4 |
| iter2-DL-1 | β-1 — ship Theme β | LOCKED | manager-run AUQ |
| iter2-DL-2 | Feature name | LOCKED | manager-run AUQ |
| iter2-DL-3 | Close f-struct-01 inline | LOCKED | manager-run AUQ |
| iter2-DL-4 | Absorb f-risk-01 | LOCKED | manager-run AUQ |
| iter2-DL-5 | M2 mitigation only | LOCKED | manager-run AUQ |
| iter2-D-7 (original) | CL-3/CL-5 co-touch `mistake/SKILL.md` via single executor task | **SUPERSEDED by D-7 revised (iter3)**: file owned exclusively by CL-3 | iter2 D-7; iter3 P2-F2 + P5-F1 resolution |
| iter3-DL-6 | Add CL-6 (orchestration row-5/5.5/6 fix) | LOCKED | manager-run AUQ post-iter2 |
| iter3-D-7 revised | `mistake/SKILL.md` owned exclusively by CL-3 | LOCKED | iter3 resolution of P2-F2 + P5-F1 |
| iter3-D-8 | Backlog file edits authorized by explicit may-touch | LOCKED | iter3 resolution of P3-F1 |
| iter3-D-9 | CL-6 option = B | **LOCKED via DL-7** (user-confirmed 2026-05-24 post-iter3-draft AUQ) | iter3 reasoning over Options A/B/C; user accepted leader recommendation |

### Memory reads register (iter3 delta — incremental over iter1 + iter2)

| Path | Purpose | Read result |
|---|---|---|
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/rawdata/draft-iter2.md` | iter2 baseline | Read in full |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/evaluation/iter2/claude/*.md` (8 files) | iter2 Claude leg findings | All read in full |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/evaluation/iter2/codex/*.md` (8 files) | iter2 Codex leg findings | All read in full |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` | CL-6 mistake-candidate (3 options A/B/C) | Read in full |
| `.gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-1-worktree-row-5-5.md` | Bundle B row 5.5 decision (rejected "Promote to row 5") | Read in full → I-8 |
| `.gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-2-qualified-git-rule.md` | Qualified absolute-root rule | Read in full |
| `.gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-4-per-iter-session-commit.md` | Per-iter commit cadence — makes CL-6 consequential | Read in full → I-9 |
| `.claude/skills/orchestration/SKILL.md` Step 1 rows 5/5.5/6 + LOCK #5 footnote | CL-6 edit target | Read in full → I-7 |
| `.claude/skills/principles/SKILL.md` | Iron Law load (fresh subagent) | Read in full |
| `.claude/skills/mistake/SKILL.md` | Mistake-skill discipline | Read in full |
| `.claude/skills/ideation/SKILL.md` | Required-sections template + memory-access matrix | Read in full |
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Project rule (only one) | Read; not applicable to this Ideation iter |
| `.gobbi/projects/gobbi/mistakes/` (15 files) | Domain-filter for process/workflow/session-lifecycle/scope-creep/documentation-sync | Reviewed via iter2 carryover + new read for CL-6 (relevant: `executor-mirror-path-vs-worktree-physical-copy.md`, `codex-eval-session-write-path-nested-in-worktree.md` — both touch the worktree-path discipline that CL-6 addresses) |

---

## Findings-Resolution Appendix

Explicit per-finding disposition for the 4 High + 14 Medium + 8 Low evaluator findings across both legs (Claude + Codex). Disposition vocabulary: **addressed-in-iter3** (iter3 text changed to fix); **folded-into-CL-N-verification-anchor** (verification anchor in iter3 picks up the finding); **deferred-with-rationale** (left for Planning / Preparation with stated rationale); **duplicate-of-another-finding** (same root cause as a prior finding); **not-a-real-issue** (evaluator misread; rationale provided).

### High (4 findings)

| Finding | Leg | Perspective | Disposition | How |
|---|---|---|---|---|
| S3-001 / O-001 | Claude | Scope p3 + Overall | **addressed-in-iter3** | CL-2 § In-Scope adds explicit "M2-compliant from creation" requirement; SC-2.2 adds bounded `awk`/`grep` check on the new skill's Path Conventions (or zero-occurrence anywhere if no PC section). TL;DR item 2 updated to reflect this. |
| P3-F1 | Codex | Scope p3 | **addressed-in-iter3** | CL-2 may-touch adds `gobbi-hook-authoring-skill.md`; CL-4 may-touch adds `session-lifecycle-worktree-boundaries-design-doc.md`. D-8 documents the policy. Backlog Deltas table updated to show explicit may-touch authorization column. |
| P2-F2 / P5-F1 | Codex | Consistency p2 + Risk p5 | **addressed-in-iter3** | D-7 revised: `mistake/SKILL.md` owned exclusively by CL-3 (single ownership, no co-touch). Per-Deliverable table CL-5 may-touch no longer lists `mistake/SKILL.md`; CL-5 enumeration is 11 files. CK-4 + CK-4.5 fold both edits into one CL-3 executor task. SC-3.2 verifies the M2 row landed on `mistake/SKILL.md` via the same per-file bounded check used by SC-5. |
| P4-F1 | Codex | Specificity p4 | **addressed-in-iter3** | SC-5 rewritten with per-file bounded `awk`/`grep` on the Path Conventions block of each of the 11 files; explicit negative-check note that out-of-block `$CLAUDE_CODE_SESSION_ID` occurrences are not flagged (e.g., `gobbi/SKILL.md:52` env-health check is unaffected). |

### Medium (14 findings)

| Finding | Leg | Perspective | Disposition | How / Rationale |
|---|---|---|---|---|
| P1-002 | Claude | Project p1 | **deferred-with-rationale** | "No iter1 evaluation files exist" — this is a session-process audit-trail gap, not a defect in iter2 content. iter2's content was correct; iter1 EVAL files genuinely don't exist (iter1 was evaluated as part of the workflow but the per-perspective files were not staged; the manager surfaces this as a separate process deviation for Wrap-up to capture). Not actionable in iter3. |
| C2-001 / P4-002 | Claude | Consistency p2 + Specificity p4 | **addressed-in-iter3** | SC-6 rewritten as the canonical f-risk-01 backlog disposition spec. Both `status:` and `disposition:` fields update to `addressed`; body appended with `## Resolution`. All three formerly-conflicting sections (SC-6, Per-Deliverable CL-5 verification, Backlog Deltas) now reference SC-6 verbatim. |
| P4-001 / P4-F2 | Claude + Codex | Specificity p4 | **addressed-in-iter3** | CL-5 § In-Scope rewritten: "Wording is locked at Ideation, not deferred to Preparation." Canonical replacement string for the `{session-id}` row is given inline. Preparation may polish but MUST preserve the two semantic clauses. SC-5 verifies clauses; reference-wording spot check allows ≤ 4 of 11 to have polished sentence-flow as long as the substrings match. |
| R5-001 / P6-F2 | Claude + Codex | Risk p5 + User Perspective p6 | **addressed-in-iter3** | CL-4 § In-Scope adds inline shallow-by-design note requirement. SC-4.2 verifies the inline note via grep on the design doc body. S-8 updated to reference the inline note. |
| O-001 | Claude | Overall (cross-cutting) | **duplicate-of-S3-001** | Same root cause as S3-001; resolved via S3-001 fix (CL-2 M2-compliant authoring requirement). |
| P1-F1 | Codex | Project p1 | **addressed-in-iter3** | Framed Problem updated: CL-5 is explicitly labeled "user-authorized scope absorption" rather than "fired witness debt that has come due"; CL-1/2/3/4 remain "fired witness debt"; CL-6 is labeled "emergent witness debt (user-reported bug today)". |
| P1-F2 / P7-F1 | Codex | Project p1 + Witness p7 | **addressed-in-iter3** | CL-2 § In-Scope adds explicit exercise witness: every Agent/Task tool call in this session fires `post-tool-use-agents.sh` (PostToolUse hook); session.json agents[] upserts are visible post-session. SC-2.3 verifies via `jq '.agents | length' session.json` non-zero. Backlog trigger "exercised by ≥1 real session" is satisfied by this session itself. |
| P2-F1 | Codex | Consistency p2 | **addressed-in-iter3** | § Scope Contract → § Decisions Locked is rewritten as an exact mirror of the post-AUQ Decisions Locked table (one-line summaries with identical content). Renamed neither; both sections now carry identical DL-1..DL-6 lines. |
| P2-F3 / P5-F3 | Codex | Consistency p2 + Risk p5 | **addressed-in-iter3** | § Validation strategy revised: "all seven perspectives + Overall (no pruning)" replaces iter2's "Perspectives selected ... recommend Consistency + Scope + Risk". Emphasis areas named for reviewer attention without pruning. |
| P3-F2 | Codex | Scope p3 | **addressed-in-iter3** | § Backlog Deltas note revised: clarifies that the "agents never write to backlogs" rule from `mistake/SKILL.md` governs project memory (mistakes/), NOT `.gobbi/projects/gobbi/backlogs/` files. Authorized backlog edits may be committed inside the worktree branch as part of the same PR. |
| P5-F2 | Codex | Risk p5 | **addressed-in-iter3** | Risk Delta § "Honest sizing" recalculated from the authoritative may-touch list; new total = 17 files shipping on develop. Breakdown added. |
| P6-F1 | Codex | User Perspective p6 | **addressed-in-iter3** | § Per-Deliverable Scope-Bound Table now lists every file that ships (including the 5 backlog files). Combined with the Backlog Deltas "Authorized via may-touch?" column, the table is the single source of truth. |
| R5-002 | Claude | Risk p5 | **folded-into-CL-5-verification-anchor** | SC-5 includes a "reference-wording spot check": ≥ 7 of 11 files must have exact substring match with `wrap-up/SKILL.md`; remaining ≤ 4 may differ in sentence-flow only. Catches gross drift; allows Preparation polish. |
| U6-001 | Claude | User Perspective p6 | **addressed-in-iter3** | TL;DR item 5 expanded with parenthetical clarifier on what M2/f-risk-01 means in plain language ("subagents should read session-id from the delegation prompt, not from `$CLAUDE_CODE_SESSION_ID`"). |

### Low (8 findings)

| Finding | Leg | Perspective | Disposition | How / Rationale |
|---|---|---|---|---|
| P1-001 | Claude | Project p1 | **addressed-in-iter3** | CL-3's `files-must-not-touch` column now cross-references the CL-5 row's may-touch enumeration ("see CL-5 row may-touch for the explicit 11 file enumeration") rather than using aggregate language. |
| P1-003 | Claude | Project p1 | **addressed-in-iter3** | SC-5 enumerates the 11 files inline (was 12 in iter2; now 11 after D-7 revised); no `{each-skill}` placeholder remains. |
| S3-002 | Claude | Scope p3 | **folded-into-Per-Deliverable-table** | Out-of-Scope clause on `mistake/SKILL.md` is no longer ambiguous because D-7 revised routes the file to a single CL (CL-3) — the "AND...AND" wording is removed (only CL-3's edits are authorized). |
| W7-001 | Claude | Witness p7 | **addressed-in-iter3** | I-6 reframed: primary witness for CL-5 is f-risk-01 backlog + DL-4/DL-5 user locks; I-6 is corroborating evidence from this session's own delegation-prompt header (verifiable). iter1-leader-prompt cross-check dropped as unverifiable. |
| U6-001 | Claude | User Perspective p6 | **duplicate** | See Medium row — already addressed via TL;DR expansion. |
| R5-002 | Claude | Risk p5 | **duplicate** | See Medium row — folded into SC-5. |
| P4-F3 | Codex | Specificity p4 | **addressed-in-iter3** | SC-2.3 adds `grep -nE 'session-start\.sh\|post-tool-use-agents\.sh'` for explicit per-hook witness citation check. |
| P6-F2 | Codex | User Perspective p6 | **duplicate-of-R5-001** | Already addressed via CL-4 inline shallow-by-design note + SC-4.2 grep. |
| P7-F2 | Codex | Witness p7 | **deferred-with-rationale-to-Planning** | "Add a Planning or Execution verification anchor that checks delegation prompts still pass parent session-id:" — this is a Planning/Preparation verification design choice (verifying that the manager's delegation-prompt template is correct), not an Ideation-scope finding. Ideation locks M2 in the docs; Planning's evaluator catches if a future delegation-prompt template drifts. Recorded as a Planning input via the Wrap-up briefing. |

### Summary

| Severity | Count | Addressed-in-iter3 | Folded-into-verification | Deferred-with-rationale | Duplicate | Not-a-real-issue |
|---|---|---|---|---|---|---|
| High | 4 | 4 | 0 | 0 | 0 | 0 |
| Medium | 14 (Claude 6 + Codex 8) | 11 | 1 | 1 | 1 | 0 |
| Low | 8 (Claude 5 + Codex 3) | 4 | 0 | 1 | 3 | 0 |
| **Total** | **26** | **19** | **1** | **2** | **4** | **0** |

(Note: the Medium row counts O-001 as a duplicate of S3-001; the High row counts both S3-001 and O-001 as a single "addressed" item under S3-001/O-001 in the High table. Net High count is 4 distinct findings as enumerated in the brief; the O-001 disposition row in the Medium table is consolidation accounting.)

---

## Open Questions for the User

**RESOLVED — no open questions remain.**

**DL-7 (post-iter3-draft, user-locked via AskUserQuestion 2026-05-24)**: CL-6 row-order fix = **Option B — promote row 5.5 to before row 5** (new row 5 = worktree create; new row 5.5 = state.json init; new row 6 = session.json init). User accepted the leader's recommendation per D-9 reasoning. Planning must adopt Option B's row layout; CL-6 Preparation produces the exact text rewrite of rows 5/5.5/6 + the LOCK #5 footnote wording per Option B.

The original Q + A/B/C/D analysis is preserved below for audit:

> **Q: CL-6 row-order fix — pick Option A, B, or C?** The leader recommended **Option B (promote row 5.5 to before row 5)** per D-9 reasoning. **User answer: Option B (locked as DL-7).**
>
> - **Option A** — keep current 5 → 5.5 → 6 order; state.json + settings.json write to main tree at row 5; the worktree is created at 5.5; migrate into worktree at end of 5.5; session.json writes inside worktree at row 6.
>   - Pro: minimal row-numbering change; preserves Bundle B's D-1 explicit "preserve existing semantic where state.json is initialized first" rationale.
>   - Con: introduces a migration sub-step with a crash window; the existing 3-state idempotency machine at row 5.5 compounds with the new migration semantic.
> - **Option B (Recommended)** — promote row 5.5 to before row 5 (renumber: new row 5 = worktree create, new row 5.5 = state.json init, new row 6 = session.json init). Worktree-pr writes inside the worktree from the start; direct-mode skips the new row 5 (LOCK #5 escape hatch reworded with same intent).
>   - Pro: most robust against partial failure (S-10); no migration window; smallest blast radius in steady state (only `orchestration/SKILL.md` reordering — no other live skill references "row 5.5" as a row identifier); most consistent with bundle-B D-2 + D-4 invariants ("everything session-related inside `$worktreePath`").
>   - Con: row numbering changes; LOCK #5 footnote needs minor rewording (covered in CL-6's may-touch); bundle-B's D-1 historical decision to reject this option was made BEFORE the misplacement bug was witnessed (per I-8).
> - **Option C** — same as A but with an explicit `tmp/` staging dir between row 5 (write to tmp) and row 5.5 (migrate).
>   - Pro: more explicit about the migration step; arguably easier to reason about than A's implicit migration.
>   - Con: same crash window as A; strictly more I/O; introduces a `tmp/` location that needs cleanup.

**Resolution (post-iter3 AUQ, 2026-05-24)**: User picked **Option B** → DL-7 locked. CL-6's Preparation produces the exact text rewrite of rows 5/5.5/6 + LOCK #5 footnote per Option B's row-promotion semantics. Option D (defer CL-6 entirely) was offered as an escape and not selected.

---

## Deferred (recap)

- M1 / M3 mitigation paths for f-risk-01 — NOT chosen per DL-5; recorded in `f-risk-01-subagent-ccsi-semantics.md` body as "alternatives considered".
- Skill-extraction trigger for hooks-domain mistakes (N≥2 threshold not yet met) — remains deferred; CL-3's backlog update notes the trigger.
- Smoke-test gate T1.h — Memorization-scope; Wrap-up handles.
- Bundle B HANDOFF staleness — Wrap-up note; not a Bundle C deliverable.
- "Lessons learned" depth amendment for `session-lifecycle-worktree-boundaries.md` — DL-1 accepts shallow-by-design; future sessions may amend per R-7.
- iter1 evaluation-files audit-trail gap (Claude P1-002) — session-process deviation; Wrap-up captures; not a Bundle C deliverable.
- Planning/Execution delegation-prompt verification (Codex P7-F2) — Planning scope; surfaced as Planning input via Wrap-up briefing.
- Implementing the chosen CL-6 row-order rewrite text — Preparation/Planning scope; Ideation locks option + citation requirement only.
- Updating `git/SKILL.md` itself, `delegation/SKILL.md`, or any skill outside the 11 + `mistake/SKILL.md` + `orchestration/SKILL.md` — out of Bundle C; Iron Law 4.

---

**End of draft-iter3.md**
