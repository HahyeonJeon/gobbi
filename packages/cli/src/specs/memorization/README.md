# Memorization step spec

The wide-sweep productive step in the v0.5.0 workflow. After `execution_eval` passes, the CLI enters `memorization` — the step where the orchestrator reads the session's produced artifacts and conversation, extracts decisions, state, open questions, and gotchas, and commits them where the next session can discover them. Memorization writes the durable record; the subsequent `handoff` step writes the narrow cover sheet that points into it.

Authoritative design: [`v050-features/orchestration/README.md`](../../../../../.gobbi/projects/gobbi/design/v050-features/orchestration/README.md) §1 (the 6-step workflow), §1.1 (why split memorization from handoff), §8 (the memorization step). Wave A.2 reconciles the legacy 5-step language in `../../v050-overview.md` and `.claude/CLAUDE.md` to the 6-step model.

---

## Purpose in the v0.5.0 workflow

Memorization is orchestrator-authored — there are no delegated subagents or evaluators. The orchestrator reads the session's conversation and durable artifacts, writes session-scoped gotchas to `.gobbi/projects/<name>/gotchas/`, writes durable decisions to `.gobbi/projects/<name>/learnings/decisions/`, updates project documentation for any convention or precedent the session introduced, refreshes the user-level MEMORY index when warranted, and commits `memorization.md` to the session's memorization directory.

Memorization is the wide step in the memorization → handoff pair: many rawdata sources, many extraction destinations. Handoff is the narrow step: one source (this artifact plus last-N events), one destination (`handoff.md` plus one `gobbi.db::memories` row). The state machine advances `memorization → handoff → done` on `workflow.step.exit` then `workflow.finish` per the graph in [`../index.json`](../index.json).

---

## Path-pointer manifest

Rawdata reaches the memorization agent as a **path-pointer manifest**, not as inlined content. The artifact slot of the compiled prompt holds a markdown table — columns `path | bytes | kind | purpose` — that names every rawdata source in scope. The agent reads files selectively per section of `memorization.md` it is writing, using the `Read` tool against the manifest's paths.

**Why.** Spike 3 (2026-04-25) measured the prior inline-content design at 30+ rawdata transcripts and the spec's then-0.3 `artifacts` budget. Compile latency was fine (≤ 16 ms p95), but the budget allocator dropped the entire `dynamic.context` section wholesale once the concatenated artifact payload exceeded the 0.3-slot capacity — a silent semantic regression where the agent entered memorization with zero rawdata in its prompt despite the compile completing. Whole-section atomic inclusion (`packages/cli/src/specs/budget.ts:14-18`) is correct at the section level; the bug was inlining all 30 transcripts into one section. Path pointers replace that section with a few hundred bytes of paths plus one-line purpose tags, which the allocator never has to drop. Full empirical record: [`learnings/decisions/2026-04-25-spike-3-memorization-compile-latency.md`](../../../../../.gobbi/projects/gobbi/learnings/decisions/2026-04-25-spike-3-memorization-compile-latency.md).

**Manifest contract** (rendered from `blocks.static.rawdata-manifest-contract`):

- The agent gets paths, not content. It opens files on demand with the `Read` tool, scoped to the section of `memorization.md` currently being written.
- Recognized `kind` values: `subagent`, `main`, `state-snapshot`, `learnings-decision`, `learnings-gotcha`, `step-artifact`, `exit-plan`, `step-readme`. Each `kind` cues which `memorization.md` section(s) the entry is most load-bearing for.
- The manifest is non-exhaustive. The agent also consults `git log`, the project README, the `design/` tree, and prior-session `memorization.md` entries linked from `learnings/`.
- When the manifest is absent or empty (early sessions, or sessions running before the runtime manifest generator lands), the agent falls back to a direct walk of `sessions/<id>/` plus the orchestrator transcript path recorded in `metadata.json`.

**Runtime generation is wave B.1's job.** A.1.6 ships the spec contract — the prose that tells the agent how to read a manifest. The compile-pipeline change that actually populates `dynamic.artifacts` with manifest entries (instead of `[]` per `commands/workflow/next.ts:255`) lands in wave B.1, which owns `assembly.ts`/`next.ts`. The spec is correct ahead of the runtime; the runtime conforms to the spec when B.1 lands.

