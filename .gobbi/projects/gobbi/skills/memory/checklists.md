# Memory Evaluation Register

Unchecked source register for evaluating the [Memory operation](SKILL.md) against [memory scenarios](scenarios.md).

## Register contract

- **Mode:** evaluation coverage register.
- **Owner:** independent evaluator.
- **Consumer:** the active evaluation.
- **Run use-style:** `do-confirm`.
- **Source state:** every item below remains unchecked. Work a fresh filled copy for each run.
- **Source version:** the filled copy records this file's Git blob hash and the review identity.
- **Trace count:** 18 checks map one-to-one to 18 stable scenario seeds and one or more parent rules.
- **Permitted terminal tokens in a filled copy:** `PASS`, `FAIL:<finding-id>`, or `n/a:<property>`.
- **Coverage closure:** every row has one terminal token with inspected evidence.
- **Acceptance:** every applicable row is `PASS`. Coverage closure alone is not acceptance.
- **Evidence rule:** a matching label, file, or directory is insufficient unless the named property is inspected.

## Candidate discrimination

### MEM-CHECK-01

- [ ] **Criticality:** required
- **Claim:** Every kept candidate names one authoritative source and one durable future use.
- **Applicability:** unconditional.
- **Pass:** each candidate row resolves both fields to inspected evidence; unsupported rows are absent.
- **Evidence:** candidate inventory plus each cited source artifact.
- **On fail:** open a Memory evidence finding and stop acceptance.
- **Sources:** [M-1](SKILL.md#m-1), [M-4](SKILL.md#m-4), [MEM-SCEN-01](scenarios.md#mem-scen-01).

### MEM-CHECK-02

- [ ] **Criticality:** required
- **Claim:** Zero justified candidates yields zero staged files, while one justified candidate remains discriminable.
- **Applicability:** unconditional; exercise synthetic zero and one inputs when the live run has only one side.
- **Pass:** the zero input creates no filler and the one input creates exactly one candidate.
- **Evidence:** candidate counts, keep/drop reasons, and staged-path inventory.
- **On fail:** open a boundary finding and stop acceptance.
- **Sources:** [M-2](SKILL.md#m-2), [M-6](SKILL.md#m-6), [MEM-SCEN-02](scenarios.md#mem-scen-02).

### MEM-CHECK-03

- [ ] **Criticality:** gate
- **Claim:** Cosmetic completeness cannot make unsupported material durable.
- **Applicability:** unconditional.
- **Pass:** a polished source-free probe is dropped and causes no staging change.
- **Evidence:** adversarial probe, drop decision, and before/after staging inventory.
- **On fail:** open a blocking false-pass finding; stop acceptance because filler can enter durable memory.
- **Sources:** [M-1](SKILL.md#m-1), [M-2](SKILL.md#m-2), [MEM-SCEN-03](scenarios.md#mem-scen-03).

## Type and scope

### MEM-CHECK-04

- [ ] **Criticality:** required
- **Claim:** Type and scope follow the record's durable job and future audience.
- **Applicability:** every kept candidate.
- **Pass:** feature-local and cross-feature probes receive the correct legal scope under the same fitting type.
- **Evidence:** source reach, classification decision, and [memory map](memory-map.md) destination.
- **On fail:** open a classification finding and stop acceptance.
- **Sources:** [M-3](SKILL.md#m-3), [MEM-SCEN-04](scenarios.md#mem-scen-04).

### MEM-CHECK-05

- [ ] **Criticality:** gate
- **Claim:** An unresolved legal type or scope halts without a write.
- **Applicability:** when evidence leaves classification ambiguous; otherwise `n/a:<property>` with inspected source evidence.
- **Pass:** the run returns `NEEDS_CONTEXT`, names the ambiguity, and leaves candidate and staging bytes unchanged.
- **Evidence:** stop report, source evidence, and before/after file hashes.
- **On fail:** open a blocking authority finding; stop acceptance because the operation guessed a durable meaning.
- **Sources:** [M-3](SKILL.md#m-3), [MEM-SCEN-05](scenarios.md#mem-scen-05).

### MEM-CHECK-06

- [ ] **Criticality:** gate
- **Claim:** Candidate body semantics conform to the selected type; path shape alone cannot pass.
- **Applicability:** every kept candidate.
- **Pass:** each body performs its selected type's job and satisfies the matching template; a wrong-job probe fails.
- **Evidence:** candidate body, template boundary, source claim, and adversarial probe.
- **On fail:** open a blocking type-integrity finding; stop acceptance because mislabeled knowledge misroutes future use.
- **Sources:** [M-1](SKILL.md#m-1), [M-4](SKILL.md#m-4), [M-10](SKILL.md#m-10), [MEM-SCEN-06](scenarios.md#mem-scen-06).

## Owner boundary

### MEM-CHECK-07

- [ ] **Criticality:** gate
- **Claim:** Record is the session writer and each staged source receives exactly one Wrap-up outcome.
- **Applicability:** every kept candidate.
- **Pass:** one Record-owned staging path and hash maps to one accounted durable outcome; no direct Memory write exists.
- **Evidence:** staged file, source inventory, mapping row, and durable diff.
- **On fail:** open a blocking ownership finding; stop acceptance because a write bypassed the owner boundary.
- **Sources:** [M-5](SKILL.md#m-5), [M-6](SKILL.md#m-6), [MEM-SCEN-07](scenarios.md#mem-scen-07).

### MEM-CHECK-08

- [ ] **Criticality:** gate
- **Claim:** Only regular files under authorized typed `staging/` paths enter promotion.
- **Applicability:** unconditional.
- **Pass:** an out-of-set probe is excluded and every inventoried input resolves to the Record-owned type set.
- **Evidence:** Record type set, inventory, ineligible-path report, and actual durable diff.
- **On fail:** open a blocking ingress finding; stop acceptance because an ad hoc source bypassed the contract.
- **Sources:** [M-6](SKILL.md#m-6), [MEM-SCEN-08](scenarios.md#mem-scen-08).

### MEM-CHECK-09

- [ ] **Criticality:** gate
- **Claim:** A malformed typed source fails before durable change and leaves prior evidence unchanged.
- **Applicability:** unconditional; use a safe malformed candidate probe when the live inventory is fully valid.
- **Pass:** validation fails, no durable write starts, and source plus destination preimages remain unchanged.
- **Evidence:** validation output, source hashes, destination preimages, and actual diff.
- **On fail:** open a blocking atomicity finding; stop acceptance because partial change or evidence mutation occurred.
- **Sources:** [M-4](SKILL.md#m-4), [M-5](SKILL.md#m-5), [M-6](SKILL.md#m-6), [M-10](SKILL.md#m-10), [MEM-SCEN-09](scenarios.md#mem-scen-09).

## Handoff identity

### MEM-CHECK-10

- [ ] **Criticality:** gate
- **Claim:** The accepted session handoff and durable note contain one identical reviewed body.
- **Applicability:** an accepted session close; otherwise `n/a:<property>` with inspected state evidence.
- **Pass:** both required paths exist and their bodies match after removing only durable frontmatter.
- **Evidence:** `4-wrap-up/outputs/handoff.md`, `notes/{area}/{YYYY-MM-DD}-{slug}.md`, and a body comparison.
- **On fail:** open a blocking handoff finding; stop acceptance because the next session would receive divergent facts.
- **Sources:** [M-7](SKILL.md#m-7), [M-10](SKILL.md#m-10), [MEM-SCEN-10](scenarios.md#mem-scen-10).

### MEM-CHECK-11

- [ ] **Criticality:** gate
- **Claim:** A one-sided or post-review handoff edit cannot pass.
- **Applicability:** an accepted session close; otherwise `n/a:<property>` with inspected state evidence.
- **Pass:** a one-sided edit probe fails body and reviewed-digest checks.
- **Evidence:** reviewed subject digest, both body hashes, and adversarial probe result.
- **On fail:** open a blocking review-integrity finding; stop acceptance because unreviewed content could become durable.
- **Sources:** [M-7](SKILL.md#m-7), [M-10](SKILL.md#m-10), [MEM-SCEN-11](scenarios.md#mem-scen-11).

## Supersession and terminal history

### MEM-CHECK-12

- [ ] **Criticality:** gate
- **Claim:** Ordinary one-record supersession is reciprocal and leaves one active understanding.
- **Applicability:** when one durable record replaces one other record; otherwise `n/a:<property>` with inspected lifecycle evidence.
- **Pass:** the new record's `supersedes` and old record's `superseded_by` name each other, and the old record is terminal.
- **Evidence:** both frontmatter records, active-tree inventory, and source decision.
- **On fail:** open a blocking lifecycle finding; stop acceptance because history or active meaning is ambiguous.
- **Sources:** [M-8](SKILL.md#m-8), [M-10](SKILL.md#m-10), [MEM-SCEN-12](scenarios.md#mem-scen-12).

### MEM-CHECK-13

- [ ] **Criticality:** gate
- **Claim:** A record moves whole exactly when it reaches its type-defined terminal state.
- **Applicability:** when a durable record changes lifecycle state; otherwise `n/a:<property>` with inspected lifecycle evidence.
- **Pass:** the pre-terminal probe stays active, the terminal record occupies its typed archive path, and original type plus body are preserved.
- **Evidence:** status transition, active and archive paths, frontmatter type, and body comparison.
- **On fail:** open a blocking history-loss finding; stop acceptance because a live record moved early or terminal history was lost.
- **Sources:** [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10), [MEM-SCEN-13](scenarios.md#mem-scen-13).

### MEM-CHECK-14

- [ ] **Criticality:** gate
- **Claim:** Verification rejects one-sided lifecycle links, pointer-only archives, deletion, and dangling inbound paths.
- **Applicability:** every supersession or terminal move.
- **Pass:** the adversarial shortcut probe fails; the actual change has reciprocal links, full archived bytes, no deletion, and resolving inbound paths.
- **Evidence:** lifecycle fields, archive body, path-reference search, scoped link result, and changed-path list.
- **On fail:** open a blocking preservation finding; stop acceptance because a valid new record can hide lost history.
- **Sources:** [M-8](SKILL.md#m-8), [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10), [MEM-SCEN-14](scenarios.md#mem-scen-14).

### MEM-CHECK-17

- [ ] **Criticality:** gate
- **Claim:** A terminal move conflict halts without losing, overwriting, or partly moving the active record.
- **Applicability:** when a terminal move is planned; otherwise `n/a:<property>` with inspected lifecycle evidence.
- **Pass:** a conflicting archive destination or changed preimage leaves active and archive bytes unchanged and reports the exact conflict.
- **Evidence:** active and archive preimages, post-failure paths, body hashes, and stop report.
- **On fail:** open a blocking recovery finding; stop acceptance because terminal history can be lost during a failed move.
- **Sources:** [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10), [MEM-SCEN-17](scenarios.md#mem-scen-17).

## Safe evidence

### MEM-CHECK-15

- [ ] **Criticality:** gate
- **Claim:** Sensitive evidence remains verifiable without protected payload retention.
- **Applicability:** any candidate derived from sensitive or access-controlled evidence; otherwise `n/a:<property>` with inspected source evidence.
- **Pass:** the candidate uses a safe pointer or redaction, names the source, and contains no protected payload.
- **Evidence:** candidate body, source pointer, redaction, and protected-token scan.
- **On fail:** open a blocking disclosure or traceability finding; stop acceptance.
- **Sources:** [M-1](SKILL.md#m-1), [M-4](SKILL.md#m-4), [M-10](SKILL.md#m-10), [MEM-SCEN-15](scenarios.md#mem-scen-15).

### MEM-CHECK-16

- [ ] **Criticality:** required
- **Claim:** The operation rejects the false choice between full source copying and durable proof.
- **Applicability:** any sensitive-evidence candidate; otherwise `n/a:<property>` with inspected source evidence.
- **Pass:** a safe pointer and bounded summary support verification while the full-copy probe is rejected.
- **Evidence:** counterfactual comparison, safe-source resolution, and rejected candidate.
- **On fail:** open a safety-model finding and stop acceptance.
- **Sources:** [M-1](SKILL.md#m-1), [M-10](SKILL.md#m-10), [MEM-SCEN-16](scenarios.md#mem-scen-16).

### MEM-CHECK-18

- [ ] **Criticality:** gate
- **Claim:** Correct document shape and citation cannot hide a protected payload in durable content.
- **Applicability:** any sensitive-evidence candidate; otherwise `n/a:<property>` with inspected source evidence.
- **Pass:** a well-shaped payload-bearing probe fails, while the corrected safe pointer or redaction remains verifiable.
- **Evidence:** adversarial candidate, protected-token scan, safe source pointer, and corrected bounded form.
- **On fail:** open a blocking disclosure finding; stop acceptance because protected bytes can enter durable memory.
- **Sources:** [M-1](SKILL.md#m-1), [M-4](SKILL.md#m-4), [M-10](SKILL.md#m-10), [MEM-SCEN-18](scenarios.md#mem-scen-18).

## Pilot expectations

| Probe | Expected filled-copy result |
|---|---|
| Complete evidence-backed candidate, legal scope, typed staging, verified durable result | Every applicable item `PASS`; accepted |
| Empty justified candidate set | MEM-CHECK-02 `PASS`; candidate-specific items resolve from inspected applicability; accepted |
| Wrong-job candidate in a correct directory | MEM-CHECK-06 `FAIL:<finding-id>`; not accepted |
| Ineligible promotion source | MEM-CHECK-08 `FAIL:<finding-id>`; not accepted |
| Malformed typed source | MEM-CHECK-09 `FAIL:<finding-id>`; no durable change |
| One-sided handoff edit | MEM-CHECK-11 `FAIL:<finding-id>`; not accepted |
| One-sided supersession or incomplete archive | MEM-CHECK-12, 13, or 14 `FAIL:<finding-id>`; not accepted |
| Terminal move preimage conflict | MEM-CHECK-17 `PASS` only when both locations stay unchanged; no history loss |
| Sensitive source safely referenced | MEM-CHECK-15 and 16 `PASS`; no protected payload retained |
| Protected payload hidden in a valid-looking candidate | MEM-CHECK-18 `FAIL:<finding-id>`; not accepted |
