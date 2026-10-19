# Memory directories

Project memory is the tracked `memory/` tree. Update or remove a current fact. Leave a history file or a dated
report in place except to correct a factual error. Session files under `sessions/` are in [Session records](record.md).

## design/

| Path | Definition | Naming | Writing |
|---|---|---|---|
| `design/` | The project's current intended shape. | `design/{architecture,feature,process,roadmap}/<kebab-name>.md` | Revise or remove obsolete intent. Record a decision in the design it shapes. |
| `design/README.md` | Navigation across design memory. | `design/README.md` | Link architecture, feature, process, and roadmap. |
| `design/architecture/` | Platform, stack, system composition, data architecture, infrastructure, and deployment. | `<kebab-name>.md` | Keep cross-cutting technical foundations here. |
| `design/feature/` | One named feature: structure, behavior, data, interfaces, flows, states, and failure handling. | `<kebab-name>.md` | One feature per file. |
| `design/process/` | A project process, workflow, or pipeline, including collaboration and standing preferences. | `<kebab-name>.md` | Put a standing preference here unless it constrains a named feature or architecture file. |
| `design/roadmap/` | Past direction, current focus, future horizons, sequencing, and rationale. | `<kebab-name>.md` | Keep sequencing and the reason for it in the same file. |

## ontology/

| Path | Definition | Naming | Writing |
|---|---|---|---|
| `ontology/` | The current domain model. The six kinds are Object, Function, and Link, each as a Definition and an Instance. | `ontology/<area>.yaml` | Update this directory at Closure when an accepted Ideation or Execution handoff names a unit change. Do not keep a copy under `sessions/`. Stop when a unit change has no accepted handoff or the file fails the Ontology checks. A `design/` file links to a unit instead of restating it. |
| `ontology/README.md` | The list of area files. | `ontology/README.md` | One link and one scope line per area file. Update it when an area file changes. |
| `ontology/<area>.yaml` | One bounded area of the domain model. | Kebab-case `<area>`. Split an area when the Ontology split rule applies. | Write the Ontology record format. |

## learnings/

| Path | Definition | Naming | Writing |
|---|---|---|---|
| `learnings/` | Reusable tips and repeatable mistakes. | `learnings/<domain>/tips.md` and `learnings/<domain>/mistakes.md` | Record a tip when it will change a future decision. Record a mistake when the failure can recur. Skip trivia and one-off incidents. Update or merge instead of copying across domains. |
| `learnings/design/` | Shaping architecture, features, interfaces, and experiences. | `tips.md`, `mistakes.md` | One second-level heading per learning. |
| `learnings/authoring/` | Durable prose: docs, skills, changelog, structure, claims, and voice. | `tips.md`, `mistakes.md` | One second-level heading per learning. |
| `learnings/work/` | Planning, collaboration, execution, study, review, release, and maintenance. | `tips.md`, `mistakes.md` | One second-level heading per learning. |
| `learnings/memory/` | Capturing, organizing, retrieving, and maintaining project memory. | `tips.md`, `mistakes.md` | One second-level heading per learning. |
| `learnings/dev/` | Technology-independent implementation, testing, debugging, security, performance, and tooling. | `tips.md`, `mistakes.md` | One second-level heading per learning. |
| `learnings/<domain>/` | Knowledge that depends on one other stable subject, such as Python, TypeScript, web, CLI, or Git. | Directory name is the subject. | Add a domain only when future work will search it directly. Do not add `general/`, `misc/`, or `other/`. |
| `learnings/<domain>/tips.md` | Reusable facts, techniques, constraints, patterns, and counter-cases. | `tips.md` | Use `Context` and `Tip`. Add `Application` when future use is not already clear. |
| `learnings/<domain>/mistakes.md` | Repeatable failure patterns. | `mistakes.md` | Use `Context`, `Mistake`, and `Correction`. |

## reports/

