# Python — Conventions & Style

Child doc of the `python` skill: the deep reference for how Python source is spelled, laid out, and documented
at the 3.12 baseline. Read it when a naming, formatting, docstring, import, or comment question is genuinely on
a fork. Every construct here is valid at Python 3.12; tool and library names are examples.

Project configuration is authoritative: follow its formatter, line length, import order, and docstring dialect.
A new project with no dialect takes the parent's *softened style* default — PEP 8 names, one deterministic
88-column formatter (4-space indents, double quotes), Google-style public docstrings, and explicit grouped
absolute imports.

This doc **deepens, and does not restate,** the parent floor:

| Surface | Owner | This doc adds |
|---|---|---|
| The style dialect | the *softened style* default | the mechanics once config (or the new-project default) picks the dialect |
| Applying conventions as code is written | Procedure step P6 (*Grow in minimal verified steps*) | how each convention reads slice by slice |
| Naming as a design act | Procedure step P3 (*Design the units*; step 6 names each unit for intent) | only the *spelling and casing* of every name, a parameter's included |
| A parameter's *shape* (position, keyword-only, default) | `design.md` | only the parameter's *spelling* |
| Type constructs named in passing (a `TypeVar`, a type alias, `if TYPE_CHECKING:` resolution) | `typing.md` | only their spelling and where the import sits |
| Import-time safety | `H2` | the import layout that keeps the block inert |
| Comment meaning and maintenance | `coding` Principle 13 | the Python layout and marker grammar |

## Contents

