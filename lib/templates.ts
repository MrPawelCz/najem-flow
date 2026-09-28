import {
  type Contract,
  type Terms,
  seed,
  fmtDate,
  money,
  TEMPLATE_VERSION,
} from "./model";
import { fullContractSections } from "./contract-v2";
const dynamicClauses: Record<string, [number, number]> = {
  warunki_wydania: [3, 3],
  postanowienie_kluczy: [3, 5],
  postanowienie_rabatu: [5, 3],
  postanowienie_palenia: [9, 10],
  postanowienie_zwierzat: [9, 11],
  postanowienie_zamkow: [9, 15],
  postanowienie_oc: [9, 17],
  forma_zmian: [12, 1],
  sposob_podpisu: [12, 2],
  zalaczniki_wspolne: [12, 5],
};
export function templateValues(c: Contract): Record<string, string> {
  const p = c.property,
    o = c.owner,
    n = c.tenant,
    t = c.terms;
  const sections = fullContractSections(c);
  const values: Record<string, string> = {
    numer_umowy: c.number,
    data_zawarcia: fmtDate(t.signedDate),
    poczatek_najmu: fmtDate(t.start),
    koniec_najmu: fmtDate(t.end),
    data_przekazania: fmtDate(t.handover),
    termin_zalacznikow: fmtDate(t.conditionDeadline),
    godzina_zwrotu: t.returnTime,
    adres_lokalu: p.address,
    kod_pocztowy: p.postalCode,
    miasto: p.city,
    powierzchnia: String(p.area),
    pokoje: String(p.rooms),
    tytul_prawny: p.title,
    wyposazenie: p.equipment || "według protokołu",
    wynajmujacy: o.name,
    adres_wynajmujacego: o.address,
    identyfikacja_wynajmujacego: o.identity || "[do uzupełnienia]",
    email_wynajmujacego: o.email,
    telefon_wynajmujacego: o.phone || "nie podano",
    rachunek: o.bankAccount || "[do uzupełnienia]",
    najemca: n.name,
    adres_najemcy: n.address,
    identyfikacja_najemcy: n.identity || "[do uzupełnienia]",
    email_najemcy: n.email,
    telefon_najemcy: n.phone || "nie podano",
    mieszkancy: t.occupants,
    czynsz: money(t.rent),
    oplaty: money(t.fees),
    kaucja: money(t.deposit),
    dzien_platnosci: String(t.paymentDay),
    suma_oc: money(t.insuranceSum),
    przeglad_miesiace: String(t.inspectionMonths),
    inny_lokal: t.alternativeAddress || "[nie dotyczy]",
    osoba_wyrazajaca_zgode: t.alternativeOwner || "[nie dotyczy]",
    dodatkowe_uzgodnienia: t.notes || "brak",
  };
  for (const [key, [section, number]] of Object.entries(dynamicClauses))
    values[key] = sections[section].text
      .split("\n")
      .find((line) => line.startsWith(number + ". "))!
      .slice(String(number).length + 2);
  if (t.kind === "occasional")
    values.zgoda_inny_lokal = sections[12].text
      .split("\n")
      .find((line) => line.startsWith("7. "))!
      .slice(3);
  else values.zgoda_inny_lokal = "Nie dotyczy zwykłego najmu.";
  return values;
}
export const TEMPLATE_TOKENS = Object.keys(templateValues(seed().contracts[0]));
export function validateTemplateBody(body: string) {
  const unknown = [...body.matchAll(/\{\{([^{}]*)\}\}/g)]
    .map((m) => m[1])
    .filter((key) => !TEMPLATE_TOKENS.includes(key));
  if (unknown.length)
    throw new Error("Nieznane pola wzoru: " + [...new Set(unknown)].join(", "));
  if (
    body.replace(/\{\{[^{}]*\}\}/g, "").includes("{{") ||
    body.replace(/\{\{[^{}]*\}\}/g, "").includes("}}")
  )
    throw new Error("Nieprawidłowe nawiasy pola wzoru. Użyj {{nazwa_pola}}.");
}
export function renderTemplate(body: string, c: Contract) {
  validateTemplateBody(body);
  const values = templateValues(c);
  return body.replace(/\{\{([^{}]*)\}\}/g, (_, key) => values[key]);
}
export function customSections(body: string, c: Contract) {
  const text = renderTemplate(body, c);
  const sections: { title: string; text: string }[] = [];
  for (const block of text.split(/\n\s*\n/)) {
    const [head, ...rest] = block.split("\n");
    if (
      rest.length &&
      (/^§\s*\d/.test(head) ||
        ["Strony umowy", "Podpisy Stron"].includes(head) ||
        sections.length === 0)
    )
      sections.push({ title: head, text: rest.join("\n") });
    else if (sections.length)
      sections[sections.length - 1].text += "\n" + block;
    else sections.push({ title: "Treść umowy", text: block });
  }
  return [
    {
      title: `Własny wzór: ${c.templateSnapshot?.name ?? "Podgląd"}`,
      text: "DEMO — projekt bez podpisu elektronicznego. Treść własnego wzoru wymaga weryfikacji przed użyciem.",
    },
    ...sections,
  ];
}
// Start from the full reference-derived agreement, replacing sample values with explicit fields.
export function templateDraft(kind: Terms["kind"]) {
  const c = structuredClone(seed().contracts[0]);
  c.templateVersion = TEMPLATE_VERSION;
  c.terms = {
    ...c.terms,
    kind,
    signedDate: "2091-01-02",
    start: "2091-02-03",
    end: "2092-04-05",
    handover: "2091-02-04",
    conditionDeadline: "2091-01-31",
    rent: 9876.54,
    fees: 876.43,
    deposit: 9875.32,
    inspectionMonths: 23,
    paymentDay: 27,
    insurance: true,
    insuranceSum: 456789,
    discount: 123.45,
    discountDay: 5,
  };
  const stringMap: [Record<string, unknown>, Record<string, string>][] = [
    [c as unknown as Record<string, unknown>, { number: "numer_umowy" }],
    [
      c.property,
      {
        address: "adres_lokalu",
        postalCode: "kod_pocztowy",
        city: "miasto",
        area: "powierzchnia",
        rooms: "pokoje",
        title: "tytul_prawny",
        equipment: "wyposazenie",
      },
    ],
    [
      c.owner,
      {
        name: "wynajmujacy",
        address: "adres_wynajmujacego",
        identity: "identyfikacja_wynajmujacego",
        email: "email_wynajmujacego",
        phone: "telefon_wynajmujacego",
        bankAccount: "rachunek",
      },
    ],
    [
      c.tenant,
      {
        name: "najemca",
        address: "adres_najemcy",
        identity: "identyfikacja_najemcy",
        email: "email_najemcy",
        phone: "telefon_najemcy",
      },
    ],
    [
      c.terms,
      {
        occupants: "mieszkancy",
        alternativeAddress: "inny_lokal",
        alternativeOwner: "osoba_wyrazajaca_zgode",
        notes: "dodatkowe_uzgodnienia",
        returnTime: "godzina_zwrotu",
      },
    ],
  ];
  for (const [object, fields] of stringMap)
    for (const [field, token] of Object.entries(fields))
      object[field] = "{{" + token + "}}";
  const sections = fullContractSections(c);
  const values = templateValues(c);
  for (const [token, [section, number]] of Object.entries(dynamicClauses)) {
    sections[section].text = sections[section].text.replace(
      `${number}. ${values[token]}`,
      `${number}. {{${token}}}`,
    );
  }
  if (kind === "occasional")
    sections[12].text = sections[12].text.replace(
      `7. ${values.zgoda_inny_lokal}`,
      "7. {{zgoda_inny_lokal}}",
    );
  let body = sections.map((s) => s.title + "\n" + s.text).join("\n\n");
  const replace = [
    "data_zawarcia",
    "poczatek_najmu",
    "koniec_najmu",
    "data_przekazania",
    "termin_zalacznikow",
    "czynsz",
    "oplaty",
    "kaucja",
    "suma_oc",
    "dzien_platnosci",
    "przeglad_miesiace",
  ];
  for (const key of replace.sort((a, b) => values[b].length - values[a].length))
    body = body.split(values[key]).join("{{" + key + "}}");
  return body;
}
