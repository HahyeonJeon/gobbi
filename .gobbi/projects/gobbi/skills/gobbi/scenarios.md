# Gobbi Bootstrap Scenarios

## Set contract

- **Purpose:** prove that a cold manager reaches one valid Gobbi cursor without recreating retired behavior or bypassing an owner.
- **Target:** [`SKILL.md`](SKILL.md) and only the bootstrap edges it owns.
- **Consumer:** the Gobbi operational checklist and both fresh evaluators of a Gobbi-entry change.
- **Lifecycle:** design obligations; freeze this source before an evaluation run.
- **Scope:** start, fresh classification, exact resume, runtime context boundaries, conditional owner loads, Startup gating, handoff, and runtime entry views.
- **Non-goals:** state transitions, record bytes, question-card rendering, delegation formats, Git commands, peer commands, plugin repair, and productive-step methods.
- **Scale:** eight families and thirty-four cases. The author thresholds are twelve families and eighty distinct category/case-type cells. Split by bootstrap concern if either threshold is exceeded.
- **Stable IDs:** `GOBBI-SCN-<family>-<case>`; wording changes do not renumber an ID.
- **Evidence policy:** cite inspected paths, manifests, state, commands, and runtime views. Never embed runtime secrets or private conversation data.

## Source register

| Source | Parent clause | Obligation |
|---|---|---|
| GB-P01 | GB-1, Procedure 1 | Run at every entry/context boundary and establish the canonical source without writing. |
| GB-P02 | GB-2, Procedure 2 | Read the complete manager floor in the declared order. |
| GB-P03 | GB-3, Procedure 3 | Load Discussion, Git, Codex, and delegation only before their triggered actions. |
| GB-P04 | GB-4, Procedure 7 | Preserve Gobbi identity and cursor while attaching a distinct runtime identity. |
| GB-P05 | GB-5, Procedure 4 | Classify zero, exactly one, multiple, and explicit-path cases only in the permitted scope. |
| GB-P06 | GB-6, Procedure 5 | Keep fresh preflight read-only and store settings only in the manifest. |
| GB-P07 | GB-7, Procedure 7 | Reuse resumed settings without reopening Configuration choices. |
| GB-P08 | GB-8, Procedure 6 | Use Startup's classifier and user choice only on the fresh trigger or explicit reset. |
| GB-P09 | GB-9, Procedure 8 | Hand exactly one durable cursor to Orchestration and never dispatch a productive specialist directly. |
| GB-P10 | GB-10, Rules | Current owners outrank cosmetic legacy and protected stale workflow text without mutating protected sources. |
| GB-P11 | GB-11, Procedure 1 | Prove the active runtime entry resolves the canonical four-file bundle and route repair to its owner. |
| GB-P12 | Must-not rules | Absence of retired modes, settings files, hooks, capture, telemetry, and memory merging is valid operation. |

## Coverage register

| # | Category | Disposition | Positive and stress carriers |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | GOBBI-SCN-01-A, GOBBI-SCN-06-A |
| 2 | Actors / stakeholders / use-context | selected | GOBBI-SCN-01-A, GOBBI-SCN-05-B, GOBBI-SCN-06-B |
| 3 | Behavior / state / data | selected | GOBBI-SCN-02-A..C, GOBBI-SCN-04-A |
| 4 | Interfaces / dependencies / structure | selected | GOBBI-SCN-01-B, GOBBI-SCN-06-A, GOBBI-SCN-08-A..D |
| 5 | Quality attributes / resource economics | selected | GOBBI-SCN-02-D; classification stays local and bounded |
| 6 | Failure / recovery / operations | selected | GOBBI-SCN-03-D, GOBBI-SCN-04-D, GOBBI-SCN-08-D |
| 7 | Trust / harm / governance | selected | GOBBI-SCN-03-C, GOBBI-SCN-05-B, GOBBI-SCN-06-B |
| 8 | Inclusion / locale | selected | GOBBI-SCN-08-B..C; both runtime entry environments reach the same literal operation |
| 9 | Change / compatibility / reversibility | selected | GOBBI-SCN-04-A..C, GOBBI-SCN-05-D, GOBBI-SCN-07-C |
| 10 | Evidence / traceability / clarity | selected | GOBBI-SCN-01-A..D, GOBBI-SCN-08-A..D |

