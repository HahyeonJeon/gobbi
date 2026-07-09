# Wrap-up Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `wrap-up`. Provides the per-perspective evaluation **procedure** for a Wrap-up Loop's session consolidation: each perspective's **lens**, its **recommended verifications**, and its **perspective-specific anti-patterns**, plus the **Overall (Stage 3)** anchors. The concrete GOOD / BAD / adversarial **scenario families** live in the sibling `scenario.md`, and their yes/no **checks** live in the sibling `checklist.md` (whose heading tree mirrors `scenario.md`); each perspective below points to its section in both.

The artifact under evaluation is the Wrap-up loop's `sessions/{date}-{session-id}/5-wrap-up/outputs/` files (the handoff summary, shipped-summary, next-session-pointers, and any decomposed artifact the Wrap-up assistant produced) **plus** the full set of memory promotions Wrap-up made. Wrap-up promotion targets span the entire memory surface (not only `features/` + `mistakes/`):

- `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,references,design,discussions,backlogs,plans}/` — feature-scoped promotions
- `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` — feature-scoped mistakes
- `.gobbi/projects/{project-name}/features/{feature-name}/README.md` — feature index + activity log
- `.gobbi/projects/{project-name}/mistakes/` — project-scoped mistakes
- `.gobbi/projects/{project-name}/rules/` — project rules
- `.gobbi/projects/{project-name}/design/` — project-level design docs
- `.gobbi/projects/{project-name}/notes/` — handoff / investigation notes
- `.gobbi/projects/{project-name}/backlogs/` — project-level deferrals beyond features

The promotion is part of the wrap-up artifact — evaluation must verify it across every destination, not assume it.

