# Structure Perspective — Claude Evaluation (iter 2)

## Artifact Summary + Memory reads
See project.md. Structure lens: is the bounded-package decomposition sound; are the manifest component shapes structurally correct; is the materialize-vs-symlink trade-off assigned; will Planning/Execution be testable.

**Memory reads:** as project.md; plus git ls-tree on e083fad^ plugins/gobbi/{skills,agents} (confirmed all symlinks, mode 120000); `.gobbi/projects/gobbi/agents/` ls (5 .md + 5 .toml); live `code.claude.com/docs/en/plugins-reference` fetch.

## Locked Frame (Stage 1)
- **Components cohere; each owns one concern, unidirectional deps** — package dir = manifest + skills + agents + hooks; no circular dependency between package and canonical tree.
- **Skeptical reader maps every checklist item to a structural element** — DDs name the manifest field shapes/paths explicitly; each anchored to a research insight.
- **Boring-by-default holds** — no novel pattern where bounded-subtree prior art (62b95a0) suffices; alternatives (symlink) considered+rejected with rationale.
- **Two-week smell test** — a maintainer understands the layout from the draft alone.
- **Testability first-class** — verification approach named per major artifact (validate, cache-gate, fire-once, readlink).
- **Decomposition introduces circular dep / shared-state hub (adversarial)** — canonical-tree↔package-copy is a sync edge, not a cycle; check direction.
- **Materialize drift/sync surface is owned, not orphaned (adversarial, new)** — the real-copy decision creates a sync obligation; check it is assigned to a concrete owner (the skill doc) + has a re-sync trigger.

## Per-scenario per-check results
- Components cohere: YES. Package contents enumerated exactly; the package is a copy-target of the canonical tree (one-directional: canonical → package). No circular dependency.
- Map checklist→structure: YES. `agents` = 5-`.md` array (doc-confirmed shape); `skills` = dir pointer (ADDS-to, doc-confirmed); `hooks` = `./hooks/hooks.json`. Each DD cites a reference or git sha.
- Boring-by-default: YES. Bounded subtree matches 62b95a0 prior art; symlink alternative explicitly considered and rejected (DD-2a) with #251 evidence. No innovation token spent.
- Two-week smell test: YES. The layout + the 3-registration hook story + the .md/.toml exclusion are all spelled out.
- Testability: YES. Each success criterion has a `[verify: ...]` tag.
- Circular dep / hub: NO cycle. The sync surface is a maintenance edge, not a structural cycle.
- Drift/sync ownership: PARTIAL — see F-S1. The trade-off is named and assigned to the `claude-plugin` skill to DOCUMENT, but the draft does not name a structural mechanism owner (build/sync script vs manual) — it is explicitly Execution's. That is acceptable for ideation, but the re-sync TRIGGER (when must a re-sync happen) is named only as "drift/sync" without a concrete trigger condition.

## Typed findings

### F-S1 — Drift/sync surface has a documented owner but no named re-sync trigger
- Type: design_flaw · Domain: docs-sync · Disposition: open · Confidence: 50 · Severity: Medium
- Evidence: DD-2a (lines 319-328) and Scenario "drift/sync (DD-2a)" (lines 252-253) require the skill to "document the keep-in-sync obligation (and the re-sync trigger)" but the draft does not itself state WHAT the trigger is (e.g., "any edit under `.gobbi/.../skills` or `agents/*.md` or `.claude/hooks/*.sh` requires a package re-sync + version bump"). The #258 drift-detector is referenced as a future consumer but not as the enforcing mechanism for THIS surface.
- Why it matters: a sync obligation with no defined trigger is the exact failure #251 hit ("editing on main now requires editing in two places") and the exact failure PR #260→#261 hit (broken mirror). Without a trigger condition, Planning may produce a skill section that says "keep in sync" without saying "on what event" — repeating the recurring-mirror-repair root cause the project is trying to eliminate. Medium (not High) because the obligation IS named and the cache-contents gate partially backstops it; the gap is the trigger specificity, deferrable to the skill-authoring task at Planning.
- Suggested direction: name the re-sync trigger condition in the draft (or explicitly delegate trigger-definition to the skill-authoring Plan task), and consider whether the materialized package should be generated rather than hand-maintained (mechanism is Execution's, but the choice between generate-vs-hand-maintain is a structural decision worth flagging for Planning).

### F-S2 — agents field shape is structurally correct (S1 fix verified against live docs)
- Type: general · Domain: process · Disposition: addressed · Confidence: 100 · Severity: Low
- Evidence: live `plugins-reference` confirms `agents string|array Custom agent files (replaces default agents/) "./custom/agents/reviewer.md"` and the complete-schema example `"agents": ["./custom/agents/reviewer.md"]`. The draft's 5-`.md`-array + `.toml`-exclusion is the correct shape. `.gobbi/projects/gobbi/agents/` confirmed to hold 5 .md + 5 .toml.
- Why it matters: confirms S1 resolution is doc-accurate, not memory-sourced. Recorded as preserve.

## iter-1 finding dispositions (Structure-owned)
- **S1 (agents field, High/75)** — RESOLVED/addressed. `agents` is now the 5-`.md`-path ARRAY with explicit `.toml` exclusion; the directory-pointer overgeneralization (iter-1 codex S1) is gone. Confirmed against live docs (REPLACES semantics) and the canonical agents dir. Confidence 100.

## Per-perspective verdict: PASS
F-S1 is Medium; no open High/Critical. (Note for Overall: F-S1 is the strongest residual and should be raised with the user before Planning.)

## Low-confidence appendix
None.
