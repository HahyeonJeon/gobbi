---
artifact_type: scope-contract
feature: session-foundations-bundle-b
goal: "Ship 2 session-foundation improvements deferred from prior session 7ea62d36: T1 worktree-first session architecture (with NEW promote-now commit-on-branch absorbed); T3 session.json subagent metadata PostToolUse hook + shell-script reconstructor."
created-by: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created-at: 2026-05-23T14:40:59Z
---

# Ideation Draft — iter1 (canonical)

Loop: Ideation. Session: `2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac`. Feature: `session-foundations-bundle-b`. Authored at WORK after DISCUSSION Sub-steps A → B → C → D locked the design with the user. Every section below traces to a DISCUSSION exchange recorded in the Decisions Log; no new content was introduced in WORK.

Source records: Sub-step A findings (`rawdata/sub-step-a-findings-iter1.md`), Sub-step C findings (`rawdata/sub-step-c-findings-iter1.md`), Sub-step D design (`rawdata/sub-step-d-design-iter1.md`). The 12 staged external reference files at `staging/references/` (one per confirmed external insight) are cited by slug below.

---

## Scope Contract

## In-Scope

- **T1 — Worktree-first session architecture** with NEW (Preparation `generate-now` symlink commit-on-worktree-branch) absorbed into T1's design. Edits under `.claude/skills/{orchestration,git,preparation,gobbi}/` plus per-loop MEMORIZATION cadence rule.
- **T3 — `session.json.agents[]` PostToolUse hook + shell-script reconstructor.** New `.claude/hooks/post-tool-use-agents.sh`, new `.claude/scripts/reconstruct-agents.sh`, `.claude/settings.json` registration block, `delegation/SKILL.md` structured-header convention, `orchestration/SKILL.md` narrative replacement.

## Out-of-Scope

