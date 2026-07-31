# Gobbi Bootstrap Scenarios

## Set contract

- **Purpose:** prove that a cold manager rebuilds the five-skill floor, presents the skill-map index, and routes by session kind — for a general or a full-workflow session — without recreating retired behavior, forcing the workflow owner, or writing from the entry.
- **Target:** [`SKILL.md`](SKILL.md) and only the bootstrap edges it owns.
- **Consumer:** the Gobbi operational checklist and both fresh evaluators of a Gobbi-entry change.
- **Lifecycle:** design obligations; freeze this source before an evaluation run.
- **Scope:** entry-boundary read-only setup, the floor of exactly five, conditional owner loads, the skill-map index, resume identity across runtime boundaries, session-kind routing, the read-only handoff to the workflow owner, retired-machinery absence, and canonical/runtime entry views.
- **Non-goals:** fresh/resume classification cardinality, fresh initialization, Configuration mechanics, state transitions, record bytes, question-card rendering, delegation formats, Git commands, peer commands, plugin repair, and productive-step methods — all owned by the indexed `workflow` skill or another current owner, not by the entry.
- **Scale:** seven families and twenty-seven cases. The author thresholds are twelve families and eighty distinct category/case-type cells. Split by bootstrap concern if either threshold is exceeded.
- **Stable IDs:** `GOBBI-SCN-<family>-<case>`; wording changes do not renumber an ID.
- **Evidence policy:** cite inspected paths, manifests, state, commands, and runtime views. Never embed runtime secrets or private conversation data.

## Realignment note (dropped families map to removed parent clauses)

This set is realigned to the rewritten `SKILL.md` rule set (GB-1..GB-7 plus the Skill map and Must-not blocks). Three earlier families are dropped because the parent clauses they traced to were removed, not because the situations stopped mattering — the trace stays closed and no orphan case remains:

- The **session-classification cardinality** family (zero / one / multiple unfinished sessions) is dropped: GB-5 moves fresh/resume classification to the indexed `workflow` owner; the entry no longer classifies.
- The **fresh defaults + initialization** family (defaults/customize, UUID, branch/worktree, Record init) is dropped: the "Keep the entry read-only" principle and GB-5 move all creation to the `workflow` owner's Configuration; the entry writes nothing. The read-only property is retained as GOBBI-SCN-06-C.
- The **fresh-session startup-classifier gate** family is dropped: the Must-not rules retire the gate; `startup` is only an indexed skill (GOBBI-SCN-09), and the retired-gate absence is guarded by GOBBI-SCN-07-D.

The **mandatory one-cursor handoff** obligation is reshaped, not kept: GB-6 makes the handoff conditional on the session being a workflow session (GOBBI-SCN-06-A), so the entry hands off only for a workflow session.

## Source register

Every source is a live clause in the rewritten `SKILL.md`.

| Source | Parent clause | Obligation |
|---|---|---|
| GB-1 | GB-1, Procedure 1 | Run at every entry/context boundary and establish the canonical source without writing. |
| GB-2 | GB-2, Procedure 2 | Rebuild the floor of exactly five in the declared order, then the applicable rules and the canonical manager role; admit no sixth skill. |
| GB-3 | GB-3, Procedure 3 | Load a conditional owner (`codex`; the workflow assignment skeleton) only before its triggered action; the floor already covers `discussion` and `git`. |
| GB-4 | GB-4, Procedure 4 | Preserve the Gobbi UUID and version 3 cursor across a boundary, let the workflow owner and Record append a distinct runtime identity, and reuse settings without reconfiguring. |
| GB-5 | GB-5, Procedure 5, Principle "Keep the entry read-only" | Point classification, the read-only preflight, session-tree/manifest creation, and settings placement at the indexed `workflow` owner; the entry itself writes nothing. |
| GB-6 | GB-6, Procedure 5, Principle "Route on demand" | Route by session kind: a general session runs on the floor; a workflow session enters the `workflow` owner at the validated cursor; never dispatch a productive specialist directly; a blocked handoff reports the exact invalid artifact. |
| GB-7 | GB-7, Procedure 1, References | Current owners govern; a cosmetic legacy heading or protected role text cannot reactivate retired behavior; the entry resolves the canonical four-file bundle and its mirror views; route mirror repair to the sync owner. |
| GB-MAP | `## Skill map` section, Principle "Route on demand" | Index every non-floor skill once (name + one-line description + neutral relevance note); the index is not a load-when gate. |
| GB-MN | Rules § Must not follow | Bootstrap needs no interaction-mode question or alternate route, no forced workflow load or startup/baseline-classifier gate, no separate settings file, no hook/transcript/rollout/ledger/telemetry dependency, and no durable-memory merge, threshold, cap, or compaction; the absence of retired machinery is valid operation. |

