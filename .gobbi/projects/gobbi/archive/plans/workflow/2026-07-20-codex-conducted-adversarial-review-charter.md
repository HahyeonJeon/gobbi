---
name: codex-conducted-adversarial-review-charter
description: Executable charter for a Codex-conducted general adversarial review of Gobbi, with added Codex compatibility checks
type: plans
scope: project
feature: null
status: completed
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [planning, process, codex]
keywords: [adversarial-review, gobbi-surface, docs-design, templates, naming, codex-compatibility, review-methodology]
author: codex
task: Run a Codex-conducted general adversarial review of Gobbi with added Codex compatibility checks
task_count: 8
supersedes: adversarial-review-charter
superseded_by: null
archived_at: 2026-07-20
archive_reason: completed
---

# Codex-Conducted Adversarial Review Charter for Gobbi

This document is a **charter**, not the review. It is the executable spec for a
Codex-conducted adversarial review of Gobbi's system surface. The review is general:
workflow, agents, skills, memory, docs design, templates, naming, runtime packaging, and
operator experience are all in scope. Codex compatibility is an added review point set, not
the whole lens.

The review must use Codex only in this session. Do not use Claude Code, Claude Code tools, or
Claude Code runtime assumptions as required review machinery. Previous Claude Code review
files remain source context for deduplication and regression checks; they are not overwritten.

## What This Charter Gives You

- Eight review dimensions, D1-D8, with concrete targets and pass/fail signals.
- A deeper standard for docs design, templates, and naming/word choice in Gobbi skills.
- A Codex compatibility add-on checklist that is applied where it affects the general system.
- A concurrent Codex lane methodology with second-pass validation for Critical/High findings.
- A body-level finding format compatible with the existing review artifact style.
- Preservation rules for all previous `2026-06-29-*` review files.

## What This Charter Is Not

- It is not a fix plan.
- It does not authorize edits to skills, agents, runtime docs, hooks, manifests, scripts, or
  previous review artifacts.
- It is not a claim that this Codex-only session has satisfied Gobbi's normal dual-system
  Claude+Codex guarantee. The substitute guarantee for this session is **multi-Codex
  independence**: separate Codex review lanes plus independent second-pass validation for each
  Critical/High finding.

## Scope Contract

### In Scope

- Gobbi's whole system surface: canonical skills, canonical agents, runtime wrappers,
  workflow docs, memory docs/templates, plugin package, install/runtime docs, scripts, hooks,
  and prior review outputs used as context.
- The previous review corpus under `.gobbi/projects/gobbi/reviews/adversarial-review/`, read
  for deduplication and gap detection.
- Docs design: skill hierarchy, section order, navigation, cross-links, examples, reference
  placement, and reader journey.
- Templates: frontmatter, required fields, writer/reader ownership, lifecycle timing,
  validation expectations, and usability.
- Naming and wording: skill names, file names, role names, state names, verbs, labels,
  enum terms, repeated concepts, and terms that make users or agents guess.
- Codex compatibility add-on checks: `.agents/skills`, `.codex/agents`, `.codex/AGENTS.md`,
  `plugins/gobbi/.codex-plugin/plugin.json`, Codex hook config, native Codex session identity,
  Codex user-decision flow, Codex smoke checks, and installed-cache boundaries.

### Out Of Scope

- Any fix for a finding.
- Rewriting or deleting prior `2026-06-29-*` review files.
- Claude Code runtime installation, `.claude/skills`, `.claude-plugin`, or Claude-only hooks
  except where shared canonical sources create a Codex-impacting or general Gobbi defect.
- Treating Codex compatibility as the dominant review lens.
- Exhaustive file-by-file audit of the whole memory tree. Memory content may be sampled; memory
  mechanism docs and templates are in the core system surface.

## Prior Review Dedup Rule

All previous review files are retained unchanged and used only as context:

- `.gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-gobbi-adversarial-review.md`
- `.gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d2.md`
- `.gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d3-d5.md`
- `.gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d4.md`
- `.gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d6.md`

A new finding must be one of:

- `new`: not present in the prior corpus.
- `regression`: previously fixed or contradicted by current state.
- `new-variant`: same class as prior finding, but with a distinct location, trigger, or runtime
  effect.
- `codex-impacting-shared-source`: prior Claude-only or bridge-only finding that also affects
  native Codex through shared sources.

If the prior corpus already states the same defect with the same evidence, cite it as
`existing` and do not re-file it.

## Review Dimensions

### D1 - End-To-End Workflow Correctness

Review Configuration -> Ideation -> Preparation -> Planning -> Execution -> Wrap-up.

Check:
- Each loop's output matches the next loop's input.
- DISCUSSION, WORK, EVALUATION, RECORD, and ITER/EXIT are owned and reachable.
- PASS/REVISE/FAIL paths are explicit.
- Session state, session record, and memory promotion boundaries agree.
- Artifact freeze points are clear before evaluation.
- Failure recovery paths are executable.

Codex add-on:
- Native Codex uses `CODEX_THREAD_ID`, not Claude session IDs.
- Rollout lookup failure is non-fatal.
- Codex user decisions route through parent-thread questions or `request_user_input` when
  available.

### D2 - Agents, Skills, And Delegation Completeness

Review role prompts, skill maps, load directives, custom-agent wrappers, status contracts,
and delegation templates.

Check:
- Agents can execute their role without hidden context.
- Required skills and companion mistakes are named as exact files.
- Handoffs between roles and loops are explicit.
- Evaluators remain read-only and separate from producers.
- Spawned agents are told how to prove they loaded required skills.

Codex add-on:
- `.codex/agents/*.toml` wrappers point at canonical role prompts.
- Codex agents do not hard-code models or effort.
- Codex evaluator uses read-only sandboxing.
- Codex paths load `.agents/skills`, not user-level skill locations.

### D3 - Docs Design And Information Architecture

Review how Gobbi explains itself to a new manager, a spawned specialist, and a maintainer
editing the system.

Check:
- Each skill starts with its purpose, owner, inputs, outputs, and boundaries.
- Large skills have maps, stable section order, and clear "read next" guidance.
- Runtime-specific branches are separated from general rules.
- Examples are close to the procedure they illustrate.
- Cross-links resolve and point to the right abstraction level.
- Glossary terms live in one source of truth and are not redefined differently elsewhere.

Fail signals:
- A reader must already know Gobbi to locate the next instruction.
- A runtime-specific note interrupts a general procedure without an explicit branch.
- A section is mostly historical explanation but sits inside an operational path.
- The same concept appears in several places with no source-of-truth pointer.

### D4 - Templates And Schema Usability

Review memory templates, session templates, settings/state/session schemas, delegation
templates, review formats, and any generated-skill or generated-agent scaffolds.

Check:
- Every template says who writes it, when, where it lives, and who reads it next.
- Required fields are distinguishable from optional fields.
- Frontmatter enums match the memory rules and evaluation metadata.
- Writer permissions match lifecycle timing.
- Templates are neither too sparse to guide agents nor so verbose they invite copy errors.
- Validation commands or guards exist for mechanically checkable structures.

Codex add-on:
- Templates do not require Claude-only fields in native Codex paths.
- Codex session metadata can degrade cleanly when rollout details are missing.
- Codex plugin and hook manifests are validated with the correct Codex-specific checks.

### D5 - Naming, Vocabulary, And Word Choice Clarity

Review names and wording as operational design, not polish.

Check:
- The same thing has one name across skills, agents, templates, and scripts.
- One term does not mean several things.
- Verbs match the action: create, stage, promote, reconcile, verify, evaluate, record, wrap up.
- Names are literal enough for spawned agents to follow without guessing.
- Abbreviations and shorthand are defined or removed.
- Enum values are stable and capitalized consistently.
- File and directory names match the concept users expect to find there.