All ten categories are exercised here. Applicable case types are positive, alternative-valid, negative, boundary, failure/recovery, adversarial, change/regression, and counterfactual. Every family has a dedicated adversarial face. No inseparability record is used.

## Category and case matrix

| Family | Declared primary category and reason | Secondary categories | Cases |
|---|---|---|---|
| 01 Manager floor | 10, because a cold reader's complete owner trace is the discrimination | 1, 2, 4, 7 | positive, alternative-valid, adversarial, change |
| 02 Session classification | 3, because unfinished-session cardinality determines the branch | 4, 5, 6, 10 | positive, alternative-valid, boundary, adversarial |
| 03 Fresh initialization | 7, because user authority must precede mutation | 1, 3, 4, 6 | positive, alternative-valid, adversarial, failure |
| 04 Context-boundary resume | 9, because identity and context change while durable state remains | 3, 6, 10 | positive, boundary, adversarial, failure |
| 05 Startup gate | 1, because baseline validity affects the session's project context | 2, 3, 7, 9 | positive, alternative-valid, change, adversarial |
| 06 One-cursor handoff | 4, because the Gobbi-to-Orchestration seam defines the family | 1, 2, 3, 7, 10 | positive, adversarial, failure, counterfactual |
| 07 Retired-system absence | 9, because the operation must remain valid after removed dependencies | 3, 6, 7, 10 | positive, adversarial, change, negative |
| 08 Canonical and runtime views | 10, because source identity and followable wiring prove cold use | 4, 6, 8, 9 | positive, alternative-valid, boundary, failure, adversarial |

## GOBBI-SCN-01 — Complete manager floor

**Actor/outcome:** a cold manager knows its authority and next owner before any decision or mutation. **Sources:** GB-P01, GB-P02, GB-P03, GB-P10. **Priority:** killer.

### GOBBI-SCN-01-A — Cold entry reads the floor

- **Primary type / coverage-role:** Positive / positive.
- **Given:** a manager enters with no retained skill context.
- **When:** it follows `Session Bootstrap Order` through the complete floor.
- **Then:** Principles, applicable rules, the canonical manager role, Mistake and applicable mistakes, and Orchestration plus its mistake companion are read in order before acting.
- **Failure oracle:** any required owner is unread, read after action, or replaced by a runtime summary.
- **Evidence tuple:** ordered file-read register plus first-action trace; direct inspection confirms.
- **Obligation / checks:** the parent must be cold-load sufficient and ordered. GOBBI-CHK-FLOOR-01, GOBBI-CHK-FLOOR-02.

### GOBBI-SCN-01-B — Conditional owner loading

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** one run needs a user question and Git mutation, while another needs a Codex peer and a specialist brief.
- **When:** the manager approaches each boundary.
- **Then:** Discussion and Git load before the first run's governed actions; Codex and Orchestration delegation load before the second run's actions. Untriggered owners need not load early.
- **Failure oracle:** governed action precedes its owner, or Gobbi copies the owner's mechanics.
- **Evidence tuple:** load/action ordering and owner-link trace; direct inspection confirms.
- **Obligation / checks:** conditional owners load just in time without policy duplication. GOBBI-CHK-FLOOR-03.

### GOBBI-SCN-01-C — Cosmetic legacy tries to route work

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** an active surrounding document still contains a familiar old heading or a plausible alternate route.
- **When:** a manager considers following it instead of the current owner.
- **Then:** the manager follows the current canonical owner and reports the stale consumer for its owning task.
- **Failure oracle:** a cosmetic heading reactivates an alternate workflow, mode, or deleted child.
- **Evidence tuple:** owner precedence trace and actual dispatched path; current owner confirms.
- **Obligation / checks:** semantics, not familiar labels, choose the route. GOBBI-CHK-OWN-01.

### GOBBI-SCN-01-D — Protected role document contains obsolete workflow text

- **Primary type / coverage-role:** Change / change plus adversarial.
- **Given:** the protected manager role still names retired creation wording or a deleted child.
- **When:** the manager reads it as required role context.
- **Then:** role authority remains loaded, the protected file remains byte-identical, and current workflow owners govern routing.
- **Failure oracle:** bootstrap edits the protected role, follows its obsolete child, or suppresses the contradiction.
- **Evidence tuple:** protected hash, current owner links, and dispatch trace; all three confirm.
- **Obligation / checks:** accepted protected inconsistency cannot regain routing authority. GOBBI-CHK-OWN-02.