## Coverage register

| # | Category | Disposition | Positive and stress carriers |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | GOBBI-SCN-10-A, GOBBI-SCN-01-A |
| 2 | Actors / stakeholders / use-context | selected | GOBBI-SCN-01-A, GOBBI-SCN-10-A..B |
| 3 | Behavior / state / data | selected | GOBBI-SCN-04-A..B, GOBBI-SCN-06-A |
| 4 | Interfaces / dependencies / structure | selected | GOBBI-SCN-06-A..E, GOBBI-SCN-08-A..F, GOBBI-SCN-09-A..B |
| 5 | Quality attributes / resource economics | selected | GOBBI-SCN-04-B, GOBBI-SCN-09-B; entry loading stays lazy and bounded |
| 6 | Failure / recovery / operations | selected | GOBBI-SCN-06-D, GOBBI-SCN-08-D |
| 7 | Trust / harm / governance | selected | GOBBI-SCN-06-C, GOBBI-SCN-07-B, GOBBI-SCN-01-D |
| 8 | Inclusion / locale | selected | GOBBI-SCN-08-B..C; both runtime entry environments reach the same literal operation |
| 9 | Change / compatibility / reversibility | selected | GOBBI-SCN-04-A, GOBBI-SCN-07-C, GOBBI-SCN-08-F |
| 10 | Evidence / traceability / clarity | selected | GOBBI-SCN-01-A..D, GOBBI-SCN-08-A..F, GOBBI-SCN-09-A |

All ten categories are exercised here. Applicable case types are positive, alternative-valid, negative, boundary, failure/recovery, adversarial, change/regression, and counterfactual. Every family has a dedicated adversarial face. No inseparability record is used.

## Category and case matrix

| Family | Declared primary category and reason | Secondary categories | Cases |
|---|---|---|---|
| 01 Manager floor and skill map | 10, because a cold reader's complete owner trace is the discrimination | 1, 2, 4, 7 | positive, alternative-valid, adversarial, change |
| 04 Resume and runtime boundary | 9, because identity and context change while durable state remains | 3, 5, 7 | positive, boundary, adversarial |
| 06 Session-kind routing and read-only handoff | 4, because the entry-to-workflow-owner seam defines the family | 1, 6, 7, 10 | positive, adversarial, adversarial, failure, counterfactual |
| 07 Retired-system absence | 9, because the operation must remain valid after removed dependencies | 3, 6, 7, 10 | positive, adversarial, change, negative |
| 08 Canonical and runtime views | 10, because source identity and followable wiring prove cold use | 4, 6, 8, 9 | positive, alternative-valid, boundary, failure, adversarial, change |
| 09 Skill-map index | 4, because the index is the routing structure that points at every non-floor owner | 1, 5, 10 | positive, adversarial |
| 10 General versus workflow routing | 1, because the dual-purpose light entry serving both session kinds is the outcome | 2, 4 | positive, alternative-valid, adversarial |

## GOBBI-SCN-01 — Complete manager floor and skill map

**Actor/outcome:** a cold manager knows its authority and can find every non-floor owner before any decision or mutation. **Sources:** GB-1, GB-2, GB-3, GB-7. **Priority:** killer.

### GOBBI-SCN-01-A — Cold entry reads the floor and presents the index

- **Primary type / coverage-role:** Positive / positive.
- **Given:** a manager enters with no retained skill context.
- **When:** it follows `Session Bootstrap Order` through the floor.
- **Then:** exactly the five floor skills — `principles`, `delegation`, `discussion`, `ideation`, `git` — are read in that order, then the applicable rules and the canonical manager role, and the skill map is available before any action; nothing is written.
- **Failure oracle:** a required floor skill is unread or read after action, a sixth skill is read as floor, the manager role is skipped, or the entry writes before acting.
- **Evidence tuple:** ordered file-read register with exactly five floor entries plus first-action trace; direct inspection confirms.
- **Obligation / checks:** the parent must be cold-load sufficient, ordered, and read-only. GOBBI-CHK-FLOOR-01, GOBBI-CHK-FLOOR-02.

