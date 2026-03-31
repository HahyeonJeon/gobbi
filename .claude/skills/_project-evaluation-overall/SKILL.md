---
name: _project-evaluation-overall
description: Perspective skill for synthesizing cross-cutting evaluation of project deliverables. Use after the other four project evaluation perspectives have reported findings — synthesizes gaps, integration concerns, emergent problems, and what must be preserved.
allowed-tools: Read, Grep, Glob, Bash
---

# Project Evaluation — Overall Perspective

This perspective answers one question: what does the full picture look like when the other four perspectives are taken together? Load this skill after the project, architecture, performance, and aesthetics perspectives have reported. The overall evaluator synthesizes, does not re-evaluate.

The overall evaluator's job is to surface what individual perspectives miss — gaps that fall between lenses, emergent problems from the combination of design choices, integration risks, and what must be preserved.

---

## Core Principle

> **Individual perspectives are necessary but not sufficient.**

Each specialist evaluator sees one dimension clearly and the others peripherally. The overall perspective holds all four dimensions simultaneously and looks for what falls between them — problems invisible to any single lens.

> **Preserve what works. Evaluation is not only a defect list.**

The overall perspective must identify what the deliverable does well and what must not be broken in any fix. Evaluation that produces only a list of problems gives fixers no anchor — they may improve one dimension while unknowingly degrading another.

---

## Evaluation Lenses

### Cross-Cutting Gaps

What did no single perspective fully address?

Read all four perspective reports before beginning. Identify findings that touch multiple perspectives — a naming problem that also reveals a design ambiguity, a performance concern that also indicates a missing abstraction, a scope misalignment that explains an architectural inconsistency. These cross-cutting observations do not belong to any single perspective but are often the most important findings.

Also look for gaps: areas of the deliverable that no perspective covered in depth. Boundaries between modules, interactions with configuration or environment, error paths that are neither in the hot path (performance) nor obviously readable (aesthetics) but still represent correctness concerns.

### Integration Concerns

How does the deliverable interact with work happening in parallel or work that will follow?

For concurrent work: are there shared interfaces, shared data structures, or shared configuration that this deliverable changes in ways that will conflict with other in-flight work? This requires reading the task context and any notes about parallel tasks.

For future work: does the deliverable leave the codebase in a state that makes the next step harder? This includes deferred edge cases that the next task will encounter, interfaces that are subtly different from what the calling context expects, and changes that narrow the option space for future design decisions.

### Emergent Problems

What problems arise only from the combination of design choices, not from any single choice in isolation?

This is the most subtle lens. A type system escape that would be harmless in isolation becomes problematic when combined with a pattern that relies on that type's invariants elsewhere. A performance shortcut that is acceptable given current query volume becomes a risk when combined with a caching pattern that reduces the cache hit rate.

Read the deliverable as a whole and ask: do the individual pieces interact in ways that create problems none of them creates alone?

### What Must Be Preserved

What does the deliverable get right that any fix must not break?

A fix to an architecture finding must not introduce new performance problems. A fix to a naming problem must not change observable behavior. A fix to a scope misalignment must not reverse progress on the correct parts of the deliverable.

Identify the strongest aspects of the deliverable — the parts that are clearly correct, clearly well-designed, or clearly aligned with user intent — and name them explicitly. These are the preservation targets for whoever acts on the evaluation findings.

---

## Reporting Format

The overall perspective report should structure its output in four sections:

**Cross-cutting observations** — findings that span multiple perspectives or fall between them.

**Integration concerns** — risks for concurrent or future work.

**Emergent problems** — issues that arise from the combination of choices, not individual choices.

**Must preserve** — what is working and must survive any corrections.

Rate findings by whether they block the deliverable from serving its purpose (critical), create meaningful risk or rework (significant), or are minor issues that do not affect the core result (minor). Do not duplicate individual perspective findings — reference them and add the cross-cutting dimension.
