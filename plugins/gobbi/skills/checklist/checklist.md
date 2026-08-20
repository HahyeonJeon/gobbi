# Checklist Document Evaluation Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Checklist documents created through the Checklist operation<br>
> **Applicability:** A checklist source or generated checklist document; Evaluation binds the exact document under review. Coverage-account items apply only to reusable sources the Checklist SOP now requires to carry an account; they do not apply to unrevisions this session leaves without an account.<br>
> **Purpose:** Evaluate whether a checklist is clear, complete, reusable, and ready for Evaluation<br>
> **Scope:** Framing, lifecycle coverage, coverage account, categories, broad expected scenarios, checklist items, and evaluation use<br>
> **Exclusions:** The quality of the subject that the checklist will evaluate<br>
> **Governing sources:** [Checklist](SKILL.md), [Checklist template](templates/checklist.md), the accepted request, and applicable subject sources<br>
> **Context:** Apply the governing sources that were current when the checklist was created<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Coverage Account

> Metadata only. No row is a checklist item, and no row is ever checked.

### Scenario spectrum

| Prompt | Account | Where or reason |
|---|---|---|
| Positive / Good / normal | Covered | Subject and Authority > The checklist has an unclear or unsupported evaluation boundary; Document Structure > The document breaks the required category-to-scenario-to-item structure or retains template content; Evaluation Use > Checklist items cannot be used reliably during evaluation |
| Alternative-valid | Covered | Subject and Authority > The checklist has an unclear or unsupported evaluation boundary; Reuse and Change > Reuse or revision loses stable meaning and source identity |
| Negative / Bad / expected rejection | Covered | Subject and Authority > The checklist has an unclear or unsupported evaluation boundary; Evaluation Use > Checklist items cannot be used reliably during evaluation |
| Boundary / edge / transition | Covered | Document Structure > The document breaks the required category-to-scenario-to-item structure or retains template content; Category and Scenario Design > Categories and expected scenarios are divided at the wrong level |
| Failure / recovery | Covered | Maintenance and Change > The checklist remains stale after its subject or authority changes; Checklist Item Design > Checklist item integrity or coverage degrades |
| Poor quality | Covered | Discovery and Applicability > A cold evaluator cannot identify, apply, or navigate the checklist; Checklist Item Design > Checklist items do not express distinct observable problem signs |
| Rule violation | Covered | Document Structure > The document breaks the required category-to-scenario-to-item structure or retains template content; Checklist Item Design > Checklist item integrity or coverage degrades; Coverage Account > The coverage account is missing, blank, or unsupported |
| Adversarial / abuse / gaming / cosmetic compliance | Covered | Category and Scenario Design > Expected-scenario coverage is incomplete or artificial; Coverage Account > The coverage account is missing, blank, or unsupported |
| Change / regression / compatibility | Covered | Maintenance and Change > The checklist remains stale after its subject or authority changes; Reuse and Change > Reuse or revision loses stable meaning and source identity |
| Counterfactual / assumption | Covered | Subject and Authority > The checklist has an unclear or unsupported evaluation boundary; Evaluation Use > Checklist items cannot be used reliably during evaluation |

### Lifecycle stages

| Lifecycle | Stages | Account | Where or reason |
|---|---|---|---|
| Project | initiation, planning, governance | Covered | Subject and Authority |
| Project | coordination | Not applicable | A checklist document does not exhibit multi-party project coordination as a document-class concern. |
| Project | change control | Not applicable | Change of a checklist document is a work-artifact concern absorbed by Design and Development Maintenance and Change and Reuse and Change, not a Project change-control process. |
| Project | closure or archival | Not applicable | Supersession of a checklist source is a Design and Development Reuse and Change concern, not Project closure or archival. |
| Design and Development | conceive, design, implement | Covered | Category and Scenario Design; Checklist Item Design; Document Structure |
| Design and Development | verify | Covered | Coverage Account; Checklist Item Design |
| Design and Development | handoff, use in the work, deliver | Covered | Evaluation Use; Discovery and Applicability; Reuse and Change |
| Design and Development | maintain, change | Covered | Maintenance and Change; Reuse and Change |
| Product | use, operate, configure, support, migrate, replace, retire | Not applicable | The subject is a checklist document, a work artifact, not an operating app, service, library, or comparable product. |

Later-use, change, replacement, and retirement of a checklist document are absorbed by Design and Development Evaluation Use, Reuse and Change, and Maintenance and Change, not by Product.

## Project Lifecycle

### Subject and Authority

#### The checklist has an unclear or unsupported evaluation boundary

- [ ] A reusable source lacks a stable subject class.
- [ ] A reusable source lacks an applicability boundary.
- [ ] A target-specific source lacks an exact artifact identity.
- [ ] The intended evaluation use is unclear.
- [ ] The stated scope conflicts with the stated subject.
- [ ] A material exclusion is missing from the framing.
- [ ] The accepted request cannot be identified.
- [ ] A governing source that can change an expected result cannot be identified.
- [ ] An unsupported assumption appears as a supported checklist expectation.
- [ ] An unresolved evidence gap appears as a supported checklist expectation.

## Design and Development Lifecycle

### Document Structure

#### The document breaks the required category-to-scenario-to-item structure or retains template content

- [ ] A required lifecycle section is missing.
- [ ] A required lifecycle section appears more than once.
- [ ] The lifecycle sections appear in the wrong order.
- [ ] A lifecycle section is not a level-two heading.
- [ ] A category is not a level-three heading directly below one lifecycle.
- [ ] An expected scenario is not a level-four heading directly below one category.
- [ ] A checklist item is not placed directly below one expected scenario.
- [ ] One expected scenario is nested below another expected scenario.
- [ ] A lifecycle without supported coverage omits `No supported coverage for this lifecycle.`.
- [ ] A lifecycle marked with no supported coverage still contains a category.
- [ ] A template placeholder remains in the generated document.
- [ ] A template author instruction remains in the generated document.
- [ ] An example-only item remains in the generated document.

