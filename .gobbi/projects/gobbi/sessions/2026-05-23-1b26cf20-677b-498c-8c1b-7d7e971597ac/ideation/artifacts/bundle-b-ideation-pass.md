---
loop: ideation
iter: 3
artifact_type: ideation-pass
feature: session-foundations-bundle-b
goal: "Ship 2 session-foundation improvements deferred from prior session 7ea62d36: T1 worktree-first session architecture (with NEW promote-now commit-on-branch absorbed); T3 session.json subagent metadata PostToolUse hook + shell-script reconstructor."
created-by: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created-at: 2026-05-23T19:55:00Z
status: final
verdict: PASS
iters: 3
supersedes: []
related:
  - rawdata/draft-iter3.md
  - evaluation/iter3/claude/overall.md
  - evaluation/iter3/codex/overall.md
  - artifacts/memory-reads.md
  - artifacts/resolution-log.md
---

# Bundle-B Ideation — PASS (iter3)

Feature: `session-foundations-bundle-b`. Session: `2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac`.
3-iteration arc: iter1 REVISE → iter2 FAIL → iter3 PASS (surgical 3-fix).
Scope: T1 worktree-first session architecture (with NEW promote-now absorbed) + T3 session.json agents[] PostToolUse hook + reconstructor. T2 deferred mid-Ideation.

Source canonical: `rawdata/draft-iter3.md` (553 lines).

---

## Scope Contract

### In-Scope

- **T1 — Worktree-first session architecture** with NEW (Preparation `generate-now` symlink commit-on-worktree-branch) absorbed. Edits to `.claude/skills/{orchestration,git,preparation,gobbi}/` plus per-loop MEMORIZATION cadence rule.
- **T3 — `session.json.agents[]` PostToolUse hook + shell-script reconstructor.** New `.claude/hooks/post-tool-use-agents.sh`, `.claude/scripts/reconstruct-agents.sh`, `.claude/settings.json` registration block, `delegation/SKILL.md` structured-header convention, `orchestration/SKILL.md` narrative replacement.

### Out-of-Scope

- **T2 — skill-loading-discipline matrix + Load-Directives validator.** Deferred mid-Ideation. Backlogged at `staging/backlogs/project/item-1-2-skill-loading-discipline.md`.
- Codex CI integration for dual-system evaluation — deferred.
- Auto-mode silence vs Always-Ask categories (Item 2-1) — out of scope.
- Chat-mode tiki-taka redesign — out of scope.
- Item 1-3 alternative collapsing strategies — backlogged.
- Item 1-2 broader delegation contract verifier — backlogged.
- `session.template.json.agents[]` status field schema extension — deferred to feature-level backlog.
- `.gobbi/project.json` bootstrap for D-3-3-resolver step (i) — deferred (iter3 Fix C). Backlogged at `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`.

### Decisions Locked

- **T1 framing**: worktree-first uniform for every session (CP-1.3-γ Option A; user lock Sub-step A round 1).
- **T1 architecture**: worktree-first locked; alternatives backlogged.
- **T1 session-memory survival**: option (c) — session dir in worktree; PR squash absorbs on merge.
- **NEW absorbed into T1**: collapses to a 2-line `git add` + `git commit` in `preparation/SKILL.md`.
- **T3 mechanism**: (c) PostToolUse hook + shell-script reconstructor.
- **T3 hook contract**: `tool_input` AND `tool_result` received; `transcript_path` in stdin enables rich extraction.
- **T3 dual registration**: PostToolUse + PostToolUseFailure, single script. Both officially documented per `https://code.claude.com/docs/en/hooks` (verbatim: `| PostToolUseFailure | After a tool call fails |`).
- **T3 commit subject**: `chore(session): record <loop> iter{n} memory`.
- **T1 branch prefix (iter3 Fix A — user-locked)**: `chore/session-{date}-{ssid-short}`. Registry-compliant per `git/conventions.md:22` (type `chore`), `:64` (27 chars — within 3-50), `:261` (label `#e4e669`).

### Success Criteria

