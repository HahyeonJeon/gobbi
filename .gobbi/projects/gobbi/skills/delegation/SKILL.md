---
name: delegation
description: How the manager constructs delegation prompts and hands off work to specialist subagents. Per-role templates, deterministic load directives, anti-pattern callouts, status contracts, and model selection.
allowed-tools: Read, Grep, Glob, Bash
---

# Delegation

How the manager passes work to spawned subagents. The goal is **deterministic delegation** — the manager fills the same template the same way every time, the subagent loads the same things in the same order every time, nothing is left to inference.

Sub-document of the `orchestration` skill. Loaded whenever the manager is about to call the `Agent` tool.

---

## Core Principles

> **Tell specialists what to do, not how to do it.**

Detailed "how" instructions suppress a specialist agent's ability. Define the goal, the constraints, and what to avoid — then trust the specialist to find the best approach. Guardrails about "not to do" protect quality; prescriptive "how to do" limits it.

> **Construct exactly what the subagent needs. Nothing is inherited.**

A fresh subagent has no exposure to the manager's session — no transcript, no chain of thought, no skills the manager loaded earlier. The manager builds the context bundle inline. The subagent never reads the manager's mind.

> **Inline paste, never `@path` for the primary spec.**

The task spec is pasted inline into the prompt. Reference materials (additional reading) may be cited by path. A subagent that has to read the primary spec from a file path adds a layer of inference between the brief and the work.

> **Deterministic load order: principles → rules → skills → mistakes.**

Every delegation prompt contains a numbered Load Directives block. The subagent loads them top-to-bottom before any other action. No skipping, no re-ordering, no inference about which skills are relevant.

> **Status enum at the end of the prompt.**

Every spawned agent reports with an explicit status enum at the end of its response. The enum is the last thing the subagent reads in the prompt before producing output (recency bias). The manager parses the status line first and dispatches deterministically.

> **Any delegation prompt for a MEMORIZATION sub-phase MUST include `memorization/SKILL.md` in tier 3 (Skills) of the Load Directives block.**

MEMORIZATION is a specialized sub-phase with its own memory-tier boundaries, staging rules, and idempotency contract. A fresh subagent dispatched to run MEMORIZATION cannot operate correctly without loading `memorization/SKILL.md`. This is a hard gate: a delegation prompt that omits `memorization/SKILL.md` from the Skills tier when the sub-phase is MEMORIZATION is a malformed prompt — the manager must add it before dispatching.

---

## Per-role Templates

The manager uses one template per role. Templates live in [`templates/`](templates/):

| Role | Template | Use when |
|---|---|---|
| `leader` | [`templates/leader.md`](templates/leader.md) | Ideation, Preparation, Research, Planning sub-phases. Single leader per dispatch. |
| `executor` | [`templates/executor.md`](templates/executor.md) | Execution phase. One executor per task; tasks sequence (never parallelize implementation). |
| `evaluator` | [`templates/evaluator.md`](templates/evaluator.md) | Evaluation sub-phase. Spawn exactly 2 in parallel — one per system (Claude + Codex). Each evaluator handles all 7 perspectives + Overall sequentially; per-system isolation provides the anti-groupthink signal. |
| `assistant` | [`templates/assistant.md`](templates/assistant.md) | Narrow read-only support (lookups, references, codebase exploration). Can parallelize. |

The templates are not paraphrased into prose at dispatch time — they are filled out literally. Every `<<slot>>` is replaced with the actual value; no slot is left as a placeholder.

**Cross-pollination mechanism:** the v0.4.x dual-stance design (innovative + best stances as orthogonal hypothesis generators) was retired in v0.5.0 in favor of a single leader per dispatch. Orthogonal hypothesis generation is now provided by **dual-system evaluation** — Claude and Codex independently judge the leader's output, and divergence between systems is the anti-groupthink signal. See `orchestration/workflow/evaluation.md` § Why dual-system is mandatory.

---

## What Every Delegation Prompt Contains

All four per-role templates share this scaffold (per-role tails add the rest):

