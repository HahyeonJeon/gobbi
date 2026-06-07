# Workflow — Ideation (Orchestration)

How the **manager** orchestrates the Ideation Loop. The `leader`, `evaluator`, and `assistant` specialists that participate load [`ideation/SKILL.md`](../../ideation/SKILL.md) for the loop contract, [`research/SKILL.md`](../../research/SKILL.md) when doing Sub-step C research, [`evaluation/SKILL.md`](../../evaluation/SKILL.md) for the per-perspective procedure, and [`memorization/SKILL.md`](../../memorization/SKILL.md) for template-stamping conventions.

**Ideation focuses on What / Why / How.** Planning concentrates on Who / When / Where; the Ideation Loop's job is to lock the **idea**, not the execution plan.

The Ideation Loop runs the four-phase iteration shape — `DISCUSSION` → `WORK` → `EVALUATION` → `MEMORIZATION` → `ITER / EXIT`. Phase semantics for Ideation:

| Phase | Content semantics for Ideation |
|---|---|
| `DISCUSSION` | Manager + user + leader (research-backed opinion) work through four sub-steps (A Frame What/Why / B Lock Scope / C Research / D Design). Every decision is settled via AskUserQuestion before WORK begins. |
| `WORK` | Leader documents the DISCUSSION outcome into the canonical rawdata draft and stages reference + backlog artifacts under `sessions/{date}-{session-id}/ideation/staging/`. Documentation + session-memory staging — no new content. |
| `EVALUATION` | Dual-system evaluators (Claude Code + Codex) run the four-stage procedure across all seven perspectives + Overall. Manager reconciles into a `PASS` / `REVISE` verdict. |
| `MEMORIZATION` | Assistant runs **after every EVALUATION** (PASS or REVISE) to preserve the iteration's transcript and update `session.json`. On `PASS` it additionally emits the loop's `artifacts/` files and stages typed-finding artifacts under `staging/`. **No writes to project memory** — Wrap-up handles session → project promotion. |

---

## DISCUSSION Phase (manager + user + leader)

**Manager's job**: orchestrate the What / Why / How discussion with the user, spawning the `leader` for research-backed opinion at the right moments. The detailed sub-step content (forcing questions, Scope Contract template, research procedure, design decisions, evaluation criteria) lives in [`ideation/SKILL.md`](../../ideation/SKILL.md); this section covers the **orchestration choreography**.

### Leader spawn pattern

The leader does **not** observe the entire user dialogue. The manager spawns the leader **as needed** to retrieve research-backed input on the next decision point, then continues the user discussion with that input:

```
manager → opens DISCUSSION with user (states framed problem at high level)
manager → spawns leader for Sub-step A: "research root cause / impact / prior attempts; build steel-man counterfactual; apply re-framing check"
leader → researches + returns to manager
manager → presents leader's findings as draft proposals → AskUserQuestion → user decides
manager → spawns leader again for Sub-step B (Lock Scope), then Sub-step C (Research, loads research skill), etc.
...
```

Multiple leader spawns are normal. MEMORIZATION preserves the leader's record as the audit trail for "what research informed each decision". Under **fresh spawns**, that record is the full set of per-spawn leader transcripts. Under **leader continuation** (one teammate carried across sub-steps — see below), it is the single continued-leader transcript that spans those turns; one transcript across turns still preserves the whole research chain, so continuation does not lose audit coverage.

### Leader continuation across sub-steps (Agent Teams)

The leader spawn pattern above describes the **fresh-spawn fallback** — the manager re-spawns the leader for each sub-step. Where Agent Teams is enabled, the manager instead **continues** the same leader teammate across Sub-steps A→B→C→D→WORK, which is the strongest in-loop token saver: the teammate keeps the framed problem, scope, and insights in-context, so it does not re-derive root-cause or re-read `features/`/`mistakes/` each sub-step.

