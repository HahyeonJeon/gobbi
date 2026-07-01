---
name: codex-conducted-adversarial-review
description: Aggregate Codex-conducted general adversarial review of Gobbi
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, codex, process]
keywords: [general-review, docs-design, templates, naming, codex-compatibility, aggregate]
author: codex
review_kind: adversarial-review
subject: "Gobbi full surface — Codex-conducted general adversarial review"
verdict: needs-attention
---

# Codex-Conducted General Adversarial Review Of Gobbi

This aggregate preserves the prior `2026-06-29-*` review files and records only the new
`2026-07-01` Codex-conducted pass.

The review is general, not Codex-only. Codex compatibility was reviewed as an add-on lane and as
cross-cutting evidence where native Codex behavior changes the workflow contract. The revised charter
is `.gobbi/projects/gobbi/plans/workflow/2026-07-01-codex-conducted-adversarial-review-charter.md`.

## Method

Eight lanes reviewed the current Gobbi surface:

| Lane | Dimension | Report | Raw findings | Raw severity |
|---|---|---|---:|---|
| A | D1 workflow correctness | `2026-07-01-codex-conducted-adversarial-review-lane-workflow.md` | 4 | 3 High, 1 Medium |
| B | D2 agents, skills, delegation | `2026-07-01-codex-conducted-adversarial-review-lane-agents-skills.md` | 5 | 1 High, 3 Medium, 1 Low |
| C | D3 docs design and information architecture | `2026-07-01-codex-conducted-adversarial-review-lane-docs-design.md` | 5 | 2 High, 3 Medium |
| D | D4 templates and schemas | `2026-07-01-codex-conducted-adversarial-review-lane-templates.md` | 5 | 2 High, 3 Medium |
| E | D5 naming and wording | `2026-07-01-codex-conducted-adversarial-review-lane-naming-language.md` | 6 | 4 Medium, 2 Low |
| F | D6 runtime, plugin, install, Codex add-on | `2026-07-01-codex-conducted-adversarial-review-lane-runtime-plugin-codex.md` | 5 | 5 Medium |
| G | D7 live-session UX and operator ergonomics | `2026-07-01-codex-conducted-adversarial-review-lane-live-ux.md` | 5 | 2 High, 3 Medium |
| H | D8 reference harness and gap discovery | `2026-07-01-codex-conducted-adversarial-review-lane-harness-gap.md` | 4 | 4 Medium |

