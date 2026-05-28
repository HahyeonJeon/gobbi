# Risk Perspective — T1 conform features/agents to §4 (commit 68c9cfd)

Lens: what could this change silently break — data loss, scope bleed, safety-invariant violation, gaming.

## Threat checks
- **Narrative loss (the #1 risk for a "strip" task):** reviewed ALL deletions in the commit (`git show 68c9cfd | grep '^-'`). Every removed line is either (a) frontmatter (date/session/finding-id/confidence/severity/etc.), (b) a heading rename (`## Related`→`## Source`), or (c) a cryptic-coord line REPLACED by self-contained prose in the same hunk. NO body narrative was deleted without replacement. The `design-literal-retire` mistake (never delete narrative, reclassify) is honored. PASS — this is the highest-stakes gate and it is clean.
- **Safety invariant (§4.4):** `disposition: deferred` PRESERVED on `backlogs/privacy-retention` (verified on disk + in diff). No legitimate type extension stripped. PASS.
- **Over-strip risk:** the gate is a type-aware allowlist; `disposition`, `domain`, `privacy`, `ref_type`, `value_proposition`, `subsystems` all survive. No blanket-grep collateral. PASS.
- **Scope bleed (P4):** `git show --stat` → all 12 changed paths under `features/agents/`. No edit escaped the contracted subtree. No main-tree edit (`executor-main-tree-edit` mistake): branch is `chore/session-2026-05-25-a10c82d6`, tree clean. PASS.
- **Gaming (P11):** the conformance gate prints zero NOT because keys were hidden but because they were genuinely moved/removed per the allowlist. Underlying property (zero illegitimate staging keys) actually holds. PASS.
- **Dangling references:** referenced mistake paths exist; Source footers either resolve or are honestly hedged as future promotions. Low residual risk only on the two not-yet-promoted companion files. 

## Findings
- **F-RISK-1 — assumption_risk / docs-sync — Low — Confidence 50.** Two Source footers forward-reference files not yet on disk (`lock2-shared-executor-mega-task-risk.md`, `broader-delegation-contract-verifier.md`). Hedged, so not a live break, but a latent dangling-pointer risk if the promotions are dropped. Disposition: open (informational; outside T1).

No Critical or High risk findings.

VERDICT: PASS
