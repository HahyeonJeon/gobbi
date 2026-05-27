# T1 conform-agents — iter1 execution notes

## Scope

14 docs under `features/agents/` brought into conformance with §4 of `memorization/rules.md` (base frontmatter schema, type-aware staging-key strip, body de-crypt of session coords).

## Files audited

1. `README.md` — missing name/description/type/session/tags; non-standard project/last_updated keys (not in S, preserved)
2. `backlogs/privacy-retention-agents-metadata-deferred.md` — missing name/description/created/tags; wrong type (checklist_gap→backlogs); S-set leaks: finding-id/confidence/severity; disposition KEPT (backlog)
3. `changelogs/2026-05-26-bundle-a-rehome.md` — missing name/description/type/created/tags
4. `changelogs/2026-05-26-bundle-b-rehome.md` — already conformant; no changes needed
5. `checklists/d-ref-codes-missing-inline-expansion.md` — missing name/description/status/created/session/tags; wrong type (checklist_gap→checklists); S-set leaks: finding-id/confidence/severity/surfaced-by/disposition (disposition stripped — not a backlog)
6. `design/execution-intake-notes-cross-cutting.md` — missing name/description/type/created/session/tags; non-standard title/related keys (not in S, related removed from frontmatter as it's body content)
7. `design/memorization-delegation-hard-gate.md` — missing name/description/type/created/tags; S-set leaks: promoted-from/promoted-at
8. `discussions/2026-05-24-shared-executor-context-continuity.md` — missing name/description/type/status/created/tags
9. `discussions/scope-literal-ask-vs-broader-verifier.md` — missing name/description/type/status/created/tags
10. `references/autogen-pydantic-tool-schema-validation.md` — missing name/description/status/created; type overloaded (blog→ref_type; type: references added)
11. `references/claude-code-agent-sdk-task-output.md` — missing name/description/status/created; type overloaded (docs→ref_type; type: references added)
12. `references/langgraph-skill-catalog-pattern.md` — missing name/description/status/created; type overloaded (docs→ref_type; type: references added)
13. `references/rbac-matrix-single-source-of-truth.md` — missing name/description/status/created; type overloaded (docs→ref_type; type: references added)
14. `scenarios/hook-silence-no-agents-mutation-diagnostic.md` — missing name/description/created/session/tags; wrong type (scenario_gap→scenarios); S-set leaks: finding-id/confidence/severity/disposition (disposition stripped — not a backlog)

## Body de-crypts applied

- `backlogs/privacy-retention-agents-metadata-deferred.md`: "iter1 Codex Risk finding COD-RISK-003" → described as "Codex risk evaluation of the agents[] hook"; Related section with eval path coords → Source footer
- `checklists/d-ref-codes-missing-inline-expansion.md`: "Preparation iter3 context" → "session 1b26cf20 Preparation"; staging anchor column removed from checklist table; D-* codes explained inline
- `design/execution-intake-notes-cross-cutting.md`: staging path ref "preparation/staging/decisions/mirror-propagation-policy-..." → "session 1b26cf20 Preparation"; "Preparation D-3 decision" → "session 1b26cf20 Preparation decision"
- `design/memorization-delegation-hard-gate.md`: "Design C", "Pathology α", "I6", "Bundle A creates (item C)" → plain prose; title de-indexed
- `discussions/2026-05-24-shared-executor-context-continuity.md`: "draft-iter2.md:459" → Source footer; staging path → canonical path
- `discussions/scope-literal-ask-vs-broader-verifier.md`: "CP-1.2-β", "rawdata/draft-iter3.md:456-457", staging backlog path → plain prose + Source footer
- `scenarios/hook-silence-no-agents-mutation-diagnostic.md`: eval path coords "evaluation/iter2/claude/usage.md U3" etc → Source footer

## Out-of-scope observations

- `README.md` carries non-standard `project: gobbi` and `last_updated:` keys. These are not in S (not staging-routing keys), so not stripped per the safety invariant. However they are also not base-schema keys or listed feature-README extensions. Future prose wave or a FIX-2 sweep should clean them up.
- `design/execution-intake-notes-cross-cutting.md` has content that reads like boilerplate/intake notes for a specific session's Execution loop (Tasks 01-10 from bundle-b). Per §4.1.1 type-purity, this is arguably session-state content that belongs in `notes/` rather than `design/`. Not reclassified here (mechanical pass only — reclassification is a judgment call for the prose wave or user).
- `discussions/scope-literal-ask-vs-broader-verifier.md` filename `scope-literal-ask-vs-broader-verifier.md` has no date prefix. Per §1.2, discussions are date-prefixed. This file's name violates the naming convention. Not renamed here (naming is T0-class work / out of this task's scope boundary). Noted for future.
- Several `design/` and `checklists/` files reference decisions from session 1b26cf20 by opaque short codes (D-3, D-4, D-9). The de-crypt pass expanded these where possible from context but does not guarantee full fidelity — the originating session's Preparation artifacts would be needed for complete expansion.

## Verification summary

1. Leak gate (features/agents): 0 leak files (xargs exit 123 = no matches)
2. 9 base keys on all 14 docs: loop prints nothing
3. disposition preserved on backlogs/privacy-retention-agents-metadata-deferred.md
4. git diff --name-only: 13 paths, all under features/agents/
