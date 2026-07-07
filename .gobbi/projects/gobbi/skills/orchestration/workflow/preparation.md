# Workflow — Preparation (Orchestration)

How the **manager** orchestrates the Preparation Loop. The `leader` and `assistant` specialists that participate load [`preparation/SKILL.md`](../../preparation/SKILL.md) (leader's role spans both DISCUSSION and WORK) and [`record/SKILL.md`](../../record/SKILL.md) (assistant's RECORD procedure).

The Preparation Loop runs **between Ideation and Planning**. Its job is to verify that the **memory** and the **workspace skills** are ready for the planning and execution that follow. If something is missing that downstream work would need, Preparation surfaces it and the user decides how to resolve.

| Phase | Content semantics for Preparation |
|---|---|
| `DISCUSSION` | Manager + user + leader (research-backed scan) identify readiness gaps and decide resolution per gap. |
| `WORK` | Leader documents the readiness assessment AND stages approved gap fixes (new skills, missed memory promotions) at `sessions/{date}-{session-id}/2-preparation/staging/`; Wrap-up promotes to memory. |
| `EVALUATION` | Dual-system evaluators apply the leader's plan-evaluation criteria + perspective lenses. |
| `RECORD` | Assistant synthesizes canonical `preparation.md` into session staging only — memory promotion is the sole responsibility of Wrap-up. |

---

## DISCUSSION Phase (manager + user + leader)

**Manager's job**: orchestrate the readiness review with the user, spawning the `leader` to scan memory + workspace skills, then present found gaps for user resolution. Detailed sub-step content lives in [`preparation/SKILL.md`](../../preparation/SKILL.md); this section covers the **orchestration choreography**.

### Leader spawn pattern

Same pattern as Ideation and Planning. The leader is spawned for scans and proposals; the manager-user dialogue happens between leader returns:

```
manager → opens DISCUSSION with user (state: "advancing from Ideation to Preparation")
manager → spawns leader: "read 1-ideation/outputs/ and produce a readiness signal list"
leader → reads ideation + memory + skills → returns scan results
manager → presents leader's gap analysis → active runtime's user-decision primitive per gap → user picks resolutions
manager → re-engages leader to apply approved fixes during WORK
```

### Sub-step orchestration

The manager runs the user through five sub-steps in order. Each is gated by the active runtime's user-decision primitive before advancing.

| # | Sub-step | Manager's role | Leader's contribution |
|---|---|---|---|
| A | Read Ideation Output | Confirm Ideation output is complete; user signals readiness to advance | Read `1-ideation/outputs/` + accumulated feature memory; output a readiness signal list (files / domains / perspectives the downstream work will need) |
| B | Design + Memory Readiness Check | Present found gaps; user decides per gap | Scan `features/{feature-name}/design/`, `scenarios/`, `checklists/`, `decisions/`, `mistakes/` (each by-area type nests under `{area}/` subdirs — scan recursively, descending into every area subdir) against the readiness signal list; propose resolution per missing item |
| C | Execution Skills Readiness Check | Approve skill generation per gap through the active runtime's user-decision primitive | Identify missing project-specific skills (e.g., `{project}-typescript-conventions`); propose generate / defer / re-Ideate |
| D | Gap Resolution Plan | Run the active runtime's user-decision primitive per gap to lock the resolution table | Present the consolidated gap table (category / severity / proposal); record user decisions |

### When to escalate to user

The leader brings draft proposals; the user makes final calls. Every decision below requires the active runtime's user-decision primitive:

- Confirmation that Ideation output is sound enough to proceed (Sub-step A)
- Per-gap resolution: generate now / defer / re-Ideate / skip (Sub-steps B / C / D)
- Skill slug for any newly-generated project-specific skill (Sub-step D)

### Re-Ideate routing

If any gap's resolution is **Re-Ideate**, Preparation halts:
1. Manager records the re-Ideate decision and the gap that triggered it in the discussion log.
2. Manager re-enters the Ideation Loop with the gap as new input.
3. After Ideation re-completes, Preparation re-runs from Sub-step A.

This is **not** a Preparation `REVISE` and **not** an evaluation verdict — it's a DISCUSSION-phase user decision (Sub-step D) that halts Preparation *before* WORK, EVALUATION, and RECORD run, so it never reaches EVALUATION verdict aggregation. The reconciled Preparation verdict is only ever `PASS` / `REVISE` / `FAIL` — re-Ideate is never one of them. It's an upstream loop re-entry; Preparation's own iteration counter does not increment.

---

## WORK Phase (leader documents + executes approved gap fixes)

**Manager's job**: spawn the leader for documentation. The leader writes the draft at `sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md` AND stages the approved gap fixes at `sessions/{date}-{session-id}/2-preparation/staging/`. Wrap-up is the sole promoter of staged artifacts to memory — with one narrow exception: generated skills are promoted before Planning starts (see below).

Manager-side responsibilities:
- Confirm the draft contains every required section (Scope reference / Readiness summary / per-category readiness / Generated this loop / Deferred / Decisions log)
- Verify that every "Generate now" decision produced a real artifact on disk (the leader is expected to do this; the manager spot-checks)
- Stage the draft in `working/`; the leader's transcripts land in the session-root `transcripts/`
- On re-entry from a `REVISE` ITER, pass prior evaluator findings as additional input

