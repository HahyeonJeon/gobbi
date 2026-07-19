---
name: memory-namespace-schema
description: Area-namespace schema for gobbi memory — path shape, per-type allowlists, selection rule, enforcement, and refactor procedure.
type: design
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, schema, design, docs-sync, validation]
keywords: [area-namespace, slug-hierarchy, categorize-on-write, eager, symmetric, total-selection-rule]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Area-namespace schema for gobbi memory

> **v0.5.3 current-contract note:** `preparation` remains below only as a classifier tag for historical records. It does not name a current skill, workflow step, loop, or session directory.

## Problem

gobbi's memory standard (`rules.md` §1.1 rule 1) defines "directory = category" at one level: the TYPE is the only category facet. Within a type dir every record lands in one flat list. At develop@7ef21bf5: `mistakes/` = 16 files, `backlogs/` = 11, `features/workflow/decisions/` = 19. The root is structural — no sub-type namespace axis was defined, so growth has nowhere to go but a longer flat list. This makes the most-read type (`mistakes/`) increasingly hard to eyeball-scan, and makes the eventual migration of those files more expensive with every record added.

## Scope

**In-scope (Option A — schema + conventions, no migration):** path shape definition, per-type area allowlists, TOTAL deterministic area-selection rule, categorize-on-write principle, three enforcement points (rules.md + validator + Wrap-up routing), 17-template path-row re-derivation, Wrap-up routing table update, validator namespace checks, consumer read-glob conversion, refactor procedure, `skills/mistake/SKILL.md` carve-out amendment.

**Out-of-scope (deferred):** migrating existing flat files into areas, repointing all reference-class occurrences, the move+repoint helper tool.

## Approach

### Path shape

`{type}/{area}/{slug}.md` (bare-slug types) · `{type}/{area}/{YYYY-MM-DD}-{slug}.md` (date-prefixed types per `rules.md` §1.2). Feature tier, identical shape: `features/{f}/{type}/{area}/{slug}.md`. One real subdir level — no deeper nesting, no filename prefix encoding the area.

### Per-type AREA ALLOWLIST (exact, finite — codeable by the validator)

**The project declares the allowlist values in [`memory-vocabulary.json`](../../../../skills/memory/memory-vocabulary.json)** — `.effective.areas.spine` and `.effective.areas.mistakes`, the SAME arrays the validator reads via jq (a non-gobbi project ships its own copy). This doc fixes the schema; the config holds the values. gobbi's spine instance is `memory · git · workflow · wrap-up · evaluation · codex · process · _shared · docs · tooling · tests`.

