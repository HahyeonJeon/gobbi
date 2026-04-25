# Agent Playbook Map

Use this when deciding which AI-agent playbooks to write and how they should link together. It consolidates the initial playbook list with coverage implied by the active Gobbi and PlayingAnalytics design docs.

## Source Basis

This map is grounded in the active design directories:

| Source | Signal |
|---|---|
| `/playinganalytics/git/gobbi/.claude/project/gobbi/design/` | Gobbi workflow engine, state machine, prompt compilation, CLI, hooks, sessions |
| `/playinganalytics/git/playground/.claude/project/playinganalytics/design/` | Five-layer ecosystem model, technology stack, pipeline stages |
| `/playinganalytics/git/playground/.claude/project/playground/design/` | Platform layer: Airflow, lakehouse, DAGs, Docker, pipeline operations, domain backfills |
| `/playinganalytics/git/playground/.claude/project/playtools/design/` | Python library layer: API clients, storage, staging, lakehouse, GraphQL, scenarios, verification |
| `/playinganalytics/git/playground/.claude/project/playviz/design/` | TypeScript visual layer: charts, graphics, Remotion, CLI, content rendering |
| `/playinganalytics/git/playground/.claude/project/playclaude/README.md` | Claude configuration repo structure; `design/` is currently placeholder-only |

## Refactored Top-Level Set

The initial list is directionally right, but it mixes artifact types, workflows, media production, and coding disciplines. Use these top-level families instead:

| Family | Playbooks |
|---|---|
| Agent Documentation | Claude Skills, Claude Agents, Claude Rules, Claude Project Docs, Claude Gotchas, Evaluation Perspectives |
| Gobbi Runtime | Gobbi Workflow Engine, Gobbi CLI, Gobbi Hooks, Gobbi Session State, Gobbi Prompt Compilation, Gobbi Project Build-up, Gobbi Claude Set-up, Gobbi Delegation, Notification Setup |
| Playbook System | Gobbi Playbook, Playbook Authoring, Playbook Linking, Playbook Verification |
| Engineering | Python Coding, TypeScript Coding, Bun CLI Coding, PlayViz CLI Coding, React/Remotion Coding, Docker/Infrastructure |
| Data Platform | Lakehouse, DTO/Data Modeling, Airflow DAGs, Pipeline Operations, Batch Staging, Storage, Schema Evolution, Backfill/Update |
| API and Services | HTTP API Clients, GraphQL API, Trino Query Serving, Rate Limit/Retry |
| UX and Content | Web UI/UX Design, CLI UI/UX Design, Chart/Data Visualization Design, Contents Image Design, Contents Video Design, Content Publishing |
| Quality and Operations | Testing, Code Review, Adversarial Review, Security/Secrets, Performance, Accessibility, Media Evaluation, Release, Incident Recovery |

## Recommended Playbooks

### Agent Documentation

| Playbook | Covers | Links to |
|---|---|---|
| Claude Skills | Skill purpose, trigger rules, child docs, gotcha loading, line limits | Claude Rules, Claude Gotchas, Evaluation Perspectives |
| Claude Agents | Agent role definitions, executor/evaluator/PI patterns, tool scopes, delegation contracts | Gobbi Workflow Engine, Evaluation Perspectives |
| Claude Rules | Always-on behavioral constraints, verifiable rules, repository-specific conventions | Claude Skills, Security/Secrets |
| Claude Project Docs | `.claude/project/{name}/` structure, README indexes, design/rules/gotchas/note/reference/docs split | Playbook Authoring, Gobbi Project Build-up |
| Claude Gotchas | Recording repeated mistakes, project vs skill gotchas, promotion from runtime notes | Gobbi Session State, Incident Recovery |
| Evaluation Perspectives | Project, architecture, performance, aesthetics, user, overall review lenses | Code Review, Adversarial Review |

### Gobbi Runtime

| Playbook | Covers | Links to |
|---|---|---|
| Gobbi Workflow Engine | Ideation, Plan, Execution, Evaluation, Memorization; feedback loops and step boundaries | Gobbi Session State, Evaluation Perspectives |
| Gobbi CLI | `workflow`, `session`, `gotcha`, validation, verification commands, Bun runtime | Bun CLI Coding, Release |
| Gobbi Hooks | PreToolUse guards, SubagentStop capture, Stop heartbeat, hook registration | Security/Secrets, Gobbi Session State |
| Gobbi Session State | `.gobbi/sessions`, SQLite event store, state derivation, resume, cleanup | Incident Recovery, Gobbi Prompt Compilation |
| Gobbi Prompt Compilation | State/materials/artifacts/gotchas to bounded prompts, cache ordering, token budgets | Claude Skills, Playbook Verification |
| Gobbi Project Build-up | Project context detection, docs bootstrap, tech stack signals, verification config | Claude Project Docs, Playbook Verification |
| Gobbi Claude Set-up | Plugin installation, settings, agents, skills, hooks, notifications | Gobbi CLI, Claude Agents |
| Gobbi Delegation | Task decomposition, subagent briefing, context boundaries, verification criteria | Gobbi Workflow Engine, Claude Agents |
| Notification Setup | Slack, Telegram, Discord, desktop hooks, credential discovery | Gobbi Hooks, Security/Secrets |
| Git Worktree/PR Workflow | Issue anchors, worktree isolation, branch/PR lifecycle, cleanup | Release, Code Review |

