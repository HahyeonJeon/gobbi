# Evaluating the Gobbi Entry

Use this adapter with the general [Evaluation](../evaluation/SKILL.md) operation when the Gobbi entry bundle
changes. It adds subject-specific fixtures and lenses; it does not change the general finding, checklist,
perspective, or verdict contract.

## Entry

1. Read [`SKILL.md`](SKILL.md), [`scenarios.md`](scenarios.md), and
   [`checklists.md`](checklists.md) completely.
2. Read the changed consumers and current owners: the manager canonical pair, Cowork, Workflow, Discussion,
   Git, runtime entry documents, README, and the sync script and fixtures.
3. Freeze the exact subject, changed-path inventory, source/view identities, and repository preimage.
4. Work a separate filled copy of every applicable checklist scenario. Never mark the source.
5. Review Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall.
6. Return one normal evaluation report with causal findings and an evidence-derived verdict.

Fresh Claude and Codex evaluators remain isolated and do not see the other report before both freeze. A
material revision requires a new complete round when the calling orchestration mode requests evaluation.

## Perspective lenses

### Project

Confirm the change delivers one read-only entry with three real choices: lightweight General, fast Cowork,
and durable Workflow. Reject a result that hides Cowork, makes mode selection implicit, or weakens Workflow
to make the options look similar.

Use GOBBI-SCN-01, GOBBI-SCN-06, and GOBBI-SCN-10. Pay special attention to
GOBBI-CK-PROJECT-01-01..03 and GOBBI-CK-PROJECT-02-01..02.

### Structure

Confirm Gobbi owns only bootstrap, selection, and handoff. General has no orchestration owner; Cowork and
Workflow each have one owner; the shared delegation file remains the sole specialist-assignment shape.

Use GOBBI-SCN-06 and GOBBI-SCN-09. A direct productive dispatch, entry-owned write, copied mode procedure, or
second router is a structural defect.

### Performance

Confirm the floor remains exactly five and non-floor owners remain lazy. Reject all-worktree discovery,
transcript lookup, telemetry reconstruction, or eager loading introduced only to determine the mode.

Use GOBBI-SCN-01-B and GOBBI-SCN-09. The three-mode prompt does not justify a larger always-load floor.

### Aesthetics

Read the first page and the mode selection as a cold user. The three choices, their uses, and any
recommendation must be distinct, short, literal, and easy to scan.

Reject dense duplicated policy, unexplained mode language, or prose that makes the recommendation appear to
be the recorded answer.

### Usage

Walk these paths:

1. Fresh entry with General selected.
2. Fresh entry with Cowork selected.
3. Fresh entry with Workflow selected.
4. Fresh wording that explicitly names Cowork but still reaches the selection control.
5. Valid General, Cowork, and Workflow context boundaries with no repeated prompt.
6. Missing and conflicting mode evidence that reopens selection.
7. Invalid Cowork or Workflow handoff evidence that stops without mutation.
8. Cowork Wrap-up with a verified Memory update and with a verified no-change result.
9. A prior Cowork evaluation made stale by the Memory commit, followed by a new evaluation choice.

Use GOBBI-SCN-04, GOBBI-SCN-06, and GOBBI-SCN-10. Confirm each path has one observable next owner or one exact
stop condition.

### Consistency

Compare the canonical skill, its review companions, manager Markdown and TOML, `.codex/AGENTS.md`,
`.claude/CLAUDE.md`, README, sync script, and fixtures. They must all name General, Cowork, and Workflow while
scoping Workflow records, typed promotion, and automatic dual-system creation to Workflow. They must describe
Cowork Wrap-up as a direct Memory operation that precedes evaluation-freshness checking.

Run the negative entry-document fixtures. A missing Cowork token in either runtime document must fail with
the mode-contract diagnostic.

### Risk

Challenge automatic selection, conflicting resume evidence, wrong-tree writes, a copied runtime view, direct
specialist dispatch, and mode-owner substitution. Require exact preimage proof for the read-only entry and
exact blocker evidence for failed handoff.

Absence of hooks, transcript paths, rollouts, telemetry, separate settings, and retired classifiers remains
normal. Do not recreate one as a safety shortcut.

### Overall

Overall must answer:

1. Does every fresh Gobbi entry explicitly present General, Cowork, and Workflow without auto-resolution?
2. Does a valid context boundary preserve its established mode, while missing or conflicting evidence asks
   again?
3. Does General remain ownerless, Cowork use Cowork, and Workflow use Workflow?
4. Does Gobbi entry remain read-only, with no direct productive-specialist route?
5. Does the exact five-skill floor and on-demand skill map remain bounded?
6. Do manager, runtime, public documentation, and topology guards agree with the canonical contract?
7. Would a two-mode, inferred-mode, copied-view, wrong-owner, or entry-writing implementation fail?

Overall cannot pass while an applicable checklist row fails. A material source change invalidates the frozen
subject.

## Recommended probes

- Count exactly four Principles and six Rules in `SKILL.md`.
- Confirm the operation heading order and decimal Procedure steps.
- Resolve every relative link in the four-file Gobbi bundle.
- Compare scenario sources with GB-1..GB-6 and checklist coverage.
- Search active consumers for “one mandatory workflow,” “do not ask for an interaction mode,” and other
  two-mode or auto-routing remnants.
- Validate `.codex/AGENTS.md` and `.claude/CLAUDE.md` through positive and missing-Cowork fixtures.
- Verify canonical, `.agents`, `.claude`, and plugin source paths.
- Run `git diff --check`, shell syntax checks, sync fixtures, source-topology checks, and plugin smoke checks.

## Completion

The adapter is complete when every applicable scenario and checklist row is represented in the frozen frame,
all eight perspectives inspect their assigned evidence, the report validates, and its verdict follows the
general Evaluation contract.
