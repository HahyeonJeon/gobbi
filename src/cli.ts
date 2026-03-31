import { parseArgs } from 'node:util';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const USAGE = `Usage: gobbi <command> [options]

Commands:
  install    Install gobbi into the current project
  update     Update gobbi core to the latest version
  create     Create a new skill, agent, or hook

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
  const cwd = process.cwd();
  const nonInteractive = values['non-interactive'] ?? false;

  switch (command) {
    case 'install': {
      const { runInstall } = await import('./commands/install.js');
      await runInstall(cwd, { nonInteractive });
      break;
    }
    case 'update': {
      const { runUpdate } = await import('./commands/update.js');
      await runUpdate(cwd, { nonInteractive });
      break;
    }
    case 'create': {
      const { runCreate } = await import('./commands/create.js');
      const createOpts: { nonInteractive: boolean; type?: string; name?: string } = { nonInteractive };
      const typeArg = positionals[1];
      const nameArg = positionals[2];
      if (typeArg !== undefined) createOpts.type = typeArg;
      if (nameArg !== undefined) createOpts.name = nameArg;
      await runCreate(cwd, createOpts);
      break;
    }
    default:
      console.log(USAGE);
      process.exit(command ? 1 : 0);
  }
}
