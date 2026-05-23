# Usage — T06 codex skill content

## Artifact Summary
Same as project.md.

## Locked Frame (Stage 1)

Usage — consumer POV: the next agent / user / operator / future-self loading this skill.

- **S-U-1** Load triggers in Section 1 are concrete enough that an agent knows when to load.
- **S-U-2** A 3am-tired reader looking up "how do I spawn codex from an executor?" finds the answer fast.
- **S-U-3** Failure modes are communicated — what happens if I omit `--cd`? What if I run from a worktree?
- **S-U-4** Worked examples can be copied-and-modified without ambiguity.
- **S-U-5 (adversarial)** Operator-accessibility: skip-friendly headings, scannable structure (Coverage Ownership Matrix § Accessibility → Usage).
- **S-U-6** Operator can diagnose at 3am from this skill alone (Coverage Ownership Matrix § Observability → Structure + Usage).

## Stage 2 — Per-check evidence

- S-U-1 ✓ Section 1 lists four concrete triggers (manager spawning evaluator; manager directing user; subagent inline; delegation-prompt Load Directives). Negative case ("not needed when no Codex") stated explicitly.
- S-U-2 ✓ Section 3 table at lines 99-105 is the canonical answer; Section 2(a) example block at lines 36-42 is the canonical invocation.
- S-U-3 ✓ Section 4 mode table + CWD inheritance prose explicitly state the worktree project-root detection failure mode + the `--cd` fix.
- S-U-4 The Section 6(a) "Worked example — Codex-side assistant delegation prompt sketch" (lines 256-281) is a reusable scaffold — concrete enough that an executor can substitute `<session-id>` and `<task-id>` and run.
- S-U-5 ✓ H2/H3 structure is scannable; tables at the top of dense sections.
- S-U-6 ✓ Section 5 "files-as-truth completion signal" gives an operator the diagnostic procedure for "did codex actually finish?"

## New findings

### F-U-01 — `<session-id>` and `<task-id>` placeholders in Section 6(a) example are ambiguous about which is required
- Type: `general` | Domain: `docs-sync` | Disposition: `open` | Confidence: 50 | Severity: Low
- Evidence: Section 6(a) lines 269-273 mix `<session-id>` and `<task-id>` placeholders; a first-time reader does not know whether `<task-id>` follows the `T6` form or `06-codex-skill-content` form. The recorded mistake (`manager-mispec-grep-c` memorized this exact failure mode in another context).
- Why it matters: Operator at 3am copies the example and substitutes the wrong shape. Low impact but the discipline is to remove the ambiguity at write time.
- Suggested direction: Add a one-line note under Section 6(a) stating the canonical `<task-id>` shape used by the manager's session bootstrap (e.g., `T<n>` per orchestration/workflow/execution.md).

### F-U-02 — No explicit answer to "what if `/codex:setup` fails or codex is not installed?"
- Type: `scenario_gap` | Domain: `docs-sync` | Disposition: `open` | Confidence: 50 | Severity: Low
- Evidence: Section 7 lines 344-346 surfaces `/codex:setup` as the first-use precondition: "If Codex is not set up, surface `/codex:setup` to the user before attempting any Codex invocation." But the skill does not say HOW the manager detects this — i.e., what command/result indicates codex is not installed. A 3am operator hits "command not found" and the skill does not bridge.
- Why it matters: Usage gap for first-time bootstrap. Low.
- Suggested direction: Add one sentence: "Detect via `command -v codex` (or `codex --version`); if non-zero, surface `/codex:setup`."

## Verdict
- Critical/≥75: 0; High/≥50: 0
- **Usage verdict: PASS.**
