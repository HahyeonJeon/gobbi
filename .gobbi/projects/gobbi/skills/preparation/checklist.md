# Preparation Loop — Evaluation Checklist

> **Copy-then-tick — this file is the source; the evaluator copies it.** At Stage 0 the
> evaluator COPIES this file to
> `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{system}/checklist.md`. The
> filled copy is a real **9th evaluation-output file**, alongside the seven per-perspective
> files + `overall.md`. The source here ships with every box UNCHECKED.
>
> **A ticked box = VERIFIED, not "done".** `- [x]` means the evaluator VERIFIED the check
> against the Preparation draft with the strongest verification the check admits (close-read
> the section / cross-reference the Ideation output / `grep` a slug in `2-preparation/staging/`
> / confirm a cited path resolves) — never that work merely happened.
>
> **Fill procedure.** Stage 0: copy (boxes unchecked). Stage 1: append a `## Stage 1 Additions`
> section for any scenario or check the Frame added that is not seeded here. Stage 2: tick each
> box `[x]` and annotate its outcome — `PASS:` (verified satisfied), `FAIL: {finding-id}`
> (verified violated, cite the finding), or `n/a: {reason}` (not applicable to this draft). The
> completeness gate requires every box resolved to exactly one of the three.
>
> **Legend.** `- [ ]` unresolved · `- [x] … PASS:` verified satisfied · `- [x] … FAIL: {finding-id}`
> verified violated · `- [x] … n/a: {reason}` not applicable. Record per-perspective counts
> (PASS / FAIL / n/a / total) in the filled copy's compact per-scenario results table.

The scenario families, their lenses, and the adversarial cases these checks discriminate live
in the sibling `scenario.md`; the evaluation procedure lives in `evaluation.md`. The heading
tree below is 1:1 with `scenario.md`.

---

## Project

### PREP-PROJ-SCENARIO-01 — Every gap traces to the locked Ideation output
- [ ] PREP-PROJ-SCENARIO-01-CHECK-01 — Each gap in the Design + memory readiness section cites the Ideation artifact (path or section) it references.
- [ ] PREP-PROJ-SCENARIO-01-CHECK-02 — Every Ideation `scenario_gap` finding has a corresponding staged file, a confirmed memory location, or a stated out-of-scope rationale.
- [ ] PREP-PROJ-SCENARIO-01-CHECK-03 — Every Ideation `checklist_gap` finding has a corresponding staged file, a confirmed memory location, or a stated out-of-scope rationale.
- [ ] PREP-PROJ-SCENARIO-01-CHECK-04 — No gap was invented outside the Scope Contract boundaries.

### PREP-PROJ-SCENARIO-02 — The Readiness summary matches the detail sections
- [ ] PREP-PROJ-SCENARIO-02-CHECK-01 — The count of gaps found in the summary matches the items enumerated in Sub-step B and C.
- [ ] PREP-PROJ-SCENARIO-02-CHECK-02 — The count of gaps resolved matches the items listed in "Generated this loop" plus any confirmed already-present artifact.
- [ ] PREP-PROJ-SCENARIO-02-CHECK-03 — The deferred count matches the "Out of scope gaps" entries.

### PREP-PROJ-SCENARIO-03 — Skip decisions and out-of-scope items are user-authorized
- [ ] PREP-PROJ-SCENARIO-03-CHECK-01 — Every `skip` decision appears in the Decisions log with the user's reasoning (a scope / business rationale, not "too hard" or "later").
- [ ] PREP-PROJ-SCENARIO-03-CHECK-02 — "Out of scope gaps" contains only user-authorized deferrals — no gap the leader unilaterally decided to fix.
- [ ] PREP-PROJ-SCENARIO-03-CHECK-03 — Project-wide gaps unrelated to this task carry a backlog / note pointer and are not placed in "Generated this loop".
- [ ] PREP-PROJ-SCENARIO-03-CHECK-04 — Any user-approved scope expansion is recorded before a formerly out-of-scope item is generated.

---

## Structure

### PREP-STRUCT-SCENARIO-01 — Staged skills are complete, not skeletons
- [ ] PREP-STRUCT-SCENARIO-01-CHECK-01 — Each staged skill file has all required sections populated (no `TODO` / `TBD` / `<...>` placeholders).
- [ ] PREP-STRUCT-SCENARIO-01-CHECK-02 — Each staged skill follows the project naming convention (hyphen-separated, no underscores in the body).
- [ ] PREP-STRUCT-SCENARIO-01-CHECK-03 — Each staged skill's YAML frontmatter is present and complete (`name`, `description`, `allowed-tools`).

