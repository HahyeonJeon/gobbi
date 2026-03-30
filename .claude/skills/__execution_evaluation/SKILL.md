---
name: __execution_evaluation
description: MUST load when evaluating execution output — code changes, implementations, or task deliverables. Provides stage-specific criteria for assessing correctness, safety, and scope discipline. Used by all 5 evaluator perspectives (Project, Architecture, Performance, Aesthetics, Overall).
allowed-tools: Read, Grep, Glob, Bash
---

# Gobbi Execution Evaluation

Stage-specific evaluation criteria for execution output. Load this skill alongside _evaluation when evaluating the result of a task execution step.

Execution evaluation checks whether the right thing was done, not just that something was done. "The file exists" is not evidence of correct implementation.

---

## What You're Evaluating

Each executed task produces code changes and a subtask document describing what was done. Evaluate the actual implementation against the task specification and the criteria below. Read the changed code — don't trust the subtask document alone.

---

## Evaluation Criteria

### Correctness

- **Specification matched?** — Does the implementation do what the task specification asked for? Not a related thing, not an improved version of the thing — the actual thing that was specified.
- **Tests pass?** — Do existing tests still pass? Were new tests added where the specification required them?
- **Logic sound?** — Does the code actually work for the intended use cases? Trace through the key paths mentally. Look for off-by-one errors, null handling, race conditions.
- **Edge cases handled?** — Are boundary conditions and unusual inputs handled as identified during ideation? Which edge cases were explicitly deferred vs. silently ignored?

### Safety

- **No security vulnerabilities?** — Check OWASP top 10: injection, broken auth, sensitive data exposure, XXE, broken access control, misconfiguration, XSS, insecure deserialization, known vulnerable components, insufficient logging. For concrete security signals by vulnerability class, load _gotcha/_security.md before evaluating.
- **No secrets in code?** — API keys, passwords, tokens, connection strings — nothing hardcoded or committed.
- **Error handling appropriate?** — Are errors handled at system boundaries? Internal errors propagated correctly? No swallowed exceptions hiding failures?

### Scope Discipline

- **Minimal change?** — Is the change focused on the task and nothing else? No bonus refactoring, no "while I'm here" improvements, no added abstractions for hypothetical future use.
- **No scope creep?** — Does the implementation stay within the task's stated scope boundary? If the agent modified files or features outside scope, that's a violation.
- **No unnecessary additions?** — No extra error handling for impossible scenarios, no feature flags, no backwards-compatibility shims, no speculative abstractions.

### Integration

- **Patterns followed?** — Does the implementation follow existing codebase patterns? New patterns should only be introduced when existing ones genuinely don't work, not because the agent preferred a different style.
- **Gotchas respected?** — Check every relevant gotcha for this domain. Does the implementation repeat a known mistake?
- **Docs updated?** — If the implementation changes behavior documented in `.claude/` files, are those docs updated? Stale docs mislead future agents.

### Verification by Running

Execution evaluation is where tool-based verification matters most. Reasoning about code is not enough when you can run commands to confirm.

- **Existing tests still pass?** — If the task involved code changes, run the relevant test suite. A test failure is stronger evidence than any amount of code reading. If no test suite exists, note the gap.
- **Expected patterns present?** — Grep for patterns that should exist after the change — new function names, configuration entries, imports, string literals. Their absence reveals incomplete implementation.
- **Unwanted patterns absent?** — Grep for patterns that should NOT exist — removed code that's still referenced, deprecated patterns the task was supposed to eliminate, debug artifacts left behind.
- **Files syntactically valid?** — Check that modified files are well-formed. Broken imports, unresolved references, and syntax errors are caught faster by tools than by reading.
- **No collateral damage?** — Verify that files outside the task's stated scope were not broken by the change. Changes can have ripple effects — a renamed export breaks importers, a moved file breaks references elsewhere.

The evaluator decides which of these checks are relevant based on the task. Not every execution needs every check — a documentation-only task doesn't need test runs, a config change doesn't need import validation. Use judgment about which tools provide useful evidence for this specific output.

### Deliverable Quality

- **Subtask doc written?** — Did the agent write its result to the specified path?
- **Doc self-contained?** — Can a reader understand the result without reading other subtask docs?
- **What changed documented?** — Are the modified files and the reasoning behind changes described? The code is in the repo — the doc explains why.

---

## Stance-Specific Focus

| Stance | Primary Focus |
|--------|--------------|
| Positive | What's well-implemented? Which patterns are correctly followed? Which decisions show good judgment? |
| Moderate | Is the implementation complete against the spec? Are safety and integration checks proportional? Are there minor issues that don't block but should be noted? |
| Critical | Where does the implementation diverge from the spec? What security risks exist? Where did the agent expand scope? What gotchas were violated? |

---

## Scoring Guidance

Execution findings are the most verifiable of all evaluation stages. Tests can be run, patterns can be grepped, files can be checked for syntax, and compilation can be attempted. Tool-based evidence directly supports higher confidence scores — a finding backed by a failing test or a grep result showing a missing pattern should score confidence 80 or above.

Evaluators should lean heavily on their tools at this stage. A concern based purely on reasoning ("this might have a race condition") naturally scores lower confidence than a concern backed by evidence ("grep shows this function is called from two concurrent paths without synchronization"). Both are valid findings, but the tool-backed finding carries more weight in scoring.

When an evaluator cannot verify a finding with tools — for example, a concern about architectural fit or long-term maintainability — the confidence score should reflect that limitation honestly. Execution evaluation is strongest when it produces high-confidence, evidence-backed findings. Speculative findings still belong in the report, but their lower confidence scores correctly signal that they need human judgment rather than automatic action.

When presenting findings, group by severity tier (Critical / Important / Suggestions / Strengths) rather than by evaluation category. A critical correctness finding and a critical safety finding both need immediate attention — grouping by severity makes blocking issues visible at a glance, regardless of which evaluation dimension they came from. Note that these presentation tiers are distinct from the scoring severity levels (Critical/High/Medium/Low) used to classify individual finding impact — the tiers organize how findings are shown to the reader, not how individual findings are scored.
