# T10 Evaluation — Project Perspective (Claude, iter1)

Target: reconcile .codex/AGENTS.md 12→13 principles. Commits 0a8e5dd + 3a79e8b on chore/session-2026-05-25-a10c82d6.

## Contract
T10 brief: AGENTS.md said "12 principles" with no P13 row while CLAUDE.md already carried P13 (NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN). Reconcile count to 13 and add the P13 Iron Law row verbatim. Cross-entrypoint consistency between the Claude entry point (CLAUDE.md) and the Codex entry point (.codex/AGENTS.md).

## Verification (own commands)
- Both commits present on chore branch, NOT on develop (`git branch --contains` shows only chore/session-2026-05-25-a10c82d6 for both).
- Chain atop c001694 (T9c) confirmed via `git log --oneline`.
- 0a8e5dd: count ref line 63 (12→13) + appended P13 table row. +2/-1.
- 3a79e8b: residual count ref in Navigate-Deeper table line 94 (12→13). +1/-1.
- P13 row byte-exact match to CLAUDE.md line 47: `| 13 | NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN. |`.
- Iron Law table rows 1-13 contiguous and complete.

## Assessment
The work fully satisfies the brief. Both the prose count (two locations: principles intro line 63, Navigate-Deeper table line 94) and the table row are reconciled. P13 text is verbatim-identical to the authoritative CLAUDE.md. No real motivator concern (P10): the divergence was a genuine cross-entrypoint inconsistency. P8/docs-sync honored — Codex entry point now mirrors the Claude entry point.

## Findings
None.

## Must-preserve
- Verbatim P13 row identical to CLAUDE.md.
- Both prose count references updated (the residual-fix commit caught the second one).

VERDICT: PASS