### GOBBI-SCN-01-B — Conditional owner loading

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** one run reaches a native Codex peer surface, and a workflow-session run reaches specialist-brief authoring.
- **When:** the manager approaches each boundary.
- **Then:** `codex` loads before the Codex-peer action, and the workflow assignment skeleton loads before the brief; `discussion` and `git` are already floor and are not re-loaded as conditional owners.
- **Failure oracle:** a governed action precedes its owner, `discussion`/`git` are treated as conditional, or the entry copies the owner's mechanics.
- **Evidence tuple:** load/action ordering and owner-link trace; direct inspection confirms.
- **Obligation / checks:** conditional owners load just in time without policy duplication. GOBBI-CHK-FLOOR-03.

### GOBBI-SCN-01-C — Cosmetic legacy or a sixth floor skill

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** an active surrounding document carries a familiar old heading, a plausible alternate route, or an always-load list naming a sixth skill (for example the workflow owner or a language skill) as floor.
- **When:** a manager considers following it instead of the current parent.
- **Then:** the floor stays exactly the five, the extra skill is reached through the skill map on demand, and the manager follows the current canonical owner while reporting the stale consumer for its owning task.
- **Failure oracle:** a cosmetic heading reactivates an alternate route, or a sixth skill silently joins the floor.
- **Evidence tuple:** floor read register, owner-precedence trace, and actual dispatched path; current owner confirms.
- **Obligation / checks:** semantics and the literal count, not familiar labels, choose the floor and route. GOBBI-CHK-FLOOR-02, GOBBI-CHK-OWN-01.

### GOBBI-SCN-01-D — Protected role document contains obsolete workflow text

- **Primary type / coverage-role:** Change / change plus adversarial.
- **Given:** the protected manager role still names retired creation wording, a mandatory workflow-load, or a deleted child.
- **When:** the manager reads it as required role context.
- **Then:** role authority remains loaded, the protected file remains byte-identical, and current owners govern routing; the accepted role inconsistency does not restate the floor.
- **Failure oracle:** bootstrap edits the protected role, follows its obsolete child, or lets it override the floor of five.
- **Evidence tuple:** protected hash, current owner links, and dispatch trace; all three confirm.
- **Obligation / checks:** accepted protected inconsistency cannot regain routing authority. GOBBI-CHK-OWN-02.

## GOBBI-SCN-04 — Resume and runtime context boundary

**Actor/outcome:** a valid session survives lost runtime context without identity or setting drift. **Sources:** GB-4. **Priority:** killer.

### GOBBI-SCN-04-A — New runtime identity attaches

- **Primary type / coverage-role:** Positive / positive plus change.
- **Given:** an exact unfinished session resumes after `/clear`, rewind, or runtime compaction with a newly observed runtime ID.
- **When:** the workflow owner and Record checkpoint the context boundary.
- **Then:** the Gobbi UUID, settings, branch, worktree, and version 3 cursor stay unchanged; the new runtime ID appends once.
- **Failure oracle:** new session, reset cursor, settings prompt, reordered IDs, or a duplicated ID.
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

### GOBBI-SCN-04-C — Resume tries to reconfigure settings

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a valid resumed session has saved settings and a persisted cursor.
- **When:** a manager treats context loss as a fresh conversation and tries to reopen the defaults decision.
- **Then:** the entry rejects the rerun, reuses the stored settings, and resumes the persisted cursor; only explicit reconfiguration through the workflow owner can reopen those choices.
- **Failure oracle:** a repeated defaults question or an implicit setting change on context loss.
- **Evidence tuple:** manifest settings, prior decision evidence, and question trace; absence confirms.
- **Obligation / checks:** a runtime boundary is not a settings reset. GOBBI-CHK-RESUME-01.

## GOBBI-SCN-06 — Session-kind routing and read-only handoff

**Actor/outcome:** the entry writes nothing and hands one validated cursor to the `workflow` owner only for a workflow session. **Sources:** GB-5, GB-6. **Priority:** killer.

### GOBBI-SCN-06-A — Workflow session enters the workflow owner

