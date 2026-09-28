import { getChatGPTUser } from "@/app/chatgpt-auth";
import {
  readWorkspace,
  initializeWorkspace,
  saveWorkspace,
  database,
  hashToken,
} from "@/lib/store";
import { applyAction } from "@/lib/operations";
import { json, readJson, failure } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const user = await getChatGPTUser();
    if (!user) return json({ error: "Zaloguj się, aby otworzyć panel." }, 401);
    return json({ state: await readWorkspace(user.userId) });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(request: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return json({ error: "Zaloguj się, aby zapisać zmiany." }, 401);
    const input = await readJson(request);
    if (input.action === "initialize")
      return json({ state: await initializeWorkspace(user.userId) });
    const current = await readWorkspace(user.userId);
    if (!current) return json({ error: "Otwórz panel ponownie." }, 409);
    if (input.version !== current.version)
      return json(
        {
          error:
            "Dane zmieniły się w innym oknie. Odśwież panel przed zapisem.",
        },
        409,
      );
    const { state, contractId } = applyAction(current, input);
    let signingPath: string | undefined;
    if (input.action === "invite") {
      const token = [...crypto.getRandomValues(new Uint8Array(32))]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
      // New token is harmless until the version-checked state update succeeds.
      await database()
        .prepare(
          "INSERT INTO invitations (token_hash, user_id, contract_id, expires_at) VALUES (?, ?, ?, ?)",
        )
        .bind(
          await hashToken(token),
          user.userId,
          contractId,
          Date.now() + 7 * 86400000,
        )
        .run();
      signingPath = "/sign/" + token;
    }
    await saveWorkspace(user.userId, state, current.version);
    return json({ state, contractId, signingPath });
  } catch (e) {
    return failure(e);
  }
}
