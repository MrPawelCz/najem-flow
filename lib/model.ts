import { z } from "zod";
export const TEMPLATE_VERSION = "2026-09-28.v2-full";
export const detailedDefaults = {
  discount: 0,
  discountDay: 5,
  insuranceSum: 150000,
  inspectionMonths: 6,
  returnTime: "18:00",
  petsAllowed: false,
  smokingAllowed: false,
  spareKeys: false,
  notarialConsent: true,
};
const text = z.string().trim().min(1, "Uzupełnij wymagane pole.").max(250);
const optional = z.string().trim().max(2000).default("");
export const propertySchema = z.object({
  id: z.string(),
  name: text,
  address: text,
  city: text,
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, "Kod pocztowy: 00-000"),
  area: z.number().positive().max(10000),
  rooms: z.number().int().min(1).max(50),
  equipment: optional,
  title: text,
});
export const personSchema = z.object({
  id: z.string(),
  role: z.enum(["owner", "tenant"]),
  name: text,
  email: z.string().email("Podaj poprawny e-mail.").max(250),
  phone: optional,
  address: text,
  identity: optional,
  bankAccount: optional,
  privateOwner: z.boolean().default(true),
});
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => {
    const d = new Date(v);
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "Nieprawidłowa data.");
export const termsSchema = z
  .object({
    kind: z.enum(["ordinary", "occasional"]),
    start: date,
    end: date,
    signedDate: date,
    handover: date,
    rent: z.number().positive().max(1000000),
    fees: z.number().min(0).max(1000000),
    deposit: z.number().min(0).max(12000000),
    paymentDay: z.number().int().min(1).max(28),
    occupants: text,
    alternativeAddress: optional,
    alternativeOwner: optional,
    notes: optional,
    conditionDeadline: date,
    signature: z.enum(["qes", "ses"]),
    insurance: z.boolean().default(false),
    discount: z.number().min(0).max(1000000).default(detailedDefaults.discount),
    discountDay: z
      .number()
      .int()
      .min(1)
      .max(28)
      .default(detailedDefaults.discountDay),
    insuranceSum: z
      .number()
      .positive()
      .max(10000000)
      .default(detailedDefaults.insuranceSum),
    inspectionMonths: z
      .number()
      .int()
      .min(1)
      .max(24)
      .default(detailedDefaults.inspectionMonths),
    returnTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Godzina zwrotu: HH:MM")
      .default(detailedDefaults.returnTime),
    petsAllowed: z.boolean().default(detailedDefaults.petsAllowed),
    smokingAllowed: z.boolean().default(detailedDefaults.smokingAllowed),
    spareKeys: z.boolean().default(detailedDefaults.spareKeys),
    notarialConsent: z.boolean().default(detailedDefaults.notarialConsent),
  })
  .superRefine((v, ctx) => {
    if (
      v.discount >= v.rent ||
      (v.discount > 0 && v.discountDay > v.paymentDay)
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Rabat musi być mniejszy od czynszu, a jego termin nie może wypadać po dniu płatności.",
        path: ["discount"],
      });
    if (v.end < v.start)
      ctx.addIssue({
        code: "custom",
        message: "Koniec najmu musi przypadać po rozpoczęciu.",
        path: ["end"],
      });
    if (
      v.kind === "occasional" &&
      (v.conditionDeadline < v.signedDate || v.conditionDeadline > v.handover)
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Termin załączników musi przypadać między zawarciem umowy a przekazaniem lokalu.",
        path: ["conditionDeadline"],
      });
    const ten = new Date(v.start);
    ten.setUTCFullYear(ten.getUTCFullYear() + 10);
    const year = new Date(v.start);
    year.setUTCFullYear(year.getUTCFullYear() + 1);
    if (v.kind === "occasional" && new Date(v.end) >= ten)
      ctx.addIssue({
        code: "custom",
        message: "Najem okazjonalny może trwać maksymalnie 10 lat.",
        path: ["end"],
      });
    if (
      v.kind === "occasional" &&
      (!v.alternativeAddress || !v.alternativeOwner)
    )
      ctx.addIssue({
        code: "custom",
        message: "Wpisz lokal zastępczy i osobę wyrażającą zgodę.",
        path: ["alternativeAddress"],
      });
    if (
      (v.kind === "occasional" || new Date(v.end) >= year) &&
      v.signature !== "qes"
    )
      ctx.addIssue({
        code: "custom",
        message: "Dla tej umowy wybierz podpis kwalifikowany (QES).",
        path: ["signature"],
      });
    if (v.deposit > v.rent * (v.kind === "occasional" ? 6 : 12))
      ctx.addIssue({
        code: "custom",
        message:
          "Kaucja przekracza limit: 6 czynszów przy najmie okazjonalnym, 12 przy zwykłym.",
        path: ["deposit"],
      });
    if (v.handover < v.start || v.handover > v.end)
      ctx.addIssue({
        code: "custom",
        message: "Przekazanie lokalu musi przypadać w okresie najmu.",
        path: ["handover"],
      });
  });
