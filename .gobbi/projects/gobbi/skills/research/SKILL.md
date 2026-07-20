---
name: research
description: "Use for bounded internal or external research that returns source-grounded evidence to a caller at an exact Gobbi workflow cursor."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: operation
---

# Research

Research is a read-only evidence operation. It studies a bounded question, distinguishes what the
evidence supports from what remains uncertain, and returns a structured report to the caller. It does
not own scope, product decisions, a workflow transition, a session-tree writer, RECORD staging, or
durable memory.

## Principles

1. **Begin with a falsifiable question.** State what decision the evidence will inform and what finding
   would change the current hypothesis.
2. **Study the closest evidence first.** Repository code, tests, project memory, and history establish
   actual local behavior before analogy or general advice.
3. **Prefer primary and official sources.** Use standards, maintainers' documentation, source code,
   release notes, original research, and direct records where available.
4. **Separate source, insight, and relevance.** A citation is not a conclusion. Explain exactly what it
   says, why it applies, and where the analogy stops.
5. **Expose contradiction and uncertainty.** Conflicting evidence, missing evidence, scope limits, and
   open questions are part of the result, not defects to hide.
6. **Evidence informs judgment.** Research narrows uncertainty; it never makes a user decision, changes
   scope, or substitutes a popularity count for applicability.

## Rules

- **RS-1 — Require an exact caller contract.** The caller supplies the absolute Gobbi session root,
  exact `step`, `stage`, `iteration`, and optional Execution `task`, plus the question, scope, intended
  decision, and stable slug.
- **RS-2 — Never derive identity from runtime state.** Do not use a runtime ID, thread ID, environment
  variable, global pointer, current directory guess, or worktree scan to locate the session.
- **RS-3 — Keep work read-only.** Do not write to the repository, worktree, session tree, staging, cache,
  or durable memory. Return the report to the caller.
- **RS-4 — Cover internal evidence when applicable.** Inspect relevant code, typed project memory,
  tests, documentation, and history. Report an explicit not-applicable reason for an omitted class.
- **RS-5 — Cover external evidence when applicable.** Prefer primary, official, and citable sources;
  use secondary sources only when their role and limits are explicit.
- **RS-6 — Record exact citations.** Identify a file and line/section, commit, command result, or direct
  source URL precise enough for another agent to verify. Never invent a citation.
- **RS-7 — Reject link dumps.** Every evidence item contains Source, Insight, Why it matters, scope or
  applicability, and limitations.
- **RS-8 — Do not stockpile.** Include evidence that informs the assigned decision. Exclude interesting
  material with no demonstrated bearing on it.
- **RS-9 — Preserve negative evidence.** Report failed searches, counterexamples, contradictions, and
  evidence that weakens the current hypothesis.
- **RS-10 — Keep conclusions calibrated.** Distinguish `verified`, `supported`, `inferred`, `disputed`,
  and `unknown`; do not convert correlation, convention, or absence of evidence into certainty.
- **RS-11 — Respect the operation boundary.** Recommend a conclusion when the evidence supports one,
  but leave scope changes, material tradeoffs, user-owned choices, and step-by-step implementation plans
  to their owning workflow specialists.
- **RS-12 — Use only the Record-owned destination.** The active runtime assistant validates and stores
  the returned Markdown at the cursor-derived research path. Research itself never writes that path.

## Procedure

### 1. Validate the assignment envelope

Require all of the following:

- absolute Gobbi session root;
- `step`: `ideation`, `planning`, `execution`, or `wrap-up`;
- `stage`: the exact current v3 stage;
- positive `iteration`;
- Execution task directory identity when `step` is `execution`;
- stable kebab-case report slug;
- research question, decision it informs, in-scope and out-of-scope boundaries;
- required internal and external evidence classes; and
- time, access, or source constraints.

Reject a missing or contradictory envelope. Do not guess the session, cursor, task, or destination.
The caller verifies the supplied cursor against `state.json`; Research treats that verified envelope as
the authority and does not mutate state.

### 2. Resolve the Record-owned target

Compute one target relative to the supplied Gobbi session root:

- non-Execution:
  `{N}-{step}/working/iteration-{iteration}/research/{slug}.md`
- Execution:
  `3-execution/task-{NN}-{task-slug}/working/iteration-{iteration}/research/{slug}.md`

