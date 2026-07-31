# Workflow Operational Checklist

## Source contract

- **Purpose:** prevent unsafe omission while a manager operates or accepts the workflow.
- **Owner:** workflow skill.
- **Consumer:** manager for operational gates; evaluator as scenario-derived acceptance evidence.
- **Mode:** operational.
- **Source version:** `orch-v2`; this file is the unchecked source and is never filled in place.
- **Run rule:** copy this file for each run, identify the run and source version, and declare the listed use style at each pause point.
- **Applicability:** the active pause point selects its checks; a conditional item may resolve `n/a:<property>` only after inspecting evidence that its predicate is false.
- **Resolution tokens:** `PASS`, `FAIL:<finding/action-id>`, `n/a:<property>`, `recorded-open:<owner+resolution-method>`, and `waived/exception-authorized:<authority+rationale>` where the checklist skill permits them. The source remains `[ ]`.
- **Coverage closure:** every gate and required item at the active pause point has a permitted terminal resolution.
- **Acceptance:** every applicable gate and required item is `PASS`, except a killer may use the checklist skill's narrowly authorized operational exception. Coverage closure alone is not acceptance.
- **Evidence rule:** inspect and cite the named evidence before resolving an item. A label, intent, task status, or specialist report alone is insufficient.

## Pause point A — Before fresh initialization or resume

**Run use style:** `read-do`.

- [ ] **ORCH-CHK-CFG-01** `[gate/killer, read-do]` No session-tree mutation occurs before a fresh user's defaults decision.
  - **Applicability:** conditional — current-worktree preflight found no unfinished session.
  - **Source:** ORCH-P01; ORCH-SCN-01-A.
  - **Pass condition:** read-only preflight and one defaults display precede the exact “use defaults or customize?” decision; the session path does not exist before it.
  - **Evidence:** command/write trace plus path preimage and post-decision timestamp.
  - **On fail:** consequence — user settings and isolation may be created without authority; stop initialization and restore the verified preimage.
  - **Resolution:** ______

- [ ] **ORCH-CHK-CFG-02** `[gate/killer, read-do]` The Gobbi UUID exists before branch and worktree creation.
  - **Applicability:** conditional — fresh session.
  - **Source:** ORCH-P01; ORCH-SCN-01-A.
  - **Pass condition:** branch/worktree identity contains the already generated Gobbi UUID and does not use a runtime ID as session identity.
  - **Evidence:** UUID generation result, Git creation command, and manifest reread.
  - **On fail:** consequence — session identity becomes unstable across runtime boundaries; stop and recreate only after resolving the correct identity.
  - **Resolution:** ______

- [ ] **ORCH-CHK-CFG-03** `[gate/killer, read-do]` Fresh initialization produces record-command-valid version 5 and version 3 files in the isolated worktree.
  - **Applicability:** conditional — fresh session after the defaults decision.
  - **Source:** ORCH-P01; ORCH-SCN-01-A.
  - **Pass condition:** `init` succeeds, both files reread with expected identity/settings/cursor, and `verify` succeeds.
  - **Evidence:** command exits and exact file rereads from the absolute session root.
  - **On fail:** consequence — no durable recovery or routing authority exists; halt before Ideation.
  - **Resolution:** ______

- [ ] **ORCH-CHK-CFG-04** `[gate/killer, read-do]` Resume classification uses only the current worktree or an explicit path and handles zero/one/many exactly.
  - **Applicability:** unconditional.
  - **Source:** ORCH-P01; ORCH-SCN-01-B, ORCH-SCN-01-D.
  - **Pass condition:** zero permits fresh start, exactly one resumes, and many require user selection; no outside worktree or global pointer is searched automatically.
  - **Evidence:** preflight path list and route decision.
  - **On fail:** consequence — the wrong session may be mutated; halt before any checkpoint or worktree write.
  - **Resolution:** ______

- [ ] **ORCH-CHK-CFG-05** `[required, read-do]` A context-boundary checkpoint preserves the Gobbi UUID and appends only distinct runtime IDs in observation order.
  - **Applicability:** conditional — compact, clear, resume, rewind, or another runtime context boundary occurred.
  - **Source:** ORCH-P01; ORCH-SCN-01-C.
  - **Pass condition:** UUID and settings match the preimage; the observed ID is present exactly once at the list tail if new.
  - **Evidence:** before/after manifest digest, JSON inspection, and record verification.
  - **On fail:** stop continuation and open an identity-integrity finding.
  - **Resolution:** ______

## Pause point B — Before EVALUATION begins