- **T2 — skill-loading-discipline matrix + Load-Directives validator.** Deferred entirely from this session per Sub-step D round 1 user lock ("looks ambiguous") — backlogged at `staging/backlogs/project/item-1-2-skill-loading-discipline.md`.
- **Codex CI integration for dual-system evaluation** — deferred (priority #1 of original prior-session deferred list).
- **Auto-mode silence vs Always-Ask categories (Item 2-1)** — out of scope.
- **Chat-mode tiki-taka redesign** — out of scope ("needs many discussions").
- **Item 1-3 alternative collapsing strategies** (two-surface, symlink-into-worktree) — leader surfaced; user locked worktree-first; alternatives backlogged.
- **Item 1-2 broader "delegation contract verifier" re-framing** — leader surfaced; user locked literal-ask scope (deferred composite to backlog along with T2).
- **`session.template.json.agents[]` `status` field schema extension** — deferred to feature-level backlog (`staging/backlogs/feature/schema-extension-agents-status-field.md`) per T3 design D-3-3 + checklist item 7. Hook + reconstructor write the field as an extra-property; formal template bump deferred.

## Decisions Locked

- **T1 framing**: worktree-first uniform for every session (CP-1.3-γ Option A; user lock Sub-step A round 1).
- **T1 architecture**: worktree-first locked (CP-1.3-β Option Recommended); alternative collapsing strategies (two-surface, symlink-into-worktree) backlogged.
- **T1 failure mode**: leader's framing confirmed (CP-1.3-α Option Recommended) — Preparation/Planning artifacts that should land in PR diff get written to main tree because `cwd` is main tree until Execution.
- **T1 session-memory survival**: option (c) — session dir lives in worktree; PR squash absorbs it on merge (Sub-step D round 1 user lock).
- **NEW absorbed into T1**: dependent on T1 outcome (CP-NEW-β Option Recommended); collapses to a 2-line `git add` + `git commit` addition to `preparation/SKILL.md`'s promote-now path.
- **T1-2 (skill-loading discipline) hypothesis**: (D+L) composite — docs gap + lazy-load behavior (CP-1.2-α Option Recommended, Sub-step A round 1) — but T2 design deferred to a future session (Sub-step D round 1).
- **T3 mechanism**: (c) PostToolUse hook + shell-script reconstructor (CP-4.1-α Option Recommended).
- **T3 hook contract verification gate**: closed BEFORE Sub-step D — both `tool_input` AND `tool_result` received; `transcript_path` in stdin enables rich-payload extraction (CP-4.1-β Option Recommended, resolved in Sub-step C with empirical + documentary verification).
- **T3 template schema**: existing `agents[]` fields sufficient; no template bump this session (CP-4.1-γ Option Recommended).
- **T3 dual registration**: PostToolUse + PostToolUseFailure, single script (CP-D-1 Option Recommended). Template `status` field deferred to backlog.
- **T3 commit subject**: `chore(session): record <loop> iter{n} memory` for per-iteration session-memory commit (CP-D-2 Option Recommended).

## Success Criteria

- After T1 lands, the next session starting from `/gobbi` produces `session.json.git.worktreePath` non-null immediately after Configuration (verifiable by `jq`).
- After T1 + NEW absorbed, the next Preparation `generate-now` ships a PR diff containing the skill body AND its `.claude/skills/{slug}` + `.agents/skills/{slug}` symlinks on the worktree branch (no re-occurrence of `1829fa3`-style shipped-broken PR).
- After T3 lands, the next session of N Task spawns has `session.json.agents[]` length ≥ N + 1 (manager + N specialists), with ≥ 90% field population (T3-I-1 + T3-E-2).
- Failed Task spawns produce an `agents[]` entry with `status: "failed"` and a synthetic id (`tool_use_id`).
- Per-iteration `chore(session): record <loop> iter{n} memory` commits land on the worktree branch and survive abort-mid-session (E-3).

## Deferred

- T2 skill-loading matrix + validator → `staging/backlogs/project/item-1-2-skill-loading-discipline.md`
- Codex CI for dual-system evaluation → `staging/backlogs/project/codex-ci-integration-for-dual-system-eval.md`
- Item 2-1 Auto-mode silence vs Always-Ask → `staging/backlogs/project/item-2-1-auto-mode-silence-vs-always-ask.md`
- Chat-mode tiki-taka redesign → `staging/backlogs/project/chat-mode-tiki-taka-redesign.md`
- Item 1-3 two-surface collapsing strategy → `staging/backlogs/project/item-1-3-two-surface-collapsing-strategy.md`
- Item 1-3 symlink-into-worktree alternative → `staging/backlogs/project/item-1-3-symlink-into-worktree-alternative.md`
- Item 1-2 broader delegation contract verifier → `staging/backlogs/project/item-1-2-broader-delegation-contract-verifier.md`
- `session.template.json.agents[]` `status` field extension → `staging/backlogs/feature/schema-extension-agents-status-field.md`

---

## Framed Problem

Two distinct problems bundled under one Scope Contract because they share the constraint "session-foundation infrastructure that fails silently and degrades audit fidelity." Each is framed independently below.

### T1 — Worktree-first session architecture (with NEW absorbed)

**Root cause**

The proxy rule "session writes use the main tree's absolute path, never the worktree's" (`git/SKILL.md:33`) collapses two distinct concerns into one path-discipline rule: (a) audit-trail durability of session memory, and (b) reviewability of PR-shipped artifacts. When the rule is applied uniformly, category (b) artifacts (skill bodies, symlinks generated by Preparation `generate-now`) leak to the main tree and miss the PR diff. Witnesses: `1829fa3` commit body ("PR #267 added `.gobbi/projects/gobbi/skills/codex/SKILL.md` but the corresponding `.claude/skills/codex/SKILL.md` + `.agents/skills/codex` symlinks were created in main-tree at Preparation-exit promotion and never landed on the worktree branch"); prior-session `session.json:285` ("Executor's main-tree-vs-worktree misroute (caught + reverted self) recorded as Low-severity discipline observation"). Three workflow phases (Ideation / Preparation / Planning) currently run BEFORE the worktree exists, with `cwd` = main tree — the `cwd` flip happens only at Execution start per `git/SKILL.md:155-162`.

**Impact**

- **Who is affected**: the manager (issues incomplete PRs); reviewers (see partial diffs missing dependent files); future sessions (load a skill that the merged develop branch claims doesn't exist); subagents (deceived about which tree their commits land on).
- **Severity**: high-medium. The symlink gap was a shipped-broken PR caught only by the user at finalize. A full skill body promotion that misroutes would be silent feature regression.
- **Cost of inaction**: every future Preparation `generate-now` session ships an incomplete PR; every session-spanning artifact that must be both audit-durable and PR-reviewable hits this gap.

**Success criteria**

1. After T1 lands, `session.json.git.worktreePath` is non-null immediately after Configuration Step 1.
2. No agent is required to remember "this write goes to main tree, that one to worktree" — the answer is determinable from the `cwd` (which is now uniformly the worktree).
3. The next Preparation `generate-now` ships a PR diff including the skill body and both symlinks on the worktree branch (no recurrence of `1829fa3`).
4. Session memory survives worktree removal because the PR squash absorbs it on merge.

**Prior attempts**

- The current "always main-tree absolute path" rule (`git/SKILL.md:33`) was a prior fix for the inverse failure (Codex evaluator writing session memory to a worktree-nested path; see `mistakes/codex-eval-session-write-path-nested-in-worktree.md`). It prevents the inverse but exposes the forward failure.
- The Preparation-exit `generate-now` narrow exception (`preparation/SKILL.md:62`) introduced a sole-writer violation justified by in-session loadability, but did not address tree placement.
- The finalize commit `1829fa3` was a manual session-end hand-fix, not a structural fix.

**Counterfactual / steel-man**

Strongest argument against worktree-first: bootstrapping a worktree at Configuration Step 1 costs branch creation + dependency reinstall on every session — including pure investigation / read-only sessions. Counter-evidence: this repo has no `package.json` at root (verified Sub-step A); the dependency-install cost is currently zero in this project. Direct mode (`orchestration/SKILL.md:103`) is preserved as an opt-out (Design Decision D-5). Steel-man does not stand for gobbi.

**Re-framing conclusion**

The literal ask is "should every session start in a worktree." The leader surfaced two alternative collapsing strategies (two-surface model; symlink-into-worktree model) in Sub-step A. User chose to lock worktree-first (CP-1.3-β Option Recommended); alternatives are deferred to backlog. NEW (Preparation symlink commit-on-branch) is naturally subsumed by worktree-first — if `cwd` is the worktree from row 5.5, NEW collapses to a 2-line `git add` + `git commit` extension to the existing narrow exception. NEW is dependent on T1 (CP-NEW-β Option Recommended).

### T3 — `session.json.agents[]` PostToolUse hook + reconstructor

**Root cause**

The manager has no synchronous side-channel from the Task tool's return value to a structured-write surface, AND the documented manager-driven append-at-spawn-time discipline (`orchestration/SKILL.md:103` row 6) has been silently failing in practice. Empirical witness: `python3 -c "len(d['agents'])"` on the prior session's `session.json` returns `1` after 17+ Task spawns across a ~10-hour session. The token-usage data arrives only at Task return time inside the `<usage>` block; the manager forgets to append at return time because there is no enforced gate; parsing the usage block is labor the manager skips.

**Impact**

- **Who is affected**: future sessions (lose per-spawn audit trail); workflow-improvement work (no data on subagent token economy, iteration frequency, model use); the user (cannot answer "how much did this session cost" without manual reconstruction).
- **Severity**: medium-high. Not a workflow-breaker but a high-value data loss every session. Without it, `agents[]` is vestigial.
- **Cost of inaction**: indefinite continuation of `agents[]` being effectively unpopulated; every session ships with a 1-row `agents[]` despite 15+ spawns.

**Success criteria**

1. After any session of N Task spawns, `session.json.agents[]` has N+1 entries (manager + N specialists) with full schema populated (`id / name / type / step / phase / iter / model / system / transcriptPath / tokensUsed / startedAt / finishedAt`).
2. `tokensUsed.{input, output, cacheRead, cacheCreation}` populated for ≥ 90% of entries.
3. The mechanism does not require the manager to remember — it is hooked.
4. Mechanism is robust to session interruption — partial sessions still have populated `agents[]` for spawns that completed.

**Prior attempts**

- None on record specifically for `agents[]` population. The current state IS the prior attempt's outcome (manager-driven append per `orchestration/SKILL.md:103`).
- `session-start.sh` is the closest precedent for hook-based session-mutation — known-good bash+jq template.
- No PostToolUse hook exists yet (`grep PostToolUse .claude/settings.json` returns nothing).

**Counterfactual / steel-man**

Strongest argument against (c) both / for (b)-only: the hook depends on whether PostToolUse receives both `tool_use` payload AND `tool_result` with the `<usage>` block. If only one side, the hook needs the transcript anyway. Counter-evidence verified in Sub-step C (CP-4.1-β closed): the official PostToolUse hook input includes `transcript_path` in the common-fields envelope (T3-E-1), and empirical inspection of `~/.claude/projects/.../<id>.jsonl:165` (T3-E-2) confirms the rich `toolUseResult` is one `jq` away regardless of whether the basic `tool_result` shape is sufficient. (c) both is the resilient answer: hook for real-time, reconstructor for repair.

**Re-framing conclusion**

The literal ask is option (c). The leader surfaced a deeper re-framing (unified event stream for all "append-on-event" obligations — `agents[]`, `iterations[]`, discussion-log, project journal). User deferred the re-framing; ship the literal ask, surface the unified event stream as a future consideration (not even backlogged — the hook + reconstructor already satisfy the literal ask per the cross-cutting observation in Sub-step C).

---

## Research Insights

External insights from Sub-step C are staged as 12 reference files under `staging/references/` (4 per task; 4 unused for T2 which deferred — only T1 + T3 references are loaded by Sub-step D). Internal insights are inline below per the WORK template.

### T1 — Worktree-first architecture (with NEW absorbed)

#### Internal insights

- **T1-I-1** — The current "session writes always main-tree absolute path" rule is the proxy that exposes the symlink-gap failure. Source: `git/SKILL.md:33`; `1829fa3` commit body. Why: T1's collapses two opposing failure modes by changing `cwd` semantics; the session-memory survival question re-opens for Sub-step D.
- **T1-I-2** — Worktree creation is currently bound to Execution start, not Configuration. Source: `orchestration/workflow/execution.md:30-50`; `git/SKILL.md:155-162`; `orchestration/SKILL.md:103`. Why: relocation to row 5.5 is mechanical (row insertion + `git.worktreePath` stamp move).
- **T1-I-3** — The Preparation narrow-exception promote-now already accepts a sole-writer violation; extending it to commit-on-branch is a strict superset. Source: `preparation/SKILL.md:62`; `gobbi/SKILL.md:117`. Why: anchors NEW absorbed as a 2-line `git add` + `git commit` extension.
- **T1-I-4** — The `codex-eval-session-write-path-nested-in-worktree` mistake reveals the inverse failure mode worktree-first MUST address. Source: `mistakes/codex-eval-session-write-path-nested-in-worktree.md:19-44`. Why: the (a/b/c/d) survival answers each carry a different routing rule; (c) — session dir in worktree — is the user-locked choice.
- **T1-I-5** — Session writes from the manager already use main-tree absolute paths today via `session.template.json.transcriptPath`. Source: `gobbi/SKILL.md:39`; `session.template.json:11`. Why: narrows the survival question to the `.gobbi/projects/<name>/sessions/.../` tree only; the `~/.claude/projects/...` transcript file is automatically immune to worktree removal.

#### External insights

- **T1-E-1** — Claude Code's official worktree pattern is exactly what T1 generalizes — runtime-aligned. Staged at `staging/references/claude-code-worktree-isolation-pattern.md`. Source: `https://code.claude.com/docs/en/worktrees`. Why: confirms T1 is the runtime-recommended direction; the "filesystem-only" caveat seeds the survival design question.
- **T1-E-2** — Community-validated worktree rules: scope by module, rebase not merge, commit at session boundaries. Staged at `staging/references/worktree-scope-by-module-not-task.md`. Source: `https://www.mindstudio.ai/blog/parallel-agentic-development-claude-code-worktrees`. Why: rule 3 (commit-at-session-boundaries) anchors D-4 per-iteration cadence; rule 1 (scope-by-module) is the counter-position to the locked "uniform for every session."
- **T1-E-3** — Jujutsu jj workspace is the cross-VCS prior art for "one isolated working surface per sub-agent." Staged at `staging/references/jj-workspace-isolation-revision-not-branch.md`. Source: `https://www.joshualyman.com/2026/02/demystifying-jujutsu-jj-workspaces/`. Why: cross-VCS validation that T1 is the right direction.
- **T1-E-4** — The shim pattern proves the discipline travels at the agent boundary, not the git boundary. Staged at `staging/references/claude-jj-worktree-shim-pattern.md`. Source: `https://github.com/jasagiri/claude-jj-worktree` + `https://github.com/kawaz/jj-worktree`. Why: the right anchor for T1 is Configuration Step 1 (the gobbi orchestration boundary), not the git skill.

### T3 — PostToolUse hook + reconstructor

#### Internal insights

- **T3-I-1** — `agents[]` is empirically unpopulated in the prior session — 1 entry after 17+ spawns. Source: `python3 -c "len(d['agents'])"` on `sessions/2026-05-23-7ea62d36-.../session.json`. Why: sets the success metric (≥ 90% population); identifies the failure as writer-side, not schema-side.
- **T3-I-2** — The transcript JSONL's `toolUseResult` payload is empirically rich — every `agents[]` field except `step/phase/iter/model` is satisfiable from it. Source: empirical inspection of `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-...jsonl` line 165. Why: de-risks Sub-step D — both hook + reconstructor consume the same authoritative source.
- **T3-I-3** — `step / phase / iter / model` are NOT in `toolUseResult` — they must come from the delegation prompt OR `tool_use.input.model`. Source: same empirical inspection (line 164). Why: surfaces D-3-4 — hybrid extraction strategy required.
- **T3-I-4** — `.claude/hooks/session-start.sh` is the precedent — bash-with-jq pattern. Source: `.claude/hooks/session-start.sh:1-80`. Why: locks the authoring convention (D-3-1).
- **T3-I-5** — `.claude/settings.json` hook registration is one-block-per-event; matcher pattern is regex/alternation. Source: `.claude/settings.json:31-39`. Why: confirms low-risk integration — adding T3 is a 5-line block addition.

#### External insights

- **T3-E-1** — Official PostToolUse hook input schema includes `tool_name`, `tool_input`, `tool_use_id`, `tool_result`, AND `transcript_path`. Staged at `staging/references/claude-code-posttooluse-hook-schema.md`. Source: `https://code.claude.com/docs/en/hooks`. Why: direct verification of the CP-4.1-β contract — T3 mechanism (c) is fully supported.
- **T3-E-2** — Empirically the transcript JSONL contains a top-level `toolUseResult` field with full subagent telemetry, including usage tokens. Staged at `staging/references/claude-code-transcript-tooluseresult-empirical.md`. Source: empirical inspection 2026-05-23 of the prior session's transcript line 165. Why: closes the verification gate — the richness gap between public `tool_result` and empirical `toolUseResult` is real but not blocking.
- **T3-E-3** — Claude Agent SDK documents `TaskOutput` interface as `{result, usage: {input_tokens, output_tokens}, total_cost_usd?, duration_ms?}` — public-API-stable surface. Staged at `staging/references/claude-code-agent-sdk-task-output.md`. Source: `https://code.claude.com/docs/en/agent-sdk/hooks`. Why: defines the forward-compatibility baseline; defensive `// "fallback"` patterns protect against schema drift.
- **T3-E-4** — `PostToolUse` (not `SubagentStop`) is the right lifecycle event for shell-command hooks. Staged at `staging/references/claude-code-hooks-12-lifecycle-events.md`. Source: `https://claudefa.st/blog/tools/hooks/hooks-guide` + the SDK hooks doc. Why: eliminates `SubagentStop` (SDK-only) as a candidate; PostToolUse + matcher `"Task"` is the right choice.

### T2 — deferred this session

T2's internal + external insights ARE staged at `staging/references/{rbac-matrix-single-source-of-truth, commitlint-required-fields-validator, langgraph-skill-catalog-pattern, autogen-pydantic-tool-schema-validation}.md` (4 references) and documented in Sub-step C findings under § T2. They are PRESERVED as part of this session's research record but are NOT consumed by T1/T3 design. When T2 is picked up from `staging/backlogs/project/item-1-2-skill-loading-discipline.md` in a future session, these references carry over to the next loop's research base.

---

## Scenarios

### T1 scenarios

**Golden**

- **G-1** — Feature session, worktree-first bootstrap, in-session `generate-now` skill ships in PR. The user types `/gobbi`; Configuration Step 1 advances; new row 5.5 creates the worktree; row 6 stamps `git.branch` + `git.worktreePath` non-null; all subsequent agents receive worktree-absolute `cwd`. Preparation `generate-now` writes skill body + symlinks to worktree paths, then `git add` + `git commit` lands them on the worktree branch. PR diff is complete; merge ships intact. Anchors: T1-I-1, T1-I-2, T1-I-3, T1-E-1.
- **G-2** — Session memory ships in the PR squash and lives on develop indefinitely. The squashed commit contains the entire `.gobbi/projects/<name>/sessions/{date}-{ssid}/` tree; worktree removal loses nothing. Anchors: T1-I-5, T1-E-1, T1-E-2.

**Edge**

- **E-1** — Resume / `/clear` / `/compact` mid-session. SessionStart fires; `session-start.sh` re-stamps env; manager re-reads bootstrap order; row 5.5's idempotency guard reads `session.json.git.worktreePath` and skips P2 if non-null + path exists. Anchors: T1-I-2, T1-E-1, T1-E-4.
- **E-2** — Non-feature (investigation / doc-only / mistake-promotion / refactor) session under the uniform lock. Worktree on `chore/`-or-`docs/`-prefixed branch; the only commit may be the session-memory commit (per D-4). User explicitly accepted this uniformity in Scope Contract. Anchors: T1-I-2, T1-E-2 (community caveat), Sub-step A forcing-question 5 counterfactual.
- **E-3** — Wrap-up never reaches PR merge (session aborted). Worktree unmerged; session memory lives in worktree branch's local commits + on-disk tree. User can resume / cherry-pick / discard. D-4 per-iteration commit cadence is the survival mechanism. Anchor: T1-E-2 (rule 3).

**Failure**

- **F-1** — Re-routing inversion: an evaluator with worktree `cwd` writes session memory relative to `cwd` (worktree) — inverted shape of `codex-eval-session-write-path-nested-in-worktree`. Mitigated by D-2 qualified rule. Anchors: T1-I-1, T1-I-4.
- **F-2** — Symlink lands on main tree because the manager runs the symlink-create step from a main-tree shell (resumed session, stale env). Mitigated by D-3's `git -C "$worktreePath" rev-parse --show-toplevel` pattern. Anchors: `1829fa3` witness, T1-I-1, T1-I-3.
- **F-3** — Worktree creation fails at row 5.5 (branch collision, install error). Manager surfaces error via AskUserQuestion; does not advance to row 6; recovery via `git/SKILL.md` P6. Anchor: `git/SKILL.md` P6, T1-I-2.

**Adversarial** — Not security-sensitive (path-routing change, no untrusted input boundary). The `generate-now` skill body's authenticity is governed by the existing user-approval gate (`preparation/SKILL.md`).

### T3 scenarios

**Golden**

- **G-1** — Subagent spawn completes; PostToolUse hook fires; `agents[]` gains a new entry with full telemetry. Hook resolves session.json, reads transcript line by `tool_use_id`, extracts fields via `jq` (two-tier defensive), upserts agents[] by `id`. Anchors: T3-I-1, T3-I-2, T3-I-3, T3-I-4, T3-I-5, T3-E-1, T3-E-2.
- **G-2** — Reconstructor runs at session-end or on-demand; verify-and-fix idempotent. Walks transcript JSONL; upserts agents[] keyed by `id`; reports orphans (warn-only, no delete); atomic-writes. Idempotent — N runs converge. Anchors: T3-I-2, T3-I-4, T3-E-2, T3-DQ-2.

**Edge**

- **E-1** — Subagent spawn fails — PostToolUse vs PostToolUseFailure event. Dual registration; hook records `status: "failed"` with synthetic `id` from `tool_use_id` when `agentId` is null. Anchors: T3-E-4, T3-DQ-3, T3-I-1.
- **E-2** — Hook fires twice for the same `tool_use_id` (rerun, retry). Upsert-by-id with last-write-wins on non-null transcript values; first-write-wins on `startedAt` + `id`. Anchors: T3-DQ-2, `codex-rescue-agent-fire-and-forget-without-result-capture.md`.
- **E-3** — Manager's `agents[0]` seed must not be duplicated. Hook + reconstructor both guard `if agentId == agents[0].id: skip`. Anchors: T3-I-2, T3-DQ-2.
- **E-4** — Worktree-first interaction — hook receives `cwd` which is the worktree under T1. Session-dir resolver uses `$cwd/.gobbi/projects/<name>/sessions/{date}-{ssid-from-session_id}/session.json`. Works for both worktree-first and direct modes. Anchors: T3-I-2, T1-I-2, T3-I-5.

**Failure**

- **F-1** — Hook script crashes / `jq` parse error / transcript not yet flushed. Strict mode + explicit guards; missing fields default via `// null`. Hook does not block Task return. Reconstructor is the recovery mechanism. Anchors: T3-I-4, T3-E-3.
- **F-2** — Schema drift: Claude Code changes `toolUseResult` shape; hook's `jq` silently produces nulls. Mitigated by D-3-1 two-tier extraction (prefer rich; fall back to documented `tool_result`). Anchors: T3-E-3, T3-I-2.
- **F-3** — `$transcript_path` resolution fails (tilde-form in `session.json.transcriptPath` vs absolute in hook stdin). Hook uses absolute `$transcript_path` from stdin directly; reconstructor applies `s|^~|$HOME|` substitution. Anchors: T3-I-5.

**Adversarial** — Not security-sensitive (hook reads its own session's transcript; writes its own `session.json`; no untrusted-input boundary).

---

## Implementation Checklist

Per-task, anchored items — each cites the design decision and source insight. Detailed mechanism deferred to Execution.

### T1 implementation checklist

- **T1-I-T1.a** — Edit `.claude/skills/orchestration/SKILL.md` § Step 1 — Workflow Configuration table: insert new row 5.5 ("Create worktree (P2 wrapper) and stamp `git.worktreePath` for use by row 6") between current row 5 (state.json) and current row 6 (session.json stamp); idempotent guard. Rewrite row 6's existing "leave null until git creates the worktree" text. Anchors: T1-I-2, T1-E-1, D-1.
- **T1-I-T1.b** — Edit `.claude/skills/git/SKILL.md` § Memory Access Matrix row "Session notes / mistakes" + § Critical rule (line 33): qualify the "always main-tree" rule to "use `session.json.git.worktreePath` as the absolute root when set; fall back to main tree when null (direct mode)." Add explicit note that transcript paths live in `~/.claude/projects/...` (outside both trees). Anchors: T1-I-1, T1-I-4, T1-I-5, D-2.
- **T1-I-T1.c** — Edit `.claude/skills/git/SKILL.md` § Procedures — P2 Create worktree: add a one-sentence note that P2 is invoked from Configuration row 5.5 for worktree-first sessions, not from Execution start. Anchors: T1-I-2, T1-E-4.
- **T1-I-T1.d** — Edit `.claude/skills/preparation/SKILL.md` § Core Principles narrow-exception text (line 62): extend the promotion-path sentence to specify the worktree-branch commit (`git -C "$worktreePath" add` + `git -C "$worktreePath" commit` with conventional subject + `AI-Provenance-Record:` trailer). Anchors: T1-I-3, T1-E-2, D-3 (NEW absorbed).
- **T1-I-T1.e** — Edit `.claude/skills/gobbi/SKILL.md` § Session Bootstrap Order: add cross-reference to row 5.5 in `orchestration/SKILL.md`. Anchors: T1-I-2, T1-E-1.
- **T1-I-T1.f** — Append per-iteration session-memory commit cadence to `.claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` MEMORIZATION phase (5 files): each loop's MEMORIZATION procedure gains a one-line "Before exit: `git add` + `git commit` session-memory deltas to the worktree branch with `chore(session): record <loop> iter{n} memory` subject." Anchors: T1-E-2, D-4.
- **T1-I-T1.g** — Confirm direct-mode is preserved as opt-out: row 5.5's "skip if `git.workflow.mode == direct`" guard preserves existing behavior. No code change. Anchors: Sub-step A counterfactual, D-5.
- **T1-I-T1.h** — THIS-session migration note: T1's docs land on develop via the existing direct-or-worktree-pr Execution flow for this session. Add a one-line Wrap-up note flagging this session as the migration boundary. Anchors: Sub-step D § Implementation checklist item 10.

### T3 implementation checklist

- **T3-I-T3.a** — Create `.claude/hooks/post-tool-use-agents.sh` (new file): bash + jq strict mode; shape cloned from `session-start.sh`; resolves session.json via D-3-3 algorithm; two-tier defensive `jq`; upsert agents[] by `id`; atomic write. Anchors: T3-I-4, T3-E-1, T3-E-2, D-3-1.
- **T3-I-T3.b** — Create `.claude/scripts/reconstruct-agents.sh` (new file): bash + jq; takes session-dir path arg; walks transcript JSONL; verify-and-fix upsert; orphan-report only (no delete); idempotent. Anchors: T3-I-2, T3-DQ-2, D-3-2.
- **T3-I-T3.c** — Edit `.claude/settings.json`: add two `hooks` blocks — `PostToolUse` matcher `"Task"` → `.claude/hooks/post-tool-use-agents.sh`; `PostToolUseFailure` matcher `"Task"` → same script (single script handles both via `hook_event_name` branching). Anchors: T3-I-5, T3-E-4, D-3-3.
- **T3-I-T3.d** — Edit `.claude/skills/orchestration/SKILL.md` § Step 1 row 6 + § Workflow Metadata § agents[] subsection: replace manager-manual-append narrative with hook + reconstructor description; cite script paths. Anchors: T3-I-1, T3-I-3, T3-E-1.
- **T3-I-T3.e** — Edit `.claude/skills/delegation/SKILL.md`: document the structured-header convention (`Your phase: <X>`, `Your iteration: <n>`, `Your sub-step: <Y>`) under a new sub-section "Structured prompt metadata headers" near the Load Directives Block. List the canonical regex patterns the hook uses. State headers MUST appear in the first 10 lines of every delegation prompt. Anchors: T3-I-3, T3-DQ-4, D-3-4.
- **T3-I-T3.f** — Stage the `session.template.json.agents[]` `status` field schema extension as a feature-level backlog at `staging/backlogs/feature/schema-extension-agents-status-field.md`. No template edit this session. Anchors: T3-DQ-3, E-1 mitigation, CP-D-1 Recommended.

---

## Design

Directional design decisions per Sub-step D, organized by task. Each decision states the chosen direction, rationale anchored to an insight, trade-off considered, and validation method. Detailed mechanism (function bodies, exact regexes, file-level structure) is deferred to Execution.

### T1 design decisions

**D-1 — Configuration Step 1 row order: insert worktree creation as row 5.5 (between state.json init and session.json stamp); idempotent (skip if `session.json.git.worktreePath` non-null on resume).**

- *Rationale.* Row 6 needs `git.branch` + `git.worktreePath` non-null; worktree creation must precede row 6. Inserting as row 5.5 (rather than promoting to row 5) preserves the existing semantic where `state.json` is initialized first. Idempotency handles resume + `/clear` + `/compact` (SessionStart matcher fires on all four per `.claude/settings.json:34`).
- *Anchored insights.* T1-I-2, T1-E-1, T1-DQ-2.
- *Trade-off considered.* Promote worktree creation to row 5 — rejected (changes more than necessary).
- *Validation.* Future-session smoke test on next `/gobbi` → `jq '.git.worktreePath'` is non-null after Configuration; Evaluator Consistency check on table numerical order; manual migration witness this session.

**D-2 — `git/SKILL.md:33` rule: qualify (do not remove). Session writes use `session.json.git.worktreePath` as root when set; fall back to main tree when null (direct mode). Transcript paths in `~/.claude/projects/...` are outside both trees.**

- *Rationale.* Removing the rule outright would re-open the `codex-eval-session-write-path-nested-in-worktree` failure. Qualifying eliminates the symlink-gap failure (`1829fa3`) and preserves direct-mode + transcript-path handling.
- *Anchored insights.* T1-I-1, T1-I-4, T1-I-5.
- *Trade-off considered.* Remove outright — rejected (inverse failure has a documented witness).
- *Validation.* Evaluator Consistency check (cross-file phrasing alignment); manual `grep -rn "main tree absolute" .claude/skills/` returns ≤ 1 occurrence, all qualified.

**D-3 — NEW absorbed (commit-on-branch for promote-now): `git -C "$worktreePath" add` + `git -C "$worktreePath" commit` runs as closing step of Preparation EXIT promote-now. Subject `chore(skills): promote {slug} generated by preparation iter{n}`. Required `AI-Provenance-Record: gobbi://session/{session-id}/loop/preparation/promote-now` trailer.**

- *Rationale.* T1-I-3 — the narrow exception is already a sole-writer violation; commit-on-branch is the structural completion. `-C "$worktreePath"` is explicit about which tree; subject grammar locked by `git/conventions.md`.
- *Anchored insights.* T1-I-3, T1-E-2, `git/conventions.md` § Commit Trailers, T1-DQ-3.
- *Trade-off considered.* `feat(skills):` — rejected (generated by workflow, not a user feature).
- *Validation.* Future-session smoke test on next `generate-now`: commit subject matches `^chore\(skills\): promote .*`; body contains `AI-Provenance-Record:`. Wrap-up pre-merge gate row.

**D-4 — Per-iteration session-memory commit cadence: each loop's MEMORIZATION step ends with a worktree-branch commit. Subject: `chore(session): record <loop> iter{n} memory`.**

- *Rationale.* Worktree removal at P5 discards uncommitted state; T1-E-2 rule 3 says committed = survives. Cadence = per iteration (matches existing MEMORIZATION runs).
- *Anchored insights.* T1-E-2, T1-I-5, F-3 mitigation, E-3 abort-recovery.
- *Trade-off considered.* Commit-once-at-Wrap-up — rejected (data lost on mid-session abort).
- *Validation.* Future-session smoke test on multi-iteration loop: `git log --oneline` shows subjects matching `^chore\(session\): record .* iter[0-9]+ memory$`. Evaluator Risk perspective on E-3 coverage.

**D-5 — Direct mode preserved as documented opt-out.**

- *Rationale.* Sub-step A counterfactual surfaced "emergency hotfix / pure read-only"; D-5 keeps direct mode as escape hatch. Scope Contract locks worktree-first as *default*, not *mandate*.
- *Anchored insights.* Sub-step A counterfactual / steel-man.
- *Validation.* Evaluator Consistency check: `orchestration/SKILL.md` and `git/SKILL.md` reference `settings.git.workflow.mode` identically.

### T3 design decisions

**D-3-1 — Hook authoring stack: bash + `jq`, modeled on `session-start.sh` (strict mode, writability + nonempty guards, `@sh` shell-safe quoting, defensive `// "fallback"` for forward-compat). Two-tier extraction: prefer rich `toolUseResult` (transcript); fall back to documented `tool_result` (hook stdin).**

- *Rationale.* T3-I-4 — `session-start.sh` is the established precedent; jq is already a hard dependency. Two-tier mitigates T3-E-3 forward-compat without leaving the bash+jq layer.
- *Anchored insights.* T3-I-4, T3-E-3, T3-DQ-1.
- *Trade-off considered.* Node / Python — rejected (new runtime deps; break precedent).
- *Validation.* Evaluator Consistency check (matching shebang + `set -euo pipefail`); single-script verifier on fixture transcript.

**D-3-2 — Reconstructor algorithm: verify-and-fix (upsert by `id`; idempotent; orphan-report only, no delete).**

- *Rationale.* T3-DQ-2 — (c) is robust to empty-and-rebuild + partial-population; idempotent. Orphan-report-only preserves manager seed + user hand-edits.
- *Anchored insights.* T3-DQ-2, T3-I-1, T3-I-2.
- *Trade-off considered.* Scan-and-replace — rejected (deletes manager seed). Append-only — rejected (cannot fix partial-field entries).
- *Validation.* Single-script verifier on 2-state fixture (empty + partial); idempotency double-run.

**D-3-3 — Hook scope: register both `PostToolUse` + `PostToolUseFailure` with matcher `"Task"`; single script handles both (branches on `hook_event_name` / `status`). Failed-spawn entries get `status: "failed"` and synthetic `id` (= `tool_use_id`) when `agentId` is null. Session-dir resolver: `$cwd/.gobbi/projects/<name>/sessions/{date}-{ssid-from-session_id}/session.json` (works for both worktree-first and direct mode).**

- *Rationale.* T3-DQ-3 + E-1 — failed spawns are part of the audit trail. T3-E-4 confirms both events are shell-command-compatible. Single script keeps maintenance burden low.
- *Anchored insights.* T3-E-4, T3-DQ-3, E-1, `codex-rescue-agent-fire-and-forget-without-result-capture.md`.
- *Trade-off considered.* PostToolUse only — rejected (loses failed-spawn audit). Two scripts — rejected (DRY violation).
- *Validation.* Future-session smoke test (artificially fail a spawn); evaluator Risk perspective.

**D-3-4 — Metadata extraction: hybrid — `model` from `tool_input.model`; `step / phase / iter / sub-step` parsed from `tool_input.prompt` via canonical structured headers. Convention codified in `delegation/SKILL.md`. Regex `^Your (phase|iteration|sub-step|step): (.+)$`.**

- *Rationale.* T3-I-3 + T3-DQ-4 — `tool_input.model` is reliable; prompt-text parse works on every existing prompt (headers visible in line 164 + this very brief). Codification ensures future prompts stay extractable.
- *Anchored insights.* T3-I-3, T3-DQ-4, T3-E-2.
- *Trade-off considered.* JSON header comment block — rejected (more invasive). Parse-only without codification — rejected (convention currently implicit; would break silently).
- *Validation.* Evaluator Project perspective on `delegation/SKILL.md` codification; single-script verifier on header parsing; manual `grep -rn '^Your phase:' .claude/skills/orchestration/workflow/`.

### Validation strategy (consolidated)

| Decision | Validation method | Owner | Cadence |
|---|---|---|---|
| D-1 row 5.5 placement | Future-session smoke test + Consistency check | Next session post-merge + Execution-time evaluator | Once next session starts |
| D-2 qualified `git/SKILL.md:33` rule | Consistency check + grep audit | Execution-time evaluator + manager Wrap-up | At PR review |
| D-3 NEW absorbed commit-on-branch | Future-session smoke test + Project perspective + Wrap-up gate row | Next `generate-now` session + Execution-time evaluator | At next Preparation generate-now |
| D-4 per-iteration commit cadence | Multi-iter `git log` subject match + Risk perspective on E-3 + doc grep | Execution-time evaluator + next multi-iter session | Once next multi-iter loop runs |
| D-5 direct-mode preservation | Consistency check across orchestration + git skills | Execution-time evaluator | At PR review |
| D-3-1 bash+jq stack | Consistency check + fixture verifier | Execution-time evaluator + executor | At PR review + fixture test |
| D-3-2 verify-and-fix reconstructor | 2-state fixture verifier + idempotency double-run | Executor | Execution-time + integration test |
| D-3-3 dual-event hook scope | Smoke test on artificial spawn failure + Risk perspective | Next-session manager + Execution-time evaluator | At PR review + on first failed Task call |
| D-3-4 hybrid metadata extraction | Project perspective + fixture verifier + grep audit | Execution-time evaluator + executor | At PR review |

Cross-cutting: per `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`, evaluators MUST whole-file scan each touched skill file after edits — not just changed-line diffs.

---

## Decisions Log

Chronological summary of every AskUserQuestion outcome during DISCUSSION, plus reference + backlog promotion log.

### Sub-step A round 1 (Frame What and Why — initial forcing-question round)

1. **CP-1.3-α — Failure-mode confirmation for Item 1-3.** User confirmed leader's framing (Option Recommended): Preparation/Planning artifacts that should land in PR diff get written to main tree because `cwd` is main tree until Execution. Witness: `1829fa3` symlink gap + executor self-caught misroute.
2. **CP-1.3-γ — Non-feature session scope.** User chose worktree-first for every session (Option A — uniform). Direct mode preserved as opt-out per D-5.
3. **CP-NEW-β — Dependency on Item 1-3.** User confirmed Item NEW dependent on Item 1-3 (Option Recommended) — NEW collapses to a 2-line commit-on-branch addition once worktree-first is locked.
4. **CP-1.2-α — Root-cause hypothesis for Item 1-2 (skill-loading discipline).** User confirmed (D+L) composite (Option Recommended) — docs gap + lazy-load behavior; 3 of 7 promoted mistakes fit this pattern.

### Sub-step A round 2 (Refinement after leader research)

5. **CP-1.3-β — Worktree-first vs alternative collapsing strategies.** User locked worktree-first (Option Recommended); two-surface and symlink-into-worktree alternatives deferred to backlog.
6. **CP-1.2-β — Scope of skill-loading-discipline structural fix.** User locked literal-ask scope: matrix + Load-Directives validator. Broader "delegation contract verifier" deferred to backlog. (Note: T2 itself further deferred at Sub-step D round 1.)
7. **CP-4.1-α — Item 4-1 mechanism.** User confirmed (c) both — PostToolUse hook + shell-script reconstructor (Option Recommended).
8. **CP-4.1-β — Hook contract verification gate.** User authorized Sub-step C to verify the PostToolUse hook payload empirically before design begins (Option Recommended). Verification closed in Sub-step C: contract supports T3 mechanism (c).
9. **CP-4.1-γ — Schema gap check.** User confirmed (Option Recommended) — template schema is sufficient; no template change this session.

### Sub-step B (Lock Scope)

10. **Scope Contract lock.** User locked: feature `session-foundations-bundle-b`; 3 Execution tasks (T1 with NEW absorbed, T2, T3). Non-picked candidates (Codex CI, Item 2-1, chat-mode redesign, alternative collapsing strategies for T1, broader contract verifier for T2) backlogged.

### Sub-step C (Research)

11. **Internal + external insights confirmed.** 5 internal + 4 external insights per task; 12 reference files staged at `staging/references/`. No pushback that overturned any insight. CP-4.1-β contract verification closed with answer: contract supports (c) mechanism.

### Sub-step D round 1 (Design — initial presentation)

12. **T1 session-memory survival option.** User locked (c) — session dir lives in worktree; PR squash absorbs it on merge. Rejected (a) Wrap-up-promotes-before-removal, (b) session-in-main-tree, (d) hybrid.
13. **T2 matrix location (DQ-1) — leader proposed (b) `delegation/SKILL.md`.** User raised concern: "looks ambiguous." User deferred T2 entirely from this session. Post-Sub-step-D scope = T1 + T3 only. T2 backlogged with composite (D+L) analysis preserved.

### Sub-step D round 2 (Design — contribution-point confirmations)

14. **CP-D-1 — Hook + PostToolUseFailure dual registration confirmation.** User confirmed Option Recommended: dual registration this session, `status` field template extension deferred to backlog.
15. **CP-D-2 — Per-iteration session-memory commit subject scope.** User confirmed `chore(session):` (Option Recommended) matching the `sessions/` directory.

### Reference promotion log

Twelve external insights confirmed in Sub-step C and staged as reference files at `staging/references/` (one per insight, slugs deterministic per the insight's primary source):

- T1: `claude-code-worktree-isolation-pattern.md`, `worktree-scope-by-module-not-task.md`, `jj-workspace-isolation-revision-not-branch.md`, `claude-jj-worktree-shim-pattern.md`
- T2 (deferred but preserved): `rbac-matrix-single-source-of-truth.md`, `commitlint-required-fields-validator.md`, `langgraph-skill-catalog-pattern.md`, `autogen-pydantic-tool-schema-validation.md`
- T3: `claude-code-posttooluse-hook-schema.md`, `claude-code-transcript-tooluseresult-empirical.md`, `claude-code-agent-sdk-task-output.md`, `claude-code-hooks-12-lifecycle-events.md`

### Backlog promotion log

Eight backlog files staged in WORK per the deferred lists above:

- Project-level (7): `item-1-2-skill-loading-discipline`, `codex-ci-integration-for-dual-system-eval`, `item-2-1-auto-mode-silence-vs-always-ask`, `chat-mode-tiki-taka-redesign`, `item-1-3-two-surface-collapsing-strategy`, `item-1-3-symlink-into-worktree-alternative`, `item-1-2-broader-delegation-contract-verifier`
- Feature-level (1): `schema-extension-agents-status-field`
