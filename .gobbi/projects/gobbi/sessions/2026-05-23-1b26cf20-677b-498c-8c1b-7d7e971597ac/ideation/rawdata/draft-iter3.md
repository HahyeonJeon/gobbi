---
artifact_type: scope-contract
feature: session-foundations-bundle-b
goal: "Ship 2 session-foundation improvements deferred from prior session 7ea62d36: T1 worktree-first session architecture (with NEW promote-now commit-on-branch absorbed); T3 session.json subagent metadata PostToolUse hook + shell-script reconstructor."
created-by: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created-at: 2026-05-23T19:30:00Z
iter: 3
supersedes: rawdata/draft-iter2.md
revision-of-record: |
  iter1 closed REVISE both systems; iter2 closed FAIL (Claude FAIL + Codex
  REVISE → pessimistic-union FAIL). iter3 is a SURGICAL 3-fix revision
  authorized by the user (AskUserQuestion). Scope strictly bounded to:
  Fix A — replace `session/{date}-{ssid-short}` with
  `chore/session-{date}-{ssid-short}` everywhere (user-locked branch prefix
  using the existing `chore` type from `git/conventions.md:22` registry);
  Fix B — verify `PostToolUseFailure` officially via WebFetch of
  `https://code.claude.com/docs/en/hooks` and preserve verbatim quote
  (closes iter1 P2/O1 + iter2 Claude-evaluator verbatim-quote gap);
  Fix C — flag `.gobbi/project.json` step (i) in D-3-3-resolver as a
  dormant precondition (file does not exist today) + stage a feature-level
  backlog. NO other content changes. Scope Contract / Framed Problem /
  Research Insights (except T3-E-5 augmentation for Fix B) / Sub-step A
  / Sub-step B / Sub-step C / Sub-step D decisions (except D-1 / D-3-3 /
  D-3-3-resolver narrative touches) carry forward verbatim.
---

# Ideation Draft — iter3 (canonical)

Loop: Ideation. Session: `2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac`. Feature: `session-foundations-bundle-b`. iter3 is a surgical revision of iter2 — three locked fixes applied; everything else carried forward verbatim. The 12 staged external reference files at `staging/references/` remain valid; one (`claude-code-posttooluse-hook-schema.md`) is augmented with verbatim `PostToolUseFailure` quotes per Fix B. One new feature-level backlog (`dot-gobbi-project-json-bootstrap.md`) is staged per Fix C.

Source records: Sub-step A findings (`rawdata/sub-step-a-findings-iter1.md`), Sub-step C findings (`rawdata/sub-step-c-findings-iter1.md`), Sub-step D design (`rawdata/sub-step-d-design-iter1.md`), iter1 evaluations (`evaluation/iter1/{claude,codex}/*.md`), iter2 evaluations (`evaluation/iter2/{claude,codex}/*.md`), draft-iter2.md (`rawdata/draft-iter2.md`).

---

## Scope Contract

(Carried forward verbatim from iter2 — no Scope Contract decision was reopened in iter3. The iter1 user locks on T1 worktree-first uniform, T2 deferral, T3 mechanism (c) hook + reconstructor, dual registration, per-iteration commit cadence, and direct mode opt-out all hold.)

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
- **`.gobbi/project.json` bootstrap (NEW iter3 — Fix C)** — `D-3-3-resolver` step (i) reads `$cwd/.gobbi/project.json` as the preferred project-name source. Empirically (2026-05-23) this file does not exist; resolver currently falls through to step (ii). File creation is deferred to a feature-level backlog (`staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`).

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
- **T3 dual registration**: PostToolUse + PostToolUseFailure, single script (CP-D-1 Option Recommended). Both events confirmed as officially supported shell-command hooks per `https://code.claude.com/docs/en/hooks` (fetched 2026-05-23; verbatim quotes preserved in iter3 Fix B; see Decisions Log iter3 fix-decision F-Fix-B).
- **T3 commit subject**: `chore(session): record <loop> iter{n} memory` for per-iteration session-memory commit (CP-D-2 Option Recommended).
- **T1 branch prefix at row 5.5 (iter3 Fix A — user-locked)**: `chore/session-{date}-{ssid-short}` (was `session/{date}-{ssid-short}` in iter2). The `chore` type is in the existing registry (`git/conventions.md:22`); the second component `session-{date}-{ssid-short}` satisfies the description-slug regex and length constraint (`git/conventions.md:21-29,64`). See iter3 fix-decision F-Fix-A.

## Success Criteria

- After T1 lands, the next session starting from `/gobbi` produces `session.json.git.worktreePath` non-null immediately after Configuration (verifiable by `jq`).
- After T1 + NEW absorbed, the next Preparation `generate-now` ships a PR diff containing the skill body AND its `.claude/skills/{slug}` + `.agents/skills/{slug}` symlinks on the worktree branch (no re-occurrence of `1829fa3`-style shipped-broken PR).
- After T3 lands, the next session of N Task spawns has `session.json.agents[]` length ≥ N + 1 (manager + N specialists), with ≥ 90% field population (T3-I-1 + T3-E-2). The denominator for "field population" is the count of the 12 schema fields (`id`, `name`, `type`, `step`, `phase`, `iter`, `model`, `system`, `transcriptPath`, `tokensUsed.{input,output,cacheRead,cacheCreation}`, `startedAt`, `finishedAt`) × N entries; the threshold is met when `< 10%` of those (field × entry) cells are null.
- Failed Task spawns produce an `agents[]` entry with `status: "failed"` and a synthetic id (`tool_use_id`).
- Per-iteration `chore(session): record <loop> iter{n} memory` commits land on the worktree branch and survive abort-mid-session (E-3).
- Concurrent hook fires (≥ 2 parallel Task completions, e.g., dual-system evaluator spawns) leave `session.json.agents[]` with all entries intact — no lost-update regression (R1 mitigation, witness: smoke test specified under D-3-5 validation).

## Deferred

- T2 skill-loading matrix + validator → `staging/backlogs/project/item-1-2-skill-loading-discipline.md`
- Codex CI for dual-system evaluation → `staging/backlogs/project/codex-ci-integration-for-dual-system-eval.md`
- Item 2-1 Auto-mode silence vs Always-Ask → `staging/backlogs/project/item-2-1-auto-mode-silence-vs-always-ask.md`
- Chat-mode tiki-taka redesign → `staging/backlogs/project/chat-mode-tiki-taka-redesign.md`
- Item 1-3 two-surface collapsing strategy → `staging/backlogs/project/item-1-3-two-surface-collapsing-strategy.md`
- Item 1-3 symlink-into-worktree alternative → `staging/backlogs/project/item-1-3-symlink-into-worktree-alternative.md`
- Item 1-2 broader delegation contract verifier → `staging/backlogs/project/item-1-2-broader-delegation-contract-verifier.md`
- `session.template.json.agents[]` `status` field extension → `staging/backlogs/feature/schema-extension-agents-status-field.md`
- `.gobbi/project.json` bootstrap for D-3-3-resolver step (i) → `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` (NEW iter3 Fix C)

---

## Framed Problem

(Carried forward verbatim from iter2 — both T1 and T3 framings hold. The iter3 changes target only the branch-prefix Fix A propagation in Scenarios + Checklist + Design, the Fix B verbatim quotes in Research Insights + Design, and the Fix C dormant-precondition note in Design. Framing untouched.)

### T1 — Worktree-first session architecture (with NEW absorbed)

**Root cause**

The proxy rule "session writes use the main tree's absolute path, never the worktree's" (`git/SKILL.md:33`) collapses two distinct concerns into one path-discipline rule: (a) audit-trail durability of session memory, and (b) reviewability of PR-shipped artifacts. When the rule is applied uniformly, category (b) artifacts (skill bodies, symlinks generated by Preparation `generate-now`) leak to the main tree and miss the PR diff. Witnesses: `1829fa3` commit body ("PR #267 added `.gobbi/projects/gobbi/skills/codex/SKILL.md` but the corresponding `.claude/skills/codex/SKILL.md` + `.agents/skills/codex` symlinks were created in main-tree at Preparation-exit promotion and never landed on the worktree branch"); prior-session `session.json:285` ("Executor's main-tree-vs-worktree misroute (caught + reverted self) recorded as Low-severity discipline observation"). Three workflow phases (Ideation / Preparation / Planning) currently run BEFORE the worktree exists, with `cwd` = main tree — the `cwd` flip happens only at Execution start per `git/SKILL.md:155-161`.

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

