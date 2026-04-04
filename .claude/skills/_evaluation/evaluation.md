# Evaluation Perspective Quality

Evaluation criteria for user-created evaluation perspectives. Load when creating, reviewing, or auditing project-specific evaluation frameworks.

---

## Tagging Convention

Items tagged `[structural]` are machine-verifiable — `_audit` or a linter can check them without understanding the content. Items tagged `[semantic]` require agent judgment to assess.

---

## Failure Modes

### Universal

- **Duplication** — The perspective restates criteria already covered by gobbi's built-in perspectives (Project, Overall, etc.) rather than adding domain-specific knowledge. A duplicated perspective wastes an evaluator slot and produces redundant findings.
- **Generic content** — Criteria that any project could use verbatim. "Is the code readable?" applies everywhere and teaches nothing project-specific. Effective perspectives encode the project's own standards, conventions, and failure history.
- **Staleness** — The perspective references conventions, tools, or patterns the project no longer uses. Stale criteria produce false positives or miss real issues because the evaluation lens doesn't match the current codebase.

### Type-Specific

- **Generic perspective** — Evaluation criteria any project could use add no value. A security perspective that checks "are inputs validated?" without naming the project's validation framework, auth stack, or known vulnerability patterns is indistinguishable from a generic checklist.
- **Autonomous verdict** — The framework doesn't acknowledge user authority. Perspectives that produce verdicts without routing findings through the user violate the core principle that the user decides what matters. The evaluation system advises; it does not decide.
- **Stage mismatch** — Criteria that don't match the actual workflow stage being evaluated. Checking code correctness during ideation evaluation, or checking whether the root problem is identified during execution evaluation, produces irrelevant findings that dilute the signal.

---

## Evaluation Dimensions

### Purpose and Scope

Does the perspective own a distinct evaluation domain that gobbi's built-in perspectives don't cover? A well-scoped perspective has a clear reason to exist — it sees problems that no other perspective catches. If removing it would leave no gap, it shouldn't exist.

### Content Quality

Does the perspective encode concrete, project-specific knowledge? Criteria should reference the project's actual tech stack, naming conventions, architectural patterns, and known failure modes. An evaluator loading the perspective should gain domain expertise it wouldn't otherwise have — not receive generic guidance it could derive from first principles.

### Structural Compliance

Does the perspective follow gobbi's documentation standards and evaluation framework conventions? Structural compliance ensures the perspective integrates correctly with the orchestrator's delegation flow and the evaluator's assessment process.

### Integration

Does the perspective work within the evaluation system without friction? It should produce findings compatible with the confidence/severity scoring model, respect false positive categories, and generate output the orchestrator can synthesize alongside other perspectives. A perspective that requires special handling or produces incompatible output formats breaks the evaluation pipeline.

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
