# Vision Evaluation Extension

Evaluator entrypoint for reviewing the `vision` skill bundle or a report produced by it. This file extends the
general Evaluation method with vision-specific scenarios, checks, lenses, and evidence. It does not replace the
eight-step method, perspectives, causal finding content, completed checks, or declared verdict derivation. When
Gobbi calls it, the active workflow adapter owns its stages, metadata, scoring, reconciliation, and output
contract.

## Evaluation Entry

When used inside Gobbi, follow its active Stage 0 load order:

1. the shared [`../evaluation/SKILL.md`](../evaluation/SKILL.md) and the active phase's required scenario,
   checklist, and evaluation bundle;
2. [`SKILL.md`](SKILL.md) end-to-end;
3. [`scenarios.md`](scenarios.md) and [`checklists.md`](checklists.md);
4. every direct child selected by the artifact's routing evidence: [`image.md`](image.md), [`ui.md`](ui.md),
   [`slides.md`](slides.md), [`video.md`](video.md), and/or [`chart.md`](chart.md); and
5. the frozen target: the complete nine-file bundle when evaluating the skill, or the report, artifacts,
   sources, coverage record, maps, measurements, frame samples, and references used by an analysis run.

Extract What / Why / How under the shared Stage-0 gate. For a report target, interpret these as: **What** visual
artifact/set and report are being reviewed; **Why** the purpose, audience, and success condition matter; **How**
the report routed types, planned coverage, mapped evidence, evaluated, verified, and synthesized. Missing target
evidence remains a finding or blocker under the shared evaluation rules; this extension does not soften them.

### Stage-1 frame selection

Build the active perspective Frames from the applicable `VISION-SCENARIO-*` cases, then attach the stable
`VISION-CHECK-*` conditions that would prove each case handled. Preserve IDs and parent trace. Treat the
operation checklist as an unchecked source: do not resolve it in place. In the active phase's filled evaluation
checklist, render selected conditions under the shared `## Stage 1 Additions` mechanism and use only the shared
evaluation markers there.

Selection rules:

1. Always activate F1–F6 and F12 because framing, evidence, maps, coverage, aesthetics, accessibility, mixed
   routing, and reporting are core to every visual analysis.
2. Activate F7 for general-image evidence, F8 for UI evidence, F9 for slides, F10 for ordered frames/video,
   and F11 for charts/data visualization. Activate every applicable family for a mixed artifact.
3. Activate both the ordinary and adversarial cases in each selected family. Add target-specific edge cases
   discovered from the actual artifact, applicable mistakes/rules, or prior evaluation iteration.
4. Activate conditional checklist rows only when their evidence predicate applies, but keep unconditional
   accessibility, evidence-class, whole/local, uncertainty, and handoff checks in every Frame.
5. For a skill-bundle target, additionally test exact file set, parent/child ownership, direct links, mirror
   topology, cold loading, and whether a fresh agent can produce the parent report from normal load context.

The evaluator may create scenario/checklist gaps only in the active evaluation outputs under the shared Stage-1
procedure. It never edits this bundle during evaluation.

## Perspective Lenses

Run all seven perspectives in the shared order, with equal rigor, then Overall. The `Activate` lines are seeds,
not a license to skip other applicable cases or checks.

### Project

**Lens:** Does the target serve the assigned visual-analysis outcome, audience, and purpose while staying
analysis-only? Does the report distinguish supplied intent from provisional inference and avoid open-ended
research or artifact implementation?

**Activate:** F1, F4–F6, F12; `VISION-CHECK-A01`, `A02`, `A04`, `A05`, `C03`, `C06`, `E01`–`E05`.

**Anti-patterns:** answering a different design question; invented audience or brand; source mutation disguised
as helpful analysis; an exhaustive claim from a sample; recommendations without preserve constraints; formal
quality verdict replacing the parent report.

### Structure

**Lens:** Does the analysis build a provisional gist, four stable maps, and relationship graph, then test
bottom-up and return to whole context? Does the skill keep parent policy singular while children refine the
correct type procedures and companions trace to live parent clauses?

