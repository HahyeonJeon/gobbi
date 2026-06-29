---
name: hybrid-two-home-mistake-model
description: Mistakes live in two homes split by ownership — skill-owned traps co-located in skills/{skill}/mistakes.md, cross-cutting traps in the project mistakes/ memory tier
type: design
scope: feature
feature: guardrails
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [memory, design]
keywords: [mistakes, hybrid, two-home, skill-surface, co-location, layer2-removal, graduation]
author: claude
related: [adr-storage-hybrid, docs-as-code-colocation, nearest-file-wins-colocated-rules, agent-skills-progressive-disclosure, eslint-local-rule-vs-shared-plugin]
---

# Hybrid two-home mistake model

## Problem

Mistakes carried TWO storage models bridged by a copy-and-backlink. (1) Project mistakes lived in the memory tree at `mistakes/{area}/{slug}.md`. (2) "Generalizable" ones were COPIED to `skills/mistake/layer2-*.md` (9 copies) so they persisted across all projects using gobbi as a harness. The copy needed a dedicated guard (`check-layer2-source.sh`) plus `layer:` / `layer2-source:` frontmatter to keep its backlink from dangling. That left two sources of truth for one trap — a Layer-2 copy and its original could diverge silently, and the guard only caught the dangling-ref half. Worse, even single-tier traps loaded context-blind: every project mistake loaded at session start, never in the context of the skill it warns about.

## Scope

In-scope: replace the dual model with ONE hybrid model — skill-owned traps co-located in `skills/{skill}/mistakes.md`; cross-cutting / no-owner traps stay in the project `mistakes/{area}/` memory tier (their file home unchanged, their Layer-2 residue cleaned). Build a `check-skill-mistakes.sh` conformance guard for the new skill surface. Delete the 9 Layer-2 copies + `check-layer2-source.sh`; migrate the skill-owned subset; rewrite the model docs and runtime mirrors.

Out-of-scope: graduating any individual mistake to a `principles` / `coding` rule (separate, per-lesson). The exhaustive per-mistake routing enumeration (done in Planning).

## Approach

Two homes, split by ownership — the ADR-hybrid pattern (per-module local, central cross-cutting) plus the nearest-file-wins root-default-plus-local shape:

| | Skill-owned trap | Cross-cutting / no-owner trap |
|---|---|---|
| Home | `skills/{skill}/mistakes.md` (a `## ` section) | `mistakes/{area}/{slug}.md` (project memory tier) — home unchanged |
| Surface | skill-surface doc (out of the memory frontmatter standard) | memory tree (full standard applies) |
| Frontmatter | light file header + per-section metadata strip | 11-field memory base + mistakes extensions |
| Validation | `check-skill-mistakes.sh` (new) | `validate-frontmatter.sh` (existing) |
| Namespace / supersession / compaction | none — per-section `status:` + `## Archived` (R3) | `{type}/{area}/`, `git mv → archive/`, Stage-2c — unchanged |
| Loads via | Load-Directives companion path + `SKILL.md` pointer | `mistake/SKILL.md` P1 at session start |

Single source of truth holds: every trap lives in exactly one home. A trap spanning two skills gets ONE section in the primary owner; the secondary skill gets a `### Related` cross-link only, never a duplicate.

### The four design questions

- **Q1 — Routing is a manual decision at promotion (Always-Ask), primary-owner for spanning traps.** Wrap-up proposes "skill-owned (which skill?) vs cross-cutting"; a `domain → skill` hint map seeds it but is advisory. Routing is ~half mechanical, ~half judgment.
- **Q2 — No-owner home (CONFIRMED, user re-frame): cross-cutting traps' FILES stay in `mistakes/{area}/{slug}.md`** with full memory machinery, loaded via `mistake` P1. No project-root `mistakes.md`, no `principles/mistakes.md`. The central tier is the always-on default.
- **Q3 — Loading: an explicit Load-Directives companion path + a `SKILL.md` pointer + a hand-created `.claude` per-file symlink.** A spawned subagent has no Skill tool — it only READs the literal Load-Directives paths — so each brief that lists `skills/{x}/SKILL.md` ALSO lists `skills/{x}/mistakes.md`. The `.agents` / plugin mirrors auto-expose the new file via their whole-dir symlinks; only the `.claude/skills/{x}/mistakes.md` per-file symlink is a hand action.
- **Q4 — Graduation: "universal proactive imperative AND useful off-skill" → rule; else mistake.** A lesson graduates to a `principles` / `coding` rule only if it is a domain-independent "always / never" law that applies before acting AND is useful on tasks that never touch the skill. "Generalizes across projects" (the old Layer-2 bar) is NOT the rule bar.

