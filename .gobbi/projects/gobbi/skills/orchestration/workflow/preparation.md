# Workflow — Preparation (Orchestration)

How the **manager** orchestrates the Preparation Loop. The `leader` and `assistant` specialists that participate load [`preparation/SKILL.md`](../../preparation/SKILL.md) (leader's role spans both DISCUSSION and WORK) and [`memorization/SKILL.md`](../../memorization/SKILL.md) (assistant's MEMORIZATION procedure).

The Preparation Loop runs **between Ideation and Planning**. Its job is to verify that the **project memory** and the **workspace skills** are ready for the planning and execution that follow. If something is missing that downstream work would need, Preparation surfaces it and the user decides how to resolve.

| Phase | Content semantics for Preparation |
|---|---|
| `DISCUSSION` | Manager + user + leader (research-backed scan) identify readiness gaps and decide resolution per gap. |
| `WORK` | Leader documents the readiness assessment AND stages approved gap fixes (new skills, missed memory promotions) at `sessions/{date}-{session-id}/preparation/staging/`; Wrap-up promotes to project memory. |
| `EVALUATION` | Dual-system evaluators apply the leader's plan-evaluation criteria + perspective lenses. |
| `MEMORIZATION` | Assistant synthesizes canonical `preparation.md` into session staging only — project-memory promotion is the sole responsibility of Wrap-up. |

---

## DISCUSSION Phase (manager + user + leader)

**Manager's job**: orchestrate the readiness review with the user, spawning the `leader` to scan project memory + workspace skills, then present found gaps for user resolution. Detailed sub-step content lives in [`preparation/SKILL.md`](../../preparation/SKILL.md); this section covers the **orchestration choreography**.

### Leader spawn pattern

Same pattern as Ideation and Planning. The leader is spawned for scans and proposals; the manager-user dialogue happens between leader returns:

```
manager → opens DISCUSSION with user (state: "advancing from Ideation to Preparation")
manager → spawns leader: "read ideation/artifacts/ and produce a readiness signal list"
leader → reads ideation + memory + skills → returns scan results
manager → presents leader's gap analysis → active runtime's user-decision primitive per gap → user picks resolutions
manager → re-engages leader to apply approved fixes during WORK
```

### Sub-step orchestration

The manager runs the user through five sub-steps in order. Each is gated by the active runtime's user-decision primitive before advancing.

| # | Sub-step | Manager's role | Leader's contribution |
|---|---|---|---|
| A | Read Ideation Output | Confirm Ideation output is complete; user signals readiness to advance | Read `ideation/artifacts/` + accumulated feature memory; output a readiness signal list (files / domains / perspectives the downstream work will need) |
| B | Design + Memory Readiness Check | Present found gaps; user decides per gap | Scan `features/{feature-name}/design/`, `scenarios/`, `checklists/`, `decisions/`, `mistakes/` against the readiness signal list; propose resolution per missing item |
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

This is **not** a Preparation `REVISE` — it's an upstream loop re-entry. Preparation's own iteration counter does not increment.

---

## WORK Phase (leader documents + executes approved gap fixes)

**Manager's job**: spawn the leader for documentation. The leader writes the draft at `sessions/{date}-{session-id}/preparation/rawdata/draft-iter{n}.md` AND stages the approved gap fixes at `sessions/{date}-{session-id}/preparation/staging/`. Wrap-up is the sole promoter of staged artifacts to project memory — with one narrow exception: generated skills are promoted before Planning starts (see below).

Manager-side responsibilities:
- Confirm the draft contains every required section (Scope reference / Readiness summary / per-category readiness / Generated this loop / Deferred / Decisions log)
- Verify that every "Generate now" decision produced a real artifact on disk (the leader is expected to do this; the manager spot-checks)
- Stage the draft and prior leader transcripts in `rawdata/`
- On re-entry from a `REVISE` ITER, pass prior evaluator findings as additional input