The decision rule, the delta-brief shape, and the evaluator-FORBIDDEN wall live in [`delegation/SKILL.md` § Continue vs Fresh](../../delegation/SKILL.md#continue-vs-fresh); this section states only the Ideation-specific choreography.

- **In-loop (A→B→C→D→WORK), team + session live → CONTINUE.** The first sub-step spawns the leader with the full Load Directives stack; each later sub-step sends a delta-brief (next sub-step's goal + new inputs + re-stated scope + status), not a full re-paste.
- **Cross-loop (Ideation→Preparation→Planning) → CONTINUE best-effort, live-only.** A single leader teammate may carry the same problem understanding downstream **only while the team + session stay live**. It DEGRADES to a fresh, re-primed teammate at the first `/compact`, `/clear`, or resume — an in-process teammate does not survive any of those. Cross-loop continuation is therefore best-effort, never a promised single persistent leader spanning all loops.
- **Fresh-spawn fallback.** If Agent Teams is off (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` unset) or the teammate has died, the manager fresh-spawns with a full brief and re-primes from durable session memory (`rawdata/`, `staging/`, `state.json`). Continuation is preferred-where-safe, never a hard dependency.

### Sub-step orchestration

The manager runs the user through four sub-steps in order. Each is gated by AskUserQuestion before advancing.

| # | Sub-step | Manager's role | Leader's contribution |
|---|---|---|---|
| A | Frame What and Why | Run the **six forcing questions** via AskUserQuestion: root cause / impact / success criteria / prior attempts / counterfactual (steel-man) / re-framing check | Research root cause / impact / prior attempts; build steel-man counterfactual; apply re-framing check; draft answers for user to refine |
| B | Lock Scope (Project-Feature-Task contract) | Run decomposition discussion; AskUserQuestion to pick the workflow's task and lock the Scope Contract | Enumerate candidate tasks; propose pick based on dependency analysis; provide field values for the Scope Contract template |
| C | Research | Present leader's internal + external insights to user **separately**; let user push back / refine | Load [`research/SKILL.md`](../../research/SKILL.md); run Internal Research and External Research deeply; extract insights using the Insight format. Internal and external insights are managed independently |
| D | Design | Present leader's scenarios + checklist + directional design decisions + validation strategy to user; iterate until satisfied | Propose scenarios (golden / edge / failure / adversarial); anchored implementation checklist; **directional design decisions** (library / framework / design pattern / API shape / etc.) with rationale anchored to insights. Detailed mechanism deferred to Execution |

After Sub-step B, the manager stamps `project`, `feature`, `task` into `session.json` (top-level fields) and bootstraps the **session loop directory** at `sessions/{date}-{session-id}/ideation/{rawdata,staging,evaluation}/`. The manager does **not** touch `features/{feature-name}/...` during Ideation; that path is owned by Wrap-up's project-memory promotion.

### When to escalate to user

The leader brings draft proposals; the user makes final calls. Every decision below requires AskUserQuestion:

- Confirmation of the framed problem — all six forcing questions (Sub-step A)
- Re-framing go/no-go (Sub-step A, question 6)
- Scope Contract confirmation (Sub-step B)
- Backlog routing of non-chosen candidates (Sub-step B)
- Insight acceptance / rejection — internal AND external, surfaced separately (Sub-step C)
- Scenario list completeness (Sub-step D)
- Design decision direction when alternatives exist (Sub-step D)
- Contribution points surfaced by leader at any sub-step

---

## WORK Phase (leader documents + stages)

**Manager's job**: spawn the leader for documentation + session-memory staging. The leader's job in WORK is to record what was decided in DISCUSSION into a draft at `sessions/{date}-{session-id}/ideation/rawdata/draft-iter{n}.md` and to stage reference + backlog artifacts under `sessions/{date}-{session-id}/ideation/staging/`.

Manager-side responsibilities:
- Confirm the leader's rawdata draft contains every required section (Scope Contract / Framed Problem / Research Insights / Scenarios / Implementation Checklist / Design / Decisions Log)
- Stage the draft in `rawdata/` along with prior leader transcripts (research turns from DISCUSSION)
- Verify staged artifacts under `staging/{references,backlogs/feature,backlogs/project}/` match the Sub-step B and Sub-step C decision lists
- On re-entry from a `REVISE` ITER, pass prior evaluator findings as additional input — the leader incorporates the corrections during the next DISCUSSION round, then re-documents

WORK is short by design. The substantive thinking happened in DISCUSSION; WORK formalizes and stages it. **No writes to project memory** — every output lives under `sessions/{date}-{session-id}/ideation/`.

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Ideation-specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract) — Project / Structure / Performance / Aesthetics / Usage / Consistency / Risk
- **Cross-system divergence** is derived by comparing per-system files at MEMORIZATION; no separate divergence file is written

Verdict is `PASS` or `REVISE`. **Both verdicts advance to MEMORIZATION first** (so each iteration's transcript + `session.json` entry is preserved regardless of outcome). The ITER / EXIT decision happens after MEMORIZATION.

---

## MEMORIZATION Phase (delegated to `assistant`, runs every iter)

**Manager's job**: spawn the `assistant` agent after every EVALUATION verdict — `PASS` or `REVISE`. The assistant follows [`ideation/SKILL.md` § MEMORIZATION Phase](../../ideation/SKILL.md#memorization-phase) and [`memorization/SKILL.md`](../../memorization/SKILL.md) for template-stamping.

Every iteration the assistant:
- Preserves the Claude Code transcript window at `sessions/{date}-{session-id}/ideation/rawdata/transcript-iter{n}.jsonl`
- Appends `{iter: n, verdict, finishedAt}` to `session.json.workflow.ideation.iterations[]`

Only on `PASS` the assistant additionally:
- Emits the canonical `sessions/{date}-{session-id}/ideation/artifacts/`
- Stages typed-finding artifacts under `sessions/{date}-{session-id}/ideation/staging/{scenarios,checklists,decisions,references,design,discussions}/`
- Sets `session.json.workflow.ideation.finishedAt` and the loop's final `verdict: PASS`

**No writes to project memory** under any verdict. All session staging waits for Wrap-up to promote to `features/{feature-name}/...` after the workflow completes.

### Per-iteration session-memory commit cadence

After every iteration's MEMORIZATION completes (`PASS`, `REVISE`, or `FAIL`), the manager creates a session-memory commit on the worktree branch capturing the iteration's outputs (`rawdata/`, `evaluation/iter{n}/`, `staging/`, and the `session.json` upsert; plus `artifacts/` on `PASS`). The commit subject is:

```
chore(session): record ideation iter{n} memory
```

with the canonical `AI-Provenance-Record:` trailer in the commit body per `git/conventions.md:116-119`. Use the heredoc form so the trailer actually lands:

```
git -C "$worktreePath" commit -m "$(cat <<'EOF'
chore(session): record ideation iter{n} memory

AI-Provenance-Record: gobbi://session/{session-id}/loop/ideation/iter{n}
EOF
)"
```

Substitute `{session-id}` and `{n}` from session state. The commit lands on the worktree branch (per `orchestration/SKILL.md § Configuration Step 1` row 1 (Create Worktree)) and is absorbed into the PR at merge. Verify the trailer landed with `git -C "$worktreePath" log -1 --format=%B` before proceeding.

---

## ITER / EXIT Decision

After `MEMORIZATION` (which always runs), the manager decides based on the reconciled verdict:

| Verdict | Action |
|---|---|
| `PASS` | Exit the loop; advance to Planning Loop. `artifacts/` files + `staging/` artifacts are ready for Wrap-up's project-memory promotion |
| `REVISE` | Re-enter `DISCUSSION` with evaluator findings as additional input. The current iter's transcript + draft + evaluation files are preserved under `rawdata/` and `evaluation/` |
| `FAIL` | Escalate via AskUserQuestion; user decides revise / abort / reframe |
| `SKIPPED` | Exit the loop (Ideation was skipped per settings) |

Iteration cap: `workflow.ideation.maxIterations` (default 5). When the cap is reached without `PASS`, the manager forces user escalation.

---

## Output

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/ideation/
├── artifacts/             ← PASS-iter output files (free filenames + mandatory frontmatter; assistant, MEMORIZATION, PASS only)
├── rawdata/
│   ├── draft-iter{n}.md           ← leader's rawdata draft per iteration (WORK)
│   ├── transcript-iter{n}.jsonl   ← preserved transcript per iteration (MEMORIZATION, every iter)
│   └── discussion-log.md          ← manager-captured AskUserQuestion exchanges
├── evaluation/
│   └── iter{n}/
│       ├── claude/{perspective}.md
│       └── codex/{perspective}.md
└── staging/                ← session-staged artifacts, promoted to project memory by Wrap-up
    ├── references/{slug}.md
    ├── backlogs/feature/{slug}.md
    ├── backlogs/project/{slug}.md
    ├── scenarios/{slug}.md      ← PASS-only (from scenario_gap findings)
    ├── checklists/{slug}.md     ← PASS-only (from checklist_gap findings)
    ├── decisions/{slug}.md      ← PASS-only (from design_flaw / assumption_risk findings)
    ├── design/{slug}.md         ← PASS-only (from canonical Design section)
    └── discussions/{slug}.md    ← PASS-only (from discussion log)
```

Plus updates to `sessions/{date}-{session-id}/session.json` — `workflow.ideation.iterations[]` appended every iter; `workflow.ideation.finishedAt` + final `verdict` set on PASS.

**No writes to project memory** during Ideation. The `features/{feature-name}/...` tree is created and populated by Wrap-up using `staging/` as the source — see [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md).

---

## Cross-references

- Leader's discussion + documentation procedure → [`ideation/SKILL.md`](../../ideation/SKILL.md)
- Internal + external research procedure → [`research/SKILL.md`](../../research/SKILL.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Assistant's MEMORIZATION procedure (templates + routing) → [`memorization/SKILL.md`](../../memorization/SKILL.md)
- Synthesis orchestration → [`workflow/memorization.md`](memorization.md)
- Wrap-up's project-memory promotion → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Discussion mechanics → [`discussion/SKILL.md`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation/SKILL.md`](../../delegation/SKILL.md)
