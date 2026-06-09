---
name: preparation/evaluation
description: Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `preparation`. Provides per-perspective seed scenarios with attached checklists + recommended tool verifications + perspective-specific anti-patterns for a Preparation Loop's readiness artifact.
allowed-tools: Read, Grep, Glob, Bash
---

# Preparation Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `preparation`. Provides per-perspective **seed scenarios with attached checklists** + **recommended tool verifications** + **perspective-specific anti-patterns** for a Preparation Loop's working draft.

The artifact under evaluation is the leader's draft at `sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md`. It contains: Scope reference, Readiness summary, Design + memory readiness (Sub-step B output), Execution skills readiness (Sub-step C output), Generated this loop, Out of scope gaps, Decisions log.

For each perspective below, scenarios are listed in bold and each scenario carries its **attached checklist** — the concrete yes/no conditions that, if all satisfied, prove the scenario is handled. Scenarios include adversarial cases so Stage 2 needs no separate adversarial pass. The evaluator CRUDs both scenarios and their attached checklists at Stage 1 against the artifact's own scenario+checklist content.

---

## Project

**Lens**: Does the Preparation artifact cover the **right readiness gaps** for this specific task? Does it stay inside the locked Scope Contract?

### Seed scenarios with attached checklists

**Every gap surfaced during DISCUSSION traces to the locked Ideation Scope Contract**
- Each gap in the Design + memory readiness section cites the Ideation artifact it references (path or section)
- No gap was invented outside the Scope Contract boundaries
- The "Out of scope gaps" section exists and captures any gap that is real but outside this task's scope

**All Ideation-surfaced scenarios are confirmed present in staging or feature memory**
- Every `scenario_gap` finding from Ideation EVALUATION has a corresponding staged file or a rationale for why it was classified as out-of-scope
- The Readiness summary's scenario count is consistent with the Design + memory readiness detail

**The "Readiness summary" matches the detail sections**
- The count of gaps found in the summary matches the actual items enumerated in Sub-step B and C sections
- The count of gaps resolved matches the items listed in "Generated this loop"
- Deferred counts match "Out of scope gaps" entries

**A gap classified as `skip` has an explicit user-stated reason (adversarial)**
- No gap is silently dropped — every `skip` decision appears in the Decisions log with the user's reasoning
- The stated reason is a business or scope rationale, not "too hard" or "we'll figure it out later"

**The Preparation artifact does not absorb out-of-scope project-wide gaps**
- "Out of scope gaps" section does not contain items the leader unilaterally decided to fix — only the user can authorize scope expansion
- If project-wide gaps were found but are unrelated to this task, they are in "Out of scope gaps" with a pointer to a backlog or note, not in "Generated this loop"

### Recommended verifications

| Tool | Use for |
|---|---|
| Read `1-ideation/outputs/` | Confirm that every gap the artifact claims to address traces to the actual Ideation output |
| Grep for slug names in `2-preparation/staging/` | Confirm every "Generated this loop" entry actually exists on disk |
| Read "Out of scope gaps" vs Scope Contract | Confirm the classification boundary is correct — items inside the Scope Contract should not be deferred without user-approved `defer` decisions |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Scope creep via "while we're here"** | Preparation only resolves readiness gaps for this task. If the leader stamped a skill that was not in the gap-resolution plan, that is an unauthorized action — flag `design_flaw` |
| **Gap count inflation** | Leaders sometimes inflate the gap list to appear thorough. Push back: each gap must be independently verifiable, not derived from vague "we might need this" reasoning |
| **Summary not matching details** | A Readiness summary that says "3 gaps resolved" but the Generated section lists 2 is an internal inconsistency — flag `general` (domain: `docs-sync`) |

---

## Structure

**Lens**: Is the Preparation artifact's **organizing decomposition** sound? Are the staged artifacts shaped correctly? Will downstream loops be able to consume them without confusion?

### Seed scenarios with attached checklists

**Every staged skill file uses the full project-skill template, not a skeleton**
- Staged skill files at `2-preparation/staging/skills/{slug}/SKILL.md` have all required sections populated (no `TODO`, `TBD`, `<...>` placeholders)
- The skill follows the project's naming convention (no underscores in the body, hyphen-separated)
- The YAML frontmatter is present and complete (`name`, `description`, `allowed-tools`)

**The working draft uses all seven required sections from the WORK template**
- All seven sections are present: Scope reference, Readiness summary, Design + memory readiness, Execution skills readiness, Generated this loop, Out of scope gaps, Decisions log
- No section is a placeholder — every section has substantive content or an explicit "none" statement

