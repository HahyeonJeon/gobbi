---
name: css
description: "MUST load before writing or reviewing CSS. Defines cascade, rendering, resilience, compatibility, performance, ownership boundaries, and verification for browser and Electron renderer styles."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# CSS

## Introduction

Use this operation to author or review CSS consumed by browsers or Electron
renderers. Load [`coding`](../coding/SKILL.md) for general construction
discipline. HTML, UI, UX, web, and any sibling language skill are not
prerequisites.

CSS owns syntax, cascade, selectors, values, layout, responsive/international
rendering, typography, color, states, motion, compatibility, measured
performance, and CSSOM/computed/layout/rendered evidence. It does not own
document semantics, product visual direction, JavaScript state machines,
preprocessor/framework syntax, security policy, or Electron main/preload/IPC,
privilege, native integration, permissions, packaging, and release policy.

## Principles

1. Design cascade ownership before declarations accumulate.
2. Prefer resilient, content-driven rendering over sample-bound geometry.
3. Separate specification maturity from deployment evidence.
4. Measure performance in representative conditions; never optimize by slogan.
5. Judge exact emitted CSS through CSSOM, computed, layout, and rendered
   observations.
6. Repair generated CSS at its owning source and preserve runtime/security
   boundaries.

## Rules

### CSS-1 — Classify every material feature on two axes

Specification maturity:

| Class | Meaning |
|---|---|
| `S1 Stable/current` | Stable current CSS with no material unresolved behavior for this use. |
| `S2 Implementable/evolving` | Usable implementation exists but specification/interoperation materially evolves. |
| `S3 Experimental/unstable` | Flagged, incomplete, inconsistent, or materially unresolved. |
| `S4 Proprietary/obsolete/nonconforming` | Vendor-only, obsolete, or nonconforming authoring. |

Apply deployment in first-match order:

1. `D4 Exact-target-only` if the complete target is exactly one pinned
   engine/runtime, fully supports the feature, and makes no multi-engine claim.
2. Otherwise `D3 Limited` if any declared target lacks support or materially
   differs.
3. Otherwise `D2 Newly available` if all targets are consistent and project
   evidence calls deployment newly available.
4. Otherwise `D1 Established` if all targets are consistent and project
   evidence calls deployment established.
5. Otherwise `UNDETERMINED`.

Specification status does not prove deployment. `@supports` or compatibility
data does not prove semantics, accessibility, performance, or acceptance.
Anything outside the established target floor requires fallback/progressive
enhancement, exact-target tests, and a reopen/removal condition. “Modern” is
not a maturity class.

### CSS-2 — Design the cascade and resilient rendering deliberately

Account for origins, importance, encapsulation context, layers, specificity,
scope proximity, and order before adding overrides. Use inheritance and custom
properties as deliberate interfaces with named ownership and fallback.

Choose selectors from semantic/stable hooks and understand invalidation and
matching cost without folklore. Build from normal flow and intrinsic sizing;
choose flex, grid, positioning, containment, overflow, fragmentation, and
container/viewport responsiveness from the actual constraint.

Preserve visible focus, state beyond color, contrast, themes and forced colors,
zoom/reflow/text growth, locale expansion, direction and writing modes,
font-loading failure, and reduced nonessential motion. The project owns its
formal accessibility target, assistive-technology matrix, and visual/product
acceptance. CSS evidence cannot prove those outcomes alone.

### CSS-3 — Preserve source, trust, generator, and runtime boundaries

Route untrusted style values, URLs, inline-style policy, CSP, and dangerous
style sinks to security. Route Sass/Less/PostCSS/CSS-in-JS/framework transforms
to their generator owner. CSS owns the emitted CSS behavior.

For transformed CSS retain:

1. exact source identity;
2. exact transform tool/version/configuration/flags/plugins/order;
3. exact emitted bytes or digest; and
4. CSS Object Model, computed-style, layout, or rendered observation bound to
   those bytes.

Direct source records no transform. Fix a generated defect at source,
generator/configuration, or security owner; regenerate, rebind all four links,
and retest. Never patch emitted bytes.

Browser and Electron renderer CSS use this same contract. Electron process,
privilege, native, packaging, and release policy routes outward.

### CSS-4 — Verify observable behavior and measure performance

Parsing/lint success is only static evidence. Inspect CSSOM, computed values,
layout geometry, overflow, hit/focus visibility, modes, target engines, and
rendered comparisons as applicable. Bind observations to exact accepted bytes.

Performance changes require a measured problem, hypothesis, representative
fixture, before/after metric, behavior guard, and removal criterion. Never
prescribe containment, `content-visibility`, `will-change`, selector rewrites,
or resource hints as universally faster.

Static source/topology checks do not prove skill discovery, selection, loading,
use, runtime results, accessibility conformance, or product acceptance.

## Procedure

### 1. Frame the run

- **Input/precondition:** requested rendering outcome and candidate source.
- **Action:** identify actor, exact source/emitted CSS, transforms, scopes,
  targets, modes, accessibility target, performance budget, and owner seams.
- **Produce:** a run frame with known, missing, and out-of-scope inputs.
- **Branch:** continue when material inputs exist; request missing context when
  they do not; stop and route scope or owner conflicts to the manager.

### 2. Select detail and define the output

- **Input:** complete run frame.
- **Action:** select the smallest direct detail reference and define the
  operation output: accepted emitted CSS plus its target-bound evidence record.
