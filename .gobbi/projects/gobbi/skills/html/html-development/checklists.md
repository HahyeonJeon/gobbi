# HTML Development Evaluation Checklist

This reusable unchecked source evaluates one HTML development change and its exact emitted document or
fragment. It is governed by the [`html`](../SKILL.md) domain, [`html-development`](SKILL.md) operation,
[`html-platform`](../html-platform/SKILL.md) manual, and
[`html-semantics`](../html-semantics/SKILL.md) preferences. The source commit that contains this file
identifies the checklist version. Its stable owner prefix is `HTML`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### HTML-SC-PROJECT-01 — Normal case: bounded artifact outcome

An ordinary change has one requested HTML outcome, an authorized source, an exact emitted artifact, declared
targets, and explicit owner boundaries. It fails this scenario when the artifact is unnamed, the target set is
assumed, or adjacent CSS, JavaScript, security, generator, or runtime work silently enters scope.

#### Checklist

- [ ] HTML-CK-PROJECT-01-01 — The requested HTML outcome, the authorized source boundary, and the owner of every triggered non-HTML concern are each explicit.
- [ ] HTML-CK-PROJECT-01-02 — The emitted document or fragment and every claimed target each have one exact, reproducible identity: emitted bytes or digest, and browser version or pinned Electron release.

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

- [ ] HTML-CK-STRUCTURE-01-01 — Every applicable WHATWG authoring requirement is satisfied: permitted element context, permitted element content, permitted attribute, conforming attribute value, applicable document-level constraint, and conforming serialized syntax.
- [ ] HTML-CK-STRUCTURE-01-02 — The parsed parent, child, and sibling order and the heading sequence match the intended content structure and hierarchy.
- [ ] HTML-CK-STRUCTURE-01-03 — Every table and form control preserves its intended relationship: table header-to-data association and control-to-form association.

### HTML-SC-STRUCTURE-02 — Edge case: parser recovery and fragment context

Recovery-sensitive tables, forms, formatting elements, templates, nested interaction, and generated fragments
can produce a DOM different from the apparent source. The expected outcome is an explicit context and parsed
tree; accepting browser recovery as conformance is the failure.

#### Checklist

- [ ] HTML-CK-STRUCTURE-02-01 — Every recovery-sensitive fragment or markup states its parsing context, its expected DOM structure, and every material source-to-DOM difference.
- [ ] HTML-CK-STRUCTURE-02-02 — Parser recovery is not treated as permission to keep nonconforming source.

## Performance

### HTML-SC-PERFORMANCE-01 — Poor quality: conforming but wasteful markup

A conforming artifact can still add needless resource discovery, duplicate requests, or repeated hidden
structure. The expected outcome is markup whose resource and tree cost serves the current result; a clean
validator report or one favorable score does not excuse avoidable work.

#### Checklist

- [ ] HTML-CK-PERFORMANCE-01-01 — Every resource-bearing element and every repeated or hidden subtree is required by the current outcome, content, behavior, or fallback.
- [ ] HTML-CK-PERFORMANCE-01-02 — Every resource hint and HTML resource declaration corresponds to exactly one intended request in a declared target.
- [ ] HTML-CK-PERFORMANCE-01-03 — Every HTML-attributed performance claim identifies the exact emitted artifact.
- [ ] HTML-CK-PERFORMANCE-01-04 — Every HTML-attributed performance claim stays within the observed target conditions.

## Aesthetics

### HTML-SC-AESTHETICS-01 — Poor quality: valid but unclear markup

The artifact is technically valid but difficult to understand or review because meaning depends on styling,
selector conventions, excessive wrappers, or redundant attributes. The expected outcome is plain, consistent
markup whose structure communicates its purpose.

#### Checklist

- [ ] HTML-CK-AESTHETICS-01-01 — Source order reflects the intended content and interaction order.
- [ ] HTML-CK-AESTHETICS-01-02 — Every element choice and wrapper serves a current structural or semantic purpose rather than styling or selector convenience.
- [ ] HTML-CK-AESTHETICS-01-03 — The same semantic purpose uses a consistent markup pattern.
- [ ] HTML-CK-AESTHETICS-01-04 — Redundant and conflicting semantic attributes are absent.

