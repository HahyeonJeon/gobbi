# Evaluation Perspective Quality

Evaluation criteria for user-created evaluation perspectives. Load when creating, reviewing, or auditing project-specific evaluation frameworks.



---

## Tagging Convention

Items tagged `[structural]` are machine-verifiable — `_doctor` or a linter can check them without understanding the content. Items tagged `[semantic]` require agent judgment to assess.

---

## Failure Modes

### Universal

> **Duplication — restates criteria already covered by gobbi's built-in perspectives instead of adding domain-specific knowledge.**

Gobbi provides Project and Overall perspectives as mandatory evaluators, plus optional perspectives selected by the orchestrator. A user perspective that re-evaluates what these built-in perspectives already cover wastes an evaluator slot and produces redundant findings. The test: if gobbi's built-in perspectives were the only evaluators, would the findings this perspective produces already appear? If yes, it is duplicating.

> **Generic content — criteria that any project could use verbatim without modification.**

"Is the code readable?" applies everywhere and teaches nothing project-specific. Effective perspectives encode the project's own standards, conventions, and failure history. A perspective that could be copy-pasted into a different project without changing a single line is too generic to justify its evaluator slot.

> **Staleness — references conventions, tools, or patterns the project no longer uses.**

Stale criteria produce false positives or miss real issues because the evaluation lens doesn't match the current codebase. A perspective checking for jQuery patterns after the project migrated to React actively misleads the evaluator. Stale perspectives are worse than absent ones — evaluators trust loaded criteria.

### Type-Specific

> **Generic perspective — evaluation criteria any project could use add no value.**

A security perspective that checks "are inputs validated?" without naming the project's validation framework, auth stack, or known vulnerability patterns is indistinguishable from a generic checklist. The perspective must encode domain knowledge the evaluator would not have without loading it.

> **Autonomous verdict — the framework does not acknowledge user authority.**

Perspectives that produce verdicts without routing findings through the user violate the core principle that the user decides what matters. The evaluation system advises; it does not decide. A perspective that prescribes autonomous action on its findings bypasses the user's role as final arbiter.

> **Stage mismatch — criteria that do not match the actual workflow stage being evaluated.**

Checking code correctness during ideation evaluation, or checking whether the root problem is identified during execution evaluation, produces irrelevant findings that dilute the signal. Each workflow stage has different success criteria — a perspective must know which stage it is evaluating and apply stage-appropriate criteria.

---

## Evaluation Dimensions

### Purpose and Scope

- Does the perspective own a distinct evaluation domain that gobbi's built-in perspectives (Project, Overall) do not already cover?
- If this perspective were removed, would any category of problems go undetected? If no gap would exist, the perspective does not justify its evaluator slot.
- Is the scope narrow enough that the perspective's criteria stay coherent, yet broad enough that it applies across multiple evaluation sessions?
- Does the perspective complement adjacent perspectives, or does it compete for the same evaluation domain?

### Content Quality

- Does the perspective encode concrete, project-specific knowledge — actual tech stack, naming conventions, architectural patterns, and known failure modes?
- Would an evaluator loading this perspective gain domain expertise it would not otherwise have, or could it derive the same guidance from first principles?
- Are criteria specific enough that two evaluators would assess the same output consistently?
- Do criteria evaluate outcomes against goals, not tasks against checklists?

### Structural Compliance

- Does the perspective follow gobbi's documentation standards — `_claude` writing principles, naming convention, file structure?
- Does the description field use command tone ("Evaluate..." or "Use when...") rather than inventory tone ("This perspective provides...")?
- Is the perspective under the line budget — must stay under 500 lines, should target under 200?
- Does the perspective avoid `_claude` anti-patterns: no code examples, no BAD/GOOD comparisons, no step-by-step recipes?

### Integration

- Does the perspective produce findings compatible with the confidence (0-100) and severity (Critical/High/Medium/Low) scoring model?
- Does the output format allow the orchestrator to synthesize findings alongside other perspectives without special handling?
- Does the perspective respect false positive categories and route findings through the user rather than prescribing autonomous action?
- Is stage applicability clear — does the perspective either work across all stages or specify which stages it targets?

---

## Verification Checklist

### Purpose and Scope

- `[structural]` Perspective file exists at the expected path under `.claude/skills/` with correct naming convention
- `[structural]` SKILL.md frontmatter contains `name`, `description`, and `allowed-tools` fields
- `[semantic]` Perspective covers a domain not already handled by gobbi's built-in perspectives
- `[semantic]` Scope boundary is clear — an evaluator loading this perspective knows what is and isn't its responsibility

### Content Quality

- `[structural]` No code examples, BAD/GOOD blocks, or step-by-step recipes in teaching content
- `[structural]` File is under 500 lines (must), targeting under 200 lines (should)
- `[semantic]` Criteria reference the project's actual tech stack, patterns, or conventions — not generic guidance
- `[semantic]` Evaluation questions are specific enough that two evaluators would assess the same output consistently
- `[semantic]` Criteria evaluate outcomes against goals, not tasks against checklists

### Structural Compliance

- `[structural]` Naming follows the gobbi convention — `_` prefix for hidden tier, hyphens as word separators
- `[structural]` JSON source file exists alongside the `.md` and both are in sync
- `[structural]` Description field uses command tone ("Evaluate..." or "Use when...") not inventory tone ("This perspective provides...")
- `[semantic]` Findings route through the user — the perspective does not prescribe autonomous action on its verdicts

### Integration

- `[structural]` Output format section exists and specifies how findings should be reported
- `[semantic]` Findings are compatible with confidence (0-100) and severity (Critical/High/Medium/Low) scoring
- `[semantic]` Perspective complements adjacent perspectives rather than competing for the same evaluation domain
- `[semantic]` Stage applicability is clear — the perspective either works across all stages or specifies which stages it targets
