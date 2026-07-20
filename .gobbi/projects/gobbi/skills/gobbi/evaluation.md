# Evaluating the Gobbi Bootstrap

This is the evaluation entrypoint for the Gobbi bootstrap operation. It adds bootstrap-specific scenarios, checks, perspective lenses, and verification routes to the active productive-step evaluation. It does not replace [`../evaluation/SKILL.md`](../evaluation/SKILL.md), alter its finding schema or verdict rules, or create another evaluator output.

## Entry

Before reviewing a Gobbi bootstrap change:

1. Read [`SKILL.md`](SKILL.md), [`scenarios.md`](scenarios.md), and [`checklists.md`](checklists.md) completely.
2. Read the current owners linked from `SKILL.md`: Principles, manager role, Mistake, Orchestration and its mistakes, Discussion, Git, Startup, Codex, Record, state machine, delegation, and repository sync.
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
| Project | GOBBI-SCN-01, -03, -05, -06, -07 | FLOOR-01..03; FRESH-01..04; START-01..04; HAND-01..03; RET-01..04 |
| Structure | GOBBI-SCN-01, -02, -06, -08 | FLOOR-01..03; OWN-01..02; CLASS-01..04; HAND-01..04; VIEW-01..05 |
| Performance | GOBBI-SCN-02, -04, -07 | CLASS-04; RESUME-02; RET-01, -03 |
| Aesthetics | GOBBI-SCN-01, -06, -08 | FLOOR-01..03; OWN-01; HAND-03; VIEW-01..05 |
| Usage | GOBBI-SCN-02, -03, -04, -05, -06, -08 | CLASS-01..04; FRESH-01..04; RESUME-01..03; START-01..04; HAND-01..04; VIEW-02..05 |
| Consistency | GOBBI-SCN-01..08 | every checklist ID, with emphasis on OWN-01..02, RESUME-01..03, RET-01..04, VIEW-01..05 |
| Risk | GOBBI-SCN-01..08 | every gate/killer plus CLASS-04, FLOOR-03, RESUME-02, START-03, RET-03, VIEW-02..05 |

The complete checklist ID set is:

- GOBBI-CHK-FLOOR-01, GOBBI-CHK-FLOOR-02, GOBBI-CHK-FLOOR-03.
- GOBBI-CHK-OWN-01, GOBBI-CHK-OWN-02.
- GOBBI-CHK-CLASS-01, GOBBI-CHK-CLASS-02, GOBBI-CHK-CLASS-03, GOBBI-CHK-CLASS-04.
- GOBBI-CHK-FRESH-01, GOBBI-CHK-FRESH-02, GOBBI-CHK-FRESH-03, GOBBI-CHK-FRESH-04.
- GOBBI-CHK-RESUME-01, GOBBI-CHK-RESUME-02, GOBBI-CHK-RESUME-03.
- GOBBI-CHK-START-01, GOBBI-CHK-START-02, GOBBI-CHK-START-03, GOBBI-CHK-START-04.
- GOBBI-CHK-HAND-01, GOBBI-CHK-HAND-02, GOBBI-CHK-HAND-03, GOBBI-CHK-HAND-04.
- GOBBI-CHK-RET-01, GOBBI-CHK-RET-02, GOBBI-CHK-RET-03, GOBBI-CHK-RET-04.
- GOBBI-CHK-VIEW-01, GOBBI-CHK-VIEW-02, GOBBI-CHK-VIEW-03, GOBBI-CHK-VIEW-04, GOBBI-CHK-VIEW-05.

## Perspective lenses

### Project

Ask whether this is one narrow entry operation whose observable outcome is a validated Orchestration cursor. Confirm it covers every locked entry trigger, fresh/default/custom path, exact resume cardinality, context boundary, Startup branch, removed-system absence, and cold-entry proof. Confirm it does not become another workflow, record, discussion, Git, peer, plugin, or productive-step owner.

Trace GB-P01..GB-P12 to scenarios and checks. Compare the four changed paths with the allowlist and the locked design. Treat a broad catalog, alternate route, or copied owner procedure as a scope failure even when all required words appear.

**Recommended verification:** exact changed/untracked path inventory; parent-rule omission sweep; fresh defaults and customized fixtures; exact-one/zero/multiple classifiers; Startup accept/decline/rich-baseline fixtures; protected role and plugin version diffs.

**Anti-patterns:** accepting a renamed legacy entrypoint; preserving an old feature/skill catalog for familiarity; treating later topology work as permission to omit the canonical companion; expanding scope to repair root/runtime consumers.

### Structure

Ask whether `SKILL.md` is the sole bootstrap policy owner and Procedure is dominant. Check the fixed operation shape, the exact `Session Bootstrap Order` anchor, one-way owner links, and direct siblings. Confirm companions only exercise parent clauses and do not add a bootstrap rule.

