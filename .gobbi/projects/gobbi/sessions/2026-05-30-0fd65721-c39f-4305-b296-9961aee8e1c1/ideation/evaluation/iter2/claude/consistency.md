# Consistency Perspective — Claude Evaluation (iter 2)

## Artifact Summary + Memory reads
See project.md. Consistency lens: internal contradictions; Scope Contract↔Design↔Framed-Problem coherence; design decisions cite insights that actually say what is claimed; scenarios↔checklist alignment; hook-count (F-C1) correctness; reference-body vs draft-decision drift.

**Memory reads:** as project.md; iter-1 codex `consistency.md` (C1 skill-inventory) + overall (R2); `.claude/settings.json` (verbatim); `code.claude.com` live fetch; staged references (all 6).

## Locked Frame (Stage 1)
- **Scope Contract, Framed Problem, Design describe the same problem** — no drift.
- **Every design decision consistent with cited insight** — citations exist + say what is claimed (no over-citation).
- **Scenarios ↔ Implementation Checklist aligned** — every checklist item anchored to a scenario; every scenario has a verifying checklist item.
- **Glossary terms consistent — no synonym drift.**
- **Internal vs external research conflict unresolved (adversarial)** — where they tension, which prevails is stated.
- **Hook-count consistent across the draft (adversarial, F-C1 inheritance)** — "2 scripts / 3 event registrations" used uniformly; no residual "2 registrations".
- **Reference body matches the draft's superseding decision (adversarial, new)** — the cache-symlink reference's old "root at repo root" text vs the bounded-package decision.

## Per-scenario per-check results
- Same problem: YES. Scope Contract goal, Framed Problem root cause, and Design all target "missing declarative bounded package".
- Design↔insight: YES. Each DD anchors to a named reference or sha; I verified the agents-array (live docs), ADDS-vs-REPLACES (live docs), escaping-symlink-skip (reference + docs), and all 5 git shas. No over-citation found.
- Scenarios↔checklist: YES. Each Implementation Checklist item maps to a scenario; the cache-contents, agents-shape, drift/sync, double-fire, worktree, permissions scenarios each have a checklist line.
- Synonym drift: NONE. "bounded package", "materialize", "drift/sync surface", "2 scripts / 3 event registrations" used uniformly.
- Internal vs external conflict: handled. The internal e083fad^ symlink shape vs the #251 materialize lesson is reconciled — the draft attributes materialization to #251 (on main) and does NOT claim e083fad^ used real files (it claims the agents-ARRAY shape + hooks.json existed, which is true). No silent conflict.
- Hook-count (F-C1): YES, RESOLVED. "2 hook SCRIPTS across 3 EVENT registrations" appears at lines 37, 209-214, 280-283, 334, 402, 425-426; no residual "two registrations". Verified verbatim against settings.json (SessionStart→session-start.sh; PostToolUse + PostToolUseFailure both → post-tool-use-agents.sh).
- Reference-body vs decision (adversarial): MISMATCH — see F-C1. The `plugin-cache-symlink-dereferencing-and-path-traversal.md` reference still contains the iter-1 framing in its body ("The plugin must either (a) root at the repo root and point skills directly at ./.gobbi/projects/gobbi/skills/ ... or (b) accept ... @skills-dir") — i.e. it recommends the very option DD-2 OVERTURNED.

## Typed findings

### F-C1 — Staged cache-symlink reference body still recommends the overturned repo-root option
- Type: general · Domain: docs-sync · Disposition: open · Confidence: 75 · Severity: Medium
- Evidence: `staging/references/plugin-cache-symlink-dereferencing-and-path-traversal.md` lines 28-31 conclude the plugin "must either (a) root at the repo root and point skills directly at ./.gobbi/projects/gobbi/skills/ (the canonical real files — mirrors the Codex approach), or (b) accept ... @skills-dir in-place-discovery". This is the iter-1 DD-2 (repo-root) framing, which the iter-2 user decision EXPLICITLY OVERTURNED in favor of a dedicated bounded package with materialized copies. The reference's own "Why it applies" still says it determines "the plugin's directory ROOT" as if repo-root were live.
- Why it matters: the reference is a staged artifact Planning will read. Its conclusion contradicts the ratified DD-2/DD-2a. A Planner reading the reference (not just the draft) could mistakenly resurrect the repo-root option or the `@skills-dir`-in-place model — re-introducing the R1 payload risk or the escaping-symlink-empty-plugin failure. The raw doc EXCERPT is fine (it is verbatim from code.claude.com); the problem is the reference's INTERPRETIVE "Insight"/"Why" paragraphs were not updated to the bounded-package conclusion. Medium: it is a supporting reference, the draft itself is correct, and the contradiction is interpretive not factual — but cross-artifact sync (the Consistency mandate: "everything that should change together changed together") was not completed.
- Suggested direction: update the reference's interpretive paragraphs to the bounded-package conclusion (materialized real copies inside the package; repo-root and @skills-dir rejected), keeping the verbatim doc excerpt. Or add a one-line "(SUPERSEDED by iter-2 DD-2: bounded package, not repo-root)" note.

### F-C2 — Hook-count correction is internally consistent and matches settings.json
- Type: general · Domain: process · Disposition: addressed · Confidence: 100 · Severity: Low
- Evidence: settings.json verbatim: SessionStart(startup|resume|clear|compact)→session-start.sh; PostToolUse(Task|Agent)→post-tool-use-agents.sh; PostToolUseFailure(Task|Agent)→post-tool-use-agents.sh. Draft's "2 scripts / 3 registrations" matches exactly.
- Why it matters: confirms F-C1/F-A1 hook-count resolution. Preserve.

## iter-1 finding dispositions (Consistency-owned)
- **F-C1/F-A1 (hook count, Low/75)** — RESOLVED/addressed. "2 scripts / 3 event registrations" throughout; PostToolUseFailure block retained; ADDS-to-vs-REPLACES footgun added to DD-6. Confidence 100.
- **C1 (codex, skill inventory not synced with canonical source, Low/75)** — PARTIALLY addressed. The draft no longer enumerates a divergent skill inventory (it points `skills` at the canonical dir as an ADDS-to pointer, sidestepping enumeration). No new skill-list contradiction introduced. Treat as addressed for ideation; the actual skill enumeration is Execution's.

## Per-perspective verdict: PASS
F-C1 is Medium (the strongest residual alongside F-S1); no open High/Critical. Raise with user.

## Low-confidence appendix
None.