**This evaluation IS pipeline stage 3 — memory validation.** In the wrap-up 5-stage pipeline (see [`wrap-up/SKILL.md` § The 5-stage pipeline](SKILL.md#the-5-stage-pipeline)), the Wrap-up loop's dual-system EVALUATION and stage-3 memory validation are the same gate (D11). Stage 2 (memorization) is the promotion under evaluation here; this evaluation validates it. The verdict gates the irreversible **stage 5 — git finalization** (commit / push / merge / worktree cleanup): only a stage-3 `PASS` lets git run. `REVISE` re-runs the stage-2 promotion; `FAIL` escalates to the user. Neither lets git run.

Wrap-up evaluation is **non-skippable** (D13). No `evaluate.mode: skip` setting — and no other settings path — can remove it. A wrap-up that consolidates incorrectly poisons every future session. The cost of catching a bad wrap-up is paid once; the cost of missing it compounds. Because stage 3 always gates the irreversible git stage 5, skipping it is never permitted. The scenario families in `scenario.md` already include adversarial cases (phantom completion claims, silent supersession, missed mistakes, premature finalization) so Stage 2 walks each Frame once without a separate adversarial pass.

---

## Project

**Lens**: Does the wrap-up consolidate **the right session's work**, completely, without inventing claims?

**Scenario source:** `scenario.md` § Project (`WRAP-PROJ-SCENARIO-*`)
**Checklist source:** `checklist.md` § Project (`WRAP-PROJ-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `git log` of the session's branch | Compare against "what was shipped" claims |
| `ls -la` on `sessions/{date}-{session-id}/{N}-{loop}/staging/` for every loop (plus `interview/staging/` and, in Chat mode, each `chat/tasks/*/{N}-{loop}/staging/`) | Confirm staging artifacts were either promoted or backlogged |
| `git diff` for new files under `features/{feature-name}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/` | Verify promotion actually happened across all project-tier destinations |
| `find .gobbi/projects/{project-name}/` (pre-Wrap-up vs post-Wrap-up) | Identify exactly what was promoted at each destination |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up that claims completion of deferred items** | Verify each claim against the actual change-set. A "shipped" claim with no commit is a phantom |
| **Wrap-up that ignores Ideation/Planning outputs** | If Ideation produced staging artifacts but the wrap-up doesn't reference them, the consolidation is incomplete |
| **Project-tier writes outside features/ + mistakes/ unverified** | `rules/`, `design/`, `notes/`, `backlogs/` promotions are equally part of Wrap-up's scope. Audit every destination |

---

## Structure

**Lens**: Is the **promoted memory** well-structured? Does it slot into existing memory without breaking conventions?

**Scenario source:** `scenario.md` § Structure (`WRAP-STRUCT-SCENARIO-*`)
**Checklist source:** `checklist.md` § Structure (`WRAP-STRUCT-SCENARIO-*-CHECK-*`)

**Staging → memory routing (deterministic; Wrap-up MUST follow).** See [`wrap-up/SKILL.md` § Staging → Memory routing](SKILL.md#staging--memory-routing) for the authoritative routing table and the §1.5 area-resolution rule. The evaluator's job here is to verify that every staging file's actual destination (and its resolved `{area}/` segment) matches the table — not to maintain a separate copy. For each entry in `working/promotion-manifest.md`, cross-reference the destination against the SKILL.md routing table and flag any deviation.

### Recommended verifications

| Tool | Use for |
|---|---|
| `find .gobbi/projects/{project-name}/ -name '*.md'` pre vs post Wrap-up | Identify exactly what was promoted across all destinations |
| Apply the staging→destination routing table mechanically against each session staging file | Verify the destination matches the table |
| Run the frontmatter validator (`skills/memory/scripts/validate-frontmatter.sh`) on promoted files | Verify required fields, the area allowlist, and the no-stray-keys strip |
| `grep` link targets in promoted files against actual file paths | Detect broken cross-references |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up inventing new memory schemas** | Wrap-up consolidates; it does not redesign. Schema changes belong in an Ideation loop |
| **Slugs that duplicate earlier session's promotions** | A second slug `auth-refactor.md` written next to an existing `auth-refactor.md` is a collision. Disambiguate explicitly |

---

## Performance

**Lens**: Does the wrap-up complete in **reasonable bound** without producing memory bloat?

**Scenario source:** `scenario.md` § Performance (`WRAP-PERF-SCENARIO-*`)
**Checklist source:** `checklist.md` § Performance (`WRAP-PERF-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `wc -l` on each promoted file | Detect bloat |
| `grep "session transcript"` or similar in promoted files | Detect raw-dump promotions |
| On EVERY wrap-up (always-run, independent of `settings.compaction.enabled`, per [`wrap-up/SKILL.md` § Post-promotion standing-guard green-check](SKILL.md)) — the post-promotion standing guards `validate-frontmatter.sh` + `check-markdown-links.sh` + `check-residual-vocab.sh` over the post-promotion tree, all exit 0 | Verify promoted memory is well-formed, link-clean, and vocab-clean |
| ONLY when Stage-2c produced a compaction merge manifest — `check-merge-ref-integrity.sh <manifest> <scan-root>` also runs | Verify Stage-2c consolidation is lossless and reference-clean |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"More memory is better"** | Memory has a cost — every future session loads it. Distill, don't dump |

---

## Aesthetics

**Lens**: Is the **handoff summary itself** readable and self-evident?

**Scenario source:** `scenario.md` § Aesthetics (`WRAP-AESTH-SCENARIO-*`)
**Checklist source:** `checklist.md` § Aesthetics (`WRAP-AESTH-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Usage (`WRAP-USAGE-SCENARIO-*`)
**Checklist source:** `checklist.md` § Usage (`WRAP-USAGE-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Consistency (`WRAP-CONS-SCENARIO-*`)
**Checklist source:** `checklist.md` § Consistency (`WRAP-CONS-SCENARIO-*-CHECK-*`)

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

**Lens**: What breaks if the wrap-up is **wrong**? Memory pollution, false-positive completion claims, lost work, leaked sensitive data, unsafe git finalization.

**Scenario source:** `scenario.md` § Risk (`WRAP-RISK-SCENARIO-*`)
**Checklist source:** `checklist.md` § Risk (`WRAP-RISK-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `git status` after wrap-up — confirm no uncommitted scratch | Detect dangling work |
| `grep -r "supersedes\|updates"` in newly promoted files | Confirm conflicts with prior memory are explicit |
| Diff: corrections in session transcript vs new mistakes entries | Detect un-recorded corrections |
| Read the branch `git log` for any Stage-5 finalization commit | Confirm no git finalization ran before this Stage-3 validation passed |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up that deletes session scratch** | Scratch is the audit trail. Wrap-up promotes from it; it never deletes it |
| **Silent memory contradictions** | If a promoted file makes an old memory file wrong, the wrap-up must explicitly mark the old one superseded |
| **Skipped mistake recording** | A session that produced corrections without producing mistake entries failed at its highest-value output |
| **Finalization ahead of its gate** | Stage-5 git commit / push / merge / cleanup runs only after Stage-3 PASS, and is manager-owned — the assistant never pushes, merges, or cleans up |

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

The evaluator writes **nine** output files per system: the seven per-perspective files + one `overall.md` + the filled `checklist.md` (copied from the sibling `checklist.md` at Stage 0 and ticked through Stage 2), all under `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{system}/`:

- Seven per-perspective files at `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{system}/{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One overall file at `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{system}/overall.md`
- One filled `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{system}/checklist.md` — the copy-then-tick coverage artifact (Stage 0 copy → Stage 1 `## Stage 1 Additions` → Stage 2 tick with `PASS:` / `FAIL: {finding-id}` / `n/a: {reason}`)

Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (Stage 0) → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.

The Wrap-up loop is special: a `FAIL` here is **terminal escalation** — the manager uses the active runtime's user-decision primitive to present the failure findings to the user and decide next action (typically: accept the partial wrap-up with acknowledged gaps, re-run WORK with corrective direction, or abort session closure and defer to a follow-up session). `FAIL` does NOT automatically trigger a REVISE re-entry; that would mask a promotion failure the user should be aware of. `REVISE` (not FAIL) is the normal iteration path for fixable promotion gaps. See `wrap-up/SKILL.md` § EVALUATION Phase for the authoritative verdict routing.
