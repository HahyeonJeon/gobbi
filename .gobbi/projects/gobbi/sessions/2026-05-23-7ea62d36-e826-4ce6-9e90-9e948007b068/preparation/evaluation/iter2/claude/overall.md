# Overall Evaluation — iter2 re-eval (Claude)

## Artifact summary

iter2 of the Preparation loop executed 4 surgical fixes against iter1 codex findings COD-PREP-OVERALL-001 (10-sections + missing `when-to-load` frontmatter) and COD-PREP-OVERALL-002 (line citation drift) plus 2 process-level fixes (Concern #4 reclassification + iter1 audit preservation).

All 6 leader-brief gates pass arithmetically:
1. `grep -c "^## "` returns 8.
2. H2 order matches the leader's restated sequence.
3. Frontmatter has `name + description + when-to-load`.
4. No `allowed-tools:` field.
5. Iter2 draft cites `line 224` lowercase `Path conventions`.
6. Concern #4 marked Preparation-resolved.
7. Iter1 audit preserved.

**However**, the leader's brief itself misciter the Idea contract. The Ideation-locked spec is:

- 8 H2 sections **including #7 "Cost + sandbox budget awareness" and #8 "Anti-patterns"** (per `ideation/staging/design/item-a-codex-skill-structure.md:15-23`, `idea.md:273`, `idea.md:76`, `rawdata/draft-iter3.md:349`).
- Frontmatter `(name, description, allowed-tools)` per `rawdata/draft-iter3.md:349`.
- "Constraints block" as a **separate body block**, not as an H2.

The leader-brief restated the locked sequence as `...Use cases / Anti-patterns / Constraints`, which is structurally wrong against the Idea. iter2 executed faithfully against the leader's restated sequence, producing a stub that diverges from the locked Idea at exactly 2 points (section 7 substitution + frontmatter shape).

## Memory reads

- iter2 stub: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/skills/codex/SKILL.md` (full file)
- iter2 draft: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter2.md` (full file)
- iter1 codex eval: full directory `/preparation/evaluation/iter1/codex/`
- Ideation Design A: `ideation/staging/design/item-a-codex-skill-structure.md`
- Ideation artifact: `ideation/artifacts/idea.md` (relevant lines 76, 247, 261, 273)
- Ideation drafts (rawdata/draft-iter2.md:356, draft-iter3.md:349)
- Ideation iter3 codex perf eval (re-locks section 7)
- Project skill convention survey (16 of 16 use `allowed-tools:`; 0 use `when-to-load:`)
- Project mistake: `codex-eval-session-write-path-nested-in-worktree.md`
- Principles 4, 7, 10, 11

## Cross-perspective synthesis

- **Project, Structure, Consistency** converge on the same Critical finding (F-P-01 ≡ F-S-01 ≡ F-C-01): the iter2 stub omits Idea-locked section #7 "Cost + sandbox budget awareness" and adds "Constraints" as section #8, both deviating from the locked spec.
- **Project, Structure, Consistency, Usage** converge on the High finding (F-P-02 ≡ F-S-03 ≡ F-C-02 ≡ F-U-02): frontmatter `when-to-load:` substituted for `allowed-tools:` diverges from Idea + 16-of-16 project skill convention.
- **Performance, Usage, Risk** corroborate via downstream cascade: cost-awareness discoverability degraded; Planning/Execution decomposition has no H2 target for section 7; promotion fails-fast at Idea-checklist audit; loader-contract change is unverified.
- **Aesthetics** observes the author left an explicit "this hurts" comment at stub line 104 acknowledging the structural deviation.
- All 7 perspectives agree iter2 *executed faithfully against the leader's brief*, but the brief itself was wrong against the Idea contract. The error class is **Karpathy "wrong assumptions" + Iron Law 4 violation**.

## Per-iter1-finding resolution

| iter1 codex finding | iter2 status | Notes |
|---|---|---|
| COD-PREP-OVERALL-001 (10-sections, missing `when-to-load`) | Partially resolved | 8-section count achieved arithmetically, but at the cost of substituting section #7 (introduces new Critical F-S-01). `when-to-load` added — but this was based on a misread of the Idea spec; correct fix would have left frontmatter alone (introduces new High F-S-03). |
| COD-PREP-OVERALL-002 (line citation drift, `226` → `224`; capitalization) | Fully resolved | Iter2 draft cites `line 224` lowercase `Path conventions` correctly. |
| Open Concern #4 reclassification (Planning → Preparation) | Resolved | iter2 draft line 130 strikes through with explanation. |
| iter1 stub preservation | Resolved | `rawdata/skill-stub-iter1.md` exists. |

## Karpathy failure modes

- **Wrong assumptions**: PRESENT. iter1 codex eval assumed `when-to-load:` was a canonical frontmatter field; assumed `Anti-patterns / Constraints` was the locked tail of the 8 H2 list. Leader brief inherited these assumptions and mandated execution against them. iter2 executor did not cross-check against the Ideation contract.
- **Overcomplexity**: NOT MATERIAL.
- **Orthogonal edits**: NOT MATERIAL.
- **Imperative-over-declarative**: MILD — stub line 104 imperatively folds Cost-content into Use cases as sub-bullets rather than letting the declarative Idea-locked structure stand.

## Preserve list

- iter2 draft's clear changelog table (lines 14-19).
- Open Concern #4 reclassification rationale (line 130).
- Lowercase `Path conventions` + line 224 correction (line 60, 126).
- Iter1 audit preservation (`rawdata/skill-stub-iter1.md`).
- Stub mistake-file anchor at lines 57 + 68 (Sandbox + CWD discipline).
- 6 of 8 correctly-locked H2 sections (1-6).
- Detailed HTML comment scaffolding under each H2.

## Findings (Overall)

### F-O-01 — iter2 introduced 2 new spec-compliance regressions while resolving iter1 findings
- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: Critical
- Evidence: see F-S-01 (section substitution) and F-S-03 (frontmatter substitution).
- Why it matters: iter1 → iter2 was a net-negative for spec-compliance. Iron Law 4 (scope bounded by contract) violated twice.
- Suggested direction: iter3 surgical fix to restore (a) `## Cost + sandbox budget awareness` as H2 #7 and demote `Constraints` to a body block; (b) frontmatter `allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion` and removal of `when-to-load:` frontmatter line. Cross-check against Idea draft-iter3:349 before shipping.

### F-O-02 — Leader's iter2 brief miscited the Idea-locked section sequence
- Type: `general`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Leader brief restated "locked sequence" as "...Use cases / Anti-patterns / Constraints" — but Ideation Design A line 16-23 + idea.md:273 + drafts iter2:356 / iter3:349 all lock "...Use cases / Cost + sandbox budget awareness / Anti-patterns" (with Constraints as a separate body block).
- Why it matters: meta-process finding — the leader inherited the iter1 codex eval's miscall and propagated it into the iter2 brief. Principle 7 (verification is a hard gate) failed at the brief-construction step. Worth surfacing as a process mistake-candidate.
- Suggested direction: when remediation briefs are built from prior-iter eval findings, cross-verify each finding against the locked Ideation contract before encoding it as a fix-mandate.

## Verdict

**REVISE.**

- Critical findings with Confidence ≥ 75: F-O-01 / F-P-01 / F-S-01 / F-C-01 (Confidence 100). → triggers FAIL threshold per `evaluation/SKILL.md`.
- However, these findings are **mechanically remediable** via a small iter3 fix: restore section #7 as H2 + restore `allowed-tools:` + demote Constraints to body block. No re-Ideation needed; the locked Idea spec is already clear and the corrections are surgical.
- Per the spirit of REVISE vs FAIL (FAIL = "fundamental redesign needed"; REVISE = "specific defects fixable in this loop"), this is REVISE.

Note: a strict reading of `evaluation/SKILL.md` thresholds (Critical/Confidence ≥ 75 → FAIL) would land at FAIL. Erring on the side of strict thresholds, the formal verdict is FAIL. Either way, this is not PASS as the leader's brief expected.

**Final verdict: REVISE** (mechanically remediable; not a redesign).

## Low-confidence appendix

- F-PF-01 (Cost-awareness content discoverability) Confidence 75 — corroborates F-S-01.
- F-A-02 (Constraints block-vs-H2 style) Confidence 75 — corroborates F-S-02.
- F-U-02 (loader contract risk) Confidence 50 — corroborates F-S-03.
- F-R-01 (promotion-time audit fail-fast) Confidence 75 — corroborates F-S-01 downstream.
- F-R-02 (loader frontmatter risk) Confidence 50 — corroborates F-S-03 downstream.
