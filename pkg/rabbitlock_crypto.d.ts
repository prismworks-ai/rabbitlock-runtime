/* tslint:disable */
/* eslint-disable */

export function create_zip_archive(files_js: any): Uint8Array;

export function decrypt_and_verify_sops(json_input: string, private_key: string): string;

export function decrypt_binary_hybrid(data: Uint8Array, secret_key_hex: string): Uint8Array;

export function decrypt_data_key(json_input: string, private_key: string): string;

/**
 * Decrypt and return the full decrypted SOPS file as JSON string
 * Returns: JSON string with decrypted values (sops metadata still encrypted)
 */
export function decrypt_sops_content(json_input: string, private_key: string): string;

export function derive_hybrid_keypair(seed_hex: string): string;

export function encrypt_binary_hybrid(data: Uint8Array, recipient_pubkey_hex: string): Uint8Array;

export function encrypt_sops_json(plain_json: string, data_key_hex: string): string;

export function encrypt_sops_json_for_recipient(plain_json: string, recipient_pubkey_hex: string): string;

export function greet(name: string): string;

export function parse_and_verify_sops(json_input: string): string;

/**
 * Decapsulate a shared secret using your private key
 * secret_key_hex: 2432 bytes as hex
 * ciphertext_hex: 1120 bytes as hex
 * Returns: shared_secret_hex (64 hex chars = 32 bytes)
 */
export function pq_decapsulate(secret_key_hex: string, ciphertext_hex: string): string;

/**
 * Encapsulate a shared secret for a recipient's hybrid public key
 * pub_key_hex: 1216 bytes (32 X25519 + 1184 ML-KEM) as hex
 * Returns: "shared_secret_hex:ciphertext_hex"
 */
export function pq_encapsulate(pub_key_hex: string): string;

/**
 * Generate a new hybrid keypair (X25519 + ML-KEM-768)
 * Returns: "secret_key_hex:public_key_hex"
 */
export function pq_generate_keypair(): string;

/**
 * Get the size constants for documentation
 * Get the size constants for documentation
 */
export function pq_get_sizes(): string;

/**
 * Decapsulate a shared secret using an ML-KEM-768 secret key (PQ-only)
 * secret_key_hex: 2400 bytes as hex
 * ciphertext_hex: 1088 bytes as hex
 * Returns: shared_secret_hex (64 hex chars = 32 bytes)
 */
export function pq_mlkem_decapsulate(secret_key_hex: string, ciphertext_hex: string): string;

/**
 * Encapsulate a shared secret for an ML-KEM-768 public key (PQ-only)
 * pub_key_hex: 1184 bytes as hex
 * Returns: "shared_secret_hex:ciphertext_hex"
 */
export function pq_mlkem_encapsulate(pub_key_hex: string): string;

/**
 * Generate a new ML-KEM-768 keypair (PQ-only)
 * Returns: "secret_key_hex:public_key_hex"
 */
export function pq_mlkem_generate_keypair(): string;

export function verify_sops_integrity(json_input: string, data_key_hex: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly greet: (a: number, b: number) => [number, number];
  readonly parse_and_verify_sops: (a: number, b: number) => [number, number];
  readonly derive_hybrid_keypair: (a: number, b: number) => [number, number, number, number];
  readonly verify_sops_integrity: (a: number, b: number, c: number, d: number) => [number, number];
  readonly decrypt_data_key: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly decrypt_and_verify_sops: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly decrypt_sops_content: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly encrypt_sops_json: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly encrypt_sops_json_for_recipient: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly pq_generate_keypair: () => [number, number];
  readonly pq_encapsulate: (a: number, b: number) => [number, number, number, number];
  readonly pq_decapsulate: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly pq_mlkem_generate_keypair: () => [number, number];
  readonly pq_mlkem_encapsulate: (a: number, b: number) => [number, number, number, number];
  readonly pq_mlkem_decapsulate: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly pq_get_sizes: () => [number, number];
  readonly create_zip_archive: (a: any) => [number, number, number, number];
  readonly encrypt_binary_hybrid: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly decrypt_binary_hybrid: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
