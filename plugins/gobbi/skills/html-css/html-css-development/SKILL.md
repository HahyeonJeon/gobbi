---
name: html-css-development
description: "MUST load when creating, changing, repairing, maintaining, migrating, or performing a protected read-only review of HTML, CSS, generated markup or styling output, or their public interfaces and consumers."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# HTML/CSS Development

Use this operation to produce one bounded HTML/CSS change, maintenance result, migration, or protected review
report. It binds the request to authorized canonical sources, transforms, material variants, public
interfaces, consumers, targets, and applicable specialist decisions before work begins.

Choose exactly one mode after study: authorized change or maintenance, protected read-only review, or public-
interface migration. The operation changes no product, security, deployment, publication, or release decision;
it returns those claims to their owners and hands focused evidence to `html-css-testing`.

## Principles

### Repair the earliest owned cause

Change the first wrong authorized source, transform, assumption, or owner decision, not the generated file or
visible symptom where the failure appeared.

### Keep review protected

A protected review observes and reports without changing source, generated output, configuration, fixtures,
baselines, or lasting runtime state. A repair requires a separate authorized change-mode run.

### Treat variants and interfaces as development inputs

Generated and conditional outputs can differ by content, locale, direction, theme, state, responsive context,
target, or transform. Public markup and styling names require consumer, compatibility, transition, and recovery
records before change.

### Invalidate dependent evidence explicitly

A source, transform, target, variant, or public-interface change can make prior test and consumer evidence
stale. Preserve history and mark replaced records through supersession instead of silently overwriting them.

## Rules

- **MUST record the requested outcome, selected mode, mutation authority, canonical source, transforms, owners,
  and limits before acting.** Stop with the exact missing input and its owner when the frame is incomplete.
- **MUST change authorized canonical sources and regenerate owned outputs.** Never repair an emitted artifact
  directly when a source or generator owns it.
- **MUST keep every change within approved intent and specialist decisions.** Route semantic, convention,
  motion, platform, product, security, or release questions to their owners.
- **MUST make protected review byte-preserving and reversible.** Restore temporary inspection state and reject
  any conclusion that depends on state the review itself created.
- **MUST contain incomplete generation or migration.** Restore the last coherent domain state or repair wholly
  forward before dependent work continues.
- **NEVER claim completion beyond current evidence.** Record unobserved variants, unknown consumers, unavailable
  targets, unresolved decisions, and handoffs to other owners as explicit limitations.

## Procedure

### Phase 1 — Frame the Development Subject

#### 1.1 Bind outcome, authority, source, and owner

- Record the requested changed, maintained, reviewed, or migrated outcome and its approved intent.
- Record the operating mode, who authorized mutation, the writable boundary, and every decision owner outside this skill.
- Locate the earliest authorized canonical HTML/CSS source and every generator, template, preprocessor, bundler,
  or transform that can produce the observed output.
- Stop before inspection or editing when any required input, source, access, decision, or owner is unknown;
  report the exact missing item and who must supply it.

#### 1.2 Bind variants, interfaces, consumers, and evidence

- Create or reuse the lifecycle envelope: subject ID, intent reference, canonical source and transform,
  public-interface references, and variant-set ID.
- List material variant dimensions and their known population: content, locale, language, direction, writing
  mode, theme, state, viewport or container, input mode, accessibility preference, target, and generator path.
- Inventory public elements, attributes, classes, IDs, selectors, hooks, custom properties, tokens, animation
  names, and generated identities; name known consumers and the confidence of consumer discovery.
- Record applicable `html-css-semantics`, `html-css-conventions`, `html-css-motion`, and `html-css-platform`
  decisions and the focused evidence needed after work.

#### 1.3 Select exactly one mode

- Select **Change or maintenance** when authorized source bytes may change without a public-interface transition.
- Select **Protected review** when the required output is findings and source mutation is forbidden.
- Select **Migration** when a public markup or styling interface or its consumer contract changes.
- Ask the caller to choose when more than one mode fits; do not combine a review report and its repair in one run.

### Phase 2 — Study Once and Establish a Minimal Skeleton

#### 2.1 Trace current behavior and the earliest cause