Inspect seams: Gobbi → Orchestration for classification/routing; Gobbi → Startup for baseline validity; Orchestration → Record/Git for mutation; active entry view → canonical source for loading. There must be no second router, direct productive-specialist route, plugin-topology procedure, or workflow tree.

**Recommended verification:** heading inventory; parent/companion rule-key crosswalk; link resolution; direct-dispatch search; source-to-owner ledger; inbound Startup anchor check.

**Anti-patterns:** a companion repairing missing parent policy; duplicate fresh/resume algorithms; a runtime task view acting as state; embedded question or delegation templates; a plugin/symlink manual hidden in bootstrap steps.

### Performance

Ask whether entry work is bounded by the current worktree and triggered owners. Confirm no all-worktree scan, transcript parsing, rollout lookup, operational ledger reconstruction, or unconditional loading of every specialist. The required complete manager floor is not a cost optimization target.

Check idempotence at context boundaries: an already-seen runtime ID produces no manifest churn; a valid resume does not rerun defaults or Startup. Runtime cost or token pressure cannot narrow the downstream dual-system contract owned by Orchestration.

**Recommended verification:** accessed-path trace for classification; file-read set; before/after manifest digest for duplicate runtime ID; question/load count on resume; dependency search for capture and telemetry.

**Anti-patterns:** scanning all worktrees “just in case”; treating fewer required floor reads as optimization; rerunning Startup on every resume; keeping removed telemetry to make classification faster.

### Aesthetics

Ask whether a cold manager can find the next action, stop condition, and owner without reading a catalog. The first page should state the outcome and boundary. `Session Bootstrap Order` should be visible under Procedure. Rule IDs, step names, and evidence language should be literal and stable.

Inspect concision without allowing semantic loss. The parent must name every required floor source and conditional owner, but it should point to mechanics rather than copy them. Companion IDs and tables should support navigation rather than repeat prose.

**Recommended verification:** first-page cold read; heading order; paragraph/sentence scan; anchor generation; owner-link click-through; retired-vocabulary and broad-catalog search.

**Anti-patterns:** decorative bootstrap language; a long glossary; unexplained abbreviations; repeated policy banners; wording that confuses runtime compaction with durable-memory maintenance.

### Usage

Walk the operation as the real manager in these cases:

1. local zero-session fresh start with defaults;
2. local zero-session customized settings;
3. exactly one valid unfinished session;
4. multiple unfinished sessions;
5. `/clear`, rewind, and runtime compaction with new and duplicate runtime IDs;
6. rich baseline, missing-baseline accept, and missing-baseline decline;
7. explicit baseline reset after an earlier session;
8. absent hooks, transcripts, rollouts, and telemetry;
9. cosmetic legacy and protected role contradictions;
10. native Codex, plugin-source, and partial runtime views; and
11. a missing owner or invalid durable cursor.

For every path, confirm the manager knows what happens next and what evidence blocks it. A partial runtime view must report the exact missing companions and owner, not invite a hand-built repair. Non-UI accessibility requires scannable headings, literal choices supplied by Discussion, and expanded owner names; locale-specific rendering remains Discussion-owned.

**Recommended verification:** scenario walkthrough, cold-reader owner discovery, exact error/recovery messages, load/action trace, runtime-view inventories, and successful owner handoff.

**Anti-patterns:** asking the user to reconstruct session state; silently choosing among multiple sessions; vague “resume workflow” with no cursor; direct specialist dispatch because its step looks obvious; treating missing hooks as a warning.

### Consistency

Compare every bootstrap claim against its owner. Check version 5 settings placement, version 3 cursor terms, runtime ID append rules, current-worktree classification, defaults timing, Startup classification, conditional loads, and protected exceptions. Confirm `step`, `stage`, and `iteration` are the only active router vocabulary used here.

Run synonymous searches for retired behavior, not one literal. Search for alternate interaction-mode routes; separate settings; hook/env/capture/transcript/rollout/telemetry dependencies; durable-memory compaction; direct productive-step dispatch; retired dual-system creation words; broad roster/skill/value-feature/output catalogs; and legacy hook-child links.

Confirm the canonical bundle is visible through `.agents/skills/gobbi` and plugin source. Record any partial `.claude/skills/gobbi` per-file companion view as an exact later topology concern; do not narrow the source bundle or edit the view in this task.

**Recommended verification:** scoped residual search, manifest/state schema comparison, Startup inbound-anchor resolution, all relative-link resolution, canonical/symlink realpaths, legacy hook-child hash, protected role/TOML diff, and plugin manifest/version diff.

**Anti-patterns:** trusting one matching heading as semantic union; ignoring synonyms; copying a stale consumer back into the owner; hiding a protected contradiction by editing the protected file; calling a partial runtime view complete.

### Risk

