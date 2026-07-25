# Evaluating Workflow

This is the evaluation entrypoint for the workflow operation. It adds workflow-specific scenarios,
checks, lenses, and verifications to the general [`evaluation/SKILL.md`](../evaluation/SKILL.md) method. It does
not replace that method's causal findings, completed checks, or verdict derivation. The Gobbi workflow adapter
owns its schema, validation, aggregation, and output.

## Entry

Before reviewing a workflow artifact:

1. Read [`SKILL.md`](SKILL.md), [`scenarios.md`](scenarios.md), and [`checklists.md`](checklists.md) completely.
2. Read the changed workflow children and every external owner they claim to use.
3. Select every scenario whose Given conditions can occur in the target and every checklist item at its triggered pause point. A selection omission requires an explicit `n/a:<property>` backed by inspected evidence.
4. Add the selected cases and checks to the evaluator's locked frame. Fill a run-specific copy of the checklist source; do not edit the source.
5. Run all seven perspectives plus Overall under the active evaluation procedure.
6. Emit findings only through the existing finding ledger and validate the system report against [`../record/schemas/evaluation-report.schema.json`](../record/schemas/evaluation-report.schema.json) and [`../evaluation/scripts/validate-evaluation-report.sh`](../evaluation/scripts/validate-evaluation-report.sh).

Both fresh systems execute this entrypoint independently. Neither sees the other report before its own report freezes.

## Selection register

Every applicable item is acceptance-bearing. Perspective assignment directs attention; it never removes an item from the complete run.

| Perspective | Primary scenario families | Checklist selection |
|---|---|---|
| Project | ORCH-SCN-01, -02, -07, -08 | CFG-01..05; ROUTE-01, -03..05; WRAP-02; GIT-01..04; DOC-02, -04, -05 |
| Structure | ORCH-SCN-02, -03, -05, -06, -08 | ROUTE-01..06; WORK-01..05; DELEG-01, -04, -05; TEAM-01..05; DOC-01, -02 |
| Performance | ORCH-SCN-03, -05, -06 | WORK-06; DELEG-04; TEAM-02, -03 |
| Aesthetics | ORCH-SCN-05, -08 | DELEG-01, -02; WRAP-02; DOC-01..05 |
| Usage | ORCH-SCN-01, -02, -05, -06, -07, -08 | CFG-01, -04, -05; ROUTE-02, -04, -05; DELEG-01..05; TEAM-01..06; WRAP-02; GIT-04; DOC-03 |
| Consistency | ORCH-SCN-01..08 | CFG-02, -03, -05; ROUTE-01..06; WORK-01..05, -07; EVAL-02..07; DELEG-02..05; TEAM-02..07; REC-01, -02; WRAP-01..03; GIT-01..04; DOC-01, -02, -04, -05 |
| Risk | ORCH-SCN-01..08 | CFG-01..05; ROUTE-02..06; WORK-01..07; EVAL-01..07; DELEG-03..05; TEAM-03..07; REC-01, -02; WRAP-01..03; GIT-01..04; DOC-01, -02, -04, -05 |

The complete selected union contains every ID in the source checklist. If a target changes only one child, still select cross-child scenarios whose owner link, cursor, or delegation contract can be affected.

For mechanical selection closure, the complete ID set is:

