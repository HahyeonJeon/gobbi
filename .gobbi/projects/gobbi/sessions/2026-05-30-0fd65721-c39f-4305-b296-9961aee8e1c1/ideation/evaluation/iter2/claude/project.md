# Project Perspective — Claude Evaluation (iter 2)

## Artifact Summary + Memory reads
**What:** iter-2 Ideation draft for two coupled deliverables — a fresh, bounded `gobbi` Claude Code plugin package (`.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`) + Claude-schema `marketplace.json`, and a `claude-plugin` authoring skill. **Why:** gobbi is "a tool for Claude Code" but is currently installable only by manual `.claude/` mirror-sync (recurring repair cost, PR #260→#261, backlog #258); the prior plugin (`plugins/gobbi-core` 62b95a0; `plugins/gobbi` last-live) was wiped at e083fad in the v0.5 reset, so the v0.5 tree has a canonical component tree but no Claude-plugin manifest. **How:** directional DDs (DD-1..DD-9) bounded to ideation; mechanism deferred to Execution. **Scope Contract:** embedded in the draft (`artifact_type: scope-contract`, feature `install-runtime`). **Downstream consumers:** Planning (task decomposition), Execution.

**Memory reads:** `principles/SKILL.md`; `evaluation/SKILL.md`; `ideation/evaluation.md`; project rules (`rules/stub-redirect-format.md` — n/a to this artifact); project mistakes (`skills-mirror-symlinks-not-copies.md`, `edit-tool-refuses-symlink-paths.md`, `symlink-restore-depth-wrong.md`, `worktree-physical-file-missing-when-checked-out.md`, worktree-write-path family); iter-1 codex `{project,structure,overall}.md`; iter-1 claude `overall.md`; discussion-log; staged references (6); git: 62b95a0, ba8aa42, c79d28e, e083fad, e083fad^.

## W/W/H gate
What ✓ (clear, two coupled artifacts enumerated). Why ✓ (concrete witness: mirror-repair cost + wiped package + user brief). How ✓ (directional DDs with anchors). No gate finding.

## Locked Frame (Stage 1)
- **Root cause is actual, not symptom** — checklist: Why terminates at a cause that if absent obviates work; prior attempts documented; no scope drift framed-problem↔design.
- **Scope Contract sharp enough to refuse OOS tasks** — explicit Project/Feature/Task; backlog routing for non-chosen candidates; no "etc."/"and related".
- **Why-now concrete** — measurable success criteria; named trigger.
- **Counterfactual steel-manned (adversarial)** — strongest do-nothing argument; rejection stated with evidence.
- **Re-framing produced confirmed reframe or defensible no-change.**
- **Adjacent feature absorbs idea quietly (adversarial)** — checked against `features/`; install-runtime reuse explicit.
- **Assumption ledger** — load-bearing premises each cite evidence or surfaced as assumption_risk.
- **Prior-art search real not nominal** — git/memory/community; negative results auditable.
- **iter-2 user-decision fidelity (adversarial, new)** — the two binding decisions (fresh `gobbi`, bounded skills+agents+hooks) are reflected, not silently re-interpreted; the superseded DD-2 is documented as REPLACED not dropped.

## Per-scenario per-check results
- Root cause: YES. "Why" terminates at "missing declarative package" — verified true: e083fad wiped `plugins/gobbi/.claude-plugin/plugin.json` + marketplace.json (git show confirms), and `.codex-plugin/plugin.json` exists while no Claude analogue does. Prior attempts now documented (P1 corrected). No framed-problem↔design drift.
- Scope Contract sharp: YES. In-Scope enumerates EXACTLY 4 package contents; Out-of-Scope explicit (impl, gobbi-core revival, public marketplace, codex reconciliation, MCP/LSP/commands, hook-logic rewrite). 2 non-chosen candidates routed to `staging/backlogs/feature/` (both files exist). No "etc."/"and related" found.
- Why-now: YES. Trigger named (recurring mirror repair PR#260→#261, #258); success criteria measurable (validate passes, cache-contents allow-set, fire-exactly-once, readlink+section-presence).
- Counterfactual: YES, steel-manned. The do-nothing argument cites feedback_solo_user_context honestly; rejected with 3 counter-evidence points + new iter-2 point (wiped package ⇒ fresh build genuinely needed). Not strawmanned.
- Re-framing: YES. "Manifest as single canonical declaration" surfaced as documented direction, NOT built — defensible no-expansion.
- Adjacent feature: YES. install-runtime reuse (not new feature) is explicit and correct.
- Assumption ledger: PARTIAL — see F-P1. Most premises are doc/sha-cited, but the DD-9 permissions premise ("schema/runtime may auto-grant invocability for plugin-provided components") is an unverified load-bearing assumption not tagged as assumption_risk.
- Prior-art search: YES, exemplary. 5 git shas + Codex analogue, all independently verified by me.
- iter-2 fidelity: YES. Fresh `gobbi` (not gobbi-core) is explicit; bounded package decision is faithfully transcribed (discussion-log L34-35 matches); DD-2 marked REPLACED with the overturn documented (line 437).

## Typed findings

### F-P1 — DD-9 permissions auto-grant premise is an untagged load-bearing assumption
- Type: assumption_risk · Domain: process · Disposition: open · Confidence: 50 · Severity: Low
- Evidence: draft line 385-389 (DD-9) frames the disposition as conditional on "if the schema/runtime auto-grants invocability for plugin-provided components" but does not state which way the assumption resolves, nor tag it as a risky premise per the Project assumption-ledger checklist. The manifest-schema reference does not address whether plugin-provided Skill()/Agent() need explicit permission allow-listing post-install.
- Why it matters: if plugin-provided components still need project-local `permissions.allow` entries, Option "ship with plugin" is impossible and DD-9 collapses to "project-local stays" — a Planning input that is currently left genuinely open rather than decided. Low severity because DD-9 is explicitly a Planning decision with a built-in invocability check, so the gap will be caught; but the premise should be in the assumption ledger.
- Suggested direction: tag the auto-grant premise as an explicit assumption_risk to verify at Planning, or note the invocability check is the falsifier.

### F-P2 — "every prior-art claim cites a git sha" is satisfied; no scope drift detected
- Type: general · Domain: process · Disposition: addressed · Confidence: 100 · Severity: Low
- Evidence: I independently verified 62b95a0 (marketplace name:gobbi, plugin name:gobbi-core, dir pointers), ba8aa42 (removed invalid hooks/agents fields, "schema requires hooks.json file not directory"), c79d28e/#251 (materialize, "every published v0.4.x install had empty agents/skills", two-places trade-off verbatim), e083fad (wipe), e083fad^ (agents 5-md-array, skills dir-pointer). All accurate.
- Why it matters: confirms the Project success-criterion "every prior-art claim traces to a git sha" is met. Recorded as a preserve, not a defect.

## iter-1 finding dispositions (Project-owned)
- **P1 (prior-art, High/100)** — RESOLVED/addressed. The false "no prior attempt" is gone; the full git-sha-cited history is present and accurate (independently verified). Confidence 100.

## Per-perspective verdict: PASS
No open finding ≥ High. F-P1 is Low/assumption_risk.

## Low-confidence appendix
None.