**Run use style:** `do-confirm`.

- [ ] **ORCH-CHK-WORK-01** `[gate/killer, do-confirm]` Claude and Codex received the same neutral WORK contract through symmetric runtime paths.
  - **Applicability:** unconditional for every WORK iteration.
  - **Source:** ORCH-P03; ORCH-SCN-03-A, ORCH-SCN-03-B.
  - **Pass condition:** both contracts have matching objective, scope, frozen inputs, step/iteration/task, and acceptance criteria; the opposite peer is read-only and ephemeral.
  - **Evidence:** contract digests, invocation arguments, and peer identity record.
  - **On fail:** consequence — independence or comparability is invalid; halt WORK and rebuild the affected operation.
  - **Resolution:** ______

- [ ] **ORCH-CHK-WORK-02** `[gate/killer, do-confirm]` Both independent drafts froze before either contributor received the other draft.
  - **Applicability:** unconditional for every WORK iteration without a valid narrow waiver.
  - **Source:** ORCH-P03; ORCH-SCN-03-A, ORCH-SCN-03-B, ORCH-SCN-03-C.
  - **Pass condition:** two nonempty, correctly labeled draft identities and freeze digests precede cross-review dispatch timestamps.
  - **Evidence:** artifact metadata, digests, and dispatch order.
  - **On fail:** consequence — independent evidence is contaminated; discard the affected iteration inputs and halt for a fresh run.
  - **Resolution:** ______

- [ ] **ORCH-CHK-WORK-03** `[gate/killer, do-confirm]` Synthesis began only after both reciprocal reviews validated.
  - **Applicability:** unconditional for every WORK iteration without a valid narrow waiver.
  - **Source:** ORCH-P03; ORCH-SCN-03-A..C.
  - **Pass condition:** Claude-on-Codex and Codex-on-Claude reports are nonempty, identity-valid, frozen, and earlier than synthesis.
  - **Evidence:** rendered artifacts, metadata, and order trace.
  - **On fail:** consequence — canonical selection lacks reciprocal challenge; halt and rerun from the earliest invalid barrier.
  - **Resolution:** ______

- [ ] **ORCH-CHK-WORK-04** `[gate/killer, do-confirm]` The work-package validator rejects forged or structurally invalid evidence and accepts the current complete package.
  - **Applicability:** unconditional for every WORK iteration.
  - **Source:** ORCH-P03; ORCH-SCN-03-D.
  - **Pass condition:** current package passes; negative fixtures for missing, empty, malformed, wrong-system, stale, extra, mislabeled, and same-author artifacts fail without changing prior valid bytes.
  - **Evidence:** validator exits, artifact digest pre/post, and current package result.
  - **On fail:** consequence — invalid evidence can reach acceptance; halt EVALUATION entry and open a blocker.
  - **Resolution:** ______

- [ ] **ORCH-CHK-WORK-05** `[gate/killer, do-confirm]` The active runtime's specialist owns synthesis and every material open decision is resolved by proper authority.
  - **Applicability:** unconditional for every WORK iteration.
  - **Source:** ORCH-P03; ORCH-SCN-03-A, ORCH-SCN-03-B.
  - **Pass condition:** synthesis owner matches active runtime; decision artifact contains no unresolved material item; each material resolution cites the user decision.
  - **Evidence:** active runtime field, synthesis metadata, decisions reread, and user-decision evidence.
  - **On fail:** consequence — canonical artifact may contain unauthorized direction; halt before evaluation.
  - **Resolution:** ______

- [ ] **ORCH-CHK-WORK-06** `[required, do-confirm]` Resource pressure did not remove required independent work, Ideation breadth, or review coverage.
  - **Applicability:** unconditional.
  - **Source:** ORCH-P03; ORCH-SCN-03-E.
  - **Pass condition:** current contract retains two independent drafts, both reciprocal reviews, and full evaluation requirements unless a valid narrow failure waiver applies.
  - **Evidence:** contract and decision artifact comparison.
  - **On fail:** stop entry and open a workflow-rigor finding.
  - **Resolution:** ______

- [ ] **ORCH-CHK-WORK-07** `[gate/killer, do-confirm]` Any missing-system waiver is explicit, system/step/iteration-limited, durable, and linked from the final outcome contract.
  - **Applicability:** conditional — one required system operation failed after safe bounded recovery.
  - **Source:** ORCH-P03, ORCH-P04; ORCH-SCN-03-F, ORCH-SCN-04-F.
  - **Pass condition:** exact failure is preserved; named user authority covers only the current system, step, and iteration; the durable decision and outcome link exist.
  - **Evidence:** error result, user decision, material decision artifact, and manifest candidate.
  - **On fail:** consequence — single-system evidence could silently pass; halt the current stage.
  - **Resolution:** ______

