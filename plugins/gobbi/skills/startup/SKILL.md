---
name: startup
description: "Use when a caller needs one evidence-backed software-project design interview that produces five accepted phase documents and one accepted synthesis."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Startup

Startup turns current project evidence and user decisions into a complete software-project design. It returns
five accepted phase documents and one accepted `startup.md` synthesis to the caller.

The interview uses `Project -> Product -> Implementation`. A Project owns one or more independently useful
Products. Each Product owns exactly one complete-stack Implementation; technologies remain categorized entries
inside it.

Startup produces design guidance. It does not produce implementation tasks, an implementation plan, formal
evaluation, project memory, publication work, or delivery work.

## Principles

### Let evidence answer first

Study current documents, code, research, and accepted decisions before asking. Ask only what material evidence
does not already resolve.

### Keep the subject model simple

Use one Project, its independently useful Products, and exactly one complete-stack Implementation per Product.
Treat every technology as a categorized Implementation entry, never as another subject.

### Complete dependencies in order

Complete Problem Definition, Design, Specification, Product Lifecycle, then Development Lifecycle. Keep
Product Lifecycle promises separate from the later Development Lifecycle mechanisms that realize them.

### Make acceptance observable

Review each subject section with the user and record explicit acceptance. Accept the synthesis only after the
five phase documents agree and the complete six-document design reads coherently.

## Rules

- **MUST derive answers from cited project evidence when it resolves a question.** Show conflicting evidence
  to the user and ask which claim governs.
- **MUST ask one user question at a time.** Keep it about the current subject and the earliest unresolved
  design decision.
- **MUST preserve the five ordered phase banks and their applicable overlays.** Select direct and overlay
  questions from evidence, omit resolved questions, and retain every distinct unresolved meaning.
- **MUST review and obtain explicit user acceptance for every Project, Product, and Implementation section.**
  Correct a rejected section and review it again before continuing.
- **MUST keep Product Lifecycle before and separate from Development Lifecycle.** Product Lifecycle owns actor-visible promises;
  Development Lifecycle owns implementation-neutral complete-stack mechanisms and evidence.
- **NEVER turn Startup into implementation planning.** Exclude task order, code signatures, exhaustive schemas,
  algorithms, repository edits, publication, and delivery instructions.

## Procedure

### Phase 1 — Establish the design subjects

#### 1.1 Study evidence and establish the hierarchy

- Read the caller's current project documents, code, research, constraints, and prior accepted decisions.
  Cite the evidence used for each material answer and note uncertainty or conflict.
- Establish one Project and its independently useful Products. Ask when the Project or Product inventory cannot
  be resolved from evidence.
- Establish exactly one complete-stack Implementation for each Product. Place languages, frameworks, runtimes,
  datastores, protocols, platforms, infrastructure, services, libraries, and tools inside that Implementation
  as categorized entries.
- Present the hierarchy to the user and correct it until its Project, Products, and Implementations are explicit.

### Phase 2 — Complete and accept the five phase documents

#### 2.1 Use the ordered phase banks

Use these banks and templates in order for the Project, then each Product, then its Implementation:

| Order | Phase | Topic bank | Template | Returned document |
|---:|---|---|---|---|
| 1 | Problem Definition | [`topics/problem-definition.md`](topics/problem-definition.md) | [`templates/problem-definition.md`](templates/problem-definition.md) | `problem-definition.md` |
| 2 | Design | [`topics/design.md`](topics/design.md) | [`templates/design.md`](templates/design.md) | `design.md` |
| 3 | Specification | [`topics/specification.md`](topics/specification.md) | [`templates/specification.md`](templates/specification.md) | `specification.md` |
| 4 | Product Lifecycle | [`topics/product-lifecycle.md`](topics/product-lifecycle.md) | [`templates/product-lifecycle.md`](templates/product-lifecycle.md) | `product-lifecycle.md` |
| 5 | Development Lifecycle | [`topics/development-lifecycle.md`](topics/development-lifecycle.md) | [`templates/development-lifecycle.md`](templates/development-lifecycle.md) | `development-lifecycle.md` |

#### 2.2 Interview and accept each subject section

- For the current subject and phase, study its accepted earlier sections and current evidence. Select the direct
  questions that remain material.
