# Project Perspective — 5-Role Agent Taxonomy (iter1, claude)

## Artifact Summary + W/W/H

**Artifact under review**: 5-file bundle at `.gobbi/projects/gobbi/agents/` — `manager.md`, `leader.md`, `executor.md`, `evaluator.md`, `assistant.md`. Defines the gobbi v0.5.0 agent taxonomy that replaces the retired v0.4.x agents.

**What** (extracted): Five role definitions specifying responsibilities, load directives, lifecycles (Study/Plan/Execute/Verify/Memorize), out-of-scope guards, status contracts, anti-patterns, and quality expectations. Each file is a behavioral spec for one role.

**Why** (extracted): To replace the dual-stance v0.4.x agent roster with a 5-role taxonomy that composes into the 6-step workflow (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up). The bundle is foundational — every skill and workflow loop downstream assumes these roles exist and compose correctly.

**How** (extracted): One markdown file per role, each carrying frontmatter (`name`, `description`, `tools`, `model`), then prose sections in a uniform shape. Delegation contract lives in the separate `delegation` skill; phase composition lives in the separate `orchestration` skill.

**W/W/H gate**: What ✓ clear (5 files, each defines a role). Why ✓ clear (taxonomy replacement, downstream dependency). **How ⚠ partially clear** — the agent files themselves are clear, but **the composition mechanism into the 6-step workflow is delegated to `orchestration`/`delegation` skills that the prompt does not surface for cross-check**. Recorded as a Stage-0 finding (F-P-00, Medium) — propagated; does not halt.

## Memory reads

- `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` — Stage procedure + Finding schema + Type/Domain matrix
- `.gobbi/projects/gobbi/skills/ideation/evaluation.md` — phase child doc (closest fit for design artifacts)
- `.gobbi/projects/gobbi/skills/principles/SKILL.md` — the 12 Iron Laws
- `.gobbi/projects/gobbi/skills/delegation/SKILL.md` — delegation templates + Agent Roster table at line 217
- `.claude/CLAUDE.md` (worktree copy) — workflow phase list, principle anchors
- Cross-references: `agents/*.md` (all 5)
- Skills directory listing: confirms `preparation/`, `research/`, `memorization/`, `wrap-up/` skills all exist

## Locked Frame (Stage 1)

### S-P-1: Right problem? The taxonomy actually replaces the retired v0.4 agents and covers their responsibilities
- [ ] Every retired v0.4 agent's responsibility (pi/researcher/agent-evaluator/project-evaluator/skills-evaluator/gobbi-agent) maps to exactly one new role
- [ ] No retired responsibility is silently dropped or quietly stuffed into "manager does it"
- [ ] The "dual-stance retired" claim is supported by a mechanism elsewhere (cross-pollination still produced)

### S-P-2: Scope Contract — each role file enumerates its scope sharply
- [ ] Each agent file has an explicit "Out of scope" section
- [ ] No "etc." or "and related" in any out-of-scope list
- [ ] Boundaries are non-overlapping across the 5 roles

