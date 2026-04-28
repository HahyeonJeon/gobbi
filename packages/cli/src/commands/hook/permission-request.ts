/**
 * gobbi hook permission-request — PermissionRequest hook entrypoint (stub for PR-FIN-1b).
 *
 * Body lives in `_stub.ts`. PR-FIN-1d adds notify dispatch.
 */

import { runGenericHookStub } from './_stub.js';

export const runHookPermissionRequest = (args: string[]): Promise<void> =>
  runGenericHookStub('PermissionRequest');
