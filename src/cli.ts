import { parseArgs } from 'node:util';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const USAGE = `Usage: gobbi <command> [options]

Commands:
  docs       Manage gobbi-docs JSON templates and Markdown
  config     Manage per-session workflow configuration
  session    Session environment setup (metadata, env loading)
  notify     Send notifications (Slack, Telegram, Desktop)
  note       Workflow note management and transcript extraction
  validate   Validate agent, skill, gotcha, and lint definitions
  audit      Detect documentation drift and stale references
  image      Analyze images or create comparison sheets
  video      Analyze video files and extract frames
  web        Take screenshots or capture images from web pages

Options:
  --help              Show this help message
  --version           Show version number`;

export async function run(): Promise<void> {
  const command = process.argv[2];

  // Early routing for commands (they have their own parseArgs)
  const COMMANDS = ['docs', 'config', 'session', 'notify', 'note', 'validate', 'audit', 'image', 'video', 'web'] as const;
  if (command !== undefined && (COMMANDS as readonly string[]).includes(command)) {
    const commandArgs = process.argv.slice(3);
    switch (command) {
      case 'docs': {
        const { runDocs } = await import('./commands/docs.js');
        await runDocs(commandArgs);
        return;
      }
      case 'config': {
        const { runConfig } = await import('./commands/config.js');
        await runConfig(commandArgs);
        return;
      }
      case 'session': {
        const { runSession } = await import('./commands/session.js');
        await runSession(commandArgs);
        return;
      }
      case 'notify': {
        const { runNotify } = await import('./commands/notify.js');
        await runNotify(commandArgs);
        return;
      }
      case 'note': {
        const { runNote } = await import('./commands/note.js');
        await runNote(commandArgs);
        return;
      }
      case 'validate': {
        const { runValidate } = await import('./commands/validate.js');
        await runValidate(commandArgs);
        return;
      }
      case 'audit': {
        const { runAudit } = await import('./commands/audit.js');
        await runAudit(commandArgs);
        return;
      }
      case 'image': {
        const { runImage } = await import('./commands/image.js');
        await runImage(commandArgs);
        return;
      }
      case 'video': {
        const { runVideo } = await import('./commands/video.js');
        await runVideo(commandArgs);
        return;
      }
      case 'web': {
        const { runWeb } = await import('./commands/web.js');
        await runWeb(commandArgs);
        return;
      }
    }
  }

  // Global flags
  const { values } = parseArgs({
    allowPositionals: true,
    options: {
      'help': { type: 'boolean', default: false },
      'version': { type: 'boolean', default: false },
    },
  });

  if (values.version) {
    const pkgPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { version: string };
    console.log(pkg.version);
    process.exit(0);
  }

  // --help or no command: show usage and exit 0
  // Unknown command: show usage and exit 1
  console.log(USAGE);
  process.exit(values.help || !command ? 0 : 1);
}
