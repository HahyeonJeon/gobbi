# Ontology skill backlog

## Independent review of ontology skill v2

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Run an independent code and docs review of the ontology skill v2 in commit `fb9beb52`. The code class
covers `skills/ontology/scripts/ontology.py` and `scripts/prove-ontology-cli.py`. The docs class covers the
ontology `SKILL.md`, its templates and examples, and every file that refers to them.

**Why backlogged:** The user committed v2 and called wrap-up without a review. Closure rests on manager
self-verification: package `--check` passed, the CLI proof reported "proofs failed: 0", and `validate` passed on
the joined Flight sample.

**Context:** The v1 skill in `2a209c43` passed review. v2 changed the record shape, removed `record.md`, and
added the CLI. See [Ontology skill](../design/feature/ontology-skill.md).

## Property nullability wording: required versus may be null

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Use one wording for whether a Property may be empty. The ontology `SKILL.md` Facets table and the
glossary-level paragraph say "required". The Kinds table says "whether it may be null".

**Why backlogged:** The v2 design changed only the Kinds table. Both words name the same fact.

**Context:** The record holds the fact in `dataConstraints.nullability`, with values such as `"NOT_NULLABLE"`,
as Palantir does.

## Python 3.9 support unproven for ontology.py

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Run the CLI proof on Python 3.9, or raise the stated minimum. The ontology `SKILL.md` and
`ontology.py` say it needs Python 3.9 or later.

**Why backlogged:** No 3.9 interpreter was installed, and none was downloaded. The oldest tested version is
3.10.0.

**Context:** The code uses no syntax newer than 3.9. The proof is `scripts/prove-ontology-cli.py`.

## ontology.py at its 500-code-line cap

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Decide how the CLI grows. It is exactly at the 500-code-line target, so any new feature needs a cut
elsewhere, a higher cap, or a split.

**Why backlogged:** The user chose a lean `validate` of about 400 to 500 lines. Two small `show` features were
left out to stay inside it.

**Context:** The count excludes blank lines, comments, and docstrings; the file has 610 lines. Rules across
units stay in each template's review checklist, not in `validate`.

## show omits bare-id Property fields

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Let `ontology.py show` print fields that name a Property by bare id: `propertyArguments` keys,
`condition.propertyApiNames`, `primaryKey`, and `titleProperty`.

**Why backlogged:** A version that printed the first two measured 512 code lines, over the cap.

**Context:** Without them, the Property review item "set by a `propertyArguments` entry of at least one Action
type" needs a manual read. `show` also prints an outgoing edge as written and an incoming edge as
`<area>/<id>`; normalizing both would cost one line over the cap.
