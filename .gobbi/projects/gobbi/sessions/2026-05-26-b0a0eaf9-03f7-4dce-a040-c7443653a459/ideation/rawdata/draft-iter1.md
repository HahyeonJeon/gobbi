---
artifact_type: scope-contract
feature: project-memory
goal: A development-document-level standard for gobbi project-memory docs, plus a conformance-first then prose-quality retrofit of live docs.
created-by: 2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459
created-at: 2026-05-26T00:00:00Z
---

# Ideation draft — development-document-level project-memory standard (iter1)

> WORK-phase persistence of the locked Ideation Idea. Every decision below was approved during DISCUSSION (see Decisions Log). No new design content is introduced. Builds on PR #272's structural redesign — the 7 capability features + naming standard STAY and are not re-litigated.

## Scope Contract

**Project:** gobbi
**Feature:** project-memory
**Task:** Author a dev-doc-level memory standard and retrofit live docs in waves (conformance first, then prose).

### In-Scope
- A **dev-doc-level standard** added as a NEW section inside `.claude/skills/memorization/rules.md`, extending (not competing with) the existing naming/frontmatter standard.
- **Conformance wave (wave 1, mechanical):** frontmatter base-schema normalization + strip the 64 staging-key leaks + de-crypt cryptic session-internal coordinates (e.g. `T1-I-2`, `draft-iter3.md:308`) out of doc BODIES. Absorbs the existing `backlogs/feature-dir-frontmatter-full-normalization.md`.
- **Prose-quality wave (wave 2):** per-type prose rewrite toward the quality bar.
- **Minimal grep gate:** at most a mechanical conformance grep extended to `features/` (a verification command, NOT a behavior change).

### Out-of-Scope
- Re-homing memory docs or re-litigating PR #272's 7-capability re-home + naming standard.
- Big-bang single-pass rewrite of all docs.
- Heavy enforcement: a new evaluation perspective or full Principle-13 encoding — deferred (see Deferred + backlog `evaluation-perspective-for-dev-doc-quality`).
- Frozen `archive/` docs — excluded from both the standard and the retrofit.

### Decisions Locked
1. **Sequence:** write standard → retrofit in waves; conformance wave (mechanical) FIRST, then prose wave. — bottom-up, de-risked (Principle 3).
2. **Taxonomy:** keep gobbi's locked 13 memory doc types; import Diátaxis type-purity as PROSE guidance only — no re-home.
3. **Rollout:** wave-based, conformance first, each wave verified before the next.
4. **Enforcement (minimal):** at most a mechanical grep gate extended to `features/`; no Principle-13 surgery / new eval perspective unless trivially warranted.
5. **Standard's home:** new section inside `.claude/skills/memorization/rules.md`.
6. **Narrative content:** reclassify mislabeled session-journal docs to `notes/`; NEVER delete.
7. **Backlog absorption:** fold `backlogs/feature-dir-frontmatter-full-normalization.md` into conformance wave 1.
8. **Scope edge:** EXCLUDE frozen `archive/` docs.

### Success Criteria
1. A written dev-doc-quality standard exists that an evaluator can score a memory doc against (objective checklist, not vibes).
2. Frontmatter base-schema conformance is measurable with a stated target: 100% of live `features/` + project content docs carry base schema; 0 staging-key leaks outside `archive/`.
3. Every doc TYPE has a required intra-doc section contract (what sections, in what order, what each holds).
4. The standard leads with POSITIVE guidance + good/bad examples (per the naming-standard mistake), not prohibitions only.

### Deferred
- Heavier self-enforcement — a dedicated dev-doc-quality evaluation perspective and/or a full Principle-13 quality-facet encoding — deferred to backlog `staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md`. Witness: F3 enforcement-depth decision ("avoid unnecessary change / don't think deeply").

## Framed Problem

