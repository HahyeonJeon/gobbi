# Python Packaging Evaluation Checklist

## Scenario Hierarchy

### Design lifecycle

- Distribution contract framing
  - Package and consumer identity
    - Metadata, import identity, artifact kinds, and installed behavior are bound
- Layout boundary design
  - Organization versus installed behavior
    - Placement and `src` or flat decisions retain their distinct owners

### Development lifecycle

- Artifact construction
  - Configured build inputs
    - Each artifact remains traceable to its packaging inputs
  - Content mismatch
    - Unexpected or incomplete artifact content remains diagnosable

### Product lifecycle

- Installed package use
  - Isolated consumer
    - Installation exercises the identified artifact rather than the checkout
  - Source and installed divergence
    - Consumer differences remain visible to the packaging owner
- Release consumer handoff
  - Immutable artifact record
    - Release receives artifact evidence without packaging authority drift

## Checklist Conditions

### Design lifecycle > Distribution contract framing > Package and consumer identity > Metadata, import identity, artifact kinds, and installed behavior are bound

- [ ] The packaging record identifies configured build metadata, distribution and import names, supported consumers, artifact kinds, and required installed behavior.
- [ ] The record distinguishes source-tree observations from installed-consumer observations.
- [ ] The record binds declared project support policy to `Requires-Python`, declared dependencies, static or dynamic metadata fields, each dynamic field's project-provided source, and the selected build-isolation environment's declared requirements.

### Design lifecycle > Layout boundary design > Organization versus installed behavior > Placement and `src` or flat decisions retain their distinct owners

- [ ] A general workspace-placement concern is routed to `python-project-structure` unless it changes package discovery, artifact contents, or installed behavior.
- [ ] A `src` or flat-layout choice states the installed behavior it affects without declaring either layout universally correct.

### Development lifecycle > Artifact construction > Configured build inputs > Each artifact remains traceable to its packaging inputs

- [ ] Each build uses project-configured packaging inputs and records its source or configuration identity and bounded output path.
- [ ] Each artifact record includes kind, path, checksum or equivalent byte identity, distribution metadata, and relevant included-content inventory.
- [ ] The artifact record shows that its metadata agrees with the bound support-policy and metadata-source inputs and identifies the selected build-isolation environment with its declared requirements.

### Development lifecycle > Artifact construction > Content mismatch > Unexpected or incomplete artifact content remains diagnosable

- [ ] An unexpected included file, missing package, incorrect import identity, or metadata mismatch is traced to the responsible packaging input or discovery rule.
- [ ] A failed or ambiguous artifact is retained as incomplete evidence rather than replaced by an unrecorded build.

### Product lifecycle > Installed package use > Isolated consumer > Installation exercises the identified artifact rather than the checkout

- [ ] The consumer context installs the exact identified artifact without satisfying the target import through the source checkout or path configuration.
- [ ] The installed check identifies the environment, artifact identity, bound consumer behavior, observation, and evidence limit.

### Product lifecycle > Installed package use > Source and installed divergence > Consumer differences remain visible to the packaging owner

- [ ] A difference between source-tree and installed behavior remains explicit with its metadata, discovery, content, or environment explanation.

### Product lifecycle > Release consumer handoff > Immutable artifact record > Release receives artifact evidence without packaging authority drift

- [ ] Immutable artifact evidence is handed to `python-release` without a release-readiness claim.
- [ ] No packaging guidance grants publication, credential use, tagging, or external release authority.
- [ ] No packaging record takes ownership of unrelated workspace organization or an unconfigured universal build tool.
