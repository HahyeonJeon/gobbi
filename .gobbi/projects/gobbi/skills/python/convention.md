# Python — Conventions & Style

Child doc of the `python` skill: the deep reference for how Python source is spelled, laid out, and documented
at the 3.12 baseline — the full naming matrix, the formatter's line-splitting mechanics, the Google docstring
grammar, the import layout, and comment discipline. The `SKILL.md` § Procedure P6 (*Grow in minimal
verified steps*) applies the convention floor as you write, and § Procedure P3e (*Names for intent*) owns
naming as a design act; this doc gives the mechanics behind each convention so two
authors produce the same style byte for byte. Read it when a naming, formatting, docstring, import, or comment
question is genuinely on a fork.

This doc **deepens, and does not restate,** these parent surfaces: § Procedure P6 (apply the conventions as you write), § Procedure P3e (*Names
for intent*), and the rules *"MUST use PEP 8 naming with a leading underscore for internal names"*, *"MUST format with one
deterministic autoformatter at 88 columns and 4-space indents"*, *"MUST write Google-style docstrings on
public modules, classes, functions, and methods"*, *"MUST keep imports explicit, grouped, absolute, and
import-safe"*, and *"NEVER use wildcard imports, invented dunder names, or name-mangling as ordinary
privacy"*. Those rules are the floor; the sections below give the mechanics. This doc owns the *spelling and
casing* of every name — including a parameter's name, whose *shape* (position, keyword-only, default) is
`design.md`'s. The type-level constructs it names in passing — a `TypeVar`, a type alias, the
`if TYPE_CHECKING:` forward-reference resolution — are owned by `typing.md`. Every construct here is valid at
Python 3.12; tool and library names are examples, never a lock.

## Contents

