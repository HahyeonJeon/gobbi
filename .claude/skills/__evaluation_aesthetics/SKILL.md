---
name: gobbi-evaluation-aesthetics
description: Load when evaluating execution output that produces user-facing artifacts — code, documentation, or interfaces. Examines naming clarity, readability, style consistency, and whether a fresh reader would understand it.
allowed-tools: Read, Grep, Glob, Bash
---

# Evaluation Perspective: Aesthetics

This perspective examines the craft quality of the output — whether it is clear, consistent, and readable to someone encountering it for the first time. Aesthetics is not about personal preference. It is about whether the output communicates accurately and fits the surrounding context.

Aesthetics perspective is most relevant at execution when the task produces code or documentation. It rarely adds signal at ideation or planning stages.

---

## What This Perspective Examines

### Naming Clarity

Names are the primary interface between the author's intent and the reader's understanding. A name that doesn't match what a thing does creates friction for every future reader and increases the probability of misuse.

Evaluating naming means asking: does each name communicate what it represents without requiring the reader to trace its implementation? Are names consistent within their scope — do similar things have similarly structured names? Are names specific enough to distinguish things that could be confused, while not being so verbose that they obscure structure?

Poor naming is not just an aesthetic failure — it is a correctness risk. A function named `processData` that silently writes to a file will be misused by callers who read only the name.

### Readability

Readable code or documentation can be understood in a single, linear pass without requiring the reader to hold complex context in memory. Readability breaks when logic is unnecessarily convoluted, when the flow requires jumping between distant parts to understand one part, or when complexity that could be named and explained is left implicit.

Readability is not about brevity. Concise code that requires significant mental effort to parse is less readable than slightly longer code that can be read fluently. The measure is the reader's cognitive load, not the character count.

### Style Consistency

The output should fit the style of the surrounding codebase, not the agent's personal defaults. Inconsistency creates questions: is this different intentionally, or did someone not notice the surrounding pattern? Unexplained deviations impose a maintenance burden — future maintainers must decide whether to conform to the deviation or the original pattern.

Evaluating style consistency requires reading the surrounding codebase, not just the output. Grep for the patterns used in adjacent code. If the output introduces a different pattern for the same kind of problem, the difference should have a justification — and if it doesn't, the deviation is a finding.

### Unnecessary Complexity

Complexity that does not serve a clear purpose is an aesthetic failure with practical consequences: it costs time for every future reader and increases the surface area for bugs. Sources of unnecessary complexity include: indirection that hides rather than abstracts, conditional logic that covers impossible cases, variable names that force the reader to trace meaning rather than read it directly, and comments that explain what the code does rather than why.

The measure is not whether the author found the complexity natural to write, but whether a reader encountering it fresh will find it proportional to what it accomplishes.

### Reader Encounter Quality

A useful test for aesthetics is imagining a qualified reader encountering this output with no prior context. Would they be confused? Would they need to ask questions that the output should have answered? Would they misunderstand the intent? Would they find the style unfamiliar relative to the surrounding codebase?

This test surfaces the cumulative effect of naming, readability, and consistency concerns that might seem minor individually but compound into a poor reading experience.

---

## Stage Relevance

At **ideation**, aesthetics perspective adds no signal. Ideas are not user-facing artifacts — they are working documents whose primary job is to be concrete and plannable, not polished.

At **plan**, aesthetics perspective adds no signal. Plans are internal coordination documents. Task names and descriptions need to be clear, but that is a correctness concern for the project perspective, not a craft concern.

At **execution**, aesthetics perspective is most active. Code will be read by future maintainers. Documentation will be read by users and agents. The aesthetic quality of execution output has compounding value — well-crafted output reduces maintenance burden over time.

For execution tasks that produce only configuration changes or structural file reorganization with no authored content, aesthetics perspective may add limited signal.

---

## Scoring From This Perspective

Aesthetics findings are medium confidence by nature — clarity and consistency involve judgment, and tool-based verification is limited. Grep can confirm whether naming patterns are consistent with existing code, but it cannot fully evaluate whether a name is good.

Anchor findings to specific examples. A finding that "naming is inconsistent" without a specific example is not useful. A finding that names in the output use a different capitalization convention than the surrounding codebase, with grep evidence, is actionable.

Severity in aesthetics is usually low to medium. Aesthetic failures rarely block functionality. Escalate severity when a naming or clarity problem creates a correctness risk — when a misleading name is likely to cause misuse, or when complexity in a critical function makes bugs harder to find.

Do not conflate aesthetics with personal style preference. The reference point is the surrounding codebase, not an external ideal. An output that matches the codebase's existing patterns is aesthetically sound for this perspective, even if those patterns differ from what the evaluator would choose.
