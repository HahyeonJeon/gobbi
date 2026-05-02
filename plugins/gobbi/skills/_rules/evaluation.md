# Rule Evaluation Criteria

Evaluation criteria for user-created rule files. Load when creating, reviewing, or auditing project-specific rules.



---

## Failure Modes

Ordered by severity. These are the ways user-created rules fail in practice — each produces a rule that wastes agent attention or causes incorrect enforcement.

### Universal

> **Duplication — rule restates what existing convention rules or linters already enforce.**

Check gobbi's own rules in `.claude/rules/` and the project's linter/formatter configuration before creating a new rule. A duplicate rule creates two sources of truth that drift apart. When they conflict, the agent follows whichever it read last.

> **Generic content — rule captures general domain knowledge rather than a project-specific standard.**

"Use parameterized queries to prevent SQL injection" is domain knowledge — it belongs in a skill. "All database queries use the project's QueryBuilder class" is a project standard — it belongs in a rule. The test: would this rule apply identically to any project using the same language? If yes, it is too generic.

> **Staleness — rule enforces a convention the team has since abandoned or tooling now handles.**

Rules accumulate. Teams adopt new tools, change conventions, add CI checks. A stale rule forces the agent to comply with an outdated standard while the codebase has moved on. Review whether each rule still reflects current practice.

### Type-Specific

> **Unverifiable standard — rule requires subjective judgment to check compliance.**

"Write meaningful variable names" cannot be mechanically checked. "All exported functions have JSDoc comments" can. If an agent or linter cannot confirm compliance by reading the file or running a command, the standard is guidance, not a rule. Move it to a skill or make the criterion concrete.

> **Scope sprawl — rule covers too much territory and should be a skill instead.**

A rule that needs multiple subsections, exceptions, and contextual explanations has crossed from a standard into teaching material. Skills teach reasoning within a domain; rules enforce a narrow verifiable standard. If the rule requires the agent to understand a domain to apply it correctly, it belongs in a skill.

> **Tooling duplication — rule duplicates what existing linters, formatters, or CI checks already catch.**

If ESLint, Black, Clippy, or a CI pipeline already enforces the standard, the rule adds no value. Document the tool configuration instead. A rule layered on top of existing tooling creates false violations when the tool and the rule disagree on edge cases.

---

## Evaluation Dimensions

Diagnostic questions for assessing rule quality. Each dimension targets a different aspect of whether the rule will function correctly in practice.

### Purpose and Scope

- Is the standard verifiable by an agent reading a file or running a command?
- Would violation cause real problems — broken builds, incorrect behavior, rework — not just style preference?
- Is the scope narrow enough that compliance is unambiguous in all cases?
- Does the rule apply to all work in the project, not just a specific domain or feature area?

### Content Quality

- Is the standard stated as one clear, unambiguous sentence?
- Is the forbidden behavior explicit — can an agent identify a violation without interpretation?
- Is the required behavior explicit — can an agent produce compliant output without guessing?
- Is the rationale present but concise — enough to understand why, not a paragraph of justification?

### Structural Compliance

- Does the filename describe the topic, not the action — `api-versioning.md` not `how-to-version-apis.md`?
- Is the structure flat — no deep nesting that signals the rule is too broad?
- Are the most critical constraints front-loaded — the parts where violation causes the most damage come first?
- Is the rule under the line limit — a rule that needs 200+ lines is likely a skill in disguise?

### Integration

- Does it complement existing project rules without contradiction or overlap?
- Does it avoid restating gobbi convention rules that already apply?
- Does it avoid duplicating what the project's linter, formatter, or CI already enforces?
- Would an agent loading all rules together encounter any conflicting instructions?

---

## Verification Checklist

Items tagged `[structural]` are machine-verifiable — `_doctor` or a linter can check them without understanding the content. Items tagged `[semantic]` require agent judgment to assess.

- `[structural]` Rule file has a descriptive name by topic, not by action
- `[structural]` Flat structure — no deep nesting or multiple subsection levels
- `[structural]` Critical constraints appear before supporting detail
- `[structural]` Rule stays under 500 lines (must) and targets under 200 (should)
- `[structural]` JSON source file exists alongside the `.md` and both are in sync
- `[semantic]` Standard is mechanically verifiable without subjective judgment
- `[semantic]` Forbidden and required behaviors are explicit, not implied
- `[semantic]` Rule is project-specific — would not apply identically to any project in the same language
- `[semantic]` No duplication with gobbi convention rules in `.claude/rules/`
- `[semantic]` No duplication with project linter, formatter, or CI enforcement
- `[semantic]` Rule reflects current team practice — not an abandoned or superseded convention
- `[semantic]` No contradiction with other project rules
- `[semantic]` Scope is narrow — does not teach a domain (that belongs in a skill)