### Implementation rules (added at Ideation iter2)

- **R1 — Data-safety / route-before-delete.** No Layer-2 copy or mistake file is deleted until its lesson content is confirmed present at a live target home. The named risk was `layer2-verify-state-from-authoritative-source-not-proxy` — it had no live project-mistake original (its two cited sources were archived), so its content had to be routed to a home and confirmed present BEFORE its copy was deleted.
- **R2 — Ordered execution.** The one-session plan ran in order: (1) write the template + guard; (2) write + wire the new skill `mistakes.md` homes; (3) a loadability checkpoint; (4) only THEN delete the 9 copies, `check-layer2-source.sh`, and legacy refs. Delete never precedes a verified live home.
- **R3 — Skill-tier supersession convention.** A superseded section inside a loaded `skills/{skill}/mistakes.md` must not read as active. On supersession: flip the section's metadata `status:` to `superseded`, then move the whole `## ` section under an `## Archived` heading at the file bottom (or remove it). `check-skill-mistakes.sh` treats `## Archived` sections as non-active. This is the Map-of-Content split-on-retire rule adapted to one co-located file.

## Scenarios

- Golden (owned) — a new `codex exec` trap is staged `mistake-candidate: true`, routed skill-owned, appended as a `## ` section to `skills/codex/mistakes.md`, and read by the next codex work via the Load-Directives companion path.
- Golden (cross-cutting) — a generic verification trap with no owner stays at `mistakes/verification/{slug}.md` and loads at next session start.
- Spans two skills — a git + execution trap goes to ONE section in the primary owner `skills/git/mistakes.md`; `execution` gets a `### Related` cross-link only.
- Migration is NOT verbatim — a target carrying an extra `## Layer-2 candidate` section copies its 4 elements (+ optional `User feedback`), DROPS the Layer-2 scaffolding, and repoints any dangling ref.

## Validation

- `check-skill-mistakes.sh` — structural conformance for every skill-surface `mistakes.md` (4 elements + metadata strip per active section, anchor uniqueness, `## Archived` exemption) PLUS resolution of the `[[slug]]` + backtick bare-path reference classes the markdown-link guard cannot see.
- `validate-frontmatter.sh` — unchanged; the project `mistakes/` tier keeps full coverage.
- Property (not mechanism): ZERO unresolved references — across link-target references, backtick bare-paths, and `[[slug]]` forms — to any deleted slug, deleted Layer-2 copy, or deleted `check-layer2-source.sh`.

## Trade-offs

The skill-surface home forfeits memory-tree machinery — `validate-frontmatter.sh` conformance, `{type}/{area}/` namespacing, supersession-to-archive, Stage-2c compaction (the memory standard's scope boundary excludes `skills/`). The hybrid CONTAINS that loss: only skill-owned traps take it, `check-skill-mistakes.sh` restores structural validation, and the R3 `## Archived` convention restores reader-safe lifecycle. Cross-cutting traps keep every piece of machinery by staying in the project tier. The model optimizes for contextual load (a skill-relevant trap arrives in the skill's context) and a single source of truth (no copies), at the cost of two validation surfaces instead of one.

## Open issues

- Per-lesson mistake → rule graduation is deferred (separate, per-lesson, against the Q4 test).
- `features/guardrails/` was bootstrapped at this Wrap-up (it did not exist during the working loops).

## Related

- [[adr-storage-hybrid]] — the hybrid storage prior art (per-module local, central cross-cutting) this model adopts
- [[nearest-file-wins-colocated-rules]] — the root-default-plus-local shape behind the two tiers
- [[docs-as-code-colocation]] — the co-location principle behind the skill-surface home
- [[agent-skills-progressive-disclosure]] — the SKILL.md-references-load-on-demand model behind the companion-path loading
- [[eslint-local-rule-vs-shared-plugin]] — the graduation line behind Q4 (local guidance vs enforceable policy)
