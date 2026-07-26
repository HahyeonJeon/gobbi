# React — The Server and Client Boundary

**Ownership** — the single doc that owns what the server/client split actually is in React: the three
directives and the one that does not exist, Server Functions and the narrower Server Action role, the
**three** serialization sets and the asymmetries between them, how a value is designed for a direction,
the Actions family that rides on Server Functions, streaming server rendering and the hydration contract,
and where the "server" in Server Components really lives.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: the serialization sets are a
per-value lookup consulted at a boundary, not prose read once. P4's other three categories do not describe
it — it owns no artifact set, orchestrates no per-unit work, and is not a sub-procedure another consumer
loads.

This doc **deepens, and does not restate,** `SKILL.md` Principle 6 and Rules `H7` and `H17`, and the
`server-client.md` row of the P2 router. Every normative statement and every exception condition lives in
`SKILL.md`. Scheduling — what a transition does and does not save — lives in [`rendering.md`](rendering.md)
§8 and is pointed at, never repeated here. A claim with no primary source is labelled *ecosystem
convention* where it is made; §9 lists every source and the date it was read.

---

## 1. Three directives, one of which does not exist

| Directive | What it marks | What it does not mark |
|---|---|---|
| `'use client'` | A module, and its transitive dependencies, as client code — the boundary in the module dependency tree | Anything about serializability by itself; the values crossing it still obey §3 |
| `'use server'` | Server-side functions callable from client code — Server Functions | A Server Component. It never has |
| *(none)* | — | A Server Component has **no directive**. It is the default |

The third row is the one that misleads readers, and react.dev says so directly: *"There is no directive for
Server Components. A common misunderstanding is that Server Components are denoted by `"use server"`, but
there is no directive for Server Components. The `"use server"` directive is used for Server Functions."*

Membership is therefore derived, not declared: *"A component usage is considered a Client Component if it
is defined in module with `'use client'` directive or when it is a transitive dependency of a module that
contains a `'use client'` directive. Otherwise, it is a Server Component."* Two consequences follow. A
component with no directive at all can be a Server Component in one import path and a Client Component in
another. And `'use client'` is contagious downward — *"All code that is a part of the Client module
sub-tree is sent to and run by the client"* — so adding it to a shared module moves more code to the
browser than the diff shows.

Placement is mechanical and both directives have caveats worth reading once:

- `'use client'` — *"must be at the very beginning of a file, above any imports or other code (comments are
  OK)"*, and *"must be written with single or double quotes, but not backticks."* Applied to an
  already-client module it *"has no effect."*
- `'use server'` — *"must be at the very beginning of their function or module; above any other code
  including imports"*, same quoting rule, and *"can only be used in server-side files."* Because *"the
  underlying network calls are always asynchronous, `'use server'` can only be used on async functions."*
  To import one from client code *"the directive must be used on a module level"* — a function-level
  directive is not importable across the boundary.

## 2. Server Function, Server Action, and what the words mean now

A Server Function is any function marked `'use server'`: *"`'use server'` marks server-side functions that
can be called from client-side code."* A **Server Action** is a role a Server Function can play, not a
synonym: *"If a Server Function is passed to an `action` prop or called from inside an action then it is a
Server Action, but not all Server Functions are Server Actions."*

The older vocabulary still circulates because it was the official one: *"Until September 2024, we referred
to all Server Functions as 'Server Actions'."* A codebase or a model that calls every Server Function a
Server Action is using the retired sense — harmless in prose, misleading in a review, because it hides
the distinction the current docs draw.

What Server Functions are **for** is also narrower than it looks: *"Server Functions are designed for
mutations that update server-side state; they are not recommended for data fetching. Accordingly,
frameworks implementing Server Functions typically process one action at a time and do not have a way to
cache the return value."*

## 3. The three serialization sets

`H7` states the rule — every value crossing is serializable **in the direction it crosses** — and this is
the lookup behind it. There are **three sets**, not two, and reading them as two is the single most
common way this material gets flattened.

### Set A — Server Function arguments

From `use-server`, "Serializable arguments and return values": *"Since client code calls the Server
Function over the network, any arguments passed will need to be serializable. Here are supported types for
Server Function arguments"* —

- Primitives: string, number, bigint, boolean, undefined, null, and symbol — *"only symbols registered in
  the global Symbol registry via `Symbol.for`"*
- Iterables containing serializable values: String, Array, Map, Set, TypedArray and ArrayBuffer
- `Date`
- **`FormData` instances**
- Plain objects — *"those created with object initializers, with serializable properties"*
- Functions that are Server Functions
- Promises

*"Notably, these are not supported"* — **React elements, or JSX**; functions, *"including component
functions or any other function that is not a Server Function"*; classes; *"objects that are instances of
any class (other than the built-ins mentioned) or objects with a null prototype"*; symbols not registered
globally; and **events from event handlers**.