**Root cause**
PR #272 fixed *where* memory files live (7-capability re-home) and *what* they are named (naming standard + 29 renames + Principle 13). It did NOT define or enforce *how well each doc is written as a development document* — there is no standard governing intra-doc prose quality, section structure, abstraction level, or durable-vs-narrative content. Two file-path-evidenced consequences:
1. **Frontmatter never retrofitted to the base schema.** Across ~147 feature+project content docs, the base schema (`name/description/type/scope/feature/status/created/session/tags`) appears on only ~14–25 files while the legacy/ad-hoc schema dominates (`date:` 95×, `slug:` 36×, `iter:` 23×, `loop:` 46×). 64 files still leak staging-only keys (`finding-id` 39×, `disposition` 52×, `confidence` 42×, `severity` 43×, `surfaced-by` 7×) that `memorization/rules.md` §2.3 mandates stripping on promotion. Key-spelling drift exists (`promoted-from`/`promoted_from`; `addressed-in`/`addressed_in`/`addressed-by`).
2. **Cryptic session-internal references survive in doc BODIES.** #272 fixed filenames but bodies still address a vanished session: `features/git-workflow/design/worktree-create-before-session-stamp.md` anchors insights as "T1-I-2, T1-E-1, T1-DQ-2; iter1 COD-PROJ-001" and sources as "rawdata/draft-iter3.md:308-313" — meaningless to a zero-context reader. Same failure mode as the naming-standard mistake, but in prose instead of filenames.

Evidence: `skills/memorization/rules.md` §intro+§3; `mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md`; `backlogs/feature-dir-frontmatter-full-normalization.md`.

**Impact**
- **Who is affected**: every future agent that reads project memory at session start (primary consumer) + the user.
- **Severity**: degraded-knowledge-retrieval (not data loss) — directly undercuts the reason memory exists ("the next session can find them without restarting from zero", CLAUDE.md).
- **Cost of inaction**: inconsistency compounds every session; new docs are authored against templates while 147 legacy docs drift further; the base-frontmatter promise (machine-addressable memory) is only ~15% realized.

**Success criteria**
- See Scope Contract § Success Criteria (the four measurable criteria, restated as the framed-problem bar).

**Prior attempts**
- PR #272 (this worktree) shipped naming + frontmatter-schema + Principle 13 + type-boundary rules — the *structural* half.
- `backlogs/feature-dir-frontmatter-full-normalization.md` already filed the frontmatter retrofit as a known, deferred, bounded (~20–40 file) follow-up.

**Counterfactual / steel-man**
"Memory docs change every session; a prose-quality standard plus a 147-file rewrite is churn on a moving target, and #272 already shipped the standard that matters." Counter-evidence: (a) the dominant doc types here (decisions, design, mistakes, learnings) are *evergreen* (bare-slug, supersede-not-edit) — they do NOT change every session, so a one-time quality pass is durable; (b) #272's standard is explicitly *naming + frontmatter + type-boundary* and says nothing about prose quality or intra-doc sections — the gap is real. The steel-man's valid warning against a big-bang 147-file rewrite is honored by the wave-based, conformance-first rollout (Locked Decision 1+3).

**Re-framing conclusion**
A more ambitious framing was surfaced — "memory doc quality bar + conformance pass" as three scope tiers: (standard) + (retrofit) + (self-enforcement). The user ruled: pursue tiers 1+2 in-scope (standard + conformance wave + prose wave); keep tier-3 self-enforcement MINIMAL (grep gate only) and defer heavier encoding. Literal ask was the right framing once bounded this way.

## Research Insights

