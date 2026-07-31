# Web UI Evaluation Entry

Browser-interface frame for the active Gobbi evaluation and the executor's pre-handoff self-review. Load
[`../evaluation.md`](../evaluation.md) and generic [`../../ui/evaluation.md`](../../ui/evaluation.md) first.
This frame grades production browser realization of the accepted interface; generic UI retains design
acceptance. It adds no evaluation phase or output and no policy beyond [`SKILL.md`](SKILL.md).

Framework evaluation remains independently owned by the applicable framework skill.

## Phase 1 extension — Read and bind the target

Read the active phase objective/diff/evidence, the parent feature contract, accepted generic UI specification
and evidence, all five files in this child, project browser/accessibility commitments, and applicable language/
framework frames. Build an accepted-clause → production surface → state → evidence trace. Missing required
generic UI evidence stays `NEEDS_CONTEXT`; it is not repaired by implementation quality.

## Rule-to-coverage crosswalk

| Rules | Scenario families | Checks |
|---|---|---|
| WEB-UI-R01 | `WEB-UI-FAMILY-01`, `-02`, `-09` | `WEB-UI-CHECK-01` |
| WEB-UI-R02 | `WEB-UI-FAMILY-01`, `-04`, `-09` | `WEB-UI-CHECK-02` |
| WEB-UI-R03 | `WEB-UI-FAMILY-02`, `-04`, `-06`, `-07` | `WEB-UI-CHECK-03` |
| WEB-UI-R04 | `WEB-UI-FAMILY-03`, `-05` | `WEB-UI-CHECK-04`, `WEB-UI-CHECK-09` |
| WEB-UI-R05 | `WEB-UI-FAMILY-01`, `-03` | `WEB-UI-CHECK-04`, `WEB-UI-CHECK-05` |
| WEB-UI-R06 | `WEB-UI-FAMILY-03`, `-06`, `-09` | `WEB-UI-CHECK-05`, `WEB-UI-CHECK-07` |
| WEB-UI-R07 | `WEB-UI-FAMILY-04` | `WEB-UI-CHECK-06` |
| WEB-UI-R08 | `WEB-UI-FAMILY-02`, `-03`, `-04`, `-06` | `WEB-UI-CHECK-07` |
| WEB-UI-R09 | `WEB-UI-FAMILY-07`, `-09` | `WEB-UI-CHECK-08` |
| WEB-UI-R10 | `WEB-UI-FAMILY-05`, `-07`, `-08` | `WEB-UI-CHECK-09`, `WEB-UI-CHECK-10` |
| WEB-UI-R11 | `WEB-UI-FAMILY-01`, `-05`, `-07`, `-08` | `WEB-UI-CHECK-11` |
| WEB-UI-R12 | `WEB-UI-FAMILY-07`, `-09` | `WEB-UI-CHECK-12` |

## Selecting cases and checks

1. Map the changed interface to accepted clauses, semantic regions/controls, activated states, forms,
   modalities/focus, overlays/async work, variation matrix, browser lifecycle, framework integration, and
   production surfaces.
2. Select every applicable `WEB-UI-SCENARIO-*` and its explicit case-level `Obligation`, including each family
   Good case plus distinct triggered
   accessibility, locale/content, failure/recovery, lifecycle/change, and adversarial evidence cases. Give an
   inspected reason for each plausible inapplicable trigger.
3. Treat each case-level `Trace` as the authoritative case-to-check relation. Before selection, prove exact set
   equality among `Trace`, checklist `Seeds`, the check-level source ledger, the guaranteed-coverage map, and
   the check-to-obligation reverse audit. A forward-only, reverse-only, grouped, or inferred edge is a finding.
   Then select every named operational `WEB-UI-CHECK-*` plus any directly applicable source item. For every
   retained edge, confirm the source item's actual PASS condition and named evidence—not reverse-audit prose—
   preserve the full case-level `Obligation`. Preserve its ID, criticality, claim, applicability, pass
   condition, evidence, on-fail route, and source wording. Keep generic UI and root web items independently active.
