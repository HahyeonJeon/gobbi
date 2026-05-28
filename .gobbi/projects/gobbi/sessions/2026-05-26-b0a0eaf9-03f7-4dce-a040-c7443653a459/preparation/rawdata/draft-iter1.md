## Scope reference

- Locked Ideation artifacts: `sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/artifacts/`
  (`idea.md`, `scope-contract.md`, `design-options.md`, `resolution-log.md`, `memory-reads.md`).
- Locked Scope Contract (`scope-contract.md`): author a dev-doc-level memory standard as a new
  section in `memorization/rules.md`; retrofit live project-memory docs in waves
  (conformance → prose → light nav).
- Builds on PR #272 branch `chore/session-2026-05-25-a10c82d6`; merge to develop deferred.
- HEAD verified = `d2b5b37` (matches Ideation-locked baseline commit exactly).
- Ideation MEMORIZATION staging present at `ideation/staging/`
  (design / decisions / references / scenarios / checklists).

## Readiness summary

**READY.** 1 new gap found this loop (the dangling `claude` doc-authoring skill link at
`CLAUDE.md:60`); 0 resolved this loop; 1 deferred; 0 skipped; 0 `re-ideate`; 0 `generate-now`.
Every input the retrofit waves need exists and reproduces the locked baselines exactly at HEAD
`d2b5b37`: the standard's home (`memorization/rules.md`) is a real canonical file, all 17 per-type
templates exist, the 208-doc population and conformance / FIX-1 leak baselines all reproduce, every
target doc type is live across the 7 capability features, and the relevant mistakes are loadable.
No blocking design / memory gap and no missing project-specific skill. The single surfaced gap is
out-of-scope `.claude/`-surface drift unrelated to the memory-doc retrofit; per the user's decision
it is backlogged (not fixed, no skill generated). The user's two decisions — advance to Planning and
backlog the dangling link — are recorded in the Decisions log below.

## Design + memory readiness

Sub-step A produced the readiness signal list; Sub-step B verified each signal against project
memory at HEAD `d2b5b37`. No `re-ideate` trigger: the Scope Contract's feature directory
(`project-memory`) exists, the standard's home (`memorization/rules.md`) exists and is the correct
extension point (the new section EXTENDS §1/§2/§3, does not compete), and every baseline count
reproduces exactly. No Ideation-output contradiction blocks Preparation.

Readiness signals downstream Planning + Execution need, and their verification:

1. **Standard's home** — canonical `memorization/rules.md` is a real file carrying the
   naming / frontmatter / structure sections the new dev-doc section extends; executors edit the
   canonical path and the `.claude/` symlink resolves to it.
2. **Per-type templates** — `memorization/templates/*` provide the authoritative per-type
   frontmatter allowlist + section shape for the conformance / prose waves and the feature-readme
   template for the tier-3 nav wave.
3. **208-doc population** — predicate P_live_all reproduces 208 files / 17 READMEs / 191 content;
   conformance baseline (50/208) and FIX-1 leak baseline (59) reproduce so Execution targets are
   stable.
4. **Doc TYPES present** — every type the waves normalize is live across the 7 capability features.
5. **Mistakes to respect** — naming-positive-guidance (D3), design-literal-retire / never-delete
   (D9), symlink-edit-canonical-path, skills-mirror-symlinks, executor-main-tree-edit,
   sendmessage-cwd-reset, manager-context-overflow (wave bounding).
6. **Doc-authoring coverage** — executors consult `memorization/rules.md` + `memory-map.md` +
   `templates/*` + Principle 13; coverage is complete for the memory-doc surface (see Execution
   skills readiness).

| Check | Result | Evidence |
|---|---|---|
| Canonical `rules.md` is a real file (not symlink) | PASS | `.gobbi/projects/gobbi/skills/memorization/rules.md` = UTF-8 text, 14911 bytes; `file` confirms not a symlink |
| `.claude/skills/memorization/rules.md` symlink resolves to canonical | PASS | `readlink -f` resolves to the canonical worktree-absolute path |
| `rules.md` has naming / frontmatter / structure sections the standard EXTENDS | PASS | §1 Naming, §2 Frontmatter (incl. §2.2 per-type extension table + §2.3 staging-strip), §3 Structure — confirms new section extends, does not compete (INT-1) |
| FIX-1 per-type frontmatter allowlist is documented | PASS | §2.2 line 110 (`disposition: open\|deferred` legitimate on backlogs); §2.3 staging-strip mechanism — the predicate's legitimate-key basis is in the standard's home |
| 17 per-type templates exist (canonical + symlinked) | PASS | `templates/` has 17 files; `.claude/skills/memorization/templates/` symlinks each |
| Template exists per doc type the waves touch | PASS | decisions / design / mistakes / learnings / notes / backlogs / references / changelogs / reviews / reports / plans / scenarios / checklists / discussions + feature-readme all present |
| P_live_all reproduces = 208 | PASS | `find` predicate returns 208; 17 READMEs → 191 content — matches Ideation lock exactly |
| Conformance baseline reproduces = 50/208 | PASS | 50 files carry all 9 base keys — matches Ideation lock exactly |
| FIX-1 leak baseline reproduces = 59 | PASS | 59 files carry ≥1 unconditional S-key; 35 non-backlog disposition leaks are a subset (union = 59); 28 backlog disposition files legitimate (preserved) |
| All target doc TYPES present across 7 features | PASS | discussions / backlogs / mistakes / design / decisions / checklists / changelogs / references / notes / learnings / scenarios / plans / reviews all live; 7 features present incl. project-memory |
| `project-memory` feature dir (Scope Contract) exists | PASS | `features/project-memory/` present |
| Relevant mistakes loadable | PASS | naming-positive-guidance, design-literal-retire, symlink-edit, skills-mirror, main-tree-edit, sendmessage-cwd, context-overflow all readable |
| HEAD = `d2b5b37`, on #272 branch, tree clean | PASS | `git log` HEAD `d2b5b37`; only untracked = this session dir |

