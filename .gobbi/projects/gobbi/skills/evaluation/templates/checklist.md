# {Target} Working Checklist

> **Document role:** Evaluation-owned working checklist for one frozen target. Not a reusable source. Do not copy into a skill.<br>
> **Target:** {Exact artifact, state, version, or content hash}<br>
> **Frozen at:** {Version, hash, or observed state}<br>
> **Evaluator:** {Evaluator identity and runtime}<br>
> **Criteria:** {Caller-supplied criteria source or `None supplied`}<br>
> **Report:** {Absolute path of the sibling report.md}<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.<br>
> **Result meaning:** Every item has `problem-present`, `no-problem-found`, `not-applicable` with a reason, or `evidence-insufficient`.

Check the box only for `problem-present` and name that Problem in `report.md`. An empty
checkbox is not `no-problem-found`. `not-applicable` needs a subject reason.
`evidence-insufficient` cites missing evidence, adds a Gaps row in `report.md`, and is not
`not-applicable`.

When no applicable items exist, keep this header plus Sources, Coverage, Additions, and
Limits, and state the no-applicable-items reason in Limits. Do not invent items.

## Sources

| Source | Items reused | Items excluded | Why excluded |
|---|---|---|---|
| `{source identity}` | `{item wording or heading path}` | `{item wording or heading path, or None}` | `{reason, or n/a}` |

## Coverage

Copy each reused source's coverage account as a claim. For each row, record the re-challenge
outcome. Never add an item to turn a source row into Covered.

| Source | Account row | Source claim | Re-challenge |
|---|---|---|---|
| `{source identity}` | `{prompt or stage}` | `{Covered / Not applicable / Evidence gap, as claimed by the source}` | `{Confirmed / Item added ({study evidence}) / Gap recorded}` |

When a reused source has no account, record that absence under Limits and still run the
Checklist spectrum and stage challenge against the frozen target. Do not invent a source
account.

## Additions

| Item | Study evidence | Scenario joined |
|---|---|---|
| `{added item wording}` | `{internal or external source and why it applies}` | `{lifecycle > category > scenario}` |

{State `None` when no item was added.}

## Project Lifecycle

{Copy reused Project headings that contribute items. Inline each item's exact wording;
heading path alone is not enough. Omit this lifecycle when it contributes no item.}

### {Category}

#### {Expected scenario}

- [ ] {Exact source or added item wording, inlined}
  Result: `{problem-present | no-problem-found | not-applicable | evidence-insufficient}`
  Evidence: {path, line, observation, missing-evidence note, or not-applicable reason}
  Problem: {report.md title when Result is `problem-present`; otherwise omit}

{Repeat category and scenario headings as needed, using the same item encoding.}

## Design and Development Lifecycle

{Copy reused Design and Development headings that contribute items, using the same item
encoding. Omit this lifecycle when it contributes no item.}

### {Category}

#### {Expected scenario}

- [ ] {Exact source or added item wording, inlined}
  Result: `{problem-present | no-problem-found | not-applicable | evidence-insufficient}`
  Evidence: {path, line, observation, missing-evidence note, or not-applicable reason}
  Problem: {report.md title when Result is `problem-present`; otherwise omit}

{Repeat category and scenario headings as needed.}

## Product Lifecycle

{Copy reused Product headings that contribute items, using the same item encoding. Omit this
lifecycle when it contributes no item.}

### {Category}

#### {Expected scenario}

- [ ] {Exact source or added item wording, inlined}
  Result: `{problem-present | no-problem-found | not-applicable | evidence-insufficient}`
  Evidence: {path, line, observation, missing-evidence note, or not-applicable reason}
  Problem: {report.md title when Result is `problem-present`; otherwise omit}

{Repeat category and scenario headings as needed.}

## Limits

{Unavailable sources, ambiguous items, missing accounts, coverage the evaluation could not
reach, the no-applicable-items reason when the item list is empty, or `None`.}
