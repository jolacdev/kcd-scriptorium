import { existsSync, readFileSync, renameSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const version = packageJson.version;
const dist = 'dist';

const files = [
  { from: `${dist}/scriptorium.cjs`, to: `${dist}/scriptorium-${version}.cjs` },
  { from: `${dist}/scriptorium.exe`, to: `${dist}/scriptorium-${version}.exe` },
];

for (const { from, to } of files) {
  if (existsSync(from)) {
    renameSync(from, to);
  }
}