## Pause point C — Before RECORD begins

**Run use style:** `do-confirm`.

- [ ] **ORCH-CHK-EVAL-01** `[gate/killer, do-confirm]` Two evaluator identities are fresh, outside persistent teams, independent of creators, and isolated from each other.
  - **Applicability:** unconditional unless ORCH-CHK-WORK-07 holds for one missing system.
  - **Source:** ORCH-P04; ORCH-SCN-04-A.
  - **Pass condition:** assignment identities are new for this iteration, creator identities differ, roster excludes evaluators, and neither prompt contains the other report.
  - **Evidence:** assignments, roster, and prompt digests.
  - **On fail:** consequence — acceptance is biased or contaminated; discard affected reports and halt.
  - **Resolution:** ______

- [ ] **ORCH-CHK-EVAL-02** `[gate/killer, do-confirm]` Each evaluator received the complete creation, scope, decision, scenario, checklist, plan, and verification bundle applicable to the target.
  - **Applicability:** unconditional for every evaluation.
  - **Source:** ORCH-P04; ORCH-SCN-04-A.
  - **Pass condition:** both bundle inventories match and contain the canonical synthesis, two drafts, two cross-reviews, resolved decisions, and all applicable evidence.
  - **Evidence:** bundle manifests and digests.
  - **On fail:** consequence — verdicts are not comparable or informed; halt and rerun the incomplete evaluator.
  - **Resolution:** ______

- [ ] **ORCH-CHK-EVAL-03** `[gate/killer, do-confirm]` Both reports pass the evaluation-owned schema and validator with all seven perspectives, Overall, ledger, checklist, and verdict.
  - **Applicability:** unconditional unless a valid narrow waiver covers one report.
  - **Source:** ORCH-P04; ORCH-SCN-04-A, ORCH-SCN-04-F.
  - **Pass condition:** validators succeed and required sections occur exactly once in each report.
  - **Evidence:** validator exits and report parse summaries.
  - **On fail:** consequence — incomplete review could authorize routing; halt before aggregation.
  - **Resolution:** ______

- [ ] **ORCH-CHK-EVAL-04** `[gate/killer, do-confirm]` Aggregate verdict equals the most severe valid system verdict and PASS has the required two PASS results.
  - **Applicability:** unconditional.
  - **Source:** ORCH-P04; ORCH-SCN-04-A, ORCH-SCN-04-B.
  - **Pass condition:** deterministic aggregation yields FAIL > REVISE > PASS with no runtime preference or averaging.
  - **Evidence:** report verdicts and aggregation calculation.
  - **On fail:** consequence — unsafe acceptance or wrong routing; halt before state mutation.
  - **Resolution:** ______

- [ ] **ORCH-CHK-EVAL-05** `[required, do-confirm]` Deduplicated findings retain both provenances and preserve distinct root-cause hypotheses.
  - **Applicability:** conditional — one or more findings exist.
  - **Source:** ORCH-P04; ORCH-SCN-04-C.
  - **Pass condition:** only same-symptom/same-cause entries merge; merged records cite both systems; different causes remain separate.
  - **Evidence:** per-system ledgers and aggregate ledger comparison.
  - **On fail:** stop RECORD and open a finding-integrity action.
  - **Resolution:** ______

- [ ] **ORCH-CHK-EVAL-06** `[gate/killer, do-confirm]` The user approved or edited one complete recommended finding-disposition batch before any revision or RECORD transition.
  - **Applicability:** unconditional, including an empty batch acknowledgement.
  - **Source:** ORCH-P04; ORCH-SCN-04-D.
  - **Pass condition:** every finding ID appears once with provenance, evidence, recommendation, and user resolution; no earlier writer activity occurred.
  - **Evidence:** batch decision artifact, finding ID set, and write/state trace.
  - **On fail:** consequence — review findings bypass user authority; halt and restore the pre-gate state.
  - **Resolution:** ______

- [ ] **ORCH-CHK-EVAL-07** `[gate/killer, do-confirm]` A materially revised artifact has two complete new reports and fresh evidence for addressed or superseded findings.
  - **Applicability:** conditional — iteration is greater than 1 because the canonical artifact materially changed.
  - **Source:** ORCH-P04; ORCH-SCN-04-E.
  - **Pass condition:** evaluator IDs and report digests differ from prior iteration; all perspectives reran; changed dispositions cite fresh evidence.
  - **Evidence:** iteration comparison and finding ledger.
  - **On fail:** consequence — stale acceptance is reused after change; halt before RECORD.
  - **Resolution:** ______

