# Wrap-up Loop — Evaluation Scenarios

Per-perspective GOOD / BAD / ADVERSARIAL discrimination scenarios for a Wrap-up Loop's session
consolidation. The evaluator loads this file at Stage 1 (Scenario-Checklist Frame Build) as seed
scenarios for the seven perspectives.

The evaluation **procedure** — the per-perspective lens definitions, recommended verifications,
perspective anti-patterns, and Overall (Stage 3) anchors — lives in the sibling `evaluation.md`.
The concrete yes/no **checks** each scenario references live 1:1 in the sibling `checklist.md`,
whose heading tree mirrors this file exactly.

The artifact under evaluation is **the Wrap-up loop's `sessions/{date}-{session-id}/5-wrap-up/outputs/`
files** (the handoff summary and any decomposed artifact) **plus the full set of memory promotions
Wrap-up made** across every destination — `features/{feature-name}/{scenarios,checklists,decisions,
references,design,discussions,backlogs,plans,mistakes,changelogs,rules,learnings,reviews,reports}/`
and its `README.md`, plus project-tier `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`,
`learnings/`, `reviews/`, `reports/` — the staging inventory, the promotion manifest, the per-session
journal entry, any Stage-2c memory-compaction writes when enabled, and the Stage-5 git-finalization
evidence when it exists. This evaluation **IS pipeline stage 3 — memory validation**; its verdict
gates the irreversible stage 5 (git finalization). Wrap-up is a **consolidation loop** — the artifact
is a handoff + promotions, not code — so every family below judges **consolidation quality**: did the
session's work get promoted completely and correctly, does promoted memory slot into the existing
schema, does the handoff match `git log`, can the next session resume from it, and did the irreversible
git action happen only after validation. Each family carries a `### {ID}` heading, a **Category**, the
**Situation** it arises in, the **Good** outcome, the **Bad / failure** outcome, one **Adversarial**
case a real evaluator would probe, and the **Checklist IDs** whose joint satisfaction proves the
scenario handled. Scenario IDs follow `WRAP-{PERSPECTIVE}-SCENARIO-{NN}`; each check follows
`{scenario-id}-CHECK-{NN}` and lives in `checklist.md`.

---

## Project
_Lens (see `evaluation.md`):_ does the wrap-up consolidate **the right session's work**, completely, without inventing claims?

### WRAP-PROJ-SCENARIO-01 — Right session, every artifact referenced
**Category:** golden-path
**Situation:** the handoff summarizes the session that just ran.
**Good:** the handoff lists every loop that ran (Ideation / Preparation / Planning / Execution) with its final verdict; every artifact the session created across those loops is linked from the wrap-up.
**Bad / failure:** a loop that ran is unlisted, its verdict is missing, or a session artifact is never referenced.
**Adversarial:** the handoff references the wrong session's work — a linked artifact or a verdict actually belongs to a prior session — so the summary reads complete while describing work this session did not do.
**Checklist IDs:** `WRAP-PROJ-SCENARIO-01-CHECK-*`

### WRAP-PROJ-SCENARIO-02 — Shipped claims match `git log`, no phantom completion
**Category:** failure-mode
**Situation:** the handoff's "what was shipped" section makes completion claims.
**Good:** each "shipped X" claim has a corresponding commit in the session branch's `git log`; each completion claim is cross-referenced against the actual change-set; no claim says "shipped X" for an item that was deferred.
**Bad / failure:** a "shipped" claim has no backing commit, or a deferred item is described as shipped.
**Adversarial:** the wrap-up claims completion of a deferred item — a "shipped X" with no commit behind it — a phantom that reads as done.
**Checklist IDs:** `WRAP-PROJ-SCENARIO-02-CHECK-*`

### WRAP-PROJ-SCENARIO-03 — Every staging file accounted for; every claim cited
**Category:** failure-mode
**Situation:** earlier loops left staging artifacts and the handoff makes substantive claims.
**Good:** every staging artifact from every promotion source — the workflow-loop `staging/` dirs, each Execution task-dir `staging/`, `interview/staging/`, and (Chat-mode sessions) each per-slice `staging/` — is promoted to memory, explicitly backlogged, or dropped with a stated rationale; an `ls` of each source's `staging/` matches the promotion record; every open / deferred item carries an explicit `next-action:` field with no "we'll get to it" hand-wave; each substantive claim cites its supporting artifact (commit / file path / promotion-manifest entry / session note / discussion record).
**Bad / failure:** a staging file is silently dropped, an open item lacks a `next-action:`, a hand-wave stands in for a named deferral, or a summary claim cites nothing.
**Adversarial:** the promotion record and the handoff agree with each other, but neither matches the on-disk staging set — a staging file exists that appears in neither, so the internal cross-check passes while a real artifact is unaccounted for.
**Checklist IDs:** `WRAP-PROJ-SCENARIO-03-CHECK-*`

