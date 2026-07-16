# TypeScript — Convention

**Ownership** — the authoring-time lookup surface: the casing matrix (types/interfaces/classes, values,
constants), file naming, import ordering and `import type` placement, TSDoc tag grammar, the formatter stance
(Prettier / Biome), and comment mechanics.

**Split criterion** — skill-writing P3 (b): a scannable lookup reference an agent consults at authoring time —
casing rows, import order, and TSDoc tags are looked up, not read narratively.

This doc **deepens, and does not restate,** the SKILL.md convention rules and the language-agnostic parent
floor. It owns the *spelling* of TypeScript source; the mechanics and the rules live with their owners:

| Surface | Owner | This doc adds |
|---|---|---|
| Naming for intent (choose a name that tells the truth) | `coding` Principle 5 | the TypeScript *casing* each kind takes |
| The `import type` marker + the `.js`/`.ts` import-extension fork | SKILL.md Rules (`verbatimModuleSyntax`) / `modules-tooling.md` | the group *order* and *placement* of imports — not the marker rule or the extension |
| `enum` ban / erasable syntax | SKILL.md Principle 7 | the casing of the `as const` set that replaces an `enum` |
| Type-construct mechanics (generics, `satisfies`, branded types) | `typing.md` | only their *spelling and casing* |
| Comment the *why*, not the *what* | `coding` Principle 13 | the TypeScript comment, TSDoc, and marker grammar |
| Which public surface earns a doc | `coding` Principles 11 & 13 | the TSDoc *tag* grammar |

## Contents

