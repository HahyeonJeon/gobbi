# Tool Skill Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Tool skills and direct Tool Skill collections authored or substantively revised through Tool Skill<br>
> **Applicability:** One complete current tool skill or collection and its accepted lookup design; Evaluation binds the exact files, bytes, named surface, compatibility boundary, and approved lookup tasks under review<br>
> **Purpose:** Evaluate whether a tool skill gives compact, authoritative, and directly findable answers for its named surface<br>
> **Scope:** Tool boundary, compatibility, evidence, Manual structure, lookup coverage, examples, failures, recovery, and direct child tools<br>
> **Exclusions:** Shared Gobbi Skill requirements; end-to-end workflows; preference systems; live operation results beyond evidence for the manual; operating product behavior<br>
> **Governing sources:** [Checklist](../../checklist/SKILL.md), [Gobbi Skill](../SKILL.md), [Tool Skill](SKILL.md), the accepted lookup design, and the named surface's authoritative owners<br>
> **Context:** Apply the [Gobbi Skill checklist](../checklist.md) in parallel. Evaluate Manual as the core and add tool-specific items after study.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Tool Boundary

#### The manual covers an unclear or incohesive surface

- [ ] The named tool, platform, or cohesive collection cannot be identified.
- [ ] The intended readers cannot be identified.
- [ ] The approved lookup tasks cannot be identified.
- [ ] The supported version or compatibility range cannot be identified.
- [ ] Adjacent tools cannot be distinguished from the supported surface.
- [ ] Broader workflows cannot be distinguished from the supported surface.
- [ ] Unsupported versions cannot be distinguished from the supported surface.
- [ ] One skill combines tools without a shared lookup boundary.
- [ ] One skill combines tools without shared guidance.
- [ ] An approved lookup task falls outside the stated subject.
- [ ] An approved lookup task falls outside the compatibility boundary.

## Design and Development Lifecycle

### Evidence Authority

#### Taught behavior is stale, unsupported, or inconsistent with its owner

- [ ] A material behavior claim lacks support from an authoritative source or observed supported behavior.
- [ ] Conflicting authoritative evidence remains unreconciled.
- [ ] A known evidence conflict lacks a stated limitation.
- [ ] Behavior that changes with version lacks its version condition.
- [ ] Behavior that changes with configuration lacks its configuration condition.
- [ ] Behavior that changes with permission lacks its permission condition.
- [ ] Behavior that changes with environment lacks its environment condition.
- [ ] Recalled guidance overrides a current authoritative owner.
- [ ] Secondary guidance overrides a current authoritative owner.
- [ ] The manual presents behavior as current after its authoritative surface changed.
- [ ] A change-sensitive claim lacks an identifiable controlling source.
- [ ] A change-sensitive claim lacks a condition that tells maintainers when to recheck it.

### Manual Structure

#### Manual does not provide the required direct-lookup hierarchy

- [ ] Manual is absent.
- [ ] Manual is not the dominant section.
- [ ] A top-level Procedure is present.
- [ ] A lookup area is not a `###` capability category directly below Manual.
- [ ] A lookup question is not a `####` subcategory below its capability category.
- [ ] A detail appears directly below a capability category without a lookup subcategory.
- [ ] A lookup detail is not rendered as a bullet below its subtitle.
- [ ] A capability category combines unrelated lookup areas.
- [ ] A lookup subtitle combines questions that need different answers.
- [ ] A lookup subtitle combines questions that need different evidence.
- [ ] A subtitle has more than three details.
- [ ] A detail has more than two sentences.
- [ ] A detail delays its answer behind nonessential context.
- [ ] A category title uses vocabulary that differs from the named surface without need.
- [ ] A subtitle uses vocabulary that differs from the named surface without need.

### Lookup Coverage

#### An approved lookup question has an incomplete, misplaced, or indirect answer

- [ ] A needed capability is absent.
- [ ] A needed setup fact is absent.
- [ ] A needed syntax form is absent.
- [ ] A needed input is absent.
- [ ] A needed output is absent.
- [ ] A material side effect is absent.
- [ ] A needed default is absent.
- [ ] A needed limit is absent.
- [ ] A prerequisite is separated from the behavior it qualifies.
- [ ] A permission is separated from the behavior it qualifies.
- [ ] A cost is separated from the behavior it qualifies.
- [ ] A compatibility condition is separated from the behavior it qualifies.
- [ ] A reader must follow an unrelated section to assemble one complete answer.
- [ ] A reader must follow an unrelated workflow to assemble one complete answer.
- [ ] Setup extends beyond the named surface instead of routing end-to-end work to an operation owner.
- [ ] An empty heading makes approved coverage harder to find.
- [ ] An unsupported topic makes approved coverage harder to find.
- [ ] The same lookup answer appears in multiple places without one owner.

### Examples and Failure Guidance

#### Examples or failure guidance cannot establish correct use

- [ ] A command example lacks evidence from the supported surface.
- [ ] A code or API example lacks evidence from the supported surface.
- [ ] An example omits its expected output.
- [ ] An example omits a material side effect.
- [ ] An example omits a relevant prerequisite.
- [ ] An example omits a relevant permission.
- [ ] An example omits a relevant cost.
- [ ] An example omits a relevant limit.
- [ ] An example omits a relevant compatibility condition.
- [ ] An important expected failure lacks a direct observable sign.
- [ ] An important expected failure lacks a direct diagnosis.
- [ ] An important expected failure lacks a direct recovery path.
- [ ] Source-verified but unexecuted behavior is presented as live-reproduced.
- [ ] Illustrative behavior is presented as exact supported behavior.

### Tool Collections

#### A collection loses applicability, child ownership, or shallow topology

- [ ] An independently loadable tool lacks one direct Tool Skill child.
- [ ] Shared collection guidance appears in a direct child instead of the parent.
- [ ] The collection Intro does not cover its shared guidance.
- [ ] The collection Intro does not cover an applicable direct child.
- [ ] A child Intro does not tell readers to load the collection parent first.
- [ ] `Child Tools` is absent from Manual.
- [ ] `Child Tools` is not the first Manual category.
- [ ] A direct child lacks one `####` entry below `Child Tools`.
- [ ] A child entry has more or less than one detail.
- [ ] A child entry does not link its direct child.
- [ ] A child entry differs from the child's exact Intro applicability sentence.
- [ ] A child `name` differs from its directory.
- [ ] A child path differs from `{collection}/{collection}-{tool}/SKILL.md`.
- [ ] A child References table omits the collection parent.
- [ ] A child copies shared parent guidance.
- [ ] A tool child is nested deeper than one level below its collection.
- [ ] A listed child is missing.
- [ ] A child entry points to stale content.
- [ ] A child is listed more than once.
- [ ] A direct child exists without a `Child Tools` entry.
- [ ] A child is routed outside the collection boundary.

## Product Lifecycle

No supported coverage for this lifecycle.
