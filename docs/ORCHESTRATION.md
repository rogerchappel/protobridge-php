# Orchestration

`protobridge-php` is intentionally local-first. The CLI never calls the network and never writes outside user-provided output paths.

## Agent workflow
1. Run `npm run build` to prepare the executable shim.
2. Run `protobridge-php inspect fixtures/basic --baseline fixtures/basic/snapshots/php-8.2.json`.
3. Read the compatibility score, mismatches, and version report.
4. If the report is clean, commit generated snapshots with fixture changes.

## Safety boundaries
- Inputs are `.proto`, `.json`, and optional manifest files on disk.
- Output is text/JSON written to stdout unless `--output` is supplied.
- External generation is modelled by deterministic descriptors in V1; real generator adapters are future work and must be explicit.
