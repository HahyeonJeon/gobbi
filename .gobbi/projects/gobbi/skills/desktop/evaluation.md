# Desktop Application Evaluation Entry

Be the evaluator entrypoint that selects the applicable cases and checks and adds desktop lenses. Policy lives
in [`SKILL.md`](SKILL.md); cases live in [`scenarios.md`](scenarios.md) and binary operational gates live in
[`checklists.md`](checklists.md). It adds no policy and creates no additional evaluation phase or artifact.

**Non-expansion, stated plainly.** This file refines the general evaluation method's lenses and evidence for a
desktop subject. It does not replace that method, add a perspective, add a verdict value, or produce a second
result. The **caller** owns the machine shape, the output path, the validation, the aggregation, and the
storage mechanics; nothing here changes them, and nothing here is a separate deliverable the caller must
collect.

**Bundle load list.** Three files, all of which exist: [`SKILL.md`](SKILL.md),
[`scenarios.md`](scenarios.md), and [`checklists.md`](checklists.md). The mechanics children are read as needed
for a specific claim. There is **no `mistakes.md` in this skill's directory**, so nothing here loads one — a
skill-owned mistakes home is written by Wrap-up promotion, and naming a path that does not exist would fail
the load closed.

## Stage 0 — Frame the evidence

Before judging anything, fix what is being judged and what evidence exists for it.

1. **Bind the subject and its version.** Name the exact artifacts under review and the platform version every
   version-dependent claim depends on. [`runtime-deltas.md`](runtime-deltas.md) is the sole owner of those
   literals; a claim whose version is unnamed is unevaluable rather than passing.
2. **Confirm independence.** The evaluator did not design, author, or implement the subject. Self-review does
   not supply the independent verdict, and a creator's own PASS is not evidence.
3. **Freeze the subject.** If the writer can still change it, stop. A report that reviewed different bytes from
   the declared subject is not a result.
4. **Record the capability limit.** Several desktop claims need a runtime that can build, install, sign, or
   launch on a specific operating system. Where this evaluator cannot execute the proving action, the claim
   stays **unevaluable** and the limit is stated; it is never resolved by close reading. Attribute any executed
   proof to the system that ran it.
5. **Inventory the claimed operating systems.** Every per-system claim needs that system's own evidence.
   Evidence from one system supports no claim about another, so the claim set determines the evidence set.

**Evidence:** a frame record naming the subject and version, the independence statement, the platform-version
pin, the claimed-system set, and every capability limit that will leave a claim unevaluable.

## Rule-to-coverage crosswalk

Every live rule and prohibition, the families that exercise it, and the check cluster that gates it. Thirty
rules and eleven prohibitions are live; two identifiers were withdrawn during design and are never
reallocated.

