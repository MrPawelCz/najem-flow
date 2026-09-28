import { getInvitation, saveWorkspace } from "@/lib/store";
import { json, readJson, failure } from "@/lib/http";
import { today } from "@/lib/model";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const item = await getInvitation(token);
    if (!item)
      return json(
        {
          error: "Link jest nieprawidłowy, wygasł lub obieg został anulowany.",
        },
        404,
      );
    return json({
      contract: item.contract,
      expiresAt: item.invitation.expires_at,
    });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const input = await readJson(request);
    if (input.acceptDemo !== true)
      return json(
        { error: "Potwierdź, że rozumiesz demonstracyjny charakter podpisu." },
        400,
      );
    const { token } = await params;
    const item = await getInvitation(token);
    if (!item)
      return json({ error: "Link jest nieprawidłowy lub wygasł." }, 404);
    if (item.contract.status === "signed")
      return json({ contract: item.contract });
    if (item.contract.status !== "sent")
      return json({ error: "Umowa nie oczekuje na podpis." }, 409);
    item.contract.status = "signed";
    item.contract.events.push({
      date: today(),
      text: "Autenti DEMO: zasymulowano podpis najemcy. Obieg demonstracyjny zakończony; brak podpisów kryptograficznych.",
    });
    const previous = item.state.version;
    item.state.version++;
    await saveWorkspace(item.invitation.user_id, item.state, previous);
    return json({ contract: item.contract });
  } catch (e) {
    return failure(e);
  }
}