### Playbook System

| Playbook | Covers | Links to |
|---|---|---|
| Gobbi Playbook | What a playbook is, expected scope, relationship to skills/rules/docs | Playbook Authoring |
| Playbook Authoring | Naming, scope boundaries, source grounding, stable vs task-specific docs | Claude Project Docs |
| Playbook Linking | Parent/child map, prerequisites, cross-playbook references, avoiding duplicate sources of truth | Playbook Verification |
| Playbook Verification | How to check a playbook against design docs, code, gotchas, scenarios, and evaluator feedback | Testing, Adversarial Review |

### Engineering

| Playbook | Covers | Links to |
|---|---|---|
| Python Coding | Python 3.12+, strict typing, Pydantic boundaries, async HTTP, pytest/mypy/ruff | HTTP API Clients, Lakehouse |
| TypeScript Coding | Strict TypeScript, discriminated unions, React patterns, package exports | React/Remotion Coding, CLI UI/UX |
| Bun CLI Coding | Bun runtime, `bun:sqlite`, `bun:test`, direct TS execution, command routing | Gobbi CLI |
| PlayViz CLI Coding | Grouped subcommands, Commander handlers, programmatic API exports, Remotion bundling | CLI UI/UX Design, Contents Video Design |
| React/Remotion Coding | Deterministic frame rendering, SVG-first output, component props, Storybook/Remotion parity | Contents Video Design |
| Docker/Infrastructure | Compose topology, service health, env var strategy, Spark Connect, MinIO, Trino | Pipeline Operations |

### Data Platform

| Playbook | Covers | Links to |
|---|---|---|
| Lakehouse | Bronze/Silver/Gold, Iceberg tables, Spark operations, metadata, namespace conventions | Schema Evolution, Storage |
| DTO/Data Modeling | Pydantic DTOs, `BaseDto`, schema generation, metadata structs, unmapped fields | Lakehouse, Python Coding |
| Airflow DAGs | Orchestration/Bronze/Silver DAG families, update/backfill pairing, trigger chains | Pipeline Operations |
| Pipeline Operations | Backfill vs update, write strategies, incremental reads, idempotency, data scoping | Incident Recovery |
| Batch Staging | Arrow accumulation, Parquet staging, one Iceberg snapshot per operation, cleanup | Storage, Lakehouse |
| Storage | Local/S3 backends, format-aware I/O, lazy boto3 import, path safety, object metadata | Batch Staging |
| Schema Evolution | Add/drop/rename/alter columns, Iceberg type promotion, backfill implications | Lakehouse, Pipeline Operations |
| Backfill/Update | Historical rebuilds, incremental schedules, API budget, domain-specific ordering | Airflow DAGs |
| Watermark/Lineage | Snapshot watermarks, timestamp fallback, `meta.lineage`, broken-chain handling | Pipeline Operations |

### API and Services

| Playbook | Covers | Links to |
|---|---|---|
| HTTP API Clients | `BaseApiClient`, request models, `@sendmethod`, response mapping | Rate Limit/Retry |
| Rate Limit/Retry | TokenBucket, FixedWindow, ExponentialBackoff, Retry-After, Approach-C signaling | Python Coding |
| GraphQL API | Strawberry/FastAPI, Trino resolvers, Relay cursors, DataLoader, depth/complexity limits | Trino Query Serving |
| Trino Query Serving | QueryBuilder, async executor lifecycle, snapshot-pinned reads, SQL safety | GraphQL API, Lakehouse |

### UX and Content

| Playbook | Covers | Links to |
|---|---|---|
| Web UI/UX Design | Product UI, dashboards, interaction flows, accessibility, responsive checks | Chart/Data Visualization Design |
| CLI UI/UX Design | Command naming, help text, status output, progress, errors, recovery prompts | Gobbi CLI, PlayViz CLI Coding |
| Chart/Data Visualization Design | ChartShell, VizTheme, scale resolution, transition props, no hardcoded visuals | Contents Image Design |
| PlayViz Graphics Design | Bricks-and-assembly, shape/effect/graphics layers, motion pacing, asset exports | Contents Video Design |
| Contents Image Design | Static social cards, rendered data visuals, screenshot/image evaluation | Chart/Data Visualization Design |
| Contents Video Design | Remotion timelines, YouTube sequences/overlays, pacing, frame extraction review | PlayViz Graphics Design |
| Content Publishing | Upload, platform packaging, metadata, thumbnails, post-render QA | Contents Image Design, Contents Video Design |