| Clauses | Families | Check cluster |
|---|---|---|
| `DESK-R01`, `DESK-R02`, `DESK-N01` | `01` | outcome and boundary — `DESK-CHECK-01`, `DESK-CHECK-25` |
| `DESK-R03` | `01`, `05`, `09` | stack fit — `DESK-CHECK-02` |
| `DESK-R04` | `01`, `10` | design ownership — `DESK-CHECK-03` |
| `DESK-R05`, `DESK-R06`, `DESK-N02` | `10`, `02` | rung register and silent skip — `DESK-CHECK-07` |
| `DESK-R07`, `DESK-R08`, `DESK-R09`, `DESK-N03` | `02`, `08` | ladder method and fidelity — `DESK-CHECK-08` |
| `DESK-R10` | `08` | accessibility floor, member and property — `DESK-CHECK-09`, `DESK-CHECK-10` |
| `DESK-R11` | `03`, `06`, `07`, `09` | safety floor, member and property — `DESK-CHECK-11`, `DESK-CHECK-12`, `DESK-CHECK-24` |
| `DESK-R12` | `02` | participant floor, member and property — `DESK-CHECK-13`, `DESK-CHECK-14` |
| `DESK-R13`, `DESK-N04` | `02`, `10` | direct-evidence floor, member and property — `DESK-CHECK-15`, `DESK-CHECK-16` |
| `DESK-N05` | `02`, `08`, `10` | protected-waiver truth table — `DESK-CHECK-17` |
| `DESK-R14`, `DESK-R16`, `DESK-R17`, `DESK-N07` | `04` | privilege boundary and targets — `DESK-CHECK-18` |
| `DESK-R15`, `DESK-N06` | `04`, `07` | crossing validation — `DESK-CHECK-19` |
| `DESK-R18` | `03`, `04`, `06` | lifecycle disposal — `DESK-CHECK-20` |
| `DESK-R19`, `DESK-R20`, `DESK-N08` | `07` | security posture and hardening — `DESK-CHECK-21`, `DESK-CHECK-22` |
| `DESK-R21`, `DESK-R22`, `DESK-N09` | `03`, `08` | platform conformance, one claim per item — `DESK-CHECK-23`, `DESK-CHECK-37`, `DESK-CHECK-38`, `DESK-CHECK-39`, `DESK-CHECK-40`, `DESK-CHECK-41`, `DESK-CHECK-42`, `DESK-CHECK-43`, `DESK-CHECK-44`, `DESK-CHECK-45` |
| `DESK-R23`, `DESK-R24` | `09`, `06` | release gates and irreversibility — `DESK-CHECK-27`, `DESK-CHECK-28`, `DESK-CHECK-29`, `DESK-CHECK-30`, `DESK-CHECK-31` |
| `DESK-R25` | `10` | claim separation — `DESK-CHECK-32` |
| `DESK-R26` | `03`, `05`, `09`, `10` | version pinning, the claim-to-source register, unknowns, and mechanism verification at the owner — `DESK-CHECK-05`, `DESK-CHECK-26`, `DESK-CHECK-46` |
| `DESK-R27`, `DESK-N10` | `01`, `10` | user-gate authority — `DESK-CHECK-04`, `DESK-CHECK-22`, `DESK-CHECK-36` |
| `DESK-R27` — the `DESK-G3` structural-approval leg | `02`, `10` | structural-skeleton approval — `DESK-CHECK-06` |
| `DESK-R28` | `10` | trace and verifier proof — `DESK-CHECK-34` |
| `DESK-R29` | `10`, `02` | design-record completeness — `DESK-CHECK-33` |
| `DESK-R31`, `DESK-N12` | `10`, `09` | deferred-capability marking — `DESK-CHECK-35` |

**Closure, in both directions.** Forward: every one of the thirty live rules and eleven live prohibitions
appears above with at least one family and at least one check. Reverse: every family `01`–`10` and every check
`01`–`46` appears in at least one row, so no case and no check is orphaned from a live clause. Both sweeps run
to **zero orphans**. A clause with no family or no check is a coverage gap in the scenario or checklist source
rather than something a crosswalk row can paper over.

**`Source` is not a fifth projection.** Each check's `Source` field is a *(check, rule)* relation, and it is the
check side of this crosswalk. The four projections named below are *(case, check)* relations. A relation over
one pair of sets cannot be an exact projection of a relation over a different pair, so requiring equality
across all five is a test no correct bundle can pass. `Source` closes its own direction here.

## Selecting cases and checks

1. **Start from the whole set, then disposition.** All ten families and all forty-six checks are candidates.
   Select every case and check whose applicability predicate holds for this subject.
2. **A non-selection needs an inspected property.** Record `n/a:<property>` with the inspection that found the
   predicate false. The conditional checks — measurement, deep link, tray residency, dropped files, signing,
   update, deferred capability — are the only places a legitimate `n/a` normally arises, and even there the
   property is inspected rather than assumed.
3. **The four `-PROPERTY` checks are never deselected.** `DESK-CHECK-10`, `DESK-CHECK-12`, `DESK-CHECK-14`, and
   `DESK-CHECK-16` each declare `Applicability: unconditional` exactly once and never resolve `n/a`, because the
   property each claims holds of every desktop outcome.
4. **Freeze the selected frame before recording any result**, then treat it as the coverage floor rather than
   the limit. The perspective investigation below is required to look past it.
5. **Add what the frame missed.** A material condition with no case or check is added, evaluated, and recorded
   as a coverage gap in the source — not silently absorbed into an adjacent row.

## Relation and obligation verification

Two tests, and they prove different things. Running one and reporting the trace as proved is the specific
failure this section exists to prevent.

**The relation test — mechanical, self-failing.** The four projections of the authoritative *(case, check)*
relation must have identical normalized edge sets:

1. the case-level `Trace` field in [`scenarios.md`](scenarios.md) — **authoritative**;
2. each check's `Seeds` field in [`checklists.md`](checklists.md);
3. the guaranteed coverage map in [`checklists.md`](checklists.md);
4. the check-to-obligation union audit in [`checklists.md`](checklists.md).

The test compares edge sets and **exits non-zero on any symmetric difference**, naming the offending edge and
which side holds it. It never prints a count and calls that a result. It fails closed on an empty inventory, a
missing file, and a missing section, because a gate that cannot see its subject must not pass it.

