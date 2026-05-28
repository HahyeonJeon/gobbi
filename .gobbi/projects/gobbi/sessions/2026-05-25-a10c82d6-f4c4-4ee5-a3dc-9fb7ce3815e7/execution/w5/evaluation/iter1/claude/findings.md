# Wave 5 Execution Evaluation — Claude-side (iter1)

**Target:** Wave 5 commits `69d1a7a..HEAD` (b1791f7 W5-T1, 5379917 W5-T2, 9e2e42b W5-T3)
**Perspective:** execution-eval (Claude)
**Branch verified:** chore/session-2026-05-25-a10c82d6 @ 9e2e42b
**Verdict computed by:** evaluation/SKILL.md threshold rules

---

## W5-T1 — Follow-up backlogs

- **FLAG-1** (`backlogs/skills-agents-canonical-location.md`) and **FLAG-2** (`backlogs/claude-doc-standard-skill-missing.md`) PRE-EXIST: both committed at f425c45 (wrap-up promotion), present in tree at 69d1a7a. NOT touched in the W5 diff. No duplication. [PASS]
- **FLAG-3** backlog (`backlogs/stub-redirect-dangling-claude-skill-ref.md`) FILED. Claim verified: `rules/stub-redirect-format.md:90` does carry the dangling `See _claude/SKILL.md ...` ref (also referenced at line 70). Backlog correctly marks it dependent on FLAG-2. Full base frontmatter + `project-scope: true` + `disposition: open` + `status: active` present. [PASS]
- **feature-dir-frontmatter-full-normalization** backlog FILED. Full base frontmatter + `project-scope: true` + `disposition: open` present. Accurately documents the W3 scope boundary and the Final-Gate `features/` exclusion. [PASS]
- Both new backlog files begin with `---`. [PASS]

## W5-T2 — Mistake reword

- `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` reworded to center WORKTREE BRANCH-ISOLATION + worktree-absolute path. grep confirms `branch-isolat`, `worktree-absolute`, and cross-link `skills-mirror-symlinks-not-copies` all present. [PASS]
- `status: active` confirmed (line 7). [PASS]
- File NOT moved — still single-homed in `mistakes/` (the second find-hit is the original session-staging copy, expected and unrelated). [PASS]
- Cross-link target `mistakes/skills-mirror-symlinks-not-copies.md` EXISTS — link is live, not dangling. The "Separate concern" block cleanly disambiguates branch-isolation (this file) from the symlink mirror (the linked file). [PASS]

## W5-T3 — Blocklist softening

- `rules.md` §1.3 header changed from "Slug anti-pattern blocklist (FORBIDDEN in any slug)" to "Slug naming preferences (descriptive concept slugs strongly preferred)". New prose explicitly states the patterns are "smells / preferences, not a hard-enforced blocklist" and that content-word suffixes (`-decisions`, `-discussion`, `-references`) are ALLOWED. Table column headers softened (Forbidden→Anti-pattern (smell); Fix→Preferred instead). Descriptive-naming intent preserved. Matches user ruling. [PASS]
- §2.x frontmatter schema (base §2.1, extensions §2.2, staging-strip §2.3) UNCHANGED — diff scoped to §1.3 lines 40-46 only; no schema-line edits. [PASS]
- §3 structure rules still reference the smells as "forbidden" bundle examples (line 121) — but that is about atomicity (bundle files), a separate invariant, not the slug-naming blocklist. No contradiction introduced. [PASS]

## Final Gate (re-run independently)

| Gate | Expected | Observed | Status |
|---|---|---|---|
| mistake-candidate frontmatter KEY in mistakes/ | 0 | 0 (`^mistake-candidate:`) | GREEN |
| promoted-from/at frontmatter in mistakes/learnings/design | 0 | 0 | GREEN |
| design/learnings/rules/backlogs start with `---` | all | all (0 non-compliant) | GREEN |
| feature shape | 7 caps + README | 7 caps (agents, evaluation, git-workflow, guardrails, install-runtime, project-memory, workflow) + README | GREEN |
| archive/features count | 4 | 4 (env-var-audit, gobbi-orchestration-workflow-improvements, bundle-b, bundle-c) | GREEN |
| sprint dirs in features/ | gone | none | GREEN |
| sessions tmp | 0 | 0 | GREEN |
| state.json count | 6 | 6 | GREEN |
| .claude/skills symlinks resolve | all | 0 broken | GREEN |

Note on the GATE-1 naive grep: `grep -rl 'mistake-candidate' mistakes/` returns 1 hit, but it is a BODY-TEXT cross-reference ("staging procedure for mistake-candidates", `memorization-delegation-prompts-must-load-memorization-skill.md:67`), pre-existing, NOT a frontmatter key. The frontmatter-scoped check (`^mistake-candidate:`) is 0. Gate is genuinely green.

## Scope + leak check

- W5 diff touches ONLY: 2 new backlogs, 1 mistake, rules.md §1.3. No body churn elsewhere. [PASS]
- Content-suffix files correctly LEFT (not renamed): `features/install-runtime/discussions/env-var-audit-scope-discussion.md` and `features/install-runtime/archive/references/2026-05-22-ideation-references.md` both still present at their slugs. [PASS]
- No main-tree leak: `develop` still at 82a5137. [PASS]

---

## Findings

### F1 — [LOW|general|CONFIDENCE:75] Underscore vs hyphen key spelling drift in feature-frontmatter backlog
`backlogs/feature-dir-frontmatter-full-normalization.md` describes staging keys as `promoted_from` / `promoted_at` (underscore) on lines 3, 23, 43, 44, while `rules.md` §2.3 canonical spelling is hyphenated `promoted-from` / `promoted-at`. The same backlog also uses the hyphenated form on line 25 (the actual Final-Gate grep), so it is internally inconsistent.
**Why it matters:** A future executor running the §43 suggested grep (`grep -rn 'promoted_from\|promoted_at'`) against files that actually carry the hyphenated key would miss them. Cosmetic-to-minor: the backlog is a deferred follow-up, the grep is illustrative, and the real legacy keys may genuinely be either spelling (these are ad-hoc legacy keys by definition). No effect on shipped W5 artifacts.
**Suggested direction:** When this backlog is actioned, normalize the grep spelling to match whatever the legacy files actually carry (enumerate both forms).

No Critical, High, or Medium findings.

---

## Must-preserve list

- The §1.3 softening prose precisely captures the user ruling (preferences not blocklist; content suffixes allowed) — do not re-harden.
- The mistake file's "Separate concern" disambiguation block (branch-isolation vs symlink mirror) — a genuine clarity gain; keep.
- FLAG-1/FLAG-2 pre-existing backlogs untouched — correct; do not re-file.
- §2.x frontmatter schema untouched — the softening is correctly surgical.

## VERDICT: PASS