### Quality and Operations

| Playbook | Covers | Links to |
|---|---|---|
| Testing | Unit/integration/e2e boundaries, Spark/Iceberg fixtures, snapshot tests, visual checks | Playbook Verification |
| Code Review | Findings-first review, severity, source pointers, missing tests, regression risk | Evaluation Perspectives |
| Adversarial Review | Focus files, scenario-vs-code checks, codex-style second-reader triage | Code Review |
| Security/Secrets | Hook secret detection, dependency CVEs, SQL injection guards, credential handling | Gobbi Hooks |
| Performance | Prompt cache, token budgets, data-file compaction, query cost, render latency | Gobbi Prompt Compilation |
| Accessibility | Web accessibility, chart readability, color contrast, keyboard flows | Web UI/UX Design |
| Media Evaluation | Image layout, visual quality, data integrity, video motion, timing, production review | Contents Image Design, Contents Video Design |
| Release | npm/plugin distribution, package boundaries, changelog, migration notes | Gobbi CLI |
| Incident Recovery | Resume prompts, timeout/error states, backfill fallback, cleanup after failed sessions | Gobbi Session State |

## Coverage Gaps in the Initial List

Add these explicitly; otherwise the playbook system will miss major active-project responsibilities:

| Gap | Why it matters |
|---|---|
| Claude Project Docs | Active docs depend on `.claude/project/{name}/` structure, not only skills/agents/rules |
| Claude Gotchas and Memorization | Gobbi treats gotchas and memorization as core anti-repeat infrastructure |
| Evaluation Perspectives | Gobbi requires independent evaluation; this deserves its own authoring and usage playbook |
| Gobbi CLI/Hooks/Session/Prompt Compilation | v0.5.0 moved orchestration control from skills into CLI-enforced runtime subsystems |
| Git Worktree/PR Workflow | Worktree isolation is a major agent-operation invariant |
| Testing and Verification | playtools has usage/verify scenario catalogues; Gobbi has workflow validation and post-subtask verification |
| Adversarial Review | playtools has a stable adversarial review process that should become reusable agent guidance |
| Data Platform Playbooks | playground design docs imply lakehouse, DAG, staging, watermark, backfill/update, and Docker playbooks |
| API and GraphQL Playbooks | playtools separates HTTP clients, retry/ratelimit, GraphQL, and Trino serving |
| Chart/Data Visualization Playbook | PlayViz docs distinguish chart design from general web UI and from content image/video production |
| Security/Secrets Playbook | Hooks, SQL validation, CVEs, credentials, and sandboxing recur across projects |
| Incident Recovery Playbook | Both Gobbi sessions and data pipelines define recovery paths that agents must know |

## Suggested Writing Order

| Phase | Playbooks |
|---|---|
| 1. Agent substrate | Claude Skills, Claude Agents, Claude Rules, Claude Project Docs, Claude Gotchas |
| 2. Gobbi substrate | Gobbi Workflow Engine, Gobbi CLI, Gobbi Hooks, Gobbi Session State, Gobbi Prompt Compilation |
| 3. Playbook mechanics | Gobbi Playbook, Playbook Authoring, Playbook Linking, Playbook Verification |
| 4. Core engineering | Python Coding, TypeScript Coding, Bun CLI Coding, Testing, Code Review |
| 5. Active project domains | Lakehouse, Airflow DAGs, Pipeline Operations, Storage, Batch Staging, GraphQL API, PlayViz Graphics |
| 6. Product and content | Web UI/UX, CLI UI/UX, Chart/Data Visualization, Contents Image, Contents Video, Content Publishing |
| 7. Cross-cutting rigor | Evaluation Perspectives, Adversarial Review, Security/Secrets, Performance, Accessibility, Release, Incident Recovery |

## Naming Notes

- Keep playbook titles noun-first and domain-specific: `Gobbi Session State`, not `How to resume Gobbi sessions`.
- Split by durable decision domain, not by file type. For example, `Gobbi Prompt Compilation` deserves its own playbook because it governs cache ordering, token budgets, and skill material injection.
- Keep media playbooks separate from UI playbooks. PlayViz chart/components support web, image, and video outputs, but the evaluation criteria differ.
- Treat `Contents Image Design` and `Contents Video Design` as consumers of `Chart/Data Visualization Design` and `PlayViz Graphics Design`, not replacements for them.
