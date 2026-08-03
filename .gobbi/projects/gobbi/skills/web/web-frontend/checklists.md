# Web Frontend Evaluation Checklist

This reusable unchecked source evaluates one browser-facing outcome produced under this operation, against the
evidence-threshold, complete-specification, owner-routing, operable-semantics, real-path, and accurate-claim
obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and [`web-frontend`](SKILL.md)
operation, with [`web-design`](../web-design/SKILL.md) owning the identity, evidence, concept, and
visual-design judgments this operation applies, [`web-interaction`](../web-interaction/SKILL.md) owning the
interaction choice space it selects from, [`web-development`](../web-development/SKILL.md) as the caller that binds
the outcome, and the HTML and CSS owners holding element meaning and presentation. The source commit that
contains this file identifies the checklist version. Its stable owner prefix is `WEBFRNT`.

The evidence Rule this source checks is a risk threshold, not an unconditional gate. Rows below test the
threshold as `SKILL.md` states it: the current product and available user evidence are studied for every
design, and an external reference or new representative-user evidence is required only for a material choice
that matches one of the Rule's named triggers.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBFRNT-SC-PROJECT-01 — Normal case: the frontend outcome is bound and its owners routed

A browser-facing outcome is taken from a caller and worked. The expected outcome starts from that bound
outcome and routes every judgment it does not own, while keeping accessibility inside frontend behavior; a
frontend that decides identity, element meaning, or threat analysis for itself is the failure.

#### Checklist

- [ ] WEBFRNT-CK-PROJECT-01-01 — Work starts from the scoped change outcome, the current product, the governing records, and the available user evidence.
- [ ] WEBFRNT-CK-PROJECT-01-02 — Every question outside observable frontend behavior is routed to its owner: identity, evidence, concept, and visual-design judgments to `web-design`, interaction choices to `web-interaction`, element meaning to the HTML owners, presentation to the CSS owners, repository placement to `web-project-structure`, suite mechanics to `web-testing`, security analysis to `web-security`, and platform facts to `web-platform`.
- [ ] WEBFRNT-CK-PROJECT-01-03 — An unresolved conflict is returned to `web-development`, the requesting caller, or the user rather than decided here.
- [ ] WEBFRNT-CK-PROJECT-01-04 — Accessibility is kept inside frontend behavior rather than routed away as a separate concern.

## Structure

### WEBFRNT-SC-STRUCTURE-01 — Normal case: the journey is specified top-down before presentation

A browser outcome needs its whole path settled before any browser interface is designed in detail. The expected outcome
maps the journey, the state set, and the transitions first; presentation chosen while a state or a recovery
route is still open is the failure.

#### Checklist

- [ ] WEBFRNT-CK-STRUCTURE-01-01 — The complete trigger-to-completion journey, information and action hierarchy, document regions, navigation and URLs, history and refresh behavior, backend truth, trust decisions, support, and recovery are mapped before detailed presentation is chosen.
- [ ] WEBFRNT-CK-STRUCTURE-01-02 — Every applicable normal, waiting, empty, partial, stale, degraded, invalid, unauthorized, interrupted, failed, retried, duplicated, cancelled, recovered, completed, and false-completion state is defined with its transition and its confirmed completion evidence.
- [ ] WEBFRNT-CK-STRUCTURE-01-03 — User-visible status, preserved input, safe recovery, and trust information are stated for every applicable transition.

### WEBFRNT-SC-STRUCTURE-02 — Normal case: units are specified bottom-up and connected

The accepted skeleton is filled in one unit at a time. The expected outcome specifies each unit completely and
connects it into a working shortest path before adding the next; a set of units that never joins into a path
is the failure.

#### Checklist

- [ ] WEBFRNT-CK-STRUCTURE-02-01 — Each specified unit names its purpose, preconditions, inputs, outputs, semantics, accessible name, focus, feedback, error, recovery, responsive and localized behavior, trust impact, and evidence.
- [ ] WEBFRNT-CK-STRUCTURE-02-02 — The shortest normal path plus an applicable failure and recovery route is complete before further units are added.
- [ ] WEBFRNT-CK-STRUCTURE-02-03 — The specification is revised before production code.
- [ ] WEBFRNT-CK-STRUCTURE-02-04 — Production code begins only when the whole design is accepted.

### WEBFRNT-SC-STRUCTURE-03 — Poor quality: breadth is added over an incomplete scaffold

Behavior and presentation are built while document regions, focus targets, or state boundaries are still missing.
The expected outcome materializes and verifies the whole scaffold first; polish over a structure that cannot
carry the specified paths is the failure.

#### Checklist

- [ ] WEBFRNT-CK-STRUCTURE-03-01 — Routes, semantic document regions, component boundaries, state and data boundaries, focus targets, responsive structure, representative state placeholders, and test boundaries are materialized before detailed behavior or presentation.
- [ ] WEBFRNT-CK-STRUCTURE-03-02 — Every simulated data source or dependency carries an explicit label.
- [ ] WEBFRNT-CK-STRUCTURE-03-03 — The scaffold's document and accessibility-tree structure is verified against the specification before detailed behavior or presentation.
- [ ] WEBFRNT-CK-STRUCTURE-03-04 — A missing clause, structural boundary, state owner, or simulation boundary is repaired before the scaffold is extended.

