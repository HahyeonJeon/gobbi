# Evaluating the Gobbi Bootstrap

This is the evaluation entrypoint for the Gobbi bootstrap operation. It adds bootstrap-specific scenarios, checks, perspective lenses, and verification routes to the active productive-step evaluation. It does not replace [`../evaluation/SKILL.md`](../evaluation/SKILL.md), alter its finding schema or verdict rules, or create another evaluator output.

## Entry

Before reviewing a Gobbi bootstrap change:

1. Read [`SKILL.md`](SKILL.md), [`scenarios.md`](scenarios.md), and [`checklists.md`](checklists.md) completely.
2. Read the current owners linked from `SKILL.md`: Principles, the manager role, the `workflow` owner and its mistakes, Mistake, Discussion, Git, Startup, Codex, Record, the state machine, delegation, and the repository sync owner.
3. Freeze the exact four authored files, their digests, the protected-role and plugin-manifest preimages, and the runtime/source view inventories.
4. Select every scenario whose Given can occur and every checklist item at a triggered pause point. An omitted case or item needs inspected `n/a:<property>` evidence.
5. Add the selected cases and checks to the active evaluation frame. Work a filled copy of the checklist; never mark this source.
6. Run Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall under the active Evaluation skill.
7. Emit one normal schema-valid report. Use the existing ledger, checklist, provenance, verdict derivation, and output path.

Claude and Codex evaluators run this entrypoint independently in fresh contexts. Neither receives the other report before its own report freezes. A material revision to the canonical bundle requires two new complete reports.

## Selection register

Perspective assignment directs attention. It never removes an applicable case or check from the full run.

| Perspective | Primary scenario families | Required checklist selection |
|---|---|---|
| Project | GOBBI-SCN-01, -06, -07, -10 | FLOOR-01..02; ROUTE-01..02; HAND-01..03; RET-01..04 |
| Structure | GOBBI-SCN-01, -06, -08, -09 | FLOOR-02..03; OWN-01..02; MAP-01..03; HAND-01..04; VIEW-01..06 |
| Performance | GOBBI-SCN-04, -07, -09 | RESUME-02; MAP-03; RET-01, -03 |
| Aesthetics | GOBBI-SCN-01, -08, -09 | FLOOR-02; MAP-01..02; VIEW-01..06 |
| Usage | GOBBI-SCN-01, -04, -06, -08, -09, -10 | FLOOR-01..03; RESUME-01..02; ROUTE-01..02; HAND-01..04; MAP-01..03; VIEW-02..06 |
| Consistency | GOBBI-SCN-01..10 | every checklist ID, with emphasis on OWN-01..02, RESUME-01..02, RET-01..04, VIEW-01..06 |
| Risk | GOBBI-SCN-01..10 | every gate/killer plus MAP-03, ROUTE-02, HAND-03, RET-03, VIEW-05..06 |

The complete checklist ID set is:

- GOBBI-CHK-FLOOR-01, GOBBI-CHK-FLOOR-02, GOBBI-CHK-FLOOR-03.
- GOBBI-CHK-OWN-01, GOBBI-CHK-OWN-02.
- GOBBI-CHK-MAP-01, GOBBI-CHK-MAP-02, GOBBI-CHK-MAP-03.
- GOBBI-CHK-RESUME-01, GOBBI-CHK-RESUME-02.
- GOBBI-CHK-ROUTE-01, GOBBI-CHK-ROUTE-02.
- GOBBI-CHK-HAND-01, GOBBI-CHK-HAND-02, GOBBI-CHK-HAND-03, GOBBI-CHK-HAND-04.
- GOBBI-CHK-RET-01, GOBBI-CHK-RET-02, GOBBI-CHK-RET-03, GOBBI-CHK-RET-04.
- GOBBI-CHK-VIEW-01, GOBBI-CHK-VIEW-02, GOBBI-CHK-VIEW-03, GOBBI-CHK-VIEW-04, GOBBI-CHK-VIEW-05, GOBBI-CHK-VIEW-06.

## Perspective lenses

### Project

