# Project — Ideation eval iter1 (claude)

## Artifact Summary + Memory reads
**What**: An Ideation directional-design artifact for two coupled deliverables — (1) a root `.claude-plugin/plugin.json` (+`marketplace.json`) packaging gobbi as an installable Claude Code plugin; (2) a `claude-plugin` authoring/update skill. **Why**: gobbi's components are installable only via hand-maintained `.claude/` mirror-sync (the PR #260→#261 fragility); no declarative package exists. **How**: 6 directional decisions (DD-1..DD-6) anchored to 4 staged external refs + 5 internal insights; root-at-repo-root pointing at canonical `.gobbi/...` real files. **Scope Contract**: present at draft top, `artifact_type: scope-contract`, feature `install-runtime`. **Consumers**: Planning (next loop), then Execution.

**Memory reads**: `.gobbi/projects/gobbi/rules/stub-redirect-format.md`; mistakes `skills-mirror-symlinks-not-copies.md`, `section-order-is-part-of-the-contract`, `evaluator-false-pass-without-diffing`; `features/install-runtime/README.md`; `.codex-plugin/plugin.json`; `.agents/plugins/marketplace.json`; `.claude/settings.json`; `.claude/hooks/*.sh`; `.claude/skills` + `.claude/agents` symlink topology; discussion-log.md; all 4 staged references; both staged backlogs. External: WebFetch of https://code.claude.com/docs/en/plugins-reference (confirmed name-only-required, components-at-root, skills-adds-to, CLAUDE_PLUGIN_ROOT, symlink-skipped-outside-marketplace, within-dir-preserved, dereferenced-within-marketplace, version-omitted=commit-SHA, must-bump).

## Locked Frame (Stage 1)
- **S1 Root cause is the real cause, not a symptom.** Checklist: (a) Why terminates at a cause that if absent obviates work; (b) prior attempts documented; (c) no scope drift framed-problem→Design.
- **S2 Scope Contract sharp enough to refuse OOS tasks.** (a) Project/Feature/Task fields non-overlapping; (b) backlog routing for every non-picked candidate; (c) no "etc."/"and related".
- **S3 Why-now concrete + measurable success.** (a) success criteria pass/fail-observable; (b) trigger named with specific reference.
- **S4 (adversarial) Counterfactual steel-manned, not strawmanned.** (a) strongest do-nothing argument presented; (b) rejection stated with evidence.
- **S5 Re-framing produced confirmed reframe or defensible no-change.** (a) outcome recorded with reasoning.
- **S6 (adversarial) Adjacent feature silently absorbs this idea.** (a) checked against existing feature scopes; (b) overlap → explicit split/merge.
- **S7 Load-bearing assumptions ledgered.** (a) assumptions named "if wrong, design fails"; (b) each cites evidence or surfaced as assumption_risk.
- **S8 Prior-art search real, not nominal.** (a) searched project memory + codebase + community; (b) negative results recorded; (c) closest prior arts characterized.
- not-applicable: Accessibility/i18n — owned by Usage; no user-facing UI/strings (CLI/markdown only).

## Per-scenario per-check results
- **S1a** YES — root cause "canonical tree but no manifest contract declaring it to the Claude loader" (L78-79); if a manifest existed, the mirror-repair work is obviated. Terminates at a real cause. **S1b** YES — `.codex-plugin` 159eb21/PR#265 + PR#261 mirror-repair + backlog #258 cited; "no prior `.claude-plugin/` attempt (ls confirms absent)" — I verified root `.claude-plugin` IS absent. **S1c** YES — Design DD-1..6 all serve the framed packaging problem; DD-6 reframe explicitly surfaced "as direction not scope."
- **S2a** YES — Scope Contract has Project (gobbi) / Feature (install-runtime) / Task (two coupled deliverables); boundaries non-overlapping. **S2b** YES — both non-picked candidates (public marketplace; codex/claude reconciliation) routed to staged backlogs, which I confirmed exist on disk. **S2c** PARTIAL — In-Scope line "component-path keys as needed" (L24) uses soft phrasing; Out-of-Scope is well-enumerated. Minor — see F-P1.
- **S3a** YES — success criteria are artifact-checkable (`claude plugin validate` passes; readlink resolves; section presence; doc-citation). **S3b** YES — trigger = direct user request + recurring mirror-repair (PR#260→#261, #258).
- **S4a** YES — steel-man "plugin unnecessary, mirror works, solo-user" is the genuinely strongest do-nothing case and cites feedback_solo_user_context. **S4b** YES — countered with 3 evidence points; concedes the steel-man narrows scope (public marketplace deferred). Honest, not won-by-construction.
- **S5a** YES — reframe (manifest as single source of truth for mirror+#258) recorded and deliberately NOT forced into scope.
- **S6a** YES — idea checked against `install-runtime`; I verified its README owns "channel-split install + mirror-sync + session-runtime-contract (hooks, env-vars)" — plugin packaging of exactly those is a legitimate fit, not silent absorption. **S6b** YES — feature reuse made explicit (B1) with "PROPOSED; user may reroute."
- **S7a** PARTIAL — the load-bearing assumption (escaping symlinks skipped → must point at canonical files) is named and evidence-backed, but it is embedded in DD-2 rationale rather than a discrete assumption ledger. See F-P2. **S7b** YES — every external claim cites a staged ref; I independently confirmed all against the live doc.
- **S8a/b/c** YES — internal (ls/find/grep) + external (4 doc refs) + community (the doc IS the authoritative source); negative result recorded ("no prior .claude-plugin"); closest prior art (.codex-plugin) characterized as skills-only directory-pointer.

## Typed findings

**F-P1** — Type: general · Domain: process · Disposition: open · Confidence: 50 · Severity: Low
Evidence: In-Scope L24 "component-path keys **as needed**"; Decisions-Locked DD-2 itself is sharp, but the In-Scope bullet leaves the manifest's key set ("as needed") slightly open vs the child-doc anti-pattern "Scope Contract must enumerate; no open-ended phrasing." Why it matters: Planning could under- or over-include component keys (e.g. forget `agents` vs `skills` REPLACE-vs-ADD semantics). Suggested direction: Planning enumerates the exact key set (the schema ref already gives ADDS-to/REPLACE rules to pin it).

**F-P2** — Type: assumption_risk · Domain: process · Disposition: open · Confidence: 25 · Severity: Low
Evidence: The artifact's single most load-bearing premise (install copies + skips escaping symlinks ⇒ point at canonical real files, not `.claude/` mirror) is correct and doc-verified, but is not isolated in an explicit assumption ledger entry tagged "if this is wrong, the whole layout fails." Why it matters: a future reader skimming DD-2 might not register it as the linchpin. Suggested direction: optional — surface it as a one-line assumption-ledger entry. Low because the premise is verified-true, not at-risk.

## Per-perspective verdict: PASS