Special focus terms:
- phase, loop, sub-phase, iter, verdict, disposition, staging, promotion, sole-writer,
  producer, proposer, evaluator, REVIEW, RECORD, Wrap-up, session record, memory, template,
  artifact, finding, decision, backlog.

Fail signals:
- A word sounds natural locally but contradicts another skill's meaning.
- A name encodes implementation detail where the user-facing concept matters.
- A "temporary" or "historical" term still appears in active procedure.
- A label makes an agent overreach, skip a step, or write to the wrong tier.

### D6 - Runtime, Plugin, Install, And Packaging Readiness

Review bounded plugin topology, manifests, hooks, smoke checks, sync scripts, symlinks, and
installed-cache assumptions.

Check:
- Source package symlink topology is documented and verified.
- Plugin manifests declare the right components for each ecosystem.
- Smoke checks test actual packaged behavior without silently materializing symlinked dirs.
- Hook scripts no-op safely when runtime-specific environment is absent.
- Install docs distinguish source package behavior from installed-cache behavior.

Codex add-on:
- `plugins/gobbi/.codex-plugin/plugin.json` declares Codex skills and hooks correctly.
- `plugins/gobbi/hooks/codex-hooks.json` uses Codex-supported events and non-overbroad
  matchers.
- `.agents/plugins/marketplace.json` points to the bounded package.
- `scripts/check-codex-plugin-smoke.sh` and `scripts/check-codex-compatibility.sh` are used as
  evidence, not confused with Claude plugin scripts.

### D7 - Live-Session UX And Operator Ergonomics

Review what the user and manager can see and recover during long multi-agent work.

Check:
- Active step, task, agent, artifact path, blocker, and next action are visible.
- Pending user decisions are file-backed or otherwise recoverable.
- Long-running operations report progress and validation targets.
- Resume/compact/clear behavior reloads the right skills and state.
- The user can tell whether work is planning, reviewing, executing, or recording.

Codex add-on:
- Codex progress updates work through the parent thread.
- Codex-specific plan/task surfaces are specified or a markdown status fallback is explicit.
- Partial Codex metadata does not block useful progress.

### D8 - Reference Harness Comparison And Gap Discovery

Use prior-art comparison to find design gaps, not to score Gobbi for its own sake.

Check:
- Gobbi's skill discovery, role delegation, status tracking, artifact templates, and review
  process are compared against strong reference patterns.
- The comparison informs concrete findings in D1-D7.
- Prior D3 findings are cited rather than duplicated.
- External references are refreshed only when they materially affect the current review.

## Codex Compatibility Add-On Checks

Apply these checks inside the relevant dimensions:

- Native Codex bootstrap does not require `CLAUDE_CODE_SESSION_ID`,
  `CLAUDE_TRANSCRIPT_PATH`, or Claude hook metadata.
- `.agents/skills` symlink resolution is verified with `readlink` or `find -L`.
- `.codex/agents` wrappers load canonical role prompts and do not pin model/effort.
- Codex evaluator/read-only boundaries are explicit.
- Codex hook config and scripts pass without Claude-only environment.
- Codex plugin install docs distinguish source package, marketplace source, installed cache,
  and repo-local custom agents.
- Codex smoke checks use isolated state and do not mutate the user's real Codex home.
- Codex completion checks validate files and content, not detached process exit status.
- User-only slash commands are not invoked programmatically.

## Docs, Templates, And Naming Review Standard

D3, D4, and D5 must go deeper than finding broken links or inconsistent counts.

For each relevant skill or template, ask:

- Can a fresh spawned agent identify what to read first, what to do next, and where to stop?
- Does the document separate command procedure from rationale, examples, and history?
- Does the template prevent the common wrong write, or does it merely describe the right write?
- Would a maintainer know whether to edit this file, a canonical source, a mirror, or a
  generated copy?