**Staged memory-promotion files follow the correct staging path conventions**
- Scenarios at `2-preparation/staging/scenarios/`, checklists at `2-preparation/staging/checklists/`, decisions at `2-preparation/staging/decisions/` — not mixed up
- Slug names are kebab-case, ≤ 60 characters
- Each staged file has correct frontmatter per its template (e.g., scenario files follow the [`memorization/templates/scenarios.md`](../memorization/templates/scenarios.md) shape)

**The generated artifacts are structurally compatible with Wrap-up's promotion routing table (adversarial)**
- Staged skills are at `2-preparation/staging/skills/{slug}/SKILL.md`, not a flat `.md` file that Wrap-up's routing would misplace
- Staged scenarios / checklists / decisions follow the directory structure Wrap-up expects — not placed in the wrong `staging/` subdirectory

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep for `TODO\|TBD\|<\.\.\.>` in staged skill files | Mechanical skeleton check — incomplete skills fail the template bar |
| Check `2-preparation/staging/` directory structure | Confirm the directory layout matches the canonical shape in `preparation/SKILL.md § Output paths` |
| Read one staged skill end-to-end | Confirm it is genuinely useful to an executor, not a placeholder |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Skeleton skills accepted as "generate-now" results** | A skill with placeholder text is not a generated skill — it is a deferred skill. Flag `design_flaw` |
| **Staging path confusion** | Skills staged at `staging/decisions/` instead of `staging/skills/` will be silently lost at Wrap-up promotion. Verify directory structure before assigning confidence |

---

## Performance

**Lens**: Is the Preparation artifact causing **downstream work amplification** — gaps left open that will cost more to fix in Planning or Execution?

### Seed scenarios with attached checklists

**Every High-severity gap has been resolved or explicitly deferred with a stated cost**
- The Readiness summary surfaces any remaining High-severity gaps
- Each remaining High-severity gap in "Out of scope gaps" has a stated downstream cost (e.g., "executor will need to infer TypeScript conventions from the codebase directly, adding ~30 min overhead per task")
- No High-severity gap is silently downgraded to Low to avoid resolution work

**The set of generated artifacts covers the hot paths the executor will walk**
- The Execution skills readiness section names the top 2-3 most frequently needed skills for this task
- Those top skills are either confirmed present or resolved as `generate-now`

**not-applicable: standard throughput / scalability concerns** — Preparation artifacts are a small number of markdown files; I/O volume is not a meaningful concern for this phase.

### Recommended verifications

| Tool | Use for |
|---|---|
| Read the Execution skills readiness section | Confirm severity assignments are calibrated — "Low" for a skill an executor will hit on every task is likely mis-classified |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Severity deflation to avoid work** | A gap classified as Low to justify `skip` when it is clearly blocking is a severity deflation. Cross-check against the Ideation Scope Contract to confirm the severity is real |

---

## Aesthetics

**Lens**: Is the **working draft itself** readable, consistent, and free of polish gaps?

### Seed scenarios with attached checklists

**A new reader understands what readiness state was found from the draft alone**
- Readiness summary reads standalone — no need to cross-reference DISCUSSION transcript to understand the overall gap picture
- Section headings match the seven required sections from the WORK template

**Naming in the artifact is accurate and self-explanatory**
- Staged artifact slugs match what they contain — a scenario file named `auth-flow-csrf-check.md` contains a CSRF check scenario, not a generic one
- No slug drift where the same item is referenced by different names in different sections

**The draft follows the project-skill template conventions for staged skills**
- Skill `name` field in frontmatter matches the directory slug
- No skill file has a heading that contradicts its frontmatter name

**Every section earns its place — no filler, no redundant boilerplate (adversarial)**
- No section is "See DISCUSSION" without an actual summary
- "Decisions log" contains the actual decisions, not a template skeleton

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep for placeholder strings (`TODO`, `TBD`, `<...>`, `???`) in the working draft | Mechanical placeholder check |
| Compare section ordering to the required-sections template | Detect structural deviation from the seven-section contract |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Aesthetics findings used as `FAIL` blockers** | Aesthetics rarely produces `FAIL`. Most findings are Medium or Low; calibrate severity accordingly |
| **"Readiness summary" that only says "preparation complete"** | A summary without counts and per-category status is a placeholder, not a summary — flag `general` (domain: `docs-sync`) |

---

