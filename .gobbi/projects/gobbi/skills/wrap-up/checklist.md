# Wrap-up Loop — Evaluation Checklist

> **Copy-then-tick — this file is the source; the evaluator copies it.** At Stage 0 the evaluator
> COPIES this file to `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{system}/checklist.md`.
> The filled copy is a real **9th evaluation-output file**, alongside the seven per-perspective files
> + `overall.md`. The source here ships with every box UNCHECKED.
>
> **A ticked box = VERIFIED, not "done".** `- [x]` means the evaluator VERIFIED the check against the
> wrap-up handoff + the memory promotions with the strongest verification the check admits (read the
> handoff / diff the staging inventory vs the promotion manifest / `git log` the shipped claims / run
> the frontmatter validator / `grep` a cross-reference / inspect git-finalization evidence) — never
> that work merely happened.
>
> **Fill procedure.** Stage 0: copy (boxes unchecked). Stage 1: append a `## Stage 1 Additions`
> section for any scenario or check the Frame added that is not seeded here. Stage 2: tick each box
> `[x]` and annotate its outcome — `PASS:` (verified satisfied), `FAIL: {finding-id}` (verified
> violated, cite the finding), or `n/a: {reason}` (not applicable to this wrap-up). The completeness
> gate requires every box resolved to exactly one of the three.
>
> **Legend.** `- [ ]` unresolved · `- [x] … PASS:` verified satisfied · `- [x] … FAIL: {finding-id}`
> verified violated · `- [x] … n/a: {reason}` not applicable. Record per-perspective counts
> (PASS / FAIL / n/a / total) in the filled copy's compact per-scenario results table.

The scenario families, their lenses, and the adversarial cases these checks discriminate live in the
sibling `scenario.md`; the evaluation procedure lives in `evaluation.md`. The heading tree below is
1:1 with `scenario.md`.

---

## Project

### WRAP-PROJ-SCENARIO-01 — Right session, every artifact referenced
- [ ] WRAP-PROJ-SCENARIO-01-CHECK-01 — The handoff lists every loop that ran (Ideation / Preparation / Planning / Execution) with its final verdict.
- [ ] WRAP-PROJ-SCENARIO-01-CHECK-02 — Every artifact the session created across those loops is linked from the wrap-up.
- [ ] WRAP-PROJ-SCENARIO-01-CHECK-03 — Every referenced artifact and verdict belongs to this session, not a prior one.

### WRAP-PROJ-SCENARIO-02 — Shipped claims match `git log`, no phantom completion
- [ ] WRAP-PROJ-SCENARIO-02-CHECK-01 — Each "shipped X" claim has a corresponding commit in the session branch's `git log`.
- [ ] WRAP-PROJ-SCENARIO-02-CHECK-02 — Each completion claim is cross-referenced against the actual change-set (diff / commit), not asserted in prose.
- [ ] WRAP-PROJ-SCENARIO-02-CHECK-03 — No "shipped X" claim names an item that was actually deferred (no phantom completion).

### WRAP-PROJ-SCENARIO-03 — Every staging file accounted for; every claim cited
- [ ] WRAP-PROJ-SCENARIO-03-CHECK-01 — Every staging artifact from every promotion source — the workflow-loop `staging/` dirs, each Execution task-dir `staging/`, and (Chat-mode) each per-slice `staging/` — is promoted to memory, explicitly backlogged, or dropped with a stated rationale.
- [ ] WRAP-PROJ-SCENARIO-03-CHECK-02 — An `ls` of every promotion source's `staging/` directory matches the promotion record (no file missing from the record).
- [ ] WRAP-PROJ-SCENARIO-03-CHECK-03 — Every open / deferred item is named with an explicit `next-action:` field — no "we'll get to it" hand-wave.
- [ ] WRAP-PROJ-SCENARIO-03-CHECK-04 — Each substantive claim in the handoff cites its supporting artifact (commit / file path / promotion-manifest entry / session note / discussion record); no hand-wavy uncitable summary.
- [ ] WRAP-PROJ-SCENARIO-03-CHECK-05 — The on-disk staging set reconciles against BOTH the promotion record and the handoff — no staging file appears in neither.