Additional steel-man (per iter1 P3 — addressed): read-only investigation / mistake-promotion / doc-lookup sessions pay a worktree + branch + PR-overhead cost for zero shippable change. Counter-evidence: per E-2 the per-iteration session-memory commit IS the audit-trail commit; the PR ships THAT memory to develop's history, which is the intended outcome for every session (Memorization step). The cost is the per-session PR overhead (1 PR per session); user explicitly accepted this uniformity at Sub-step A round 1 (CP-1.3-γ Option A). Acknowledged as a known trade-off, not denied.

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
2. `tokensUsed.{input, output, cacheRead, cacheCreation}` populated for ≥ 90% of entries (denominator = 12 schema fields × N entries; threshold = `< 10%` null cells).
3. The mechanism does not require the manager to remember — it is hooked.
4. Mechanism is robust to session interruption — partial sessions still have populated `agents[]` for spawns that completed.
5. Concurrent hook fires (parallel evaluator spawns) do NOT lose entries (R1 mitigation; see D-3-5).

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

(Carried forward verbatim from iter2. The 12 staged references at `staging/references/` remain unchanged in body except for `claude-code-posttooluse-hook-schema.md` which has been augmented with the verbatim PostToolUseFailure quotes per iter3 Fix B. T3-E-5 entry is updated below to include the verbatim quote inline.)

### T1 — Worktree-first architecture (with NEW absorbed)

#### Internal insights