### Internal (inline)
- **INT-1 — The existing standard's own scope note proves the gap.** `skills/memorization/rules.md` opens with "This standard governs memory files only … the naming convention, the frontmatter standard, and the structure rules"; §3 structure rules are directory-as-category / atomicity / scope — none address prose quality or section contracts. *Why:* confirms the new standard is an *extension* of an existing doc, not a competitor — it lands as a new section in `rules.md`, not a new top-level doc. (Anchors Locked Decision 5.)
- **INT-2 — Templates already encode per-type section contracts for STAGING, but promoted docs don't obey them.** The 17 `memorization/templates/*.md` define section shapes; freshly authored docs follow them and read well (`features/project-memory/README.md` clean) while migrated sprint docs do not (`features/git-workflow/design/worktree-create-before-session-stamp.md` cryptic). *Why:* the quality bar is partly *already written as templates* — the standard can promote template section-contracts into a doc-quality rule + extend them with a "no session-internal references in promoted bodies" clause.
- **INT-3 — The project already learned "a standard must teach GOOD, not just forbid."** `mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md` (priority high, project-memory-scoped). *Why:* the dev-doc standard MUST lead with a positive quality definition + real before/after examples drawn from this tree, or it repeats the exact mistake #272 made. (Anchors Success Criterion 4.)
- **INT-4 — "Retire/remove without a named replacement" is a recorded trap.** `mistakes/design-literal-retire-instruction-without-replacement.md`. *Why:* governs how we handle session-narrative content — never *delete* narrative; keep journals as a legitimate `notes/` type or supersede-with-replacement, never strip-without-home. (Anchors Locked Decision 6.)
- **INT-5 — The frontmatter retrofit is already scoped and de-risked.** `backlogs/feature-dir-frontmatter-full-normalization.md` estimates ~20–40 files, "no logic changes, low risk," and specifies the grep + Final-Gate extension. *Why:* the content-quality session can *absorb* this backlog as conformance wave 1 rather than re-discovering it. (Anchors Locked Decision 7.)

### External (staged reference files)
- **EXT-1 — Diátaxis: four types, two axes, "don't mix types in one doc."** *Why:* gobbi already has a type system; Diátaxis gives the positive prose rule the current standard lacks — each type has a single job and must not bleed. Maps onto Principle 13's "must NOT bleed into adjacent types," extending it from frontmatter-type to prose-content. → `staging/references/diataxis-type-purity.md`
- **EXT-2 — ADR (Nygard): Title/Status/Context/Decision/Consequences is the canonical decision-doc shape.** *Why:* gobbi's `decisions/`+`design/` docs already approximate this; ADR validates keeping that section contract and names the under-used section: **Consequences "including the negative ones."** → `staging/references/adr-decision-record-shape.md`
- **EXT-3 — Frontmatter as type signatures; conformance enables filter-before-read.** *Why:* validates gobbi's base-frontmatter bet (machine-addressable memory) and argues conformance matters as much as schema — justifies Success Criterion 2 as a retrieval win, not pedantry. → `staging/references/frontmatter-as-schema.md`
- **EXT-4 — Karpathy / A-Mem markdown-wiki memory + Zettelkasten atomicity.** *Why:* confirms gobbi's "plain markdown trees, one record one concept, README index" architecture is the right shape for agent memory — so the job is to *raise quality within that shape*, not re-architect. Atomicity validated; missing piece is per-page writing quality + an index/navigation layer (tertiary). → `staging/references/markdown-memory-atomicity.md`
- **EXT-5 — Docs-as-code: lint + CI gate doc quality; reserve human review for content judgment.** *Why:* informs the self-enforcement tier — a mechanical frontmatter/section conformance check (extend the Final Gate grep) catches schema/staging-key violations, while the prose-quality bar stays an evaluation seed (deferred). Shapes Locked Decision 4 + the Deferred backlog. → `staging/references/docs-as-code-linting.md`

## Scenarios
- **Golden:** a new `decisions/` doc authored next session — passes type-purity + ADR section contract + base frontmatter + self-contained-prose checks with zero rework.
- **Edge (half-narrative / half-knowledge):** a migrated design doc with a real decision buried under `T1-I-2` / `draft-iter3.md:308` references — retrofit keeps the decision prose, lifts provenance to a footer, drops the inline coordinates; body becomes self-contained.
- **Failure (no clear home):** a doc that is genuinely a session journal mislabeled as a `design/` doc — reclassify to `notes/` (its real type); never force it into a quality it can't meet; never delete (INT-4).