1. **Identity line** — `You are a {role}...` (sets voice + role on the first token).
2. **Task Description / Question** — the **primary spec, pasted inline**. Never a `@path`. Manager-authored or paste of the user's exact wording.
3. **Context** — manager-authored scene-setting (where it fits, dependencies, user-clarified intent, pre-resolved decisions).
4. **Load Directives** — 4-tier numbered block (see below).
5. **Inputs** — prior-loop outputs (paste short items inline; cite paths for longer reference material).
6. **Constraints / Scope** — files in-scope, files out-of-scope, pre-resolved decisions, anti-scope-creep rule.
7. **Your Job** — numbered list of what to do, including lifecycle reference.
8. **Reference Materials** — paths for ADDITIONAL reading (never the primary spec).
9. **Escape Hatch** — explicit `NEEDS_CONTEXT` / `BLOCKED` permission.
10. **Report Format** — the per-role status enum, at the very end.

Role-specific tails:
- `leader` adds **phase** + **artifact path(s)**.
- `executor` adds **Self-Review checklist** + **Verification Commands**.
- `evaluator` adds **CRITICAL: Do Not Trust the Report** block + **Finding Schema** + **Verdict**.
- `assistant` adds **Expected Output Shape**.

---

## The Load Directives Block

Mandatory in every delegation prompt, ordered top-to-bottom:

```text
## Load Directives (in order — load top to bottom before any other action)

1. Principles:
   - `principles` skill (mandatory; fresh subagents do not inherit)
2. Rules:
   - All files under `.gobbi/projects/{project-name}/rules/`
   - {any additional rule files specific to this task}
3. Skills:
   - `mistake` skill (mandatory)
   - {phase doc path — e.g., orchestration/workflow/execution.md}
   - {domain skills with full paths}
4. Mistakes:
   - {specific mistake files relevant to this task's domain}
```

**Why this order.** Principles set the discipline floor (what every agent must never do). Rules narrow that to the project's conventions. Skills give the role-and-domain procedure. Mistakes inject the specific past pitfalls the subagent must avoid in this domain. Loading in this order ensures the most-general discipline is established before the most-specific guidance, so the subagent cannot rationalize a domain skill into violating a principle.

**No inheritance.** Even if the manager already loaded `principles` minutes earlier, every fresh subagent must load it again. There is no session inheritance.

**MEMORIZATION hard gate.** When the delegated phase is MEMORIZATION (or includes a MEMORIZATION sub-phase), `memorization/SKILL.md` MUST appear in tier 3 (Skills). The memorization skill defines the memory-tier access matrix, staging rules, idempotency contract, and exit checklist that the sub-phase agent must follow. Omitting it produces an agent that cannot operate the sub-phase correctly. Per-role templates for `assistant`, `leader`, and `executor` include a placeholder for this entry; see the templates in [`templates/`](templates/).

**Project-memory standard gate.** Any delegation that **writes or evaluates project memory** MUST load `memorization/rules.md` in tier 3 (Skills) alongside `memorization/SKILL.md`. `memorization/rules.md` is the naming / frontmatter / structure standard — the rules a memory file's name, frontmatter, and scope must obey; without it the standard is advisory-only and structural drift recurs. The `leader`, `executor`, and `assistant` templates carry the `memorization/rules.md` line right after their `memorization/SKILL.md` line; the `evaluator` template carries it in tier 3 for delegations that judge project-memory artifacts against the standard (the evaluator has no `memorization/SKILL.md` line).

**Session-write path discipline.** When a subagent's task involves session writes (notes, staging files, project memory drafts), the delegation prompt must remind the subagent to follow the qualified write-path rule: use `session.json.git.worktreePath` as the absolute root. `worktreePath` is always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal. See [`git/SKILL.md` § Memory Access Matrix](../git/SKILL.md#memory-access-matrix) for the full qualified rule.

---

## The Status Contract

### Response wire format (how the subagent's final response begins)

Every subagent's final response MUST begin with these structured lines — the **first** lines of the response body. The manager parses from the top and dispatches deterministically:

```
STATUS: <DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED>
VERDICT: <PASS|REVISE|FAIL>   ← evaluators only; omit for non-evaluator roles
ARTIFACT: <path>              ← if any artifact was produced; omit if none
```

Followed immediately by prose details (summary, findings, verification output, concerns, etc.).

