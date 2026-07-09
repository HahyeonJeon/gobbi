# Preparation Loop — Evaluation Scenarios

Per-perspective GOOD / BAD / ADVERSARIAL discrimination scenarios for a Preparation Loop's
working draft. The evaluator loads this file at Stage 1 (Scenario-Checklist Frame Build) as
seed scenarios for the seven perspectives.

The evaluation **procedure** — the per-perspective lens definitions, recommended
verifications, perspective anti-patterns, and Overall (Stage 3) anchors — lives in the
sibling `evaluation.md`. The concrete yes/no **checks** each scenario references live 1:1 in
the sibling `checklist.md`, whose heading tree mirrors this file exactly.

The artifact under evaluation is **the Preparation working draft**
(`sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md`) plus the session
staging files it claims to have generated: its Scope reference, Readiness summary, Design +
memory readiness (Sub-step B), Execution skills readiness (Sub-step C), Generated this loop,
Out of scope gaps, and Decisions log. Preparation is a **process loop** — the artifact verifies
READINESS before planning, not code — so every family below judges **readiness quality**: does
every gap trace to the locked Ideation output, are the found / resolved / deferred counts
internally consistent, are staged artifacts complete and routable, and can the next loop plan
against the workspace without re-asking. Each family carries a `### {ID}` heading, a
**Category**, the **Situation** it arises in, the **Good** outcome, the **Bad / failure**
outcome, one **Adversarial** case a real evaluator would probe, and the **Checklist IDs** whose
joint satisfaction proves the scenario handled. Scenario IDs follow
`PREP-{PERSPECTIVE}-SCENARIO-{NN}`; each check follows `{scenario-id}-CHECK-{NN}` and lives in
`checklist.md`.

---

## Project
_Lens (see `evaluation.md`):_ does the Preparation artifact cover the **right readiness gaps** for this task, inside the locked Scope Contract?

### PREP-PROJ-SCENARIO-01 — Every gap traces to the locked Ideation output
**Category:** golden-path
**Situation:** the Design + memory readiness section lists gaps the loop found.
**Good:** each gap cites the Ideation artifact (path or section) it references; every Ideation `scenario_gap` and `checklist_gap` finding has a corresponding staged file or a stated rationale for out-of-scope classification.
**Bad / failure:** a gap is listed with no trace back to the Ideation output, so a reader cannot tell what surfaced it.
**Adversarial:** a gap is invented outside the Scope Contract boundaries and folded into the readiness work, so scope creep enters through the gap list rather than a user decision.
**Checklist IDs:** `PREP-PROJ-SCENARIO-01-CHECK-*`

### PREP-PROJ-SCENARIO-02 — The Readiness summary matches the detail sections
**Category:** golden-path
**Situation:** the Readiness summary states counts of gaps found / resolved / deferred.
**Good:** the found count matches the items enumerated in Sub-step B and C; the resolved count matches "Generated this loop"; the deferred count matches "Out of scope gaps".
**Bad / failure:** the summary states a gap count the detail sections do not add up to.
**Adversarial:** the summary counts read plausible but overstate coverage — "3 resolved" while "Generated this loop" lists 2, so the headline claims readiness the detail does not support.
**Checklist IDs:** `PREP-PROJ-SCENARIO-02-CHECK-*`

### PREP-PROJ-SCENARIO-03 — Skip decisions and out-of-scope items are user-authorized
**Category:** failure-mode
**Situation:** some gaps are classified `skip` or routed to "Out of scope gaps".
**Good:** every `skip` decision appears in the Decisions log with the user's reasoning (a scope / business rationale, not "too hard" or "later"); "Out of scope gaps" holds only user-authorized deferrals; any user-approved scope expansion is recorded before a formerly out-of-scope item is generated; unrelated project-wide gaps carry a backlog / note pointer, not a spot in "Generated this loop".
**Bad / failure:** a gap is deferred with a leader-invented rationale the user never approved.
**Adversarial:** a gap is silently dropped as `skip` with no user reason in the Decisions log, so a real readiness gap disappears without anyone deciding to drop it.
**Checklist IDs:** `PREP-PROJ-SCENARIO-03-CHECK-*`

---

## Structure
_Lens (see `evaluation.md`):_ is the Preparation artifact's **decomposition** sound, and are the staged artifacts shaped so downstream loops consume them cleanly?

