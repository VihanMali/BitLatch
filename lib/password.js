import "server-only";
import { randomBytes } from "node:crypto";
import { argon2id, argon2Verify } from "hash-wasm";

const ARGON2_OPTIONS = {
  memorySize: 19456,
  iterations: 2,
  parallelism: 1,
  hashLength: 32,
  outputType: "encoded",
};

export function hashPassword(password) {
  return argon2id({ password, salt: randomBytes(16), ...ARGON2_OPTIONS });
}

export function verifyPassword(passwordHash, password) {
  return argon2Verify({ password, hash: passwordHash });
}