## GOBBI-SCN-02 — Current-worktree session classification

**Actor/outcome:** a manager selects fresh or resume without global inference. **Sources:** GB-P05. **Priority:** killer.

### GOBBI-SCN-02-A — Zero unfinished sessions

- **Primary type / coverage-role:** Positive / positive.
- **Given:** the current worktree contains zero unfinished Gobbi sessions.
- **When:** Orchestration classifies the entry.
- **Then:** the result is fresh; no other worktree is scanned.
- **Failure oracle:** a hidden global pointer or another worktree supplies the session.
- **Evidence tuple:** current-worktree inventory and accessed-path trace; zero local candidates confirms.
- **Obligation / checks:** zero is the exact fresh boundary. GOBBI-CHK-CLASS-01.

### GOBBI-SCN-02-B — Exactly one unfinished session

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** the current worktree contains exactly one schema-valid unfinished Gobbi session.
- **When:** classification runs without an explicit path.
- **Then:** that session resumes automatically after its manifest, router, branch, and worktree validate.
- **Failure oracle:** defaults are asked again, a new worktree is created, or a different session is chosen.
- **Evidence tuple:** local inventory, validation results, and selected root; direct inspection confirms.
- **Obligation / checks:** exactly one is the automatic-resume boundary. GOBBI-CHK-CLASS-02.

### GOBBI-SCN-02-C — Multiple unfinished sessions

- **Primary type / coverage-role:** Boundary / boundary at two or more.
- **Given:** the current worktree contains two unfinished Gobbi sessions.
- **When:** classification runs.
- **Then:** the manager asks for an explicit session path or a fresh start and selects neither automatically.
- **Failure oracle:** newest-file, first-match, task-list, or lexical ordering chooses one.
- **Evidence tuple:** two-candidate fixture plus unchanged selection state; direct inspection confirms.
- **Obligation / checks:** ambiguity remains user-owned. GOBBI-CHK-CLASS-03.

### GOBBI-SCN-02-D — Global-scan shortcut

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** many worktrees exist and a global pointer names a plausible session.
- **When:** a manager tries to improve convenience by scanning all of them.
- **Then:** the scan is rejected; only current-worktree evidence or an explicit path is used.
- **Failure oracle:** runtime cost and ambiguity grow with unrelated worktrees or a remote candidate is resumed.
- **Evidence tuple:** accessed-path trace and candidate set; bounded local inspection confirms.
- **Obligation / checks:** classification stays local, deterministic, and bounded. GOBBI-CHK-CLASS-04.

## GOBBI-SCN-03 — Fresh defaults and initialization

**Actor/outcome:** the user resolves settings before any persistent session object exists. **Sources:** GB-P06, Procedure 5. **Priority:** killer.

### GOBBI-SCN-03-A — Fresh defaults accepted

- **Primary type / coverage-role:** Positive / positive.
- **Given:** classification is fresh and defaults have not been shown.
- **When:** Orchestration shows them once and the user chooses “use defaults.”
- **Then:** the Gobbi UUID is generated, Git creates one branch/worktree, and Record creates valid version 5/version 3 files with default settings.
- **Failure oracle:** mutation precedes the decision, settings live separately, or runtime ID becomes session ID.
- **Evidence tuple:** no-write preimage, decision timestamp, UUID/Git order, and record verification.
- **Obligation / checks:** the authorized default path initializes once. GOBBI-CHK-FRESH-01, GOBBI-CHK-FRESH-03.

### GOBBI-SCN-03-B — Fresh settings customized

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** the user chooses “customize” and changes iteration or Git settings.
- **When:** every changed value is resolved.
- **Then:** no filesystem mutation occurs until resolution; the initialized manifest contains the resolved settings and no separate settings file.
- **Failure oracle:** partial settings are persisted early or a mode field appears.
- **Evidence tuple:** write trace, resolved settings object, manifest schema result, and root inventory.
- **Obligation / checks:** custom settings obey the same authority and storage boundary. GOBBI-CHK-FRESH-02, GOBBI-CHK-FRESH-03.

