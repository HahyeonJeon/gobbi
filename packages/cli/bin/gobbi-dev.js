#!/usr/bin/env bun

import { run } from '../dist/cli.js';

run().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
