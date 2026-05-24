# Sub-step A Findings (iter1)

Leader iter 1, Sub-step A (Frame What and Why). Drafts the six-forcing-question answers for each of the four bundled items, plus per-item contribution points. Every claim cited.

Loaded skills: `principles`, `mistake`, `orchestration/workflow/ideation.md`, `ideation/SKILL.md`, `git/SKILL.md`, `preparation/SKILL.md`, `gobbi/SKILL.md`. All 7 project mistakes read. Develop tip `1829fa3`. Prior session `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068` artifacts inspected (`session.json`, `wrap-up/artifacts/handoff.md`, `features/gobbi-orchestration-workflow-improvements/README.md`, commit body of `1829fa3`).

---

## Item 1-3 — Worktree-first session architecture

### Forcing-question drafts

**1. Root cause vs symptom**

Concretely, the unnamed failure mode is: **executors writing implementation-relevant files (skill content, agent definitions, settings.json edits, hook scripts) into the main tree instead of the worktree branch — silently — because the worktree is created only at Execution start, after Ideation / Preparation / Planning have already run in the main tree with the user's `cwd` set there.**

Two witnesses:

- *Preparation-exit promote-now landed on main tree, not worktree* (the symlink gap, Item NEW): `1829fa3` commit body line "PR #267 added `.gobbi/projects/gobbi/skills/codex/SKILL.md` but the corresponding `.claude/skills/codex/SKILL.md` + `.agents/skills/codex` symlinks were created in main-tree at Preparation-exit promotion and never landed on the worktree branch." This is the canonical witness: the Preparation Loop runs at a phase when (per the current workflow) the worktree exists (executors had already started using the branch for T06 / T07), yet the promote-now wrote to main tree absolute path because of the `git/SKILL.md` "always main-tree absolute path" rule.

- *Executor self-caught a main-tree-vs-worktree misroute mid-task*: prior session `session.json` line 285 records "Executor's main-tree-vs-worktree misroute (caught + reverted self) recorded as Low-severity discipline observation." The executor noticed; absent self-discipline, the misroute would have shipped silently.

There is also a *prior* witness for the inverse failure mode (writing to worktree-nested path when it should have been main-tree): `mistakes/codex-eval-session-write-path-nested-in-worktree.md`. Codex evaluator wrote session staging to `.gobbi/projects/gobbi/worktrees/feat/.../.gobbi/projects/gobbi/sessions/...` because its `cwd` was the worktree root. The current rule papers over this by forcing **all** session writes to the main-tree absolute path — but this rule is what makes the symlink-gap *worse* (rule says "write to main tree," symlinks needed to be on the branch).

So the root cause is **deeper than the unnamed failure mode**: the rule "session writes to main-tree absolute path; everything else by `cwd`" is a **proxy** that collapses two distinct concerns into one path-discipline rule. The two concerns are:
- (a) **Audit-trail durability** — session memory must survive worktree removal at session end. This argues for main-tree write paths.
- (b) **Implementation-artifact reviewability** — files that should land in the PR (skills, agents, settings, code) must be on the worktree branch. This argues for worktree write paths.

When (a)'s rule is applied uniformly, (b)'s artifacts leak to main tree. When (b)'s default is applied uniformly (via cwd), (a)'s artifacts leak to worktree-nested paths.

The worktree-first architecture proposal collapses this by **starting the session inside the worktree from Configuration Step 1**, so `cwd` is the worktree from the beginning — making (b) the default — and (a) is handled either by symlinks back to the main tree, or by accepting that session memory ships in the PR (the worktree branch absorbs the session dir).

Evidence:
- `git/SKILL.md:33` "session writes (notes, mistakes, project memory drafts) MUST use the main tree's absolute path, never the worktree's."
- `orchestration/workflow/execution.md:30` worktree created at Execution start (per `git` skill P2).
- `preparation/SKILL.md:62` narrow-exception promote-now copies `staging/skills/{slug}/SKILL.md` → `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` — no mention of which tree to write to; the existing main-tree rule is inherited by default.

**2. Impact**

