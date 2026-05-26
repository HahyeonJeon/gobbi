# Execution Evaluation — naming-guidance (Claude, iter1)

**Target:** commits `f8a89cb..HEAD` (5b5b0d8 guidance, 8e42fe2 renames). Branch `chore/session-2026-05-25-a10c82d6`.
**Phase:** execution. **System:** claude.
**Verification:** git diff/show, grep, file-read close-reading (text-only artifact — no runnable surface).

## Artifact W/W/H
- **What:** P13 naming-clarity clause + rules.md §1.3 reframe + 28 memory-file renames (positional/cryptic → subject-named).
- **Why:** user feedback — memory-file names encode positions/indices/cryptic session-internal refs meaningless to a zero-context reader.
- **How:** P13 short clause defers detail to §1.3; §1.3 gains a positive core rule + category anti-pattern table + good/bad examples; offenders `git mv`'d with frontmatter slug + inbound-ref repoints.

## Stage-2 evaluation by check

### P13 clause (Project / Consistency)
- PASS: clause present at `skills/principles/SKILL.md:373-382`, inserted between Procedure step 4 and Delineation paragraph exactly as design §1 specified. Names subject / dev-vibe kebab / zero-context-readable; defers to §1.3. Matches design intent verbatim.
- PASS: Iron Law text unchanged (`SKILL.md:333` still `NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN.`).
- PASS: Iron Law Index row 13 unchanged (`SKILL.md:33`).
- PASS: `grep -c "## Principle 13"` == 1 (no dup section).
- PASS: diff is a single +11-line hunk; nothing else in the file changed.

### rules.md §1.3 (Project / Structure / Aesthetics)
- PASS: positive core rule added ("stable address that names the concept", zero-context test).
- PASS: anti-patterns table reorganized by failure category, including the two new primary categories (Positional/sequence index; Cryptic internal reference).
- PASS: good/bad examples table added (6 real before/after rows).
- PASS: no hard regex gate reintroduced ("not a hard-enforced blocklist (no regex gate)"); content-word suffixes + date-prefixes still allowed/encouraged.
- PASS: §1.1/§1.2 and §2+ untouched (single diff hunk `@@ -37,24 +37,36 @@`).