## Usage

### HTML-SC-USAGE-01 — Normal case: understandable native content and controls

An ordinary user-facing artifact should expose understandable content, navigation, input, feedback, and native
behavior without depending on presentation alone. It fails when a user-visible relationship is missing or an
element's meaning conflicts with the action it performs.

#### Checklist

- [ ] HTML-CK-USAGE-01-01 — Every element's use matches its meaning: a native element wherever its meaning and behavior fit, a link for navigation, and a button for an action.
- [ ] HTML-CK-USAGE-01-02 — Every applicable control and non-text item carries a purposeful text equivalent: an accessible name for a control and an alternative for a non-text item.
- [ ] HTML-CK-USAGE-01-03 — Every applicable visible label remains available after input begins.
- [ ] HTML-CK-USAGE-01-04 — Every applicable control group, instruction, and error has an explicit relationship to its subject.
- [ ] HTML-CK-USAGE-01-05 — Every applicable state is exposed by the relevant element.
- [ ] HTML-CK-USAGE-01-06 — Every native interactive element retains its expected keyboard and activation behavior.

### HTML-SC-USAGE-02 — Edge case: target, language, direction, and fallback variation

The artifact crosses browser or Electron targets, languages, text directions, or support levels. The expected
outcome preserves correct meaning and an essential path in every claimed target; one sample locale, direction,
or runtime cannot justify a universal claim.

#### Checklist

- [ ] HTML-CK-USAGE-02-01 — The document language, every material language change, and direction metadata are each identified accurately wherever language or direction is expressed or inferred.
- [ ] HTML-CK-USAGE-02-02 — Every declared target provides the required native path or an explicit fallback.
- [ ] HTML-CK-USAGE-02-03 — A support difference remains limited to the exact affected targets.
- Also applies: HTML-CK-OVERALL-02-02 (an unobserved target is not treated as supported).

### HTML-SC-USAGE-03 — Rule violation: ARIA contradicts its HTML element

Explicit ARIA roles, states, and properties are added to native HTML elements. The expected outcome keeps every
ARIA value permitted on its element and consistent with the element's native semantics; an ARIA value its
element does not allow, or that contradicts what the element already means, is the failure.

#### Checklist

- [ ] HTML-CK-USAGE-03-01 — Every explicit ARIA role, state, and property is permitted on its HTML element.
- [ ] HTML-CK-USAGE-03-02 — No explicit ARIA value conflicts with native semantics.

### HTML-SC-USAGE-04 — Adversarial: semantic counterfeit

A styled generic element or an added role presents itself as a native control without fulfilling the contract it
exposes. The expected outcome supplies the complete custom contract or uses the native element instead;
role-only or appearance-only compliance accepted as a working control is the failure.

#### Checklist

- [ ] HTML-CK-USAGE-04-01 — Every custom interactive element exposes its purposeful name, every applicable state, and the role matching its promised behavior.
- [ ] HTML-CK-USAGE-04-02 — Every custom interactive element implements its promised keyboard and activation behavior.

## Consistency

### HTML-SC-CONSISTENCY-01 — Normal case: one artifact across evidence layers

Direct or transformed source, emitted bytes, parsed DOM, target behavior, and the acceptance claim must refer
to one traceable artifact. The scenario fails when a result from one layer is silently attributed to another
artifact or interpreted as a broader kind of evidence.

#### Checklist

- [ ] HTML-CK-CONSISTENCY-01-01 — Every emitted artifact records its exact provenance: no transform for directly authored output, or the exact source or generator input, transform tool and version, and transform configuration for transformed output.
- [ ] HTML-CK-CONSISTENCY-01-02 — Conformance, DOM, semantic, and target observations bind to that emitted identity.
- [ ] HTML-CK-CONSISTENCY-01-03 — Every conformance observation identifies the checker, its exact version, and its configuration.
- [ ] HTML-CK-CONSISTENCY-01-04 — Each source, DOM, target, and product claim stays within its owning evidence layer.
- Also applies: HTML-CK-PROJECT-01-02 (one exact, reproducible emitted identity).

### HTML-SC-CONSISTENCY-02 — Expected failure: transformed output changes during repair

