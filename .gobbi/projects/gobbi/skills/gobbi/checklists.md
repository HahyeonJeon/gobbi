# Gobbi Bootstrap Operational Checklist

## Source contract

- **Purpose:** stop a manager before a bootstrap omission can rebuild the wrong floor, force a route, write from the entry, or leave a stale runtime view.
- **Owner:** Gobbi entry skill.
- **Consumer:** manager at the named pause points; evaluator as scenario-derived acceptance evidence.
- **Mode:** operational.
- **Source version:** `gobbi-bootstrap-v3`; this source stays unchecked. The version bumps on any material change to the item set.
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
  - **Source:** GB-1; GOBBI-SCN-01-A.
  - **Pass condition:** the load register names the trigger, active runtime, and canonical `gobbi/SKILL.md`; the write trace is empty.
  - **Evidence:** resolved canonical path, trigger record, runtime identity source, and pre-action write inventory.
  - **On fail:** consequence — bootstrap may use stale policy or mutate the wrong tree; halt before action.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-FLOOR-02** `[gate/killer, read-do]` The floor of exactly five was read in parent order, then rules and the manager role, with no sixth skill.
  - **Applicability:** unconditional.
  - **Source:** GB-2; GOBBI-SCN-01-A, GOBBI-SCN-01-C.
  - **Pass condition:** exact reads show `principles` → `delegation` → `discussion` → `ideation` → `git`, then the applicable rules and the canonical manager role, all before action; no additional skill (`workflow`, `startup`, or a language skill) is read as floor.
  - **Evidence:** ordered read register with complete-file bounds and exactly five floor entries.
  - **On fail:** consequence — authority is absent or a non-floor skill inflated the floor; halt and correct the floor.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-FLOOR-03** `[required, read-do]` Each triggered conditional owner loads before its governed action, and `discussion`/`git` are not re-loaded as conditional.
  - **Applicability:** conditional — a Codex peer surface or a workflow-session specialist brief is next.
  - **Source:** GB-3; GOBBI-SCN-01-B.
  - **Pass condition:** `codex` precedes native/peer Codex use and the workflow assignment skeleton precedes brief authoring; `discussion` and `git` are already floor.
  - **Evidence:** owner-read and governed-action timestamps or ordered trace.
  - **On fail:** stop the governed action and load the current owner.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-OWN-01** `[gate/killer, read-do]` Current owner semantics, not a cosmetic legacy heading, choose the route.
  - **Applicability:** conditional — any surrounding source suggests an alternate or retired route.
  - **Source:** GB-7; GOBBI-SCN-01-C.
  - **Pass condition:** the chosen path resolves through current `workflow`/record/discussion/Git/startup/Codex owners and the stale consumer is only reported.
  - **Evidence:** claim-owner comparison and actual route.
  - **On fail:** consequence — retired behavior may regain authority; halt and restore owner precedence.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-OWN-02** `[gate/killer, read-do]` Protected role sources remain unchanged and do not route through obsolete workflow text.
  - **Applicability:** unconditional when the protected manager role is loaded.
  - **Source:** GB-7; GOBBI-SCN-01-D.
  - **Pass condition:** protected role hashes match the implementation baseline and active routing follows current owners rather than the role's obsolete floor or child text.
  - **Evidence:** role hash comparison, role/TOML diff, and route trace.
  - **On fail:** consequence — protected scope or workflow authority is breached; halt and report exact bytes/path.
  - **Resolution:** ______

## Pause point B — Before presenting or using the skill map

**Run use style:** `read-do`.

