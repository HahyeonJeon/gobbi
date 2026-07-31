---
name: html-authoring
description: "MUST load when creating, repairing, or accepting an emitted HTML artifact. HTML Authoring is an operation skill for producing an exact artifact with proportionate evidence."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# HTML Authoring

Use this operation to create, repair, or accept one HTML document or fragment. Its outcome is the exact
emitted artifact, identified by bytes or digest, with proportionate evidence.

Change only authorized HTML source or generator inputs. Frame the artifact and owners, implement a bounded
change, verify parsing and target behavior, repair the root cause, then accept or stop. CSS, JavaScript,
security, and Electron retain presentation, interaction, trust, and privilege ownership.

## Principles

### Treat emitted HTML as the product

Source, generator input, emitted bytes, parsed DOM, and target behavior can differ. Bind evidence to the
emitted artifact.

### Scale evidence with risk

Scale evidence to the claim. Higher-risk markup needs more than source inspection.

### Repair the owning source

Fix the earliest authorized source, generator configuration, or owner boundary causing a defect. Regenerate
and repeat affected evidence.

## Rules

- **MUST identify source, emitted artifact, browser or Electron targets, and generator, CSS, JavaScript,
  security, and runtime owners.** Mark a material unknown as a stop condition.
- **MUST keep implementation within the authorized artifact and owner boundary.** Route untrusted data,
  contextual handling, dangerous sinks, remote-content trust, and Electron privilege decisions to their
  security or runtime owners.
- **MUST verify authoring conformance and content models against the [WHATWG HTML Living
  Standard](https://html.spec.whatwg.org/multipage/) and inspect the parsed DOM when recovery can change
  meaning.** Parsing recovery is evidence, not permission to emit nonconforming source.
- **NEVER patch generated output as the repair.** Fix its source or generator, regenerate it, and bind new
  evidence to the new emitted identity.
- **MUST keep claim ceilings explicit.** Validator evidence supports only the checks performed; it does not by
  itself prove runtime behavior, security, accessibility, [WCAG
  2.2](https://www.w3.org/TR/WCAG22/) conformance, UI quality, or product acceptance.

## Procedure

### Phase 1 — Bind the artifact and outcome

#### 1.1 Identify the artifact and owners

- Start from the requested outcome and authorized source.
- Record direct authoring or generator input, tool, version, configuration, and output.
- Identify emitted bytes or digest, fragment context, targets, trust boundaries, and owners.
- Produce an artifact-and-owner frame.
- Continue when material inputs and authority are known; otherwise stop and name the missing fact or owner.

#### 1.2 Define acceptance evidence

- Select source, DOM, native-operation, target, relationship, failure, and owner checks from the change risks.
- Keep static evidence small; add transform, DOM, target, or trust evidence when triggered.
- Produce the acceptance claim and evidence ceiling.
- Continue when required evidence is obtainable; otherwise stop with the gap.

### Phase 2 — Produce the emitted artifact

#### 2.1 Implement the bounded structure

- Establish only the needed structure, relationships, language, controls, alternatives, and resources.
- Apply semantics and platform facts without importing another owner's policy.
- Emit the smallest complete change through source or generator.
- Continue with the candidate, or stop on an owner or scope conflict.

#### 2.2 Capture the candidate identity

- Record “no transform” or complete source and generator identity.
- Capture emitted bytes or digest.
- Continue with that identity when capture succeeds.
- For direct-authoring capture failure, preserve evidence and return to the authorized direct-source or
  emission boundary in the artifact frame.
- For transformed-output capture failure, preserve evidence and return to its named source, generator, or
  transform owner.

### Phase 3 — Verify and repair

#### 3.1 Inspect conformance and parsed meaning

- Run conformance checks; record tool, version, configuration, diagnostics, and limits.
- Inspect parsed placement, relationships, attributes, names, states, language, and direction where recovery
  can alter intent.
- Continue on success; on failure, identify the earliest cause and go to Step 3.3.

#### 3.2 Observe applicable target behavior

- Exercise applicable native behavior, keyboard paths, form results, fallbacks, and target support.
- Obtain cross-owner evidence when the claim crosses HTML.
- Bound passing observations continue to Step 4.1.
- An artifact or generated-behavior defect identifies the earliest authorized cause and goes to Step 3.3.
- Missing target access or unresolved external ownership stops with the exact gap.

#### 3.3 Repair from the root

- Preserve failing identity, command, target, observation, and owner.
- Repair the earliest authorized cause, regenerate, capture a new identity, and rerun affected layers.
- Continue from Step 3.1, or stop for new scope, authority, target access, or an owner decision.

### Phase 4 — Accept or stop

#### 4.1 Close the artifact

- Accept only the artifact whose checks pass and owner decisions are resolved.
- Report source and transform identity, bytes or digest, targets, observations, limits, and the narrow claim.
- Otherwise return the failure and first missing fact, owner action, or authorized recovery step.

## References

- [HTML development evaluation checklist](checklists.md)
