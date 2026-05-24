# Draft Idea — Bundle C foundation follow-ups — iter2

**Session**: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
**Phase**: Ideation iter2 — consolidation of iter1 + 5 user-locked decisions (DL-1..DL-5) returned via manager-run AskUserQuestion
**Author**: leader (PI/PM)
**Status**: CONSOLIDATED — no pending decisions; ready for Ideation EVALUATION sub-phase
**Supersedes**: `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter1.md`

---

## TL;DR

Bundle C ships **5 deliverables under feature `session-foundations-bundle-c`** on branch `chore/session-2026-05-24-45388fa9`:

1. **CL-1 — Close f-struct-01 inline.** 3-line frontmatter edit on `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` (`status: open` → `closed`, `closed_by: 159eb21`, plus closure note citing `session-start.sh:73-77`).
2. **CL-2 — Stage + promote `gobbi-hook-authoring` project skill.** Author at `sessions/.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` per `interview/templates/project-skill.md`; promote to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via `preparation/SKILL.md` narrow-exception. Sourced from N=2 in-tree hook witnesses (`session-start.sh` + `post-tool-use-agents.sh`).
3. **CL-3 — Hooks-domain mistakes resolution.** Small edit on `mistake/SKILL.md` adding `hooks` to the documented domain-tag examples; backlog-file status update on `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` clarifying perpetual-capture semantics + N≥2 skill-extraction trigger.
4. **CL-4 — Author Theme β design doc.** Write `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` using `memorization/templates/design.md` per the backlog § "Suggested approach" 5-section shape. **User accepted the trade-off (per DL-1 lock) that the "lessons learned" section may be shallow because this session is the first true worktree-pr end-to-end demonstrator (self-counted as N=2 alongside Bundle B as N=1).**
5. **CL-5 — f-risk-01 M2 docs sweep across 12 skills.** Codify the current de-facto practice of delegation-prompt session-id passing. Each of the 12 affected skills (mistake, wrap-up, research, orchestration/workflow/evaluation, planning, execution, ideation, memorization, interview, evaluation, preparation, gobbi) is updated so its `{session-id}` path-conventions snippet reads "from the delegation prompt's `session-id:` field" and **explicitly says** "do NOT read `$CLAUDE_CODE_SESSION_ID` for this value (subagent context returns the subagent's own UUID, not the parent session's)." M1 (session.json.sessionId source) and M3 (separate subagent sessions) are explicitly NOT chosen.

Bundle C is materially **larger than iter1's recommendation** (iter1 proposed 3 ship + 1 close + 1 defer; iter2 ships 4 plus 1 close, absorbing the f-risk-01 work iter1 wanted to defer). Risk section quantifies the size honestly. Planning will decide whether CL-5 ships as one task (whole-sweep) or 12 tasks (one-per-skill) — see § Risk delta.

---

## Decisions Locked (post-AUQ — user-binding)

These 5 decisions came from a manager-run AskUserQuestion round between iter1 and iter2. Verbatim user answers are recorded below; each lock is binding for the remainder of this Ideation loop.

| DL # | Question | Locked answer | iter1 leader recommendation | Notes |
|---|---|---|---|---|
| DL-1 | Theme β timing | **β-1: Ship this session; self-count as N=2.** User accepted the trade-off that the lessons-learned section may be shallow because Wrap-up has not run yet. | β-2 (defer to next session for empirical N=2) | User diverged from leader. Lock supersedes LDP-4. |
| DL-2 | Bundle feature name | **`session-foundations-bundle-c`** | Same (`session-foundations-bundle-c`) | Confirms iter1 LDP-6. |
| DL-3 | f-struct-01 disposition | **Close inline in Bundle C PR.** 3-line frontmatter edit + closure note citing `session-start.sh:73-77` in env-var-audit PR #265. One executor task. | Same (close inline) | Confirms iter1 LDP-2 / D-3. |
| DL-4 | f-risk-01 disposition | **Absorb into Bundle C** (user confirmed via USER CHALLENGE follow-up). | Defer to its own dedicated Ideation per the backlog's own recommendation | User diverged from leader. Lock supersedes LDP-3. |
| DL-5 | f-risk-01 mitigation choice | **M2 — Codify delegation-prompt passing across the 12 affected skills.** Each of mistake, wrap-up, research, orchestration/workflow/evaluation, planning, execution, ideation, memorization, interview, evaluation, preparation, gobbi reads `{session-id}` from the delegation prompt's `session-id:` field; explicitly says "do NOT read `$CLAUDE_CODE_SESSION_ID` for this value (subagent context returns the subagent's own UUID, not the parent session's)." M1 and M3 explicitly NOT chosen. | n/a (deferral was iter1's leader recommendation) | New decision; no iter1 precedent. M2 codifies current de-facto practice. |

The three iter1 DL-1/DL-2/DL-3 (cluster splits / f-struct-01 inline / mistake/SKILL.md small edit) are preserved unchanged where compatible — see DL-2/DL-3 above and § Implementation Checklist below for the watchlist resolution carryover.

---

## Scope Contract (locked)

```yaml
artifact_type: scope-contract
feature: session-foundations-bundle-c
goal: Land 5 cohering follow-ups — gobbi-hook-authoring skill (stage + promote), hooks-domain mistake/SKILL.md edit + backlog status update, session-lifecycle worktree-boundaries design doc, f-struct-01 inline close, and f-risk-01 M2 delegation-prompt-passing docs sweep across 12 skills.
created-by: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
created-at: 2026-05-24T15:00:00Z
supersedes: sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter1.md
```

