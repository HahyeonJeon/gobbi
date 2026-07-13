# Delegation Dispatch

This child document is the sole substantial owner of Gobbi manager-to-specialist dispatch. Read the
workflow-agnostic [`delegation` skill](../delegation/SKILL.md) first for brief semantics, then use this
document for Gobbi roles, runtimes, templates, load tiers, wire formats, and dispatch decisions.

Every manager dispatch reads this document. Consumer documents point here instead of restating its
contract.

---

## Dispatch Flow

1. Select the role, runtime, fresh-or-continuation state, and matching template.
2. Compose the generic brief semantics with Gobbi headers, four ordered load tiers, paths, and role overlay.
3. Apply producer or evaluator independence plus the runtime, model, and effort rules.
4. Render the complete prompt and validate it before dispatch.
5. Dispatch through the supported runtime primitive.
6. Parse the response-first status and the role-specific evidence.
7. Verify required reads from transcript or runtime evidence.
8. Route success, concern, missing context, or a genuine block.
9. Extract the subtask record from the prompt and final response.

---

## Per-role Templates

The manager uses one template per role. Templates live in [`templates/`](templates/):

| Role | Template | Use when |
|---|---|---|
| `leader` | [`templates/leader.md`](templates/leader.md) | Ideation, Preparation, Research, Planning sub-phases. Single leader per dispatch. |
| `executor` | [`templates/executor.md`](templates/executor.md) | Execution phase. One executor per task by default (a continued executor may span ≤3 shared-subsystem tasks — see [§ Continue vs Fresh](#continue-vs-fresh)); tasks sequence (never parallelize implementation — continuation is sequential, not parallel). |
| `evaluator` | [`templates/evaluator.md`](templates/evaluator.md) | Evaluation sub-phase. Spawn exactly 2 in parallel — one per system (Claude + Codex). Each evaluator handles all 7 perspectives + Overall sequentially; per-system isolation provides the anti-groupthink signal. |
| `assistant` | [`templates/assistant.md`](templates/assistant.md) | Narrow read-only support (lookups, references, codebase exploration). Can parallelize. |

The templates are not paraphrased into prose at dispatch time — they are filled out literally. Every `<<slot>>` is replaced with the actual value; no slot is left as a placeholder.

**Cross-pollination mechanism:** the v0.4.x dual-stance design (innovative + best stances as orthogonal hypothesis generators) was retired in v0.5.0 in favor of a single leader per dispatch. Orthogonal hypothesis generation is now provided by **dual-system evaluation** — Claude and Codex independently judge the leader's output, and divergence between systems is the anti-groupthink signal. See `orchestration/workflow/evaluation.md` § Why dual-system is mandatory.

---

## What Every Delegation Prompt Contains

All four per-role templates share this scaffold (per-role tails add the rest). The order is fixed (D2): Load Directives sit **before** the Task Description, matching the block's own "read these as your FIRST actions" instruction.

1. **Identity line** — `You are a {role}...` (sets voice + role on the first token).
2. **Structured headers** — `Your phase:` / `Your iteration:` / `Your sub-step:` (+ `Your system:` on the evaluator, `Mode:` on the assistant). The machine-readable routing block; under the identity line, above the Load Directives.
3. **Load Directives** — 4-tier numbered block (see below), placed BEFORE the Task Description.
4. **Task Description / Question** — the **primary spec, pasted inline**. Never a `@path`. Manager-authored or paste of the user's exact wording.
5. **Context** — manager-authored scene-setting (where it fits, dependencies, user-clarified intent, pre-resolved decisions).
6. **Inputs** — prior-loop outputs (paste short items inline; cite paths for longer reference material).
7. **Constraints / Scope** — files in-scope, files out-of-scope, pre-resolved decisions, anti-scope-creep rule.
8. **Write Roots / Output Contract** — the fully-expanded absolute `session.json.git.worktreePath` write root + allowed/forbidden paths (any role that writes).
9. **Your Job** — numbered list of what to do, including lifecycle reference.
10. **Reference Materials** — paths for ADDITIONAL reading (never the primary spec).
11. **Escape Hatch** — explicit `NEEDS_CONTEXT` / `BLOCKED` permission.
12. **Report Format** — the per-role status enum, at the very end.

Role-specific tails:
- `leader` adds **phase** + **artifact path(s)**.
- `executor` adds **Self-Review checklist** + **Verification Commands**.
- `evaluator` adds **CRITICAL: Do Not Trust the Report** block + **Finding Schema** + **Evaluation Output Contract** + **Verdict**.
- `assistant` adds **Mode selector** + **Expected Output Shape**.

---

## The Load Directives Block

Mandatory in every delegation prompt, ordered top-to-bottom. **Spawned subagents have no Skill tool** — they cannot "load" a skill by name. "Load" here means READ the skill's `SKILL.md` (or the named file) with the Read tool. So the block is a list of EXACT file paths the subagent reads as its FIRST actions, before the Task Description or any other work. A bare skill *name* with no path maps to no action for a tool-less subagent; every entry the manager fills must be a concrete file path. Skipping any required file is a process failure.

The concrete 4-tier block each role fills lives in the per-role templates ([`leader.md`](templates/leader.md), [`executor.md`](templates/executor.md), [`evaluator.md`](templates/evaluator.md), [`assistant.md`](templates/assistant.md)) — the manager fills it there, not from a copy here. Tier order is fixed: **1. Principles → 2. Rules → 3. Skills → 4. Mistakes**; the project rules read contract resolves to `RULES_PRESENT` / `NO_PROJECT_RULES` per [`memory/rules.md` § Empty-state contract](../memory/rules.md).

**Skill-load path SSOT.** Every delegation prompt cites `.gobbi/projects/{project-name}/skills/<skill>/SKILL.md` as the SINGLE skill-LOAD path — for BOTH Claude Code AND native Codex. Native Codex reads those real files directly, so no load path is ever unresolvable; the `.agents/skills/` symlink dir stays the Codex *discovery* / entry-point surface (owned by `sync-plugin-package.sh`), never a load-path citation. The `.codex/AGENTS.md` load mandates and the Codex `.toml` agent wrappers align to this SSOT; naming `.agents/skills/` as a skill-LOAD path is the recorded [`use-runtime-skill-surface-in-load-directives`](mistakes.md#use-runtime-skill-surface-in-load-directives) pitfall.

After the block, the subagent's response carries a `SKILLS LOADED:` checklist enumerating the exact path of each Load-Directives file it Read — the self-report half of the verification pair (see [§ The Status Contract](#the-status-contract) for the wire format and [§ Manager verification](#manager-verification--the-ground-truth-backstop) for the transcript-read backstop).

**Why this order.** Principles set the discipline floor (what every agent must never do). Rules narrow that to the project's conventions. Skills give the role-and-domain procedure. Mistakes inject the specific past pitfalls the subagent must avoid in this domain. Loading in this order ensures the most-general discipline is established before the most-specific guidance, so the subagent cannot rationalize a domain skill into violating a principle.

**No inheritance — on a FRESH spawn.** Even if the manager already loaded `principles` minutes earlier, every fresh subagent must load it again. There is no session inheritance. This holds for every first spawn. A **continuation** is the one exception: a continued teammate already loaded the full stack on its first turn and carries it forward, so a continuation turn sends a delta-brief, not the full Load Directives block again — see [§ Continue vs Fresh](#continue-vs-fresh).

**RECORD hard gate.** When the delegated phase is RECORD (or includes a RECORD sub-phase), `record/SKILL.md` MUST appear in tier 3 (Skills). The record skill defines the memory-tier access matrix, staging rules, idempotency contract, and exit checklist that the sub-phase agent must follow. Omitting it produces an agent that cannot operate the sub-phase correctly. **The RECORD-owning role is the `assistant`** (in `record` mode) — its template carries `record/SKILL.md` as the mandatory entry; the `leader` and `executor` templates keep it as an omit-unless-RECORD placeholder for the rare loop where they run a RECORD sub-phase. See [`templates/`](templates/).

**Memory standard gate.** Any delegation that **writes or evaluates memory** MUST load `memory/rules.md` in tier 3 (Skills) alongside `record/SKILL.md`. `memory/rules.md` is the naming / frontmatter / structure standard — the rules a memory file's name, frontmatter, and scope must obey; without it the standard is advisory-only and structural drift recurs. The `leader`, `executor`, and `assistant` templates carry the `memory/rules.md` line right after their `record/SKILL.md` line; the `evaluator` template carries it in tier 3 for delegations that judge memory artifacts against the standard (the evaluator has no `record/SKILL.md` line).

**Per-skill `mistakes.md` companion path.** Spawned subagents have no Skill tool — they READ the exact paths the Load Directives list, and nothing auto-loads. So a skill's mistakes home loads ONLY if the brief names it. The standard: **every tier-3 Skills entry `skills/{x}/SKILL.md` is paired with its companion `skills/{x}/mistakes.md`** (when that companion file exists) — list the companion on the line right after the `SKILL.md` it pairs with. This is the load mechanism for the skill-owned half of the hybrid mistake model (see [`mistake/SKILL.md` § P1](../mistake/SKILL.md)); without the explicit companion path a skill's traps never reach the subagent. The per-role templates ship the `mistake/SKILL.md` + project-tier load; the manager adds each `skills/{x}/mistakes.md` companion next to the domain skill it pairs with.

**Mandatory git-skill gate (worktree-writing delegations).** `git/SKILL.md` + `git/mistakes.md` are a MANDATORY tier-3 (Skills) Load-Directives entry — like `principles` and `mistake` — for any delegation whose subagent **writes to the worktree** (commits, or writes session-record artifacts / staging under the worktree). The `executor` always qualifies (it commits to the worktree); a `leader` or `assistant` qualifies whenever its task writes session artifacts or memory to the worktree. The git skill carries the absolute-worktree-path write discipline and the `git/mistakes.md` traps; a worktree write WITHOUT it is the documented [`git/mistakes.md#executor-wrote-to-main-tree-not-worktree`](../git/mistakes.md#executor-wrote-to-main-tree-not-worktree) failure. The `executor`, `leader`, and `assistant` templates carry the `git/SKILL.md` + `git/mistakes.md` line.

**Session-write path discipline.** When a subagent's task involves session writes (notes, staging files, memory drafts), the delegation prompt must remind the subagent to follow the qualified write-path rule: use `session.json.git.worktreePath` as the absolute root. `worktreePath` is always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal. See [`git/SKILL.md` § Memory Access Matrix](../git/SKILL.md#memory-access-matrix) for the full qualified rule.

### Manager verification — the ground-truth backstop

The `SKILLS LOADED:` checklist a subagent returns is its **self-report** — it is not proof. The ground truth is the subagent's transcript. After a subagent returns, the manager greps the transcript for a read of each required Load-Directives file. The transcript shape is runtime-specific:

- **Claude Code** (JSONL tool events): `grep -oE '"file_path":"[^"]*"' <transcript> | grep <required-path>`.
- **Native Codex** (codex events JSONL): grep the file-read events for `<required-path>` — the read-event key differs from Claude's `file_path`, so match the path substring. Where the Codex transcript exposes no machine-readable read event, fall back to spot-verifying the `SKILLS LOADED:` self-report against the required set (a degraded but non-empty check). Do NOT run the Claude `file_path` grep against a Codex transcript — it matches nothing and manufactures a false skip signal.

Run the check once per required tier-1/tier-3 file (at minimum `principles/SKILL.md`, `mistake/SKILL.md`, and the phase doc). If any required file has **no** matching read, the subagent ran skill-blind — the manager **re-dispatches** the same task with the Load Directives restated, rather than trusting the result. The checklist is the self-report; the transcript read-check is the verification — two halves of one gate, the read-check authoritative where the runtime exposes it.

This backstop exists because a tool-less subagent can silently skip a "load the X skill" line: the audit that motivated this gate found 2 of 4 executors had each skipped a required skill (one `principles`, one `execution`) despite the prompt naming it. The self-report alone would have reported them as loaded.

---

## Continue vs Fresh

A subagent does not have to be fresh every time. The manager may **continue** the same agent across steps instead of re-spawning it — re-sending a small delta-brief to an agent that already holds the problem context. This cuts the redundant re-loading and re-reading a fresh spawn pays on every dispatch.

**Mechanism — Claude Code Agent Teams.** A continued agent is a *teammate*: a persistent, independent Claude Code session re-addressed by name via `SendMessage`, with its own context preserved across messages. Agent Teams is experimental and off by default — the manager confirms `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (Claude Code v2.1.32+) before continuing. Continuation is **preferred-where-safe, with a fresh-spawn fallback**: if the flag is unset, or the teammate has died, the manager fresh-spawns with a full brief. Teammates cost more in general — token cost scales linearly with teammate count — so the token win holds **only** in the sequential single-persistent-teammate pattern, not in parallel fan-out. Teammates do NOT survive `/compact`, `/clear`, or resume: at any of those, the in-process teammate is gone and the manager must fresh-spawn and re-prime from durable session record.

**Native Codex default.** Codex does not currently expose this Claude Code Agent Teams `SendMessage` continuation surface in Gobbi's native contract. In native Codex, leader / executor / assistant dispatches are fresh specialist spawns unless the user explicitly authorizes a future Codex continuation mechanism. Fresh Codex specialists always receive the full Load Directives stack.

> The deep spawn choreography and the teammate-aware session metadata live in [`orchestration/workflow/execution.md`](workflow/execution.md), [`orchestration/workflow/ideation.md`](workflow/ideation.md), and [`orchestration/SKILL.md`](SKILL.md). This section defines only the decision rule and the delta-brief.

### Decision rule (role × transition)

| Role × transition | Decision | Why |
|---|---|---|
| **leader** — Ideation Sub-step A→B→C→D→WORK (within one loop, team + session live) | **Claude Code: CONTINUE** where Agent Teams is enabled. **Codex: FRESH** | The same PI can carry the framed problem in Claude Code; native Codex re-primes from durable artifacts instead. |
| **leader** — Ideation→Preparation→Planning (across loops) | **Claude Code: CONTINUE best-effort** while team + session stay live; degrades to FRESH after `/compact`/`/clear`/resume. **Codex: FRESH** | Cross-loop continuation is live-session-only and not a Codex readiness assumption. |
| **executor** — task NN→NN+1, **shared subsystem**, under the saturation cap | **Claude Code: CONTINUE** where Agent Teams is enabled. **Codex: FRESH** | Avoids re-learning in Claude Code; native Codex uses full re-prime. (F1 predicate below applies only to Claude Code continuation.) |
| **executor** — task NN→NN+1, **disjoint subsystem OR cap reached** | **FRESH** (default) | Bounds context-rot; the fresh fallback is cheap because state is carried via files. |
| **assistant** — RECORD across loops, or multi-step exploration | **Claude Code: CONTINUE** where Agent Teams is enabled. **Codex: FRESH** | Claude Code can carry session-synthesis context as a teammate; native Codex uses fresh assistant support with full context. |
| **evaluator** — any reuse / share / teammate | **FORBIDDEN to continue, share, or be made a teammate** | Producer/evaluator separation + dual-system anti-groupthink independence is non-negotiable. A continued evaluator carries its own prior verdict → confirmation bias; a teammate-evaluator is reachable in the team mailbox → contamination. The evaluator is the SOLE fresh, never-teammate, report-back subagent — kept OUT of the team. |

### F1 — the executor continue predicate

The executor row above turns on two operational tests. Both must hold to CONTINUE:

- **Shared subsystem** — the next task's `files:`/feature scope OVERLAPS the current task's touched files, OR the two tasks are in the same feature directory. If neither holds, the subsystem is disjoint → FRESH.
- **Saturation cap** — continue at most **3 consecutive tasks**, then force a fresh spawn even when the subsystem still matches, to bound context-rot. Break early — fresh-spawn before the cap — if the context budget is strained.

### The delta-brief

The **first** spawn of an agent loads the full Load Directives stack (principles → rules → skills → mistakes) plus the full brief. Each **continuation** turn carries a **delta-brief** instead — never a re-paste of the Load Directives block. A delta-brief contains only:

1. **The next-step goal** — what this turn does.
2. **New inputs** — the new prior-loop outputs or files this turn needs.
3. **A re-anchor on anything that changed** — if a rule, a mistake, or the scope contract changed mid-session (e.g., a promotion, or a REVISE that moved the scope), name the changed file explicitly.
4. **The re-stated scope boundary** — what is in and out of scope for this turn.
5. **The re-stated status enum** — placed last (recency).

Agent Teams validates this model: a teammate loads CLAUDE.md + skills fresh on its first turn and does NOT inherit the lead's conversation, so the accumulated context it already holds is exactly what a delta-brief builds on.

---

## The Status Contract

### Response wire format (how the subagent's final response begins)

Every subagent's final response MUST begin with these structured lines — the **first** lines of the response body. The manager parses from the top and dispatches deterministically:

```
STATUS: <DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED>
VERDICT: <PASS|REVISE|FAIL>   ← evaluators only; omit for non-evaluator roles
ARTIFACT: <path>              ← if any artifact was produced; omit if none
SKILLS LOADED:                ← mandatory; one path per required Load-Directives file Read
  - <exact path of each Load-Directives file you Read, in order>
```

Followed immediately by prose details (summary, findings, verification output, concerns, etc.). The `SKILLS LOADED:` checklist comes right after the STATUS/VERDICT/ARTIFACT lines and lists the exact path of every Load-Directives file the subagent Read (principles, rules, skills, mistakes), plus the rule read-state (`RULES_PRESENT: <paths>` or `NO_PROJECT_RULES: …`) and the recursive mistake roots read (`mistakes/**` + feature) — so the rule-load and recursive-mistake (M5) contracts are auditable at accept-time. It is the subagent's self-report; the manager verifies it against the transcript (see [§ Manager verification](#manager-verification--the-ground-truth-backstop)).

**Example — executor reporting DONE:**
```
STATUS: DONE
ARTIFACT: sessions/2026-05-20-abc123/4-execution/working/draft-iter1.md
SKILLS LOADED:
  - .gobbi/projects/gobbi/skills/principles/SKILL.md
  - .gobbi/projects/gobbi/skills/mistake/SKILL.md
  - .gobbi/projects/gobbi/skills/orchestration/workflow/execution.md

Implementation complete. Tests pass (2197/0). Scope boundary respected — 3 files modified.
...
```

**Example — evaluator reporting REVISE:**
```
STATUS: DONE
VERDICT: REVISE
ARTIFACT: sessions/2026-05-20-abc123/1-ideation/evaluation/iter1/claude/
SKILLS LOADED:
  - .gobbi/projects/gobbi/skills/principles/SKILL.md
  - .gobbi/projects/gobbi/skills/evaluation/SKILL.md
  - .gobbi/projects/gobbi/skills/mistake/SKILL.md

7 perspectives + Overall complete. 3 High findings (open). See per-perspective files.
...
```

**Example — subagent emitting NEEDS_CONTEXT:**
```
STATUS: NEEDS_CONTEXT

Missing: the locked Scope Contract from the Ideation Loop. The brief references it
by path but the file does not exist at the cited location.
user-question:
  question: "Where is the Scope Contract for this task?"
  description: "The executor brief cites `sessions/.../1-ideation/outputs/scope-contract.md`
    but that path does not exist. The task cannot be scoped without it."
  options:
    - label: "Re-point to the correct path (Recommended)"
      description: "Provide the actual path to the Scope Contract artifact."
    - label: "Supply the Scope Contract inline"
      description: "Paste the Scope Contract text into a follow-up re-delegation."
  recommended-option: "Re-point to the correct path"
```

### NEEDS_CONTEXT user-question schema

When a subagent emits `STATUS: NEEDS_CONTEXT` and the missing context requires user input, the response body MUST include a `user-question:` block. The manager reads this block and constructs an user-decision primitive call on behalf of the subagent.

```yaml
user-question:
  question: <one-line statement of what is needed>
  description: <1-2 sentence context — why this is blocking, what it affects>
  options:
    - label: <option label — first option is Recommended>
      description: <reason + pros/cons, ≥ 40 chars>
    - label: <alternative option>
      description: <reason + pros/cons, ≥ 40 chars>
  recommended-option: <label of the preferred option>
```

If the missing context can be fetched without user input (e.g., by reading a file, running a command, or delegating to an assistant), the manager does that first — only escalate to the user if the manager cannot resolve it independently. The `user-question:` block signals "user input required"; absence of the block signals "manager can resolve".

### Prompt placement (why Report Format is at the end)

The `## Report Format` section appears at the **end** of every delegation prompt — placement matters because of recency bias: the subagent reads the report format last and produces output structured accordingly. The wire format above governs the *response*; the prompt placement governs the *instruction*.

### Per-role enums

| Role | Status values | Verdict |
|---|---|---|
| `leader` | `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED` | — (omit VERDICT line) |
| `executor` | `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED` | — (omit VERDICT line) |
| `evaluator` | `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED` | `PASS` / `REVISE` / `FAIL` |
| `assistant` | `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED` | — (omit VERDICT line) |

### Manager dispatch table

| Subagent STATUS | Manager action |
|---|---|
| `DONE` | Parse ARTIFACT path; advance to next planned step (or surface to user). |
| `DONE_WITH_CONCERNS` | Surface concerns to user through the active runtime's user-decision primitive before advancing. |
| `NEEDS_CONTEXT` | If `user-question:` block present: ask through the active runtime's user-decision primitive. Otherwise: fetch missing context (file read / assistant delegation) and re-delegate. Do NOT retry with the same prompt unchanged. |
| `BLOCKED` | Stop. Re-contract with the user. Do NOT silently retry. |
| `BLOCKED` with `reason: wrong-phase-dispatch` | **Re-dispatch**, not abort. The subagent identified a role mismatch — re-delegate to the correct role without re-contracting with the user (unless the correct role is ambiguous). |

The manager translates this into its own user-facing status (`PROCEED` / `PROCEED_WITH_CONCERNS` / `NEEDS_DECISION` / `BLOCKED`) in the next user message.

---

## Anti-Patterns

The manager must NOT produce delegation prompts that look like these. Each is a known failure mode.

- ❌ **Too broad** — "Fix all the tests" / "Clean up this module." The subagent picks an arbitrary subset and you cannot verify what they covered.
- ❌ **No context** — "Fix the race condition." The subagent does not know where, in what subsystem, against what invariant.
- ❌ **No constraints** — "Refactor this for clarity." Without scope and out-of-scope, the subagent rewrites adjacent code that should not change.
- ❌ **Vague output** — "Make it better." You cannot verify completion because there is no acceptance criterion.
- ❌ **Spec by `@path`** — citing the primary spec by path instead of pasting it inline. See [§ Inline-Paste Rule](#inline-paste-rule).
- ❌ **Lazy load directives** — "Load any skills you need." The subagent guesses. Specify the exact list, in order.
- ❌ **Skill named without a path** — "Load the `principles` skill" with no file path and no note that a spawned subagent has no Skill tool. A tool-less subagent cannot act on a bare skill name; give the exact `SKILL.md` path, state that "load" means Read it, and require the `SKILLS LOADED:` checklist so the manager can verify the Read happened.
- ❌ **No status contract** — Prompt ends mid-instruction with no `## Report Format` section. The subagent produces a prose summary the manager has to interpret.
- ❌ **Author transcript leaked to evaluator** — Evaluator receives the producer's chain of thought, breaking producer/evaluator separation (`evaluation/SKILL.md`). Evaluators get a constructed context bundle only.
- ❌ **Continued / shared / teammate evaluator** — reusing an evaluator across iterations, sharing one between systems, or adding it to the Agent Team. See [§ Continue vs Fresh](#continue-vs-fresh).
- ❌ **Parallel implementation** — Spawning two executors against the same scope or against overlapping files. Implementation is sequential; only research, investigation, and evaluation parallelize.
- ❌ **Per-perspective evaluator spawning** — Spawning one evaluator agent per perspective (8 agents for 7 perspectives + Overall). The canonical topology is 2 agents in parallel — one per system (Claude + Codex). Each handles all 7 perspectives + Overall sequentially per the 4-stage procedure in `evaluation/SKILL.md`. Perspective isolation is maintained within the agent's own context discipline, not by spawning separate agents per perspective.
- ❌ **Proposer self-authoring on empty Codex output** — the Codex wrapper fabricating a proposal instead of reporting BLOCKED-on-empty (which degrades to the Claude-only labeled fallback). See [§ Producer Dispatch](#producer-dispatch-dual-system-production).
- ❌ **Codex proposal transcript leaked to the Codex evaluator** — feeding the proposal transcript into the Codex evaluator prompt (breaks proposer↔evaluator independence). See [§ Producer Dispatch](#producer-dispatch-dual-system-production).

---

## Pre-Dispatch Fill Checklist (Rendered-Prompt Validation)

Before spawning, the manager validates the RENDERED prompt (not the template) — modeled on the `codex/delegation.md` Gate 1. A prompt failing any check is malformed; fix before dispatch.

- [ ] **No unresolved `<<slot>>`** — every `<<…>>` marker substituted. (This runs on the RENDERED prompt, NOT the template files, which legitimately keep `<<slot>>` markers.)
- [ ] **No leftover conditional block** — every "fill when… / DELETE when…" block filled or removed (the dual-system block deleted for `single` / Research / native Codex; the assistant `Mode:` fill/delete applied).
- [ ] **Every Load-Directives path exists on disk** — `ls`/`find` each cited path (prevents the [`mistakes.md#delegation-briefs-reference-nonexistent-rules-dir`](mistakes.md#delegation-briefs-reference-nonexistent-rules-dir) trap).
- [ ] **Structured headers present** — `Your phase:` / `Your iteration:` / `Your sub-step:` (+ `Your system:` on the evaluator), above the Load Directives.
- [ ] **Load Directives precede the Task Description** (D2 order).
- [ ] **Write Roots are fully-expanded absolute paths** — no `$WT` / `<worktree>` / CWD-relative placeholder (the [`git/mistakes.md#executor-wrote-to-main-tree-not-worktree`](../git/mistakes.md#executor-wrote-to-main-tree-not-worktree) trap).
- [ ] **`SKILLS LOADED:` required** in Report Format, with rule/mistake read-states.
- [ ] **`## Report Format` is the LAST section.**

Optional author-time lint: grep each `templates/{role}.md` for the required tokens above.

---

## Inline-Paste Rule

The primary spec — task description, question, or contract being evaluated — is **pasted inline** into the delegation prompt. The subagent reads it as part of the prompt, not by following a path.

Reference materials are different: those are the *additional* files the subagent MAY read during Study. They live in the `## Reference Materials` section and are cited by path. The primary spec is never in Reference Materials.

**Why.** A subagent that has to read the spec from a file:
- May read it partially (skim, summary, first-N-lines).
- May interpret a section out of context (without the manager's framing).
- Cannot be diffed at the dispatch level — the manager cannot see what the subagent actually received.

Pasting inline makes the prompt itself the auditable record of what the subagent saw.

---

## Anti-trust Block (Evaluators Only)

Every evaluator delegation prompt opens with a `CRITICAL: Do Not Trust the Report` block — the full DO / DO-NOT boilerplate lives in [`templates/evaluator.md`](templates/evaluator.md) § CRITICAL, is mandatory, and must not be paraphrased. In one line: the producer cannot evaluate its own work, so the evaluator runs every verification itself, reads the deliverable in full, compares claimed vs actual evidence, and proposes no fixes.

---

## Producer Dispatch (Dual-System Production)

The creation-time analogue of the evaluator Anti-trust Block. **Native Codex WORK dispatches exactly one native producer. Its rendered producer brief contains no proposal, reconciliation, `production_mode`, `claude-only`, `codex-only`, or synthetic-role label.** When Claude Code bridge production runs under `propose.mode: dual`, the manager spawns **two producers in parallel-independent generation**: the **Claude producer** (leader for Ideation / Preparation / Planning, executor for Execution, assistant for Wrap-up) writes the canonical `working/draft-iter{n}.md`, and the **Codex proposer** (the `codex exec` assistant-wrapper from [`codex/SKILL.md` § Dual-System Production](../codex/SKILL.md)) writes only its proposal at `working/proposals/codex/draft-iter{n}.md`. Neither sees the other while generating. The manager runs the spawn → freeze → integrate sequence through [`workflow/production.md`](workflow/production.md); this section owns only the **producer delegation brief shape**, not the orchestration and not the Codex prompt-file transport. The Claude-wrapper-to-Codex prompt-file contract lives in [`codex/delegation.md`](../codex/delegation.md).

**Producer-integration brief shape.** Under `propose.mode: dual`, the producer's delegation prompt carries three elements beyond the base template (the per-role templates ship them as a dedicated dual-system block, filled only when the mode is `dual`):

1. **Proposal-path input** — the frozen Codex proposal at `working/proposals/codex/draft-iter{n}.md` (Execution per-task: `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md`). The producer reads it during Study, after the pre-integration freeze — never racing a still-writing Codex run.
2. **Selective-integration duty** — fold in each Codex element that better satisfies the 10 principles + the Scope Contract + memory/mistakes; keep its own where stronger. **Never naive-blend** — integration is a SELECTION, not an average and not a third synthesized draft.
3. **Integration Log** — one row per delta (`delta` / `decision` / `why` / `codex_origin`) to `working/reconciliation-iter{n}.md`; surface any unresolvable `large-gap` to the manager (a safety gate that interrupts in both Auto and Chat).

The producer templates ([`templates/leader.md`](templates/leader.md), [`templates/executor.md`](templates/executor.md), [`templates/assistant.md`](templates/assistant.md)) carry this block. [`templates/evaluator.md`](templates/evaluator.md) does NOT — the evaluator reviews, it never proposes.

**Independence rules (mirror the evaluator independence anti-patterns).** Three structural guards keep the cross-family signal intact — **BLOCKED-on-empty, never self-author** (degrade to the `production_mode: claude-only` labeled fallback, which is NOT a safety gate — contrast a missing Codex *evaluator*, which IS a gate), **the Codex proposal transcript is NEVER fed into the Codex evaluator prompt**, and **the wrapper prompt file is complete** (exact load / output / schema / timeout / wrong-root / source-write / no-self-author paths). Full statements + rationale live in [`workflow/production.md`](workflow/production.md) and [`codex/delegation.md`](../codex/delegation.md); do not restate them here.

> **Runtime scope of the degraded label.** `production_mode: claude-only` is valid ONLY when
> the producer is actually the Claude-side (Claude Code bridge) producer AND the Codex proposer
> failed. A native Codex producer never stamps it — native-Codex dual production is deferred
> (`backlogs/codex/native-codex-proposer-symmetry.md`), and `production_mode: codex-only` is not a
> defined value (`record/SKILL.md` § Artifact frontmatter defines only `dual | claude-only`).

---

## Model Selection

> **Claude Code defaults reasoning-heavy work to opus and narrow assistant lookups to sonnet. Codex inherits the parent session model and uses role-specific effort from the wrapper unless the user explicitly overrides it.**

In Claude Code, opus covers every role whose quality bar depends on reasoning — manager (user-facing decisions), leader (open-ended investigation and decomposition), evaluator (catching non-obvious gaps an author missed), and executor (implementing within scope still needs reasoning depth for correctness and edge cases). Sonnet is reserved for the narrow read-only assistant — lookups, references, and factual answers that do not require judgment. The manager sets `model:` on the Claude Code `Agent` tool call at dispatch time, which overrides the agent definition's default. In native Codex, do not hard-code model names in Gobbi TOML unless the user explicitly asks; let Codex inherit the parent session model. The `.codex/agents/*.toml` wrapper's `model_reasoning_effort` field is the role effort default: `leader` remains `xhigh`; `manager`, `executor`, `evaluator`, and `assistant` use `high`.

| Agent | Stance | Claude Code model | Codex model | Codex effort | Rationale |
|---|---|---|---|---|---|
| `manager` | — | opus | inherit parent | high | Session main agent; orchestration + user discussion require deep reasoning |
| `leader` | — | opus | inherit parent | xhigh | Deep reasoning across investigation, research, and decomposition |
| `executor` | — | opus | inherit parent | high | Implementation within scope still needs reasoning depth for correctness and edge cases |
| `evaluator` | — | opus | inherit parent | high | Adversarial assessment of artifacts + process docs needs deep reasoning to catch non-obvious gaps |
| `assistant` | — | sonnet | inherit parent | high | Narrow, fast support work — lookups, references, factual answers |

> **The `manager` row is listed for model-tier completeness only** — the manager is the root session agent (Not Task-spawnable, per [§ Agent Roster](#agent-roster)); it is never dispatched via the subagent primitive. Only `leader` / `executor` / `evaluator` / `assistant` are spawned.

> **Dispatch-time overrides are explicit, not inferred.**

If a specific Claude Code task calls for a model different from the role's default — an exceptionally mechanical sub-task that fits sonnet, or a complex assistant lookup that warrants opus — the manager sets `model:` on the `Agent` call explicitly and documents the reason in the delegation prompt's `## Context` block. For Codex, model changes are a user-level runtime choice, not a Gobbi TOML default. Effort changes outside the role defaults require explicit user direction. The role's default is the right choice unless the manager can articulate why this task is exceptional.

> **Model tiers and capabilities evolve — these are current guidelines, not permanent assignments.**

---

## Judgment Calls

**Specificity vs autonomy** — Over-specified prompts produce rigid work; under-specified prompts miss requirements. Templates give a deterministic floor; the manager calibrates the slot content based on how well-defined the task is.

**When to include code references** — If the subagent needs to follow an existing pattern, point to the reference files in `## Reference Materials`. The codebase is the source of truth.

**When to split vs combine** — If two subtasks need the same role, same context, and same files, combine them. Docs-cleanup batches (3-5 related markdown files) prefer a single sequential dispatch — see the `rules/docs-cleanup-parallelism.md` rule when that project rule is present.

**When to include exploration findings** — If the plan was preceded by multi-perspective exploration, paste the synthesized findings in the `## Context` block. Findings are context, not constraints — the subagent uses them to make better-informed decisions but is not bound by the explorers' conclusions.

**When to include pre-resolved decisions** — When the user has locked specific implementation choices during ideation (via contribution points or the active runtime's user-decision primitive), encode those as explicit constraints in the `## Constraints / Scope` block under "Pre-resolved decisions." Scope says what not to touch; pre-resolved decisions say which choices are settled. A subagent that re-opens a settled decision wastes context.

**When to specify verification commands** — Always for executors. Manager specifies the exact `bun test` / `bun run check` / etc. commands in the `## Verification Commands` block. The executor runs them and pastes the output; manager parses for `DONE` vs `DONE_WITH_CONCERNS`.

---

## Agent Roster

Canonical phase list: **`.gobbi/projects/gobbi/skills/gobbi/SKILL.md` § Glossary is the single source of truth**; `AGENTS.md` mirrors it. All agent + skill docs align to Configuration → Ideation → Preparation → Planning → Execution → Wrap-up (Evaluation and RECORD are sub-phases that run inside each loop). Drift from this list — or between the mirror and the source — is a bug.

The manager delegates to these agent types. Each has a distinct role — understanding boundaries prevents misrouting. Definitions live at `.gobbi/projects/gobbi/agents/{role}.md`. Runtime wrappers point back to those canonical prompts: `.claude/agents/{role}.md` for Claude Code, `.codex/agents/{role}.toml` for Codex.

| Agent | Role | When to use | Model | Effort |
|---|---|---|---|---|
| `manager` | Session chief — orchestration, user discussion, decision-making | The root session agent. Not Task-spawnable; this is the behavioral spec for the main agent. | Opus | high |
| `leader` | PI/PM — research, ideation direction, planning decomposition | Ideation / Preparation / Research / Planning sub-phases. Single leader per dispatch. Writes artifacts; never implements code. | Opus | xhigh |
| `executor` | Implementation — code, edits, docs within scope | Execution phase. Reads brief + research, implements within scope boundary, returns one of 4 statuses with verification evidence. | Opus | high |
| `evaluator` | Adversarial assessor — artifacts + process docs | Evaluation sub-phase (mandatory after Execution; optional after Ideation / Planning). Spawn exactly 2 in parallel — one per system (Claude + Codex). Each handles all 7 perspectives + Overall sequentially; cross-system divergence is the anti-groupthink signal. | Opus | high |
| `assistant` | Lightweight support — references, lookups, codebase exploration | Narrow factual / read-only support; can parallelize. Read-only tool surface. | Sonnet | high |

> **The workflow todo list is manager-owned.** The 6-step harness spine ([`orchestration/workflow/status-display.md` § Harness Todo List](workflow/status-display.md#harness-todo-list)) is created and updated only by the manager; no `leader` / `executor` / `assistant` / `evaluator` subagent creates or updates it.

---

## Subtask Records

After each subagent returns, the manager extracts the delegation prompt and final result from the JSONL transcript and records them in session record. Subagents do not need subtask doc instructions in their delegation prompt — their final response is the record.
