# v0.5.0 Design Review

Comparison analysis and improvement recommendations for gobbi v0.5.0, derived from deep review of GSD-2 (gsd-build/gsd-2) and everything-claude-code (affaan-m/everything-claude-code). Read this when evaluating v0.5.0 spec completeness, prioritizing implementation work, or understanding what was considered and rejected. Assumes familiarity with `v050-overview.md`.

---

## Comparison Analysis

### GSD-2

GSD-2 is a shell-driven orchestration framework for Claude Code. It uses Markdown task files on disk as its state mechanism — each task is a file with YAML frontmatter tracking status, and a shell coordinator script manages transitions. GSD-2 and gobbi independently converged on three foundational patterns: disk-driven state that survives context resets, fresh context per subagent to prevent contamination, and cache-aware prompt ordering to reduce cost. This convergence validates gobbi's architectural direction.

Where GSD-2 contributes ideas gobbi should adopt: task-size validation ("a task must fit in one context window — if it cannot, it is two tasks"), step-level timeout detection for stuck workflows, and verification command integration after subtask execution. These appear in the recommendations below as C6, B3, and B8.

Where gobbi does better: event-sourced single source of truth versus GSD-2's scattered task files, hook-based enforcement versus prompt-level guidance, multi-perspective evaluation versus mechanical verification, and the gotcha prevention system which GSD-2 lacks entirely. GSD-2's shell scripts are also harder to extend and test than gobbi's TypeScript CLI.

### Everything-Claude-Code (ECC)

ECC is a comprehensive configuration framework that operates primarily at the prompt and rules layer. It uses a layered rule system with domain-specific configurations, an instinct mechanism for learning from past interactions (with confidence scoring and promotion pipelines), and an AgentShield security layer for detecting secrets and unsafe operations. ECC targets cross-harness portability — its configurations are designed to work with multiple AI coding tools, not just Claude Code.

Where ECC contributes ideas gobbi should adopt: secret pattern detection in tool call inputs (AgentShield concept, adapted as C7), and positive pattern recording as a lightweight extension to the gotcha system (deferred as D10 — the full instinct system with confidence scoring exceeds boundary, but structured positive patterns do not).