---

## Structure

### WRAP-STRUCT-SCENARIO-01 — Promoted files match the existing memory schema
- [ ] WRAP-STRUCT-SCENARIO-01-CHECK-01 — Every promoted file lives at a path the project's memory schema already defines.
- [ ] WRAP-STRUCT-SCENARIO-01-CHECK-02 — No new memory directory is created outside the documented schema.
- [ ] WRAP-STRUCT-SCENARIO-01-CHECK-03 — Wrap-up promoted into the existing structure without reshaping it (no schema redesign).
- [ ] WRAP-STRUCT-SCENARIO-01-CHECK-04 — Any new field / section / directory shape on a promoted file is flagged for explicit user approval; a schema change is routed to an Ideation loop, not made during Wrap-up.
- [ ] WRAP-STRUCT-SCENARIO-01-CHECK-05 — Promoted file shapes are diff-checked against the existing schema — no new field / section / directory slips in unflagged.
- [ ] WRAP-STRUCT-SCENARIO-01-CHECK-06 — Each by-area destination's resolved `{area}/` segment is an area the destination type's allowlist permits.

### WRAP-STRUCT-SCENARIO-02 — Slugs follow existing naming patterns, no collision
- [ ] WRAP-STRUCT-SCENARIO-02-CHECK-01 — Promoted slugs are kebab-case and concise.
- [ ] WRAP-STRUCT-SCENARIO-02-CHECK-02 — Each promoted slug follows the pattern of adjacent existing files in the same directory.
- [ ] WRAP-STRUCT-SCENARIO-02-CHECK-03 — No promoted slug collides with an existing file; a same-slug collision is disambiguated, not silently overwritten.

### WRAP-STRUCT-SCENARIO-03 — Frontmatter is complete and validates
- [ ] WRAP-STRUCT-SCENARIO-03-CHECK-01 — Every required frontmatter field is present on each promoted file.
- [ ] WRAP-STRUCT-SCENARIO-03-CHECK-02 — Frontmatter validates against the project's memory schema (the validator passes).
- [ ] WRAP-STRUCT-SCENARIO-03-CHECK-03 — No staging-only routing key survives promotion; the no-stray-keys check passes on every promoted file.
- [ ] WRAP-STRUCT-SCENARIO-03-CHECK-04 — Base fields (including `author` and `keywords`) and the destination type's extension fields are retained — the strip removed only staging-only keys, not a legitimate field.

### WRAP-STRUCT-SCENARIO-04 — Routing followed and cross-references resolve
- [ ] WRAP-STRUCT-SCENARIO-04-CHECK-01 — Every staging file landed at its deterministic destination per the routing table (Type + Domain → destination), without improvisation.
- [ ] WRAP-STRUCT-SCENARIO-04-CHECK-02 — No staging file landed at a destination not in the routing table.
- [ ] WRAP-STRUCT-SCENARIO-04-CHECK-03 — Links from promoted files to other memory files resolve.
- [ ] WRAP-STRUCT-SCENARIO-04-CHECK-04 — Every "see X" reference in a promoted file targets an existing path.
- [ ] WRAP-STRUCT-SCENARIO-04-CHECK-05 — Any user-confirmed routing fork (mistake scope / rules / project-wide design / cross-feature reviews / reports / learnings) cites the authorizing user decision.

---

## Performance

### WRAP-PERF-SCENARIO-01 — Each promoted file is bounded and distilled
- [ ] WRAP-PERF-SCENARIO-01-CHECK-01 — Each promoted file's size is bounded (typically 30–200 lines per memory file).
- [ ] WRAP-PERF-SCENARIO-01-CHECK-02 — No raw transcript dump appears in `features/` or `mistakes/` (or any promoted file).
- [ ] WRAP-PERF-SCENARIO-01-CHECK-03 — Each promoted file states its durable decision / rule / mistake / learning / backlog item / report at the top.
- [ ] WRAP-PERF-SCENARIO-01-CHECK-04 — Supporting context is summarized, not transcribed — a bounded-size file whose body is raw narrative is challenged.

