# Aesthetics — T06 codex skill content

## Artifact Summary
Same as project.md.

## Locked Frame (Stage 1)

Aesthetics — readability, naming, style conventions, polish; "does every element earn its pixels" (Rams); "self-evident at first read" (Krug).

- **S-A-1** Naming convention — H2 + H3 names match the locked spec verbatim.
- **S-A-2** Code blocks are properly fenced and language-tagged.
- **S-A-3** Tables vs prose vs lists — appropriate medium for the content.
- **S-A-4** Paths and identifiers are consistently backtick-formatted (user feedback memorized: "Always backtick-format file/directory paths in `.claude/` docs").
- **S-A-5 (adversarial)** Inconsistent capitalization, stale references, broken markdown.

## Stage 2 — Per-check evidence

- S-A-1 ✓ All 8 H2 names verbatim against plan.md:350.
- S-A-2 ✓ Bash blocks are tagged `bash`; topology blocks use plain fences.
- S-A-3 ✓ Tables used appropriately (mode table, tool-surface table, situation-vs-preferred-tool table). Prose where prose fits (assistant-wrapper rationale).
- S-A-4 ✓ Spot-check: `codex exec`, `--cd`, `Agent`, `tools:`, `codex:codex-rescue`, `.claude/skills/codex/SKILL.md`, `~/.codex/config.toml` — all backticked.
- S-A-5 Spot-check:
  - Line 58 "Managers-only restriction" — should be "Manager-only restriction" for grammatical consistency with elsewhere.
  - Line 38 has hanging `--add-dir` example pointing to `--add-dir /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>` (no trailing path segment) — minor; reader is expected to interpolate.

## New findings

### F-A-01 — Minor grammatical inconsistency "Managers-only" vs "manager-only"
- Type: `general` | Domain: `docs-sync` | Disposition: `open` | Confidence: 75 | Severity: Low
- Evidence: Line 58 "Managers-only restriction" vs Section 2(b) header "manager-only secondary" + Section 2(c) "user-only" + repeated "manager-only" usage elsewhere.
- Why it matters: Low. Polish.
- Suggested direction: Change to "Manager-only restriction".

## Verdict
- Critical/≥75: 0; High/≥50: 0
- **Aesthetics verdict: PASS.**
