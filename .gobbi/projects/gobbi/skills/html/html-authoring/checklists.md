# HTML Development Evaluation Checklist

This reusable unchecked source evaluates one HTML development change and its exact emitted document or
fragment. It is governed by the [`html`](../SKILL.md) domain, [`html-authoring`](SKILL.md) operation,
[`html-platform`](../html-platform/SKILL.md) manual, and
[`html-semantics`](../html-semantics/SKILL.md) preferences. The source commit that contains this file
identifies the checklist version. Its stable owner prefix is `HTML`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

## Project

### HTML-SC-PROJECT-01 — Normal case: bounded artifact outcome

An ordinary change has one requested HTML outcome, an authorized source, an exact emitted artifact, declared
targets, and explicit owner boundaries. It fails this scenario when the artifact is unnamed, the target set is
assumed, or adjacent CSS, JavaScript, security, generator, or runtime work silently enters scope.

#### Checklist

- [ ] HTML-CK-PROJECT-01-01 — The requested HTML outcome is explicit.
- [ ] HTML-CK-PROJECT-01-02 — The authorized source boundary is explicit.
- [ ] HTML-CK-PROJECT-01-03 — The emitted document or fragment has one exact identity.
- [ ] HTML-CK-PROJECT-01-04 — Every claimed target has an exact browser-version or pinned-Electron-release identity.
- [ ] HTML-CK-PROJECT-01-05 — Every triggered non-HTML concern has a named owner.

### HTML-SC-PROJECT-02 — Expected failure: missing material authority or owner

A material source, target, authority, or owner is unknown. The expected outcome is an exact stop that preserves
the unresolved state; acceptance despite the gap is the observable failure.

#### Checklist

- [ ] HTML-CK-PROJECT-02-01 — Artifact acceptance remains open while a material input or owner is unknown.
- [ ] HTML-CK-PROJECT-02-02 — The stop identifies the first missing fact, authority, target, or owner.
- [ ] HTML-CK-PROJECT-02-03 — The proposed recovery stays within an authorized source or owner boundary.

## Structure

### HTML-SC-STRUCTURE-01 — Normal case: conforming semantic tree

The emitted source must satisfy the applicable WHATWG authoring requirements and produce the intended DOM
relationships. The scenario fails when a content model, attribute, document constraint, or parsed
relationship is wrong even if the source syntax looks plausible.

#### Checklist

- [ ] HTML-CK-STRUCTURE-01-01 — Every element appears in a permitted context.
- [ ] HTML-CK-STRUCTURE-01-02 — Every element contains only permitted content.
- [ ] HTML-CK-STRUCTURE-01-03 — The parsed parent, child, and sibling order matches the intended structure.
- [ ] HTML-CK-STRUCTURE-01-04 — The heading sequence represents the intended content hierarchy.
- [ ] HTML-CK-STRUCTURE-01-05 — Every attribute is permitted on its element.
- [ ] HTML-CK-STRUCTURE-01-06 — Every table preserves its intended header-to-data relationships.
- [ ] HTML-CK-STRUCTURE-01-07 — Every attribute value satisfies its applicable authoring requirements.
- [ ] HTML-CK-STRUCTURE-01-08 — Every form control preserves its intended form association.
- [ ] HTML-CK-STRUCTURE-01-09 — Every applicable document-level authoring constraint is satisfied.
- [ ] HTML-CK-STRUCTURE-01-10 — The serialized source satisfies the applicable HTML syntax requirements.

### HTML-SC-STRUCTURE-02 — Edge case: parser recovery and fragment context

Recovery-sensitive tables, forms, formatting elements, templates, nested interaction, and generated fragments
can produce a DOM different from the apparent source. The expected outcome is an explicit context and parsed
tree; accepting browser recovery as conformance is the failure.

#### Checklist

- [ ] HTML-CK-STRUCTURE-02-01 — A fragment names its parsing context when that context can change the tree.
- [ ] HTML-CK-STRUCTURE-02-02 — Recovery-sensitive markup has an explicit expected DOM structure.
- [ ] HTML-CK-STRUCTURE-02-03 — Every material source-to-DOM difference is identified.
- [ ] HTML-CK-STRUCTURE-02-04 — Parser recovery is not treated as permission to keep nonconforming source.

