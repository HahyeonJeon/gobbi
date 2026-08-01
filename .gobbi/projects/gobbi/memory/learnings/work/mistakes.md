# Work Mistakes

## Treating a teammate's idle notification as a completion signal

**Context:** Coordinating multiple teammate agents in a session and reacting to their idle or notification
signals.

**Mistake:** Assuming a teammate going idle means it delivered the assigned work. In one session every
teammate went idle without delivering, and one had produced nothing at all.

**Correction:** Verify completion from direct evidence — the actual diff, file contents, or command output —
before treating a teammate's work as done. Idle is a scheduling state, not a completion signal.

## Accepting a reported verification instead of reproducing it

**Context:** A teammate reports that a check or test passed.

**Mistake:** Trusting the claim as stated. One executor reported a markdown link check as passing when it had
actually run the script with no arguments and gotten a usage message. The check did pass once run correctly,
but the claim as made was hollow.

**Correction:** Reproduce every verification claim independently — run the same command and confirm the
output — before accepting it as evidence.
