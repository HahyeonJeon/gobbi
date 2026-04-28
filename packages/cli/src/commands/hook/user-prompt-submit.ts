/**
 * gobbi hook user-prompt-submit — UserPromptSubmit hook entrypoint (stub for PR-FIN-1b).
 *
 * Body lives in `_stub.ts`. PR-FIN-1d adds notify dispatch.
 */

import { runGenericHookStub } from './_stub.js';

export const runHookUserPromptSubmit = (args: string[]): Promise<void> =>
  runGenericHookStub('UserPromptSubmit', args);