## Performance

### HTML-SC-PERFORMANCE-01 — Poor quality: conforming but wasteful markup

A conforming artifact can still add needless resource discovery, duplicate requests, or repeated hidden
structure. The expected outcome is markup whose resource and tree cost serves the current result; a clean
validator report or one favorable score does not excuse avoidable work.

#### Checklist

- [ ] HTML-CK-PERFORMANCE-01-01 — Every resource-bearing element serves the current outcome or fallback.
- [ ] HTML-CK-PERFORMANCE-01-02 — Every resource hint matches one intended eventual request.
- [ ] HTML-CK-PERFORMANCE-01-03 — No HTML declaration duplicates the same intended request in a declared target.
- [ ] HTML-CK-PERFORMANCE-01-04 — Every repeated or hidden subtree is required by current content or behavior.
- [ ] HTML-CK-PERFORMANCE-01-05 — Every HTML-attributed performance claim identifies the exact emitted artifact.
- [ ] HTML-CK-PERFORMANCE-01-06 — Every HTML-attributed performance claim stays within the observed target conditions.

## Aesthetics

### HTML-SC-AESTHETICS-01 — Poor quality: valid but unclear markup

The artifact is technically valid but difficult to understand or review because meaning depends on styling,
selector conventions, excessive wrappers, or redundant attributes. The expected outcome is plain, consistent
markup whose structure communicates its purpose.

#### Checklist

- [ ] HTML-CK-AESTHETICS-01-01 — Source order reflects the intended content and interaction order.
- [ ] HTML-CK-AESTHETICS-01-02 — Element choices express meaning rather than styling or selector convenience.
- [ ] HTML-CK-AESTHETICS-01-03 — The same semantic purpose uses a consistent markup pattern.
- [ ] HTML-CK-AESTHETICS-01-04 — Every wrapper has a current structural or semantic purpose.
- [ ] HTML-CK-AESTHETICS-01-05 — Redundant semantic attributes are absent.
- [ ] HTML-CK-AESTHETICS-01-06 — Conflicting semantic attributes are absent.

## Usage

### HTML-SC-USAGE-01 — Normal case: understandable native content and controls

An ordinary user-facing artifact should expose understandable content, navigation, input, feedback, and native
behavior without depending on presentation alone. It fails when a user-visible relationship is missing or an
element's meaning conflicts with the action it performs.

#### Checklist

- [ ] HTML-CK-USAGE-01-01 — A native element is used wherever its meaning and behavior fit.
- [ ] HTML-CK-USAGE-01-02 — Every link represents navigation.
- [ ] HTML-CK-USAGE-01-03 — Every button represents an action.
- [ ] HTML-CK-USAGE-01-04 — Every applicable control has a purposeful accessible name.
- [ ] HTML-CK-USAGE-01-05 — Every applicable visible label remains available after input begins.
- [ ] HTML-CK-USAGE-01-06 — Every applicable control group has an explicit relationship.
- [ ] HTML-CK-USAGE-01-07 — Every applicable instruction has an explicit relationship to its subject.
- [ ] HTML-CK-USAGE-01-08 — Every applicable error has an explicit relationship to its subject.
- [ ] HTML-CK-USAGE-01-09 — Every applicable state is exposed by the relevant element.
- [ ] HTML-CK-USAGE-01-10 — Every applicable non-text item has a purposeful alternative.
- [ ] HTML-CK-USAGE-01-11 — Every native interactive element retains its expected keyboard behavior.
- [ ] HTML-CK-USAGE-01-12 — Every native interactive element retains its expected activation behavior.

### HTML-SC-USAGE-02 — Edge case: target, language, direction, and fallback variation

The artifact crosses browser or Electron targets, languages, text directions, or support levels. The expected
outcome preserves correct meaning and an essential path in every claimed target; one sample locale, direction,
or runtime cannot justify a universal claim.

#### Checklist

- [ ] HTML-CK-USAGE-02-01 — The document language is identified accurately.
- [ ] HTML-CK-USAGE-02-02 — Every material language change is identified accurately.
- [ ] HTML-CK-USAGE-02-03 — Direction metadata matches every place where direction is expressed or inferred.
- [ ] HTML-CK-USAGE-02-04 — Every declared target provides the required native path or an explicit fallback.
- [ ] HTML-CK-USAGE-02-05 — A support difference remains limited to the exact affected targets.
- [ ] HTML-CK-USAGE-02-06 — An unavailable target remains unresolved rather than being treated as supported.

