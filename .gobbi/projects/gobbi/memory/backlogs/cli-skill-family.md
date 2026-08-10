# CLI skill family backlog

## Automatic pager management

**Backlogged at:** 2026-08-09T10:08:42Z

**What:** Add automatic pager selection, invocation, lifecycle, failure, and recovery contracts for eligible
line-oriented CLI output.

**Why backlogged:** The accepted family keeps paging outside its line-oriented rendering contract because a
pager adds a child-process, terminal, input, signal, cancellation, and recovery lifecycle.

**Context:** The current [CLI skill family design](../design/feature/cli-skill-family.md) assigns stable streams
and `human`, `plain`, `json`, and `jsonl` profiles without built-in paging. Pager support needs an independent
product boundary that preserves machine output, redirection, non-interactive use, user choice, and recovery.

## Full-screen TUI support

**Backlogged at:** 2026-08-09T10:08:42Z

**What:** Add product contracts for full-screen terminal user interfaces used by TypeScript CLI products.

**Why backlogged:** Full-screen interfaces require a materially different model for screen state, focus,
keyboard and mouse input, raw mode, resize, interruption, restoration, and accessibility.

**Context:** The current [CLI skill family design](../design/feature/cli-skill-family.md) is intentionally
line-oriented. A future TUI outcome must define terminal ownership, alternate-screen behavior, focus and input
semantics, assistive-technology behavior, failure restoration, platform facts, security boundaries, testing,
and release evidence without weakening the current line-oriented contracts.