**Implementation status (Wave A.1).** The manifest contract is locked in this spec, but the runtime currently passes `dynamic.artifacts: []` to the assembly pipeline (`commands/workflow/next.ts:255`). Wave B.1 implements the manifest generator that walks the seven rawdata source classes enumerated below and emits the markdown table the prompt expects. Until then, agents reading the rendered prompt see no artifact section — the synthesis block's reading rules instruct them to fall back to a direct walk of `sessions/<id>/` plus the orchestrator transcript path recorded in `metadata.json`, so the step still functions in the interim.

---

## Rawdata sources (manifest covers these)

The synthesis block enumerates seven rawdata source classes the memorization agent may need to read. The runtime manifest will list path pointers grouped by `kind`; the prose in `blocks.synthesis` documents the full set so the agent can fall back when the manifest is absent:

1. **Main session transcript** — `~/.claude/projects/-playinganalytics-git-gobbi/<session-id>.jsonl`. The orchestrator's full conversation log.
2. **Subagent transcripts** — `~/.claude/projects/-playinganalytics-git-gobbi/<session-id>/subagents/*.jsonl`. Per-subagent runs.
3. **Captured rawdata** — `.gobbi/projects/<name>/sessions/<session-id>/raw-data/transcripts/*.jsonl`. Files copied by capture hooks.
4. **Recent project decisions** — `.gobbi/projects/<name>/learnings/decisions/*.md`. Latest entries (often subsume what would otherwise be re-recorded).
5. **Mid-session gotchas** — `.gobbi/projects/<name>/gotchas/*.md`. Gotchas written during the session, candidates for cross-session escalation.
6. **Per-step durable artifacts** — `sessions/<session-id>/{ideation,planning,execution,execution_eval}/*.md`.
7. **State-snapshot extracts** — workspace event-store rows for this session via `gobbi workflow events`, surfaced as `state-snapshot` manifest entries.

## Extraction destinations (where the agent writes)

| Destination | What goes here | Lifecycle |
|---|---|---|
| `sessions/<id>/memorization/memorization.md` | The per-session record (the artifact named in `meta.expectedArtifacts`). Six-section structure from `blocks.static.artifact-shape`. | Permanent; future sessions read it via handoff's pointer |
| `.gobbi/projects/<name>/learnings/decisions/<YYYY-MM-DD>-<slug>.md` | One file per durable decision the session locked. Cross-linked from `memorization.md::Decisions`. | Permanent; promoted at memorization |
| `.gobbi/projects/<name>/gotchas/<slug>.md` | One file per non-obvious correction the user surfaced. Written before `memorization.md` so the artifact's `Gotchas recorded` section has real files to point at. | Permanent; `gobbi gotcha promote` for cross-project escalation |
| User-level MEMORY index + per-topic memory file | Auto-memory updates when a session warrants an index entry (e.g. shipped PR, phase milestone). | Permanent |
| Project README / design docs | Convention, precedent, or directory-structure changes the session introduced. | Permanent |

---

## spec.json structure

| Section | Purpose |
|---------|---------|
| `meta` | Orchestrator-only step: no `allowedAgentTypes`, `maxParallelAgents: 0`, required skills `_gotcha` + `_project`, expected artifact `memorization.md`, completion signal `Stop`. Description references the path-pointer manifest contract. |
| `transitions` | One exit edge — unconditional `always`. Per-step declarative mirror; the authoritative routing is the `memorization → handoff` edge in [`../index.json`](../index.json). |
| `delegation.agents` | Empty array — Memorization does not spawn subagents |
| `tokenBudget` | `staticPrefix: 0.3, session: 0.1, instructions: 0.4, artifacts: 0.1, materials: 0.1` — sized for a path-pointer manifest. The `instructions` slot grew to absorb the manifest-reading flow + the rawdata-source / extraction-destination enumeration; the `artifacts` slot shrank because manifest payload is at most a few hundred bytes per entry. See *Token budget rationale* below. |
| `blocks.static` | Role, principles (now including the manifest-reading invariant), scope-boundary, the memorization artifact shape contract, and the dedicated `rawdata-manifest-contract` block |
| `blocks.conditional` | Force-memorization recovery context (entered when the feedback-round cap fired and the user chose to persist partial work) |
| `blocks.delegation` | Empty object — no delegated agents means no per-agent prompt bodies |
| `blocks.synthesis` | The end-to-end pipeline: read manifest → walk session → cross-check artifacts → write gotchas → write decisions → update project docs and MEMORY → commit `memorization.md` → emit completion signal. Includes the rawdata-source list (7 classes) and the extraction-destination list (5 targets) from §7.3 / §8.2 of the orchestration design. |
| `blocks.completion` | The completion instruction and six-criterion acceptance list (memorization.md exists; gotchas written; decisions written and cross-linked; MEMORY index updated; project docs reflect the session; no prior-step artifacts modified) |

