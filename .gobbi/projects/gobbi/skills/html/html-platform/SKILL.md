---
name: html-platform
description: "MUST load when looking up HTML conformance, parsing, target support, or evidence meaning."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# HTML Platform

Use this manual for the [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/) and its
realization in declared browser or Electron renderer targets. It answers conformance, parsing, compatibility,
and evidence questions.

It does not author artifacts or set general accessibility policy. Use `html-development` for the artifact
outcome and `html-semantics` for element and accessibility choices.

## Principles

### Separate specification from realization

The Living Standard defines authoring and processing models; declared targets supply claimed behavior.
Evidence from either side cannot substitute for the other.

### Ask which artifact layer answered

Source bytes, parser-produced DOM, runtime behavior, and product outcomes are distinct subjects. Name the
layer before interpreting a result.

### Prefer narrow primary evidence

Use the owning standard section and current evidence from the declared target. Carry uncertainty into the
answer instead of replacing it with a broad compatibility label.

## Rules

- **MUST use the current WHATWG definition for HTML authoring conformance, element content models, and parser
  behavior.** Use [ARIA in HTML](https://www.w3.org/TR/html-aria/) only for allowed ARIA use on HTML elements.
- **MUST declare browser versions or the pinned Electron release behind a compatibility answer.** A
  specification status or support table alone does not prove behavior in those targets.
- **MUST distinguish authored source from the parsed DOM.** Browser error recovery may insert, move, or omit
  nodes without making the source conforming ([HTML
  parsing](https://html.spec.whatwg.org/multipage/parsing.html)).
- **MUST bind observed behavior to the exact emitted artifact and target.** Record enough identity to repeat
  the observation.
- **NEVER treat validator silence as proof of semantic intent, runtime behavior, accessibility, security, or
  product acceptance.** Report only the diagnostics and checks performed against [WHATWG
  HTML](https://html.spec.whatwg.org/multipage/) or another named owner.

## Manual

### Conformance and content models

Look up the element definition, permitted contents and contexts, ancestors, attributes, and authoring
requirements. For ARIA, cross-check native semantics and allowed roles or attributes. A conforming token
sequence can still express the wrong meaning; that judgment belongs to `html-semantics`.

### Source, parser, and DOM behavior

Use the [HTML parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html) and a fragment's context
element to explain the resulting tree. Inspect parsed DOM for recovery-sensitive tables, forms,
formatting, templates, nested interaction, and generated fragments. When source and DOM differ, report both;
recovery does not repair or authorize the source error.

### Browser and Electron realization

Start with the declared targets. Use a pinned Electron release and bundled Chromium, or named browser
versions and current project evidence. Test each target included in the claim.

If support differs, state the exact gap and observed fallback or progressive enhancement. If a target,
version mapping, or test surface is unavailable, the compatibility answer remains unresolved rather than
becoming universal.

### Evidence and claim interpretation

| Evidence | Supports | Does not establish alone |
|---|---|---|
| Source or validator result | emitted syntax and checked conformance rules | parsed tree or intent |
| Parsed DOM | the tree produced for exact bytes and context | complete native behavior |
| Target observation | behavior in the named version | other targets or product acceptance |
| Accessibility or product test | the tested outcome and conditions | broader [WCAG 2.2](https://www.w3.org/TR/WCAG22/) or product conformance |

When sources disagree, preserve identity and date. Give the narrowest supported answer or report the
unresolved difference.

## References
