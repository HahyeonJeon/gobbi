# Consistency — Ideation eval (iter1, claude)

## Artifact Summary + Memory reads
(see project.md)

## Locked Frame (Stage 1)
**S1 — Scope Contract, Framed Problem, Design describe the same problem.** Checks: phrasing matches across restatements; Design solves the framed problem.
**S2 — Every Design decision is consistent with the research insight it cites.** Checks: cited INT/EXT IDs exist; cited insight says what the design claims.
**S3 — Scenarios and Implementation Checklist are aligned.** Checks: each checklist item anchored to a scenario; each scenario has a verifying checklist item.
**S4 — No synonym drift across sections.** Checks: same term in Scope Contract == Design.
**S5 (adversarial) — Internal vs external research conflict left unresolved.** Checks: where INT (keep 13 types) tensions EXT (Diátaxis 4 types), the artifact states which prevails.
**S6 — Faithfulness: the 8 locked decisions + quantitative claims trace to ground truth with no drift** (brief's primary focus). Checks: each locked decision matches discussion-log; each quantitative claim (~147 / ~14-25 / 64 leaks / per-key counts / cryptic-body refs) is reproducible via fresh grep; standard EXTENDS rules.md/P13 not contradicts.
**S7 — Cross-artifact sync: reference-promotion log matches files on disk; backlog absorption is coherent.** Checks: 5 EXT → 5 staged reference files exist; deferred backlog staged; absorbed backlog identified.

## Per-scenario per-check results
- S1 YES — Scope Contract, Framed Problem root cause (line 53), and Design all describe the same "no intra-doc quality standard" problem. No drift.
- S2 YES — every Design decision cites INT-1..5 / EXT-1..5; I confirmed all 5 EXT reference files exist on disk with matching titles/sources; INT anchors point to real files (rules.md, the two mistakes, the normalization backlog). No over-citation detected.
- S3 YES — Implementation Checklist items (lines 99-106) each carry "anchors ..." back to insights + Success Criteria; the three Scenarios each have corresponding checklist coverage (Golden→section-contract+frontmatter checks; Edge→de-crypt; Failure→reclassify-to-notes).
- S4 YES — terms ("conformance wave", "prose wave", "staging-key leaks", "self-contained prose", "13 types") stable across sections.
- S5 YES — the INT(keep 13)/EXT(Diátaxis 4) tension is explicitly resolved: D1 + discussion-log Q6 keep the 13 types and import Diátaxis as PROSE guidance only. Conflict named and adjudicated.
- S6 — see findings C-1 (quantitative drift), C-2 (12-vs-13 framing), C-3 (disposition leak over-count). The 8 locked decisions THEMSELVES are faithful: I mapped all 9 discussion-log outcomes to Scope-Contract/Decision entries — every locked decision (sequence, taxonomy, rollout, minimal enforcement, home, narrative→notes, backlog absorption, archive exclusion) has a discussion witness, and no unapproved design content was added. The standard EXTENDS rules.md (new section, D2) and does NOT edit P13 (D8) — confirmed against the worktree's `principles/SKILL.md` (P13 present, line 331) and `rules.md`.
- S7 YES — reference-promotion log (lines 141-145) lists 5 files; all 5 exist under `staging/references/`. Deferred-enforcement backlog staged at `staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md` (confirmed). Absorbed backlog `feature-dir-frontmatter-full-normalization.md` identified as fold-in (line 152).

## Typed findings

### C-1 — Quantitative claims (~147 docs; ~14-25 base-frontmatter) understate the measured population
- Type: `general` · Domain: `docs-sync` · Disposition: open · Confidence: 75 · Severity: Medium
- Evidence: fresh `find ... -name '*.md'` over the content scope (features + project content dirs, excluding archive/skills/agents/sessions) returns **223** docs (208 also excluding tmp/), not ~147. Base-schema `name:` appears on **56** files (via `find -exec grep -lE '^name:'`), not ~14-25. The per-key legacy counts ARE close-to-exact (date 95→101, slug 36→37, iter 23→24, loop 46→49, finding-id 39→39, confidence 42→42, severity 43→43, surfaced-by 7→7), so the artifact's grep methodology is sound but the two headline denominators/numerators are off. The artifact may have measured on the un-retrofitted #272 baseline before this session's naming/frontmatter commits (HEAD d2b5b37 already shipped 28 renames + frontmatter work), but it does not state its measurement baseline.
- Why it matters: Medium — Success Criterion 2 sets a target of "100% base schema on live docs"; if the true population is ~223 (not ~147) the conformance-wave EFFORT is ~50% larger than the artifact implies, and the "~15% realized" framing (aesthetics A-1) misstates the gap. A Planner sizing wave1 from these numbers will under-scope.
- Suggested direction: re-measure on the locked scope at Planning time and state the baseline commit; update the denominator and the "~15%" framing.

### C-2 — "13 types" vs rules.md "12 promotable + 4 feature-subdir-only" framing could confuse the standard's own boundary
- Type: `general` · Domain: `docs-sync` · Disposition: open · Confidence: 50 · Severity: Low
- Evidence: the artifact says "keep gobbi's locked 13 memory doc types" (D1, line 32/114). `memory-map.md` line 73 says "the 13 project-memory types" (consistent). But `rules.md` §2.1/§2.2 frames the frontmatter `type` enum as "**12 promotable** content types" + "four feature-subdir-only types" (= 16 distinct type values) with `archive` as a destination. So three different counts (12 / 13 / 16) describe overlapping-but-not-identical sets across the two canonical docs.
- Why it matters: Low for the Ideation contract (the artifact's "13" matches memory-map and is not wrong), but the NEW standard will state a per-type section contract — it must pick a type list that reconciles the 12/13/16 framings or it will inherit the ambiguity.
- Suggested direction: when authoring the standard, reconcile against both rules.md §2 and memory-map.md §73 so the section-contract type list is unambiguous (does it cover the 4 feature-subdir-only types? archive?).

### C-3 — "64 staging-key leaks" conflates genuine leaks with the legitimate backlog `disposition` extension field
- Type: `general` · Domain: `docs-sync` · Disposition: open · Confidence: 75 · Severity: Medium
- Evidence: the artifact counts `disposition` 52× among the "64 staging-key leaks ... that rules.md §2.3 mandates stripping" (line 54). But rules.md §2.2 line 110 declares `disposition: open|deferred` a **legitimate extension field on the `backlogs/` type**, and §2.3 only mandates stripping `disposition` "when used purely as eval routing" — NOT on backlogs. My grep: `disposition:` appears on 66 content files, of which **28 are under backlogs/** (legitimate) and 38 are non-backlog (true leak candidates). So the conformance-wave grep gate, as framed, would flag legitimate backlog `disposition` fields as leaks.
- Why it matters: Medium — if wave1's mechanical strip is built from a naive `grep disposition` it will corrupt legitimate backlog frontmatter (a `disposition`-stripping false positive). The standard/gate must distinguish "leak" (eval-routing key on a non-backlog type) from "legitimate per-type extension" (disposition on backlogs).
- Suggested direction: the conformance grep must be type-aware — exclude `backlogs/` for `disposition`, and only strip eval-routing keys (finding-id, surfaced-by, confidence/severity on non-review types). Same caution for `confidence`/`severity` on `reviews/` if any are legitimate.

## Per-perspective verdict: REVISE
The 8 locked decisions are faithfully encoded and internally coherent — the design is sound. But two Medium/75 evidence-integrity findings (C-1 population undercount; C-3 disposition-leak conflation) mean the quantitative basis a Planner will size and a grep gate will enforce is not yet trustworthy. These are correctable at Ideation or early Planning and do not change the chosen approach.

## Low-confidence appendix
(none)
