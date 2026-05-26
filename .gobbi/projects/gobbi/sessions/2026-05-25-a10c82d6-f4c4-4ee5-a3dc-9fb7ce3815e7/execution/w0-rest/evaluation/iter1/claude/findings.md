# Claude Adversarial Evaluation — Wave 0-rest standards changeset (iter1)

**Target:** `git diff f425c45..HEAD` — 6 commits (W0-T3..T8), 24 doc files under `skills/`.
**Contract:** design `memory-system-redesign-design.md` §2/§3/§5/§7; locked plan `planning/rawdata/draft-iter1.md` (W0 tasks + W0 grep gate + re-touch guard).
**Method:** every grep / gate / symlink-resolve re-run fresh from cwd `<worktree>/.gobbi/projects/gobbi`; all edited files close-read; claimed edits diffed against design-of-record. No producer claims trusted.

**Scope clarification confirmed:** W0-T1/T2/T9 (+ the W0-T1b "Twelve→Thirteen" intro fix) all landed in base commit `90c46fd` (verified `git log -S` + `merge-base --is-ancestor`). The W0-rest range is therefore T3,T4,T5,T6,T7,T8 = 6 commits. Re-touch guard target files (principles/SKILL.md, .claude/CLAUDE.md, memorization/rules.md sibling, 5 delegation files) correctly ABSENT from the W0-rest diff.

---

## Project (design fidelity — substance, not keyword)

[PASS-NOTE | general | CONFIDENCE 95] PJ-A1 — memory-map.md (W0-T3) implements its §7 #3 target in substance. Verified: `session.json.lock` row added at session-root table (grep ==1); 13-row per-type canonical-homes table present (sed count == 13) matching §2 scopes (decisions/design/references/backlogs/mistakes = Both; notes/rules/learnings/reviews/reports = Project-only; plans = feature-only-loop + maintainer-project; archive = typed); archive row rewritten to `archive/{type}/{YYYY-MM-DD}-{slug}` with original-type-preserved (grep `archive/{type}` ==2; no stale `archive/{slug}`); project `plans/` row reworded to maintainer-authored / NOT-loop-written (HIGH-4); FLAG-1 skills/-placement deferral note present (grep ==1). — evidence: skills/memorization/memory-map.md:31, :73-94, :133, :139.

[PASS-NOTE | general | CONFIDENCE 95] PJ-A2 — memorization/SKILL.md (W0-T4) implements §7 #5 + §3.2/§3.3 in substance: a new "Staging-field stripping on promotion" section (mistake-candidate + finding-id/disposition/promoted-from/promoted-at, promoted file = base+extension only); "Per-perspective evaluation file naming + Execution per-task quartet" section with the bare 7-vocab and the quartet contract; rules.md cross-ref added to the intro. — evidence: skills/memorization/SKILL.md:140-160.

[PASS-NOTE | general | CONFIDENCE 95] PJ-A3 — wrap-up/SKILL.md (W0-T6) implements §7 #6 + §5.3: a per-type frontmatter-allowlist-on-promotion table (4 staging-only fields with strip dispositions incl. promoted-from/promoted-at dropped), an archive typed-subdir-routing subsection (original type preserved), and a non-standard-subdir cleanup subsection (no followups/, fold restore/→rawdata, remove tmp/) scoped going-forward + opportunistic (no retro-sweep, RATIFY-7). — evidence: skills/wrap-up/SKILL.md:276-310.

[PASS-NOTE | general | CONFIDENCE 90] PJ-A4 — gobbi/SKILL.md + evaluation/SKILL.md + mistake/SKILL.md (W0-T8) all implement their §7 #10/#11/#12 targets: 7-value-feature table + "install-runtime documented not a skill" + FLAG-2 dangling-claude-skill repoint + "12→13 Iron Laws" prose; evaluation 7-vocab declared the single source for eval filenames (Codex divergent vocab named non-canonical); mistake-candidate documented staging-only + stripped. — evidence: skills/gobbi/SKILL.md:23,185,196-210; skills/evaluation/SKILL.md:98; skills/mistake/SKILL.md:98.

---

## Structure / Consistency

