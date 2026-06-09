---
name: sweep-grep-literal-loop-name-blindspot
description: A rename sweep verified with form-specific greps misses the same stale vocabulary in other syntactic forms — variable tokens, literal paths, brace sets, and prose are four distinct forms.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [process, docs-sync, rename-sweep, grep-scope]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Rename sweep verified with form-specific greps misses other-form occurrences

## What happened

A doc sweep renamed session-path loop dirs to a number-prefixed shape (`ideation/` → `1-ideation/`, etc.) and renamed the 4-slot interior (`rawdata`→`working`, `artifacts`→`outputs`). The sweep's verification grep checked the `{loop}` VARIABLE token and the renamed slot names, but did NOT check for LITERAL sibling-loop names (`ideation/`, `preparation/`, `planning/`, `execution/`, `wrap-up/`) used as session-path prefixes.

The blind spot: a loop's doc frequently points at a SIBLING loop's session dir (e.g. `preparation/SKILL.md` referencing `sessions/{...}/ideation/staging/`, `execution/SKILL.md` referencing `sessions/{...}/planning/staging/plans/`). These cross-loop references use the literal sibling-loop name, not the `{loop}` variable, so the sweep's variable-token grep never flagged them. The dual-system Execution eval caught ~12 surviving stale refs across multiple SKILL.md files and chat-mode.md.

The same defect survived THREE sweep passes, each time in a different SYNTACTIC FORM of the same stale-vocabulary concept. Each pass verified with a grep keyed to the form it had just edited, so the next form stayed invisible:

1. **Variable form** — `sessions/{...}/{loop}/...` with the `{loop}` token.
2. **Literal form** — `sessions/{...}/ideation/staging/` with a hard-coded sibling loop name.
3. **Brace-set + prose form** — `{ideation,preparation}/{artifacts,staging}/` (cross-loop input matrices), the 4-slot vocab `{rawdata,staging,evaluation,artifacts}/`, and bare prose slot mentions ("rawdata draft", "session-memory (rawdata, artifacts, staging)").

## Why it happens

The verification grep was scoped to the renamed token and form — i.e. it verified the THINGS THAT WERE RENAMED in the form they appeared. It did not verify the COMPLEMENT: every other on-disk loop-dir reference, including hard-coded sibling names in cross-loop input lists.

Root cause of the recurrence: every pass verified with a FORM-SPECIFIC grep — a pattern shaped like the references it had just fixed. A form-specific pattern is blind to the same stale word in any other form. Three passes, three form-shaped greps, three surviving form classes.

A rename sweep's verification must cover the full target class (every reference to the old vocabulary), not just the tokens the editor happened to touch.

## Correct approach

Do NOT verify a rename sweep with form-specific greps. Verify from an EXHAUSTIVE VOCABULARY of the renamed words, then MANUALLY CLASSIFY every hit. Concretely:

1. Build the full old-vocabulary set: every renamed word (`rawdata`, `artifacts`) AND every old loop-dir name as a session-path prefix (`ideation`, `preparation`, `planning`, `execution`, `wrap-up`), in ALL forms — bare word, `/`-suffixed path, comma-adjacent in a brace set, and inside `{...}` alternations.
2. Grep the union (one alternation covering word-boundary, path, comma, brace, and literal-prefix forms):

```
grep -rnE "\brawdata\b|\bartifacts/|artifacts,|,artifacts|\{[^}]*artifacts[^}]*\}|sessions/[^/ ]+/(ideation|preparation|planning|execution|wrap-up)/" <dirs> \
  | grep -vE "working/research|rawdata/research|interview/"
```

3. CLASSIFY every remaining hit by hand — do NOT trust the grep to self-filter. For each hit decide: is it a session-dir/slot PATH reference (FIX), or the generic produced-output CONCEPT word "artifact(s)" (LEAVE)?
4. After fixing, every remaining hit must be a known intentional retention: the generic "artifact(s)" concept, concrete-past-session historical provenance citations, loop NAMES used as a prose set (`loop ∈ {preparation, ideation, ...}`), or the `interview/` bootstrap exception.

Generalize: a rename sweep's verification must be keyed to the renamed VOCABULARY (every word, every form) plus manual classification — NEVER to the form of the references the editor happened to touch.

## How to detect

- A rename sweep touched a SHAPE (directory naming, slot naming) but the verification grep keyed on ONE FORM of the reference.
- The stale vocabulary can appear in: variable token, literal path segment, brace-set alternation (`{a,b}/{c,d}/`), and bare prose mention.
- Cross-references between sibling units (loop A's doc citing loop B's dir) use hard-coded literal names that a variable-token grep cannot see.
- The diff looks complete but a search for the stale WORD (not its form) still returns hits.

## Related

- `mistakes/cotouch-enumeration-must-cover-semantic-equivalents.md` (via project memory from prior sessions — same class of grep-scope failure)