### WRAP-PERF-SCENARIO-02 — Total memory delta is proportional; caps respected
- [ ] WRAP-PERF-SCENARIO-02-CHECK-01 — The memory file count after wrap-up matches a reasonable distillation of the session's actual learning.
- [ ] WRAP-PERF-SCENARIO-02-CHECK-02 — No "memory file per scratch thought" pattern (scratch thoughts are not each a file).
- [ ] WRAP-PERF-SCENARIO-02-CHECK-03 — The total word count across promoted files is sanity-checked against the session's scale.
- [ ] WRAP-PERF-SCENARIO-02-CHECK-04 — Any promoted file over the typical size bound is challenged, not accepted by default.
- [ ] WRAP-PERF-SCENARIO-02-CHECK-05 — Stage-2c memory compaction was skipped explicitly when `settings.compaction.enabled` is false, or — when enabled — each over-cap `{type}/{area}/` was consolidated losslessly (sources kept recoverable + archived, inbound references repointed, standing guards green), never summarized away to hit a count.

---

## Aesthetics

### WRAP-AESTH-SCENARIO-01 — Handoff is self-evident and template-conformant
- [ ] WRAP-AESTH-SCENARIO-01-CHECK-01 — `5-wrap-up/outputs/` opens with a one-paragraph summary.
- [ ] WRAP-AESTH-SCENARIO-01-CHECK-02 — All required sections (Summary / Shipped / Deferred / Open / Decisions to respect / Pointers / Promotion summary) are present.
- [ ] WRAP-AESTH-SCENARIO-01-CHECK-03 — Section order matches prior wrap-ups in this project.
- [ ] WRAP-AESTH-SCENARIO-01-CHECK-04 — Date / session-id / branch are stamped at the top of the handoff.
- [ ] WRAP-AESTH-SCENARIO-01-CHECK-05 — Every required section has at least one substantive entry (or an explicit "(none)" with rationale); no "(see above)" points at absent content.

### WRAP-AESTH-SCENARIO-02 — No placeholders; pointers use stable paths
- [ ] WRAP-AESTH-SCENARIO-02-CHECK-01 — No "TODO: write this", `???`, or unfinished sentence remains in the handoff.
- [ ] WRAP-AESTH-SCENARIO-02-CHECK-02 — Every path reference is absolute or repo-root–relative and resolves from any working directory.
- [ ] WRAP-AESTH-SCENARIO-02-CHECK-03 — No `./...` session-relative shortcut path is used.

---

## Usage

### WRAP-USAGE-SCENARIO-01 — Next session resumes without re-deriving context
- [ ] WRAP-USAGE-SCENARIO-01-CHECK-01 — `5-wrap-up/outputs/` plus the promoted memory together contain enough context to resume the work.
- [ ] WRAP-USAGE-SCENARIO-01-CHECK-02 — The wrap-up makes no silent assumption that the next agent recalls the prior session.
- [ ] WRAP-USAGE-SCENARIO-01-CHECK-03 — Simulating next-session start (only CLAUDE.md, the project README, and the wrap-up loaded), every referenced item is in that loaded set — anything outside it is flagged as a gap.

### WRAP-USAGE-SCENARIO-02 — Open items carry runnable next-actions
- [ ] WRAP-USAGE-SCENARIO-02-CHECK-01 — Every open item has a `next-action:` field with a verb + scope.
- [ ] WRAP-USAGE-SCENARIO-02-CHECK-02 — Each next-action is a runnable instruction, not a summary.