## Pause point D — Before any specialist assignment

**Run use style:** `read-do`.

- [ ] **ORCH-CHK-DELEG-01** `[gate/killer, read-do]` A first assignment contains all shared skeleton sections in order and a self-contained primary contract.
  - **Applicability:** unconditional for a fresh specialist; conditional false for a verified continuation delta brief.
  - **Source:** ORCH-P05; ORCH-SCN-05-A, ORCH-SCN-05-B.
  - **Pass condition:** workflow context through status contract are present; no essential objective, scope, or acceptance criterion is only an external pointer.
  - **Evidence:** delegation parse against the twelve headings.
  - **On fail:** consequence — specialist must guess and may exceed authority; do not dispatch.
  - **Resolution:** ______

- [ ] **ORCH-CHK-DELEG-02** `[required, read-do]` Ordered load directives name exact canonical paths and the specialist reports those paths in read order.
  - **Applicability:** unconditional for fresh dispatch; continuation names only required rereads plus changed loads.
  - **Source:** ORCH-P05; ORCH-SCN-05-A.
  - **Pass condition:** principles, rules, role, productive-step skill, task skills, and primary artifacts are exact and ordered.
  - **Evidence:** brief load list and response `SKILLS LOADED` comparison.
  - **On fail:** stop acceptance and request exact load evidence.
  - **Resolution:** ______

- [ ] **ORCH-CHK-DELEG-03** `[gate/killer, read-do]` Scope, authority, write roots, and stop points reserve manager and user decisions.
  - **Applicability:** unconditional.
  - **Source:** ORCH-P05; ORCH-SCN-05-C.
  - **Pass condition:** in/out scope, CRUD grants, absolute roots, protected paths, and escalation cases are explicit; no specialist can self-authorize expansion, acceptance, reassignment, destruction, or publication.
  - **Evidence:** delegation sections and active scope contract.
  - **On fail:** consequence — unauthorized or destructive mutation is possible; do not dispatch.
  - **Resolution:** ______

- [ ] **ORCH-CHK-DELEG-04** `[gate/killer, read-do]` Dispatch scheduling grants at most one writer while allowing only bounded read-only parallel work.
  - **Applicability:** unconditional when another dispatch is active.
  - **Source:** ORCH-P05, ORCH-P06; ORCH-SCN-05-D.
  - **Pass condition:** active dispatch contracts show no overlapping write grants; parallel work is limited to research, facts, hypotheses, or critique.
  - **Evidence:** `activeDispatches`, briefs, and write-root grants.
  - **On fail:** consequence — race or ambiguous ownership may corrupt the tree; halt the new dispatch.
  - **Resolution:** ______

- [ ] **ORCH-CHK-TEAM-01** `[required, read-do]` Persistent-specialist use matches current Claude Code lifecycle and lazy roster rules.
  - **Applicability:** conditional — Claude Code Agent Teams available.
  - **Source:** ORCH-P06; ORCH-SCN-06-A.
  - **Pass condition:** one implicit session team, in-process default, lazy predictable leader/executor/assistant, no manual cleanup dependency, and no evaluator membership.
  - **Evidence:** runtime capability/roster plus official contract citation.
  - **On fail:** use fresh specialists and open a scheduling-contract action.
  - **Resolution:** ______

- [ ] **ORCH-CHK-TEAM-06** `[required, read-do]` Direct messages are limited to assigned research, factual handoff, and critique.
  - **Applicability:** conditional — direct teammate messaging is planned.
  - **Source:** ORCH-P06; ORCH-SCN-06-F.
  - **Pass condition:** message contract cannot change scope, decide for the user, reassign, accept work, authorize destruction/publication, or transition durable state.
  - **Evidence:** message brief and authority section.
  - **On fail:** route the message through the manager and reject the prohibited action.
  - **Resolution:** ______

- [ ] **ORCH-CHK-TEAM-07** `[gate/killer, read-do]` Evaluators are excluded from persistent teams.
  - **Applicability:** unconditional for evaluator dispatch; otherwise `n/a:<no evaluator dispatch>` after roster inspection.
  - **Source:** ORCH-P04, ORCH-P06; ORCH-SCN-06-F.
  - **Pass condition:** evaluator assignment is fresh and roster contains no evaluator identity.
  - **Evidence:** assignment kind and roster.
  - **On fail:** consequence — review independence is invalid; remove the assignment and dispatch fresh.
  - **Resolution:** ______