- **T1-I-1** — The current "session writes always main-tree absolute path" rule is the proxy that exposes the symlink-gap failure. Source: `git/SKILL.md:33`; `1829fa3` commit body. Why: T1's collapses two opposing failure modes by changing `cwd` semantics; the session-memory survival question re-opens for Sub-step D.
- **T1-I-2** — Worktree creation is currently bound to Execution start, not Configuration. Source: `orchestration/workflow/execution.md:30-50`; `git/SKILL.md:155-161`; `orchestration/SKILL.md:103`. Why: relocation to row 5.5 is mechanical (row insertion + `git.worktreePath` stamp move).
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
- **T3-I-3** — `step / phase / iter / model` are NOT in `toolUseResult` (the result side) — but `model` IS in `tool_input.model` (the input side) and `step / phase / iter / sub-step` ARE in `tool_input.prompt` as structured headers (per the empirical line 164 inspection — the leader prompt's opening lines include "Your phase: <X>", "Your iteration: <n>", "Your sub-step: <Y>"). Source: same empirical inspection. Why: surfaces D-3-4 — hybrid extraction strategy from the INPUT side of the same hook-stdin payload (not from `toolUseResult` which is the result side).
- **T3-I-4** — `.claude/hooks/session-start.sh` is the precedent — bash-with-jq pattern. Source: `.claude/hooks/session-start.sh:1-80`. Why: locks the authoring convention (D-3-1).
- **T3-I-5** — `.claude/settings.json` hook registration is one-block-per-event; matcher pattern is regex/alternation. Source: `.claude/settings.json:30-40`. Why: confirms low-risk integration — adding T3 is a 5-line block addition.

#### External insights

- **T3-E-1** — Official PostToolUse hook input schema includes `tool_name`, `tool_input`, `tool_use_id`, `tool_result`, AND `transcript_path`. Staged at `staging/references/claude-code-posttooluse-hook-schema.md`. Source: `https://code.claude.com/docs/en/hooks`. Why: direct verification of the CP-4.1-β contract — T3 mechanism (c) is fully supported.
- **T3-E-2** — Empirically the transcript JSONL contains a top-level `toolUseResult` field with full subagent telemetry, including usage tokens. Staged at `staging/references/claude-code-transcript-tooluseresult-empirical.md`. Source: empirical inspection 2026-05-23 of the prior session's transcript line 165. Why: closes the verification gate — the richness gap between public `tool_result` and empirical `toolUseResult` is real but not blocking.
- **T3-E-3** — Claude Agent SDK documents `TaskOutput` interface as `{result, usage: {input_tokens, output_tokens}, total_cost_usd?, duration_ms?}` — public-API-stable surface. Staged at `staging/references/claude-code-agent-sdk-task-output.md`. Source: `https://code.claude.com/docs/en/agent-sdk/hooks`. Why: defines the forward-compatibility baseline; defensive `// "fallback"` patterns protect against schema drift.
- **T3-E-4** — `PostToolUse` (not `SubagentStop`) is the right lifecycle event for shell-command hooks. Staged at `staging/references/claude-code-hooks-12-lifecycle-events.md`. Source: `https://claudefa.st/blog/tools/hooks/hooks-guide` + the SDK hooks doc. Why: eliminates `SubagentStop` (SDK-only) as a candidate; PostToolUse + matcher `"Task"` is the right choice.
- **T3-E-5 (UPDATED iter3 — Fix B)** — `PostToolUseFailure` IS officially documented as a shell-command-supported hook event at `https://code.claude.com/docs/en/hooks` (WebFetched 2026-05-23). Verbatim quote from the lifecycle table: `| PostToolUseFailure | After a tool call fails |`. Verbatim quote from the exit-code behavior table: `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`. The event is non-blocking — exit code 2 surfaces stderr to Claude without preventing the underlying tool failure. Shell-command (`type: "command"`) hook registration is explicitly supported, alongside HTTP, MCP-tool, prompt, and agent hooks. The page lists 31 hook events total (including `PostToolUseFailure` at #9). Staged reference (augmented this iter): `staging/references/claude-code-posttooluse-hook-schema.md` now carries the verbatim quotes. Why: closes iter1 P2/O1 + iter2 Claude-evaluator gap (network-policy-blocked WebFetch). D-3-3 dual registration is retained, now grounded in the official-doc verbatim quote.

### T2 — deferred this session

T2's internal + external insights ARE staged at `staging/references/{rbac-matrix-single-source-of-truth, commitlint-required-fields-validator, langgraph-skill-catalog-pattern, autogen-pydantic-tool-schema-validation}.md` (4 references) and documented in Sub-step C findings under § T2. They are PRESERVED as part of this session's research record but are NOT consumed by T1/T3 design. When T2 is picked up from `staging/backlogs/project/item-1-2-skill-loading-discipline.md` in a future session, these references carry over to the next loop's research base.

---

## Scenarios

(Carried forward verbatim from iter2 with the iter3 Fix A branch-prefix propagation applied to G-1 and E-2.)

### T1 scenarios

**Golden**

- **G-1 (UPDATED iter3 — Fix A)** — Feature session, worktree-first bootstrap, in-session `generate-now` skill ships in PR. The user types `/gobbi`; Configuration Step 1 advances; new row 5.5 creates the worktree (branch `chore/session-{date}-{ssid-short}` per D-1 iter3-Fix-A lock); row 6 stamps `git.branch` + `git.worktreePath` non-null; all subsequent agents receive worktree-absolute `cwd`. Preparation `generate-now` writes skill body + symlinks to worktree paths, then `git add` + `git commit` lands them on the worktree branch with the canonical `AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}` trailer (per D-3 finding 2 lock). PR diff is complete; merge ships intact. Anchors: T1-I-1, T1-I-2, T1-I-3, T1-E-1.
- **G-2** — Session memory ships in the PR squash and lives on develop indefinitely. The squashed commit contains the entire `.gobbi/projects/<name>/sessions/{date}-{ssid}/` tree; worktree removal loses nothing. Anchors: T1-I-5, T1-E-1, T1-E-2.

**Edge**

- **E-1** — Resume / `/clear` / `/compact` mid-session. SessionStart fires; `session-start.sh` re-stamps env; manager re-reads bootstrap order; row 5.5's idempotency guard reads `session.json.git.worktreePath` and skips P2 if non-null + path exists. Anchors: T1-I-2, T1-E-1, T1-E-4.
- **E-2 (UPDATED iter3 — Fix A)** — Non-feature (investigation / doc-only / mistake-promotion / refactor) session under the uniform lock. Worktree on `chore/session-{date}-{ssid-short}`-prefixed branch (per D-1 iter3-Fix-A lock); the only commit may be the session-memory commit (per D-4). User explicitly accepted this uniformity in Scope Contract (Sub-step A CP-1.3-γ Option A). Anchors: T1-I-2, T1-E-2 (community caveat), Sub-step A forcing-question 5 counterfactual.
- **E-3** — Wrap-up never reaches PR merge (session aborted). Worktree unmerged; session memory lives in worktree branch's local commits + on-disk tree. User can resume / cherry-pick / discard. D-4 per-iteration commit cadence is the survival mechanism. Anchor: T1-E-2 (rule 3).

**Failure**

- **F-1** — Re-routing inversion: an evaluator with worktree `cwd` writes session memory relative to `cwd` (worktree) — inverted shape of `codex-eval-session-write-path-nested-in-worktree`. Mitigated by D-2 qualified rule. Anchors: T1-I-1, T1-I-4.
- **F-2** — Symlink lands on main tree because the manager runs the symlink-create step from a main-tree shell (resumed session, stale env). Mitigated by D-3's `git -C "$worktreePath" rev-parse --show-toplevel` pattern. Anchors: `1829fa3` witness, T1-I-1, T1-I-3.
- **F-3** — Worktree creation fails at row 5.5 (branch collision, install error). Manager surfaces error via AskUserQuestion; does not advance to row 6; recovery via `git/SKILL.md` P6. Anchor: `git/SKILL.md` P6, T1-I-2.
- **F-4 (UPDATED iter3 — Fix A propagation; semantics preserved from iter2)** — Partial promotion failure: skill body copy succeeds but `git add` or `git commit` fails (gitignore conflict, no staged changes, signing failure) on the worktree branch (now `chore/session-{date}-{ssid-short}` per D-1 iter3-Fix-A lock). Recovery: D-3 specifies the manager removes the copied file from the worktree AND surfaces to user via AskUserQuestion before re-attempting. Without this rollback the worktree would carry an uncommitted file that loads in-session but misses the PR — recreating `1829fa3`. Anchors: iter1 R2 finding, `1829fa3` witness.

**Adversarial** — Not security-sensitive (path-routing change, no untrusted input boundary). The `generate-now` skill body's authenticity is governed by the existing user-approval gate (`preparation/SKILL.md`).

### T3 scenarios

**Golden**

- **G-1** — Subagent spawn completes; PostToolUse hook fires; `agents[]` gains a new entry with full telemetry. Hook resolves session.json via D-3-3 resolver, acquires `flock -x` on `session.json` (D-3-5), reads transcript line by D-3-6 correlation key, extracts fields via `jq` (two-tier defensive), upserts agents[] by `id`, releases lock. Anchors: T3-I-1, T3-I-2, T3-I-3, T3-I-4, T3-I-5, T3-E-1, T3-E-2.
- **G-2** — Reconstructor runs at session-end or on-demand; verify-and-fix idempotent. Walks transcript JSONL; acquires `flock -x` on `session.json` (D-3-5); upserts agents[] keyed by `id`; reports orphans (warn-only, no delete); atomic-writes; releases lock. Idempotent — N runs converge. Anchors: T3-I-2, T3-I-4, T3-E-2, T3-DQ-2.

**Edge**

- **E-1** — Subagent spawn fails — PostToolUse vs PostToolUseFailure event. Dual registration (verified per T3-E-5); hook records `status: "failed"` with synthetic `id` from `tool_use_id` when `agentId` is null. Anchors: T3-E-4, T3-E-5, T3-DQ-3, T3-I-1.
- **E-2** — Hook fires twice for the same `tool_use_id` (rerun, retry). Upsert-by-id with last-write-wins on non-null transcript values; first-write-wins on `startedAt` + `id`. Anchors: T3-DQ-2, `codex-rescue-agent-fire-and-forget-without-result-capture.md`.
- **E-3** — Manager's `agents[0]` seed must not be duplicated. Hook + reconstructor both guard `if agentId == agents[0].id: skip`. Anchors: T3-I-2, T3-DQ-2.
- **E-4** — Worktree-first interaction — hook receives `cwd` which is the worktree under T1. Session-dir resolver uses the D-3-3 algorithm — project-name lookup precedence: `(i)` read `$cwd/.gobbi/project.json`'s `name` field if file exists; `(ii)` fall back to scanning `$cwd/.gobbi/projects/` and selecting the single directory if exactly one exists. Date prefix lookup: scan `$cwd/.gobbi/projects/<name>/sessions/` for the directory ending in `-<session_id>` substring match. Works for both worktree-first and direct modes. Anchors: T3-I-2, T1-I-2, T3-I-5.
- **E-5** — Two Task spawns complete near-simultaneously (e.g., dual-system evaluators); both PostToolUse hooks fire concurrently. Without serialization, hook A reads `session.json` → hook B reads `session.json` → A appends → A writes → B appends to its stale read → B writes (clobbering A's append). With D-3-5 (POSIX `flock -x` on `session.json`), hook B blocks on the lock until hook A's read-modify-write completes; B then reads the updated `agents[]` containing A's entry and appends its own. Result: both entries land. Anchors: iter1 R1 finding, COD-STRUCT-002, `delegation/SKILL.md:51` + `:220` (parallel evaluator topology), D-3-5.

**Failure**

- **F-1** — Hook script crashes / `jq` parse error / transcript not yet flushed. Strict mode + explicit guards; missing fields default via `// null`. Hook does not block Task return. Reconstructor is the recovery mechanism. Anchors: T3-I-4, T3-E-3.
- **F-2** — Schema drift: Claude Code changes `toolUseResult` shape; hook's `jq` silently produces nulls. Mitigated by D-3-1 two-tier extraction (prefer rich; fall back to documented `tool_result`). Anchors: T3-E-3, T3-I-2.
- **F-3** — `$transcript_path` resolution fails (tilde-form in `session.json.transcriptPath` vs absolute in hook stdin). Hook uses absolute `$transcript_path` from stdin directly; reconstructor applies `s|^~|$HOME|` substitution. Anchors: T3-I-5.

**Adversarial** — Not security-sensitive (hook reads its own session's transcript; writes its own `session.json`; no untrusted-input boundary).

### Cross-task scenarios

- **G-3** — Joint end-to-end validation in the first post-merge session: `jq '.git.worktreePath' session.json` returns non-null AND `jq '.agents | length' session.json` returns ≥ 2 (manager seed + the first leader / executor spawn the next session performs). Witness: a single smoke-test command run by the user / manager at the first post-merge session's Memorization phase. Anchors: D-1, D-3-3, iter1 O2 finding.

---

## Implementation Checklist

Per-task, anchored items — each cites the design decision and source insight. Detailed mechanism deferred to Execution. iter3 changes are flagged inline.

### T1 implementation checklist

- **T1-I-T1.a (UPDATED iter3 — Fix A)** — Edit `.claude/skills/orchestration/SKILL.md` § Step 1 — Workflow Configuration table: insert new row 5.5 ("Create worktree (P2 wrapper) and stamp `git.worktreePath` for use by row 6") between current row 5 (state.json) and current row 6 (session.json stamp); idempotent guard. Branch name at creation is `chore/session-{date}-{ssid-short}` (per D-1 iter3-Fix-A lock; uses the `chore` type from the existing `git/conventions.md:22` registry; rename to feature-scoped name is a follow-up only, not in scope). Rewrite row 6's existing "leave null until git creates the worktree" text. Anchors: T1-I-2, T1-E-1, D-1, `git/conventions.md:22` (type registry — whole-file scanned iter3).
- **T1-I-T1.b** — Edit `.claude/skills/git/SKILL.md` § Memory Access Matrix row "Session notes / mistakes" + § Critical rule (line 33): qualify the "always main-tree" rule to "use `session.json.git.worktreePath` as the absolute root when set; fall back to main tree when null (direct mode)." Add explicit note that transcript paths live in `~/.claude/projects/...` (outside both trees). Anchors: T1-I-1, T1-I-4, T1-I-5, D-2.
- **T1-I-T1.c** — Edit `.claude/skills/git/SKILL.md` § Procedures — P2 Create worktree: add a one-sentence note that P2 is invoked from Configuration row 5.5 for worktree-first sessions, not from Execution start. Anchors: T1-I-2, T1-E-4.
- **T1-I-T1.d** — Edit `.claude/skills/preparation/SKILL.md` § Core Principles narrow-exception text (line 62): extend the promotion-path sentence to specify the worktree-branch commit (`git -C "$worktreePath" add` + `git -C "$worktreePath" commit` with conventional subject + required `AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}` trailer, where `{task-id}` = `preparation-promote-now-iter{n}` — the workflow-generated task slug for this promotion). Anchors: T1-I-3, T1-E-2, D-3 (NEW absorbed), `git/conventions.md:118` (canonical trailer form — freshly verified iter2 + re-verified iter3).
- **T1-I-T1.e** — Edit `.claude/skills/gobbi/SKILL.md` § Session Bootstrap Order: add cross-reference to row 5.5 in `orchestration/SKILL.md`. Anchors: T1-I-2, T1-E-1.
- **T1-I-T1.f** — Append per-iteration session-memory commit cadence to `.claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` MEMORIZATION phase (5 files): each loop's MEMORIZATION procedure gains a one-line "Before exit: `git add` + `git commit` session-memory deltas to the worktree branch with `chore(session): record <loop> iter{n} memory` subject." Anchors: T1-E-2, D-4.
- **T1-I-T1.g** — Confirm direct-mode is preserved as opt-out: row 5.5's "skip if `git.workflow.mode == direct`" guard preserves existing behavior. No code change. Anchors: Sub-step A counterfactual, D-5.
- **T1-I-T1.h (UPDATED iter3 — Fix A propagation)** — THIS-session migration note: T1's docs land on develop via the existing direct-or-worktree-pr Execution flow for this session. Add a one-line Wrap-up note flagging this session as the migration boundary. Concrete smoke test gate (per iter1 P4): immediately after the merge, run `jq '.git.branch' .gobbi/projects/gobbi/sessions/<latest>/session.json` on the next session and verify the result matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`; also `jq '.git.worktreePath'` returns non-null. Anchors: Sub-step D § Implementation checklist item 10, iter1 P4, D-1 iter3-Fix-A regex.
- **T1-I-T1.i** — Edit `.claude/skills/delegation/SKILL.md`: grep for any hardcoded "main-tree absolute path" boilerplate in the Load Directives Block or delegation-prompt templates; if found, qualify with the same rule as D-2 (use `session.json.git.worktreePath` when set). Verify by `grep -n 'main tree absolute' .claude/skills/delegation/SKILL.md` returning ≤ 1 match, qualified. Anchors: D-2 validation method, iter1 C2.
- **T1-I-T1.j** — Add explicit rollback semantics to the `preparation/SKILL.md` narrow-exception (T1-I-T1.d) text: if `git commit` fails after the file copy, the manager MUST `git -C "$worktreePath" rm` the copied file before surfacing to user via AskUserQuestion. Anchors: F-4, iter1 R2.

### T3 implementation checklist

- **T3-I-T3.a** — Create `.claude/hooks/post-tool-use-agents.sh` (new file): bash + jq strict mode; shape cloned from `session-start.sh`; resolves session.json via D-3-3 algorithm; acquires `flock -x <session.json>` per D-3-5 BEFORE read; two-tier defensive `jq`; upsert agents[] by `id` using D-3-6 correlation key; atomic write; releases lock. Anchors: T3-I-4, T3-E-1, T3-E-2, D-3-1, D-3-5, D-3-6.
- **T3-I-T3.b** — Create `.claude/scripts/reconstruct-agents.sh` (new file): bash + jq; takes session-dir path arg; walks transcript JSONL; acquires `flock -x <session.json>` per D-3-5 BEFORE read; verify-and-fix upsert; orphan-report only (no delete); idempotent; releases lock. Anchors: T3-I-2, T3-DQ-2, D-3-2, D-3-5.
- **T3-I-T3.c (UPDATED iter3 — Fix B verbatim grounding)** — Edit `.claude/settings.json`: add two `hooks` blocks — `PostToolUse` matcher `"Task"` → `.claude/hooks/post-tool-use-agents.sh`; `PostToolUseFailure` matcher `"Task"` → same script (single script handles both via `hook_event_name` branching). `PostToolUseFailure` is officially supported per `https://code.claude.com/docs/en/hooks` (WebFetched 2026-05-23 iter3): lifecycle-table verbatim `| PostToolUseFailure | After a tool call fails |`; exit-code-behavior verbatim `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`. Anchors: T3-I-5, T3-E-4, T3-E-5 (iter3-augmented verbatim), D-3-3.
- **T3-I-T3.d** — Edit `.claude/skills/orchestration/SKILL.md` § Step 1 row 6 + § Workflow Metadata § agents[] subsection: replace manager-manual-append narrative with hook + reconstructor description; cite script paths. Anchors: T3-I-1, T3-I-3, T3-E-1.
- **T3-I-T3.e** — Edit `.claude/skills/delegation/SKILL.md`: document the structured-header convention (`Your phase: <X>`, `Your iteration: <n>`, `Your sub-step: <Y>`) under a new sub-section "Structured prompt metadata headers" near the Load Directives Block. List the canonical regex patterns the hook uses. State headers MUST appear in the first 10 lines of every delegation prompt. Document explicitly: `step/phase/iter/sub-step` come from the **input side** of the hook stdin payload (`tool_input.prompt` structured headers + `tool_input.model`); `toolUseResult` (the **result side**) is consulted ONLY for output telemetry (`agentId`, `usage.*`, `totalDurationMs`, `toolStats`). Add a migration paragraph: existing prompts that lack the headers will produce `null` for `step/phase/iter` in `agents[]` until the next prompt-template refresh. Anchors: T3-I-3, T3-DQ-4, D-3-4, iter1 COD-CONS, iter1 COD-USAGE-004.
- **T3-I-T3.f** — Stage the `session.template.json.agents[]` `status` field schema extension as a feature-level backlog at `staging/backlogs/feature/schema-extension-agents-status-field.md`. No template edit this session. Anchors: T3-DQ-3, E-1 mitigation, CP-D-1 Recommended.
- **T3-I-T3.g** — Document the serialization primitive (`flock -x` on `session.json`) in `delegation/SKILL.md`'s structured-headers sub-section AND in the hook's leading comment block. Specify the lock file is `session.json` itself (Linux/macOS `flock(2)` operates on the file's open descriptor; the script opens the file with `exec {fd}>>"$session_json"` and runs `flock -x "$fd"`). Lock is RELEASED automatically when the script's process exits (per flock(2) semantics). Anchors: D-3-5, iter1 R1, iter1 COD-STRUCT-002.
- **T3-I-T3.h (NEW iter3 — Fix C)** — Acknowledge the dormant precondition `.gobbi/project.json` in the D-3-3-resolver narrative (D-3-3-resolver step (i) annotation below). Stage a feature-level backlog at `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` describing two pickup paths (in-Execution single-file write, or defer to a future session). No `.gobbi/project.json` write this session. Anchors: D-3-3-resolver step (i) dormant-precondition note, empirical `ls .gobbi/project.json` (no such file) 2026-05-23.

### Process / docs

- **CL-1** — Add a one-paragraph reconciliation note in the iter2 Wrap-up (and in `gobbi/SKILL.md`'s Memory Access Matrix as a follow-up note) explaining the `.claude/skills/` vs `.agents/skills/` vs `.gobbi/projects/gobbi/skills/` path surfaces. Claude-runtime-facing files live under `.claude/skills/`; Codex-runtime + plugin-facing skills live under `.gobbi/projects/gobbi/skills/` with `.agents/skills/{slug}` symlinks pointing into them. T1 + T3's implementation checklist intentionally targets the `.claude/skills/` surface because every edit is a Claude-runtime skill-doc change (workflow / orchestration / git / preparation / delegation are Claude-runtime skills, not plugin-mirrored Codex skills). NOTE: this is a clarifying doc-sync note, not a re-scoping — the Scope Contract above remains accurate; iter2 just makes the path-vocabulary rationale explicit.

---

## Design

Directional design decisions per Sub-step D, organized by task. Each decision states the chosen direction, rationale anchored to an insight, trade-off considered, and validation method. Detailed mechanism (function bodies, exact regexes, file-level structure) is deferred to Execution. iter3 changes are flagged inline.

### T1 design decisions

**D-1 (UPDATED iter3 — Fix A) — Configuration Step 1 row order: insert worktree creation as row 5.5 (between state.json init and session.json stamp); idempotent (skip if `session.json.git.worktreePath` non-null on resume). Branch name at creation is `chore/session-{date}-{ssid-short}` — uses the `chore` type from the existing `git/conventions.md:22` registry, with `session-{date}-{ssid-short}` as the description-slug second component.**

- *Rationale.* Row 6 needs `git.branch` + `git.worktreePath` non-null; worktree creation must precede row 6. Inserting as row 5.5 (rather than promoting to row 5) preserves the existing semantic where `state.json` is initialized first. Idempotency handles resume + `/clear` + `/compact` (SessionStart matcher fires on all four per `.claude/settings.json:30-40`). **iter3 Fix A user lock**: iter2 used `session/{date}-{ssid-short}` which uses an unregistered type prefix `session/`. The registry at `git/conventions.md:22` enumerates only `feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style`. User selected (a) `chore/session-{date}-{ssid-short}` to use the existing `chore` type. **Whole-file scan of `git/conventions.md` (iter3)** confirms compliance: (1) line 22 regex `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$` — `chore` matches the type alternation; no leading `\d+-` issue branch number applies; description slug `session-{date}-{ssid-short}` matches `[a-z0-9]+(-[a-z0-9]+)*` (segments `session`, `2026`, `05`, `23`, `1b26cf20` — each `[a-z0-9]+`). (2) Line 64 description-slug length check 3-50 chars: `session-2026-05-23-1b26cf20` is 27 chars (PASS). (3) Type label exists in the registry table at line 261 (`chore | #e4e669`).
- *Anchored insights.* T1-I-2, T1-E-1, T1-DQ-2; iter1 COD-PROJ-001; `git/conventions.md:22` (regex), `:64` (length rule), `:261` (label color); whole-file scan iter3.
- *Trade-off considered.* (b) `feat/session-{date}-{ssid-short}` — rejected: `feat` implies a new product feature; session bootstrap is not a feature. (c) Defer to Sub-step B end — rejected: reopens row 5.5 Scope Contract lock. iter2's `session/{date}-{ssid-short}` — rejected by iter3 because `session/` is not in the registry (Codex COD-PROJ-001 finding regression).
- *Validation.* Future-session smoke test on next `/gobbi` → `jq '.git.branch'` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`; Evaluator Consistency check on table numerical order; manual migration witness this session.

**D-2 — `git/SKILL.md:33` rule: qualify (do not remove). Session writes use `session.json.git.worktreePath` as root when set; fall back to main tree when null (direct mode). Transcript paths in `~/.claude/projects/...` are outside both trees.**

- *Rationale.* Removing the rule outright would re-open the `codex-eval-session-write-path-nested-in-worktree` failure. Qualifying eliminates the symlink-gap failure (`1829fa3`) and preserves direct-mode + transcript-path handling.
- *Anchored insights.* T1-I-1, T1-I-4, T1-I-5.
- *Trade-off considered.* Remove outright — rejected (inverse failure has a documented witness).
- *Validation.* Evaluator Consistency check (cross-file phrasing alignment); manual `grep -rn "main tree absolute" .claude/skills/` returns ≤ 1 occurrence, all qualified. PLUS: `grep -n 'main tree absolute' .claude/skills/delegation/SKILL.md` returns ≤ 1 (qualified) — see T1-I-T1.i.

**D-3 — NEW absorbed (commit-on-branch for promote-now): `git -C "$worktreePath" add` + `git -C "$worktreePath" commit` runs as closing step of Preparation EXIT promote-now. Subject `chore(skills): promote {slug} generated by preparation iter{n}`. Required `AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}` trailer per `git/conventions.md:118` canonical form, with `{task-id}` = `preparation-promote-now-iter{n}` (the workflow-generated task slug for the promotion). Partial-failure rollback: if `git commit` fails post-copy, manager `git -C "$worktreePath" rm` the copied file and AskUserQuestion before re-attempt (per T1-I-T1.j / F-4).**

- *Rationale.* T1-I-3 — the narrow exception is already a sole-writer violation; commit-on-branch is the structural completion. `-C "$worktreePath"` is explicit about which tree; subject grammar locked by `git/conventions.md`. iter2-locked: `git/conventions.md:118` reads "`AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}`" with example "`AI-Provenance-Record: gobbi://session/2026-05-20-abc123/task/03-add-cache-layer`" (re-verified iter3 whole-file scan). The corrected form uses `task/` not `loop/`; the task slug is the workflow-generated promotion identifier. Rollback semantics added per iter1 R2 to close F-4.
- *Anchored insights.* T1-I-3, T1-E-2, `git/conventions.md:118` (freshly verified iter2 + re-verified iter3 whole-file), T1-DQ-3, iter1 P1/C1, iter1 R2.
- *Trade-off considered.* `feat(skills):` — rejected (generated by workflow, not a user feature). Alternative trailer form (extend conventions.md) — rejected: requires a separate Scope Contract item; current task-id slot is expressive enough.
- *Validation.* Future-session smoke test on next `generate-now`: commit subject matches `^chore\(skills\): promote .*`; body contains `AI-Provenance-Record: gobbi://session/[a-f0-9-]+/task/preparation-promote-now-iter[0-9]+`. Wrap-up pre-merge gate row.

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

(Hook authoring incorporates the D-3-5 serialization primitive as a mandatory step before read.)

- *Rationale.* T3-I-4 — `session-start.sh` is the established precedent; jq is already a hard dependency. Two-tier mitigates T3-E-3 forward-compat without leaving the bash+jq layer. Bash's native `flock(1)` is available on every Linux/macOS host (already used by `git/conventions` and `git` CLI internally), so D-3-5 fits the stack with no new dependency.
- *Anchored insights.* T3-I-4, T3-E-3, T3-DQ-1, D-3-5.
- *Trade-off considered.* Node / Python — rejected (new runtime deps; break precedent).
- *Validation.* Evaluator Consistency check (matching shebang + `set -euo pipefail`); single-script verifier on fixture transcript; concurrent-fire smoke test (D-3-5 validation).

**D-3-2 — Reconstructor algorithm: verify-and-fix (upsert by `id`; idempotent; orphan-report only, no delete).**

(Reconstructor also acquires `flock -x` per D-3-5 before its read-modify-write cycle.)

- *Rationale.* T3-DQ-2 — (c) is robust to empty-and-rebuild + partial-population; idempotent. Orphan-report-only preserves manager seed + user hand-edits. Serialization via D-3-5 ensures reconstructor's verify-and-fix does not race against an in-flight PostToolUse hook on the same `session.json`.
- *Anchored insights.* T3-DQ-2, T3-I-1, T3-I-2, D-3-5.
- *Trade-off considered.* Scan-and-replace — rejected (deletes manager seed). Append-only — rejected (cannot fix partial-field entries).
- *Validation.* Single-script verifier on 2-state fixture (empty + partial); idempotency double-run; reconstructor-during-hook-fire smoke test (D-3-5).

**D-3-3 (UPDATED iter3 — Fix B verbatim grounding) — Hook scope: register both `PostToolUse` + `PostToolUseFailure` with matcher `"Task"`; single script handles both (branches on `hook_event_name` / `status`). Failed-spawn entries get `status: "failed"` and synthetic `id` (= `tool_use_id`) when `agentId` is null.**

Session-dir resolver algorithm (per D-3-3-resolver below).

- *Rationale.* T3-DQ-3 + E-1 — failed spawns are part of the audit trail. **`PostToolUseFailure` officially documented** as a shell-command-supported hook event at `https://code.claude.com/docs/en/hooks` (WebFetched 2026-05-23 iter3). Verbatim quote from the lifecycle table: `| PostToolUseFailure | After a tool call fails |`. Verbatim quote from the exit-code-behavior table: `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`. The page enumerates 31 hook events; `PostToolUseFailure` appears at position #9. Single script keeps maintenance burden low.
- *Anchored insights.* T3-E-4, T3-E-5 (iter3 verbatim verification), T3-DQ-3, E-1, `codex-rescue-agent-fire-and-forget-without-result-capture.md`, `staging/references/claude-code-posttooluse-hook-schema.md` (augmented iter3).
- *Trade-off considered.* PostToolUse only — rejected (loses failed-spawn audit; official-doc verbatim quote eliminates the iter1 "only community-attested" and iter2 "no verbatim quote" objections). Two scripts — rejected (DRY violation).
- *Validation.* Future-session smoke test (artificially fail a spawn — e.g., pass an invalid `subagent_type`; verify `agents[]` gains a `status: "failed"` entry); evaluator Risk perspective.

**D-3-3-resolver (UPDATED iter3 — Fix C dormant-precondition note) — Session-dir resolver algorithm.**

The hook's stdin contains `session_id`, `transcript_path`, and `cwd` (per `session-start.sh:13-25` precedent). The session.json path is at `$cwd/.gobbi/projects/<project-name>/sessions/{date}-<session_id>/session.json`. The resolver derives the two missing pieces (`<project-name>` and `{date}`) as follows:

1. **Project name lookup precedence**:
   - **(i — preferred)** Read `$cwd/.gobbi/project.json` and extract the `name` field if the file exists.
     - **Dormant precondition (iter3 Fix C)**: this file **does not exist** in the repo today (verified empirically: `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` returns "No such file or directory" as of 2026-05-23). The resolver currently always falls through to step (ii). Step (i) is documented as the canonical preferred path for forward-compatibility — once the file is created, the resolver activates step (i) without code change. **Backlog filed (iter3 Fix C)** at `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` describing two pickup paths: (1) in-Execution single-file write of `{"name": "gobbi"}` (folds into T3-I-T3.c bootstrap step); (2) defer to a future session. Either path is valid; the resolver remains correct because step (ii) is sufficient while exactly one project directory exists.
   - **(ii — fallback, currently the only working path)** Enumerate `$cwd/.gobbi/projects/` and select the single directory if exactly one exists; if zero or multiple, exit non-zero with stderr `"session-dir resolver: cannot disambiguate project name (n=<count>)"` (reconstructor recovers).
2. **Date prefix lookup**:
   - Scan `$cwd/.gobbi/projects/<project-name>/sessions/` for a directory whose name ends with `-<session_id>` (e.g., `2026-05-23-1b26cf20-...`); take its full directory name as the date-prefixed session ID. If zero or multiple matches, exit non-zero with stderr `"session-dir resolver: cannot disambiguate session dir (n=<count>)"`.
3. The resolved path is `$cwd/.gobbi/projects/<project-name>/sessions/<full-dir-name>/session.json`. Existence check: if the file does not exist, exit non-zero (the manager has not yet stamped `session.json` — reconstructor recovers).

- *Rationale.* iter1 COD-STRUCT-001 + COD-USAGE-002 + COD-RISK-002 flagged that the resolver was underspecified. The official hook contract (`session-start.sh:13-25` precedent) provides `session_id` + `cwd` only; project name and date prefix must be derived. Three options were available per the iter2 brief (project-name: (i) scan `.gobbi/projects/`, (ii) read `project.json`, (iii) extract from `git remote get-url origin`). Picked **(ii) + (i) fallback** in iter2 because: `project.json` is the canonical project pointer when it exists; the directory scan provides a robust fallback for projects that haven't yet stamped it. For the date prefix: picked **(b) sessions-scan** because it does not depend on clock-correctness (option (a) `date +%Y-%m-%d` can be wrong if session crosses midnight; option (c) reads `session.json` which is the file we're trying to find — circular). **iter3 Fix C** adds the dormant-precondition note so future evaluators and the executor see explicitly that step (i) cannot fire until the file exists.
- *Anchored insights.* T3-I-2, T3-I-5, `session-start.sh:13-25`, iter1 COD-STRUCT-001, iter1 COD-USAGE-002, iter1 COD-RISK-002, empirical `ls .gobbi/project.json` (iter3 Fix C).
- *Trade-off considered.* (i) directory scan first — rejected (loses the explicit canonical pointer when `project.json` exists). (iii) git-remote derivation — rejected (couples gobbi project name to git remote URL; many projects have aliased remotes; brittle). iter3 Fix C subdecision (a) in-Execution write vs (b) defer — surfaced as backlog, not locked here (the executor or a future session picks).
- *Validation.* Single-script verifier with two fixtures: (a) `project.json` present → reads name from it; (b) `project.json` absent + single dir under `.gobbi/projects/` → uses the dir name. Negative case fixture: zero dirs → resolver exits non-zero with stderr message. iter3 Fix C dormant-precondition is verified by checking the staged backlog file exists at `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`.

**D-3-4 — Metadata extraction: hybrid — `model` from `tool_input.model`; `step / phase / iter / sub-step` parsed from `tool_input.prompt` via canonical structured headers. Convention codified in `delegation/SKILL.md`. Regex `^Your (phase|iteration|sub-step|step): (.+)$`.**

Explicit clarification: the hook stdin payload has TWO sides:
- **Input side** (`tool_input.*`): the manager's delegation prompt + parameters — contains `tool_input.prompt` (with structured headers `Your phase:` / `Your iteration:` / `Your sub-step:`) and `tool_input.model`. D-3-4 extracts `step / phase / iter / sub-step / model` from the input side. T3-I-3 correctly identifies these are NOT in `toolUseResult`.
- **Result side** (`tool_result.*` and the transcript's `toolUseResult.*`): the subagent's response + telemetry — contains `agentId`, `agentType`, `usage.*`, `totalDurationMs`, `toolStats`. The result side is consulted ONLY for output telemetry, never for input-side metadata.

There is no inconsistency between T3-I-3 ("step/phase/iter/model NOT in toolUseResult") and D-3-4 ("prompt-header parsing is sufficient") — T3-I-3 describes the RESULT side; D-3-4 extracts from the INPUT side of the same hook stdin payload. Both are correct.

- *Rationale.* T3-I-3 + T3-DQ-4 — `tool_input.model` is reliable; prompt-text parse works on every existing prompt (headers visible in line 164 + this very brief). Codification ensures future prompts stay extractable.
- *Anchored insights.* T3-I-3, T3-DQ-4, T3-E-2, iter1 COD-CONS.
- *Trade-off considered.* JSON header comment block — rejected (more invasive). Parse-only without codification — rejected (convention currently implicit; would break silently).
- *Validation.* Evaluator Project perspective on `delegation/SKILL.md` codification; single-script verifier on header parsing; manual `grep -rn '^Your phase:' .claude/skills/orchestration/workflow/` returns the expected hits after T3-I-T3.e ships.

**D-3-5 — Serialization primitive: POSIX `flock -x` on `session.json` for every read-modify-write cycle in both the hook and the reconstructor.**

- *Rationale.* iter1 R1 + COD-STRUCT-002 surfaced the lost-update race: two PostToolUse hooks fire concurrently (e.g., dual-system evaluator spawns per `delegation/SKILL.md:51,220`); hook A reads `session.json`, hook B reads `session.json`, A writes (atomic temp+mv), B writes (atomic temp+mv) — B clobbers A's append. Three options were available per the brief: (a) `flock -x`, (b) per-spawn file pattern (`session.json.d/{agentId}.json` consolidated at Wrap-up), (c) accept lost-update with reconstructor repair. Picked **(a) `flock -x`** because: it is the smallest change (one `exec {fd}>>"$session_json"; flock -x "$fd"` line per script); it serializes both hook and reconstructor against each other (option (c) would leave a real-time data-loss window; option (b) requires adding a consolidation step + reasoning about ordering across multi-file fragments). `flock(1)` is available on every Linux/macOS host the project supports.
- *Anchored insights.* iter1 R1, iter1 COD-STRUCT-002, `delegation/SKILL.md:51` + `:220` (parallel evaluator topology), `session-start.sh` (bash-precedent host capabilities).
- *Trade-off considered.* (b) Per-spawn files — rejected (adds a consolidation step + cross-file ordering semantics; data lives in N files until Wrap-up consolidates, breaking real-time `session.json` reads). (c) Accept lost-update — rejected (defeats T3's premise — `agents[]` correctness is the success criterion; running reconstructor at every Task return is wasteful and the same race re-occurs between the reconstructor itself and a concurrent hook).
- *Validation.* Smoke test: spawn two Task tools in parallel (the canonical dual-system evaluator pattern); after both complete, `jq '.agents | length'` returns N+2 (manager + both subagents), not N+1 or N. Evaluator Risk perspective re-verifies E-5 scenario coverage. Lock-release-on-exit verified by intentionally `kill -9`-ing a hook process mid-run; subsequent hook fire should acquire the lock cleanly (POSIX `flock(2)` releases on process death).

**D-3-6 — Transcript correlation key: hook uses `tool_use_id` from its stdin to locate the matching transcript line. Empirical correlation: the transcript JSONL contains, for each Task spawn, both a `tool_use` line (with `message.content[].id == tool_use_id`) and a subsequent `tool_result` line containing `toolUseResult` (with `toolUseResult.agentId` as the spawned subagent's id). The two are correlated via the `tool_use_id`.**

Exact `jq` lookup path used by the hook + reconstructor:
- For each transcript line, `jq -r '.message.content[]? | select(.type == "tool_use" and .id == $tool_use_id)'` matches the `tool_use` line.
- For each transcript line, `jq -r '. | select(.toolUseResult != null) | select(.message.content[]?.tool_use_id == $tool_use_id)'` matches the `tool_result` line carrying the `toolUseResult` payload.
- The reconstructor walks the JSONL in order; for each `tool_use` line where the input has `tool_input.subagent_type` non-null (i.e., Task spawn), find the corresponding `toolUseResult` line later in the file by `tool_use_id` match.

- *Rationale.* iter1 COD-STRUCT-003 flagged that the iter1 design said "read transcript line by `tool_use_id`" without the exact jq path. Per `staging/references/claude-code-transcript-tooluseresult-empirical.md` (line 50), correlation is via `tool_use_id` against the preceding `tool_use` line OR via `toolUseResult.agentId` against the subagent's id. The hook always has `tool_use_id` in its stdin; the reconstructor has both keys available from the transcript itself.
- *Anchored insights.* iter1 COD-STRUCT-003, `staging/references/claude-code-transcript-tooluseresult-empirical.md:50`, T3-E-1, T3-E-2.
- *Trade-off considered.* Correlate by `toolUseResult.agentId` only — rejected (the hook's stdin does not contain `agentId` directly; `tool_use_id` is the always-available key). Time-based correlation (newest line) — rejected (race-prone if transcript flush lags).
- *Validation.* Single-script verifier with a fixture transcript: assert the jq path returns exactly one line for a known `tool_use_id`; assert the path returns zero lines for an unknown id.

### Validation strategy (consolidated)

| Decision | Validation method | Owner | Cadence |
|---|---|---|---|
| D-1 row 5.5 placement + branch naming (iter3 Fix A) | Future-session smoke test (`jq '.git.branch'` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`) + Consistency check + whole-file `git/conventions.md` re-grep audit | Next session post-merge + Execution-time evaluator | Once next session starts |
| D-2 qualified `git/SKILL.md:33` rule | Consistency check + grep audit (incl. `delegation/SKILL.md`) | Execution-time evaluator + manager Wrap-up | At PR review |
| D-3 NEW absorbed commit-on-branch + canonical trailer + rollback | Future-session smoke test (`git log` body grep for `task/preparation-promote-now-iter`) + Project perspective + Wrap-up gate row + intentional `git commit` failure fixture | Next `generate-now` session + Execution-time evaluator | At next Preparation generate-now |
| D-4 per-iteration commit cadence | Multi-iter `git log` subject match + Risk perspective on E-3 + doc grep | Execution-time evaluator + next multi-iter session | Once next multi-iter loop runs |
| D-5 direct-mode preservation | Consistency check across orchestration + git skills | Execution-time evaluator | At PR review |
| D-3-1 bash+jq stack | Consistency check + fixture verifier | Execution-time evaluator + executor | At PR review + fixture test |
| D-3-2 verify-and-fix reconstructor | 2-state fixture verifier + idempotency double-run + flock-coordinated double-run with concurrent hook | Executor | Execution-time + integration test |
| D-3-3 dual-event hook scope (iter3 Fix B verbatim grounding) | Smoke test on artificial spawn failure + Risk perspective + verbatim-quote presence in `claude-code-posttooluse-hook-schema.md` | Next-session manager + Execution-time evaluator | At PR review + on first failed Task call |
| D-3-3-resolver (iter3 Fix C dormant precondition) | 2-fixture single-script verifier (project.json present / absent) + negative-case fixture + presence of `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` | Executor | Execution-time |
| D-3-4 hybrid metadata extraction | Project perspective + fixture verifier + grep audit | Execution-time evaluator + executor | At PR review |
| D-3-5 flock serialization | Concurrent-fire smoke test (`jq '.agents | length'` == N+2 after parallel dual evaluator) + intentional `kill -9` lock-release test | Executor + Risk evaluator | Execution-time integration test |
| D-3-6 correlation key | Single-script verifier with fixture transcript (known/unknown `tool_use_id`) | Executor | Execution-time |

Cross-cutting: per `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`, evaluators MUST whole-file scan each touched skill file after edits — not just changed-line diffs. **iter3 additional cross-cutting** (per `mistakes/leader-iter2-verification-claim-without-evidence.md`): any reference to `git/conventions.md` requires a whole-file scan, not a line-snippet citation alone — iter3 satisfied this for D-1 (line 22 + 64 + 261) and D-3 (line 118).

Performance bounds (per iter1 COD-PERF-001, COD-PERF-002): the hook's worst-case per-iteration cost is bounded by `maxIterations × 5 loops = 15 commits per session` (each loop's MEMORIZATION fires once per iteration; max iterations per loop is the configured `workflow.<loop>.maxIterations`, default 3). For a typical 3-iter ideation + 3-iter preparation + 3-iter planning + 3-iter execution + 3-iter wrap-up session, the upper bound is 15 commits + N hook fires (N = Task spawn count, typically 20-50 per session). Transcript-scan cost per hook is bounded by O(transcript_lines); the hook scans only its own session's transcript file (typically < 5000 lines). No external network call. Storage cost: ~10-50 KB per session committed to develop's history. These bounds are deferred to Execution-time fixture measurement; no Ideation-level latency budget is locked (per the iter1 COD-PERF-001 finding's acknowledgement that Planning can still proceed without it).

---

## Decisions Log

Chronological summary of every AskUserQuestion outcome during DISCUSSION, plus reference + backlog promotion log. iter2 + iter3 fix-decisions appended in their own subsections at the end.

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
- T3: `claude-code-posttooluse-hook-schema.md` (augmented iter3 Fix B), `claude-code-transcript-tooluseresult-empirical.md`, `claude-code-agent-sdk-task-output.md`, `claude-code-hooks-12-lifecycle-events.md`

### Backlog promotion log

Nine backlog files staged (eight iter1/iter2 + one iter3 Fix C):

- Project-level (7): `item-1-2-skill-loading-discipline`, `codex-ci-integration-for-dual-system-eval`, `item-2-1-auto-mode-silence-vs-always-ask`, `chat-mode-tiki-taka-redesign`, `item-1-3-two-surface-collapsing-strategy`, `item-1-3-symlink-into-worktree-alternative`, `item-1-2-broader-delegation-contract-verifier`
- Feature-level (2): `schema-extension-agents-status-field`, `dot-gobbi-project-json-bootstrap` (NEW iter3 Fix C)

### iter2 fix-decisions

Each iter2 fix-decision below traces to one or more iter1 findings and cites the source of authority (file:line) used. These remain locked into Design / Checklist; this subsection is the audit trail.

**F-1 — Finding 1 (R1 / COD-STRUCT-002 — concurrent lost-update race).** Added D-3-5: POSIX `flock -x` on `session.json` for both hook and reconstructor. Source of authority: iter1 R1 (`evaluation/iter1/claude/risk.md` R1 finding, "Suggested direction: specify either (i) lock file (`flock` on session.json)…") + iter1 COD-STRUCT-002 (`evaluation/iter1/codex/structure.md`). Rationale for choosing (a) over (b) and (c): smallest change preserves existing bash+jq precedent; serializes hook AND reconstructor against each other; no consolidation step. Implementation impact: T3-I-T3.a + T3-I-T3.b updated; T3-I-T3.g added.

**F-2 — Finding 2 (P1 / C1 — invented `AI-Provenance-Record` trailer segment).** Replaced `gobbi://session/{session-id}/loop/preparation/promote-now` (invented iter1) with canonical `gobbi://session/{session-id}/task/{task-id}` where `{task-id}` = `preparation-promote-now-iter{n}` (workflow-generated task slug). Source of authority: `git/conventions.md:118` freshly verified iter2 (and re-verified iter3 whole-file scan) — the row reads "`AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}`" with no `loop/` variant. Implementation impact: D-3 narrative + T1-I-T1.d both updated.

**F-3 — Finding 3 (P2 / O1 — `PostToolUseFailure` shell-hook unverified).** iter2 verified via WebFetch of `https://code.claude.com/docs/en/hooks` on 2026-05-23. Result: `PostToolUseFailure` IS officially documented. **iter3 Fix B re-verifies + preserves verbatim quote** (see iter3 fix-decision F-Fix-B below). Outcome (i) per brief: KEEP D-3-3 dual registration; ADD official-doc citation. Implementation impact: D-3-3 narrative cites `https://code.claude.com/docs/en/hooks`; T3-E-5 added to Research Insights; T3-I-T3.c cites the official doc.

**F-4 — Finding 4 (COD-PROJ-001 — branch naming convention at row 5.5).** iter2 picked `session/{date}-{ssid-short}` (option (c) — session-id-based branch name not requiring task slug). **iter3 Fix A supersedes** with user-locked `chore/session-{date}-{ssid-short}` because iter2's choice introduced a Critical regression (`session/` is not in the `git/conventions.md:22` type registry — the iter2 leader did not whole-file scan and reintroduced the COD-PROJ-001 finding shape). See iter3 fix-decision F-Fix-A below for the corrected lock. Historical implementation impact (iter2): D-1 updated; T1-I-T1.a updated; G-1 scenario + E-2 scenario both updated. **iter3 Fix A** re-applies the same propagation with the corrected prefix.

**F-5 — Finding 5 (COD-STRUCT-001 — hook session-dir resolver).** Added D-3-3-resolver: project-name precedence `(i)` read `$cwd/.gobbi/project.json` then `(ii)` directory scan fallback; date prefix `(b)` scan `$cwd/.gobbi/projects/<name>/sessions/` for dir ending `-<session_id>`. **iter3 Fix C augments** with the dormant-precondition note on step (i) — file does not exist in repo today (see F-Fix-C). Source of authority: iter1 COD-STRUCT-001 (`evaluation/iter1/codex/structure.md`); brief option (ii) + (b). Rationale: `project.json` is canonical when present; sessions-scan is clock-correctness-independent (option (a) `date +%Y-%m-%d` race; option (c) reads the file we're trying to find — circular). Implementation impact: D-3-3-resolver added; E-4 scenario refined; T3-I-T3.a updated.

**F-6 — Finding 6 (COD-CONS — D-3-4 vs T3-I-3 tension).** Explicitly documented in D-3-4 narrative + T3-I-3 narrative: the hook stdin has TWO sides; `step / phase / iter / model` come from the **input side** (`tool_input.prompt` structured headers + `tool_input.model`); `toolUseResult` is the **result side** (output telemetry only). Source of authority: iter1 COD-CONS (`evaluation/iter1/codex/consistency.md`); `staging/references/claude-code-transcript-tooluseresult-empirical.md:50-66` (the field-mapping table shows the input/result split). Implementation impact: D-3-4 explanatory paragraph added; T3-I-3 description clarified to call out the input-side / result-side distinction; T3-I-T3.e updated to include the migration note.

**F-7 — Finding 7 (COD-STRUCT-003 — transcript correlation key contract).** Added D-3-6: exact jq paths — `tool_use_id` against `message.content[].id` for the `tool_use` line; `tool_use_id` against `message.content[].tool_use_id` for the `tool_result` line carrying `toolUseResult`. Source of authority: iter1 COD-STRUCT-003 (`evaluation/iter1/codex/structure.md`); `staging/references/claude-code-transcript-tooluseresult-empirical.md:50` (correlation hint). Implementation impact: D-3-6 added; G-1 scenario references D-3-6; T3-I-T3.a / T3-I-T3.b reference D-3-6.

**F-8 — Lower-priority addressed.** Performance bounds (iter1 COD-PERF-001/002): documented inline in § Design Validation strategy paragraph as bounded `maxIterations × 5 loops = 15 commits per session` + N hook fires. Aesthetics naming inconsistencies (iter1 COD-AESTH-001): addressed by adding CL-1 process/docs item explaining the `.claude/` vs `.agents/` vs `.gobbi/` path-surface split. Usage hook stdin enumeration (iter1 COD-USAGE): addressed by enumerating stdin fields used in D-3-3-resolver narrative (`session_id`, `transcript_path`, `cwd`, `tool_use_id`, `tool_input.*`, `hook_event_name`).

**F-9 — Lower-priority deferred.** Privacy/retention (iter1 COD-RISK-003) — deferred: the data persisted in `agents[]` is non-PII (subagent ids, token counts, model names, transcript paths); no PII or sensitive data surface introduced. Defer formal privacy note to follow-up backlog item (not staged this iter — would be out of scope for iter2 revision). DQ-anchor visibility (iter1 COD-AESTH-002 / COD-CONS-002) — deferred: the DQ anchors are defined in `rawdata/sub-step-d-design-iter1.md` (consulted by Planning as part of Sub-step D source records); the canonical draft does not need to repeat them. Reconstructor `recordedBy` field (iter1 COD-USAGE U7.3) — deferred: requires `session.template.json.agents[]` schema extension which is already a deferred backlog item; folds into the same future template bump.

### iter3 fix-decisions

Three surgical fixes applied this iter, each user-authorized or empirically-grounded. iter3 is the final iteration of this loop (maxIterations=3); no iter4.

**F-Fix-A — Branch prefix regression (iter2 F-4 regression, user-locked via AskUserQuestion).** iter2 picked `session/{date}-{ssid-short}` for the row-5.5 branch name; this reintroduced the COD-PROJ-001 finding shape because `session/` is not in the `git/conventions.md:22` type registry (`feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style`). iter3 leader did a whole-file scan of `git/conventions.md` (per `mistakes/leader-iter2-verification-claim-without-evidence.md` discipline) and confirmed:
1. **Line 22 regex** `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$` — `chore` is in the type alternation; the second-component description-slug regex `[a-z0-9]+(-[a-z0-9]+)*` accepts `session-2026-05-23-1b26cf20` (segments: `session`, `2026`, `05`, `23`, `1b26cf20` — each matches `[a-z0-9]+`).
2. **Line 64 description-slug length rule** (3-50 chars) — `session-2026-05-23-1b26cf20` is 27 chars (PASS).
3. **Line 261 type-label table** — `chore | #e4e669` confirms the type's first-class status.

User-locked corrected form: `chore/session-{date}-{ssid-short}` (e.g., `chore/session-2026-05-23-1b26cf20`). Source of authority: AskUserQuestion answer (a) `chore/session-{date}-{ssid-short} — use existing registry`. Implementation impact: D-1 narrative updated to use `chore/session-`; T1-I-T1.a updated; T1-I-T1.h smoke-test regex updated to `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`; G-1 scenario updated; E-2 scenario updated; F-4 scenario updated (branch reference); validation-strategy table row for D-1 updated. Grep audit (run iter3): `grep -n "session/" draft-iter3.md` returns only audit / historical-citation references (iter2 F-4 history, iter3 F-Fix-A rationale narrative), not active design statements.

**F-Fix-B — `PostToolUseFailure` verbatim preservation (iter2 F-3 gap closure).** iter2 claimed WebFetch confirmation but did not preserve the verbatim quote; iter2 Claude evaluator's independent WebFetch was blocked by the auto-mode network policy and could not re-verify. iter3 leader re-ran WebFetch on `https://code.claude.com/docs/en/hooks` (2026-05-23) and preserved verbatim quotes:

- Lifecycle table: `| PostToolUseFailure | After a tool call fails |`
- Exit-code-behavior table: `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`

The page enumerates 31 hook events (including `PostToolUseFailure` at position #9). Shell-command hook support (`type: "command"`) is explicitly confirmed alongside HTTP, MCP-tool, prompt, and agent hooks. WebFetch was successful (auto-mode network policy did not block this iter); fallback path (collapse to PostToolUse-only) was NOT used. Implementation impact: T3-E-5 entry now carries the verbatim quote inline; D-3-3 narrative carries the verbatim quote inline; T3-I-T3.c cites both verbatim quotes; `staging/references/claude-code-posttooluse-hook-schema.md` augmented with a dedicated "PostToolUseFailure — verbatim verification" subsection containing both quotes plus the full 31-event enumeration. Usage-history row added to the reference file (`iter3 Fix B — verbatim PostToolUseFailure quote added`).

**F-Fix-C — `.gobbi/project.json` dormant precondition flag (iter2 F-5 augmentation).** D-3-3-resolver step (i) reads `$cwd/.gobbi/project.json`. Empirical verification on 2026-05-23 (`ls -la /playinganalytics/git/gobbi/.gobbi/project.json`) returns "No such file or directory". Step (ii) fallback (scan `$cwd/.gobbi/projects/`) currently works because exactly one project directory exists (`.gobbi/projects/gobbi/`). iter3 flags the dormant precondition explicitly in the D-3-3-resolver narrative: step (i) is documented as the canonical preferred path for forward-compatibility, but cannot fire until the file exists; the resolver remains correct because step (ii) is sufficient under the current single-project repo.

Backlog filed: `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` (feature-level, deferred status). Backlog describes two pickup paths: (1) in-Execution single-file write of `{"name": "gobbi"}` (~5 LOC; the executor may fold this into T3-I-T3.c bootstrap), (2) defer to a future session. The backlog is open; either path is valid; the resolver remains correct in both cases. Implementation impact: D-3-3-resolver narrative augmented with the dormant-precondition note + backlog pointer; T3-I-T3.h checklist item added (acknowledging the backlog stage step); Scope Contract Out-of-Scope list updated to include the `.gobbi/project.json` bootstrap; Backlog promotion log updated to nine entries (eight + 1 iter3).

---

## iter3 WORK exit checklist

Surgical verification:

- [x] **Fix A applied**: every active design statement uses `chore/session-{date}-{ssid-short}`. Audited via `grep -n "session/" draft-iter3.md` — remaining `session/` substrings appear only in `gobbi://session/{session-id}/task/...` AI-Provenance-Record templates (not branch names — different URI), iter2 F-4 historical citation, iter3 F-Fix-A rationale narrative, mistake-file references (`...nested-in-worktree`), and informational scenario references citing the prior iter2 form for context. All active D-1 / T1-I-T1.a / T1-I-T1.h / G-1 / E-2 / F-4 / validation-table statements use `chore/session-`.
- [x] **Fix A whole-file scan**: `git/conventions.md` whole-file-read iter3; line 22 regex confirmed; line 64 length rule confirmed; line 261 label-color confirmed. Cited in D-1 rationale.
- [x] **Fix B WebFetch executed**: `https://code.claude.com/docs/en/hooks` fetched 2026-05-23 iter3; verbatim quotes preserved in T3-E-5, D-3-3, T3-I-T3.c, and staged reference file. Fallback path (collapse to PostToolUse-only) NOT used — WebFetch succeeded.
- [x] **Fix C empirical verification**: `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` confirmed absent. D-3-3-resolver step (i) annotated with dormant-precondition note; backlog file staged at `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`.
- [x] **No out-of-scope changes**: Scope Contract / Framed Problem (untouched) / Research Insights (only T3-E-5 augmented) / Scenarios (only branch-prefix propagation) / Implementation Checklist (T1-I-T1.a + T1-I-T1.h Fix A; T3-I-T3.c Fix B grounding; T3-I-T3.h Fix C added — no other items modified) / Design (D-1 Fix A; D-3-3 Fix B grounding; D-3-3-resolver Fix C augmented — no other decisions modified) / Decisions Log (iter3 fix-decisions appended as a separate subsection; iter2 fix-decisions retained with F-3/F-4/F-5 cross-references).
- [x] **No new design decisions** beyond those structurally required by the three fixes. (Fix A: D-1 narrative update only. Fix B: D-3-3 narrative update only. Fix C: D-3-3-resolver narrative update + one new feature-level backlog item.)
- [x] **No new backlog items** beyond Fix C's single feature-level entry (`dot-gobbi-project-json-bootstrap.md`).
- [x] **No new reference files** beyond Fix B's update to the existing `claude-code-posttooluse-hook-schema.md`.
- [x] **Mistake discipline**: this iter respects `mistakes/leader-iter2-verification-claim-without-evidence.md` (whole-file scan of `git/conventions.md` performed and cited), `mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` (verbatim quotes preserved for D-3-3), and `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md` (whole-file grep for `session/` and `chore/` after edits).
