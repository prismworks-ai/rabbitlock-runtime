"""
Lightweight Python shim for RabbitLock SOPS runtime.

Requires Node available to execute `rabbitlock-env.mjs` (uses bundled Wasm).

Usage:
    from rabbitlock_env import load_env_dict, load_env_into_os

    env_dict = load_env_dict(seed_hex="...", sops_path="env.sops.json")
    load_env_into_os(seed_hex="...", sops_path="env.sops.json")
"""

from __future__ import annotations

import json
import os
import subprocess
from pathlib import Path
from typing import Any, Dict

ROOT = Path(__file__).resolve().parent
NODE_CLI = ROOT / "rabbitlock-env.mjs"


def _flatten_env(
    value: Any, prefix: str = "", acc: Dict[str, str] | None = None
) -> Dict[str, str]:
    if acc is None:
        acc = {}
    if isinstance(value, dict):
        for k, v in value.items():
            _flatten_env(v, f"{prefix}_{k}" if prefix else k, acc)
    elif isinstance(value, list):
        for idx, v in enumerate(value):
            _flatten_env(v, f"{prefix}_{idx}", acc)
    else:
        key = prefix.upper()
        acc[key] = value if isinstance(value, str) else json.dumps(value)
    return acc


def _run_node(seed_hex: str, sops_path: str) -> Dict[str, Any]:
    cmd = [
        "node",
        str(NODE_CLI),
        "--seed",
        seed_hex,
        "--in",
        sops_path,
        "--json",
    ]
    result = subprocess.run(
        cmd, check=True, text=True, capture_output=True, cwd=os.getcwd()
    )
    return json.loads(result.stdout)


def load_env_dict(
    seed_hex: str | None = None, sops_path: str | None = None
) -> Dict[str, str]:
    """Return a flat dict of env-style key/value pairs from a SOPS file."""
    seed = seed_hex or os.environ.get("RABBITLOCK_SEED_HEX")
    if not seed:
        raise ValueError("Provide seed_hex or set RABBITLOCK_SEED_HEX")
    path = sops_path or os.environ.get("RABBITLOCK_SOPS_PATH") or "env.sops.json"
    plaintext = _run_node(seed, path)
    return _flatten_env(plaintext)


def load_env_into_os(
    seed_hex: str | None = None, sops_path: str | None = None
) -> Dict[str, str]:
    """Populate os.environ with decrypted values and return the flat dict."""
    env_dict = load_env_dict(seed_hex, sops_path)
    os.environ.update(env_dict)
    return env_dict


if __name__ == "__main__":
    sops_path_env = os.environ.get("RABBITLOCK_SOPS_PATH")
    data = load_env_into_os(sops_path=sops_path_env)
    for k, v in data.items():
        print(f"{k}={v}")
