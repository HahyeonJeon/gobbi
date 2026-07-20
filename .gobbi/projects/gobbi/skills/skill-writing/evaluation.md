# Skill Writing — Evaluation Entry

Evaluator entrypoint for grading a skill-writing result. It extends the active phase evaluation with the
skill-writing scenario and checklist sources; it does not replace the phase's singular bundle, finding schema,
seven-perspective order, verdict thresholds, or nine-output contract.

Load [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and the target skill's complete canonical
directory. For an operation target, include all direct children and its plural verification bundle.

## Parent-clause crosswalk

The companions may use these stable keys. Each resolves to a live parent or type-child clause; if the clause
changes, update this crosswalk and every affected trace in the same edit.

| Key | Resolves to |
|---|---|
| `TYPE-ENUM` | “MUST classify every new or substantively revised skill as `preference`, `tool`, or `operation`” |
| `TYPE-ORDER` | “MUST classify in precedence order: operation, then tool, then preference.” |
| `ONE-CHILD` | “MUST load exactly one type child at P5.” |
| `OPTIONAL-KEYS` | “MUST carry the four required frontmatter keys plus optional keys only from P2's named allowlist.” |
| `DOMINANT` | “MUST keep the selected type's dominant section dominant.” |
| `OP-BUNDLE` | “MUST ship every new or substantively revised operation with `scenarios.md`, `checklists.md`, and `evaluation.md`.” |
| `CANONICAL` | “MUST edit the canonical project skill directory only.” |
| `VERIFY-OWNER` | “MUST verify mechanism claims from their owner and verify taught examples against the live surface.” |
| `COLD-PROOF` | “MUST finish with structural guards, runtime cold loads, and a fresh-agent proof.” |
| `PREF-SHAPE` | `preference-skill.md` § Required shape and § Completion checks |
| `TOOL-SHAPE` | `tool-skill.md` § Required shape and § Completion checks |
| `OP-SHAPE` | `operation-skill.md` § Required artifact set and § Completion checks |
| `SOLE-POLICY` | `operation-skill.md`: “The parent is the sole policy owner.” |

## Selecting scenarios and checks

Run after the active phase evaluator understands the artifact and before its Stage 1 frame is frozen.

1. **Identify the change mode.** Record new, substantive revision, migration, split, or narrow compatibility
   correction. Activate `SW-CHECK-19` whenever untyped legacy skills remain in the repository.
2. **Reconstruct the classifier.** Read the target actor, trigger, outcome, non-goals, heading shape, and owned
   workflow. Select `SW-SCENARIO-01`–`06` cases that could distinguish the chosen type from its alternatives.
3. **Select the type branch.** Always activate `SW-CHECK-01`–`06`, `SW-SCENARIO-15`, and `SW-CHECK-20`, then
   `07`, `08`, or `09`–`15` according to the selected type and supporting content.
4. **Select compatibility cases.** Activate `SW-SCENARIO-07`; activate `08` when legacy skills are intentionally
   untouched; activate `09` for every target-runtime cold load.
5. **Select ownership and wiring cases.** Always activate `SW-CHECK-03`, `04`, and `16`–`18`. Activate
   `SW-SCENARIO-13` when another change moves, removes, or changes an owner or consumer.
6. **Copy, do not rewrite.** Add activated `SW-CHECK-*` items verbatim to the active phase's filled checklist
   under `## Stage 1 Additions`. Keep IDs stable and leave this source unchecked.
7. **Extend on discovery.** Put new scenarios or checks only in the filled evaluation copy for the current run;
   report a `scenario_gap` or `checklist_gap` finding rather than editing these sources during evaluation.

## Perspectives

### Project

**Lens:** Does the type and scope serve the intended actor and one capability without pulling legacy migration
or adjacent workflow redesign into the change?

**Activate:** `SW-SCENARIO-01`–`08`, `13`; `SW-CHECK-01`–`04`, `19`.

**Anti-patterns:** topic-based type labels; multiple outcomes hidden under one name; narrow compatibility edits
used as a reason for mass migration; a dependent artifact redesigned without checking its owner's destination.

### Structure

**Lens:** Do frontmatter, selected section shape, direct type child, and operation companion topology express one
clear ownership graph?

**Activate:** `SW-SCENARIO-01`–`05`, `07`, `10`, `11`, `15`; `SW-CHECK-05`–`15`, `20`.

**Anti-patterns:** Procedure in a preference; peer Manual in an operation; nested type children; companion-only
policy; a present-but-empty verification file accepted by filename.

### Performance

**Lens:** Is progressive disclosure proportionate, with common gates in the parent, one selected type child,
and no need to load irrelevant manuals or duplicated policies?

**Activate:** `SW-SCENARIO-03`, `05`, `10`, `15`; `SW-CHECK-06`, `08`, `10`–`12`, `20`.

**Anti-patterns:** loading all type children; duplicating full tool references inside an SOP; repeating parent
rules across all companions; adding empty headings for theoretical completeness.

### Aesthetics

**Lens:** Are names literal, headings predictable, rules scannable, and examples concise enough for a cold reader
to distinguish judgment, lookup, and execution?

**Activate:** `SW-SCENARIO-01`–`03`, `07`; `SW-CHECK-05`–`10`.

**Anti-patterns:** using “reference” or a topic noun as a hidden fourth type; ornamental taxonomy prose; vague
Manual headings; numbered operation steps with no evidence or branch semantics.

### Usage

**Lens:** Can an author select the type, run the correct child, recover from a boundary failure, and complete the
artifact without hidden context?

**Activate:** all scenarios; `SW-CHECK-01`–`18`, `20`.

**Anti-patterns:** classifier requires author intuition not stated in P2; reclassification has no return path;
operation companions are named but not authorable; cold-use claims are inferred from the current session.

### Consistency

**Lens:** Do parent, type child, scenario, checklist, evaluation, direct consumers, feature claims, and runtime
mirrors agree on type, shape, ownership, and migration state?

**Activate:** `SW-SCENARIO-04`, `05`, `07`–`11`, `13`–`15`; `SW-CHECK-02`, `04`–`06`, `11`–`20`.

**Anti-patterns:** old universal-form language remains live; frontmatter order differs between prose and example;
scenario/check mappings are one-way; a historical record is rewritten instead of superseded; mirror topology is
asserted from content equality.

### Risk

**Lens:** Does the operation fail closed on wrong type, foreign frontmatter, unverified commands, missing
recovery, unsafe examples, live deletion dependencies, runtime rejection, and incomplete evaluation evidence?

**Activate:** `SW-SCENARIO-06`, `07`, `09`, `11`–`15`; `SW-CHECK-02`–`05`, `08`–`18`, `20`.

**Anti-patterns:** cosmetic heading compliance; tool example run without side-effect preflight; generator deleted
while consumed; runtime extension rejection suppressed; checklist coverage closure mistaken for acceptance.

## Recommended verification

Run from the repository root with side-effect preflight:

1. Parse the target frontmatter and confirm required key order, the three-value enum, optional-key membership,
   non-default invocation values, and a stated reason for each rare optional key.
2. Extract the heading tree and compare it with the selected type child.
3. Inspect the P2 record and type-child read/load transcript; fail if the P5 run consumed more than the one
   selected child, even when the final headings conform.
4. For an operation, verify all three direct sibling files exist and close both trace directions.
5. Search all live consumers for retired universal-form, fourth-type, and deleted-path claims; classify historical
   carriers separately from live contracts.
6. Run the project markdown-link and retired-vocabulary guards.
7. Run `scripts/sync-plugin-package.sh --check`, `scripts/test-sync-plugin-package.sh`, and
   `scripts/check-codex-plugin-smoke.sh`.
8. Inspect mirror topology from the live tree rather than relying on a content comparison through a symlink.
9. Cold-load in every target runtime and capture one fresh-agent capability proof per runtime.

Tool evidence is required for file, path, command, mirror, and runtime claims at confidence 75 or 100. For
semantic classification and document ownership, cite the exact parent and child clauses plus the contradictory
or confirming artifact passage.

## Overall anchors

The Overall pass must answer:

- Does the selected type reflect the actual capability, including mixed-content precedence?
- Did the P5 run load exactly one selected type child, with no multiple-child synthesis hidden by compliant
  headings?
- Does frontmatter preserve the four-key prefix while using only evidenced non-default optional keys?
- Does the document have the exact type shape in substance, not only headings?
- For an operation, can the SOP succeed and recover, and does the complete plural bundle prove it?
- Is `SKILL.md` the sole policy owner with a closed four-file trace?
- Did the change preserve its scope and coordinate owner lifecycle changes?
- Do both runtimes load the Gobbi frontmatter extension and can fresh agents use the skill?

The preserve list should identify correct classification boundaries, strong parent ownership, clear recovery
paths, and evidence-bearing checks that a revision must not weaken.
