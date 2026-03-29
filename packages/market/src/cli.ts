import { parseArgs } from 'node:util';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const USAGE = `Usage: gobbi-market <command> [options]

Commands:
  install <package>    Install a gobbi package from npm
  uninstall <package>  Remove an installed gobbi package
  search <query>       Search npm for gobbi packages
  list                 List installed gobbi packages

Options:
  --help               Show this help message
  --version            Show version number`;

export async function run(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
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
  const targetDir = process.cwd();

  switch (command) {
    case 'install': {
      const packageName = positionals[1];
      if (!packageName) {
        console.error('Error: package name is required.\n');
        console.log('Usage: gobbi-market install <package>');
        process.exit(1);
      }
      const { runInstall } = await import('./commands/install.js');
      await runInstall(targetDir, packageName);
      break;
    }
    case 'uninstall': {
      const packageName = positionals[1];
      if (!packageName) {
        console.error('Error: package name is required.\n');
        console.log('Usage: gobbi-market uninstall <package>');
        process.exit(1);
      }
      const { runUninstall } = await import('./commands/uninstall.js');
      await runUninstall(targetDir, packageName);
      break;
    }
    case 'search': {
      const query = positionals[1];
      if (!query) {
        console.error('Error: search query is required.\n');
        console.log('Usage: gobbi-market search <query>');
        process.exit(1);
      }
      const { runSearch } = await import('./commands/search.js');
      await runSearch(query);
      break;
    }
    case 'list': {
      const { runList } = await import('./commands/list.js');
      await runList(targetDir);
      break;
    }
    default:
      console.log(USAGE);
      process.exit(command ? 1 : 0);
  }
}
