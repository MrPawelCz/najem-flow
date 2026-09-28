import { database, hashToken } from "./store";
const COOKIE = "nf_admin";
const AGE = 86400;
export async function adminUser(request: Request): Promise<string | null> {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(COOKIE + "="))
    ?.slice(COOKIE.length + 1);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = await database()
    .prepare(
      "SELECT user_id FROM guest_sessions WHERE token_hash = ? AND expires_at > ?",
    )
    .bind(await hashToken(token), Date.now())
    .first<{ user_id: string }>();
  return row?.user_id === "demo-admin-v1" ? row.user_id : null;
}
export async function createAdminSession(request: Request) {
  const token = [...crypto.getRandomValues(new Uint8Array(32))]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
  const userId = "demo-admin-v1";
  await database()
    .prepare(
      "INSERT INTO guest_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
    )
    .bind(await hashToken(token), userId, Date.now() + AGE * 1000)
    .run();
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return {
    userId,
    cookie: `${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${AGE}${secure}`,
  };
}
export async function logoutAdmin(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(COOKIE + "="))
    ?.slice(COOKIE.length + 1);
  if (token && /^[a-f0-9]{64}$/.test(token))
    await database()
      .prepare("DELETE FROM guest_sessions WHERE token_hash = ?")
      .bind(await hashToken(token))
      .run();
  return `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