## Implementation Checklist
- [ ] Write the dev-doc-level standard as a new section in `.claude/skills/memorization/rules.md`, leading with the positive quality definition + a real before/after table from this tree. — anchors INT-1, INT-3, EXT-1 (Success Criteria 1, 4).
- [ ] Define the per-type required section contract: decisions/design → Context → Decision → Rationale → Consequences/Trade-offs → Validation (ADR-shaped); mistakes → What/Why/Recognize/Corrected (already enforced); learnings → Insight/Context/Why-it-matters/How-to-apply/Counter-cases; notes (journal) → What-happened/What-shipped/Deferred/Decisions-to-respect. — anchors INT-2, EXT-2 (Success Criterion 3).
- [ ] State the self-contained-prose rule: no load-bearing vanished-session coordinates in bodies; provenance → frontmatter (`session`, `created`) + one optional "Source/Provenance" footer. — anchors INT-1, INT-3.
- [ ] State the frontmatter conformance target: 100% base schema on live docs; 0 staging-key leaks outside `archive/`; one spelling per key. — anchors EXT-3, INT-5 (Success Criterion 2).
- [ ] Conformance wave 1 (mechanical, FIRST): normalize frontmatter to base schema + strip the 64 staging-key leaks + de-crypt cryptic body coordinates, absorbing `feature-dir-frontmatter-full-normalization`. Verify before wave 2. — anchors INT-5, Locked Decisions 1+3+7.
- [ ] Prose-quality wave 2 (per type): rewrite bodies toward the quality bar; type-purity per Diátaxis. Verify per wave. — anchors EXT-1, EXT-2, Locked Decisions 1+3.
- [ ] Reclassify any mislabeled session-journal doc to `notes/`; never delete. — anchors INT-4, Locked Decision 6.
- [ ] Add at most a mechanical grep gate extended to `features/` (verification command only). Exclude `archive/`. — anchors EXT-5, Locked Decisions 4+8.

## Design

Directional decisions (mechanism deferred to Execution). Each is a locked choice with its validation method.

| # | Decision point | Chosen direction | Anchored insight | Validation method |
|---|---|---|---|---|
| D1 | Taxonomy | Keep gobbi's locked 13 types; import Diátaxis **type-purity** as prose guidance only — no re-home of #272's structure. | EXT-1, INT-1 | Manual demo: an evaluator scores a sample doc for single-type-job; type-bleed flagged. |
| D2 | Standard's home | New section inside `.claude/skills/memorization/rules.md`, extending the existing naming/frontmatter standard. | INT-1 | Section exists in `rules.md`; cross-references the existing standard rather than duplicating it. |
| D3 | Positive quality bar | A dev-doc = a doc a zero-context reader understands end-to-end without the originating session; lead with "what good looks like" + a real before/after table from this tree. | INT-3, EXT-2 | Standard contains a positive definition + before/after examples; no prohibition-only section. |
| D4 | Per-type section contract | ADR-shaped for decisions/design; existing What/Why/Recognize/Corrected for mistakes; Insight/Context/Why/How-to-apply/Counter-cases for learnings; What-happened/What-shipped/Deferred/Decisions-to-respect for notes. | INT-2, EXT-2 | Evaluator runs the section checklist on 3 sample docs → pass/fail per item. |
| D5 | Self-contained prose | No load-bearing vanished-session coordinates in bodies; provenance → frontmatter + one optional "Source" footer. | INT-1, INT-3 | Grep-assistable: `grep -nE 'T[0-9]+-|iter[0-9]|draft-iter|COD-|row-[0-9]'` on promoted bodies returns 0. |
| D6 | Frontmatter conformance | 100% base schema on live docs; 0 staging-key leaks outside `archive/`; one spelling per key. | EXT-3, INT-5 | Mechanical grep gate; target counts measured (base-schema 100%, staging-leak 0 outside archive). |
| D7 | Rollout | Wave-based; mechanical conformance wave FIRST (absorbs the normalization backlog), then per-type prose waves; each wave verified. | INT-5, EXT-1 | Each wave's verification command passes before the next wave begins. |
| D8 | Enforcement depth | Minimal — at most a mechanical grep gate extended to `features/` (verification command, no behavior change); no Principle-13 surgery / new eval perspective. Heavier enforcement deferred. | EXT-5 | Next-session smoke: a freshly authored doc passes the gate with no manual fix. |
| D9 | Narrative handling | Reclassify mislabeled session-journals to `notes/`; never delete; strip inline session-coords from evergreen types only. | INT-4 | Reclassified doc lands in `notes/`; no file deleted (git history shows move/rewrite, not delete). |
| D10 | Scope edge | Exclude frozen `archive/` docs from both standard and retrofit. | (scope ruling) | Grep gate and retrofit waves explicitly skip `archive/`. |