### GOBBI-SCN-03-C — Early-mutation gaming

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a manager wants a branch or session directory ready before asking the defaults question.
- **When:** it attempts the mutation.
- **Then:** bootstrap blocks it and leaves the repository/session preimage unchanged.
- **Failure oracle:** an empty directory, branch, worktree, manifest, or state file appears before authority.
- **Evidence tuple:** before/after path and ref inventory; byte/object equality confirms.
- **Obligation / checks:** “empty” setup still counts as mutation. GOBBI-CHK-FRESH-01.

### GOBBI-SCN-03-D — Required identity or record initialization fails

- **Primary type / coverage-role:** Failure/recovery / failure-recovery.
- **Given:** runtime identity is unavailable or Record rejects an initialization candidate.
- **When:** fresh initialization reaches that owner.
- **Then:** the manager surfaces the exact missing identity or validation error and creates no fallback record.
- **Failure oracle:** guessed identity, weakened schema, or partial session tree.
- **Evidence tuple:** owner error, pre/post inventory, and candidate bytes; unchanged state confirms.
- **Obligation / checks:** fresh failure preserves the preimage and owner authority. GOBBI-CHK-FRESH-04.

## GOBBI-SCN-04 — Resume and runtime context boundary

**Actor/outcome:** a valid session survives lost runtime context without identity or setting drift. **Sources:** GB-P04, GB-P07. **Priority:** killer.

### GOBBI-SCN-04-A — New runtime identity attaches

- **Primary type / coverage-role:** Positive / positive plus change.
- **Given:** an exact unfinished session resumes after `/clear`, rewind, or runtime compaction with a newly observed runtime ID.
- **When:** the manifest owner checkpoints the context boundary.
- **Then:** the Gobbi UUID, settings, branch, worktree, and v3 cursor stay unchanged; the new runtime ID appends once.
- **Failure oracle:** new session, reset cursor, settings prompt, reordered IDs, or duplicated ID.
- **Evidence tuple:** before/after manifest and state plus schema verification; direct comparison confirms.
- **Obligation / checks:** context loss changes only append-only runtime identity. GOBBI-CHK-RESUME-01, GOBBI-CHK-RESUME-02.

### GOBBI-SCN-04-B — Previously observed runtime identity

- **Primary type / coverage-role:** Boundary / boundary at duplicate observation.
- **Given:** the observed runtime ID already appears in the ordered list.
- **When:** context-boundary attachment runs.
- **Then:** the list is unchanged and remains unique.
- **Failure oracle:** duplicate entry or reordered history.
- **Evidence tuple:** manifest digest before/after and schema result; equal digest confirms.
- **Obligation / checks:** attachment is idempotent. GOBBI-CHK-RESUME-02.

### GOBBI-SCN-04-C — Resume tries to reopen defaults or Startup

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a valid resumed session has saved settings and earlier Startup disposition.
- **When:** a manager treats context loss as a fresh conversation.
- **Then:** Gobbi rejects the rerun and resumes the stored cursor. Only explicit reconfiguration or baseline reset can reopen those choices.
- **Failure oracle:** repeated defaults question, implicit setting change, or automatic Startup questioning.
- **Evidence tuple:** manifest settings, earlier decision evidence, and question trace; absence confirms.
- **Obligation / checks:** runtime boundaries are not project/session resets. GOBBI-CHK-RESUME-01, GOBBI-CHK-START-04.

### GOBBI-SCN-04-D — Durable resume evidence is invalid

- **Primary type / coverage-role:** Failure/recovery / failure-recovery.
- **Given:** the sole unfinished session has a schema, worktree, branch, or cursor mismatch.
- **When:** validation runs.
- **Then:** handoff stops at the owning recovery path and prior bytes remain authoritative.
- **Failure oracle:** artifact filenames or runtime task state are used to guess a route.
- **Evidence tuple:** exact validator error, state bytes, and no-transition trace; direct inspection confirms.
- **Obligation / checks:** invalid durable evidence fails closed. GOBBI-CHK-RESUME-03.

## GOBBI-SCN-05 — Fresh-session Startup classifier

**Actor/outcome:** the manager gets a read-only baseline classification and a user-owned Ideation input disposition without an obsolete presence heuristic or surprise rerun. **Sources:** GB-P08. **Priority:** required.

### GOBBI-SCN-05-A — Rich valid baseline

