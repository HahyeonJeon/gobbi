# W0-rest iter2 — Claude-side confirmation (memory-redesign)

**Target:** iter2 remediation commit `2f86cb1` (6 files) + full-wave `f425c45..HEAD` regression sweep.
**Standard:** `skills/memorization/rules.md` (frozen sibling), design-of-record §2/§3.4/§5.2/§7, `skills/evaluation/SKILL.md`.
**Stance:** adversarial confirmation. Verified with Read/Grep/Bash, not the producer's claims.

## Memory reads
- `skills/principles/SKILL.md` (P13 present), `skills/evaluation/SKILL.md` (finding schema), `skills/memorization/rules.md` (the standard).
- design-of-record §2.5/§2.9/§2.11/§2.14, §3.4, §5.2-equivalent (§2.2 in rules), §7 #7.
- Cross-refs: `skills/orchestration/SKILL.md`, `skills/wrap-up/SKILL.md`, `.claude/CLAUDE.md`.

---

## Finding-1 — COD-CONS-001 / OV-1 (state.json KEEP) — CLOSED
**[Low|general(docs-sync)|100]** — Confirmed CLOSED.
- `orchestration/SKILL.md` still treats `state.json` as the live workflow state-machine: row-5.5 init from `templates/state.template.json` (L103), Workflow Status Display projection (L247), session-tree entry (L302), session-root files (L312), § State persistence (L344/348), session.json archival of `iter` (L455). Unchanged, correct.
- Design-of-record carries a **dated CORRECTION** at §3.4 (the `state.json at session root` row, L268, inside §3.4 "Non-standard subdirs", header L262) AND at §7 #7 (L460). Both dated `2026-05-26 (user-ratified)`, both retract the "retire state.json" disposition.
- Originals **preserved** via `~~strike-through~~` (not deleted); 9 `~~` markers present.
- `grep -ci CORRECTION` on the design = **3** (≥2 required). The §7 #7 reference to "§3.4 CORRECTION" resolves correctly (line 268 is within §3.4).

## Finding-2 — COD-CONS-002 / OV-2 (template scope/routing) — CLOSED
**[Low|general(docs-sync)|100]** — Confirmed CLOSED.
- `changelogs.md`: `grep -c "scope: project"` = **0**. The invented project-level/per-session changelog variant + its item template + the project-level naming example are removed. New text routes the session roll-up to `notes/{date}-{slug}.md` (not a changelog) and declares `changelogs/` feature-subdir-only — consistent with `wrap-up/SKILL.md` L145/L162/L266/L272 and rules.md §3.
- `mistakes.md`: documents feature-scoped mistakes at `features/{feature-name}/mistakes/`, explicitly states a feature-specific trap lives in the feature's own subdir "NOT in the project `mistakes/` with a `feature:` tag" — matches design §2.5 (Scope=Both, default project) and rules.md §3 Both-type.
- `references.md`: documents feature-level default (`scope: feature`) with rare project-level promote-up — matches design §2.9 and rules.md §3 Both-type.

## Finding-3 — COD-CONS-003 (frontmatter allowlist) — CLOSED
**[Low|general(docs-sync)|100]** — Confirmed CLOSED.
- Non-allowlist fields GONE from frontmatter (line-start key grep returns none): `changelogs task:`, `references related:`, `scenarios category:/coverage:`, `reviews reviewer:/perspectives:/related_reports:/related_decisions:`.
- Each relocated to **body**: changelogs `**Task:**` (L51); references `## Related` (L62); scenarios `**Category:**`/`**Coverage:**` (L54/55); reviews `## Related` (L107) + Lifecycle prose updated to cite body `related_decisions`/`related_reports`.
- Every remaining frontmatter key validated against rules.md §2.2 / design:
  - changelogs = base + `shipped_in` — **sanctioned** by design §2.14 ("Frontmatter: base + `shipped_in`"). Not a §2.2-row type (feature-subdir-only), but the extension is design-listed. OK.
  - references = base + `title/source/accessed/ref_type` — matches §2.2 references row.
  - scenarios = base only — matches §2.14 ("Frontmatter: base"); no §2.2 extension row exists. OK.
  - reviews = base + `verdict/review_kind/subject` — matches §2.2 reviews row (L99) and design §2.11.
- Frozen `memorization/rules.md` sibling **untouched** (not in iter2 diff, not in wave diff).

---

## W0 grep gate (re-run)
- P13 in `principles/SKILL.md` = **1**; `Thirteen` = **1**; `Twelve` = **0**. PASS.
- `.claude/CLAUDE.md`: `| 13 |` row = 1, "13 principles" = 1, "12/11 principles" = 0. PASS.
- `session.json.lock` documented in `orchestration/SKILL.md` = 2 occurrences. PASS.
- `archive/{type}` typed-subdir routing in `templates/archive.md` = 4 occurrences. PASS.
- stub-redirect TARGET re-scope wording present in `templates/rules.md` (L32). PASS.
- Symlinks `.claude/skills/memorization/{SKILL.md,rules.md,memory-map.md}` all resolve; `find .claude -xtype l` = 0 broken. PASS.

## Re-touch guard (`git diff --name-only f425c45..HEAD`)
- EXCLUDES all forbidden paths: `principles/SKILL.md`, `.claude/CLAUDE.md`, `memorization/rules.md` sibling, `skills/delegation/`, `agents/`. GUARD HOLDS.
- iter2 (`2f86cb1`) touched exactly **6** files, all in declared scope (design-of-record + 5 templates). No scope creep.

## NEW-regression check (introduced by 2f86cb1)
- None. The changelogs Wrap-up-routing change made the template MORE consistent with `wrap-up/SKILL.md` (journal→notes/, changelogs→feature). Anchor links (`rules.md#21...`, `#22...`) resolve to real headers (L63, L83). No broken internal links, no contradictory claims, no data loss in body relocations.

## Must-preserve
- The dated strike-through CORRECTION pattern in the design (originals preserved, not deleted) — exemplary supersede-not-delete discipline; a future REVISE must not "clean up" the struck text.
- The body-relocation-with-rationale pattern ("so Wrap-up's allowlist strip cannot drop them") — keep the explanatory rationale, not just the moved field.
- changelogs session-rollup→`notes/` routing correction — do not reintroduce a project-level changelog.

VERDICT: PASS
