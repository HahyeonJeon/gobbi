# Electron Interface Evaluation Checklist

This reusable unchecked source evaluates one observable Electron design judgment under the local preference.
The source commit and every emitted checklist item use the stable prefix `ELECINTF`.

This file defines coverage only. The caller selects applicable rows, resolves cross-references, and owns any
evaluation result. Preserve every selected row's stable ID. A row is defined once; an “Also applies” note
reuses it without creating a duplicate item.

## Project

### ELECINTF-SC-PROJECT-01 — Normal case: evidence-grounded observable judgment

Use this scenario when the subject is a complete interface judgment with accepted authority and context. It
succeeds when every governing fact and evidence class is explicit; it fails when they are missing or conflated.

#### Checklist

- [ ] ELECINTF-CK-PROJECT-01-01 — The subject is one observable Electron application design judgment.
- [ ] ELECINTF-CK-PROJECT-01-02 — The judgment names each governing context member: affected actors, decision authority, and accepted outcome.
- [ ] ELECINTF-CK-PROJECT-01-03 — Current-product observation is present and limited to what the current application presents or teaches.
- [ ] ELECINTF-CK-PROJECT-01-04 — The judgment distinguishes every evidence class: current-product observation, representative-user evidence, accessibility evidence, official target guidance, cross-target task evidence, and accepted authority or requirements.

### ELECINTF-SC-PROJECT-02 — Rule violation: interface judgment claims another owner

Use this scenario when an interface decision reaches into mechanism, implementation, verification, or
delivery. It succeeds by keeping those owners external; it fails when observable judgment selects their policy.

#### Checklist

- [ ] ELECINTF-CK-PROJECT-02-01 — Every excluded concern stays outside the judgment: Electron API or mechanism selection; process, trust, bridge, IPC, state, window, view, resource, performance-placement, or isolation architecture; installed behavior or lifecycle promises; source implementation; test design, execution, interpretation, environment classification, or evidence acceptance; and delivery coordination.
- [ ] ELECINTF-CK-PROJECT-02-02 — Mechanism facts, technical constraints, and installed promises remain external inputs instead of selected interface policy.

## Structure

### ELECINTF-SC-STRUCTURE-01 — Normal case: complete observable structure

Use this scenario for the information, state, content, feedback, failure, and recovery design. It succeeds
when the accepted outcome stays perceptible throughout; it fails when any applicable part lacks presentation.

#### Checklist

- [ ] ELECINTF-CK-STRUCTURE-01-01 — The information structure supports the accepted outcome for the affected actors.
- [ ] ELECINTF-CK-STRUCTURE-01-02 — Every applicable visible state has an explicit presentation.
- [ ] ELECINTF-CK-STRUCTURE-01-03 — Every content decision states its intended observable meaning.
- [ ] ELECINTF-CK-STRUCTURE-01-04 — Every feedback decision states its intended observable message.
- [ ] ELECINTF-CK-STRUCTURE-01-05 — Every applicable failure has a perceptible presentation.
- [ ] ELECINTF-CK-STRUCTURE-01-06 — Every applicable recovery has a perceptible presentation.

### ELECINTF-SC-STRUCTURE-02 — Edge case: language and target adaptation

Use this scenario when language, region, writing direction, or target differences can alter the experience.
It succeeds through explicit adaptation; it fails when a claimed difference has no observable treatment.

#### Checklist

- [ ] ELECINTF-CK-STRUCTURE-02-01 — Every applicable language difference has an explicit adaptation.
- [ ] ELECINTF-CK-STRUCTURE-02-02 — Every applicable regional format or convention has an explicit adaptation.
- [ ] ELECINTF-CK-STRUCTURE-02-03 — Every applicable writing-direction difference has an explicit adaptation.
- [ ] ELECINTF-CK-STRUCTURE-02-04 — Every claimed target operating-system difference has an explicit adaptation.

## Performance

### ELECINTF-SC-PERFORMANCE-01 — Normal case: waiting and repeated updates remain usable

Use this scenario when the design includes delay, long-running work, or repeated feedback. It succeeds when
waiting remains understandable and usable; it fails when uncertainty or repeated updates overload attention.

#### Checklist