- **Primary type / coverage-role:** Positive / positive.
- **Given:** the manager judges the task a workflow session and the durable cursor validates.
- **When:** the entry routes by session kind.
- **Then:** it loads the indexed `workflow` owner and enters it at exactly one validated `state.json.current` cursor; the `workflow` owner then holds classification, Configuration, and every productive step. The entry creates nothing.
- **Failure oracle:** the entry invents a stage/task/iteration, forces a second route, or performs Configuration itself.
- **Evidence tuple:** persisted cursor, workflow-owner entry trace, and projected runtime view; direct comparison confirms.
- **Obligation / checks:** the workflow handoff is conditional, singular, and durable. GOBBI-CHK-HAND-01.

### GOBBI-SCN-06-B — Direct productive-specialist dispatch

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** the cursor appears to indicate Ideation, Planning, Execution, or Wrap-up.
- **When:** the entry considers loading that specialist directly.
- **Then:** it rejects the shortcut and enters the `workflow` owner, which owns specialist dispatch.
- **Failure oracle:** a productive skill or specialist is loaded from the entry as the route.
- **Evidence tuple:** load/dispatch trace and delegation owner; absence of direct dispatch confirms.
- **Obligation / checks:** productive routes cannot bypass the workflow owner. GOBBI-CHK-HAND-02.

### GOBBI-SCN-06-C — Entry attempts a mutation before the workflow owner

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a candidate entry wants a branch, worktree, session tree, or manifest ready before loading the `workflow` owner.
- **When:** it attempts the creation.
- **Then:** the entry blocks it and leaves the repository/session preimage unchanged; branch, worktree, session-tree, and manifest creation belong to the `workflow` owner's Configuration.
- **Failure oracle:** an empty directory, branch, worktree, manifest, or state file appears from the entry before the workflow owner runs.
- **Evidence tuple:** before/after path and ref inventory; byte/object equality confirms.
- **Obligation / checks:** the entry writes nothing; "empty" setup still counts as a write. GOBBI-CHK-ROUTE-02.

### GOBBI-SCN-06-D — Blocked handoff on a missing or invalid owner artifact

- **Primary type / coverage-role:** Failure/recovery / failure-recovery.
- **Given:** state, manifest, an owner artifact, or the authority needed for the next boundary cannot be read or validated.
- **When:** the handoff is attempted.
- **Then:** the manager reports the exact artifact, identity, or missing authority and preserves the last valid durable state; no fallback route is invented.
- **Failure oracle:** guessed cursor, default route, or silent downgrade.
- **Evidence tuple:** missing-path/error report and no-transition digest; direct inspection confirms.
- **Obligation / checks:** a blocked seam remains blocked and recoverable. GOBBI-CHK-HAND-03.

### GOBBI-SCN-06-E — Runtime task view as counterfactual router

- **Primary type / coverage-role:** Counterfactual / counterfactual plus adversarial.
- **Given:** the runtime task view disagrees with the persisted cursor.
- **When:** the entry asks which one controls the next step.
- **Then:** the persisted cursor wins and the runtime view is rebuilt as a projection.
- **Failure oracle:** a runtime display changes durable routing.
- **Evidence tuple:** mismatched fixture, state digest, and rebuilt view; direct inspection confirms.
- **Obligation / checks:** a projection cannot become authority. GOBBI-CHK-HAND-04.

## GOBBI-SCN-07 — Retired dependency and retired-mode absence

**Actor/outcome:** bootstrap works with no removed mode, capture, hook, or memory-merging subsystem. **Sources:** GB-MN. **Priority:** killer.

### GOBBI-SCN-07-A — No hook or transcript surface exists

- **Primary type / coverage-role:** Positive / positive.
- **Given:** Claude or Codex starts without Gobbi hook exports, transcript path, rollout path, or agent ledger.
- **When:** bootstrap runs.
- **Then:** floor loading and routing proceed from explicit runtime and durable session inputs.
- **Failure oracle:** missing capture machinery blocks or degrades the entry.
- **Evidence tuple:** absent-path/config inventory and successful routing; direct inspection confirms.
- **Obligation / checks:** retired capture absence is normal. GOBBI-CHK-RET-01.

### GOBBI-SCN-07-B — Stale environment values attempt to override durable identity

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** an environment variable or old transcript metadata names a different session.
- **When:** bootstrap resumes.
- **Then:** the validated manifest and current durable evidence govern; stale capture is ignored.
- **Failure oracle:** an environment or transcript value replaces the Gobbi UUID or cursor.
- **Evidence tuple:** conflicting fixture and selected durable identity; direct comparison confirms.
- **Obligation / checks:** removed observational state has no authority. GOBBI-CHK-RET-02.