1. After T1 lands, `session.json.git.worktreePath` non-null immediately after Configuration (verified by `jq`).
2. After T1 + NEW, next Preparation `generate-now` ships complete PR diff (skill body + both symlinks on worktree branch).
3. After T3, next session of N spawns has `session.json.agents[]` length ≥ N+1 with ≥ 90% field population.
4. Failed Task spawns produce `agents[]` entry with `status: "failed"`.
5. Per-iteration `chore(session): record <loop> iter{n} memory` commits land on worktree branch and survive abort-mid-session.
6. Concurrent hook fires leave all entries intact (D-3-5 flock smoke test).

### Deferred

- T2 → `staging/backlogs/project/item-1-2-skill-loading-discipline.md`
- Codex CI → `staging/backlogs/project/codex-ci-integration-for-dual-system-eval.md`
- Item 2-1 → `staging/backlogs/project/item-2-1-auto-mode-silence-vs-always-ask.md`
- Chat-mode → `staging/backlogs/project/chat-mode-tiki-taka-redesign.md`
- T1 alternatives → two backlogs in `staging/backlogs/project/`
- T2 broader verifier → `staging/backlogs/project/item-1-2-broader-delegation-contract-verifier.md`
- `agents[]` status field → `staging/backlogs/feature/schema-extension-agents-status-field.md`
- `.gobbi/project.json` bootstrap → `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`

---

## Framed Problem

### T1 — Worktree-first session architecture

**Root cause**: the proxy rule "session writes use the main tree's absolute path" collapses two distinct concerns: (a) audit-trail durability and (b) reviewability of PR-shipped artifacts. When applied uniformly, category (b) artifacts (skill bodies, symlinks generated by Preparation `generate-now`) leak to the main tree and miss the PR diff. Witness: `1829fa3` commit ("symlinks created in main-tree at Preparation-exit promotion and never landed on the worktree branch"). Three workflow phases (Ideation / Preparation / Planning) run BEFORE the worktree exists.

**Impact**: high-medium severity. The symlink gap was a shipped-broken PR caught only by the user at finalize. Every future `generate-now` session ships an incomplete PR.

**Re-framing conclusion**: worktree-first (CP-1.3-β) locked. NEW collapses to a 2-line `git add` + `git commit` extension to `preparation/SKILL.md`'s promote-now path.

### T3 — `session.json.agents[]` PostToolUse hook + reconstructor

**Root cause**: no synchronous side-channel from Task tool return to a structured-write surface; manager-driven append discipline has been silently failing. Empirical: `python3 -c "len(d['agents'])"` on prior session `session.json` returns `1` after 17+ Task spawns.

**Impact**: medium-high. `agents[]` is vestigial without the hook. No per-session token cost data available.

**Re-framing conclusion**: literal ask is (c) hook + reconstructor. Unified event stream deferred as a future consideration.

---

## Research Insights

### T1 key external

- **T1-E-1** — Claude Code's official worktree pattern (`https://code.claude.com/docs/en/worktrees`) confirms T1 is the runtime-recommended direction.
- **T1-E-2** — Community: scope-by-module, commit-at-session-boundaries (`https://www.mindstudio.ai/blog/parallel-agentic-development-claude-code-worktrees`). Rule 3 anchors D-4 per-iteration commit cadence.
- **T1-E-4** — Shim pattern (`https://github.com/jasagiri/claude-jj-worktree`) — anchor is Configuration Step 1 (orchestration boundary).

### T3 key external

- **T3-E-1** — Official PostToolUse hook input schema includes `tool_name`, `tool_input`, `tool_use_id`, `tool_result`, AND `transcript_path` (`https://code.claude.com/docs/en/hooks`).
- **T3-E-5 (iter3 Fix B)** — `PostToolUseFailure` IS officially documented. Verbatim lifecycle-table: `| PostToolUseFailure | After a tool call fails |`. Verbatim exit-code-behavior: `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`. 31-event page (29 captured by name in staged reference).

---

## Scenarios

(Full enumeration in `rawdata/draft-iter3.md` §Scenarios. Summary of key scenarios:)

### T1 scenarios

