# React — Typing

**Not applicable on a plain-JavaScript React codebase.** This is the one child in this skill that a whole
supported fork switches off: where the source is plain JavaScript, `typescript` is not loaded, no typing
rule applies, and every other file in this skill still holds. Nothing here is a prerequisite for anything
else — skip it entirely on that fork.

**Ownership** — React-specific typing, and only that: the props surface, `children`, events, hook type
arguments, refs, the style prop, and what the `.tsx` extension changes about the language itself.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: it is opened at one typing
question and read a section at a time. P4's other three categories do not describe it — no artifact set,
no per-unit orchestration, not a sub-procedure another consumer loads.

## The line that decides what is in this file

**A typing fact that stays true when React is removed belongs to `typescript/typing.md`; a fact naming a
React type, hook, prop, or JSX construct belongs here.** Applied sentence by sentence, that line puts
"a discriminated union lets the compiler prove exhaustiveness" in `typescript`, and "the props type is a
discriminated union keyed on a `status` literal" here; "`satisfies` checks without widening" in
`typescript`, and "`.tsx` disallows one of the two assertion syntaxes" here.

Every mechanism below therefore points at its owner rather than re-teaching it. The deference is
per-section, and these seven were read in the live file before being cited:

| For | Read |
|---|---|
| Union mechanics and `never` exhaustiveness behind discriminated-union props | [`typescript/typing.md`](../typescript/typing.md) §1 — Discriminated unions and `never` exhaustiveness |
| Type parameters, constraints, and inference behind a generic component or a hook type argument | §2 — Generics |
| Choosing between an annotation, `satisfies`, and `as` on any value below | §4 — `satisfies`, annotation, and `as` |
| Narrowing a nullable ref or a union prop before use | §6 — Narrowing, guards, and predicates |
| `unknown`, `readonly`, and `as const` on props and state | §7 — `unknown`, `never`, `readonly`, and `as const` |
| `interface` versus `type` for a props declaration, and the utility types applied to one | §8 — Utility types and `interface` vs `type` |
| Declaring or augmenting module types, including for a bridged global | §9 — Declaration files and module augmentation |

**This file carries no rule of its own, deliberately.** `SKILL.md` states that typing discipline belongs
to `typescript` and that restating it "would create a second owner and the two would drift" — a React
typing rule would be exactly that second owner. The floor is already enforced from two directions: the
type-check gate at Procedure P7, and the language-idiom review axis at Procedure P8, which
`REACT-CHECK-23` counts. What follows is depth, not policy.

---

## 1. What `.tsx` changes

*"Every file containing JSX must use the `.tsx` file extension. This is a TypeScript-specific extension
that tells TypeScript that this file contains JSX."*

That extension also removes a piece of the language, which is the one setup fact worth memorizing because
its error message is confusing: because angle brackets now start JSX, *"TypeScript disallows angle bracket
type assertions in `.tsx` files"*, and *"since the above syntax cannot be used in `.tsx` files, an
alternate type assertion operator should be used: `as`."* Whether an assertion is the right tool at all is
`typescript/typing.md` §4's question; in a `.tsx` file the syntax choice is already made for you.

The types themselves are a dependency, not part of React: react.dev's setup step is to install React's
type definitions and to set `jsx` in `tsconfig.json`, with `dom` in `lib` — *"`jsx` must be set to one of
the valid options. `preserve` should suffice for most applications."*

## 2. Props

The props type is the component's declared input surface, and it is designed at Procedure P3 act 4 rather
than inferred afterward. react.dev's baseline is an inline annotation on the destructured parameter, and
its own example is exactly that shape — a `title: string` on a button.

Two React-shaped decisions the language cannot make for you:

- **A union of valid shapes beats a bag of optional fields.** When a component has modes — loading,
  loaded, failed — the props type is a discriminated union keyed on a literal field, so an impossible
  combination cannot be constructed and the compiler can prove every branch is handled. The union
  mechanics and the `never` exhaustiveness check are `typescript/typing.md` §1's; what is React's is that
  the discriminant lives in the props, so the component's *callers* are the ones the compiler protects.
- **The prop surface is narrowed to what the unit reads**, which is `SKILL.md` Principle 4 rather than a
  typing preference: a component that takes a whole record to read two fields has a wide type and a wide
  coupling, and the type is where that shows first.

## 3. `children`

*"There are two common paths to describing the children of a component."*

| Type | What it admits | react.dev's words |
|---|---|---|
| `React.ReactNode` | Everything JSX can carry, including strings and numbers | *"a union of all the possible types that can be passed as children in JSX"* — *"This is a very broad definition of children."* |
| `React.ReactElement` | JSX elements only | *"only JSX elements and not JavaScript primitives like strings or numbers"* |

And the limit that stops a whole class of attempted designs: *"you cannot use TypeScript to describe that
the children are a certain type of JSX elements, so you cannot use the type-system to describe a component
which only accepts `<li>` children."* A component that must constrain what it wraps has to do it through
its API — a `items` prop with a render function, or a compound component — not through the `children`
type. Reaching for a cleverer type here is a design change wearing a typing disguise.

