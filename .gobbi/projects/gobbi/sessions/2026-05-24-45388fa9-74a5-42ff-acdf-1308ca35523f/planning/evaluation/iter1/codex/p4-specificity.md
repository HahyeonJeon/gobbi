---
evaluator: codex
model: gpt-5.5
iter: 1
verbatim: true
perspective: p4-specificity
verdict: REVISE
---

# P4 Specificity Evaluation

## Check 3 - Verify Executability

Verdict: REVISE

High finding: T06's `$FILES` loops are not zsh-safe, and one later verify block depends on a variable defined in a prior verify block.

Evidence:
- T06 defines `FILES="..."` and loops with `for F in $FILES; do` (draft lines 564-578, 590-591).
- In zsh, unquoted scalar expansion does not split words by default. Fresh check: `zsh -fc 'FILES="a b c"; i=0; for F in $FILES; do i=$((i+1)); print -r -- "[$F]"; done; print -r -- count=$i'` produced one iteration: `[a b c]`, `count=1`.
- Therefore T06's loop would treat the 11-path list as one value under zsh, not 11 files. Use a zsh array (`files=(...)`; `for F in "${files[@]}"`) or force splitting explicitly.
- The second T06 verify block reuses `$FILES` without redefining it (draft lines 586-596). If verify items are executed independently, the loop is empty and `test "$MATCHES" -ge 7` fails; if they share a shell, the same zsh splitting defect persists.

High finding: Several verify entries are not clean runnable pass/fail commands.

Evidence:
- T01's three verify entries append expected-result prose to the command text, e.g. `"grep ... returns exactly 1 line"` and `"grep ... returns >= 1 hit"` (draft lines 124-127). Pasted into a shell, `returns`, `exactly`, and related words become extra operands, not assertions.
- Several count checks print counts with comments but do not assert them. Examples: T02 `grep -cE ... # floor >= 2` and negative checks `# must be 0` (draft lines 193, 197, 207); T04 `grep -cE ... # >= 4` and non-zero `jq` comment (draft lines 349, 364); T05 `wc -c # > 100 bytes` (draft line 435). These require human interpretation or invert exit status for expected-zero cases.
- No hard shell parse syntax error was found in the inspected snippets, but the above issues make the verification layer non-executable as written.

## Check 4 - CL-5 Rationale

Verdict: PASS

Evidence:
- DR-1 cites `manager-context-overflow-with-large-bundle.md` directly and uses it to justify CL-5 as one sweep task rather than 11 per-file tasks (draft line 777).
- The cited mistake says bundles with >=8 plan tasks should be scoped against manager context budget, and the corrected approach is to split only when >=8 tasks with >=2-iter ceiling would overrun context (mistake lines 20-22, 37-42).
- One task is correct for 11 mechanical identical edits here: the M2 wording is locked, the affected files are enumerated, and per-file bounded verification is required. Splitting CL-5 into 11 tasks would push the plan to 16 tasks and recreate the exact context-overflow risk the mistake warns about.

Critical/High findings: none.

## Check 5 - CL-6 Citation

Verdict: PASS

Evidence:
- Actual `git/SKILL.md` uses H2 `Memory Access Matrix` (line 17) and inline `**Critical rule -- write paths**:` wording with an em dash in the source file display (line 33).
- T02's `what` instructs the citation as `git/SKILL.md` section `Memory Access Matrix (Critical rule -- write paths)` plus `d-2-qualified-git-rule.md` (draft lines 145-151).
- T02's verify block explicitly says the executor should cite either `Memory Access Matrix` or `Memory Access Matrix (Critical rule -- write paths)` and not the nonexistent hyphenated `Memory Access Matrix Critical-Rule` anchor (draft lines 202-207).
- The negative grep blocks the specific hyphenated `Critical-Rule` form in the adjacent/reversed anchor shapes: `Memory Access Matrix.?Critical-Rule|Critical-Rule.*Memory Access Matrix` (draft line 207).

Critical/High findings: none.

VERDICT: REVISE