A repair changes source or generator behavior, making the prior emitted identity and downstream observations
stale. The expected outcome creates a new artifact identity and repeats affected checks; reusing old evidence
or patching emitted bytes is the failure.

#### Checklist

- [ ] HTML-CK-CONSISTENCY-02-01 — The repair changes the earliest authorized source or generator cause.
- [ ] HTML-CK-CONSISTENCY-02-02 — Regenerated output receives a new emitted identity.
- [ ] HTML-CK-CONSISTENCY-02-03 — Every evidence layer affected by the repair is re-evaluated.
- [ ] HTML-CK-CONSISTENCY-02-04 — The retained evidence and the completion record both refer to the accepted identity rather than the failed identity.

## Risk

### HTML-SC-RISK-01 — Normal case: trust and privilege decisions routed to their owners

An ordinary artifact carries untrusted data, dangerous sinks, remote content, navigation, or Electron privilege
across the HTML boundary. The expected outcome keeps emitted semantics with HTML and leaves each trust or
privilege decision with its named security or runtime owner; an unowned decision made inside the markup is the
failure.

#### Checklist

- [ ] HTML-CK-RISK-01-01 — Every untrusted-data, dangerous-sink, remote-content trust, and Electron privilege decision is owned by its named security mechanism, runtime policy, or Electron main, preload, or IPC boundary.
- Also applies: HTML-CK-PROJECT-01-01 (a named owner for every triggered non-HTML concern).

### HTML-SC-RISK-02 — Rule violation: wrong-source or emitted-output repair

A defect appears in generated output or beyond the authorized source boundary. The expected outcome returns to
the source, generator, or named owner; directly patching output or crossing authority is the failure.

#### Checklist

- [ ] HTML-CK-RISK-02-01 — Every content change stays within the authorized source boundary.
- [ ] HTML-CK-RISK-02-02 — Generated output is never the direct repair target.
- [ ] HTML-CK-RISK-02-03 — The responsible source, generator, or external owner is identified before repair.
- [ ] HTML-CK-RISK-02-04 — Missing repair authority produces an exact stop instead of an unauthorized change.

### HTML-SC-RISK-03 — Adversarial: markup presented as protection

A native markup feature or a clean HTML result can be presented as a security control, leaving an artifact that
appears protected with no owning mechanism. The expected outcome keeps every protection claim with its owning
mechanism; markup or validation offered as protection is the failure.

#### Checklist

- [ ] HTML-CK-RISK-03-01 — Native form validation is not treated as server validation or authorization.
- Also applies: HTML-CK-OVERALL-02-01 (HTML evidence is not proof of security).

## Overall

### HTML-SC-OVERALL-01 — Normal case: narrow artifact acceptance

Final acceptance concerns one exact emitted artifact and a narrow set of supported claims. The expected outcome
aligns conformance, parsed meaning, semantic intent, declared-target behavior, owner decisions, and limitations;
any unresolved material gap keeps acceptance open.

#### Checklist

- [ ] HTML-CK-OVERALL-01-01 — The accepted emitted identity has no unresolved authoring-conformance failure and no unresolved material cross-owner decision.
- [ ] HTML-CK-OVERALL-01-02 — Every unresolved limitation remains explicit.
- [ ] HTML-CK-OVERALL-01-03 — The completion claim is no broader than the combined accepted evidence.
- Also applies: HTML-CK-CONSISTENCY-01-02 (final observations bind to the accepted emitted identity).

### HTML-SC-OVERALL-02 — Adversarial: cosmetic evidence overclaim

Valid syntax, a clean validator result, a screenshot, a correct role, or one passing target can be presented as
proof of the whole outcome. The expected result rejects each proxy and preserves the correct claim ceiling;
cosmetic or partial compliance accepted as complete is the failure.

#### Checklist

- [ ] HTML-CK-OVERALL-02-01 — No observation is treated as proof of a property it does not establish: validator silence of semantic intent, source inspection of the parsed DOM, visual rendering of native behavior, visual rendering of accessibility, an ARIA role of keyboard behavior, an ARIA role of activation behavior, and HTML evidence alone of WCAG conformance, security, or product acceptance.
- [ ] HTML-CK-OVERALL-02-02 — One target observation is not generalized to unobserved targets.
