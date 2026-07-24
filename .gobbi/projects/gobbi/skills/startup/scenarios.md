# Startup Scenarios

These scenarios make the operation contract in [`SKILL.md`](SKILL.md) fail-able. They exercise the
read-only classifier and the optional Ideation input-builder; they do not create a Startup lifecycle,
artifact, or verdict path.

## Coverage map

| Family | Primary rules | Category dimensions |
|---|---|---|
| ST-SCN-01 classifier substance | ST-1–ST-3 | positive, alternative-valid, adversarial |
| ST-SCN-02 trigger and authority | ST-3–ST-4 | positive, negative, change |
| ST-SCN-03 behavioral evidence | ST-5–ST-7 | positive, boundary, adversarial |
| ST-SCN-04 problem gate | ST-6, ST-8 | positive, negative, sequence |
| ST-SCN-05 design direction | ST-9–ST-10 | positive, alternative-valid, adversarial |
| ST-SCN-06 coverage and viability | ST-6–ST-8 | positive, boundary, degraded |
| ST-SCN-07 handoff and ownership | ST-11–ST-12 | positive, negative, interruption |
| ST-SCN-08 ordinary evaluation seam | ST-12 | sequence, change, adversarial |

## ST-SCN-01 — Classifier substance

### ST-SCN-01-A — Rich baseline passes without questions

- **Given:** current records establish the problem, behavioral evidence, first user/job, boundary, rough
  direction, feasibility, authority, risks, and owned unknowns without contradiction.
- **When:** Configuration calls Startup's classifier.
- **Then:** it returns `sufficient` with citations and opens no guided conversation.
- **Failure oracle:** directory-name heuristics, an unnecessary question, or any filesystem mutation.

### ST-SCN-01-B — Cosmetic directories do not pass

- **Given:** `README.md`, `design/`, and `features/` exist but contain placeholders.
- **When:** the classifier applies the baseline-quality tests.
- **Then:** it returns `sparse` or `absent` and names the substantive gaps.
- **Failure oracle:** existence alone produces `sufficient`.

### ST-SCN-01-C — Contradictory records are not silently repaired

- **Given:** two load-bearing records disagree about the first user or project boundary.
- **When:** the classifier reads them.
- **Then:** it returns `contradictory`, cites both, and performs no repair, supersession, or archive move.
- **Failure oracle:** one record is chosen or mutated without a user decision.

## ST-SCN-02 — Trigger and authority

### ST-SCN-02-A — User accepts guided questions

- **Given:** the fresh classifier is insufficient and Discussion presents the choice.
- **When:** the user accepts.
- **Then:** Workflow first enters Ideation DISCUSSION; Startup then builds a bounded input packet at
  that cursor.
- **Failure oracle:** a separate Startup cursor, directory, mode, or completion predicate appears.

### ST-SCN-02-B — User declines

- **Given:** the classifier is insufficient.
- **When:** the user declines the guided operation.
- **Then:** Ideation receives the classifier gaps and declined disposition, with no invented baseline.
- **Failure oracle:** a generated fact, silent acceptance, or baseline write.

### ST-SCN-02-C — Resume versus explicit reset

- **Given:** one valid session resumes, and separately the user explicitly requests a baseline reset.
- **When:** Gobbi classifies each trigger.
- **Then:** resume does not invoke Startup; the explicit reset may invoke the classifier and user gate.
- **Failure oracle:** routine resume reopens Startup or reset bypasses user authority.

## ST-SCN-03 — Behavioral evidence

### ST-SCN-03-A — Real event displaces praise

- **Given:** the user says prospective users “love the idea” but offers no observed behavior.
- **When:** Startup probes the claim.
- **Then:** it asks for the last event, workaround, switch, repeated effort, time, or money and keeps the
  claim an assumption until evidence exists.
- **Failure oracle:** praise becomes confirmed demand.

### ST-SCN-03-B — One neutral question and two-probe limit

- **Given:** a load-bearing answer is vague.
- **When:** Startup asks one evidence-led axis, challenges with a concrete example, and receives a second
  vague answer after the permitted follow-up.
- **Then:** it records the branch open with an owner and stops pushing.
- **Failure oracle:** bundled questions, leading language, indefinite probing, or false confirmation.

### ST-SCN-03-C — Smart-skip requires evidence

