## Artifact Summary + Memory reads

What: Usage evaluates whether a Planning leader or T1/T3 executor can apply the final Preparation output correctly at 3am. Why: iter2's main consumer risk was a brief copied from the artifact that recommended workspace paths without telling the executor which edits preserve symlinks. How: iter3 gives the safe default, unsafe methods, bulk rewrite rule, post-edit verification, restore command, and deferred CI follow-up. Scope: consumer usability of the staged markdown.

Memory reads: `draft-iter3.md`; `draft-iter2.md`; `preparation/evaluation/iter2/codex/usage.md`; mirror-policy decision; CI backlog; full staging list; prior iter evaluation files; project mistakes/rules and evaluation docs listed in `project.md`.

Tool evidence used: safety-table `rg` output showing `Claude Code `Edit` tool` YES, `Claude Code `Write` tool` YES, `vim` YES, `sed -i` NO, and `perl -i` NO; `grep -c "test -L"` output `1`; `/tmp` reproduction output `test-L-exit=1`, `link-content=beta`, `canonical-content=alpha`.

## Locked Frame (Stage 1)

Scenario U1: Planning can brief the default path without ambiguity.
- Check U1.1: The artifact names the workspace path as discoverability convention.
- Check U1.2: It qualifies that workspace edits are safe only for inode-preserving methods.
- Check U1.3: It says `Edit` is the default method.

Scenario U2: Executors can handle non-default edit needs.
- Check U2.1: Unsafe rewrite-by-rename tools are named.
- Check U2.2: Bulk rewrite work has a safe path.
- Check U2.3: Recovery guidance exists if the workspace symlink is broken.

Scenario U3: Wrap-up and future readers can route the CI guard.
- Check U3.1: The backlog has a project backlog path.
- Check U3.2: The body explains why it is deferred.
- Check U3.3: Pick-up triggers are operational, not vague.

Scenario U4 (adversarial): A consumer follows the words literally and still forms the wrong model.
- Check U4.1: The broad "same physical file" claim is explicitly qualified.
- Check U4.2: The empirical witness demonstrates the failure mode in concrete terms.
- Check U4.3: The Planning intake note repeats the qualification, so consumers need not infer it from the decision file alone.

Accessibility/I18n: not applicable to UI. Internal markdown is scannable via headings, table, and numbered list.

## Per-scenario per-check results

U1.1: Yes. The decision still recommends `.claude/skills/...` in briefs for runtime-loadability discoverability.
U1.2: Yes. The contract says the claim is true only for methods that follow the symlink and write through it.
U1.3: Yes. The discipline list says "Prefer the Claude Code `Edit` tool".
U2.1: Yes. The table names `sed -i`, `perl -i`, `awk` redirect patterns, and formatter backup/rename mode as unsafe.
U2.2: Yes. Point 2 says bulk rewrites should edit the canonical mirror path directly.
U2.3: Yes. The restore command is present: `rm .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>`, with a warning to verify the relative prefix against an adjacent symlink.
U3.1: Yes. The backlog is at `preparation/staging/backlogs/project/ci-symlink-integrity-check.md`.
U3.2: Yes. It says the bad-edit witness count is zero and Bundle B already has runtime defenses.
U3.3: Yes. It has first real defect, `N>=2 future bundles`, and tooling-change triggers.
U4.1: Yes. `draft-iter3.md` states the iter2 broad claim is qualified by the iter3 edit contract.
U4.2: Yes. The reproduction output shows `test-L-exit=1`, `link-content=beta`, and `canonical-content=alpha`, proving the symlink was replaced and the target bypassed.
U4.3: Yes. Planning intake says briefs must cite `Edit` as default and canonical mirror path for bulk rewrites.

## Iter2 finding dispositions

ID: COD-USAGE-PREP2-001
disposition: addressed
evidence: The artifact now tells a tired consumer which tool to use, which tools are unsafe, what to do for bulk rewrites, and how to verify/restore the symlink layer. The Planning intake note repeats the rule so a brief author copying the canonical draft gets the safe consumer model.

## Typed findings

No new iter3 Usage findings.

## Low-confidence appendix

None.

VERDICT: PASS