1. [Naming and casing matrix](#1-naming-and-casing-matrix)
2. [Formatting and line-splitting](#2-formatting-and-line-splitting)
3. [Docstring grammar](#3-docstring-grammar)
4. [Import conventions](#4-import-conventions)
5. [Comments](#5-comments)

---

## 1. Naming and casing matrix

The parent floor names five casing rules; the full matrix every maintained name follows. Choose the name's
words first, then apply the casing owned by its kind.

| Kind | Casing | Example | Mechanics |
|---|---|---|---|
| Package (directory) | short, all-lowercase, no underscores if avoidable | `httpclient` | keep the import path compact |
| Module (file) | `lower_snake_case.py` | `rate_limiter.py` | underscores only where they aid reading |
| Class | `PascalCase` (CapWords) | `RateLimiter` | name the role or value, not the pattern |
| Exception class | `PascalCase`, `Error` suffix | `RateLimitError` | suffix a genuine error, not a non-error control signal |
| Function / method | `lower_snake_case` | `acquire_token` | start with a precise verb for an action |
| Variable / attribute | `lower_snake_case` | `token_count` | name the domain role; add units when ambiguous |
| Constant | `UPPER_SNAKE_CASE` | `MAX_TOKENS` | reserve for values treated as fixed |
| Type variable | `PascalCase`, short, optional variance suffix | `T`, `KeyT`, `T_co` | short only when the relationship is obvious |
| Type alias | `PascalCase` | `JsonValue` | name the concept, not the container spelling |
| Internal name | single leading underscore | `_buffer` | marks non-public intent (advisory) |
| Name-mangled attribute | double leading underscore, no trailing | `__vtable` | avoids subclass name clashes, not privacy |
| Dunder | double leading + trailing underscore | `__init__` | implement only names Python defines; never invent one |

Native PEP 695 syntax spells a declared type parameter or alias — this section owns their *casing* (their type
mechanics are `typing.md`'s):

```python
class Cache[KeyT, ValueT]:          # type parameters are CapWords, often ending in T
    ...

type HeaderMap = dict[str, str]     # a type alias is CapWords
type Pair[ElementT] = tuple[ElementT, ElementT]
```

- **Acronyms keep their case per the surrounding convention.** In `PascalCase`, preserve every letter of an
  acronym — `HTTPServer`, `XMLParser`, `HTTPSConnection`, never `HttpServer` / `XmlParser`. In `snake_case`,
  lowercase the acronym as an ordinary word — `http_server`, `xml_parser`, `parse_url`.
- **The leading-underscore ladder is meaning, not decoration.** A single `_` marks a name as internal
  (advisory). A double leading underscore triggers name mangling — a mechanism for avoiding attribute clashes
  in inheritance, not an access control; using it as "private" is the parent's `NEVER` floor. A double
  leading-and-trailing name is a reserved dunder — never invent one.
- **Never shadow a builtin or keyword.** Do not rebind `list`, `dict`, `id`, `type`, `input`, `str`, or a
  keyword such as `match`. Pick the domain name first (`rows`, `record_type`, `user_id`); only when an
  externally fixed name or a keyword collision leaves no accurate alternative, append one trailing underscore
  (`type_`, `class_`) — never misspell the name to dodge the clash.
- **Ban the ambiguous single characters `l`, `O`, `I`.** They read as `1`/`0`/`1`. Short single-letter names
  are fine where scope is tiny and conventional (`i`/`j` loop indices, `x`/`y` coordinates, `T` a type
  variable, `f` a file handle in a `with`).
- **Length follows ambiguity, not a quota.** A one-line comprehension variable may be a single letter; a
  module-level constant or public function needs a full name. Prefer `users` over `user_collection` but
  `active_users` over `data`; avoid context stutter (`user.user_name` → `user.name`); keep paired names
  parallel (`source_path` / `target_path`); and rename any name when its meaning changes (the parent floor). A
  parameter's spelling follows these rules; its *shape* is `design.md`'s.

```python
MAX_RETRIES = 5                         # module constant: UPPER_SNAKE_CASE

class HTTPTimeoutError(Exception):      # acronym stays uppercase; Error suffix
    """Raised when an HTTP call exceeds its deadline."""

def render(value: object, *, type_: str = "text") -> str:   # type_ avoids shadowing type()
    ...
```

## 2. Formatting and line-splitting

A deterministic formatter owns whitespace, quote style (double), and line continuation; take its output as
authoritative. Put a long expression inside matching delimiters and let the formatter choose the compact form
when it fits and the exploded form when it does not — never hand-wrap with a backslash.

- **The 88-column break.** When a call, collection, or definition exceeds 88 columns, the formatter explodes
  it: one element per line, each indented one level, a trailing comma on the last element, and the closing
  bracket dedented to the opening line's indent.
- **The magic trailing comma.** A trailing comma you add by hand forces the exploded layout even when the
  content would fit on one line — use it to lock a multi-line shape that you expect to grow, so a later
  addition stays a one-line diff. Omit it only where a trailing comma changes grammar, such as a single
  expression in an unparenthesized `return x,` (which becomes a tuple).
- **Break a fluent chain inside parentheses.** Wrap the whole expression and put each call on its own line,
  led by its dot, so the continued operations line up.
- **Implicit string concatenation.** Adjacent string literals join at compile time; wrap a long message in
  parentheses and split it across lines. The footgun: a *missing* comma between two list items silently
  concatenates them into one string instead of erroring.
- **Break before a binary operator.** Split a long arithmetic or boolean expression so each continuation line
  *starts* with the operator — the operator column shows the structure (PEP 8 / Knuth).
- **Parenthesized `with`.** Group a multi-context `with` in parentheses and break one context per line.
- **Blank-line rhythm.** Two blank lines between top-level functions and classes; one between methods; single
  blank lines inside a body only to group related statements — never several to fake a section heading.
- **`# fmt: off` / `# fmt: on` / `# fmt: skip` sparingly.** Suspend the formatter only where its layout
  genuinely hurts — a hand-aligned numeric matrix or a lookup table. Wrap a block with `# fmt: off` … `# fmt:
  on`, or a single line with a trailing `# fmt: skip`, and confirm the configured formatter recognizes the
  directive. A skip used only to keep personal wrapping is removed, not honoured.

```python
result = compute_statistics(
    dataset,
    window=30,
    method="ewma",
    fill_missing=True,           # magic trailing comma → layout stays exploded
)

message = (
    "the request could not be completed because the upstream "
    "service returned an unexpected status"      # implicit concatenation across lines
)

labels = [
    "alpha",
    "beta"                       # BUG: missing comma silently makes "betagamma"
    "gamma",
]

total = (
    base_price
    + shipping_cost              # operator starts the continuation line
    - discount
)

with (
    open("in.txt", encoding="utf-8") as src,
    open("out.txt", "w", encoding="utf-8") as dst,
):
    dst.write(src.read())

# fmt: off
ROTATION = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
]
# fmt: on
```

```python
visible_names = (
    catalog.select_public()
    .sort_by_name()              # each continued call is led by its dot
    .limit(MAX_VISIBLE_NAMES)
)
```

## 3. Docstring grammar

The parent floor mandates a Google-style docstring on every public module, class, function, and method. The
grammar of one:

- **Section vocabulary.** `Args:` (each meaningful parameter), `Returns:` (the value), `Yields:` (a
  generator's items, used *instead of* `Returns:`), `Raises:` (each exception a caller can catch),
  `Attributes:` (a class's or module's public attributes), `Examples:` (runnable usage). Use only the sections
  that carry information; spell variadic parameters as `*items` / `**options` in `Args:`.
- **Summary line.** One physical line, imperative mood ("Return the parsed record", not "Returns the parsed
  record"), ending in a period, fitting under the line limit. It is the first statement in the object — a
  blank line separates it from the sections.
- **Module vs class vs function.** A module docstring opens the file and states what it provides. A class
  docstring summarizes the type and lists its public `Attributes:` (especially for a dataclass). A function
  docstring summarizes the behaviour and documents only what the signature cannot show.
- **One-line vs multi-line.** A trivial helper gets a one-line docstring with the closing `"""` on the same
  line. Anything with parameters, a raise, or a non-obvious return gets the full multi-line form.
- **Do not restate the signature.** Names and types already live in the annotations — do not repeat them, and
  omit `Returns:` for a `-> None`. Document the non-obvious: units, ownership of a returned container, side
  effects, and constraints. A parameter that adds nothing beyond its name needs no `Args:` line. Keep an
  `Examples:` block doctest-shaped and free of environment-specific output.
- **`Raises:` completeness.** List every exception a caller can reasonably catch — validation errors, stable
  domain exceptions, deliberately-propagated translations — but not every incidental implementation exception,
  and never a vague `Raises: Exception on failure`. When the code starts to expose a new stable failure,
  update the code and the docstring together.

```python
from collections.abc import Iterator

def read_records(path: str, *, encoding: str = "utf-8") -> list[dict[str, object]]:
    """Load newline-delimited JSON records from a file.

    Args:
        path: Filesystem path to the source file.
        encoding: Text encoding used to decode the bytes.

    Returns:
        The parsed records, in file order.

    Raises:
        FileNotFoundError: If path does not exist.
        ValueError: If a line is not valid JSON.
    """
    ...

def stream_lines(path: str) -> Iterator[str]:
    """Yield each decoded line with its trailing newline stripped.

    Yields:
        Each line, in file order.
    """
    yield  # placeholder for the generator body

def slugify(text: str) -> str:
    """Return a URL-safe slug of the given text."""
    ...
```

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class RetryPolicy:
    """Immutable retry configuration for a client call.

    Attributes:
        attempts: Total number of tries, including the first.
        backoff_seconds: Base delay, multiplied by the attempt index.

    Examples:
        >>> RetryPolicy(attempts=3).attempts
        3
    """

    attempts: int = 3
    backoff_seconds: float = 0.5
```

## 4. Import conventions

The parent floor requires explicit, grouped, absolute, import-safe imports. The layout that produces them:

- **Module scope by default.** Keep imports at the top of the module; move one into a function only for a
  specific reason — breaking an import cycle, an optional dependency behind a feature, or a measured
  startup-cost. A local import does not make the module inert if the work still runs during import.
- **Three groups, blank-line separated, in order.** (1) standard library, (2) third-party, (3) first-party /
  local. Sort module paths lexically within each group, and sort the names inside a parenthesized `from`
  import too — the formatter or import sorter does this deterministically.
- **`import module` vs `from module import name`.** Import the *module* for functions so the origin stays
  visible at the call site (`json.loads(...)`, not a bare `loads`), and when several members are used. Use
  `from` for a small, stable set of names used often, and for the `collections.abc` / `typing` names. Never
  `from module import *` — it hides every name's origin (the parent `NEVER` floor).
- **Alias only by convention or to resolve a clash.** A community-standard alias (`import numpy as np`), a
  genuine name collision, or an excessively long path used repeatedly is the only reason to rename on import;
  never a vanity shorthand.
- **The `if TYPE_CHECKING:` group.** Put imports needed only for annotations in a trailing `if TYPE_CHECKING:`
  block, so they cost nothing at runtime and cannot form an import cycle; then quote an annotation whose name
  exists only in that guard. The resolution mechanics of those forward-references are `typing.md`'s — this is
  only where the import sits.
- **`__all__` is the declared public surface.** Set `__all__` to the static list of names a
  `from module import *` should export; it doubles as the documented public API. Keep it literal — not derived
  from `globals()` or a naming pattern — and update it in the same change as a public rename.
- **Explicit relative imports stay shallow and intra-package.** Use `from . import x` or `from .sub import y`
  inside a package; a climb of two or more `..` levels signals a layout problem — restructure rather than
  reach up.
- **The import block stays inert.** Imports run on import, so the module top level binds names only — a module
  logger handle is fine, but no I/O, no connections, no work (the parent's import-safety floor, seen from the
  convention side).

```python
import json
import logging
from collections.abc import Iterable, Mapping
from typing import TYPE_CHECKING

import httpx

from myproj.config import Settings
from myproj.errors import ConfigError

if TYPE_CHECKING:
    from myproj.models import Record   # typing-only: no runtime import, no cycle

__all__ = ["Settings", "load_settings"]

logger = logging.getLogger(__name__)   # binding a name is inert; safe at import time
```

## 5. Comments

The `coding` comment discipline carries over unchanged — comment the *why* not the *what*, delete
commented-out code rather than parking it, treat a comment that must explain *what* a block does as a signal
to extract a named function, and update or delete a comment in the same change that invalidates it. What is
Python- and PEP 8-specific is the layout and marker grammar:

- **Block vs inline.** A block comment sits above the code at the same indent, in full sentences. An inline
  comment follows the statement after at least two spaces, then `# ` and a short note — use it sparingly, and
  when a second sentence is needed, move it to a block above.
- **`TODO` / `FIXME` grammar.** Write `# TODO(owner): actionable thing` with a tracking reference and a
  falsifiable removal condition; use `# FIXME:` for a known-broken spot that must be repaired. Make them
  greppable and owned, so they are found and closed.

```python
# WHY: the upstream API rejects batches over 500, so we chunk here rather than
# in the caller, which cannot see the limit.
for chunk in batched(records, 500):
    submit(chunk)

timeout_s = 30  # upstream p99 is 8s; 30s absorbs a cold start without hanging a worker

# TODO(ari): drop this shim once the v2 endpoint ships (see #1421)
```