- **G-1** — Feature session, worktree-first bootstrap, in-session `generate-now` skill ships in PR. Branch: `chore/session-{date}-{ssid-short}`.
- **G-2** — Session memory ships in PR squash and lives on develop.
- **E-1** — Resume / `/clear` / `/compact` mid-session; row 5.5 idempotency guard skips P2 if worktreePath non-null.
- **E-2** — Non-feature (investigation / doc-only) session under uniform lock; `chore/session-` branch.
- **E-3** — Wrap-up never reaches merge (session aborted); D-4 per-iteration commit is the survival mechanism.
- **F-1** — Re-routing inversion; mitigated by D-2 qualified rule.
- **F-2** — Symlink on main tree; mitigated by `git -C "$worktreePath"` pattern.
- **F-3** — Worktree creation fails; manager surfaces via AskUserQuestion.
- **F-4** — Partial promotion failure; rollback semantics (D-3 / T1-I-T1.j).

### T3 scenarios

- **G-1** — Subagent spawn completes; PostToolUse hook fires; `agents[]` entry with full telemetry.
- **G-2** — Reconstructor runs; verify-and-fix idempotent.
- **E-1** — Failed spawn; PostToolUseFailure hook fires; `status: "failed"` entry.
- **E-5** — Two concurrent Task spawns; D-3-5 flock serialization prevents lost-update.
- **F-1** — Hook crashes; reconstructor is the recovery mechanism.

---

## Implementation Checklist

(Full detail in `rawdata/draft-iter3.md` §Implementation Checklist. Summary:)

### T1

