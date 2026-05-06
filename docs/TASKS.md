# protobridge-php task plan

## MVP build
- [x] Preserve the PRD at `docs/PRD.md`.
- [x] Scaffold an OSS CLI package with local-only behavior.
- [x] Add fixture proto schemas and expected PHP-generation snapshots.
- [x] Parse proto files into deterministic descriptors.
- [x] Compare generated/snapshot outputs across PHP generator profiles.
- [x] Report protoc/plugin version mismatches and compatibility warnings.
- [x] Provide JSON and text reports for agents and humans.
- [x] Add tests, smoke scripts, validation, and reproducible docs.

## Follow-ups
- [ ] Add adapters for invoking real `protoc` and PHP plugins when present.
- [ ] Expand fixtures for maps, oneofs, services, and reserved ranges.
- [ ] Publish an npm package after external users validate the V1 workflow.
