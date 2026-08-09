# Python Debugging Evaluation Checklist

## Symptom and reproducer

- [ ] The diagnostic record names the original expected behavior, observed behavior, affected consumer, inputs, and first known failure boundary.
- [ ] The diagnostic record identifies the interpreter, relevant environment and configuration facts, project-selected reproducer, execution bound, and allowed output boundary.
- [ ] Protected values are redacted while the facts needed to reproduce or distinguish the symptom remain identifiable.
- [ ] The smallest retained reproducer still reaches the original symptom under its recorded conditions.

## Causal analysis

- [ ] Each leading cause has a named discriminating observation and a stated predicted distinction from another leading cause.
- [ ] The record distinguishes a correlated observation, contributing condition, intermediate cause, and root cause where each applies.
- [ ] The causal chain connects the original symptom to the earliest supported cause without an untested link.
- [ ] A non-reproduction is recorded as a mismatch with its conditions rather than replacing the original symptom.

## Boundaries and recovery

- [ ] Project source remains unchanged throughout the diagnostic operation.
- [ ] Each diagnostic command, output, external access, and retained artifact stays within its recorded authority and bound.
- [ ] A missing reproducer, inaccessible prerequisite, or insufficient observation identifies the affected obligation, evidence available, and first recovery action.
- [ ] The handoff names `python-development` for implementation work or `python-testing` for evidence design without claiming either operation is complete.

## Misleading form

- [ ] A stack trace, warning, log, test failure, or configuration difference is not labeled a root cause without discriminating causal evidence.
- [ ] A polished diagnosis does not conceal a changed input, interpreter, environment, configuration, or unrecorded execution bound.
