# Reviewer roles and ontology skill

> Tracked Memory work account at `memory/reports/note/`. Omit Git action states and recovery commands.

**Completed at:** 2026-09-29T08:19:28Z

## Result

Gobbi has three reviewer roles, `code-reviewer`, `docs-reviewer`, and `design-reviewer`, and every Review goes
to the reviewer for its subject. Gobbi also has an `ontology` preference skill based on Palantir Foundry's
Ontology. Coding, Authoring, and Design apply it in Ideation, Execution, and Review. Its v2 gives every unit the
same fixed facet keys and one Palantir kind block, puts each kind's rules in its template, and adds a Python CLI.

## Context

| Item | Detail |
|---|---|
| Purpose | Review skills require a reviewer with no producer role, but producers reviewed their own subjects. Designs lacked one model for defining, bounding, relating, and describing each unit before it is built. |
| Scope | Role contracts in four runtimes, follow surfaces, the plugin package, setup, and docs; the new `ontology` skill; the nine Coding, Authoring, and Design operation skills and their checklists; the Memory, Cowork, Workflow, and Wrap-up skills; CHANGELOG. |
| Exclusions | Version bump and release; the full Authoring and Design Execution procedures; unrelated dangling symlinks and stale Skill permissions. |
| Accepted decisions | [Identity-and-load role contracts](../../design/process/identity-and-load-role-contracts.md), [Cowork implementation commits](../../design/process/cowork.md), [Review](../../design/process/evaluation.md), and [Ontology skill](../../design/feature/ontology-skill.md). |

## Work

| Item | Detail | Evidence |
|---|---|---|
| Reviewer roles | Twelve reviewer contracts, three per runtime, with the producer's model and effort. A reviewer may create or run anything a check needs and never edits the target or its source inputs. Producers no longer review. Each artifact class in a subject (`code`, `docs`, `design`) gets its own reviewer, and the review passes only when every class passes. Setup allows eight roles and computes its counts from arrays; the setup proof checks the Agent and Skill entries. The `.cursor/agents` copies were re-synced. | `f603b804` |
| Ontology skill v1 | Nine Palantir kinds in four groups (data, logic, action, security), five facets per unit, rules, and Flight examples. A YAML record, one template and one example per kind, and a seventh Memory category `memory/ontology/` with session-copy promotion at closure. Coding Modularization is the code form of the facets; Authoring and Design gained `ontology.md` children under Ideation, Execution, and Review. | `2a209c43` |
| Ontology skill v2 | Fixed nullable keys `status`, `deprecation`, `definition`, `responsibility`, `boundary`, and `relationship`, then one kind block of Palantir fields. Palantir case, a single-Property `primaryKey`, and `parent` and `link` edges. `record.md` removed; each template carries its kind's rules and review checklist, and `SKILL.md` indexes the templates. `scripts/ontology.py` adds `new`, `add`, `validate`, `list`, and `show`. | `fb9beb52` |

## Verification

- Reviewer roles: three review iterations ended in PASS. `sync-plugin-package.sh --check` exited 0, and
  `prove-gobbi-setup.sh` reported 7 proofs passed. A live probe showed that Grok 1.0.41 resolves the hyphenated
  role names.
- Ontology v1: ten review iterations over three design rounds ended in a code and docs PASS.
- Ontology v2: `sync-plugin-package.sh --check` exited 0. `scripts/prove-ontology-cli.py` reported "proofs
  failed: 0" on Python 3.10.0. `ontology.py validate` passed the joined Flight sample with 18 units. No file
  outside sessions refers to `record.md`.

## Remaining limits

- Ontology v2 had no independent review. Closure rests on manager self-verification.
- The session wrote no session ontology area file, so closure promoted nothing into `memory/ontology/`.
- Backlogged: the [Ontology skill backlog](../../backlogs/ontology-skill.md); the Grok, setup allow-list,
  role-contract, and `__pycache__` items in the [Project backlog](../../backlogs/project.md); and
  [Review report persistence](../../backlogs/evaluation.md#review-report-persistence-when-claude-code-refuses-the-report-write).