### S-P-3: 6-step workflow composability — all 6 steps have an owner
- [ ] Configuration / Ideation / Preparation / Planning / Execution / Memorization / Wrap-up — each step has a role explicitly assigned to drive its substantive work
- [ ] Each agent file lists every phase it participates in (and matches the manager's phase-routing table)
- [ ] No phase is "spawn an X (or Y)" — ambiguity in ownership is itself a defect

### S-P-4 (adversarial): The taxonomy silently expands manager scope to cover gaps
- [ ] Manager's "out of scope" prohibits doing specialist work, but exceptions ("trivial single-file reads", "single-line edits", "workflow bookkeeping") do not erode Principle 2 (no self-evaluation) or Principle 4 (scope contract)
- [ ] Memorization and Wrap-up phases each name a *specific* worker role, not "spawn an executor (or leader)"
- [ ] No role-shaped hole — e.g., no phase whose work doesn't fit any of the 5 roles

### S-P-5 (adversarial): Dual-stance retirement loses the cross-pollination benefit
- [ ] An alternative mechanism for orthogonal hypotheses is identified (e.g., manager spawns multiple leaders in parallel, or evaluator perspectives produce the divergence)
- [ ] If no alternative exists, the retirement is at minimum acknowledged as a tradeoff with witness

### S-P-6: Counterfactual seriously considered — "do not refactor, keep dual-stance" rejected with evidence
- [ ] The 5-role taxonomy's existence (this PR) is itself grounded in a witness — closed/linked issue or design doc rationale
- [ ] The bundle does not itself need to argue this (separate design doc) but should not contradict the witness either

### S-P-7: Scope drift — agent files quietly redefine phase boundaries
- [ ] No agent file invents a phase not in the canonical workflow
- [ ] Manager's phase-routing list matches every other agent's per-phase load tables

## Per-scenario per-check results (Stage 2)

### S-P-1
- (a) Retired v0.4 mapping: **NO** — no mapping document inside the bundle; only the prompt context asserts replacement. Evidence: grep across `agents/*.md` returns no reference to `pi`/`researcher`/`agent-evaluator`/etc. → **F-P-01**
- (b) Silent drops: **PARTIAL** — `gobbi-agent` (the user-facing plugin agent) has no obvious successor in the 5-role set; the new taxonomy is internal. Whether `gobbi-agent` was retired or simply migrated elsewhere is undocumented → **F-P-02**
- (c) Dual-stance mechanism: **NO** — delegation/SKILL.md says "Single leader per dispatch" (line 45), but no alternative for orthogonal hypotheses is named anywhere in the agent bundle → **F-P-03**

### S-P-2
- (a) Out-of-scope sections: **YES** — all 5 files have them (manager.md:14, leader.md:14, executor.md:14, evaluator.md:20, assistant.md:14)
- (b) "etc." check: **YES** — grep -i "etc\.\|and related" → no hits
- (c) Non-overlapping: **PARTIAL** — manager.md:15 carves out "single-line edits when delegation overhead would dwarf the work" which can overlap with executor scope; manager.md:84 says "spawn an executor (or leader) with the `memorization` skill" — overlapping role assignment is the defect → **F-P-04**

### S-P-3
- (a) Each step has an owner: **NO** — Configuration is "no extra skill" per manager.md:34; Memorization assigns "an executor (or leader)" (manager.md:84) — no dedicated owner. Wrap-up assigns no specific role at all (manager.md:85: "spawn the Wrap-up delegation" — anonymous). **Critical gap.** → **F-P-05**
- (b) Per-phase load tables match: **NO** — manager.md "Load per workflow phase" (lines 33-38) lists Configuration/Ideation/Planning/Execution/Memorization/Wrap-up but **omits Preparation**, yet leader.md:32 explicitly handles Preparation and delegation/SKILL.md:45 lists it. **Direct contradiction.** → **F-P-06**
- (c) No "(or X)" ambiguity: **NO** — manager.md:84 fails

### S-P-4 (adversarial)
- (a) Manager exceptions don't erode P2/P4: **PARTIAL** — "trivial single-file reads to orient yourself" is fine, but "single-line edits when delegation overhead would dwarf the work" is exactly the kind of seam that lets the manager produce code that the manager then "decides is fine" — a self-evaluation hole that Principle 2 forbids. No instruction to spawn an evaluator on manager's own edits → **F-P-07**
- (b) Specific worker named: **NO** — see F-P-05
- (c) No role-shaped hole: **POSSIBLE HOLE** — who synthesizes per-system evaluator outputs into a single recommendation? Manager is told to "discuss with the user" but synthesis is a category of work distinct from orchestration; could need an assistant or a dedicated synthesizer → **F-P-08** (Medium)

### S-P-5 (adversarial)
- (a) Alternative for orthogonal hypotheses: **NO** — no mention anywhere → **F-P-03 (linked)**
- (b) Tradeoff acknowledged: **NO** — neither leader.md nor manager.md mentions the retirement of innovative+best stances; only the prompt says it. Absent witness inside the bundle.

### S-P-6
- (a) Witness for the refactor itself: **NOT VERIFIABLE FROM BUNDLE** — PR #257 is the witness per prompt context; bundle does not contradict
- (b) No contradiction: **YES**

### S-P-7
- (a) No invented phases: **YES** — phases used match canonical list
- (b) Per-phase tables match: **NO** — see F-P-06

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-P-00** | `general` | `unevaluable` | open | 50 | Medium | Prompt + bundle scope is "5 role files" but composition mechanism lives outside the bundle | How is partially deferred; reviewer can only judge the role files in isolation, not full composition |
| **F-P-01** | `scenario_gap` | `docs-sync` | open | 75 | Medium | grep `agents/*.md` for "pi\|researcher\|agent-evaluator\|skills-evaluator\|gobbi-agent" returns 0 hits | No migration map; consumers cannot verify that every retired responsibility found a new home |
| **F-P-02** | `assumption_risk` | `process` | open | 50 | Medium | Plugin agent `gobbi-agent` was distributed via plugin per `__gobbi-convention.md`; new taxonomy is silent on its fate | Silent retirement risks breaking external plugin users; even if solo-user, the convention is unmaintained |
| **F-P-03** | `design_flaw` | `process` | open | 75 | **High** | delegation/SKILL.md:45 "Single leader per dispatch" + no alternative mechanism documented for the cross-pollination role the dual-stance previously played | Groupthink risk in Ideation; single leader produces single framing — exactly what dual-stance was designed to avoid |
| **F-P-04** | `design_flaw` | `process` | open | 75 | Medium | manager.md:15 "single-line edits…", manager.md:84 "spawn an executor (or leader)" | Role boundary blur invites manager scope creep; "(or leader)" is unforced — ambiguity defect |
| **F-P-05** | `scenario_gap` | `process` | open | **100** | **Critical** | manager.md:84 "spawn an executor (or leader) with the `memorization` skill"; manager.md:85 "spawn the Wrap-up delegation" — no role specified | The Wrap-up phase has **no role assigned** in the entire bundle. Memorization is ambiguous. Foundational gap |
| **F-P-06** | `design_flaw` | `docs-sync` | open | **100** | **High** | manager.md:33-38 lists 6 phase docs; **Preparation is missing**, yet leader.md:32 and delegation/SKILL.md:45 both name it as a leader phase | Manager will not load `orchestration/workflow/preparation.md` because its own list doesn't include the phase — workflow breaks on Preparation |
| **F-P-07** | `design_flaw` | `process` | open | 50 | Medium | manager.md:15 exception clause for "single-line edits"; manager.md never instructs to spawn evaluator on its own edits | Self-evaluation hole per Principle 2; small but real |
| **F-P-08** | `scenario_gap` | `process` | open | 25 | Low | No agent owns "synthesize parallel evaluator outputs into one recommendation"; manager is told to "discuss with user" but synthesis is a distinct work category | May force the manager into specialist work it told itself not to do; minor (mitigation: discussion-mode manager) |

## Per-perspective verdict

**FAIL** — F-P-05 (Critical/100): Wrap-up phase has no role assignment and Memorization assignment is ambiguous. F-P-06 (High/100) and F-P-03 (High/75) reinforce. Cannot pass project perspective: the taxonomy as written cannot drive the canonical 6-step workflow because two of those steps have no owner and one (Preparation) is omitted from the manager's load table.

## Low-confidence appendix

- F-P-08 is Low-25 and could be discarded; preserved for memorization