- [ ] **GOBBI-CHK-MAP-01** `[gate/killer, read-do]` Every non-floor skill is indexed once with a name, a one-line description, and a neutral relevance note, and the index is not a load-when gate.
  - **Applicability:** unconditional for a Gobbi entry change.
  - **Source:** GB-MAP; GOBBI-SCN-09-A.
  - **Pass condition:** each non-floor skill appears exactly once in the `## Skill map` section with the three fields, points at its owner, copies no mechanics, and no entry is phrased as a mandatory-load command.
  - **Evidence:** skill-map inventory and per-entry field scan.
  - **On fail:** consequence — a cold reader cannot find an owner, or reads the index as an eager-load catalog; reject the index.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-MAP-02** `[gate/killer, read-do]` An indexed owner is loaded only on task-need, never eagerly force-loaded on entry.
  - **Applicability:** unconditional.
  - **Source:** GB-MAP, GB-2; GOBBI-SCN-09-B.
  - **Pass condition:** the entry load register shows the floor of exactly five and no eager load of `workflow`, `startup`, or a language skill; each indexed owner loads only when its task trigger applies.
  - **Evidence:** entry load register and triggered-load trace.
  - **On fail:** consequence — the index becomes a gate and the floor swells; halt and remove the eager load.
  - **Resolution:** ______

## Pause point C — Before continuing a resumed/context-boundary session

**Run use style:** `do-confirm`.

- [ ] **GOBBI-CHK-RESUME-01** `[gate/killer, do-confirm]` Resume preserves Gobbi UUID, saved settings, branch, worktree, and durable cursor without reconfiguring.
  - **Applicability:** conditional — exact resume, `/clear`, rewind, runtime compaction, or another context boundary.
  - **Source:** GB-4; GOBBI-SCN-04-A, GOBBI-SCN-04-C.
  - **Pass condition:** those fields match their pre-boundary values and no defaults reconfiguration occurs on context loss.
  - **Evidence:** before/after manifest, state, Git registration, and question trace.
  - **On fail:** consequence — one session may fork or reset; halt before any productive action.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RESUME-02** `[required, do-confirm]` Runtime identity attachment is append-only, unique, ordered, and idempotent.
  - **Applicability:** conditional — a context boundary is being attached.
  - **Source:** GB-4; GOBBI-SCN-04-A, GOBBI-SCN-04-B.
  - **Pass condition:** a new ID appears once at the end through the workflow owner and Record; an existing ID leaves the list unchanged; the Gobbi UUID does not change.
  - **Evidence:** before/after runtime object and schema/checkpoint result.
  - **On fail:** stop before routing and restore the prior manifest through Record recovery.
  - **Resolution:** ______

## Pause point D — Before routing by session kind and handing off

**Run use style:** `do-confirm`.

- [ ] **GOBBI-CHK-ROUTE-01** `[gate/killer, do-confirm]` A general session proceeds on the floor without loading the `workflow` owner, and the split is routine judgment, not a mode prompt.
  - **Applicability:** unconditional.
  - **Source:** GB-6; GOBBI-SCN-10-A, GOBBI-SCN-10-B, GOBBI-SCN-10-C.
  - **Pass condition:** a general session works from the floor with no `workflow`-owner load and no session-tree write; a workflow session reaches the workflow by loading the indexed `workflow` owner; the entry contains no user-facing interaction-mode question or alternate route.
  - **Evidence:** floor load register, `workflow`-owner load presence/absence, and question/route trace.
  - **On fail:** consequence — the entry is not actually lightened, or a retired mode prompt returns; halt and correct the routing.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-ROUTE-02** `[gate/killer, do-confirm]` The entry writes nothing; branch, worktree, session-tree, and manifest creation are deferred to the `workflow` owner's Configuration.
  - **Applicability:** unconditional.
  - **Source:** GB-5; GOBBI-SCN-06-C.
  - **Pass condition:** no branch, worktree, session root, manifest, router, or empty scaffold is created from the entry; creation happens only inside the loaded `workflow` owner.
  - **Evidence:** Git refs/worktrees and filesystem pre/post inventory across the entry.
  - **On fail:** consequence — persistent state exists without the workflow owner's authority; halt and use the owning safe recovery.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-HAND-01** `[gate/killer, do-confirm]` A workflow session enters the indexed `workflow` owner at exactly one validated `state.json.current` cursor.
  - **Applicability:** conditional — the manager judged the run a workflow session.
  - **Source:** GB-6; GOBBI-SCN-06-A.
  - **Pass condition:** manifest/state and required boundary evidence validate; the `workflow` owner accepts the persisted cursor unchanged and the entry creates nothing.
  - **Evidence:** cursor, record verification, `workflow`-owner entry, and projected task view.
  - **On fail:** consequence — two routes or an invalid route may run; halt before specialist dispatch.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-HAND-02** `[gate/killer, do-confirm]` The entry has not directly loaded or dispatched a productive-step specialist as routing.
  - **Applicability:** unconditional.
  - **Source:** GB-6; GOBBI-SCN-06-B.
  - **Pass condition:** the load/dispatch trace enters the `workflow` owner first; adapter and specialist selection occur there.
  - **Evidence:** load and assignment trace.
  - **On fail:** consequence — stage/user gates can be bypassed; halt the direct dispatch.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-HAND-03** `[gate/killer, do-confirm]` A missing or invalid owner artifact blocks handoff with exact evidence.
  - **Applicability:** conditional — any required owner artifact or authority is missing.
  - **Source:** GB-6; GOBBI-SCN-06-D.
  - **Pass condition:** no handoff or durable transition occurs and the report names the exact artifact/identity/error/recovery owner while preserving prior durable state.
  - **Evidence:** error report and state digest.
  - **On fail:** consequence — silent fallback can route unverified work; halt and restore prior state authority.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-HAND-04** `[gate/killer, do-confirm]` A disagreeing runtime task view is rebuilt from durable state and cannot write back.
  - **Applicability:** conditional — a runtime projection exists.
  - **Source:** GB-6; GOBBI-SCN-06-E.
  - **Pass condition:** the state digest remains unchanged and the projection equals the persisted cursor after rebuild.
  - **Evidence:** before/after state digest and task-view comparison.
  - **On fail:** consequence — display state becomes a second router; halt before continuation.
  - **Resolution:** ______

