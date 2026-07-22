# Gobbi Bootstrap Operational Checklist

## Source contract

- **Purpose:** stop a manager before a bootstrap omission can create the wrong session, route, or authority state.
- **Owner:** Gobbi entry skill.
- **Consumer:** manager at the named pause points; evaluator as scenario-derived acceptance evidence.
- **Mode:** operational.
- **Source version:** `gobbi-bootstrap-v1`; this source stays unchecked.
- **Run rule:** create a filled copy for each run, identify the source version and run, and declare the listed use style at each active pause point.
- **Applicability:** inspect each conditional predicate. Use `n/a:<property>` only when direct evidence proves it false.
- **Resolution tokens:** `PASS`, `FAIL:<finding/action-id>`, `n/a:<property>`, `recorded-open:<owner+resolution-method>`, and the checklist owner's narrow operational `waived/exception-authorized:<authority+rationale>` form where permitted.
- **Coverage closure:** every gate and required item at every triggered pause point has a permitted terminal resolution.
- **Acceptance:** every applicable gate and required item is `PASS`, except only the checklist owner's narrowly authorized killer exception. Coverage closure alone is not acceptance.
- **Evidence rule:** a path name, familiar heading, task status, or claimed intent is not proof. Inspect the named evidence before resolution.

## Pause point A — Before the first bootstrap action

**Run use style:** `read-do`.

- [ ] **GOBBI-CHK-FLOOR-01** `[gate/killer, read-do]` The entry trigger and canonical Gobbi source are established before any write or user decision.
  - **Applicability:** unconditional.
  - **Source:** GB-P01; GOBBI-SCN-01-A.
  - **Pass condition:** the load register names the trigger, active runtime, and canonical `gobbi/SKILL.md`; the write trace is empty.
  - **Evidence:** resolved canonical path, trigger record, runtime identity source, and pre-action write inventory.
  - **On fail:** consequence — bootstrap may use stale policy or mutate the wrong tree; halt before action.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-FLOOR-02** `[gate/killer, read-do]` The complete manager floor was read in parent order.
  - **Applicability:** unconditional.
  - **Source:** GB-P02; GOBBI-SCN-01-A, GOBBI-SCN-01-D.
  - **Pass condition:** exact reads show Principles → applicable rules → canonical manager role → Mistake and applicable mistakes → Orchestration and its mistake companion, all before action.
  - **Evidence:** ordered read register with complete-file bounds.
  - **On fail:** consequence — authority or a known trap may be absent; halt and load the missing source.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-FLOOR-03** `[required, read-do]` Each triggered conditional owner loads before its governed action.
  - **Applicability:** conditional — a user decision, Git action, Codex surface, or specialist brief is next.
  - **Source:** GB-P03; GOBBI-SCN-01-B.
  - **Pass condition:** Discussion precedes a user decision, Git precedes Git mutation, Codex precedes native/peer Codex use, and Orchestration delegation precedes brief authoring.
  - **Evidence:** owner-read and governed-action timestamps or ordered trace.
  - **On fail:** stop the governed action and load the current owner.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-OWN-01** `[gate/killer, read-do]` Current owner semantics, not a cosmetic legacy heading, choose the route.
  - **Applicability:** conditional — any surrounding source suggests an alternate or retired route.
  - **Source:** GB-P10; GOBBI-SCN-01-C.
  - **Pass condition:** the chosen path resolves through current Orchestration/Record/Discussion/Git/Startup/Codex owners and the stale consumer is only reported.
  - **Evidence:** claim-owner comparison and actual route.
  - **On fail:** consequence — retired behavior may regain authority; halt and restore owner precedence.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-OWN-02** `[gate/killer, read-do]` Protected role sources remain unchanged and do not route through obsolete workflow text.
  - **Applicability:** unconditional when the protected manager role is loaded.
  - **Source:** GB-P02, GB-P10; GOBBI-SCN-01-D.
  - **Pass condition:** protected role hashes match the implementation baseline and active routing follows current owners.
  - **Evidence:** role hash comparison, role/TOML diff, and route trace.
  - **On fail:** consequence — protected scope or workflow authority is breached; halt and report exact bytes/path.
  - **Resolution:** ______