WORK execution is more than documentation here, because Preparation's purpose is to **make the gaps go away**. New skills are staged at `sessions/{date}-{session-id}/preparation/staging/skills/{slug}/SKILL.md` — the staging step closes the gap for downstream planning. On EVALUATION PASS, the manager copies `preparation/staging/skills/{slug}/SKILL.md` → `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` BEFORE Planning starts (per `preparation/SKILL.md` narrow sole-writer exception — in-session consumers need the skill available during Planning and Execution). All other Preparation staging follows the standard Wrap-up promotion path.

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Preparation-specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract)
- **Output path**: per-iter scoped at `sessions/{date}-{session-id}/preparation/evaluation/iter{n}/{system}/{perspective}.md`
- Phase-specific focus typically emphasizes gap coverage (was every needed item checked?), generation quality (do new skills meet the project's template bar?), and re-Ideate triggering (is any gap actually unworkable rather than just missing?)
- The evaluators verify the leader's generated artifacts pass the same quality bar that the `interview` skill enforces for stamped skills

---

## MEMORIZATION Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent. The assistant synthesizes canonical `preparation.md` per [`workflow/memorization.md`](memorization.md) and [`memorization/SKILL.md`](../../memorization/SKILL.md). For Preparation, the assistant also stages Wrap-up routing candidates:

- New project-specific skills from this loop → `sessions/{date}-{session-id}/preparation/staging/skills/{slug}/SKILL.md`
- `scenario_gap` / `checklist_gap` findings → `sessions/{date}-{session-id}/preparation/staging/{scenarios,checklists}/{slug}.md`

Wrap-up reads these staging directories and routes them to `features/{feature-name}/README.md`, `features/{feature-name}/scenarios/`, and `features/{feature-name}/checklists/` per its promotion routing table.

### Per-iteration session-memory commit cadence

After every iteration's MEMORIZATION completes (`PASS`, `REVISE`, or `FAIL`), the manager creates a session-memory commit on the worktree branch capturing the iteration's outputs (`rawdata/`, `evaluation/iter{n}/`, `staging/`, the canonical `preparation.md`, and the `session.json` upsert). The commit subject is:

```
chore(session): record preparation iter{n} memory
```

with the canonical `AI-Provenance-Record:` trailer in the commit body per `git/conventions.md:116-119`. Use the heredoc form so the trailer actually lands:

```
git -C "$worktreePath" commit -m "$(cat <<'EOF'
chore(session): record preparation iter{n} memory

AI-Provenance-Record: gobbi://session/{session-id}/loop/preparation/iter{n}
EOF
)"
```

Substitute `{session-id}` and `{n}` from session state. The commit lands on the worktree branch (per `orchestration/SKILL.md § Configuration Step 1` row 1 (Create Worktree)) and is absorbed into the PR at merge. Verify the trailer landed with `git -C "$worktreePath" log -1 --format=%B` before proceeding. This commit is distinct from the narrow-exception `chore(skills): promote {slug}` generate-now commit documented in [`preparation/SKILL.md`](../../preparation/SKILL.md) — the generate-now commit fires on EVALUATION PASS for in-session skill availability; the session-memory commit fires after every MEMORIZATION regardless of verdict.

---

## ITER / EXIT Decision

After `MEMORIZATION`, the manager decides based on the reconciled verdict:

| Verdict | Action |
|---|---|
| `PASS` | Exit the loop; advance to Planning Loop |
| `REVISE` | Re-enter `DISCUSSION` with evaluator findings as new input |
| `FAIL` | Escalate through the active runtime's user-decision primitive; user decides revise / re-enter Ideation / abort |
| `RE-IDEATE` | Special verdict — at least one gap is unworkable without re-Ideation. Manager re-enters the Ideation Loop, then re-runs Preparation. |
| `SKIPPED` | Exit the loop (Preparation was skipped per settings — only valid when project memory is mature and the manager is confident no gaps exist) |

Iteration cap: `workflow.preparation.maxIterations` (default 5). When the cap is reached without `PASS`, the manager forces user escalation.

---

## Output

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/preparation/
├── preparation.md          ← canonical synthesized output (assistant, MEMORIZATION)
├── rawdata/                ← leader drafts (per iteration), agent transcripts (scan + WORK), discussion log
└── evaluation/
    ├── claude/{perspective}.md
    └── codex/{perspective}.md
```

Plus session-staged outputs by the leader during WORK — routed to project memory by Wrap-up only:
- New project-specific skills → `sessions/{date}-{session-id}/preparation/staging/skills/{slug}/SKILL.md`
- Missed memory promotion candidates → `sessions/{date}-{session-id}/preparation/staging/{type}/{slug}.md` (Wrap-up promotes these to project memory at session close)

---

## Cross-references

- Leader's preparation procedure → [`preparation/SKILL.md`](../../preparation/SKILL.md)
- Ideation output that becomes Preparation's input → [`workflow/ideation.md`](ideation.md)
- Planning that follows Preparation → [`workflow/planning.md`](planning.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Synthesis orchestration → [`workflow/memorization.md`](memorization.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../../delegation/SKILL.md)
- Project-specific skill template (for "Generate now" decisions) → [`interview/templates/project-skill.md`](../../interview/templates/project-skill.md)