## Pause point E — Before accepting a report or sending a follow-up

**Run use style:** `do-confirm`.

- [ ] **ORCH-CHK-DELEG-05** `[gate/killer, do-confirm]` Manager acceptance rereads and verifies every promised artifact or commit after the structured report.
  - **Applicability:** unconditional after a specialist report.
  - **Source:** ORCH-P05; ORCH-SCN-05-E.
  - **Pass condition:** status fields match assignment; on-disk artifact/commit exists and passes named verification in the exact worktree.
  - **Evidence:** response, filesystem/Git reread, and verifier outputs.
  - **On fail:** consequence — false completion may advance durable state; halt acceptance and use the bounded escape path.
  - **Resolution:** ______

- [ ] **ORCH-CHK-TEAM-02** `[required, do-confirm]` Executor continuation is based on coherent role, subsystem, dependency chain, scope, and reliable context rather than a task counter.
  - **Applicability:** conditional — same executor is considered for another task.
  - **Source:** ORCH-P06; ORCH-SCN-06-B.
  - **Pass condition:** all coherence predicates hold and the delta brief restates current scope, evidence, expected artifact, and status contract.
  - **Evidence:** adjacent task contracts, prior verification, teammate identity, and delta brief.
  - **On fail:** start a replacement with the full brief.
  - **Resolution:** ______

- [ ] **ORCH-CHK-TEAM-03** `[gate/killer, do-confirm]` Any subsystem change, context drift, failure, lost addressability, or independence need creates a fully primed replacement.
  - **Applicability:** conditional — any replacement trigger is observed.
  - **Source:** ORCH-P06; ORCH-SCN-06-C.
  - **Pass condition:** old identity receives no new work; replacement acknowledges the full stable assignment and durable inputs.
  - **Evidence:** trigger, roster/identity, full brief, and acknowledgement.
  - **On fail:** consequence — stale context can mutate current scope; halt follow-up.
  - **Resolution:** ______

- [ ] **ORCH-CHK-TEAM-04** `[gate/killer, do-confirm]` Follow-up occurs only after report, idle/addressable confirmation, artifact reread, verification, and state completion.
  - **Applicability:** conditional — a teammate may receive another brief.
  - **Source:** ORCH-P06; ORCH-SCN-06-B, ORCH-SCN-06-E.
  - **Pass condition:** all handshake evidence exists; idle or shared task status alone has not changed completion.
  - **Evidence:** message order, runtime status, artifact reread, and durable state.
  - **On fail:** consequence — assignments overlap or false completion propagates; stop follow-up.
  - **Resolution:** ______

- [ ] **ORCH-CHK-TEAM-05** `[gate/killer, do-confirm]` Runtime context-boundary recovery verifies identity, assignment, addressability, and idle state or fully re-primes a replacement.
  - **Applicability:** conditional — compact, clear, resume, rewind, or another runtime context boundary occurred.
  - **Source:** ORCH-P06; ORCH-SCN-06-D.
  - **Pass condition:** four-part verification supports continuation; otherwise a new identity loads canonical durable artifacts before work.
  - **Evidence:** state, runtime task list, roster/address response, and acknowledgement.
  - **On fail:** consequence — work may be sent to a dead or stale context; halt scheduling.
  - **Resolution:** ______

## Pause point F — Before every visible state transition

**Run use style:** `do-confirm`.

- [ ] **ORCH-CHK-ROUTE-01** `[gate/killer, do-confirm]` The candidate follows the legal step and DISCUSSION → WORK → EVALUATION → RECORD order.
  - **Applicability:** unconditional for a transition.
  - **Source:** ORCH-P02; ORCH-SCN-02-A.
  - **Pass condition:** current and candidate cursors form one legal matrix row and required evidence exists.
  - **Evidence:** state preimage, patch, transition matrix, and artifact proof.
  - **On fail:** consequence — work can skip a mandatory gate; reject the patch and halt the visible transition.
  - **Resolution:** ______

- [ ] **ORCH-CHK-ROUTE-02** `[gate/killer, do-confirm]` The atomic state transition succeeds and rereads before progress is announced or projected.
  - **Applicability:** unconditional for a transition.
  - **Source:** ORCH-P02; ORCH-SCN-02-A.
  - **Pass condition:** record command accepts the patch, persisted state rereads as intended, then concise status and runtime task projection match it.
  - **Evidence:** command result, state reread, and rendered cursor.
  - **On fail:** consequence — user and scheduler may observe nonexistent state; retain prior visible cursor and halt.
  - **Resolution:** ______

