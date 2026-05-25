# Usage — T07 (commit f2356ca)

## Artifact Summary + Memory reads
(see project.md.) Consumer = a future agent/assistant reading CLAUDE.md, gobbi/SKILL.md, or wrap-up/SKILL.md to learn how mistake promotion works, and the future-self resolving the backlog. Question: can they operate the model correctly from the docs alone, with no CLI to reach for?

## Locked Frame (Stage 1)
- **S1 Reader learns the real mechanism**: docs tell the agent to stage candidates and that the Wrap-up assistant promotes — not to run a command.
- **S2 No false affordance left**: no surface tells a reader to run `gobbi mistake promote` (which would fail).
- **S3 Both layers operable from docs**: a Wrap-up assistant reading wrap-up/SKILL.md knows it performs Layer-2.
- **S4 Reader hits the doc cold at 3am (adversarial)**: with no prior context, is the two-layer mechanism unambiguous and actionable?
- not-applicable: accessibility/i18n — agent-facing English markdown, scannable headings present (declared n/a for UI a11y).

## Per-scenario per-check results
- S1 YES — CLAUDE.md L50: "record it as a mistake-candidate in session staging ... the Wrap-up assistant promotes staged candidates". Action is staging, not command-running.
- S2 YES — zero `gobbi mistake promote` across all three prose surfaces (tool-verified). The dead command is fully removed as an affordance.
- S3 YES — wrap-up/SKILL.md L53-55 explicitly assigns Layer-2 to the Wrap-up assistant, with an Always-Ask user-confirm gate for generalizability. A Wrap-up assistant reading its own skill now knows the responsibility exists.
- S4 MOSTLY — the mechanism (who/when/no-CLI) is clear. The one residual ambiguity for a cold reader: *where* does Layer-2 land? "workspace-level skill storage" is named but not a concrete path (see F-USAGE-01). A reader can still operate Layer-1 fully and knows Layer-2 is "Wrap-up assistant, user-confirmed", but would need to ask the user for the exact destination.

## Typed findings
**F-USAGE-01** — Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: 50 / Severity: Low
Evidence: wrap-up/SKILL.md L55 + gobbi/SKILL.md L192 + CLAUDE.md L50 all say Layer-2 lands in "workspace-level skill storage" with no concrete path. A Wrap-up assistant executing Layer-2 cold would not know the exact destination directory. Why it matters: incomplete operability for the Layer-2 step. Suggested direction: same as F-STRUCT-01 — manager/user decide whether to pin a concrete destination now or leave the destination as a user-confirmed Always-Ask decision (the doc already routes generalizability through user confirmation, which partially covers this). Consistent with the user-locked "mechanism, not full mechanics" intent.

## Low-confidence appendix
(none)

**Verdict: PASS** (F-USAGE-01 Low)
