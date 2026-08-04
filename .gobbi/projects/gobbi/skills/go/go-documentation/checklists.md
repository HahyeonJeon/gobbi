# Go Documentation Evaluation Checklist

## Project

Not applicable: documentation judgment does not define task scope, deferred work, or completion authority.

## Structure

### GODOC-SC-STRUCTURE-01 — Normal case: Usable doc-comment structure

A doc comment covers distinct topics that may need navigation. Links and headings should make those topics
easier to use; decorative or unhelpful structure fails.

#### Checklist

- [ ] GODOC-CK-STRUCTURE-01-01 — Doc-comment links and headings add usable structure.

## Performance

Not applicable: documentation and comment form does not establish latency, capacity, external-call, cache, or
resource behavior.

## Aesthetics

### GODOC-SC-AESTHETICS-01 — Poor quality: Fragmentary or mechanical prose

Documentation can name the correct code while remaining hard to read. Public prose should use complete
sentences, and implementation comments should add durable meaning instead of narrating syntax.

#### Checklist

- [ ] GODOC-CK-AESTHETICS-01-01 — Public documentation uses complete sentences.
- [ ] GODOC-CK-AESTHETICS-01-02 — Implementation comments do not narrate syntax.

## Usage

### GODOC-SC-USAGE-01 — Poor quality: Documentation does not support the caller

A package or exported declaration has documentation, but the caller cannot identify its subject, purpose, or
relevant behavioral conditions. Decorative prose that still requires reading implementation fails.

#### Checklist

- [ ] GODOC-CK-USAGE-01-01 — Every package comment and exported declaration comment names its subject.
- [ ] GODOC-CK-USAGE-01-02 — Every package comment and exported declaration comment states its purpose.
- [ ] GODOC-CK-USAGE-01-03 — Every caller-relevant behavioral condition appears in public documentation.

## Consistency

### GODOC-SC-CONSISTENCY-01 — Rule violation: Documentation contradicts current behavior

A public declaration, documented error condition, or retained comment outlives a behavior change. Its prose
should describe the current implementation contract; stale or partially updated documentation fails.

#### Checklist

- [ ] GODOC-CK-CONSISTENCY-01-01 — Every changed public declaration, documented error condition, and retained comment describes the current implementation contract.

## Risk

Not applicable: this source does not authorize credentials, protected-data handling, external mutation,
publication, or destructive action.

## Overall

### GODOC-SC-OVERALL-01 — Adversarial: Comments look complete but omit durable context

Implementation comments can be numerous while omitting reasons future changes must preserve. The complete
comment set should retain every applicable durable constraint and reason; prose that only creates an
appearance of completeness fails.

#### Checklist

- [ ] GODOC-CK-OVERALL-01-01 — Implementation comments preserve applicable constraints, rationale, invariants, and trade-offs.
