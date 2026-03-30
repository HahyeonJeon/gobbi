---
name: _evaluation
description: MUST load when evaluating any output — ideation, plan, or execution. Evaluation MUST be performed by 2-5 perspective evaluators. The entity that creates must never evaluate its own output.
allowed-tools: Read, Grep, Glob, Bash, Agent, AskUserQuestion
---

# Gobbi Evaluation Skill

Guide for how the orchestrator runs evaluation. Evaluation is not a rubber stamp — it is a rigorous, adversarial assessment performed by separate agents whose job is to find problems, not confirm success.

---

## Core Principles

> **2-5 perspective evaluators. Always at least Project + Overall.**

Every evaluation MUST spawn at least 2 independent perspective evaluators — Project and Overall are always included. Additional perspectives are added based on task type. Each works in isolation without seeing the others' results. Multiple perspectives ensure nothing is missed: each perspective brings domain-specific expertise and all evaluators operate from a critical stance. Disagreements between perspectives are valuable signal — surface them.

> **The entity that creates must never evaluate its own output.**

The agent that produced the work cannot assess it. Evaluators are separate agents with fresh context and read-only access. They cannot modify the output — only judge it and provide feedback. This separation prevents blind spots and self-confirmation bias.

> **Each perspective has a distinct domain. Together they cover the full picture.**

The project evaluator checks alignment with project goals, constraints, and conventions. The architecture evaluator assesses structural soundness. The performance evaluator examines efficiency and scalability. The aesthetics evaluator reviews output quality from the user's perspective. The overall evaluator synthesises across all dimensions and identifies what must be preserved. No single perspective is sufficient alone.

> **Evaluate outcomes against goals, not tasks against checklists.**

Check whether the output achieves what the user actually needs, not just whether individual items were completed. "Existence does not equal implementation." An idea that exists but doesn't solve the root problem fails evaluation. A plan that has all tasks but misses a dependency fails evaluation.

> **Recurring issues become gotchas. Evaluation is the learning mechanism.**

When evaluation reveals a pattern — the same kind of mistake appearing across tasks or sessions — convert it to a gotcha immediately. The gotcha system IS the learning store.

> **Verify by running, not just reading.**

Evaluators have Bash, Grep, Glob, and Read. When the output being evaluated can be verified by running a command — running tests, grepping for expected patterns, checking file existence or syntax — do it. An evaluator that only reasons about output when it could run a verification command misses failures that reasoning alone cannot catch. Not all evaluations need commands: ideation evaluation is mostly reasoning about the quality of ideas, plan evaluation might grep to verify that referenced file paths or patterns actually exist, and execution evaluation should always attempt to verify by running. The principle is simple — when your tools can provide evidence, use them. When they can't, reason rigorously.

---

## Perspective Selection

The orchestrator selects 2-5 perspectives based on what the task involves. All evaluators operate from a critical stance — they look for problems, not confirmation.

**Always include:**

| Perspective | Agent | Always include because |
|-------------|-------|----------------------|
| Project | `__evaluator-project` | Checks goal alignment, conventions, and scope for every task |
| Overall | `__evaluator-overall` | Synthesises across dimensions, identifies "must preserve" items |

**Add when relevant:**

| Perspective | Agent | Add when |
|-------------|-------|----------|
| Architecture | `__evaluator-architecture` | Task creates or modifies code structure, module boundaries, data models, or interfaces |
| Performance | `__evaluator-performance` | Task affects hot paths, processes significant data volume, or has latency sensitivity |
| Aesthetics | `__evaluator-aesthetics` | Task produces user-facing output — code, documentation, CLI text, or UI |

**Perspective count guidance:**
- Minimum 2 (Project + Overall) — always
- Most tasks: 3-4 perspectives
- Complex tasks touching structure, performance, and output: all 5

---

## How Evaluation Works

The orchestrator spawns the selected perspective evaluators for every evaluation:

| Agent | Perspective | Focus |
|-------|-------------|-------|
| `__evaluator-project` | Project | Goal alignment, scope adherence, convention compliance, task specification fidelity |
| `__evaluator-architecture` | Architecture | Structural soundness, module boundaries, data model integrity, interface correctness |
| `__evaluator-performance` | Performance | Efficiency, scalability, hot path impact, data volume handling, latency risks |
| `__evaluator-aesthetics` | Aesthetics | Output quality, clarity, consistency, user-facing correctness and readability |
| `__evaluator-overall` | Overall | Cross-dimension synthesis, "must preserve" list, unaddressed gaps, final verdict |

Each evaluator works independently, loads _gotcha, and returns a verdict: **PASS**, **REVISE**, or **ESCALATE** with specific reasoning.

The orchestrator collects all verdicts and acts:

- **All PASS** → proceed to next stage
- **Any REVISE** → send back with findings presented by perspective. The overall evaluator's "must preserve" list protects good work during revision. User decides priority order for REVISE findings. Max 3 revision cycles, then escalate.
- **Any ESCALATE** → surface to user for decision immediately
- **Perspectives disagree** → the disagreement is valuable signal. If one perspective says PASS but another says REVISE, the specific tension reveals where the output is borderline — surface this to the orchestrator for judgment.