- [ ] **ORCH-CHK-ROUTE-03** `[gate/killer, do-confirm]` REVISE below cap starts a complete next iteration and reuses no prior acceptance evidence.
  - **Applicability:** conditional — aggregate REVISE and current iteration below cap.
  - **Source:** ORCH-P02, ORCH-P04; ORCH-SCN-02-B.
  - **Pass condition:** RECORD is sealed, user batch approved, iteration increments once, and next cursor is DISCUSSION with full WORK/EVALUATION requirements.
  - **Evidence:** verdict, record verify, decision artifact, and candidate state.
  - **On fail:** consequence — partial revision may bypass independent review; reject transition.
  - **Resolution:** ______

- [ ] **ORCH-CHK-ROUTE-04** `[gate/killer, do-confirm]` A REVISE at cap halts before another iteration; extension checkpoints settings before creating only newly authorized structure.
  - **Applicability:** conditional — current iteration equals cap and verdict is REVISE, or user extends cap.
  - **Source:** ORCH-P02; ORCH-SCN-02-B, ORCH-SCN-02-E.
  - **Pass condition:** no beyond-cap path exists before decision; extension order is checkpoint → new iteration scaffold → verify → transition.
  - **Evidence:** manifest/state preimages, user decision, command order, and directory diff.
  - **On fail:** consequence — unauthorized work or malformed record is created; halt and restore prior bytes.
  - **Resolution:** ______

- [ ] **ORCH-CHK-ROUTE-05** `[gate/killer, do-confirm]` FAIL halts without automatic iteration and any return resets only invalidated forward progress while preserving evidence.
  - **Applicability:** conditional — aggregate FAIL or user-authorized return to Ideation.
  - **Source:** ORCH-P02; ORCH-SCN-02-C.
  - **Pass condition:** halted state precedes user choice; retained/reset completion sets match the explicit invalidation decision; old artifacts remain.
  - **Evidence:** verdict, state snapshots, user decision, and artifact inventory.
  - **On fail:** consequence — unsafe work advances or valid evidence is destroyed; reject transition.
  - **Resolution:** ______

- [ ] **ORCH-CHK-ROUTE-06** `[gate/killer, do-confirm]` Runtime task projection cannot write back or override durable state and artifact evidence.
  - **Applicability:** unconditional.
  - **Source:** ORCH-P02; ORCH-SCN-02-D.
  - **Pass condition:** divergence rebuilds the runtime view from state; state digest changes only through a valid transition patch.
  - **Evidence:** state digest, projection input/output, and transition history.
  - **On fail:** consequence — a second router can forge progress; stop scheduling and restore the durable projection.
  - **Resolution:** ______

- [ ] **ORCH-CHK-REC-01** `[gate/killer, do-confirm]` Manager reread and record verification prove artifact placement, task coverage, and verdict consistency.
  - **Applicability:** unconditional after RECORD reports and before transition.
  - **Source:** ORCH-P07; ORCH-SCN-02-A, ORCH-SCN-07-A.
  - **Pass condition:** promised artifacts reread, `verify` succeeds with tasks when applicable, and canonical outputs exist only on PASS.
  - **Evidence:** assistant report, artifact reads, task file, and verifier output.
  - **On fail:** consequence — invalid record may become durable routing evidence; keep the cursor at RECORD.
  - **Resolution:** ______

- [ ] **ORCH-CHK-REC-02** `[required, do-confirm]` Typed staging contains only evidence-supported candidates and may be empty on clean PASS.
  - **Applicability:** unconditional after PASS RECORD.
  - **Source:** ORCH-P07; ORCH-SCN-07-A.
  - **Pass condition:** every staged file traces to evidence; no filler artifact exists; empty staging is accepted when the evidence ledger has no candidate.
  - **Evidence:** staging inventory joined to source evidence and finding dispositions.
  - **On fail:** stop transition and remove only unsupported candidate through the record owner.
  - **Resolution:** ______

## Pause point G — Before Wrap-up PASS and Git finalization

**Run use style:** `do-confirm`.

- [ ] **ORCH-CHK-WRAP-01** `[gate/killer, do-confirm]` Every changed durable path has exactly one frozen manifest row and a typed staging source; prior staging bytes are unchanged.
  - **Applicability:** conditional — Wrap-up changes durable memory; otherwise `n/a:<no durable memory change>` after tree inspection.
  - **Source:** ORCH-P08; ORCH-SCN-07-B.
  - **Pass condition:** source-to-manifest-to-destination join is complete and one-to-one for changed paths; source digests match preimages.
  - **Evidence:** staging/preimage digests, manifest, and Git diff.
  - **On fail:** consequence — unowned memory mutation can ship; halt Wrap-up and restore the pre-promotion tree.
  - **Resolution:** ______

