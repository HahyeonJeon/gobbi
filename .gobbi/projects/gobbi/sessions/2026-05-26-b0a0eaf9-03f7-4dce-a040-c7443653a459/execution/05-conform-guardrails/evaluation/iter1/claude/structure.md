# T5 Conformance — Structure Perspective (Claude, iter1)

Scope: frontmatter schema correctness, type-field correctness, directory-as-category integrity.

## Verification

- **type field correctness:** README `type: features`; backlogs `type: backlogs` (×3); checklists `type: checklists` (×2); discussion `type: discussions`; references `type: references` (×2). All match their directory (§3 directory-as-category). The two references correctly migrated the old `type: blog`/`type: docs` into `ref_type: blog`/`ref_type: docs` and set base `type: references` — a correct §2.2 mapping. PASS.
- **per-type extensions present and legitimate:** backlogs carry `priority`/`disposition`/`project-scope`/`shipped_in`; README carries `value_proposition`/`subsystems`; references carry `title`/`source`/`accessed`/`ref_type`. All §2.2-legitimate. PASS.
- **atomicity / one-record-one-concept:** no bundle files introduced; the hook-event-count item legitimately exists in both `backlogs/` and `checklists/` forms (cross-linked), which is two distinct type-jobs, not a duplicate. Acceptable.

## Findings

### F-STRUCT-1 — `related:` frontmatter key dropped on both references (over-mechanical removal)
- **Type:** general | **Domain:** docs-sync | **Disposition:** open | **Confidence:** 100 | **Severity:** Low
- **Evidence:** `references/claude-code-hooks-12-lifecycle-events.md` lost `related: [claude-code-posttooluse-hook-schema, claude-code-agent-sdk-task-output]`; `references/claude-code-posttooluse-hook-schema.md` lost `related: [claude-code-agent-sdk-task-output]` (git show 8e6ae25).
- **Why it matters:** `related` is NOT in the strip-set S (§4.4), so removing it is neither required nor authorized by T5's mechanical mandate. The manager brief explicitly states the references `related:`-in-frontmatter observation is OUT of T5 scope (deferred). The executor removed it instead of deferring — a small content removal that drops the cross-reference graph between the two reference docs. It is not a §2.2 references extension, so its eventual removal may be defensible, but doing it silently inside the mechanical task contradicts the brief's explicit deferral.
- **Suggested direction:** manager to decide whether the `related:` removal is accepted (it cleans a non-standard key) or should have waited for the deferred references decision; the dropped link targets are recoverable from git history.

**Must-preserve:** correct type-field-to-directory alignment and the §2.2 extension sets.

VERDICT: PASS