**Activate:** F3, F7–F12; `VISION-CHECK-A03`, `B01`–`B05`, `C01`, `C02`, `E01`.

**Anti-patterns:** object inventory with no layout/relationship meaning; judgment before maps; one-child routing
for a mixed artifact; child-owned policy; separate type verdicts; strong whole hiding a local defect; locally
good slides substituting for deck structure.

### Performance

**Lens:** Is inspection effort proportional to artifact risk and claim precision? Is set/sequence coverage
systematic, reproducible, and bounded without loading irrelevant children or measuring details that do not
affect the assignment?

**Activate:** F2, F4, F10, F12; `VISION-CHECK-A03`, `A04`, `B06`, `C01`, `C02`, `D01`, `E02`, `E03`.

**Anti-patterns:** convenient sampling; every frame or pixel inspected without a risk reason; contact sheet
called temporal review; original resolution ignored for exact claims; all children loaded for a simple image;
planned coverage reported as actual; costly measurement used to decorate a low-impact opinion.

### Aesthetics

**Lens:** Does the target evaluate aesthetics in the parent priority order—declared context, comprehension and
accessibility, observable craft, then taste/originality—and distinguish craft, contextual effectiveness, and
expressive tradeoff? Are strengths and distinctive intent protected?

**Activate:** F5 plus the aesthetic cases in every selected type family; `VISION-CHECK-C05`, `C06`, `D02`,
`D04`, `D06`.

**Anti-patterns:** minimalism, symmetry, centering, whitespace, rule of thirds, golden ratio, or “modern” used as
universal acceptance; beauty score; generic “cleaner” critique; expressive brand penalized for character;
technical defect excused as style; personal taste presented as accessibility or task evidence.

### Usage

**Lens:** Can a cold analyst route the artifact, run the maps and children, recover from missing evidence, and
produce a report a downstream implementer can use? Can the consumer locate, understand, prioritize, and verify
each recommendation without hidden author context?

**Activate:** all applicable families; `VISION-CHECK-A01`–`E05`.

**Anti-patterns:** vague role hypotheses; unlocatable findings; recommendation vocabulary without target or
test; missing top three; uncertainty buried after priorities; chart finding detached from its slide/UI context;
video timestamp missing; conditional evidence silently skipped; report sections present but empty.

### Consistency

**Lens:** Do parent vocabulary, child routing, scenarios, checklist obligations, evaluator selections, report
fields, and runtime mirrors agree? Do source, reference, maps, findings, priority summary, and actual coverage
carry the same facts and limitations?

**Activate:** F2–F4, F8, F12; `VISION-CHECK-A03`, `B02`–`B04`, `C01`, `C04`, `D02`, `E01`–`E03`.

**Anti-patterns:** evidence class changes in the summary; source conformance becomes aesthetic pass; screenshot
noise becomes semantic regression; scenario/check trace is one-way; primary/secondary routing disagrees with
loaded children; handwritten mirrors or content-equality used to claim correct symlink topology; an unlisted
`other.md` branch appears.

### Risk

**Lens:** Does the operation fail safely against hallucination, unsupported precision, accessibility harm,
cultural/locale assumption, misleading data, incomplete temporal evidence, source mutation, sensitive evidence,
and false completion? Are high-impact unknowns visible and stopped at handoff?

**Activate:** every adversarial and failure/recovery case, especially F1–F2, F4, F6, F8, F10–F12;
`VISION-CHECK-A02`, `A05`, `B04`–`B06`, `C02`–`C04`, `D01`, `D05`, `E02`, `E03`.

**Anti-patterns:** unreadable text invented; anatomy or identity asserted from a thumbnail; screenshot declared
formally accessible; one frame used for easing/flicker; no-source chart declared correct; cultural identity
guessed from symbols; source/reference data copied into an unsafe evaluation artifact; unresolved gate counted
as pass; Bash used to mutate the analyzed source.

### Overall

The shared Stage 3 owns the holistic verdict. Add these anchors:

- Did understanding proceed whole→maps/relations and evaluation primitive/object→component/cluster→region/layout
  →whole→use context/sequence, with revisions when evidence conflicted?