- **Given:** repository evidence fully answers a branch.
- **When:** Startup shows the fact and the user confirms it.
- **Then:** the branch closes without a redundant question while preserving its citation.
- **Failure oracle:** a branch is skipped because it seems low value or expensive to discuss.

## ST-SCN-04 — Problem-before-solution gate

### ST-SCN-04-A — Complete premises open product shape

- **Given:** the real problem, first user/job, current alternative, root cause, why-now, fatal assumption,
  boundary, and non-goals are shown and confirmed.
- **When:** the operation reaches the gate.
- **Then:** product-shape questions may begin.
- **Failure oracle:** any required premise is omitted.

### ST-SCN-04-B — Proposed feature cannot repair the problem

- **Given:** a later feature suggestion contradicts the confirmed first user and boundary.
- **When:** the contradiction appears.
- **Then:** Startup reopens the earliest owning problem or boundary topic.
- **Failure oracle:** the feature silently rewrites the premise.

## ST-SCN-05 — Design direction

### ST-SCN-05-A — Minimal and ideal options receive equal scrutiny

- **Given:** a design-bearing branch needs a direction.
- **When:** Research returns applicable evidence from tried-and-true, new-and-popular, and
  first-principles sources.
- **Then:** Startup presents distinct minimal and ideal options with effort, risk, reuse, feasibility, a
  recommendation, and evidence-to-change; the user decides.
- **Failure oracle:** token cost narrows research, one option is a strawman, or popularity substitutes for fit.

### ST-SCN-05-B — Mechanism stays out

- **Given:** the user locks a product and system direction.
- **When:** Startup returns its packet.
- **Then:** it records macro direction but no signatures, schemas, algorithms, internals, or task plan.
- **Failure oracle:** implementation mechanism appears in Startup output.

## ST-SCN-06 — Coverage and viability

### ST-SCN-06-A — Clean coverage with an owned open item

- **Given:** every topic branch is confirmed or proven irrelevant except one non-load-bearing item that is
  open with an owner.
- **When:** Startup checks closure.
- **Then:** the packet is complete as a coverage record and plainly identifies the open item.
- **Failure oracle:** open becomes confirmed or disappears.

### ST-SCN-06-B — Load-bearing open item blocks readiness

- **Given:** feasibility or problem reality remains unsupported.
- **When:** all branch slots nevertheless have dispositions.
- **Then:** coverage is complete but readiness is not claimed.
- **Failure oracle:** mechanical closure becomes acceptance.

## ST-SCN-07 — Handoff and ownership

### ST-SCN-07-A — Structured packet feeds Ideation

- **Given:** accepted questioning ends with decisions, evidence, alternatives, contradictions, and owned
  unknowns.
- **When:** Startup returns.
- **Then:** the manager supplies one structured packet to ordinary Ideation; Startup writes no file.
- **Failure oracle:** missing provenance, a Startup-owned artifact, direct staging, or durable memory write.

### ST-SCN-07-B — Sensitive value is excluded

- **Given:** a credential or user-marked sensitive value appears during questioning.
- **When:** the packet is prepared.
- **Then:** the sensitive value is absent and only a safe constraint or redaction note remains.
- **Failure oracle:** the value enters the packet, session tree, or durable memory.

### ST-SCN-07-C — Interruption leaves ordinary state authoritative

- **Given:** guided questioning pauses.
- **When:** the session resumes.
- **Then:** state remains at the ordinary Ideation cursor and the manager rebuilds context from accepted
  Ideation evidence; no private Startup resume marker is consulted.
- **Failure oracle:** a Startup session, answer log, or hidden checkpoint becomes authoritative.

## ST-SCN-08 — Ordinary evaluation seam

### ST-SCN-08-A — Startup adds lenses, not reports

- **Given:** Startup evidence materially informs the current Ideation candidate.
- **When:** Ideation reaches EVALUATION.
- **Then:** both fresh evaluators apply the ordinary seven perspectives plus the Startup lenses in
  [`evaluation.md`](evaluation.md) to the full Ideation evidence package.
- **Failure oracle:** a separate Startup evaluation path or per-perspective Startup file appears.

### ST-SCN-08-B — Revision follows ordinary disposition and iteration rules

- **Given:** an evaluator finds weak behavioral evidence.
- **When:** verdicts aggregate.
- **Then:** the manager presents the finding batch for user disposition before any revision, and any
  material revision receives a full new dual-system WORK and EVALUATION iteration.
- **Failure oracle:** Startup auto-fixes the finding or runs a private retry loop.