### PREP-STRUCT-SCENARIO-02 — The working draft uses all seven required sections
- [ ] PREP-STRUCT-SCENARIO-02-CHECK-01 — All seven WORK-template sections are present (Scope reference, Readiness summary, Design + memory readiness, Execution skills readiness, Generated this loop, Out of scope gaps, Decisions log).
- [ ] PREP-STRUCT-SCENARIO-02-CHECK-02 — No section is a placeholder — each has substantive content or an explicit "none" statement.

### PREP-STRUCT-SCENARIO-03 — Staging paths match Wrap-up's promotion routing
- [ ] PREP-STRUCT-SCENARIO-03-CHECK-01 — Each memory-promotion file is in the right `2-preparation/staging/{type}/` subdirectory (scenarios / checklists / decisions not mixed up).
- [ ] PREP-STRUCT-SCENARIO-03-CHECK-02 — Staged slugs are kebab-case, ≤ 60 characters, with correct per-template frontmatter.
- [ ] PREP-STRUCT-SCENARIO-03-CHECK-03 — Staged skills are at `2-preparation/staging/skills/{slug}/SKILL.md`, not a flat `.md` Wrap-up routing would misplace.

---

## Performance

### PREP-PERF-SCENARIO-01 — High-severity gaps are resolved or deferred with a stated cost
- [ ] PREP-PERF-SCENARIO-01-CHECK-01 — The Readiness summary surfaces any remaining High-severity gaps.
- [ ] PREP-PERF-SCENARIO-01-CHECK-02 — Each remaining High-severity gap in "Out of scope gaps" states a concrete downstream cost.
- [ ] PREP-PERF-SCENARIO-01-CHECK-03 — No High-severity gap is silently downgraded to Low to avoid resolution work.

### PREP-PERF-SCENARIO-02 — Generated artifacts cover the skills the executor needs most
- [ ] PREP-PERF-SCENARIO-02-CHECK-01 — The Execution skills readiness section names the skills the executor will need most often on this task.
- [ ] PREP-PERF-SCENARIO-02-CHECK-02 — Each most-needed skill is either confirmed present or resolved as `generate-now`.
- [ ] PREP-PERF-SCENARIO-02-CHECK-03 — Throughput / scalability is declared `not-applicable` with the rationale that Preparation produces a small number of markdown files.

---

## Aesthetics

### PREP-AESTH-SCENARIO-01 — Draft is self-evident and convention-matched
- [ ] PREP-AESTH-SCENARIO-01-CHECK-01 — The Readiness summary reads standalone — the overall gap picture is clear without the DISCUSSION transcript.
- [ ] PREP-AESTH-SCENARIO-01-CHECK-02 — Section headings match the seven required WORK-template sections.
- [ ] PREP-AESTH-SCENARIO-01-CHECK-03 — Each staged skill's `name` frontmatter matches its directory slug, and no skill heading contradicts its frontmatter name.

### PREP-AESTH-SCENARIO-02 — Slugs are accurate and no section is filler
- [ ] PREP-AESTH-SCENARIO-02-CHECK-01 — Each staged artifact slug matches what it contains (no generic name on a specific item).
- [ ] PREP-AESTH-SCENARIO-02-CHECK-02 — No slug drift — the same item is not referenced by different names across sections.
- [ ] PREP-AESTH-SCENARIO-02-CHECK-03 — No section is filler — the Decisions log holds the actual decisions, and no section is "See DISCUSSION" without a real summary.

---

## Usage

### PREP-USAGE-SCENARIO-01 — Planner and Executor can consume the output without re-asking
- [ ] PREP-USAGE-SCENARIO-01-CHECK-01 — Every `defer` decision states a downstream impact Planning can plan around.
- [ ] PREP-USAGE-SCENARIO-01-CHECK-02 — Every `generate-now` result is fully formed — Planning does not need to reconstruct it.
- [ ] PREP-USAGE-SCENARIO-01-CHECK-03 — Each staged skill is standalone — no "see DISCUSSION" references; scope, gotchas, and constraints are stated, not implied.

### PREP-USAGE-SCENARIO-02 — Wrap-up can route every staging file, and failures trace back
- [ ] PREP-USAGE-SCENARIO-02-CHECK-01 — Each staged file's path + frontmatter unambiguously maps to a Wrap-up promotion destination per the routing table.
- [ ] PREP-USAGE-SCENARIO-02-CHECK-02 — Each gap entry cites the Ideation artifact and Sub-step that surfaced it.
- [ ] PREP-USAGE-SCENARIO-02-CHECK-03 — The Decisions log records who approved each resolution, so a downstream failure traces back to the Preparation decision.
- [ ] PREP-USAGE-SCENARIO-02-CHECK-04 — Each gap entry names its evidence path (staged artifact / memory path / follow-up pointer) needed to reconstruct the decision.