### Category and Scenario Design

#### Categories and expected scenarios are divided at the wrong level

- [ ] One category groups materially different concerns.
- [ ] A category name describes one narrow sign instead of the concern it groups.
- [ ] An expected-scenario heading does not name a mistake, omission, violation, failure, or poor result.
- [ ] An expected scenario is too narrow to group related checklist items.
- [ ] An expected scenario combines materially different problem families.
- [ ] Two expected scenarios cover the same problem family in the same context.
- [ ] The same concern appears in multiple lifecycle views without a different viewpoint.
- [ ] A work artifact appears in Product Lifecycle only because it has readers, handoffs, or downstream users.
- [ ] An operating app, service, library, or comparable product concern appears outside Product Lifecycle without a different viewpoint.
- [ ] A category exists without support from the subject or governing evidence.
- [ ] A supported category concern has no category.

#### Expected-scenario coverage is incomplete or artificial

- [ ] A supported normal-path problem is absent.
- [ ] A supported alternative-valid-path problem is absent.
- [ ] A supported rejection problem is absent.
- [ ] A supported boundary or transition problem is absent.
- [ ] A supported failure or recovery problem is absent.
- [ ] A supported poor-quality problem is absent.
- [ ] A supported rule-violation problem is absent.
- [ ] A supported abuse or cosmetic-compliance problem is absent.
- [ ] A supported change or compatibility problem is absent.
- [ ] A supported false-assumption problem is absent.
- [ ] An expected scenario exists without support from the subject or governing evidence.
- [ ] An expected scenario uses a spectrum prompt as its name.
- [ ] An expected scenario exists only to satisfy a coverage quota.
- [ ] A lifecycle without supported coverage invents content instead of naming the gap.

### Coverage Account

#### The coverage account is missing, blank, or unsupported

- [ ] The coverage account is absent.
- [ ] A required spectrum prompt or lifecycle-stage row is missing from the account.
- [ ] An account row is blank.
- [ ] A row marked Covered names no category or scenario.
- [ ] A row marked Covered names coverage that does not detect that family or stage.
- [ ] A row marked Not applicable gives no reason from inspected subject evidence, restates only a governing document, or is contradicted by inspected subject evidence.
- [ ] A row marked Evidence gap names no missing evidence.

#### The Product-skip absorption note is missing or false

- [ ] Product Lifecycle is skipped without stating whether later-use, change, replacement, and retirement are not applicable or absorbed.
- [ ] A named absorbing category does not cover the absorbed later-use, change, replacement, or retirement concern.

### Checklist Item Design

#### Checklist items do not express distinct observable problem signs

- [ ] An item states a positive requirement instead of an observable undesirable condition.
- [ ] An item states only a topic instead of an observable undesirable condition.
- [ ] An item states only an activity instead of an observable undesirable condition.
- [ ] One item combines problem signs that can have different answers.
- [ ] An item is ambiguous when read with its category, scenario, and shared context.
- [ ] An item prescribes a test method instead of stating the problem sign.
- [ ] An implementation choice narrows an item without being necessary to detect the problem.
- [ ] An exact value narrows an item without being necessary to detect the problem.

#### Checklist item integrity or coverage degrades

- [ ] A checklist item duplicates another item in the same context.
- [ ] A checklist item contradicts another item in the same context.
- [ ] A checklist item is too vague to answer from evidence.
- [ ] A checklist item is too specific to reuse for its stated subject class.
- [ ] A checklist item is not observable from available evidence.
- [ ] A checklist item exists without support from the subject or governing evidence.
- [ ] Removing a category leaves a supported problem uncovered.
- [ ] Removing an expected scenario leaves a supported problem uncovered.
- [ ] Removing a checklist item leaves a supported problem sign uncovered.
- [ ] A checklist item is already checked in the reusable source.
- [ ] A lifecycle, category, scenario, or checklist item has an assigned ID.

### Maintenance and Change

#### The checklist remains stale after its subject or authority changes

- [ ] A category still reflects an earlier subject boundary.
- [ ] An expected scenario still reflects an earlier governing source.
- [ ] A checklist item still reflects an earlier material premise.

### Discovery and Applicability

#### A cold evaluator cannot identify, apply, or navigate the checklist

- [ ] The document role is unclear.
- [ ] The applicability boundary is insufficient to decide whether the checklist applies.
- [ ] The meaning of a checked item is absent.
- [ ] The stated meaning of a checked item is ambiguous.
- [ ] Lifecycle headings do not lead a cold evaluator to the applicable viewpoint.
- [ ] Category headings do not lead a cold evaluator to the applicable concern.
- [ ] Expected-scenario headings do not lead a cold evaluator to the applicable problem family.

### Evaluation Use

#### Checklist items cannot be used reliably during evaluation

- [ ] An item depends on context that is unavailable to the evaluator.
- [ ] An item is too vague to identify relevant evidence without inventing an interpretation.
- [ ] An exclusion is presented as an observed problem.
- [ ] An evidence gap is presented as an observed problem.
- [ ] An inapplicable area is presented as an observed problem.

### Reuse and Change

#### Reuse or revision loses stable meaning and source identity

- [ ] A problem sign changes meaning across valid evaluation methods.
- [ ] A problem sign changes meaning across contexts inside the stated applicability boundary.
- [ ] The current reusable source cannot be distinguished from a superseded source.
- [ ] A working checklist cannot be distinguished from its reusable source.

## Product Lifecycle

No supported coverage for this lifecycle.
