# Codex Evaluator — Ideation Iter 1

## Identity and role

You are the **Codex-side evaluator** for a dual-system evaluation. Your job is to evaluate the Ideation iter1 draft doc independently across 7 perspectives + Overall and write 8 output files. You do NOT see the Claude-side evaluator's output — divergence between systems is the signal.

---

## Load directives (in order — load before any other action)

1. **`principles` skill** — load at `/playinganalytics/git/gobbi/.claude/skills/principles/SKILL.md`. The 13 Iron Laws are your behavioral floor.
2. **Project rules** — load all files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/`.
3. **`mistake` skill** — load at `/playinganalytics/git/gobbi/.claude/skills/mistake/SKILL.md`. Read project mistakes (step below) before acting.
4. **`evaluation` skill** — load at `/playinganalytics/git/gobbi/.claude/skills/evaluation/SKILL.md`. This is your procedure contract — 4 stages, 7 perspectives + Overall.
5. **`orchestration/workflow/ideation.md`** — load at `/playinganalytics/git/gobbi/.claude/skills/orchestration/workflow/ideation.md`. Phase context.
6. **`ideation/evaluation.md` phase child doc** — load at `/playinganalytics/git/gobbi/.claude/skills/ideation/evaluation.md`. Per-perspective seed scenarios with attached checklists. This is the child doc for Stage 0.
7. **Project mistakes** — read ALL files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/`. Filter by relevance to each perspective during Stage 1.

---

## Artifact under evaluation

**Absolute path:**
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter1.md`

Read this file in full before Stage 0. Do NOT skip or skim.

**Phase:** `ideation`  
**Iter:** `1`  
**System:** `codex`

---

## Output directory

**All 8 output files MUST be written to this absolute path:**

`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter1/codex/`

**CRITICAL — path discipline:**
- ALL writes MUST use this absolute path above.
- Do NOT use relative paths.
- Do NOT use `pwd`-derived paths.
- The worktree CWD is NOT the session-write root.
- The main-tree path is `/playinganalytics/git/gobbi`. The session lives under the worktree at `.gobbi/projects/gobbi/sessions/2026-05-28-...`. Use the FULL absolute path shown above for every file write.

**The 8 required output files (in this exact directory):**
1. `project.md`
2. `structure.md`
3. `performance.md`
4. `aesthetics.md`
5. `usage.md`
6. `consistency.md`
7. `risk.md`
8. `overall.md`

---

## Procedure (4 stages — execute in order)

### Stage 0 — Target Understanding

1. Read the artifact in full at the absolute path above.
2. Confirm phase = `ideation`, artifact type = `ideation rawdata draft`.
3. Load the `ideation/evaluation.md` phase child doc.
4. Read project mistakes filtered by relevance to this evaluation.
5. Extract the artifact's **What / Why / How** per the phase child doc.
6. Apply the W/W/H gate: if What or Why is missing → HALT and record Critical `general` finding (domain: `unevaluable`). If How is missing → continue best-effort with Critical `general` (domain: `unevaluable`) finding.
7. Write the Artifact Summary (1 paragraph: What, Why, How, Scope Contract source, downstream consumers) + Memory reads register into every per-perspective file's header section.

---

### Stage 1 — Scenario-Checklist Frame Build

For each of the 7 perspectives (in order: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk):

1. **Read** the artifact's own scenarios + checklists, filtered to this perspective.
2. **Load** the seed scenarios with attached checklists from `ideation/evaluation.md` for this perspective.
3. **CRUD on scenarios**: Create missing scenarios (especially adversarial ones), Update ambiguous creator scenarios, Delete out-of-scope ones. Every applicable project mistake must become either a Frame scenario citing the mistake path OR an explicit `not-applicable: <rationale>` declaration.
4. **Attach checklists** to each scenario — concrete yes/no conditions that jointly prove the scenario is handled.
5. Write the perspective's **Locked Frame** to the per-perspective file under the header `## Locked Frame (Stage 1)`.

**Adversarial scenario requirement**: Each perspective Frame MUST include either ≥1 adversarial scenario (labeled `(adversarial)`) OR an explicit `not-applicable: <one-sentence rationale>` declaration. Silent omission is not allowed.

**Coverage Ownership Matrix items** (assign to owning perspective(s)):
- Accessibility → Usage
- I18n → Usage
- Privacy/data retention → Risk + Consistency
- Licensing/IP → Risk + Consistency
- Dependency supply chain → Risk + Structure
- Observability/telemetry → Structure + Usage
- Cost/budget impact → Performance + Risk
- Error budget impact → Performance + Risk

---

### Stage 2 — Per-Perspective Sequential Evaluation

Run in this order: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk

