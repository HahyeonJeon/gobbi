# Skill Writing — Evaluation Entry

Evaluator entrypoint for grading a skill-writing result. It extends the general Evaluation method with the
skill-writing scenario and checklist sources. One independent evaluation result still contains the seven
perspectives, Overall, separate problem and optional-improvement ledgers, verified strengths, the completed
checklist and applicable tests, and its evidence-derived verdict. A calling workflow may add its own identity,
schema, validation, and storage requirements.

Load [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and the target skill's complete canonical
directory. For an operation target, include all direct children and its plural verification bundle.

## Parent-clause crosswalk

The companions may use these stable keys. Each resolves to a live parent or type-child clause; if the clause
changes, update this crosswalk and every affected trace in the same edit.

| Key | Resolves to |
|---|---|
| `FRONTMATTER` | “MUST stamp the exact P2 frontmatter contract on every new or substantively revised skill.” |
| `TYPE-ORDER` | “MUST apply the P2 classifier in order: operation, then tool, then preference.” |
| `ONE-CHILD` | “MUST load exactly one type child at P5.” |
| `CHILD-SOP` | P5: “Each type child is an operation-shaped SOP with Intro → Principles → Rules → Procedure → References.” |
| `SKELETON` | “MUST render the complete skill skeleton before writing substantive prose.” |
| `RULE-LIMIT` | “MUST keep the complete Rules section to at most nine semantic rule items.” |
| `RULE-DISTINCT` | “MUST make every Rule an unmistakable, binding, self-contained, testable boundary distinct from every Principle.” |
| `LANGUAGE` | “MUST use plain, literal, type-appropriate language throughout the skill.” |
| `TYPE-JOBS` | Principles “A preference skill standardizes judgment,” “A tool skill is an authoritative usage manual,” and “An operation skill is a standard operating procedure.” |
| `OP-BUNDLE` | “MUST ship every new or substantively revised operation with `scenarios.md`, `checklists.md`, and `evaluation.md`.” |
| `CANONICAL` | P4: “Edit only the canonical project skill directory named by the affected-file map.” |
| `VERIFY-OWNER` | P3: “Verify every mechanism claim from its owner and every taught example against the live surface.” |
| `REF-LOCAL` | “MUST keep References local to the skill.” |
| `ARTIFACT-GUARDS` | `SKILL.md` P6 structural, link, reference, compatibility, retired-vocabulary, and one-child checks |
| `PREF-SHAPE` | `preference-skill.md` target-shape Rule and S9 acceptance step |
| `TOOL-SHAPE` | `tool-skill.md` target-shape Rule and S9 acceptance step |
| `OP-SHAPE` | `operation-skill.md` target-shape and artifact-set Rules plus S11 acceptance step |
| `SOLE-POLICY` | `operation-skill.md`: “MUST keep target `SKILL.md` as the sole policy owner.” |

## Selecting scenarios and checks

Run after the productive-step evaluator understands the artifact and before its evaluation frame is frozen.

1. **Identify the change mode.** Record new, substantive revision, migration, split, or narrow compatibility
   correction. Activate `SW-CHECK-19` whenever untyped legacy skills remain in the repository.
2. **Reconstruct the classifier.** Read the target actor, trigger, outcome, non-goals, heading shape, and owned
   workflow. Select `SW-SCENARIO-01`–`06` cases that could distinguish the chosen type from its alternatives.
3. **Select the type branch.** Always activate `SW-CHECK-01`–`06`, `16`–`18`, `20`, `23`–`26`, and `28`,
   plus `SW-SCENARIO-15`, `18`–`21`, and `23`. Activate `SW-CHECK-22` when its remediation predicate holds.
   Then activate `SW-CHECK-07`, `08`, or `09`–`15` according to the selected type and supporting content.
4. **Select compatibility and Rules cases.** Activate `SW-SCENARIO-07`, `09`, `14`, `16`, `19`, `20`, and
   `21`; activate `08` when legacy skills are intentionally untouched.
5. **Select ownership and artifact-verification cases.** Always activate `SW-CHECK-03`, `04`, `21`, and `23`.
   Activate `SW-SCENARIO-17` and `18`; activate `SW-CHECK-27` and `SW-SCENARIO-22` when a generated,
   discovery, plugin, or runtime view exists; activate `13` when another change moves, removes, or changes an
   owner or consumer.
6. **Select, do not rewrite.** Carry activated `SW-CHECK-*` IDs and their resolutions into the report's
   completed checklist. Keep IDs stable and leave this source unchecked.
7. **Extend on discovery.** Put new scenarios or checks only in the filled evaluation copy for the current run;
   report a `scenario_gap` or `checklist_gap` finding rather than editing these sources during evaluation.

## Perspectives

### Project

**Lens:** Does the type and scope serve the intended actor and one capability without pulling legacy migration
or adjacent workflow redesign into the change?

**Activate:** `SW-SCENARIO-01`–`08`, `13`, `19`, `20`; `SW-CHECK-01`–`04`, `19`, `24`, `25`.

**Anti-patterns:** topic-based type labels; multiple outcomes hidden under one name; narrow compatibility edits
used as a reason for mass migration; a dependent artifact redesigned without checking its owner's destination;
a description that sounds optional or does not identify what the skill is.

### Structure

**Lens:** Do frontmatter, aligned orientation, the initial skeleton, selected section shape, direct type child,
and operation companion topology express one clear ownership graph?

**Activate:** `SW-SCENARIO-01`–`05`, `07`, `09`–`11`, `14`–`23`; `SW-CHECK-05`–`18`, `20`–`28`.

**Anti-patterns:** Procedure in a preference; missing or empty Preferences; contextual defaults left in Rules;
a Preference allowed to override a Rule; more than nine semantic Rules; one bullet hiding several Rules; a
Rule duplicating a Principle; peer Manual in an operation; nested type children; companion-only policy; a
present-but-empty verification file accepted by filename; outside skills, documents, scripts, data, or URLs
listed in References; polished prose retrofitted into a skeleton; Intro-only policy; mandatory boundaries
hidden outside Rules; a type child retaining peer Boundary, Required shape, or Completion checks sections; a
direct child given skill frontmatter or its own verification bundle.

### Performance

**Lens:** Is progressive disclosure proportionate, with common gates in the parent, one selected type child,
a top-down skill wireframe, a distinct skeleton, bottom-up construction, bounded Rules, and no need to load
irrelevant manuals or duplicated policy?

**Activate:** `SW-SCENARIO-03`, `05`, `09`, `10`, `14`–`16`, `18`, `20`, `21`, `23`; `SW-CHECK-06`, `08`,
`10`–`12`, `16`–`18`, `20`, `22`, `23`, `25`, `26`, `28`.

**Anti-patterns:** loading all type children; duplicating full tool references inside an SOP; repeating parent
rules across companions; repeating Principles as Rules; hiding unrelated constraints in one item; adding empty
headings for theoretical completeness; using References as a cross-project owner index instead of local child
navigation; writing summaries before their supporting sections exist.

### Aesthetics

**Lens:** Are descriptions decisive, names and terms literal, headings predictable, Rules visibly normative,
and sentences concise enough for a cold reader to distinguish judgment, lookup, and execution?

**Activate:** `SW-SCENARIO-01`–`03`, `07`, `09`, `14`, `16`, `18`–`21`, `23`; `SW-CHECK-05`–`10`,
`16`–`18`, `23`–`26`, `28`.

**Anti-patterns:** using “reference” or a topic noun as a hidden fourth type; ornamental taxonomy prose; vague
Manual headings; numbered operation steps with no evidence or branch semantics; a References section padded
with outside related reading; `Use when` descriptions; acronyms or shifting synonyms that require private
context; mandatory claims communicated only by tone.

### Usage

**Lens:** Can an author select the type, run the correct child, recover from a boundary failure, and complete the
artifact without hidden context?

**Activate:** all scenarios; `SW-CHECK-01`–`28`.

**Anti-patterns:** classifier requires author intuition not stated in P2; reclassification has no return path;
operation companions are named but not authorable; the rule limit is enforced by deletion instead of
classification and relocation; a final artifact hides that the author skipped the wireframe and skeleton
gates.

### Consistency

**Lens:** Do parent, type child, scenario, checklist, evaluation, direct consumers, and feature claims agree on
type, shape, Rules, ownership, and migration state?

**Activate:** `SW-SCENARIO-04`, `05`, `07`–`11`, `13`–`23`; `SW-CHECK-02`, `04`–`06`, `11`–`28`.

**Anti-patterns:** old universal-form language remains live; frontmatter order differs between prose and example;
scenario/check mappings are one-way; child procedures omit the parent Rules contract; a historical record is
rewritten instead of superseded; a type child permits an outside References target that the parent forbids;
a child SOP's own shape is confused with the target type shape it teaches.

### Risk

**Lens:** Does the operation fail closed on wrong type, foreign frontmatter, unverified commands, missing
recovery, unsafe examples, live deletion dependencies, rule-count gaming, semantic loss during reduction, and
incomplete evaluation evidence?

**Activate:** `SW-SCENARIO-06`, `07`, `09`, `11`–`23`; `SW-CHECK-02`–`05`, `08`–`18`, `20`–`28`.

**Anti-patterns:** cosmetic heading compliance; tool example run without side-effect preflight; generator deleted
while consumed; independent Rules hidden in a compound bullet; unique conditions dropped during deduplication;
checklist coverage closure mistaken for acceptance; a runtime mirror edited instead of its owner; an
orientation claim that never appears in the body.

## Recommended verification

Run from the repository root with side-effect preflight:

1. Parse the target frontmatter and confirm required key order, the three-value enum, optional-key membership,
   non-default invocation values, and a stated reason for each rare optional key. Confirm the description
   begins `MUST load`, states the exact condition, and identifies the skill by capability and type in a
   complete sentence.
2. Map description and Intro claims to the completed body. Fail repetition that adds no useful orientation and
   any Intro-only policy.
3. Compare the P4 skill wireframe, initial P5 skeleton, authoring sequence, and final heading tree. Fail when
   the skeleton does not implement the wireframe or substantive prose preceded the complete frontmatter,
   heading, direct-child, and applicable operation-sibling skeleton.
4. Extract the final target heading tree and compare it with the selected type child's target-shape Rule.
5. Inspect all three type children. Require Intro → Principles → Rules → Procedure → References, a dominant
   Procedure, at most nine valid Rules, no child skill frontmatter or independent bundle, and no peer
   Boundary, Required shape, or Completion checks sections.
6. Compare the P2 selected child with the accepted P5 load register. Fail if the register contains another
   type child, even when the final headings conform.
7. For an operation, verify all three direct sibling files exist and close both trace directions.
8. Search all live consumers for retired universal-form, fourth-type, and deleted-path claims; classify historical
   carriers separately from live contracts.
9. Group the merge-base diff by canonical, generated, discovery, plugin, and runtime surface. Fail a hand-edited
   non-canonical view.
10. Run the project markdown-link and retired-vocabulary guards.
11. Extract every References section. Resolve each link against the directory containing its governing
   `SKILL.md`; fail URLs, self-links, non-Markdown targets, and any normalized path outside that directory.
   Confirm an empty heading when no child document or child-skill entrypoint exists, and inspect outside-owner
   citations beside their claims.
12. Inventory semantic rule items across the complete Rules section. Count one multi-clause item once only when
   its clauses define one indivisible pass/fail contract; count unrelated constraints separately and fail when
   the total exceeds nine.
13. Build a Principle-to-Rule claim map. Fail semantic duplicates, a Rule without a bold normative lead, and
    any artifact-level mandatory boundary that exists only outside Rules.
14. Run a cold-reader language pass. Fail unstable terminology, unexplained abbreviations, crowded sentences,
    missing actors or conditions, implied normative force, filler, and ornamental expressions that carry
    meaning.
15. When a rule was removed, combined, or relocated, prove every original subject, condition, exception,
    hazard, and recovery boundary survives in the final artifact. Require an explicit section-based
    justification for any change in force.

Tool evidence is required for file, path, and command claims at confidence 75 or 100. For semantic
classification, rule counting, deduplication, and document ownership, cite the exact parent and child clauses
plus the contradictory or confirming artifact passage.

## Overall anchors

The Overall pass must answer:

- Does the selected type reflect the actual capability, including mixed-content precedence?
- Does the P2 decision and accepted P5 load register prove exactly one selected type child, with no
  multiple-child synthesis hidden by compliant headings?
- Do all three direct type children use the operation-shaped SOP contract while clearly distinguishing their
  own authoring shape from the target type shape they produce?
- Does frontmatter preserve the four-key prefix, begin its description with `MUST load`, state the exact load
  condition, identify what the skill is, and use only evidenced non-default optional keys?
- Does the Intro usefully expand that description from the completed body without becoming a second policy
  owner?
- Does the P4 skill wireframe design the whole top-down into its parts, and does the P5 record prove the
  skeleton implemented that wireframe before substantive prose and the content was reconciled bottom-up?
- Does the document have the exact type shape in substance, not only headings?
- For an operation, can the SOP succeed and recover, and does the complete plural bundle prove it?
- Is `SKILL.md` the sole policy owner with a closed four-file trace?
- Did the change preserve its scope and coordinate owner lifecycle changes?
- Does the complete Rules section contain at most nine semantic items, including constraints hidden inside
  compound bullets?
- Is every Rule binding, self-contained, testable, and semantically distinct from every Principle?
- Does every Rule expose its force with a bold normative lead, with no mandatory artifact boundary hidden in
  another section?
- Did any rule reduction preserve every unique condition and move misplaced content to its correct owner?
- Is the language plain, literal, stable, type-appropriate, and understandable without retained author
  context?
- Does the References section contain only child documents or child skills inside the skill directory, or an
  empty placeholder when no such material exists?
- Did authored changes stay in the canonical project skill directory while other views remained read-only?
- Did all artifact guards pass?

The preserve list should identify correct classification boundaries, strong parent ownership, clear recovery
paths, and evidence-bearing checks that a revision must not weaken.
