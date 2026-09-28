"use client";
import { useEffect, useState, use } from "react";
import { Home, ShieldCheck, Download, CircleCheck } from "lucide-react";
import { type Contract, money, fmtDate } from "@/lib/model";
import { DocumentPreview, Check } from "@/app/forms";
export default function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [c, setC] = useState<Contract | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [accept, setAccept] = useState(false);
  useEffect(() => {
    fetch("/api/sign/" + encodeURIComponent(token))
      .then(async (r) => {
        const b: any = await r.json();
        if (!r.ok) throw new Error(b.error);
        setC(b.contract);
      })
      .catch((e) => setError(e.message));
  }, [token]);
  async function sign() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/sign/" + encodeURIComponent(token), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptDemo: accept }),
      });
      const b: any = await r.json();
      if (!r.ok) throw new Error(b.error);
      setC(b.contract);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="sign-page">
      <div className="brand p-0">
        <span className="brandmark">
          <Home size={22} />
        </span>
        najem<small>flow</small>
      </div>
      <section className="panel">
        <span className="demo-pill">Autenti · symulacja API</span>
        <h1 className="mt-5">
          {c?.status === "signed"
            ? "Obieg demo zakończony"
            : "Twoja umowa do sprawdzenia"}
        </h1>
        <p className="muted mt-3">
          Ten ekran służy do demonstracji. Kliknięcie przycisku nie składa
          podpisu elektronicznego ani oświadczenia o zawarciu umowy.
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {!c && !error && <p className="loading">Wczytywanie dokumentu…</p>}
        {c && (
          <>
            <dl className="detail-summary">
              {[
                ["Lokal", c.property.address],
                ["Najemca", c.tenant.name],
                ["Czynsz", money(c.terms.rent)],
                [
                  "Okres",
                  `${fmtDate(c.terms.start)} – ${fmtDate(c.terms.end)}`,
                ],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <DocumentPreview contract={c} />
            <button
              className="btn mt-5"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await (await import("@/lib/pdf")).downloadPdf(c);
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Download size={17} />
              Pobierz projekt PDF
            </button>
            {c.status === "signed" ? (
              <div className="notice info mt-6">
                <CircleCheck className="inline mr-2" size={20} />
                Zapisano demonstracyjną akceptację najemcy. PDF pozostaje bez
                podpisów elektronicznych.
              </div>
            ) : (
              <>
                <Check checked={accept} onChange={setAccept}>
                  Zapoznałem się z projektem. Rozumiem, że to wyłącznie
                  symulacja i nie zawieram w ten sposób umowy.
                </Check>
                <button
                  className="btn primary w-full mt-3"
                  disabled={!accept || busy}
                  onClick={sign}
                >
                  <ShieldCheck size={18} />
                  {busy ? "Zapisywanie…" : "Symuluj podpis najemcy"}
                </button>
              </>
            )}
          </>
        )}
      </section>
      <p className="footer-note">
        Link jest ważny przez 7 dni. Może go otworzyć każda osoba znająca adres.{" "}
        <a href="/privacy">Informacje o prywatności</a>
      </p>
    </main>
  );
}
