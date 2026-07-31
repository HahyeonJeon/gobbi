---
name: html
description: "MUST load before writing or reviewing HTML. Defines standards-first structure, semantics, accessibility, compatibility, ownership boundaries, and verification for browser and Electron renderer documents."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# HTML

## Purpose

Use this operation to design, author, transform, or review HTML as a language
artifact. It applies to browser documents and Electron renderer documents.
Load [`coding`](../coding/SKILL.md) for language-agnostic construction
discipline. CSS, UI, UX, web, and the sibling CSS skill are not prerequisites.

This skill owns emitted HTML conformance, document metadata and landmarks,
headings and sections, content models, native semantics, form markup,
media/embed alternatives, native interactive content, resource declarations,
`lang`/`dir`, and parsed-tree evidence.

It does not own visual design or CSS, JavaScript state machines, application
security implementation, template/framework syntax, or Electron main/preload
behavior. Isolated renderer HTML remains with this skill and applicable UI or
language owners. Load the [`desktop`](../desktop/SKILL.md) domain only when the
task also coordinates a complete installable Electron and TypeScript outcome,
defines observable installed-platform behavior, or makes desktop release
judgments.

For any Electron work, **MUST load
[`electron`](../electron/SKILL.md) and every child whose root trigger applies**:
[`electron-convention`](../electron/electron-convention/SKILL.md) for
conventions, [`electron-development`](../electron/electron-development/SKILL.md)
for implementation or review,
[`electron-runtime`](../electron/electron-runtime/SKILL.md) for runtime lookup,
[`electron-test`](../electron/electron-test/SKILL.md) for Electron-specific
evidence, and [`electron-release`](../electron/electron-release/SKILL.md) for
release work. Load several children when several triggers apply. HTML remains
the emitted renderer-document layer and defines no Electron platform policy.

## Rules

### HTML-1 — Classify material features on two independent axes

Classify every feature whose support or semantics can affect the outcome.
Specification status never proves target support, and a compatibility table
never proves conformance, accessibility, or product acceptance.

Specification maturity:

| Class | Meaning | Default response |
|---|---|---|
| `S1 Stable/current` | Current conforming HTML or a stable supporting standard with no material unresolved behavior for this use. | Normal candidate; still verify semantics and targets. |
| `S2 Implementable/evolving` | Implemented and usable, but specification detail or interoperability is still materially evolving. | Pin the exact behavior and test it. |
| `S3 Experimental/unstable` | Material behavior is unresolved, incomplete, flagged, or inconsistently implemented. | Evaluation-only unless the user adopts the risk and scope. |
| `S4 Proprietary/obsolete/nonconforming` | Runtime-only extension, obsolete feature, or authoring form the current standard rejects or discourages. | Do not introduce generically; isolate only for documented compatibility or migration. |

Apply this deployment classifier in first-match order:

1. `D4 Exact-target-only` when the complete declared target is exactly one
   pinned engine/runtime, that target fully supports the feature, and no
   multi-engine claim is made.
2. Otherwise `D3 Limited` when any declared target lacks support or behaves
   materially differently.
3. Otherwise `D2 Newly available` when all declared targets behave
   consistently and project evidence says deployment is newly available.
4. Otherwise `D1 Established` when all declared targets behave consistently
   and project evidence says deployment is established.
5. Otherwise `UNDETERMINED`; obtain target evidence before adoption.

The project supplies the browser matrix and, for Electron, the pinned Electron
release and bundled Chromium. Anything outside the established target floor
needs an essential-function fallback or progressive enhancement, exact-target
tests, and a stated reopen/removal condition.

### HTML-2 — Preserve language meaning and the accessibility floor

Author conforming content models and choose native elements for their defined
meaning and behavior. Prefer native HTML before ARIA. Add ARIA only when it is
allowed for the element, does not conflict with strong native semantics, and
the implementation supplies every promised state and behavior.

The language-level floor is:

- meaningful structure, metadata, landmarks, headings, and relationships;
- native controls with names, labels, groups, states, instructions, and error
  associations;
- equivalent alternatives for non-text media and embedded content;
- keyboard-reachable language behavior with observable focus and state;
- state not conveyed by color alone;
- resilient content under zoom, reflow, text growth, locale expansion,
  direction changes, and writing modes;
- contrast, themes, and forced-colors compatibility where markup contributes;
- reduced nonessential motion where the language feature contributes it; and
- correct document and fragment language/direction through `lang`, `dir`,
  `bdi`, or `bdo` as appropriate.

The project separately owns the formal accessibility target and
browser/assistive-technology matrix. Static HTML checks cannot prove WCAG,
UI/UX quality, end-to-end keyboard behavior, or product acceptance.

### HTML-3 — Respect trust, transform, and runtime boundaries

Treat trust and context before inserting data. Route contextual encoding,
sanitization policy, Trusted Types, Content Security Policy, navigation policy,
and dangerous DOM sinks to the security owner. Route template, JSX, component,
Markdown, and other transforms to their generator owner. HTML still owns the
conformance and language behavior of the emitted bytes.

Never describe string concatenation, `innerHTML`, or an equivalent injection
sink as a safe HTML authoring technique. Server validation and authorization
are not replaced by form validation. Embed permissions, iframe sandbox policy,
and remote content require the applicable security or runtime owner. Electron
privilege boundaries require the Electron root and applicable children named
in Purpose.

For transformed HTML, retain four linked identities:

1. exact source identity;
2. exact transform tool and version, configuration, flags, plugins, and order;
3. exact emitted bytes or digest; and
4. parsed-tree or relevant native-operation observation tied to those bytes.

