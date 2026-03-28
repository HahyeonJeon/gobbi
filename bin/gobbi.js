#!/usr/bin/env node

import { run } from '../src/cli.js';

run().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