### HTML-SC-USAGE-03 — Rule violation: semantic counterfeit

A styled generic element or ARIA role appears correct but does not fulfill the native semantic or behavioral
contract it exposes. The expected outcome uses native capability or supplies the complete custom contract;
role-only or appearance-only compliance is the failure.

#### Checklist

- [ ] HTML-CK-USAGE-03-01 — Every explicit ARIA role is permitted on its HTML element.
- [ ] HTML-CK-USAGE-03-02 — Every ARIA state or property is permitted on its HTML element.
- [ ] HTML-CK-USAGE-03-03 — No explicit ARIA value conflicts with native semantics.
- [ ] HTML-CK-USAGE-03-04 — Every custom interactive element exposes a purposeful name.
- [ ] HTML-CK-USAGE-03-05 — Every applicable state of a custom interactive element is exposed by that element.
- [ ] HTML-CK-USAGE-03-06 — Every custom interactive element implements its promised keyboard behavior.
- [ ] HTML-CK-USAGE-03-07 — Every custom interactive element implements its promised activation behavior.
- [ ] HTML-CK-USAGE-03-08 — Every applicable custom interactive element exposes the role matching its promised behavior.

## Consistency

### HTML-SC-CONSISTENCY-01 — Normal case: one artifact across evidence layers

Direct or transformed source, emitted bytes, parsed DOM, target behavior, and the acceptance claim must refer
to one traceable artifact. The scenario fails when a result from one layer is silently attributed to another
artifact or interpreted as a broader kind of evidence.

#### Checklist

- [ ] HTML-CK-CONSISTENCY-01-01 — Directly authored output records that no transform occurred.
- [ ] HTML-CK-CONSISTENCY-01-02 — Transformed output identifies its exact source or generator input.
- [ ] HTML-CK-CONSISTENCY-01-03 — Transformed output identifies the exact transform tool and version.
- [ ] HTML-CK-CONSISTENCY-01-04 — Transformed output identifies the exact transform configuration.
- [ ] HTML-CK-CONSISTENCY-01-05 — The emitted artifact has a reproducible byte or digest identity.
- [ ] HTML-CK-CONSISTENCY-01-06 — Conformance observations bind to that emitted identity.
- [ ] HTML-CK-CONSISTENCY-01-07 — DOM observations bind to that emitted identity.
- [ ] HTML-CK-CONSISTENCY-01-08 — Target observations bind to that emitted identity.
- [ ] HTML-CK-CONSISTENCY-01-09 — Source, DOM, target, and product claims remain distinct.
- [ ] HTML-CK-CONSISTENCY-01-10 — Each retained claim stays within its owning evidence layer.
- [ ] HTML-CK-CONSISTENCY-01-11 — Every conformance observation identifies the checker and its exact version.
- [ ] HTML-CK-CONSISTENCY-01-12 — Every conformance observation identifies the checker configuration used.

### HTML-SC-CONSISTENCY-02 — Expected failure: transformed output changes during repair

A repair changes source or generator behavior, making the prior emitted identity and downstream observations
stale. The expected outcome creates a new artifact identity and repeats affected checks; reusing old evidence
or patching emitted bytes is the failure.

#### Checklist

- [ ] HTML-CK-CONSISTENCY-02-01 — The repair changes the earliest authorized source or generator cause.
- [ ] HTML-CK-CONSISTENCY-02-02 — Regenerated output receives a new emitted identity.
- [ ] HTML-CK-CONSISTENCY-02-03 — Evidence for the failed identity is not attributed to the regenerated output.
- [ ] HTML-CK-CONSISTENCY-02-04 — Every evidence layer affected by the repair is re-evaluated.
- [ ] HTML-CK-CONSISTENCY-02-05 — The completion record names the accepted identity rather than the failed identity.

## Risk

### HTML-SC-RISK-01 — Adversarial: unsafe data, remote content, or privilege crossing