A directly authored file records that no transform occurred. When generated
output is wrong, fix source, generator/configuration, or the security boundary;
regenerate, rebind all four links, and repeat the relevant tests. Never repair
the emitted bytes directly.

### HTML-4 — Verify the artifact the user agent consumes

Parsing recovery is not authoring permission. Verify source conformance and the
parsed tree because source text, recovered DOM, and transformed output can
differ. Verify native behavior in the declared target matrix and use
assistive-technology evidence where custom semantics or behavior materially
affect users.

Every completion claim names the exact artifact, target, observation, and
limitations. A validator pass proves only the rules it checks. Web Platform
Tests provide upstream interoperability evidence, not project integration.
Static source and topology checks do not prove skill discovery, selection,
loading, use, runtime behavior, or product acceptance.

## Procedure

### 1. Frame the artifact and owners

Identify the user outcome, authored versus generated source, exact emitted
artifact, browser targets, pinned Electron target if any, formal accessibility
target, assistive-technology matrix, trust boundary, and applicable generator,
security, runtime, JavaScript, and CSS owners. If a material input is unknown,
record it as `UNDETERMINED`; do not invent a universal target.

### 2. Select the smallest detail route

Read only the matching child:

- shell, metadata, parsing, fragments, or transformed markup:
  [document structure](document-structure.md);
- headings, regions, prose, lists, tables, language/direction, or ARIA:
  [semantics](semantics.md);
- labels, controls, groups, validation, or submission:
  [forms](forms.md);
- images, audio, video, tracks, canvas alternatives, or iframes:
  [media and embeds](media-embeds.md);
- links, buttons, disclosure, dialog, popover, or focus:
  [interactive content](interactive-content.md);
- stylesheets, scripts, modules, hints, priorities, CORS, or referrers:
  [resource loading](resource-loading.md);
- untrusted data, dangerous sinks, embeds, or privilege boundaries:
  [security boundaries](security-boundaries.md); and
- conformance, parsed tree, targets, behavior, or evidence:
  [testing](testing.md).

The children deepen these rules; they do not replace or extend policy.

### 3. Classify before adopting

For every material feature, record `S1`–`S4`, then apply the first-match
deployment classifier. Cite the current primary specification and current
declared-target evidence. Record fallback, progressive enhancement, target
tests, and reopen conditions when the result is not established.

### 4. Design the semantic skeleton

Lay out the document shell, metadata, landmarks, heading relationships,
content models, native controls, language/direction, alternatives, and
resource declarations before filling content. Keep essential content and
function available when optional features fail.

### 5. Grow one conforming slice at a time

Add the smallest coherent structure, then inspect its meaning, name, state,
keyboard behavior, fallback, and ownership seams. Prefer native HTML. When
ARIA or a newer feature is necessary, write down the missing native capability
and the target evidence that justifies it.

### 6. Resolve trust and generation

Map every dynamic value to its output context and security owner. For
transformed markup, bind the four-link chain before treating emitted output as
the test subject. Fix defects at the owned source, configuration, generator, or
security boundary and regenerate.

### 7. Verify fresh evidence

Run project checks plus the methods in [testing](testing.md). At minimum,
inspect conformance, parsed structure, accessible names/relationships, target
behavior, keyboard/focus behavior contributed by HTML, alternatives, language
and direction, fallback, and the exact emitted artifact. Capture failures as
evidence; do not edit generated output or weaken the test to pass.

### 8. Review and close

Use the [scenarios](scenarios.md), resolve every applicable item in the
[checklist](checklists.md), and enter [evaluation](evaluation.md). Completion
requires both the design gate and acceptance gate. Report unknowns and
limitations literally.

## Children

| Child | Focus |
|---|---|
| [Document structure](document-structure.md) | Shell, metadata, syntax, parsing, fragments, and transforms. |
| [Semantics](semantics.md) | Content models, headings, regions, text, tables, language/direction, native semantics, and ARIA. |
| [Forms](forms.md) | Controls, names, labels, groups, validation, state, and submission markup. |
| [Media and embeds](media-embeds.md) | Images, audio/video, tracks, alternatives, iframes, and embedded boundaries. |
| [Interactive content](interactive-content.md) | Links, buttons, disclosure, dialog, popover, focus, and native interaction. |
| [Resource loading](resource-loading.md) | Styles, scripts, modules, hints, priorities, CORS, integrity, and referrers. |
| [Security boundaries](security-boundaries.md) | Contextual trust, sinks, sanitization routing, embeds, and Electron seams. |
| [Testing](testing.md) | Conformance, parsed tree, target behavior, accessibility evidence, and four-link proof. |
| [Scenarios](scenarios.md) | Passing, failing, boundary, and recovery exercises. |
| [Checklists](checklists.md) | Atomic design and acceptance gates. |
| [Evaluation](evaluation.md) | Evidence selection and outcome decision. |

## Sources

Use current primary or maintainer-owned material and date mutable target
observations. Durable guidance is based on:

- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/)
  for authoring conformance, content models, elements, parsing, loading, and
  obsolete features;
- [ARIA in HTML](https://www.w3.org/TR/html-aria/) and the
  [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
  for allowed semantics and behavior obligations;
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and WAI techniques for the
  language-level accessibility floor, without converting it into a product
  conformance claim;
- [WebDX Web Features](https://web-platform-dx.github.io/web-features/)
  plus the actual project matrix for mutable deployment evidence;
- [Web Platform Tests](https://web-platform-tests.org/) for upstream
  interoperability evidence only;
- [Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model)
  and pinned release metadata for renderer/runtime boundaries; and
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
  for contextual output-handling boundaries.

Paraphrase sources; do not copy standards prose, cheat-sheet examples, or test
bodies. Recheck mutable sources when a consuming task uses them.
