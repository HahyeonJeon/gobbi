---
name: d-ref-codes-missing-inline-expansion
description: Checklist of opaque decision codes (D-3-3, D-4, D-5, D-9) in executor task briefs that lack inline expansion, causing fresh-executor misinterpretation risk.
type: checklists
scope: feature
feature: agents
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [executor-brief, inline-expansion, docs-sync]
domain: docs-sync
---

# Opaque decision reference codes in executor briefs — implementation checklist

A planning brief referenced internal decision codes (`D-3-3`, `D-4`, `D-5`, `D-9`) without spelling out what each code meant. A fresh executor, with no access to the planning session that minted the codes, cannot resolve them and may misunderstand or skip the referenced logic. The fix is for the manager to inline-expand each code's actual meaning into the relevant task brief at delegation time. This checklist enumerates the briefs that need the expansion.

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Hook-script brief inline-expands the `D-3-3` resolver step: the directory-scan fallback in the transcript resolver | novel | pending | Manager adds inline expansion to delegation brief |
| 2 | session.json-writer brief inline-expands the `D-4` 5-file scope: hook script, reconstructor, session.json writer, unit tests, integration test | novel | pending | Manager adds inline expansion to delegation brief |
| 3 | Hook-script/reconstructor brief inline-expands the `D-9` rationale: no `gobbi-shell-script-conventions` skill yet (fewer than 2 scripts existed), so codify the conventions in script-header comments | novel | pending | Manager adds inline expansion to delegation brief |
| 4 | Reconstructor brief inline-expands the `D-5` skip rationale: `.claude/scripts/` is not pre-created; the executor runs `mkdir -p .claude/scripts/` as part of the reconstructor task | novel | pending | Manager adds inline expansion to delegation brief |

## Item details

### 1. `D-3-3` resolver step — directory-scan fallback

The transcript resolver has a fallback step that scans a directory when the primary lookup misses. The brief referenced this only as "D-3-3-resolver step (ii)"; the executor needs the fallback's actual behavior stated in the brief.

**Anchor reasoning**: novel — this is a gobbi-internal procedural detail with no external reference.

### 2. `D-4` design file — 5-file scope enumeration

`D-4` referred to a 5-file enumeration of the files in scope: the hook script, the reconstructor, the session.json writer, the unit tests, and the integration test. The brief said only "per D-4 design file"; the executor needs the five files listed explicitly.

**Anchor reasoning**: novel — gobbi-internal scope list.

### 3. `D-9` skip rationale — defer the shell-script-conventions skill

`D-9` was the decision to defer creating a `gobbi-shell-script-conventions` skill because fewer than two scripts existed at the time (the convention being: create the skill once N ≥ 2). The brief said only "D-9 skip rationale — codify in script header until N≥2"; the executor needs the rationale spelled out so it knows to codify the conventions in script-header comments instead.

**Anchor reasoning**: novel — gobbi-internal deferral rationale.

### 4. `D-5` skip rationale — `.claude/scripts/` directory not pre-created

`D-5` was the decision to NOT pre-create the `.claude/scripts/` directory as a separate step. The directory needs to exist only at the moment the reconstructor script (`.claude/scripts/reconstruct-agents.sh`) is written, so the executor runs `mkdir -p .claude/scripts/` at the start of the reconstructor task instead. Pre-creation was rejected because it would be wasted work and would require a separate commit for an otherwise-empty directory (empirically, `ls .claude/scripts/` returned ENOENT at planning time). The brief said only "D-5 skip rationale"; the executor needs the rationale spelled out so it knows to `mkdir -p` inline rather than expecting the directory to already exist.

**Anchor reasoning**: novel — gobbi-internal deferral rationale.

## Status notes

The manager addresses every item during Execution delegation by embedding the relevant decision text directly in each task's brief, rather than expecting the executor to reconstruct it from the planning session's working notes. The underlying decisions are recoverable — the planning staging artifacts that defined the codes still exist — but a fresh executor should not have to go find them.