### PREP-STRUCT-SCENARIO-01 — Staged skills are complete, not skeletons
**Category:** golden-path
**Situation:** the loop staged one or more `generate-now` skill files.
**Good:** each staged skill has all required sections populated, follows the project naming convention (hyphen-separated, no body underscores), and carries complete YAML frontmatter (`name`, `description`, `allowed-tools`).
**Bad / failure:** a staged skill is missing a required section or its frontmatter.
**Adversarial:** a staged skill has every heading but placeholder bodies (`TODO` / `TBD` / `<...>`), so it reads as generated while it is a deferred skeleton.
**Checklist IDs:** `PREP-STRUCT-SCENARIO-01-CHECK-*`

### PREP-STRUCT-SCENARIO-02 — The working draft uses all seven required sections
**Category:** golden-path
**Situation:** the working draft is written to the WORK-phase template.
**Good:** all seven sections are present (Scope reference, Readiness summary, Design + memory readiness, Execution skills readiness, Generated this loop, Out of scope gaps, Decisions log), each with substantive content or an explicit "none".
**Bad / failure:** a required section is absent or replaced by a placeholder.
**Adversarial:** a required section is present as a heading but empty or "See DISCUSSION", so the seven-section contract is satisfied only cosmetically.
**Checklist IDs:** `PREP-STRUCT-SCENARIO-02-CHECK-*`

### PREP-STRUCT-SCENARIO-03 — Staging paths match Wrap-up's promotion routing
**Category:** failure-mode
**Situation:** the loop staged scenarios / checklists / decisions / skills for Wrap-up to promote.
**Good:** each memory-promotion file is in the right `2-preparation/staging/{type}/` subdirectory with a kebab-case (≤ 60 char) slug and correct per-template frontmatter; staged skills are at `staging/skills/{slug}/SKILL.md`.
**Bad / failure:** a staged file is in the wrong `staging/` subdirectory or carries the wrong template frontmatter.
**Adversarial:** a staged skill is a flat `.md` (or sits in `staging/decisions/` instead of `staging/skills/{slug}/SKILL.md`), so Wrap-up's routing silently misplaces or loses it.
**Checklist IDs:** `PREP-STRUCT-SCENARIO-03-CHECK-*`

---

## Performance
_Lens (see `evaluation.md`):_ is the Preparation artifact leaving readiness gaps open that **amplify downstream work** in Planning or Execution?

### PREP-PERF-SCENARIO-01 — High-severity gaps are resolved or deferred with a stated cost
**Category:** golden-path
**Situation:** the loop found gaps of varying severity.
**Good:** the Readiness summary surfaces any remaining High-severity gaps; each remaining High-severity gap in "Out of scope gaps" states a concrete downstream cost.
**Bad / failure:** a High-severity gap is left open with no stated downstream cost.
**Adversarial:** a High-severity gap is silently downgraded to Low to justify `skip`, so a blocking gap disappears from the readiness picture behind a mis-calibrated severity.
**Checklist IDs:** `PREP-PERF-SCENARIO-01-CHECK-*`

### PREP-PERF-SCENARIO-02 — Generated artifacts cover the skills the executor needs most
**Category:** failure-mode
**Situation:** the executor will lean on a small set of skills repeatedly for this task.
**Good:** the Execution skills readiness section names the skills the executor will need most often on this task, and each is either confirmed present or resolved as `generate-now`; throughput / scalability is declared `not-applicable` (Preparation produces a small number of markdown files).
**Bad / failure:** the most-needed skills are named but left unresolved.
**Adversarial:** a skill the executor hits on nearly every task is left open now, so the unresolved gap multiplies into re-derivation cost across every Planning and Execution task that follows.
**Checklist IDs:** `PREP-PERF-SCENARIO-02-CHECK-*`

---

## Aesthetics
_Lens (see `evaluation.md`):_ is the **working draft itself** readable, convention-matched, and free of filler?

### PREP-AESTH-SCENARIO-01 — Draft is self-evident and convention-matched
**Category:** golden-path
**Situation:** a new reader opens the draft cold, without the DISCUSSION transcript.
**Good:** the Readiness summary reads standalone — the overall gap picture is clear without the transcript; section headings match the seven required WORK-template sections; each staged skill's `name` frontmatter matches its directory slug with no contradicting heading.
**Bad / failure:** understanding the readiness state requires the DISCUSSION transcript, or the section structure diverges from the seven-section contract.
**Adversarial:** the Readiness summary reads complete but only says "preparation complete" with no counts or per-category status — a placeholder masquerading as a summary.
**Checklist IDs:** `PREP-AESTH-SCENARIO-01-CHECK-*`

