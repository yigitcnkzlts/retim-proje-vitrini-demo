/**
 * Edge Runtime uyumlu oturum token imzalama/doğrulama.
 * Node'a özgü `crypto`/`Buffer` KULLANMAZ — middleware (Edge) burada çalışır.
 * Web Crypto API (globalThis.crypto.subtle) hem Node hem Edge'de mevcuttur.
 */

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret) return secret;
  return process.env.ADMIN_PASSWORD || "dev-secret-change-me";
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const withPad = padded + "=".repeat((4 - (padded.length % 4)) % 4);
  const binary = atob(withPad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(payload: string): Promise<string> {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function verifySignature(payload: string, signature: string): Promise<boolean> {
  try {
    const key = await getHmacKey();
    const sigBytes = base64UrlToBytes(signature);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.slice().buffer as ArrayBuffer,
      new TextEncoder().encode(payload)
    );
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_MAX_AGE_SEC = MAX_AGE_SEC;

export async function createAdminSessionToken(): Promise<string> {
  const payload = bytesToBase64Url(
    new TextEncoder().encode(
      JSON.stringify({ iat: Date.now(), exp: Date.now() + MAX_AGE_SEC * 1000 })
    )
  );
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const validSignature = await verifySignature(payload, signature);
  if (!validSignature) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
      exp?: number;
    };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}