### GOBBI-SCN-07-C — Runtime compaction wording

- **Primary type / coverage-role:** Change / change.
- **Given:** context is compacted while durable memory contains ordinary records.
- **When:** the entry reloads.
- **Then:** it reloads the floor and attaches runtime identity if distinct; it does not count, merge, move, or cap memory records.
- **Failure oracle:** context compaction triggers durable-memory maintenance.
- **Evidence tuple:** read/write trace over memory and manifest; only an authorized runtime checkpoint may change.
- **Obligation / checks:** runtime and retired durable-memory compaction remain disjoint. GOBBI-CHK-RET-03.

### GOBBI-SCN-07-D — A separate settings file, mode question, or retired gate appears

- **Primary type / coverage-role:** Negative / negative plus adversarial.
- **Given:** a candidate bootstrap tries to read a separate `settings.json`, force-load the workflow owner on entry, run a startup or baseline-classifier gate, or route by a mode field.
- **When:** the operation is checked.
- **Then:** the candidate fails and follows manifest settings, the floor, and the on-demand skill map.
- **Failure oracle:** any separate settings file, forced workflow load, retired gate, or alternate mode affects routing.
- **Evidence tuple:** root/config inventory and question/route trace; zero active dependency confirms.
- **Obligation / checks:** retired configuration and gate surfaces cannot be compatibility inputs. GOBBI-CHK-RET-04.

## GOBBI-SCN-08 — Canonical bundle and runtime views

**Actor/outcome:** each supported entry surface exposes the same cold-load-sufficient operation, and the renamed views resolve. **Sources:** GB-7. **Priority:** required.

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
- **Given:** a runtime view exposes only part of the four-file bundle.
- **When:** cold-entry proof runs.
- **Then:** the mismatch is reported with exact missing files and routed to the sync/topology owner; this operation does not hand-create view files or weaken the canonical bundle.
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

### GOBBI-SCN-08-F — Renamed mirror resolves and no stale look-alike survives

- **Primary type / coverage-role:** Change / change plus adversarial.
- **Given:** the workflow owner was renamed and the runtime mirrors regenerated through the sync owner.
- **When:** cold-entry proof canonicalizes the runtime skill views.
- **Then:** `.claude/skills/workflow/` (with its `steps/` subdirectory) and `.agents/skills/workflow` resolve to the canonical `workflow` directory, and zero UNCLASSIFIED old-skill-path mirror directory survives — every residual old-path hit is a documented leave, never a live look-alike view.
- **Failure oracle:** the renamed mirror does not resolve, or a stale pre-rename look-alike mirror directory survives and could be cold-loaded as a canonical view.
- **Evidence tuple:** realpath of the renamed mirror plus a scoped residual sweep of the mirror trees classifying every hit as repointed or documented-leave; direct inspection confirms.
- **Obligation / checks:** the rename leaves resolving views and no unclassified stale look-alike. GOBBI-CHK-VIEW-06.

## GOBBI-SCN-09 — Skill-map index

**Actor/outcome:** a cold manager finds every non-floor owner through one indexed entry that points but copies no mechanics, and loads it only on task-need. **Sources:** GB-MAP, GB-2, GB-3. **Priority:** required.

### GOBBI-SCN-09-A — A non-floor skill is indexed once, on demand

- **Primary type / coverage-role:** Positive / positive.
- **Given:** a non-floor skill (for example `memory`, `planning`, or `coding`).
- **When:** a cold reader consults the skill map.
- **Then:** the skill appears exactly once with a name, a one-line description, and a neutral relevance note; the entry points to its owner, copies no mechanics, and the skill is loaded only when the task needs it.
- **Failure oracle:** an indexed entry restates the owner's mechanics, a non-floor skill is missing or duplicated in the index, or an entry reads as a mandatory-load command.
- **Evidence tuple:** skill-map inventory and per-entry field scan; direct inspection confirms.
- **Obligation / checks:** the index orients without copying policy or gating a load. GOBBI-CHK-MAP-01.

