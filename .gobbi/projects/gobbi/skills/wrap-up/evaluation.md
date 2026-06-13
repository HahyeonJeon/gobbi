# Wrap-up Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `wrap-up`. Provides per-perspective **seed scenarios with attached checklists** + **recommended tool verifications** + **perspective-specific anti-patterns** for a Wrap-up Loop's session handoff.

The artifact under evaluation is the Wrap-up loop's `sessions/{date}-{session-id}/5-wrap-up/outputs/` files (the handoff summary, shipped-summary, next-session-pointers, and any other artifact the Wrap-up assistant produced) **plus** the full set of memory promotions Wrap-up made. Wrap-up promotion targets span the entire memory surface (not only features/ + mistakes/):

- `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,references,design,discussions,backlogs,plans}/` — feature-scoped promotions
- `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` — feature-scoped mistakes
- `.gobbi/projects/{project-name}/features/{feature-name}/README.md` — feature index + activity log
- `.gobbi/projects/{project-name}/mistakes/` — project-scoped mistakes
- `.gobbi/projects/{project-name}/rules/` — project rules
- `.gobbi/projects/{project-name}/design/` — project-level design docs
- `.gobbi/projects/{project-name}/notes/` — handoff / investigation notes
- `.gobbi/projects/{project-name}/backlogs/` — project-level deferrals beyond features

The promotion is part of the wrap-up artifact — evaluation must verify it across every destination, not assume it.

Wrap-up evaluation is **non-skippable**. A wrap-up that consolidates incorrectly poisons every future session. The cost of catching a bad wrap-up is paid once; the cost of missing it compounds. Scenarios include adversarial cases (phantom completion claims, silent supersession, missed mistakes) so Stage 2 walks each Frame once without a separate adversarial pass.

---

## Project

**Lens**: Does the wrap-up consolidate **the right session's work**, completely, without inventing claims?

### Seed scenarios with attached checklists

**Every shipped artifact from the session is referenced**
- Handoff summary lists every loop that ran with its final verdict
- Every Ideation/Planning artifact created in the session is linked from the wrap-up

**Every deferred item / open question is named, not hidden**
- Open / deferred items have explicit `next-action:` fields
- No "we'll get to it" hand-waves

**The handoff summary's "what was shipped" matches `git log`**
- Each "shipped X" claim has a corresponding commit
- No phantom claims — the wrap-up does not say "shipped X" when X was deferred

**Every staging artifact from earlier loops is accounted for**
- Each staging artifact is promoted to memory OR explicitly marked "promoted to backlog instead"
- `ls` on every loop's `staging/` directory matches the promotion record

**No claim in the wrap-up is unsupported by a session artifact**
- Each substantive claim cites the supporting artifact (commit / file path / session note)
- Hand-wavy summaries are tightened to citable claims

**Wrap-up claims completion of a deferred item (adversarial)**
- Each completion claim is cross-referenced against the change-set
- A "shipped" claim with no commit is a phantom — flag `general` Critical

### Recommended verifications

| Tool | Use for |
|---|---|
| `git log` of the session's branch | Compare against "what was shipped" claims |
| `ls -la` on `sessions/{date}-{session-id}/{N}-{loop}/staging/` for every loop | Confirm staging artifacts were either promoted or backlogged |
| `git diff` for new files under `features/{feature-name}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/` | Verify promotion actually happened across all project-tier destinations |
| `find .gobbi/projects/{project-name}/` (pre-Wrap-up vs post-Wrap-up) | Identify exactly what was promoted at each destination |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up that claims completion of deferred items** | Verify each claim against the actual change-set. A "shipped" claim with no commit is a phantom |
| **Wrap-up that ignores Ideation/Planning outputs** | If Ideation produced staging artifacts but the wrap-up doesn't reference them, the consolidation is incomplete |
| **Project-tier writes outside features/ + mistakes/ unverified** | rules/, design/, notes/, backlogs/ promotions are equally part of Wrap-up's scope. Audit every destination |

---

## Structure

**Lens**: Is the **promoted memory** well-structured? Does it slot into existing memory without breaking conventions?

### Seed scenarios with attached checklists

**Promoted files match the project's directory conventions**
- Every promoted file lives at a path the project's memory schema already defines
- No new directories created outside the documented schema

**Promoted file slugs are consistent with existing naming patterns**
- Slugs are kebab-case, concise, and not collision-prone
- Adjacent existing files use similar slug patterns