## Pause point E — Retired-machinery absence

**Run use style:** `do-confirm`.

- [ ] **GOBBI-CHK-RET-01** `[gate/killer, do-confirm]` Bootstrap succeeds without Gobbi hooks, transcript/rollout paths, or operational ledgers.
  - **Applicability:** unconditional.
  - **Source:** GB-MN; GOBBI-SCN-07-A.
  - **Pass condition:** no required read, validation, or route depends on those surfaces.
  - **Evidence:** dependency search and successful cold routing evidence.
  - **On fail:** consequence — deleted machinery becomes an undeclared prerequisite; halt and remove the active dependency.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RET-02** `[gate/killer, do-confirm]` Stale environment or capture data cannot override durable identity or routing.
  - **Applicability:** conditional — such data exists in the runtime environment or stale docs.
  - **Source:** GB-MN; GOBBI-SCN-07-B.
  - **Pass condition:** selected UUID, session root, and cursor come only from validated Gobbi state.
  - **Evidence:** conflicting-input fixture and selected identity trace.
  - **On fail:** consequence — the wrong session may be entered; halt and discard observational input.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RET-03** `[required, do-confirm]` Runtime compaction performs no durable-memory maintenance.
  - **Applicability:** conditional — the trigger is runtime compaction.
  - **Source:** GB-1, GB-MN; GOBBI-SCN-07-C.
  - **Pass condition:** only floor reads and an authorized runtime-ID checkpoint may occur; no memory count, merge, threshold, or move occurs.
  - **Evidence:** memory-tree diff and action trace.
  - **On fail:** stop and route the unauthorized memory mutation to recovery.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-RET-04** `[gate/killer, do-confirm]` No mode question, alternate mode route, forced workflow load, startup/baseline-classifier gate, or separate settings file participates in bootstrap.
  - **Applicability:** unconditional.
  - **Source:** GB-MN; GOBBI-SCN-07-D.
  - **Pass condition:** the question/route trace contains one on-demand routing judgment only; session root/config searches find no separate settings dependency; the entry force-loads no workflow owner and runs no retired baseline gate.
  - **Evidence:** scoped vocabulary/dependency search and root inventory.
  - **On fail:** consequence — a retired route or gate becomes active; halt before the workflow handoff.
  - **Resolution:** ______

## Pause point F — Before accepting the Gobbi skill bundle and mirror views

**Run use style:** `do-confirm`.

