# Memory Evaluation Entrypoint

Use this entrypoint to evaluate the [Memory operation](SKILL.md). It extends the general
[Evaluation](../evaluation/SKILL.md) method with Memory-specific scenarios, checks, lenses, and trace
requirements. A calling workflow owns any report shape or output path.

## Inputs

Read and freeze:

1. [Memory](SKILL.md), [memory map](memory-map.md), [scenarios](scenarios.md), and [checklists](checklists.md).
2. The exact candidate inventory, typed staged sources, durable preimages, actual durable changes, and handoff copies when applicable.
3. The governing [Record](../record/SKILL.md), [Record map](../record/record-map.md), [Wrap-up](../wrap-up/SKILL.md), [Memory rules](rules.md), and used [templates](templates/).
4. The accepted source artifacts, user decisions, verification evidence, and changed-path boundary.

Bind the review to the exact subject digest and system identity required by the Evaluation owner.

## Selection and completion

1. Select every scenario whose Given condition can occur in the subject. Run the seeded synthetic probe when a case tests a required boundary or adversarial property absent from the live subject.
2. Select every `MEM-CHECK-` item whose applicability predicate is true. Resolve false predicates only from inspected evidence.
3. Add a target-specific scenario and check when the subject has a material actor, type, trust boundary, lifecycle change, or evidence claim not covered by the seed set.
4. Review all seven perspectives in order, then Overall.
5. Record findings, checklist results, and the verdict through the active Evaluation contract. Do not edit the Memory subject.

Every selected scenario must reach its linked check. Every applicable check must appear in the completed evaluation checklist.

## Perspective lenses

| Perspective | Memory-specific lens | Seed routes | Recommended verification |
|---|---|---|---|
| Project | Does the candidate set preserve the right durable facts, whole agreed scope, and nothing invented? | 01–05 | Compare accepted sources, keep/drop reasons, scope, and empty-set behavior |
| Structure | Are Memory, Record, Wrap-up, type templates, and durable homes separated by clear owner boundaries? | 04–10 | Trace each source through one authorized owner and one destination |
| Performance | Does the concrete implementation add material repeated scans, unbounded work, or avoidable file churn? | target-specific when applicable | Inspect counts and command evidence; otherwise record N/A from the absence of a resource property |
| Aesthetics | Are names, type choices, hierarchy, and handoff content concise and clear to a cold reader? | 01, 06, 10 | Inspect slugs, headings, body focus, and duplicated prose |
| Usage | Can the next actor identify what to stage, when to stop, what owner acts next, and how to recover? | 02, 05, 07, 09 | Walk an empty run, ambiguous classification, and failed validation from the documented entrypoint |
| Consistency | Do rules, scenarios, checks, mappings, staged candidates, durable records, lifecycle enums/reasons, archive-body link scope, active carriers, live namespace changes, and handoff copies agree? | 06–14, 17, 19–21 | Run trace closure, scoped active-file links, exact archive-path and status/reason checks, explicit strict archive validation, body comparison, and namespace probes |
| Risk | Can unsupported, ineligible, unsafe, destructive, misplaced, unreviewed, or stale active material become durable? | 03, 05, 08, 09, 11, 14–21 | Run false-pass, source-ingress, mutation-before-validation, invented-successor, illegal-pair, feature-local archive, failed-move, frozen-body, active-carrier, live-namespace, and protected-evidence probes |
| Overall | Does the complete lifecycle turn supported evidence into durable memory without bypassing authority, losing history, or overstating completion? | all applicable cases | Compare the parent contract, actual tree, completed register, and direct evidence |

## Rule crosswalk