- **Produce:** child route, output identity, and non-goals.
- **Branch:** continue on one-hop ownership; stop rather than inventing a child
  or shared owner; route HTML/UI/UX/web/Electron-process work outward.

### 3. Classify material features

- **Input:** output contract and declared targets.
- **Action:** apply S1–S4 and first-match D4/D3/D2/D1 independently; record
  primary specification, dated target proof, fallback, tests, and reopen rule.
- **Produce:** feature ledger.
- **Branch:** adopt only supported entries; use progressive enhancement for a
  bounded gap; mark missing support evidence `UNDETERMINED` and obtain context;
  stop on a standards contradiction.

### 4. Design cascade and rendering skeleton

- **Input:** accepted feature ledger and source/document scope.
- **Action:** map origins, layers, interfaces, selectors, inheritance, normal
  flow, intrinsic sizing, modes, states, typography, color, and motion.
- **Produce:** minimal cascade/layout skeleton and design-gate checklist run.
- **Branch:** continue when the design gate closes; repair CSS-owned failures;
  route document semantics, state machines, or product direction outward.

### 5. Grow one observable slice

- **Input:** closed design gate and minimal skeleton.
- **Action:** add one coherent slice, then exercise cascade winners, content
  extremes, containers/viewports, locale/direction, states, preferences, and
  fallback before adding another.
- **Produce:** working emitted candidate and incremental observation log.
- **Branch:** repeat on success; repair the smallest CSS source on failure;
  request missing representative fixtures instead of extrapolating.

### 6. Bind source, transform, trust, and runtime

- **Input:** candidate output and owner map.
- **Action:** record no-transform or all four transformation links; obtain
  security/generator decisions for untrusted values and Electron/runtime seams.
- **Produce:** exact emitted digest and owner-bound evidence chain.
- **Branch:** continue when all links exist; repair source/config/security then
  regenerate and rebind on failure; stop before patching emitted bytes.

### 7. Verify observable behavior and performance

- **Input:** exact emitted digest, targets, fixtures, and evidence chain.
- **Action:** run static checks, CSSOM, matched/cascaded/computed, layout/
  overflow, rendered/mode/target, fallback/recovery, and applicable measured
  performance methods from [testing](testing.md).
- **Produce:** fresh acceptance evidence tied to exact bytes.
- **Branch:** continue when required evidence passes; return defects to their
  owner and repeat affected layers; obtain context for an untestable target;
  never weaken a check or convert missing evidence into success.

### 8. Close, recover, and hand off

- **Input:** final candidate and fresh evidence.
- **Action:** exercise [scenarios](scenarios.md), run the operational
  [checklist](checklists.md), and apply [evaluation](evaluation.md).
- **Produce:** accepted emitted CSS, resolved checklist run, limitations,
  failures/recovery record, and consumer handoff.
- **Branch:** complete only when both gates close and no material unknown
  remains; on failure preserve evidence, repair the owning source, regenerate/
  rebind/retest, and repeat the complete affected selection.

**Authority and completion:** the CSS operator may change only authorized CSS
source. Scope, product acceptance, security/runtime policy, and destructive
actions remain with their owners. Completion is exact emitted CSS plus the
four-link identity, closed checklist gates, fresh selected observations, and
literal limitations. It is not UI/UX approval, product accessibility
conformance, deployment, or runtime skill-use proof.

## References

Local operation references:

| Reference | Focus |
|---|---|
| [Cascade](cascade.md) | Origins, layers, importance, inheritance, custom properties, scope, order. |
| [Selectors](selectors.md) | Matching, specificity, pseudo-classes/elements, nesting, scope, cost. |
| [Layout](layout.md) | Flow, box model, intrinsic sizing, flex, grid, position, overflow, containment. |
| [Responsive and international](responsive-international.md) | Media/container queries, zoom, reflow, logical axes, locale, direction, writing modes. |
| [Typography and color](typography-color.md) | Fonts, text, line breaking, contrast, themes, forced colors, print. |
| [States and motion](states-motion.md) | Focus/hover/active/open/checked, modalities, transitions, animation, reduced motion. |
| [Performance and compatibility](performance-compatibility.md) | S/D, fallbacks, `@supports`, measurement, containment, rendering hints. |
| [Testing](testing.md) | Parse, CSSOM, computed, layout, rendered, target, four-link evidence. |
| [Scenarios](scenarios.md) | Coverage families, cases, obligations, and counterfeits. |
| [Checklists](checklists.md) | Operational design and acceptance gates. |
| [Evaluation](evaluation.md) | CSS-specific evaluation extension. |

External fact ownership:

Use current CSSWG/W3C specifications and dated target evidence:
[CSS Snapshot](https://www.w3.org/TR/css-2025/),
[Cascade](https://drafts.csswg.org/css-cascade-6/),
[Selectors](https://drafts.csswg.org/selectors-4/),
[Containment](https://drafts.csswg.org/css-contain/),
[Writing Modes](https://drafts.csswg.org/css-writing-modes-4/),
[Color Adjustment](https://drafts.csswg.org/css-color-adjust-1/), and
[CSSOM](https://drafts.csswg.org/cssom/). Combine mutable
[WebDX](https://web-platform-dx.github.io/web-features/) evidence with actual
project targets. Use [WPT](https://web-platform-tests.org/) only as upstream
interoperability evidence and
[Electron process documentation](https://www.electronjs.org/docs/latest/tutorial/process-model)
for the renderer/process boundary. Paraphrase sources and recheck mutable
claims; CSS Snapshot stability categories explicitly do not equal adoption.
