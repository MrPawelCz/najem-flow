"use client";
import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Plus, FileCheck2 } from "lucide-react";
import {
  propertySchema,
  personSchema,
  termsSchema,
  today,
  type Workspace,
  type Property,
  type Person,
  type Contract,
  type Terms,
} from "@/lib/model";
import { contractSections } from "@/lib/contract";
export function Choice({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="field">
      <span>{label}</span>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="select-wide" aria-label={label}>
          <SelectValue placeholder="Wybierz…" />
        </SelectTrigger>
        <SelectContent>
          {options.map(([id, name]) => (
            <SelectItem key={id} value={id}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export function Field({
  label,
  value,
  onChange,
  type = "text",
  full = false,
  required = false,
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className={"field " + (full ? "full" : "")}>
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={2000}
        />
      ) : (
        <input
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          maxLength={type === "number" ? undefined : 250}
          step={type === "number" ? "0.01" : undefined}
        />
      )}{" "}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="check-row">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <span>{children}</span>
    </label>
  );
}
export function DocumentPreview({ contract }: { contract: Contract }) {
  return (
    <div className="document-preview">
      {contractSections(contract).map((s, i) => (
        <section key={s.title}>
          {i === 0 ? <h2>{s.title}</h2> : <h3>{s.title}</h3>}
          <p style={{ whiteSpace: "pre-line" }}>{s.text}</p>
        </section>
      ))}
    </div>
  );
}
export function EntityDialog({
  kind,
  initial,
  onClose,
  onSave,
}: {
  kind: "property" | "owner" | "tenant";
  initial?: Property | Person;
  onClose: () => void;
  onSave: (action: unknown) => Promise<unknown>;
}) {
  const [v, setV] = useState<Record<string, any>>(
    initial ??
      (kind === "property"
        ? {
            id: "",
            name: "",
            address: "",
            city: "",
            postalCode: "",
            area: 0,
            rooms: 1,
            title: "Własność",
            equipment: "",
          }
        : {
            id: "",
            role: kind,
            name: "",
            address: "",
            email: "",
            phone: "",
            identity: "",
            bankAccount: "",
            privateOwner: true,
          }),
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (key: string, value: unknown) =>
    setV((prev) => ({ ...prev, [key]: value }));
  const input = (
    key: string,
    label: string,
    type = "text",
    full = false,
    required = true,
    hint?: string,
  ) => (
    <Field
      key={key}
      label={label}
      value={v[key]}
      type={type}
      full={full}
      required={required}
      hint={hint}
      onChange={(s) => update(key, type === "number" ? Number(s) : s)}
    />
  );
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const parsed = (
        kind === "property" ? propertySchema : personSchema
      ).safeParse(v);
      if (!parsed.success)
        throw new Error(parsed.error.issues.map((i) => i.message).join(" "));
      await onSave({
        action: kind === "property" ? "property" : "person",
        data: parsed.data,
      });
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Edytuj" : "Dodaj"}{" "}
            {kind === "property"
              ? "mieszkanie"
              : kind === "owner"
                ? "wynajmującego"
                : "najemcę"}
          </DialogTitle>
          <DialogDescription>
            Dane trafią do nowych umów. Istniejące dokumenty zachowują swoją
            treść.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              {input(
                "name",
                kind === "property" ? "Nazwa mieszkania" : "Imię i nazwisko",
                "text",
                true,
              )}
              {input(
                "address",
                kind === "property"
                  ? "Ulica i numer lokalu"
                  : "Adres zamieszkania",
                "text",
                true,
              )}
              {kind === "property" ? (
                <>
                  {input("postalCode", "Kod pocztowy")}
                  {input("city", "Miejscowość")}
                  {input("area", "Powierzchnia (m²)", "number")}
                  {input("rooms", "Liczba pokoi", "number")}
                  {input("title", "Tytuł prawny do lokalu", "text", true)}
                  {input("equipment", "Wyposażenie", "textarea", true, false)}
                </>
              ) : (
                <>
                  {input("email", "E-mail", "email")}
                  {input("phone", "Telefon", "tel", false, false)}
                  {input(
                    "identity",
                    "Identyfikacja strony (opcjonalnie)",
                    "text",
                    true,
                    false,
                    "W wersji demonstracyjnej wpisuj wyłącznie fikcyjne dane. Nie wpisuj prawdziwego PESEL.",
                  )}
                  {kind === "owner" &&
                    input(
                      "bankAccount",
                      "Rachunek bankowy",
                      "text",
                      true,
                      false,
                    )}
                </>
              )}
            </div>
            {kind === "owner" && (
              <Check
                checked={v.privateOwner}
                onChange={(s) => update("privateOwner", s)}
              >
                Osoba fizyczna nieprowadząca działalności gospodarczej w
                zakresie wynajmowania lokali (wymagane dla najmu okazjonalnego).
              </Check>
            )}
            {error && (
              <div role="alert" className="error">
                {error}
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button
              className="btn"
              type="button"
              onClick={onClose}
              disabled={busy}
            >
              Anuluj
            </button>
            <button className="btn primary" disabled={busy}>
              {busy ? "Zapisywanie…" : "Zapisz dane"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function ContractWizard({
  data,
  initial,
  renewal,
  onClose,
  onSave,
  onAdd,
}: {
  data: Workspace;
  initial?: Contract;
  renewal?: Contract;
  onClose: () => void;
  onSave: (action: unknown) => Promise<unknown>;
  onAdd: (kind: "property" | "owner" | "tenant") => void;
}) {
  const base = initial ?? renewal;
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [propertyId, setProperty] = useState(base?.property.id ?? "");
  const [ownerId, setOwner] = useState(base?.owner.id ?? "");
  const [tenantId, setTenant] = useState(base?.tenant.id ?? "");
  const [terms, setTerms] = useState<Terms>(() => {
    if (initial) return initial.terms;
    const start = renewal
      ? new Date(new Date(renewal.terms.end).getTime() + 86400000)
          .toISOString()
          .slice(0, 10)
      : today();
    const end = new Date(start);
    end.setUTCFullYear(end.getUTCFullYear() + 1);
    end.setUTCDate(end.getUTCDate() - 1);
    return {
      ...(renewal?.terms ?? {
        kind: "ordinary",
        rent: 0,
        fees: 0,
        deposit: 0,
        paymentDay: 10,
        occupants: "",
        alternativeAddress: "",
        alternativeOwner: "",
        notes: "",
        signature: "qes",
        insurance: false,
      }),
      start,
      end: end.toISOString().slice(0, 10),
      handover: start,
      signedDate: today(),
      conditionDeadline: start,
    };
  });
  const update = (key: keyof Terms, value: unknown) =>
    setTerms((prev) => ({ ...prev, [key]: value }));
  const property = data.properties.find((p) => p.id === propertyId),
    owner = data.people.find((p) => p.id === ownerId),
    tenant = data.people.find((p) => p.id === tenantId);
  const preview: Contract | undefined =
    property && owner && tenant
      ? {
          id: "preview",
          number: initial?.number ?? "NOWA / SZKIC",
          property,
          owner,
          tenant,
          terms,
          status: "draft",
          createdAt: today(),
          events: [],
          checklist: {},
          demo: true,
        }
      : undefined;
  const input = (
    key: keyof Terms,
    label: string,
    type = "text",
    full = false,
  ) => (
    <Field
      key={key}
      label={label}
      value={String(terms[key])}
      type={type}
      full={full}
      required={type !== "textarea"}
      onChange={(v) => update(key, type === "number" ? Number(v) : v)}
    />
  );
  function next() {
    setError("");
    if (step === 0 && !property)
      return setError("Wybierz mieszkanie lub dodaj nowe.");
    if (step === 1 && !owner) return setError("Wybierz wynajmującego.");
    if (step === 2) {
      if (!tenant) return setError("Wybierz najemcę.");
      if (!terms.occupants) update("occupants", tenant.name);
    }
    if (step === 3) {
      const check = termsSchema.safeParse(terms);
      if (!check.success)
        return setError(check.error.issues.map((i) => i.message).join(" "));
      if (terms.kind === "occasional" && !owner?.privateOwner)
        return setError(
          "Ten wynajmujący nie spełnia warunku najmu okazjonalnego.",
        );
    }
    setStep((s) => Math.min(s + 1, 4));
  }
  async function save() {
    setBusy(true);
    setError("");
    try {
      await onSave({
        action: "contract",
        id: initial?.id,
        propertyId,
        ownerId,
        tenantId,
        terms,
        renewalOf: renewal?.id ?? initial?.renewalOf,
      });
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[820px]">
        <DialogHeader>
          <DialogTitle>
            {renewal
              ? "Propozycja przedłużenia"
              : initial
                ? "Edytuj szkic umowy"
                : "Nowa umowa najmu"}
          </DialogTitle>
          <DialogDescription>
            {renewal
              ? "Nowy szkic zachowa powiązanie z poprzednią umową. Nic nie zostanie automatycznie wysłane."
              : "Uzupełnij dane, sprawdź dokument i rozpocznij demonstracyjny obieg podpisów."}
          </DialogDescription>
        </DialogHeader>
        <div className="modal-body">
          <div className="wizard-steps">
            {["Mieszkanie", "Wynajmujący", "Najemca", "Warunki", "Podgląd"].map(
              (s, i) => (
                <button
                  type="button"
                  key={s}
                  disabled={i > step}
                  className={i === step ? "current" : i < step ? "done" : ""}
                  onClick={() => setStep(i)}
                >
                  {i + 1}. {s}
                </button>
              ),
            )}
          </div>
          {step < 3 && (
            <>
              <Choice
                label={["Mieszkanie", "Wynajmujący", "Najemca"][step]}
                value={[propertyId, ownerId, tenantId][step]}
                onChange={[setProperty, setOwner, setTenant][step]}
                options={
                  step === 0
                    ? data.properties.map((p) => [
                        p.id,
                        `${p.name} — ${p.address}`,
                      ])
                    : data.people
                        .filter(
                          (p) => p.role === (step === 1 ? "owner" : "tenant"),
                        )
                        .map((p) => [p.id, p.name])
                }
              />
              <button
                className="btn ghost mt-4"
                onClick={() =>
                  onAdd((["property", "owner", "tenant"] as const)[step])
                }
              >
                <Plus size={16} />
                Dodaj {["nowe mieszkanie", "wynajmującego", "najemcę"][step]}
              </button>
              {((step === 0 && property) ||
                (step === 1 && owner) ||
                (step === 2 && tenant)) && (
                <div className="notice info mt-6">
                  {step === 0
                    ? `${property?.address}, ${property?.city} · ${property?.area} m²`
                    : step === 1
                      ? `${owner?.name} · ${owner?.email}`
                      : `${tenant?.name} · ${tenant?.email}`}
                </div>
              )}
            </>
          )}
          {step === 3 && (
            <>
              <div className="form-grid">
                <Choice
                  label="Rodzaj umowy"
                  value={terms.kind}
                  onChange={(v) =>
                    setTerms((p) => ({
                      ...p,
                      kind: v as Terms["kind"],
                      signature: v === "occasional" ? "qes" : p.signature,
                    }))
                  }
                  options={[
                    ["ordinary", "Zwykła umowa najmu"],
                    ["occasional", "Najem okazjonalny"],
                  ]}
                />
                <Choice
                  label="Docelowy rodzaj podpisu"
                  value={terms.signature}
                  onChange={(v) => update("signature", v)}
                  options={
                    terms.kind === "occasional"
                      ? [["qes", "Kwalifikowany (QES)"]]
                      : [
                          ["qes", "Kwalifikowany (QES)"],
                          ["ses", "Zwykły elektroniczny (SES)"],
                        ]
                  }
                />
                {input("signedDate", "Data zawarcia", "date")}
                {input("handover", "Przekazanie lokalu", "date")}
                {input("start", "Początek najmu", "date")}
                {input("end", "Koniec najmu", "date")}
                {input("rent", "Czynsz miesięczny (zł)", "number")}
                {input("fees", "Zaliczka na opłaty (zł)", "number")}
                {input("deposit", "Kaucja (zł)", "number")}
                {input("paymentDay", "Dzień płatności (1–28)", "number")}
                {input("occupants", "Osoby zamieszkujące", "text", true)}
                {terms.kind === "occasional" && (
                  <>
                    <div className="notice field full">
                      Najem okazjonalny wymaga dodatkowych dokumentów i formy
                      pisemnej. QES nie zastępuje aktu notarialnego.
                    </div>
                    {input(
                      "alternativeAddress",
                      "Adres innego lokalu",
                      "text",
                      true,
                    )}
                    {input(
                      "alternativeOwner",
                      "Osoba wyrażająca zgodę na zamieszkanie",
                      "text",
                      true,
                    )}
                    {input(
                      "conditionDeadline",
                      "Termin dostarczenia załączników",
                      "date",
                    )}
                  </>
                )}
                {input("notes", "Dodatkowe uzgodnienia", "textarea", true)}
              </div>
              <Check
                checked={terms.insurance}
                onChange={(v) => update("insurance", v)}
              >
                Wymagaj polisy OC najemcy.
              </Check>
              <div className="notice info">
                Zwykły podpis elektroniczny może zachować formę dokumentową.
                Przy najmie dłuższym niż rok brak formy pisemnej wpływa na
                oznaczony czas umowy. Ten kreator wymaga wtedy QES.
              </div>
            </>
          )}
          {step === 4 && preview && (
            <>
              <div className="notice mb-4">
                <FileCheck2 size={17} className="inline mr-2" />
                Sprawdź treść przed zapisaniem. To uproszczony projekt oparty na
                dostarczonym wzorze; wymaga oceny przed rzeczywistym użyciem.
              </div>
              <DocumentPreview contract={preview} />
            </>
          )}
          {error && (
            <div role="alert" className="error">
              {error}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button
            className="btn"
            disabled={busy}
            onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
          >
            <ArrowLeft size={16} />
            {step === 0 ? "Anuluj" : "Wstecz"}
          </button>
          {step < 4 ? (
            <button className="btn primary" onClick={next}>
              Dalej
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn primary" disabled={busy} onClick={save}>
              {busy ? "Zapisywanie…" : "Zapisz szkic umowy"}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