- [ ] **ORCH-CHK-WRAP-02** `[gate/killer, do-confirm]` Session and durable handoff bodies match and every required completion claim cites evidence.
  - **Applicability:** unconditional for Wrap-up.
  - **Source:** ORCH-P08; ORCH-SCN-07-B.
  - **Pass condition:** body digests match; scope, completed work, evaluation/dispositions/waiver, decisions, memory, Git plan, unresolved items, risks, and exact next start point are complete.
  - **Evidence:** both files, body digest, and claim-to-evidence trace.
  - **On fail:** consequence — next-session memory is incomplete or contradictory; halt PASS.
  - **Resolution:** ______

- [ ] **ORCH-CHK-WRAP-03** `[gate/killer, do-confirm]` Both fresh evaluators inspected the actual post-promotion tree and handoff.
  - **Applicability:** unconditional for Wrap-up evaluation.
  - **Source:** ORCH-P08; ORCH-SCN-07-C.
  - **Pass condition:** report evidence names actual changed paths and handoff; any material post-review change triggers a full new iteration.
  - **Evidence:** evaluator bundles, report evidence, and final tree digest.
  - **On fail:** consequence — intended and actual memory can diverge unnoticed; halt finalization.
  - **Resolution:** ______

- [ ] **ORCH-CHK-GIT-01** `[gate/killer, do-confirm]` Every completed in-scope change has verified focused local commits in the session worktree.
  - **Applicability:** unconditional before session completion.
  - **Source:** ORCH-P09; ORCH-SCN-07-D.
  - **Pass condition:** commit set covers completed tasks and promotion, verification evidence matches committed trees, and main checkout is not the writer.
  - **Evidence:** Git log/diffs, task evidence, and worktree list.
  - **On fail:** consequence — work is not durably recoverable or isolated; halt finalization.
  - **Resolution:** ______

- [ ] **ORCH-CHK-GIT-02** `[required, do-confirm]` Remote actions match configuration and never require an issue or main-tree fallback.
  - **Applicability:** unconditional; remote actions may correctly be absent under local publication.
  - **Source:** ORCH-P09; ORCH-SCN-07-D.
  - **Pass condition:** local/push/pull-request policy matches actual calls; missing issue does not change worktree or branch routing.
  - **Evidence:** session settings, remote call results, branch, and worktree path.
  - **On fail:** stop remote actions and record actual local recovery state.
  - **Resolution:** ______

- [ ] **ORCH-CHK-GIT-03** `[gate/killer, do-confirm]` Merge and cleanup occur only after explicit authority, green checks, completed tasks, confirmed merge, and a clean worktree.
  - **Applicability:** conditional — merge or cleanup is contemplated.
  - **Source:** ORCH-P09; ORCH-SCN-07-E.
  - **Pass condition:** evidence gates precede merge; after confirmed merge, base sync, clean verification, non-force removal, prune, and safe branch deletion occur in order.
  - **Evidence:** user decision, checks, task state, merge result, worktree status, and Git command receipt.
  - **On fail:** consequence — unmerged or dirty work may be destroyed; halt all cleanup.
  - **Resolution:** ______

- [ ] **ORCH-CHK-GIT-04** `[gate/killer, do-confirm]` Any unmerged or deferred-publication session retains its branch/worktree and reports exact recovery state.
  - **Applicability:** conditional — branch is not confirmed merged or publication is deferred.
  - **Source:** ORCH-P09; ORCH-SCN-07-F.
  - **Pass condition:** branch and worktree exist, receipt names their exact paths and actual remote status, and no cleanup claim is false.
  - **Evidence:** worktree list, refs, remote state, and final receipt.
  - **On fail:** consequence — recovery path is lost or misleading; halt session completion until factual state is restored/reported.
  - **Resolution:** ______

## Pause point H — Before workflow documentation handoff

**Run use style:** `do-confirm`.

- [ ] **ORCH-CHK-DOC-01** `[gate/killer, do-confirm]` Every link in active changed workflow docs resolves within its explicit scope, with protected role docs excluded from mutation and link enforcement.
  - **Applicability:** conditional — workflow documentation changed.
  - **Source:** ORCH-P10; ORCH-SCN-08-A, ORCH-SCN-08-C.
  - **Pass condition:** scoped validator passes; no active reference targets a deleted child/template; protected-role diff is empty.
  - **Evidence:** link validator result and protected path Git diff.
  - **On fail:** consequence — runtime navigation breaks or protected scope is violated; halt handoff.
  - **Resolution:** ______