### GOBBI-SCN-09-B — Index entry treated as a load-when gate

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a manager reads an index relevance note as a command to load eagerly.
- **When:** it considers force-loading the `workflow` owner or `startup` on entry.
- **Then:** it rejects the eager load; indexed owners load only on task-need, and the floor stays exactly the five.
- **Failure oracle:** an indexed skill is force-loaded on entry, or the index is read as a mandatory-load catalog that swells the floor.
- **Evidence tuple:** entry load register and the triggered-load trace; a floor of exactly five with no eager index load confirms.
- **Obligation / checks:** the index is a bounded on-demand router, not an eager-load gate. GOBBI-CHK-MAP-02.

## GOBBI-SCN-10 — General versus workflow routing

**Actor/outcome:** the same light entry serves a general session and a workflow session, split by routine judgment and never by a mode prompt. **Sources:** GB-6, GB-5, GB-MN. **Priority:** killer.

### GOBBI-SCN-10-A — General session proceeds on the floor

- **Primary type / coverage-role:** Positive / positive.
- **Given:** the manager judges the task a general (non-workflow) session.
- **When:** it routes by session kind.
- **Then:** it works from the floor (`principles`, `delegation`, `discussion`, `ideation`, `git`) and loads any indexed skill the task needs; the `workflow` owner is never loaded; there is no Configuration, session tree, or dual-system machinery.
- **Failure oracle:** a general session cannot proceed without loading the `workflow` owner — the index-not-load split did not lighten the entry.
- **Evidence tuple:** floor load register plus the absence of a `workflow`-owner load and any session-tree write; direct inspection confirms.
- **Obligation / checks:** a general session runs on the floor alone. GOBBI-CHK-ROUTE-01.

### GOBBI-SCN-10-B — Workflow session reaches the workflow owner from the same entry

- **Primary type / coverage-role:** Alternative-valid / alternative-valid.
- **Given:** the manager judges the same entry a workflow session.
- **When:** it routes by session kind.
- **Then:** it loads the indexed `workflow` owner and enters the full workflow; the two flows share one light entry and differ only by the routine routing judgment.
- **Failure oracle:** the workflow path becomes unreachable from the light entry, or reaching it requires a distinct second entrypoint.
- **Evidence tuple:** the recorded session kind and the `workflow`-owner load register; direct inspection confirms.
- **Obligation / checks:** the same entry reaches the workflow lazily. GOBBI-CHK-ROUTE-01.

### GOBBI-SCN-10-C — Retired interaction-mode question is reintroduced

- **Primary type / coverage-role:** Adversarial / adversarial.
- **Given:** a candidate entry adds a user-facing "which mode?" question or an alternate workflow route to pick the session kind.
- **When:** the operation is checked.
- **Then:** it fails; the general-versus-workflow split is the manager's routine judgment from the task, and the retired interaction-mode question stays retired.
- **Failure oracle:** a user-facing interaction-mode prompt or an alternate workflow route reappears in the entry.
- **Evidence tuple:** question/route trace over the entry; zero interaction-mode prompt confirms.
- **Obligation / checks:** session kind is judged, never asked as a mode. GOBBI-CHK-ROUTE-01.

## Trace closure

| Parent source | Scenario carriers | Checklist carriers |
|---|---|---|
| GB-1 | GOBBI-SCN-01-A | FLOOR-01 |
| GB-2 | GOBBI-SCN-01-A, GOBBI-SCN-01-C | FLOOR-02 |
| GB-3 | GOBBI-SCN-01-B | FLOOR-03 |
| GB-4 | GOBBI-SCN-04-A..C | RESUME-01, RESUME-02 |
| GB-5 | GOBBI-SCN-06-C | ROUTE-02 |
| GB-6 | GOBBI-SCN-06-A, -B, -D, -E, GOBBI-SCN-10-A..C | HAND-01, HAND-02, HAND-03, HAND-04, ROUTE-01 |
| GB-7 | GOBBI-SCN-01-C, -D, GOBBI-SCN-08-A..F | OWN-01, OWN-02, VIEW-01..06 |
| GB-MAP | GOBBI-SCN-09-A..B | MAP-01, MAP-02 |
| GB-MN | GOBBI-SCN-07-A..D, GOBBI-SCN-10-C | RET-01, RET-02, RET-03, RET-04 |

Every non-exploratory scenario produces an obligation and a checklist reference. There are no orphan scenarios, uncovered parent clauses, or exploratory cases. Every source row maps to at least one scenario and at least one checklist item; every listed checklist ID is defined in [`checklists.md`](checklists.md).
