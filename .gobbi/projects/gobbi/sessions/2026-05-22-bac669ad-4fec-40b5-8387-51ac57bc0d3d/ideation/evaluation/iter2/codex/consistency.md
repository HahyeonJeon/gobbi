# Consistency Perspective

Verdict: REVISE

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. This perspective checks cross-section agreement: Iter2 Changelog versus body, hook contract table versus P2/P4, P6 versus exit/success criteria, and schema field inventory coverage.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/ideation/evaluation.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/consistency.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/overall.md`
- `.gobbi/projects/gobbi/mistakes/README.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`

## Locked Frame (Stage 1)

Scenario: The eight changelog claims agree with the artifact body.
- Check: Every changelog item has body evidence.
- Check: Body sections do not contradict the remediation.

Scenario: Hook contract table, P2, P4, and Scope Contract use the same env-var model.
- Check: Old and new session ID names are not mixed as exports.
- Check: `source` and `hook_event_name` remain distinct.

Scenario: P6 session metadata changes are synchronized across file inventory, edit set, exit criteria, and scope.
- Check: `orchestration/SKILL.md` line-371-area list appears in both file inventory and P6 edit/scope text.
- Check: `transcriptPath` tilde-form appears in P6, exit criteria, P7 wording, and success criteria.

Scenario (adversarial): A body-level contradiction hides behind a corrected changelog item.
- Check: "Not deferred" wording is not contradicted by other artifact commitments.

Coverage declarations:
- Privacy is jointly checked with Risk.
- License/IP and supply chain are not materially changed by the ideation artifact; `jq` dependency is declared for Preparation verification (`idea.md:192`).

## Per-scenario per-check results

Changelog/body agreement:
- Confirmed: F1/FIX 1 maps to body lines `idea.md:214`, `idea.md:263`, `idea.md:311`, and `idea.md:323`.
- Confirmed: F2/FIX 2 maps to `idea.md:83`, `idea.md:276`, and `idea.md:390`.
- Confirmed: F3/FIX 3 maps to `idea.md:124` and `idea.md:292`.
- Confirmed: FIX 4 maps to the two-gate health model at `idea.md:235-249`.
- Confirmed: FIX 5 maps to stdin/source and export rows at `idea.md:195-218`, plus P2/P4 at `idea.md:263` and `idea.md:277`.
- Confirmed: FIX 6 maps to body `v2.1.132` references at `idea.md:43`, `idea.md:143`, `idea.md:241`, `idea.md:283`, and `idea.md:348`; `v2.1.128` appears only in the changelog at `idea.md:29`.
- Confirmed: FIX 7 maps to `idea.md:92-97`, `idea.md:295`, `idea.md:349`, and `idea.md:371`.
- Confirmed: FIX 8 maps to `idea.md:124`, `idea.md:293`, `idea.md:299`, and `idea.md:327`.

Hook model:
- Yes: Hook table and P2 agree that the hook exports `CLAUDE_CODE_SESSION_ID`, not `CLAUDE_SESSION_ID` (`idea.md:214`, `idea.md:263`).
- Yes: P4 and Scope Contract agree that `CLAUDE_HOOK_SOURCE` is a table row/export and not a new session field (`idea.md:277`, `idea.md:313`, `idea.md:337`, `idea.md:367`).

P6 synchronization:
- Yes: `orchestration/SKILL.md` line 371 area is present in the P6 file inventory and P6 decision text (`idea.md:92-97`, `idea.md:294-295`).
- Yes: It is also in success/scope surfaces (`idea.md:326`, `idea.md:349`, `idea.md:371`).
- Note: No separate section titled "Files Touched" exists; the artifact uses File inventory, In-Scope, Scope Contract In-Scope, and Decisions Locked instead (`idea.md:49`, `idea.md:98`, `idea.md:342`, `idea.md:364`).

Adversarial contradiction:
- No: P6 says stamping happens this session and is not deferred (`idea.md:292`), but the artifact also says runtime code is excluded and manager-side stamping is a docs-only contract/future CLI implementation (`idea.md:109`, `idea.md:316`, `idea.md:357`, `idea.md:381`).

## Typed findings

### COD-CONS-ITER2-001

Type: design_flaw
Domain: docs-sync
Disposition: open
Confidence: 75
Severity: High
Evidence: P6 states "`transcriptPath` ... happens THIS session" (`idea.md:292`), and exit/success criteria require this session's own `session.json` to carry the field (`idea.md:124`, `idea.md:327`). Other sections exclude `packages/cli/src/` runtime code and describe manager-side stamping as docs-only or future CLI implementation (`idea.md:109`, `idea.md:316`, `idea.md:357`, `idea.md:381`). The artifact therefore carries two incompatible statements about whether stamping is actually implemented for this session.
FP-check: Not style; not speculative because all evidence is in the artifact body; not out-of-scope because it is part of P6 and exit criteria.

## Low-confidence appendix

None.
