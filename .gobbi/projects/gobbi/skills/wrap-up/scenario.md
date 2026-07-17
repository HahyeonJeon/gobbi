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
Wrap-up made** — the evaluated destination set is DERIVED from the frozen promotion manifest
(`sessions/{date}-{session-id}/5-wrap-up/working/promotion-manifest.md`), not from a copied directory
list: every source-accounting row with a mapped destination and every mutation row (move source +
destination, archive target, inbound-reference carrier, feature-index update, lifecycle flip, the journal
row), plus — when the compaction sub-procedure produced a merge manifest — every path that manifest names.
That set is cross-checked against the pre/post filesystem snapshot and the applied-delta report. The
evaluation also covers the staging inventory, the per-session journal entry, the compaction sub-procedure's
memory-compaction writes when enabled, and the Stage-5 git-finalization evidence when it exists. This
evaluation **IS pipeline stage 3 — memory validation**; its verdict gates the irreversible stage 5 (git
finalization). Wrap-up is a **consolidation loop** — the artifact is a handoff + promotions, not code —
so every family below judges **consolidation quality**: did the session's work get promoted completely and
correctly, does promoted memory slot into the existing schema, does the handoff match `git log`, can the
next session resume from it, and did the irreversible git action happen only after validation. Each family
carries a `### {ID}` heading, a **Category**, the **Situation** it arises in, the **Good** outcome, the
**Bad / failure** outcome, one **Adversarial** case a real evaluator would probe, and the **Checklist IDs**
whose joint satisfaction proves the scenario handled. Scenario IDs follow `WRAP-{PERSPECTIVE}-SCENARIO-{NN}`;
each check follows `{scenario-id}-CHECK-{NN}` and lives in `checklist.md`.

**The design bad-scenarios S-1..S-16 are embedded here**, each under ONE perspective family, tagged
`[S-N]` in its heading, each citing a verified mistake it guards against. They preserve the 1:1
scenario↔checklist mirror.

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
**Good:** every staging artifact from every promotion source — the workflow-loop `staging/` dirs, each Execution task-dir `staging/`, and (Chat-mode sessions) each per-slice `staging/` — is promoted to memory, explicitly backlogged, or dropped with a stated rationale; an `ls` of each source's `staging/` matches the promotion record; every open / deferred item carries an explicit `next-action:` field with no "we'll get to it" hand-wave; each substantive claim cites its supporting artifact (commit / file path / promotion-manifest entry / session note / discussion record).
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

### WRAP-STRUCT-SCENARIO-05 — [S-1] Strip removes a required destination field
**Category:** failure-mode
**Situation:** promotion strips staging-only routing fields while rendering a durable destination record.
**Good:** the renderer derives the durable base + destination-type extension allowlist from the memory-schema owner and strips ONLY staging-only keys; the final frontmatter is validated against the destination type's REQUIRED-extension list (and required base set) before the manifest freeze — every mandatory field survives or is deterministically stamped (e.g. a mistakes file keeps `priority` + `domain`; a backlogs file keeps `priority` + `project-scope`).
**Bad / failure:** the strip is derived from the strip table alone and drops a field that is required by the destination type but absent from the strip table (e.g. `domain` on a mistakes file), so the promoted file fails the non-skippable Stage-3 validator.
**Adversarial:** a strip table says to remove a field and the implementer follows it without checking the destination-required set, producing a clean-looking record that fails the destination validator only after the strip.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-05-CHECK-*`
**Mistake cited:** `skills/wrap-up/mistakes.md` § Strip Contract Dropped Required Extension Field

### WRAP-STRUCT-SCENARIO-06 — [S-2] Standing guards only partially re-run over the post-promotion tree
**Category:** failure-mode
**Situation:** promotion and any compaction writes have changed the project tree; the Stage-3 gate re-runs the standing guards AFTER promotion.
**Good:** EVERY standing project guard runs over the POST-promotion tree — `validate-frontmatter.sh`, `check-markdown-links.sh`, `check-residual-vocab.sh`, `check-skill-mistakes.sh --all`, `check-workflow-mirror-consistency.sh` — each with its command + exit status recorded and all exit 0; the merge-integrity guard (`check-merge-ref-integrity.sh`) runs additionally ONLY when the compaction sub-procedure produced a merge manifest; where a promotion adds a legitimate new carrier a guard flags, the guard's allowlist is extended by its own discipline in the same commit.
**Bad / failure:** only the frontmatter validator is re-run, a guard result comes from the pre-promotion tree, or the merge-integrity guard is treated as a substitute for an always-run guard — so a regression ships behind a PASS.
**Adversarial:** promoted prose creates a legitimate new residual-vocabulary carrier; the allowlist was green before promotion, but no post-promotion content-guard run detects the new carrier — caught only by a manual pre-commit re-run AFTER the dual-system gate already passed.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-06-CHECK-*`
**Mistake cited:** `skills/wrap-up/mistakes.md` § Wrap Up Green Check Must Rerun Standing Guards Post Promotion

