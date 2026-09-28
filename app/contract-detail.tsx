"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, PenLine, Link2, Copy, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { type Contract, money, fmtDate, statusLabel } from "@/lib/model";
import { Check, DocumentPreview } from "./forms";
export default function ContractDetail({
  contract: c,
  onClose,
  onAction,
  onEdit,
  onRenew,
  demo,
}: {
  contract: Contract;
  onClose: () => void;
  onAction: (a: unknown) => Promise<any>;
  onEdit: () => void;
  onRenew: () => void;
  demo: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [link, setLink] = useState(""),
    [confirmed, setConfirmed] = useState(false);
  async function run(action: string, extra: Record<string, unknown> = {}) {
    setError("");
    setBusy(true);
    try {
      const result = await onAction({ action, id: c.id, ...extra });
      if (result?.signingPath) setLink(location.origin + result.signingPath);
      return result;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function pdf() {
    setBusy(true);
    try {
      await (await import("@/lib/pdf")).downloadPdf(c);
      toast.success("Pobrano PDF demonstracyjny.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const stages = ["Szkic", "Wynajmujący", "Najemca", "Zakończono"];
  const progress = ["draft", "owner_signed", "sent", "signed"].indexOf(
    c.status,
  );
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full sm:max-w-[760px] overflow-y-auto p-6 sm:p-8">
        <SheetHeader className="p-0">
          <SheetTitle className="text-2xl">{c.property.name}</SheetTitle>
          <SheetDescription>
            {c.number} ·{" "}
            {c.terms.kind === "occasional"
              ? "Najem okazjonalny"
              : "Zwykła umowa najmu"}
            {c.renewalOf ? " · Propozycja przedłużenia" : ""}
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-between mt-5">
          <span className={"status " + c.status}>{statusLabel(c)}</span>
          <span className="demo-pill">Autenti · symulacja</span>
        </div>
        <div className="progress-bars">
          {stages.map((s, i) => (
            <span key={s} className={i <= progress ? "filled" : ""} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          {stages.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <dl className="detail-summary">
          {[
            ["Najemca", c.tenant.name],
            ["Wynajmujący", c.owner.name],
            [
              "Okres najmu",
              `${fmtDate(c.terms.start)} – ${fmtDate(c.terms.end)}`,
            ],
            ["Czynsz / miesiąc", money(c.terms.rent)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <Tabs defaultValue="flow">
          <TabsList className="w-full">
            <TabsTrigger value="flow">Obieg podpisów</TabsTrigger>
            <TabsTrigger value="document">Dokument</TabsTrigger>
            <TabsTrigger value="checklist">Checklista</TabsTrigger>
          </TabsList>
          <TabsContent value="flow" className="pt-5">
            <div className="notice">
              To symulacja API Autenti. Nie kontaktuje się z dostawcą, nie
              wysyła e-maili i nie tworzy prawnie skutecznych podpisów.
            </div>
            {demo && (
              <p className="small muted mt-4">
                Zaloguj się, aby przećwiczyć obieg na swoim koncie.
              </p>
            )}
            {c.status === "draft" && (
              <>
                <h3 className="mt-6">1. Podpis wynajmującego</h3>
                <p className="small muted mt-2">
                  Po tym kroku treść zostanie zablokowana, tak jak przy
                  rzeczywistym wysłaniu dokumentu do podpisu.
                </p>
                <Check checked={confirmed} onChange={setConfirmed}>
                  Sprawdziłem treść. Rozumiem, że jest to wyłącznie symulacja
                  podpisu.
                </Check>
                <button
                  className="btn primary"
                  disabled={busy || !confirmed}
                  onClick={() => run("owner-sign")}
                >
                  <PenLine />
                  Symuluj podpis wynajmującego
                </button>
                <button className="btn ml-2 mt-2" onClick={onEdit}>
                  Edytuj szkic
                </button>
              </>
            )}
            {(c.status === "owner_signed" || c.status === "sent") && (
              <>
                <h3 className="mt-6">2. Link dla najemcy</h3>
                <p className="small muted mt-2">
                  Przygotuj link i przekaż go ręcznie najemcy. Link jest ważny 7
                  dni; każda osoba, która go zna, może zobaczyć dokument i
                  ukończyć symulację. Używaj wyłącznie fikcyjnych danych.
                </p>
                <button
                  className="btn primary mt-4"
                  disabled={busy}
                  onClick={() => run("invite")}
                >
                  <Link2 />
                  {c.status === "sent"
                    ? "Utwórz kolejny link demo"
                    : "Przygotuj link demo dla najemcy"}
                </button>
                {link && (
                  <div className="mt-4">
                    <label className="field">
                      Link demonstracyjny
                      <input readOnly value={link} />
                    </label>
                    <div className="action-line">
                      <button
                        className="btn"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(link);
                            toast.success("Skopiowano link.");
                          } catch {
                            toast.error(
                              "Zaznacz i skopiuj link z pola powyżej.",
                            );
                          }
                        }}
                      >
                        <Copy />
                        Kopiuj link
                      </button>
                      <a
                        className="btn"
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Otwórz widok najemcy
                        <ArrowUpRight />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
            {c.status === "signed" && (
              <>
                <div className="notice info mt-5">
                  Obieg demonstracyjny zakończony. PDF nadal jest projektem bez
                  podpisów elektronicznych.{" "}
                  {c.terms.kind === "occasional"
                    ? "Zakończenie obiegu nie potwierdza spełnienia warunku zawieszającego ani kompletności załączników."
                    : ""}
                </div>
                <button onClick={onRenew} className="btn primary mt-5">
                  Zaproponuj przedłużenie
                  <ArrowUpRight />
                </button>
              </>
            )}
            {c.renewalOf && (
              <a
                className="btn mt-4"
                href={`mailto:${encodeURIComponent(c.tenant.email)}?subject=${encodeURIComponent("Propozycja przedłużenia najmu — DEMO")}&body=${encodeURIComponent(`Dzień dobry,\nproponuję przedłużenie najmu lokalu ${c.property.address} od ${fmtDate(c.terms.start)} do ${fmtDate(c.terms.end)}, za czynsz ${money(c.terms.rent)} miesięcznie.\nTo wiadomość demonstracyjna, a nie zawarcie umowy.\nProszę o informację, czy warunki są odpowiednie.`)}`}
              >
                Przygotuj e-mail z propozycją
              </a>
            )}
            <h3 className="mt-8 mb-5">Historia umowy</h3>
            <div className="timeline">
              {c.events
                .slice()
                .reverse()
                .map((e, i) => (
                  <div key={i} className="timeline-item">
                    {e.text}
                    <small>{fmtDate(e.date)}</small>
                  </div>
                ))}
            </div>
            {!["signed", "cancelled"].includes(c.status) && (
              <button
                disabled={busy}
                className="btn ghost mt-5"
                onClick={() => run("cancel")}
              >
                Anuluj ten obieg demo
              </button>
            )}
          </TabsContent>
          <TabsContent value="document" className="pt-5">
            <button disabled={busy} className="btn primary mb-5" onClick={pdf}>
              <Download />
              Pobierz PDF
            </button>
            <DocumentPreview contract={c} />
          </TabsContent>
          <TabsContent value="checklist" className="pt-5">
            <p className="small muted">
              Lista kontrolna to Twoje notatki. Nie zastępuje dokumentów i nie
              potwierdza ich poprawności prawnej.
            </p>
            {[
              ...(c.terms.kind === "occasional"
                ? [
                    [
                      "notary",
                      "Oświadczenie najemcy w formie aktu notarialnego",
                    ],
                    ["alternative", "Wskazanie innego lokalu"],
                    [
                      "consent",
                      "Zgoda osoby z tytułem prawnym do innego lokalu",
                    ],
                    [
                      "tax",
                      "Zgłoszenie umowy do urzędu skarbowego (14 dni od rozpoczęcia najmu)",
                    ],
                  ]
                : []),
              ["deposit", "Wpłata kaucji"],
              ["handover", "Protokół zdawczo-odbiorczy"],
              ["energy", "Przekazanie świadectwa energetycznego"],
            ].map(([key, label]) => (
              <Check
                key={key}
                checked={!!c.checklist[key]}
                onChange={(v) => {
                  if (!busy) run("check", { key, value: v });
                }}
              >
                {label}
              </Check>
            ))}
          </TabsContent>
        </Tabs>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
