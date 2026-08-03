---
name: materials
description: MUST load after the memory operation identifies content as material memory. Materials is a preference skill for what durable source and supporting material belongs in memory and how it is structured.
allowed-tools: Read, Grep, Glob
skill-type: preference
user-invocable: false
---

# Material Memory

This internal category skill guides material-memory judgment after the parent memory operation identifies
content as material memory. It owns the content and structure of `memory/materials/`. The parent memory skill
owns when and how materials are read, created, updated, moved, or deleted.

Material memory preserves durable project inputs and evidence. The material's intended use chooses its
category. Its file format does not. Project-authored conclusions, current intent, guidance, actions, and
shipped source remain under their own owners.

## Principles

### Organize by intended use

The reason a project retains a material predicts where a future agent will look for it. A document, image,
code sample, or dataset can belong to different categories when its purpose differs.

### Preserve source identity and integrity

A retained source remains useful when a future reader can identify its origin, relevant version, intended
use, and restrictions. Imported content should remain faithful to that source.

### Keep inputs separate from derived memory

Materials provide evidence and context. Learnings, reports, design, backlogs, project skills, and product
source own the knowledge, accounts, intent, guidance, actions, and shipped artifacts derived from those
inputs.

### Let each purpose own its copy

The same source can support distinct uses. A purpose-owned copy should carry its own context and change only
when that use deliberately adopts a different source version.

## Rules

- **MUST preserve imported or copied source content without editing it.** Adopt a newer source version
  deliberately and use Git for the replaced version rather than retaining every obsolete version beside the
  current copy.
- **MUST NOT store material that the project is not permitted to retain.** Preserve applicable license,
  attribution, access, confidentiality, and usage restrictions with the indexed material.
- **MUST treat copies retained for distinct purposes as independently maintained materials.** Give each copy
  its own index entry and purpose context. Update it only when that use adopts the newer source; do not
  synchronize purpose-owned copies automatically.
- **MUST NOT require one companion record, frontmatter shape, metadata schema, or directory subtype tree for
  every material.** Add only the context and nesting needed to identify, use, and navigate the retained
  material.

## Preferences

### Structure

Prefer direct files under the four purpose categories. Add a deeper subject, source, or collection directory
only when it materially improves navigation.

```text
materials/
├── README.md
├── references/
├── assets/
├── docs/
└── data/
```

### Path descriptions

| Path | Description | Example |
|---|---|---|
| `materials/README.md` | Provides recursive navigation and provenance for every retained material or collection, including what it is, where it came from, why it is retained, and any relevant source date, version, access context, attribution, or usage restriction. | |
| `materials/references/` | Contains external guidance and prior art consulted for understanding or comparison, including API references, official documentation, standards, papers, articles, reference implementations, example code, competitor examples, and inspiration images. | Official API documentation or a competitor screenshot used for comparison |
| `materials/assets/` | Contains reusable non-document project inputs, including images, illustrations, icons, logos, audio, video, and fonts. Adopted or shipped assets belong in the applicable product source tree. | A supplied logo, source image, font, audio clip, or video |
| `materials/docs/` | Contains supplied or imported project-context documents, including stakeholder specifications, requirements, contracts, policies, existing-system documentation, user research, and environment or integration documents. Current project-authored intent, guidance, and work accounts remain in their own memory locations. | A customer specification or existing-system document |
| `materials/data/` | Contains durable machine-readable evidence, including datasets, structured exports, traces, measurements, benchmark inputs, captured responses, and evidence fixtures. It excludes routine caches, build output, transient logs, and reproducible generated files without durable future value. | A dataset, trace, measurement export, or captured API response |

Avoid base directories such as `code/`, `media/`, `samples/`, `archive/`, `misc/`, and `other/`. Route code,
media, and samples by their intended use. Add a new base category only when durable materials repeatedly
have a distinct purpose that none of the four categories can express.

### Naming convention

```text
materials/{category}/{descriptive-kebab-case-name}.{extension}
```

```text
materials/references/openai-responses-api.md
materials/assets/brand-logo.svg
materials/docs/customer-data-retention-policy.pdf
materials/data/request-latency-sample.csv
```

Prefer stable, descriptive names. Preserve an upstream filename when changing it would weaken traceability.
Add a source date or version only when it distinguishes a snapshot or materially different source version.
Do not date every material by acquisition time.

## References