| Type | Exact area allowlist |
|---|---|
| `mistakes` | gobbi instance: `verification · refactor · tooling · git · codex · docs-sync · memory · _shared · assumption` (`process` DISSOLVED into trap-classes; NOT a mistakes area; declared in the config's `.effective.areas.mistakes`) |
| `decisions` | spine |
| `design` | spine |
| `backlogs` | spine |
| `notes` | spine |
| `references` | spine |
| `learnings` | spine |
| `reviews` | spine |
| `reports` | spine |
| `rules` | spine |
| `plans` | spine |
| `changelogs` / `discussions` / `scenarios` / `checklists` | spine (within the feature) |
| `features` | n/a — STRUCTURAL EXCEPTION; the feature dir IS the area; `README.md` exempt |

### TOTAL deterministic area-selection rule

Used by the write-time agent AND Wrap-up routing. Returns exactly one area per record (no ties).

**Step 1 — explicit `area:` frontmatter wins.** If the staged file carries `area: {x}` in the type's allowlist, use `{x}`.

**Step 2 — scan a fixed PRIORITY-ORDERED tag→area map; FIRST match wins.** The project now declares this map in [`memory-vocabulary.json`](../../../../skills/memory/memory-vocabulary.json) `.tagAreaMap` (the Wrap-up agent reads it for area resolution following the prose spec; the validator does not read `.tagAreaMap` — it enforces the resolved area against `.effective.areas.*`); the values below are gobbi's declared instance of the design.

- **mistakes** priority order (first match wins):
  1. `refactor` ← tags {`refactor`, `rename-sweep`, `rename`, `vocabulary-sweep`}
  2. `verification` ← {`verification`, `grep`, `research`}
  3. `tooling` ← {`tooling`, `persistence`, `write-safety`, `api-overload`}
  4. `git` ← {`git`}
  5. `codex` ← {`codex`}
  6. `docs-sync` ← {`docs-sync`, `links`}
  7. `memory` ← {`memory`, `frontmatter`, `schema`}
  - `domain` is advisory/fallback input only — not the raw area key.

- **spine types** priority order: `wrap-up` > `git` > `evaluation` > `workflow` > `codex` > `memory` > `process`. Mapped tags: `wrap-up`←{`wrap-up`}; `git`←{`git`}; `evaluation`←{`evaluation`}; `workflow`←{`workflow`,`orchestration`,`session-memory`,`lifecycle`,`preparation`,`ideation`,`planning`}; `codex`←{`codex`}; `memory`←{`memory`,`frontmatter`,`schema`,`docs-sync`,`links`,`rules`,`plans`}; `process`←{`process`}.

**Step 3 — `_shared/` ONLY when NO area matched in Steps 1-2.** Never invent a new area to avoid `_shared`.

**Feature-dir normalization.** Normalize a feature-dir name to a spine area before applying Step 2 (gobbi instance, declared in the config's `.tagAreaMap.featureDirNormalization`): `git-workflow → git` · `workflow → workflow`.

### Categorize-on-write principle (wording for `rules/` entry)

> Every **by-area** memory record MUST be written under a controlled AREA segment for its type: `{type}/{area}/{slug}.md` (or `{type}/{area}/{YYYY-MM-DD}-{slug}.md` for date-prefixed types), on both tiers. A by-area record at bare `{type}/{slug}.md` is invalid. The area allowlist per type is controlled (extend deliberately, like the tag vocabulary §2.5); the area is resolved by the TOTAL deterministic selection rule (explicit `area:` > priority-ordered tag→area map > `_shared/` on no-match). **Structural exception:** `features/{f}/README.md` is the feature identity doc, not a by-area record — the feature dir is itself the area axis — so it is exempt.

### Three enforcement points

1. **`rules.md`** — new §1.x sub-section + a `rules/` entry.
2. **`validate-frontmatter.sh`** — required-area-segment check (by-area; `README.md` exempt) + off-allowlist-area check (additive; type from frontmatter, not path).
3. **Wrap-up routing table** — destination path includes the area segment, resolved by the selection rule on promotion.

### Refactorability — the refactor procedure

An area is split / merged / renamed by `git mv` + the documented REFACTOR PROCEDURE:

Two DISTINCT facts govern what survives a move:
- **(a) The moved record's OWN slug identity survives.** Its `name`/slug is global (validator); its OWN outbound links — body `[[slug]]` links and the frontmatter `supersedes`/`superseded_by`/`related` fields — are **plain slugs** (§2.4), rename-robust. They do NOT need repointing.
- **(b) INBOUND `required-mistakes:` references are PATH refs and MUST be repointed.** These are NOT plain slugs. Moving a mistake between areas breaks every inbound `required-mistakes:` path ref; the path-ref sweep is mandatory.

**Six reference classes to enumerate** (per `plan-rename-must-enumerate-all-ref-classes.md`): (1) path refs, (2) prose refs, (3) skill-name refs, (4) inventory/list refs, (5) wrapper-description refs, (6) pipeline-label refs — PLUS the in-fence-example + cross-doc label classes from `label-rename-missed-in-fence-and-cross-doc.md`, AND inbound `required-mistakes:` PATH refs (a path-ref sub-class).

**Guards:** `check-markdown-links.sh` + `check-residual-vocab.sh` both run to zero before the refactor is complete.

**Active-mistake-move carve-out (USER-APPROVED 2026-06-21).** `skills/mistake/SKILL.md` says "active mistakes never move" — that governs NORMAL operation. A **namespace refactor is a distinct, sanctioned operation class** that MAY move an active mistake between areas, because: (a) the mistake's OWN slug identity is preserved; (b) the move is procedured and repoints all inbound `required-mistakes:` PATH refs; (c) both guards run. The carve-out amendment to `skills/mistake/SKILL.md` (lines 25, 49-51): "active mistakes never move EXCEPT during a sanctioned namespace refactor, which preserves the mistake's slug identity and repoints all inbound `required-mistakes:` path refs via the refactor procedure + guards."

### Consumer read-glob conversion

`skills/mistake/SKILL.md:61-62` reads `mistakes/*.md` — a single-level glob that silently returns ZERO nested files after eager nesting ships. Must convert to recursive (`mistakes/**/*.md` or equivalent `find`). Audit and convert all other single-level globs over namespaced memory types in the same Execution session.

### Timing and symmetry

- **Eager.** Every by-area record namespaced from file 1 — the validator check is "an area segment is present." N=10 is a per-area scannability TARGET, not a gate.
- **Both tiers — SYMMETRIC.** One identical rule on project tier and feature tier. Success criterion 4.

## Scenarios

See `1-ideation/outputs/memory-namespace-schema-design.md` §Scenarios for the full 10-scenario enumeration (golden paths, edge cases, failure modes, adversarial-proliferation).

## Validation

| Design decision | Validation method |
|---|---|
| Path shape works with validator | Hand-place a nested file → `validate-frontmatter.sh` PASS |
| Required-area enforcement | Fixture at `{type}/{slug}.md` (no area) → FAIL; `features/{f}/README.md` → PASS |
| Off-allowlist area | Fixture `mistakes/banana/x.md` → FAIL |
| TOTAL selection rule, 0 ambiguous | Re-run classification over 16 mistakes + 11 backlogs → all one area, `_shared`=1/0 |
| Consumer read-glob conversion | Nested fixture included after glob→recursive conversion |
| Refactor repoints all classes | Dry-run area rename; `check-markdown-links.sh` + `check-residual-vocab.sh` → zero |
| One-rule-two-tiers symmetry | Diff project-tier vs feature-tier rule text → identical |

## Trade-offs

**Optimizes for:** scannability (flat lists eliminated), enforceability (validator-gated write path), refactorability (area is a procedured dimension, not a hardcoded filename prefix), symmetry (one rule, two tiers).

**Sacrifices:** churn on `## Write it` path rows in all 17 templates (just stabilized in #306); the read-glob conversion adds 1 more Execution task; the schema ships before the migration, so there is a window where old flat files coexist with new nested ones (both valid under the validator until the migration runs).

## Open issues

**NEW-USAGE-1 (Medium, open — carried forward to Planning):** the `area:` frontmatter field (ROOT 1.5) is an optional staging field. A record carrying `area:` fails the validator's no-stray-keys gate (§2.2/§2.6) if `area:` is not in the base or type-extension allowlist. Two branches: (a) add `area:` to §2.2 as a new optional base or per-type extension — requires a §2.2 allowlist amendment and validator update; (b) strip `area:` on promotion — avoids the allowlist change but loses the explicit override signal in the promoted file. Planning must decide before Execution encodes the field.

## Related

- [[file-move-needs-link-resolution-check]] — the link-resolution check the refactor procedure mandates
- [[plan-rename-must-enumerate-all-ref-classes]] — the six reference classes + `required-mistakes:` sub-class
- [[label-rename-missed-in-fence-and-cross-doc]] — in-fence-example + cross-doc label classes
- [[memory-namespace-migration]] — the deferred migration backlog