### Set B — Server Function return values

Set B is not stated as a list. It is stated as an identity, in the sentence that sits immediately **after**
Set A's not-supported block: *"Supported serializable return values are the same as serializable props for
a boundary Client Component."*

So **Set B = Set C**. That one sentence is the whole of Set B's definition, and its position is why the
two-list reading survives: an eye that scans the `use-server` page for bullet lists finds one supported
list and one not-supported list, concludes the page describes a single symmetric set, and never reaches
the line that redirects return values to a different set entirely.

### Set C — Server → Client Component props

From `use-client`, "Serializable types returned by Server Components": *"Prop values passed from a Server
Component to Client Component must be serializable. Serializable props include"* —

- Primitives, with the same global-registry rule for symbols
- Iterables containing serializable values: String, Array, Map, Set, TypedArray and ArrayBuffer
- `Date`
- Plain objects with serializable properties
- Functions that are Server Functions
- **Client or Server Component elements (JSX)**
- Promises

*"Notably, these are not supported"* — *"functions that are not exported from client-marked modules or
marked with `'use server'`"*; classes; class instances other than the built-ins, and null-prototype
objects; symbols not registered globally.

### The asymmetries, side by side

| Value | Argument (Set A) | Return value / prop (Set B = Set C) |
|---|---|---|
| Primitives, globally registered symbols | supported | supported |
| Iterables of serializable values | supported | supported |
| `Date` | supported | supported |
| Plain objects with serializable properties | supported | supported |
| Promises | supported | supported |
| Functions that are Server Functions | supported | supported |
| Classes, class instances, null-prototype objects | not supported | not supported |
| Symbols not registered globally | not supported | not supported |
| **JSX / component elements** | **not supported** — *"React elements, or JSX"* | **supported** — *"Client or Server Component elements (JSX)"* |
| **`FormData` instances** | **supported**, named explicitly | **not documented** — named in neither list |
| **A function exported from a client-marked module** | not supported — only Server Functions qualify | supported — the not-supported list excludes only functions that are *neither* exported from a client-marked module *nor* marked `'use server'` |
| Events from event handlers | not supported, named explicitly | not named, but an event object is a class instance, which the props list does exclude |

Three of those rows deserve their exact status rather than a summary:

- **JSX is the clean inversion.** It cannot go *in* to a Server Function and it can come *out* — and it can
  be handed down as a prop. A Server Component may render a Client Component and pass it children; a
  client caller may not hand a Server Function an element to render.
- **`FormData` is an asymmetry with a caveat.** It is named in Set A and is absent from **both** of Set C's
  lists — the supported one and the not-supported one. Set C's list is introduced with *"Serializable props
  include"*, so its silence is not a documented prohibition. Treat `FormData` as unsupported in that
  direction anyway: the page names it explicitly where it is supported, and nothing sanctions it where it
  is not. Read a value out of the `FormData` and return that instead.
- **Functions are the third asymmetry**, and it exists only because the two not-supported lists are worded
  differently. Set A admits exactly one kind of function; Set C admits two.

Why `FormData` is in Set A at all is worth one line, because it explains the shape rather than leaving it
arbitrary: *"When calling a Server Function in a form, React will supply the form's `FormData` as the first
argument to the Server Function."* The argument set has to admit the type React itself passes.

## 4. Designing a value for a direction

`H7`'s fix — check the direction first, then the value, and pass an identifier when the value cannot cross
— reads as one step but is three in practice.

1. **Name the direction.** Client-to-server is an argument (Set A). Server-to-client is a prop or a return
   value (Set C). A single value used in both directions is checked twice, against different sets.
2. **Check the value against that set, not against a merged notion of "serializable".** A merged list is
   wrong in both directions at once: it rejects JSX that is legal as a prop, and it admits `FormData` that
   is not documented as a return value.
3. **When it cannot cross, cross an identifier instead** and re-read on the other side. This is the
   general repair, and it is why the rule survives a set that changes: an identifier is a primitive in
   every direction.

The failure mode to recognize is spatial. A serialization defect surfaces where the value is transported
rather than where it was written, so the stack points at the boundary and not at the value's author — a
Server Function call *"will make a network request to the server that includes a serialized copy of any
arguments passed"*, and that request is where the type is judged. The cosmetic repair
to refuse is marking the module `'use client'` to make the error stop — that moves the boundary rather
than fixing the value, and `use-client`'s own caveat says what happens next: *"When a server evaluated
module imports values from a `'use client'` module, the values must either be a React component or
supported serializable prop values to be passed to a Client Component. Any other use case will throw an
exception."*