### In-Scope (5 deliverables)

1. **CL-1 — Close `f-struct-01-jq-sh-env-passthrough` inline.**
   - Witness: `.claude/hooks/session-start.sh:73-77` (`printf 'export %s=%q\n'` passthrough re-export) already implements the backlog's Option A. Commit `159eb21`, env-var-audit PR #265, merged 2026-05-22.
   - Action: edit `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` frontmatter `status: open` → `status: closed`, add `closed_by: 159eb21`, append a one-line closure note: "Closed — fix already shipped in `session-start.sh` lines 73-77 via env-var-audit PR #265 (commit `159eb21`); discovered during Bundle C ideation 2026-05-24."
   - Scope size: 3 frontmatter/body lines on 1 file. Smallest deliverable in the bundle; sequenced first because it gates nothing else and produces the fastest verifiable win.

2. **CL-2 — Stage + promote `gobbi-hook-authoring` project skill.**
   - Witness: N=2 in-tree hooks satisfy the backlog's lift trigger. `.claude/hooks/session-start.sh` (79 lines; commit `159eb21`) + `.claude/hooks/post-tool-use-agents.sh` (251 lines; in Bundle B PR #268 `dfb7d6d`). Both encode strict-mode + ENV_FILE guard + jq quoting + REQUIRED/OPTIONAL/PASSTHROUGH partitioning; `post-tool-use-agents.sh` additionally introduces flock + dual-event registration + two-tier extraction + tool_use_id correlation.
   - Action: per `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` § "Suggested approach" — stamp `sessions/.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` using `interview/templates/project-skill.md`; promote to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via the `preparation/SKILL.md` narrow-exception (Bundle-B-shipped flow).
   - Mistakes / anti-rationalizations section stays sparse (zero hooks-domain mistakes exist on develop today). Section grows substantive at N≥2 captures — separate future trigger.

3. **CL-3 — Hooks-domain mistakes resolution (mistake/SKILL.md edit + backlog status update).**
   - Witness: `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` § "Suggested approach" tail bullet ("Add a `hooks` domain tag convention to `mistake/SKILL.md`") + § "Why deferred" ("ad-hoc per execution session — no large pre-meditated work; reminder, not a workstream").
   - Action: (a) edit `mistake/SKILL.md` to add `hooks` to its documented domain-tag examples list (single-line scope per iter1 DL-3); (b) update the backlog file's status to clarify perpetual-capture-reminder semantics and that skill-extraction triggers at N≥2 captured hooks-domain mistakes.
   - Bound: no new artifact (no `watchlist.md` file); no speculative "anticipated pitfalls" listing — Iron Law 10 forbids it (zero hooks-domain witnesses exist).

4. **CL-4 — Theme β: `session-lifecycle-worktree-boundaries.md` design doc.**
   - Witness: per `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` § "When to pick up" — "After T1 ships AND N=2 sessions have exercised the worktree-first pattern end-to-end". T1 shipped at `dfb7d6d`. User locked DL-1 = **β-1**: this session self-counts as N=2 alongside Bundle B (N=1, post-merge in develop).
   - Action: write `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` using `memorization/templates/design.md`, per the backlog § "Suggested approach" 5-section shape (problem / approach / surfaces / validation / lessons).
   - **Trade-off recorded** (per DL-1): the "lessons learned" section will draw from Bundle B's process-mistake captures + this session's in-flight worktree-pr experience. The user explicitly accepted that this section may be shallow because Wrap-up has not run yet. iter1's leader recommendation was β-2 (defer); user overrode in favor of β-1. No further re-litigation — this lock is binding for iter2.

5. **CL-5 — f-risk-01 M2 docs sweep across 12 skills.**
   - Witness: `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` (read in full) — § "Candidate mitigations" M2 reads: *"Manager always passes parent-session-id explicitly in subagent delegation prompts (current de facto practice, documented). Update skills to say 'use `{session-id}` from the delegation prompt's `session-id:` field; do NOT read `$CLAUDE_CODE_SESSION_ID` for this value.' Advantage: minimal change; codifies current practice. Disadvantage: every delegation prompt must be correct; skills become delegation-prompt-dependent rather than self-contained."*
   - Action: across each of the 12 affected skills (`mistake/SKILL.md`, `wrap-up/SKILL.md`, `research/SKILL.md`, `orchestration/workflow/evaluation.md`, `planning/SKILL.md`, `execution/SKILL.md`, `ideation/SKILL.md`, `memorization/SKILL.md`, `interview/SKILL.md`, `evaluation/SKILL.md`, `preparation/SKILL.md`, `gobbi/SKILL.md`), update the Path Conventions / `{session-id}` row to read from the delegation prompt's `session-id:` field and explicitly disclaim `$CLAUDE_CODE_SESSION_ID`.
   - Scope size: 12 files × roughly 1 paragraph each. Largest deliverable in the bundle. **The exact substitution wording is Preparation/Planning scope, not Ideation scope** — Ideation locks the direction (M2 codification); Preparation produces the substitution string + the per-file Path Conventions table verification anchors; Planning decides whether to ship as 1 task or 12.

### Out-of-Scope (do not absorb)

