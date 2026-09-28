import {
  createAdminSession,
  adminUser,
  logoutAdmin,
} from "@/lib/admin-session";
import { initializeWorkspace } from "@/lib/store";
import { json, readJson, failure } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const input = await readJson(request);
    if (input.action === "logout") {
      const response = json({ ok: true });
      response.headers.set("Set-Cookie", await logoutAdmin(request));
      return response;
    }
    const existing = await adminUser(request);
    if (!existing && (input.username !== "admin" || input.password !== "admin"))
      return json({ error: "Zaloguj się danymi administratora." }, 401);
    const session = existing
      ? { userId: existing, cookie: "" }
      : await createAdminSession(request);
    const response = json({ state: await initializeWorkspace(session.userId) });
    if (session.cookie) response.headers.set("Set-Cookie", session.cookie);
    return response;
  } catch (e) {
    return failure(e);
  }
}
