# Usage Perspective - Execution Evaluation T6

Verdict: REVISE

## Artifact Summary (Stage 0)

The primary consumers are future managers and assistants who need to invoke Codex correctly from Claude Code, especially during dual-system evaluation. Usage review checks whether those consumers can follow the skill without consulting the planning artifacts.

Memory reads are the same as `project.md`.

W/W/H gate: clear. Phase tag matches execution.

## Locked Frame (Stage 1)

Scenario 1: A manager can choose the right invocation pattern.
- Check: all four patterns are named.
- Check: manager-only and user-only restrictions are explicit.
- Check: subagents are directed to `codex exec` via Bash.

Scenario 2: A Codex-side assistant can run the recommended dual-system evaluation pattern.
- Check: load directives include the codex skill.
- Check: command uses `timeout 600`, `--sandbox workspace-write`, `--cd /playinganalytics/git/gobbi`, and `--add-dir <session-path>`.
- Check: missing or malformed output routes to BLOCKED.
- Check: validation covers all expected output files and the content required by Gobbi evaluation.

Scenario 3: A future evaluator can apply canonical finding vocabulary.
- Check: the 5 Types are listed explicitly.
- Check: no deprecated Type vocabulary is introduced.
- Check: examples tell assistants what to grep for.

Scenario 4 (adversarial): The consumer follows the skill exactly and still misses malformed evaluation output.
- Check: a worked example cannot pass with only one perspective or one summary file.
- Check: files-as-truth is concrete enough to execute.

Coverage declarations: accessibility is scannability for agent operators. I18n is not applicable.

## Stage 2 Results

Scenario 1: PASS. The invocation patterns are present at `codex/SKILL.md:28-90`: `(a) codex exec`, `(b) codex:codex-rescue`, `(c) /codex:adversarial-review`, and `(d) Assistant-wrapper pattern`.

Scenario 2: PARTIAL. The example includes the codex skill in Load Directives and uses the right `codex exec` flags. It routes missing output to BLOCKED. It does not verify all per-perspective files and does not demonstrate the required 5-Type vocabulary grep.

Scenario 3: FAIL. `rg 'scenario_gap|checklist_gap|design_flaw|assumption_risk|general' codex/SKILL.md` returned no matches. The skill mentions "5-Type vocabulary" at line 77 but never lists the five values. It avoids forbidden legacy Type labels, but omission is still not enough for a consumer to grep the right vocabulary.

Scenario 4: FAIL. The worked example at lines 272-274 can pass after one file and one `VERDICT:` match, leaving missing perspective files undetected.

## Findings

### T6-USAGE-001 - Canonical 5-Type vocabulary is named but not listed

Type: checklist_gap
Domain: process
Confidence: 75
Severity: High
Disposition: open

Evidence: The five-type reference lists `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, and `general`. `idea.md:153` names the same canonical set. Task 06 brief discipline says to restate the 5 Types explicitly. The codex skill contains no occurrences of those terms.

Why it matters: The assistant-wrapper pattern tells assistants to grep for "5-Type vocabulary", but the skill does not tell them what that vocabulary is. A future assistant would have to leave the skill and rediscover the source, which defeats the skill's purpose as the operational guide.

FP-check: Not a false positive. The file successfully avoids forbidden legacy Type labels, but the requirement was explicit positive vocabulary, not only absence of old vocabulary.

### T6-USAGE-002 - Section 6 files-as-truth example is under-specified for Gobbi evaluation output

Type: design_flaw
Domain: process
Confidence: 75
Severity: High
Disposition: open

Evidence: Decision record lines 55-60 require the worked example to validate all expected output files and grep verdict line, perspective files, and 5-Type vocabulary. The implementation at `codex/SKILL.md:272-274` validates one `codex-perspective.md` file and one `VERDICT:` match.

Why it matters: The skill is meant to prevent false DONE reports. The current example could train future assistants to accept incomplete evaluation output.

FP-check: Not a false positive. The broader Section 2(d) prose mentions perspective files and 5-Type vocabulary, but the worked example that future agents will copy does not.

## Low-confidence Appendix

No suppressed Usage findings.
