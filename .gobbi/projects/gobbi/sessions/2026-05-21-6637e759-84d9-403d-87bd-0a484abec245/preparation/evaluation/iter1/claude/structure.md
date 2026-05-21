---
loop: preparation
iter: 1
perspective: structure
evaluator_system: claude
artifact_under_eval: preparation/rawdata/draft-iter1.md
---

# Structure — Preparation iter1

## Lens
Is the Preparation artifact's organizing decomposition sound? Will downstream loops be able to consume what it produced (or didn't produce)?

## Stage 0 — Target Understanding
The draft is a 7-section rawdata document plus a Decisions log + Notes-for-downstream-EVALUATION section. It produces zero new staging artifacts and zero new skills. The decomposition under test is the audit shape itself, not generated artifacts.

## Stage 1 — Frame
Seed scenarios from `preparation/evaluation.md § Structure`:
- S1: Every staged skill uses the full project-skill template (N/A — 0 skills generated).
- S2: The rawdata draft uses all seven required sections.
- S3: Staged memory-promotion files follow correct staging path conventions.
- S4: Generated artifacts are structurally compatible with Wrap-up's promotion routing (N/A — 0 generated).

## Stage 2 — Scenario walk

**S1 — Skill template completeness**
- Not applicable. Zero skills generated this loop. The leader correctly declares this in "Generated this loop" with the rationale "no gap required `generate-now`."

**S2 — Seven required sections present**
Inspecting the draft headings against the WORK template required sections:
- Scope reference ✓ (lines 3–15)
- Readiness summary ✓ (lines 17–28)
- Design + memory readiness ✓ (lines 30–46)
- Execution skills readiness ✓ (lines 48–84)
- Generated this loop ✓ (lines 86–90)
- Out of scope gaps ✓ (lines 92–105)
- Decisions log ✓ (lines 107–172, with Sub-step A/B/C/D sub-sections)
Plus a "Notes for downstream EVALUATION" tail-section (lines 176–182) which is additive, not a deviation. All seven required sections present and substantively populated. ✓

**S3 — Staging path conventions**
- `ideation/staging/decisions/` (32 files), `ideation/staging/design/` (2 files), `ideation/staging/discussions/` (8 files), `ideation/staging/backlogs/project/` (1 file) — directly verified on disk. ✓
- `preparation/staging/` exists with 10 pre-bootstrapped subdirs (backlogs, checklists, decisions, design, discussions, references, reports, reviews, scenarios, skills). All empty this iter (correct per "Generated this loop: none"). ✓
- The Sub-step B table at line 36 correctly distinguishes "Present" from "Present (intentionally empty)" — the latter referring to scenarios/ + checklists/ which carry their content inline in `artifacts/scenarios.md` and `artifacts/implementation-checklist.md`.

**S4 — Wrap-up routing compatibility**
- N/A this iter (0 staged this loop). The inherited Ideation staging (32 decisions, 2 design, 8 discussions, 1 backlog) will be promoted by Wrap-up via the routing table; the Preparation audit correctly notes (H-4 trade-off) that the CLI-regenerator backlog has NO post-sweep promotion target (because `backlogs/` will be placeholder-ized), so it stays session-scoped. The leader explicitly flags this in Sub-step B row 6.

## Stage 2 — Adversarial probe results

I checked for structural drift the leader might not have caught:
- Verified preparation/staging/ tree shape: `backlogs/ checklists/ decisions/ design/ discussions/ references/ reports/ reviews/ scenarios/ skills/` — 10 subdirs (one beyond the canonical 8 due to `reports/` + `reviews/`). The leader does not enumerate these but the contract `preparation/SKILL.md § Output paths` accepts them; no shape violation.
- Verified ideation/staging/ tree shape: 9 subdirs (`backlogs/ checklists/ decisions/ design/ discussions/ learnings/ references/ scenarios/`). The leader's Sub-step B walk lists "32 decisions, 2 design files, 8 discussions, 1 project backlog, 0 scenarios, 0 checklists, 0 references, 0 learnings, 0 feature-backlogs" — file counts confirmed.
- Verified the `agents/`-symlink-direction topology: `.gobbi/projects/gobbi/agents/` holds the 5 real agent files; `.claude/agents/` are symlinks INTO it. The Q-A survivor set decision protects the real path. No structural gap.
- Verified `.codex/{agents,hooks,project,rules,skills}` are all symlinks into `.claude/`. Stage B line 38 of the checklist explicitly addresses this with the inline note "`.codex/{agents,hooks,project,rules,skills}` are tracked symlinks into `.claude/`; `git rm -r` removes the symlinks, not the targets." So the structural collision (symlinks crossing the survivor set) is correctly handled by the checklist itself and noted by the leader implicitly via "Pre-state matches Implementation Checklist preconditions."

No structural gap found.

## Findings

(none)

## Must-preserve list
- The seven-section ordering of the draft (Scope reference → ... → Decisions log).
- The Sub-step B/C tabular format with explicit "Present" / "Present (intentionally empty)" / "Bootstrappable" labels — this is what makes empty staging directories defensible.
- The 10 pre-bootstrapped `preparation/staging/` subdirs (do not delete the empty ones during remediation — they're part of the session-tree contract).

## Verdict
**PASS** — Structure is sound. Seven required sections present and populated; staging paths verified; no skeletons being promoted; symlink topology under `.codex/` accounted for in the checklist.