1. [Naming and casing matrix](#1-naming-and-casing-matrix)
2. [Formatting and line-splitting](#2-formatting-and-line-splitting)
3. [Docstring grammar](#3-docstring-grammar)
4. [Import conventions](#4-import-conventions)
5. [Comments](#5-comments)

---

## 1. Naming and casing matrix

Choose the name's words first, then apply the casing owned by its kind. This section owns the *casing* of a
PEP 695 declared type parameter or alias too; their type mechanics are `typing.md`'s.

| Kind | Casing | Example | Mechanics |
|---|---|---|---|
| Package (directory) | short, all-lowercase, avoid underscores | `httpclient` | keep the import path compact |
| Module (file) | `lower_snake_case.py` | `rate_limiter.py` | underscores only where they aid reading |
| Class | `PascalCase` (CapWords) | `RateLimiter` | name the role or value, not the pattern |
| Exception class | `PascalCase`, `Error` suffix | `RateLimitError` | suffix a genuine error, not a non-error control signal |
| Function / method | `lower_snake_case` | `acquire_token` | start with a precise verb for an action |
| Variable / attribute | `lower_snake_case` | `token_count` | name the domain role; add units when ambiguous |
| Constant | `UPPER_SNAKE_CASE` | `MAX_TOKENS` | reserve for values treated as fixed |
| Type variable / PEP 695 parameter | `PascalCase`, short, optional variance suffix | `T`, `KeyT`, `T_co` | short only when the relationship is obvious |
| Type alias (incl. a `type` statement) | `PascalCase` | `JsonValue`, `Pair[T]` | name the concept, not the container spelling |
| Internal name | single leading underscore | `_buffer` | advisory non-public intent |
| Name-mangled attribute | double leading underscore, no trailing pair | `__vtable` | avoids subclass clashes, not privacy |
| Dunder | double leading + trailing underscore | `__init__` | implement only names Python defines; never invent one |

- **Acronyms keep case per the surrounding convention.** In `PascalCase`, preserve every letter — `HTTPServer`,
  `XMLParser`, `HTTPSConnection`, never `HttpServer` / `XmlParser`. In `snake_case`, lowercase it as an
  ordinary word — `http_server`, `xml_parser`, `parse_url`.
- **The underscore ladder is meaning, not decoration.** A single `_` is advisory internal intent; a double
  leading underscore invokes name mangling to avoid inheritance clashes, never as privacy (the parent's
  `NEVER` floor); a double leading-and-trailing name is a reserved dunder — never invent one.
- **Never shadow a builtin or keyword** — `list`, `dict`, `id`, `type`, `input`, `str`, or a keyword such as
  `match`. Pick the domain name first (`rows`, `record_type`, `user_id`); only when an externally fixed name or
  a keyword collision leaves no accurate alternative, append one trailing underscore (`type_`, `class_`) —
  never misspell to dodge the clash.
- **Ban the ambiguous single characters `l`, `O`, `I`** (they read as `1`/`0`/`1`). Short single-letter names
  are fine in a tiny conventional scope — `i`/`j` indices, `x`/`y` coordinates, `T` a type variable, `f` a file
  handle in a `with`.
- **Length follows ambiguity, not a quota.** A comprehension variable may be a single letter; a module constant
  or public function needs a full name. Prefer `users` over `user_collection` but `active_users` over `data`;
  avoid stutter (`user.user_name` → `user.name`); keep pairs parallel (`source_path` / `target_path`); rename
  when meaning changes.

Name a signature only after its input surface is fixed (`final P9`): a narrow interface reduces what the name
must carry, so each parameter names one visible dependency instead of masking an opaque aggregate. This doc owns
the spelling; `design.md` owns the shape.

## 2. Formatting and line-splitting

A deterministic formatter owns whitespace, quote style (double), and line continuation; take its output as
authoritative — a new project uses its 88-column, 4-space, double-quote defaults. Put a long expression inside
matching delimiters and let the formatter pick the compact or exploded form; never hand-wrap with a backslash.

| Case | Mechanics |
|---|---|
| Call, collection, or definition past the column limit | explode: one element per line, indented one level, a trailing comma on the last, the closing bracket dedented to the opening line |
| The magic trailing comma | a hand-added trailing comma forces the exploded layout even when content fits — use it to lock a growing multi-line shape (a later addition stays a one-line diff). Omit it where it changes grammar, e.g. unparenthesized `return x,`, which creates a tuple |
| A fluent chain | parenthesize the whole expression, each call on its own line led by `.` |
| A long string | adjacent literals concatenate at compile time; parenthesize a long message across lines. Footgun: a *missing* comma between two list items silently joins them into one string instead of erroring |
| A long binary expression | break *before* the arithmetic or boolean operator so continuation lines expose the structure (PEP 8 / Knuth) |
| Multiple context managers | a parenthesized `with`, one context per line |
| Blank-line rhythm | two blank lines between top-level functions/classes; one between methods; inside a body one only to group related statements, never several as a fake heading |
| `# fmt: off` / `on` / `skip` | suspend the formatter only where layout genuinely matters — a hand-aligned matrix or lookup table. Wrap a block with `# fmt: off` … `# fmt: on`, or one line with trailing `# fmt: skip`; confirm the formatter supports it, and remove a skip kept only for personal wrapping |

Name modules and public signatures in the skeleton, then format and import-check that skeleton and every slice
after it (`final P7`, Procedure steps P5–P6). Formatting is per-slice construction evidence, not a restyle
deferred to the end.

## 3. Docstring grammar

Use the project's configured dialect; the new-project Google default documents every public module, class,
function, and method whose text adds contract information. Use only the sections that carry information.

| Section | Use |
|---|---|
| `Args:` | each meaningful parameter; spell variadics `*items` / `**options` |
| `Returns:` | the value; omit for `-> None` |
| `Yields:` | a generator's items, *instead of* `Returns:` |
| `Raises:` | each exception a caller can catch |
| `Attributes:` | a class's or module's public attributes (especially a dataclass's) |
| `Examples:` | runnable usage, doctest-shaped and free of environment-specific output |

- **Summary line.** One physical line, imperative mood ("Return the parsed record", not "Returns …"), ending in
  a period, under the line limit. It is the first statement — a blank line separates it from the sections.
- **Module vs class vs function.** A module docstring states what the file provides; a class docstring
  summarizes the type and its public `Attributes:` (especially a dataclass's); a function docstring summarizes
  the behaviour and documents only what the signature cannot show.
- **One-line vs multi-line.** A trivial helper gets a one-line docstring, closing `"""` on the same line;
  parameters, a raise, or a non-obvious return earn the full multi-line form.
- **Do not restate the signature.** Names and types live in the annotations — do not repeat them; omit
  `Returns:` for `-> None`. Document the non-obvious: units, ownership of a returned container, side effects,
  constraints. A parameter that adds nothing beyond its name needs no `Args:` line.
- **`Raises:` completeness.** List every exception a caller can reasonably catch — validation errors, stable
  domain exceptions, deliberately-propagated translations — not every incidental implementation exception, and
  never a vague `Raises: Exception on failure`. When the code exposes a new stable failure, update the code and
  docstring together.

## 4. Import conventions

The parent floor requires explicit, grouped, absolute, import-safe imports. The layout that produces them:

| Decision | Choose | Exceptions / limits |
|---|---|---|
| Location | module scope, at the top | into a function only to break a cycle, gate an optional dependency, or address a measured startup cost. A local import does not make top-level work inert |
| Groups | standard library, then third-party, then first-party / local, blank-line separated in order | sort module paths lexically within each group, and the names inside a parenthesized `from` import — the sorter does this deterministically |
| `import module` | functions whose origin should stay visible (`json.loads`), or several members from one module | — |
| `from module import name` | a small, stable set used often, plus `collections.abc` / `typing` names | never `*` — it hides every name's origin (the parent `NEVER` floor) |
| Alias | community convention (`import numpy as np`), a genuine collision, or a repeatedly used excessively long path | never a vanity shorthand |
| `if TYPE_CHECKING:` | imports needed only by annotations; quote a reference whose name exists only inside the guard | this doc owns placement, `typing.md` the resolution; the guard avoids runtime cost and cycles |
| `__all__` | a literal list declaring the module's public surface | not derived from `globals()` or a pattern; update it with every public rename |
| Relative import | shallow intra-package `from . import x` or `from .sub import y` | two or more `..` levels signal a layout problem — restructure instead |

The import block stays inert: imports run on import, so the module top level binds names only — a module logger
handle is fine, but no I/O, connections, or work. This is the parent's import-safety floor (`H2`) from the
convention side; it deepens the layout without replacing the entry-point rule.

## 5. Comments

The `coding` comment discipline (Principle 13) carries over in full: comment the *why* not the *what*; delete
commented-out code rather than parking it; treat a comment that must explain *what* a block does as a signal to
extract a named function; and update or delete a comment in the same change that invalidates it. Python- and
PEP 8-specific is the layout and marker grammar:

- **Block vs inline.** A block comment sits above the code at the same indent, in full sentences. An inline
  comment follows the statement after at least two spaces, then `# ` and a short note — used sparingly; move a
  second sentence to a block above.
- **`TODO` / `FIXME` grammar.** Write `# TODO(owner): actionable thing` with a tracking reference and a
  falsifiable removal condition; use `# FIXME:` for a known-broken spot that must be repaired. Keep them
  greppable and owned, so they are found and closed.
