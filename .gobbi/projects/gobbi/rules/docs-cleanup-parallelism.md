# Docs-cleanup parallelism

When the task is a small docs-cleanup batch — 3 to 5 related markdown files, under ~200 lines of cumulative diff — prefer a **single sequential `gobbi-agent`** over parallel executors. Context consistency across the batch is worth more than the wall-clock savings of parallel execution.

---

## Why

Parallel executors produce divergent terminology when the concepts touched are interconnected. PR #104's docs cleanup touched `_collection`, `_delegation`, `_research` — three skills whose semantics reference each other (research output location, collection's dependence on subdirectory naming, delegation's handoff paths). A single agent holding all three files in working context converges on consistent substitutions ("Ideation Investigation Delegation", "investigation findings", `ideation/` paths). Three parallel agents would have made different local choices — one might keep "Research Step" as a header while another removes it — leaving a patchwork that requires a follow-up remediation pass to reconcile.

The same trade-off does not apply to code PRs like #103's CLI velocity bundle: three TypeScript changes with non-overlapping files, no cross-file semantic links, three parallel executors were the right call.

---

## When to apply

- Rewriting shared vocabulary across interconnected skills
- Renaming a concept (step name, path convention, component name) where every occurrence must agree
- Small backlog edits plus the skill or docs they reference
- Gotcha migrations where source and destination must stay in sync

---

## When NOT to apply

- Code changes with non-overlapping file targets and no shared vocabulary (parallel is faster with no cost)
- Large rewrites where a single agent would exceed comfortable context budget (split by coherent chunks, each handled by its own agent)
- Genuinely independent sub-tasks that touch different subsystems (delegate separately)

---

## Related

See `_delegation` for the general delegation principles and the "When to split vs combine" judgment call. See `_plan` for how to decide task boundaries during Planning. This rule narrows the split-vs-combine judgment for the specific case of docs-cleanup batches — the default should be combine.