Challenge the high-consequence edges: user authority before mutation; Gobbi UUID versus runtime ID; cross-worktree session confusion; invalid state guessed from filenames; stale environment or transcript metadata; automatic Startup writes; direct productive dispatch; a runtime task-list writeback; protected source mutation; and manual topology repair.

Require byte/object preimages for fresh and failure paths. Verify missing identity, failed initialization, invalid resume state, missing owner, and partial runtime view preserve the last valid state and surface a precise recovery owner. Absence of retired capture surfaces must not reduce safety because they have no active authority.

**Recommended verification:** before/after Git refs, worktrees, session roots, manifests, state digests, protected hashes, view diffs, and negative fixtures for stale/ambiguous inputs.

**Anti-patterns:** guessing a runtime ID; creating an “empty” scaffold before approval; using a global pointer; weakening validation to resume; overwriting settings on context loss; treating plugin version change as a harmless repair.

## Overall

Overall must answer all of these:

1. Can a cold manager reconstruct its behavioral and authority floor from this parent alone?
2. Does every entry trigger preserve one Gobbi identity and produce exactly one validated Orchestration cursor?
3. Does a fresh run stay read-only until the defaults/customize decision?
4. Do zero, exact-one, multiple, and explicit-path classifications have distinct evidence-based outcomes?
5. Does Startup run only through its classifier and correct user-owned trigger?
6. Can missing hooks, transcripts, rollouts, telemetry, modes, separate settings, and memory compaction remain absent without degraded operation?
7. Do current owners outrank cosmetic legacy while protected role and manifest files remain unchanged?
8. Do the canonical, native Codex, and plugin-source views expose the operation, with partial later-task views reported honestly?
9. Would a cosmetically compliant old entrypoint fail at least one scenario and killer check?

Overall cannot PASS when an applicable gate or required item is not PASS, subject only to the checklist owner's narrow operational exception. Coverage closure is not acceptance. A material source change resets the review and requires two fresh full reports.

## Rule-key crosswalk

| Parent source | Scenario evidence | Checklist evidence | Primary perspectives |
|---|---|---|---|
| GB-P01 | GOBBI-SCN-01-A, GOBBI-SCN-08-A | FLOOR-01, VIEW-01 | Project, Structure, Aesthetics, Consistency |
| GB-P02 | GOBBI-SCN-01-A, GOBBI-SCN-01-D | FLOOR-01, FLOOR-02, OWN-02 | Project, Usage, Consistency, Risk |
| GB-P03 | GOBBI-SCN-01-B | FLOOR-03 | Structure, Performance, Usage, Consistency |
| GB-P04 | GOBBI-SCN-04-A..B | RESUME-01, RESUME-02 | Project, Performance, Usage, Consistency, Risk |
| GB-P05 | GOBBI-SCN-02-A..D | CLASS-01..04 | Project, Structure, Performance, Usage, Risk |
| GB-P06 | GOBBI-SCN-03-A..D | FRESH-01..04 | Project, Usage, Consistency, Risk |
| GB-P07 | GOBBI-SCN-04-A..C | RESUME-01, START-04 | Project, Usage, Consistency |
| GB-P08 | GOBBI-SCN-05-A..E | START-01..04 | Project, Usage, Consistency, Risk |
| GB-P09 | GOBBI-SCN-06-A..D | HAND-01..04 | Project, Structure, Usage, Consistency, Risk |
| GB-P10 | GOBBI-SCN-01-C..D | OWN-01, OWN-02 | Project, Structure, Aesthetics, Consistency, Risk |
| GB-P11 | GOBBI-SCN-08-A..E | VIEW-01..05 | Structure, Aesthetics, Usage, Consistency, Risk |
| GB-P12 | GOBBI-SCN-07-A..D | RET-01..04 | Project, Performance, Usage, Consistency, Risk |

## Recommended mechanical probes

- Four-key frontmatter order and `skill-type: operation`.
- Top-level order `# Gobbi` → Principles → Rules → Procedure → References, with no top-level Manual.
- Exact `### Session Bootstrap Order` anchor and Startup inbound link.
- Scenario/check ID set equality and bidirectional parent traces.
- Every perspective plus Overall selected, with every checklist ID assigned at least once.
- All relative links resolve from each authored file.
- Exact four-path changed/untracked allowlist and no staged paths.
- Scoped synonymous residual search over the target bundle.
- Canonical, `.agents`, plugin-source, and configured Claude view inventories.
- Protected role Markdown hashes, role TOML diff, legacy hook-child hash, and both plugin-manifest diffs.
- `git diff --check` and main-checkout cleanliness.

## Completion

The Gobbi-specific review is complete only when every applicable scenario and checklist item is in the frozen frame, parent-to-companion traces close both ways, all seven perspectives and Overall inspect their assigned evidence, the normal evaluation report validates, and every non-PASS item has a finding or permitted resolution. No additional evaluator artifact or output path is created.