### PREP-AESTH-SCENARIO-02 — Slugs are accurate and no section is filler
**Category:** failure-mode
**Situation:** the draft names staged artifacts and carries several prose sections.
**Good:** each staged slug matches what it contains (no generic name on a specific item); there is no slug drift where one item is referenced by two names; the Decisions log holds the actual decisions and no section is "See DISCUSSION" without a real summary.
**Bad / failure:** a staged slug is generic or drifts between sections, or a section is boilerplate.
**Adversarial:** a section reads as substantive but is a template skeleton ("Decisions log" left as the empty template), surviving review because the heading structure looks complete.
**Checklist IDs:** `PREP-AESTH-SCENARIO-02-CHECK-*`

---

## Usage
_Lens (see `evaluation.md`):_ for the **next consumers** — the Planning leader, the Execution executor, the Wrap-up assistant — is the Preparation output usable?

### PREP-USAGE-SCENARIO-01 — Planner and Executor can consume the output without re-asking
**Category:** golden-path
**Situation:** Planning decomposes the task and the executor applies staged skills.
**Good:** every `defer` decision states a downstream impact Planning can plan around; every `generate-now` result is fully formed so Planning does not reconstruct it; each staged skill is standalone, with scope, gotchas, and constraints stated, not implied.
**Bad / failure:** a `defer` decision omits its downstream impact, or a `generate-now` result is partial.
**Adversarial:** a staged skill references session state ("per our discussion", "as agreed"), so an executor who never saw DISCUSSION cannot apply it.
**Checklist IDs:** `PREP-USAGE-SCENARIO-01-CHECK-*`

### PREP-USAGE-SCENARIO-02 — Wrap-up can route every staging file, and failures trace back
**Category:** failure-mode
**Situation:** Wrap-up promotes staged files, and a downstream loop may later fail on a missed gap.
**Good:** each staged file's path + frontmatter unambiguously maps to a Wrap-up promotion destination per the routing table; each gap entry cites the Ideation artifact and Sub-step that surfaced it and names its evidence path (staged artifact / memory path / follow-up pointer); the Decisions log records who approved each resolution.
**Bad / failure:** a gap entry has no Ideation citation or names no evidence path, so a downstream failure cannot be traced back to a Preparation decision.
**Adversarial:** a staged file sits in a path the Wrap-up routing table does not handle, so it is silently dropped at promotion while "Generated this loop" still lists it.
**Checklist IDs:** `PREP-USAGE-SCENARIO-02-CHECK-*`

### PREP-USAGE-SCENARIO-03 — Consumer mental model and accessibility coverage
**Category:** coverage-matrix
**Situation:** a consumer reads "Generated this loop" and "Out of scope gaps" to learn what is ready.
**Good:** "Generated this loop" claims no coverage it did not deliver (no skeleton listed as generated); resolved, deferred, and already-present-in-memory gaps are each distinguished from artifacts generated this loop; accessibility / localization is declared `not-applicable` (Preparation artifacts are internal workflow docs with no user-facing strings or UI).
**Bad / failure:** resolved, deferred, and already-present gaps are not distinguished, so a consumer cannot tell each gap's state.
**Adversarial:** "Generated this loop" lists a skeleton skill as generated, so a consumer forms the wrong mental model of what is actually ready to plan against.
**Checklist IDs:** `PREP-USAGE-SCENARIO-03-CHECK-*`

---

## Consistency
_Lens (see `evaluation.md`):_ did everything that should sync inside the Preparation artifact sync? Any internal contradiction or drift from the Ideation output?

### PREP-CONS-SCENARIO-01 — Scope reference is an accurate pointer and sections do not overlap
**Category:** golden-path
**Situation:** the Scope reference section anchors the loop to the Ideation output.
**Good:** the Scope reference cites a file path / section to `1-ideation/outputs/`, not a prose paraphrase; the Ideation Scope Contract's project / feature / task fields match what Preparation's readiness scanning targeted; each missing skill is categorized in exactly one sub-step section.
**Bad / failure:** the Scope reference paraphrases the contract, or a gap is filed under two sub-step sections.
**Adversarial:** the Scope reference paraphrases the Scope Contract instead of citing the real path, so drift between the paraphrase and the actual contract goes unnoticed.
**Checklist IDs:** `PREP-CONS-SCENARIO-01-CHECK-*`

