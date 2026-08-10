# Python Debugging Evaluation Checklist

## Scenario Hierarchy

### Design lifecycle

- Symptom framing
  - Reported failure context
    - Report and smallest reproducer are bound
- Causal hypothesis design
  - Competing explanations
    - Discriminating evidence separates leading causes

### Development lifecycle

- Bounded diagnosis
  - Controlled diagnostic execution
    - Source and diagnostic effects remain contained
  - Reproduction mismatch
    - A non-reproduction remains a diagnostic fact
- Causal explanation
  - Earliest supported cause
    - The evidence chain reaches a root-cause candidate

### Product lifecycle

- Engineering handoff
  - Diagnosis consumer
    - Next implementation or test owner receives a bounded handoff
  - Blocked diagnosis
    - Missing diagnostic evidence has a recovery owner
- Diagnosis record trust
  - Reviewer
    - Surface evidence cannot substitute for causal support

## Checklist Conditions

### Design lifecycle > Symptom framing > Reported failure context > Report and smallest reproducer are bound

- [ ] The diagnostic record names the original expected behavior, observed behavior, affected consumer, inputs, and first known failure boundary.
- [ ] The diagnostic record identifies the interpreter, relevant environment and configuration facts, project-selected reproducer, execution bound, and allowed output boundary.
- [ ] Protected values are redacted while the facts needed to reproduce or distinguish the symptom remain identifiable.
- [ ] The smallest retained reproducer still reaches the original symptom under its recorded conditions.

### Design lifecycle > Causal hypothesis design > Competing explanations > Discriminating evidence separates leading causes

- [ ] Each leading cause has a named discriminating observation and a stated predicted distinction from another leading cause.
- [ ] The record distinguishes a correlated observation, contributing condition, intermediate cause, and root cause where each applies.

### Development lifecycle > Bounded diagnosis > Controlled diagnostic execution > Source and diagnostic effects remain contained

- [ ] Project source remains unchanged throughout the diagnostic operation.
- [ ] Each diagnostic command, output, external access, and retained artifact stays within its recorded authority and bound.

### Development lifecycle > Bounded diagnosis > Reproduction mismatch > A non-reproduction remains a diagnostic fact

- [ ] A non-reproduction is recorded as a mismatch with its conditions rather than replacing the original symptom.

### Development lifecycle > Causal explanation > Earliest supported cause > The evidence chain reaches a root-cause candidate

- [ ] The causal chain connects the original symptom to the earliest supported cause without an untested link.

### Product lifecycle > Engineering handoff > Diagnosis consumer > Next implementation or test owner receives a bounded handoff

- [ ] The handoff names `python-development` for implementation work or `python-testing` for evidence design without claiming either operation is complete.

### Product lifecycle > Engineering handoff > Blocked diagnosis > Missing diagnostic evidence has a recovery owner

- [ ] A missing reproducer, inaccessible prerequisite, or insufficient observation identifies the affected obligation, evidence available, and first recovery action.

### Product lifecycle > Diagnosis record trust > Reviewer > Surface evidence cannot substitute for causal support

- [ ] A stack trace, warning, log, test failure, or configuration difference is not labeled a root cause without discriminating causal evidence.
- [ ] A polished diagnosis does not conceal a changed input, interpreter, environment, configuration, or unrecorded execution bound.
