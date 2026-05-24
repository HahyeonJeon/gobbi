## Artifact Summary + Memory reads

What: Risk evaluates blast radius, reversibility, and safety of the final Preparation output. Why: the unguarded iter2 guidance could let an executor replace a tracked workspace symlink with a regular file, creating divergent loader behavior and stale canonical memory. How: iter3 adds a runtime prevention rule, a detection command, a restore path, and a deferred durable CI guard. Scope: markdown/process risk only; no code or CI implementation in this iter.

Memory reads: `draft-iter3.md`; `draft-iter2.md`; `preparation/evaluation/iter2/codex/risk.md`; mirror-policy decision; CI backlog; old superseded decision/backlog; full staging list; project mistakes, especially absolute main-tree write and per-perspective-file output mistakes; evaluation docs.

Tool evidence used: `git ls-files -s` returned `120000 ... .claude/skills/orchestration/SKILL.md` and `100644 ... .gobbi/projects/gobbi/skills/orchestration/SKILL.md`; `/tmp` reproduction returned `test-L-exit=1`, `link-content=beta`, `canonical-content=alpha`; `grep -c "test -L"` returned `1`; CI backlog status `status: deferred`.

## Locked Frame (Stage 1)

Scenario R1: The symlink replacement risk is prevented for normal executor behavior.
- Check R1.1: Safe default method is named.
- Check R1.2: Known unsafe methods are named.
- Check R1.3: Bulk rewrite fallback avoids workspace symlink paths.

Scenario R2: The risk is detectable and reversible.
- Check R2.1: The verification command checks symlink status after risky edits.
- Check R2.2: The restore command is specific enough to recover.
- Check R2.3: The empirical witness proves the check detects the failure mode.

Scenario R3: The durable defense is correctly deferred.
- Check R3.1: CI/pre-commit guard is not implemented now.
- Check R3.2: Deferral is tied to zero current witnesses and out-of-scope CI work.
- Check R3.3: Future triggers are concrete.

Scenario R4 (adversarial): The final iter leaves Planning with an irreversible hazard.
- Check R4.1: A task brief can include the exact safe-edit rule.
- Check R4.2: A task brief can include the exact verification gate.
- Check R4.3: A task brief can cite the deferred durable guard without treating it as current scope.

Privacy/data retention: not applicable; no user data or persisted secrets are introduced. License/IP: not applicable; no dependency or copied external source is introduced. Cost/error budget: risk is limited to downstream rework and stale skill loading, now guarded.

## Per-scenario per-check results

R1.1: Yes. The contract says to prefer Claude Code `Edit`.
R1.2: Yes. The table marks `sed -i`, `perl -i`, `awk` redirect rewrites, and backup/rename formatters as NO via workspace symlink path.
R1.3: Yes. Bulk rewrites must use `.gobbi/projects/gobbi/skills/...` directly.
R2.1: Yes. It requires `test -L .claude/skills/<path>` after non-Edit workspace modifications.
R2.2: Yes. It gives `rm` plus `ln -sfn` restore guidance and warns the relative target depends on file depth.
R2.3: Yes. The reproduction output shows the failure: `test-L-exit=1`, symlink path content `beta`, canonical content `alpha`.
R3.1: Yes. The CI guard is a backlog only.
R3.2: Yes. The backlog states the bad-edit witness count is zero in this repo and Bundle B scope is T1/T3, not CI.
R3.3: Yes. Triggers are first real defect, `N>=2 future bundles`, and tooling change.
R4.1: Yes. Planning intake says briefs must cite `Edit` as default.
R4.2: Yes. Planning intake points to the `test -L` discipline in the decision file.
R4.3: Yes. The backlog is explicitly deferred and status-grep confirms `status: deferred`.

## Iter2 finding dispositions

ID: COD-RISK-PREP2-001
disposition: addressed
evidence: The exact failure mode is now guarded by default edit-method guidance, unsafe-method warnings, canonical-path bulk rewrite rule, `test -L` post-edit verification, restore guidance, and a deferred CI guard with triggers.

## Typed findings

No new iter3 Risk findings.

## Low-confidence appendix

None.

VERDICT: PASS