- T1-I-T1.a — Insert row 5.5 in `orchestration/SKILL.md` with branch name `chore/session-{date}-{ssid-short}`.
- T1-I-T1.b — Qualify `git/SKILL.md:33` rule to use `session.json.git.worktreePath` when set.
- T1-I-T1.c — `git/SKILL.md` P2 note: invoked from Configuration row 5.5.
- T1-I-T1.d — `preparation/SKILL.md` narrow-exception: `git -C "$worktreePath" add` + `git -C "$worktreePath" commit` with canonical AI-Provenance-Record trailer.
- T1-I-T1.e — `gobbi/SKILL.md` Session Bootstrap Order cross-reference.
- T1-I-T1.f — Per-iteration session-memory commit cadence in all 5 workflow phase docs.
- T1-I-T1.g — Direct-mode preserved as opt-out.
- T1-I-T1.h — Smoke test gate: `jq '.git.branch'` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`.
- T1-I-T1.i — `delegation/SKILL.md` grep audit for main-tree boilerplate.
- T1-I-T1.j — Rollback semantics for promote-now `git commit` failure.

### T3

- T3-I-T3.a — Create `.claude/hooks/post-tool-use-agents.sh` (bash + jq, flock, two-tier, upsert by id).
- T3-I-T3.b — Create `.claude/scripts/reconstruct-agents.sh` (flock, verify-and-fix, idempotent).
- T3-I-T3.c — Edit `.claude/settings.json`: PostToolUse + PostToolUseFailure blocks (officially verified per T3-E-5).
- T3-I-T3.d — `orchestration/SKILL.md` row 6 + agents[] narrative: replace manual with hook+reconstructor.
- T3-I-T3.e — `delegation/SKILL.md`: structured-header convention, regex patterns, migration note.
- T3-I-T3.f — Stage `agents[]` status field extension as feature-level backlog.
- T3-I-T3.g — Document `flock -x` in `delegation/SKILL.md` and hook comment block.
- T3-I-T3.h — Acknowledge dormant `.gobbi/project.json` precondition; stage feature backlog.

---

## Design

(Full decision rationale in `rawdata/draft-iter3.md` §Design. Key decisions:)

| Decision | Summary |
|---|---|
| D-1 (iter3 Fix A) | Row 5.5 branch name: `chore/session-{date}-{ssid-short}`. Registry-compliant (chore type). |
| D-2 | Qualify `git/SKILL.md:33`: use worktreePath when set; fallback to main tree when null (direct mode). |
| D-3 (NEW) | Commit-on-branch for promote-now: `chore(skills): promote {slug} generated by preparation iter{n}` + canonical trailer. |
| D-4 | Per-iteration session-memory commit cadence: `chore(session): record <loop> iter{n} memory`. |
| D-5 | Direct mode preserved as documented opt-out. |
| D-3-1 | Hook stack: bash + jq, `session-start.sh` shape, two-tier extraction (prefer rich `toolUseResult`; fallback to `tool_result`). |
| D-3-2 | Reconstructor: verify-and-fix, upsert by id, idempotent, orphan-report-only. |
| D-3-3 (iter3 Fix B) | Dual-event hook scope: PostToolUse + PostToolUseFailure, single script, officially documented. |
| D-3-3-resolver (iter3 Fix C) | Session-dir resolver: (i) `project.json` preferred (DORMANT — file absent); (ii) directory scan fallback (current active path). |
| D-3-4 | Metadata extraction: hybrid — model from `tool_input.model`; step/phase/iter from `tool_input.prompt` structured headers. |
| D-3-5 | Serialization: POSIX `flock -x` on `session.json` for every read-modify-write cycle. |
| D-3-6 | Correlation key: `tool_use_id` — exact jq paths documented. |

---

## Decisions Log (summary)

| ID | Question | Decision |
|---|---|---|
| CP-1.3-α | T1 failure-mode confirmation | Leader framing confirmed: Preparation/Planning artifacts write to main tree because `cwd` is main tree until Execution |
| CP-1.3-γ | Non-feature session scope | Worktree-first for every session (Option A — uniform) |
| CP-NEW-β | NEW dependency on T1 | NEW dependent on T1 (collapses to 2-line addition) |
| CP-1.2-α | Root cause T2 hypothesis | (D+L) composite — docs gap + lazy-load behavior |
| CP-1.3-β | Worktree-first vs alternatives | Worktree-first locked; alternatives backlogged |
| CP-4.1-α | T3 mechanism | (c) PostToolUse hook + shell-script reconstructor |
| CP-4.1-β | Hook contract verification | Closed: tool_input AND tool_result received; transcript_path in stdin |
| Scope lock | Feature + task lock | `session-foundations-bundle-b`; T1 + T3; T2 deferred |
| Session-memory survival | Worktree survival option | (c) session dir in worktree; PR squash absorbs on merge |
| T2 deferral | T2 matrix location | User raised ambiguity; T2 deferred entirely |
| CP-D-1 | Dual hook registration | Dual registration this session; status field template extension deferred |
| CP-D-2 | Per-iter commit subject | `chore(session):` subject |
| F-Fix-A | Branch prefix | `chore/session-{date}-{ssid-short}` (user-locked iter3) |
| F-Fix-B | PostToolUseFailure verbatim | Re-verified via WebFetch; verbatim quotes preserved |
| F-Fix-C | `.gobbi/project.json` dormant | Flagged + backlogged; resolver step (ii) is currently active |

---

## Evaluation Summary

### 3-Iteration Arc

| Iter | Verdict | Root cause | Fixes applied |
|---|---|---|---|
| iter1 | REVISE | Multiple findings across 7 perspectives: lost-update race (R1), partial-promotion rollback gap (R2), invented `loop/` trailer (P1/C1), PostToolUseFailure unverified (P2), resolver underspecified (COD-STRUCT-001), etc. | Addressed in iter2 WORK: D-3-5 flock, D-3 canonical trailer, D-3-3-resolver, D-3-6 correlation key, F-6 input/result split |
| iter2 | FAIL | Karpathy mode-3 orthogonal edit: iter2 WORK fixed COD-PROJ-001 (row 5.5 branch precondition) but introduced a new Critical regression — chose `session/{date}-{ssid-short}` which uses an unregistered branch type prefix (`session/` is not in `git/conventions.md:22` registry). Convergent Critical P1/C1/R5 across both Claude + Codex evaluators. | — |
| iter3 | PASS | Surgical 3-fix revision: Fix A (user-locked `chore/session-{date}-{ssid-short}`), Fix B (PostToolUseFailure verbatim quote preservation), Fix C (`.gobbi/project.json` dormant-precondition flag + backlog). | All iter2 blockers closed; no new High/Critical |

### Cross-System Reconciliation

**Claude iter3 evaluator**: All 7 perspectives + Overall returned PASS. Highest open finding: F-PROJ-iter3-2 (Fix B WebFetch independent verification gap — Medium 50, assumption_risk — per brief escape-hatch: independent WebFetch not available in Claude sandbox). Karpathy mode-3 adversarial check: PASS (0 of 4 modes triggered).

**Codex iter3 evaluator**: All 7 perspectives + Overall returned PASS. New findings COD-OVERALL-ITER3-001 (event count 31 vs 29 in staged reference — docs-sync, Medium) and COD-CONS-ITER3-001 (same), COD-OVERALL-ITER3-002 / COD-CONS-ITER3-002 / COD-AESTH-ITER3-001 (chore label cited at line 261, actual line 263 — Low, docs-sync). Both Codex systems independently verified Fix B by fetching the official hooks page.

**Cross-system agreement**: Both systems agree iter2's convergent Critical is closed. Both acknowledge residual Medium/Low citation-accuracy items (31 vs 29 event count; line 261 vs 263 for `chore` label). These are supporting-prose defects, NOT load-bearing for the operational design decisions — the hook events exist, the branch form is registry-compliant. Both systems classify these as non-blocking.

**Divergence**: Claude evaluator (F-RISK-iter3-2) could not independently re-verify the PostToolUseFailure verbatim quote (no WebFetch in sandbox); Codex evaluator independently fetched the URL and confirmed. Net: both converge on PASS with Fix B verified at design level.

### Disposition Table (cumulative iter1+iter2+iter3)

| Finding ID | Severity | Final disposition |
|---|---|---|
| iter1 P1/C1 (invented `loop/` trailer) | High | addressed (iter2 F-2) |
| iter1 P2 (PostToolUseFailure unverified) | High | addressed (iter3 Fix B verbatim) |
| iter1 P3 (steel-man read-only) | Medium | addressed (iter2) |
| iter1 P4 (no migration smoke test) | Medium | addressed (iter2 + iter3 augmented) |
| iter1 R1 / COD-STRUCT-002 (lost-update race) | High | addressed (iter2 D-3-5 flock) |
| iter1 R2 (partial-promotion rollback) | High | addressed (iter2 T1-I-T1.j) |
| iter1 R3 (Goodhart factor-when-demanded) | Medium | deferred per scope |
| iter1 R4 (abort-mid-commit) | Medium | deferred per scope |
| iter1 S1 (DRY inline jq) | Medium | deferred per scope |
| iter1 S2 (partial-deploy safety) | Low | deferred per scope |
| iter1 S3 (decimal row 5.5) | Low | deferred per scope |
| iter1 A1 (tool_result over-claim) | Medium | addressed (iter2) |
| iter1 A2 (hyphenation drift) | Low | deferred per scope |
| iter1 U2 / iter2 U3 (hook-silence diagnostic) | Medium | deferred per scope |
| iter1 COD-PROJ-001 (row 5.5 branch) | High | addressed (iter3 Fix A — regression from iter2 now fixed) |
| iter1 COD-PROJ-002 (no-issue scenario) | Medium | addressed (chore/ has no issue dep) |
| iter1 COD-STRUCT-001 (resolver underspec) | High | addressed (iter2 D-3-3-resolver + iter3 Fix C dormant flag) |
| iter1 COD-STRUCT-003 (correlation key) | High | addressed (iter2 D-3-6) |
| iter1 COD-AESTH-001 (path-vocab) | Medium | addressed (iter2 CL-1) |
| iter1 COD-CONS D-3-4 vs T3-I-3 | Medium | addressed (iter2 F-6 input/result split) |
| iter1 COD-PERF-001/002 | Low | addressed (iter2 bounded paragraph) |
| iter1 COD-RISK-003 (privacy) | Low | deferred per scope |
| iter1 COD-USAGE-001..004 | Medium | addressed (iter2) |
| iter2 P1/C1/R5 (branch regex violation — Critical) | Critical | addressed (iter3 Fix A) |
| iter2 P2 (unverified WebFetch) | High | addressed (iter3 Fix B verbatim) |
| iter2 P3 (project.json absent) | Medium | addressed (iter3 Fix C) |
| iter2 S1/R4 (flock+mv inode) | Medium | deferred per scope |
| iter3 F-PROJ-iter3-2 (WebFetch independent verify gap) | Medium 50 | open (deferred to Execution per escape-hatch) |
| COD-OVERALL-ITER3-001 (event count 31 vs 29) | Medium | open (docs-sync; non-load-bearing) |
| COD-CONS-ITER3-001 (same) | Medium | open (docs-sync; non-load-bearing) |
| COD-CONS-ITER3-002 / COD-AESTH-ITER3-001 (line 261 vs 263) | Low | open (citation polish; non-load-bearing) |
| COD-OVERALL-004 / COD-CONS-002 (DQ-anchor traceability) | Medium 50 | deferred per scope |