## Decisions Log

Every AskUserQuestion outcome from `discussion-log.md`, in order:

1. **Configuration: orchestration mode** — Q: Auto vs Chat. A: Auto. → Session runs in Auto mode. (auto-decide/config)
2. **Configuration: session focus vs PR #272** — Q: merge #272 / new work / work on #272. A: "we will continue the task." → Continue a memory-docs refactor task. (ask:scope)
3. **Ideation: starting point relative to PR #272** — Q: merge then build / build on #272 defer merge / re-judge structure. A: Build on #272 branch, defer merge. → Work inside the #272 worktree; structure + content land together; merge later; #272 re-home + renames NOT re-litigated. (ask:scope+design) — sets Out-of-Scope.
4. **Ideation: scope spine** — Q: primary scope among standard+rewrite / organization+nav / skills+principles. A: cover all three; priority (1) standard + content rewrite [primary], (2) skills/principles [optional], (3) organization & nav. → Three-tier scope with stated priority. (ask:scope)
5. **Ideation: scope sequencing (leader reframe)** — Q: conformance-first / prose-first / standard-only. A: Standard + conformance-first, then prose. → Write standard, then retrofit in waves: mechanical conformance wave first (frontmatter base-schema + staging-key strip + de-crypt body session-coords), then prose-quality wave. (ask:scope) — sets Locked Decision 1.
6. **Ideation: F1 taxonomy** — Q: keep 13 types + Diátaxis discipline / adopt Diátaxis 4-type. A: keep 13, borrow discipline. → Keep gobbi's locked 13-type set; import Diátaxis type-purity as prose guidance. (ask:design) — sets Locked Decision 2 / D1.
7. **Ideation: F2 rollout** — Q: wave-based conformance-first / big-bang. A: wave-based, conformance wave first. → Bottom-up waves; conformance wave first, each verified. (ask:design) — sets Locked Decision 3 / D7.
8. **Ideation: F3 enforcement depth** — Q: light (P13 pointer + grep gate) / none / full encode. A: "I just said it for avoiding unnecessary change. Don't think deeply." → Keep enforcement MINIMAL — mechanical grep gate at most; avoid Principle-13 surgery unless trivially warranted. (ask:scope; Always-Ask for principle edits → resolved to "avoid unnecessary change") — sets Locked Decision 4 / D8; drives the Deferred backlog.
9. **Ideation: low-stakes leader recs (manager-stated, no objection)** — narrative → reclassify to `notes/`, never delete (anchored to mistake `design-literal-retire-instruction-without-replacement`); fold `feature-dir-frontmatter-full-normalization` into conformance wave 1; exclude frozen `archive/`; standard's home = new section in `skills/memorization/rules.md` (anchored INT-1). (auto-decide; user did not object) — sets Locked Decisions 5+6+7+8.

### Reference promotion log
Five external insights staged as reference files (one per confirmed external insight):
- EXT-1 → `staging/references/diataxis-type-purity.md`
- EXT-2 → `staging/references/adr-decision-record-shape.md`
- EXT-3 → `staging/references/frontmatter-as-schema.md`
- EXT-4 → `staging/references/markdown-memory-atomicity.md`
- EXT-5 → `staging/references/docs-as-code-linting.md`

Internal insights (INT-1..INT-5) do NOT get reference files — they live in this Decisions Log and the Research Insights / Design rationale.

### Backlog promotion log
- Deferred heavier enforcement (dedicated dev-doc-quality evaluation perspective and/or full Principle-13 quality-facet encoding) → staged at `staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md`. Witness: AskUserQuestion #8 (F3 enforcement depth — "avoid unnecessary change").
- No new feature-level (task) backlog: Sub-step B did not defer a competing task candidate; the non-picked scope tiers (3 = organization & navigation; tier-2 skills/principles) were folded into the in-scope waves / the minimal-grep decision rather than deferred as separate tasks. Recorded here per the ideation skill's "log the decision instead" instruction.
- The pre-existing `backlogs/feature-dir-frontmatter-full-normalization.md` is **absorbed** into conformance wave 1 (Locked Decision 7), not re-staged. Wrap-up will archive/close it when wave 1 ships.
