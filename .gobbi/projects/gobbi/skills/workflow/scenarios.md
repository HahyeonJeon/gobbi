# Workflow Scenarios

## Set contract

- **Purpose:** exercise the manager workflow so a cosmetically correct document set cannot hide an unsafe or unroutable session.
- **Target:** [`SKILL.md`](SKILL.md) and its workflow-owned children.
- **Consumer:** the workflow checklist and the two fresh evaluators reviewing a workflow change.
- **Lifecycle:** design obligations; freeze this source before an evaluation run.
- **Scope:** Configuration, routing, dual-system WORK, dual-system EVALUATION, delegation, persistent specialists, RECORD gates, Wrap-up exit, and local Git recovery.
- **Non-goals:** specialist-owned authoring methods, record schemas and directory implementation, evaluator finding fields, peer adapter implementation, and protected role-prompt wording.
- **Scale:** eight families and forty-three cases. Author thresholds are twelve families and eighty distinct category/case-type cells; this tightly coupled cursor-and-authority set remains below both. Split by workflow concern if either threshold is exceeded.
- **Stable IDs:** `ORCH-SCN-<family>-<case>`; IDs survive wording changes.
- **Evidence policy:** reference repository artifacts and command results by path or digest; never embed secrets or sensitive runtime data.

## Source register

