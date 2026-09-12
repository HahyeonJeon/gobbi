---
name: memory
description: "Memory defines the Gobbi memory tree, what belongs in each directory, and the conventions for those files."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Memory

Memory is the map of Gobbi project knowledge: the durable `memory/` tree, ignored `sessions/` records, and
the conventions for each directory. Use it when reading or writing `.gobbi/projects/<project>/memory/` or
`sessions/`. The loaded caller or an explicit user request owns when a write happens.

## Principles

### Keep a current model, not a session stack

Durable memory explains the project now. Update, merge, or remove current facts. Preserve completed
point-in-time records under their directory rules.

### Put each item in one home

The reason a future agent will look for the item chooses its directory. Link from related records instead of
copying.

### Write only useful future context

Keep evidence-backed knowledge that will help later work decide or act. Exclude secrets, transcripts, raw
logs, trivia, and operational exhaust.

## Rules

- **MUST write durable knowledge only under the project `memory/` root, and ignored session records only under
  that project's `sessions/` tree.** Reject parent traversal, symlink escape, and a different project.
- **MUST reconcile related records before creating a file.** Update or merge an existing home; create only
  missing content; remove stale or duplicate current content; keep indexes and links current.
- **MUST keep one canonical home per item.** Place it under the directory that owns that kind of knowledge and
  link from related files.
- **MUST preserve history files and dated reports as point-in-time records.** Correct factual errors in place;
  record later work in a new dated file.
- **NEVER delete a session root, store secrets or unpermitted material, or invent a Memory write without a
  caller or user naming that write.** Session cleanup is a separately authorized worktree action.

## Preferences

### Tree

#### Separate session records from durable memory

- Keep ignored recovery files under `sessions/<YYYY-MM-DD>-<slug>-<uuid>/`. Callers name exact paths: `tmp/`
  for drafts, a phase directory for accepted session records, or `configuration.md` at the session root.
- Keep durable knowledge under `memory/` and tracked in Git.

```text
.gobbi/projects/<project>/
├── memory/                                      tracked
│   ├── design/
│   │   ├── README.md
│   │   ├── architecture/
│   │   ├── feature/
│   │   ├── process/
│   │   └── roadmap/
│   ├── learnings/
│   │   ├── design/{tips.md,mistakes.md}
│   │   ├── authoring/{tips.md,mistakes.md}
│   │   ├── work/{tips.md,mistakes.md}
│   │   ├── memory/{tips.md,mistakes.md}
│   │   ├── dev/{tips.md,mistakes.md}
│   │   └── {domain}/{tips.md,mistakes.md}
│   ├── reports/
│   │   ├── README.md
│   │   ├── note/
│   │   ├── review/
│   │   └── analysis/
│   ├── history/
│   │   ├── README.md
│   │   └── YYYY-MM-DD-{descriptive-title}.md
│   ├── materials/
│   │   ├── README.md
│   │   ├── references/
│   │   ├── assets/
│   │   ├── docs/
│   │   └── data/
│   └── backlogs/
│       ├── README.md
│       ├── project.md
│       └── {feature}.md
└── sessions/                                    ignored
    └── <YYYY-MM-DD>-<slug>-<uuid>/
```

#### Route by what the item is for

| Directory | Holds |
|---|---|
| `design/` | Current architecture, feature, process, and roadmap intent |
| `learnings/` | Reusable tips and repeatable mistakes |
| `reports/` | Final accounts of completed work |
| `history/` | One compact record per completed session that changed the project |
| `materials/` | Permitted source inputs and evidence |
| `backlogs/` | Deferred outcomes and why they wait |

- Do not add a seventh durable category unless the same distinct purpose recurs.

### Design

#### Keep current intent in one subject home

- Use `design/` for the project's current intended shape. Revise or remove obsolete intent.
- Record significant decisions in the design they shape. Do not require a separate decision system.
- Name files `design/{architecture,feature,process,roadmap}/<descriptive-kebab-case-name>.md`.

#### Subdirectories