- **Primary type / coverage-role:** Positive / positive.
- **Given:** a fresh initialized session targets a project whose baseline passes Startup's classifier.
- **When:** the pre-Ideation Startup gate runs.
- **Then:** no guided question operation opens and bootstrap proceeds to the cursor handoff.
- **Failure oracle:** a hard-coded directory check overrides classifier PASS.
- **Evidence tuple:** Startup classifier result and absence of Startup write/question; direct inspection confirms.
- **Obligation / checks:** rich baseline avoids redundant user attention. GOBBI-CHK-START-01.

### GOBBI-SCN-05-B — Missing baseline, user accepts Startup

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** Startup classifies the fresh baseline `sparse`, `absent`, or `contradictory`.
- **When:** Discussion presents the user-owned choice and the user accepts Startup.
- **Then:** bootstrap preserves an accepted Startup input directive, hands the Configuration cursor to
  Orchestration once, and Orchestration invokes Startup inside ordinary Ideation DISCUSSION to return a
  structured packet without writing files.
- **Failure oracle:** Gobbi writes baseline files, creates a Startup cursor, invokes questions before the
  ordinary Ideation transition, or skips the user gate.
- **Evidence tuple:** classifier, user decision, unchanged tree, cursor transition, and returned input packet.
- **Obligation / checks:** Startup is a read-only Ideation input operation. GOBBI-CHK-START-02.

### GOBBI-SCN-05-C — Missing baseline, user declines Startup

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** the same `sparse`, `absent`, or `contradictory` classifier result.
- **When:** the user chooses to proceed without Startup.
- **Then:** bootstrap proceeds without a fabricated baseline; the choice is recorded only if the record owner requires it.
- **Failure oracle:** decline is ignored, facts are invented, or an empty baseline is created for appearances.
- **Evidence tuple:** user decision, unchanged baseline tree, and next cursor; direct inspection confirms.
- **Obligation / checks:** Startup remains a user-owned fresh-session gate. GOBBI-CHK-START-03.

### GOBBI-SCN-05-D — Resume and explicit reset are distinct

- **Primary type / coverage-role:** Change / change.
- **Given:** one run is a normal resume and another carries an explicit baseline-reset request.
- **When:** both pass bootstrap.
- **Then:** normal resume does not invoke Startup; explicit reset runs its read-only classifier on demand,
  with any accepted questioning routed to ordinary Ideation DISCUSSION.
- **Failure oracle:** all resumes rerun baseline review or explicit reset is ignored.
- **Evidence tuple:** triggers, load trace, and owner route; direct comparison confirms.
- **Obligation / checks:** reset is explicit, not inferred from context loss. GOBBI-CHK-START-04.

### GOBBI-SCN-05-E — Sparse-directory heuristic is cosmetically satisfied

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** placeholder `README.md`, `design/`, and `features/` paths exist but Startup considers the baseline invalid.
- **When:** the pre-Ideation gate runs.
- **Then:** the classifier result opens the user choice; path presence cannot force `sufficient`.
- **Failure oracle:** three path-existence checks suppress the gate.
- **Evidence tuple:** placeholder fixture and Startup result; disagreement proves the old heuristic unsafe.
- **Obligation / checks:** classifier semantics defeat cosmetic baseline shape. GOBBI-CHK-START-01.

## GOBBI-SCN-06 — One durable cursor handoff

**Actor/outcome:** Orchestration receives one verified cursor and becomes the sole workflow router. **Sources:** GB-P09, GB-P10. **Priority:** killer.

### GOBBI-SCN-06-A — Fresh or resumed cursor enters Orchestration

- **Primary type / coverage-role:** Positive / positive.
- **Given:** classification, required identity attachment, record verification, and any Startup disposition are complete.
- **When:** bootstrap hands off.
- **Then:** Orchestration accepts `state.json.current` and selects all later adapters and transitions.
- **Failure oracle:** Gobbi invents a stage, task, iteration, or second route.
- **Evidence tuple:** persisted cursor, Orchestration entry trace, and projected runtime view; direct comparison confirms.
- **Obligation / checks:** handoff is singular and durable. GOBBI-CHK-HAND-01.

### GOBBI-SCN-06-B — Direct productive-specialist dispatch

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** the cursor appears to indicate Ideation, Planning, Execution, or Wrap-up.
- **When:** Gobbi considers loading that specialist directly.
- **Then:** it rejects the shortcut and enters Orchestration, which owns adapter selection and dispatch.
- **Failure oracle:** a productive skill or specialist is loaded from Gobbi as the route.
- **Evidence tuple:** load/dispatch trace and delegation owner; absence of direct dispatch confirms.
- **Obligation / checks:** productive routes cannot bypass manager gates. GOBBI-CHK-HAND-02.