- **Who is affected**: the manager (issues incomplete PRs); reviewers (see partial diffs missing dependent files); future sessions (load a skill that the merged develop branch claims doesn't exist); subagents (deceived about which tree their commits are landing on).
- **Severity**: ranges from low to high depending on what gets misrouted. The symlink gap was a **shipped-broken PR** caught only by the user at finalize. Cost = a recovery commit (`1829fa3`) and one session of cognitive load. If an entire skill body had been promoted to main tree instead of worktree (not just the symlink), the PR would have shipped without the new skill — silent feature regression.
- **Cost of inaction**: every future session that hits a generate-now skill at Preparation, OR any session-spanning artifact that needs to be both audit-durable and PR-reviewable, will hit this gap. Frequency: every feature that needs a new project-specific skill (which is the canonical Preparation generate-now path).

**3. Success criteria**

- (a) When Preparation generates a new project-specific skill, the skill file AND its symlinks land on the worktree branch as a commit (visible in PR diff); session memory remains audit-durable across worktree removal.
- (b) No agent (manager, leader, executor, evaluator, assistant) is required to remember "this write goes to main tree, that one to worktree" — the answer is determinable from the write target's category, not from the writer's identity.
- (c) Failure mode "shipped-broken PR missing promoted skills" produces a verification gate that blocks the PR pre-merge.
- (d) Non-feature sessions (investigation, doc-only, mistake-promotion, refactors that touch only `.gobbi/projects/gobbi/`) — the worktree-vs-main-tree decision is explicit, not implicit.

**4. Prior attempts**

- The current "all session writes to main-tree absolute path" rule (`git/SKILL.md:33`) was the prior attempt. It successfully prevents the inverse failure (`codex-eval-session-write-path-nested-in-worktree`) but exposes the forward failure (Item NEW symlink gap). One fix-by-rule.
- The Preparation-exit promote-now narrow exception (`preparation/SKILL.md:62`) was a prior attempt to make generated skills loadable in-session. It does not address tree placement; it inherits the main-tree default.
- No prior attempt at worktree-first session architecture in this codebase. Git skill's P2 establishes the worktree-at-Execution-start convention (`git/SKILL.md:157-162`) as the canonical entry point.

**5. Counterfactual / steel-man**

The strongest argument against worktree-first: **bootstrapping a worktree at Configuration Step 1 means every session — including pure investigation / read-only / "I just want to look at the code" sessions — pays the cost of branch creation + worktree directory setup + dependency reinstall (per `git/SKILL.md:160` "Install dependencies in the worktree"). The cost is non-trivial for `bun install` in a multi-package repo.**

Counter-evidence:
- *This repo has no `package.json` at root*. The dependency-install cost for worktree-first is currently zero in this project. The argument bites in different repos but is empirically weak here. (Verified: `find /playinganalytics/git/gobbi -maxdepth 2 -name "package.json" -not -path '*/node_modules/*' -not -path '*/.gobbi/*'` returns empty.)
- *Read-only sessions could opt out of worktree creation via a Configuration flag*. Worktree-first is the default, not the mandate. The mode set at Configuration Step 1 (currently mode = auto / chat) gains a second axis: "isolated worktree" (default) vs "main-tree direct" (read-only sessions).
- The current convention already has a `direct` mode (`orchestration/SKILL.md:103` "if the resolved git workflow mode is `direct`...") — worktree-first does not eliminate that path, it only changes the default.

Steel-man does not stand for this codebase. For other adopters of gobbi-style workflow, the cost would need a per-project assessment. Mitigation: keep `direct` mode available.

**6. Re-framing check**

The literal ask is "should every session start in a worktree." A more ambitious framing hides inside: **the underlying issue is that the workflow has no single "session work surface" — instead, three surfaces interleave (main-tree cwd, worktree cwd, session-memory absolute path) and the agent must context-switch between them on every write.** The worktree-first architecture is one collapsing strategy; another is to **establish a single canonical work surface** and make all three categories of write derive from one root.

Possible alternative framings:
- **Two-surface model** — worktree for everything-on-branch (code + skills + agents + symlinks), main tree for everything-cross-session (project memory, mistake history). Session memory lives inside the worktree and the assistant's Wrap-up promotes it to main-tree before worktree removal.
- **Symlink-into-worktree model** — keep cwd in main tree; symlink the worktree's `.gobbi/projects/{name}/sessions/` into the main tree so the durable session memory IS the worktree's session dir, garbage-collected at worktree removal except for the staged-then-promoted artifacts.

These alternatives may or may not be better than worktree-first; they should be surfaced to the user before locking the worktree-first framing. **Recommendation: surface as alternative framings in Sub-step A confirmation; let user lock the framing before Sub-step C does the deep research.**

### Contribution points

**CP-1.3-α — Failure mode confirmation**

> Decision: Is the failure mode the leader named ("Preparation/Planning artifacts that should land in PR diff get written to main tree because cwd is main tree until Execution") the correct framing, or is a different failure mode the real driver?
>
> Description: The prior session deferred this item because the failure mode was unnamed. The leader proposes the named mode above (witnessed by the symlink gap `1829fa3` + executor self-caught misroute). User confirms or refines.
>
> Options:
> - **(Recommended) Confirm — promote-now-on-main-tree is the canonical witness.** Reason: directly cited in `1829fa3` commit body; clearly defective. Pros: smallest framing scope; clear success criteria. Cons: may underweight the symmetric inverse failure (codex evaluator writes to worktree-nested path).
> - **Refine — name a broader failure mode.** Reason: the "main-tree-vs-worktree" tension is structural; framing it as a Preparation-only issue may miss similar leaks at other phases (Ideation if it ever generates project skills; Execution when subagent writes session memory). Pros: catches more witnesses. Cons: scope balloons; harder to lock a contract.
> - **Reject — the failure mode is something else (please specify).**

**CP-1.3-β — Re-framing: worktree-first vs alternative collapsing strategies**

> Decision: Lock the framing as "worktree-first from Configuration Step 1," OR consider alternative collapsing strategies (two-surface, symlink-into-worktree)?
>
> Description: The literal ask is worktree-first. The leader surfaces two alternative framings (above, forcing-question 6). User chooses whether to scope the work to worktree-first only, or open Sub-step C research to all three.
>
> Options:
> - **(Recommended) Lock worktree-first; defer alternatives to backlog.** Reason: the user has named worktree-first specifically in two prior sessions; the alternatives are leader-surfaced not user-surfaced. Pros: respects user intent; bounded scope. Cons: may miss a better answer.
> - **Open research to all three.** Reason: a "re-framing check" that surfaces alternatives is only useful if alternatives can be researched, not pre-rejected. Pros: best-of-three answer. Cons: triples Sub-step C cost; risks scope creep within ideation.
> - **Reject framing; specify the user's preferred framing.**

**CP-1.3-γ — Non-feature session scope**

> Decision: Should non-feature sessions (investigation, doc-only, mistake-promotion, refactors of `.gobbi/projects/gobbi/` only) also run inside a worktree, or stay in main tree (current default for "direct" mode)?
>
> Description: The literal ask is "every session." A weaker version ("only feature sessions") is easier to ship. The user's prior-session note specifically singles out non-feature sessions as the question.
>
> Options:
> - **Worktree-first for every session.** Reason: uniform discipline; no per-session conditional. Pros: simplifies the rule. Cons: cost on pure investigation sessions (cognitive overhead even when bun install is zero); harder to opt out for "quick look" sessions.
> - **(Recommended) Worktree-first for feature sessions; main-tree-direct for non-feature.** Reason: matches the existing `direct` vs `worktree-pr` mode duality. Pros: preserves the lightweight non-feature flow; the bug we're solving (symlink gap) only manifests on feature sessions. Cons: still requires the agent to classify the session at Configuration.
> - **Default worktree-first, opt-out per session via Configuration question.** Reason: explicit user choice at session start. Pros: maximum control. Cons: one more setup question to answer.

---

## Item 1-2 — Skill-loading discipline structural fix

### Forcing-question drafts

**1. Root cause vs symptom**

The deepest plausible root cause is **a docs-gap + procedural-gap composite, with weak evidence for "compaction eviction" and stronger evidence for "lazy-load rationalization compounded by missing canonical checklist."**

Three hypotheses, weighted by evidence:

- **(D) Docs gap (canonical checklist missing as single source of truth)** — STRONG. Evidence:
  - The session bootstrap order in `gobbi/SKILL.md:15-101` lists 6 core skills (principles, orchestration, discussion, delegation, git, mistake) but does NOT enumerate per-phase load directives.
  - Per-phase load directives live inside each loop skill (`ideation/SKILL.md`, `preparation/SKILL.md` etc.) and inside the per-role agent specs (`agents/{role}.md`).
  - Delegation prompt Load Directives format is described in `delegation/SKILL.md` (per `mistakes/memorization-delegation-prompts-must-load-memorization-skill.md` line 44-55, the canonical 4-tier load directive block).
  - There is no single "role × phase → required skills" matrix. The information is reconstructible by reading several skills, but not in one place.
  - Iron Law 1 anti-rationalization "I have enough understanding to start" maps directly to lazy-load behavior in absence of a canonical list.

- **(L) Lazy-load rationalization** — STRONG empirical witness.
  - `mistakes/memorization-delegation-prompts-must-load-memorization-skill.md:30` "The manager assumed the assistant would load the memorization skill because it was present in the project's skills directory." This is the canonical lazy-load mistake: manager didn't enumerate; subagent didn't load.
  - `mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` is the manager-side variant — manager rationalized "I remember the locked spec" instead of `Read`ing it fresh.
  - `mistakes/leader-iter2-verification-claim-without-evidence.md` is the leader-side variant — leader claimed verification without performing it.
  - The pattern across all three is "I have enough; I don't need to load/read again."
  - Principle 7 ("NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE") and its anti-rationalizations ("I checked earlier," "Should work") are the cognitive substrate.

- **(C) Compaction eviction** — WEAK direct evidence in the cited sessions. The 7 promoted mistakes do NOT cite a `/compact` or `/clear` event as proximate cause. The handoff.md text does not mention compaction as a load-discipline failure mechanism. Compaction is mentioned in `gobbi/SKILL.md:21` as a re-load trigger ("MUST load this at session start, resume, `/clear`, and compaction"), so the *rule* exists. The gap is enforcement, not specification.

**Composite root cause**: the docs-gap (D) creates the *condition* — agents don't know with certainty what to load for each role × phase. The lazy-load rationalization (L) is the *behavior* that exploits the gap. Compaction (C) is a *trigger* that aggravates both but is not necessary for the failure.

The structural fix must address (D) directly (publish a canonical role × phase × required-skills matrix) and (L) by mechanism (a delegation-prompt validator that checks Load Directives against the matrix). Compaction (C) is downstream — if (D) and (L) are fixed, the compaction-aggravated cases become impossible because the agent can verify load discipline against the matrix at every step.

**2. Impact**

- **Who is affected**: every subagent (which loads from a delegation prompt that may omit required skills); the manager (which constructs the prompts); the user (who pays the cost of REVISE iterations triggered by missing-skill defects, e.g., the entire T1-T7 staging-gap pattern in session `2026-05-22-bac669ad` cited in `mistakes/memorization-delegation-prompts-must-load-memorization-skill.md:20`).
- **Severity**: high. The session `2026-05-22-bac669ad` staging gap was a workflow-data-loss event; the staging dir was empty across 7 tasks. Recovery was post-hoc.
- **Cost of inaction**: every session is at risk of silent skill-omission in any delegation prompt the manager constructs. The 6 promoted mistakes from session `7ea62d36` are over-indexed on this exact failure pattern (3 of 6 directly cite a load/read discipline failure).

**3. Success criteria**

- (a) A single canonical reference exists at a discoverable path (e.g., `gobbi/SKILL.md § Role × Phase Load Matrix` or `delegation/SKILL.md § Required-Skills Matrix`) that lists, for each (role, phase) pair, the exact skills required in tier-3 Skills of the Load Directives block.
- (b) Every delegation prompt's Load Directives block is mechanically verifiable against the matrix (manager-side pre-dispatch check, OR a templated dispatch that interpolates from the matrix).
- (c) The skill-loading-failure mistake pattern stops repeating: zero new mistakes citing "missing skill in Load Directives" or "skill not loaded due to absent enumeration" in the next 3 sessions post-fix.
- (d) The canonical reference is discoverable from `CLAUDE.md` or `gobbi/SKILL.md` Session Bootstrap Order in ≤ 1 click.

**4. Prior attempts**

- *T03 of prior session (Bundle A)* — "Delegation memorization hard gate" added to `delegation/SKILL.md` Core Principles + Load Directives block in all 3 delegation templates (per feature README "What was shipped" #3). This is a **narrow** fix: it makes `memorization/SKILL.md` mandatory in MEMORIZATION dispatches. It does NOT address the broader matrix gap.
- *Principle 1 + Principle 7 textual reminders* — these exist (`principles/SKILL.md:36-65, 180-203`) but rely on agent self-discipline rather than mechanical enforcement. Empirical witness (3 of 6 mistakes in this domain) shows the textual reminders are insufficient.
- *Per-skill load directives at the top of each SKILL.md* (e.g., `gobbi/SKILL.md:21` "MUST load this at session start, resume, `/clear`, and compaction") — exist but scattered. No central index.

**5. Counterfactual / steel-man**

Strongest argument against a structural fix (matrix + validator): **the matrix duplicates information that's already in the per-loop skills (each loop's "Inputs" + "Load directives" sections), creating a sync burden. When a skill's load requirements change, the matrix becomes stale, leading to the same staleness problem `mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` warns about (memory citing instead of fresh-reading).**

Counter-evidence:
- The matrix would be the *single* source of truth; the per-loop SKILL.md files would point to it (or include only the row that applies, derived from the matrix). The sync burden is real but unidirectional: matrix updates, then propagates.
- A validator can detect drift mechanically (e.g., for every dispatch, validate Load Directives tier-3 lines match the matrix's row).
- Without the matrix, the same sync problem exists implicitly: per-loop docs already describe load requirements, and they ARE drifting silently (the empirical witness for this is the manager forgetting to include `memorization/SKILL.md` in MEMORIZATION dispatches despite `memorization/SKILL.md` documenting itself as required — see session `bac669ad`).

Steel-man does not stand: the matrix collapses an existing distributed-source-of-truth problem into a single auditable source-of-truth problem, which is strictly easier to maintain.

**6. Re-framing check**

Possible deeper framing: **the skill-loading problem is one face of a larger pattern — agents repeatedly bypass declared verification gates because the gates are "ought" statements rather than enforced mechanisms.** Iron Law 7's "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE" is structurally equivalent to "delegation prompts must list required skills" — both are gates that the agent must self-enforce.

A more ambitious framing: **introduce a "delegation contract verifier" — a mechanical pre-dispatch check that validates not just Load Directives but ALL required gate citations (e.g., spec citations must be fresh-read; verification-claim sentences must cite a grep that ran in the current session).**

This is broader than the literal ask. The leader recommends surfacing it as a possibility, but locking the literal-ask framing (matrix + Load-Directives validator) for this loop's scope. The broader "delegation contract verifier" can be a follow-up.

### Contribution points

**CP-1.2-α — Root-cause hypothesis selection**

> Decision: Which root-cause hypothesis is the intervention target — (D) docs gap, (L) lazy-load rationalization, (C) compaction eviction, or the (D+L) composite?
>
> Description: The leader weighs (D+L) composite as the strongest evidence-backed root cause (per the 3 of 7 promoted mistakes that fit it directly). (C) compaction eviction has weak direct evidence in the cited sessions. User confirms or chooses differently — the intervention design depends on this.
>
> Options:
> - **(Recommended) (D+L) composite — docs gap + lazy-load behavior.** Reason: matches the empirical witness pattern across 3 of 7 promoted mistakes; intervention is a matrix + mechanical validator. Pros: directly addresses witnessed failures. Cons: doesn't help compaction-aggravated edge cases.
> - **(D) docs gap only — publish the matrix, rely on textual discipline.** Reason: narrowest scope. Pros: cheapest. Cons: textual discipline has empirically failed (Principle 7 textual reminder existed before all 3 mistakes occurred).
> - **(L) lazy-load only — focus on enforcement mechanism without matrix.** Reason: assumes docs are sufficient. Pros: minimal docs work. Cons: validator has nothing to validate against without the matrix.
> - **(C) compaction eviction — design a re-load mechanism triggered by compaction events.** Reason: addresses the post-/compact case. Pros: closes one specific gap. Cons: not the dominant witness pattern; risks fixing the wrong layer.
> - **Reject — different framing (please specify).**

**CP-1.2-β — Re-framing: scope of the structural fix**

> Decision: Lock the scope as "skill-loading-discipline matrix + validator" (literal ask), or expand to a "delegation contract verifier" that covers all gate-bypass patterns (Iron Law 7, citation freshness, etc.)?
>
> Description: The leader surfaces a broader re-framing (delegation contract verifier) but recommends keeping the literal-ask scope for this loop. User decides.
>
> Options:
> - **(Recommended) Literal-ask: matrix + Load-Directives validator. Defer broader contract verifier to a follow-up.** Reason: bounded scope; high empirical signal; shippable in one session. Pros: matches user intent. Cons: leaves other gate-bypass patterns (citation freshness, verification claims) unaddressed.
> - **Broader: delegation contract verifier covering all gate-bypass patterns.** Reason: same architectural layer; might as well solve once. Pros: comprehensive. Cons: 2-3× scope; risks under-specification.
> - **Different framing (please specify).**

---

## Item 4-1 — `session.json` subagent metadata hook

### Forcing-question drafts

**1. Root cause vs symptom**

The deepest plausible root cause is **the manager has no synchronous side-channel from the Agent tool's return value to a structured-write surface, AND the manager-driven append-at-spawn-time approach has been empirically failing.**

Empirical witness (just-collected):
- `cat .gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/session.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d['agents']))"` returns `1`. Across the entire prior session — ~10 hours, 17+ Agent spawns spanning Ideation (3 iters), Preparation (3 iters), Planning (2 iters), Execution (7 tasks each with executor + 2 evaluators), Wrap-up — only the manager's seed entry is in `agents[]`.
- The session template `orchestration/templates/session.template.json:28-48` defines a single-element `agents[]` containing the manager seed. The schema for specialist entries exists. The manager simply never appended them.
- `orchestration/SKILL.md:103` row 6: "The manager appends specialist entries to `agents[]` as the workflow progresses." This is the documented procedure, and it is silently failing in practice.

Subordinate causes:
- (a) The manager has no token-usage data available at spawn time (it only arrives at Agent return time, in the `<usage>` block of the tool result).
- (b) The manager forgets to append at return time because there is no enforced gate (similar pattern to Item 1-2 — declared discipline without mechanical enforcement).
- (c) Even if the manager remembered, the tokenUsed data is in an unstructured-string `<usage>` block that the manager must parse — labor that's easy to skip.

So the question between options (a) PostToolUse hook, (b) `gobbi session reconstruct-agents` CLI, (c) both becomes a question of **which mechanism best mitigates "manager forgets / skips parsing"** while preserving fidelity of the data.

**2. Impact**

- **Who is affected**: future sessions (lose the per-spawn audit trail); workflow-improvement work (no data to measure subagent token economy, iteration frequency, model use); the user (cannot answer "how much did this session cost / where did the time go" without manual reconstruction).
- **Severity**: medium-high. Not a workflow-breaker but a high-value data loss across every session. The session memory IS the audit trail; without per-spawn metadata, post-hoc analysis (which is most analysis) is hand-stitched.
- **Cost of inaction**: indefinite continuation of `agents[]` being effectively unpopulated. Every session ships with a 1-row `agents[]` despite 15+ spawns. The `session.template.json` field becomes vestigial.

**3. Success criteria**

- (a) After any session of N Agent spawns, `session.json.agents[]` has N+1 entries (manager + N specialists) with full schema populated (id / name / type / step / phase / iter / model / system / transcriptPath / tokensUsed / startedAt / finishedAt).
- (b) `tokensUsed.input` / `.output` / `.cacheRead` / `.cacheCreation` are populated for at least 90% of entries (allowing for transient hook failures or non-emitted `<usage>` cases).
- (c) The mechanism does not require the manager to remember to do anything — it is mechanical / hooked.
- (d) Mechanism is robust to session interruption — partial sessions still have populated `agents[]` for spawns that completed.

**4. Prior attempts**

- *None on record specifically for `agents[]` population.* The current state is the implementation: manager-driven append-at-spawn-time per `orchestration/SKILL.md:103`. The empirical failure (1-entry `agents[]` after 17+ spawns) is the prior attempt's outcome.
- *The `session-start.sh` hook* (`.claude/hooks/session-start.sh`) is the closest precedent for hook-based session-mutation. It writes shell-safe exports to `$CLAUDE_ENV_FILE` at SessionStart events. Pattern is a known-good template.
- *No PostToolUse hook exists yet in this repo* (verified: `grep PostToolUse .claude/settings.json` returns nothing).
- *No CLI exists in this repo* (verified: no `package.json` at root; no `packages/cli/` dir). The gobbi CLI was retired. Option (b) "gobbi session reconstruct-agents CLI" therefore requires either (i) restoring/building a CLI from scratch, or (ii) implementing the reconstructor as a shell script.

**5. Counterfactual / steel-man**

Strongest argument against (c) both / for option (b) only: **the PostToolUse hook (option a) requires understanding the Claude Code hook payload shape — specifically whether the hook receives both the tool_use payload (input args, including the manager's delegation prompt JSON) AND the tool_result (with the `<usage>` block). If the hook receives only one side, it has insufficient data to populate `agents[]`. The CLI option (b) reads the transcript JSONL which contains both sides — guaranteed-sufficient data — and runs at session-end-time when correctness matters more than realtime.**

Counter-evidence and resolution:
- The Claude Code hooks doc (per the task brief) does specify PostToolUse — needs verification against docs.claude.com/claude-code. If the hook payload includes both tool_use input and tool_result, option (a) works real-time. If only one side, option (a) needs to read the transcript anyway, which collapses (a) into a hook-triggered version of (b).
- Even if (a) works real-time, hook failures are silent. Option (b) as a "rebuild from transcript" command is the recovery mechanism — equivalent in principle to a `git fsck` for `agents[]`.
- **(c) both** is the resilient answer: hook for real-time append (cheap, lossy), CLI / shell script for retroactive reconstruction / repair (correctness gate).

Steel-man partially stands for (b)-only — it's the simplest reliable option — but loses to (c) because adding the hook is low-cost incremental work given (b) already exists.

**6. Re-framing check**

Possible re-framing: **the broader issue is that the manager has multiple "append-on-event" obligations (`session.json.agents[]`, `session.json.workflow.{step}.iterations[]`, `discussion-log.md`, the project journal at Wrap-up) and lacks a unified event-handler mechanism. The session telemetry could be modeled as a unified event stream.**

This is a deeper architectural pivot. Recommendation: **defer the re-framing; ship the literal ask (option (c) hook + reconstructor) and surface the unified event stream as a follow-up.** The current bundled scope already strains a single session.

Additionally: **the option matrix should be reconsidered if the Claude Code PostToolUse hook does NOT in fact receive both tool_use and tool_result.** This is an empirical question — must be resolved before locking the design. The leader recommends a Sub-step C external research item to confirm the hook contract.

### Contribution points

**CP-4.1-α — Option selection**

> Decision: Pick the mechanism — (a) PostToolUse hook only, (b) shell-script reconstructor only (no CLI exists), (c) both, or different framing?
>
> Description: The CLI option (b) as originally stated assumes a `gobbi session reconstruct-agents` command exists. No CLI exists in this repo (verified). The leader recommends adapting (b) → a standalone shell script at `.claude/scripts/reconstruct-agents.sh` (or similar) that the manager can invoke. Option (c) combines this script with a PostToolUse hook for real-time append.
>
> Options:
> - **(Recommended) (c) Both — hook for real-time append + shell-script reconstructor for repair.** Reason: real-time hook is fast and incremental; reconstructor provides correctness gate / repair path. Pros: covers happy path + recovery; reconstructor verifiable independently. Cons: highest scope (two artifacts to build + test).
> - **(a) Hook only.** Reason: lowest friction; assumes hook payload is sufficient and reliable. Pros: smallest scope. Cons: no recovery path if hook fails; cannot retroactively repopulate existing sessions.
> - **(b) Reconstructor shell script only.** Reason: runs at session-end / on-demand; guaranteed correct from transcript. Pros: simplest correctness story. Cons: not real-time (Wrap-up sees empty `agents[]` until script runs); no incremental visibility during long sessions.
> - **Different framing — unified event stream.** Reason: per re-framing check, broader architectural pivot. Pros: solves more than one problem. Cons: scope balloons; defer to follow-up.

**CP-4.1-β — Hook contract verification gate**

> Decision: Before designing the hook (Sub-step D), should Sub-step C external research empirically verify what the Claude Code PostToolUse hook receives — tool_use input only, tool_result only, or both?
>
> Description: The hook design depends on whether the payload contains the manager's Agent invocation JSON (subagent_type / prompt / phase metadata) AND the result `<usage>` block. The leader cannot design the hook authoring without this. User authorizes the research scope.
>
> Options:
> - **(Recommended) Yes — Sub-step C must include "Claude Code PostToolUse hook payload schema" as an external research item; the design (Sub-step D) is contingent on findings.** Reason: prevents designing against an assumed contract. Pros: avoids the `codex-rescue` fire-and-forget pattern (mistake `codex-rescue-agent-fire-and-forget-without-result-capture.md` — assumed sync behavior, was async). Cons: adds one research item.
> - **No — assume the hook receives both sides and design accordingly; verify empirically in Execution.** Reason: faster ideation. Pros: cheap. Cons: risks designing against a wrong contract.

**CP-4.1-γ — Schema gap: `agents[]` template completeness**

> Decision: The session.template.json `agents[]` element currently lacks fields the brief lists (`step`, `phase`, `iter`, `transcriptPath`, `tokensUsed.{cacheRead,cacheCreation}`). Are these the canonical fields the hook/reconstructor should populate, or does the template need extending?
>
> Description: Reading `orchestration/templates/session.template.json:28-48`: the schema has `id, name, type, step, phase, iter, model, system, transcriptPath, tokensUsed.{input,output,cacheRead,cacheCreation}, startedAt, finishedAt` — same fields the brief specifies. No gap. The leader confirms the template covers the brief's field list. Verification gate.
>
> Options:
> - **(Recommended) Confirm — template fields are sufficient; no template change needed.** Reason: empirically matched.
> - **Extend template — add fields not yet covered (please specify which).** Reason: future-proofing.

---

## Item NEW — Preparation-exit symlink commit-on-worktree-branch

### Forcing-question drafts

**1. Root cause vs symptom**

The deepest plausible root cause is **a direct contradiction between two rules — `git/SKILL.md:33` "always write to main-tree absolute path" (which the promote-now inherits as default) vs the implicit requirement that PR-shipped artifacts must land on the worktree branch.** The contradiction is unspoken in `preparation/SKILL.md:62`'s narrow-exception text, which says "copy `staging/.../SKILL.md` → `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md`" without specifying which tree to write to. Default behavior = main tree (per `git/SKILL.md:33`).

This is the **same root cause as Item 1-3 forcing-question 1**: the proxy rule "session writes to main-tree absolute path" collapses two distinct categories (audit-durable vs PR-reviewable) and exposes the latter.

Evidence:
- `preparation/SKILL.md:62`: "Promotion path: on EVALUATION PASS, copy `sessions/{date}-{session-id}/preparation/staging/skills/{slug}/SKILL.md` → `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` (lazy parent dir creation)." No tree qualifier.
- `git/SKILL.md:33`: "session writes... MUST use the main tree's absolute path, never the worktree's." This rule technically applies to *session writes*, not promotions, but the precedent it sets (always main tree) is what the manager applied.
- `1829fa3` commit body: "PR #267 added `.gobbi/projects/gobbi/skills/codex/SKILL.md` but the corresponding `.claude/skills/codex/SKILL.md` + `.agents/skills/codex` symlinks were created in main-tree at Preparation-exit promotion and never landed on the worktree branch."
- Verification of canonical symlink pattern: `feature README.md` open-follow-ups note "Standard pattern across all 16 other gobbi skills commits both symlinks; without them the codex skill cannot be loaded via the Skill tool" — symlinks ARE expected to be on the branch as part of skill landing.

**2. Impact**

- **Who is affected**: every PR that introduces a generated project-specific skill (per the Preparation-Loop `generate-now` exception); reviewers (see incomplete PR); merged develop (broken — new skill not loadable until a fix-up commit).
- **Severity**: high-medium. The symptom (shipped-broken PR) was caught at finalize by the user — but only because the user knew to look. Without the catch, the codex skill would have been on develop unmountable.
- **Cost of inaction**: every future Preparation `generate-now` event ships an incomplete PR. Frequency: every feature that needs a new project-specific skill.

**3. Success criteria**

- (a) `preparation/SKILL.md`'s narrow-exception text explicitly specifies the write surface (worktree branch when worktree-pr mode active; main tree only in direct mode) AND requires a commit to that branch including symlinks.
- (b) `git/SKILL.md:33`'s "always main-tree" rule is qualified to apply only to session memory / mistake notes — NOT to project-memory promotions (which are reviewable PR artifacts).
- (c) Wrap-up has a verification gate that flags any project-memory promotion landing on main tree when worktree-pr mode is active.
- (d) Re-witness rate is zero: next 3 Preparation `generate-now` sessions ship complete PRs (skill body + symlinks on branch).

**4. Prior attempts**

- *The narrow exception itself* (`preparation/SKILL.md:62`) was a prior attempt to make generated skills in-session-loadable. It does not address tree placement.
- *The manual recovery via finalize commit `1829fa3`* was a session-end hand-fix, not a structural fix. Not a sustainable approach.
- *The `feature README` open-follow-up* names the gap but doesn't fix it.
- *`mistakes/codex-eval-session-write-path-nested-in-worktree.md`* established the inverse pattern (session writes leaking to worktree-nested paths) — the response was the rigid `git/SKILL.md:33` rule, which created this gap. So the prior attempt that **caused** Item NEW is itself a known prior attempt.

**5. Counterfactual / steel-man**

Strongest argument against fixing this with a worktree-write rule: **a Preparation-generated skill is project memory; project memory write is owned by Wrap-up's MEMORIZATION (sole-writer per `gobbi/SKILL.md:117`, `preparation/SKILL.md:62`). The Preparation narrow exception is already a violation of the sole-writer rule; adding "must commit on worktree branch" deepens the violation by making Preparation a git-committing actor outside of executor / wrap-up.**

Counter-evidence:
- The sole-writer violation is already accepted by design (`preparation/SKILL.md:62` "narrow, user-approved exception to the sole-writer rule"). The question is not "violate or not" but "what's the right shape of the violation."
- A Preparation commit on the worktree branch is no more rule-breaking than the sole-writer violation already accepted. It's a strict superset of the same exception, properly scoped.
- Alternative: Wrap-up promotes the skill AND commits on the worktree branch before merge. This delays in-session loadability until Wrap-up, which **defeats the whole purpose of the narrow exception** (Planning + Execution need to load the skill in this same session).

Steel-man does not stand: the narrow exception's existence is justified by in-session loadability; the structural-completeness of that exception requires the file to be on the worktree branch (committed) so the PR ships intact. The current shape is a partial exception that creates a defect.

**6. Re-framing check**

The literal ask is "promote-now should commit symlinks on worktree branch." A more ambitious framing: **integrate this with Item 1-3 (worktree-first). If sessions start in worktree from Configuration Step 1, then Preparation's `cwd` IS the worktree — the promote-now write goes there by default with no special tree-routing rule needed.**

This is the **dependency** between items. If Item 1-3 is shipped first with worktree-first architecture, Item NEW collapses into "make sure the promote-now also runs a `git add` + `git commit` for the new file + symlinks" — which is a much smaller change.

Recommendation: **flag Item NEW as dependent on Item 1-3's outcome.** If Item 1-3 ships worktree-first, Item NEW reduces to a commit step. If Item 1-3 ships something else (alternative collapsing strategy), Item NEW must specify the write surface explicitly per the chosen architecture.

### Contribution points

**CP-NEW-α — Write-surface mechanism**

> Decision: Pick the mechanism — (a) Preparation writes to worktree path + commits on branch; (b) Preparation writes to main tree AND mirrors to worktree + commits on branch; (c) Restructure: Preparation runs inside the worktree from the start (subsumed by Item 1-3 worktree-first); (d) Defer Wrap-up to commit promoted skills (loses in-session loadability).
>
> Description: The leader notes (c) is the cleanest mechanism but depends on Item 1-3. (a) is the minimal direct fix if Item 1-3 is rejected. User confirms ordering.
>
> Options:
> - **(Recommended) (c) — Restructure via Item 1-3; Item NEW becomes "ensure promote-now commits the new files on the worktree branch."** Reason: collapses two related issues into one architectural fix; matches the user's prior-session question framing. Pros: no special routing rule needed. Cons: depends on Item 1-3 framing being locked first.
> - **(a) — Direct fix: Preparation writes to worktree path + commits.** Reason: minimal change; surgical. Pros: works without Item 1-3. Cons: leaves the main-tree-vs-worktree tension unresolved elsewhere.
> - **(b) — Write both + commit.** Reason: belt-and-suspenders. Pros: covers both audit and PR. Cons: violates DRY; mirror has to stay in sync.
> - **(d) — Defer to Wrap-up.** Reason: respects sole-writer rule strictly. Cons: defeats narrow-exception's purpose.

**CP-NEW-β — Dependency on Item 1-3**

> Decision: Should Item NEW be planned as **dependent on Item 1-3** (locked-first), or **independent and shippable in parallel**?
>
> Description: Per re-framing check, Item NEW is naturally a subset of Item 1-3 if worktree-first is locked. User decides ordering.
>
> Options:
> - **(Recommended) Dependent — wait for Item 1-3 to lock the architecture, then Item NEW is a 1-task commit-on-branch wrap-up.** Reason: avoids double-work; the Item 1-3 design naturally subsumes this. Pros: less rework. Cons: if Item 1-3 stalls, Item NEW also stalls.
> - **Independent — fix Item NEW surgically now (option (a) above), revisit if Item 1-3 changes the architecture later.** Reason: bird-in-the-hand. Pros: ships the obvious bug fix immediately. Cons: may need rework if Item 1-3 redesigns the surface.

---

## Cross-cutting observations

1. **Item 1-3 and Item NEW share a root cause** (forcing-question 1 of each). The "main-tree-vs-worktree write surface" tension is one structural problem with two empirical witnesses (symlink gap + executor self-caught misroute). They should be ideated together — Item NEW is naturally subsumed by Item 1-3 if worktree-first is locked. Recommend the manager surface this dependency in the discussion before locking scope.

2. **Item 1-2 and the prior-session mistakes are tightly coupled.** 3 of the 7 promoted mistakes (`memorization-delegation-prompts-must-load-memorization-skill`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck`, `leader-iter2-verification-claim-without-evidence`) are direct empirical witnesses for Item 1-2's "load/read discipline failure" pattern. The hypothesis selection in CP-1.2-α should weigh these.

3. **Item 4-1 has a hidden constraint: no CLI exists in this repo.** The brief's option (b) "gobbi session reconstruct-agents CLI" is not directly implementable as a CLI subcommand. The leader recommends rephrasing option (b) → shell script at `.claude/scripts/reconstruct-agents.sh`. CP-4.1-α reflects this.

4. **Item 4-1's PostToolUse hook contract is an unverified assumption.** The brief asserts `<usage>` blocks are empirically accessible — the leader has not independently verified what the Claude Code PostToolUse hook receives. CP-4.1-β surfaces this as a Sub-step C research gate.

5. **Sequencing risk.** The prior session shipped a finalize commit (`1829fa3`) that fixed the symlink gap manually. The current session's plan ordering must respect that the fix has already been applied for the specific codex symlink case — the structural fix (Item NEW) prevents recurrence, but the immediate witness is already remediated. Decision frame "is this fixing a current bug or a future-recurrence guard" should be explicit.

6. **All four items touch process / workflow infrastructure — none are user-facing code changes.** The execution risk is concentrated in skills/SKILL.md edits + possible `.claude/settings.json` / `.claude/hooks/` additions + possible new `.claude/scripts/` shell scripts. No package code touched. This narrows the surface but also means evaluation needs to cover docs-sync rigorously (per `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep`).

7. **Anti-pattern check from `mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck`** — when the manager constructs the iter2 brief for any of these items (if iter1 evaluates REVISE), the manager MUST freshly `Read` the locked artifact before composing verbatim sections. Surfacing this as a sequencing risk for downstream phases.
