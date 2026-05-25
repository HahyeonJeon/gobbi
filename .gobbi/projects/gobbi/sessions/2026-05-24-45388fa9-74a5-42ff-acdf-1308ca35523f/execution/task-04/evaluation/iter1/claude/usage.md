# Usage — T04 gobbi-hook-authoring (iter1, claude)

## Artifact Summary + Memory reads
See project.md. Consumer = a future agent/human authoring or reviewing a hook, loading this skill at 3am with no prior hook context.
**Memory reads**: as project.md.

## Locked Frame (Stage 1)
- **S1 A first-time hook author can register a hook from the skill alone** — P1 gives the settings.json shape sufficient to wire a hook.
- **S2 The skill states when to load itself** — When-to-load triggers are concrete and self-evident.
- **S3 Failure modes are communicated** — exit-0 discipline, bail(), tmp-validate-before-mv all explained.
- **S4 (adversarial) A reader copies a Procedures example and it diverges from the real project convention** — i.e., the example is not copy-paste-faithful to how the project actually registers hooks.
- not-applicable: accessibility/i18n — non-UI, no user-facing locale strings.

## Per-scenario per-check results
- S1 partial — P1 gives a workable registration shape, BUT the example command string diverges from the project's actual settings.json convention (see CLA-USAGE-001).
- S2 YES — 4 concrete When-to-load triggers.
- S3 YES — Core Principles + Constraints + Anti-patterns thoroughly cover the failure modes (exit 0, bail, atomic mv, tool-name filter, set -e hazard).
- S4 — hit; see CLA-USAGE-001.

## Typed findings

### CLA-USAGE-001 — P1 teaches `"command": "bash .claude/hooks/..."` but the project registers bare path + `"type": "command"`
- Type: `general` / Domain: `docs-sync` / Disposition: open / Confidence: 100 / Severity: Medium
- Evidence: skill L58, L67, L73, L201 use `"bash .claude/hooks/..."`. Actual `.claude/settings.json` (L36/44/52) uses `{ "type": "command", "command": ".claude/hooks/session-start.sh" }` — no `bash` prefix (verified `grep -c '"command": "bash"'` = 0) and includes the `"type": "command"` field the skill's JSON examples omit.
- Why it matters: a hook author copying the skill's canonical example will register with a `bash ` prefix and without `"type": "command"`, diverging from the project's actual convention. Functionally the `bash` form still runs (scripts are `+x` with a bash shebang), so it is not breakage — but a skill whose explicit purpose is to teach the canonical registration shape should mirror the real witness, especially since `.claude/settings.json` is itself an authoritative witness available to the executor.
- Suggested direction: align the P1 examples and the P7 manual-invocation line to the real settings.json shape (bare path + `"type": "command"`), or add one sentence noting both forms work and which the project uses.

**Verdict: PASS**
(CLA-USAGE-001 is Medium, below the High/conf≥50 REVISE threshold — recorded, does not flip the perspective verdict.)

## Low-confidence appendix
(none)