### GOBBI-SCN-06-C — Required owner artifact is missing

- **Primary type / coverage-role:** Failure/recovery / failure-recovery.
- **Given:** state, manifest, or an owner needed for the next boundary cannot be read or validated.
- **When:** handoff is attempted.
- **Then:** the manager reports the exact artifact and preserves the last valid state.
- **Failure oracle:** guessed cursor, default route, or silent downgrade.
- **Evidence tuple:** missing-path/error report and no-transition digest; direct inspection confirms.
- **Obligation / checks:** a blocked seam remains blocked and recoverable. GOBBI-CHK-HAND-03.

### GOBBI-SCN-06-D — Runtime task view as counterfactual router

- **Primary type / coverage-role:** Counterfactual / counterfactual plus adversarial.
- **Given:** the runtime task view disagrees with the persisted cursor.
- **When:** bootstrap asks which one controls the next step.
- **Then:** the persisted cursor wins and the runtime view is rebuilt as a projection.
- **Failure oracle:** runtime display changes durable routing.
- **Evidence tuple:** mismatched fixture, state digest, and rebuilt view; direct inspection confirms.
- **Obligation / checks:** a projection cannot become authority. GOBBI-CHK-HAND-04.

## GOBBI-SCN-07 — Retired dependency absence

**Actor/outcome:** bootstrap works with no removed mode, capture, hook, or memory-merging subsystem. **Sources:** GB-P12. **Priority:** killer.

### GOBBI-SCN-07-A — No hook or transcript surface exists

- **Primary type / coverage-role:** Positive / positive.
- **Given:** Claude or Codex starts without Gobbi hook exports, transcript path, rollout path, or agent ledger.
- **When:** bootstrap runs.
- **Then:** classification and owner loading proceed from explicit runtime and durable session inputs.
- **Failure oracle:** missing capture machinery blocks or degrades the workflow.
- **Evidence tuple:** absent-path/config inventory and successful handoff; direct inspection confirms.
- **Obligation / checks:** retired capture absence is normal. GOBBI-CHK-RET-01.

### GOBBI-SCN-07-B — Stale environment values attempt to override durable identity

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** an environment variable or old transcript metadata names a different session.
- **When:** bootstrap classifies and resumes.
- **Then:** validated manifest and current-worktree evidence govern; stale capture is ignored.
- **Failure oracle:** environment or transcript value replaces Gobbi UUID or cursor.
- **Evidence tuple:** conflicting fixture and selected durable identity; direct comparison confirms.
- **Obligation / checks:** removed observational state has no authority. GOBBI-CHK-RET-02.

### GOBBI-SCN-07-C — Runtime compaction wording

- **Primary type / coverage-role:** Change / change.
- **Given:** context is compacted while durable memory contains ordinary records.
- **When:** Gobbi reloads.
- **Then:** it reloads the manager floor and attaches runtime identity if distinct; it does not count, merge, move, or cap memory records.
- **Failure oracle:** context compaction triggers durable-memory maintenance.
- **Evidence tuple:** read/write trace over memory and manifest; only authorized runtime checkpoint may change.
- **Obligation / checks:** runtime and retired memory compaction remain disjoint. GOBBI-CHK-RET-03.

### GOBBI-SCN-07-D — Separate settings or mode field appears

- **Primary type / coverage-role:** Negative / negative plus adversarial.
- **Given:** a candidate bootstrap tries to read `settings.json`, ask a mode, or route by a mode field.
- **When:** the operation is checked.
- **Then:** the candidate fails and follows manifest settings plus the single workflow owner.
- **Failure oracle:** any separate settings or alternate mode affects routing.
- **Evidence tuple:** root/config inventory and question/route trace; zero active dependency confirms.
- **Obligation / checks:** retired configuration surfaces cannot be compatibility inputs. GOBBI-CHK-RET-04.

## GOBBI-SCN-08 — Canonical bundle and runtime views

**Actor/outcome:** each supported entry surface exposes the same cold-load-sufficient operation. **Sources:** GB-P11. **Priority:** required.

### GOBBI-SCN-08-A — Canonical source contains the full bundle