Run the checked-in implementation from the repository root:

```bash
python3 -B .gobbi/projects/gobbi/skills/desktop/scripts/check_relation.py
python3 -B .gobbi/projects/gobbi/skills/desktop/scripts/check_relation.py --self-test
```

Use `--scenarios PATH --checklists PATH` together for disposable copies. The success output names the shared
non-zero edge count and states `relation_leg=script-proved obligation_leg=review-proved`; the count supports
the result but exact edge-set equality is the acceptance condition.

**The obligation test — review-proved, per case.** A named reviewer reads each selected case's `Obligation` and
**every** mapped check's actual `Pass:` and `Evidence:` wording, and confirms the check's own wording owns
every named primitive the obligation asserts, **in the obligation's sense** — asserted, not negated, not named
as an anti-pattern, and not carried in an unrelated clause.

- Matching identifiers, equal counts, and the audit table's summary prose close nothing.
- The reviewer reads **every** mapped check for a case with more than one, not the first; a per-case result
  covers that case's whole mapped set.
- The result is recorded **per case with the reviewer's identity**. An unrecorded case is an unrun test, and a
  failed case fails the obligation test.

**Why this leg is review-proved rather than scripted.** No fixed-string comparison can distinguish an asserted
primitive from a negated one, or a dropped primitive from one carried in an unrelated clause. An earlier design
tried a substring containment leg and it was unsound: a token was satisfied by a longer token containing it — a
prefix collision on a real configuration value this very skill teaches. **What is lost is stated rather than
hidden:** no script fails on a dropped primitive. The relation test still proves mechanically that the
projections agree, so a mis-routed edge is caught by a command; a correctly-routed check whose wording dropped
a primitive is caught only by the recorded read.

**The planted-fixture proof — three fixtures, and the verifier proved at both ends.**

| Fixture | Planted defect | Rejected by | Leg |
|---|---|---|---|
| **F-A** | a case's `Trace` names a check whose `Seeds` omits that case | the relation test, on a non-empty symmetric difference | **script-proved** |
| **F-B** | a check's `Seeds` names a case whose `Trace` omits that check | the relation test, on a non-empty symmetric difference | **script-proved** |
| **F-C** | all four projections agree, and one named primitive the case's `Obligation` asserts is absent from the mapped check's `Pass:` and `Evidence:` wording | the obligation test | **review-proved** |

Plant one defect per disposable copy, run the verifier, record the exact non-zero exit and message for each
script-proved fixture and the reviewer's recorded rejection for the review-proved one, then discard the copies.
**The recorded proof is the three rejections themselves, not a statement that they were run.**

**Both ends, every leg.** The verifier exits non-zero on each planted fixture **and** exits zero on the real
bundle; the reviewer rejects F-C **and** accepts the real bundle. Both results are recorded for both legs. A
gate proved only on the failing side can forbid the state the work must reach; a gate proved only on the
passing side can be fail-open.

**The verifier's own output states which legs are script-proved and which is review-proved**, so a reader never
mistakes a green relation test for a complete obligation proof.

## Evidence classes and claim boundaries

| Evidence | May support | Does not alone support |
|---|---|---|
| Source and static inspection | structure, configured controls, the fuse configuration as written, dependency shape | run-time behavior, per-system behavior, user success |
| Automated tests | exercised behavior in the test environment, on the build the suite actually ran against | the shipped artifact when the build matrix differs, visual quality, user acceptance |
| Live application interaction | the operated path and visible state on that system, in that build | hidden semantics, other operating systems, packaged behavior |
| Accessibility-tree inspection | semantics, name, role, value, exposed state | pixel quality, all assistive-technology behavior, user acceptance |
| Captured rendering | the captured pixels and visible state at one moment | semantics, keyboard and focus behavior, motion, accessibility conformance — [`vision`](../vision/SKILL.md) owns these limits |
| Representative-user evidence | observed design fit for the recruited people, on the system it was gathered on | implementation correctness, or any population or system not represented |
| Local-data and state evidence | authoritative on-disk effects and invariants in that environment | user comprehension, or behavior after a version change |
| Lab performance | repeatable synthetic behavior under declared conditions, **on the named platform version** | the production population, or any other platform version |
| Field telemetry | instrumented behavior for the observed installed population | causality, uninstrumented harm, or design acceptance |
| **Packaged-artifact evidence** *(desktop)* | that an installer exists and installs in a clean environment on that system | that it is signed, that it updates, or that it behaves correctly once installed |
| **Signature and notarization evidence** *(desktop)* | that the shipped bytes carry a valid identity on that system | that an update works, or that signature-gated behavior was exercised |
| **Update-rehearsal evidence** *(desktop)* | that a person on the previously released version reaches this one with data intact | anything about a release two versions back, or about a fresh install |
| **Per-operating-system evidence** *(desktop — an axis rather than a method)* | claims about the system it was gathered on | any claim about any other claimed system |

