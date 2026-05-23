# Aesthetics Perspective — iter2 re-eval (Claude)

## Frame

Scenarios:
1. iter2 draft prose quality — clear, scannable, well-structured.
2. Stub scaffolding HTML comments — helpful enough for Execution to fill without guessing?
3. Casing/style consistency (lowercase `Path conventions` after iter2 fix).

## Verification

- iter2 draft: scannable, tables well-formed, changelog table is clear.
- Stub HTML comments are detailed enough — each section gives Execution concrete witnesses (I1, I2, I13, mistake-file path, sandbox table).
- `Path conventions` casing now lowercase per Claude convention (memorization heading line 224 is `**Path conventions**`).

## Findings

### F-A-01 — Stub comment line 104 explicitly admits structural deviation
- Type: `general`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: Medium
- Evidence: Stub line 104: `Cost + sandbox budget awareness sub-bullet (folded in here, NOT a separate section):` — the comment itself flags that iter2 has moved a locked-spec section into a sub-bullet location. Aesthetic signal: this is a "this hurts" comment, the author leaving a marker that the structure-as-shipped doesn't match the original intent.
- Why it matters: low-confidence-as-aesthetic-finding, high-confidence-as-corroboration of F-S-01: the author noticed the mismatch and left a flag rather than restoring the section. This is "imperative-over-declarative" — the comment imperatively tells Execution to fold-in, rather than letting the declarative locked structure stand.
- Suggested direction: covered by F-S-01.

### F-A-02 — Constraints block-vs-H2 confusion in stub line 126-136
- Type: `general`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 75
- Severity: Low
- Evidence: `## Constraints` is an H2 at line 126, but its content is a MUST/NEVER/ALWAYS bullet list. Per `_claude/SKILL.md` Constraints convention (referenced in the stub's own comment), Constraints is typically a `> blockquote` block at the end of a SKILL.md, not an H2 with its own section. Visual weight is inconsistent.
- Why it matters: minor aesthetic drift from project skill convention.
- Suggested direction: covered by F-S-02 (demote to body block).

## Must-preserve

- iter2 draft's changelog table style.
- Detailed HTML comment scaffolding in stub.
- Lowercase `Path conventions` correction.

## Verdict

PASS-on-aesthetics-alone, but inherits REVISE via project/structure.