- [ ] **ORCH-CHK-DOC-02** `[gate/killer, do-confirm]` Each concern has one semantic owner and thin adapters do not restate schemas, specialist methods, paths, or transition mechanics.
  - **Applicability:** conditional — workflow documentation changed.
  - **Source:** ORCH-P10; ORCH-SCN-08-A, ORCH-SCN-08-D, ORCH-SCN-08-E.
  - **Pass condition:** claim-owner map is unique; semantic review and scoped search find no contradictory active route or copied owner contract.
  - **Evidence:** claim-owner map, changed-doc reread, and scoped search results.
  - **On fail:** consequence — future owner changes will drift; halt and repair the true owner first.
  - **Resolution:** ______

- [ ] **ORCH-CHK-DOC-03** `[required, do-confirm]` Cold readers can locate decisions, stop conditions, and owner links through literal headings and compact mappings.
  - **Applicability:** conditional — workflow documentation changed.
  - **Source:** ORCH-P10; ORCH-SCN-08-B.
  - **Pass condition:** heading/link inventory reaches every load-bearing rule; sequential actions use ordered prose rather than sequential tables in `SKILL.md`.
  - **Evidence:** cold-read trace, heading inventory, and table classification.
  - **On fail:** open a clarity finding and revise before handoff.
  - **Resolution:** ______

- [ ] **ORCH-CHK-DOC-04** `[gate/killer, do-confirm]` Protected canonical role documents are byte-for-byte unchanged.
  - **Applicability:** unconditional for this redesign task; otherwise conditional on a declared protected-role scope.
  - **Source:** ORCH-P10; ORCH-SCN-08-C.
  - **Pass condition:** Git diff for the five protected role Markdown files is empty.
  - **Evidence:** scoped `git diff --exit-code`.
  - **On fail:** consequence — explicit user scope is breached; halt and restore only the unauthorized edits safely.
  - **Resolution:** ______

- [ ] **ORCH-CHK-DOC-05** `[required, do-confirm]` The active changed sources contain no retired or unowned alternate orchestration mechanics or role-specific delegation files.
  - **Applicability:** conditional — workflow documentation changed.
  - **Source:** ORCH-P10; ORCH-SCN-08-D.
  - **Pass condition:** semantic reread and scoped vocabulary/path search confirm Workflow and Cowork use their recognized owners, one shared delegation skeleton, and only live children.
  - **Evidence:** changed-path inventory, scoped search, and full reread.
  - **On fail:** open a blocking ownership finding and remove the unowned alternate mechanic.
  - **Resolution:** ______

## Pilot and stress register

| Pilot | Expected closure | Expected acceptance |
|---|---|---|
| Fully valid fresh session through local-only close | every applicable item terminal | accepted only when every applicable item is PASS |
| Resume with exactly one session and unchanged settings | CFG conditional items terminal; fresh-only items `n/a` with inspected evidence | accepted when applicable items PASS |
| One invalid work-package identity | WORK items terminal including `FAIL:<id>` | not accepted |
| Third REVISE with no extension | ROUTE items terminal; halt evidence PASS | accepted as a correct halt, not accepted for another iteration |
| Missing teammate capability | TEAM-01 `n/a` with capability evidence; fresh fallback checks PASS | accepted |
| Idle signal without artifact | TEAM-04 and DELEG-05 `FAIL:<id>` | not accepted |
| Protected role diff present | DOC-04 `FAIL:<id>` | not accepted |
| Cosmetic headings with duplicate active routing | DOC-02 or DOC-05 `FAIL:<id>` | not accepted |

False-pass probes replace valid artifacts with empty files, spoof labels while changing identities, make runtime task status disagree with durable state, and make the manifest look correct while the tree differs. False-fail probes use a valid alternative runtime path, empty clean staging, missing persistent-team capability with fresh fallback, and local publication with no remote action. Any probe that resolves incorrectly requires repair of the source item before use.

## Trace closure

Every checklist ID is sourced by at least one ORCH-SCN case and a live ORCH-P clause. Every scenario obligation in [`scenarios.md`](scenarios.md) names at least one checklist ID above. A filled copy is coverage-closed only when every applicable gate/required item at its pause points is terminal; the run is accepted only under the independent acceptance rule in the source contract.
