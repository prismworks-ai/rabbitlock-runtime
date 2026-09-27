# RabbitLock Runtime product strategy

Effective: 2026-09-24. Active direction for new work. Implementation is tracked in the [plan](implementation-plan.md); proposed additions are not shipped features.

## Purpose and boundary

**A small headless credential-materialization helper, maintained as part of RabbitLock.**

Own bounded runtime process/file/environment delivery. RabbitLock owns credential lifecycle; Databridle owns protected action authorization. Retain a documented offline legacy mode without representing it as a revocable agent credential system.

## Current repository evidence

Review of the local working tree, including pre-existing changes; source presence is not deployment evidence.

| Source | Observation |
| --- | --- |
| [rabbitlock-env.mjs](../rabbitlock-env.mjs) | Node CLI reads a long-lived seed and supports JSON, shell export and plaintext-file output. |
| [rabbitlock_env.py](../rabbitlock_env.py) | Python shim shells out to the Node helper. |
| [runtime.test.mjs](../runtime.test.mjs) | Existing round-trip tests cover Node output and Python loading. |
| [package.json](../package.json) | Package @rabbitlock/runtime is version 0.1.4; bundled WASM is included. |

Verification this review: 2 existing runtime tests passed (Node CLI round trip and Python shim). This establishes local compatibility only.

## Retain

Retain working behavior, user data, existing integrations, tests, licensing and independent use within the boundary above. Maintain existing support obligations. Preserve local changes from other work; this review does not release or deploy code.

## Remove or defer

- Remove shell eval and plaintext-file creation as the recommended protected-agent integration. Preserve old flags during deprecation with explicit exposure notes.
- Remove independent roadmap/pricing ambitions and duplicate hand-maintained copies in RabbitLock after migration.

## Modify

- Select this repository as the target runtime package source; RabbitLock/runtime becomes a compatibility wrapper or generated consumer after parity checks, not an immediate deletion.
- Accept only executor-scoped delivery requests in protected mode; keep offline seed-based use separately labelled and isolated.
- Minimize inherited environment, temporary files and stdout exposure; validate paths and child-process arguments.

## Add

- A child-process execution API that injects only approved credentials without shell eval or model-visible plaintext.
- Versioned RabbitLock provider adapter, cleanup/restart behavior and effective expiry/revocation reporting.
- Release parity fixtures across Node/Python and caller migration instructions.

## Integration rules

This is the target integration design, not a claim of an existing Databridle adapter. Components communicate through versioned contracts and keep independent storage. No shared database, forced cloud account or mandatory all-product installation.

The host proposes work; Databridle decides protected enterprise actions; the credential provider enforces its own access conditions; the executor performs only the bound action. Local restrictions can deny but cannot widen an enterprise grant. Human software acceptance and credential approval remain distinct from exact-action security approval.

Carry tenant/principal/delegation/task/run/action identifiers, policy revision, exact request digest, expiry and decision/receipt references through authenticated adapters. Treat client-supplied identity and trace fields as untrusted until bound by the trusted host. Keep secrets and raw sensitive payloads out of default logs, prompts and project memory. Distinguish allow/deny from executed/failed/unknown and from independent verification.

Protected mode stops on missing authority or unavailable required controls; it cannot silently invoke an unprotected path. Retries need idempotency or reconciliation. Revocation of future access does not undo completed work or erase credentials already delivered. Record actual transport, version and bypass coverage before describing an integration as supported.

## Investment and success

Prioritize a supported, reusable protected workflow over feature breadth. Measure integration effort, correctly completed work, denied unauthorized operations, evidence completeness and ongoing maintenance. This component's role does not create a new license, transfer IP or approve a pricing/partnership claim.