- Did the operation find a local defect even when the whole looked strong, and preserve whole strengths when a
  local defect existed?
- Did every material artifact type receive its child procedure and return to one parent report?
- Are correctness, conformance, task/content effectiveness, accessibility, aesthetic craft, contextual
  expression, and preference separated before synthesis?
- Do context-first aesthetics resist universal formulas and cosmetic compliance while still making concrete
  craft judgments?
- Do the top three priorities reflect impact and evidence, state preserve constraints, and admit falsifiable
  verification?
- Could a polished but substance-empty report pass any scenario or check? If yes, record the gap.
- What accurate maps, effective hierarchy, accessible choices, task paths, visual character, narrative rhythm,
  or data comparisons belong on the shared Preserve list?

## Recommended Verification

Use the strongest available evidence and preflight any command for side effects. For a report target:

1. Register original dimensions, selected identifiers, viewport/state/timestamp, and artifact hashes. Compare
   these with the report's inventory and actual coverage.
2. Resolve every material finding locator against the original artifact. Check that exact claims have a
   measurement artifact, temporal claims have ordered frames, chart correctness has data/transforms, and
   formal-standard claims have current authoritative evidence.
3. Run an evidence-class audit: remove the supplied intent, source, or reference and identify which findings
   correctly fall from observed/measured to intent-dependent/unknown.
4. Run the whole/local probe, alternate-hypothesis probe, preserve-good counterfactual, and summary/body
   reconciliation named by the parent.
5. For comparisons, register environment/state and classify noise separately from semantic differences.
6. Complete an isolated evaluation copy of the applicable checks and confirm coverage closure separately from
   acceptance under the shared evaluation output rules.

For the skill bundle itself:

1. Confirm exactly `SKILL.md`, `scenarios.md`, `checklists.md`, `evaluation.md`, `image.md`, `ui.md`, `slides.md`,
   `video.md`, and `chart.md` exist in the canonical directory and no `other.md` exists.
2. Parse frontmatter key order and value; extract the parent heading tree; prove Procedure is the dominant
   top-level section and the parent is the sole policy owner.
3. Verify all local Markdown links from canonical and both runtime mirrors. Inspect symlink topology with live
   `readlink`/inode evidence rather than content comparison through a link.
4. Close scenario IDs, category dispositions, scenario→obligation→check IDs, checklist source unchecked state,
   and check→parent reverse trace.
5. Run the repository-owned sync, sync check, link check, compatibility, plugin invocation, plugin smoke, and
   publish-readiness checks when their preflights say they are applicable and non-mutating outside authorized
   scope.
6. Cold-load through each available runtime's normal entry and use disposable fixtures to exercise at least:
   ambiguous/low-resolution image; UI with and without source/`DESIGN.md`; slide sequence conflict; transient
   video defect; chart source mismatch and no-source chart; mixed artifact; large-set sampling; expressive brand;
   capture-environment noise; strong-whole/local defect; and evidence-free cosmetic critique.

File/path/mirror/runtime claims require fresh tool evidence. Semantic visual judgments require locatable
artifact evidence and the parent finding fields. An unavailable runtime or evidence source remains an explicit
coverage gap; it is never inferred from another runtime or adjacent source.

## References

- [`SKILL.md`](SKILL.md) is the sole owner of the visual-analysis operation, evidence vocabulary, aesthetics,
  finding schema, and report contract evaluated here.
- [`scenarios.md`](scenarios.md) supplies the visual-analysis case families and adversarial obligations for
  Stage-1 selection.
- [`checklists.md`](checklists.md) supplies stable operational conditions to attach to selected scenarios; its
  source remains unchecked.
- [`image.md`](image.md), [`ui.md`](ui.md), [`slides.md`](slides.md), [`video.md`](video.md), and
  [`chart.md`](chart.md) supply only type-specific procedure evidence for selected artifact types.
- [`../evaluation/SKILL.md`](../evaluation/SKILL.md) owns evaluator independence, the eight-step method, seven
  perspectives plus Overall, causal finding content, completed checks, and declared verdict derivation.