**Example — executor reporting DONE:**
```
STATUS: DONE
ARTIFACT: sessions/2026-05-20-abc123/execution/rawdata/draft-iter1.md

Implementation complete. Tests pass (2197/0). Scope boundary respected — 3 files modified.
...
```

**Example — evaluator reporting REVISE:**
```
STATUS: DONE
VERDICT: REVISE
ARTIFACT: sessions/2026-05-20-abc123/ideation/evaluation/iter1/claude/

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
  description: "The executor brief cites `sessions/.../ideation/artifacts/scope-contract.md`
    but that path does not exist. The task cannot be scoped without it."
  options:
    - label: "Re-point to the correct path (Recommended)"
      description: "Provide the actual path to the Scope Contract artifact."
    - label: "Supply the Scope Contract inline"
      description: "Paste the Scope Contract text into a follow-up re-delegation."
  recommended-option: "Re-point to the correct path"
```

### NEEDS_CONTEXT user-question schema

When a subagent emits `STATUS: NEEDS_CONTEXT` and the missing context requires user input, the response body MUST include a `user-question:` block. The manager reads this block and constructs an AskUserQuestion call on behalf of the subagent.

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
| `DONE_WITH_CONCERNS` | Surface concerns to user via AskUserQuestion before advancing. |
| `NEEDS_CONTEXT` | If `user-question:` block present: construct AskUserQuestion and ask user. Otherwise: fetch missing context (file read / assistant delegation) and re-delegate. Do NOT retry with the same prompt unchanged. |
| `BLOCKED` | Stop. Re-contract with the user. Do NOT silently retry. |
| `BLOCKED` with `reason: wrong-phase-dispatch` | **Re-dispatch**, not abort. The subagent identified a role mismatch — re-delegate to the correct role without re-contracting with the user (unless the correct role is ambiguous). |

The manager translates this into its own user-facing status (`PROCEED` / `PROCEED_WITH_CONCERNS` / `NEEDS_DECISION` / `BLOCKED`) in the next user message.

---

## Hook Integration

Delegation prompts are not only consumed by the spawned subagent — they are also parsed by the [`PostToolUse` hook `.claude/hooks/post-tool-use-agents.sh`](../../../../.claude/hooks/post-tool-use-agents.sh) (registered for `Task` / `Agent` on `PostToolUse` + `PostToolUseFailure`). The hook *routes* `step` / `phase` / `iter` / `sub-step` from the prompt's structured headers and *may seed* an `agents[]` entry's routing fields — but it is NOT the source of truth for **per-agent token usage**: that is recorded by the manager via `jq` over each agent's own transcript (see [`orchestration/SKILL.md` § Recording workflow metadata](../orchestration/SKILL.md#recording-workflow-metadata)). The hook also cannot always resolve the worktree's `session.json` (worktree-path limitation — see [`features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`](../../features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md)), so its upsert is best-effort. For the hook's routing extraction to populate `step` / `phase` / `iter` / `sub-step` correctly when it does fire, every delegation prompt MUST place a small block of **structured headers** at the very top of the prompt body (before any other content).

### Structured-Header Convention

The hook reads four headers via case-insensitive line-anchored regex `^Your (phase|iteration|sub-step|step): (.+)$` from `tool_input.prompt`. Place these at the top of the prompt (template-managed — see [`templates/`](templates/)):

| Header | Value shape | Required | Purpose |
|---|---|---|---|
| `Your phase:` | `ideation` \| `preparation` \| `planning` \| `execution` \| `wrap-up` (evaluator suffixes `-eval`; research uses `research`) | yes | Routes the entry into `session.json.agents[].phase` and the matching workflow step. |
| `Your iteration:` | positive integer (the loop iter inside the step; `1` for first pass) | yes | Stamps `agents[].iter`; powers per-iter session-memory commit cadence. |
| `Your sub-step:` | slug or letter (e.g., `evaluation-claude`, `A`, `B`, `claude-iter1-clean-1of3`) | when more than one spawn shares the same `(step, phase, iter)` | Disambiguates parallel spawns in the same iteration (e.g., dual-system evaluators, batched executors). |
| `Your step:` | step number `1`–`6` matching the canonical state machine | optional | Manager may include for self-documentation; hook prefers `phase` when both are present. |

