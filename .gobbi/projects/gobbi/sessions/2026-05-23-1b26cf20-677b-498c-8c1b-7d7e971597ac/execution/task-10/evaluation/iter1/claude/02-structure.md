# Perspective: Structure

## Frame execution

**Section layout — delegation/SKILL.md:**
- Insertion at L207 (between an existing `---` HR and the prior section). New section uses `## Hook Integration` H2 with `### Structured-Header Convention` and `### Serialization safety — flock -x on session.json` H3 children. Layout matches the file's prevailing H2/H3 cadence.
- 4-column header / value-shape / required / purpose table mirrors the table convention already used in this file.
- New section is followed by `---` then `## Anti-Patterns`, preserving the prevailing HR-between-sections rhythm.

**Section layout — orchestration/SKILL.md:**
- Row 6 narrative was expanded inside the same numbered-list row of the Step 1 SOP table (no structural displacement of adjacent rows).
- Workflow-Metadata `agents` update points table cell was rewritten in place.

**Header levels:** Correct (H2 for new section, H3 for the two sub-sections). No skipped levels.

**Link integrity (sampled):**
- `[delegation/SKILL.md § Hook Integration](../delegation/SKILL.md#hook-integration)` — anchor matches `## Hook Integration` slug.
- `[.claude/hooks/post-tool-use-agents.sh](../../../../.claude/hooks/post-tool-use-agents.sh)` — 4 `../` levels from `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` to repo root → resolves to `.claude/hooks/post-tool-use-agents.sh`. Verified by `ls`.
- `[Step 1 row 6](#step-1--workflow-configuration)` — Workflow-Metadata table cell links back; H3 is `### Step 1 — Workflow Configuration`, slug `#step-1--workflow-configuration` (double dash for em-dash) — correct.

**Table shape:** 4-column structured-header table is internally consistent (4 rows × 4 cells).

## New findings

- **F-S-1 [structure / aesthetics, Low, 75]**: The row 6 cell is now a single ~470-word monoblock with bold sub-leads ("**Specialist entries are appended automatically by the PostToolUse hook**", "**Stamping mechanism (FIX A):**"). It's at the upper bound of cell-density for the SOP table; readers scanning the third column will struggle. Not a structural bug — readability concern documented under Aesthetics.
- **F-S-2 [structure, Low, 100]**: No structural defect found. Insertion point clean; section ordering preserved.

## Verdict

PASS.
