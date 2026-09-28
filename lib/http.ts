import { z } from "zod";
export const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
export async function readJson(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    throw new Error("Niedozwolone źródło żądania.");
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("Wymagany format JSON.");
  const body = await request.text();
  if (body.length > 100000) throw new Error("Żądanie jest zbyt duże.");
  return JSON.parse(body);
}
export function failure(e: unknown) {
  if (e instanceof z.ZodError)
    return json({ error: e.issues.map((i) => i.message).join(" ") }, 400);
  const known =
    e instanceof Error &&
    /^(Wybierz|Najem|Nie |Nieznane|Nieprawidłowe|Ten |Najpierw|Po |Można|Zakończonego|Osiągnięto|Dane |Niedozwolone|Wymagany|Żądanie)/.test(
      e.message,
    );
  if (!known)
    console.error("Request failed", e instanceof Error ? e.name : "unknown");
  return json(
    {
      error: known
        ? (e as Error).message
        : "Nie udało się zapisać danych. Spróbuj ponownie; wpisane dane pozostają w formularzu.",
    },
    known ? 400 : 503,
  );
}