### PREP-CONS-SCENARIO-02 — "Generated this loop" matches the staging directory both ways
**Category:** golden-path
**Situation:** the "Generated this loop" section lists what the loop produced.
**Good:** every file listed in "Generated this loop" actually exists in `2-preparation/staging/` and refers to this iteration's artifact (not a stale file from a prior attempt); no file in `2-preparation/staging/` is omitted from "Generated this loop".
**Bad / failure:** a listed file is missing from staging, or a staged file is missing from the list.
**Adversarial:** a stale generated-list entry points at an old path that still exists from a prior attempt, so existence alone falsely appears to validate this iteration.
**Checklist IDs:** `PREP-CONS-SCENARIO-02-CHECK-*`

### PREP-CONS-SCENARIO-03 — Decisions log matches the gap table and gap evidence is verified
**Category:** failure-mode
**Situation:** the Decisions log records the resolution of each gap in the gap table.
**Good:** each gap in the consolidated gap table has exactly one Decisions log entry, and no gap's staging resolution contradicts its Decisions log entry.
**Bad / failure:** a gap has no Decisions log entry, or its logged resolution contradicts the staged artifact.
**Adversarial:** a Sub-step B check claims a scenario is present in feature memory but it does not actually exist there, and the contradiction is silently resolved instead of flagged.
**Checklist IDs:** `PREP-CONS-SCENARIO-03-CHECK-*`

---

## Risk
_Lens (see `evaluation.md`):_ **what breaks if Preparation is wrong?** Wrap-up sole-writer contract, staging-path correctness, missed re-Ideate triggers, lost deferrals, slug collisions.

### PREP-RISK-SCENARIO-01 — The Wrap-up sole-writer contract is intact
**Category:** golden-path
**Situation:** the loop produced `generate-now` outputs.
**Good:** all `generate-now` outputs are staged under `2-preparation/staging/`, not written to `.gobbi/projects/{project-name}/skills/`, `features/`, or other memory paths; the Decisions log references no direct memory write.
**Bad / failure:** a staged artifact is accompanied by a direct memory write the sole-writer contract forbids.
**Adversarial:** a `generate-now` output was written directly to `.gobbi/projects/{project-name}/skills/` instead of staging, breaking the sole-writer contract while the Decisions log reads clean.
**Checklist IDs:** `PREP-RISK-SCENARIO-01-CHECK-*`

### PREP-RISK-SCENARIO-02 — re-Ideate triggers are caught or explicitly ruled out
**Category:** failure-mode
**Situation:** some gaps may reveal an unworkable Ideation design rather than a missing artifact.
**Good:** each gap was assessed for re-Ideate (unworkable design) vs generate-now (missing artifact); the artifact explicitly states "no re-Ideate escalation required" or names the escalation made.
**Bad / failure:** the re-Ideate assessment is skipped, so a design-level problem is left unassessed.
**Adversarial:** a gap whose root cause is an Ideation design flaw is classified `generate-now` and papered over with a skill, so an unworkable design proceeds to Planning unescalated.
**Checklist IDs:** `PREP-RISK-SCENARIO-02-CHECK-*`

### PREP-RISK-SCENARIO-03 — Deferred items and slug collisions are controlled
**Category:** failure-mode
**Situation:** the loop deferred items and staged skills whose slugs may match existing project skills.
**Good:** each deferred item in "Out of scope gaps" has a concrete next-action pointer (staging path / backlog / note), not "TBD" / "later"; staged skill slugs are checked against existing skills in `.gobbi/projects/{project-name}/skills/`.
**Bad / failure:** a deferred item names no next action, so it is effectively lost.
**Adversarial:** a staged skill slug collides with an existing project skill and the draft does not say whether it is an intended update or an accidental collision, so Wrap-up promotion clobbers a project skill.
**Checklist IDs:** `PREP-RISK-SCENARIO-03-CHECK-*`

### PREP-RISK-SCENARIO-04 — Privacy, license, and cost surfaces reviewed
**Category:** coverage-matrix
**Situation:** `generate-now` skills may codify patterns borrowed from external sources.
**Good:** privacy / data retention is declared `not-applicable` (Preparation artifacts hold no PII or sensitive data); each generated skill that codifies external patterns names the source (library / spec / community standard) and its license class; cost / budget is declared `not-applicable` (the loop produces local markdown files with no API / infra cost).
**Bad / failure:** a generated skill borrows an external pattern with no source or license named.
**Adversarial:** a `generate-now` skill codifies verbatim patterns from an external source with an incompatible license and no source / license-class named — an IP risk entering through generated scaffolding.
**Checklist IDs:** `PREP-RISK-SCENARIO-04-CHECK-*`