Untrusted data, dangerous sinks, remote content, navigation, or Electron privilege crosses the HTML boundary.
The expected outcome keeps emitted semantics with HTML and routes trust or privilege decisions to the owning
security or runtime mechanism; markup or validation presented as protection is the failure.

#### Checklist

- [ ] HTML-CK-RISK-01-01 — Every untrusted-data decision is owned by the applicable security mechanism.
- [ ] HTML-CK-RISK-01-02 — Every dangerous-sink decision is owned by the applicable security mechanism.
- [ ] HTML-CK-RISK-01-03 — Every remote-content trust decision is owned by security or runtime policy.
- [ ] HTML-CK-RISK-01-04 — Every Electron privilege decision is owned by its main, preload, IPC, or runtime boundary.
- [ ] HTML-CK-RISK-01-05 — Native form validation is not treated as server validation.
- [ ] HTML-CK-RISK-01-06 — Native form validation is not treated as authorization.
- [ ] HTML-CK-RISK-01-07 — HTML conformance is not treated as security evidence.

### HTML-SC-RISK-02 — Rule violation: wrong-source or emitted-output repair

A defect appears in generated output or beyond the authorized source boundary. The expected outcome returns to
the source, generator, or named owner; directly patching output or crossing authority is the failure.

#### Checklist

- [ ] HTML-CK-RISK-02-01 — Every content change stays within the authorized source boundary.
- [ ] HTML-CK-RISK-02-02 — Generated output is never the direct repair target.
- [ ] HTML-CK-RISK-02-03 — The responsible source, generator, or external owner is identified before repair.
- [ ] HTML-CK-RISK-02-04 — Missing repair authority produces an exact stop instead of an unauthorized change.

## Overall

### HTML-SC-OVERALL-01 — Normal case: narrow artifact acceptance

Final acceptance concerns one exact emitted artifact and a narrow set of supported claims. The expected outcome
aligns conformance, parsed meaning, semantic intent, declared-target behavior, owner decisions, and limitations;
any unresolved material gap keeps acceptance open.

#### Checklist

- [ ] HTML-CK-OVERALL-01-01 — The accepted emitted identity has no unresolved authoring-conformance failure.
- [ ] HTML-CK-OVERALL-01-02 — Final parsed-meaning results apply to the accepted emitted identity.
- [ ] HTML-CK-OVERALL-01-03 — Final semantic results apply to the accepted emitted identity.
- [ ] HTML-CK-OVERALL-01-04 — Final target observations apply to the accepted emitted identity.
- [ ] HTML-CK-OVERALL-01-05 — Every material cross-owner decision required for acceptance is resolved.
- [ ] HTML-CK-OVERALL-01-06 — Every unresolved limitation remains explicit.
- [ ] HTML-CK-OVERALL-01-07 — The completion claim is no broader than the combined accepted evidence.

### HTML-SC-OVERALL-02 — Adversarial: cosmetic evidence overclaim

Valid syntax, a clean validator result, a screenshot, a correct role, or one passing target can be presented as
proof of the whole outcome. The expected result rejects each proxy and preserves the correct claim ceiling;
cosmetic or partial compliance accepted as complete is the failure.

#### Checklist

- [ ] HTML-CK-OVERALL-02-01 — Validator silence is not treated as proof of semantic intent.
- [ ] HTML-CK-OVERALL-02-02 — Source inspection is not treated as proof of the parsed DOM.
- [ ] HTML-CK-OVERALL-02-03 — Visual rendering is not treated as proof of native behavior.
- [ ] HTML-CK-OVERALL-02-04 — Visual rendering is not treated as proof of accessibility.
- [ ] HTML-CK-OVERALL-02-05 — An ARIA role is not treated as proof of keyboard behavior.
- [ ] HTML-CK-OVERALL-02-06 — An ARIA role is not treated as proof of activation behavior.
- [ ] HTML-CK-OVERALL-02-07 — One target observation is not generalized to unobserved targets.
- [ ] HTML-CK-OVERALL-02-08 — HTML evidence alone is not treated as WCAG conformance.
- [ ] HTML-CK-OVERALL-02-09 — HTML evidence alone is not treated as security evidence.
- [ ] HTML-CK-OVERALL-02-10 — HTML evidence alone is not treated as product acceptance.
