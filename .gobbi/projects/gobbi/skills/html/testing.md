# Testing

## Use this child when

Planning or reviewing HTML evidence, especially generated markup, parser
recovery, native interaction, target compatibility, or accessibility-relevant
behavior. Apply parent rule
[`HTML-4`](SKILL.md#html-4--verify-the-artifact-the-user-agent-consumes).

## Detail

Build evidence in layers:

1. **Identity:** exact source; explicit no-transform or the full transform
   tool/version/configuration/flags/plugins/order; emitted bytes/digest.
2. **Static conformance:** project parser/linter/checker and content-model
   diagnostics. Record tool/version/configuration and unresolved warnings.
3. **Parsed structure:** DOM assertions for node placement, attributes,
   relationships, accessible names/roles/states, and recovery-sensitive
   regions.
4. **Native operation:** form submission, link/button activation, disclosure,
   dialog/popover, media, resource requests, and failure behavior relevant to
   the feature.
5. **Targets and users:** declared browsers, pinned Electron/Chromium, keyboard,
   zoom/reflow/text growth, locale/direction/writing mode, themes/forced
   colors, reduced motion, and the project assistive-technology matrix.

Use an HTML conformance checker when available, but do not treat its silence as
proof of semantic intent. Upstream WPT can identify interoperability risk; add
project tests against the exact emitted artifact. Snapshot source text alone
cannot prove the parsed tree or native behavior.

For failures, preserve the exact command, tool/version, target, emitted digest,
observation, and relevant logs/screenshots. Classify the owner: authored HTML,
generator/configuration, security, CSS, JavaScript, Electron/runtime, or
project acceptance. Fix the root-owned source, regenerate when needed, rebind
identity, and rerun every affected layer.

## Evidence

A completion record contains:

- artifact/source/transform/emitted identities;
- S/D classification and target matrix;
- checks run with fresh results;
- parsed and native-operation observations;
- accessibility-relevant target observations;
- fallback/failure/recovery results;
- unresolved limitations and external-owner evidence; and
- no claim beyond what the evidence observes.

See scenario [`H-S03`](scenarios.md#h-s03--generated-invalid-table-recovery)
and checks [`H-C07`](checklists.md#h-c07--source-and-transform-identity),
[`H-C08`](checklists.md#h-c08--parsed-structure), and
[`H-C10`](checklists.md#h-c10--artifact-bound-verification).