**The four desktop additions exist because the release chain has four separately provable stages** — packaged,
installed, signed, updated — and because the operating system is itself an evidence axis here rather than a
configuration detail. Window behavior, menu structure, notification behavior, shortcut mapping, and
assistive-technology behavior all differ per system.

**Never merge evidence classes into one tested status.** Nine claims are separate by rule: design acceptance,
implementation correctness, packaged-artifact evidence, signature and notarization evidence, update-rehearsal
evidence, per-system evidence, release readiness, release authority, and post-release outcome. Resolve a
contradiction at the authoritative owner and never let the favorable signal mask it. An unrunnable gate is
recorded as a limitation that **blocks** the claim it would have proved, never widened into a weaker signal
that partially supports it.

## The seven perspectives

Seven lenses plus Overall, in the general method's fixed order. Each entry below is the desktop refinement of
that lens rather than a replacement for it, and each names the families whose declared primary category routes
to it.

### Project

*Families `01`, `02`.* Test the trigger, the bounded outcome, the claimed operating systems, the scope
boundary, the non-goals, and the completion claim. Test the stack-fit result as **six inspected results** rather
than a verdict, and test whether any positive criterion reached the user as a decision. Test the ownership
statement. Look for a claimed system with no evidence route, an entry mode named in the outcome and absent from
every path, and a designed path left unimplemented behind a green build.

### Structure

*Families `03`, `04`.* Test the execution-context assignment per unit, the channel inventory against the
handlers enumerated from source, the bridge contract's shape, and the three compilation targets. Test that the
derived marking travels with the three-target split at every site that states it. Test lifetime ownership:
every cross-process resource keyed to a named lifecycle event rather than to scope exit. Look for a privileged
handler reachable over a channel absent from the inventory, and for a contract typed in terms of classes.

### Performance

*Family `05`.* Test whether every recorded measurement names the platform version it was taken on, and whether
any comparison attributes a difference to the run's own work across differing versions. Test that file and
parsing work is off the privileged process's own thread — a blocking call there freezes every window at once,
which has no analogue on the web. Look for an unqualified startup number presented as an improvement.

### Aesthetics

*No family declares this as its primary category*, which is worth stating rather than leaving as an apparent
gap: the subject is a delivery skill, and its aesthetic surface is its own prose and structure. Test
self-evidence, accurate naming, concision, convention fit, and whether the bundle reads as one coherent
artifact. Test that no file restates a fact another owns. Look for placeholders, headings with no resolved
content, and a size figure treated as a pass condition.

### Usage

*Families `02`, `08`.* Test the experience of the person using the application and of the operator running the
release. Test the accessibility union as a **property** over the run's own action, state, and meaning inventory,
per claimed system, with direct behavioral results. Test that reduced motion is honored from the renderer's own
media query, and that the absence of a theme-interface property was not read as the signal being unavailable.
Test the participant conditions and their fail-closed behavior. Look for a per-system accessibility claim
resting on documentation that names nothing for that system.

### Consistency

*Families `09`, `10`.* Test agreement across the family: the four projections, the crosswalk in both
directions, each check's `Source` against the clause it names, every intra-family pointer against content the
target actually holds, and every version-dependent statement against the single owner. Test the design record
against the run's own claims. Look for a stale pointer that still resolves, a count stated in one file and
contradicted by a scan, and an identifier reallocated after withdrawal.

### Risk

*Families `06`, `07`.* Test the two kinds of security work as **written or missing**, per item, naming file and
line. Test the fuse configuration on the built artifact rather than in source. Test the four floors on both
their member check and their property check, and test that no waiver token sits on a protected item. Test the
release chain's irreversibility: the supported-old-version window, the update rehearsal from the previous
release, and the stop conditions. Require **direct** evidence for every irreversible, trust-boundary, and
data-loss claim. Look for a secret in the shipped artifact, an unlisted clause reaching an unrecoverable
consequence, and a build matrix recorded with one horn.

## Recommended verification

