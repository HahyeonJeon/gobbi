/**
 * gobbi hook session-end — SessionEnd hook entrypoint (stub for PR-FIN-1b).
 *
 * Body lives in `_stub.ts` so all 23 generic stubs share one
 * implementation. PR-FIN-1d will replace this with a per-event body
 * once notify dispatch lands.
 */

import { runGenericHookStub } from './_stub.js';

export const runHookSessionEnd = (args: string[]): Promise<void> =>
  runGenericHookStub('SessionEnd');
