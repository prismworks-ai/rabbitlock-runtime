# @rabbitlock/runtime

Minimal RabbitLock runtime helpers for decrypting `env.sops.json` into runtime env vars.

## Install

```bash
npm install @rabbitlock/runtime
```

## Usage

```bash
export RABBITLOCK_SEED_HEX=...
rabbitlock-env --in env.sops.json --export
```

```bash
rabbitlock-env --in env.sops.json --json
```

```bash
rabbitlock-env --in env.sops.json --write-env .env
```

## Python helper

```python
from rabbitlock_env import load_env_dict, load_env_into_os

env = load_env_dict(seed_hex="...", sops_path="env.sops.json")
load_env_into_os(seed_hex="...", sops_path="env.sops.json")
```

## Notes

- This package bundles the Wasm crypto artifacts in `pkg/`.
- The CLI reads the SOPS file from the current working directory unless `--in` is provided.
