import { existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outputDirectory = 'dist/client';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const frameworkDirectory = join(
  outputDirectory,
  basePath.replace(/^\/+/, ''),
  '_next',
);
const pagesAssetDirectory = join(outputDirectory, 'assets');

if (!existsSync(frameworkDirectory)) {
  throw new Error(`Missing framework assets at ${frameworkDirectory}`);
}

rmSync(pagesAssetDirectory, { force: true, recursive: true });
renameSync(frameworkDirectory, pagesAssetDirectory);

const replacements = [
  [`${basePath}/_next/`, `${basePath}/assets/`],
  ['/_next/', '/assets/'],
];

for (const file of walk(outputDirectory)) {
  if (!/\.(css|html|js|json|rsc|txt)$/.test(file) && !file.endsWith('_headers')) continue;
  const source = readFileSync(file, 'utf8');
  const updated = replacements.reduce(
    (text, [from, to]) => text.replaceAll(from, to),
    source,
  );
  if (updated !== source) writeFileSync(file, updated);
}

function* walk(directory) {
  for (const entry of readdirSync(directory)) {
    const file = join(directory, entry);
    if (statSync(file).isDirectory()) yield* walk(file);
    else yield file;
  }
}