| Parent rule | Scenarios | Checks | Primary perspectives |
|---|---|---|---|
| [M-1](SKILL.md#m-1) | 01, 03, 06, 15, 16, 18 | 01, 03, 06, 15, 16, 18 | Project, Risk |
| [M-2](SKILL.md#m-2) | 02, 03 | 02, 03 | Project, Usage |
| [M-3](SKILL.md#m-3) | 04, 05 | 04, 05 | Project, Usage |
| [M-4](SKILL.md#m-4) | 01, 06, 09, 15, 18 | 01, 06, 09, 15, 18 | Structure, Consistency |
| [M-5](SKILL.md#m-5) | 07, 09 | 07, 09 | Structure, Risk |
| [M-6](SKILL.md#m-6) | 02, 07, 08, 09 | 02, 07, 08, 09 | Structure, Risk |
| [M-7](SKILL.md#m-7) | 10, 11 | 10, 11 | Consistency, Usage |
| [M-8](SKILL.md#m-8) | 12, 14 | 12, 14 | Consistency, Risk |
| [M-9](SKILL.md#m-9) | 13, 14, 17, 19–21 | 13, 14, 17, 19–21 | Consistency, Risk |
| [M-10](SKILL.md#m-10) | 06, 09–15, 17–21 | 06, 09–15, 17–21 | Consistency, Overall |

## Required adversarial verifications

- **Unsupported-content probe:** a well-shaped candidate without an authoritative source must fail.
- **Empty-set probe:** zero justified candidates must leave typed staging empty without lowering acceptance.
- **Wrong-type probe:** a body performing another type's job must fail even under a valid directory name.
- **Ingress probe:** a plausible durable file outside authorized typed staging must not enter the inventory.
- **Pre-write failure probe:** a malformed typed source must fail before any durable change and leave prior evidence unchanged.
- **Handoff-drift probe:** a one-sided material body edit must fail body identity and reviewed-subject checks.
- **Lifecycle-shortcut probe:** one-sided supersession; a non-null successor on retired/completed/abandoned
  material; an illegal status/reason pair; missing archive fields; date/type/area mismatch; a
  feature-local archive path; early move; incomplete archive; deletion; or dangling inbound path must
  fail. The validator is invoked with each exact new project-root archive path.
- **Failed-move probe:** a conflicting archive destination or changed preimage must leave active and archive bytes unchanged.
- **Frozen-archive-body probe:** an outbound relative link that resolved before the terminal move may be
  unresolved afterward without failure only when its text and the complete body remain byte-identical,
  the archive is outside link-resolution inputs, and every separate archive proof passes.
- **Active-inbound-carrier probe:** a changed active carrier that retains the old path must fail scoped
  link and actual-tree verification; it cannot borrow the frozen archive-body exclusion.
- **Live-namespace probe:** a broken relative link after an active area split, merge, or rename must fail
  the full changed-Markdown gate; it cannot borrow the terminal archive-body exclusion.
- **Protected-evidence probe:** a full protected payload must be rejected when a safe pointer and bounded summary preserve proof.

## Finding focus

Open a finding when direct evidence shows:

- a source-free or filler candidate;
- a type or scope chosen without evidence or authority;
- a candidate whose path and body disagree;
- a write performed by the wrong owner;
- a promotion input outside typed staging;
- prior staged evidence changed;
- a durable mutation began before complete validation;
- handoff bodies or reviewed identity differ;
- reciprocal true supersession is incomplete, or a non-successor state invents a successor;
- a terminal record has an illegal reason, archive-only field defect, date/type/area/path mismatch, or
  feature-local destination;
- a terminal record moved early, stayed active, lost its body, or was deleted;
- a failed terminal move changed or overwrote either location;
- an inbound path no longer resolves;
- an archive body was normalized or its outbound relative-link text changed;
- a new archive body was incorrectly included in link-resolution inputs, or its exclusion was used to
  skip body identity, explicit strict validation, lifecycle, or actual-tree proof;
- an active inbound carrier escaped scoped link validation or retained the old path;
- a live namespace move borrowed the archive-only link exclusion;
- protected payload entered durable memory; or
- a completion claim lacks final-tree evidence.

Use the causal finding content, checklist completion, perspectives, and declared verdict derivation from
[Evaluation](../evaluation/SKILL.md). When a workflow requires exact metadata, confidence or severity scales,
provenance, or serialization, use its active adapter. The Memory companion adds subject-specific coverage only.

## Anti-patterns

- Treating a populated directory as evidence of durable value.
- Treating a matching type label as proof that the body performs that type's job.
- Inferring not-applicable status without inspecting the predicate.
- Accepting an owner report instead of the staged file, durable file, or actual diff.
- Reviewing only the new record and missing damage to the replaced record.
- Passing a handoff because both copies exist without comparing their bodies.
- Accepting an archive pointer without verifying the full original body.
- Hiding a supported concern because another perspective already mentioned it.

## Overall anchors

### PASS anchor

All applicable Memory checks pass with inspected evidence. Candidate selection is justified, empty results stay valid, owner boundaries hold, typed staging is the only ingress, actual durable paths match the sole project-root map, every new archive preserves its body and passes explicit strict and actual-tree proof, active carriers and live namespace moves pass their complete link gates, handoff bodies match, successor semantics and history are preserved, and no supported blocking finding remains.

### REVISE anchor

The core outcome remains achievable, but at least one evidence, type, owner, trace, handoff, or lifecycle defect requires a material correction and fresh full review.

### FAIL anchor

The subject permits unsupported or unauthorized durable writes, loses or deletes history, exposes protected evidence, mutates before complete validation, or cannot prove the actual durable result.

## Output

Return the single active Evaluation report with:

- Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall exactly once;
- the complete problem and optional-improvement ledgers;
- every applicable `MEM-CHECK-` result with inspected evidence;
- the rule-crosswalk coverage result;
- unresolved evidence gaps; and
- concrete strengths that later correction must preserve.

No companion-specific report or durable artifact is created.
