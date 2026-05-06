import { promises as fs } from 'node:fs';
await fs.mkdir('dist', { recursive: true });
await fs.writeFile('dist/README.txt', 'protobridge-php uses source files directly; build verifies the dist directory exists.\n');
await fs.chmod('bin/protobridge-php.js', 0o755);
console.log('build ok');
