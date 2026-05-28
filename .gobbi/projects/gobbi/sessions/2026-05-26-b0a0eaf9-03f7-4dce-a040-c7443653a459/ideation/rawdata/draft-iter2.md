---
artifact_type: scope-contract
feature: project-memory
goal: A development-document-level standard for gobbi project-memory docs, plus a conformance-first then prose-quality retrofit of live docs.
created-by: 2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459
created-at: 2026-05-26T00:00:00Z
---

# Ideation draft — development-document-level project-memory standard (iter2)

> WORK-phase persistence of the locked Ideation Idea. Every decision below was approved during DISCUSSION (see Decisions Log). No new design content is introduced. Builds on PR #272's structural redesign — the 7 capability features + naming standard STAY and are not re-litigated.
>
> **iter2 remediation note.** This draft preserves the iter1 approach and all 8 locked decisions unchanged. It fixes ONLY the iter1 dual-system findings: (F1) the conformance wave is rewritten as a type-aware allowlist with an explicit file-selection predicate so `disposition` on `backlogs/` is never stripped; (F2) all population counts are recomputed reproducibly against HEAD `d2b5b37` with the exact commands pasted in; (F3) tiers 2+3 are explicitly placed in the Scope Contract; (F4) concrete Planning/Execution notes (canonical symlink edit target, 12-vs-13 principle drift, #272 merge-back) are added to the Implementation Checklist. See the Decisions Log § iter2 remediation for the per-finding crosswalk.

## Scope Contract

**Project:** gobbi
**Feature:** project-memory
**Task:** Author a dev-doc-level memory standard and retrofit live docs in waves (conformance first, then prose).

### Population predicate (P_live) — used by every count in this artifact

> **P_live (the retrofit content-doc population):** all `*.md` under `.gobbi/projects/gobbi/` EXCLUDING the non-memory surfaces `sessions/`, `skills/`, `agents/`, and `tmp/`, and EXCLUDING the frozen `archive/`. Two derived sets:
> - **P_live_all = 208 files** (includes the 17 `README.md` index files — READMEs carry base frontmatter per `rules.md` §2.1, so base-schema conformance is measured over this set).
> - **P_live_content = 191 files** (P_live_all minus the 17 `README.md` index files — the per-type prose/body retrofit population; READMEs are governed by tier-3 navigation, not the per-type prose wave).
>
> Measured at HEAD `d2b5b37` in worktree `chore/session-2026-05-25-a10c82d6`. The exact commands + outputs are in the Framed Problem and in the Decisions Log § iter2 remediation, so any reader can reproduce them.

### In-Scope

**Tier 1 — Standard + content rewrite (PRIMARY; user-ratified Q4 priority 1):**
- A **dev-doc-level standard** added as a NEW section inside `memorization/rules.md` (canonical edit target `.gobbi/projects/gobbi/skills/memorization/rules.md`; the `.claude/skills/...` path is a symlink mirror — see Implementation Checklist), extending (not competing with) the existing naming/frontmatter standard.
- **Conformance wave (wave 1, mechanical):** type-aware frontmatter base-schema normalization + a **type-aware allowlist strip** of illegitimate staging-routing keys (see FIX-1 predicate below — NOT a blanket grep-strip) + de-crypt cryptic session-internal coordinates (e.g. `T1-I-2`, `draft-iter3.md:308`) out of doc BODIES. Absorbs the existing `backlogs/feature-dir-frontmatter-full-normalization.md`.
- **Prose-quality wave (wave 2):** per-type prose rewrite toward the quality bar.

**Tier 2 — skills/principles for doc discipline (user-ratified Q4 priority 2 "optional, not mandatory"):**
- IN-SCOPE only as the **minimal mechanical grep gate** — at most a conformance grep extended to `features/` (a verification command, NOT a behavior change). Per the F3 enforcement-depth decision ("I just said it for avoiding unnecessary change. Don't think deeply").
- Heavier tier-2 enforcement (a dedicated dev-doc-quality evaluation perspective and/or a full Principle-13 quality-facet encoding) is DEFERRED — see Deferred + the staged backlog `staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md`.

**Tier 3 — organization & navigation (user-ratified Q4 priority 3):**
- IN-SCOPE as a **light final wave (tertiary priority)**: verify each feature `README.md`'s "Subdirectories" section accurately lists the subdirs that exist (the section exists today, e.g. `features/git-workflow/README.md:23 ## Subdirectories`), and optionally add a top-level index pointer. This wave runs LAST and is the lowest-priority; it must not block tier-1 shipping.

### Out-of-Scope
- Re-homing memory docs or re-litigating PR #272's 7-capability re-home + naming standard.
- Big-bang single-pass rewrite of all docs.
- Heavy self-enforcement: a new evaluation perspective or full Principle-13 encoding — deferred (see Deferred + backlog `evaluation-perspective-for-dev-doc-quality`).
- Frozen `archive/` docs — excluded from the standard, the retrofit, and the grep gate.
- Stripping `disposition` from `backlogs/` files, or any frontmatter key that is legitimate for that doc's type/dir (FIX-1 safety invariant).

### Decisions Locked
1. **Sequence:** write standard → retrofit in waves; conformance wave (mechanical) FIRST, then prose wave, then the light tier-3 nav wave. — bottom-up, de-risked (Principle 3).
2. **Taxonomy:** keep gobbi's locked 13 memory doc types; import Diátaxis type-purity as PROSE guidance only — no re-home.
3. **Rollout:** wave-based, conformance first, each wave verified before the next.
4. **Enforcement (minimal):** at most a mechanical, type-aware grep gate extended to `features/`; no Principle-13 surgery / new eval perspective unless trivially warranted.
5. **Standard's home:** new section inside `memorization/rules.md` (canonical `.gobbi/projects/gobbi/skills/memorization/rules.md`).
6. **Narrative content:** reclassify mislabeled session-journal docs to `notes/`; NEVER delete.
7. **Backlog absorption:** fold `backlogs/feature-dir-frontmatter-full-normalization.md` into conformance wave 1.
8. **Scope edge:** EXCLUDE frozen `archive/` docs.

### Success Criteria
1. A written dev-doc-quality standard exists that an evaluator can score a memory doc against (objective checklist, not vibes).
2. **(recomputed against HEAD d2b5b37, type-aware)** Frontmatter conformance is measurable with a stated, type-aware target: **100% of P_live_all (208 files) carry the full base schema** (the baseline today is **50 / 208 fully-conformant**, so ~76% of the population needs retrofit); and **0 illegitimate staging-key leaks outside `archive/`** where "leak" is defined type-aware (the baseline today is **59 leak files** under the FIX-1 predicate). The "0 leaks" target EXCLUDES legitimately-placed keys — e.g. `disposition` on `backlogs/` (28 legitimate files) is NOT a leak and is never stripped.
3. Every doc TYPE has a required intra-doc section contract (what sections, in what order, what each holds).
4. The standard leads with POSITIVE guidance + good/bad examples (per the naming-standard mistake), not prohibitions only.

### Deferred
- Heavier self-enforcement — a dedicated dev-doc-quality evaluation perspective and/or a full Principle-13 quality-facet encoding — deferred to backlog `staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md`. Witness: F3 enforcement-depth decision ("avoid unnecessary change / don't think deeply"). The cheap mechanical grep gate (tier 2 minimal) stays in-scope; only the judgment-check half is deferred.

## Framed Problem

**Root cause**
PR #272 fixed *where* memory files live (7-capability re-home) and *what* they are named (naming standard + 29 renames + Principle 13). It did NOT define or enforce *how well each doc is written as a development document* — there is no standard governing intra-doc prose quality, section structure, abstraction level, or durable-vs-narrative content. Two file-path-evidenced consequences, with counts recomputed against HEAD `d2b5b37`:

1. **Frontmatter never retrofitted to the base schema.** Across **208 live memory docs (P_live_all)**, only **50 carry the full base schema** (`name/description/type/scope/feature/status/created/session/tags`) — ~24% conformant. Individual base keys are present unevenly (measured at HEAD d2b5b37):

   | base key | files / 208 |
   |---|---|
   | `name` | 54 |
   | `description` | 54 |
   | `type` | 106 |
   | `scope` | 182 |
   | `feature` | 196 |
   | `status` | 146 |
   | `created` | 80 |
   | `session` | 162 |
   | `tags` | 70 |

   Legacy / ad-hoc schema keys still dominate many files: `date:` 96×, `slug:` 36×, `iter:` 22×, `loop:` 44×. Staging-routing keys persist as leaks: `finding-id` 36×, `confidence` 39×, `severity` 40×, `surfaced-by` 6×, `promoted-from` 25×, `promoted-at` 25×, `mistake-candidate` 7×, and `disposition` 62× (of which **28 are LEGITIMATE on `backlogs/`** per `rules.md` §2.2 line 110 and **35 are non-backlog leak candidates**). Key-spelling drift exists (`promoted-from` 25× / `promoted_from` 5×; `addressed-in` 4× / `addressed_in` 4× / `addressed-by` 4×).

   The exact reproduction commands and outputs are pasted in the Decisions Log § iter2 remediation (F2).

2. **Cryptic session-internal references survive in doc BODIES.** #272 fixed filenames but bodies still address a vanished session: `features/git-workflow/design/worktree-create-before-session-stamp.md` (confirmed by the Codex evaluator at `:31-33` and `:49-51`) anchors insights as `T1-I-2, T1-E-1, T1-DQ-2; iter1 COD-PROJ-001` and sources as `rawdata/draft-iter3.md:308-313` — meaningless to a zero-context reader. Same failure mode as the naming-standard mistake, but in prose instead of filenames.

Evidence: `skills/memorization/rules.md` §intro+§2.2+§2.3+§3; `mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md`; `backlogs/feature-dir-frontmatter-full-normalization.md`.

**Impact**
- **Who is affected**: every future agent that reads project memory at session start (primary consumer) + the user.
- **Severity**: degraded-knowledge-retrieval (not data loss) — directly undercuts the reason memory exists ("the next session can find them without restarting from zero", CLAUDE.md).
- **Cost of inaction**: inconsistency compounds every session; new docs are authored against templates while 191 legacy content docs (P_live_content) drift further; the base-frontmatter promise (machine-addressable memory) is only ~24% realized (50/208 fully conformant).

**Success criteria**
- See Scope Contract § Success Criteria (the four measurable criteria, restated as the framed-problem bar). Criterion 2 is now sized against the corrected denominator (208) and is type-aware-consistent with FIX 1 ("0 leaks" excludes legitimate per-type keys).

**Prior attempts**
- PR #272 (this worktree) shipped naming + frontmatter-schema + Principle 13 + type-boundary rules — the *structural* half.
- `backlogs/feature-dir-frontmatter-full-normalization.md` already filed the frontmatter retrofit as a known, deferred, bounded follow-up.

**Counterfactual / steel-man**
"Memory docs change every session; a prose-quality standard plus a 208-file retrofit is churn on a moving target, and #272 already shipped the standard that matters." Counter-evidence: (a) the dominant doc types here (decisions, design, mistakes, learnings) are *evergreen* (bare-slug, supersede-not-edit) — they do NOT change every session, so a one-time quality pass is durable; (b) #272's standard is explicitly *naming + frontmatter + type-boundary* and says nothing about prose quality or intra-doc sections — the gap is real. The steel-man's valid warning against a big-bang rewrite is honored by the wave-based, conformance-first rollout (Locked Decision 1+3).

**Re-framing conclusion**
A more ambitious framing was surfaced — "memory doc quality bar + conformance pass" as three scope tiers. The user ruled (Q4): cover ALL THREE tiers with priority order — tier 1 (standard + content rewrite) primary, tier 2 (skills/principles) optional, tier 3 (organization & navigation) third. iter2 honors this by placing all three tiers explicitly In-Scope (tier 2 capped at the minimal grep gate per Q8; tier 3 a light final wave) rather than folding the lower tiers away. Literal ask was the right framing once bounded this way.

## Research Insights

### Internal (inline)
- **INT-1 — The existing standard's own scope note proves the gap.** `skills/memorization/rules.md` opens with "the naming convention, the frontmatter standard, and the structure rules"; §3 structure rules are directory-as-category / atomicity / scope — none address prose quality or section contracts. *Why:* confirms the new standard is an *extension* of an existing doc, not a competitor — it lands as a new section in `rules.md`, not a new top-level doc. (Anchors Locked Decision 5.)
- **INT-2 — Templates already encode per-type section contracts for STAGING, but promoted docs don't obey them.** The `memorization/templates/*.md` define section shapes; freshly authored docs follow them and read well (`features/project-memory/README.md` clean) while migrated sprint docs do not (`features/git-workflow/design/worktree-create-before-session-stamp.md` cryptic). *Why:* the quality bar is partly *already written as templates* — the standard can promote template section-contracts into a doc-quality rule + extend them with a "no session-internal references in promoted bodies" clause.
- **INT-3 — The project already learned "a standard must teach GOOD, not just forbid."** `mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md` (priority high, project-memory-scoped). *Why:* the dev-doc standard MUST lead with a positive quality definition + real before/after examples drawn from this tree, or it repeats the exact mistake #272 made. (Anchors Success Criterion 4.)
- **INT-4 — "Retire/remove without a named replacement" is a recorded trap.** `mistakes/design-literal-retire-instruction-without-replacement.md`. *Why:* governs how we handle session-narrative content — never *delete* narrative; keep journals as a legitimate `notes/` type or supersede-with-replacement, never strip-without-home. (Anchors Locked Decision 6.) This same discipline extends to FIX-1's never-strip-a-legitimate-key invariant: a key with a legitimate per-type home is not "removed without replacement."
- **INT-5 — The frontmatter retrofit is already scoped and de-risked.** `backlogs/feature-dir-frontmatter-full-normalization.md` specifies the grep + Final-Gate extension and is "no logic changes, low risk." *Why:* the content-quality session can *absorb* this backlog as conformance wave 1 rather than re-discovering it. (Anchors Locked Decision 7.) Note: iter2 re-sizes the effort against the corrected 208-file population — the backlog's original file estimate predates this session's #272 frontmatter work and is superseded by the recomputed counts.

### External (staged reference files)
- **EXT-1 — Diátaxis: four types, two axes, "don't mix types in one doc."** *Why:* gobbi already has a type system; Diátaxis gives the positive prose rule the current standard lacks — each type has a single job and must not bleed. Maps onto Principle 13's "must NOT bleed into adjacent types," extending it from frontmatter-type to prose-content. → `staging/references/diataxis-type-purity.md`
- **EXT-2 — ADR (Nygard): Title/Status/Context/Decision/Consequences is the canonical decision-doc shape.** *Why:* gobbi's `decisions/`+`design/` docs already approximate this; ADR validates keeping that section contract and names the under-used section: **Consequences "including the negative ones."** → `staging/references/adr-decision-record-shape.md`
- **EXT-3 — Frontmatter as type signatures; conformance enables filter-before-read.** *Why:* validates gobbi's base-frontmatter bet (machine-addressable memory) and argues conformance matters as much as schema — justifies Success Criterion 2 as a retrieval win, not pedantry. → `staging/references/frontmatter-as-schema.md`
- **EXT-4 — Karpathy / A-Mem markdown-wiki memory + Zettelkasten atomicity.** *Why:* confirms gobbi's "plain markdown trees, one record one concept, README index" architecture is the right shape for agent memory — so the job is to *raise quality within that shape*, not re-architect. Atomicity validated; the missing piece is per-page writing quality + an index/navigation layer (tier 3). → `staging/references/markdown-memory-atomicity.md`
- **EXT-5 — Docs-as-code: lint + CI gate doc quality; reserve human review for content judgment.** *Why:* informs the self-enforcement tier — a mechanical, type-aware frontmatter/section conformance check (extend the Final Gate grep) catches schema/illegitimate-staging-key violations, while the prose-quality bar stays an evaluation seed (deferred). Shapes Locked Decision 4 + the Deferred backlog. → `staging/references/docs-as-code-linting.md`

## Scenarios
- **Golden:** a new `decisions/` doc authored next session — passes type-purity + ADR section contract + base frontmatter + self-contained-prose checks with zero rework.
- **Edge (half-narrative / half-knowledge):** a migrated design doc with a real decision buried under `T1-I-2` / `draft-iter3.md:308` references — retrofit keeps the decision prose, lifts provenance to a footer, drops the inline coordinates; body becomes self-contained.
- **Edge (legitimate-key backlog — FIX-1 witness):** a `backlogs/` doc such as `features/git-workflow/backlogs/anchor-slug-4-hyphen-vs-2-hyphen.md` that carries BOTH a legitimate `disposition: open` AND illegitimate eval-routing keys (`finding-id`, `confidence`, `severity`). The type-aware conformance wave strips the eval-routing keys but PRESERVES `disposition` (legitimate per `rules.md` §2.2 line 110). A blanket grep-strip would corrupt this file; the predicate prevents it.
- **Failure (no clear home):** a doc that is genuinely a session journal mislabeled as a `design/` doc — reclassify to `notes/` (its real type); never force it into a quality it can't meet; never delete (INT-4).

## Implementation Checklist
- [ ] Write the dev-doc-level standard as a new section in `memorization/rules.md`, leading with the positive quality definition + a real before/after table from this tree. — anchors INT-1, INT-3, EXT-1 (Success Criteria 1, 4).
- [ ] **Edit the CANONICAL file, not the symlink.** The standard's home `.claude/skills/memorization/rules.md` is a SYMLINK → `.gobbi/projects/gobbi/skills/memorization/rules.md`. The Edit/Write target MUST be the canonical worktree-absolute path `.gobbi/projects/gobbi/skills/memorization/rules.md`; the `.claude/skills/...` mirror reflects the edit automatically (one edit, not two). — anchors mistakes `edit-tool-refuses-symlink-paths`, `skills-mirror-symlinks-not-copies`.
- [ ] Define the per-type required section contract: decisions/design → Context → Decision → Rationale → Consequences/Trade-offs → Validation (ADR-shaped); mistakes → What/Why/Recognize/Corrected (already enforced); learnings → Insight/Context/Why-it-matters/How-to-apply/Counter-cases; notes (journal) → What-happened/What-shipped/Deferred/Decisions-to-respect. — anchors INT-2, EXT-2 (Success Criterion 3).
- [ ] State the self-contained-prose rule: no load-bearing vanished-session coordinates in bodies; provenance → frontmatter (`session`, `created`) + one optional "Source/Provenance" footer. — anchors INT-1, INT-3.
- [ ] State the type-aware frontmatter conformance target: 100% base schema on P_live_all (208); 0 illegitimate staging-key leaks outside `archive/`; one spelling per key. — anchors EXT-3, INT-5 (Success Criterion 2).
- [ ] **Conformance wave 1 (mechanical, FIRST) — TYPE-AWARE ALLOWLIST, not a blanket strip.** Apply the FIX-1 file-selection predicate + illegitimate-key set (defined in Design D6 below): for each file in P_live, strip ONLY the keys illegitimate for that file's type/dir; never strip a key legitimate for that doc's type (e.g. `disposition` on `backlogs/`). Also normalize base schema + de-crypt cryptic body coordinates, absorbing `feature-dir-frontmatter-full-normalization`. Verify before wave 2. — anchors INT-5, Locked Decisions 1+3+7; resolves F1.
- [ ] Prose-quality wave 2 (per type): rewrite bodies toward the quality bar; type-purity per Diátaxis. Verify per wave. — anchors EXT-1, EXT-2, Locked Decisions 1+3.
- [ ] **Tier-3 light nav wave (LAST, lowest priority):** verify each feature `README.md`'s "Subdirectories" section lists the subdirs that actually exist; optionally add a top-level index pointer. Must not block tier-1. — anchors EXT-4, Q4 priority 3.
- [ ] Reclassify any mislabeled session-journal doc to `notes/`; never delete. — anchors INT-4, Locked Decision 6.
- [ ] Add at most a mechanical, type-aware grep gate extended to `features/` (verification command only). Exclude `archive/`. The gate's leak check MUST use the FIX-1 predicate (exclude `backlogs/` for `disposition`) so it does not false-positive on legitimate fields. — anchors EXT-5, Locked Decisions 4+8.
- [ ] **Reconcile the 12-vs-13 principle drift across entrypoints.** `AGENTS.md:63` and `.codex/AGENTS.md:63` say "The 12 principles below" and stop at Principle 12, while `.claude/CLAUDE.md:31` says 13 and includes P13 (verified at HEAD d2b5b37). When authoring the standard (which relies on P13's doc-work discipline), update both `AGENTS.md` and `.codex/AGENTS.md` to 13 principles + add the P13 row, verifying with grep before/after. This is a narrow cross-entrypoint consistency fix, NOT Principle-13 surgery. — resolves F4 / Codex F4.
- [ ] **#272 merge-back reconciliation is a Planning consideration.** The standard lands on the #272 branch (`chore/session-2026-05-25-a10c82d6`); P13 + the 13-type taxonomy + the re-home exist only on this branch until #272 merges to develop. Keep the `rules.md` edit additive (new section) to minimize merge-conflict surface, and flag the merge-back-to-develop reconciliation of `rules.md`/`AGENTS.md` edits as a Planning/handoff item. — anchors R-1 / Codex O-2.

## Design

Directional decisions (mechanism deferred to Execution). Each is a locked choice with its validation method.

| # | Decision point | Chosen direction | Anchored insight | Validation method |
|---|---|---|---|---|
| D1 | Taxonomy | Keep gobbi's locked 13 types; import Diátaxis **type-purity** as prose guidance only — no re-home of #272's structure. | EXT-1, INT-1 | Manual demo: an evaluator scores a sample doc for single-type-job; type-bleed flagged. |
| D2 | Standard's home | New section inside `memorization/rules.md` (canonical `.gobbi/projects/gobbi/skills/memorization/rules.md`; `.claude/...` is a symlink mirror), extending the existing naming/frontmatter standard. | INT-1 | Section exists in canonical `rules.md`; `.claude/skills/...` symlink reflects it; cross-references the existing standard rather than duplicating it. |
| D3 | Positive quality bar | A dev-doc = a doc a zero-context reader understands end-to-end without the originating session; lead with "what good looks like" + a real before/after table from this tree. | INT-3, EXT-2 | Standard contains a positive definition + before/after examples; no prohibition-only section. |
| D4 | Per-type section contract | ADR-shaped for decisions/design; existing What/Why/Recognize/Corrected for mistakes; Insight/Context/Why/How-to-apply/Counter-cases for learnings; What-happened/What-shipped/Deferred/Decisions-to-respect for notes. | INT-2, EXT-2 | Evaluator runs the section checklist on 3 sample docs → pass/fail per item. |
| D5 | Self-contained prose | No load-bearing vanished-session coordinates in bodies; provenance → frontmatter + one optional "Source" footer. | INT-1, INT-3 | Grep-assistable: `grep -nE 'T[0-9]+-|iter[0-9]|draft-iter|COD-|row-[0-9]'` on promoted bodies returns 0. |
| D6 | **Frontmatter conformance — TYPE-AWARE (FIX-1)** | 100% base schema on P_live_all (208 files); 0 illegitimate staging-key leaks outside `archive/`; one spelling per key. **The strip is a type-aware allowlist, NOT a blanket grep.** See the predicate + key-set immediately below this table. | EXT-3, INT-5 | Type-aware grep gate (D6-predicate); target counts measured (base-schema 100%; illegitimate-leak 0 outside archive; legitimate `disposition`-on-`backlogs/` preserved). |
| D7 | Rollout | Wave-based; mechanical conformance wave FIRST (absorbs the normalization backlog), then per-type prose waves, then the light tier-3 nav wave; each wave verified. | INT-5, EXT-1 | Each wave's verification command passes before the next wave begins. |
| D8 | Enforcement depth | Minimal — at most a mechanical, type-aware grep gate extended to `features/` (verification command, no behavior change); no Principle-13 surgery / new eval perspective. Heavier enforcement deferred. | EXT-5 | Next-session smoke: a freshly authored doc passes the gate with no manual fix. |
| D9 | Narrative handling | Reclassify mislabeled session-journals to `notes/`; never delete; strip inline session-coords from evergreen types only. | INT-4 | Reclassified doc lands in `notes/`; no file deleted (git history shows move/rewrite, not delete). |
| D10 | Scope edge | Exclude frozen `archive/` docs from standard, retrofit, and gate. | (scope ruling) | Grep gate and retrofit waves explicitly skip `archive/`. |

### D6 — FIX-1: the type-aware allowlist strip (file-selection predicate + key-set)

This replaces iter1's unsafe "strip the 64 staging-key leaks." The strip is directional (mechanism deferred to Execution); what is locked is the **predicate** and the **safety invariant**.

**Legitimate-per-type frontmatter, grounded in `rules.md` §2.2 (the per-type extension table):**
- Base keys (all types): `name/description/type/scope/feature/status/created/session/tags`.
- `disposition: open|deferred` is a **LEGITIMATE extension on `backlogs/`** (`rules.md` §2.2 line 110). It is NOT a leak on `backlogs/` and MUST NOT be stripped there.
- `verdict`, `review_kind`, `subject` are legitimate on `reviews/`; `priority`, `domain` on `mistakes/`; etc. — per the §2.2 table. Type-declared extensions are always allowlisted for their type.

**Illegitimate staging-routing key-set S (stripped per `rules.md` §2.3):**
`S = { finding-id, confidence, severity, surfaced-by, promoted-from, promoted-at, mistake-candidate }` — these are session-provenance / eval-routing residue with no legitimate home on any promoted memory doc; `git log` + base `session`/`created` already carry provenance.
Plus the conditional member: **`disposition` is in S ONLY when the file is NOT under a `backlogs/` directory** (i.e. `disposition` as eval-routing residue on a non-backlog type — `rules.md` §2.3 "when used purely as eval routing").

**File-selection predicate P (which files the strip touches):**
> Operate on files in P_live (NOT under `archive/`, NOT under `sessions/`/`skills/`/`agents/`/`tmp/`). For each such file F:
> - strip every key in `S \ {disposition}` unconditionally;
> - strip `disposition` from F **only if F is NOT under a `backlogs/` directory**.

**Safety invariant (locked):** *Never strip a key that is legitimate for that doc's type/dir.* The strip is per-file-type-aware, never a tree-wide `grep -v disposition`. A backlog file that carries BOTH `disposition` (legitimate) AND `finding-id` (illegitimate) — e.g. `features/git-workflow/backlogs/anchor-slug-4-hyphen-vs-2-hyphen.md` — keeps `disposition`, loses `finding-id`/`confidence`/`severity`.

**Measured baseline (HEAD d2b5b37, see Decisions Log § iter2 F1/F2 for commands):** under predicate P, **59 files** carry ≥1 illegitimate key and need the strip; of the 62 files carrying `disposition`, **28 are legitimate backlog files** (preserved) and **35 are non-backlog leak candidates** (stripped); 13 of the 59 leak files are themselves under `backlogs/` but carry a NON-`disposition` illegitimate key (so they need the strip for that key while keeping `disposition`).

## Decisions Log

Every AskUserQuestion outcome from `discussion-log.md`, in order:

1. **Configuration: orchestration mode** — Q: Auto vs Chat. A: Auto. → Session runs in Auto mode. (auto-decide/config)
2. **Configuration: session focus vs PR #272** — Q: merge #272 / new work / work on #272. A: "we will continue the task." → Continue a memory-docs refactor task. (ask:scope)
3. **Ideation: starting point relative to PR #272** — Q: merge then build / build on #272 defer merge / re-judge structure. A: Build on #272 branch, defer merge. → Work inside the #272 worktree; structure + content land together; merge later; #272 re-home + renames NOT re-litigated. (ask:scope+design) — sets Out-of-Scope.
4. **Ideation: scope spine** — Q: primary scope among standard+rewrite / organization+nav / skills+principles. A: cover all three; priority (1) standard + content rewrite [primary], (2) skills/principles [optional], (3) organization & nav. → Three-tier scope with stated priority; iter2 places all three In-Scope (tier 2 capped at the minimal grep gate; tier 3 a light final wave). (ask:scope)
5. **Ideation: scope sequencing (leader reframe)** — Q: conformance-first / prose-first / standard-only. A: Standard + conformance-first, then prose. → Write standard, then retrofit in waves: mechanical conformance wave first, then prose-quality wave. (ask:scope) — sets Locked Decision 1.
6. **Ideation: F1 taxonomy** — Q: keep 13 types + Diátaxis discipline / adopt Diátaxis 4-type. A: keep 13, borrow discipline. → Keep gobbi's locked 13-type set; import Diátaxis type-purity as prose guidance. (ask:design) — sets Locked Decision 2 / D1.
7. **Ideation: F2 rollout** — Q: wave-based conformance-first / big-bang. A: wave-based, conformance wave first. → Bottom-up waves; conformance wave first, each verified. (ask:design) — sets Locked Decision 3 / D7.
8. **Ideation: F3 enforcement depth** — Q: light (P13 pointer + grep gate) / none / full encode. A: "I just said it for avoiding unnecessary change. Don't think deeply." → Keep enforcement MINIMAL — mechanical grep gate at most; avoid Principle-13 surgery unless trivially warranted. (ask:scope; Always-Ask for principle edits → resolved to "avoid unnecessary change") — sets Locked Decision 4 / D8; drives the Deferred backlog.
9. **Ideation: low-stakes leader recs (manager-stated, no objection)** — narrative → reclassify to `notes/`, never delete (anchored to mistake `design-literal-retire-instruction-without-replacement`); fold `feature-dir-frontmatter-full-normalization` into conformance wave 1; exclude frozen `archive/`; standard's home = new section in `skills/memorization/rules.md` (anchored INT-1). (auto-decide; user did not object) — sets Locked Decisions 5+6+7+8.

### iter2 remediation — per-finding crosswalk

The 8 locked decisions and the chosen approach are UNCHANGED. iter2 fixes only the iter1 dual-system findings (Codex F1–F5 + Claude C-1/C-2/C-3/O-1/O-2/R-1/R-2). Commands below were all run THIS dispatch against HEAD `d2b5b37` in worktree `chore/session-2026-05-25-a10c82d6`.

**Codex F1 / Claude C-3 / Claude R-2 (High/Medium — `disposition` misclassified; strip must be type-aware) → RESOLVED IN ARTIFACT.**
- Fixed in Scope Contract (In-Scope tier-1 conformance wave wording + the new Out-of-Scope line forbidding `disposition`-on-`backlogs/` strip), Design D6 + the new "D6 — FIX-1" subsection (explicit file-selection predicate P, illegitimate-key set S, conditional `disposition` membership, safety invariant), Implementation Checklist (type-aware allowlist item + type-aware grep-gate item), and the new "Edge (legitimate-key backlog)" Scenario.
- Grounding read: `rules.md` §2.2 line 110 (`disposition: open|deferred` legitimate on `backlogs/`) + §2.3 line 122 (strip `disposition` only "when used purely as eval routing").
- Command + output (split):
  ```
  $ find $B -name '*.md' -path "*/backlogs/*" -not -path "*/sessions/*" -not -path "*/archive/*" -exec grep -lE "^disposition:" {} \; | wc -l
  28        # legitimate disposition-on-backlogs — PRESERVED
  $ find $B -name '*.md' [P_live filters] -not -path "*/backlogs/*" -exec grep -lE "^disposition:" {} \; | wc -l
  35        # non-backlog disposition — leak candidate
  # true-leak file set under predicate P (S∪conditional-disposition): 59 files; 13 of them are backlogs carrying a NON-disposition illegitimate key
  ```

**Codex F2 / Claude C-1 / Claude O-1 (Medium — numbers not reproducible) → RESOLVED IN ARTIFACT.**
- Population predicate P_live now DEFINED explicitly (Scope Contract § Population predicate). Every headline number recomputed against HEAD d2b5b37 and the exact commands pasted here.
- Commands + outputs:
  ```
  $ git rev-parse --short HEAD
  d2b5b37
  B=.gobbi/projects/gobbi
  $ find $B -name '*.md' -not -path "*/sessions/*" -not -path "*/skills/*" -not -path "*/agents/*" -not -path "*/tmp/*" -not -path "*/archive/*" | wc -l
  208        # P_live_all (README included)
  $ find $B -name '*.md' [same filters] -not -name 'README.md' | wc -l
  191        # P_live_content
  $ find $B -name 'README.md' [same filters] | wc -l
  17         # README index files
  # base-key presence over 208: name 54, description 54, type 106, scope 182, feature 196, status 146, created 80, session 162, tags 70
  # files carrying ALL base keys (full conformance): 50 / 208
  # legacy keys: date 96, slug 36, iter 22, loop 44
  # staging keys: finding-id 36, disposition 62, confidence 39, severity 40, surfaced-by 6, promoted-from 25, promoted-at 25, mistake-candidate 7
  # spelling drift: promoted-from 25 / promoted_from 5; addressed-in 4 / addressed_in 4 / addressed-by 4
  ```
- Success Criterion 2 re-stated against the corrected denominator (208; 50 conformant today) and made type-aware-consistent with F1 (the "0 leaks" target excludes legitimate `disposition`-on-`backlogs/`). The stale "~147 / ~14-25 / 64 leaks / ~15% realized" numbers are all replaced.

**Codex F3 (Medium — tier-2/tier-3 scope not clearly placed) → RESOLVED IN ARTIFACT.**
- Scope Contract In-Scope now explicitly enumerates tier 1 (primary), tier 2 (minimal grep gate only; heavier enforcement Deferred), and tier 3 (light final nav wave, tertiary). The iter1 "folded into the in-scope waves" hand-wave is removed; each tier has its own labeled In-Scope block tracing to Q4's priority order. Implementation Checklist adds the tier-3 nav item. The staged deferred-enforcement backlog already draws the in-scope-grep-gate vs deferred-judgment-check line correctly, so it needs no wording change.

**Codex F4 / Claude C-2 (Medium/Low — 12-vs-13 principle drift) → RESOLVED IN ARTIFACT (as a checklist item).**
- Verified the drift this dispatch: `.claude/CLAUDE.md:31` says "13 principles" + P13 at line 47; `AGENTS.md:63` and `.codex/AGENTS.md:63` both say "The 12 principles" and stop at P12. Added a dedicated Implementation Checklist item to reconcile both `AGENTS.md` files to 13 + add the P13 row when authoring the standard, with grep verification — framed as a narrow cross-entrypoint consistency fix, explicitly NOT Principle-13 surgery (so it does not violate Q8). C-2's separate "12/13/16 type-count" reconciliation is noted as a standard-authoring concern in D1/§2 framing (the artifact's "13" matches `memory-map.md`; the standard must reconcile the §2 enum framing when it writes the per-type section list — a Planning/Execution detail, not an Ideation-contract defect).
  ```
  $ grep -n "principles below\|Principle 13\|NO DOCUMENT WORK" .claude/CLAUDE.md AGENTS.md .codex/AGENTS.md
  .claude/CLAUDE.md:31  The 13 principles below ...
  .claude/CLAUDE.md:47  | 13 | NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN. |
  AGENTS.md:63          The 12 principles below ...
  .codex/AGENTS.md:63   The 12 principles below ...
  ```

**Codex F5 / Claude O-2 / Claude R-1 (Low/Medium — symlink edit target + #272 merge-back) → RESOLVED IN ARTIFACT (as checklist items).**
- Symlink: verified `.claude/skills/memorization/rules.md -> ../../../.gobbi/projects/gobbi/skills/memorization/rules.md` (symlink) with the canonical file present. Added a checklist item + D2 note naming the canonical worktree-absolute path `.gobbi/projects/gobbi/skills/memorization/rules.md` as the Edit/Write target (one edit, mirror auto-reflects), anchored to mistakes `edit-tool-refuses-symlink-paths` + `skills-mirror-symlinks-not-copies`.
  ```
  $ ls -la .claude/skills/memorization/rules.md
  ... .claude/skills/memorization/rules.md -> ../../../.gobbi/projects/gobbi/skills/memorization/rules.md
  ```
- #272 merge-back: added a checklist item flagging that P13 + 13-type taxonomy + re-home exist only on the #272 branch until merge, keeping the `rules.md` edit additive to minimize conflict surface, and naming the merge-back-to-develop reconciliation a Planning/handoff item.

### Reference promotion log
Five external insights staged as reference files (one per confirmed external insight) — unchanged from iter1, all confirmed present on disk:
- EXT-1 → `staging/references/diataxis-type-purity.md`
- EXT-2 → `staging/references/adr-decision-record-shape.md`
- EXT-3 → `staging/references/frontmatter-as-schema.md`
- EXT-4 → `staging/references/markdown-memory-atomicity.md`
- EXT-5 → `staging/references/docs-as-code-linting.md`

Internal insights (INT-1..INT-5) do NOT get reference files — they live in this Decisions Log and the Research Insights / Design rationale.

### Backlog promotion log
- Deferred heavier enforcement (dedicated dev-doc-quality evaluation perspective and/or full Principle-13 quality-facet encoding) → staged at `staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md`. Witness: AskUserQuestion #8 (F3 enforcement depth — "avoid unnecessary change"). The staged backlog already distinguishes the in-scope minimal grep gate from the deferred judgment-check; iter2's FIX-3 tier split is consistent with it, so the backlog wording is left unchanged.
- No new feature-level (task) backlog: the three scope tiers were all placed In-Scope (tier 1 primary; tier 2 capped at the minimal grep gate; tier 3 a light final wave) per Q4 + Q8, so no competing task candidate was deferred. Recorded here per the ideation skill's "log the decision instead" instruction.
- The pre-existing `backlogs/feature-dir-frontmatter-full-normalization.md` is **absorbed** into conformance wave 1 (Locked Decision 7), not re-staged. Its original file-count estimate predates this session's #272 frontmatter work and is superseded by the recomputed 208-file population. Wrap-up will archive/close it when wave 1 ships.
