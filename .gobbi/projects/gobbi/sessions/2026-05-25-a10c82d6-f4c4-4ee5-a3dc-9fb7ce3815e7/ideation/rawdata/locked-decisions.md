# Ideation Locked Decisions — Memory-System Redesign

Session 2026-05-25-a10c82d6. Locked via AskUserQuestion during Ideation DISCUSSION (discuss.mode=user). Moment-of-capture; atomic decision files produced in MEMORIZATION/Wrap-up.

## L1 — Feature = durable coarse capability (noun, not verb)
A `features/{name}/` directory represents a lasting product capability / subsystem, NOT a work-sprint. gobbi is a meta-tool so capabilities track its subsystems. Granularity: coarse (not 1:1 with skills, not work-sprints). Rejected: fine 1:1-skills; keep-sprint-rename; 11-internal-buckets; marketing-vibe names.

**FINAL ratified feature set (7, developer-vibe):** `workflow` (orchestration + 5 loops + research + discussion), `project-memory` (memorization — THIS redesign lands here), `agents` (delegation + 5-role roster), `evaluation` (evaluation + codex), `guardrails` (principles + mistake — Principle #13 lands here), `git-workflow` (git), `install-runtime` (interview + gobbi-hook-authoring; install/runtime knowledge documented in gobbi/SKILL.md, NOT a created skill). All 18 canonical skill dirs (17 mirrored + gobbi-hook-authoring canonical-only) house here. The 4 sprint-"features" re-home: env-var-audit→install-runtime/session-runtime; Bundle-A→workflow; Bundle-B→git-workflow; Bundle-C→git-workflow.

## Ideation outcome
iter1 dual-system eval (Claude REVISE + Codex FAIL — Codex caught a real Critical: mirror-topology + skill-inventory errors). iter2 remediation fixed all 17 findings; manager-verified PASS. Locked Idea: `ideation/artifacts/memory-system-redesign-design.md`. Eval detail: `ideation/evaluation/iter2/manager-verification.md`.

## L2 — Session = verb; work-narrative lives in notes/ + sessions/
A session's work-narrative lives in `sessions/{date-id}/` (volatile loop artifacts) + `notes/{date}-{slug}.md` (durable one-per-session journal). Durable conclusions (decisions/design/changelog) promote INTO the feature(s) the session touched. The notes entry links the touched features. Rejected: dedicated sessions-dossier type (overlaps notes).

## L3 — Keep all 13 project-level types, give each a crisp spec
Types retained: features, notes, decisions, design, mistakes, rules, learnings, backlogs, references, plans, reviews, reports, archive. No merging. Each gets: purpose, hard boundary ("use-this-not-that" decision rule vs adjacent types — esp. reviews-vs-reports and mistakes-vs-rules-vs-learnings), scope, naming, frontmatter schema, CRUD lifecycle. Rejected: aggressive consolidation; specs-only-no-boundaries.

## L4 — Per-type declared scope + promote-up
Each type declares allowed scope(s). Default: work lands feature-level; promotes to project-level ONLY when genuinely cross-feature. Some types inherently project-only (rules, notes journal) or feature-only (changelogs, plans). Each type's spec states its scope rule + promote-up trigger. Rejected: uniform dual mirror; flat project-only-tag-by-feature.

## L5 — Naming: directory-as-category + atomic concept slug
The type directory IS the controlled-vocabulary category — do NOT repeat the dir/type in the filename. Filename = atomic stable-concept kebab slug, 3-5 words, ≤~35 chars, lowercase+hyphens only. ONE record = ONE concept (no bundle files). Temporal split: date-prefix `YYYY-MM-DD-{slug}` for time-indexed types {notes, reviews, reports, changelogs, decisions, plans, archive entries}; bare `{slug}` for evergreen types {features, mistakes, rules, learnings, design, references, backlogs}. **Anti-pattern blocklist (forbidden in slugs):** loop/phase, finding-ID, item/task/step positional, restating-the-dir, status words, version numbers, date-in-evergreen, wording excerpts, person names, opaque auto-IDs, bundled-scope, uninformative generics. Rejected: sub-facet prefix; Johnny.Decimal numerics.

## L6 — Frontmatter: shared base + per-type extensions
Every memory file carries a required base: `name`, `description`, `type`, `scope: project|feature`, `feature`, `status`, `created`, `session`, `tags`. Per-type extension fields added on top (e.g. decisions: `supersedes`/`superseded_by`; reviews: `verdict`; archive: `archived_at`/`archive_reason`). Staging-only fields (`mistake-candidate`) MUST be stripped on promotion. One documented schema block per type. Rejected: minimal-core-only; keep-ad-hoc.

## L7 — New principle #13: Spec + CRUD-think for documentation work
Add a 13th principle to principles/SKILL.md. Iron Law (draft): "NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN." Before any documentation change, the agent (1) writes a brief SPEC of the doc task (what it must achieve; what each affected doc should/should-not contain; which type each file is), and (2) enumerates the CRUD operations the task entails — which files / directories / **lines** will be Created, Read, Updated, Deleted. Per user's exact definition: CRUD = the change-scoping lens (files/dirs/lines), not a per-doc lifecycle attribute. Must delineate from Principle 8 (docs-as-deliverable: P8 = docs ship with code; P13 = how to scope/structure doc work itself).

## L8 — skills/ + agents/ directories: OUT OF SCOPE
Do not relocate or rework `.gobbi/projects/gobbi/skills/` (18 dirs) or `agents/` this session. File a follow-up for the memory-map-vs-wrap-up canonical-location contradiction (touches symlinks/plugin mirroring). May note them as a "project artifacts" tier in passing but no relocation.

## Open items (for leader draft / further user decision)
- Canonical feature/capability list (~10-12 buckets) — leader proposes concrete buckets; user ratifies.
- 13 per-type specs (the bulk) — leader drafts from L3/L4/L5/L6.
- Session-memory spec + cleanup (non-standard subdirs followups/, restore/; document state.json + session.json.lock; per-perspective eval filename standard). Session memory IS in scope.
- Contradiction/cleanup auto-decisions: archive typed-subdirs (existing design doc wins), decisions one-per-file (L5 atomicity), tmp/ disposition, reports/ empty-OK.
- Migration approach for the 4 mis-filed features + non-compliant live files (scope/effort decision — needs user input).
- Propagation targets: memorization/SKILL.md + memory-map.md + 17 templates, wrap-up/SKILL.md, orchestration/SKILL.md, principles/SKILL.md, CLAUDE.md.
