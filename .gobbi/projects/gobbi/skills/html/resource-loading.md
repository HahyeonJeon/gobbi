# Resource loading

## Use this child when

The work changes stylesheets, scripts, modules, preload/modulepreload, resource
hints, lazy loading, fetch priority, CORS, integrity, or referrer declarations.
Apply parent rules
[`HTML-1`](SKILL.md#html-1--classify-material-features-on-two-independent-axes),
[`HTML-3`](SKILL.md#html-3--respect-trust-transform-and-runtime-boundaries),
and
[`HTML-4`](SKILL.md#html-4--verify-the-artifact-the-user-agent-consumes).

## Detail

Declare only resources the document actually needs and use the relationship
whose processing model matches the intent. Keep blocking, deferred, async, and
module execution order explicit. A resource hint is a measured scheduling
choice, not a universal performance improvement.

Match `preload`/`modulepreload` attributes to the later request, including URL,
type, destination, credentials/CORS mode, and integrity where applicable;
otherwise the browser can issue duplicate or unusable work. Prioritize
user-critical resources from observed loading evidence. Do not lazy-load
content whose delayed availability harms the outcome.

Classify mutable loading attributes and link types with HTML-1. Test network
failure, cache state, target support, and whether the declared hint changed the
intended request. Treat integrity metadata, referrer policy, cross-origin
credentials, CSP, and remote script trust as security-owner decisions while
HTML owns accurate emitted declarations.

## Evidence

- resource inventory, owner, purpose, and request relationship;
- target classification and fallback for material loading features;
- measured request waterfall or equivalent observation tied to exact markup;
- no unintended duplicate/mismatched preload; and
- security-owner evidence for cross-origin, integrity, referrer, and trust.

See scenario [`H-S06`](scenarios.md#h-s06--cosmetic-preload-optimization) and
checks [`H-C03`](checklists.md#h-c03--feature-maturity-and-fallback) and
[`H-C10`](checklists.md#h-c10--artifact-bound-verification).
