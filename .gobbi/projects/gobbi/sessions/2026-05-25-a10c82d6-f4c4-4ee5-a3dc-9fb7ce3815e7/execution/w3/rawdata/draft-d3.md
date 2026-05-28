# W3 Dispatch 3 (W3-T4 + W3-T5) — Executor Report

STATUS: DONE
ARTIFACT: T4 = c87fa648f34d09c4bcd0c43fb6505814084a8d28 ; T5 = c8d4cd9643a90fadf4d4a4762fe1c4a37962dc8e
Branch: chore/session-2026-05-25-a10c82d6 (matches worktree)

## Scope correction (noted, not a blocker)
The brief said "Bundle C (6 md)". The actual dir held **5 non-README md** (1 changelog + 4
checklists). The "6 md" figure (design §1.3 / §8 cat A) counted the README as the 6th. All 5
non-README files were re-homed; the README (6th file) was retired in T5. No content missing.

## W3-T4 — Bundle C 6-file routing table
All 5 non-README Bundle C files document the `gobbi-hook-authoring` skill (T04). Per §8 LOW-16
heuristic rule 1 (destination = the capability the CONTENT is about) + §10 RATIFY-1
(`install-runtime` owns the `gobbi-hook-authoring` skill), all 5 → `install-runtime`.

| # | Source (features/session-foundations-bundle-c/) | Destination (features/install-runtime/) | Reason |
|---|---|---|---|
| 1 | changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md | changelogs/ (same name) | T04 ship record of the gobbi-hook-authoring skill; `feature:` restamped session-foundations-bundle-c → install-runtime |
| 2 | checklists/hook-skill-exit-behavior-must-enumerate-all-fatal-paths.md | checklists/ (same name) | T04 quality gate for the hook-authoring skill |
| 3 | checklists/skill-must-not-invent-json-field-paths-not-in-witnesses.md | checklists/ (same name) | T04 quality gate (skill payload-field correctness) |
| 4 | checklists/skill-registration-must-mirror-real-settings-shape.md | checklists/ (same name) | T04 quality gate (skill settings.json registration) |
| 5 | checklists/smoke-test-payloads-must-include-all-required-env-vars.md | checklists/ (same name) | T04 quality gate (skill smoke-test runnability) |

- No filename collisions in destination (install-runtime/checklists already held 3 differently-named files).
- Changelog `feature:` restamped to `install-runtime`. Checklists carry finding-ID-style frontmatter
  with NO `feature:` key — adding one is §8 cat-C frontmatter-normalization work, deliberately left
  out of this re-home (no body rewrite, minimal scope).
- Added re-home changelog: features/install-runtime/changelogs/2026-05-26-bundle-c-rehome.md.

### Secondary-feature note
§1.3 lists Bundle C primary = git-workflow, secondaries = guardrails (mistake-promote fix +
hooks-domain tag) + project-memory (session-lifecycle + archive-model design). Those secondary
artifacts did NOT live inside features/session-foundations-bundle-c/ — they shipped directly to
skills/, CLAUDE.md, and project design/. So there were no in-dir files to route to git-workflow,
guardrails, or project-memory; the only in-dir durable artifacts were the 5 install-runtime files.

## Promote-up decision — the 2 project-root memory-design docs
Decision: **BOTH LEAVE at project `design/`** (no move into features/project-memory/design/).

- `design/archive-move-on-terminal-model.md` — §2.4 promote-up rule: "cross-feature architecture
  (e.g., the archive model spans all types) → project `design/`". The move-on-terminal model
  governs ALL artifact types across ALL value-features → genuinely cross-feature project-level
  design. Stays.
- `design/session-lifecycle-worktree-boundaries.md` — documents the worktree-first session
  lifecycle across 9 surfaces (orchestration, git, delegation, preparation, session template).
  Cross-cutting project architecture, not specific to a single value-feature → stays at project
  design/ per §2.4 promote-up.

The §1.3 evidence-note phrasing ("route the archive-model design doc to project-memory") is
reconciled by §2.4: "spans all types" = cross-feature = project-level. Both docs were already at
project design/ (never inside Bundle C's dir), so leaving them is the consistent no-op.

## W3-T5 — 4 retired sprints + archive paths
Each sprint dir held ONLY README.md after W3-T1..T4 re-homing (verified `find <dir> -name '*.md'
! -name README.md | wc -l == 0` for all 4). README frontmatter stamped `archived_at: 2026-05-26`
+ `archive_reason: retired` (status: shipped preserved), then `git mv` to archive/features/.

| Sprint | Archive path | README stamp |
|---|---|---|
| env-var-audit | archive/features/env-var-audit/README.md | archived_at: 2026-05-26 + archive_reason: retired |
| gobbi-orchestration-workflow-improvements (Bundle A) | archive/features/gobbi-orchestration-workflow-improvements/README.md | archived_at: 2026-05-26 + archive_reason: retired |
| session-foundations-bundle-b | archive/features/session-foundations-bundle-b/README.md | archived_at: 2026-05-26 + archive_reason: retired |
| session-foundations-bundle-c | archive/features/session-foundations-bundle-c/README.md | archived_at: 2026-05-26 + archive_reason: retired |

Bundle C's README had NO frontmatter; a minimal block (feature/status/archived_at/archive_reason)
was prepended (frontmatter stamping, not body rewrite). The other 3 had frontmatter blocks; the 2
fields were appended before the closing `---`. This move accounts for Bundle B's README (the 101st
file per the dispatch note).

## features/ final state
`agents evaluation git-workflow guardrails install-runtime project-memory workflow` + README.md
== exactly the 7 capability dirs + README.md. No sprint dirs remain.

## git scope (R / A, no D)
- T4 (c87fa64): 5 renames (R/RM) + 1 add (bundle-c-rehome.md). No D entries.
- T5 (c8d4cd9): 4 renames (RM — rename + frontmatter stamp). No D entries.
- All moves via `git mv` (no physical delete; move-on-terminal model honored).
- Main tree (/playinganalytics/git/gobbi) verified UNTOUCHED for features/ + archive/.
- AI-Provenance-Record trailer landed on both commits.

## notes/ coverage confirmation
All 4 retired sprints have a notes/ session entry (no fabrication needed):
- notes/2026-05-22-env-var-audit-sessionstart-hook.md
- notes/2026-05-23-orch-workflow-improvements.md
- notes/2026-05-24-session-foundations-bundle-b.md
- notes/2026-05-25-session-foundations-bundle-c-complete.md
Shipped record additionally captured in the re-home changelogs (W3-T1..T4).
