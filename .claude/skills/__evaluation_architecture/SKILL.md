---
name: __evaluation_architecture
description: Load when evaluating output that creates or modifies code structure, introduces new abstractions, defines interfaces, or changes how components relate. Examines structural coherence, coupling, design principles, and extensibility.
allowed-tools: Read, Grep, Glob, Bash
---

# Evaluation Perspective: Architecture

This perspective examines structural soundness — whether the design of the output will hold up as the system evolves, whether abstractions are appropriate, and whether the relationships between components are managed well.

Architecture perspective is most valuable when the task involves structural change. For pure documentation or configuration tasks with no structural implications, this perspective adds little signal.

---

## What This Perspective Examines

### Structural Coherence

A structurally coherent design has a clear organization that matches the problem's natural divisions. Coherence breaks when responsibilities are mixed in ways that produce confusion: a module that does too many things, an abstraction layer that leaks implementation details, or a relationship between components that has to be explained because it doesn't emerge naturally from the design.

Evaluating coherence means asking: if someone read only the structure — the module names, the interface definitions, the call patterns — could they predict where to find things and where new things should go? A coherent structure is self-documenting at the architectural level.

### Coupling and Boundaries

Coupling is not inherently bad. The question is whether the coupling is intentional and managed. Components that must change together because of shared state, direct dependency on internal details, or bidirectional relationships create fragility. When one component changes, the others break in non-obvious ways.

Well-managed coupling means dependencies flow in one direction, interfaces hide internals rather than exposing them, and shared state is explicit and localized. When evaluating coupling, read how components interact, not just how they are named.

### Appropriateness of Abstractions

Abstractions should earn their existence. A useful abstraction hides complexity that would otherwise be repeated or that would constrain callers unnecessarily. A premature abstraction hides simplicity behind indirection, forcing every future reader to understand a layer that doesn't add value.

Over-abstraction is a common execution failure: the agent introduced an abstract base, a plugin interface, or a factory pattern because the problem resembled one where those patterns appear — not because the specific complexity warranted them. Under-abstraction is the reverse: logic that will need to vary is embedded directly, with no seam for change.

### Extensibility

Good design makes the right things easy to change and the wrong things hard to change. Extensibility is not about adding features speculatively — it is about whether the boundaries between components make sense given how the system is expected to evolve.

When the task's context includes known future needs, the architecture should be evaluated against whether it accommodates those needs without requiring structural rework. When no future needs are known, the architecture should be evaluated against whether it avoids making arbitrary commitments that constrain the unknown future unnecessarily.

---

## Stage Relevance

At **ideation**, architecture perspective examines whether the proposed approach has structural implications that should be addressed before committing. A proposed mechanism that requires tangling two previously independent components is an architectural concern worth surfacing early, before a plan is built around it.

At **plan**, architecture perspective is less central but relevant when tasks involve introducing new layers, modules, or integration points. The plan should reflect architectural decisions — if the idea established a structural boundary, the tasks should respect it.

At **execution**, architecture perspective is most active. This is where structural decisions become concrete and can be evaluated against the codebase. Read the actual code, not the description of it. Abstractions that sound reasonable in a plan can be misaligned with the surrounding codebase when implemented.

For documentation-only or configuration-only tasks, architecture perspective adds no signal and should be omitted from evaluation.

---

## Scoring From This Perspective

Architecture findings are often medium confidence unless tool-based evidence is available. Assessments of structural coherence and extensibility involve judgment — read the code carefully and be explicit about what evidence supports the finding.

Coupling violations are typically higher confidence because they can be observed in concrete relationships: circular imports, direct access to internal state, bidirectional dependencies. Use Grep and Read to find these — don't speculate when evidence is findable.

Abstraction findings should distinguish between wrong abstractions (structures that make the code worse) and missing abstractions (repeated logic that should be unified). Both matter, but wrong abstractions are higher severity because they impose costs on every future reader.

Architectural debt introduced in execution is harder to reverse than scope creep. A severity assessment for architecture findings should account for the cost of undoing the decision later — structures that will be difficult to refactor without wide codebase impact deserve higher severity.