---

## Structure
_Lens (see `evaluation.md`):_ is the **promoted memory** well-structured, routed by the contract, and compatible with existing memory conventions?

### WRAP-STRUCT-SCENARIO-01 — Promoted files match the existing memory schema
**Category:** golden-path
**Situation:** Wrap-up writes promoted files into the memory tree.
**Good:** every promoted file lives at a path the project's memory schema already defines; each by-area destination's resolved `{area}/` segment is an area the destination type's allowlist permits; no new memory directory is created outside the documented schema; Wrap-up promotes into the existing structure rather than reshaping it.
**Bad / failure:** a promoted file lands at an undefined path, resolves an area outside its type's allowlist, or a new directory is created outside the schema.
**Adversarial:** Wrap-up quietly invents a new memory schema — a new field, section, or directory shape appears on a promoted file and is never flagged for user approval — so a schema change rides in under a consolidation instead of going through an Ideation loop.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-01-CHECK-*`

### WRAP-STRUCT-SCENARIO-02 — Slugs follow existing naming patterns, no collision
**Category:** failure-mode
**Situation:** each promotion needs a slug.
**Good:** promoted slugs are kebab-case and concise; each follows the pattern of adjacent existing files in the same directory; no slug collides with an existing file.
**Bad / failure:** a slug is verbose, off-pattern, or silently collides with a prior session's promotion.
**Adversarial:** a promoted slug duplicates an earlier session's promotion at the same path — a second `auth-refactor.md` beside the existing one — so the second silently overwrites or shadows the first.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-02-CHECK-*`

### WRAP-STRUCT-SCENARIO-03 — Frontmatter is complete and validates
**Category:** failure-mode
**Situation:** promoted memory files carry required frontmatter.
**Good:** every required frontmatter field is present; the frontmatter validates against the project's memory schema; staging-only routing fields are stripped, while base and destination-type extension fields (including `author` and `keywords`) are retained — no over-strip and no stray key.
**Bad / failure:** a required field is missing, a legitimate destination-type field is wrongly stripped, or a staging-only routing key survives promotion.
**Adversarial:** a promoted file keeps a staging-only routing key (e.g. `mistake-candidate`) that passes a casual read but fails the frontmatter validator's no-stray-keys check.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-03-CHECK-*`