export type Property = z.infer<typeof propertySchema>;
export type Person = z.infer<typeof personSchema>;
export type Terms = z.infer<typeof termsSchema>;
export const agreementTemplateSchema = z.object({
  id: z.string().max(100),
  name: text,
  kind: z.enum(["ordinary", "occasional"]),
  body: z
    .string()
    .trim()
    .min(100, "Wpisz treść wzoru (co najmniej 100 znaków).")
    .max(65000),
});
export type AgreementTemplate = z.infer<typeof agreementTemplateSchema> & {
  updatedAt: string;
};
export type Contract = {
  id: string;
  number: string;
  property: Property;
  owner: Person;
  tenant: Person;
  terms: Terms;
  status: "draft" | "owner_signed" | "sent" | "signed" | "cancelled";
  createdAt: string;
  events: { date: string; text: string }[];
  checklist: Record<string, boolean>;
  demo: boolean;
  renewalOf?: string;
  templateVersion?: string;
  templateSnapshot?: AgreementTemplate;
};
export type Workspace = {
  properties: Property[];
  people: Person[];
  contracts: Contract[];
  version: number;
  templates?: AgreementTemplate[];
};
export const money = (v: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 2,
  }).format(v);
export const fmtDate = (s: string) =>
  new Date(s + "T12:00:00").toLocaleDateString("pl-PL");
export const today = () => new Date().toISOString().slice(0, 10);
export const daysLeft = (s: string) =>
  Math.ceil((new Date(s + "T23:59:59").getTime() - Date.now()) / 86400000);