- Read the canonical sources, transforms, generated examples, callers, consumers, tests, configuration, and
  applicable project conventions.
- Reproduce the current state or defect at the narrowest evidence layer capable of showing it.
- Trace the cause through source, transform, cascade, semantics, target behavior, or owner decision until the
  first wrong in-scope cause is identified.
- Route an out-of-scope cause to its owner with the observed evidence and stop that claim.

#### 2.2 Establish the complete change shape

- Map Create, Read, Update, Delete, and co-touch effects across source, transforms, output, consumers, tests,
  documentation, and public interfaces.
- Build the smallest complete structural skeleton before detail: document regions, stylesheet or layer
  placement, selector and hook seams, generated path, variant cases, test seams, and recovery boundary.
- Keep the first increment small enough to verify; repair a failing increment before adding the next.
- Preserve unrelated source and user changes.

### Phase 3 — Execute the Selected Mode

#### 3.1 Change or maintain authorized source

- Apply the smallest complete source change that produces the approved outcome and keeps specialist Rules true.
- Regenerate every owned output from its canonical source and record source, transform, parameters, material
  cases, and emitted identity.
- Update affected HTML/CSS consumers, focused tests, fixtures, baselines, and public-interface records in the
  same bounded change.
- If generation becomes partial or inconsistent, stop consumers, restore the prior coherent output set or
  complete generation wholly forward, and mark affected evidence stale.

#### 3.2 Perform protected read-only review

- Capture pre-review source, generated-output, configuration, fixture, baseline, and relevant runtime identity.
- Inspect the complete declared subject through design, source, generated variants, semantics, presentation,
  motion, compatibility, accessibility, performance, maintenance, migration, and evidence boundaries that
  apply.
- Report each problem with exact location, failed condition, evidence, impact, semantic owner, and repair
  boundary; separate problems, optional improvements, strengths, limitations, and questions owned by other skills.
- Restore temporary state and compare the post-review identity with the pre-review capture; if any lasting byte
  or state changed, the protected review fails and its report cannot be accepted.

#### 3.3 Migrate a public interface

- For each interface, record kind, exact identity, owner, consumers and confidence, compatibility, replacement,
  transition, evidence, residual gaps, domain recovery, and handoff to the release owner.
- Choose an atomic consumer update when all consumers are repository-closed and authorized; choose a staged
  domain transition only when known external consumers and the separately owned release context require coexistence.
- Update canonical source, transforms, generated outputs, authorized consumers, focused evidence, and the
  interface inventory as one coherent domain state.
- On failure, restore the last coherent interface and consumer state or repair wholly forward; never leave a
  mixed old/new contract or invent an executable old-family alias.

### Phase 4 — Verify, Invalidate, and Hand Off

#### 4.1 Verify the selected result

- For a change, verify source, regeneration, selected variant cases, consumer compatibility, specialist Rules,
  and the exact final diff.
- For a review, verify report completeness, reproducibility, no-mutation evidence, restored runtime state, and
  that every identified repair remains unmade.
- For a migration, verify every known consumer, transition state, selected variants, residual gap, domain
  recovery, and publication or release-owner handoff.
- Use [`evaluation/procedure/checklists.md`](evaluation/procedure/checklists.md) and
  [`evaluation/result/checklists.md`](evaluation/result/checklists.md) together for a complete Development
  evaluation.

#### 4.2 Supersede stale evidence and report completion

- Mark prior variant, test, interface, and consumer records stale when changed source, transform, target, or
  contract invalidates them; append current owner-tagged entries and retain history.
- Hand focused assertions to `html-css-testing`, target questions to `html-css-platform`, and excluded product,
  security, deployment, publication, or release work to its named owner.
- Return outcome, mode, canonical source, emitted identities, selected and unobserved variants, interfaces and
  consumers, evidence, limitations, recovery state, and next owners.
- Complete only when the selected mode's result is coherent and every unresolved condition is explicit.

## References

- [`evaluation/procedure/checklists.md`](evaluation/procedure/checklists.md) evaluates Development framing,
  authority, process, containment, and recovery.
- [`evaluation/result/checklists.md`](evaluation/result/checklists.md) evaluates the changed, reviewed,
  maintained, or migrated result.
