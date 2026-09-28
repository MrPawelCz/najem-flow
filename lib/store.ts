import { env } from "cloudflare:workers";
import { seed, type Workspace } from "./model";
export function database() {
  if (!env.DB) throw new Error("Baza danych jest chwilowo niedostępna.");
  return env.DB;
}
export async function readWorkspace(userId: string): Promise<Workspace | null> {
  const row = await database()
    .prepare("SELECT payload, version FROM workspaces WHERE user_id = ?")
    .bind(userId)
    .first<{ payload: string; version: number }>();
  return row ? { ...JSON.parse(row.payload), version: row.version } : null;
}
export async function initializeWorkspace(userId: string) {
  const initial = seed();
  await database()
    .prepare(
      "INSERT OR IGNORE INTO workspaces (user_id, payload, version) VALUES (?, ?, 0)",
    )
    .bind(userId, JSON.stringify(initial))
    .run();
  return (await readWorkspace(userId))!;
}
export async function saveWorkspace(
  userId: string,
  state: Workspace,
  previousVersion: number,
) {
  const payload = JSON.stringify(state);
  if (payload.length > 1500000)
    throw new Error("Osiągnięto limit danych pierwszej wersji.");
  const result = await database()
    .prepare(
      "UPDATE workspaces SET payload = ?, version = ? WHERE user_id = ? AND version = ?",
    )
    .bind(payload, state.version, userId, previousVersion)
    .run();
  if (!result.meta.changes)
    throw new Error(
      "Dane zmieniły się w innym oknie. Odśwież panel i spróbuj ponownie.",
    );
}
export async function hashToken(token: string) {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)),
    ),
  ]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
export async function getInvitation(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const invitation = await database()
    .prepare(
      "SELECT user_id, contract_id, expires_at FROM invitations WHERE token_hash = ?",
    )
    .bind(await hashToken(token))
    .first<{ user_id: string; contract_id: string; expires_at: number }>();
  if (!invitation || invitation.expires_at < Date.now()) return null;
  const state = await readWorkspace(invitation.user_id);
  const contract = state?.contracts.find(
    (c) => c.id === invitation.contract_id,
  );
  if (!state || !contract || !["sent", "signed"].includes(contract.status))
    return null;
  return { invitation, state, contract };
}