4. Copy each selection under `## Prepared Baseline Additions` as an evaluator-owned coverage row. Set its
   use-style to
   `do-confirm`; retain the operational pause-point ID only as trace metadata because evaluation copies have no
   operational pause points.
5. Resolve every evaluation copy with exactly `PASS`, `FAIL:<finding-id>`, or `n/a:<property>` and named
   inspected evidence. Operational-only `recorded-open` and `waived/exception-authorized` terminals are invalid
   in the evaluation copy and never become `PASS`; an applicable unmet obligation opens a finding and resolves
   `FAIL:<finding-id>`. Do not accept screenshots, automated scans, component-library claims, or final DOM state
   as substitutes for live or hidden properties they cannot observe.
6. Walk all seven perspectives and Overall. Findings cite the child rule, scenario/check, exact state/matrix
   cell, reproducible evidence, user impact, correction, and owner-correct verification.

### Relation and obligation verification

Compare normalized edge sets in all five projections bidirectionally and fail on any symmetric difference.
Then enumerate every named primitive in each selected case `Obligation` and require every mapped item's actual
PASS and evidence wording to own it. In particular, a modality predicate cannot inherit locale, content,
zoom/text-enlargement, reflow, or narrow-viewport obligations from a matrix table: those primitives must be in
the item itself. Prove the method with disposable forward-only, reverse-only, and PASS/evidence-primitive-loss
fixtures; counts, matching IDs, and audit prose alone are insufficient.

## Perspectives

### Project

**Lens:** Does production realization preserve the accepted generic UI specification, project interface and
browser commitments, current conventions, feature boundary, and framework-owner split?

**Activate:** `WEB-UI-FAMILY-01`, `-05`, `-07`, `-09`; checks `01`, `08`–`12`.

**Watch for:** implicit redesign, a project-browser promise silently dropped, component-library adoption posed
as acceptance, or React/API policy invented in this child.

### Structure

**Lens:** Does one meaningful semantic document connect source order, headings/landmarks, native controls,
names/relationships/status, complete states, forms, overlays, route entries, and rendering lifecycles?

**Activate:** `WEB-UI-FAMILY-01`, `-02`, `-04`, `-06`, `-07`; checks `02`, `03`, `06`–`08`.

**Watch for:** styled generic controls, visual-only grouping, state encoded only by CSS, detached errors,
duplicated DOM/listeners, or overlay ownership spread across unrelated components.

### Performance

**Lens:** Does the interface remain responsive and truthful during loading, progressive/partial rendering,
long work, animation, hydration, and constrained devices/networks without unmeasured optimization weakening
semantics or recovery?

**Activate:** `WEB-UI-FAMILY-02`, `-06`, `-07`; checks `03`, `07`, `08`, `10`.

**Watch for:** blocking input without progress/cancel, skeletons causing destructive movement, duplicate
initialization, expensive decorative effects under reduced-motion/data preference, or final speed hiding false
state.

### Aesthetics

**Lens:** Does the rendered feature preserve the accepted hierarchy, density, alignment, typography, color,
content, feedback, state distinction, responsive composition, and project visual language across selected
states and variations?

**Activate:** `WEB-UI-FAMILY-02`, `-05`, `-06`, `-08`; checks `01`, `03`, `07`, `09`–`11`.

**Watch for:** a pristine happy-state capture while error/locale/dark/zoom states break, color-only meaning,
truncation of required content, weak focus, or screenshot taste overriding accepted design evidence.

### Usage

**Lens:** Can applicable people discover, operate, understand, correct, complete, cancel, and recover through
keyboard, pointer, touch, sequential navigation, and assistive technology with useful focus and status?

**Activate:** `WEB-UI-FAMILY-02`–`-06`; checks `03`–`07`, `09`.

