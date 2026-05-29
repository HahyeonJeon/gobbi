# T7 evaluation — project perspective (iter1)

**Target:** `.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md`

**Perspective:** project — alignment with gobbi memory standard + plan T7 contract.

## Stage 0–1: Frame
- Plan T7 success criteria (5): file path, frontmatter shape, both paths cited, defer language, subject-descriptive slug.
- Governing standards: `memorization/rules.md` §§1.1–1.3, 2.1–2.2, 4.1–4.4; `backlogs/` row of §2.2 status model.

## Stage 2: Per-criterion
| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | File exists at expected path | PASS | `ls` returns 3231-byte file at `.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md`. |
| 2 | Frontmatter conforms to backlog template | PASS | Base 9 keys present (name/description/type/scope/feature/status/created/session/tags). Backlog extensions: `disposition: open` (legitimate per §4.4 conditional). Project/title/anchor_session are KEEP-list per §4.4. `status: active` matches §2.2 backlogs values. |
| 3 | Both source-of-truth paths cited | PASS | `delegation/SKILL.md` appears 7×; `settings.default.json` appears 7×. Both at lines 23-24 with explicit inversion call-out. |
| 4 | Body explicitly defers | PASS | Dedicated `## Why deferred` section (line 32), description field repeats it, tag `deferred` present. |
| 5 | Subject-descriptive slug (§1.3) | PASS w/ minor smell | Slug names the *concept* (model-assignment drift between two named sources), not a position/index/iteration token. §1.3 anti-pattern table not triggered. Length ~53 chars exceeds §1.1's ~35-char guideline — see Finding F1. |

## Findings
**F1** — Type: `general` · Domain: `docs-sync` · Disposition: `open` · Confidence: 50 · Severity: Low
- Evidence: slug `model-assignment-drift-delegation-vs-settings-default` is 53 chars / 7 hyphen-tokens vs §1.1 rule 2 "≤6 words, ≤~35 chars".
- Why it matters: §1.1's length rule is a *preference*, not a gate; the slug remains subject-descriptive (passes §1.3 smell tests). A tighter slug (e.g., `model-assignment-drift`) would still be unique in `backlogs/`.
- Suggested direction: leave as-is or shorten; user-decision, not blocking.

## Verdict
**PASS** — All 5 plan criteria satisfied with tool-verified evidence. F1 is a low-severity preference smell, well below REVISE threshold.