- [ ] ELECINTF-CK-PERFORMANCE-01-01 — Every accepted wait or long-running action has a visible pending state before uncertainty affects use.
- [ ] ELECINTF-CK-PERFORMANCE-01-02 — Repeated feedback stays within each accepted load limit: visual attention and assistive-announcement frequency.
- [ ] ELECINTF-CK-PERFORMANCE-01-03 — The design names the observable responsiveness perception that matters to the accepted outcome.

## Aesthetics

### ELECINTF-SC-AESTHETICS-01 — Poor quality: coherent style masks weak adaptation

Use this scenario when visual consistency appears polished but observable meaning or target adaptation is
weak. It succeeds by exposing that deficit; it fails when polish is accepted as proof of coherent use.

#### Checklist

- [ ] ELECINTF-CK-AESTHETICS-01-01 — Product identity remains recognizable across every applicable surface: windows, menus, tray, shortcuts, notifications, content, feedback, failure, and recovery.
- [ ] ELECINTF-CK-AESTHETICS-01-02 — Every expressive choice serves at least one observable meaning: hierarchy, state, consequence, affordance, or recovery.
- [ ] ELECINTF-CK-AESTHETICS-01-03 — Every target operating-system adaptation preserves the coherent product identity.
- [ ] ELECINTF-CK-AESTHETICS-01-04 — Any tension between product identity and familiarity is resolved from allowed evidence about the accepted outcome.

## Usage

### ELECINTF-SC-USAGE-01 — Normal case: material concepts remain open

Use this scenario while a consequential interface direction is still open. It succeeds when real alternatives
expose the tradeoff; it fails when one direction or cosmetic variants preselect the outcome.

#### Checklist

- [ ] ELECINTF-CK-USAGE-01-01 — At least two materially distinct concepts remain available while the material direction is open.
- [ ] ELECINTF-CK-USAGE-01-02 — The concepts differ in at least one consequential dimension: information structure, task flow, operating-system integration, feedback, recovery, accessibility, modality, language adaptation, or visual hierarchy.
- [ ] ELECINTF-CK-USAGE-01-03 — Every concept is compared against the same affected actors and accepted outcome.
- [ ] ELECINTF-CK-USAGE-01-04 — The selected concept states both selection grounds: the applicable evidence class and the accepted tradeoff.

### ELECINTF-SC-USAGE-02 — Normal case: modalities and operating-system surfaces

Use this scenario for required actions and every applicable operating-system surface. It succeeds when each
required modality and surface preserves the outcome; it fails when an affected actor loses an available path.

#### Checklist

- [ ] ELECINTF-CK-USAGE-02-01 — Every required action has an explicit keyboard path.
- [ ] ELECINTF-CK-USAGE-02-02 — Every required action has an explicit pointer path.
- [ ] ELECINTF-CK-USAGE-02-03 — Every required action has an explicit assistive-input path.
- [ ] ELECINTF-CK-USAGE-02-04 — Every applicable operating-system surface has an intended observable role: windows, menus, tray, shortcuts, notifications, and any other accepted target surface.
- [ ] ELECINTF-CK-USAGE-02-05 — Every modality alternative preserves both the accepted outcome and user authority.

### ELECINTF-SC-USAGE-03 — Normal case: familiar target convention is the default

Use this scenario when official guidance defines a familiar convention for the target operating system. It
succeeds by using the matched convention within product identity; it fails when familiarity is ignored.

#### Checklist

- [ ] ELECINTF-CK-USAGE-03-01 — The judgment identifies that a familiar target operating-system convention applies.
- [ ] ELECINTF-CK-USAGE-03-02 — The design uses the familiar convention within the coherent product identity.
- [ ] ELECINTF-CK-USAGE-03-03 — The cited official guidance matches the exact target operating system, version, or desktop environment.

### ELECINTF-SC-USAGE-04 — Expected failure: a departure may be justified

Use this scenario when the familiar convention would harm the accepted outcome. It succeeds only through an
allowed, concrete justification and compliant replacement; it fails when either part is absent.

#### Checklist

- [ ] ELECINTF-CK-USAGE-04-01 — The departure evidence class belongs to the allowed set: representative-user evidence, accessibility evidence, or cross-target task evidence.
- [ ] ELECINTF-CK-USAGE-04-02 — Concrete departure evidence exists.
- [ ] ELECINTF-CK-USAGE-04-03 — The harm to the accepted outcome is identified explicitly.
- [ ] ELECINTF-CK-USAGE-04-04 — The replacement interaction is explicit.
- [ ] ELECINTF-CK-USAGE-04-05 — The replacement complies with every controlling boundary: Rules, accepted contract, accessibility, security, and user authority.

