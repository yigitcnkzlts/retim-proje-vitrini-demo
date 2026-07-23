import { cookies } from "next/headers";
import {
  ADMIN_SESSION_MAX_AGE_SEC,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/auth/session-token";

const COOKIE_NAME = "retim_admin_session";

export { verifyAdminSessionToken };

export async function setAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  const token = await createAdminSessionToken();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(COOKIE_NAME)?.value);
}

export function getAdminSessionCookieName(): string {
  return COOKIE_NAME;
}
