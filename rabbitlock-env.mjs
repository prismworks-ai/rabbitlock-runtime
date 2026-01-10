#!/usr/bin/env node
/**
 * Minimal runtime helper: decrypts a SOPS JSON file with your PQ seed and
 * exports env-style key/value pairs.
 *
 * Usage:
 *   rabbitlock-env --seed $RABBITLOCK_SEED_HEX --in env.sops.json --export
 *   rabbitlock-env --seed $RABBITLOCK_SEED_HEX --in env.sops.json --json
 *   rabbitlock-env --seed $RABBITLOCK_SEED_HEX --in env.sops.json --write-env .env
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

const config = {
  seed: process.env.RABBITLOCK_SEED_HEX || "",
  input: "env.sops.json",
  exportEnv: false,
  outputEnvPath: "",
  outputJson: false,
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--seed") {
    config.seed = args[++i] || "";
  } else if (arg === "--in") {
    config.input = args[++i] || config.input;
  } else if (arg === "--export") {
    config.exportEnv = true;
  } else if (arg === "--write-env") {
    config.outputEnvPath = args[++i] || "";
  } else if (arg === "--json") {
    config.outputJson = true;
  } else if (arg === "--help" || arg === "-h") {
    printHelp();
    process.exit(0);
  }
}

if (!config.seed) {
  console.error(
    "Missing seed. Provide --seed $RABBITLOCK_SEED_HEX or set RABBITLOCK_SEED_HEX.",
  );
  process.exit(1);
}

const wasmPath = path.resolve(__dirname, "./pkg/rabbitlock_crypto.js");

const {
  default: initWasm,
  initSync,
  derive_hybrid_keypair,
  decrypt_data_key,
  decrypt_sops_content,
  verify_sops_integrity,
} = await import(wasmPath);

const wasmBytesPath = path.resolve(
  __dirname,
  "./pkg/rabbitlock_crypto_bg.wasm",
);

const loadWasm = async () => {
  // Node: avoid fetch(file://...) by using initSync with local bytes.
  if (typeof window === "undefined") {
    const bytes = fs.readFileSync(wasmBytesPath);
    initSync({ module: bytes });
  } else {
    await initWasm();
  }
};

await loadWasm();

const derivePrivateKey = (seedHex) => {
  const kp = derive_hybrid_keypair(seedHex);
  const idx = kp.indexOf(":");
  if (idx === -1) {
    throw new Error("Failed to derive hybrid keypair from seed.");
  }
  return kp.slice(0, idx);
};

const flattenEnv = (value, prefix = "", acc = new Map()) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [k, v] of Object.entries(value)) {
      const nextPrefix = prefix ? `${prefix}_${k}` : k;
      flattenEnv(v, nextPrefix, acc);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, idx) => flattenEnv(v, `${prefix}_${idx}`, acc));
  } else {
    const key = prefix.toUpperCase();
    const val =
      typeof value === "string"
        ? value
        : value === null
          ? ""
          : JSON.stringify(value);
    acc.set(key, val);
  }
  return acc;
};

const run = () => {
  const inputPath = path.resolve(process.cwd(), config.input);
  const raw = fs.readFileSync(inputPath, "utf8");

  const privateKey = derivePrivateKey(config.seed.trim());
  const dataKey = decrypt_data_key(raw, privateKey);
  const verified = verify_sops_integrity(raw, dataKey);
  if (!verified.includes("Passed")) {
    throw new Error(`Integrity check failed: ${verified}`);
  }

  const plaintext = decrypt_sops_content(raw, privateKey);
  const json = JSON.parse(plaintext);

  if (config.outputJson) {
    console.log(JSON.stringify(json, null, 2));
  }

  if (config.exportEnv || config.outputEnvPath) {
    const envLines = Array.from(flattenEnv(json).entries()).map(
      ([k, v]) => `${k}=${v}`,
    );
    if (config.outputEnvPath) {
      fs.writeFileSync(config.outputEnvPath, envLines.join("\n"));
      console.error(
        `Wrote ${envLines.length} entries to ${config.outputEnvPath}`,
      );
    } else {
      console.log(envLines.join("\n"));
    }
  }
};

function printHelp() {
  console.log(`RabbitLock env helper

Options:
  --seed <hex>        RABBITLOCK_SEED_HEX (or set env var)
  --in <path>         SOPS JSON file (default: env.sops.json)
  --export            Print env-style KEY=value lines
  --write-env <path>  Write env lines to a file
  --json              Print plaintext JSON
  --help              Show this help
`);
}

try {
  run();
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
