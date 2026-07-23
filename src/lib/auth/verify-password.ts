import bcrypt from "bcryptjs";

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH?.trim() || process.env.ADMIN_PASSWORD);
}

/** bcrypt hash (ADMIN_PASSWORD_HASH) veya geçici düz şifre (ADMIN_PASSWORD) */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }

  const plain = process.env.ADMIN_PASSWORD;
  if (!plain) return false;
  return password === plain;
}