export function statusLabel(c: Contract) {
  return c.status === "signed"
    ? daysLeft(c.terms.end) < 0
      ? "Zakończona"
      : c.terms.start > today()
        ? "Zaplanowana"
        : "Aktywna"
    : {
        draft: "Szkic",
        owner_signed: "Podpis wynajmującego",
        sent: "Czeka na najemcę",
        cancelled: "Anulowana",
      }[c.status];
}
export function seed(): Workspace {
  const now = new Date();
  const rel = (m: number, d = 1) =>
    new Date(Date.UTC(now.getFullYear(), now.getMonth() + m, d))
      .toISOString()
      .slice(0, 10);
  const properties: Property[] = [
    {
      id: "p1",
      name: "Apartament Parkowy",
      address: "ul. Przykładowa 12/4",
      city: "Miasto Demo",
      postalCode: "00-000",
      area: 54,
      rooms: 2,
      equipment: "Sofa, stół, łóżko, lodówka, pralka.",
      title: "Własność",
    },
    {
      id: "p2",
      name: "Studio Słoneczne",
      address: "ul. Testowa 8/15",
      city: "Miasto Demo",
      postalCode: "00-000",
      area: 32,
      rooms: 1,
      equipment: "Aneks kuchenny, łóżko, pralka.",
      title: "Własność",
    },
    {
      id: "p3",
      name: "Mieszkanie nad Rzeką",
      address: "ul. Demonstracyjna 6/2",
      city: "Miasto Demo",
      postalCode: "00-000",
      area: 68,
      rooms: 3,
      equipment: "Kuchnia z wyposażeniem, dwie sypialnie.",
      title: "Własność",
    },
  ];
  const people: Person[] = [
    {
      id: "o1",
      role: "owner",
      name: "Aleksandra Przykładowa",
      email: "wlasciciel@example.com",
      phone: "",
      address: "ul. Fikcyjna 1, 00-000 Miasto Demo",
      identity: "DEMO — brak danych identyfikacyjnych",
      bankAccount: "DEMO — rachunek do uzupełnienia",
      privateOwner: true,
    },
    {
      id: "t1",
      role: "tenant",
      name: "Jan Testowy",
      email: "jan@example.com",
      phone: "",
      address: "ul. Testowa 1, 00-000 Miasto Demo",
      identity: "DEMO",
      bankAccount: "",
      privateOwner: true,
    },
    {
      id: "t2",
      role: "tenant",
      name: "Maria Przykładowa",
      email: "maria@example.com",
      phone: "",
      address: "ul. Testowa 2, 00-000 Miasto Demo",
      identity: "DEMO",
      bankAccount: "",
      privateOwner: true,
    },
  ];
  const terms: Terms = {
    ...detailedDefaults,
    kind: "ordinary",
    start: rel(-6),
    end: rel(6, 0),
    signedDate: rel(-6),
    handover: rel(-6),
    rent: 3200,
    fees: 680,
    deposit: 3200,
    paymentDay: 10,
    occupants: "Jan Testowy",
    alternativeAddress: "",
    alternativeOwner: "",
    notes: "",
    conditionDeadline: rel(-6),
    signature: "qes",
    insurance: false,
  };
  const contracts: Contract[] = [
    {
      id: "c1",
      number: "NF/2026/001",
      property: properties[0],
      owner: people[0],
      tenant: people[1],
      terms,
      status: "signed",
      createdAt: rel(-6),
      events: [
        {
          date: rel(-6),
          text: "Przykładowa umowa z ukończoną symulacją podpisów.",
        },
      ],
      checklist: {},
      demo: true,
      templateVersion: TEMPLATE_VERSION,
    },
    {
      id: "c2",
      number: "NF/2026/002",
      property: properties[1],
      owner: people[0],
      tenant: people[2],
      terms: {
        ...terms,
        start: rel(-11),
        handover: rel(-11),
        end: rel(1, 28),
        rent: 2400,
        fees: 420,
        deposit: 2400,
        occupants: "Maria Przykładowa",
      },
      status: "signed",
      createdAt: rel(-11),
      events: [
        {
          date: rel(-11),
          text: "Przykładowa umowa z ukończoną symulacją podpisów.",
        },
      ],
      checklist: {},
      demo: true,
      templateVersion: TEMPLATE_VERSION,
    },
    {
      id: "c3",
      number: "NF/2026/003",
      property: properties[2],
      owner: people[0],
      tenant: people[1],
      terms: {
        ...terms,
        start: rel(1),
        kind: "occasional",
        signedDate: today(),
        conditionDeadline: rel(1),
        alternativeAddress: "ul. Fikcyjna 20/1, 00-000 Miasto Demo",
        alternativeOwner: "Patrycja Demonstracyjna",
        insurance: true,
        handover: rel(1),
        end: rel(13, 0),
        rent: 4100,
        fees: 850,
        deposit: 4100,
      },
      status: "draft",
      createdAt: today(),
      events: [{ date: today(), text: "Utworzono przykładowy szkic umowy." }],
      checklist: {},
      demo: true,
      templateVersion: TEMPLATE_VERSION,
    },
  ];
  return { properties, people, contracts, templates: [], version: 0 };
}
