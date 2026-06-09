# protobridge-php

A small, sharp compatibility scout for PHP protobuf generation. It checks fixture `.proto` schemas against deterministic PHP-shape snapshots so you can catch generator drift before it lands in an SDK or agent workflow.

It is deliberately boring in the best way: local files in, clear report out, no hidden network calls.

## Install

```bash
npm install
npm run build
```

Run from source during development:

```bash
node bin/protobridge-php.js --help
```

## Quickstart

```bash
node bin/protobridge-php.js inspect fixtures/basic \
  --baseline fixtures/basic/snapshots/php-8.2.json \
  --protoc 25.3.0 \
  --php-plugin 1.0.0 \
  --php-runtime 4.30.0
```

JSON for agents:

```bash
node bin/protobridge-php.js inspect fixtures/basic --format json --output report.json
```

Compare two snapshots directly:

```bash
node bin/protobridge-php.js compare actual.json expected.json
```

## What V1 does

- Recursively reads local `.proto` files.
- Parses package, PHP namespace, messages, fields, enums, and services.
- Builds a deterministic descriptor and PHP class/field shape.
- Compares that shape to a stored snapshot.
- Reports protobuf/PHP plugin/runtime version mismatches.
- Runs without invoking `protoc`, contacting the network, or needing credentials.

## Why not call protoc yet?

Real generator adapters are useful, but V1 optimizes for reproducibility. The deterministic fallback lets maintainers review fixture changes anywhere, including CI and agent sandboxes. Future adapters should be explicit opt-ins.

## Safety

`protobridge-php` is local-first:

- no telemetry
- no publish step
- no credential reads
- no network calls
- writes only when `--output` is provided

## Examples

Fixture: `fixtures/basic`

Golden snapshot: `fixtures/basic/snapshots/php-8.2.json`

Expected compatible report begins with:

```text
protobridge-php: compatible
```

## Contributing

Keep changes small and fixture-backed. If parser behavior changes, refresh snapshots intentionally and explain the compatibility impact in the commit or PR.

Run before submitting:

```bash
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
npm run release:check
bash scripts/validate.sh
```

## Attribution

This project is a fresh local-first OSS concept inspired by the existence of PHP protobuf generator work such as `protoc-gen-php` forks. It does not copy their implementation.

## License

MIT