## 4. Events

*"When working with DOM events in React, the type of the event can often be inferred from the event
handler. However, when you want to extract a function to be passed to an event handler, you will need to
explicitly set the type of the event."* That is the whole rule: inline handlers need no annotation,
extracted ones do.

The shape of an event type is a React type parameterized by the element, as in react.dev's own
`React.ChangeEvent<HTMLInputElement>`. To find the right one: *"you can first look at the hover
information for the event handler you are using, which will show the type of the event"*, and for anything
outside the published set, *"you can use the `React.SyntheticEvent` type, which is the base type for all
events."*

## 5. Hook type arguments

React's hooks infer from what you pass them; the type argument is for the cases where there is nothing to
infer from.

- **`useState`** — *"The `useState` Hook will re-use the value passed in as the initial state to determine
  what the type of the value should be."* An explicit argument is for when the initial value does not
  describe the eventual one, which in practice means a value that starts `null` or an empty array.
- **`createContext`** — *"The type of the value provided by the context is inferred from the value passed
  to the `createContext` call."* react.dev's own pattern for a context with no sensible default is to
  include `null` in the type — *"The context is created with `| null` in the type, to accurately reflect
  the default value"* — and to remove it in a consuming hook that throws when the provider is missing.
  That hook is the narrowing point, so every reader gets the non-null type; the narrowing mechanics are
  `typescript/typing.md` §6's.
- **`useReducer`** — the action type is a discriminated union, which is what makes the reducer's `switch`
  exhaustively checkable. react.dev's example is a union of `{ type: "reset" }` and
  `{ type: "setCount"; value: State["count"] }` — note the indexed access, which keeps the action tied to
  the state shape rather than restating it.
- **`useCallback` under strict mode** — *"When working in TypeScript strict mode `useCallback` requires
  adding types for the parameters in your callback. This is because the type of the callback is inferred
  from the return value of the function, and without parameters the type cannot be fully understood."* So
  the requirement is on the *parameters*. Supplying a type argument instead is one offered style, not the
  requirement: *"Depending on your code-style preferences, you could use the `*EventHandler` functions
  from the React types to provide the type for the event handler at the same time as defining the
  callback."* Whether a `useCallback` should exist at all is `H8`'s question, in
  [`rendering.md`](rendering.md) §5–§6.

## 6. Refs

A DOM ref is nullable, and it is nullable for a React reason rather than a defensive one: *"React will set
the `current` property back to `null` when the node is removed from the screen."* The type therefore has
to admit `null`, and every read has to narrow — `typescript/typing.md` §6.

For the case where the null check is noise on every use, react.dev offers a pattern rather than an
assertion: *"If you use a type checker and don't want to always check for `null`, you can try a pattern
like this instead"* — a getter that throws, so that *"the `playerRef` itself is nullable. However, you
should be able to convince your type checker that there is no case in which `getPlayer()` returns
`null`."* One narrowing point, many call sites, no `!`.

**Not asserted here.** The distinction between a read-only and a mutable ref type, and which one a given
type argument produces, is a property of React's published type definitions rather than a statement in
react.dev's documentation. This skill does not state it; read the definitions your project resolves, and
treat any secondary description of it as unverified.

## 7. The style prop

*"When using inline styles in React, you can use `React.CSSProperties` to describe the object passed to
the `style` prop. This type is a union of all the possible CSS properties, and is a good way to ensure you
are passing valid CSS properties to the `style` prop, and to get auto-complete in your editor."* It is
also the right type for a prop that forwards style downward, which is where the alternative — an untyped
object — usually enters a codebase.

## 8. Sources and evidence classes

Read on 2026-07-26; every quoted sentence located on that date. `SKILL.md`'s References register owns the
rule-level citations, and the seven `typescript/typing.md` sections above were confirmed against the live
file rather than carried forward.

| Source | What it supports here |
|---|---|
| [Using TypeScript](https://react.dev/learn/typescript) | §1 the `.tsx` requirement and the setup options · §2 the props baseline · §3 both `children` types and the limit on constraining them · §4 event inference, the element-parameterized event type, and `SyntheticEvent` · §5 `useState`, `createContext` including the `\| null` pattern, the `useReducer` action union, and strict-mode `useCallback` · §7 `React.CSSProperties` |
| [TypeScript handbook — JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) | §1 — `.tsx` disallows angle-bracket assertions, so `as` is the assertion operator there |
| [`useRef`](https://react.dev/reference/react/useRef) | §6 — React nulls `current` when the node leaves the screen, and the throwing-getter pattern that avoids repeated null checks |

**Nothing in this file is ecosystem convention**, and that is worth saying because it is unusual among
these children: every claim above resolves to react.dev or to the TypeScript handbook. The one place where
a widely-repeated claim exists without a primary source — the read-only versus mutable ref type — is named
in §6 as not asserted rather than smuggled in as convention.