The lanes were run by fresh Codex subagents. High findings received a second-pass validation by
Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`), which validated 9 raw High findings and rejected
1 raw High finding as a duplicate of an existing current-lane finding.

No source fixes were applied. This session wrote review artifacts only.

## Aggregate Counts

Raw lane corpus:

- Total raw findings: 39
- Raw severity: 0 Critical, 10 High, 26 Medium, 3 Low

Deduplicated aggregate:

- Unique findings counted: 38
- Unique severity: 0 Critical, 9 High, 26 Medium, 3 Low
- Duplicate folded out: `GEN-D4-002`, because the second pass found it is the same issue as `GEN-D2-002`

Aggregate verdict: `needs-attention`. There are no Critical findings, but 9 validated High findings
affect workflow state, RECORD routing, role bootstrap, docs information architecture, template
runtime identity, and Codex degraded-metadata behavior.

## High Findings

| Finding | Second pass | Summary |
|---|---|---|
| `GEN-D1-001` | Validated, High | Preparation documents `RE-IDEATE` as an ITER/EXIT verdict, but evaluation/state/session contracts cannot emit or persist it. |
| `GEN-D1-002` | Validated, High | Manager-side finding routing narrows Type=`general` and contradicts canonical Type+Domain routing. |
| `GEN-D1-003` | Validated, High | Chat narrowed RECORD defers staging to Wrap-up, but Wrap-up only inventories prior `staging/` trees. |
| `GEN-D2-001` | Validated, High | Canonical role prompts require `.gobbi/projects/gobbi/rules/`, but that directory is absent and custom agents point at those prompts. |
| `GEN-D3-001` | Validated, High | Bootstrap enters Ideation directly and can bypass the selected Auto/Chat mode doc after Configuration. |
| `GEN-D3-002` | Validated, High | Mode workflow tables point specialist rows at manager-only orchestration docs instead of specialist skill docs. |
| `GEN-D4-003` | Validated, High | Producer templates hard-code Claude as producer and Codex as proposer, which mislabels native Codex production and degraded metadata. |
| `GEN-D7-001` | Validated, High | Resume can restamp Ideation active and clobber a persisted active Planning/Execution state. |
| `GEN-D7-002` | Validated, High | Codex allows `transcriptPath: null`, but RECORD treats that allowed degraded state as a recurring Critical unevaluable gap. |

Rejected duplicate:

| Finding | Disposition | Summary |
|---|---|---|
| `GEN-D4-002` | Duplicate of `GEN-D2-002` | Same evidence and remediation as the native Codex delegation-template load-root issue. Not counted as a distinct High. |

## Main Themes

The strongest cluster is workflow-state coherence. `RE-IDEATE`, resume, Chat RECORD, and Chat status
all show the same class of problem: docs describe a live state transition or record path that the
schemas, scaffolds, or Wrap-up readers do not actually support.

The second cluster is docs information architecture. Gobbi has the right high-level split between
manager orchestration, specialist skills, and role prompts, but several entry tables send readers or
spawned agents to the wrong layer. That makes the docs harder to use and can make subagents load the
wrong contract.

The third cluster is template/runtime identity. Shared templates still assume Claude as producer or
author in places where native Codex can be the current runtime. This creates provenance drift and
wrong degraded-mode labels.

The user-requested docs/template/naming emphasis produced concrete Medium findings beyond the High
set: fragmented memory-read guidance, hidden evaluation child docs, review template field loss,
state/schema validation gaps, `task-id`/task schema drift, lower-case verdict enum drift, resurrected
`Rawdata` wording, and `task-record`/`taskRecord` naming drift.

The Codex-specific add-on review found no Critical blocker, but it found install/runtime gaps:
Codex smoke coverage is too partial, marketplace validation is missing, trust prerequisites are not
validated, and hook smoke does not exercise installed hook commands or `PLUGIN_ROOT` expansion.

## Finding Index

### D1 Workflow

- `GEN-D1-001` High, validated: Preparation `RE-IDEATE` cannot be emitted or persisted by the current evaluator/session-state contract.
- `GEN-D1-002` High, validated: Manager-side routing table contradicts canonical Type+Domain routing.
- `GEN-D1-003` High, validated: Chat narrowed RECORD skips staging sources Wrap-up expects.
- `GEN-D1-004` Medium: Execution iteration history uses incompatible idempotency keys.

### D2 Agents, Skills, Delegation

- `GEN-D2-001` High, validated: Canonical role prompts send spawned agents to an absent rules directory.
- `GEN-D2-002` Medium: Delegation templates bypass the native Codex `.agents/skills` load path.
- `GEN-D2-003` Medium: Codex bootstrap and delegation taxonomy understate where Evaluation runs.
- `GEN-D2-004` Medium: Canonical role status contracts do not require `SKILLS LOADED`.
- `GEN-D2-005` Low: Codex role table labels canonical TOML files as Codex wrappers.

### D3 Docs Design

- `GEN-D3-001` High, validated: Bootstrap entry path bypasses the selected mode doc.
- `GEN-D3-002` High, validated: Mode workflow tables point spawned agents at manager-only orchestration docs.
- `GEN-D3-003` Medium: Evaluation child docs are hidden behind a same-basename manager doc.
- `GEN-D3-004` Medium: Memory read guidance is fragmented and the memory entry point points only to mistakes.
- `GEN-D3-005` Medium: Required project-rules reads have no empty-state contract.

### D4 Templates

- `GEN-D4-001` Medium: Memory templates stamp Claude as author even when Codex writes.
- `GEN-D4-002` duplicate: folded into `GEN-D2-002`.
- `GEN-D4-003` High, validated: Producer templates hard-code Claude as producer and Codex as proposer.
- `GEN-D4-004` Medium: Durable review template drops required evaluation routing and idempotency fields.
- `GEN-D4-005` Medium: Root session/state/settings schemas have no validation guard.

### D5 Naming And Language

- `GEN-D5-001` Medium: Chat task boundary names schema fields as pseudo-states.
- `GEN-D5-002` Medium: Execution RECORD invents `{task-id}` and `workflow.execution.tasks`.
- `GEN-D5-003` Medium: `workflow.{step}.verdict` enum is lower-case and includes `skipped`.
- `GEN-D5-004` Medium: RECORD resurrects retired `Rawdata` wording.
- `GEN-D5-005` Low: Production calls the Codex proposer a producer.
- `GEN-D5-006` Low: Chat display uses `task-record` and `taskRecord` for the same object.

### D6 Runtime, Plugin, Codex Add-On

- `GEN-D6-001` Medium: Codex smoke samples two skills and one hook manifest, so a mostly missing cache can look clean.
- `GEN-D6-002` Medium: Codex smoke hard-fails on a Claude-only manifest while warning on missing Codex components.
- `GEN-D6-003` Medium: Codex compatibility gate does not validate the Codex marketplace file.
- `GEN-D6-004` Medium: Trust prerequisite is stated in AGENTS but absent from install procedure and smoke evidence.
- `GEN-D6-005` Medium: Hook smoke bypasses installed hook commands and `PLUGIN_ROOT` expansion.

### D7 Live UX

- `GEN-D7-001` High, validated: Resume path can reset active state to Ideation.
- `GEN-D7-002` High, validated: Codex missing rollout path is allowed but treated as Critical by RECORD.
- `GEN-D7-003` Medium: Agent metadata collapses actionable statuses into `ok|failed`.
- `GEN-D7-004` Medium: Chat task-record path is outside the canonical session tree and scaffold.
- `GEN-D7-005` Medium: Chat status renderer references missing `currentIndex` and non-canonical `InProgress`.

### D8 Harness And Gap Discovery

- `GEN-D8-001` Medium: Reference records cannot preserve the dated harness-refresh matrix D3 said future work needs.
- `GEN-D8-002` Medium: Codex skill invocation policy is not modeled in Gobbi skill authoring.
- `GEN-D8-003` Medium: Review methodology has no executable regression corpus for prior adversarial findings.
- `GEN-D8-004` Medium: Critical/High second-pass validation is required but not part of the finding schema.

## Suggested Remediation Order

1. Fix state and RECORD contract blockers first: `GEN-D1-001`, `GEN-D1-003`, `GEN-D7-001`, `GEN-D7-002`.
2. Fix role and load contracts next: `GEN-D2-001`, `GEN-D3-001`, `GEN-D3-002`, `GEN-D2-002`.
3. Fix runtime-neutral templates: `GEN-D4-001`, `GEN-D4-003`, then the related D5 naming drift.
4. Add schema/scaffold validation for Chat state, task records, session/state/settings, and review findings.
5. Expand Codex smoke and compatibility checks after the docs/template contract is stable.
6. Add the reference provenance fields and review regression corpus so future adversarial reviews are rerunnable.

## Preserve

- Preserve Gobbi's dual-system anti-groupthink design. The review found drift around it, not evidence
  that the model should be removed.
- Preserve markdown as the canonical memory substrate. D8 reference improvements should add structured
  metadata, not replace markdown memory with a separate database.
- Preserve source package symlinks. The Codex install/runtime findings target checks and documentation,
  not a materialization workaround for installed-cache limitations.

## Limits

- This aggregate is a review artifact, not a fix plan with assigned implementation tasks.
- The full evidence lives in the lane files; this aggregate deduplicates and prioritizes.
- `scripts/check-codex-plugin-smoke.sh` was inspected by Lane F but not run because it performs a
  plugin install into a temporary Codex home.
- The prior `2026-06-29-*` review files were used only for deduplication and were not edited.
