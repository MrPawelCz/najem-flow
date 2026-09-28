import { z } from "zod";
import {
  propertySchema,
  personSchema,
  termsSchema,
  type Workspace,
  type Contract,
  today,
} from "./model";
const id = z.string().min(1).max(100);
export const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("property"), data: propertySchema }),
  z.object({ action: z.literal("person"), data: personSchema }),
  z.object({
    action: z.literal("contract"),
    id: id.optional(),
    propertyId: id,
    ownerId: id,
    tenantId: id,
    terms: termsSchema,
    renewalOf: id.optional(),
  }),
  z.object({ action: z.literal("owner-sign"), id }),
  z.object({ action: z.literal("invite"), id }),
  z.object({ action: z.literal("cancel"), id }),
  z.object({
    action: z.literal("check"),
    id,
    key: z.enum([
      "notary",
      "alternative",
      "consent",
      "tax",
      "handover",
      "energy",
      "deposit",
    ]),
    value: z.boolean(),
  }),
]);
export type Action = z.infer<typeof actionSchema>;
export function applyAction(
  current: Workspace,
  input: unknown,
): { state: Workspace; contractId?: string } {
  const a = actionSchema.parse(input);
  const state = structuredClone(current);
  let contractId: string | undefined;
  if (
    state.properties.length > 200 ||
    state.people.length > 500 ||
    state.contracts.length > 500
  )
    throw new Error("Osiągnięto limit pierwszej wersji.");
  if (a.action === "property" || a.action === "person") {
    const list = a.action === "property" ? state.properties : state.people;
    const i = list.findIndex((p) => p.id === a.data.id);
    const p = { ...a.data, id: i < 0 ? crypto.randomUUID() : a.data.id };
    // Lists are validated separately before reaching this shared upsert.
    if (a.action === "property") {
      if (i < 0) state.properties.push(p as z.infer<typeof propertySchema>);
      else state.properties[i] = p as z.infer<typeof propertySchema>;
    } else {
      if (i < 0) state.people.push(p as z.infer<typeof personSchema>);
      else state.people[i] = p as z.infer<typeof personSchema>;
    }
  } else if (a.action === "contract") {
    const property = state.properties.find((p) => p.id === a.propertyId);
    const owner = state.people.find(
      (p) => p.id === a.ownerId && p.role === "owner",
    );
    const tenant = state.people.find(
      (p) => p.id === a.tenantId && p.role === "tenant",
    );
    if (!property || !owner || !tenant)
      throw new Error(
        "Wybierz mieszkanie, wynajmującego i najemcę z tego konta.",
      );
    if (a.terms.kind === "occasional" && !owner.privateOwner)
      throw new Error(
        "Najem okazjonalny dotyczy właściciela będącego osobą fizyczną, który nie prowadzi działalności w zakresie wynajmu.",
      );
    const existing = a.id
      ? state.contracts.find((c) => c.id === a.id)
      : undefined;
    if (a.id && !existing) throw new Error("Nie znaleziono umowy.");
    if (existing && existing.status !== "draft")
      throw new Error(
        "Po rozpoczęciu podpisywania treść jest zablokowana. Utwórz nowy szkic.",
      );
    if (
      a.renewalOf &&
      !state.contracts.some(
        (c) => c.id === a.renewalOf && c.status === "signed",
      )
    )
      throw new Error(
        "Można przedłużyć wyłącznie umowę z zakończonym obiegiem.",
      );
    const c: Contract = {
      id: existing?.id ?? crypto.randomUUID(),
      number:
        existing?.number ??
        `NF/${new Date().getFullYear()}/${String(state.contracts.length + 1).padStart(3, "0")}`,
      property,
      owner,
      tenant,
      terms: a.terms,
      status: "draft",
      createdAt: existing?.createdAt ?? today(),
      events: [
        ...(existing?.events ?? []),
        {
          date: today(),
          text: existing
            ? "Zapisano zmiany szkicu."
            : a.renewalOf
              ? "Przygotowano propozycję przedłużenia."
              : "Utworzono szkic umowy.",
        },
      ],
      checklist: existing?.checklist ?? {},
      demo: true,
      renewalOf: a.renewalOf ?? existing?.renewalOf,
    };
    if (existing) state.contracts[state.contracts.indexOf(existing)] = c;
    else state.contracts.push(c);
    contractId = c.id;
  } else {
    const c = state.contracts.find((c) => c.id === a.id);
    if (!c) throw new Error("Nie znaleziono umowy.");
    contractId = c.id;
    if (a.action === "owner-sign") {
      if (c.status !== "draft")
        throw new Error("Ten etap został już zakończony.");
      termsSchema.parse(c.terms);
      c.status = "owner_signed";
      c.events.push({
        date: today(),
        text: "Autenti DEMO: zasymulowano podpis wynajmującego. Treść została zablokowana.",
      });
    } else if (a.action === "invite") {
      if (c.status !== "owner_signed" && c.status !== "sent")
        throw new Error("Najpierw wykonaj symulację podpisu wynajmującego.");
      c.status = "sent";
      c.events.push({
        date: today(),
        text: "Autenti DEMO: przygotowano link dla najemcy. Link wymaga ręcznego przekazania; e-mail nie został wysłany.",
      });
    } else if (a.action === "cancel") {
      if (c.status === "signed")
        throw new Error("Zakończonego obiegu nie można anulować.");
      c.status = "cancelled";
      c.events.push({ date: today(), text: "Anulowano obieg demonstracyjny." });
    } else if (a.action === "check") c.checklist[a.key] = a.value;
  }
  state.version = current.version + 1;
  return { state, contractId };
}
