#!/usr/bin/env node
import { readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const LOG_PREFIX = '[Icons] -';
const ICONS_DIR = 'public/assets/icons';
const OUT_DIR = 'src/components/icons';
const SVGR_FLAGS = '--typescript --ref --no-prettier --no-index';

const toPascalCase = (filename) =>
  filename
    .replace(/\.svg$/, '')
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const missing = readdirSync(ICONS_DIR)
  .filter((f) => f.endsWith('.svg'))
  .filter((svg) => {
    const componentFile = `${toPascalCase(svg)}.tsx`;
    return !existsSync(join(OUT_DIR, componentFile));
  });

if (missing.length === 0) {
  console.log(`${LOG_PREFIX} All icons are up to date.`);
  process.exit(0);
}

console.log(`${LOG_PREFIX} Found ${missing.length} missing icon${missing.length > 1 ? 's' : ''}`);

for (const svg of missing) {
  console.log(`${LOG_PREFIX} Building "${svg}"...`);
  execSync(`svgr --out-dir ${OUT_DIR} ${SVGR_FLAGS} -- ${join(ICONS_DIR, svg)}`, { stdio: 'inherit' });
}

console.log(`${LOG_PREFIX} Icons built and synchronized.`);
