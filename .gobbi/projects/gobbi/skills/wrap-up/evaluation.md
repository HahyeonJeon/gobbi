# Wrap-up Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `wrap-up`. Provides the per-perspective evaluation **procedure** for a Wrap-up Loop's session consolidation: each perspective's **lens**, its **recommended verifications**, and its **perspective-specific anti-patterns**, plus the **Overall (Stage 3)** anchors. The concrete GOOD / BAD / adversarial **scenario families** live in the sibling `scenario.md`, and their yes/no **checks** live in the sibling `checklist.md` (whose heading tree mirrors `scenario.md`); each perspective below points to its section in both.

The artifact under evaluation is the Wrap-up loop's working handoff draft at `sessions/{date}-{session-id}/4-wrap-up/working/handoff-draft.md` **plus** the full set of memory promotions Wrap-up made. Stage 4 has not yet sealed the draft to the PASS-only `outputs/handoff.md` when this gate runs.

**Derive the evaluated destination set from the frozen promotion manifest — not from a copied directory list.** Follow this procedure at Stage 0:

1. Require the frozen `sessions/{date}-{session-id}/4-wrap-up/working/promotion-manifest.md`, its recorded hash, the pre-Wrap-up filesystem/hash snapshot (`working/pre-wrap-up-snapshot.txt`), the applied-delta report, and the post-promotion guard results.
2. Build the evaluated destination set from the manifest, not prose. Include every mapped destination from source-accounting rows — including no-op / already-promoted destinations that still require verification — and every target from mutation rows: a move contributes both its source and destination; a repoint contributes the reference carrier; a shared-file append contributes the whole shared file; a directory, feature-index update, lifecycle flip, archive target, and the journal row each contribute their actual path.
3. When the compaction sub-procedure produced a merge manifest, union every source, consolidated destination, archive destination, and inbound-reference carrier that manifest names into the evaluated set.
4. Compare that derived set against the pre/post filesystem snapshot and the applied-delta report: a changed path with no manifest row is a failure; a manifest mutation with no resulting path/state is a failure.
5. Record the derived set and the manifest hash in every evaluator's Memory-reads register so both systems evaluate the same frozen target.

