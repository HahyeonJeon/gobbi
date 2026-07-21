# Chart and Data Visualization Analysis

Use this child after [`SKILL.md`](SKILL.md) for charts, plots, quantitative tables, data maps, and chart-like
infographics. Use the parent core for conceptual diagrams that do not encode data. This child separates visual
reading from data correctness: without supplied source data and transformation evidence, correctness of the
underlying values remains unknown.

## Procedure

### C1 — Establish analytical task and truth sources

Extend the parent frame with intended question, audience, decision, comparison, medium, expected level of
statistical knowledge, and whether the display is exploratory, explanatory, monitoring, or reference. Record
the exact source data, query, transform, aggregation, chart specification, code, table, reference output, and
copy supplied for verification.

Build a claim-to-source ledger. A rendered chart supports visible marks and labels; source data supports input
values; transformation evidence supports aggregation or calculation; code may support intended encoding; the
viewer task determines whether the display is effective. If source or transformation evidence is absent,
state “data correctness unknown” before evaluating integrity risks visible in the rendering.

### C2 — Map chart grammar and reading path

Extend the parent's maps with:

- chart frame, plot region, title, subtitle, caption, source, and explanatory assertion;
- marks such as bars, points, lines, areas, cells, nodes, links, shapes, or table entries;
- encodings such as position, length, angle, area, color, size, shape, texture, and motion;
- scales, axes, ticks, grids, baselines, coordinate systems, and reference lines;
- legends, direct labels, annotations, units, uncertainty displays, and guides;
- layers, series, facets, small multiples, groups, filters, and interactive or selected states; and
- for maps, geographic projection, boundaries, areas, points, routes, inset regions, and normalization basis.

Trace label-mark, legend-mark, assertion-evidence, axis-value, annotation-target, and comparison relationships.
Write the likely first comparison and the sequence required to decode it. Ambiguity in these relations is a
finding even when each isolated element is polished.

### C3 — Verify data and transformations when supplied

When source evidence exists, check the displayed values against it at a declared coverage level. Include
outliers, extrema, first and last periods, missing values, zero, negative values, ties, category boundaries,
totals, and any annotated point. Verify aggregation, grouping, ordering, filtering, units, time zone or period,
binning, normalization, percentages, denominators, rounding, and derived metrics as applicable.

Check whether labels, tooltips, table cells, annotations, and narrative assertions agree with the marks and
source. Record every unverified transformation link; source presence alone does not prove that the rendered
chart used it correctly. If exact data extraction is unavailable, lower coverage and confidence rather than
claiming a complete reconciliation.

### C4 — Inspect scale, encoding, and integrity risks

Test whether each encoding matches the data type and comparison task. Inspect:

- domain, baseline, truncation, reversed direction, nonlinear or logarithmic scale, broken axis, dual axes,
  unequal intervals, and inconsistent scales across facets;
- area, volume, perspective, pictogram count, geographic area, smoothing, stacking, overlap, and occlusion
  that can distort apparent magnitude;
- sorting, category omission, missing-data treatment, bin boundaries, aggregation, normalization, denominator,
  and time-window choices that change the comparison;
- uncertainty, sample size, forecast status, estimates, and error representation where relevant; and
- annotation, title, color, or emphasis that asserts more than the visible evidence supports.

Do not label a non-zero baseline or unusual encoding misleading solely by convention. Explain the concrete
perceptual or decision effect in context, the declared task, and any disclosure that mitigates it.

### C5 — Evaluate comprehension and comparison efficiency

Ask what comparison the viewer must make: lookup, ranking, trend, difference, distribution, part-to-whole,
correlation, flow, network, geography, uncertainty, or another task. Test whether the selected marks and
encodings make that comparison direct, whether labels and units remove avoidable decoding, and whether the
viewer can distinguish series, groups, filters, and states.

Inspect density, overlap, label collision, small-multiple consistency, table scan paths, number alignment,
decimal precision, legend travel, annotation competition, and the balance between overview and detail.
Simplification is beneficial only if it preserves the comparisons, uncertainty, and source context the
audience needs.

### C6 — Evaluate accessibility and equivalent information

Inspect text legibility, contrast where measurable, color dependence, legend distinguishability, direct
labeling, pattern or shape redundancy, focus or selection visibility where evidenced, and whether annotations
remain associated with their targets. A palette simulation can suggest risk; it does not replace direct
inspection of redundant encoding and supplied accessibility evidence.

Identify the equivalent information needed outside the pixels: chart summary, underlying data table,
structured values, accessible name and description, keyboard interaction, or another context-appropriate
alternative. Only claim that such an alternative exists or works when the surrounding implementation or
source is supplied.

### C7 — Evaluate aesthetic craft in analytical context

Apply the parent aesthetic priorities to clarity and expression: intentional hierarchy, coherent typography,
spacing, mark weight, grid and guide restraint, color roles, annotation style, layer balance, and finish. Then
assess audience, brand, medium, emotional tone, and whether distinct visual character aids attention or recall.

Do not reduce aesthetics to removing gridlines, legends, color, decoration, or density. A rich display may be
appropriate for expert exploration; a sparse display may be appropriate for one executive assertion. Judge
whether every choice serves the task and whether variation is purposeful. Preserve useful comparisons,
uncertainty, identity, and data density when recommending polish.

### C8 — Reconcile and return findings

Cross-check chart-level conclusions against individual values and individual anomalies against the full
comparison. Separate findings into visible rendering defect, source mismatch, transformation uncertainty,
integrity risk, comprehension issue, accessibility risk, aesthetic craft issue, or expressive tradeoff using
the parent's classes where applicable.

Every source-mismatch finding names the source, transformation stage, visible target, and checked coverage.
Every no-source analysis states data correctness is unknown. Return chart findings through the parent report;
do not issue a separate chart score or verdict.

## References

- [`SKILL.md`](SKILL.md) owns shared framing, evidence classes, maps, context-first aesthetics, adversarial
  verification, finding schema, and report contract.
- [`ui.md`](ui.md) additionally applies to dashboard and application contexts.
- [`slides.md`](slides.md) additionally applies when the chart is part of a presentation slide or deck.
- [`video.md`](video.md) additionally applies to animated or time-revealed data visualizations.
- [`scenarios.md`](scenarios.md) includes source-mismatch, no-source, misleading-encoding, mixed-artifact,
  accessibility, and density cases.
- [`checklists.md`](checklists.md) contains source-boundary and handoff checks for this child.