```jsx
// Legal in one direction, not the other — the same value, two answers.
// A Server Function may RETURN an element: return values follow the prop set.
async function renderBadge(userId) {
  'use server';
  const user = await loadUser(userId);
  return <Badge label={user.name} />;      // JSX out: supported
}

// Client side: the same element may NOT be passed IN as an argument.
// Cross an identifier and let the server produce the element.
async function onShowBadge(user) {
  await renderBadge(<Badge label={user.name} />);  // JSX in: not supported
  await renderBadge(user.id);                      // the repair
}
```

*Source for this example:* `use-client` lists *"Client or Server Component elements (JSX)"* among
serializable props, and `use-server` lists *"React elements, or JSX"* among the types **not** supported as
arguments; the two are connected by *"Supported serializable return values are the same as serializable
props for a boundary Client Component."* The example is those three sentences applied to one value.

## 5. The Actions family

Everything in this section exists because a Server Function is a network call with a pending state.

- **Server Functions run in a transition.** *"Server Functions should be called in a Transition. Server
  Functions passed to `<form action>` or `formAction` will automatically be called in a transition."* What
  a transition does — non-blocking, interruptible, and it deprioritizes rather than removes work — is
  [`rendering.md`](rendering.md) §8's; it is not repeated here.
- **`useActionState` carries the result across the call.** Its action *"receives the previous state
  (initially the `initialState` you provided, then its previous return value) as its first argument"*. Its
  optional `permalink` exists for progressive enhancement: *"If `reducerAction` is a Server Function and
  the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified
  permalink URL rather than the current page's URL"*, and *"ensure the same form component is rendered on
  the destination page (including the same `reducerAction` and `permalink`) so React knows how to pass the
  state through."*
- **`useFormStatus` reads a parent form, and only a parent form.** *"The `useFormStatus` Hook only returns
  status information for a parent `<form>` and not for any `<form>` rendered in the same component calling
  the Hook, or child components."* This is the constraint that produces the "`pending` is never true"
  report, and it is a placement rule, not a bug.

```jsx
// Wrong: the hook is called in the component that RENDERS the form, so there is
// no parent <form> above it and `pending` is never true.
function Form() {
  const { pending } = useFormStatus();
  return <form action={submit}><button disabled={pending}>Send</button></form>;
}

// Right: the hook is called in a child rendered INSIDE the form, so the form is
// its parent.
function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Send</button>;
}

function Form() {
  return <form action={submit}><Submit /></form>;
}
```

*Source for this example:* react.dev `useFormStatus`, Troubleshooting — *"`useFormStatus` will only return
status information for a parent `<form>`"*, and the Caveats sentence quoted above naming both excluded
cases. The two components are that sentence's two halves.

**The arguments are hostile input.** *"Arguments to Server Functions are fully client-controlled"*, and the
caveat is unconditional: *"Always treat arguments to Server Functions as untrusted input and authorize any
mutations."* This is `SKILL.md` Principle 6 in its React form — the boundary looks like a function call and
is a network hop, so validation and authorization belong on the server side of it, not at the caller.

## 6. Streaming server rendering and hydration

Server rendering and Server Components are two different things that arrive together. A Server Component
tree can *"then be server-side rendered (SSR) to create the initial HTML for the page"* — SSR turns
components into HTML; RSC is a separate environment that renders ahead of the client. Conflating them
makes the next paragraph unreadable.

The server APIs are split by what streams:

| Environment | API | Note |
|---|---|---|
| Node.js Streams | `renderToPipeableStream` | *"renders a React tree to a pipeable Node.js Stream"* |
| Web Streams — *"browsers, Deno, and some modern edge runtimes"* | `renderToReadableStream` | *"renders a React tree to a Readable Web Stream"* |
| Neither | `renderToString` | A legacy API for non-streaming environments, with *"limited functionality compared to the streaming APIs"* |

Hydration then attaches behavior to that HTML, under an exact contract: *"`hydrateRoot()` expects the
rendered content to be identical with the server-rendered content. You should treat mismatches as bugs and
fix them."* React *"warns about mismatches during hydration"* in development, and there are *"no guarantees
that attribute differences will be patched up in case of mismatches."* The stakes are named: *"React
recovers from some hydration errors, but you must fix them like other bugs. In the best case, they'll lead
to a slowdown; in the worst case, event handlers can get attached to the wrong elements."*

react.dev's own list of *"the most common causes leading to hydration errors"* is worth carrying exactly,
because it is shorter and more specific than the usual folklore: *"Extra whitespace (like newlines) around
the React-generated HTML inside the root node. Using checks like `typeof window !== 'undefined'` in your
rendering logic. Using browser-only APIs like `window.matchMedia` in your rendering logic. Rendering
different data on the server and the client."*

Two sanctioned escapes, and their limits:

- **Deliberately different content** gets a two-pass render rather than a suppression: read a state
  variable that an Effect sets, so *"the initial render pass will render the same content as the server,
  avoiding mismatches"*.
- **An unavoidable single-element difference** — react.dev's example is a timestamp — may carry
  `suppressHydrationWarning={true}`. Its scope is exactly one element: *"This only works one level deep,
  and is intended to be an escape hatch."*

## 7. Where the "server" actually is

`H17` says never assume a server tier exists. The refinement that keeps a reader from over-reading it is
that *"server"* names an environment, not a running host: *"This separate environment is the 'server' in
React Server Components."* That environment can be a build: *"Server components can run at build time to
read from the filesystem or fetch static content, so a web server is not required"*, and they *"can run
once at build time on your CI server, or they can be run for each request using a web server."*

What is never optional is an implementation. Server Components *"are not sent to the browser, so they
cannot use interactive APIs like `useState`"*, and the machinery that produces and transports them belongs
to a bundler or framework — which react.dev treats as a moving surface: *"While React Server Components in
React 19 are stable and will not break between minor versions, the underlying APIs used to implement a
React Server Components bundler or framework do not follow semver and may break between minors in React
19."*

So the P1 question is not "is there a server" but "does anything here implement RSC". A plain browser
application bundled without it has no target, however many servers the product has.

**UNVERIFIED — the framework-versus-React split.** Which capabilities around RSC are React's and which are
the framework's — routing, caching, revalidation, request deduplication, and the transport of the rendered
tree — is not stated as a division by any react.dev page, and the `server-components` page does not draw
it. This skill therefore does not assert one. Read the split from the framework's own documentation, and
treat any secondary summary of it as convention rather than a React-team position. The evidence class is
*framework documentation*, not react.dev.

## 8. The seam with client-side async work

The boundary and asynchrony overlap, so the division is stated once, here, by a criterion rather than a
list: **if deleting the server would delete the question, it belongs to this file.**

| Question | Owner | Why |
|---|---|---|
| Streaming SSR wiring and the hydration contract | this file | Cannot exist without a server producing markup |
| A promise crossing the RSC boundary as a serializable prop | this file | The boundary is the whole question |
| Pending state through `useActionState` and `useFormStatus` | this file | The Actions family is defined by the Server Function contract |
| What activates Suspense, and its reveal behavior | not this file | Identical in a client-only application with no server |
| `use(promise)` as a read primitive | not this file | A client-created promise reads the same way |
| Pending state through `useTransition` | not this file | No server is involved |
| Effect cleanup, stale-result guards, request cancellation | not this file | Identical in a Client Component, a browser application, and a desktop renderer |

The right-hand rows are governed today by `SKILL.md` `H5`, `H6`, and Principle 2; when a dedicated async
child exists it takes them, and the criterion above does not change. No fact appears in both places.

## 9. Sources and evidence classes

Every claim above is quoted from a source below or labelled where it is not. The pages were read on
2026-07-26 and every quoted sentence located in them on that date. `SKILL.md`'s References register owns
the rule-level citations; this table records what this doc read.

| Source | What it supports here |
|---|---|
| [`use server`](https://react.dev/reference/rsc/use-server) | §1 directive placement and caveats · §2 what `'use server'` marks and the mutation-not-fetch guidance · §3 Set A in full and the bridging sentence that defines Set B · §5 the transition rule, the `FormData` first argument, and the untrusted-argument caveat |
| [`use client`](https://react.dev/reference/rsc/use-client) | §1 placement, the derived Client/Server membership rule, and the client sub-tree · §3 Set C in full · §4 the exception thrown when a non-serializable value crosses |
| [Server Functions](https://react.dev/reference/rsc/server-functions) | §2 the September 2024 vocabulary change and the Server Action role |
| [Server Components](https://react.dev/reference/rsc/server-components) | §1 "there is no directive for Server Components" · §6 that a Server Component tree is then server-side rendered · §7 the separate environment, build-time execution, no interactive APIs, and the semver caveat on bundler and framework APIs |
| [`useActionState`](https://react.dev/reference/react/useActionState) | §5 the previous-state argument and the `permalink` progressive-enhancement behavior |
| [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus) | §5 the parent-form-only constraint and the "`pending` is never true" case |
| [React DOM server APIs](https://react.dev/reference/react-dom/server) | §6 the Node.js Streams, Web Streams, and legacy non-streaming API split |
| [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) | §6 the identical-content contract, the recovery and event-handler stakes, the cause list, the two-pass pattern, and `suppressHydrationWarning`'s one-level-deep scope |

**Not primary-sourced, and not asserted:** the framework-versus-React capability split in §7. It is carried
as an open item with its evidence class named — framework documentation — rather than stated as fact.