### WRAP-STRUCT-SCENARIO-07 — [S-4] A plausible-but-invalid area is accepted instead of escalating
**Category:** failure-mode
**Situation:** a by-area destination has no valid first match in the destination type's area vocabulary.
**Good:** the resolved `{area}/` segment is an area the destination type's allowlist permits; when the contract resolves NO valid area, the manifest records the attempted resolution and the promotion returns `NEEDS_CONTEXT` — the manager obtains a user decision before a new or changed area is authorized; no fallback area is silently selected.
**Bad / failure:** a plausible-sounding but non-allowlisted area (or a generic catch-all area) is accepted, so the file lands at an area the type's allowlist does not permit.
**Adversarial:** the proposed area name looks semantically correct and the path resolves on disk, but the destination type's allowlist rejects it — a mere path-existence check misses the schema violation.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-07-CHECK-*`
**Mistake cited:** `mistakes/verification/offered-memory-home-without-verifying-type-schema.md`; `../memory/rules.md` § 1.5

### WRAP-STRUCT-SCENARIO-08 — [S-7] A `skills/` promotion carries an `{area}/` segment
**Category:** failure-mode
**Situation:** a `skills/` destination is promoted or verified — a Preparation-generated `skills/{skill}/SKILL.md`, or a skill-owned trap appended to `skills/{skill}/mistakes.md`.
**Good:** `skills/` is NOT by-area — the only destination shapes are `skills/{skill}/SKILL.md` and `skills/{skill}/mistakes.md`, with NO `{area}/` segment; a Preparation-generated skill is normally recorded as already-promoted and is recovered only when the Preparation contract permits it; the by-area `{area}/` layout applies only to the project / feature memory types.
**Bad / failure:** a `skills/` destination is rendered as `skills/{area}/{skill}/...` (or otherwise treated as a by-area memory type), inventing an area segment the skill surface does not use.
**Adversarial:** a generic "every type receives `{area}/`" helper inserts an area into the skill path, and the file still exists at a plausible path that no runtime loads.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-08-CHECK-*`
**Mistake cited:** the non-by-area `skills/` contract in `skills/wrap-up/promotion.md` § Staging → Memory routing; `skills/mistake/SKILL.md` § Memory Access Matrix

### WRAP-STRUCT-SCENARIO-09 — [S-10] A re-run creates suffixed duplicates
**Category:** failure-mode
**Situation:** the promotion is re-run over the SAME immutable source inventory (e.g. after an interrupted Stage 2).
**Good:** idempotency is keyed on stable SOURCE identity `{session-id, source-relative-path}` plus the frozen manifest mapping; a re-run over the identical inventory resolves every source to the same target and — when the candidate bytes are equal — is a no-op; no `-2` / `-3` numeric or loop suffix is allocated.
**Bad / failure:** the re-run keys on a field that did not survive the strip (or re-derives the slug / recomputes collision order), so it cannot recognize the prior write and creates a suffixed duplicate — or overwrites a distinct source.
**Adversarial:** the first run strips `finding-id`; the second run then treats the same source as new and creates `slug-2.md`, even though the source bytes and the original manifest are unchanged.
**Checklist IDs:** `WRAP-STRUCT-SCENARIO-09-CHECK-*`
**Mistake cited:** `../memory/rules.md` § 2.6 (staging-field strip); the collision-and-idempotency policy in `skills/wrap-up/promotion.md`

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
**Situation:** the session produced a set of promotions, and the compaction sub-procedure runs after promotion.
**Good:** the memory file count after wrap-up matches a reasonable distillation of the session's actual learning; there is no "memory file per scratch thought" pattern; the total word count across promoted files is sanity-checked against the session's scale; any file over the typical bound is challenged; the compaction sub-procedure always counts every `{type}/{area}/` post-promotion (independent of `settings.compaction.enabled`, which gates only automatic merging), routes an over-hard-cap area to an Always-Ask decision, and — when a merge runs — consolidates losslessly (sources kept recoverable + archived, inbound references repointed, standing guards green) rather than summarizing away to hit a count.
**Bad / failure:** the session spawns one memory file per scratch thought, a bloated file passes because each section "looks fine" in isolation, or an enabled compaction summarizes away source detail to hit a count.
**Adversarial:** each promoted file looks fine alone, but the total memory delta far exceeds the session's actual learning — the bloat is visible only in aggregate, never per-file.
**Checklist IDs:** `WRAP-PERF-SCENARIO-02-CHECK-*`

### WRAP-PERF-SCENARIO-03 — [S-12] Compaction silently skips an over-hard-cap area
**Category:** adversarial
**Situation:** a `{type}/{area}/` count exceeds its hard cap after promotion (e.g. `mistakes/verification/` = 44 against a hard cap of 15).
**Good:** the compaction sub-procedure counts EVERY `{type}/{area}/` post-promotion whether or not `settings.compaction.enabled` is set; an over-hard-cap area CANNOT reach PASS silently — it is routed to an Always-Ask decision (merge / raise cap / archive-terminal / accept-with-acknowledgement), and `mistakes` and `rules` merges stay Always-Ask; disabling automatic merge, exhausting the action budget, or crossing a soft cap does not bypass hard-cap detection.
**Bad / failure:** the count is gated behind `settings.compaction.enabled`, so with the flag off an over-hard-cap area is never counted and slides through with a silent PASS.
**Adversarial:** `settings.compaction.enabled` is false and the implementation treats that as permission not to count, allowing a 44-record area to pass a hard cap of 15 without surfacing it.
**Checklist IDs:** `WRAP-PERF-SCENARIO-03-CHECK-*`
**Mistake cited:** `../memory/rules.md` § 5; live count 44 vs hard cap 15

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

### WRAP-AESTH-SCENARIO-02 — No placeholders; pointers use durable repo-root-relative paths
**Category:** failure-mode
**Situation:** the handoff carries prose and path pointers.
**Good:** no "TODO: write this", `???`, or unfinished sentence remains; every durable path reference is repo-root–relative (e.g. `.gobbi/projects/{name}/...`) — NOT an absolute worktree path, which is temporary and breaks after the worktree is cleaned up — and resolves from the repo root; no `./...` session-relative shortcut is used.
**Bad / failure:** a placeholder or unfinished sentence ships, a pointer uses an absolute worktree path that dies at worktree cleanup, or a pointer uses a cwd-relative `./...` path that breaks when read elsewhere.
**Adversarial:** a pointer reads cleanly but is an absolute worktree path (or a `./`-relative path) that resolves only from this session's worktree, so the next session opening it from the repo root — after cleanup — hits a dead path.
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
**Good:** resume-critical pointers use repo-root–relative durable paths (NOT absolute worktree paths, which break after worktree cleanup) and will keep resolving after the worktree is removed; a session-scratch pointer appears only as audit evidence, never as the sole source needed to continue work; every "decision to respect" is phrased as a constraint ("X must Y", not "we discussed X"); the constraint format is consistent across all decisions.
**Bad / failure:** continuation depends on a private session-scratch pointer or an absolute worktree path, or a "decision to respect" is narrative rather than a constraint.
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
**Good:** every user correction in the session transcript has exactly ONE explicit accounting result — a corresponding promoted `mistakes/` entry, OR a staged mistake awaiting the user-confirmed route, OR a recorded user decision declining promotion with a reason — and no promoted mistake lacks transcript support (never a silent disappearance, never a forced promotion after the user declined); for every loop the session ran, each iteration's findings are enumerated and carry one of five dispositions (addressed / deferred / disputed / superseded / still open, each with its required pointer); low-confidence appendix findings are in the audit; stuck findings escalated mid-session are accounted for; regression findings from a REVISE iteration are tagged; any finding that recurred across iterations becomes a `mistakes/` candidate, and a pattern recurring across loops becomes a `features/{feature-name}/decisions/` or project-level rule candidate.
**Bad / failure:** a user correction has no accounting result (neither promoted, staged-awaiting-route, nor explicitly declined-with-reason), a finding has no disposition, a low-confidence finding vanishes, or a recurring pattern is never promoted.
**Adversarial:** a low-confidence appendix finding silently disappears from the closure audit — the high-confidence findings all carry dispositions, so the audit looks complete while a real finding was dropped.
**Checklist IDs:** `WRAP-CONS-SCENARIO-04-CHECK-*`

### WRAP-CONS-SCENARIO-05 — [S-5] A terminal record is deleted instead of archived
**Category:** failure-mode
**Situation:** a record becomes superseded, retired, dropped, or merged during promotion or compaction.
**Good:** the complete terminal record is MOVED (`git mv`) to `archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md`, retaining its original type + content — never hard-deleted or reduced to a tombstone; its `status:` is flipped and its supersession pointer set before the move; inbound path references are repointed; memory stays an append-only auditable history.
**Bad / failure:** a superseded or merged record is hard-deleted, reduced to a tombstone, or moved to an untyped archive path, leaving a vacuum a future reader cannot recover.
**Adversarial:** the new record and reciprocal lifecycle fields look correct, but the old record was removed instead of moved, so its evidence — the audit trail of WHY it changed — cannot be recovered.
**Checklist IDs:** `WRAP-CONS-SCENARIO-05-CHECK-*`
**Mistake cited:** `skills/mistake/SKILL.md` § Delete semantics; `../memory/rules.md` §§ 2.4, 5

### WRAP-CONS-SCENARIO-06 — [S-6] Already-promoted `startup/` data is promoted again
**Category:** failure-mode
**Situation:** the session includes a `startup/` surface, which self-promotes at startup-close — the entire `startup/` tree is EXCLUDED from Wrap-up's promotion inventory.
**Good:** Wrap-up excludes the whole `startup/` tree from its source inventory, verifies the existing startup destinations from startup's summary, and records ZERO manifest rows for `startup/` — it never re-promotes a `startup/` record.
**Bad / failure:** Wrap-up treats `startup/staging/` as an ordinary promotion source and re-promotes records startup-close already wrote, creating duplicates.
**Adversarial:** a generic recursive search for every directory named `staging` includes `startup/`, and the re-run creates a suffixed duplicate that appears legitimate.
**Checklist IDs:** `WRAP-CONS-SCENARIO-06-CHECK-*`
**Mistake cited:** `../record/record-map.md` § Wrap-up promotion-inventory rule (`startup/` excluded); the named exclusion in `skills/wrap-up/promotion.md` § Stage boundary and source contract

### WRAP-CONS-SCENARIO-07 — [S-11] Supersession links only one direction
**Category:** failure-mode
**Situation:** a new promoted record supersedes an existing active record.
**Good:** supersession is RECIPROCAL — the new record names the old slug via `supersedes: <old>` AND the old record is flipped `status: superseded` + `superseded_by: <new>`; the old record then moves to the typed archive; every inbound path reference is repointed as one manifest-planned mutation set.
**Bad / failure:** only one lifecycle direction is written — the new file names the old but the old is never flipped (or the reverse) — the old record stays active, or path references still point to its former location.
**Adversarial:** the new record's `supersedes` field is correct, so a one-file inspection passes, but the old record lacks `superseded_by` and remains authoritative — a future session loading the old one cannot tell it was replaced.
**Checklist IDs:** `WRAP-CONS-SCENARIO-07-CHECK-*`
**Mistake cited:** `../memory/rules.md` §§ 2.4, 5 (reciprocal supersession + archive-on-terminal)

---

## Risk
_Lens (see `evaluation.md`):_ what breaks if the wrap-up is **wrong** — memory pollution, false-positive completion claims, lost work, leaked sensitive data, or unsafe git finalization?

### WRAP-RISK-SCENARIO-01 — No dangling work; scratch preserved as audit trail
**Category:** golden-path
**Situation:** after wrap-up, the tracked promotion surface must be clean and the gitignored session tree intact.
**Good:** the TRACKED promotion surface is clean (a `git status` scoped to the tracked tree shows no uncommitted promotion scratch and no work-in-progress left dangling without a durable pointer); a filesystem enumeration + per-file hashes (`find sessions/{date}-{session-id}/ -type f`) confirms all session scratch state remains intact under `sessions/{date}-{session-id}/` — `git status` is NOT used as proof of the gitignored session tree's contents, because git is blind to gitignored paths; Wrap-up did not delete any `sessions/.../{N}-{loop}/` directory (scratch is the audit trail).
**Bad / failure:** uncommitted promotion scratch is left in the tracked tree, Wrap-up deleted a session directory, or `git status` is treated as proof the gitignored session tree is intact.
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
**Good:** every user correction during the session has exactly ONE explicit accounting result — a promoted `mistakes/` entry, a staged mistake awaiting the user-confirmed route, OR a recorded user decision declining promotion with a reason; corrections that surfaced workflow / process gaps (evaluator missed a category, manager skipped escalation) become mistake candidates; stuck escalations the user resolved (recorded in the discussion log) have their resolution lessoned into memory.
**Bad / failure:** a correction, a process gap, or a resolved escalation ends the session with NO accounting result (neither recorded, staged-awaiting-route, nor explicitly declined-with-reason) — the session will hit it again.
**Adversarial:** a workflow / process gap the user corrected is treated as a one-off and never recorded as a mistake, so the same process gap recurs in a later session.
**Checklist IDs:** `WRAP-RISK-SCENARIO-03-CHECK-*`

### WRAP-RISK-SCENARIO-04 — Sensitive data does not ride into promoted memory
**Category:** coverage-matrix
**Situation:** the session may have touched sensitive data (e.g. grepping production data, handling real PII).
**Good:** any session activity that touched real PII or sensitive data is recorded as session-local exposure; transient sensitive data is NOT carried into a promoted, tracked memory file — the surface the wrap-up commit absorbs (`features/` or `mistakes/`) — unless the user explicitly authorized it; sensitive data left in the gitignored session tree is noted as session-local exposure, not committed history.
**Bad / failure:** a PII-touching activity is unlogged, or sensitive data rides into a promoted memory file with no authorization.
**Adversarial:** sensitive data captured mid-session rides into a promoted memory file (`features/` or `mistakes/`) that the wrap-up commit absorbs, so a private payload ships into committed history unnoticed — whereas the same data left under the gitignored `sessions/.../{N}-{loop}/working/` is session-local exposure the commit never touches.
**Checklist IDs:** `WRAP-RISK-SCENARIO-04-CHECK-*`

### WRAP-RISK-SCENARIO-05 — Git finalization is gated and manager-owned
**Category:** failure-mode
**Situation:** Stage-5 git finalization commits the promotions, pushes, opens or reuses the PR, merges, and cleans up the worktree — and runs ONLY AFTER Stage-3 memory validation passes. Stage-3 gates it; Stage-3 runs before it.
**Good:** at Stage-3, no Stage-5 finalization commit / push / merge / worktree-cleanup has run yet on the branch (the irreversible action is still gated behind this evaluation); finalization is manager-owned — the Wrap-up assistant never pushes, merges, or cleans up the worktree; the manager's finalization PLAN commits the Stage-2 promotion writes + the journal and excludes the gitignored session tree, and Stage-3 may verify that the plan WILL reuse an open PR or record a PR-deferred state — but it never claims a commit, push, PR, merge, or cleanup succeeded. Each Stage-5 action verifies its own postconditions after Stage-3 PASS.
**Bad / failure:** a finalization commit / push / merge already ran before Stage-3 PASS, the assistant performed finalization, or Stage-3 certifies an executed git outcome (commit contents, PR reuse, push success) that cannot exist until Stage-5 runs.
**Adversarial:** a duplicate PR or a squash-merge publishes unvalidated memory while the session record still shows Stage 3 had not passed — the irreversible action outran its gate.
**Checklist IDs:** `WRAP-RISK-SCENARIO-05-CHECK-*`

### WRAP-RISK-SCENARIO-06 — [S-3] A wrong-tree / wrong-inode promotion write
**Category:** failure-mode
**Situation:** promotion writes durable memory into the project tree while the session operates in a linked worktree, where the same relative path exists in BOTH the main checkout and the worktree.
**Good:** every promoted absolute path resolves through the session's canonical worktree root (`session.json.git.worktreePath`) and literally contains the `worktrees/{branch}/` segment; live path + inode checks prove no write landed in the main checkout.
**Bad / failure:** a relative path, a reset current directory, or a mistyped absolute path omits the `worktrees/{branch}/` prefix and writes to the main checkout (on the base branch) — the write "succeeds" because the same relative path is a valid file there, so nothing errors.
**Adversarial:** the main checkout and worktree have identical preimages, so a content diff looks correct while the write changed the wrong inode — caught only when a worktree-scoped check still shows the pre-edit content.
**Checklist IDs:** `WRAP-RISK-SCENARIO-06-CHECK-*`
**Mistake cited:** `skills/git/mistakes.md` § Executor Edited Main Tree Not Worktree Copy · § Manager Edited Main Checkout Not The Session Worktree · § Codex Subagent Apply Patch Wrong Tree

### WRAP-RISK-SCENARIO-07 — [S-8] A staging-only field survives promotion
**Category:** failure-mode
**Situation:** a staged finding carries routing, evaluator, and staging-provenance fields; promotion strips them and stamps the destination-type base fields.
**Good:** the rendered durable record contains only the allowed durable base fields (including `author` + `keywords`, preserved or freshly stamped), the destination-type extensions, and sanctioned lifecycle links; every staging-only key (`mistake-candidate`, `finding-id`, `area`, …) is absent — the no-stray-keys validator passes.
**Bad / failure:** a staging-only routing / evaluator key survives into tracked memory, or the strip wrongly removes `author` or `keywords`.
**Adversarial:** the record passes a required-field presence check but still leaks an evaluator routing key that the no-stray-keys validator should reject.
**Checklist IDs:** `WRAP-RISK-SCENARIO-07-CHECK-*`
**Mistake cited:** `../memory/rules.md` § 2.6 (staging-only fields stripped on promotion; `author` + `keywords` stamped); `mistakes/docs-sync/promotion-writer-leaks-content-wrapper-tag.md`

### WRAP-RISK-SCENARIO-08 — [S-9] One malformed source causes a partial promotion
**Category:** adversarial
**Situation:** one source, route, candidate, preimage, or mutation row is invalid during the whole-batch preflight.
**Good:** Stage 1 renders and validates the COMPLETE source set, candidate set, mutation set, and every destination preimage (including whole-file preimages for shared destinations) BEFORE the first durable-memory write; one invalid item halts with its exact path + reason and durable memory remains at the captured preimage state; Stage 2 rechecks preimages before applying the frozen manifest.
**Bad / failure:** valid prefix rows are written before the malformed row is discovered, leaving a partial promotion with no clean recovery.
**Adversarial:** the final source is malformed after twenty valid sources; an incremental writer has already published the first twenty before it reports failure.
**Checklist IDs:** `WRAP-RISK-SCENARIO-08-CHECK-*`
**Mistake cited:** `mistakes/assumption/reuse-target-must-be-invocable-at-needed-granularity.md`; `mistakes/assumption/validity-signal-must-be-written-after-its-validation-gate.md`

### WRAP-RISK-SCENARIO-09 — [S-13] The evaluation gate evaluates a moving target
**Category:** failure-mode
**Situation:** the producer completes the promotion evidence and the manager dispatches the two Stage-3 evaluators.
**Good:** producer completion precedes dispatch (terminal output confirmed on disk); the exact manifest, output, snapshot, applied delta, guard results, and derived target-set hashes are pinned in the eval brief, and those inputs remain identical through both evaluations.
**Bad / failure:** the producer or a queued follow-up changes any evaluated input after evaluator dispatch, so an in-flight write changes the target mid-evaluation.
**Adversarial:** one evaluator reads before a late producer write and the other reads after it; both reports are internally sound but evaluate different artifacts.
**Checklist IDs:** `WRAP-RISK-SCENARIO-09-CHECK-*`
**Mistake cited:** `mistakes/assumption/evaluator-spawn-without-producer-done-handshake.md`; `skills/evaluation/mistakes.md` § Freeze Producer Artifact Before Evaluating; D13 (non-skippable gate)

### WRAP-RISK-SCENARIO-10 — [S-14] Stage-3 claims Stage-5 succeeded
**Category:** adversarial
**Situation:** Stage-3 evaluates the promotion before the manager may run git finalization; it is tempted to verify Stage-5 postconditions.
**Good:** Stage-3 verifies ONLY that no premature finalization ran and that a valid manager-owned finalization plan exists; it labels commit / push / PR / merge / worktree-cleanup postconditions as PENDING and asserts no executed git outcome. Stage-5 verifies those postconditions — including open-PR reuse and PR-deferred reporting — itself after PASS.
**Bad / failure:** the Stage-3 report says Stage-5 succeeded, marks a planned action (e.g. "PR reused") PASS from the plan alone, or requires finalization evidence that cannot yet exist — turning a future action into a false present-tense fact.
**Adversarial:** a checklist marks "pull request reused" PASS from the plan alone, so a future action reads as a completed fact one stage before it can be true.
**Checklist IDs:** `WRAP-RISK-SCENARIO-10-CHECK-*`
**Mistake cited:** `mistakes/docs-sync/split-added-content-must-match-skill-and-runtime-facts.md`; the E10 Stage-3/Stage-5 boundary; sibling WRAP-RISK-SCENARIO-05

### WRAP-RISK-SCENARIO-11 — [S-15] Session scratch deleted, or git used as proof of the gitignored tree
**Category:** failure-mode
**Situation:** Wrap-up finishes promotion while the gitignored session record remains the audit trail.
**Good:** direct filesystem enumeration + per-file hashes prove every prior session path still exists with unchanged source evidence; any authorized non-standard scratch cleanup is narrowly accounted; no session loop directory is deleted; `git status` is NOT used as proof — it is blind to the gitignored session tree and would report it "clean / unchanged" whatever its real contents.
**Bad / failure:** a session scratch directory is deleted, or a clean `git status` is cited as proof that the gitignored tree is intact.
**Adversarial:** the complete `sessions/.../4-execution/` directory is removed; `git status` stays clean because the tree is ignored, and a proxy-only check reports PASS.
**Checklist IDs:** `WRAP-RISK-SCENARIO-11-CHECK-*`
**Mistake cited:** `mistakes/verification/git-gate-blind-to-gitignored-writes.md`; sibling WRAP-RISK-SCENARIO-01

### WRAP-RISK-SCENARIO-12 — [S-16] Prior-loop staging bytes change during Stage-1
**Category:** adversarial
**Situation:** the Stage-1 compliance scan finds mechanically repairable defects in prior-loop `staging/` files while rendering promotion candidates.
**Good:** every prior-loop `staging/` file is hashed / stat-recorded BEFORE and AFTER Stage-1 and its path + bytes + timestamps are UNCHANGED; any mechanical repair exists ONLY as a correction overlay under `sessions/{date}-{session-id}/5-wrap-up/working/correction-overlays/` and in the rendered destination candidate — never in the prior-loop source; the manifest records the source hash + normalization delta + rendered candidate; a judgment-required repair escalates via `NEEDS_CONTEXT`.
**Bad / failure:** Stage-1 normalizes, renames, appends to, or replaces an authoritative prior-loop staging source in place — mutating the read-only evidence the promotion is verified against.
**Adversarial:** the validator fixes malformed frontmatter in place and then passes its own second read, erasing the evidence that the source was malformed. (Distinct from S-9, which checks manifest-preflight atomicity; S-16 checks the prior-loop SOURCE bytes are unchanged.)
**Checklist IDs:** `WRAP-RISK-SCENARIO-12-CHECK-*`
**Mistake cited:** `mistakes/verification/session-json-clobber-during-record-upsert.md` (preserve-authoritative-input); the immutable-source contract in `skills/wrap-up/promotion.md` § Stage boundary and source contract; the B-E1 read-only-matrix vs Step-2.5 contradiction
