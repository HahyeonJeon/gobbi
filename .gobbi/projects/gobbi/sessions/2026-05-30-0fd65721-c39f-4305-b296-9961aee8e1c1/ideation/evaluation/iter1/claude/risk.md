# Risk — Ideation eval iter1 (claude)

## Artifact Summary + Memory reads
(See project.md.) Risk lens: blast radius, reversibility, security surface, scope drift, the hook double-fire hazard, cost.

## Locked Frame (Stage 1)
- **S1 Rollback path identified for any irreversible step.** (a) rollback stated or "no irreversible steps."
- **S2 Blast radius bounded.** (a) affected files/consumers enumerated; (b) backcompat impact stated.
- **S3 No silent security-surface expansion.** (a) security delta none or described; (b) new untrusted-input path validated.
- **S4 Irreversible steps gated.** (a) flagged; (b) go/no-go point.
- **S5 Two-week smell test.** (a) no load-bearing future-self promises; (b) maintenance burden named.
- **S6 (adversarial) Design touches files outside the Scope Contract.** (a) diff contract vs Design; (b) outside-scope → re-scoped or backlogged.
- **S7 Concurrency/race surface.** (a) shared mutable state identified — the `session.json` flock + double-fire.
- **S8 Privacy** — not-applicable: no PII/sensitive data introduced.
- **S9 License/IP** — (a) bundling gobbi's own files; no third-party code introduced.
- **S10 Cost** — not-applicable: no paid API/infra; local packaging.

## Per-scenario per-check results
- **S1a** YES — install is reversible (`claude plugin uninstall` removes cache + data dir; project `.gobbi/` untouched — Uninstall scenario). Authoring the manifest/skill is additive files (git-revertible). No irreversible step.
- **S2a** PARTIAL — blast radius partly enumerated (new `.claude-plugin/` files, new mirror symlink, hooks.json) but the interaction with the LIVE `.claude/settings.json` hooks is the under-bounded edge — see S7/F-R1. **S2b** YES — no external interface; solo-user, backcompat n/a (feedback_solo_user_context).
- **S3a** YES — security delta is essentially none: bundling existing files; the ref's own caveat ("plugin hooks run unsandboxed at hook trust level; jq must be on PATH") is surfaced in the hooks ref. No new auth/egress/untrusted-input path. The symlink-skip-on-install is itself a SECURITY feature the design respects rather than circumvents. **S3b** n/a — no new untrusted input.
- **S4a/b** YES — no irreversible step to gate.
- **S5a** YES — no "improve later" load-bearing promise (DD-6 manifest-as-authority is explicitly NOT this session's build). **S5b** YES — maintenance burden named (the reframe explicitly reduces future mirror-repair burden).
- **S6a** YES — I diffed Scope Contract vs Design: Design touches `.claude-plugin/` (in scope), `hooks/hooks.json` (in scope DD-3), the canonical skills/agents tree (read-only pointer, not modified), and one new `.claude/skills/claude-plugin/` symlink (in scope DD-6). No out-of-scope file. **S6b** YES — codex reconciliation + public marketplace both backlogged (files confirmed).
- **S7a** REAL RISK — the hook double-fire: if the plugin's `hooks/hooks.json` registers the same two scripts that `.claude/settings.json` already registers, then on the dev machine (which has BOTH) every SessionStart appends env-vars twice and every Task double-upserts `session.json.agents[]`. The draft flags this (L51) but defers resolution. `session.json` writes are flock-guarded (D-3-5) so no corruption, but double-upsert/double-append is a correctness risk. See F-R1.
- **S9a** YES — gobbi's own files only.

## Typed findings
**F-R1** — Type: design_flaw · Domain: process · Disposition: open · Confidence: 50 · Severity: Medium
Evidence: Hook double-fire. On the gobbi dev repo itself, `.claude/settings.json` registers `session-start.sh` + `post-tool-use-agents.sh` (3 event blocks). If the plugin's `hooks/hooks.json` also registers them and the plugin is installed/active in the same repo, both fire per event. session-start.sh APPENDS `export` lines to `$CLAUDE_ENV_FILE` (duplicate exports — last-wins, mostly benign) and post-tool-use-agents.sh upserts-by-id into `session.json.agents[]` (upsert-by-id is idempotent per D-3-2, so double-fire likely converges — but two flock round-trips per Task adds latency + log noise). Why it matters: the artifact names the risk (L51) but ships no resolution direction, leaving a real double-execution path for Planning to resolve blind. Suggested direction: Planning decides replace-vs-coexist; note the upsert-by-id idempotency partially de-risks it. Medium (not High) because flock + upsert-by-id idempotency bound the blast radius to latency/noise, not corruption.

**F-R2** — Type: assumption_risk · Domain: security · Disposition: open · Confidence: 25 · Severity: Low
Evidence: The hooks ref caveat "plugin hooks run unsandboxed at hook trust level" is surfaced but the artifact does not weigh that an installed third-party-style plugin shipping shell hooks is a higher-trust install than skills-only. For solo-user self-install this is moot (you trust your own hooks). Why it matters: only relevant if gobbi later targets external adopters (already backlogged). Suggested direction: the claude-plugin skill's general section should note the trust delta of shipping hooks. Low/25 — solo-user context neutralizes it now.

## Per-perspective verdict: PASS
