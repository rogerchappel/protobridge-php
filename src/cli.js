import { inspectProject } from './runner.js';
import { readJson } from './files.js';
import { compareSnapshots } from './snapshots.js';
import { renderJsonReport } from './reports.js';

const HELP = `protobridge-php\n\nUsage:\n  protobridge-php inspect <proto-file-or-dir> [--baseline file] [--format text|json] [--output file]\n  protobridge-php compare <actual.json> <expected.json> [--format json]\n  protobridge-php --help\n\nOptions:\n  --protoc <version>       Actual protoc version label\n  --php-plugin <version>   Actual PHP plugin version label\n  --php-runtime <version>  Actual PHP runtime version label\n`;

export async function runCli(argv) {
  const [command, ...rest] = argv;
  if (!command || command === '--help' || command === '-h') {
    process.stdout.write(HELP);
    return;
  }
  if (command === 'inspect') return runInspect(rest);
  if (command === 'compare') return runCompare(rest);
  throw new Error(`Unknown command: ${command}\n\n${HELP}`);
}

async function runInspect(args) {
  const input = args.shift();
  if (!input) throw new Error('inspect requires a proto file or directory');
  const options = parseOptions(args);
  const { output } = await inspectProject({ input, ...options });
  if (!options.output) process.stdout.write(output);
}

async function runCompare(args) {
  const [actualPath, expectedPath, ...tail] = args;
  if (!actualPath || !expectedPath) throw new Error('compare requires actual and expected snapshot JSON files');
  parseOptions(tail);
  const comparison = compareSnapshots(await readJson(actualPath), await readJson(expectedPath));
  process.stdout.write(renderJsonReport(comparison));
  if (!comparison.ok) process.exitCode = 2;
}

function parseOptions(args) {
  const options = { format: 'text', profile: {} };
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    const value = args[i + 1];
    if (key === '--format') { options.format = value; i += 1; continue; }
    if (key === '--baseline') { options.baseline = value; i += 1; continue; }
    if (key === '--output') { options.output = value; i += 1; continue; }
    if (key === '--protoc') { options.profile.protoc = value; i += 1; continue; }
    if (key === '--php-plugin') { options.profile.phpPlugin = value; i += 1; continue; }
    if (key === '--php-runtime') { options.profile.phpRuntime = value; i += 1; continue; }
    throw new Error(`Unknown option: ${key}`);
  }
  if (!['text', 'json'].includes(options.format)) throw new Error('--format must be text or json');
  return options;
}
