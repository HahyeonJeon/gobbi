---
name: html-css-platform
description: "MUST load when interpreting or verifying HTML/CSS conformance, parsing, parser-produced DOM, native HTML behavior, CSSOM, matching, cascade, computed values, layout, overflow, paint, compositing, rendering, direct target support, or browser and Electron-renderer diagnosis."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# HTML/CSS Platform

Use this manual to answer a bounded question about HTML/CSS standards or their direct realization in a browser
or Electron renderer. State the specification meaning and maturity, declared target and mode, direct
observation, uncertainty, and strongest supported conclusion separately.

The manual does not own browser lifecycle, navigation, scheduling, network, cache, storage, origin, permission,
security state, application architecture, or product acceptance. Route those claims to `web-platform` or the
applicable product, security, testing, or release owner.

## Principles

### Separate standards meaning from target behavior

A specification defines expected semantics at a stated maturity; only direct supported evidence establishes a
declared target's behavior. Neither automatically proves product acceptance.

### Diagnose by observable layer

Keep source, tokenization and parsing, parser-produced DOM, native behavior, CSSOM, matching, cascade, computed
values, layout, paint, compositing, pixels, resources, and timing distinct. Stop at the earliest layer that
explains the divergence.

### Preserve uncertainty

An unavailable surface, draft feature, unsupported target, conflicting observation, or inaccessible layer is
an explicit unknown. Narrow the answer instead of replacing missing evidence with inference.

### Keep inspection non-destructive

Use read-only or reversible inspection, restore changed state, and reject conclusions that depend on state the
inspection created.

## Rules

- **MUST bind the question to a concrete HTML/CSS fact, artifact, target version, mode, and state.** Return an
  unresolved question when identity or scope is too broad for a repeatable answer.
- **MUST distinguish authoritative semantics, specification maturity, target support, direct observation, and
  acceptance.** State the source and limit for each conclusion.
- **MUST attribute each observation to its actual layer.** Never use one layer as proof of a different layer
  without an explicit establishing mechanism.
- **MUST keep inspections read-only or reversible.** Restore every changed state and record access limits.
- **MUST route browser lifecycle, network, cache, storage, origin, permission, security-state, and cross-system
  claims to `web-platform`.** Load both owners when one diagnosis spans both boundaries.
- **NEVER infer requests, performance, compositor promotion, accessibility output, or broad support from source
  declarations alone.** Require claim-specific direct observation and state its evidence ceiling.

## Manual

### Question and evidence record

Record the concrete question, standards surface, artifact or emitted identity, target and version, mode,
document state, variant case, authoritative sources and maturity, inspection surface, direct observation,
unknowns, conclusion, evidence ceiling, and next owner. This is an owner-tagged lifecycle entry when the
question participates in broader work; a one-off lookup may use the same fields in short form.

### HTML conformance and parsing

Use the current WHATWG HTML Standard for living HTML syntax, parsing, content models, and native element
behavior, while recording the exact section and target relevance. Distinguish authored source from tokens,
tree-construction corrections, the parser-produced DOM, later script mutation, and serialized markup.

An HTML validator or parser can establish only the claims exposed by that tool and configuration. A clean
parse does not establish accessible naming, keyboard behavior, rendered layout, resource count, application
behavior, or product acceptance.

### Native HTML behavior and semantics output

Bind native behavior to the exact element, attributes, state, target, and mode. Keep authored meaning with
`html-css-semantics`; use direct parser DOM or browser behavior here; use `html-css-testing` for a focused
assertion and observed accessibility output when that output is the claim.

Accessible-name computation and accessibility-tree exposure are observed target layers, not source-only facts.
When access is unavailable, report the claim as unobserved instead of inferring it from a role or label.

### CSSOM, matching, cascade, and computed values

Separate parsed rules and CSSOM representation from selector matching, cascade origins and layers, importance,
scope, specificity, order, inheritance, specified values, computed values, used values, and actual values. Name
the exact layer the inspection exposes; browser developer tools can display several layers without making them
interchangeable.

A standards rule can explain expected resolution, while direct target observation establishes what the pinned
engine produced. A project convention can choose source organization but cannot override platform semantics.

### Layout, overflow, paint, compositing, and rendering

Inspect layout and geometry before pixels when the question concerns box size, position, fragmentation,
scrolling, or overflow. Inspect paint or reference pixels when appearance is the claim. Treat compositing as a
target-dependent implementation detail unless the platform exposes reliable evidence for the exact target and
state.

`transform`, `opacity`, containment, and `will-change` may affect implementation choices, but none guarantees a
separate layer, compositor execution, frame rate, memory cost, or responsiveness. Treat `will-change` as a
potentially costly hint and verify the claimed effect directly.

### Resources and requests

HTML candidate selection, preload or preconnect hints, CSS resource references, conditional media, cache,
retry, and network scheduling are different mechanisms. This manual can explain direct HTML/CSS candidate and
selection semantics; `web-platform` owns network and cache behavior.

Never require exactly one request as a universal invariant. Bind observation to candidate set, target, cache
state, connection hints, conditional branches, retries, service workers, and the network surface required by
the claim.

### Target support and compatibility

Record the declared browser versions or pinned Electron renderer and mode. Use specification maturity to
describe the feature definition, authoritative compatibility data to form a hypothesis, and direct target
evidence to establish required behavior when the claim depends on it.

Test every claimed target or narrow the conclusion to observed targets. Keep unavailable targets and
inaccessible surfaces as explicit unknowns, and hand fallback or progressive-enhancement choices to
`html-css-conventions`.

### Earliest-divergence diagnosis

Start with source and transform identity, then compare emitted markup or CSS, parser DOM and native state,
CSSOM and matching, cascade and computed values, geometry and overflow, paint and pixels, compositing evidence,
resources, and timing only as the question requires. Stop at the earliest observed difference that explains
the failure.

Route the correction to `html-css-development`, the focused regression evidence to `html-css-testing`, the
authored choice to its preference owner, and cross-system browser facts to `web-platform`. If observations
conflict, preserve both identities, narrow the answer, and name the next discriminating inspection.

### Failure and recovery

An unavailable inspection surface, changed artifact, unsupported target, version mismatch, conflicting
observation, or state created by inspection invalidates the affected conclusion. Restore state, rebind the
identity, pin a supported target, choose a different establishing surface, or return the claim as unknown.

Complete the lookup with a bounded answer, source and maturity, target and mode, direct observation, layer,
limitations, evidence ceiling, and handoff. Use [`checklists.md`](checklists.md) to evaluate the complete answer.

## References

- [`checklists.md`](checklists.md) evaluates HTML/CSS platform lookup and diagnosis across all eight
  perspectives.