[PASS-NOTE | general | CONFIDENCE 95] ST-1 — All 17 templates carry correct base+extension frontmatter per §5/§2 (verified per-template grep of type/scope/feature/status + extensions): decisions(decision_status, scope both), mistakes(priority/domain, scope both), backlogs(disposition open|deferred, status active|closed, shipped_in, scope both), notes(scope project, feature null, features_touched), learnings(scope project), rules(scope project + stub-redirect-TARGET reword), design(scope both), references(ref_type), plans(scope feature loop-path), reviews(verdict/review_kind, scope project), reports(report_type, scope project), scenarios/checklists/discussions(scope feature). 16 of 17 carry full base + a rules.md naming pointer; archive.md correctly omits base (documents archival-delta fields only). — evidence: per-template grep, all 17 files.

[PASS-NOTE | general | CONFIDENCE 100] ST-2 — archive.md has NO static `type: archive` literal (W0 gate `grep -c "^type: archive" == 0` PASS), and an explicit note states the `type:` field is never rewritten on a move. feature-readme.md carries `value_proposition` + `scope: feature` self-reference + drops the 5 sprint keys + cap-20 Recent-activity note. templates/rules.md carries "stub-redirect TARGET" reword (gate PASS). — evidence: skills/memorization/templates/archive.md, feature-readme.md:16,78, rules.md.

[MEDIUM | design_flaw | CONFIDENCE 90] ST-3 — **changelogs.md template introduces a project-scope variant that contradicts the design AND the frozen rules.md sibling it cross-references.** W0-T5's changelogs.md adds a second block "Item template — project-level (per-session)" with `scope: project`, `feature: null` (skills/memorization/templates/changelogs.md:70-86). But design §2.14 + §1.2 NOTE state changelogs "exist ONLY as `features/{f}/` subdirs," and the SHIPPED `rules.md` sibling (90c46fd, frozen) §2.1 states the four feature-subdir-only types (incl. changelogs) "**always carry `scope: feature`**" (skills/memorization/rules.md:81-82, :125). The memory-map (W0-T3, this changeset) lists changelogs only at `{loop}/staging/changelogs/` and `features/{feature-name}/changelogs/` — NO project-root changelogs row (skills/memorization/memory-map.md:60,117,163). A future agent reading changelogs.md would author a `scope: project` changelog that rules.md forbids and the memory-map has no home for. This is an internal contradiction the changeset itself introduced (template vs frozen-sibling vs memory-map). — evidence: changelogs.md:78-81 vs rules.md:81,125 vs memory-map.md (no project changelogs row).

[LOW | general | CONFIDENCE 70] ST-4 — reviews.md template `review_kind` enum (`adversarial-review|ultrareview|code-review|retrospective|security-audit|license-audit|dep-audit|other`) is a richer set than design §5.2's `adversarial|code|audit|retrospective`. This is a defensible expansion (the design summary table is non-exhaustive), not drift, but it is undocumented divergence from the design-of-record's stated enum. Surface for the manager to confirm the expansion is intended. — evidence: skills/memorization/templates/reviews.md:67.

---

## Performance

[PASS-NOTE | general | CONFIDENCE 85] PF-1 — Doc-only changeset; no runtime/perf surface. The added per-type homes table + allowlist table + canonical-tree block are scan-cheap reference material co-located in the skills that consume them (memory-map, wrap-up, orchestration), reducing cross-file lookup cost for future agents. No oversized inline duplication: the naming/frontmatter standard stays in rules.md and is cross-referenced, not copied, into SKILL.md/wrap-up/mistake (DRY respected). No finding.

---

## Aesthetics

[LOW | general | CONFIDENCE 100] AE-1 — Two cross-reference link texts render with an orphaned backtick and an incomplete section number: `[`memorization/rules.md` § 2`](../memorization/rules.md)` in wrap-up/SKILL.md:278 and mistake/SKILL.md:98. The link TARGET (`../memorization/rules.md`, no anchor) resolves fine — so the link is not broken — but the visible text shows "§ 2`" instead of the intended "§ 2.x". Cosmetic. — evidence: skills/wrap-up/SKILL.md:278, skills/mistake/SKILL.md:98.

---

