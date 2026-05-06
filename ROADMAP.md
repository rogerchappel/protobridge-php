# Roadmap

## V1: local compatibility scout

- Deterministic fallback snapshots for PHP protobuf shapes.
- Fixture-first workflow for reviewers and agents.
- Text and JSON reports.
- Clear safety boundaries and reproducible local setup.

## V1.1: richer proto coverage

- `oneof`, maps, reserved ranges, nested types, imports.
- Better descriptor diagnostics for unsupported syntax.
- More bundled fixtures.

## V2: explicit generator adapters

- Optional `protoc` invocation when the user supplies a command.
- Plugin discovery with no PATH mutation.
- Snapshot provenance that records exact binaries and hashes.