- ORCH-CHK-CFG-01, ORCH-CHK-CFG-02, ORCH-CHK-CFG-03, ORCH-CHK-CFG-04, ORCH-CHK-CFG-05.
- ORCH-CHK-WORK-01, ORCH-CHK-WORK-02, ORCH-CHK-WORK-03, ORCH-CHK-WORK-04, ORCH-CHK-WORK-05, ORCH-CHK-WORK-06, ORCH-CHK-WORK-07.
- ORCH-CHK-EVAL-01, ORCH-CHK-EVAL-02, ORCH-CHK-EVAL-03, ORCH-CHK-EVAL-04, ORCH-CHK-EVAL-05, ORCH-CHK-EVAL-06, ORCH-CHK-EVAL-07.
- ORCH-CHK-DELEG-01, ORCH-CHK-DELEG-02, ORCH-CHK-DELEG-03, ORCH-CHK-DELEG-04, ORCH-CHK-DELEG-05.
- ORCH-CHK-TEAM-01, ORCH-CHK-TEAM-02, ORCH-CHK-TEAM-03, ORCH-CHK-TEAM-04, ORCH-CHK-TEAM-05, ORCH-CHK-TEAM-06, ORCH-CHK-TEAM-07.
- ORCH-CHK-ROUTE-01, ORCH-CHK-ROUTE-02, ORCH-CHK-ROUTE-03, ORCH-CHK-ROUTE-04, ORCH-CHK-ROUTE-05, ORCH-CHK-ROUTE-06.
- ORCH-CHK-REC-01, ORCH-CHK-REC-02.
- ORCH-CHK-WRAP-01, ORCH-CHK-WRAP-02, ORCH-CHK-WRAP-03.
- ORCH-CHK-GIT-01, ORCH-CHK-GIT-02, ORCH-CHK-GIT-03, ORCH-CHK-GIT-04.
- ORCH-CHK-DOC-01, ORCH-CHK-DOC-02, ORCH-CHK-DOC-03, ORCH-CHK-DOC-04, ORCH-CHK-DOC-05.

## Perspective lenses

### Project

Ask whether the redesign actually yields one Configuration-to-Wrap-up workflow, preserves the user's locked quality guarantees, and excludes unapproved mechanics. Trace every scope claim through ORCH-P01..P10. Verify that local worktree isolation and verified commits remain mandatory while remote actions remain conditional.

**Recommended evidence:** source-to-scenario omission sweep, changed-path allowlist, explicit deletion inventory, protected-role diff, and fresh/resume fixture outcomes.

**Anti-patterns:** accepting renamed headings while an alternate route remains; treating a runtime capability as a user outcome; adding out-of-scope cleanup to make repository-wide searches quiet.

### Structure

Ask whether one file owns each transition, storage seam, WORK mechanic, evaluation gate, delegation contract, and teammate policy. Verify thin step adapters contain only entry, dispatch inputs, user gates, completion proof, and transitions. Inspect the freeze barriers and one-writer chain as real dependency constraints.

**Recommended evidence:** claim-owner map, link graph, legal-transition matrix review, dual-work package validator, `activeDispatches` fixtures, and semantic duplicate search.

**Anti-patterns:** pointer cycles; copied schemas or directory trees; role-specific contract drift; two writers hidden behind separate runtimes; a task list acting as a second router.

### Performance

Ask whether safe parallel read-only investigation is possible without weakening ordered writes or independence. Verify persistent specialists can continue while coherent and are replaced on evidence-based triggers, with no arbitrary counter. Confirm resource pressure cannot remove required independent work or full review.

**Recommended evidence:** scheduling fixtures with several readers and two requested writers, continuation/replacement fixtures, and comparison of both runtime contracts.

**Anti-patterns:** serializing all read-only work without reason; parallel writers; keeping stale context to avoid rereads; using cost pressure to reduce rigor.

### Aesthetics

Ask whether a cold manager can scan the documents, find the exact stop condition, and follow a live owner link. Check literal terminology, stable IDs, concise progress rendering, and tables limited to true mappings or matrices.

**Recommended evidence:** heading inventory, link validation, first-response status parse, and cold-read trace from `SKILL.md` to each owner.

**Anti-patterns:** decorative language around authority; long sequential action tables; unexplained abbreviations; dead links hidden by broad exclusions; repeated ownership banners without actionable routing.

### Usage

Walk fresh start; compact, clear, resume, rewind, and another runtime context boundary; every verdict; a failed peer; a missing persistent-team capability; a lagging task status; and unmerged closeout as the actual manager. Confirm every pause presents exact choices and every recovery path names the surviving branch, worktree, artifact, or missing evidence.

For non-UI accessibility, verify heading order, scannable status, and literal prompt text. Locale-specific presentation is not applicable when the artifacts contain no localized values; inspect the target before recording that result.

**Recommended evidence:** end-to-end fixture walkthroughs, user-decision artifacts, status projection comparison, teammate handshake sequence, and handoff recovery fields.

**Anti-patterns:** asking the user to reconstruct internal state; vague “try again” recovery; completion inferred from idle; capability absence weakening the brief; a handoff that omits the first next action.

### Consistency

