# Cursor fourth runtime completed

**Completed at:** 2026-08-16T15:05:03Z

## Changes

- Added Cursor as a checkout-local fourth Gobbi runtime: role contracts and project mirrors, a
  `.cursor/skills` discovery root, entry and checker observation, Partner name `cursor`, existing-role
  wording, and user-facing docs. See [Partner](../design/feature/partner.md).
- Kept Partner launch Unavailable. The measured binary is `cursor-agent` `2026.08.11-e8db854`. Pins stay in
  official-docs form. Plugin agents stay Claude and Grok. Agent Teams stays Claude-only.
- Changed the skill linker so it skips existing discovery directories such as `.claude/skills/checklist`
  instead of failing or migrating them.