---

## Scoring

Every finding carries its own confidence and severity scores. Aggregate verdicts (PASS/REVISE/ESCALATE) emerge from the collection of individually scored findings, not from an overall impression.

Every finding from an evaluator carries two independent dimensions: **confidence** and **severity**. These are separate assessments — a finding can be high-severity but low-confidence (a potentially catastrophic issue that might be a false positive), or low-severity but high-confidence (a definite minor issue).

### Confidence

Confidence measures how certain the evaluator is that a finding represents a real issue, scored 0-100.

| Score | Meaning |
|-------|---------|
| 0 | False positive — appears like an issue but isn't one on closer inspection |
| 25 | Possible but unverified — could be an issue, but no evidence confirms it |
| 50 | Probable — the issue likely exists, but evidence is indirect or incomplete |
| 75 | Significant and likely — strong reasoning or partial evidence supports this |
| 100 | Definite — verified by evidence, tool output, or incontrovertible reasoning |

These are definitional anchors for the scale, not thresholds derived from external measurement. They give evaluators a shared vocabulary for expressing certainty.

### Severity

Severity measures how impactful the issue would be if it is real, independent of confidence.

| Level | Meaning |
|-------|---------|
| Critical | Blocks progress, breaks correctness, or creates security vulnerability |
| High | Significant flaw that would cause rework if not addressed now |
| Medium | Real issue that should be addressed but doesn't block |
| Low | Minor concern, stylistic, or optimization opportunity |

### Threshold Filtering

Findings with confidence below 80 are suppressed from the evaluation report by default. They are not discarded — the orchestrator or user can request the full unfiltered list. This prevents low-confidence speculation from drowning out high-confidence findings that need action.

The threshold exists because evaluation should drive decisions, not generate noise. An evaluator uncertain about a finding should still record it (it may gain confidence in a future cycle), but it should not compete for attention with findings the evaluator is confident about.

### False Positive Categories

When scoring confidence, evaluators should check whether a finding falls into a known false positive category before assigning high confidence. A finding matching a false positive category scores confidence 0 unless specific evidence overrides the categorization.

| Category | Definition |
|----------|------------|
| Pre-existing | Issue exists in the codebase before this change — not attributable to the evaluated output |
| Out-of-scope | Real issue, but outside the evaluated task's scope boundary — note for future work |
| Style preference | Subjective preference, not a convention violation — drop unless project rules mandate it |
| Linter-catchable | Mechanical issue that automated tooling should catch — note the tooling gap, don't weight as finding |
| Speculative | Hypothetical concern without supporting evidence — record at low confidence, suppress by default |

### Cross-Perspective Scoring

Each evaluator perspective scores confidence and severity independently. When perspectives disagree on the same finding — one scores confidence 90, another scores 40 — the disagreement is highlighted to the orchestrator as signal. A finding that one perspective is confident about and another dismisses reveals a genuine tension worth examining.

---

## What Evaluators Must Check

### Ideation Evaluation

- Is the root problem identified, or is the idea solving a symptom?
- Is the proposed approach concrete enough to plan — mechanisms, interfaces, data flows?
- Are trade-offs explicitly stated, not hidden?
- Are constraints and assumptions surfaced and challenged?
- Are risks identified with severity assessment?
- Are success criteria measurable?
- What's missing that should be there?

### Plan Evaluation

- Is every task narrow enough that scope is unambiguous?
- Are dependencies correctly ordered — would executing in this order actually work?
- Does the plan cover the full scope from the approved idea?
- Are verification criteria defined for each task?
- Is anything missing that was discussed during ideation?
- Do any tasks overlap on the same files (merge conflict risk)?
- Are agent assignments and skill requirements specified for each task?

### Execution Evaluation

- Does the implementation match the task specification — not just "something was done" but "the right thing was done"?
- Does the code compile / pass existing tests?
- Are there security vulnerabilities (OWASP top 10)?
- Are gotchas for this domain respected?
- Is the change minimal and focused — no scope creep, no bonus refactoring?
- Are edge cases handled that were identified during ideation?

---

## Learning Loop

Evaluation findings that reveal patterns become gotchas:

- **First occurrence** → just feedback to the creator
- **Second occurrence** → candidate gotcha — flag it
- **Recurring pattern** → write gotcha immediately via _gotcha

Where gotchas go:
- Project-specific patterns → project skill's `gotchas/{category}.md`
- Cross-project patterns → _gotcha's `{category}.md`

---

## Constraints

- MUST spawn at least Project + Overall evaluators — never skip either
- MUST use separate agents — the creator never evaluates its own output
- All evaluators MUST load _gotcha before starting — past mistakes inform what to look for
- MUST surface perspective disagreements — they reveal where the output is borderline
- Never skip evaluation between workflow stages — an unevaluated idea becomes a flawed plan, a flawed plan becomes wasted execution
- Max 3 revision cycles per evaluation — then escalate to user