Wrap-up promotion targets span the entire memory surface (feature-scoped `features/{feature-name}/{scenarios,checklists,decisions,references,design,discussions,backlogs,plans,mistakes}/` + `README.md`; project-scoped `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, and the other project-tier types), so no destination is out of scope by assumption — but the SET to verify is read from the manifest, then cross-checked against the on-disk promotion delta, never re-enumerated from memory. A copied hand-list of memory directories is not an evaluation-target authority.

The promotion is part of the wrap-up artifact — evaluation must verify it across every destination the manifest names, not assume it.

**This evaluation IS pipeline stage 3 — memory validation.** In the wrap-up pipeline (see [`wrap-up/SKILL.md` § Loop and pipeline map](SKILL.md#loop-and-pipeline-map)), the Wrap-up loop's dual-system EVALUATION and stage-3 memory validation are the same gate (D11). The Stage-2 Promotion is the artifact under evaluation here; this evaluation validates it. The verdict gates the irreversible **stage 5 — git finalization** (commit / push / merge / worktree cleanup): only a stage-3 `PASS` lets git run. `REVISE` returns to Stage 1; `FAIL` escalates to the user. Neither lets git run.

Wrap-up evaluation is **non-skippable** (D13). No `evaluate.mode: skip` setting — and no other settings path — can remove it. A wrap-up that consolidates incorrectly poisons every future session. The cost of catching a bad wrap-up is paid once; the cost of missing it compounds. Because stage 3 always gates the irreversible git stage 5, skipping it is never permitted. The scenario families in `scenario.md` already include adversarial cases (phantom completion claims, silent supersession, missed mistakes, premature finalization, a certified Stage-5 phantom, mutated prior-loop evidence) so Stage 2 walks each Frame once without a separate adversarial pass.

---

## Project

**Lens**: Does the wrap-up consolidate **the right session's work**, completely, without inventing claims?

**Scenario source:** `scenario.md` § Project (`WRAP-PROJ-SCENARIO-*`)
**Checklist source:** `checklist.md` § Project (`WRAP-PROJ-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `git log` of the session's branch | Compare against every "what was shipped" claim |
| Recursive filesystem enumeration of every expected prior-loop, Execution-task, and Chat-slice `staging/` source — `ls -la sessions/{date}-{session-id}/{N}-{loop}/staging/` for every loop (in Chat mode also each `chat/tasks/*/{N}-{loop}/staging/`); the `startup/` surface is EXCLUDED — startup self-promotes | Confirm each staging artifact was promoted, backlogged, or dropped-with-rationale; reconcile against the manifest's source-accounting rows |
| `git diff` for new files under `features/{feature-name}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/` | Verify promotion actually happened across all project-tier destinations |
| `find .gobbi/projects/{project-name}/` (pre-Wrap-up vs post-Wrap-up) reconciled to the frozen manifest | Identify exactly what was promoted at each destination — the manifest-derived destination set replaces (does not narrow) a copied `git diff` destination list |
| Applied-delta reconciliation: every changed destination is a manifest row and every planned mutation actually happened | Detect an off-manifest write or a planned mutation that never landed |
| Read the frozen promotion manifest (`4-wrap-up/working/promotion-manifest.md`) and take its row set as the destination set | Verify the evaluated destinations come from the manifest, not a copied list |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up that claims completion of deferred items** | Verify each claim against the actual change-set. A "shipped" claim with no commit is a phantom |
| **Wrap-up that ignores Ideation/Planning outputs** | If Ideation produced staging artifacts but the wrap-up doesn't reference them, the consolidation is incomplete |
| **Project-tier writes outside features/ + mistakes/ unverified** | `rules/`, `design/`, `notes/`, `backlogs/` promotions are equally part of Wrap-up's scope. Audit every destination the manifest names |
| **A copied directory list as the evaluation target** | Derive the destination set from the frozen manifest; a hand-copied list drifts from what Wrap-up actually wrote |

---

## Structure

**Lens**: Is the **promoted memory** well-structured? Does it slot into existing memory without breaking conventions?

**Scenario source:** `scenario.md` § Structure (`WRAP-STRUCT-SCENARIO-*`)
**Checklist source:** `checklist.md` § Structure (`WRAP-STRUCT-SCENARIO-*-CHECK-*`)

**Staging → memory routing (deterministic; Wrap-up MUST follow).** See [`wrap-up/promotion.md` § Staging → Memory routing](promotion.md#staging--memory-routing) for the authoritative routing table and the §1.5 area-resolution rule. The evaluator's job here is to verify that every staging file's actual destination (and its resolved `{area}/` segment) matches the table — not to maintain a separate copy. For each entry in `working/promotion-manifest.md`, cross-reference the destination against the promotion.md routing table and flag any deviation.

### Recommended verifications

| Tool | Use for |
|---|---|
| `find .gobbi/projects/{project-name}/ -name '*.md'` pre vs post Wrap-up, plus hashes, reconciled to the frozen manifest | Identify exactly what was promoted across all destinations |
| Apply the staging→destination routing table mechanically against each session staging file; verify each resolved area against the memory-vocabulary allowlist | Verify the destination + area matches the table; a no-match must carry a user-decision reference and never a fallback |
| Run the frontmatter validator (`skills/memory/scripts/validate-frontmatter.sh`) on every manifest-derived destination | Verify required fields, the area allowlist, and the no-stray-keys strip |
| Field-level comparison of each stripped file's final frontmatter against the destination type's required-extension list | Confirm the strip removed only staging-only keys and no required base/type-extension field was dropped |
| Exact non-by-area shape check for `skills/{skill}/SKILL.md` and `skills/{skill}/mistakes.md` | Confirm a `skills/` destination carries no `{area}/` segment |
| Stable-identity re-run comparison: identical inventory + manifest produce an identical destination set | Detect a suffixed duplicate from a stripped or re-derived identity key |
| `grep` link targets in promoted files (and every mutation-row reference carrier) against actual file paths | Detect broken cross-references |
| The five post-promotion standing guards, each with command + exit status recorded: `validate-frontmatter.sh`, `check-markdown-links.sh`, `check-residual-vocab.sh`, `check-skill-mistakes.sh --all`, `check-workflow-mirror-consistency.sh` — all exit 0 over the post-promotion tree (this rehomes the complete standing-guard capability; nothing is dropped) | Verify promoted memory is well-formed, link-clean, and vocab-clean, that skill-owned `mistakes.md` sections conform, and that the `.claude/` workflow-doc mirror is intact |
| Conditional `check-merge-ref-integrity.sh <manifest> <scan-root>` ONLY when the compaction sub-procedure produced a merge manifest — additional to, never a substitute for, an always-run guard | Verify the compaction consolidation is lossless and reference-clean |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up inventing new memory schemas** | Wrap-up consolidates; it does not redesign. Schema changes belong in an Ideation loop |
| **Slugs that duplicate earlier session's promotions** | A second slug `auth-refactor.md` written next to an existing `auth-refactor.md` is a collision. Disambiguate explicitly |
| **A strip derived from the strip table alone** | Validate the final frontmatter against the destination type's required-extension list — a field can be required AND absent from the strip table (e.g. `domain` on a mistakes file) |
| **A plausible-but-invented `{area}/`** | A no-match on area resolution returns a user-decision; never accept an area outside the type's allowlist just because the path resolves |
| **A `skills/` destination given an `{area}/` segment** | `skills/` is not by-area; the only shapes are `skills/{skill}/SKILL.md` and `skills/{skill}/mistakes.md` |

---

## Performance

**Lens**: Does the wrap-up complete in **reasonable bound** without producing memory bloat?

**Scenario source:** `scenario.md` § Performance (`WRAP-PERF-SCENARIO-*`)
**Checklist source:** `checklist.md` § Performance (`WRAP-PERF-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `wc -l` on every manifest-derived destination file | Detect bloat; challenge any file outside the typical bound |
| `grep "session transcript"` or similar in promoted files | Detect raw-dump / narrative-dump promotions |
| Aggregate file-count + word-count comparison against the session's actual durable learning | Detect aggregate bloat invisible per-file |
| On EVERY wrap-up (always-run, independent of `settings.compaction.enabled`, per [`wrap-up/promotion.md` § Post-promotion standing-guard green-check](promotion.md#post-promotion-standing-guard-green-check)) — the post-promotion standing guards `validate-frontmatter.sh` + `check-markdown-links.sh` + `check-residual-vocab.sh` + `check-skill-mistakes.sh --all` + `check-workflow-mirror-consistency.sh` over the post-promotion tree, all exit 0 | Verify promoted memory is well-formed, link-clean, and vocab-clean, that skill-owned `mistakes.md` sections conform, and that the `.claude/` workflow-doc mirror is intact |
| ONLY when the compaction sub-procedure produced a merge manifest — `check-merge-ref-integrity.sh <manifest> <scan-root>` also runs | Verify the compaction consolidation is lossless and reference-clean |
| Unconditional live-record counts for every `{type}/{area}/` post-promotion, with soft/hard caps read from the owner (`memory-vocabulary.json`) | Detect an over-hard-cap area that must route to an Always-Ask decision rather than a silent PASS — even when automatic merge is disabled or its action budget is exhausted |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"More memory is better"** | Memory has a cost — every future session loads it. Distill, don't dump |
| **Counting gated behind the compaction flag** | The count runs on every wrap-up; `settings.compaction.enabled` gates only automatic merging. An over-hard-cap area cannot reach a silent PASS |
| **Compaction that summarizes to hit a count** | When a merge runs it must be lossless (sources recoverable + archived, references repointed, guards green), never a summary-only reduction |

---

## Aesthetics

**Lens**: Is the **handoff summary itself** readable and self-evident?

**Scenario source:** `scenario.md` § Aesthetics (`WRAP-AESTH-SCENARIO-*`)
**Checklist source:** `checklist.md` § Aesthetics (`WRAP-AESTH-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Read `4-wrap-up/working/handoff-draft.md` cold — required sections, substantive entries, placeholders, self-evident ordering | Test the draft that Stage 3 actually evaluates before Stage 4 seals it on `PASS` |
| Resolve every durable pointer from the repository root; reject both absolute worktree paths and `./...` cwd-relative paths | Detect a pointer that dies at worktree cleanup |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Quick wrap-up because session was short"** | Short sessions still produce promotable memory. The wrap-up's job is consolidation, not length-proportional ceremony |
| **Absolute worktree paths in durable pointers** | An absolute `.../worktrees/{branch}/...` path dies when the worktree is cleaned up. Durable pointers are repo-root–relative |

---

## Usage

**Lens**: Can the **next session** open this wrap-up and **continue work** without re-deriving context?

**Scenario source:** `scenario.md` § Usage (`WRAP-USAGE-SCENARIO-*`)
**Checklist source:** `checklist.md` § Usage (`WRAP-USAGE-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Read wrap-up + auto-loaded memory (project README / CLAUDE.md) as a fresh agent would — no private in-memory context | Test continuation viability |
| Resolve every pointer from the repository root and prove it survives worktree cleanup | Detect link rot at promotion time |
| Verify each open item has a runnable `next-action:` (verb + scope) and each decision-to-respect is a literal constraint, not narrative | Detect an un-actionable open item or a re-litigable decision |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Next-session-me will remember"** | Next-session-you is a fresh agent with no memory. Write for that audience |
| **Narrative wrap-ups** | "We discussed X and decided Y" reads as history. Future agents need "Y is the decision; respect it" |

---

## Consistency

**Lens**: Does the wrap-up tell **one coherent story**? Does it match the session's actual artifacts? Does promoted memory sync with existing memory?

**Scenario source:** `scenario.md` § Consistency (`WRAP-CONS-SCENARIO-*`)
**Checklist source:** `checklist.md` § Consistency (`WRAP-CONS-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Diff `staging/` directory contents vs promoted memory files (source inventory vs manifest accounting: promote / backlog / documented-drop / already-promoted; startup excluded) | Detect staging artifacts that were silently dropped |
| `grep` "supersedes" / "updates" in newly promoted files | Confirm conflicts with prior memory are declared, not silent |
| Cross-reference scan: every link / path in `4-wrap-up/working/handoff-draft.md` and all manifest-derived destinations | Detect link rot in the evaluated handoff draft |
| Diff session transcript's correction passages vs new `mistakes/` entries, staged mistakes, and explicit user-decision records declining promotion | Detect a missed mistake (a correction the user did NOT decline is unaccounted) |
| Confirm each superseded record is flipped `status: superseded` + `superseded_by:`, `git mv`-moved to `archive/{type}/{area}/` with original type/content retained, and its inbound path references repointed as one mutation set | Detect a one-directional supersession or a terminal-record deletion |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Cherry-picked promotions** | Staging artifact promoted because it sounds good, ignoring others. All staging must be accounted for, even if the account is "backlogged because Y" |
| **Wrap-up that "consolidates" by fabricating** | A summary statement not supported by a session artifact is a Consistency violation. Cite the supporting artifact or drop the claim |
| **Silent supersession** | New memory file that contradicts an existing one without saying so. Reviewers and future-self will treat both as authoritative |
| **One-directional supersession** | The new file names the old but the old is never flipped `status: superseded` + `superseded_by:`. Both then read as authoritative |

---

## Risk

**Lens**: What breaks if the wrap-up is **wrong**? Memory pollution, false-positive completion claims, lost work, leaked sensitive data, unsafe git finalization.

**Scenario source:** `scenario.md` § Risk (`WRAP-RISK-SCENARIO-*`)
**Checklist source:** `checklist.md` § Risk (`WRAP-RISK-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Canonical worktree-root + live path / inode proof for every tracked promotion mutation | Confirm no promotion write landed in the main checkout |
| `git status` scoped to the TRACKED tree after wrap-up — confirm no uncommitted promotion scratch | Detect dangling tracked work (NOT a proof of the gitignored session tree) |
| `find sessions/{date}-{session-id}/ -type f` + per-file hashes / size / mtime / inode (filesystem enumeration, not `git status`) | Prove the gitignored session scratch tree is intact — git is blind to it |
| Whole-batch atomicity evidence: complete manifest + candidates + preimages before the first write; one invalid input → zero durable writes + a precise halt | Detect a partial promotion |
| Frozen-target handshake: producer terminal output confirmed before dispatch; target hashes identical at both evaluators' start and exit | Detect a moving evaluation target |
| Prior-loop source immutability across Stage 1 — before/after hash + stat every prior-loop `staging/` file; correction overlays are the only mechanical-repair surface | Detect mutated read-only evidence |
| `grep -r "supersedes\|updates"` in newly promoted files | Confirm conflicts with prior memory are explicit |
| Sensitive-data audit: record a real sensitive-data touch; prove transient sensitive content did not enter a tracked promoted destination without authorization (no paid-API / cloud-cost report required) | Detect a sensitive-data leak into committed history |
| Diff: corrections in session transcript vs new mistakes entries / staged mistakes / declining-decisions | Detect an un-accounted correction |
| Read the branch `git log` for any Stage-5 finalization commit | Confirm no git finalization ran before this Stage-3 validation passed — Stage-3 checks the ABSENCE of premature finalization and validates the manager-owned plan; it never certifies an executed Stage-5 postcondition (Stage-5 verifies its own commit / push / PR / merge / cleanup results after PASS) |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up that deletes session scratch** | Scratch is the audit trail. Wrap-up promotes from it; it never deletes it |
| **`git status` as proof of the gitignored tree** | Git is blind to gitignored paths. Prove the session tree is intact by filesystem enumeration / hashes, not a "clean" git status |
| **Silent memory contradictions** | If a promoted file makes an old memory file wrong, the wrap-up must explicitly mark the old one superseded |
| **Skipped mistake recording** | A session that produced corrections without producing mistake entries (and without an explicit decline-with-reason) failed at its highest-value output |
| **Finalization ahead of its gate** | Stage-5 git commit / push / merge / cleanup runs only after Stage-3 PASS, and is manager-owned — the assistant never pushes, merges, or cleans up |
| **Stage-3 certifying a Stage-5 outcome** | A git postcondition (commit contents, PR reuse, push success) cannot exist before finalization. Stage-3 checks "no premature finalization + valid plan/ownership"; Stage-5 verifies its own postconditions after PASS |

---

## Overall (Stage 3) — phase-specific anchors

Derive the Overall review's artifact set from the SAME frozen manifest — do not let Overall fall back to a copied directory list.

| Karpathy mode | What it looks like in a Wrap-up artifact |
|---|---|
| **Wrong assumptions** | Wrap-up assumes the user wants memory the user did not validate ("I promoted this because it seemed important"); OR the Stage-3 report claims a future Stage-5 fact (a git postcondition that cannot exist until finalization runs) |
| **Overcomplexity** | Wrap-up introduces a new memory category / schema / convention. Should reuse existing |
| **Orthogonal edits** | Wrap-up bundles promotions for unrelated features into one synthesis — should be split per feature scope |
| **Imperative-over-declarative** | Wrap-up tells the next session *how* to resume instead of *what state* must be respected |

**Preserve-list anchors specific to Wrap-up**: mistakes that crystallize a real correction; concise next-action items; pointers that resolve and will keep resolving; and — when correctly implemented — stable source-identity idempotency, immutable prior staging, complete whole-batch preflight, and reciprocal supersession.

---

## Output reminder

The evaluator writes **nine** output files per system: the seven per-perspective files + one `overall.md` + the filled `checklist.md` (copied from the sibling `checklist.md` at Stage 0 and ticked through Stage 2), all under `sessions/{date}-{session-id}/4-wrap-up/evaluation/iter{n}/{system}/`:

- Seven per-perspective files at `sessions/{date}-{session-id}/4-wrap-up/evaluation/iter{n}/{system}/{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One overall file at `sessions/{date}-{session-id}/4-wrap-up/evaluation/iter{n}/{system}/overall.md`
- One filled `sessions/{date}-{session-id}/4-wrap-up/evaluation/iter{n}/{system}/checklist.md` — the copy-then-tick coverage artifact (Stage 0 copy → Stage 1 `## Stage 1 Additions` → Stage 2 tick with `PASS:` / `FAIL: {finding-id}` / `n/a: {reason}`)

Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (Stage 0) → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.

The Wrap-up loop is special: a `FAIL` here is **terminal escalation** — the manager uses the active runtime's user-decision primitive to present the failure findings to the user and decide next action (typically: accept the partial wrap-up with acknowledged gaps, re-run WORK with corrective direction, or abort session closure and defer to a follow-up session). `FAIL` does NOT automatically trigger a REVISE re-entry; that would mask a promotion failure the user should be aware of. `REVISE` (not FAIL) is the normal iteration path for fixable promotion gaps — a REVISE returns to Stage 1, and Stage 5 remains blocked. See `wrap-up/SKILL.md` § EVALUATION — Stage 3 for the authoritative verdict routing.