**Watch for:** hover/gesture-only action, hidden format, error with no field route, lost input, focus leak,
transient-only critical feedback, or a disabled pending action with no exit.

### Consistency

**Lens:** Do accepted clauses, visible/programmatic states, parent server truth, semantics, focus, responsive
rules, route/lifecycle behavior, tests, docs, and diagnostics agree across all selected matrix cells?

**Activate:** all families; checks `01`–`12`.

**Watch for:** success in UI but failure on server, desktop/mobile state divergence, pre/post-hydration meaning
change, old/new component conventions mixed, or tests/captures that exercise a different state than claimed.

### Risk

Write this seventh perspective to `risk.md`.

**Lens:** Does the interface control security and non-security blast radius: sensitive values and authority,
trusted browser/form semantics, permission/consent/irreversible actions, session and server rejection, duplicate
or deceptive interaction, state/data integrity, resource runaway from rendering or repeated work, third-party
component failure, partial release state, and rollback/reversibility of interface and lifecycle changes?

**Activate:** `WEB-UI-FAMILY-02`, `-04`, `-06`, `-07`, `-09`; checks `03`, `06`–`08`, `10`–`12`.

**Watch for:** secrets in DOM/messages/captures, autocomplete mistakes on sensitive fields, clickjacking-like
overlays, ambiguous destructive confirmation, client validation treated as trust, disabled controls treated as
server authorization, retry/render loops, unrecoverable local work, provider/library failure, or a partial
rollout whose old and new interface states cannot be safely reversed.

## Verification matrix

| Claim | Minimum owner evidence |
|---|---|
| Accepted design preserved | clause-to-output trace plus generic UI acceptance record |
| Semantic structure | source/DOM and accessibility-tree inspection in activated states |
| Input and focus | live keyboard plus selected pointer/touch/AT operation and active-element trace |
| Form transaction | valid/invalid/server-rejected/duplicate paths with DOM, focus, retention, server truth |
| Responsive/adaptive behavior | live selected matrix with resize/zoom/text/content/locale/preferences and operation |
| Overlay/async behavior | transition operation with focus, inactive background, status, cancellation/late result |
| Browser lifecycle | direct/nav/refresh/history/restore/render/hydration cases selected by project behavior |
| Captured appearance | vision inspection of named frame, viewport, theme, state, content, and reference |
| Design acceptance | generic UI direct representative-user evidence only |

Recommended tools may include project-native format/lint/type/tests/build, browser automation, browser devtools,
accessibility-tree inspection, automated accessibility checks as a supplement, keyboard/manual interaction,
viewport and preference emulation, assistive technology selected by risk, and rendered captures. Record exact
environment/version, action/command, fresh result, artifact pointer, and limitation.

## Screenshot and automation boundary

A screenshot may prove visible pixels, hierarchy, clipping, overlap, contrast as measured from those pixels,
and visible state only for its captured conditions. It does not prove semantic element choice, accessible
name/role/value, keyboard route, focus order/restoration, live announcement, target operation, responsive
behavior beyond that frame, DOM validity, browser lifecycle, or WCAG conformance. A DOM/accessibility snapshot
does not prove visual quality or operated behavior. An automated scan reports only its rules and state.

If visual evidence conflicts with source, DOM, operated behavior, or accepted user evidence, record the
conflict and resolve the claim at its owner. Do not average incompatible signals.

## Overall and handoff

Apply the generic evaluation verdict rules. Browser-interface realization cannot pass while an applicable
child check fails, a selected matrix cell is unexecuted without a justified limitation, semantic/keyboard/
focus behavior is broken, accepted clauses are untraced, or generic UI reports `NEEDS_CONTEXT` or rejection.
Coverage closure alone is not acceptance.

Report strengths to preserve, findings by rule/scenario/check and matrix cell, verification limitations,
framework-owner issues, child implementation status, and generic UI acceptance status separately. Return the
result to the parent web evaluation; this child never declares whole-feature release readiness.