- For Product Lifecycle, select every applicable Product-form overlay from accepted evidence. For Development
  Lifecycle, select every applicable categorized-entry or platform overlay; several overlays may apply.
- Treat an evidence-derived answer as an answer, cite its source, and do not ask it again. If a material answer
  remains unresolved, ask one concrete question and document the accepted answer before asking the next.
- Write the subject section in the matching phase document. Preserve evidence, decisions, vocabulary, risks,
  constraints, observable behavior, safe failure and recovery, and evidence that would change the design.
- Review the complete section with the user. Correct omissions, contradictions, or rejected direction, then
  obtain explicit acceptance and fill its one plain acceptance marker.
- Continue only after the section is accepted. Complete all five phases for the Project, each Product in the
  accepted order, and that Product's single Implementation.

#### 2.3 Apply the lifecycle boundary

- In Product Lifecycle, describe actor-visible access, use, support, compatibility, continuity, migration,
  deprecation, retirement, safe refusal, failure, and recovery promises. Derive only evidence-applicable
  scenarios and overlays, with concrete triggers, actor-visible results, and protected data or work.
- In Development Lifecycle, link accepted Product promises to implementation-neutral complete-stack mechanisms.
  Cover applicable change, environment, build, verification, release, distribution, observation, maintenance,
  security, migration, rollback, retirement, and handoff concerns with claim-specific evidence.
- Ask about an individual categorized entry only when accepted evidence shows a material difference from the
  complete-stack answer. Do not create a separate subject or acceptance boundary for an entry.

### Phase 3 — Synthesize and return the accepted design

#### 3.1 Write and accept the synthesis

- Read the five accepted phase documents together. Resolve contradictions, inconsistent terms, missing links,
  and unsupported conclusions with evidence or one user question at a time.
- Write [`startup.md`](templates/startup.md) as an independently readable synthesis. Include the Project,
  Products, complete-stack Implementations, categorized entries, decisive evidence, capabilities, contracts,
  lifecycle promises, Development mechanisms, risks, and unresolved nonblocking limits.
- Present all six documents together. Correct any rejected or inconsistent content in its owning document,
  reread the complete set, and obtain final explicit acceptance in `startup.md`.

#### 3.2 Return the complete design

- Return the accepted contents of `problem-definition.md`, `design.md`, `specification.md`,
  `product-lifecycle.md`, `development-lifecycle.md`, and `startup.md` to the caller.
- State any evidence limits that remain. Do not continue into implementation planning or delivery.

## References

- [`topics/problem-definition.md`](topics/problem-definition.md)
- [`topics/design.md`](topics/design.md)
- [`topics/specification.md`](topics/specification.md)
- [`topics/product-lifecycle.md`](topics/product-lifecycle.md)
- [`topics/product-lifecycle/web.md`](topics/product-lifecycle/web.md)
- [`topics/product-lifecycle/desktop.md`](topics/product-lifecycle/desktop.md)
- [`topics/product-lifecycle/cli.md`](topics/product-lifecycle/cli.md)
- [`topics/product-lifecycle/library.md`](topics/product-lifecycle/library.md)
- [`topics/product-lifecycle/sdk.md`](topics/product-lifecycle/sdk.md)
- [`topics/product-lifecycle/mobile.md`](topics/product-lifecycle/mobile.md)
- [`topics/product-lifecycle/data.md`](topics/product-lifecycle/data.md)
- [`topics/development-lifecycle.md`](topics/development-lifecycle.md)
- [`topics/development-lifecycle/tool.md`](topics/development-lifecycle/tool.md)
- [`topics/development-lifecycle/framework.md`](topics/development-lifecycle/framework.md)
- [`topics/development-lifecycle/language.md`](topics/development-lifecycle/language.md)
- [`topics/development-lifecycle/desktop.md`](topics/development-lifecycle/desktop.md)
- [`topics/development-lifecycle/network.md`](topics/development-lifecycle/network.md)
- [`templates/problem-definition.md`](templates/problem-definition.md)
- [`templates/design.md`](templates/design.md)
- [`templates/specification.md`](templates/specification.md)
- [`templates/product-lifecycle.md`](templates/product-lifecycle.md)
- [`templates/development-lifecycle.md`](templates/development-lifecycle.md)
- [`templates/startup.md`](templates/startup.md)
