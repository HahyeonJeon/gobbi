# Overall (Stage 3) — Claude Evaluation (iter 2)

## Synthesis
The iter-2 draft is a strong, well-grounded revision. Every iter-1 finding is resolved, and the resolutions are not cosmetic — they trace to independently verified evidence. I re-verified all five git shas (62b95a0, ba8aa42, c79d28e/#251, e083fad, e083fad^) and all load-bearing external schema claims against the live `code.claude.com/docs/en/plugins-reference` (name-only-required; `agents` = file-path ARRAY that REPLACES; `skills` ADDS-to dir-pointer; `hooks` = hooks.json file; escaping-symlink skip). The settings.json hook topology (2 scripts / 3 registrations) and the agents-dir `.md`/`.toml` mix were verified verbatim. The producer did not over-claim: notably, it correctly attributes materialization to #251 (on main) and does NOT falsely claim the last-live e083fad^ used real files (e083fad^ was in fact symlinks — the draft's narrower claim about the agents-ARRAY shape + hooks.json existing is true).

No Critical finding. No open High finding. The residuals are three Medium findings (F-S1 drift-trigger specificity, F-U1 unchosen worktree default, F-C1 stale reference body) plus minor Low items — all are appropriate to surface to the user before Planning rather than blockers to a PASS.

## Per-perspective verdict roll-up
- Project: PASS (F-P1 Low assumption_risk)
- Structure: PASS (F-S1 Medium — drift/sync re-sync trigger not specified)
- Performance: PASS (F-PERF1 Low/25)
- Aesthetics: PASS (A1 resolved; F-A1 Low redundancy)
- Usage: PASS (F-U1 Medium — DD-7 worktree path lacks a recommended default unlike DD-8/DD-9)
- Consistency: PASS (F-C1 Medium — staged cache-symlink reference body still recommends the overturned repo-root option)
- Risk: PASS (R1+R2 resolved; F-R1 Low/25)

## Cross-perspective tensions
- Structure (F-S1) and Consistency (F-C1) both point at the SAME deeper theme: the bounded-package model creates a sync surface, and the iter-2 pivot to it was not fully propagated. F-C1 (the reference still recommends repo-root) and F-S1 (the drift trigger is unnamed) are two faces of an incomplete "everything that should change together changed together" sweep. Neither is High because the DRAFT itself is correct and consistent; the gaps are in a supporting reference and in trigger-specificity. Together they are the single most useful thing to fix before Planning.
- Usage (F-U1) diverges from the draft's own pattern: DD-8 and DD-9 carry recommendations; DD-7 does not. Internal inconsistency of decision-treatment, not of fact.

## Karpathy four failure modes
- **Wrong assumptions** — NOT PRESENT (one minor: DD-9 auto-grant premise, F-P1, Low). All load-bearing premises (escaping-symlink-skip, hooks-relocation-safe, agents-as-array, prior-package-existed) are independently verified true.
- **Overcomplexity** — NOT PRESENT. The bounded package matches proven prior art (62b95a0); no innovation token spent; symlink alternative explicitly rejected with #251 evidence.
- **Orthogonal edits** — NOT PRESENT. The two deliverables (plugin + skill) are genuinely coupled (the skill documents the plugin's drift surface); scope is bounded; 2 candidates correctly backlogged.
- **Imperative-over-declarative** — NOT PRESENT. Success criteria state verifiable goals ("validate passes", "cache contains ONLY ...", "each hook fires exactly once", "readlink resolves") rather than prescribing mechanism; mechanism is explicitly Execution's.

## iter-1 finding resolution summary (authoritative)
- **P1** (prior-art false claim, High/100) — RESOLVED. Git-sha-cited history present + independently verified.
- **R1** (77M session memory into cache, High/75) — RESOLVED. DD-2 bounded package + cache-contents gate.
- **S1** (agents field shape, High/75) — RESOLVED. 5-`.md` array + `.toml` exclusion; doc-confirmed REPLACES semantics.
- **R2** (hook double-registration, Medium/75) — RESOLVED. DD-8 Planning blocker, options A/B/C + fire-exactly-once validation.
- **U1** (worktree install tests wrong checkout, High/75) — RESOLVED. DD-7 + worktree-sentinel + new reference. (Residual: no recommended default — F-U1 Medium.)
- **U2** (permissions disposition, Medium/75) — RESOLVED. DD-9 user-operable + invocability check.
- **F-C1/F-A1** (hook count, Low/75) — RESOLVED. "2 scripts / 3 registrations" throughout; matches settings.json.
- **A1** (codex, ratified/proposed label conflict, Medium/100) — RESOLVED. Zero stale "PROPOSED"/"awaiting ratification" labels (grep-verified).
- **PERF1** (codex, repo-root cache payload, Medium/75) — RESOLVED. Subsumed by R1.
- **C1** (codex, skill inventory sync, Low/75) — addressed for ideation (no divergent enumeration introduced).

No new HOLE introduced by iter-2. The three Medium residuals are NEW but minor, and all stem from incomplete propagation of the iter-2 pivot, not from a broken decision.

## Preserve list (do NOT break on any REVISE)
1. **External-schema + prior-art grounding is exemplary** — all 6 references trace to authoritative sources; all 5 git shas and the live-doc schema claims independently re-verified. The "no memory-sourced schema; every prior-art claim cites a sha" success criterion is met. Do not dilute.
2. **The honest, accurate prior-art narrative** — including the careful distinction between #251 materialization (on main) and the e083fad^ symlink last-live shape. Do not overwrite with a sloppier "it already existed" framing.
3. **DD-2 bounded package + cache-contents gate** — the correct R1 resolution and the privacy boundary. Do not reopen repo-root.
4. **DD-8 hook double-registration as a Planning blocker with options + fire-exactly-once validation** — the right level of resolution for ideation.
5. **The steel-manned counterfactual** (retained + strengthened with the wiped-package point).
6. **Hook-count accuracy (2 scripts / 3 registrations)** verified against settings.json.

## Overall verdict: PASS
No Critical (≥75); no open High (≥50). Three Medium findings (F-S1, F-U1, F-C1) recorded for user discussion before Planning per the gobbi "discuss findings before improving" discipline — they refine readiness but do not block the PASS. The draft is ready to plan against, with those three refinements recommended.