- Implementation of any 3rd hook (would change the N=2 witness premise for CL-2).
- M1 or M3 mitigation paths for f-risk-01 — DL-5 locks M2; M1 and M3 are explicitly rejected for this bundle.
- Re-litigating DL-1 (β-1 ship-this-session) — user-locked even though iter1 leader recommended β-2. Iter2 EVALUATION must not surface this as an open question.
- Refactoring `session-start.sh` or `post-tool-use-agents.sh` — these are inputs (witnesses) to CL-2, not deliverables.
- Editing `mistake/SKILL.md` beyond CL-3's domain-tag list change AND beyond CL-5's `{session-id}`-source paragraph change. Anything else is out.
- Smoke-test gate T1.h work — orchestration row 5.5 ships in develop; the smoke gate is Memorization-scope, not Ideation. Flag in Wrap-up briefing.
- Bundling additional backlog items (e.g., `normalize-path-conventions-h3`, `item-1-2-broader-delegation-contract-verifier`) — none has a fired trigger; Iron Law 10.

### Decisions Locked (Scope Contract enumeration; mirror of § "Decisions Locked (post-AUQ)" above for the canonical schema)

- **DL-1 (β-1, ship Theme β this session, self-count N=2)**: rationale — user authority on workflow cadence (Iron Law 9); shallow-lessons trade-off accepted.
- **DL-2 (feature name = `session-foundations-bundle-c`)**: rationale — covers all 5 deliverables; matches iter1 leader proposal.
- **DL-3 (close f-struct-01 inline)**: rationale — fix already shipped in `159eb21`; docs-sync via Iron Law 8.
- **DL-4 (absorb f-risk-01 into Bundle C)**: rationale — user diverged from iter1 leader's defer; user has authority on scope-vs-cadence; M2 chosen as the codification path keeps scope sane.
- **DL-5 (M2 mitigation only; not M1 or M3)**: rationale — minimal change, codifies current de-facto practice, no `session.json` I/O step required, no multi-session-directory redesign.

### Success Criteria