## Performance

### WEBFRNT-SC-PERFORMANCE-01 — Expected failure: a server response is slow or interrupted

A request takes long enough that the person waits, retries, cancels, or leaves. The expected outcome gives
each of those states a distinct visible status and prevents the requested action from being applied twice; a
second application caused by an unclear wait is the failure.

#### Checklist

- [ ] WEBFRNT-CK-PERFORMANCE-01-01 — The waiting, pending, interrupted, cancelled, retried, and late-result states each present a distinct user-visible status.
- [ ] WEBFRNT-CK-PERFORMANCE-01-02 — A duplicate submission caused by a slow response neither applies the requested action twice nor loses entered state.
- [ ] WEBFRNT-CK-PERFORMANCE-01-03 — Entered data survives an interruption and a retry in the implemented path, not only in the specification.

## Aesthetics

### WEBFRNT-SC-AESTHETICS-01 — Normal case: hierarchy and state are legible in the rendered result

The specification's hierarchy has to survive into the rendered result. The expected outcome makes hierarchy and
each lifecycle state readable to sighted and non-sighted users alike; a UI where pending and disabled look
the same, or where state is carried by color alone, is the failure.

#### Checklist

- [ ] WEBFRNT-CK-AESTHETICS-01-01 — The information and action hierarchy the specification defines is legible in the rendered result.
- [ ] WEBFRNT-CK-AESTHETICS-01-02 — Disabled, pending, cancelled, failed, recovered, and completed states are distinguishable for sighted and non-sighted users alike.

## Usage

### WEBFRNT-SC-USAGE-01 — Normal case: the interface is operable without guessing

A person operates the browser interface by keyboard, pointer, touch, or assistive technology. The expected outcome
exposes accurate semantics and specified focus, form, overlay, and reflow behavior, verified live; behavior
inferred from a rendering rather than inspected is the failure.

#### Checklist

- [ ] WEBFRNT-CK-USAGE-01-01 — Native elements are preferred.
- [ ] WEBFRNT-CK-USAGE-01-02 — Each control exposes an accurate name, role, state, and structure.
- [ ] WEBFRNT-CK-USAGE-01-03 — Keyboard behavior, focus movement, form guidance, error association, overlay behavior, responsive reflow, and motion alternatives are specified.
- [ ] WEBFRNT-CK-USAGE-01-04 — Keyboard behavior, focus movement, form guidance, error association, overlay behavior, responsive reflow, and motion alternatives are implemented.
- [ ] WEBFRNT-CK-USAGE-01-05 — Live keyboard, pointer, touch, and applicable assistive-technology interaction is inspected in a real browser rather than inferred.

### WEBFRNT-SC-USAGE-02 — Expected failure: a person must recover from a failed or unauthorized path

An action is rejected, fails, or completes only in appearance. The expected outcome shows accurate status,
consequence, and a recovery route where the person needs it; trust information delivered after the decision is
the failure.

#### Checklist

- [ ] WEBFRNT-CK-USAGE-02-01 — The failed, unauthorized, and false-completion states each present accurate status, consequence, and a recovery route at the point the person needs it.
- [ ] WEBFRNT-CK-USAGE-02-02 — Status, consequences, data use, cost, reversibility, and recovery information are available before the person acts rather than after.

### WEBFRNT-SC-USAGE-03 — Edge case: the browser interface meets a different viewport, locale, or input method

The same outcome is reached on a narrow viewport, in another locale, or by a different input method. The
expected outcome covers each as its own complete slice; adaptation assumed from the default case is the
failure.

#### Checklist

- [ ] WEBFRNT-CK-USAGE-03-01 — Responsive reflow, localized content, and each supported input method are each covered by one complete slice rather than assumed from the default case.

## Consistency

### WEBFRNT-SC-CONSISTENCY-01 — Normal case: specification and implementation agree at handoff

Implementation has moved since the specification was accepted. The expected outcome brings the project-native
specification back into agreement and returns drift to its earliest owning Step; a handoff whose specification
describes a browser interface that no longer exists is the failure.

#### Checklist

- [ ] WEBFRNT-CK-CONSISTENCY-01-01 — The project-native specification is brought into agreement with the implementation before the handoff.
- [ ] WEBFRNT-CK-CONSISTENCY-01-02 — Each claim is matched to its owning specification clause and its evidence.
- [ ] WEBFRNT-CK-CONSISTENCY-01-03 — Specification drift, implementation failure, unsupported reference use, or an unproven claim is returned to the earliest owning Step.
- [ ] WEBFRNT-CK-CONSISTENCY-01-04 — Preserved conventions and deliberate departures are recorded in the active project's design material.

### WEBFRNT-SC-CONSISTENCY-02 — Rule violation: evidence classes are merged into one claim