## Pause point B — Before selecting fresh or resume

**Run use style:** `do-confirm`.

- [ ] **GOBBI-CHK-CLASS-01** `[gate/killer, do-confirm]` Zero unfinished sessions in the current worktree yields the fresh branch.
  - **Applicability:** conditional — local unfinished-session count is zero.
  - **Source:** GB-P05; GOBBI-SCN-02-A.
  - **Pass condition:** classification is fresh and no other worktree or global pointer was inspected for a candidate.
  - **Evidence:** current-worktree inventory and accessed-path trace.
  - **On fail:** consequence — the wrong session may be resumed; stop classification.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-CLASS-02** `[gate/killer, do-confirm]` Exactly one valid unfinished session resumes automatically.
  - **Applicability:** conditional — local unfinished-session count is one and no explicit path was supplied.
  - **Source:** GB-P05; GOBBI-SCN-02-B.
  - **Pass condition:** the one manifest, router, branch, and worktree validate and are selected without a fresh defaults question.
  - **Evidence:** local inventory, schema results, Git/worktree evidence, and selected root.
  - **On fail:** consequence — a valid session may fork or reset; halt before selection.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-CLASS-03** `[gate/killer, do-confirm]` Multiple unfinished sessions produce no automatic selection.
  - **Applicability:** conditional — local unfinished-session count exceeds one.
  - **Source:** GB-P05; GOBBI-SCN-02-C.
  - **Pass condition:** the manager requests an explicit path or fresh start and no candidate becomes active before that decision.
  - **Evidence:** candidate inventory, question trace, and unchanged active selection.
  - **On fail:** consequence — ambiguity is silently resolved without authority; halt and clear the inferred selection.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-CLASS-04** `[required, do-confirm]` Classification accesses only the current worktree or the explicit user path.
  - **Applicability:** unconditional.
  - **Source:** GB-P05; GOBBI-SCN-02-D.
  - **Pass condition:** no global active pointer or unrelated worktree scan contributes a candidate.
  - **Evidence:** command/access trace and candidate roots.
  - **On fail:** stop and rerun the bounded classifier.
  - **Resolution:** ______

## Pause point C — Before fresh initialization

**Run use style:** `read-do`.

- [ ] **GOBBI-CHK-FRESH-01** `[gate/killer, read-do]` Fresh preflight remains byte- and object-read-only through the defaults/customize decision.
  - **Applicability:** conditional — classification is fresh.
  - **Source:** GB-P06; GOBBI-SCN-03-A, GOBBI-SCN-03-C.
  - **Pass condition:** no branch, worktree, session root, manifest, router, or empty scaffold exists before the resolved decision.
  - **Evidence:** Git refs/worktrees and filesystem pre/post inventory with decision time.
  - **On fail:** consequence — persistent state exists without user settings authority; halt and use the owning safe recovery.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-FRESH-02** `[gate/killer, read-do]` Every customized value is resolved before mutation.
  - **Applicability:** conditional — the user chose customize.
  - **Source:** GB-P06; GOBBI-SCN-03-B.
  - **Pass condition:** the complete resolved settings object precedes UUID/Git/Record mutation.
  - **Evidence:** user decision artifact, resolved settings object, and ordered mutation trace.
  - **On fail:** consequence — incomplete policy may be persisted; stop initialization.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-FRESH-03** `[gate/killer, read-do]` Gobbi UUID, Git isolation, and Record initialization occur in the authorized order.
  - **Applicability:** conditional — fresh settings are resolved.
  - **Source:** GB-P06; GOBBI-SCN-03-A, GOBBI-SCN-03-B.
  - **Pass condition:** UUID precedes one branch/worktree, Record creates valid v5/v3 files, and settings exist only under `session.json.settings`.
  - **Evidence:** UUID result, Git command/evidence, schema verification, and session-root inventory.
  - **On fail:** consequence — identity, isolation, or settings ownership is invalid; halt before Ideation.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-FRESH-04** `[gate/killer, read-do]` A missing runtime identity or initialization error leaves no fallback or partial record.
  - **Applicability:** conditional — an identity or Record operation failed.
  - **Source:** GB-P06; GOBBI-SCN-03-D.
  - **Pass condition:** the exact error is surfaced and the preimage remains unchanged.
  - **Evidence:** owner error, candidate/preimage digests, root and Git inventory.
  - **On fail:** consequence — an untraceable or invalid session may proceed; halt and recover through the owner.
  - **Resolution:** ______