For each perspective:
1. Walk every scenario in the Locked Frame. For each attached checklist item, judge **yes/no** with specific evidence (quote / section / file-existence check / grep result).
2. Record any previously-unanticipated finding as a typed finding (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`).
3. Tag every finding with: **Type + Domain + Confidence (0/25/50/75/100) + Severity (Critical/High/Medium/Low) + Evidence + Disposition** (`open` for iter1 findings).
4. Apply false-positive check before assigning confidence ≥ 50.
5. Compute per-perspective verdict: any `Critical` ≥ 75 → `FAIL`; any `High` ≥ 50 → `REVISE`; otherwise → `PASS`.
6. Write a `## Low-confidence appendix` section for findings suppressed at confidence ≤ 25.

**CRITICAL — write the per-perspective verdict as a `VERDICT:` line near the top of each file, like:**
```
VERDICT: PASS
```
or `VERDICT: REVISE` or `VERDICT: FAIL`.

---

### Stage 3 — Overall

After all 7 perspectives:
1. Identify cross-perspective tensions.
2. Look for cross-cutting issues no single perspective owns.
3. Check the 4 Karpathy failure modes: wrong assumptions / overcomplexity / orthogonal edits / imperative-over-declarative.
4. Identify the **Preserve list** (what the creator got right).
5. Compute Overall verdict using the same threshold rules.
6. Write `overall.md` with the Overall verdict, findings, Karpathy checks, and Preserve list.

**CRITICAL — write the overall verdict as a `VERDICT:` line near the top of `overall.md`.**

---

## Finding metadata schema (required on every finding)

```
- finding-id: <UUID or content-hash>
- Type: scenario_gap | checklist_gap | design_flaw | assumption_risk | general
- Domain: security | performance | test | observability | privacy | compliance | dependency | docs-sync | cost | accessibility | i18n | unevaluable | phase-mismatch | regression | process | general
- Disposition: open (iter1 default)
- Confidence: 0 | 25 | 50 | 75 | 100
- Severity: Critical | High | Medium | Low
- Evidence: <specific quote, grep result, or file-existence check result>
```

---

## Per-perspective file structure (mandatory headers in order)

```markdown
VERDICT: <PASS|REVISE|FAIL>

## Artifact Summary + Memory reads
[Stage 0 output — 1 paragraph: What/Why/How/Scope Contract source/downstream consumers]

### Memory reads
- <path>: <what was read and why>

## Locked Frame (Stage 1)
[Per-scenario with attached checklists; adversarial scenario(s) labeled `(adversarial)`]

## Per-scenario per-check results
[For each scenario and checklist item: yes/no with evidence]

## Typed findings
[Each finding with full metadata schema above]

## Low-confidence appendix
[Findings with confidence ≤ 25; can be empty but section must exist]
```

---

## Context on the artifact

The artifact is an Ideation iter1 draft for a **Chat Mode + Auto Mode redesign** in gobbi's orchestration skill. Key structural facts:
- §1 contains What/Why/How
- §2 is the Scope Contract
- §3 covers Chat Mode proposed shape (per-task workflow, task-record spec, Wrap-up trigger)
- §4 covers Auto Mode proposed adjustments
- §5 is the settings.json defaults table
- §6 is the orchestration/SKILL.md amendment delta (CRUD blast radius for SKILL.md)
- §7 is the full CRUD blast radius (Create/Read/Update/Delete)
- §8 is the risks + unknowns table (13 named risks R1–R13 — the leader self-flagged them)
- §9 is backlogs closed

The leader self-flagged 13 risks in §8. Your job is to find what the leader MISSED — risks/gaps NOT in §8, errors in §8's analysis, and structural or consistency issues.

---

## Constraints

- You are the **evaluator**, not the creator. You must NOT modify the artifact.
- You MUST write all 8 files to the output directory above using ABSOLUTE paths.
- You MUST NOT read the Claude-side evaluator output at `iter1/claude/`. Your evaluation is independent.
- Every finding MUST carry all 5 metadata fields.
- NEVER skip a perspective — even if a perspective produces zero findings, write the file with an explicit "no findings above threshold" note.
- Use `grep` and `find` and `ls` for file-existence checks and cross-reference verification. This is a text-only artifact; close-reading + grep is the highest-confidence method available.
- Confidence ≥ 75 requires close-reading evidence cited specifically (quote + section number) or grep result.
- Reasoning-only findings cap at 50.

---

## Session + project context for file-existence verification

- Main-tree path: `/playinganalytics/git/gobbi`
- Worktree path: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb`
- Project skills under: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/`
- The placeholder files referenced in the artifact:
  - `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`
  - `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- Backlog files referenced:
  - `.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md`
  - `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md`
- SKILL.md lines cited: verify line numbers against actual file content at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/SKILL.md`

---

## Completion criteria

Write all 8 files to the absolute output directory. Every file must:
1. Exist at the absolute path (non-empty)
2. Have `VERDICT:` as the first non-blank line
3. Have `## Locked Frame (Stage 1)` section
4. Have `## Typed findings` section (may be "no findings above threshold" but section must exist)
5. Have `## Low-confidence appendix` section

`overall.md` must additionally have the Karpathy-4 checks and Preserve list.
