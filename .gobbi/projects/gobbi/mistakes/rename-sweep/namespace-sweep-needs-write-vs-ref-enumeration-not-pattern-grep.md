---
name: namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep
description: A namespace sweep REVISE'd three times because pattern-grep missed surfaces — enumerate by write-destination vs reference, grep every path-form, across all surfaces.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [rename-sweep, verification, docs-sync]
keywords: [namespace-sweep, pattern-grep-blind, write-vs-ref, residual-enumeration, bootstrap-surface]
author: claude
priority: high
domain: rename-sweep
supersedes: null
superseded_by: null
related: [cited-process-mistake-not-applied-to-own-artifact, plan-rename-must-enumerate-all-ref-classes, sweep-grep-literal-loop-name-blindspot]
---

# A namespace sweep needs write-vs-ref enumeration, not pattern-grep

## What happened

The area-namespace sweep this session was REVISE'd THREE times in dual-system evaluation. Each remediation round pattern-grepped for residual flat paths, declared itself done, and the next eval round found MORE missed surfaces:

- A whole bootstrap write-surface (`interview/SKILL.md`) was missed — its write-destination paths were never namespaced.
- Residual flat write-paths survived in several docs because the grep pattern only matched one path-form.
- Intra-file contradictions slipped through: a doc's prose body said one thing while its routing table said another (body-vs-table drift).

Each round the agent believed a pattern-grep had found "everything"; each round the pattern was form-specific-blind and conflated two distinct concepts.

## Why it happens

Two errors compound:

1. **Pattern-grep is form-specific-blind.** A single grep pattern matches one path-form (placeholder `{type}/{slug}`, or literal `mistakes/x.md`, or date-prefixed, or a full repo-relative path) and silently misses the others. "I grepped and found none" means "I found none of THIS form," not "there are none."
2. **Write-destinations and references-to-existing-files are conflated.** A path string can be a WRITE-destination (where a NEW record will be written — must be namespaced now) or a REFERENCE to an EXISTING file (must be LEFT alone, because the file migration is deferred and the old file still lives at the flat path). Treating them as one bucket either over-edits (breaking refs to not-yet-moved files) or under-edits (leaving write-destinations flat).

## Correct approach

- **Enumerate by the DISTINCTION first.** For every path occurrence, classify it: write-destination → namespace it now; reference-to-an-existing-file → leave it (migration is deferred). The two get opposite treatment.
- **Grep multiple path-forms.** Search placeholder form, literal-with-`.md` form, date-prefixed form, and full-repo-relative-path form — not one pattern.
- **Sweep ALL surfaces, including exception and bootstrap write-paths.** The interview/bootstrap surfaces, the validator, the templates, the routing table, and every skill doc are all in scope — a sweep scoped to "the obvious docs" misses the bootstrap write-paths.
- **Check intra-file consistency.** After editing, confirm a doc's prose body, tables, and fenced examples all agree — body-vs-table drift is a real residual class.
- Verify ZERO genuine write-destination residuals (re-grep every form across every surface) before declaring done.

## How to detect

- A namespace / rename change where each evaluation round finds "a few more" residuals — the signal that the enumeration was pattern-based, not distinction-based.
- A grep that returns zero but you only tried one path-form.
- An edit that touched the obvious docs but never opened the bootstrap / interview / validator write-paths.

## Related

- [[cited-process-mistake-not-applied-to-own-artifact]] — the sibling self-application trap from the same session
- [[plan-rename-must-enumerate-all-ref-classes]] — enumerate every reference class before a rename
- [[sweep-grep-literal-loop-name-blindspot]] — a grep that matched one literal form and missed the rest