These four headers are the **only** machine-readable contract between the delegation prompt and the hook. Everything else in the prompt (Identity line, Task Description, Context, Load Directives, etc.) is for the subagent. Per-role templates ship the headers pre-filled with `<<slot>>` markers; the manager fills them at dispatch time as part of the same template-filling pass that resolves every other slot. The manager (or the hook, when it can resolve the `session.json`) records `agents[]` entries; omitting the headers does not break the subagent, but it leaves those entries with `phase` / `iter` / `sub-step` set to `null`, which downstream session-memory queries treat as missing data.

### Serialization safety — `flock -x` on session.json

Both the hook (`post-tool-use-agents.sh`) and its verify-and-fix companion ([`.claude/scripts/reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh)) wrap their `session.json` read-modify-write in a POSIX `flock -x` exclusive lock (held on a sidecar `.lock` file co-located with `session.json`), then commit the new contents via `mv` for atomic replacement. The lock is the design-decision D-3-5 serialization gate: concurrent subagent spawns (e.g., the two parallel evaluators, or a research fan-out) fire PostToolUse events that arrive interleaved, and the lock guarantees the upserts apply in sequence rather than racing each other into a torn write. The manager does not need to throttle spawns or stagger dispatches; the lock makes `agents[]` writes safe under arbitrary spawn concurrency.

---

## Anti-Patterns

The manager must NOT produce delegation prompts that look like these. Each is a known failure mode.

- ❌ **Too broad** — "Fix all the tests" / "Clean up this module." The subagent picks an arbitrary subset and you cannot verify what they covered.
- ❌ **No context** — "Fix the race condition." The subagent does not know where, in what subsystem, against what invariant.
- ❌ **No constraints** — "Refactor this for clarity." Without scope and out-of-scope, the subagent rewrites adjacent code that should not change.
- ❌ **Vague output** — "Make it better." You cannot verify completion because there is no acceptance criterion.
- ❌ **Spec by `@path`** — "See the plan in `plans/foo.md` and implement it." Adds inference between spec and work; subagents may read it partially or interpret it differently than the manager intended. Paste the spec inline.
- ❌ **Lazy load directives** — "Load any skills you need." The subagent guesses. Specify the exact list, in order.
- ❌ **No status contract** — Prompt ends mid-instruction with no `## Report Format` section. The subagent produces a prose summary the manager has to interpret.
- ❌ **Author transcript leaked to evaluator** — Evaluator receives the producer's chain of thought, breaking Principle 2. Evaluators get a constructed context bundle only.
- ❌ **Parallel implementation** — Spawning two executors against the same scope or against overlapping files. Implementation is sequential; only research, investigation, and evaluation parallelize.
- ❌ **Per-perspective evaluator spawning** — Spawning one evaluator agent per perspective (8 agents for 7 perspectives + Overall). The canonical topology is 2 agents in parallel — one per system (Claude + Codex). Each handles all 7 perspectives + Overall sequentially per the 4-stage procedure in `evaluation/SKILL.md`. Perspective isolation is maintained within the agent's own context discipline, not by spawning separate agents per perspective.

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

Every evaluator delegation prompt opens with a `CRITICAL: Do Not Trust the Report` block. The evaluator is told explicitly:

> The agent that produced this work cannot evaluate it. That is your job. You arrive with no exposure to their reasoning or session history.
> **DO:** run verification commands yourself; read the deliverable in full; compare claimed evidence against actual evidence; cross-check against `mistake`.
> **DO NOT:** trust "tests pass" without running them; trust "scope respected" without diffing; trust "research says so" without verifying the citation; cover multiple perspectives; propose fixes.

Boilerplate lives in [`templates/evaluator.md`](templates/evaluator.md). The block is mandatory; do not paraphrase it.

---

## Model Selection

> **Reasoning- and implementation-heavy work gets opus. Only the read-only assistant gets sonnet. All agents run at max effort.**

Opus covers every role whose quality bar depends on reasoning — manager (user-facing decisions), leader (open-ended investigation and decomposition), evaluator (catching non-obvious gaps an author missed), and executor (implementing within scope still needs reasoning depth for correctness and edge cases). Sonnet is reserved for the narrow read-only assistant — lookups, references, and factual answers that do not require judgment. The manager sets `model:` on the `Agent` tool call at dispatch time — it overrides the agent definition's default.

| Agent | Stance | Model | Rationale |
|---|---|---|---|
| `manager` | — | opus | Session main agent; orchestration + user discussion require deep reasoning |
| `leader` | — | opus | Deep reasoning across investigation, research, and decomposition |
| `executor` | — | opus | Implementation within scope still needs reasoning depth for correctness and edge cases |
| `evaluator` | — | opus | Adversarial assessment of artifacts + process docs needs deep reasoning to catch non-obvious gaps |
| `assistant` | — | sonnet | Narrow, fast support work — lookups, references, factual answers |

> **Dispatch-time overrides are explicit, not inferred.**

If a specific task calls for a model different from the role's default — an exceptionally mechanical sub-task that fits sonnet, or a complex assistant lookup that warrants opus — the manager sets `model:` on the `Agent` call explicitly and documents the reason in the delegation prompt's `## Context` block. The role's default is the right choice unless the manager can articulate why this task is exceptional.

> **Model tiers and capabilities evolve — these are current guidelines, not permanent assignments.**

---

## Judgment Calls

**Specificity vs autonomy** — Over-specified prompts produce rigid work; under-specified prompts miss requirements. Templates give a deterministic floor; the manager calibrates the slot content based on how well-defined the task is.

**When to include code references** — If the subagent needs to follow an existing pattern, point to the reference files in `## Reference Materials`. The codebase is the source of truth.

**When to split vs combine** — If two subtasks need the same role, same context, and same files, combine them. Docs-cleanup batches (3-5 related markdown files) prefer a single sequential dispatch — see the [docs-cleanup-parallelism rule](../../rules/docs-cleanup-parallelism.md).

**When to include exploration findings** — If the plan was preceded by multi-perspective exploration, paste the synthesized findings in the `## Context` block. Findings are context, not constraints — the subagent uses them to make better-informed decisions but is not bound by the explorers' conclusions.

**When to include pre-resolved decisions** — When the user has locked specific implementation choices during ideation (via contribution points or AskUserQuestion), encode those as explicit constraints in the `## Constraints / Scope` block under "Pre-resolved decisions." Scope says what not to touch; pre-resolved decisions say which choices are settled. A subagent that re-opens a settled decision wastes context.

**When to specify verification commands** — Always for executors. Manager specifies the exact `bun test` / `bun run check` / etc. commands in the `## Verification Commands` block. The executor runs them and pastes the output; manager parses for `DONE` vs `DONE_WITH_CONCERNS`.

---

## Agent Roster

Canonical phase list: `.claude/CLAUDE.md`. All agent + skill docs align to Configuration → Ideation → Preparation → Planning → Execution → Wrap-up (Evaluation and Memorization are sub-phases that run inside each loop). Drift from this list is a bug.

The manager delegates to these agent types. Each has a distinct role — understanding boundaries prevents misrouting. Definitions live at `.claude/agents/{role}.md` (symlinked to `.gobbi/projects/gobbi/agents/{role}.md`).

| Agent | Role | When to use | Model |
|---|---|---|---|
| `manager` | Session chief — orchestration, user discussion, decision-making | The root session agent. Not Task-spawnable; this is the behavioral spec for the main agent. | Opus |
| `leader` | PI/PM — research, ideation direction, planning decomposition | Ideation / Preparation / Research / Planning sub-phases. Single leader per dispatch. Writes artifacts; never implements code. | Opus |
| `executor` | Implementation — code, edits, docs within scope | Execution phase. Reads brief + research, implements within scope boundary, returns one of 4 statuses with verification evidence. | Opus |
| `evaluator` | Adversarial assessor — artifacts + process docs | Evaluation sub-phase (mandatory after Execution; optional after Ideation / Planning). Spawn exactly 2 in parallel — one per system (Claude + Codex). Each handles all 7 perspectives + Overall sequentially; cross-system divergence is the anti-groupthink signal. | Opus |
| `assistant` | Lightweight support — references, lookups, codebase exploration | Narrow factual / read-only support; can parallelize. Read-only tool surface. | Sonnet |

---

## Subtask Records

After each subagent returns, the manager extracts the delegation prompt and final result from the JSONL transcript and records them in session memory. Subagents do not need subtask doc instructions in their delegation prompt — their final response is the record.
