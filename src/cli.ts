import { parseArgs } from 'node:util';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const USAGE = `Usage: gobbi <command> [options]

Commands:
  docs       Manage gobbi-docs JSON templates and Markdown
  image      Analyze images or create comparison sheets
  video      Analyze video files and extract frames
  web        Take screenshots or capture images from web pages

Options:
  --help              Show this help message
  --version           Show version number`;

export async function run(): Promise<void> {
  const command = process.argv[2];

  // Early routing for commands (they have their own parseArgs)
  if (command === 'docs' || command === 'image' || command === 'video' || command === 'web') {
    const commandArgs = process.argv.slice(3);
    switch (command) {
      case 'docs': {
        const { runDocs } = await import('./commands/docs.js');
        await runDocs(commandArgs);
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