`N` is the fixed productive-step ordinal: `1` Ideation, `2` Planning, `3` Execution, `4` Wrap-up.
Normalize the joined path and require it to remain beneath the supplied root. This calculation is part
of the returned envelope; it does not authorize Research to write the file.

### 3. Frame the evidence test

Restate the question, current hypothesis, decision to inform, inclusion and exclusion criteria, and the
evidence that would strengthen, weaken, or falsify the hypothesis. Define freshness and authority
requirements before searching so source selection cannot drift toward a preferred answer.

### 4. Inspect internal evidence

When applicable, search the relevant project memory, code, tests, documentation, configuration, and Git
history. Read definitions and call sites, not only keyword hits. Capture exact paths and line or commit
references. Distinguish present behavior from historical intent and proposed behavior. Record negative
search results with their scope rather than claiming universal absence.

### 5. Inspect external evidence

When applicable, search official documentation, standards, primary research, maintainers' source or
release notes, and direct data. Check publication and event dates, version and product applicability,
authoritative status, and whether a source merely repeats another. Use multiple independent sources for
load-bearing or contested conclusions when available.

### 6. Triangulate and challenge

Compare local evidence with external evidence. Look deliberately for counterexamples, conflicting
definitions, version differences, survivorship bias, and hidden preconditions. Explain conflicts rather
than averaging them away. Mark any conclusion whose evidence remains indirect, stale, incomplete, or
inapplicable.

### 7. Synthesize the evidence report

Return Markdown with this exact semantic structure:

1. **Assignment** — cursor, question, decision, scope, exclusions, and target path.
2. **Executive finding** — concise answer and confidence label.
3. **Evidence ledger** — one item per source with Source, Insight, Why it matters, applicability, and
   limitations; classify each source as internal/external and primary/secondary where relevant.
4. **Contradictions and counterevidence** — competing evidence and its effect on the finding.
5. **Uncertainty and limits** — unknowns, freshness/access limits, and claims that must not be made.
6. **Recommendation** — evidence-backed position and the evidence that would change it.
7. **Open questions** — owner and consequence for each unresolved question.
8. **Verification notes** — searches, commands, or source checks another agent can repeat.

Do not include hidden reasoning, credentials, raw transcript capture, or unrelated source lists.

### 8. Return to the caller for validation and storage

Return the report plus the supplied identity envelope and computed relative target. The active runtime
assistant checks the root, cursor identity, slug, required sections, and citations, then stores the
rendered Markdown through the Record-owned path. A validation or containment failure stores nothing and
returns the exact error. Research does not retry by choosing another path.

### 9. Hand evidence to the owning workflow step

The caller reads the stored report and decides how it informs the current canonical artifact. Research
does not update synthesis, resolve material choices, stage a reference candidate, or mark work complete.
During RECORD, the Record owner may derive a typed reference candidate from evidence that proves durable;
clean or non-durable research may leave staging empty. Wrap-up alone may promote an approved candidate.

## Output contract

The operation returns one structured Markdown evidence report and its identity envelope. The expected
storage path is Record-owned, cursor-derived, and relative to the caller-supplied absolute Gobbi root.
There is no Research-owned file, staging record, or durable-memory output.

## Failure contract

Stop and report the exact cause when the assignment envelope is incomplete, a source is unavailable, a
citation cannot be verified, the path escapes the supplied root, required evidence coverage is missing,
or the report fails its checklist. Never fill the gap with a guessed fact, fabricated citation, unscoped
web result, runtime-derived path, or direct write.

## References

- [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and [`evaluation.md`](evaluation.md)
  exercise this operation without adding policy.
- [`../record/SKILL.md`](../record/SKILL.md) and [`../record/record-map.md`](../record/record-map.md) own
  session-tree paths, containment, storage, staging, and artifact placement.
- [`../orchestration/workflow/state-machine.md`](../orchestration/workflow/state-machine.md) owns the
  exact v3 cursor vocabulary.
- [`../discussion/SKILL.md`](../discussion/SKILL.md) owns material user decisions.
- [`../memory/SKILL.md`](../memory/SKILL.md) and [`../wrap-up/SKILL.md`](../wrap-up/SKILL.md) own durable
  reference records and promotion.
