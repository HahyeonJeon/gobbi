/**
 * gobbi hook worktree-create — WorktreeCreate hook entrypoint (stub for PR-FIN-1b).
 *
 * Body lives in `_stub.ts`. PR-FIN-1d adds notify dispatch.
 */

import { runGenericHookStub } from './_stub.js';

export const runHookWorktreeCreate = (args: string[]): Promise<void> =>
  runGenericHookStub('WorktreeCreate');