**No new top-level memory directories invented**
- Wrap-up promotes into existing structure, doesn't reshape it
- Schema changes (if any) belong to a separate Ideation loop, not Wrap-up

**Frontmatter (where required) is complete and valid**
- All required frontmatter fields present
- Frontmatter validates against the project's expected schema

**Cross-references from promoted files resolve**
- Links from promoted files to other memory files resolve
- Every "see X" target exists at the path cited

**Wrap-up quietly invents a new memory schema (adversarial)**
- Promoted file shapes are diff-checked against existing schema
- Any new field / section / directory is flagged for explicit user approval

**Every staging file landed at its deterministic destination per the routing table**
- The Type + Domain → destination routing (per `evaluation/SKILL.md` § Finding Metadata) was followed without improvisation
- No staging file landed at a destination not in the routing table

### Staging → memory routing (deterministic; Wrap-up MUST follow)

See [`wrap-up/SKILL.md` § Staging → Memory routing](SKILL.md#staging--memory-routing) for the authoritative routing table. The evaluator's job here is to verify that every staging file's actual destination matches the table — not to maintain a separate copy. For each entry in `working/promotion-manifest.md`, cross-reference the destination against the SKILL.md routing table and flag any deviation.

### Recommended verifications

| Tool | Use for |
|---|---|
| `find .gobbi/projects/{project-name}/ -name '*.md'` pre vs post Wrap-up | Identify exactly what was promoted across all destinations |
| Apply the staging→destination routing table mechanically against each session staging file | Verify the destination matches the table |
| Schema-conformance grep on promoted files | Verify frontmatter / structure |
| `grep` link targets in promoted files against actual file paths | Detect broken cross-references |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up inventing new memory schemas** | Wrap-up consolidates; it does not redesign. Schema changes belong in an Ideation loop |
| **Slugs that duplicate earlier session's promotions** | A second slug `auth-refactor.md` written next to an existing `auth-refactor.md` is a collision. Disambiguate explicitly |

---

## Performance

**Lens**: Does the wrap-up complete in **reasonable bound** without producing memory bloat?

### Seed scenarios with attached checklists

**Promoted artifacts add net value, not verbose restatements**
- Promoted file size is bounded (typical: 30–200 lines per memory file)
- No raw transcript dumps in `features/` or `mistakes/`

**Total memory delta is proportional to the session's actual learning**
- Memory file count after wrap-up matches a reasonable distillation of the session
- No "memory file per scratch thought" pattern

**Promoted content distills decisions / rules / mistakes — does not reproduce session history**
- Each promoted file states a decision / rule / mistake at the top
- Supporting context is summarized, not transcribed

**A bloated memory file slips through because each individual section "looks fine" (adversarial)**
- Total word count across promoted files is sanity-checked against the session's scale
- Files over the typical bound are challenged

### Recommended verifications

| Tool | Use for |
|---|---|
| `wc -l` on each promoted file | Detect bloat |
| `grep "session transcript"` or similar in promoted files | Detect raw-dump promotions |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"More memory is better"** | Memory has a cost — every future session loads it. Distill, don't dump |

---

## Aesthetics

**Lens**: Is the **handoff summary itself** readable and self-evident?

### Seed scenarios with attached checklists

**A reader opening only 5-wrap-up/outputs/ understands what the session did**
- `5-wrap-up/outputs/` opens with a one-paragraph summary
- Section structure is consistent with the project's handoff template

**Section structure matches the project's handoff template**
- Required sections (Summary / Shipped / Open Items / Next Actions / Pointers) all present
- Order matches prior wrap-ups in this project

**No placeholders, no unfinished sentences**
- No "TODO: write this" or `???` left in the doc
- Date / session-id / branch are stamped at the top

**Pointers use stable paths, not session-relative shortcuts**
- Path references resolve from any working directory (absolute or repo-root–relative)
- No `./...` paths that break when read from a different cwd

**The handoff looks complete but a section is silently empty (adversarial)**
- Every required section has at least one substantive entry (or explicit "(none)" with rationale)
- "(see above)" cross-references are checked for actually-existing content above

### Recommended verifications

| Tool | Use for |
|---|---|
| Read `5-wrap-up/outputs/` cold | Test the "next session opens this first" experience |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Quick wrap-up because session was short"** | Short sessions still produce promotable memory. The wrap-up's job is consolidation, not length-proportional ceremony |

---

## Usage

**Lens**: Can the **next session** open this wrap-up and **continue work** without re-deriving context?

### Seed scenarios with attached checklists

**A fresh agent at next session start resumes without asking "what were you working on?"**
- `5-wrap-up/outputs/` + the promoted memory together contain enough context to resume
- No silent assumption that the next agent will recall the prior session

**Open items have `next-action:` fields concrete enough to start work**
- Every open item has a `next-action:` field with the verb + scope
- Next-action fields are runnable instructions, not summaries

**Pointers resolve and will keep resolving**
- Pointers use absolute or repo-root–relative paths
- Pointers do not reference session-scratch state (which is private)

**"Decisions to respect" are stated as constraints, not narrative**
- Every "decision to respect" is phrased as a constraint ("X must Y", not "we discussed X")
- Constraint format is consistent across all decisions

**The wrap-up assumes next-session context that won't be loaded (adversarial)**
- Simulate next-session start: only CLAUDE.md, project README, and the wrap-up are loaded
- Anything the wrap-up references that isn't in this set is a gap

### Recommended verifications

| Tool | Use for |
|---|---|
| Read wrap-up + auto-loaded memory (project README / CLAUDE.md) as a fresh agent would | Test continuation viability |
| Verify every pointer in the wrap-up resolves | Detect link rot at promotion time |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Next-session-me will remember"** | Next-session-you is a fresh agent with no memory. Write for that audience |
| **Narrative wrap-ups** | "We discussed X and decided Y" reads as history. Future agents need "Y is the decision; respect it" |

---

## Consistency

**Lens**: Does the wrap-up tell **one coherent story**? Does it match the session's actual artifacts? Does promoted memory sync with existing memory?

### Seed scenarios with attached checklists

**The wrap-up's "what was shipped" matches the session's actual artifacts 1:1**
- Every loop the session ran is referenced in the wrap-up
- Each loop's stated verdict matches the session's actual evaluation outcomes

**Every staging artifact is promoted or explicitly backlogged**
- Staging contents are diff-checked against promotion record
- No silent drops between staging and memory

**Promoted memory does not contradict existing memory silently**
- Promoted files that update / supersede existing memory have an explicit `supersedes:` reference (or equivalent project convention)
- Where the new file contradicts an existing one without supersession, the conflict is flagged

**Cross-references inside the wrap-up resolve**
- Internal cross-references in `5-wrap-up/outputs/` (e.g., "see Section 3", "per the Ideation working draft") resolve
- Forward references match later-section content

**Mistakes extracted match user corrections in the session transcript**
- Every user correction in the session transcript has a corresponding `mistakes/` entry (or explicit "decided not to record" with reason)
- No promoted mistake that the session transcript does not support

**Handoff claims about open items match `next-action:` fields in promoted decisions**
- Open items mentioned in handoff summary == next-action fields in promoted memory
- No "open" in summary that's "closed" in memory (or vice versa)

**Cherry-picked promotion drops an inconvenient staging artifact (adversarial)**
- Every staging artifact is accounted for explicitly
- "Skipped" staging items have a rationale stated, not just absence

**Every evaluator finding across all loop iterations has a final disposition** (closure audit)
- For each loop the session ran (Ideation / Planning / Execution / Wrap-up), every iteration's findings are enumerated
- Each finding carries one of five dispositions: `addressed` (fix shipped, with commit/diff pointer) / `deferred` (with backlog pointer + reason) / `disputed` (rationale recorded, optionally promoted as rule) / `superseded` (by which later finding) / `still open` (with explicit reason it survived)
- Low-confidence appendix findings are included in the audit (they don't disappear silently)
- Stuck findings escalated to the user mid-session (recorded in the discussion log and the next iter's `disposition:` field) are accounted for explicitly
- Regression findings (introduced by REVISE) are tagged in the disposition record

**Recurring findings are promoted to memory**
- Any finding that recurred (stuck) across iterations becomes a `mistakes/` candidate
- Recurring patterns across loops (same symptom in Planning + Execution) become `features/{feature-name}/decisions/` or project-level rule candidates

### Recommended verifications

| Tool | Use for |
|---|---|
| Diff `staging/` directory contents vs promoted memory files | Detect staging artifacts that were silently dropped |
| `grep` "supersedes" / "updates" in newly promoted files | Confirm conflicts with prior memory are declared, not silent |
| Cross-reference scan: every link / path in `5-wrap-up/outputs/` | Detect link rot at handoff time |
| Diff session transcript's correction passages vs new `mistakes/` entries | Detect missed mistakes |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Cherry-picked promotions** | Staging artifact promoted because it sounds good, ignoring others. All staging must be accounted for, even if the account is "backlogged because Y" |
| **Wrap-up that "consolidates" by fabricating** | A summary statement not supported by a session artifact is a Consistency violation. Cite the supporting artifact or drop the claim |
| **Silent supersession** | New memory file that contradicts an existing one without saying so. Reviewers and future-self will treat both as authoritative |

---

## Risk

**Lens**: What breaks if the wrap-up is **wrong**? Memory pollution, false-positive completion claims, lost work.

### Seed scenarios with attached checklists

**No work-in-progress is left dangling without a pointer**
- `git status` after wrap-up shows no uncommitted scratch
- All session scratch state remains intact under `sessions/{date}-{session-id}/`

**Promoted memory does not silently overwrite existing memory**
- Promoted files that update an existing memory file explicitly state what they replace / supersede
- No file that creates ambiguity about which version is authoritative

**Session-scratch state is preserved for audit**
- Wrap-up does not delete `sessions/.../{N}-{loop}/` directories
- Scratch is the audit trail; it stays

**Mistakes from this session are recorded**
- Every user correction during the session has a corresponding `mistakes/` entry
- A session that hit a mistake and did not record it will hit it again

**A promoted file silently contradicts an existing file (adversarial)**
- Promoted file content is diff-checked against the existing memory it most closely overlaps with
- Conflicts that lack explicit supersession are flagged Critical

**Cost / paid-API consumption recorded** (Coverage Matrix: Performance + Risk)
- Session's total paid-API / cloud-cost is recorded in the handoff for future-self awareness
- Anomalous cost spend is called out (e.g., 10× expected)

**Privacy / sensitive-data exposure during session** (Coverage Matrix: Risk + Consistency)
- If any session activity touched real PII or sensitive data (e.g., grepping production data), that's recorded
- No transient sensitive data left in committable scratch (logs / sessions/.../{N}-{loop}/working/)

**Process mistakes** (Coverage Matrix: Risk + Consistency)
- User corrections that surfaced workflow / process gaps (e.g., evaluator missed a category, manager skipped escalation) become mistake candidates
- Stuck escalations the user resolved (recorded in the discussion log) have the resolution lessoned into memory

### Recommended verifications

| Tool | Use for |
|---|---|
| `git status` after wrap-up — confirm no uncommitted scratch | Detect dangling work |
| `grep -r "supersedes\|updates"` in newly promoted files | Confirm conflicts with prior memory are explicit |
| Diff: corrections in session transcript vs new mistakes entries | Detect un-recorded corrections |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up that deletes session scratch** | Scratch is the audit trail. Wrap-up promotes from it; it never deletes it |
| **Silent memory contradictions** | If a promoted file makes an old memory file wrong, the wrap-up must explicitly mark the old one superseded |
| **Skipped mistake recording** | A session that produced corrections without producing mistake entries failed at its highest-value output |

---

## Overall (Stage 3) — phase-specific anchors

| Karpathy mode | What it looks like in a Wrap-up artifact |
|---|---|
| **Wrong assumptions** | Wrap-up assumes the user wants memory the user did not validate ("I promoted this because it seemed important") |
| **Overcomplexity** | Wrap-up introduces a new memory category / schema / convention. Should reuse existing |
| **Orthogonal edits** | Wrap-up bundles promotions for unrelated features into one synthesis — should be split per feature scope |
| **Imperative-over-declarative** | Wrap-up tells the next session *how* to resume instead of *what state* must be respected |

**Preserve-list anchors specific to Wrap-up**: mistakes that crystallize a real correction; concise next-action items; pointers that resolve and will keep resolving.

---

## Output reminder

Same as the parent SKILL.md — seven per-perspective files + one overall file under `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{system}/`. Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (Stage 0) → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.

The Wrap-up loop is special: a `FAIL` here is **terminal escalation** — the manager uses the active runtime's user-decision primitive to present the failure findings to the user and decide next action (typically: accept the partial wrap-up with acknowledged gaps, re-run WORK with corrective direction, or abort session closure and defer to a follow-up session). `FAIL` does NOT automatically trigger a REVISE re-entry; that would mask a promotion failure the user should be aware of. `REVISE` (not FAIL) is the normal iteration path for fixable promotion gaps. See `wrap-up/SKILL.md` § EVALUATION Phase for the authoritative verdict routing.