### PREP-USAGE-SCENARIO-03 — Consumer mental model and accessibility coverage
- [ ] PREP-USAGE-SCENARIO-03-CHECK-01 — "Generated this loop" claims no coverage it did not deliver (no skeleton listed as generated).
- [ ] PREP-USAGE-SCENARIO-03-CHECK-02 — Deferred gaps in "Out of scope gaps" are clearly distinguished from resolved gaps.
- [ ] PREP-USAGE-SCENARIO-03-CHECK-03 — Already-present-in-memory artifacts are distinguished from artifacts generated this loop and are named by their memory / staging path.
- [ ] PREP-USAGE-SCENARIO-03-CHECK-04 — Accessibility / localization is declared `not-applicable` (Preparation artifacts are internal workflow docs with no user-facing strings or UI).

---

## Consistency

### PREP-CONS-SCENARIO-01 — Scope reference is an accurate pointer and sections do not overlap
- [ ] PREP-CONS-SCENARIO-01-CHECK-01 — The Scope reference cites a file path / section to `1-ideation/outputs/`, not a prose paraphrase.
- [ ] PREP-CONS-SCENARIO-01-CHECK-02 — The Ideation Scope Contract's project / feature / task fields match what Preparation's readiness scanning targeted.
- [ ] PREP-CONS-SCENARIO-01-CHECK-03 — Each readiness gap (missing skill, memory, or design-reference item) is categorized in exactly one sub-step section (Design + memory readiness vs Execution skills readiness), not both.

### PREP-CONS-SCENARIO-02 — "Generated this loop" matches the staging directory both ways
- [ ] PREP-CONS-SCENARIO-02-CHECK-01 — Every file listed in "Generated this loop" actually exists in `2-preparation/staging/`.
- [ ] PREP-CONS-SCENARIO-02-CHECK-02 — No file in `2-preparation/staging/` was produced but omitted from "Generated this loop".
- [ ] PREP-CONS-SCENARIO-02-CHECK-03 — Listed paths refer to this iteration's artifacts, not stale artifacts from a prior attempt.

### PREP-CONS-SCENARIO-03 — Decisions log matches the gap table and gap evidence is verified
- [ ] PREP-CONS-SCENARIO-03-CHECK-01 — Each gap in the consolidated gap table has exactly one corresponding Decisions log entry.
- [ ] PREP-CONS-SCENARIO-03-CHECK-02 — No gap's resolution in the staging artifacts contradicts its Decisions log entry.
- [ ] PREP-CONS-SCENARIO-03-CHECK-03 — Where a Sub-step B check claims a scenario is present in feature memory, that scenario actually exists there; a mismatch is flagged, not silently resolved.

---

## Risk

### PREP-RISK-SCENARIO-01 — The Wrap-up sole-writer contract is intact
- [ ] PREP-RISK-SCENARIO-01-CHECK-01 — All `generate-now` outputs are staged under `2-preparation/staging/`, not written to `.gobbi/projects/{project-name}/skills/`, `features/`, or other memory paths.
- [ ] PREP-RISK-SCENARIO-01-CHECK-02 — The Decisions log references no direct memory write, and `features/...` was not touched during Preparation.

### PREP-RISK-SCENARIO-02 — re-Ideate triggers are caught or explicitly ruled out
- [ ] PREP-RISK-SCENARIO-02-CHECK-01 — Each gap was assessed for re-Ideate (unworkable design) vs generate-now (missing artifact).
- [ ] PREP-RISK-SCENARIO-02-CHECK-02 — The artifact explicitly states "no re-Ideate escalation required" or names the escalation that was made.
- [ ] PREP-RISK-SCENARIO-02-CHECK-03 — No gap whose root cause is an Ideation design flaw is classified `generate-now`.

### PREP-RISK-SCENARIO-03 — Deferred items and slug collisions are controlled
- [ ] PREP-RISK-SCENARIO-03-CHECK-01 — Each deferred item in "Out of scope gaps" has a concrete next-action pointer (staging path / backlog / note), not "TBD" / "later".
- [ ] PREP-RISK-SCENARIO-03-CHECK-02 — Staged skill slugs are checked against existing skills in `.gobbi/projects/{project-name}/skills/`.
- [ ] PREP-RISK-SCENARIO-03-CHECK-03 — Any slug matching an existing skill is labeled an intended update or flagged as a collision — no silent overwrite.

### PREP-RISK-SCENARIO-04 — Privacy, license, and cost surfaces reviewed
- [ ] PREP-RISK-SCENARIO-04-CHECK-01 — Privacy / data retention is declared `not-applicable` (Preparation artifacts hold no PII or sensitive data).
- [ ] PREP-RISK-SCENARIO-04-CHECK-02 — Each generated skill that codifies external patterns names the source (library / spec / community standard) and its license class, with no verbatim incompatible-license content.
- [ ] PREP-RISK-SCENARIO-04-CHECK-03 — Cost / budget is declared `not-applicable` (the Preparation Loop produces local markdown files with no API / infra cost).
