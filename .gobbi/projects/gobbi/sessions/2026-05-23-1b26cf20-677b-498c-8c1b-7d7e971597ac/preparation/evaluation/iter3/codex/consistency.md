## Artifact Summary + Memory reads

What: Consistency checks whether `draft-iter3.md`, the mirror-policy decision, the CI backlog, inherited findings, and filesystem evidence all agree. Why: iter2 failed from an over-broad claim that contradicted rewrite-by-rename evidence. How: iter3 qualifies the claim across the decision file, draft mirror-policy section, Planning intake note, WORK checklist, and coverage map. Scope: T1/T3 Preparation readiness and session staging only.

Memory reads: `draft-iter3.md`; `draft-iter2.md`; `preparation/evaluation/iter2/codex/consistency.md`; mirror-policy decision; CI backlog; superseded old mirror decision; moot sync backlog; staging list; prior iter evaluation files; project mistakes/rules; evaluation docs.

Tool evidence used: `git ls-files -s` output with workspace mode `120000` and mirror mode `100644`; `/tmp` reproduction output `test-L-exit=1`, `link-content=beta`, `canonical-content=alpha`; H2 placement lines 54/63/111; row count output `20`; superseded status outputs `status: superseded` for the old mirror decision and sync backlog.

## Locked Frame (Stage 1)

Scenario C1: The mirror-policy decision is internally consistent after the new qualifier.
- Check C1.1: The Decision still states mirror canonical and workspace symlink runtime layer.
- Check C1.2: The new contract qualifies "editing either path" without contradicting the topology.
- Check C1.3: Empirical evidence covers both symlink topology and rewrite-by-rename failure.

Scenario C2: Draft and staging agree on iter3 changes.
- Check C2.1: Draft says the new H2 was added between Consequences and Empirical reference.
- Check C2.2: The actual file has that ordering.
- Check C2.3: The draft says a CI backlog was staged and the file exists with deferred status.

Scenario C3: Iter2 audit history remains intact.
- Check C3.1: Old mirror decision remains superseded.
- Check C3.2: Old sync backlog remains superseded/moot.
- Check C3.3: D-4 design-file clarification remains out of the iter3 edit scope.

Scenario C4 (adversarial): The artifact still contains a live unqualified "editing either path" instruction.
- Check C4.1: Live Planning intake includes the edit-method qualifier.
- Check C4.2: Live mirror-policy section includes the qualifier.
- Check C4.3: Coverage map links the consistency finding to the qualifier.

## Per-scenario per-check results

C1.1: Yes. The Decision section still says mirror canonical and workspace symlink runtime layer.
C1.2: Yes. The contract states the claim is true only for edit methods that follow the symlink, so it narrows the operational claim while preserving the topology claim.
C1.3: Yes. The file includes both `find ... | wc -l` -> 53 evidence and `sed -i` reproduction evidence.
C2.1: Yes. Row 20 and the generated-output entry say the new H2 sits between `## Consequences` and `## Empirical reference`.
C2.2: Yes. `grep -n` returned line 54 `## Consequences`, line 63 `## Symlink-preservation edit contract`, line 111 `## Empirical reference`.
C2.3: Yes. `test -f .../ci-symlink-integrity-check.md && echo EXISTS` returned `EXISTS`, and status grep returned `status: deferred`.
C3.1: Yes. The old mirror decision status grep returned `status: superseded`.
C3.2: Yes. The old sync backlog status grep returned `status: superseded`.
C3.3: Yes. The iter3 diff did not show D-4 content changes; the draft explicitly says D-4 is unchanged this iter.
C4.1: Yes. Planning intake says both paths resolve via symlinks but briefs must cite `Edit` as default and canonical mirror path for bulk rewrites.
C4.2: Yes. The mirror-policy section says both paths resolve to the same physical file only for inode-preserving methods.
C4.3: Yes. The coverage map says COD-CONS-PREP2-001 is addressed by the new opening paragraph qualifier and table.

## Iter2 finding dispositions

ID: COD-CONS-PREP2-001
disposition: addressed
evidence: The broad claim is now qualified in both the decision file and draft. The table explicitly marks `sed -i` and `perl -i` as unsafe via workspace symlink paths, matching the empirical reproduction.

Inherited note: COD-CONS-PREP1-004 remained a Low count-wording issue in iter2. disposition: deferred/non-blocking. Evidence: it is historical row-13 wording, while iter3 row count and row 20 are correct (`20` rows, row-20 count `1`).

## Typed findings

No new iter3 Consistency findings.

## Low-confidence appendix

None.

VERDICT: PASS
