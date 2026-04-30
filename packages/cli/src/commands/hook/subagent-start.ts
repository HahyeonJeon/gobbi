/**
 * gobbi hook subagent-start — SubagentStart hook entrypoint (stub for PR-FIN-1b).
 *
 * Body lives in `_stub.ts`. PR-FIN-1d adds notify dispatch.
 *
 * NOTE (PR-FIN-2a-ii T-2a.8.0): SubagentStart is NO LONGER the
 * `delegation.spawn` emission site. Per `v050-hooks.md:59` and ideation
 * lock 26, the canonical emitter lives in the PreToolUse guard at
 * `commands/workflow/guard.ts::maybeEmitDelegationSpawn`. PreToolUse
 * carries the `tool_use_id` / `tool_call_id` and the orchestrator-level
 * `tool_input.subagent_type`, both of which SubagentStart lacks. The file
 * stays in place because SubagentStart remains a registered hook event
 * (notify dispatch is wired through the generic stub), but it does not
 * write workflow events.
 */

import { runGenericHookStub } from './_stub.js';

export const runHookSubagentStart = (args: string[]): Promise<void> =>
  runGenericHookStub('SubagentStart', args);