- Does the name/word choice reduce work for the reader, or does it encode an internal
  implementation detail?
- Is a term defined exactly once and reused, or locally reinterpreted?
- Is there a smaller, clearer structure that preserves the same contract?

Findings in these areas must explain **why the current wording/design causes a concrete user
or agent failure**. Do not file a pure style preference.

## Run Methodology

### Pass 0 - Scope Lock And Context

- Confirm review-only scope.
- Capture commit, branch, worktree, and session id.
- Load `AGENTS.md`, `principles`, `mistake`, `evaluation`, `research`, `coding`, and any
  lane-specific skills.
- Read previous review files for dedup context.

### Pass 0.5 - Inventory And Relevance Map

- Build the file inventory for skills, agents, templates, scripts, manifests, hooks, and
  review artifacts.
- Mark each file against D1-D8.
- Use `find -L` and `readlink` for symlinked mirrors and plugin package topology.
- State whether each count follows symlinks.

### Lane Passes

Run independent Codex lanes:

- Lane A: D1 workflow.
- Lane B: D2 agents/skills/delegation.
- Lane C: D3 docs design.
- Lane D: D4 templates/schema.
- Lane E: D5 naming/language.
- Lane F: D6 runtime/plugin/Codex compatibility.
- Lane G: D7 live UX.
- Lane H: D8 harness/gap comparison.

Each lane applies Gobbi's seven evaluation perspectives: project, structure, performance,
aesthetics, usage, consistency, and risk.

### Second-Pass Validation

Every Critical or High finding needs independent Codex second-pass validation before it is
marked confirmed. If validation cannot complete, retain the finding only with
`needs-second-pass` and explain the blocker.

### Aggregation

- Read lane reports directly.
- Deduplicate by location + claim + failure mode.
- Preserve cross-lane disagreement.
- Produce one aggregate review file ordered by severity, then by dimension.

## Finding Record Shape

Use body-level findings inside review files.

```markdown
### GEN-D3-001: {short title}
- Type: scenario_gap | checklist_gap | design_flaw | assumption_risk | general
- Domain: security | performance | test | observability | privacy | compliance | dependency | docs-sync | cost | accessibility | i18n | unevaluable | phase-mismatch | regression | process | general
- Severity: Critical | High | Medium | Low
- Confidence: 0 | 25 | 50 | 75 | 100
- Priority: critical | high | medium | low
- Disposition: open | addressed | disputed | deferred | superseded
- Runner: codex
- Dimension: D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8
- Owner-surface: workflow | agent | skill | template | memory | plugin | hook | runtime | docs | unknown
- Location: {file}:{line or #section}
- Expected: {what should be true}
- Observed: {what is true}
- Evidence: {quote, command output summary, file check, or manual trace}
- False-positive check: pre-existing | out-of-scope | style preference | linter-catchable | speculative | none
- Proposed remediation: {directional fix, not implementation recipe}
- Verification: {how a future session proves the fix}
```

## Verification Appendix

Required evidence rules:

- Use exact `rg` or `git grep` patterns for absence claims.
- Use `readlink` or `find -L` for symlink and mirror claims.
- State root and symlink-following mode for count claims.
- For JSON, run `jq empty <file>` or equivalent.
- For shell scripts used as evidence, prefer `--check`, dry-run, or isolated temp state.
- For Codex output claims, validate expected output files and content markers. Do not trust
  detached exit code alone.
- For naming and wording findings, cite the term locations and the concrete wrong behavior the
  wording invites.

## Acceptance Criteria

- The new charter exists and is self-contained.
- All prior `2026-06-29-*` review files remain unchanged.
- New lane files and aggregate review files use the `2026-07-01-codex-conducted-*` prefix.
- Codex compatibility appears as add-on checks, not the whole review frame.
- D3/D4/D5 receive dedicated findings on docs design, templates, naming, and word choice.
- Critical/High findings have direct evidence and independent second-pass validation or are
  marked `needs-second-pass`.