### WRAP-USAGE-SCENARIO-03 — Pointers resolve and decisions are constraints
- [ ] WRAP-USAGE-SCENARIO-03-CHECK-01 — Resume-critical pointers use absolute or repo-root–relative durable paths (they resolve, and will keep resolving after worktree cleanup).
- [ ] WRAP-USAGE-SCENARIO-03-CHECK-02 — A session-scratch pointer appears only as audit evidence, never as the sole source needed to continue work.
- [ ] WRAP-USAGE-SCENARIO-03-CHECK-03 — Every "decision to respect" is phrased as a constraint ("X must Y"), not narrative.
- [ ] WRAP-USAGE-SCENARIO-03-CHECK-04 — The constraint format is consistent across all decisions.

---

## Consistency

### WRAP-CONS-SCENARIO-01 — Shipped story matches the session's artifacts 1:1
- [ ] WRAP-CONS-SCENARIO-01-CHECK-01 — Every loop the session ran is referenced in the wrap-up.
- [ ] WRAP-CONS-SCENARIO-01-CHECK-02 — Each loop's stated verdict matches the session's actual evaluation outcomes.
- [ ] WRAP-CONS-SCENARIO-01-CHECK-03 — Open items in the handoff summary match the `next-action:` fields in promoted memory.
- [ ] WRAP-CONS-SCENARIO-01-CHECK-04 — No item is "open" in the summary but "closed" in memory (or vice versa).

### WRAP-CONS-SCENARIO-02 — Every staging artifact accounted for, no silent drop
- [ ] WRAP-CONS-SCENARIO-02-CHECK-01 — Staging contents are diff-checked against the promotion record.
- [ ] WRAP-CONS-SCENARIO-02-CHECK-02 — Every staging artifact is accounted for explicitly (no silent drop between staging and memory).
- [ ] WRAP-CONS-SCENARIO-02-CHECK-03 — Each "skipped" staging item has a stated rationale, not just absence.

### WRAP-CONS-SCENARIO-03 — Promoted memory syncs with existing memory
- [ ] WRAP-CONS-SCENARIO-03-CHECK-01 — Each promoted file that updates or supersedes existing memory carries an explicit `supersedes:` reference.
- [ ] WRAP-CONS-SCENARIO-03-CHECK-02 — Where a new file contradicts an existing one without supersession, the conflict is flagged.
- [ ] WRAP-CONS-SCENARIO-03-CHECK-03 — Internal cross-references in `5-wrap-up/outputs/` resolve.
- [ ] WRAP-CONS-SCENARIO-03-CHECK-04 — Forward references match later-section content.