### ELECINTF-SC-USAGE-05 — Adversarial: an unjustified or cosmetic departure

Use this scenario when a proposal rejects familiarity without allowed evidence of harm. It succeeds by
rejecting the unsupported departure; it fails when a cosmetic or convenience rationale is treated as proof.

#### Checklist

- [ ] ELECINTF-CK-USAGE-05-01 — A departure supported only by convenience, implementation cost, novelty, personal taste, or untested preference is rejected.

## Consistency

### ELECINTF-SC-CONSISTENCY-01 — Rule violation: a preference conflicts with authority

Use this scenario when a preferred convention or expression conflicts with a stronger boundary. It succeeds
when the stronger boundary controls; it fails when the preference overrides accepted authority.

#### Checklist

- [ ] ELECINTF-CK-CONSISTENCY-01-01 — A conflicting Rule overrides the familiar-convention preference.
- [ ] ELECINTF-CK-CONSISTENCY-01-02 — Every accepted boundary overrides a conflicting preference: contract, accessibility, security, and user authority.
- [ ] ELECINTF-CK-CONSISTENCY-01-03 — The observable judgment reconciles mechanism facts, technical constraints, and installed promises without claiming policy ownership.

## Risk

### ELECINTF-SC-RISK-01 — Adversarial: a harmful proxy appears successful

Use this scenario when a measure can improve while the intended user outcome worsens. It succeeds by
distinguishing that proxy from real success; it fails when the proxy alone supports the judgment.

#### Checklist

- [ ] ELECINTF-CK-RISK-01-01 — Every measure names its intended user-outcome interpretation.
- [ ] ELECINTF-CK-RISK-01-02 — Every measure names its harmful-proxy interpretation.
- [ ] ELECINTF-CK-RISK-01-03 — A proxy improvement cannot support the judgment while the accepted user outcome worsens.

### ELECINTF-SC-RISK-02 — Expected failure: accessibility or modality remains unresolved

Use this scenario before accepting a design with an unresolved barrier or missing path. It succeeds through
revision or rejection; it fails when the inaccessible or incomplete design is accepted.

#### Checklist

- [ ] ELECINTF-CK-RISK-02-01 — A design with an unresolved material accessibility barrier is revised or rejected.
- [ ] ELECINTF-CK-RISK-02-02 — A design missing a required input modality is revised or rejected.

- Also applies: ELECINTF-CK-USAGE-02-01 (explicit keyboard path).
- Also applies: ELECINTF-CK-USAGE-02-02 (explicit pointer path).
- Also applies: ELECINTF-CK-USAGE-02-03 (explicit assistive-input path).

## Overall

### ELECINTF-SC-OVERALL-01 — Edge case: evidence or requirements change after judgment

Use this scenario when new information can reopen a previously accepted interface direction. It succeeds
when the judgment, handoff, and reopen path stay explicit; it fails when changed facts cannot reach the decision.

#### Checklist

- [ ] ELECINTF-CK-OVERALL-01-01 — Every success question states an observable user outcome.
- [ ] ELECINTF-CK-OVERALL-01-02 — Every success question maps to an observable measure.
- [ ] ELECINTF-CK-OVERALL-01-03 — Every validation signal states the observable uncertainty it distinguishes.
- [ ] ELECINTF-CK-OVERALL-01-04 — Given facts accepted by the owning authority, the judgment explicitly accepts, revises, or rejects the design.
- [ ] ELECINTF-CK-OVERALL-01-05 — The handoff states every governing member: product identity, affected actors, decision authority, accepted outcome, evidence classes, and concepts considered.
- [ ] ELECINTF-CK-OVERALL-01-06 — The handoff states every observable continuation member: selected structure, visible states, content, feedback, failure, recovery, accessibility, modalities, language, region, writing direction, target adaptation, convention default or departure, success questions, measures, validation signals, judgment, unresolved constraints, reopen conditions, and earliest affected decision.

- Also applies: ELECINTF-CK-RISK-01-01 (intended outcome interpretation).
- Also applies: ELECINTF-CK-RISK-01-02 (harmful-proxy interpretation).
- Also applies: ELECINTF-CK-RISK-01-03 (proxy improvement cannot mask harm).
