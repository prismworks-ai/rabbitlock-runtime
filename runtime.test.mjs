import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

import initWasm, {
  initSync,
  derive_hybrid_keypair,
  encrypt_sops_json_for_recipient,
} from "./pkg/rabbitlock_crypto.js";

const wasmUrl = new URL("./pkg/rabbitlock_crypto_bg.wasm", import.meta.url);
const wasmBytes = fs.readFileSync(wasmUrl);
initSync({ module: wasmBytes });

const seedHex =
  "1111111111111111111111111111111111111111111111111111111111111111"; // 32 bytes hex
const cliPath = new URL("./rabbitlock-env.mjs", import.meta.url).pathname;
const pyPath = new URL("./rabbitlock_env.py", import.meta.url).pathname;

const makeTempSops = (plainObj) => {
  const kp = derive_hybrid_keypair(seedHex);
  const [, publicKey] = kp.split(":");
  const sopsJson = encrypt_sops_json_for_recipient(
    JSON.stringify(plainObj),
    publicKey,
  );

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rabbitlock-"));
  const filePath = path.join(dir, "env.sops.json");
  fs.writeFileSync(filePath, sopsJson);
  return { filePath, dir };
};

test("Node CLI --json and --export round-trip env", () => {
  const fixture = { API_KEY: "abc", DB_URL: "postgres://example" };
  const { filePath, dir } = makeTempSops(fixture);

  const jsonOut = execFileSync(
    "node",
    [cliPath, "--seed", seedHex, "--in", filePath, "--json"],
    { encoding: "utf8" },
  );
  const parsed = JSON.parse(jsonOut);
  assert.deepEqual(parsed, fixture);

  const exportOut = execFileSync(
    "node",
    [cliPath, "--seed", seedHex, "--in", filePath, "--export"],
    { encoding: "utf8" },
  );

  const kv = Object.fromEntries(
    exportOut
      .trim()
      .split("\n")
      .map((line) => line.split("=")),
  );
  assert.equal(kv.API_KEY, "abc");
  assert.equal(kv.DB_URL, "postgres://example");

  fs.rmSync(dir, { recursive: true, force: true });
});

test("Python shim loads env via Node helper", () => {
  const pythonCmd = detectPython();
  if (!pythonCmd) {
    test.skip("python not available");
    return;
  }

  const fixture = { API_KEY: "xyz", REGION: "us-west-2" };
  const { filePath, dir } = makeTempSops(fixture);

  const output = execFileSync(pythonCmd, [pyPath], {
    encoding: "utf8",
    env: {
      ...process.env,
      RABBITLOCK_SEED_HEX: seedHex,
      RABBITLOCK_SOPS_PATH: filePath,
    },
  });

  const kv = Object.fromEntries(
    output
      .trim()
      .split("\n")
      .map((line) => line.split("=")),
  );

  assert.equal(kv.API_KEY, "xyz");
  assert.equal(kv.REGION, "us-west-2");

  fs.rmSync(dir, { recursive: true, force: true });
});

function detectPython() {
  const candidates = ["python", "python3"];
  for (const cmd of candidates) {
    try {
      execFileSync(cmd, ["--version"], { stdio: "ignore" });
      return cmd;
    } catch {
      // try next
    }
  }
  return null;
}