**No blocking design / memory gaps.** Every input the retrofit waves need exists and reproduces the
locked baselines exactly. Known cosmetic items already locked for Execution (NOT new Preparation
gaps): CN-1 FIX-1 disposition sub-count cross-foot (28 loose vs 27 strict P_live — already assigned
"normalize at Execution") and the 12/13/16 type-count framing (`rules.md` line 83 enum lists 12
promotable types, line 95 documents the 4 feature-subdir exception, `memory-map.md` describes 13 —
the standard-authoring wave reconciles its per-type section list; already an Execution concern).

## Execution skills readiness

Sub-step C enumerated the skills an executor needs for the memory-doc retrofit and scanned for their
existence under `.gobbi/projects/gobbi/skills/` and `.claude/skills/`.

| Skill | Purpose for this work | Status |
|---|---|---|
| `memorization` (SKILL.md + rules.md + memory-map.md + templates) | Authoritative memory-authoring reference: type semantics, frontmatter, per-type section contracts | PRESENT (canonical + symlink) |
| `principles` (esp. P13 Spec+CRUD, P8 docs-deliverable, P10 witness) | Doc-work discipline for the retrofit (SPEC + CRUD plan per wave, blast radius) | PRESENT |
| `mistake` | Load-before-work mandate; the docs / naming / symlink mistakes | PRESENT |
| `wrap-up` | Promotion routing + frontmatter allowlist (what Wrap-up strips) | PRESENT |
| `claude` doc-authoring standard | `CLAUDE.md:60` cites `skills/claude/SKILL.md` as the `.claude/`-doc-authoring standard | MISSING — dangling link (out of scope; see Out of scope gaps) |

**Coverage finding.** The work is memory-doc authoring (the project-memory tree), not `.claude/`-doc
authoring. The standard itself lives in `memorization/rules.md`. Executors retrofitting memory docs
consult `memorization/rules.md` + `memory-map.md` + `templates/*` + Principle 13 directly. This
coverage is COMPLETE for the task — the dangling `claude` skill does NOT block the retrofit
(memory-doc authoring does not depend on a `.claude/`-doc skill).

**Missing project-specific skills: none that block Execution.** Per the user's explicit
avoid-unnecessary-change steer, no new project skill is proposed for generation. Existing skills +
the standard-in-`rules.md` + templates + code patterns fully cover the executor's needs. No
`generate-now` recommendation.

## Generated this loop

- **No `generate-now` artifacts.** No blocking skill gap and no missed memory promotion were found,
  so nothing was staged for in-session promotion. All Ideation-staged artifacts are present and
  correctly placed under `ideation/staging/`.
- **One `defer` artifact staged** (not a generation; recorded here for traceability): the deferred
  out-of-scope backlog entry at
  `sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/preparation/staging/backlogs/project/dangling-claude-doc-skill-link.md`.

## Out of scope gaps

| Gap | Severity | Disposition pointer |
|---|---|---|
| Dangling `claude` doc-authoring skill link at `CLAUDE.md:60` — `[claude skill](skills/claude/SKILL.md)` points to a file that does not exist in either `.claude/skills/` or `.gobbi/projects/gobbi/skills/` | Low | **Deferred → project backlog.** Pre-existing `.claude/`-surface drift in an entrypoint doc, unrelated to the memory-doc retrofit. Staged at `sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/preparation/staging/backlogs/project/dangling-claude-doc-skill-link.md` |
| AGENTS.md / `.codex/AGENTS.md` say "12 principles" vs CLAUDE.md "13" (PR-1) | Low | Already a Planning confirm/defer task per Ideation; not a new Preparation gap |
| CN-1 FIX-1 sub-count cross-foot (28 loose vs 27 strict) | Low / cosmetic | Already locked "normalize at Execution"; not a new Preparation gap |
| 12/13/16 type-count framing reconciliation | Low | Already an Execution standard-authoring concern; not a new Preparation gap |

## Decisions log

Both decisions below were made by the user via AskUserQuestion after the manager presented the
Preparation readiness result (READY — zero blocking gaps, zero `re-ideate`, zero `generate-now`).

- **Advance to Planning.** The user approved advancing the workflow from Preparation to Planning,
  with a full dual-system Preparation EVALUATION to run first (manager-owned). Cites the Sub-step D
  / readiness-result AskUserQuestion outcome.
- **Backlog the dangling `claude` skill link (resolution = `defer`).** The single surfaced gap —
  the dangling `[claude skill](skills/claude/SKILL.md)` at `CLAUDE.md:60` — is deferred to the
  project backlog. The user directed: do NOT fix the link and do NOT generate a `claude` skill in
  this loop (consistent with the avoid-unnecessary-change steer). It is out-of-scope `.claude/`-
  surface drift unrelated to the memory-doc retrofit. Staged at
  `preparation/staging/backlogs/project/dangling-claude-doc-skill-link.md`; Wrap-up promotes to
  `.gobbi/projects/gobbi/backlogs/`.

No `skip` decisions. No `re-ideate` escalation — Preparation proceeds to EVALUATION then Planning.
