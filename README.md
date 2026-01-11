# @rabbitlock/runtime

Minimal RabbitLock runtime helpers for decrypting `env.sops.json` into runtime
environment variables.

## Why this exists

Teams want Git-native secrets without a central vault. SOPS lets you keep
encrypted secrets in the repo, but you still need a safe way to decrypt them at
runtime without writing plaintext to disk. This package provides that last
step, using the same RabbitLock identity seed that encrypted the SOPS file.

## Why SOPS

- Git-native: encrypted files live with your code.
- Auditable: diffs show which keys changed without exposing values.
- No vault lock-in: any environment can decrypt with the right key.
- Works offline: decryption happens locally.

## How RabbitLock (UI) fits

Use the RabbitLock web app to manage `env.sops.json`:

1. Open the SOPS tab and import `.env` or an existing SOPS file.
2. Decrypt, edit, and re-encrypt in the browser.
3. Download the updated `env.sops.json` and commit it to your repo.
4. Store `RABBITLOCK_SEED_HEX` in your secrets manager for runtime use.

The runtime CLI in this package uses that same seed to decrypt the file in your
app environment.

## Install

```bash
npm install @rabbitlock/runtime
```

Requires Node.js.

## Usage (CLI)

```bash
export RABBITLOCK_SEED_HEX=...
set -a
eval "$(npx rabbitlock-env --in env.sops.json --export)"
set +a
```

```bash
npx rabbitlock-env --in env.sops.json --json
```

```bash
npx rabbitlock-env --in env.sops.json --write-env .env
```

## Usage (Python helper)

```python
from rabbitlock_env import load_env_dict, load_env_into_os

env = load_env_dict(seed_hex="...", sops_path="env.sops.json")
load_env_into_os(seed_hex="...", sops_path="env.sops.json")
```

Note: the Python helper shells out to Node.js.

## Using in apps

Shell or Node startup:

```bash
export RABBITLOCK_SEED_HEX=...
set -a
eval "$(npx rabbitlock-env --in env.sops.json --export)"
set +a
node server.js
```

Python app startup:

```bash
export RABBITLOCK_SEED_HEX=...
PYTHONPATH=node_modules/@rabbitlock/runtime python app.py
```

Inside `app.py`:

```python
from rabbitlock_env import load_env_into_os

load_env_into_os(seed_hex="...", sops_path="env.sops.json")
```

## Security notes

- Keep `RABBITLOCK_SEED_HEX` in a secrets manager, never in Git.
- Prefer the `--export` + `eval` flow to avoid writing plaintext to disk.
- Use `--write-env` only for local debugging.

## Notes

- This package bundles the Wasm crypto artifacts in `pkg/`.
- The CLI reads the SOPS file from the current working directory unless `--in`
  is provided.