| Clause | Owner | Load-bearing obligation |
|---|---|---|
| ORCH-P01 | [`SKILL.md § Procedure`](SKILL.md#procedure) | Fresh preflight, defaults decision, Gobbi UUID, isolated initialization, and resume identity |
| ORCH-P02 | [`steps/state-machine.md`](steps/state-machine.md) | One cursor, legal stage order, verdict routing, cap behavior, return, halt, and projection |
| ORCH-P03 | [`steps/dual-system-work.md`](steps/dual-system-work.md) | Independent drafts, freeze, reciprocal review, synthesis, decisions, validation, and narrow waiver |
| ORCH-P04 | [`steps/evaluation.md`](steps/evaluation.md) | Two fresh complete reports, severe verdict aggregation, provenance, user disposition, and repeat review |
| ORCH-P05 | [`delegation.md`](delegation.md) | Shared brief, role authority, independence, write root, status report, and manager acceptance |
| ORCH-P06 | [`agent-teams.md`](agent-teams.md) | Lazy roster, bounded concurrency and messages, handshake, continuation, replacement, and recovery |
| ORCH-P07 | [`steps/record.md`](steps/record.md) | Artifact reread, record verification, PASS-only canonical output, empty staging, and transition gate |
| ORCH-P08 | [`steps/wrap-up.md`](steps/wrap-up.md) | Staging-only close, actual post-promotion review, handoff identity, and final outcome |
| ORCH-P09 | [`SKILL.md § Close through Wrap-up`](SKILL.md#8-close-through-wrap-up) | Verified local commits, configured publication, explicit merge authority, safe cleanup, and recovery path |
| ORCH-P10 | [`SKILL.md § References`](SKILL.md#references) | One owner per concern, thin adapters, live links, operation companions, and protected-role exclusion |

## Coverage register

| # | Category | Disposition | Positive floor and stress carrier |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | ORCH-SCN-01-A, ORCH-SCN-07-A |
| 2 | Actors / stakeholders / use-context | selected | ORCH-SCN-05-A, ORCH-SCN-06-A |
| 3 | Behavior / state / data | selected | ORCH-SCN-02-A, ORCH-SCN-07-A |
| 4 | Interfaces / dependencies / structure | selected | ORCH-SCN-03-A, ORCH-SCN-08-A |
| 5 | Quality attributes / resource economics | selected | ORCH-SCN-03-E; rigor remains complete under cost pressure |
| 6 | Failure / recovery / operations | selected | ORCH-SCN-02-C, ORCH-SCN-06-D |
| 7 | Trust / harm / governance | selected | ORCH-SCN-03-D, ORCH-SCN-05-C |
| 8 | Inclusion / locale | selected | ORCH-SCN-08-B; cold-reader and scannability access |
| 9 | Change / compatibility / reversibility | selected | ORCH-SCN-01-C, ORCH-SCN-07-E |
| 10 | Evidence / traceability / clarity | selected | ORCH-SCN-04-A, ORCH-SCN-08-A |

All ten categories are exercised here; none is delegated elsewhere. Applicable case types are ordinary valid, alternative-valid, boundary, failure/recovery, adversarial, change/regression, and counterfactual. Negative behavior is exercised where invalid state or authority must be rejected.

## Category and case coverage matrix

| Family | Primary category | Secondary categories | Triggered case types |
|---|---|---|---|
| ORCH-SCN-01 Session identity | 3 — the defining concern is durable session state | 1, 9, 10 | positive, boundary, change, adversarial |
| ORCH-SCN-02 Router | 3 — the defining concern is cursor transition | 4, 6, 10 | positive, boundary, failure, adversarial, change |
| ORCH-SCN-03 WORK independence | 4 — the defining concern is the cross-system contract | 5, 7, 10 | positive, alternative-valid, boundary, failure, adversarial, counterfactual |
| ORCH-SCN-04 Evaluation gate | 7 — the defining concern is independent acceptance authority | 1, 4, 10 | positive, alternative-valid, boundary, failure, adversarial, change |
| ORCH-SCN-05 Delegation authority | 2 — the defining concern is who may decide and act | 4, 7, 10 | positive, alternative-valid, boundary, failure, adversarial |
| ORCH-SCN-06 Persistent specialists | 2 — the defining concern is manager-specialist coordination | 4, 6, 9 | positive, alternative-valid, boundary, failure, adversarial, change |
| ORCH-SCN-07 RECORD, Wrap-up, Git | 9 — the defining concern is reversible closeout | 1, 3, 6, 7, 10 | positive, alternative-valid, boundary, failure, adversarial, change |
| ORCH-SCN-08 Ownership and cold use | 10 — the defining concern is followable ownership | 1, 4, 8, 9 | positive, alternative-valid, negative, adversarial, change |

No family has an adversarial exemption. Every triggered minimum has a dedicated case; no inseparability record is used.

## ORCH-SCN-01 — Session identity and Configuration

**Primary:** Behavior / state / data, because durable identity and manifest state distinguish the family. **Actor/outcome:** a manager starts or resumes exactly one isolated session without changing its Gobbi identity. **Sources:** ORCH-P01, ORCH-P02. **Priority:** killer.

### ORCH-SCN-01-A — Fresh defaults path

- **Primary type / coverage-role:** Positive / positive.
- **Given:** the current worktree has no unfinished Gobbi session.
- **When:** the manager runs read-only preflight, displays defaults once, receives “use defaults,” then initializes.
- **Then:** a Gobbi UUID exists before branch/worktree creation; one version 5 manifest, one version 3 state file, and the eager skeleton validate in that isolated worktree.
- **Failure oracle:** any filesystem mutation precedes the defaults decision, identity derives from a runtime ID, or record verification fails.
- **Evidence tuple:** command order and manifest/state reread by direct tool inspection; UUID/branch/worktree relationship confirms.
- **Obligation / checks:** Configuration must order preflight → decision → UUID → worktree → init → verify. ORCH-CHK-CFG-01, -02, -03.

### ORCH-SCN-01-B — Resume cardinality boundary

- **Primary type / coverage-role:** Boundary / boundary at zero, one, and two unfinished sessions.
- **Given:** the current worktree contains respectively zero, exactly one, or two unfinished sessions.
- **When:** resume classification runs.
- **Then:** zero offers fresh start; one resumes automatically; two requires an explicit path or fresh start and never guesses.
- **Failure oracle:** automatic selection with two, or a scan of other worktrees.
- **Evidence tuple:** fixture tree plus observed prompt/route by direct inspection; all three cardinalities confirm.
- **Obligation / checks:** Resume selection must be local and cardinality-exact. ORCH-CHK-CFG-04.

### ORCH-SCN-01-C — Runtime identity changes

- **Primary type / coverage-role:** Change / change.
- **Given:** a valid unfinished session crosses compact, clear, resume, rewind, or another runtime context boundary under a newly observed runtime ID.
- **When:** the context-boundary checkpoint runs twice with the new ID and once with the old ID.
- **Then:** the Gobbi UUID is unchanged and the ordered runtime ID list contains each distinct ID once.
- **Failure oracle:** UUID replacement, duplicate ID, reordered IDs, or settings reset.
- **Evidence tuple:** before/after manifest bytes and schema verification by direct tool inspection; ordered unique append confirms.
- **Obligation / checks:** Context changes attach identity without redefining the session. ORCH-CHK-CFG-05.

### ORCH-SCN-01-D — Global-pointer gaming

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** another worktree contains a plausible unfinished session and a stale global pointer names it.
- **When:** a cosmetically compliant manager tries to “helpfully” resume it.
- **Then:** the manager ignores both and uses only the current worktree or an explicit user path.
- **Failure oracle:** any automatic cross-worktree resume.
- **Evidence tuple:** controlled fixtures and accessed-path trace by direct tool inspection; no outside read confirms.
- **Obligation / checks:** Global inference cannot bypass local identity rules. ORCH-CHK-CFG-04.

## ORCH-SCN-02 — Cursor and verdict routing

**Primary:** Behavior / state / data, because legal cursor state is the family’s discrimination. **Actor/outcome:** a manager advances only through validated transitions. **Sources:** ORCH-P02, ORCH-P07. **Priority:** killer.

### ORCH-SCN-02-A — Universal stage order and PASS advance

- **Primary type / coverage-role:** Positive / positive.
- **Given:** a productive step has valid evidence for each stage and PASS RECORD proof.
- **When:** the manager advances the cursor.
- **Then:** DISCUSSION → WORK → EVALUATION → RECORD occurs in order, then the next step or task starts at iteration 1.
- **Failure oracle:** skipped/reordered stage, visible announcement before state write, or wrong next cursor.
- **Evidence tuple:** state snapshots plus record-command results by direct tool inspection; monotonic cursor confirms.
- **Obligation / checks:** One validated cursor controls every visible transition. ORCH-CHK-ROUTE-01, -02.

### ORCH-SCN-02-B — REVISE below and at the exact cap

- **Primary type / coverage-role:** Boundary / boundary at iterations 2 and 3 with cap 3.
- **Given:** evaluation returns REVISE below the cap, then again on iteration 3.
- **When:** RECORD completes.
- **Then:** below cap returns to full DISCUSSION at iteration +1; iteration 3 halts before any iteration 4 path and asks the five authorized choices.
- **Failure oracle:** partial review reuse, unauthorized iteration 4, or cap interpreted as retries.
- **Evidence tuple:** fixture state and created-directory diff by direct tool inspection; exact cap transition confirms.
- **Obligation / checks:** Caps count total passes and cannot be exceeded implicitly. ORCH-CHK-ROUTE-03, -04.

### ORCH-SCN-02-C — FAIL halt and return

- **Primary type / coverage-role:** Failure/recovery / failure/recovery.
- **Given:** any current iteration aggregates to FAIL.
- **When:** RECORD seals the evidence and the user chooses return to Ideation.
- **Then:** state halts first; the return preserves evidence, resets only invalidated forward progress, and Planning later runs again.
- **Failure oracle:** automatic next iteration, deleted evidence, or retained completion claims that depend on invalid scope.
- **Evidence tuple:** state/task before-after comparison and artifact existence by direct inspection; selective reset confirms.
- **Obligation / checks:** FAIL is fail-closed and recovery is scoped. ORCH-CHK-ROUTE-05.

### ORCH-SCN-02-D — Task projection attempts writeback

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** the runtime task list says complete while durable state and artifacts say running.
- **When:** routing evaluates completion.
- **Then:** durable state and artifact evidence win; the projection is rebuilt and no advance occurs.
- **Failure oracle:** task-list status modifies state or advances the cursor.
- **Evidence tuple:** divergent fixture and state digest by direct inspection; unchanged digest confirms rejection.
- **Obligation / checks:** Runtime scheduling cannot become a second router. ORCH-CHK-ROUTE-06.

### ORCH-SCN-02-E — User-approved cap extension

- **Primary type / coverage-role:** Change / change.
- **Given:** iteration 3 is halted and the user authorizes cap 4.
- **When:** the manager resumes.
- **Then:** manifest settings checkpoint first, only iteration 4 is scaffolded, record verification passes, and then state enters DISCUSSION iteration 4.
- **Failure oracle:** scaffold or transition before checkpoint, or creation beyond 4.
- **Evidence tuple:** ordered command log and filesystem diff by direct tool inspection; one new iteration confirms.
- **Obligation / checks:** Authorization becomes durable before expanded routing. ORCH-CHK-ROUTE-04.

## ORCH-SCN-03 — Dual-system WORK independence

**Primary:** Interfaces / dependencies / structure, because the ordering contract between systems is decisive. **Actor/outcome:** two systems create, challenge, and synthesize one validated candidate without shared-draft leakage. **Sources:** ORCH-P03. **Priority:** killer.

### ORCH-SCN-03-A — Claude active, Codex peer

- **Primary type / coverage-role:** Positive / positive.
- **Given:** Claude Code is active and both systems are available.
- **When:** WORK runs.
- **Then:** both receive the same neutral contract, Codex runs read-only and ephemeral, both drafts freeze before reciprocal review, Claude synthesizes, decisions resolve, and the package validates.
- **Failure oracle:** direct peer write, draft exposure before both freeze, wrong synthesis owner, or validator failure.
- **Evidence tuple:** process arguments, artifact identities, digests, and validator result by direct tool inspection; all confirm.
- **Obligation / checks:** Claude-active WORK preserves symmetry and ownership. ORCH-CHK-WORK-01 through -05.

### ORCH-SCN-03-B — Codex active, Claude peer

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** native Codex is active and both systems are available.
- **When:** WORK runs with the symmetric peer path.
- **Then:** Claude runs read-only without persistence, both drafts and reviews validate, and Codex synthesizes.
- **Failure oracle:** runtime asymmetry weakens any freeze, schema, or independence gate.
- **Evidence tuple:** process arguments, artifact identities, and validator result by direct inspection; symmetry confirms.
- **Obligation / checks:** Both active runtimes satisfy the same contract. ORCH-CHK-WORK-01 through -05.

### ORCH-SCN-03-C — Freeze-order boundary

- **Primary type / coverage-role:** Boundary / boundary at zero, one, and two frozen drafts.
- **Given:** neither, one, or both drafts validate.
- **When:** reciprocal review or synthesis is requested.
- **Then:** review begins only at two; synthesis begins only after two valid cross-reviews.
- **Failure oracle:** any earlier operation starts.
- **Evidence tuple:** fixture packages and validator exit by direct tool inspection; exact readiness boundary confirms.
- **Obligation / checks:** Freeze barriers are structural, not advisory. ORCH-CHK-WORK-02, -03.

### ORCH-SCN-03-D — Malformed, stale, or same-author peer evidence

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a response is missing, empty, malformed, wrong-system, stale-iteration, mislabeled, extra, or authored under the same runtime identity.
- **When:** storage or package validation runs.
- **Then:** it blocks without altering the last valid artifact.
- **Failure oracle:** renderer or validator accepts any invalid variant.
- **Evidence tuple:** negative fixtures, byte digests, and nonzero exits by direct tool inspection; unchanged prior bytes confirm.
- **Obligation / checks:** Cosmetic labels cannot forge independent evidence. ORCH-CHK-WORK-04.

### ORCH-SCN-03-E — Cost-pressure counterfactual

- **Primary type / coverage-role:** Counterfactual / counterfactual.
- **Given:** the assumption that available cost justifies the full contract is challenged.
- **When:** a manager considers dropping one draft, one cross-review, Ideation breadth, or evaluation depth.
- **Then:** rigor remains unchanged; the manager seeks an authorized scope/direction decision instead.
- **Failure oracle:** cost alone removes a system or required review coverage.
- **Evidence tuple:** delegation and state decision review by trace/citation; unchanged required inputs confirm.
- **Obligation / checks:** Resource pressure cannot silently lower quality. ORCH-CHK-WORK-06.

### ORCH-SCN-03-F — Peer failure and narrow waiver

- **Primary type / coverage-role:** Failure/recovery / failure/recovery.
- **Given:** one peer operation times out or is unavailable.
- **When:** recovery runs and the user approves a waiver limited to Codex, Planning, iteration 2.
- **Then:** the exact failure is surfaced, the decision is durable, only that named operation proceeds, and final outcome links it.
- **Failure oracle:** silent fallback, broader reuse, or missing outcome link.
- **Evidence tuple:** error output, decision artifact, manifest outcome, and next-iteration behavior by direct inspection; bounded scope confirms.
- **Obligation / checks:** Degraded evidence requires explicit narrow authority. ORCH-CHK-WORK-07.

## ORCH-SCN-04 — Dual-system EVALUATION gate

**Primary:** Trust / harm / governance, because independent acceptance prevents unsafe self-approval. **Actor/outcome:** two fresh systems review complete evidence and the user controls dispositions. **Sources:** ORCH-P04. **Priority:** killer.

### ORCH-SCN-04-A — PASS/PASS complete review

- **Primary type / coverage-role:** Positive / positive.
- **Given:** two fresh evaluators receive complete equal bundles.
- **When:** both independently cover seven perspectives plus Overall and return valid PASS reports.
- **Then:** aggregate PASS retains both provenances and can enter the user disposition gate.
- **Failure oracle:** missing/duplicate perspective, report sharing, stale evaluator, invalid checklist, or non-PASS aggregate.
- **Evidence tuple:** report validator and assignment identities by direct tool inspection; two complete isolated reports confirm.
- **Obligation / checks:** PASS requires two complete fresh PASS reports. ORCH-CHK-EVAL-01 through -04.

### ORCH-SCN-04-B — Severity aggregation alternatives

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** report pairs PASS/REVISE, REVISE/REVISE, PASS/FAIL, and REVISE/FAIL.
- **When:** aggregation runs.
- **Then:** results are REVISE, REVISE, FAIL, and FAIL respectively.
- **Failure oracle:** averaging, majority logic, or active-runtime preference.
- **Evidence tuple:** deterministic fixture calculation by direct tool inspection; expected truth table confirms.
- **Obligation / checks:** The most severe verdict controls. ORCH-CHK-EVAL-04.

### ORCH-SCN-04-C — Finding identity boundary

- **Primary type / coverage-role:** Boundary / boundary between same root cause and different root cause.
- **Given:** both systems report one shared symptom with either matching or distinct cause evidence.
- **When:** deduplication runs.
- **Then:** matching causes become one record retaining both provenances; distinct causes remain separate.
- **Failure oracle:** provenance loss or collapse of distinct causal hypotheses.
- **Evidence tuple:** ledger comparison by trace/citation; cause/provenance fields confirm.
- **Obligation / checks:** Deduplication preserves epistemic differences. ORCH-CHK-EVAL-05.

### ORCH-SCN-04-D — Disposition-gate gaming

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** valid reports exist and the manager preselects convenient fixes or starts revision before user response.
- **When:** the gate is audited.
- **Then:** one complete recommended batch is presented and no revision starts until the user approves or edits it.
- **Failure oracle:** omitted finding, auto-applied finding, or pre-approval write.
- **Evidence tuple:** user-decision artifact, writer activity, and complete finding IDs by direct inspection; no early mutation confirms.
- **Obligation / checks:** Evaluator findings cannot bypass user authority. ORCH-CHK-EVAL-06.

### ORCH-SCN-04-E — Material revision repeat

- **Primary type / coverage-role:** Change / change.
- **Given:** an approved open finding causes a material canonical change.
- **When:** the next iteration reaches EVALUATION.
- **Then:** two new evaluator identities perform the complete review; accepted findings change to addressed or superseded only with fresh evidence.
- **Failure oracle:** reused report, partial perspective pass, or disposition upgrade without evidence.
- **Evidence tuple:** assignment IDs, report digests, and finding ledger by direct inspection; freshness and evidence confirm.
- **Obligation / checks:** Material change invalidates prior acceptance. ORCH-CHK-EVAL-07.

### ORCH-SCN-04-F — Missing evaluator recovery

- **Primary type / coverage-role:** Failure/recovery / failure/recovery.
- **Given:** one evaluator returns malformed structured data.
- **When:** validation fails.
- **Then:** evaluation pauses with the exact error; a retry or narrow user waiver is required before aggregation.
- **Failure oracle:** PASS from the surviving evaluator alone without prior waiver.
- **Evidence tuple:** validator exit, state cursor, and decision record by direct inspection; no advance confirms.
- **Obligation / checks:** Missing-system evaluation fails closed. ORCH-CHK-EVAL-03, ORCH-CHK-WORK-07.

## ORCH-SCN-05 — Delegation authority and writer discipline

**Primary:** Actors / stakeholders / use-context, because the brief determines who may act. **Actor/outcome:** a specialist receives a complete bounded contract and the manager accepts only verified evidence. **Sources:** ORCH-P05. **Priority:** killer.

### ORCH-SCN-05-A — Complete first assignment

- **Primary type / coverage-role:** Positive / positive.
- **Given:** a fresh specialist is required.
- **When:** the manager dispatches it.
- **Then:** all twelve shared skeleton sections appear in order, exact load paths are read, scope and write roots are explicit, and the response begins with the required status fields.
- **Failure oracle:** any required contract field is absent or supplied only by a vague pointer.
- **Evidence tuple:** brief parse and final response parse by direct inspection; field coverage confirms.
- **Obligation / checks:** First assignments are self-contained and machine-auditable. ORCH-CHK-DELEG-01, -02.

### ORCH-SCN-05-B — Fresh fallback

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** persistent teammates are unavailable.
- **When:** the manager dispatches a fresh specialist.
- **Then:** the complete contract and exact loads preserve the same authority and evidence guarantees.
- **Failure oracle:** capability absence weakens scope, independence, or verification.
- **Evidence tuple:** brief comparison by trace/citation; invariant fields confirm.
- **Obligation / checks:** Runtime capability changes scheduling, not quality. ORCH-CHK-DELEG-01.

### ORCH-SCN-05-C — Scope and authority attack

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a specialist asks to expand scope, decide for the user, reassign work, accept its own artifact, or perform a destructive action.
- **When:** the manager handles the request.
- **Then:** the action is rejected or paused for the proper user decision; durable scope is unchanged.
- **Failure oracle:** specialist request alone grants authority.
- **Evidence tuple:** message and state/artifact diff by direct inspection; no unauthorized mutation confirms.
- **Obligation / checks:** Delegation never transfers manager or user authority. ORCH-CHK-DELEG-03.

### ORCH-SCN-05-D — One-writer boundary

- **Primary type / coverage-role:** Boundary / boundary between read-only parallelism and a second writer.
- **Given:** several research tasks and two write-capable tasks are ready.
- **When:** scheduling runs.
- **Then:** research may run concurrently; writes are serialized through one chain.
- **Failure oracle:** overlapping worktree or record writers.
- **Evidence tuple:** active dispatches and write grants by direct inspection; at most one writer confirms.
- **Obligation / checks:** Concurrency cannot create ambiguous ownership. ORCH-CHK-DELEG-04.

### ORCH-SCN-05-E — Report without artifact proof

- **Primary type / coverage-role:** Failure/recovery / failure/recovery.
- **Given:** a specialist reports DONE but its promised artifact is absent or differs.
- **When:** manager acceptance runs.
- **Then:** the manager does not advance, reports the evidence gap, and uses a bounded correction or replacement path.
- **Failure oracle:** completion inferred from status text.
- **Evidence tuple:** final response plus filesystem reread by direct inspection; halted cursor confirms.
- **Obligation / checks:** Reports trigger verification; they do not prove completion. ORCH-CHK-DELEG-05.

## ORCH-SCN-06 — Persistent-specialist scheduling

**Primary:** Actors / stakeholders / use-context, because manager-to-specialist coordination defines correctness. **Actor/outcome:** Claude Code reuses coherent specialists without sacrificing independence or evidence. **Sources:** ORCH-P06. **Priority:** killer.

### ORCH-SCN-06-A — Lazy stable roster and automatic exit

- **Primary type / coverage-role:** Positive / positive.
- **Given:** Claude Code supports Agent Teams and no teammate exists yet.
- **When:** leader, executor, and assistant are first needed across a session.
- **Then:** the first teammate implicitly forms the one session team; roles start lazily with predictable names, remain addressable while coherent, and runtime exit cleans up automatically.
- **Failure oracle:** eager unused roster, multiple teams, manual lifecycle dependency, or missing stable identity.
- **Evidence tuple:** runtime roster and official capability contract by direct inspection/citation; lazy identities confirm.
- **Obligation / checks:** Scheduling matches current runtime lifecycle. ORCH-CHK-TEAM-01.

### ORCH-SCN-06-B — Coherent executor continuation

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** consecutive ordered tasks share a subsystem and the executor remains reliable.
- **When:** the manager closes one assignment and prepares the next.
- **Then:** after report, idle/addressable confirmation, artifact reread, and state advance, the same executor receives a complete delta brief regardless of prior task count.
- **Failure oracle:** replacement solely because of a counter, or follow-up before handshake closure.
- **Evidence tuple:** assignment IDs, handshakes, artifacts, and teammate identity by direct inspection; coherent continuation confirms.
- **Obligation / checks:** Continuation follows evidence and dependency coherence. ORCH-CHK-TEAM-02, -04.

### ORCH-SCN-06-C — Replacement triggers

- **Primary type / coverage-role:** Change / change.
- **Given:** subsystem change, context drift, failure, or explicit independence need occurs.
- **When:** the next assignment is prepared.
- **Then:** a replacement receives the full delegation contract and durable artifacts.
- **Failure oracle:** stale teammate continues across any trigger.
- **Evidence tuple:** trigger evidence and new identity/load acknowledgement by direct inspection; replacement confirms.
- **Obligation / checks:** Context reuse ends when its assumptions end. ORCH-CHK-TEAM-03.

### ORCH-SCN-06-D — Context-boundary recovery

- **Primary type / coverage-role:** Failure/recovery / failure/recovery.
- **Given:** compact, clear, resume, rewind, or another runtime context boundary occurs with a task-list entry for a prior teammate.
- **When:** scheduling resumes.
- **Then:** identity, assignment, addressability, and idle state are verified; a confirmed survivor continues, otherwise a replacement is fully re-primed from durable artifacts.
- **Failure oracle:** messaging an unverified identity or trusting task-list presence.
- **Evidence tuple:** durable state, runtime roster, and acknowledgement by direct inspection; four-part verification confirms.
- **Obligation / checks:** Recovery never assumes teammate survival. ORCH-CHK-TEAM-05.

### ORCH-SCN-06-E — Idle and lag gaming

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** an idle notification appears early or shared task status lags after a report.
- **When:** manager completion logic runs.
- **Then:** neither signal completes or fails the task; artifact and verification evidence control.
- **Failure oracle:** state transition based only on either runtime signal.
- **Evidence tuple:** signal sequence and state digest by direct inspection; unchanged state until evidence confirms.
- **Obligation / checks:** Scheduling signals cannot forge completion. ORCH-CHK-TEAM-04.

### ORCH-SCN-06-F — Message and evaluator boundaries

- **Primary type / coverage-role:** Boundary / boundary between permitted factual/critique messages and prohibited decisions.
- **Given:** teammates exchange assigned facts or critique, then attempt scope change, acceptance, reassignment, user decision, or evaluator persistence.
- **When:** policy is enforced.
- **Then:** factual/critique messages proceed; prohibited messages are rejected; evaluator persistence is impossible.
- **Failure oracle:** any prohibited action succeeds.
- **Evidence tuple:** message/task audit and roster by direct inspection; allowed/rejected split confirms.
- **Obligation / checks:** Direct communication and roster membership preserve centralized authority. ORCH-CHK-TEAM-06, -07.

## ORCH-SCN-07 — RECORD, Wrap-up, and Git finalization

**Primary:** Change / compatibility / reversibility, because safe durable close and recoverability distinguish the family. **Actor/outcome:** the manager seals evidence, promotes only eligible staging, and leaves an exact recoverable Git state. **Sources:** ORCH-P07, ORCH-P08, ORCH-P09. **Priority:** killer.

### ORCH-SCN-07-A — Clean PASS with empty staging

- **Primary type / coverage-role:** Positive / positive.
- **Given:** a step passes with no evidence-supported durable candidate.
- **When:** RECORD runs.
- **Then:** canonical PASS artifacts validate and staging remains empty without fabricated content.
- **Failure oracle:** invented note/finding or validator rejects emptiness.
- **Evidence tuple:** artifact tree and record verify by direct tool inspection; empty staging plus PASS confirms.
- **Obligation / checks:** Evidence, not directory occupancy, controls staging. ORCH-CHK-REC-01, -02.

### ORCH-SCN-07-B — Promotion origin and handoff identity

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** Wrap-up has zero or more typed staging files and a frozen manifest.
- **When:** the active specialist applies it.
- **Then:** every changed durable path maps to exactly one staged source and manifest row, prior staging stays unchanged, and session and durable handoff bodies match.
- **Failure oracle:** non-staging source, unmapped changed path, mutated source, or divergent handoff body.
- **Evidence tuple:** source/destination digests and manifest join by direct tool inspection; bijective mapping confirms.
- **Obligation / checks:** Promotion and handoff are traceable and idempotent. ORCH-CHK-WRAP-01, -02.

### ORCH-SCN-07-C — Actual post-promotion review

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** the manifest looks correct but the applied tree contains an unintended change.
- **When:** evaluators run.
- **Then:** both inspect the actual tree and handoff, not merely the manifest, and the discrepancy blocks PASS.
- **Failure oracle:** evaluation accepts manifest intent without reading actual changes.
- **Evidence tuple:** planted tree discrepancy and evaluator evidence by direct inspection; finding confirms.
- **Obligation / checks:** Evaluators judge durable reality. ORCH-CHK-WRAP-03.

### ORCH-SCN-07-D — Local, push, and pull-request alternatives

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** publication is configured respectively local, push, or pull-request with no issue.
- **When:** post-PASS finalization runs.
- **Then:** each path creates verified local commits; only configured remote actions occur; issue absence never redirects writes to the main tree.
- **Failure oracle:** missing local commit, unwanted remote action, or main-tree fallback.
- **Evidence tuple:** Git refs, remote calls, and worktree path by direct inspection; configured result confirms.
- **Obligation / checks:** Publication policy is optional and orthogonal to isolation. ORCH-CHK-GIT-01, -02.

### ORCH-SCN-07-E — Merge boundary and cleanup

- **Primary type / coverage-role:** Boundary / boundary before and after explicit merge authority and confirmed merge.
- **Given:** a clean branch has green checks, first without merge authority and then with it.
- **When:** finalization evaluates cleanup.
- **Then:** no merge or cleanup occurs before authority and confirmed merge; afterward base sync, clean-worktree verification, non-force removal, metadata prune, and safe branch deletion occur in order.
- **Failure oracle:** early merge, force removal, cleanup before clean verification, or deletion before confirmed merge.
- **Evidence tuple:** approval artifact and Git command/result sequence by direct inspection; ordered safe cleanup confirms.
- **Obligation / checks:** Irreversible Git actions have explicit gates. ORCH-CHK-GIT-03.

### ORCH-SCN-07-F — Publication or merge failure recovery

- **Primary type / coverage-role:** Failure/recovery / failure/recovery.
- **Given:** publication is deferred or the branch remains unmerged.
- **When:** the session closes.
- **Then:** branch and worktree remain, and the receipt gives the exact recovery path and actual remote state.
- **Failure oracle:** cleanup destroys recovery or receipt claims an action that did not occur.
- **Evidence tuple:** Git refs, worktree list, and receipt comparison by direct inspection; recoverability confirms.
- **Obligation / checks:** Unfinished remote work remains locally recoverable. ORCH-CHK-GIT-04.

## ORCH-SCN-08 — Ownership, links, and cold use

**Primary:** Evidence / traceability / clarity, because a cold manager must find one authoritative clause. **Actor/outcome:** changed workflow docs route to live owners without duplication or protected-role mutation. **Sources:** ORCH-P10. **Priority:** required.

### ORCH-SCN-08-A — One-owner cold trace

- **Primary type / coverage-role:** Positive / positive.
- **Given:** a cold reader needs transition, record, WORK, evaluation, delegation, or teammate rules.
- **When:** they start at `SKILL.md`.
- **Then:** each concern resolves through one live child owner and thin adapters do not reproduce specialist schemas or procedures.
- **Failure oracle:** contradictory duplicate rule, pointer-only cycle, or dead link.
- **Evidence tuple:** scoped link and semantic ownership review by direct inspection; unique owner mapping confirms.
- **Obligation / checks:** Documentation structure is navigable and single-owned. ORCH-CHK-DOC-01, -02.

### ORCH-SCN-08-B — Scannable non-UI access

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** a tired manager or assistive reading tool consumes the docs.
- **When:** it scans headings, short clauses, tables used only for mappings, and ordered steps.
- **Then:** required decisions and stop conditions are findable without interpreting decorative language or dense sequential tables.
- **Failure oracle:** load-bearing rule exists only in prose that cannot be located from headings or links.
- **Evidence tuple:** heading/link inventory and cold-read trace by direct inspection; direct navigation confirms.
- **Obligation / checks:** Text operations remain accessible and literal. ORCH-CHK-DOC-03.

### ORCH-SCN-08-C — Deleted-source references

- **Primary type / coverage-role:** Negative / negative safe rejection.
- **Given:** active workflow docs refer to a deleted child or role-specific template.
- **When:** scoped link validation runs.
- **Then:** validation fails and the reference is replaced by the current owner; protected role docs are excluded by explicit accepted scope.
- **Failure oracle:** active broken link passes or protected role wording is edited to silence it.
- **Evidence tuple:** link validator scope and protected-role diff by direct tool inspection; correct failure/exclusion confirms.
- **Obligation / checks:** Active links are live without violating protected scope. ORCH-CHK-DOC-01, -04.

### ORCH-SCN-08-D — Cosmetic redesign gaming

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** headings use the new vocabulary but stale alternate routing, duplicated storage, or role-specific contracts remain semantically active.
- **When:** ownership and vocabulary review runs.
- **Then:** the change fails until the alternate mechanic is removed.
- **Failure oracle:** keyword-only compliance passes contradictory behavior.
- **Evidence tuple:** semantic claim-owner map and scoped search by direct inspection; absence of alternate behavior confirms.
- **Obligation / checks:** Structural and semantic acceptance are both required. ORCH-CHK-DOC-02, -05.

### ORCH-SCN-08-E — Future owner change

- **Primary type / coverage-role:** Change / change.
- **Given:** the record or evaluator schema evolves under its owning skill.
- **When:** workflow is reread without rewriting thin adapters.
- **Then:** adapters remain correct through owner links and only their true dispatch inputs require review.
- **Failure oracle:** copied schema becomes stale or two files claim ownership.
- **Evidence tuple:** owner-link trace and duplication search by direct inspection; no copied contract confirms.
- **Obligation / checks:** Thin ownership limits synchronization blast radius. ORCH-CHK-DOC-02.

## Traceability and omission sweep

| Parent clause | Scenarios | Obligations covered |
|---|---|---|
| ORCH-P01 | ORCH-SCN-01-A..D | Configuration order, identity, local resume |
| ORCH-P02 | ORCH-SCN-02-A..E | Cursor, verdicts, caps, return, projection |
| ORCH-P03 | ORCH-SCN-03-A..F | Symmetric independent work, barriers, validation, waiver |
| ORCH-P04 | ORCH-SCN-04-A..F | Fresh complete review, aggregation, provenance, disposition, repeat |
| ORCH-P05 | ORCH-SCN-05-A..E | Shared contract, authority, writer order, evidence acceptance |
| ORCH-P06 | ORCH-SCN-06-A..F | Team lifecycle, continuation, replacement, handshake, messages, recovery |
| ORCH-P07 | ORCH-SCN-02-A..E, ORCH-SCN-07-A | RECORD verification and verdict routing |
| ORCH-P08 | ORCH-SCN-07-A..C | Empty staging, promotion, actual-tree review, handoff |
| ORCH-P09 | ORCH-SCN-07-D..F | Local commits, configured publication, merge gate, recovery |
| ORCH-P10 | ORCH-SCN-08-A..E | Ownership, cold use, links, protected roles, future change |

Every source clause maps to at least one case, every case has an observable obligation, and every obligation names at least one checklist ID. No known coverage gap remains.