| Path | Description | Example |
|---|---|---|
| `design/README.md` | Recursive navigation across design memory. | `design/README.md` — links to architecture, feature, process, and roadmap |
| `design/architecture/` | Platform architecture, technology stack, system composition, data architecture, infrastructure, deployment topology, and cross-cutting technical foundations. | `design/architecture/platform-architecture.md` — stack and deploy; `design/architecture/data-architecture.md` — stores and flows |
| `design/feature/` | Named project features: structure, behavior, data, interfaces, flows, states, and failure handling. | `design/feature/login.md` — auth flows; `design/feature/payment.md` — checkout states |
| `design/process/` | Project processes, workflows, and pipelines: development, documentation, design, testing, review, release, migration, maintenance, and collaboration. | `design/process/release-workflow.md` — ship path; `design/process/review-pipeline.md` — independent review |
| `design/roadmap/` | Past direction, current focus, future horizons, sequencing, and rationale. | `design/roadmap/memory-system.md` — memory horizons; `design/roadmap/project.md` — project horizons |

### Learnings

#### Store only important reusable knowledge

- Record a tip when it will change a future decision or check. Record a mistake when the failure pattern can
  recur. Skip trivia and one-off incidents.
- Place each learning as one second-level heading in `tips.md` or `mistakes.md` under its most specific stable
  domain. Update or merge instead of copying across domains.
- Shape tips with `Context` and `Tip`, plus `Application` when future use is not already clear. Shape mistakes
  with `Context`, `Mistake`, and `Correction`.

#### Subdirectories

| Path | Description | Example |
|---|---|---|
| `learnings/design/` | Knowledge about shaping architecture, features, interfaces, and experiences. | `learnings/design/tips.md` — one home for a design; `learnings/design/mistakes.md` — copied designs |
| `learnings/authoring/` | Knowledge about writing durable prose: docs, skills, changelog, structure, claims, and voice. | `learnings/authoring/tips.md` — skill-writing defaults; `learnings/authoring/mistakes.md` — vague claims |
| `learnings/work/` | Knowledge about planning, collaboration, execution, study, review, release, and maintenance. | `learnings/work/tips.md` — keep review independent; `learnings/work/mistakes.md` — mixing implement and review |
| `learnings/memory/` | Knowledge about capturing, organizing, retrieving, and maintaining durable project memory. | `learnings/memory/tips.md` — update indexes on move; `learnings/memory/mistakes.md` — duplicated learnings |
| `learnings/dev/` | Technology-independent implementation, testing, debugging, security, performance, and tooling knowledge. | `learnings/dev/tips.md` — isolate side effects; `learnings/dev/mistakes.md` — untested failure paths |
| `learnings/{domain}/` | Knowledge that depends on another stable subject such as Python, TypeScript, web, CLI, or Git. Add a domain only when future work will search it directly. Do not add `general/`, `misc/`, or `other/`. | `learnings/python/tips.md` — Python-specific behavior; `learnings/git/mistakes.md` — Git recovery traps |
| `learnings/{domain}/tips.md` | Reusable facts, techniques, constraints, patterns, and counter-cases for one domain. | `learnings/python/tips.md` — Python-specific behavior; `learnings/authoring/tips.md` — skill-writing defaults |
| `learnings/{domain}/mistakes.md` | Repeatable failure patterns with causes, recognition signals, and corrected approaches. | `learnings/memory/mistakes.md` — duplicated learnings; `learnings/work/mistakes.md` — mixing implement and review |

### Reports

#### Keep one final account per completed work event

- Classify by the work that produced it. Link from related memory instead of copying.
- Name files `reports/{note,review,analysis}/YYYY-MM-DD-<descriptive-title>.md` with the work-completion date.
- Let each report use the smallest readable shape. Do not require one frontmatter or heading schema.

#### Subdirectories

| Path | Description | Example |
|---|---|---|
| `reports/README.md` | Link-only navigation grouped by category, newest first within each category. | `reports/README.md` — newest notes, reviews, and analyses |
| `reports/note/` | Final records of completed development, research, design, migration, release, investigation, and other general work. Include the completed work, durable result, evidence, verification, and remaining limits. Exclude scratchpads, raw logs, and routine status. | `reports/note/2026-07-30-memory-taxonomy.md` — taxonomy result; `reports/note/2026-08-16-startup-redesign.md` — Startup family result |
| `reports/review/` | Final records of code, documentation, project, design, security, process, audit, and other review work. Include subject, scope, criteria, evidence, findings, and conclusion or verdict. | `reports/review/2026-07-30-authentication-boundary.md` — code review; `reports/review/2026-08-12-memory-skill.md` — writing review |
| `reports/analysis/` | Final records of quantitative or qualitative analysis, benchmarks, comparisons, root causes, incidents, and post-mortems. Include the question, inputs, method, findings, uncertainty, and conclusion. | `reports/analysis/2026-07-30-request-latency-distribution.md` — latency; `reports/analysis/2026-08-04-error-budget.md` — error budget |