## Pause point D — Before continuing a resumed/context-boundary session

**Run use style:** `do-confirm`.

- [ ] **GOBBI-CHK-RESUME-01** `[gate/killer, do-confirm]` Resume preserves Gobbi UUID, saved settings, branch, worktree, and durable cursor.
  - **Applicability:** conditional — exact resume, `/clear`, rewind, runtime compaction, or another context boundary.
  - **Source:** GB-P04, GB-P07; GOBBI-SCN-04-A, GOBBI-SCN-04-C.
  - **Pass condition:** those fields match their pre-boundary values and no defaults reconfiguration occurs.
  - **Evidence:** before/after manifest, state, Git registration, and question trace.
  - **On fail:** consequence — one session may fork or reset; halt before any productive action.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RESUME-02** `[required, do-confirm]` Runtime identity attachment is append-only, unique, ordered, and idempotent.
  - **Applicability:** conditional — a context boundary is being attached.
  - **Source:** GB-P04; GOBBI-SCN-04-A, GOBBI-SCN-04-B.
  - **Pass condition:** a new ID appears once at the end; an existing ID leaves the list unchanged; Gobbi UUID does not change.
  - **Evidence:** before/after runtime object and schema/checkpoint result.
  - **On fail:** stop before handoff and restore the prior manifest through Record recovery.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RESUME-03** `[gate/killer, do-confirm]` Invalid durable resume evidence blocks rather than producing a guessed cursor.
  - **Applicability:** conditional — manifest, state, branch, worktree, or cursor validation fails.
  - **Source:** GB-P04, GB-P07; GOBBI-SCN-04-D.
  - **Pass condition:** no transition occurs, prior bytes remain authoritative, and the exact owner error is reported.
  - **Evidence:** validation error, state digest, and transition/task-view trace.
  - **On fail:** consequence — work may continue from fabricated state; halt and discard the inferred route.
  - **Resolution:** ______

## Pause point E — Before the first fresh Ideation transition

**Run use style:** `read-do`.

- [ ] **GOBBI-CHK-START-01** `[gate/killer, read-do]` Startup's classifier, not a fixed directory-presence heuristic, determines baseline validity.
  - **Applicability:** conditional — freshly initialized session before first Ideation.
  - **Source:** GB-P08; GOBBI-SCN-05-A, GOBBI-SCN-05-E.
  - **Pass condition:** `sufficient` proceeds; `sparse`, `absent`, or `contradictory` opens the user choice even when cosmetic paths exist.
  - **Evidence:** Startup classifier result and baseline fixture inventory.
  - **On fail:** consequence — unusable or already-valid baseline state is misclassified; stop the transition.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-START-02** `[gate/killer, read-do]` An accepted Startup choice becomes an ordinary Ideation input directive and produces no Startup-owned write or cursor.
  - **Applicability:** conditional — classifier is `sparse`, `absent`, or `contradictory` and the user accepts Startup.
  - **Source:** GB-P08; GOBBI-SCN-05-B.
  - **Pass condition:** Discussion holds the user decision; Gobbi hands off once; Orchestration enters Ideation DISCUSSION; Startup returns its packet read-only at that ordinary cursor.
  - **Evidence:** decision, unchanged baseline tree, v3 cursor transition, and returned packet.
  - **On fail:** consequence — a second lifecycle or unauthorized write bypasses authority; halt the route.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-START-03** `[required, read-do]` A declined Startup choice proceeds without fabricated baseline material.
  - **Applicability:** conditional — classifier is `sparse`, `absent`, or `contradictory` and the user declines Startup.
  - **Source:** GB-P08; GOBBI-SCN-05-C.
  - **Pass condition:** baseline paths remain unchanged and the next action is cursor handoff.
  - **Evidence:** user decision, baseline tree diff, and next cursor.
  - **On fail:** stop and remove only task-owned unauthorized writes through the safe owner path.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-START-04** `[gate/killer, read-do]` Resume does not reopen Startup; explicit baseline reset does.
  - **Applicability:** conditional — run is resume/context-boundary or carries an explicit reset.
  - **Source:** GB-P07, GB-P08; GOBBI-SCN-04-C, GOBBI-SCN-05-D.
  - **Pass condition:** no automatic Startup load on normal resume; explicit reset routes to the read-only classifier, and accepted questions route to ordinary Ideation DISCUSSION.
  - **Evidence:** trigger, load/question trace, and prior Startup disposition.
  - **On fail:** consequence — user attention or project baseline changes without the right trigger; halt the unexpected route.
  - **Resolution:** ______