## Usage (would a future agent be misled?)

[MEDIUM | design_flaw | CONFIDENCE 88] US-1 — (same root as ST-3, usage lens) An agent bootstrapping a feature's `changelogs/` from changelogs.md would encounter two sanctioned templates — feature-scope and project-scope — and could reasonably author a project-root `changelogs/{slug}.md`. rules.md (the authoritative standard) forbids it ("always scope: feature") and Wrap-up's routing table has no project-changelogs destination. Result: a file the standard rejects and Wrap-up cannot route. This is the precise "type-confused content / silent drift" failure Principle 13 exists to prevent — introduced inside a P13-governed changeset. — evidence: changelogs.md:78 vs rules.md:81/125 vs memory-map routing.

[PASS-NOTE | general | CONFIDENCE 90] US-2 — No other internal contradiction found. memory-map archive row, wrap-up archive-routing subsection, and templates/archive.md agree (typed subdir, original type preserved, move-on-terminal). The three-way `rules` disambiguation (rules.md SKILL doc ≠ templates/rules.md ≠ rules/ memory type) is preserved across the touched files; mistake/SKILL.md, wrap-up, and memorization all point to `memorization/rules.md` (the sibling) and templates/rules.md is referenced only as the TYPE template. Cross-ref anchors resolve: evaluation→memorization `#per-perspective-evaluation-file-naming-the-execution-per-task-quartet` matches the heading; orchestration `#state-persistence` matches `### State persistence`. — evidence: grep of anchors + headings.

[PASS-NOTE | general | CONFIDENCE 100] US-3 — Symlink integrity intact. Full sweep `for f in $(find ../../../.claude/skills -type l); do readlink -e ...` emits zero BROKEN. Edited templates are canonical real files (`-rw-`); `.claude/skills/memorization/templates/decisions.md` is a symlink into canonical — so single-edit propagation holds (mistake `skills-mirror-symlinks-not-copies` correctly observed; no double-edit, no physical copy). — evidence: symlink sweep silent; ls -la.

---

## Risk

[PASS-NOTE | general | CONFIDENCE 100] RK-1 — Re-touch guard HOLDS. `git diff --name-only f425c45..HEAD | grep -E "principles/SKILL|CLAUDE.md|memorization/rules.md|delegation/"` → NONE. The frozen-at-90c46fd files are untouched; no duplicate `## Principle 13` (grep ==1, NOT 2 — corruption guard passes). — evidence: diff name-only grep.

[PASS-NOTE | general | CONFIDENCE 100] RK-2 — Scope respected. No W1-W5 memory files (mistakes/, rules/stub-redirect, backlogs/, features/, design/, learnings/, sessions/) touched — entire diff is confined to `skills/` (`git diff --name-only | grep -v skills/` → empty). No Principle-4 scope drift. — evidence: diff name-only grep.

[LOW | assumption_risk | CONFIDENCE 60] RK-3 — W0-T7's declared scope included `orchestration/workflow/*.md`, but no workflow/*.md file was edited. Verified defensible: `grep -rln state.json skills/orchestration/workflow/` → none, and the canonical-tree block belongs in SKILL.md (its correct home). The omission is not a gap. Flagged only so the manager confirms no workflow child-doc references the old session shape that should have been updated. — evidence: no state.json in workflow/; workflow/ absent from diff.

---

## Overall (cross-perspective synthesis + the state.json adjudication)