### Renames (Project / Aesthetics / Consistency / Risk)
- PASS: 28 `git mv` renames; 0 physical deletes (`grep -c '^D'` == 0); develop tip still 82a5137 (no main-tree leak); no `sessions/` edits in target.
- PASS: frontmatter `slug:` updated to new basename on spot-checked files (worktree-create-before-session-stamp, worktree-first-vs-collapsing-strategies, promote-now-depends-on-worktree-first, 2026-05-23-orch-workflow-improvements); `design-id: D-1` retained as body/frontmatter historical marker per design DECISION 5.
- PASS: inbound-ref repointing executed well across the blast radius — orchestration/SKILL.md (`d-2-qualified-git-rule` → `qualified-git-write-path-rule` ×3), mistakes/*.md, design/session-lifecycle-worktree-boundaries.md (→ worktree-create-before-session-stamp), mirror-policy pair `superseded_by:` frontmatter + prose cross-refs (→ new basenames).

---

## FINDINGS

### F1 — `t2-scope-literal-vs-broader-verifier.md` swaps one positional token for another (self-defeating rename) [High | design_flaw | 100]
- **Domain:** docs-sync (naming convention the change itself introduces)
- **Evidence:** `git diff --name-status f8a89cb..HEAD` shows `reframing-1-2-broader-verifier.md` → `features/agents/discussions/t2-scope-literal-vs-broader-verifier.md`. The brief-specified residual scan returns exactly this file. The new name carries a `t2-` task-code prefix — a positional/sequence-index token that the new §1.3 "Positional / sequence index" category (`task-01`, `task-N`) and the new P13 clause explicitly forbid. Frontmatter was updated to entrench it: `slug: t2-scope-literal-vs-broader-verifier`, `discussion-id: CP-1-2-beta`. The file's actual subject (from its body) is "literal-ask scope vs broader delegation-contract verifier for T2"; a compliant name is `scope-literal-ask-vs-broader-verifier` (drop the `t2-`).
- **Why it matters:** the single most load-bearing acceptance criterion of this change is that the NEW names obey the rule being shipped. Shipping a rename that re-introduces a forbidden positional token in the same PR that bans it is self-contradicting and will be the first thing a reader notices. It also undermines the §1.3 guidance's credibility.
- **Suggested direction:** rename to a subject-only name (e.g. `scope-literal-ask-vs-broader-verifier`) and update `slug:`. (`discussion-id: CP-1-2-beta` is a body-historical marker and may stay, per design DECISION 5 precedent for `design-id`.)

### F2 — Rename sweep covers the full D-family/CP-family the design recommended DEFERRING (~17 files beyond briefed scope) [Medium | assumption_risk | 75]
- **Domain:** process (scope contract, Principle 4)
- **Evidence:** Design §3 "Broader offender family … NOT in the briefed list — manager decision needed" (lines 160-187) and Open Question 1 recommend: keep PR scoped to "briefed 11 + sibling #9b", **defer** the D-family / CP-family sweep to a follow-up backlog. The actual diff renames the entire deferred family: `d-2/d-3/d-4/d-5`, all 6 `d-3-1..d-3-6`, `failure-mode-1-3`, `root-cause-1-2`, `reframing-1-2`, `mechanism-4-1`, `cp-d-1`, `cp-d-2` (18 of the 28 renames are from the deferred set).
- **Why it matters:** the design framed this as an explicit manager/user decision point ("Confirm or expand"). If the manager approved the expansion, this is a non-issue (the expanded names are high quality — `qualified-git-write-path-rule`, `hook-bash-jq-stack`, etc. all name the subject). If NOT approved, this is scope drift past the design's recommended boundary. The executor's transcript would resolve it; the evaluator cannot see an approval record in the contract bundle. Flagging for the manager to confirm the expansion was authorized.
- **Suggested direction:** manager confirms the scope expansion was a deliberate user/manager decision; if so close as `disputed`/`addressed`. The expansion itself is well-executed apart from F1.

### F3 — Three design-flagged inbound refs not repointed; all are historical/frozen records (borderline) [Low | checklist_gap | 50]
- **Domain:** docs-sync
- **Evidence:** Design rows 1/3/10 list inbound refs to repoint. Three remain on old slugs: (a) `notes/2026-05-24-session-foundations-bundle-b.md:34` still cites `reviews/2026-05-24-execution-task-01-dual-system-eval.md`; (b) `features/workflow/changelogs/2026-05-26-bundle-a-rehome.md:24` still cites `2026-05-23-main`; (c) `features/evaluation/discussions/eval-fail-revise-escalation.md:30` still cites `staging/design/d-1-worktree-row-5-5.md` (a prior-session staging path). All three are append-only historical records (a session-completion note, a `git mv` changelog, a frozen prior-session staging pointer) where the old name was correct *at the time recorded* — repointing arguably falsifies history, and the brief explicitly permits "historical/frozen-example/wave-plan hits."
- **Why it matters:** low — these are not live navigation that breaks. But the design's CRUD plan named them as Update operations; if the design intended them repointed, they were missed. More likely they are correctly left as frozen historical mentions.
- **Suggested direction:** confirm intent. If treated as frozen historical records, no action (close `disputed`). The two live repoints that DID matter (orchestration SKILL, design/session-lifecycle doc, mirror pair) were done correctly.

### F4 — §1.3 reframe silently drops old smell row 7 (date-in-an-evergreen-slug) [Low | checklist_gap | 75]
- **Domain:** docs-sync
- **Evidence:** Old §1.3 (`git show f8a89cb:...rules.md`) row 7 = "date in an evergreen slug | `2026-…-design.md` in `design/`". The new category table has no equivalent (the new "Status/version words" row folds old rows 5+6 only). Design §2 executor-note (lines 122-125) claims old rows "1,3,5,6,8,11,12 preserved as categories" — it omits rows 2 (finding-ID) and 7 (date-in-evergreen) from the preserved set, so the drop originates in the DESIGN, not the executor. Row 2 (finding-ID prefix) is reasonably absorbed by the new "Positional/sequence index" category; row 7 (date-in-evergreen) has no home.
- **Why it matters:** low — a real but minor smell (date in an evergreen `design/` slug) is no longer documented, so the guidance is marginally less complete than the prior version on that one axis. Design-inherited, not an execution defect.
- **Suggested direction:** optionally add a "date in an evergreen-type slug" row to the category table (or accept the drop as a deliberate simplification). Design-level, not blocking.

---

## Karpathy / cross-cutting (Overall)
- **Orthogonal edits:** the two commits are cleanly separated (guidance vs renames); no unrelated bundling. PASS.
- **Wrong assumptions:** F1 is a local execution slip, not a faulty premise. The guidance and the bulk of renames are sound.
- **Overcomplexity / imperative-over-declarative:** none — §1.3 states preferences declaratively, no regex gate.

## Must-preserve list
- P13 clause text + placement (exact, matches design).
- rules.md §1.3 positive core rule + category table + good/bad examples (no regex gate).
- The 27 correctly subject-named renames (all except F1's `t2-` file).
- The inbound-ref repointing in orchestration/SKILL.md, mistakes/*, design/session-lifecycle-worktree-boundaries.md, and the mirror-policy pair `superseded_by` frontmatter — all correct.
- 0 physical deletes; develop tip intact; no sessions/ leak; frontmatter slugs updated.

VERDICT: REVISE
