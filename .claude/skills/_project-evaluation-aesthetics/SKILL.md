---
name: _project-evaluation-aesthetics
description: Perspective skill for evaluating project deliverables for readability and style. Use when evaluating code changes, documentation updates, or any codebase output for naming clarity, style consistency, reader comprehension, and documentation quality.
allowed-tools: Read, Grep, Glob, Bash
---

# Project Evaluation — Aesthetics Perspective

This perspective answers one question: will the next person who reads this code understand it quickly and correctly? Load this skill when evaluating project output — implementations, documentation, configuration — from a readability and style angle.

The evaluator's job is to find friction for the reader, not to enforce personal preferences.

---

## Core Principle

> **Readability is correctness for the reader who comes next.**

Code that does the right thing but communicates it badly will be misread, mismodified, and broken. The cost of unclear code accumulates with every future change. This makes readability a correctness concern, not an aesthetic indulgence.

> **Style consistency with the codebase matters more than any particular style.**

Code that follows a different style from its neighbors forces readers to context-switch. Read the existing code in the same area before evaluating — the standard is what already exists, not an abstract preference.

---

## Evaluation Lenses

### Naming Clarity

Do names communicate intent precisely, without requiring the reader to read the implementation to understand them?

Evaluate function names against what the function actually does. If the name describes a mechanism ("processData", "handleItem") rather than an intent ("validateUserInput", "applyDiscountTier"), the name is weaker than it could be. Variables named for their type rather than their role ("string", "list", "obj") lose all semantic content.

Examine names at the call site — not just the definition. A name that makes sense in context of the implementation may be confusing or ambiguous to a caller who does not see that implementation.

### Style Consistency

Does the code follow the style established in the surrounding codebase?

Read several files in the same directory or module before evaluating. Look at: formatting conventions, import organization, function length norms, error handling idioms, and comment style. The deliverable should match these conventions. Deviations — even small ones — introduce noise that readers must filter.

Style inconsistency is not always the agent's fault. If the surrounding codebase has mixed styles, note the inconsistency as a pre-existing condition and evaluate the deliverable against the dominant pattern.

### Reader Comprehension

Could a developer unfamiliar with this area understand the code without reading its dependencies?

Walk through the code as a reader would. At each step, ask: does the current context (function names, variable names, comments, structure) make the next step predictable? When the code makes a non-obvious choice — an algorithm that isn't the naive solution, an order of operations with a specific reason, a conditional that handles an edge case — is there enough signal to understand why?

Non-obvious code without explanation is the primary source of bugs introduced by future agents. It is not enough for code to be correct — it must also be readable as correct.

### Documentation Quality

Is documentation present where needed, absent where unnecessary, and accurate where present?

The threshold for documentation is non-obviousness: explain what cannot be understood from the code itself. Absence of comments is not a failure when the code is clear. Presence of comments that restate the code ("increment i by 1") adds noise without value.

Where documentation exists, check that it matches the actual behavior. Stale documentation that describes what the code used to do is actively harmful — it misleads the next reader.

For public APIs, check that the interface contract (parameters, return values, side effects, error conditions) is documented clearly enough that a caller does not need to read the implementation.

---

## Signals Worth Investigating

These patterns are not automatically failures, but each warrants examination:

- A function that takes more than three or four parameters, suggesting a missing concept
- A variable whose name is only meaningful at the point of assignment, not at the points of use
- A complex conditional whose branches are not individually named or explained
- Documentation that describes implementation steps instead of intent and contract
- Code that uses a different style than the four or five closest files in the same directory

---

## Output Expectations

Report findings as specific reader-perspective observations: name the file and construct, describe what a reader would experience, and explain why the current form creates friction. Avoid "this is ugly" framing — identify the specific comprehension risk.

Note where the deliverable improves readability over what it replaced. These are worth preserving. The overall perspective evaluator needs to know what is working, not just what is not.
