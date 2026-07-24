# Planning Evaluation Entry

Use this entrypoint with [evaluation/SKILL.md](../evaluation/SKILL.md). It supplies Planning-specific lenses for the single complete report and adds no output or verdict rule.

## Required inputs

- canonical Ideation artifact and complete accepted obligation set;
- Planning readiness evidence and canonical plan synthesis;
- both Planning drafts and reciprocal reviews;
- resolved decisions, approved dispositions, rules, mistakes, repository state, and external-write authority;
- [scenarios.md](scenarios.md) and [checklists.md](checklists.md); and
- dependency graph, task contracts, and dual-work validation evidence.

## Perspective lenses

### Project

Compare the whole plan to locked Ideation. Test readiness, bidirectional obligation coverage, exact scope, user-approved deferrals, and absence of adjacent work. A material upstream gap must route upstream rather than being repaired in Planning.

### Structure

Test task boundaries, canonical field completeness, DAG correctness, one writer chain, role and skill fit, shared resources, high-blast isolation, and coherent intermediate states.

### Performance

Trace every Ideation resource, capacity, external-call, and cost commitment to isolated tasks and runnable measurements. Inspect plan-level multiplication of paid or slow checks.

### Aesthetics

Test stable task IDs, imperative titles, consistent fields and paths, execution order, readable graph, absence of placeholders, and whether mechanical detail hides the task outcome.

### Usage

Read tasks individually as fresh executors. Test inputs, outputs, file anchors, commands, required reads, failure routes, decisions, and terms without parent-session context.

### Consistency

Compare traces, requires, files, literal input/output names, skills, authority, verification, readiness evidence, and cumulative scope across tasks. Search for dangling references and forward assumptions.

### Risk

Test rollback, interruption, migrations, public surfaces, destructive and external actions, sensitive data, dependencies, license, compatibility, shared state, cost, and source-before-delete proof.

### Overall

Challenge wrong infrastructure assumptions, unnecessary task or abstraction layers, bundled unrelated concerns, overly prescriptive diffs, and a plan whose local task quality hides aggregate risk. Preserve sharp boundaries, runnable checks, and explicit dependencies.

## Recommended verification

Use direct reads and safe commands: diff Ideation obligations against task traces; topologically sort requires edges; compare file and resource sets; resolve every skill and path; inspect each task alone; run placeholder and dangling-trace searches; test exact verification commands where read-only; and construct a cosmetic-compliance result.

## Rule crosswalk

| Parent rules | Primary report coverage |
|---|---|
| P-1, P-2, P-3 | Project, Consistency |
| P-4, P-5, P-6 | Structure, Usage, Consistency |
| P-7, P-8, P-9 | Structure, Risk |
| P-10 | Consistency, Risk |
| P-11 | All perspectives and completed checklist |
| P-12, P-13, P-14 | Structure, Performance, Risk |

Every applicable PLAN-CK item appears in the report checklist. A material plan revision receives a complete new report from a fresh evaluator.