| Path | Definition | Naming | Writing |
|---|---|---|---|
| `reports/` | Final accounts of completed work. | `reports/{note,review,analysis}/YYYY-MM-DD-<descriptive-title>.md` | Use the work-completion date. Classify by the work that produced the account. Link from related memory instead of copying. Use the smallest readable shape. Do not require one frontmatter or heading schema. |
| `reports/README.md` | Navigation for reports. | `reports/README.md` | Link only. Group by category. Newest first within each category. |
| `reports/note/` | A completed development, research, design, migration, release, investigation, or other general work account. | `YYYY-MM-DD-<descriptive-title>.md` | Include the completed work, durable result, evidence, verification, and remaining limits. Exclude scratchpads, raw logs, and routine status. Closure writes one note. |
| `reports/review/` | A completed review account. | `YYYY-MM-DD-<descriptive-title>.md` | Include subject, scope, criteria, evidence, findings, and conclusion or verdict. |
| `reports/analysis/` | A completed quantitative or qualitative analysis, benchmark, comparison, root cause, incident, or post-mortem. | `YYYY-MM-DD-<descriptive-title>.md` | Include the question, inputs, method, findings, uncertainty, and conclusion. |

## history/

| Path | Definition | Naming | Writing |
|---|---|---|---|
| `history/` | One compact account per completed session that changed the project. | `history/YYYY-MM-DD-<descriptive-title>.md` | Create one file when the session made a durable project change. Create none when it did not. Use the UTC completion date. Distinguish same-day files with a more specific title, not a sequence number. |
| `history/README.md` | Index of history records. | `history/README.md` | Link only. Newest first by completion date and time. |
| `history/YYYY-MM-DD-<descriptive-title>.md` | The net durable change of one completed session. | Date plus a title that names the overall change. | Use a heading, `Completed at` in ISO 8601 UTC, and `## Changes` with net additions, revisions, moves, and removals. Exclude commands, attempts, and transcripts. When later work corrects that account, write a new history file and link the earlier one. |

## materials/

| Path | Definition | Naming | Writing |
|---|---|---|---|
| `materials/` | Permitted source inputs and evidence. | One directory per intended use below. | Do not edit imported content. Adopt a newer source version deliberately. Give each purpose-owned copy its own index context. Do not auto-sync copies kept for different uses. Avoid `code/`, `media/`, `misc/`, and `other/`. |
| `materials/README.md` | Provenance for retained material. | `materials/README.md` | Say what it is, where it came from, why it is kept, and any source date, version, attribution, or usage restriction. |
| `materials/references/` | External guidance and prior art. | Keep the source name. | API references, official docs, standards, papers, reference implementations, competitor examples, and inspiration images. |
| `materials/assets/` | Reusable non-document inputs. | Keep the asset name. | Images, illustrations, icons, logos, audio, video, and fonts. Shipped assets belong in product source. |
| `materials/docs/` | Supplied or imported project-context documents. | Keep the document name. | Specifications, contracts, policies, existing-system docs, and user research. Project-authored intent stays in design, reports, or learnings. |
| `materials/data/` | Durable machine-readable evidence. | Keep the data name. | Datasets, exports, traces, measurements, benchmark inputs, and captured responses. Exclude caches, build output, and generated files with no future value. |

## backlogs/

| Path | Definition | Naming | Writing |
|---|---|---|---|
| `backlogs/` | Deferred outcomes and why they wait. | `backlogs/project.md` or `backlogs/<feature>.md` | One independently discussable outcome per second-level heading. Require `Backlogged at` (immutable UTC), `What`, `Why backlogged`, and `Context`. Do not store priority, owner, estimate, or acceptance criteria. Remove an item after active work accepts it. Use Git for prior versions. Do not keep closed records. |
| `backlogs/README.md` | Index of every deferred heading. | `backlogs/README.md` | Group by project or feature. Order headings alphabetically. Do not rank them. |
| `backlogs/project.md` | Project-wide or cross-feature deferred outcomes. | `project.md` | Keep a feature-owned outcome in that feature file. |
| `backlogs/<feature>.md` | Deferred outcomes owned by one stable feature. | Prefer the `design/feature/` name when one exists. | Do not add readiness, status, or archive directories. |
