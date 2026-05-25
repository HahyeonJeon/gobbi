# Risk — T04 gobbi-hook-authoring (iter1, claude)

## Artifact Summary + Memory reads
See project.md. Risk = blast radius, reversibility, security surface, safety-bypass primitives — for a new docs/skill file.
**Memory reads**: as project.md.

## Locked Frame (Stage 1)
- **S1 Blast radius is contained** — only 3 new/changed files; nothing executable wired; no hook actually changed.
- **S2 Fully reversible** — `git revert 9dbb5da` restores prior state; backlog flip reverses cleanly.
- **S3 No safety-bypass primitive taught** — skill must not advise `--no-verify` / `eval` / `--force` / unvalidated input sinks.
- **S4 Security guidance is sound** — skill teaches input-safe quoting (jq @sh / %q), tmp-validate-before-mv, and warns against raw interpolation.
- **S5 (adversarial) Does the skill teach an insecure hook idiom?** — e.g., sourcing untrusted env, eval of payload, hardcoded session paths.
- not-applicable: privacy/PII + license/IP — docs skill introduces no data flow and no third-party code.

## Per-scenario per-check results
- S1 YES — `git diff --name-only` = 3 files; `.claude/hooks/**` untouched; no settings.json change; no symlink. Zero runtime blast radius.
- S2 YES — pure-additive skill + staged twin + 1-line status flip + closure note; trivially revertible.
- S3 YES — grep of skill for `--no-verify|--force|eval(|exec(` returns no advocacy; skill in fact warns AGAINST hardcoding session paths (Anti-patterns) and mandates jq @sh over raw interpolation (Constraints).
- S4 YES — the security-positive idioms (@sh POSIX quoting against metachars/spaces/quotes/Unicode; %q for env values; jq -e validation before mv) are all taught and match the witnesses.
- S5 YES (no insecure idiom) — skill explicitly forbids raw string quoting in env-file exports and non-atomic file replacement; P6 forbids hardcoded session paths.

## Typed findings
None at Risk severity ≥ Medium. The deliverable is reversible, contained, and the guidance it codifies is security-positive. The CLA-CONS-001 command-shape drift carries no security/risk consequence (bash-prefix form runs identically).

**Verdict: PASS**

## Low-confidence appendix
(none)