1. [Naming and casing matrix](#1-naming-and-casing-matrix)
2. [File naming](#2-file-naming)
3. [Import ordering and `import type`](#3-import-ordering-and-import-type)
4. [TSDoc grammar](#4-tsdoc-grammar)
5. [Formatter stance, comments, and markers](#5-formatter-stance-comments-and-markers)

---

## 1. Naming and casing matrix

Choose the name's words first (`coding` Principle 5), then apply the casing owned by its kind. TypeScript is
structural, so a name is documentation the compiler does not check — the spelling is all the reader gets.

| Kind | Casing | Example | Note |
|---|---|---|---|
| Class | `PascalCase` | `TokenBucket` | name the role or value, not the pattern |
| Interface | `PascalCase`, **no `I` prefix** | `RateLimiter` | Google: never `IRateLimiter` |
| Type alias | `PascalCase` | `JsonValue` | name the concept, not the container spelling |
| Type parameter | single capital, or `PascalCase` with a `T` prefix | `T`, `TKey`, `TValue` | short only when the relationship is obvious |
| Function / method | `camelCase`, verb-first | `acquireToken` | a precise verb for an action |
| Variable / parameter / property | `camelCase` | `tokenCount` | name the domain role; add units when ambiguous |
| Module-level constant | `CONSTANT_CASE` | `MAX_RETRIES` | only a value treated as fixed and deeply immutable |
| Local `const` binding | `camelCase` | `nextToken` | `CONSTANT_CASE` is for module / static constants, not every `const` |
| Private member | `private` or `#name`, **no `_` prefix** | `#available` | an underscore prefix is not privacy |
| `enum` (avoided) | — | — | model a closed set as an `as const` object or union (SKILL Principle 7); see `typing.md` |

```ts
interface RateLimiter {          // PascalCase, no `I` prefix (Google)
  readonly maxTokens: number;
}

class TokenBucket implements RateLimiter {
  readonly maxTokens = 60;       // property: camelCase
  #available = 60;               // private via `#`, never an `_` prefix

  acquireToken(): boolean {      // method: camelCase, verb-first
    if (this.#available <= 0) {
      return false;
    }
    this.#available -= 1;
    return true;
  }
}

type JsonValue = string | number | boolean | null;   // type alias: PascalCase
const MAX_RETRIES = 3;           // module constant: CONSTANT_CASE
```

- **Acronyms are whole words in every case** — `HttpClient`, `parseXmlUrl`, `httpServer`, never `HTTPClient`
  or `parseXMLUrl`; keep a platform-fixed name verbatim (`XMLHttpRequest`).
- **Booleans read as predicates** — `isReady`, `hasToken`, `canRetry`, so a condition reads as a sentence.
- **Never shadow a global or reserved word** (`String`, `Array`, `type`, `await`); pick the domain name first.
  The set an `enum` would model is an `as const` object in `PascalCase` with `CONSTANT_CASE` keys.

## 2. File naming

| Element | Convention | Example |
|---|---|---|
| Source file | lowercase, hyphen-separated (kebab-case) is the common default; some projects name the file after its single primary export | `rate-limiter.ts` or `RateLimiter.ts` |
| Barrel | `index.ts` re-exporting the directory's public surface | `index.ts` |
| Unit test | `.test.ts` / `.spec.ts` beside the source | `rate-limiter.test.ts` |
| Type-level test | `.test-d.ts` | `rate-limiter.test-d.ts` |
| Declaration file | `.d.ts` | `globals.d.ts` |

Follow the project's existing file-name style rather than inventing a second one. The relative-import
*extension* (`.js` vs `.ts`) is not a naming choice — SKILL.md Rules and `modules-tooling.md` own it.

## 3. Import ordering and `import type`

Group imports top-down, one blank line between groups, sorted lexically within a group:

| Order | Group | Example specifier |
|---|---|---|
| 1 | node built-ins (`node:` prefix) | `node:fs/promises` |
| 2 | external packages | `zod`, `express` |
| 3 | internal path-alias | `@app/logging` |
| 4 | relative (`../` before `./`) | `./config.js` |

```
import { readFile } from "node:fs/promises";

import { z } from "zod";

import { logger } from "@app/logging";

import { parseConfig } from "./config.js";
import type { Config } from "./config.js";
```

- **Do not hand-order** — a lint plugin (`simple-import-sort`, `eslint-plugin-import`) fixes the order
  deterministically, the same way the formatter owns whitespace.
- **`import type` placement** — a type-only import is written `import type { Config } from "./config.js"` as
  its own statement in the same group, or inline as `import { type Config, parseConfig } from "./config.js"`.
  `verbatimModuleSyntax` (SKILL.md Rules) requires the marker; this doc only fixes where it sits.
- **Side-effect imports** (`import "./register.js"`) carry no binding — place them first, where load order is
  the point, and let the file name state the intent.
- **Prefer named imports** — reach for a namespace import (`import * as`) only for an API that is genuinely
  namespaced, never as a shorthand.

## 4. TSDoc grammar

TSDoc uses `/** … */`. Types live in the annotations — never repeat a type in a tag (no JSDoc-style
`@param {type}`). Document the contract a signature cannot show; a name that adds nothing needs no tag.

| Tag | Use |
|---|---|
| `@param name - desc` | each meaningful parameter — the signature already carries its type |
| `@returns desc` | the returned value; omit for a `void` return |
| `@throws {@link ErrorType} desc` | each error a caller can reasonably catch — name it with `{@link}` or prose, not a JSDoc `{Type}` expression |
| `@typeParam T - desc` | a type parameter whose role is not obvious |
| `@example` | runnable usage |
| `@remarks` | rationale or constraints beyond the one-line summary |
| `@deprecated` | a retiring API and its replacement |

```ts
/**
 * Acquire one token for the caller when the bucket has capacity.
 *
 * @param userId - the caller whose quota is charged
 * @returns `true` when a token was granted, `false` when the bucket is empty
 * @throws {@link RangeError} when `userId` is empty
 */
function acquire(userId: string): boolean {
  if (userId.length === 0) {
    throw new RangeError("userId must not be empty");
  }
  return true;
}
```

- **Summary line first** — imperative mood ("Acquire a token", not "Acquires…"), one line, a blank line
  before any tag.
- **Document the surface that adds contract information** — the exported/public API; skip a doc that only
  restates the annotations.
- **Keep it true to the code** — a stale TSDoc is a defect at the same priority as stale code
  (`coding` Principle 13), updated in the change that invalidates it.

## 5. Formatter stance, comments, and markers

A deterministic formatter owns whitespace, quotes, semicolons, and line width — take its output as
authoritative and never hand-format. **Prettier** is the de-facto default; **Biome** is a faster all-in-one
(formatter plus linter) alternative. Follow the project's configured tool; a new project picks one, commits
its config, and runs it in check mode in CI. The formatter is layout only — type strictness and lint are
separate gates (SKILL.md Principle 7 / `modules-tooling.md`).

Comment the *why*, not the *what* (`coding` Principle 13): the rationale, the constraint, the rejected
alternative. Delete commented-out code — version control holds the history.

```ts
// Retry only on 5xx: a 4xx is the caller's error and will never succeed on replay.
function isRetryable(status: number): boolean {
  return status >= 500 && status < 600;
}
```

| Marker | Use |
|---|---|
| `//` | a short line comment above the code it explains |
| `/* … */` | a rare multi-line non-doc note |
| `/** … */` | TSDoc on an exported or public declaration (§ 4) |
| `// TODO(owner): action` | an owned, greppable follow-up with a tracking reference (`// TODO(alice): drop after #1423`) |
| `// FIXME(owner): defect` | a known-broken spot to repair |
| `// eslint-disable-next-line <rule> -- reason` | a scoped, reason-bearing lint suppression, never a blanket file-wide disable |