WORK execution is more than documentation here, because Preparation's purpose is to **make the gaps go away**. New skills are staged at `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md` — the staging step closes the gap for downstream planning. On EVALUATION PASS, the manager copies `2-preparation/staging/skills/{slug}/SKILL.md` → `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` BEFORE Planning starts (per `preparation/SKILL.md` narrow sole-writer exception — in-session consumers need the skill available during Planning and Execution). All other Preparation staging follows the standard Wrap-up promotion path.

**Dual-system production (proposer spawn).** When `propose.mode: dual` (per-loop; default `dual`), the manager also orchestrates the dual-system **proposer** spawn per [`workflow/production.md`](production.md) during WORK — a Codex proposer runs in parallel with the leader; the leader selectively integrates the frozen proposal and Codex never writes the canonical artifact.

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Preparation-specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract)
- **Output path**: per-iter scoped at `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{system}/{perspective}.md`
- Phase-specific focus typically emphasizes gap coverage (was every needed item checked?), generation quality (do new skills meet the project's template bar?), and re-Ideate triggering (is any gap actually unworkable rather than just missing?)
- The evaluators verify the leader's generated artifacts pass the same quality bar that the `interview` skill enforces for stamped skills

---

## RECORD Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent. The assistant synthesizes canonical `preparation.md` per [`workflow/record.md`](record.md) and [`record/SKILL.md`](../../record/SKILL.md). For Preparation, the assistant also stages Wrap-up routing candidates:

- New project-specific skills from this loop → `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md`
- `scenario_gap` / `checklist_gap` findings → `sessions/{date}-{session-id}/2-preparation/staging/{scenarios,checklists}/{slug}.md`

Wrap-up reads these staging directories and routes them to `features/{feature-name}/README.md`, `features/{feature-name}/scenarios/`, and `features/{feature-name}/checklists/` per its promotion routing table.

### Per-iteration session record is NOT committed (gitignored)

There is **no** per-iteration session-record commit. The whole `sessions/` tree is gitignored (`.gitignore:21`), worktree-local, and removed at worktree cleanup (D7 — see [`record/record-map.md`](../../record/record-map.md)). A `git commit` aimed at the iteration's `working/`, `evaluation/iter{n}/`, `staging/`, or the canonical `preparation.md` captures **nothing**: `git add` of a `sessions/` path is refused (`paths are ignored ... Use -f`), and a bare `git commit` reports `nothing to commit, working tree clean` and exits non-zero. So the manager does **not** run a `chore(session): record ...` commit after RECORD.

Iteration boundaries are recorded in `session.json.workflow.preparation.iterations[]`, not in git. Durable memory exists **only** via Wrap-up promotion: Wrap-up copies promotable `staging/` content into tracked `features/`, `mistakes/`, `rules/`, etc. Only promoted content survives the session.

The narrow-exception `chore(skills): promote {slug}` generate-now commit documented in [`preparation/SKILL.md`](../../preparation/SKILL.md) is **different**: it commits a generated skill into the **tracked** `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` path (not under gitignored `sessions/`) on EVALUATION PASS, so in-session consumers have the skill available during Planning and Execution. That commit is real because its target is tracked.

---

## ITER / EXIT Decision

After `RECORD`, the manager decides based on the reconciled verdict:

| Verdict | Action |
|---|---|
| `PASS` | Exit the loop; advance to Planning Loop |
| `REVISE` | Re-enter `DISCUSSION` with evaluator findings as new input |
| `FAIL` | Escalate through the active runtime's user-decision primitive; user decides revise / re-enter Ideation / abort |
| `SKIPPED` | Exit the loop (Preparation was skipped per settings — only valid when memory is mature and the manager is confident no gaps exist) |

(A `re-Ideate` decision is **not** in this table: it is resolved in DISCUSSION (Sub-step D) and halts Preparation before EVALUATION — see [Re-Ideate routing](#re-ideate-routing) — so it never produces a verdict here.)

Iteration cap: `workflow.preparation.maxIterations` (Auto 5; Chat 0 — Preparation is skipped in Chat via `skip: true` + `maxIterations: 0`). When the cap is reached without `PASS`, the manager forces user escalation.

---

## Output

The canonical tree is [`record/record-map.md`](../../record/record-map.md); Preparation's loop dir is `2-preparation/`.

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/
├── transcripts/                       ← single session-root surface; {role}-{agentId}.jsonl per agent, all loops
└── 2-preparation/
    ├── outputs/                ← canonical synthesized preparation.md (assistant, RECORD, PASS only)
    ├── working/                ← leader drafts (per iteration), discussion log, research refs
    ├── evaluation/
    │   └── iter{n}/
    │       ├── claude/{perspective}.md
    │       └── codex/{perspective}.md
    └── staging/                ← session-staged artifacts (incl. skills/), promoted to memory by Wrap-up
```

Plus session-staged outputs by the leader during WORK — routed to memory by Wrap-up only:
- New project-specific skills → `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md`
- Missed memory promotion candidates → `sessions/{date}-{session-id}/2-preparation/staging/{type}/{slug}.md` (Wrap-up promotes these to memory at session close)

---

## Cross-references

- Leader's preparation procedure → [`preparation/SKILL.md`](../../preparation/SKILL.md)
- Ideation output that becomes Preparation's input → [`workflow/ideation.md`](ideation.md)
- Planning that follows Preparation → [`workflow/planning.md`](planning.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Proposer orchestration → [`workflow/production.md`](production.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../../delegation/SKILL.md)
- Project-specific skill template (for "Generate now" decisions) → [`interview/templates/project-skill.md`](../../interview/templates/project-skill.md)