[HIGH | design_flaw | CONFIDENCE 90] OV-1 — **The state.json decision is CORRECT; the design's §7 #7 "retire state.json" instruction is the defect, and the executor rightly did not follow it.** Adjudication with fresh evidence:
  - The orchestration skill treats `state.json` as the LIVE workflow state-machine file, distinct from `session.json` (telemetry). This machinery PRE-EXISTS the changeset: base commit f425c45 already had 5 `state.json` refs — row 5.5 initializes it from `templates/state.template.json` (file EXISTS on disk, 815 bytes), the `### State persistence` section (orchestration/SKILL.md:342-354) defines manager-maintained per-transition updates + /clear recovery, and the Workflow Status Display is "a projection of the session's state.json" (:247).
  - `session.json` is a DIFFERENT file: per-session telemetry, manager-init row 6 + assistant UPSERT, no live `phase`/`state` transition semantics. It is NOT a drop-in replacement; retiring state.json would orphan row 5.5, the state.template.json, the State persistence section, and the status-display projection with no home for live workflow state.
  - The design's §3.4 "state.json is Legacy/retired per MEMORY.md (PR-FIN-2a-iii)" is a MISREAD: PR-FIN-2a-iii retired the OLD SQLite-era state.json/state.json.backup/metadata.json; the current markdown-driven architecture RE-INTRODUCED state.json as the state-machine file. The executor's W0-T7 edit ADDED state.json to the new canonical-tree block consistent with the live machinery — the right engineering call (well-witnessed: the live orchestration design + the existing template).
  - **Consequence for the verdict:** the executor deviated from a literal plan instruction (`verifies: grep -rc state.json skills/orchestration/ shows only retired/historical mentions`). The W0-T7 verify line as written is UNSATISFIABLE without breaking the skill — and indeed the changeset's state.json mentions are active/canonical, not "retired/historical." This is a design/plan defect that the manager must adjudicate with the user (ratify keeping state.json + correct design §3.4/§7 #7 + the W0-T10 gate expectation), NOT an executor error. Severity High because it is a documented-contract divergence requiring user ratification before the standard is declared final; Confidence 90 because the live machinery is unambiguous on disk. — evidence: orchestration/SKILL.md base-vs-HEAD state.json refs (5 in base), :103 row 5.5, :247, :302, :312, :342-354; templates/state.template.json EXISTS; design §3.4/§7 #7; plan W0-T7 verifies line.

[MEDIUM | design_flaw | CONFIDENCE 90] OV-2 — (elevates ST-3/US-1) The changelogs project-scope template variant is the one substantive content defect in the deliverable: a self-introduced internal contradiction (template vs frozen rules.md sibling vs memory-map) inside a Principle-13 changeset whose whole point is preventing type-confusion and silent drift. Either the project-scope block is removed from changelogs.md, OR the design + rules.md + memory-map are amended to sanction a project-level per-session changelog — a user decision. Not Critical: it is additive (does not corrupt existing files) and the dominant feature-scope template is correct.

[PASS-NOTE | general | CONFIDENCE 100] OV-3 — W0 grep gate suite re-run fresh: ALL GREEN. `## Principle 13`==1; `Thirteen principles`==1; `Twelve principles`==0; CLAUDE.md `13 principles`>=1; rules.md sibling + symlink resolve; `session.json.lock` in memory-map; `archive/{type}` in memory-map; `memorization/rules.md` in all 4 delegation templates (>=4); `stub-redirect TARGET` in templates/rules.md; memorization symlink loop silent. — evidence: gate suite output.

### Must-preserve list (remediation must NOT break)
1. The 13-row per-type canonical-homes table in memory-map.md and its scope column (matches §2 exactly).
2. The archive typed-subdir model coherence across memory-map + wrap-up + templates/archive.md (no static `type: archive`).
3. The bare-7-vocab eval-filename canon, consistently stated in memorization/SKILL.md + orchestration/SKILL.md + evaluation/SKILL.md (single-source in evaluation).
4. The three-way `rules` disambiguation preserved across all touched files.
5. The state.json live-machinery documentation in orchestration (do NOT retire it during remediation — see OV-1).
6. Symlink-single-edit integrity (canonical real files + .claude symlinks; zero broken).
7. Re-touch-guard cleanliness (frozen 90c46fd files stay out of any remediation diff except a deliberate design §3.4/§7 #7 correction).

### Verdict rationale
No Critical. OV-1 (state.json) is High/conf-90 but is a design/plan-contract divergence requiring USER RATIFICATION, not an executor implementation error — it meets the REVISE threshold (any High ≥50 → REVISE) because the deliverable cannot be declared the final target shape until the design §7 #7 / §3.4 conflict and the W0-T7 verify expectation are reconciled with the user. OV-2/ST-3/US-1 (changelogs project-scope) is an independent Medium contradiction also warranting a fix-or-ratify decision. Everything else PASSES with strong fresh evidence.

VERDICT: REVISE