## Pause point F — Before handing control to Orchestration

**Run use style:** `do-confirm`.

- [ ] **GOBBI-CHK-HAND-01** `[gate/killer, do-confirm]` Exactly one validated `state.json.current` cursor is handed to Orchestration.
  - **Applicability:** unconditional after bootstrap prerequisites.
  - **Source:** GB-P09; GOBBI-SCN-06-A.
  - **Pass condition:** manifest/state and required boundary evidence validate; Orchestration accepts the persisted cursor unchanged.
  - **Evidence:** cursor, record verification, Orchestration entry, and projected task view.
  - **On fail:** consequence — two routes or an invalid route may run; halt before specialist dispatch.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-HAND-02** `[gate/killer, do-confirm]` Gobbi has not directly loaded or dispatched a productive-step specialist as routing.
  - **Applicability:** unconditional.
  - **Source:** GB-P09; GOBBI-SCN-06-B.
  - **Pass condition:** the load/dispatch trace enters Orchestration first; adapter and specialist selection occur there.
  - **Evidence:** load and assignment trace.
  - **On fail:** consequence — stage/user gates can be bypassed; halt the direct dispatch.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-HAND-03** `[gate/killer, do-confirm]` A missing or invalid owner artifact blocks handoff with exact evidence.
  - **Applicability:** conditional — any required owner artifact or authority is missing.
  - **Source:** GB-P09; GOBBI-SCN-06-C.
  - **Pass condition:** no handoff or durable transition occurs and the report names the exact artifact/error/recovery owner.
  - **Evidence:** error report and state digest.
  - **On fail:** consequence — silent fallback can route unverified work; halt and restore prior state authority.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-HAND-04** `[gate/killer, do-confirm]` A disagreeing runtime task view is rebuilt from durable state and cannot write back.
  - **Applicability:** conditional — runtime projection exists.
  - **Source:** GB-P09; GOBBI-SCN-06-D.
  - **Pass condition:** state digest remains unchanged and projection equals the persisted cursor after rebuild.
  - **Evidence:** before/after state digest and task-view comparison.
  - **On fail:** consequence — display state becomes a second router; halt before continuation.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RET-01** `[gate/killer, do-confirm]` Bootstrap succeeds without Gobbi hooks, transcript/rollout paths, or operational ledgers.
  - **Applicability:** unconditional.
  - **Source:** GB-P12; GOBBI-SCN-07-A.
  - **Pass condition:** no required read, validation, or route depends on those surfaces.
  - **Evidence:** dependency search and successful cold handoff evidence.
  - **On fail:** consequence — deleted machinery becomes an undeclared prerequisite; halt and remove the active dependency.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RET-02** `[gate/killer, do-confirm]` Stale environment or capture data cannot override durable identity or routing.
  - **Applicability:** conditional — such data exists in the runtime environment or stale docs.
  - **Source:** GB-P12; GOBBI-SCN-07-B.
  - **Pass condition:** selected UUID, session root, and cursor come only from validated Gobbi state.
  - **Evidence:** conflicting-input fixture and selected identity trace.
  - **On fail:** consequence — the wrong session may be entered; halt and discard observational input.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RET-03** `[required, do-confirm]` Runtime compaction performs no durable-memory maintenance.
  - **Applicability:** conditional — trigger is runtime compaction.
  - **Source:** GB-P01, GB-P12; GOBBI-SCN-07-C.
  - **Pass condition:** only manager-floor reads and an authorized runtime-ID checkpoint may occur; no memory count, merge, threshold, or move occurs.
  - **Evidence:** memory-tree diff and action trace.
  - **On fail:** stop and route the unauthorized memory mutation to recovery.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RET-04** `[gate/killer, do-confirm]` No mode question, alternate mode route, or separate settings file participates in bootstrap.
  - **Applicability:** unconditional.
  - **Source:** GB-P12; GOBBI-SCN-07-D.
  - **Pass condition:** question/route trace contains one workflow only and session root/config searches find no active separate settings dependency.
  - **Evidence:** scoped vocabulary/dependency search and root inventory.
  - **On fail:** consequence — a retired route becomes active; halt before Orchestration handoff.
  - **Resolution:** ______