Compare `SKILL.md`, every workflow child, delegation, team policy, version 5 manifest settings, version 3 cursor, record command surface, validators, operation companions, and Git policy. Ensure terms, role roster, caps, runtime ownership, waiver scope, and PASS evidence agree. Validate both directions of ORCH-P → scenario → check → perspective trace.

**Recommended evidence:** scoped vocabulary search, JSON/schema/command seam reread, check-ID set comparison, link resolver, protected-role diff, and `git diff --check`.

**Anti-patterns:** one child retaining an alternate cap meaning; a lifecycle checkpoint mutating routing; a transition patch mutating settings; an item selected by no perspective; a future owner change requiring copied clauses to be synchronized.

### Risk

Challenge identity confusion, path escape, unauthorized scope, destructive Git cleanup, peer write access, same-author evidence, evaluator contamination, silent missing-system continuation, stale teammate reuse, and fake task completion. Require exact authority and recovery evidence at every killer check.

Privacy and retention review is limited to the low-frequency lifecycle fields and durable artifacts owned outside this operation; flag any workflow addition that stores unrelated runtime detail. Licensing and dependency-supply-chain checks apply only if the change introduces a dependency or copied external content; inspect the diff before using `n/a`.

**Recommended evidence:** negative record fixtures, absolute-path containment checks, process invocation arguments, identity/digest checks, waiver artifact, user authority, Git pre/post state, and byte-preservation failures.

**Anti-patterns:** waiver treated as a session-wide override; cleanup before confirmed merge; peer process writes directly; evaluator joins a persistent team; protected user work changed to satisfy a checker.

## Overall anchors

Overall must answer:

1. Can a cold manager execute the workflow from Configuration through a factual final receipt without inventing a route?
2. Do both systems contribute independent creation and independent complete review on every materially changed iteration?
3. Does any status surface, specialist, or runtime feature hold authority that belongs to `state.json`, the manager, or the user?
4. Can every accepted transition be reconstructed from durable artifacts and verification?
5. Does failure preserve prior valid bytes, exact recovery state, and user choice?
6. Is every active concern owned once, with no protected-role mutation used to conceal inconsistency?
7. Would a cosmetically conformant but semantically old workflow fail the scenario set and checklist?

The Overall verdict cannot be PASS when any applicable killer or required item is not PASS, subject only to the checklist skill's narrow operational exception rule. Coverage-closed is not accepted.

## Rule-key crosswalk

| Parent clause | Scenario evidence | Checklist evidence | Primary perspectives |
|---|---|---|---|
| ORCH-P01 | ORCH-SCN-01-A..D | CFG-01..05 | Project, Usage, Consistency, Risk |
| ORCH-P02 | ORCH-SCN-02-A..E | ROUTE-01..06 | Project, Structure, Usage, Consistency, Risk |
| ORCH-P03 | ORCH-SCN-03-A..F | WORK-01..07 | Structure, Performance, Consistency, Risk |
| ORCH-P04 | ORCH-SCN-04-A..F | EVAL-01..07, WORK-07 | Project, Consistency, Risk |
| ORCH-P05 | ORCH-SCN-05-A..E | DELEG-01..05 | Structure, Aesthetics, Usage, Consistency, Risk |
| ORCH-P06 | ORCH-SCN-06-A..F | TEAM-01..07, DELEG-04 | Structure, Performance, Usage, Consistency, Risk |
| ORCH-P07 | ORCH-SCN-02-A..E, ORCH-SCN-07-A | REC-01, REC-02, ROUTE-01..06 | Project, Structure, Consistency, Risk |
| ORCH-P08 | ORCH-SCN-07-A..C | WRAP-01..03 | Project, Aesthetics, Usage, Consistency, Risk |
| ORCH-P09 | ORCH-SCN-07-D..F | GIT-01..04 | Project, Usage, Consistency, Risk |
| ORCH-P10 | ORCH-SCN-08-A..E | DOC-01..05 | Project, Structure, Aesthetics, Usage, Consistency, Risk |

## Completion

The workflow-specific review is complete when every applicable scenario and checklist item is present in the locked frame, both source-to-check and check-to-source traces close, all seven perspectives and Overall have inspected their assigned evidence, the normal evaluation report validates, and any non-PASS check has a finding or authorized resolution permitted by the checklist owner. No extra evaluator artifact is created.