| # | Verification | Method | What it cannot prove |
|---|---|---|---|
| 1 | The relation test over the four projections | run it; require exit zero and a named edge count | that any check's wording carries its obligation's primitives |
| 2 | The obligation test, per selected case | a recorded read of every mapped check's `Pass:` and `Evidence:` wording, with the reviewer's identity | routing correctness, which verification 1 owns |
| 3 | The three planted fixtures, at both ends | plant, run, record the exit and message or the recorded rejection, discard | anything about a defect class no fixture models |
| 4 | Clause closure in both directions | enumerate live clauses from `SKILL.md` and compare against the crosswalk; then enumerate families and checks and compare back | that a mapped check actually exercises the clause |
| 5 | The four `-PROPERTY` declarations | confirm each carries exactly one unconditional-gate declaration; a bare total of four false-passes a two-and-two split | that the property check's evidence was actually gathered |
| 6 | The unchecked source | confirm no ticked box exists in `checklists.md` | that a filled copy resolved correctly |
| 7 | Every count the family states | reproduce each by scan — families, cases, cells, items, edges, conditions | that the counted set is the right set |
| 8 | Every intra-family pointer | open the target and confirm it holds the content the pointer's context expects | that the content is correct, only that it is present |
| 9 | Version-dependent statements | confirm each names its version and resolves to the single owner | that the owner's own value is current |
| 10 | Fuse and security state | read the **built artifact**, not the source | behavior on a system the evidence was not gathered on |

**A capability limit is recorded, never resolved by reading.** Where this evaluator cannot build, install, sign,
launch, or measure on a claimed system, the affected verification stays unrun and the claim stays unevaluable.
Attribute any executed proof to the system that ran it.

## Overall anchors and claim ledger

**Overall integrates across lenses; it is not a summary of them.** Six anchors, each a cross-perspective
effect no single lens owns:

1. **The gap between what was designed and what was built.** The ladder produces a design record; the build
   produces an artifact. Overall tests whether the artifact realizes the accepted design, and whether any rung
   was quietly reinterpreted during implementation rather than re-entered.
2. **The gap between what was tested and what ships.** If the build-matrix decision put automation on a
   differently fused build, every claim that automation supports is a claim about a different artifact. Overall
   tests whether that limit is stated where the claims are read, not only where the decision was recorded.
3. **Evidence-class merging under time pressure.** The nine claims are separate by rule and converge into one
   green status under deadline. Overall tests whether the ledger still distinguishes them, and whether an
   unrunnable gate is recorded as blocking rather than as partial support.
4. **Per-system claims resting on one system's evidence.** The most common cross-lens failure here: a claim
   proved on one operating system and reported as a property of the outcome. Overall tests whether the claim
   scope matches the evidence scope, per claim.
5. **A floor satisfied member-by-member while its property is violated.** Each floor's member check and
   property check pass separately; Overall tests whether the property checks were resolved by an inventory
   sweep or by a member roll-up wearing the sweep's name.
6. **Mechanism standing in for an outcome contract.** A green relation test, a complete matrix, a full
   register — Overall tests whether the machinery was used to establish the property or to substitute for it.

**Strengths this family's later work must preserve**, recorded because a revision that loses them is a
regression even if every check still passes: the single-owner discipline for version literals; the property
checks' explicit rejection of member roll-ups; the item-scope test that protects items bearing on a floor
rather than only items titled after one; the review-proved obligation test and its honestly stated coverage
loss; and the marked gaps that were left as gaps rather than filled from a plausible summary.

### The claim ledger

One row per claim the evaluation itself makes. It is the evaluator's own honesty surface, and it is filled in
the report rather than here.

| Field | What it records |
|---|---|
| Claim | the single thing asserted |
| Evidence class | which row of the table above supports it |
| Scope | the operating system, build, and version the evidence covers |
| Method | what was actually run or read, exactly |
| Limit | what this evidence cannot support |
| Verdict contribution | which perspective result it feeds |

**Three ledger rules.**

- **A claim with no evidence row is not a finding**; it is an observation, and it is labelled one.
- **A claim whose scope is narrower than its wording is a defect in the wording**, not a limitation to note in
  passing. Narrow the claim to its evidence.
- **An unevaluable claim is recorded as unevaluable and blocks what it would have proved.** It never
  contributes a weaker signal toward a pass.

**Verdict derivation belongs to the general method**, which owns the three verdict values, the thresholds, and
the aggregation. This file adds no verdict value and changes no threshold. What it adds is the desktop
consequence of the general rule that a supported finding stays visible: **the irreversibility of a shipped
release means a Risk or Consistency finding on the release chain cannot be softened because the correction
looks cheap.** Once the artifact is on a person's machine, the correction is a new release, and the finding was
the last point at which it was cheap.
