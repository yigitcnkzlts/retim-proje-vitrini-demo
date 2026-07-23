/**
 * Düz şifreden bcrypt hash üretir.
 * Kullanım: npx tsx scripts/hash-admin-password.ts "Sifreniz"
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Kullanım: npx tsx scripts/hash-admin-password.ts "Sifreniz"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nADMIN_PASSWORD_HASH değerini .env.local / Vercel'e ekleyin:\n");
console.log(hash);
console.log("\nProduction'da düz ADMIN_PASSWORD kullanmayın.\n");