The frontend is reported as done. The expected outcome states separately what was specified, implemented,
technically verified, evidenced with representative users, and observed after release; one claim covering all
of them is the failure.

#### Checklist

- [ ] WEBFRNT-CK-CONSISTENCY-02-01 — What was specified, implemented, technically verified, evidenced with representative users, and observed after release are stated separately.
- [ ] WEBFRNT-CK-CONSISTENCY-02-02 — Release and live-outcome claims are withheld until their evidence exists.

## Risk

### WEBFRNT-SC-RISK-01 — Normal case: the evidence threshold matches what the choice risks

A set of design choices is being committed, and the Rule requires new evidence for some of them and not for
others. The expected outcome studies the current product for every design, obtains an external reference or
new representative-user evidence for each choice matching a named trigger, and lets a choice matching no
trigger proceed on the studied evidence; both a triggered choice committed without new evidence and an
evidence demand the Rule does not make are failures.

#### Checklist

- [ ] WEBFRNT-CK-RISK-01-01 — The current product and the available user evidence are studied before any design is committed.
- [ ] WEBFRNT-CK-RISK-01-02 — Every material choice that is novel, uncertain, exclusionary, consequential, security- or compatibility-sensitive, hard to reverse, or carries material risk of harm is committed only after an external reference or new representative-user evidence.
- [ ] WEBFRNT-CK-RISK-01-03 — A material choice matching none of those triggers is committed on the studied current product and available evidence, without an external reference or new representative-user evidence being required of it.
- [ ] WEBFRNT-CK-RISK-01-04 — Each material question that current evidence does not safely resolve is named.
- [ ] WEBFRNT-CK-RISK-01-05 — The risk-proportional direct-user evidence threshold is set against each named question.

### WEBFRNT-SC-RISK-02 — Rule violation: a source is used without being verified

A standard, a design-system page, or an exemplar is cited to settle a specification clause. The expected
outcome verifies the source and places its conclusion beside that clause; a citation used for authority
without checking its version, applicability, or limits is the failure.

#### Checklist

- [ ] WEBFRNT-CK-RISK-02-01 — Each source's owner, version or date, relevance, applicability, context, conflict, and limits are verified before use.
- [ ] WEBFRNT-CK-RISK-02-02 — Each accepted conclusion and its citation sit beside the specification clause they shape.
- [ ] WEBFRNT-CK-RISK-02-03 — Missing consequential evidence is returned through project authority rather than substituted.

### WEBFRNT-SC-RISK-03 — Rule violation: direct evidence is collected without its protocol

Representative-user evidence is gathered for a triggered choice. The expected outcome defines the
participants, tasks, consent, and welfare terms before collection and re-runs the evidence when an assumption
changes; sessions run without that protocol are the failure.

#### Checklist

- [ ] WEBFRNT-CK-RISK-03-01 — Direct-user evidence defines representative characteristics, realistic tasks, consent, privacy, accessibility, accommodations, withdrawal, welfare, stop conditions, and the decision rule before it is collected.
- [ ] WEBFRNT-CK-RISK-03-02 — Required representative-user evidence is re-run when implementation changes a material accepted assumption.

### WEBFRNT-SC-RISK-04 — Adversarial: a polished UI is passed off as proof

A screenshot, a mock, or a finished-looking placeholder is offered as evidence that the path works. The
expected outcome requires one real browser path to a result from its named source of truth and refuses proxies; appearance accepted in
place of integration, semantics, focus, or recovery is the failure.

#### Checklist

- [ ] WEBFRNT-CK-RISK-04-01 — One real browser path to a result from its named source of truth is proven before breadth.
- [ ] WEBFRNT-CK-RISK-04-02 — No mock, screenshot, static capture, or polished placeholder is treated as proof of integration, semantics, focus, hidden behavior, responsiveness, interaction, recovery, or conformance.
- [ ] WEBFRNT-CK-RISK-04-03 — User intent is not inferred from analytics in place of representative-user evidence.
- [ ] WEBFRNT-CK-RISK-04-04 — No visual polish conceals an unimplemented state, an inaccessible behavior, or a missing recovery route.

## Overall

### WEBFRNT-SC-OVERALL-01 — Normal case: one continuous journey handed off with its evidence

A complete frontend outcome stays coherent from entry through interruption to completion and hands off the
decisions, states, accessibility behavior, and evidence limits behind it. The scenario fails when the journey
breaks at a browser or session boundary, or when the handoff omits what the next owner needs.

#### Checklist

- [ ] WEBFRNT-CK-OVERALL-01-01 — Entry, action, waiting, interruption, recovery, and completion stay coherent across browser and session boundaries.
- [ ] WEBFRNT-CK-OVERALL-01-02 — The handoff carries the accepted `web-design` identity and concept decisions, the complete paths and states, accessibility and responsive behavior, material reference decisions, user-evidence limits, degradations, verification evidence, outcome signals, and the support route.
- Also applies: WEBFRNT-CK-RISK-01-03 (a choice matching no trigger needs no new evidence).
