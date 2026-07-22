# Research Scenarios

These scenarios exercise the read-only evidence operation in [`SKILL.md`](SKILL.md). The caller owns
scope and workflow state; the active runtime/Record seam owns storage.

## Coverage map

| Family | Primary rules | Dimensions |
|---|---|---|
| RS-SCN-01 assignment identity | RS-1–RS-3 | positive, negative, adversarial |
| RS-SCN-02 target containment | RS-2, RS-12 | positive, boundary, negative |
| RS-SCN-03 internal evidence | RS-4, RS-6, RS-9 | positive, alternative-valid, degraded |
| RS-SCN-04 external evidence | RS-5–RS-10 | positive, change, adversarial |
| RS-SCN-05 synthesis quality | RS-7–RS-11 | positive, negative, contradiction |
| RS-SCN-06 storage and memory seam | RS-3, RS-12 | sequence, interruption, adversarial |

## RS-SCN-01 — Assignment identity

### RS-SCN-01-A — Complete non-Execution envelope

- **Given:** the caller supplies an absolute Gobbi root, `planning/WORK/2`, a stable slug, question,
  decision, scope, exclusions, and evidence requirements.
- **When:** Research validates the assignment.
- **Then:** it retains that identity unchanged and computes the Planning iteration-2 target.
- **Failure oracle:** it substitutes current directory, runtime identity, or another cursor.

### RS-SCN-01-B — Complete Execution envelope

- **Given:** the caller supplies `execution/WORK/1` and `task-03-session-record`.
- **When:** Research resolves the target.
- **Then:** the path includes the exact task directory before `working/iteration-1/research/`.
- **Failure oracle:** task scope is omitted or placed in a non-Execution layout.

### RS-SCN-01-C — Missing cursor blocks

- **Given:** the question and root exist but stage or task identity is absent.
- **When:** Research validates the envelope.
- **Then:** it returns the exact missing field and performs no search or write.
- **Failure oracle:** a cursor is inferred from filenames, environment, or state mutation.

## RS-SCN-02 — Target containment

### RS-SCN-02-A — Valid non-Execution target

- **Given:** `ideation/DISCUSSION/3` and slug `agent-teams-contract`.
- **When:** the target is computed.
- **Then:** the relative path is
  `1-ideation/working/iteration-3/research/agent-teams-contract.md` beneath the supplied root.
- **Failure oracle:** obsolete directory vocabulary or an absolute destination outside the root.

### RS-SCN-02-B — Valid Execution target

- **Given:** the caller supplies `task-10c-startup-research-operations`, iteration 1, and slug
  `startup-prior-art`.
- **When:** the target is computed.
- **Then:** it is
  `3-execution/task-10c-startup-research-operations/working/iteration-1/research/startup-prior-art.md`.
- **Failure oracle:** task identity or iteration is stale.

### RS-SCN-02-C — Traversal slug blocks

- **Given:** the slug contains `../` or a separator.
- **When:** path normalization runs.
- **Then:** Research rejects the assignment before gathering evidence.
- **Failure oracle:** the normalized path escapes or is silently rewritten.

## RS-SCN-03 — Internal evidence

### RS-SCN-03-A — Code, tests, memory, and history agree

- **Given:** all applicable internal classes describe the same behavior.
- **When:** Research synthesizes the result.
- **Then:** it cites exact paths/lines or commits and labels the behavior verified.
- **Failure oracle:** keyword snippets replace definition/call-site study.

### RS-SCN-03-B — History contradicts current documentation

- **Given:** current code and tests differ from an older design record.
- **When:** evidence is triangulated.
- **Then:** the report distinguishes present behavior, historical intent, and the contradiction.
- **Failure oracle:** the oldest or most convenient source is presented as current truth.

### RS-SCN-03-C — Negative search stays scoped

- **Given:** a bounded search finds no use of a mechanism.
- **When:** Research reports the result.
- **Then:** it names searched paths/patterns and says “not found in this scope,” not “does not exist.”
- **Failure oracle:** scoped absence becomes a universal claim.

## RS-SCN-04 — External evidence

### RS-SCN-04-A — Official version-specific contract

- **Given:** an official source documents behavior for the relevant current version.
- **When:** Research cites it.
- **Then:** the report records the direct URL, version/date applicability, insight, relevance, and limits.
- **Failure oracle:** a search-result snippet or secondary summary substitutes for the source.

### RS-SCN-04-B — Sources disagree

- **Given:** a standard and a vendor guide use incompatible definitions.
- **When:** Research compares them.
- **Then:** it explains authority and applicability, preserves both, and keeps the conclusion calibrated.
- **Failure oracle:** votes are counted or conflict is averaged away.

### RS-SCN-04-C — Source unavailable or stale

- **Given:** the load-bearing primary source cannot be opened or applies only to an older release.
- **When:** the evidence gate runs.
- **Then:** the report marks the limitation and does not claim verification.
- **Failure oracle:** citation fabrication or silent substitution.

## RS-SCN-05 — Synthesis quality

### RS-SCN-05-A — Decision-focused evidence report

- **Given:** several internal and external sources bear on one bounded decision.
- **When:** Research returns its report.
- **Then:** every item has Source, Insight, Why, applicability, and limitations; contradictions,
  uncertainty, recommendation, evidence-to-change, open questions, and repeatable verification appear.
- **Failure oracle:** a link dump, unrelated stockpile, hidden uncertainty, or decision without evidence.

### RS-SCN-05-B — Evidence does not make the user decision

- **Given:** two materially different directions remain defensible.
- **When:** Research recommends one.
- **Then:** it states the tradeoff and evidence-to-change, then returns the material choice to Discussion.
- **Failure oracle:** Research changes scope or records the choice as final.

## RS-SCN-06 — Storage and memory seam

### RS-SCN-06-A — Assistant stores validated report

- **Given:** Research returns a valid report and envelope.
- **When:** the active runtime assistant validates root, cursor, sections, and citations.
- **Then:** the assistant stores Markdown at the exact Record-owned research path; Research itself writes
  nothing.
- **Failure oracle:** direct peer/researcher write, wrong iteration, or unvalidated storage.

### RS-SCN-06-B — Failed validation preserves prior bytes

- **Given:** a report is malformed or its envelope is stale.
- **When:** assistant validation fails.
- **Then:** no destination is created or changed and the exact error is returned.
- **Failure oracle:** partial output, fallback path, or silent repair.

### RS-SCN-06-C — Durable evidence does not bypass RECORD

- **Given:** a report contains evidence useful beyond the session.
- **When:** the current step reaches RECORD.
- **Then:** Record may derive a typed reference candidate in staging; Research does not stage or promote it.
- **Failure oracle:** direct `references/` or memory write, or a fake candidate for clean/non-durable research.
