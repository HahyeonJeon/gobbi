# Codex Follow-up Evaluation - Risk

Target: commits `4a396ed` (FU-1) and `a0ac5e0` (FU-2).

## Findings

None.

## Security Sanitization Check

The security-sensitive claim in `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:74` is accurate against the current tree.

Evidence:
- `ls packages 2>/dev/null || echo "packages ABSENT"` returned `packages ABSENT`.
- `find . -maxdepth 2 -type d -name packages -print` returned no `packages` directory.
- Targeted searches for `settings-io`, `settings_io`, `project-name validator`, `project name validator`, `pre-validates`, and `packages/cli/src/lib/config/settings-io.ts`, excluding `.git`, sessions, and backlogs, returned no current implementation hit.
- Searching `.claude/`, `.gobbi/projects/gobbi/skills/`, `.codex/`, and `.agents/` for sanitizer/validator language found only the corrected note and generic evaluation guidance such as "No new untrusted-input path without validation / sanitization"; it did not find an automated project-name sanitizer seam.
- The only validator-adjacent current-doc hit relevant to automation is `.gobbi/projects/gobbi/skills/git/SKILL.md:124`, which says cross-layer drift is "not yet detected automatically" and points to a planned future validator. That is not a current sanitization seam.

Why:
The old wording was riskier because it asked readers to rely on a nonexistent CLI settings-IO validator. The new wording removes that false trust boundary and states that in-skill shell interpolation performs no escaping.

Suggested-direction:
No revision required for this follow-up. A future hardening pass can define a canonical slot-sanitization or shell-quoting pattern, but the current note correctly documents today's risk and gives the safer consumer posture.