- [ ] **GOBBI-CHK-VIEW-01** `[gate/killer, do-confirm]` The canonical directory contains the required four-file operation bundle and all policy is present in the parent.
  - **Applicability:** unconditional for a Gobbi skill change.
  - **Source:** GB-7; GOBBI-SCN-08-A.
  - **Pass condition:** the four required direct siblings `SKILL.md`, `scenarios.md`, `checklists.md`, and `evaluation.md` exist; companions trace but add no policy.
  - **Evidence:** canonical directory inventory and parent-to-companion rule trace.
  - **On fail:** consequence — cold use or ownership closure is incomplete; reject the bundle.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-02** `[required, do-confirm]` Native Codex discovery resolves the canonical Gobbi directory and all four operation files.
  - **Applicability:** conditional — repository supports native Codex.
  - **Source:** GB-7; GOBBI-SCN-08-B.
  - **Pass condition:** `.agents/skills/gobbi` canonicalizes to the source directory and its file set contains all four.
  - **Evidence:** symlink/realpath result and directory inventory.
  - **On fail:** reject the native Codex cold-use claim and route repair to sync ownership.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-03** `[required, do-confirm]` The plugin source view resolves the same canonical four-file bundle.
  - **Applicability:** conditional — shared plugin source is in scope for the repository.
  - **Source:** GB-7; GOBBI-SCN-08-C.
  - **Pass condition:** `plugins/gobbi/skills/gobbi` canonicalizes to the source directory and contains no copied divergent policy.
  - **Evidence:** symlink/realpath result, file set, and digest comparison where needed.
  - **On fail:** reject plugin-source readiness and route repair to sync ownership.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-04** `[required, do-confirm]` Every partial runtime view is reported exactly and left for the topology owner rather than hand-repaired here.
  - **Applicability:** conditional — a configured runtime view does not expose all four companions.
  - **Source:** GB-7; GOBBI-SCN-08-D.
  - **Pass condition:** expected/actual sets and missing paths are reported, the canonical bundle remains complete, and no out-of-scope view edit occurs.
  - **Evidence:** runtime-view inventories and exact changed-path allowlist.
  - **On fail:** reject the scope or completeness claim and restore one-owner wiring discipline.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-05** `[gate/killer, do-confirm]` A look-alike copied runtime bundle cannot pass as the canonical source.
  - **Applicability:** conditional — a runtime view is a directory or materialized copy rather than the verified canonical view.
  - **Source:** GB-7; GOBBI-SCN-08-E.
  - **Pass condition:** canonical path and digest checks prove identity; matching filenames or headings alone never pass.
  - **Evidence:** source/view canonical paths, symlink topology, and content digests.
  - **On fail:** consequence — stale bootstrap policy may execute; reject cold-use readiness and route repair to sync ownership.
  - **Resolution:** ______

- [ ] **GOBBI-CHK-VIEW-06** `[gate/killer, do-confirm]` The renamed `workflow` mirror resolves and zero UNCLASSIFIED old-skill-path mirror directory survives.
  - **Applicability:** conditional — the skill was renamed and the mirrors regenerated.
  - **Source:** GB-7; GOBBI-SCN-08-F.
  - **Pass condition:** `.claude/skills/workflow/` (with its `steps/` subdirectory) and `.agents/skills/workflow` resolve to the canonical `workflow` directory, and a scoped residual sweep of the mirror trees yields zero UNCLASSIFIED old-skill-path references — every residual hit is a documented leave, not a live look-alike view. This pass condition is phrased zero-UNCLASSIFIED, never "zero grep hits."
  - **Evidence:** realpath of the renamed mirror plus the classified residual sweep of the mirror trees.
  - **On fail:** consequence — the renamed view is unresolved or a stale look-alike could be cold-loaded as canonical; reject cold-use readiness and route repair to sync ownership.
  - **Resolution:** ______

## Coverage and acceptance close

A filled run closes coverage only when every triggered item has a permitted terminal resolution with inspected evidence. It accepts the Gobbi bootstrap only when every applicable gate and required item is `PASS`, subject solely to the checklist owner's narrow operational killer exception. `recorded-open`, `n/a`, or a topology concern may explain coverage but cannot be counted as `PASS` for an applicable claim.