Ask whether this is one narrow light-entry operation whose observable outcome is a rebuilt five-skill floor plus an on-demand skill map that serves both a general and a workflow session. Confirm it covers every locked entry trigger, the floor of exactly five, the skill-map index, the conditional owner loads, the resume boundary, session-kind routing, the read-only handoff, removed-system absence, and cold-entry proof. Confirm it does not become another workflow, record, discussion, Git, peer, plugin, or productive-step owner, and does not perform classification, Configuration, or fresh initialization itself.

Trace GB-1..GB-7, the Skill map, and the Must-not rules to scenarios and checks. Compare the three changed companion paths with the allowlist and the locked design. Treat a broad catalog, alternate route, forced workflow load, or copied owner procedure as a scope failure even when all required words appear.

**Recommended verification:** exact changed/untracked path inventory; parent-rule omission sweep; floor-of-five read register; general-vs-workflow routing fixtures; read-only-entry pre/post inventory; retired-gate absence search.

**Anti-patterns:** accepting a renamed legacy entrypoint; preserving a dropped classification or fresh-init case for familiarity; keeping a retired startup-classifier or mandatory-handoff obligation; expanding scope to repair root/runtime consumers.

### Structure

Ask whether `SKILL.md` is the sole bootstrap policy owner and Procedure is dominant. Check the fixed operation shape, the exact `Session Bootstrap Order` anchor, the `## Skill map` section, one-way owner links, and direct siblings. Confirm companions only exercise parent clauses and add no bootstrap rule, and that every dropped companion case maps to a removed parent clause while every added case traces to a live one.

Inspect seams: entry → `workflow` owner for classification/Configuration/routing; entry → skill map for on-demand owner discovery; the `workflow` owner → Record/Git for mutation; active entry view → canonical source for loading. There must be no second router, direct productive-specialist route, plugin-topology procedure, or workflow tree in the entry.

**Recommended verification:** heading inventory; parent/companion rule-key crosswalk; skill-map entry-field scan; link resolution; direct-dispatch search; source-to-owner ledger; renamed-mirror realpath.

**Anti-patterns:** a companion repairing missing parent policy; an index entry restating owner mechanics; a runtime task view acting as state; embedded question or delegation templates; a plugin/symlink manual hidden in bootstrap steps.

### Performance

Ask whether entry work is bounded by the floor and on-demand owners. Confirm no all-worktree scan, transcript parsing, rollout lookup, operational ledger reconstruction, or eager loading of the workflow owner, `startup`, or every specialist. The required floor of exactly five is not a cost optimization target, but no sixth skill is loaded eagerly either.

Check idempotence at context boundaries: an already-seen runtime ID produces no manifest churn; a valid resume does not rerun defaults. Runtime cost or token pressure cannot narrow the downstream dual-system contract owned by the `workflow` skill.

**Recommended verification:** entry load register for the floor of five; eager-load search over indexed owners; before/after manifest digest for a duplicate runtime ID; question/load count on resume; dependency search for capture and telemetry.

**Anti-patterns:** scanning all worktrees "just in case"; eagerly force-loading the workflow owner from the index; treating fewer required floor reads as optimization; keeping removed telemetry to make routing faster.

### Aesthetics

Ask whether a cold manager can find the floor, the next action, the stop condition, and every non-floor owner without reading a catalog. The first page should state the outcome and boundary. `Session Bootstrap Order` should be visible under Procedure, and the `## Skill map` should read as a light orientation index — name, one-line description, relevance note — not a policy catalog. Rule IDs, step names, and evidence language should be literal and stable.

Inspect concision without allowing semantic loss. The parent must name every floor source and conditional owner and index every other skill once, but it should point to mechanics rather than copy them.

**Recommended verification:** first-page cold read; heading order; skill-map field scan; anchor generation; owner-link click-through; retired-vocabulary and broad-catalog search.

**Anti-patterns:** decorative bootstrap language; an index entry that copies owner mechanics; unexplained abbreviations; repeated policy banners; wording that confuses runtime compaction with durable-memory maintenance.

### Usage

Walk the operation as the real manager in these cases:

1. a general (non-workflow) session that proceeds on the floor;
2. a workflow session that loads the indexed `workflow` owner from the same entry;
3. `/clear`, rewind, and runtime compaction with new and duplicate runtime IDs;
4. a resume that must not reconfigure settings;
5. a skill-map lookup for a non-floor owner, and the mandatory-but-lazy `mistake` entry;
6. absent hooks, transcripts, rollouts, and telemetry;
7. cosmetic legacy and protected role contradictions, including a sixth-floor-skill temptation;
8. native Codex, plugin-source, renamed, and partial runtime views; and
9. a blocked handoff on a missing owner or invalid durable cursor.

For every path, confirm the manager knows what happens next and what evidence blocks it. A partial or stale runtime view must report the exact missing companions and owner, not invite a hand-built repair. Non-UI accessibility requires scannable headings, literal choices supplied by Discussion, and expanded owner names.

**Recommended verification:** scenario walkthrough, cold-reader owner discovery through the skill map, exact error/recovery messages, load/action trace, runtime-view inventories, and successful workflow-owner handoff.

**Anti-patterns:** asking the user to pick an interaction mode; a general session forced through the workflow owner; vague "resume workflow" with no cursor; direct specialist dispatch because its step looks obvious; treating missing hooks as a warning.

### Consistency

Compare every bootstrap claim against its owner. Check version 5 settings placement (owned by the `workflow` skill), version 3 cursor terms, runtime ID append rules, the deferral of classification/Configuration to the `workflow` owner, conditional loads, the skill-map field contract, and protected exceptions. Confirm `step`, `stage`, and `iteration` are the only active router vocabulary used here.

Run synonymous searches for retired behavior, not one literal. Search for alternate interaction-mode routes; separate settings; a forced workflow load or retired baseline gate on entry; hook/env/capture/transcript/rollout/telemetry dependencies; durable-memory compaction; direct productive-step dispatch; retired creation words; and broad roster/skill/value-feature catalogs. Confirm no residual old-skill-name reference survives in the companions and that every mirror-tree residual is a documented leave, phrased zero-UNCLASSIFIED rather than zero-hits.

Confirm the canonical bundle is visible through `.agents/skills/gobbi`, the plugin source, and the renamed `.claude/skills/workflow/` mirror. Record any partial `.claude/skills/gobbi` per-file view as an exact later topology concern; do not narrow the source bundle or edit the view in this task.

**Recommended verification:** scoped residual search, manifest/state schema comparison, all relative-link resolution, canonical/symlink realpaths, renamed-mirror resolution, protected role/TOML diff, and plugin manifest diff.

**Anti-patterns:** trusting one matching heading as semantic union; ignoring synonyms; copying a stale consumer back into the owner; hiding a protected contradiction by editing the protected file; calling a partial or stale runtime view complete.

### Risk

Challenge the high-consequence edges: the entry writing before the workflow owner runs; Gobbi UUID versus runtime ID; invalid state guessed from filenames; stale environment or transcript metadata; a forced workflow load or retired baseline gate; direct productive dispatch; a runtime task-list writeback; protected source mutation; a stale look-alike mirror; and manual topology repair.

Require byte/object preimages for the read-only-entry and failure paths. Verify missing identity, a blocked handoff, invalid resume state, and a partial or stale runtime view preserve the last valid state and surface a precise recovery owner. Absence of retired capture surfaces must not reduce safety because they have no active authority.

**Recommended verification:** before/after Git refs, worktrees, session roots, manifests, state digests, protected hashes, view diffs, renamed-mirror realpath, and negative fixtures for stale/ambiguous inputs.

**Anti-patterns:** creating an "empty" scaffold from the entry before the workflow owner; guessing a runtime ID; weakening validation to resume; overwriting settings on context loss; treating a stale look-alike mirror as a harmless leftover.

## Overall

Overall must answer all of these:

1. Can a cold manager reconstruct its behavioral and authority floor of exactly five from this parent alone, and find every other owner through the skill map?
2. Does every entry trigger preserve one Gobbi identity and keep the entry read-only, with all creation deferred to the `workflow` owner?
3. Does a general session proceed on the floor without loading the `workflow` owner, and a workflow session enter it at exactly one validated cursor?
4. Is the session-kind split a routine manager judgment rather than a reintroduced interaction-mode question or alternate route?
5. Is every non-floor skill indexed once with name, description, and relevance note, with `mistake` recorded as mandatory-but-lazy and no indexed owner eagerly force-loaded?
6. Can missing hooks, transcripts, rollouts, telemetry, modes, separate settings, retired gates, and memory compaction remain absent without degraded operation?
7. Do current owners outrank cosmetic legacy while protected role and manifest files remain unchanged?
8. Do the canonical, native Codex, plugin-source, and renamed `workflow` mirror views expose the operation, with no stale look-alike surviving and partial views reported honestly?
9. Would a cosmetically compliant old entrypoint — one still carrying the floor-load of the workflow owner, a startup-classifier gate, or a mandatory single-cursor handoff — fail at least one scenario and killer check?

Overall cannot PASS when an applicable gate or required item is not PASS, subject only to the checklist owner's narrow operational exception. Coverage closure is not acceptance. A material source change resets the review and requires two fresh full reports.

## Rule-key crosswalk

| Parent source | Scenario evidence | Checklist evidence | Primary perspectives |
|---|---|---|---|
| GB-1 | GOBBI-SCN-01-A | FLOOR-01 | Project, Structure, Aesthetics, Consistency |
| GB-2 | GOBBI-SCN-01-A, GOBBI-SCN-01-C | FLOOR-02 | Project, Structure, Aesthetics, Consistency, Risk |
| GB-3 | GOBBI-SCN-01-B | FLOOR-03 | Structure, Performance, Usage, Consistency |
| GB-4 | GOBBI-SCN-04-A..C | RESUME-01, RESUME-02 | Performance, Usage, Consistency, Risk |
| GB-5 | GOBBI-SCN-06-C | ROUTE-02 | Project, Consistency, Risk |
| GB-6 | GOBBI-SCN-06-A, -B, -D, -E, GOBBI-SCN-10-A..C | HAND-01..04, ROUTE-01 | Project, Structure, Usage, Consistency, Risk |
| GB-7 | GOBBI-SCN-01-C, -D, GOBBI-SCN-08-A..F | OWN-01, OWN-02, VIEW-01..06 | Structure, Aesthetics, Usage, Consistency, Risk |
| GB-MAP | GOBBI-SCN-09-A..C | MAP-01, MAP-02, MAP-03 | Structure, Aesthetics, Performance, Usage |
| GB-MN | GOBBI-SCN-07-A..D, GOBBI-SCN-10-C | RET-01..04 | Project, Performance, Usage, Consistency, Risk |

## Recommended mechanical probes

- Four-key frontmatter order and `skill-type: operation`.
- Top-level order `# Gobbi` → Principles → Rules → Procedure → References, with no top-level Manual.
- Exact `### Session Bootstrap Order` anchor and `## Skill map` section presence.
- Skill-map completeness: every non-floor skill indexed once with name + one-line description + relevance note, and the `mistake` entry's mandatory-but-lazy note.
- Scenario/check ID set equality and bidirectional parent traces to GB-1..GB-7, the Skill map, and the Must-not rules.
- Every perspective plus Overall selected, with every checklist ID assigned at least once.
- All relative links resolve from each authored file.
- Exact three-path changed/untracked allowlist and no staged paths outside the companions.
- Scoped synonymous residual search over the target bundle for any retired skill-name reference.
- Canonical, `.agents`, plugin-source, renamed `.claude/skills/workflow/`, and configured Claude view inventories.
- Protected role Markdown hashes, role TOML diff, and plugin-manifest diff.
- `git diff --check` and main-checkout cleanliness.

## Completion

The Gobbi-specific review is complete only when every applicable scenario and checklist item is in the frozen frame, parent-to-companion traces close both ways to the live rule set, all seven perspectives and Overall inspect their assigned evidence, the normal evaluation report validates, and every non-PASS item has a finding or permitted resolution. No additional evaluator artifact or output path is created.