- **Primary type / coverage-role:** Positive / positive.
- **Given:** the canonical Gobbi skill directory is inspected.
- **When:** a cold reader loads it.
- **Then:** `SKILL.md`, `scenarios.md`, `checklists.md`, and `evaluation.md` exist as direct siblings; the parent alone carries policy and owner links.
- **Failure oracle:** a companion is missing or needed bootstrap policy exists only in a companion.
- **Evidence tuple:** directory inventory, heading scan, and rule trace; direct inspection confirms.
- **Obligation / checks:** the operation bundle is complete at source. GOBBI-CHK-VIEW-01.

### GOBBI-SCN-08-B — Native Codex discovery view

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** native Codex resolves `.agents/skills/gobbi`.
- **When:** the path is canonicalized and the bundle is listed.
- **Then:** it resolves to the canonical Gobbi directory and exposes all four files.
- **Failure oracle:** a copied or partial view is loaded.
- **Evidence tuple:** `readlink`/realpath and four-file inventory; direct inspection confirms.
- **Obligation / checks:** native Codex cold entry reaches the source bundle. GOBBI-CHK-VIEW-02.

### GOBBI-SCN-08-C — Plugin source view

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** the shared plugin source's skill view is inspected.
- **When:** `plugins/gobbi/skills/gobbi` resolves.
- **Then:** it reaches the canonical directory and exposes all four files without copied policy.
- **Failure oracle:** plugin source contains a stale materialized Gobbi skill.
- **Evidence tuple:** symlink resolution and bundle inventory; direct inspection confirms.
- **Obligation / checks:** plugin source and canonical source are one view. GOBBI-CHK-VIEW-03.

### GOBBI-SCN-08-D — Runtime view is partial or broken

- **Primary type / coverage-role:** Failure/recovery / failure-recovery plus boundary.
- **Given:** a runtime view exposes only part of the four-file bundle, as may occur before the later topology task updates per-file links.
- **When:** cold-entry proof runs.
- **Then:** the mismatch is reported with exact missing files and routed to the sync/topology owner; this task does not hand-create view files or weaken the canonical bundle.
- **Failure oracle:** a partial view is called complete, or the canonical package is narrowed to match it.
- **Evidence tuple:** expected/actual file sets and unchanged view diff; direct inspection confirms.
- **Obligation / checks:** wiring drift stays visible and owner-routed. GOBBI-CHK-VIEW-04.

### GOBBI-SCN-08-E — Look-alike copied runtime view

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a runtime directory contains four correctly named Gobbi files whose bytes were copied from an older source.
- **When:** cold-entry proof canonicalizes and compares the view.
- **Then:** the copied directory fails even though its names and headings look complete; repair routes to the sync/topology owner.
- **Failure oracle:** file count or heading matches are accepted as source identity.
- **Evidence tuple:** canonical paths and content digests for source and view; mismatch confirms.
- **Obligation / checks:** cosmetic bundle shape cannot replace canonical-source identity. GOBBI-CHK-VIEW-05.

## Trace closure

| Parent source | Scenario carriers | Checklist carriers |
|---|---|---|
| GB-P01 | GOBBI-SCN-01-A, GOBBI-SCN-08-A | FLOOR-01, VIEW-01 |
| GB-P02 | GOBBI-SCN-01-A, GOBBI-SCN-01-D | FLOOR-01, FLOOR-02, OWN-02 |
| GB-P03 | GOBBI-SCN-01-B | FLOOR-03 |
| GB-P04 | GOBBI-SCN-04-A..B | RESUME-01, RESUME-02 |
| GB-P05 | GOBBI-SCN-02-A..D | CLASS-01..04 |
| GB-P06 | GOBBI-SCN-03-A..D | FRESH-01..04 |
| GB-P07 | GOBBI-SCN-04-A..C | RESUME-01, START-04 |
| GB-P08 | GOBBI-SCN-05-A..E | START-01..04 |
| GB-P09 | GOBBI-SCN-06-A..D | HAND-01..04 |
| GB-P10 | GOBBI-SCN-01-C..D | OWN-01, OWN-02 |
| GB-P11 | GOBBI-SCN-08-A..E | VIEW-01..05 |
| GB-P12 | GOBBI-SCN-07-A..D | RET-01..04 |

Every non-exploratory scenario produces an obligation and a checklist reference. There are no orphan scenarios, uncovered parent clauses, or exploratory cases.