### WRAP-STRUCT-SCENARIO-04 — Routing followed and cross-references resolve
**Category:** failure-mode
**Situation:** each staging file has a deterministic routing destination, and promoted files link to other memory.
**Good:** every staging file landed at its deterministic destination per the routing table (Type + Domain → destination) with no improvisation; no file landed at a destination absent from the routing table; any user-confirmed routing fork (mistake scope, rules, project-wide design, cross-feature reviews / reports / learnings) cites the authorizing user decision; links from promoted files to other memory resolve, and every "see X" reference targets an existing path.
**Bad / failure:** a staging file landed at an improvised destination, a user-confirmed fork was applied with no authorizing decision, or a promoted-file cross-reference is broken.
**Adversarial:** a promotion lands at a plausible-looking but off-table destination while its cross-references still resolve, so the link check passes and the routing deviation goes unnoticed.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-04-CHECK-*`

---

## Performance
_Lens (see `evaluation.md`):_ does the wrap-up complete in **reasonable bound** without producing memory bloat?

### WRAP-PERF-SCENARIO-01 — Each promoted file is bounded and distilled
**Category:** golden-path
**Situation:** each promotion writes a memory file.
**Good:** each promoted file's size is bounded (typically 30–200 lines); it states its durable decision / rule / mistake / learning / backlog item / report at the top; supporting context is summarized, not transcribed; no raw transcript dump lands in `features/` or `mistakes/`.
**Bad / failure:** a promoted file transcribes session history, dumps a raw transcript, or buries its point below long narrative.
**Adversarial:** a promoted file stays just under the line bound but its body is transcribed session narrative rather than a distilled decision — bounded size hides an undistilled dump.
**Checklist IDs:** `WRAP-PERF-SCENARIO-01-CHECK-*`

### WRAP-PERF-SCENARIO-02 — Total memory delta is proportional; caps respected
**Category:** failure-mode
**Situation:** the session produced a set of promotions, and the dormant Stage-2c memory-compaction sub-step may apply after promotion.
**Good:** the memory file count after wrap-up matches a reasonable distillation of the session's actual learning; there is no "memory file per scratch thought" pattern; the total word count across promoted files is sanity-checked against the session's scale; any file over the typical bound is challenged; Stage-2c is skipped explicitly when `settings.compaction.enabled` is false, and when enabled each over-cap `{type}/{area}/` is consolidated losslessly (sources kept recoverable + archived, inbound references repointed, standing guards green) rather than summarized away.
**Bad / failure:** the session spawns one memory file per scratch thought, a bloated file passes because each section "looks fine" in isolation, or an enabled compaction summarizes away source detail to hit a count.
**Adversarial:** each promoted file looks fine alone, but the total memory delta far exceeds the session's actual learning — the bloat is visible only in aggregate, never per-file.
**Checklist IDs:** `WRAP-PERF-SCENARIO-02-CHECK-*`

---

## Aesthetics
_Lens (see `evaluation.md`):_ is the **handoff summary itself** readable and self-evident?

### WRAP-AESTH-SCENARIO-01 — Handoff is self-evident and template-conformant
**Category:** golden-path
**Situation:** the handoff at `5-wrap-up/outputs/` is written for a cold reader.
**Good:** it opens with a one-paragraph summary; all required sections (Summary / Shipped / Deferred / Open / Decisions to respect / Pointers / Promotion summary) are present in the order prior wrap-ups use; date / session-id / branch are stamped at the top; a reader opening only `5-wrap-up/outputs/` understands what the session did.
**Bad / failure:** a required section is missing, the order diverges from prior wrap-ups with no reason, or the top lacks the date / session-id / branch stamp.
**Adversarial:** the handoff looks complete but a required section is silently empty — a heading with no entry, or a "(see above)" pointing at content that does not exist above.
**Checklist IDs:** `WRAP-AESTH-SCENARIO-01-CHECK-*`

### WRAP-AESTH-SCENARIO-02 — No placeholders; pointers use stable paths
**Category:** failure-mode
**Situation:** the handoff carries prose and path pointers.
**Good:** no "TODO: write this", `???`, or unfinished sentence remains; every path reference is stable — absolute or repo-root–relative — and resolves from any working directory; no `./...` session-relative shortcut is used.
**Bad / failure:** a placeholder or unfinished sentence ships, or a pointer uses a cwd-relative path that breaks when read elsewhere.
**Adversarial:** a pointer reads cleanly but is a `./`-relative path that resolves only from the wrap-up's own directory, so the next session opening it from the repo root hits a dead path.
**Checklist IDs:** `WRAP-AESTH-SCENARIO-02-CHECK-*`

---

## Usage
_Lens (see `evaluation.md`):_ can the **next session** open this wrap-up and **continue work** without re-deriving context?

### WRAP-USAGE-SCENARIO-01 — Next session resumes without re-deriving context
**Category:** golden-path
**Situation:** a fresh agent opens the wrap-up at the next session start.
**Good:** `5-wrap-up/outputs/` plus the promoted memory together carry enough context to resume; nothing assumes the next agent recalls the prior session.
**Bad / failure:** resuming requires context the wrap-up never captured, or the wrap-up leans on the next agent "remembering".
**Adversarial:** simulate next-session start with only CLAUDE.md, the project README, and the wrap-up loaded — the wrap-up references a session-scratch note or an in-memory fact outside that set, so a fresh agent following it hits a gap the author never noticed.
**Checklist IDs:** `WRAP-USAGE-SCENARIO-01-CHECK-*`

### WRAP-USAGE-SCENARIO-02 — Open items carry runnable next-actions
**Category:** failure-mode
**Situation:** the wrap-up lists open / deferred items.
**Good:** every open item has a `next-action:` field with a verb + scope; each next-action reads as a runnable instruction, not a summary.
**Bad / failure:** an open item has no next-action, or its next-action restates the problem instead of naming an actionable step.
**Adversarial:** an open item carries a `next-action:` that summarizes the problem ("finish the migration") rather than a runnable step, so the next agent still has to re-derive what to actually do.
**Checklist IDs:** `WRAP-USAGE-SCENARIO-02-CHECK-*`

### WRAP-USAGE-SCENARIO-03 — Pointers resolve and decisions are constraints
**Category:** failure-mode
**Situation:** the wrap-up carries pointers and "decisions to respect".
**Good:** resume-critical pointers use absolute or repo-root–relative durable paths and will keep resolving after worktree cleanup; a session-scratch pointer appears only as audit evidence, never as the sole source needed to continue work; every "decision to respect" is phrased as a constraint ("X must Y", not "we discussed X"); the constraint format is consistent across all decisions.
**Bad / failure:** continuation depends on a private session-scratch pointer, or a "decision to respect" is narrative rather than a constraint.
**Adversarial:** a "decision to respect" is written as narrative history ("we discussed X and chose Y"), so the next session reads it as background and re-litigates the settled decision.
**Checklist IDs:** `WRAP-USAGE-SCENARIO-03-CHECK-*`

---

## Consistency
_Lens (see `evaluation.md`):_ does the wrap-up tell **one coherent story**? Does it match the session's actual artifacts? Does promoted memory sync with existing memory?

### WRAP-CONS-SCENARIO-01 — Shipped story matches the session's artifacts 1:1
**Category:** golden-path
**Situation:** the wrap-up narrates what shipped and what stays open.
**Good:** every loop the session ran is referenced; each loop's stated verdict matches the session's actual evaluation outcomes; open items in the handoff summary match the `next-action:` fields in promoted memory.
**Bad / failure:** a loop is unreferenced, a stated verdict does not match the evaluation record, or an open/closed status disagrees between summary and memory.
**Adversarial:** the handoff calls an item "open" while the promoted decision marks it closed (or the reverse), so the summary and the memory tell two different stories.
**Checklist IDs:** `WRAP-CONS-SCENARIO-01-CHECK-*`

### WRAP-CONS-SCENARIO-02 — Every staging artifact accounted for, no silent drop
**Category:** failure-mode
**Situation:** staging contents must reconcile with the promotion record.
**Good:** staging contents are diff-checked against the promotion record; every staging artifact is accounted for explicitly with no silent drop between staging and memory; each "skipped" staging item states a rationale rather than just being absent.
**Bad / failure:** a staging artifact is dropped with no record, or a skipped item is simply absent with no rationale.
**Adversarial:** a cherry-picked promotion drops an inconvenient staging artifact — the promoted set looks coherent while one staging file was quietly left behind.
**Checklist IDs:** `WRAP-CONS-SCENARIO-02-CHECK-*`

### WRAP-CONS-SCENARIO-03 — Promoted memory syncs with existing memory
**Category:** failure-mode
**Situation:** promoted files may update or contradict existing memory, and the handoff carries internal cross-references.
**Good:** a promoted file that updates or supersedes existing memory carries an explicit `supersedes:` reference; where a new file contradicts an existing one without supersession, the conflict is flagged; internal cross-references in `5-wrap-up/outputs/` ("see Section 3", "per the Ideation working draft") resolve, and forward references match later-section content.
**Bad / failure:** a promoted file contradicts existing memory with no supersession, or an internal cross-reference dangles.
**Adversarial:** a promoted file contradicts an existing memory file without a `supersedes:` link, so both read as authoritative and a future session cannot tell which is current.
**Checklist IDs:** `WRAP-CONS-SCENARIO-03-CHECK-*`

### WRAP-CONS-SCENARIO-04 — Corrections and findings reach memory; closure audit complete
**Category:** coverage-matrix
**Situation:** the session produced user corrections, evaluator findings across iterations, and recurring patterns.
**Good:** every user correction in the session transcript has a corresponding `mistakes/` entry (or an explicit "decided not to record" with reason), and no promoted mistake lacks transcript support; for every loop the session ran, each iteration's findings are enumerated and carry one of five dispositions (addressed / deferred / disputed / superseded / still open, each with its required pointer); low-confidence appendix findings are in the audit; stuck findings escalated mid-session are accounted for; regression findings from a REVISE iteration are tagged; any finding that recurred across iterations becomes a `mistakes/` candidate, and a pattern recurring across loops becomes a `features/{feature-name}/decisions/` or project-level rule candidate.
**Bad / failure:** a user correction has no mistake entry, a finding has no disposition, a low-confidence finding vanishes, or a recurring pattern is never promoted.
**Adversarial:** a low-confidence appendix finding silently disappears from the closure audit — the high-confidence findings all carry dispositions, so the audit looks complete while a real finding was dropped.
**Checklist IDs:** `WRAP-CONS-SCENARIO-04-CHECK-*`

---

## Risk
_Lens (see `evaluation.md`):_ what breaks if the wrap-up is **wrong** — memory pollution, false-positive completion claims, lost work, leaked sensitive data, or unsafe git finalization?

### WRAP-RISK-SCENARIO-01 — No dangling work; scratch preserved as audit trail
**Category:** golden-path
**Situation:** after wrap-up, git state and the session tree must be clean and intact.
**Good:** `git status` after wrap-up shows no uncommitted scratch and no work-in-progress left dangling without a pointer; all session scratch state remains intact under `sessions/{date}-{session-id}/`; Wrap-up did not delete any `sessions/.../{N}-{loop}/` directory (scratch is the audit trail).
**Bad / failure:** uncommitted scratch is left in the tree, or Wrap-up deleted a session directory.
**Adversarial:** Wrap-up "tidies up" by deleting a session scratch directory it already promoted from, so the audit trail is gone while the promotion looks complete.
**Checklist IDs:** `WRAP-RISK-SCENARIO-01-CHECK-*`

### WRAP-RISK-SCENARIO-02 — Promotion does not silently overwrite or contradict existing memory
**Category:** failure-mode
**Situation:** a promotion may overlap existing memory.
**Good:** a promoted file that updates an existing memory file explicitly states what it replaces / supersedes; no promoted file creates ambiguity about which version is authoritative; promoted content is diff-checked against the existing memory it most closely overlaps with, and any conflict lacking explicit supersession is flagged Critical.
**Bad / failure:** a promotion overwrites or contradicts existing memory with no supersession statement, leaving two authoritative-looking versions.
**Adversarial:** a promoted file silently contradicts an existing file it overlaps with — no supersession link — so reviewers and future-self treat both as authoritative.
**Checklist IDs:** `WRAP-RISK-SCENARIO-02-CHECK-*`

### WRAP-RISK-SCENARIO-03 — Every correction and process gap is recorded as a mistake
**Category:** failure-mode
**Situation:** the session produced user corrections, some surfacing workflow / process gaps, and stuck escalations the user resolved.
**Good:** every user correction during the session has a corresponding `mistakes/` entry; corrections that surfaced workflow / process gaps (evaluator missed a category, manager skipped escalation) become mistake candidates; stuck escalations the user resolved (recorded in the discussion log) have their resolution lessoned into memory.
**Bad / failure:** a correction, a process gap, or a resolved escalation ends the session with no mistake entry — the session will hit it again.
**Adversarial:** a workflow / process gap the user corrected is treated as a one-off and never recorded as a mistake, so the same process gap recurs in a later session.
**Checklist IDs:** `WRAP-RISK-SCENARIO-03-CHECK-*`

### WRAP-RISK-SCENARIO-04 — Session cost and sensitive-data exposure recorded
**Category:** coverage-matrix
**Situation:** the session may have consumed paid-API / cloud cost or touched sensitive data.
**Good:** the session's total paid-API / cloud-cost is recorded in the handoff for future-self awareness, and anomalous spend (e.g. 10× expected) is called out; if any session activity touched real PII or sensitive data (e.g. grepping production data), that is recorded; transient sensitive data is not carried into durable memory or a committable surface (logs / `sessions/.../{N}-{loop}/working/`) unless the user explicitly authorized it.
**Bad / failure:** cost is unrecorded, a PII-touching activity is unlogged, or sensitive data is promoted into memory or left in committable scratch with no authorization.
**Adversarial:** sensitive data captured mid-session sits in `sessions/.../working/` (or rides into a promoted file) that the wrap-up commit will absorb, so a private payload ships into committed history unnoticed.
**Checklist IDs:** `WRAP-RISK-SCENARIO-04-CHECK-*`

### WRAP-RISK-SCENARIO-05 — Git finalization is gated and manager-owned
**Category:** failure-mode
**Situation:** Stage-5 git finalization commits the promotions, pushes, opens or reuses the PR, merges, and cleans up the worktree — only after Stage-3 memory validation passes.
**Good:** git finalization runs only after this Stage-3 memory validation returns PASS (the irreversible commit / push / merge / worktree-cleanup is gated behind the evaluation); it is manager-owned — the Wrap-up assistant never pushes, merges, or cleans up the worktree; the finalization commit carries the stage-2 memory promotion writes + the journal, not the gitignored session tree; an already-open PR for the branch is reused rather than duplicated, and an unavailable push / PR is recorded as PR-deferred rather than reported complete.
**Bad / failure:** finalization runs before validation, is performed by the assistant, commits the wrong surface, opens a duplicate PR, or reports a push / PR step complete with no evidence.
**Adversarial:** a duplicate PR or a squash-merge publishes unvalidated memory while the session record still shows Stage 3 had not passed — the irreversible action outran its gate.
**Checklist IDs:** `WRAP-RISK-SCENARIO-05-CHECK-*`
