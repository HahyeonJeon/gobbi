---
name: design
description: MUST load after the memory operation identifies content as design memory. Design is a preference skill for what design memory contains and how it is structured.
allowed-tools: Read, Grep, Glob
skill-type: preference
user-invocable: false
---

# Design Memory

This internal category skill guides design-memory judgment after the parent memory operation identifies
content as design memory. It owns the content and structure of `memory/design/`. The parent memory skill owns
when and how records are read, created, updated, moved, or deleted.

## Principles

### Keep active intent current

Design memory should explain the project's current intended shape and direction. Revise or remove obsolete
content so active design does not conflict with current intent.

### Organize by the dominant design subject

The main subject gives a design its canonical home. Cross-cutting relationships should remain visible through
links instead of copied documents.

### Keep decisions with the design they shape

A significant decision is understandable in the context of the architecture, feature, process, or direction
it changed. Separating it into a generic decision system weakens that context.

## Rules

- **MUST keep each design in one canonical home.** Place a design under its dominant subject and link to it
  from related documents instead of duplicating it.
- **MUST keep architecture, feature, and process documents current.** Revise or remove obsolete content. Use
  `roadmap/` for readable directional history.
- **MUST record significant decisions in the relevant design document.** Do not require a separate decision
  directory, decision-document shape, decision fields, or lifecycle status.

## Preferences

### Structure

Prefer broad subject categories and express specific designs as documents. Prefer direct files within each
category. Add deeper nesting only when it makes a growing subject easier to navigate.

```text
design/
├── README.md
├── architecture/
├── feature/
├── process/
└── roadmap/
```

### Path descriptions

| Path | Description | Example |
|---|---|---|
| `design/README.md` | Provides recursive navigation across design memory. | |
| `design/architecture/` | Contains project architecture designs, including platform architecture, technology stack, system composition, data architecture, infrastructure, deployment topology, and cross-cutting technical foundations. | A platform architecture defining the frontend framework, backend services, database, infrastructure, and deployment model |
| `design/feature/` | Contains designs for named project features and capabilities, including their structure, behavior, data, interfaces, flows, states, and failure handling. | A login, payment, lakehouse, or API design |
| `design/process/` | Contains designs for project processes, workflows, and pipelines, including development, documentation, design, testing, evaluation, release, migration, maintenance, and collaboration. | A release workflow or evaluation pipeline |
| `design/roadmap/` | Contains roadmaps for project subjects, including their past direction, current focus, future horizons, sequencing, and rationale. | A memory-system roadmap covering past direction, current focus, and future horizons |

### Naming convention

```text
design/{category}/{descriptive-kebab-case-name}.md
```

```text
design/architecture/platform-architecture.md
design/feature/payment.md
design/process/release-workflow.md
design/roadmap/memory-system.md
```

## References