## Usage

**Lens**: For the **next consumer** of this artifact — the Planning leader, the Execution executor, and the Wrap-up assistant — is the Preparation output usable?

### Seed scenarios with attached checklists

**The Planning leader can start without asking the user clarifying questions about what was prepared**
- Every `defer` decision has a downstream impact stated — Planning can plan around it
- Every `generate-now` result is fully formed — Planning does not need to reconstruct what was generated

**The Execution executor can read a staged skill and apply it without seeing the DISCUSSION transcript**
- Staged skills are standalone documents — no "see DISCUSSION" references inside the skill body
- Each skill's scope, gotchas, and constraints are stated, not implied

**The Wrap-up assistant can route every staging file without ambiguity**
- Each staged file's path and frontmatter unambiguously maps to a Wrap-up promotion destination per the routing table in `wrap-up/SKILL.md`
- No staging file is in an unexpected path that Wrap-up's routing table does not handle

**A consumer reads the Preparation artifact and forms the wrong mental model (adversarial)**
- The "Generated this loop" section does not claim coverage it did not deliver (e.g., listing a skill as generated when it is only a skeleton)
- Deferred gaps in "Out of scope gaps" are distinguished from resolved gaps — no ambiguity about which state each gap is in

**Accessibility / I18n awareness** (`not-applicable:` — Preparation artifacts are internal workflow docs with no user-facing strings or UI surfaces)

**Observability / "diagnosable at 3am"** — if a downstream loop fails because a readiness gap was missed, can a maintainer trace it back to the Preparation decision?
- Each gap entry in the working draft cites the Ideation artifact and Sub-step that surfaced it
- The Decisions log captures who approved each resolution so blame attribution is explicit

### Recommended verifications

| Tool | Use for |
|---|---|
| Read `wrap-up/SKILL.md § Staging → Project-memory routing` | Confirm every staged file's path is handled by the routing table |
| Read one staged skill as if you are an executor who has never seen the DISCUSSION | Identify what context is missing without the leader's session |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The Planner will ask if unclear"** | The Preparation artifact's job was to answer readiness questions before Planning starts. A Planner who needs to re-ask is a Preparation failure |
| **Staged skills that reference session state** | Staged skills must be standalone. A skill that says "per our discussion" or "as agreed" is unusable outside the session context |

---

## Consistency

**Lens**: Did everything that should sync inside the Preparation artifact, sync? Are there internal contradictions, mismatches between sections, or drifts from the Ideation output?

### Seed scenarios with attached checklists

**The Scope reference section points to the actual Ideation artifact, not a paraphrase**
- Scope reference section contains a file path (or section citation) to `1-ideation/outputs/`, not a prose summary of the Scope Contract
- The Scope Contract's `project` / `feature` / `task` fields in the Ideation artifact match what Preparation's readiness scanning targeted

**Design + memory readiness and Execution skills readiness sections do not overlap**
- A missing skill is not listed in both "Design + memory readiness" AND "Execution skills readiness"
- Each gap is categorized in exactly one sub-step section

**"Generated this loop" is consistent with the staging directory**
- Every file listed in "Generated this loop" actually exists in `2-preparation/staging/`
- No file in `2-preparation/staging/` was produced but omitted from "Generated this loop"

**The Decisions log reflects every AskUserQuestion outcome from DISCUSSION**
- Each gap in the consolidated gap table has a corresponding entry in the Decisions log
- No gap has a resolution in the staging artifacts that does not match the Decisions log entry

**Internal vs external gap evidence conflict and the conflict is not resolved (adversarial)**
- If the Ideation staging shows a scenario that the Sub-step B check claims is present in feature memory — but that scenario does not actually exist in feature memory — the contradiction is flagged, not silently resolved

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep slug names from "Generated this loop" in `2-preparation/staging/` | Confirm every listed file exists |
| Read `1-ideation/outputs/` Scope Contract against "Scope reference" section | Confirm the Scope reference is an accurate pointer, not a rewrite |
| Cross-reference the Decisions log against the gap table | Every gap entry should have exactly one Decisions log entry |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The Decisions log captures everything"** without checking | The Decisions log is easy to falsify by listing decisions that were not actually made. Cross-verify against the gap table row-by-row |
| **Staging directory as source of truth without verification** | Claiming "Generated this loop" is complete based on the staging directory without reading the files is a coverage gap — verify each file is well-formed, not just present |

---

## Risk

