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
inside it. Startup produces design guidance and does not produce implementation tasks, plans, evaluation,
memory, publication, or delivery work.

## Principles

### Let evidence reshape the baseline

Topic banks are reusable baselines, not closed questionnaires. Accepted evidence answers, changes, removes,
or adds questions throughout the interview.

### Preserve meaning through aliases

Stable aliases connect baseline meanings, working questions, accepted answers, and later decisions without a
separate ledger or metadata structure.

### Complete dependencies phase by phase

Finish an earlier phase before using its decisions in a later one. Actor-visible Product promises must precede
the Development mechanisms and evidence that realize them.

### Study lifecycles before asking

Before each lifecycle phase, imagine and study applicable ordinary, alternate, failing, recovery, change, and
retirement scenarios. Treat unsupported scenarios as questions, never as facts.

## Rules

- **MUST derive answers from cited project evidence when it resolves a question and ask one user question at a time.** Ask only the earliest unresolved decision and let the user resolve conflicting evidence.

- **MUST rebuild the current working questions before each subject section and after every accepted answer.** Use the direct bank, applicable overlays, accepted earlier and current evidence, and material scenario findings.

- **MUST preserve compact alias lineage when questions change.** Retain a baseline alias for specialization, use source aliases for splits and merges, and use `[derived-<phase>-<intent>]` only for a genuinely new runtime meaning.

- **MUST complete the interview in phase-major order and obtain explicit user acceptance for every subject section.** Start a later phase only after every section in the current phase is accepted.

- **MUST separately imagine and study Product scenarios before Product Lifecycle and Development scenarios before Development Lifecycle.** Product Lifecycle owns actor-visible promises; Development Lifecycle owns implementation-neutral complete-stack mechanisms and evidence.

- **NEVER turn Startup into implementation planning or persistent interview machinery.** Exclude task order, code signatures, exhaustive schemas, algorithms, metadata rows, alias ledgers, route or lifecycle state, Record dependencies, repository edits, publication, and delivery instructions.

## Procedure

### Phase 1 — Establish the design subjects

#### 1.1 Study evidence and establish the hierarchy

- Read the caller's current documents, code, research, constraints, and accepted decisions. Cite material
  evidence and expose uncertainty or conflict.
- Establish one Project and its independently useful Products. Ask when evidence cannot resolve the inventory.
- Establish exactly one complete-stack Implementation for each Product. Keep languages, frameworks, runtimes,
  datastores, protocols, platforms, infrastructure, services, libraries, and tools as categorized entries.
- Present the hierarchy and correct it until the user accepts the Project, Products, and Implementations.

### Phase 2 — Generate, interview, and accept five phase documents

#### 2.1 Use the ordered baseline banks

Use these banks and templates in order:

| Order | Phase | Topic bank | Template | Returned document |
|---:|---|---|---|---|
| 1 | Problem Definition | [`topics/problem-definition.md`](topics/problem-definition.md) | [`templates/problem-definition.md`](templates/problem-definition.md) | `problem-definition.md` |
| 2 | Design | [`topics/design.md`](topics/design.md) | [`templates/design.md`](templates/design.md) | `design.md` |
| 3 | Specification | [`topics/specification.md`](topics/specification.md) | [`templates/specification.md`](templates/specification.md) | `specification.md` |
| 4 | Product Lifecycle | [`topics/product-lifecycle.md`](topics/product-lifecycle.md) | [`templates/product-lifecycle.md`](templates/product-lifecycle.md) | `product-lifecycle.md` |
| 5 | Development Lifecycle | [`topics/development-lifecycle.md`](topics/development-lifecycle.md) | [`templates/development-lifecycle.md`](templates/development-lifecycle.md) | `development-lifecycle.md` |

- A topic bank is a baseline of likely meanings. It neither limits the interview to its questions nor requires
  every question to be asked.
- Every phase contains Project, Product, and Implementation sections. Product Lifecycle Implementation
  sections record implementation-specific conditions on actor-visible promises without owning mechanisms;
  Development Lifecycle owns implementation-neutral complete-stack mechanisms and evidence.
- Select only overlays matched by accepted evidence. With no match, use the direct bank. With several matches,
  union distinct meanings and merge equivalent meanings through the alias lineage rule. Expose a conflict to
  the user instead of resolving it by overlay precedence; technologies never become subjects.

#### 2.2 Build and modify the working questions

- Before each Project, Product, or Implementation section, build an interview-local working set from its
  direct baseline, applicable overlays, accepted earlier-phase sections, accepted current-phase sections, and
  current evidence. Later phases must generate questions from earlier answers; for example, accepted Problem
  Definition risks and outcomes reshape Design questions.
- Retain a still-material question; rewrite it with accepted vocabulary or a narrower condition; omit a
  resolved or inapplicable meaning; split one question when evidence exposes distinct decisions; merge only
  equivalent meanings; add a material meaning absent from the banks; and reorder questions by dependency and
  consequence.
- Keep the baseline alias when rewriting or specializing its meaning. A split renders
  `[source-alias-<intent>]`, where intent is a stable lowercase-kebab semantic name.
  For a merge, render every source alias in adjacent tags such as `[alias-a] [alias-b]`, in lexical order.
  For a genuinely new meaning, use `[derived-<phase>-<intent>]`. Keep phase and intent stable lowercase-kebab
  terms. Never mutate the shipped topic banks during an interview.