### WRAP-CONS-SCENARIO-04 — Corrections and findings reach memory; closure audit complete
- [ ] WRAP-CONS-SCENARIO-04-CHECK-01 — Every user correction in the session transcript has a corresponding `mistakes/` entry, or an explicit "decided not to record" with a reason.
- [ ] WRAP-CONS-SCENARIO-04-CHECK-02 — No promoted mistake lacks support in the session transcript.
- [ ] WRAP-CONS-SCENARIO-04-CHECK-03 — For each loop the session ran, every iteration's findings are enumerated.
- [ ] WRAP-CONS-SCENARIO-04-CHECK-04 — Each finding carries one of five dispositions — addressed (commit/diff pointer) / deferred (backlog pointer + reason) / disputed (rationale, optionally promoted as rule) / superseded (by which later finding) / still open (with the reason it survived).
- [ ] WRAP-CONS-SCENARIO-04-CHECK-05 — Low-confidence appendix findings are included in the closure audit.
- [ ] WRAP-CONS-SCENARIO-04-CHECK-06 — Stuck findings escalated to the user mid-session (in the discussion log and the next iter's disposition) are accounted for explicitly.
- [ ] WRAP-CONS-SCENARIO-04-CHECK-07 — Regression findings introduced by a REVISE iteration are tagged in the disposition record.
- [ ] WRAP-CONS-SCENARIO-04-CHECK-08 — Any finding that recurred (stuck) across iterations is promoted as a `mistakes/` candidate.
- [ ] WRAP-CONS-SCENARIO-04-CHECK-09 — A pattern recurring across loops (same symptom in Planning + Execution) is promoted as a `features/{feature-name}/decisions/` or project-level rule candidate.

---

## Risk

### WRAP-RISK-SCENARIO-01 — No dangling work; scratch preserved as audit trail
- [ ] WRAP-RISK-SCENARIO-01-CHECK-01 — `git status` after wrap-up shows no uncommitted scratch and no dangling work-in-progress without a pointer.
- [ ] WRAP-RISK-SCENARIO-01-CHECK-02 — All session scratch state remains intact under `sessions/{date}-{session-id}/`.
- [ ] WRAP-RISK-SCENARIO-01-CHECK-03 — Wrap-up did not delete any `sessions/.../{N}-{loop}/` directory — scratch is preserved as the audit trail.

### WRAP-RISK-SCENARIO-02 — Promotion does not silently overwrite or contradict existing memory
- [ ] WRAP-RISK-SCENARIO-02-CHECK-01 — Each promoted file that updates an existing memory file explicitly states what it replaces / supersedes.
- [ ] WRAP-RISK-SCENARIO-02-CHECK-02 — No promoted file creates ambiguity about which version is authoritative.
- [ ] WRAP-RISK-SCENARIO-02-CHECK-03 — Promoted content is diff-checked against the existing memory it most closely overlaps with.
- [ ] WRAP-RISK-SCENARIO-02-CHECK-04 — Any conflict that lacks explicit supersession is flagged Critical.

### WRAP-RISK-SCENARIO-03 — Every correction and process gap is recorded as a mistake
- [ ] WRAP-RISK-SCENARIO-03-CHECK-01 — Every user correction during the session has a corresponding `mistakes/` entry.
- [ ] WRAP-RISK-SCENARIO-03-CHECK-02 — Corrections that surfaced workflow / process gaps (e.g. evaluator missed a category, manager skipped escalation) became mistake candidates.
- [ ] WRAP-RISK-SCENARIO-03-CHECK-03 — Stuck escalations the user resolved (recorded in the discussion log) have their resolution lessoned into memory.

### WRAP-RISK-SCENARIO-04 — Session cost and sensitive-data exposure recorded
- [ ] WRAP-RISK-SCENARIO-04-CHECK-01 — The session's total paid-API / cloud-cost is recorded in the handoff for future-self awareness.
- [ ] WRAP-RISK-SCENARIO-04-CHECK-02 — Anomalous cost spend (e.g. 10× expected) is called out.
- [ ] WRAP-RISK-SCENARIO-04-CHECK-03 — Any session activity that touched real PII or sensitive data (e.g. grepping production data) is recorded.
- [ ] WRAP-RISK-SCENARIO-04-CHECK-04 — No transient sensitive data rides into a promoted memory file (the surface the wrap-up commit absorbs, e.g. `features/` or `mistakes/`) unless the user explicitly authorized it; sensitive data remaining in the gitignored session tree (`sessions/.../{N}-{loop}/working/`) is noted as session-local exposure, not committed history.

### WRAP-RISK-SCENARIO-05 — Git finalization is gated and manager-owned
- [ ] WRAP-RISK-SCENARIO-05-CHECK-01 — Stage-5 git finalization did not run before this Stage-3 memory validation returned PASS (the irreversible commit / push / merge / worktree-cleanup is gated behind the evaluation).
- [ ] WRAP-RISK-SCENARIO-05-CHECK-02 — Git finalization is manager-owned; the Wrap-up assistant did not push, merge, or clean up the worktree.
- [ ] WRAP-RISK-SCENARIO-05-CHECK-03 — When a finalization commit exists, it carries the stage-2 memory promotion writes and the journal, not the gitignored session tree.
- [ ] WRAP-RISK-SCENARIO-05-CHECK-04 — An already-open PR for the branch is reused rather than duplicated; if push or PR creation is unavailable, the PR-deferred state is recorded rather than reported complete.