**Lens**: **What breaks if Preparation is wrong?** Wrap-up sole-writer contract, staging path correctness, RE-IDEATE triggers not caught, deferred items lost.

### Seed scenarios with attached checklists

**No Preparation write went directly to project memory (Wrap-up sole-writer contract)**
- All `generate-now` outputs are staged under `sessions/{date}-{session-id}/2-preparation/staging/`, not written directly to `.gobbi/projects/{project-name}/skills/`, `features/`, or other project-memory paths
- The Decisions log does not reference a direct project-memory write
- `2-preparation/staging/` exists; `features/...` was not touched during Preparation

**Every RE-IDEATE trigger was either caught and escalated or explicitly ruled out**
- Each gap in the artifact was assessed for whether it reveals an unworkable design (RE-IDEATE) vs a missing artifact (generate-now)
- If any gap was classified `generate-now` when its root cause is an Ideation design flaw, the misclassification is a High-risk finding
- The artifact explicitly states "no RE-IDEATE escalation required" or names the escalation that was made

**Deferred items in "Out of scope gaps" are not silently lost**
- Each deferred item has a pointer to where it was backlogged (staging path or downstream note)
- No deferred item is described with only "TBD" or "later" — each has a concrete next-action pointer

**Staged skill slugs will not collide with existing project skills on Wrap-up promotion (adversarial)**
- Staged skill slugs are checked against existing skills in `.gobbi/projects/{project-name}/skills/` — if a skill with the same slug already exists, the artifact must explain whether this is an update (intended overwrite) or a collision (bug)
- No staged skill overwrites a project-skill that the Ideation design did not intend to replace

**Privacy / data retention** (`not-applicable:` — Preparation artifacts contain no PII or sensitive data; they are internal gap lists and skill scaffolding)

**License / IP risk** — if `generate-now` skills codify patterns from external libraries or frameworks, the license of those sources applies
- Each generated skill that codifies external patterns names the source (library, spec, community standard) and its license class
- No generated skill incorporates verbatim copied content from a source with an incompatible license

**Cost / budget impact** (`not-applicable:` — Preparation produces local markdown files; no API or infra cost is incurred by the Preparation Loop itself)

### Recommended verifications

| Tool | Use for |
|---|---|
| `find .gobbi/projects/{project-name}/skills/ -name "*.md"` | Check for any direct project-memory writes that bypassed staging |
| Check `2-preparation/staging/skills/` slugs against existing skills | Detect slug collisions before Wrap-up promotion |
| Grep "RE-IDEATE" in preparation working draft | Confirm RE-IDEATE assessment is explicitly recorded, not silently skipped |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up sole-writer contract assumed without checking** | The sole-writer contract is a hard constraint. A `generate-now` decision that wrote directly to project memory is a constraint violation — flag `design_flaw` (Critical) |
| **"No RE-IDEATE needed" without checking the Ideation design for unworkable premises** | RE-IDEATE classification requires comparing each gap's root cause against the Ideation design. A blanket "no RE-IDEATE" without that check is overconfident |

---

## Overall (Stage 3) — phase-specific anchors

When the evaluator runs Stage 3 on a Preparation artifact, the Karpathy-4 check applies as follows:

| Karpathy mode | What it looks like in a Preparation artifact |
|---|---|
| **Wrong assumptions** | A gap classified as `skip` based on an assumption ("the executor will figure it out") that the Ideation Scope Contract does not support |
| **Overcomplexity** | A `generate-now` skill that codifies conventions that could have been expressed in two sentences in the Ideation design direction — the skill adds maintenance overhead without adding executor clarity |
| **Orthogonal edits** | The Preparation artifact resolves gaps unrelated to the current task (scope absorption) — bundling out-of-scope work dilutes focus and risks Wrap-up promotion pollution |
| **Imperative-over-declarative** | A staged skill that describes what the executor should do step-by-step rather than what the domain conventions *are* — skills teach, they do not script |

**Preserve-list anchors specific to Preparation**: gap-resolution decisions that correctly classify RE-IDEATE triggers; staged skills that are genuinely complete and standalone; Decisions log entries that capture the user's explicit reasoning per gap.

---

## Output reminder

The evaluator writes:
- Seven per-perspective files at `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{system}/{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One overall file at `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{system}/overall.md`

Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (from Stage 0; includes paths consumed for project/feature overrides + project mistakes + project rules + prior-phase canonical) → `## Locked Frame (Stage 1)` (augmented from this child doc's seed content + prior-iter open findings + overrides) → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.
