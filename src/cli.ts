import { parseArgs } from 'node:util';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const USAGE = `Usage: gobbi <command> [options]

Commands:
  init     Install gobbi into the current project
  update   Update gobbi to the latest version

Options:
  --help              Show this help message
  --version           Show version number
  --non-interactive   Skip all prompts, use safe defaults`;

export async function run(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'non-interactive': { type: 'boolean', default: false },
      'help': { type: 'boolean', default: false },
      'version': { type: 'boolean', default: false },
    },
  });

  if (values.help) {
    console.log(USAGE);
    process.exit(0);
  }

  if (values.version) {
    const pkgPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { version: string };
    console.log(pkg.version);
    process.exit(0);
  }

  const command = positionals[0];
  const nonInteractive = values['non-interactive'] ?? false;

  switch (command) {
    case 'init': {
      const { runInit } = await import('./commands/init.js');
      await runInit(process.cwd(), { nonInteractive });
      break;
    }
    case 'update': {
      const { runUpdate } = await import('./commands/update.js');
      await runUpdate(process.cwd(), { nonInteractive });
      break;
    }
    default:
      console.log(USAGE);
      process.exit(command ? 1 : 0);
  }
}