- **SC-1 (CL-1)**: `git show` on the Bundle C merge commit includes `f-struct-01-jq-sh-env-passthrough.md` with `status: closed` and `closed_by: 159eb21`. Grep: `grep -E '^status:' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` returns `status: closed`.
- **SC-2 (CL-2)**: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` exists on develop post-merge; structure conforms to `interview/templates/project-skill.md` (frontmatter + Core Principles + Procedures + Constraints + Output paths sections present); body sources cite both `session-start.sh` and `post-tool-use-agents.sh` by path.
- **SC-3 (CL-3)**: `grep -n 'hooks' .claude/skills/mistake/SKILL.md` shows `hooks` listed in the domain-tag examples; `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` status field clarifies perpetual-capture-reminder + N≥2 skill-extraction trigger.
- **SC-4 (CL-4)**: `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` exists on develop post-merge; structure conforms to `memorization/templates/design.md`; body has all 5 sections (problem / approach / surfaces / validation / lessons) per the backlog § "Suggested approach". Lessons section is non-empty (depth not graded — DL-1 accepts shallow).
- **SC-5 (CL-5)**: across all 12 affected skill files, `grep -nE 'session-id.*delegation prompt' {each-skill}` returns a hit on the Path Conventions section, AND `grep -nE 'do NOT read \$CLAUDE_CODE_SESSION_ID|do not read \$CLAUDE_CODE_SESSION_ID' {each-skill}` returns a hit. Spot-check: at least one of the 12 explicitly references the subagent-UUID failure mode (e.g., "(subagent context returns the subagent's own UUID, not the parent session's)") so the rationale survives in-doc.
- **SC-6 (bundle-wide)**: PR description references the witness per Iron Law 10 for each of CL-1..CL-5; backlog file `f-risk-01-subagent-ccsi-semantics.md` is **updated**, not closed (M2 codifies the doc; the underlying risk semantics decision-record stays open as a project memory of the M1/M3 alternatives that were considered and not chosen). Recommended: update `disposition: open` → `disposition: addressed` and add a closure note pointing at the 12-skill commits + DL-5.
- **SC-7 (bundle-wide)**: All 5 deliverables land in the same PR on `chore/session-2026-05-24-45388fa9`; Iron Law 8 satisfied (docs ship with implementation).

### Deferred

- M1 / M3 mitigation paths for f-risk-01 — explicitly NOT chosen per DL-5; record in `f-risk-01-subagent-ccsi-semantics.md` body as "alternatives considered" so the rationale survives.
- Skill-extraction trigger for hooks-domain mistakes (N≥2 threshold not yet met) — remains deferred regardless of Bundle C outcome; CL-3's backlog status update notes the trigger.
- Smoke-test gate T1.h (orchestration row 5.5 worktree creation verification) — Memorization-scope; this session's Wrap-up handles.
- Bundle B HANDOFF staleness (per iter1 I-4) — record in this session's Wrap-up briefing; not a Bundle C deliverable.

---

## Per-Deliverable Scope-Bound Table

One row per deliverable. `files-may-touch` is the **allowed** set; `files-must-not-touch` is the executor brief's denylist; the verification anchor is the concrete check that proves the deliverable shipped.

| CL # | Deliverable | Files-may-touch | Files-must-not-touch | Verification anchor |
|---|---|---|---|---|
| CL-1 | Close f-struct-01 inline | `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` (only) | `.claude/hooks/session-start.sh` (the witness — read only); any other backlog file; `.gobbi/projects/gobbi/skills/**` | `grep -E '^status: closed' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` returns 1 line; `closed_by: 159eb21` present in frontmatter; closure-note line cites `session-start.sh:73-77` |
| CL-2 | Stage + promote `gobbi-hook-authoring` skill | `sessions/2026-05-24-45388fa9-.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md`; `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` | All 12 f-risk-01 affected skills; `.claude/hooks/**`; `mistake/SKILL.md` (CL-3 owns it) | `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` exists; `head -10` shows YAML frontmatter with `name: gobbi-hook-authoring`; body has Core Principles + Procedures + Constraints + Output paths sections (grep section headers) |
| CL-3 | mistake/SKILL.md hooks-domain edit + watchlist backlog status update | `.claude/skills/mistake/SKILL.md` (domain-tag list line only); `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` (status + clarifier) | `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` (CL-2 owns it); any other skill from the f-risk-01 12-list (CL-5 owns those); any other backlog file | `grep -E 'hooks' .claude/skills/mistake/SKILL.md` shows `hooks` in domain examples; backlog file body cites "perpetual-capture-reminder" semantics + N≥2 trigger |
| CL-4 | Theme β design doc | `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` (new file) | Any session.json file; any backlog file other than the design-doc backlog (read-only); any of the 12 f-risk-01 skills | File exists post-merge; grep section headers shows all 5 sections (problem / approach / surfaces / validation / lessons); body links to commit `dfb7d6d` (T1 witness) |
| CL-5 | f-risk-01 M2 docs sweep across 12 skills + backlog disposition update | `.claude/skills/mistake/SKILL.md`, `.claude/skills/wrap-up/SKILL.md`, `.claude/skills/research/SKILL.md`, `.claude/skills/orchestration/workflow/evaluation.md`, `.claude/skills/planning/SKILL.md`, `.claude/skills/execution/SKILL.md`, `.claude/skills/ideation/SKILL.md`, `.claude/skills/memorization/SKILL.md`, `.claude/skills/interview/SKILL.md`, `.claude/skills/evaluation/SKILL.md`, `.claude/skills/preparation/SKILL.md`, `.claude/skills/gobbi/SKILL.md`; `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` | Any other skill file; CL-3's `mistake/SKILL.md` domain-tag line (CL-3 owns the same file but a different line — coordination risk; see § Risk delta); CL-2's `gobbi-hook-authoring/SKILL.md` | All 12 files: `grep -nE 'session-id.*delegation prompt' {file}` hits; all 12 files: `grep -nE '\$CLAUDE_CODE_SESSION_ID' {file}` in the Path Conventions section shows a "do NOT" disclaimer adjacent; backlog file `disposition: addressed` (or equivalent) and points to the 12-skill commits |

**Coordination risk**: CL-3 and CL-5 both touch `.claude/skills/mistake/SKILL.md`. CL-3 edits the domain-tag list (probably § "Output paths" or wherever the domain examples live); CL-5 edits the `{session-id}` Path Conventions row. These are different sections of the same file. Planning must serialize the two edits OR scope them precisely enough that a single executor task handles both `mistake/SKILL.md` lines (recommended — one task touches mistake/SKILL.md and applies both edits as a single coherent change). Flag for Planning.

---

## Framed Problem (carried from iter1 § Framed Problem, with delta)

**Root cause** — unchanged from iter1: Bundle B (PR #268, commit `dfb7d6d`, merged 2026-05-23) landed the worktree-first + agents[] hooks foundation but deferred follow-up artifacts to backlogs. After Bundle B's merge, the deferral triggers have fired for the items in the original 5-candidate list. **iter2 delta**: the user's DL-4 lock absorbs f-risk-01 (iter1 wanted deferred), so the root cause is reframed slightly — "deferred-witness debt that has come due" applies to all 5 items, not 3, because the user is treating Bundle C as the consolidation point.

Evidence (from iter1 + DL-5 evidence load):
- `git log --oneline --since=2026-05-21 -- .claude/ .gobbi/projects/gobbi/` shows `dfb7d6d` (Bundle B) + `7c0a6d0` (Bundle A) + `159eb21` (env-var-audit) merged.
- `wc -l .claude/hooks/{session-start.sh,post-tool-use-agents.sh}` = 79 + 251 lines (N=2 witnesses for CL-2).
- `.gobbi/projects/gobbi/mistakes/` listing: 15 files, zero `domain: hooks` (sparse-by-design for CL-2's "Mistakes / anti-rationalizations" section).
- `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` § "Candidate mitigations" — M2 wording loaded verbatim into CL-5.
- Across the 12 affected skills, `mistake/SKILL.md:129` and `research/SKILL.md:145` continue to cite `$CLAUDE_CODE_SESSION_ID` literally (iter1 I-3 spot-check still holds for iter2).

**Impact** — unchanged from iter1 with one delta: the f-risk-01 doc-level risk now resolves this session (CL-5), so the "future hook author / future session-lifecycle reader / future skill reader following docs literally" persona set is fully covered by Bundle C rather than partially.

**Success criteria** — see § Scope Contract → § Success Criteria above (SC-1 through SC-7).

**Prior attempts** — unchanged from iter1.

**Counterfactual / steel-man (iter2 delta)** — iter1's steel-man warned against over-bundling and motivated descope to 3 items. The user's DL-4 + DL-5 override that descope rationale because the user is consciously trading bundle size for closing-the-loop in one session. The steel-man is acknowledged AND overridden by user authority (Iron Law 9 — judged from user's POV; this is exactly the kind of cadence-vs-scope decision that belongs to the user). Bundle C's risk profile is materially larger because of the override — see § Risk delta below for honest sizing.

**Re-framing conclusion** — unchanged: literal ask is the right framing; SCOPE shifted upward per user authority.

---

## Research Insights (carried from iter1; one new insight for CL-5)

### Internal Insights

**I-1 — N=2 hook witnesses exist on develop** — unchanged from iter1. Anchors CL-2.

**I-2 — `f-struct-01`'s suggested fix is present in shipped code** — unchanged from iter1. Anchors CL-1.

**I-3 — `f-risk-01`'s doc-level risk persists post-Bundles-A+B** — unchanged from iter1. Anchors CL-5.

**I-4 — Bundle B's HANDOFF claims "emergency stop" but the merged PR shipped all 10 tasks** — unchanged from iter1; informs CL-4's design doc surfaces. Flagged for Wrap-up.

**I-5 — Project mistakes show recent post-Bundle-B captures around worktree edits** — unchanged from iter1. Constrains Planning's task-count target.

**I-6 (NEW for iter2) — Current de-facto delegation-prompt pattern already passes parent session-id explicitly**
- **Source**: this iter2 leader's own delegation prompt header (the prompt that produced this artifact) reads `session-id: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f` — parent session's UUID, not the subagent's. Cross-check: the iter1 leader's prompt (per session.json `workflow.ideation.iterations[0]` in session memory) also used parent-anchored paths in its `ARTIFACT:` line.
- **Insight**: M2 is purely a documentation-codification of the manager's existing behavior. No new orchestration logic is required for CL-5; the executor brief is paragraph-level edits, not behavioral redesign. Confirms DL-5's rationale ("minimal change; codifies current practice").
- **Why**: Sizes CL-5 honestly. The work is 12 paragraph-edits, not a 12-skill semantics overhaul. Planning should treat it as a docs-sweep, not a feature.

### External Insights

**E-1 — Anthropic's published skill-authoring guidance for Claude Code** — unchanged from iter1. Anchors CL-2 template choice.

**E-2 — `printf '%q'` is Bash-specific** — unchanged from iter1. Direct input to CL-2's skill body's "Strict-mode preamble" + "jq quoting" sections.

(No new external insight is needed for CL-5; M2 is purely an internal documentation harmonization. External research deliberately bounded per `research/SKILL.md` "Insights, not link dumps".)

---

## Scenarios

**S-1 (golden, CL-2)** — A future contributor adds a third hook. They load the new `gobbi-hook-authoring` project skill and emit a hook that satisfies the pattern stack without reinventing it.

**S-2 (golden, CL-4)** — A new contributor asks "where do session writes go relative to worktree boundaries?" They read `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` and get the answer in one place.

**S-3 (golden, CL-5)** — A future agent (any role) reading any of the 12 affected skills' Path Conventions section sees the new wording — "from the delegation prompt's `session-id:` field; do NOT read `$CLAUDE_CODE_SESSION_ID`" — and constructs subagent-safe paths without re-discovering the subagent-UUID failure mode.

**S-4 (edge, CL-3)** — The `mistake/SKILL.md` domain-tag list edit and CL-5's `{session-id}` Path Conventions edit hit the same file. The executor must hold both edits as a single coherent change to the file (recommended) or sequence them via two passes (acceptable but coordination-heavier).

**S-5 (failure, scope-drift)** — During Bundle C execution, an executor sees one of the 12 skills' Path Conventions section and wants to "improve consistency" by reformatting unrelated rows. This violates Iron Law 4 + Iron Law 10. Executor briefs for CL-5 MUST scope to the single `{session-id}` row in each file's Path Conventions table; everything else is read-only.

**S-6 (failure, M2 mis-application)** — During CL-5 execution, an executor implements the M1 path (cite `session.json.sessionId`) on one or two skills because that wording "feels cleaner". This violates DL-5 (M2 only; M1 explicitly rejected). Evaluators must flag any M1-shaped text as a scope violation; Planning's verification anchors per skill must catch the substitution literally.

**S-7 (adversarial, witness staleness — CL-2)** — A reviewer challenges the gobbi-hook-authoring skill's "two-tier extraction" pattern, citing that only `post-tool-use-agents.sh` uses it. Response: skill body labels two-tier extraction as a `post-tool-use-agents.sh`-specific pattern in a "Patterns by event type" section. (Unchanged from iter1 S-6.)

**S-8 (adversarial, DL-1 shallow-lessons — CL-4)** — A future reader challenges the design doc's "lessons" section for being thin. Pre-recorded response (per DL-1 lock): the user explicitly accepted this trade-off; the lessons section will deepen via a future amendment after subsequent worktree-pr sessions accumulate. The design doc's commit message should include a "lessons-section-depth: shallow-by-design-per-DL-1" tag so this trade-off is searchable.

---

## Implementation Checklist (anchored)

Per `ideation/SKILL.md` Sub-step D-2.

- **CK-1 (→ CL-1)**: Edit `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` frontmatter + append closure note citing `session-start.sh:73-77`. Anchored: I-2, DL-3.
- **CK-2 (→ CL-2 stage)**: Stamp `sessions/.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` using `interview/templates/project-skill.md`; body sections per backlog § "Suggested approach". Anchored: I-1, E-1, E-2.
- **CK-3 (→ CL-2 promote)**: Promote staged skill to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via `preparation/SKILL.md` narrow-exception. Anchored: I-1, I-5.
- **CK-4 (→ CL-3, edit)**: Edit `mistake/SKILL.md` to add `hooks` to the documented domain-tag examples list (single-line). Anchored: iter1 DL-3 + backlog § "Suggested approach" tail bullet.
- **CK-5 (→ CL-3, status update)**: Update `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` status field to clarify perpetual-capture-reminder semantics + skill-extraction trigger condition. Anchored: backlog § "Why deferred".
- **CK-6 (→ CL-4)**: Write `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` using `memorization/templates/design.md`, per backlog § "Suggested approach" 5-section shape. Anchored: I-4 + backlog file's own structure; DL-1.
- **CK-7 (→ CL-5 docs sweep)**: For each of the 12 affected skills, update the `{session-id}` Path Conventions row to "from the delegation prompt's `session-id:` field" with an explicit "do NOT read `$CLAUDE_CODE_SESSION_ID` for this value (subagent context returns the subagent's own UUID, not the parent session's)" disclaimer. Anchored: I-3, I-6, DL-5 (M2 verbatim from backlog § Candidate mitigations).
- **CK-8 (→ CL-5 backlog update)**: Update `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` disposition + add closure note pointing to the 12-skill commits + record that M1/M3 were considered and not chosen. Anchored: DL-4, DL-5.
- **CK-9 (→ bundle-wide)**: PR description cites the witness for each deliverable per Iron Law 10. Anchored: all of the above.

---

## Design (directional)

Carry-over from iter1 with delta; iter2 adds D-7.

**D-1 — Skill body sourcing pattern** — unchanged from iter1; anchors CL-2.

**D-2 — Watchlist resolution shape (smallest-witness-supports)** — unchanged from iter1; anchors CL-3.

**D-3 — f-struct-01 close-in-PR-with-Bundle-C** — unchanged from iter1; anchors CL-1.

**D-4 (REVISED for iter2) — f-risk-01 absorption with M2 mitigation**
- **Decision**: f-risk-01 lands in Bundle C as CL-5; M2 is the chosen mitigation (DL-5). The 12 affected skills receive a paragraph-level Path Conventions update; the backlog file's disposition flips from `open` to `addressed` with M1/M3 recorded as alternatives-considered.
- **Rationale**: Anchored to I-3 (risk persists), I-6 (M2 codifies de-facto practice), DL-4 (user-locked absorption), DL-5 (M2 locked).
- **Validation**: SC-5 + SC-6.

**D-5 (REVISED for iter2) — Theme β shipped this session per DL-1 (β-1)**
- **Decision**: Bundle C ships the Theme β design doc this session, self-counting as N=2 alongside Bundle B (N=1, post-merge in develop).
- **Rationale**: User authority on workflow cadence (Iron Law 9); DL-1 lock. iter1 leader recommended β-2; user overrode.
- **Validation**: SC-4; lessons-section depth not graded (DL-1 accepts shallow).

**D-6 — Task count cap from Bundle B Wrap-up mistake** — REVISED upward for iter2.
- **Decision (revised)**: Bundle C's task count exceeds iter1's ≤ 5 cap because CL-5 alone may decompose into 12 per-skill tasks. Acceptable upper bound for this Planning loop: ≤ 15 implementation tasks if CL-5 decomposes per-skill, or ≤ 7 if CL-5 ships as a single docs-sweep task. Planning decides per § Risk delta.
- **Rationale**: I-5 (Bundle B's process-domain mistake recommends ≤ 8 plan tasks); CL-5's natural decomposition pushes against this ceiling. The de-risking move is to treat CL-5 as a single docs-sweep task (one executor brief, 12 file edits in one logical pass) rather than 12 separate tasks. This keeps the bundle within Bundle B Wrap-up's discipline.
- **Validation**: Planning iter passes evaluation; no mid-Execution context-pressure escalations (per `manager-context-overflow-with-large-bundle.md`).

**D-7 (NEW for iter2) — CL-3 and CL-5 coordinate on `mistake/SKILL.md` via single-executor-task scoping**
- **Decision**: The two edits to `mistake/SKILL.md` (CL-3's domain-tag list line + CL-5's `{session-id}` Path Conventions row) ship as a single executor task that loads the file, applies both edits in one pass, and produces a single commit on `chore/session-2026-05-24-45388fa9`.
- **Rationale**: § Per-Deliverable Scope-Bound Table flags the file-overlap; Iron Law 11 (no metric-gaming) discourages a fake-split where two tasks each edit a different paragraph of the same file. Single task = one file load, one verification, fewer race conditions.
- **Validation**: Planning produces exactly one task with `files-may-touch: [.claude/skills/mistake/SKILL.md]` that covers both edits; commit body cites both DL-3 and DL-5.

### Validation strategy (loop-level)

- **WORK (iter2)**: Leader writes this rawdata draft; Sub-step B WORK staging (backlogs deltas section) records the resulting backlog file status changes.
- **EVALUATION**: Dual-system (Claude + Codex) per `evaluation/SKILL.md`. Perspectives selected per `orchestration/workflow/evaluation.md` — Project + Overall always; recommend Consistency (12-skill sweep needs consistency check) + Scope (bundle materially larger than iter1 — scope-creep check) + Risk (DL-1 shallow-lessons + DL-4 absorption trade-off).
- **MEMORIZATION**: On PASS, write canonical `artifacts/` for Planning consumption. On REVISE, re-enter DISCUSSION (but no remaining user-questions — DL-1..DL-5 all locked).

---

## Risk Delta from iter1

iter1 proposed 3 ship + 1 close + 1 defer = **3 shipping deliverables + 1 inline close**. iter2 locked 4 ship + 1 close = **4 shipping deliverables + 1 inline close**. The delta is CL-5 (f-risk-01 M2 absorption) plus DL-1's Theme β go-ahead. Both are user-divergence overrides of iter1 leader recommendations.

### Honest sizing

| Metric | iter1 estimate | iter2 estimate | Delta |
|---|---|---|---|
| Shipping deliverables | 3 (CL-1..CL-3 of iter1 numbering) + 1 close | 4 (CL-2, CL-3, CL-4, CL-5) + 1 close (CL-1) | +1 deliverable; +1 user-overridden defer absorbed |
| Estimated executor tasks (Planning's call) | 5–6 (iter1 D-6) | 7 (if CL-5 = 1 task) to 15 (if CL-5 = 12 per-skill tasks). Recommended 7 per D-6 revised. | +1 to +9 |
| Estimated PR diff lines (order-of-magnitude) | ~300 LOC (skill body 150–200; mistake/SKILL.md domain edit 1–2; design doc 0; backlog updates ~5) | ~700–900 LOC (skill body 150–200; mistake/SKILL.md 2 line-clusters; design doc 200–300; 12-skill sweep ~12 × 15 lines = ~180 LOC; backlog updates ~10) | ~2-3× larger |
| Files touched | ~4 files (1 skill, 1 mistake/SKILL.md, 2 backlogs) | ~16 files (1 new skill, 1 design doc, 12 sweep skills, 3 backlogs; with `mistake/SKILL.md` counted once per D-7) | ~4× more files |
| Iteration budget | iter ≤ 2 per loop | iter ≤ 2 per loop (unchanged; user has not asked for higher) | none |

### Identified risks

- **R-1 (Planning decomposition decision pending)**: Whether CL-5 ships as 1 task or 12 tasks is a Planning-scope decision, not Ideation-scope. Recommended (D-6 revised): 1 task. If Planning chooses 12, the bundle pushes past Bundle B Wrap-up's task-count discipline (`manager-context-overflow-with-large-bundle.md`). Flag for Planning.
- **R-2 (`mistake/SKILL.md` two-edit overlap)**: CL-3 + CL-5 both edit this file. Per D-7, ship as one executor task. Planning must respect this; an evaluator must catch any plan that splits the two edits across two tasks.
- **R-3 (DL-1 shallow-lessons trade-off)**: User-accepted. Adversarial reviewers (per S-8) will challenge. Pre-recorded justification per DL-1 lock. Evaluators must not re-litigate.
- **R-4 (DL-5 M2 vs M1 substitution drift during execution)**: Per S-6, executor under pressure may reach for M1 wording ("`session.json.sessionId`") instead of M2 wording. CL-5's verification anchor (SC-5) requires literal M2 phrasing — "from the delegation prompt's `session-id:` field". Evaluators must grep for the canonical M2 string in every one of the 12 files.
- **R-5 (12-skill sweep consistency)**: 12 paragraph edits across 12 files invite small-wording-drift. Recommended: write the canonical substitution string ONCE in Preparation (single skill-edit template), then apply 12 times in Execution. Flag for Preparation.
- **R-6 (context overflow per Bundle B mistake)**: Bundle B's `manager-context-overflow-with-large-bundle.md` describes the exact failure mode. Bundle C is at 4× file count and 2-3× LOC of iter1's projection. Mitigations: (a) ship CL-5 as 1 task per D-6 revised; (b) keep iter cap at ≤ 2 per loop; (c) use worktree-absolute paths in every executor brief (per `executor-mirror-path-vs-worktree-physical-copy.md`); (d) avoid bundling additional backlog items.
- **R-7 (Wrap-up still has to happen for DL-1 to land coherently)**: Theme β's "lessons" section will draw from Wrap-up's own retrospective. If Wrap-up encounters an emergency-stop (as Bundle B did per I-4), CL-4's lessons section may need amendment in a follow-up session. Recorded for Wrap-up's awareness.

### What is NOT a risk

- f-risk-01 implementation risk: M2 is a docs codification of existing manager behavior (I-6). The risk is documentation drift, not behavioral break. Iron Law 7 verification (SC-5 grep checks) catches drift.
- Skill template novelty for CL-2: E-1 anchors `interview/templates/project-skill.md` as the canonical shape; the backlog explicitly cites this template. No template selection ambiguity.
- f-struct-01 verification: SC-1 is a `grep` check on a 1-file 3-line edit. Trivial.

---

## Backlog Deltas (from Bundle C shipping the 5 deliverables)

The following backlog files change status as a result of Bundle C shipping. Listed for Planning + Wrap-up awareness:

| Backlog file | Pre-Bundle-C status | Post-Bundle-C status | Owner deliverable | Notes |
|---|---|---|---|---|
| `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` | `status: open` | `status: closed`; `closed_by: 159eb21` added | CL-1 | Empirical resolution (fix already shipped); CL-1 is the docs-sync. |
| `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` | `status: deferred` | `status: in-progress` for this session; flip to `closed` post-merge | CL-2 | Skill stages + promotes this session. |
| `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` | `status: deferred` | `status: in-progress` (clarified to perpetual-capture-reminder); does NOT close — the skill-extraction trigger remains pending at N≥2 captured hooks-domain mistakes | CL-3 | Backlog stays alive as a witness-fire reminder, not as a deliverable. |
| `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` | `status: deferred` | `status: in-progress` for this session; flip to `closed` post-merge | CL-4 | Design doc lands per DL-1 (β-1). |
| `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` | `status: open` | `status: in-progress` (with M2 mitigation locked per DL-5) → `disposition: addressed` post-merge; remains in `backlogs/` (not deleted) with M1/M3 alternatives-considered note | CL-5 | M1/M3 explicitly NOT chosen — recorded in backlog body. |

**Note**: per `mistake/SKILL.md` § Memory Access Matrix, agents never directly write to `.gobbi/projects/gobbi/backlogs/` outside of Wrap-up promotion. Bundle C's executor edits happen inside the worktree on `chore/session-2026-05-24-45388fa9`; the merged PR is what flips these statuses on develop. Planning's executor briefs must scope the backlog-file edits as worktree-branch commits, not as out-of-session direct edits.

---

## Decisions Log

| # | Decision | Status | Source |
|---|---|---|---|
| iter1-LDP-1 | Cluster splits into 2 themes (α: hook-authoring + watchlist; β: design doc) | SUPERSEDED by DL-4 + DL-1 (cluster framing dropped; bundle ships 5 deliverables coherently) | iter1 § TL;DR + In-Scope |
| iter1-LDP-2 | `f-struct-01` close — fix in `session-start.sh:73-77` | CONFIRMED by DL-3 | iter1 I-2 |
| iter1-LDP-3 | `f-risk-01` defer — own Ideation | **OVERRIDDEN by DL-4 (absorb)** | iter1 I-3; user diverged via AUQ |
| iter1-LDP-4 | Theme β β-1 vs β-2 | **LOCKED β-1 by DL-1** (leader recommended β-2; user picked β-1) | iter1 D-5 |
| iter1-LDP-5 | Watchlist resolves via smallest-witness-supports | CONFIRMED (carries into CL-3) | iter1 D-2 |
| iter1-LDP-6 | Feature name = `session-foundations-bundle-c` | CONFIRMED by DL-2 | iter1 § Scope Contract |
| iter1-LDP-7 | Task count ≤ 5–6 | REVISED by D-6-revised — ≤ 7 if CL-5 = 1 task; ≤ 15 if CL-5 = 12 tasks | iter1 D-6; iter2 R-1 |
| iter1-LDP-8 | Bundle B HANDOFF "emergency stop" framing stale | LEADER-NOTED (unchanged; recorded for Wrap-up) | iter1 I-4 |
| iter2-DL-1 | β-1 — ship Theme β this session, self-count N=2 | **LOCKED** | manager-run AUQ; binding |
| iter2-DL-2 | Feature = `session-foundations-bundle-c` | **LOCKED** | manager-run AUQ |
| iter2-DL-3 | Close f-struct-01 inline | **LOCKED** | manager-run AUQ |
| iter2-DL-4 | Absorb f-risk-01 into Bundle C | **LOCKED** | manager-run AUQ (+ USER CHALLENGE follow-up) |
| iter2-DL-5 | M2 mitigation only (delegation-prompt codification); M1 + M3 explicitly NOT chosen | **LOCKED** | manager-run AUQ |

### Memory reads register (iter2 delta — incremental over iter1)

| Path | Purpose | Read result |
|---|---|---|
| `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-.../ideation/rawdata/draft-iter1.md` | iter1 baseline | Read in full |
| `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` § "Candidate mitigations" | M2 verbatim phrasing for CL-5 | Read; M2 wording transcribed into CL-5 + Out-of-Scope |
| `.claude/skills/principles/SKILL.md` | Iron Law load (fresh subagent) | Read in full |
| `.claude/skills/mistake/SKILL.md` | Mistake-skill discipline (fresh subagent) | Read in full |
| `.claude/skills/ideation/SKILL.md` | Required-sections template + memory-access matrix | Read in full |
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Project rule (only one) | Read; not applicable to this Ideation iter |
| `.gobbi/projects/gobbi/mistakes/` (15 files) | Domain-filter for process/workflow/session-lifecycle/scope-creep/documentation-sync — extra attention to subagent-path-construction + skill-doc-consistency entries | Reviewed via prior iter1 read; relevant entries: `executor-mirror-path-vs-worktree-physical-copy.md` (worktree path discipline → R-6), `manager-context-overflow-with-large-bundle.md` (bundle-size discipline → R-6), `memorization-delegation-prompts-must-load-memorization-skill.md` (delegation-prompt content → R-4 / R-5), `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` (verbatim spec recheck → applied in CL-5 SC-5) |

---

## Open Questions for the User

**None.** All 5 user-questions surfaced by iter1 have been answered via manager-run AskUserQuestion (DL-1..DL-5 above). Iter2 EVALUATION sub-phase may proceed without further user blocking.

If the EVALUATION sub-phase surfaces a finding that requires a 6th user decision, the standard NEEDS_CONTEXT escalation primitive from `agents/leader.md` § Status Contract applies — but no such finding is anticipated from iter2's content as written.

---

## Deferred (recap)

- M1 / M3 mitigation paths for f-risk-01 — NOT chosen per DL-5; record in `f-risk-01-subagent-ccsi-semantics.md` body as "alternatives considered".
- Skill-extraction trigger for hooks-domain mistakes (N≥2 threshold not yet met) — remains deferred; CL-3's backlog update notes the trigger.
- Smoke-test gate T1.h — Memorization-scope; Wrap-up handles.
- Bundle B HANDOFF staleness recovery — Wrap-up note; not a Bundle C deliverable.
- "Lessons learned" depth amendment for `session-lifecycle-worktree-boundaries.md` — DL-1 accepts shallow-by-design this session; future sessions may amend if/when the witness deepens (R-7).

---

**End of draft-iter2.md**