## Pause point G — Before accepting the Gobbi skill bundle

**Run use style:** `do-confirm`.

- [ ] **GOBBI-CHK-VIEW-01** `[gate/killer, do-confirm]` The canonical directory contains the required four-file operation bundle and all policy is present in the parent.
  - **Applicability:** unconditional for a Gobbi skill change.
  - **Source:** GB-P01, GB-P11; GOBBI-SCN-08-A.
  - **Pass condition:** the four required direct siblings `SKILL.md`, `scenarios.md`, `checklists.md`, and `evaluation.md` exist; separately scheduled legacy files do not supply operation policy; companions trace but add no policy.
  - **Evidence:** canonical directory inventory and parent-to-companion rule trace.
  - **On fail:** consequence — cold use or ownership closure is incomplete; reject the bundle.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-02** `[required, do-confirm]` Native Codex discovery resolves the canonical Gobbi directory and all four operation files.
  - **Applicability:** conditional — repository supports native Codex.
  - **Source:** GB-P11; GOBBI-SCN-08-B.
  - **Pass condition:** `.agents/skills/gobbi` canonicalizes to the source directory and its file set contains all four.
  - **Evidence:** symlink/realpath result and directory inventory.
  - **On fail:** reject native Codex cold-use claim and route repair to sync ownership.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-03** `[required, do-confirm]` The plugin source view resolves the same canonical four-file bundle.
  - **Applicability:** conditional — shared plugin source is in scope for the repository.
  - **Source:** GB-P11; GOBBI-SCN-08-C.
  - **Pass condition:** `plugins/gobbi/skills/gobbi` canonicalizes to the source directory and contains no copied divergent policy.
  - **Evidence:** symlink/realpath result, file set, and digest comparison where needed.
  - **On fail:** reject plugin-source readiness and route repair to sync ownership.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-04** `[required, do-confirm]` Every partial runtime view is reported exactly and left for the topology owner rather than hand-repaired here.
  - **Applicability:** conditional — a configured runtime view does not expose all four companions.
  - **Source:** GB-P11; GOBBI-SCN-08-D.
  - **Pass condition:** expected/actual sets and missing paths are reported, canonical bundle remains complete, and no out-of-scope view edit occurs.
  - **Evidence:** runtime-view inventories and exact changed-path allowlist.
  - **On fail:** reject the scope or completeness claim and restore one-owner wiring discipline.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-05** `[gate/killer, do-confirm]` A look-alike copied runtime bundle cannot pass as the canonical source.
  - **Applicability:** conditional — a runtime view is a directory or materialized copy rather than the verified canonical view.
  - **Source:** GB-P11; GOBBI-SCN-08-E.
  - **Pass condition:** canonical path and digest checks prove identity; matching filenames or headings alone never pass.
  - **Evidence:** source/view canonical paths, symlink topology, and content digests.
  - **On fail:** consequence — stale bootstrap policy may execute; reject cold-use readiness and route repair to sync ownership.
  - **Resolution:** ______

## Coverage and acceptance close

A filled run closes coverage only when every triggered item has a permitted terminal resolution with inspected evidence. It accepts the Gobbi bootstrap only when every applicable gate and required item is `PASS`, subject solely to the checklist owner's narrow operational killer exception. `recorded-open`, `n/a`, or a topology concern may explain coverage but cannot be counted as `PASS` for an applicable claim.