### History

#### Record net session change, then leave it still

- Create exactly one history file when a completed session made a durable project change. Create none when
  the session did not.
- Use heading, `Completed at` (ISO 8601 UTC), and `## Changes` with net additions, revisions, moves, and
  removals. Exclude commands, attempts, and transcripts.
- When later work corrects or reverses that account, write a new history file and link the earlier one.

#### Subdirectories

| Path | Description | Example |
|---|---|---|
| `history/README.md` | Link-only index of every history record, newest first by completion date and time. | `history/README.md` — newest session records first |
| `history/YYYY-MM-DD-{descriptive-title}.md` | One compact chronological record of a completed session's durable changes. Use the UTC completion date and a title that names the overall change. Distinguish same-day records with a more specific title, not a sequence number. | `history/2026-07-30-memory-skill-categories.md` — category homes; `history/2026-08-16-startup-family-redesign.md` — Startup redesign |

### Materials

#### Keep inputs faithful and purpose-owned

- Do not edit imported content. Adopt a newer source version deliberately.
- Give each purpose-owned copy its own index context. Do not auto-sync copies kept for different uses.
- Index what it is, where it came from, why it is retained, and license or access limits. Avoid `code/`,
  `media/`, `misc/`, and `other/`. Route those by intended use.

#### Subdirectories

| Path | Description | Example |
|---|---|---|
| `materials/README.md` | Recursive navigation and provenance: what each retained material is, where it came from, why it is kept, and any source date, version, attribution, or usage restriction. | `materials/README.md` — provenance for each retained file |
| `materials/references/` | External guidance and prior art: API references, official docs, standards, papers, reference implementations, competitor examples, and inspiration images. | `materials/references/openai-responses-api.md` — API docs; `materials/references/competitor-checkout.png` — prior-art screenshot |
| `materials/assets/` | Reusable non-document inputs: images, illustrations, icons, logos, audio, video, and fonts. Shipped assets belong in product source. | `materials/assets/brand-logo.svg` — supplied logo; `materials/assets/brand-font.woff2` — supplied font |
| `materials/docs/` | Supplied or imported project-context documents: specifications, contracts, policies, existing-system docs, and user research. Project-authored intent stays in design, reports, or learnings. | `materials/docs/customer-data-retention-policy.pdf` — customer policy; `materials/docs/legacy-system.md` — existing-system notes |
| `materials/data/` | Durable machine-readable evidence: datasets, exports, traces, measurements, benchmark inputs, and captured responses. Exclude caches, build output, and generated files with no future value. | `materials/data/request-latency-sample.csv` — latency sample; `materials/data/auth-error-trace.json` — captured errors |

### Backlogs

#### Preserve the deferral, not a plan

- Keep one independently discussable outcome per second-level heading. Require labels `Backlogged at`
  (immutable UTC), `What`, `Why backlogged`, and `Context`.
- Index every heading alphabetically without ranking. Do not store priority, owner, estimate, or acceptance
  criteria.
- Remove an item after active work durably accepts it. Prune obsolete or duplicate items. Use Git for prior
  versions; do not keep closed records.

#### Subdirectories

| Path | Description | Example |
|---|---|---|
| `backlogs/README.md` | Recursive index that links every deferred item heading, grouped by project or feature, ordered alphabetically without implying priority. | `backlogs/README.md` — alphabetical heading links |
| `backlogs/project.md` | Project-wide or genuinely cross-feature deferred outcomes. | `backlogs/project.md` — repo-wide localization and shared telemetry |
| `backlogs/{feature}.md` | Several independently discussable deferred outcomes owned by one stable feature. Prefer a name that matches `design/feature/` when one exists. Do not add readiness, status, or archive directories. | `backlogs/login.md` — passwordless sign-in; `backlogs/payment.md` — retry receipts |

## References

| Name | Description |
|---|---|
| [Preference Skill](../gobbi-skill/preference-skill/SKILL.md) | Shape for rules, conventions, and defaults without an SOP. |
| [Wrap-up](../wrap-up/SKILL.md) | Caller that applies these preferences at closure. |
| [Git](../git/SKILL.md) | Conventions for focused Memory commits. |