Where gobbi does better: runtime enforcement through hooks versus ECC's prompt-level-only guidance, state-driven orchestration versus ECC's guidance-based approach (the same structural problem v0.5.0 solves for gobbi's own v0.4.x), and event sourcing versus ECC's file-based state which has no replay or crash recovery guarantees.

### Shared Observation

Both references validate the move from guidance to enforcement. GSD-2 enforces through shell scripts and file-based state transitions. ECC enforces through layered rules and security checks. Gobbi enforces through hooks and a typed reducer — structurally the most reliable of the three because hook-level enforcement cannot be bypassed by model reasoning.

---

## Recommendations

Fifteen improvements split into two tiers. Spec clarifications document intended behavior that current specs imply but do not make explicit — low risk, no new dependencies. Behavioral additions add new runtime behavior with cross-component dependencies — higher risk, sequenced.

### Spec Clarifications

Low risk, no sequencing dependencies. Each can be implemented independently.

| # | Name | Spec affected | Source | Priority |
|---|------|---------------|--------|----------|
| C1 | Predicate registry for guard conditions | `v050-state-machine.md`, `v050-prompts.md`, `v050-cli.md` | Architecture evaluation + user decision | High |
| C2 | Lazy event schema migration (read-time) | `v050-session.md` | Best, event sourcing pattern | Medium |
| C3 | Event idempotency key | `v050-session.md` | Best, Kafka/EventBridge pattern | Medium |
| C4 | SubagentStop transcript failure handling | `v050-hooks.md` | Best, ETL patterns | High |
| C5 | Minimum token allocations per prompt section | `v050-prompts.md` | Best, content budgeting | Medium |
| C6 | Task-size validation in Plan step | `v050-prompts.md`, `v050-state-machine.md` | Best, GSD-2 | Medium |
| C7 | Secret pattern detection guard | `v050-hooks.md` | Best, ECC AgentShield | High |

**C1 — Predicate registry for guard conditions.** Spec files reference TypeScript predicate names instead of inline expressions. The CLI maintains a typed registry mapping names to pure functions. `gobbi workflow validate` checks that all referenced predicates exist in the registry. Specs remain pure JSON data; conditions resolve at CLI compilation time, not at runtime. This was a user decision — TypeScript predicates with a registry were chosen over JsonLogic to preserve static validation while avoiding expression language complexity.

**C2 — Lazy event schema migration (read-time).** Store events in their original schema version. Apply migrations during reducer replay, not at write time. This prevents corrupted migrations from being irrecoverable — the original event data is always preserved.

**C3 — Event idempotency key.** Add an `idempotency_key` column (session_id + tool_call_id + event_type) with a UNIQUE constraint. Defensive against future Claude Code hook retry behavior — if hooks fire twice for the same tool call, the duplicate event is rejected at the database level.

**C4 — SubagentStop transcript failure handling.** Three explicit cases: (1) transcript present and parseable — extract and write artifact; (2) transcript present but unparseable — write `delegation.fail` event with transcript path; (3) transcript absent — write `delegation.fail` with reason. The current spec does not address cases 2 and 3, which means silent data loss on transcript failures.

**C5 — Minimum token allocations per prompt section.** Define minimums for static prefix, step instructions, and gotchas. If minimums exceed the model context window, the CLI emits a clear error instead of silently truncating critical prompt sections.

**C6 — Task-size validation in Plan step.** The CLI estimates token budget for each task's delegation prompt. Tasks exceeding the budget trigger a warning (not a block — the user decides). Drawn from GSD-2's rule that a task must fit in one context window.

**C7 — Secret pattern detection guard.** A PreToolUse guard checks Write/Edit inputs for API key and token patterns. The match filter excludes `.gobbi/sessions/**` paths (narrowed from `.gobbi/**`) to avoid false-positives on session artifacts while still checking `.gobbi/config.json` and other non-session files.

### Behavioral Additions

Higher risk with cross-component dependencies. Must be implemented in the sequence below.

| # | Name | Spec affected | Source | Dependencies |
|---|------|---------------|--------|--------------|
| B1 | Explicit error state in state machine | `v050-state-machine.md` | Best, AWS Step Functions | None — prerequisite for B2, B3, B4 |
| B2 | Feedback round hard cap (default 3) | `v050-state-machine.md` | Both, circuit breaker | Requires B1 |
| B3 | Stuck detection with per-step timeouts | `v050-state-machine.md`, `v050-hooks.md` | Both, GSD-2 | Requires B1 |
| B4 | Crash recovery briefing with pathway differentiation | `v050-session.md`, `v050-prompts.md`, `v050-cli.md` | Both, GSD-2 | Requires B1, B5 |
| B5 | Artifact versioning across feedback rounds | `v050-session.md`, `v050-hooks.md` | Innovative, saga pattern | None — prerequisite for B4 |
| B6 | Cost/token tracking on delegation events | `v050-session.md`, `v050-hooks.md` | Both, GSD-2 | Depends on Claude Code API surface |
| B7 | Abandoned session: 1h threshold + heartbeat | `v050-session.md`, `v050-hooks.md` | Best | None |
| B8 | Verification command integration | `v050-prompts.md`, `v050-hooks.md`, `v050-cli.md` | Innovative, GSD-2 | Requires B5 (verification events reference artifact filenames) |

**Sequencing constraint:** B1 (error state) must precede B2 (feedback cap) and B3 (stuck detection), because both transition to the error state. B5 (artifact versioning) must precede B4 (crash recovery briefing) and B8 (verification commands), because both reference versioned artifact filenames.

**B1 — Explicit error state in state machine.** Add `error` as a first-class state variant in the discriminated union. Reachable from any active step via timeout, feedback cap exceeded, or invalid transition rejection. Not terminal — the user can resume or abort. Five integration points: typed reducer exhaustiveness, feedback round counter (does not increment on error entry), active subagent handling (in-flight subagents complete normally), transition priority (error takes precedence over skip), and resume pathway differentiation. Full integration requirements are specified in `v050-state-machine.md`.

**B2 — Feedback round hard cap (default 3).** When `feedbackRound >= maxFeedbackRounds`, the next revise verdict transitions to `error` instead of looping back. The workflow does NOT proceed to Memorization — work produced by a pathological loop may be broken. The `error` state gives the user intervention options: `gobbi workflow resume --force-memorization` to save partial work, or `gobbi workflow abort` to discard.

**B3 — Stuck detection with per-step timeouts.** Timeout configuration lives in step spec `meta`. The Stop hook (fires after each turn) checks elapsed time since step entry. If exceeded, writes a `workflow.step.timeout` event and transitions to `error`. Historical median detection is deferred (D11) — requires K>=3 completed sessions before activation.

**B4 — Crash recovery briefing with pathway differentiation.** `gobbi workflow resume` synthesizes a briefing from the event store. Must differentiate four pathways: (a) normal mid-step crash, (b) error from timeout, (c) error from feedback cap, (d) error from invalid transition. Each produces a different briefing because recovery options differ.

**B5 — Artifact versioning across feedback rounds.** Filename-based versioning (`execution-r1.md`, `execution-r2.md`) instead of subdirectories — preserves the flat-directory design principle. The SubagentStop capture hook reads `feedbackRound` from state to construct the filename suffix. Failed rounds get a `delegation-fail-r2.md` marker per C4.

**B6 — Cost/token tracking on delegation events.** Track billed tokens (cache-adjusted, not raw) when available from the Claude Code API. If token data is unavailable in the SubagentStop hook payload, fall back to transcript file size as a rough proxy. Surfaced via `gobbi workflow status` only — cost data must NOT appear in compiled prompts or guard conditions. Data availability depends on the Claude Code API and must be verified before designing the event schema.

**B7 — Abandoned session: 1h threshold + heartbeat.** The Stop hook writes a `session.heartbeat` event with timestamp each turn. Sessions without a heartbeat for 60 minutes are treated as abandoned. Replaces the current 24-hour inactivity threshold.

**B8 — Verification command integration.** Add verification blocks to execution step specs. The CLI runs configured commands (lint, test, typecheck) after each subtask, records results as events. Failure triggers re-execution with error context included in the next prompt.

---

## Deferred Items

Deferred to v0.5.1+ with rationale. These are valid ideas that exceed v0.5.0 scope or require data from v0.5.0 usage before implementation.

| # | Feature | Reason for deferral |
|---|---------|---------------------|
| D1 | Parallel task execution | Requires file conflict detection between concurrent subagents and dependency-aware dispatch. Linear execution is sufficient for v0.5.0 launch. Parallel execution is an optimization, not a correctness requirement. |
| D2 | Prompt compilation IR | Multi-pass compilation adds value only when prompt optimization is a measured bottleneck. V0.5.0 should ship single-pass, instrument compilation timing, and evaluate whether IR is needed based on data. Premature optimization. |
| D3 | ECS-style agent composition | Replaces fixed PI/Executor/Evaluator model with composable capability components. Changes the agent model fundamentally. Fixed categories are well-understood and sufficient for v0.5.0. Composition becomes valuable when project-specific agents need mixed capabilities. |
| D4 | Project-level spec overrides | Allows `.gobbi/spec-overrides/{step}.json` to patch default specs. Ships one workflow profile first; customization requires a stable base to patch against. V0.5.0 establishes that base. |
| D5 | Hook profiles (minimal/standard/strict) | Already planned for v0.5.1 per `v050-hooks.md`. ECC validates demand. |
| D6 | Guard testing harness | `gobbi workflow guard --test` for dry-run evaluation. Valuable for contributors but not blocking for launch. |
| D7 | Headless/CI mode | Architecture naturally supports it (CLI reads state, generates prompts). Implement when CI integration demand materializes. |
| D8 | Conditional evaluation triggers | CLI recommends evaluation based on artifact complexity metrics instead of an upfront decision. Needs threshold calibration data from v0.5.0 sessions. |
| D9 | Codebase map injection | Generate project structure summary during `gobbi workflow init`, include in static prefix. Subagents currently discover structure via tool calls, which works but costs tokens. |
| D10 | Positive pattern recording | Expand gotcha system to include "what works" alongside "what fails." ECC's instinct system validates the concept. The full confidence-scoring version adds learning burden; a lightweight version (structured positive patterns without scoring) is within boundary but deferred to focus v0.5.0. |
| D11 | Historical stuck detection | Step-duration anomaly detection using historical median across sessions. Requires K>=3 completed sessions per step. V0.5.0 ships with hard timeouts only; historical detection activates after sufficient data accumulates. |

---

## Rejected Items

Outside the boundary filter: ClaudeX only, no user study burden. Each rejection includes reasoning.

| # | Feature | Source | Reason for rejection |
|---|---------|--------|----------------------|
| R1 | Cross-harness portability | ECC | Outside ClaudeX scope by definition. Gobbi is Claude Code specific — abstracting across harnesses would dilute the depth of integration that makes gobbi valuable. |
| R2 | Multi-language rule ecosystems | ECC | Project-specific domain knowledge, not ClaudeX tooling. Projects already create their own rules in `.claude/rules/`. A rule ecosystem framework adds infrastructure burden without ClaudeX benefit. |
| R3 | Dashboard GUI | ECC | Heavy UI surface with significant learning burden. Gobbi is a CLI tool; adding a GUI changes the product category. `gobbi workflow status` covers the visibility need. |
| R4 | Milestone/slice hierarchy | GSD-2 | Adds structural concepts users must learn. Gobbi's flat task list with validation is simpler and achieves the same decomposition goal. Hierarchy becomes relevant only for multi-week projects, which are outside v0.5.0's interactive session model. |
| R5 | Full instinct/confidence system | ECC | Requires users to understand confidence scoring, promotion pipelines, and threshold tuning. Significant learning burden for uncertain payoff. The lightweight positive-pattern variant is deferred as D10 instead. |
| R6 | Fleet orchestration | GSD-2 | Enterprise CI concern, not interactive ClaudeX. Gobbi's session model is one user, one workflow, one machine. Fleet orchestration solves a different problem. |
| R7 | Multi-model provider routing | GSD-2 | Gobbi works within Claude Code's model selection, not alongside it. Routing across providers would bypass Claude Code's native model management, contradicting v0.5.0's philosophy of enhancing rather than replacing. |
| R8 | File-level activity tracking | ECC | High event volume with marginal benefit. Tracking every file read/write as an event overwhelms the event store without improving orchestration decisions. Step-level events are the right granularity. |
| R9 | Cost budget ceilings with model downgrading | GSD-2 | Requires gobbi to control model selection, which Claude Code owns. Cost visibility (B6) is within boundary; cost control is not. |

---

## Known Limitations

Accepted risks the implementation team must understand. These are not deferrable features — they are structural tradeoffs inherent to v0.5.0's design decisions.

### Persistent orchestrator quality degradation

With fresh-per-step rejected, the orchestrator accumulates reasoning traces across workflow steps even though bounded prompts constrain what it receives. Mitigation: bounded prompts reduce the impact (each step's prompt is compiled fresh), and Claude Code's compaction handles extreme cases. This is a known tradeoff — the simplicity of a single session outweighs the theoretical purity of fresh-per-step for v0.5.0's use case (interactive ClaudeX, not autonomous CI pipelines).

### Cost tracking data availability

Token usage tracking (B6) depends on Claude Code exposing token data in SubagentStop hook payloads or transcript files. If unavailable, the feature degrades to transcript file-size proxy. This must be verified during implementation before designing the event schema.

### Stuck detection bootstrapping

Historical step-duration metrics (D11) require K>=3 completed sessions. V0.5.0 ships with hard timeouts only. First-time users have no anomaly detection until enough sessions accumulate.

---

## User Decisions

Resolved during ideation and locked as constraints for all recommendations.

### Persistent orchestrator per workflow

> **One Claude Code session = one orchestrator = one full workflow.**

Fresh-per-step was rejected. Bounded prompts and hook enforcement constrain the orchestrator. Quality degradation across steps is an accepted risk (see Known Limitations above). The simplicity of a single session — no inter-session state handoff, no context reconstruction — outweighs the theoretical benefit of fresh orchestrator context per step.

### TypeScript predicates with predicate registry

> **Guard conditions are TypeScript functions, not JsonLogic expressions.**

Specs reference predicates by name. A typed predicate registry maps names to functions. `gobbi workflow validate` checks that all referenced predicates exist in the registry. This preserves static validation while avoiding JsonLogic's complexity. Adding a new guard condition means adding a function to the registry — no custom operator protocol, no expression parser, and full IDE support for implementation and testing.

---

## Boundaries

This document covers comparison analysis of GSD-2 and everything-claude-code against gobbi v0.5.0, fifteen improvement recommendations (seven spec clarifications, eight behavioral additions), eleven deferred items with rationale, nine rejected items with reasoning, three known limitations, and two user decisions.

For the specs these recommendations modify, see: `v050-state-machine.md`, `v050-session.md`, `v050-hooks.md`, `v050-prompts.md`. For the architectural overview, see `v050-overview.md`.