The full schema lives in [`../_schema/v1.ts`](../_schema/v1.ts). Every field is validated at load time by `validateStepSpec()`.

### Token budget rationale

Spike 3 found that 0.3 sized for inlined content was empirically broken at scale (the whole-section drop). Path pointers are tiny — the manifest for 30 transcripts is ≤ ~10 KB ≈ 2.5k tokens. At a 200k context window 0.10 of `artifacts` is 20k tokens of headroom; at the 60k budget proxy used in Spike 3 it is 6k tokens, still ample. The 0.20 freed from `artifacts` flows to `instructions` (0.2 → 0.4) because the synthesis block's manifest-reading flow and the rawdata-source / extraction-destination enumeration are the load-bearing prose that the manifest pattern depends on; the agent must not lose the *how-to-read* alongside any partial-fit drop. `staticPrefix`, `session`, and `materials` stay fixed.

---

## Completion signal: `Stop`

Memorization emits `Stop` rather than `SubagentStop` because it is orchestrator-only. Like Plan and Handoff, there is no subagent whose stop event marks the step complete; the orchestrator itself signals completion after the memorization artifact is written, gotchas and decisions have been committed, the MEMORY index is up to date, and project documentation reflects the session.

---

## Force-memorization pathway

The `force-memorization-context` conditional block fires when `feedbackCapExceeded` — the workflow hit the maxFeedbackRounds cap at `execution_eval` and the user invoked `gobbi workflow resume --force-memorization` to persist partial work rather than abort. The block adjusts the memorization instruction: the artifact must explicitly note which plan tasks converged, which did not, and what the accumulated evaluation findings say about the blocked tasks.

Future sessions reading a force-memorized artifact must see that the work is partial. The conditional block exists to prevent the memorization prose from smoothing an unfinished state into a success narrative.

---

## Project documentation coupling

Memorization is the step that updates project-level documentation — the session's README entries, design-doc changes, the `learnings/` tree, and the user-level MEMORY index. The `_project` required skill provides the project-documentation structure the memorization prose references. If the session added files, changed conventions, or set precedent, the project documentation must reflect that before the step completes; a memorization artifact that references undocumented changes is a broken handoff.

---

## Updating the snapshot tests

The snapshot tests in [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) lock the compiled prompt for three session states. They exist to surface regressions in any assembly-pipeline module — a change in `assembly.ts`, `budget.ts`, `skills.ts`, or this spec that alters compiled output will fail one or more snapshots.

When a change to the compiled output is intentional — e.g., you edited `spec.json` prose or added a new conditional block — regenerate the snapshots by running:

```
bun test src/specs/memorization/__tests__/snapshot.test.ts --update-snapshots
```

Inspect the diff in `__snapshots__/snapshot.test.ts.snap`, confirm the new snapshot reflects the intent, and commit the updated snapshot together with the spec change. The commit that updates a snapshot must also explain why the output changed.

Never edit snapshot files by hand. A drift between the snapshot and the compiled output is always a bug — either in the spec, in an assembly-pipeline module, or in the test fixture.

---

## Related files

- [`spec.json`](spec.json) — the spec itself
- [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) — end-to-end compile tests across three fixtures
- [`../_schema/v1.ts`](../_schema/v1.ts) — schema this spec validates against
- [`../assembly.ts`](../assembly.ts) — `compile()` entry point; `renderDynamicContext` (lines 496-515) is what wave B.1 will repoint at the manifest renderer
- [`../budget.ts`](../budget.ts) — `defaultBudgetAllocator` the snapshot tests feed in; the whole-section-inclusion-only invariant (lines 14-18) is what made inline rawdata unbudgeable
- [`../index.json`](../index.json) — workflow graph that references `./memorization/spec.json` and routes `memorization → handoff` on `workflow.step.exit`
- [`../execution/spec.json`](../execution/spec.json) — the upstream step whose execution the memorization artifact records
- [`../handoff/spec.json`](../handoff/spec.json) — the downstream step that reads `memorization.md` and writes the narrow cover sheet
- [`../../../../../.gobbi/projects/gobbi/learnings/decisions/2026-04-25-spike-3-memorization-compile-latency.md`](../../../../../.gobbi/projects/gobbi/learnings/decisions/2026-04-25-spike-3-memorization-compile-latency.md) — Spike 3 outcome that locked the path-pointer manifest pattern