- Retain only a question whose answer can change the current section or a downstream decision. Treat an
  evidence-derived answer as an answer, cite its source and alias, and do not ask it again.

#### 2.3 Ask, rebuild, correct, and accept each section

- Ask the earliest unresolved working question. Record the accepted answer with every alias it resolves, then
  rebuild the working set from all accepted evidence before asking again.
- If the user cannot answer, decide whether the missing answer blocks safe downstream design. If it blocks,
  stop and name the missing evidence. Otherwise record an aliased assumption or evidence limit, what would
  resolve it, and continue only after explicit user acceptance.
- When one answer resolves several equivalent questions, record one statement with all relevant aliases. Do
  not merge distinct decisions merely because their wording is similar.
- Write the matching subject section with evidence, decisions, vocabulary, risks, constraints, observable
  behavior, safe failure and recovery, and evidence that would change the design. Append relevant aliases to
  material evidence-derived and user-decided statements.
- Review the section with the user. On rejection, reshape its unresolved questions and review again. On a
  contradiction, stop, return to the earliest section that owns the disputed meaning, obtain the current or
  conditional truth, reaccept that section, and rebuild only affected later sections; keep unrelated accepted
  sections intact. If corrected evidence changes lifecycle-study inputs, rerun the affected scenario study
  before rebuilding and reaccepting its downstream lifecycle sections. Then return to the step that invoked
  the correction, including synthesis.
- Continue only after explicit user acceptance. Complete the phase for the Project, then each Product and its
  one Implementation, before advancing to the next phase.
- After Specification, run Step 2.4 before Product Lifecycle. After Product Lifecycle, run Step 2.5 before
  Development Lifecycle. After other accepted phases, continue to the next ordered phase.

#### 2.4 Study Product Lifecycle scenarios before its interview

- After every Specification section is accepted and immediately before Product Lifecycle, independently
  imagine and study applicable Product scenarios from accepted evidence, Product forms, current behavior,
  primary practice, prior failures, and credible misuse.
- Challenge discovery and access, onboarding, ordinary and alternate use, help, degradation, failure,
  recovery, update, migration, deprecation, offboarding, retirement, and ownership transfer. Consider actors,
  triggers, observable results, protected work, safe refusal, accessibility, privacy, locale,
  interoperability, version skew, and support when applicable.
- Use evidenced findings to reshape the Product working questions. Keep unsupported imagined scenarios as
  candidate questions or explicit assumptions and ask only those that can change actor-visible promises.

#### 2.5 Study Development Lifecycle scenarios before its interview

- After every Product Lifecycle section is accepted and immediately before Development Lifecycle, run a
  separate study using accepted Product promises, categorized entries, environments, build and release
  constraints, current evidence, and applicable secure-development practice.
- Challenge clean setup, routine and emergency change, partial failure, dependency upgrade or compromise,
  reproducible build, verification topology, release identity, distribution, deployment, mixed-version
  rollout and rollback, migration, contributor onboarding, maintainer handoff, replacement, deprecation, and
  retirement.
- Generate or reshape complete-stack Development questions from each applicable Product promise and scenario.
  Let risk determine depth. Ask about one categorized entry only when evidence shows a material difference
  from the complete-stack answer.

### Phase 3 — Synthesize and return the accepted design

#### 3.1 Write, review, and accept the synthesis

- Read the five accepted phase documents together. Resolve inconsistent terms, missing links, unsupported
  conclusions, and contradictions through the targeted correction in Step 2.3.
- Write [`startup.md`](templates/startup.md) as an independently readable synthesis. Connect decisive aliases
  from problem evidence through Design, Specification, Product promises, and Development evidence.
- Present all six documents together. Correct rejected content in its owning document, reread the complete set,
  and obtain the user's final explicit acceptance of `startup.md`.

#### 3.2 Return the complete design

- Return the accepted contents of `problem-definition.md`, `design.md`, `specification.md`,
  `product-lifecycle.md`, `development-lifecycle.md`, and `startup.md` to the caller.
- State remaining evidence limits. Do not continue into implementation planning or delivery.

## References

- [`topics/product-lifecycle/web.md`](topics/product-lifecycle/web.md)
- [`topics/product-lifecycle/desktop.md`](topics/product-lifecycle/desktop.md)
- [`topics/product-lifecycle/cli.md`](topics/product-lifecycle/cli.md)
- [`topics/product-lifecycle/library.md`](topics/product-lifecycle/library.md)
- [`topics/product-lifecycle/sdk.md`](topics/product-lifecycle/sdk.md)
- [`topics/product-lifecycle/mobile.md`](topics/product-lifecycle/mobile.md)
- [`topics/product-lifecycle/data.md`](topics/product-lifecycle/data.md)
- [`topics/development-lifecycle/tool.md`](topics/development-lifecycle/tool.md)
- [`topics/development-lifecycle/framework.md`](topics/development-lifecycle/framework.md)
- [`topics/development-lifecycle/language.md`](topics/development-lifecycle/language.md)
- [`topics/development-lifecycle/desktop.md`](topics/development-lifecycle/desktop.md)
- [`topics/development-lifecycle/network.md`](topics/development-lifecycle/network.md)
