# RabbitLock Runtime implementation plan

Effective: 2026-09-27. Source-review evidence below retains its original review date, 2026-09-24. Status: planned integration work, not a completed release. Governed by [product strategy](product-strategy.md). Owner: component maintainer; cross-product authorization changes also require review by the Databridle security owner. These are accountable roles, not assumed hires.

## Authority ecosystem alignment — 2026-09-27

PrismWorks builds authority infrastructure for autonomous AI. Databridle's first commercial package is delegated financial operations in existing ERP/payment environments. Its core object is a business mandate with authenticated delegation rights, trusted purpose/business objects, attenuated child grants, shared limits, expiry and revocation. Engineering/IT and security response expand the same core after the initial package is repeatable. This direction supersedes engineering-first or security-platform positioning in earlier planning.

**RabbitLock Runtime's boundary:** Narrow credential materialization/executor helper within RabbitLock; no separate policy engine or business mandate store.

**Required implementation change:** Consume authenticated exact-action delivery requests; isolate credentials from agent prompts, child inheritance and logs. Test changed executor/audience, expired grant and stale authority revision. Do not claim TTL revokes plaintext already delivered.

Carry mandate/root/parent/grant and current-authority revision through a versioned adapter, with exact request digest and reservation reference when applicable. Databridle's runtime Authority Graph and transactional reservation ledger are authoritative; no accelerator keeps a competing writable copy. Workflow/evidence dependencies do not grant authority. Child grants cannot multiply aggregate limits or silently combine permissions.

**Acceptance before claiming integration:** issuer has the right to delegate; changed beneficiary/resource/request rejected; cross-tenant references rejected; concurrent descendants cannot overrun a shared root limit; accepted-but-timed-out writes remain unknown and reserved until reconciled; revoked/stale authority cannot authorize the next protected use. Apply each check at the component's advertised boundary and use explicit substitution fixtures for responsibilities owned elsewhere. No real financial transaction is required.

**Scope removed or deferred:** independent enterprise authority platform, graph administration/federation ahead of runtime correctness, and any mandatory all-accelerator installation. Preserve existing useful behavior, licenses, ownership and independent use. These are planned adapter requirements, not a claim of deployed capabilities. Existing remediation and migration checks below remain prerequisites.

## Baseline

2 existing runtime tests passed (Node CLI round trip and Python shim). This establishes local compatibility only. Existing code and user changes are preserved. New checks below are required acceptance work, not claims that those checks already pass.

## Ordered backlog

| ID | Priority | Change | Deliverable | Dependency | Acceptance evidence |
| --- | --- | --- | --- | --- | --- |
| RLR-01 | P0 | Modify | Document existing exposure/compatibility and inventory both source copies. | RabbitLock maintainer decision. | All current flags, Python calls and artifact formats have migration fixtures. |
| RLR-02 | P1 | Add | Build executor-only delivery and explicit protected/offline modes. | RabbitLock real materialization + G1. | No eval, no unintended child inheritance, bounded temp-file permissions/cleanup and denial when authority is missing. |
| RLR-03 | P1 | Modify / remove | Publish from one versioned source and replace duplicate source with wrapper. | Parity and downstream upgrade verification. | Reproducible package; existing consumers work; rollback documented. |
| RLR-04 | P2 | Add | Provider-specific short-lived credentials. | Actual provider support. | Expiry/revocation measured; no claim of revoking copied static plaintext. |

P0 establishes correctness and scope; P1 completes a supported integration; P2 is conditional expansion. Work may run concurrently once interface dependencies are agreed. No calendar duration or production availability is implied.

## Contract acceptance

- Pin supported component, profile and transport versions; reject unsupported security semantics.
- Verify tenant/principal/resource binding, changed arguments, expiry, replay, revocation, retries and missing context on every advertised protected path.
- Keep authorization verdict, execution result and independent verification distinct; interrupted or unobserved effects remain unknown.
- Keep credentials out of prompts/logs/general memory; test redaction and controlled evidence access.
- Demonstrate independent use and supported replacement components; fail closed in protected mode when required controls are unavailable.

## Migration and removal

Before executable code removal, inventory consumers and stored data; add replacement/version migration and compatibility tests; communicate deprecation; ship export/restore and rollback instructions. Do not delete historical evidence, encrypted secrets or user data as documentation cleanup. No published package/API identifier or license changes without a separate compatibility and ownership decision.

## Release definition

Record exact commit/version, supported paths, test commands/results, known limits, installer/upgrade steps and accountable maintainer. Mock tests and schema checks are not production security evidence. Update README and compatibility documentation from the passing report, not from planned checkboxes. No universal integrated/production-ready claim until the relevant execution path passes the complete acceptance matrix.

## Dependency gate reference

G1 freezes proposed profile 0.2 and mandate/grant/reservation fixtures. G2 implements the mandate, shared-limit, execution/reconciliation and revocation path. G3 connects an existing financial host; VybeCode is optional engineering expansion. G4 validates RabbitLock credential delivery. G5 proves interoperability and replacement hosts/providers. G6 packages a supported release. References to these gates are dependencies, not claims of completion; standalone open-source use remains independent.
