"use client";
import { useState, useEffect } from "react";
import {
  Building2,
  LayoutDashboard,
  FileText,
  Users,
  Plug,
  Plus,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  CalendarClock,
  Wallet,
  CircleCheck,
  Home,
  LogIn,
  LogOut,
  Search,
  RefreshCw,
  Pencil,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  seed,
  money,
  statusLabel,
  fmtDate,
  daysLeft,
  today,
  type Contract,
  type Workspace,
  type Person,
  type Property,
} from "@/lib/model";
import { EntityDialog, ContractWizard } from "./forms";
import ContractDetail from "./contract-detail";

export default function Dashboard({ demo = true }: { demo?: boolean }) {
  const [view, setView] = useState("Przegląd"),
    [data, setData] = useState<Workspace>(seed),
    [loading, setLoading] = useState(!demo),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all");
  const [entity, setEntity] = useState<{
      kind: "property" | "owner" | "tenant";
      initial?: Property | Person;
    } | null>(null),
    [wizard, setWizard] = useState<{
      initial?: Contract;
      renewal?: Contract;
    } | null>(null),
    [selected, setSelected] = useState<string | null>(null);
  const active = data.contracts.filter(
    (c) =>
      c.status === "signed" &&
      daysLeft(c.terms.end) >= 0 &&
      c.terms.start <= today(),
  );
  const ending = active.filter((c) => daysLeft(c.terms.end) <= 60);
  const nav = [
    ["Przegląd", LayoutDashboard],
    ["Mieszkania", Building2],
    ["Umowy", FileText],
    ["Osoby", Users],
    ["Podpisy i integracje", Plug],
  ] as const;
  async function load() {
    if (demo) return;
    setLoading(true);
    setError("");
    try {
      let response = await fetch("/api/workspace");
      let result: any = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (!result.state) {
        response = await fetch("/api/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "initialize" }),
        });
        result = await response.json();
        if (!response.ok) throw new Error(result.error);
      }
      setData(result.state);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, [demo]);
  useEffect(() => {
    const d = document as Document & {
      modelContext?: {
        registerTool: (
          tool: unknown,
          options: { signal: AbortSignal },
        ) => Promise<void>;
      };
    };
    if (!d.modelContext) return;
    const controller = new AbortController();
    Promise.resolve(
      d.modelContext.registerTool(
        {
          name: "open_rental_view",
          title: "Otwórz widok najmu",
          description:
            "Nawigacja do przeglądu, mieszkań, umów, osób lub integracji. Nie zmienia danych.",
          inputSchema: {
            type: "object",
            properties: {
              view: {
                type: "string",
                enum: [
                  "Przegląd",
                  "Mieszkania",
                  "Umowy",
                  "Osoby",
                  "Podpisy i integracje",
                ],
              },
            },
            required: ["view"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true },
          execute: async (input: unknown) => {
            const v = (input as { view?: string })?.view;
            if (!nav.some(([name]) => name === v))
              throw new Error("Nieznany widok.");
            setView(v!);
            await new Promise((resolve) => requestAnimationFrame(resolve));
            return { view: v };
          },
        },
        { signal: controller.signal },
      ),
    ).catch(() => {});
    return () => controller.abort();
  }, []);
  function guarded(fn: () => void) {
    if (demo) {
      toast.info(
        "Zaloguj się przez przycisk w prawym górnym rogu, aby zapisywać dane i testować podpisy.",
      );
      return;
    }
    fn();
  }
  async function action(input: unknown) {
    if (demo)
      throw new Error("Zaloguj się, aby przećwiczyć obieg na swoim koncie.");
    const response = await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...(input as object), version: data.version }),
    });
    const result: any = await response.json();
    if (!response.ok) throw new Error(result.error || "Nie udało się zapisać.");
    setData(result.state);
    return result;
  }
  function navigate(v: string) {
    setView(v);
    setSearch("");
    setFilter("all");
  }
  const contract = selected
    ? data.contracts.find((c) => c.id === selected)
    : null;
  function newContract() {
    guarded(() => setWizard({}));
  }
  function renew(c: Contract) {
    guarded(() => {
      setSelected(null);
      setWizard({ renewal: c });
    });
  }
  function row(c: Contract) {
    return (
      <button
        type="button"
        className="contract-row"
        key={c.id}
        onClick={() => setSelected(c.id)}
      >
        <span className="property-icon">
          <Building2 size={21} />
        </span>
        <div>
          <h3>{c.property.name}</h3>
          <p>
            {c.tenant.name} ·{" "}
            {c.terms.kind === "occasional" ? "Okazjonalna" : "Zwykła"}
          </p>
        </div>
        <div className="row-meta">
          <span className={"status " + c.status}>{statusLabel(c)}</span>
          <p>{money(c.terms.rent)} / mies.</p>
        </div>
      </button>
    );
  }
  const filtered = data.contracts.filter(
    (c) =>
      `${c.number} ${c.property.name} ${c.tenant.name}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "signed" && c.status === "signed") ||
        (filter === "draft" && c.status === "draft") ||
        (filter === "sent" && ["sent", "owner_signed"].includes(c.status)) ||
        (filter === "ending" &&
          c.status === "signed" &&
          daysLeft(c.terms.end) >= 0 &&
          daysLeft(c.terms.end) <= 60)),
  );
  const activity = data.contracts
    .flatMap((c) => c.events.map((e, i) => ({ ...e, contract: c, index: i })))
    .sort((a, b) => b.date.localeCompare(a.date) || b.index - a.index)
    .slice(0, 4);
  return (
    <SidebarProvider>
      <Toaster position="bottom-right" />
      <Sidebar>
        <SidebarContent>
          <div className="brand">
            <span className="brandmark">
              <Home size={22} />
            </span>
            najem<small>flow</small>
          </div>
          <div className="side-section eyebrow">Twoja przestrzeń</div>
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              className={"nav-item " + (view === name ? "active" : "")}
              onClick={() => navigate(name)}
            >
              <Icon size={19} />
              {name}
            </button>
          ))}
        </SidebarContent>
        <SidebarFooter className="side-bottom">
          <div className="side-tip">
            <ShieldCheck size={23} />
            <strong>Od kluczy do podpisu.</strong>Cały najem w jednym miejscu.
          </div>
          <div className="flex items-center gap-3 pt-5">
            <span className="avatar">NF</span>
            <div className="small">
              {demo ? "Przestrzeń demo" : "Twoja przestrzeń"}
              <p className="text-xs text-slate-400">Panel wynajmującego</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="topbar">
          <SidebarTrigger className="mobile-only" />
          <div className="path">
            Panel wynajmującego
            <ChevronRight size={14} />
            <strong>{view}</strong>
          </div>
          <div className="top-actions">
            <span className="demo-pill">Podpisy w trybie demo</span>
            {!demo && (
              <button
                aria-label="Odśwież dane"
                className="btn"
                onClick={load}
                disabled={loading}
              >
                <RefreshCw size={16} />
              </button>
            )}
            <a
              className="btn"
              target="_top"
              href={demo ? "/login" : "/signout-with-chatgpt?return_to=%2F"}
            >
              {demo ? <LogIn size={16} /> : <LogOut size={16} />}{" "}
              {demo ? "Zaloguj się" : "Wyloguj"}
            </a>
          </div>
        </header>
        <main className="workspace">
          <div className="page-heading">
            <div>
              <h1>{view === "Przegląd" ? "Twój najem pod kontrolą" : view}</h1>
              <p>
                {
                  (
                    {
                      Przegląd:
                        "Mieszkania, umowy i podpisy. Wszystko w swoim miejscu.",
                      Mieszkania: "Twoje lokale, gotowe do kolejnej umowy.",
                      Umowy: "Od pierwszego szkicu do przekazania kluczy.",
                      Osoby: "Dane stron dostępne przy tworzeniu każdej umowy.",
                      "Podpisy i integracje":
                        "Przećwicz obieg, a potem podłącz wybranego dostawcę.",
                    } as Record<string, string>
                  )[view]
                }
              </p>
            </div>
            <button
              className="btn primary"
              onClick={
                view === "Mieszkania"
                  ? () => guarded(() => setEntity({ kind: "property" }))
                  : view === "Osoby"
                    ? () => guarded(() => setEntity({ kind: "tenant" }))
                    : newContract
              }
            >
              <Plus />
              {view === "Mieszkania"
                ? "Dodaj mieszkanie"
                : view === "Osoby"
                  ? "Dodaj najemcę"
                  : "Nowa umowa"}
            </button>
          </div>
          {demo ? (
            <div className="intro-strip">
              <p>
                <ShieldCheck size={18} />
                Poznaj panel na fikcyjnych danych. Zaloguj się, aby zapisywać
                własne zmiany.
              </p>
              <a href="/login" className="btn ghost">
                Otwórz swój panel
                <ArrowUpRight size={16} />
              </a>
            </div>
          ) : (
            <div className="intro-strip">
              <p>
                <ShieldCheck size={18} />
                Wersja testowa · Dane zapisują się na Twoim koncie. Używaj
                wyłącznie fikcyjnych danych.
              </p>
              <button
                className="btn ghost"
                onClick={() => navigate("Podpisy i integracje")}
              >
                Jak działają podpisy
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}
          {error && (
            <div role="alert" className="error">
              {error}{" "}
              <button className="btn ml-3" onClick={load}>
                Spróbuj ponownie
              </button>
            </div>
          )}
          {loading ? (
            <div className="loading">Wczytywanie Twojej przestrzeni…</div>
          ) : (
            !error && (
              <>
                {view === "Przegląd" && (
                  <>
                    <div className="metrics">
                      {[
                        [
                          Building2,
                          "Mieszkania",
                          data.properties.length,
                          "Lokale w Twoim portfelu",
                        ],
                        [
                          FileText,
                          "Aktywne umowy",
                          active.length,
                          "Zakończony obieg demo",
                        ],
                        [
                          Wallet,
                          "Miesięczny czynsz",
                          money(active.reduce((s, c) => s + c.terms.rent, 0)),
                          "Kwoty umowne · bez mediów",
                        ],
                        [
                          CalendarClock,
                          "Kończą się wkrótce",
                          ending.length,
                          "W ciągu najbliższych 60 dni",
                        ],
                      ].map(([Icon, label, value, note]) => {
                        const I = Icon as typeof Building2;
                        return (
                          <div className="metric" key={String(label)}>
                            <div className="metric-top">
                              {String(label)}
                              <I className="metric-icon" size={34} />
                            </div>
                            <div className="metric-value">{String(value)}</div>
                            <small>{String(note)}</small>
                          </div>
                        );
                      })}
                    </div>
                    <div className="dashboard-grid">
                      <div>
                        <section className="panel">
                          <div className="panel-header">
                            <div>
                              <h2>Twoje umowy</h2>
                              <small>Ostatnio dodane dokumenty</small>
                            </div>
                            <button
                              onClick={() => navigate("Umowy")}
                              className="btn ghost"
                            >
                              Wszystkie
                              <ChevronRight size={15} />
                            </button>
                          </div>
                          <div className="contract-list">
                            {data.contracts
                              .slice()
                              .reverse()
                              .slice(0, 4)
                              .map(row)}
                          </div>
                          <div className="workflow">
                            <span>
                              <Building2 size={14} />
                              Mieszkanie
                            </span>
                            <ChevronRight size={12} />
                            <span>
                              <Users size={14} />
                              Strony
                            </span>
                            <ChevronRight size={12} />
                            <span>
                              <FileText size={14} />
                              Umowa
                            </span>
                            <ChevronRight size={12} />
                            <span>
                              <CircleCheck size={14} />
                              Podpisy
                            </span>
                          </div>
                        </section>
                        <section className="panel section-space">
                          <div className="panel-header">
                            <h2>Mieszkania w Twoim portfelu</h2>
                            <button
                              className="btn ghost"
                              onClick={() => navigate("Mieszkania")}
                            >
                              Zobacz lokale
                              <ChevronRight size={15} />
                            </button>
                          </div>
                          <div className="contract-list">
                            {data.properties.slice(0, 3).map((p) => (
                              <button
                                onClick={() => navigate("Mieszkania")}
                                className="contract-row"
                                key={p.id}
                              >
                                <span className="property-icon">
                                  <Building2 size={20} />
                                </span>
                                <div>
                                  <h3>{p.name}</h3>
                                  <p>
                                    {p.address} · {p.area} m²
                                  </p>
                                </div>
                                <span className="muted small">
                                  {p.rooms} pok.
                                </span>
                              </button>
                            ))}
                          </div>
                        </section>
                      </div>
                      <aside className="dashboard-aside">
                        <section className="panel">
                          <div className="panel-header">
                            <h2>Warto się tym zająć</h2>
                            <CalendarClock size={19} className="muted" />
                          </div>
                          {ending.length ? (
                            ending.map((c) => (
                              <div key={c.id} className="renew-card">
                                <span className="status sent">
                                  Koniec za {daysLeft(c.terms.end)} dni
                                </span>
                                <h3>{c.property.name}</h3>
                                <p>
                                  {c.tenant.name}
                                  <br />
                                  Umowa do {fmtDate(c.terms.end)}
                                </p>
                                <button
                                  onClick={() => renew(c)}
                                  className="btn"
                                >
                                  Zaproponuj przedłużenie
                                  <ArrowUpRight size={15} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="renew-card small muted">
                              Żadna aktywna umowa nie kończy się w ciągu 60 dni.
                            </div>
                          )}
                        </section>
                        <section className="panel section-space">
                          <div className="panel-header">
                            <h2>Ostatnia aktywność</h2>
                          </div>
                          <div className="timeline">
                            {activity.map((e, i) => (
                              <div key={i} className="timeline-item">
                                {e.text}
                                <strong className="block mt-1 font-medium">
                                  {e.contract.property.name}
                                </strong>
                                <small>{fmtDate(e.date)}</small>
                              </div>
                            ))}
                          </div>
                        </section>
                      </aside>
                    </div>
                  </>
                )}
                {view === "Mieszkania" && (
                  <div className="property-grid">
                    {data.properties.map((p) => (
                      <div className="property-card" key={p.id}>
                        <div className="flex justify-between">
                          <div className="property-icon">
                            <Building2 />
                          </div>
                          <button
                            className="btn ghost"
                            aria-label={"Edytuj " + p.name}
                            onClick={() =>
                              guarded(() =>
                                setEntity({ kind: "property", initial: p }),
                              )
                            }
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                        <h2>{p.name}</h2>
                        <p>
                          {p.address}
                          <br />
                          {p.postalCode} {p.city}
                        </p>
                        <footer>
                          <span>
                            {p.area} m² · {p.rooms} pok.
                          </span>
                          <span>{p.title}</span>
                        </footer>
                        <p>{p.equipment}</p>
                      </div>
                    ))}
                  </div>
                )}
                {view === "Osoby" && (
                  <>
                    <div className="table-tools">
                      <p className="small muted">
                        {data.people.length} zapisane osoby
                      </p>
                      <button
                        className="btn"
                        onClick={() =>
                          guarded(() => setEntity({ kind: "owner" }))
                        }
                      >
                        <Plus />
                        Dodaj wynajmującego
                      </button>
                    </div>
                    <div className="property-grid">
                      {data.people.map((p) => (
                        <div className="property-card" key={p.id}>
                          <div className="flex justify-between mb-4">
                            <span className="avatar">
                              {p.name
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")}
                            </span>
                            <span className="status">
                              {p.role === "owner" ? "Wynajmujący" : "Najemca"}
                            </span>
                          </div>
                          <h2>{p.name}</h2>
                          <p>
                            {p.email}
                            <br />
                            {p.address}
                          </p>
                          <button
                            onClick={() =>
                              guarded(() =>
                                setEntity({ kind: p.role, initial: p }),
                              )
                            }
                            className="btn ghost mt-5"
                          >
                            <Pencil />
                            Edytuj dane
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {view === "Umowy" && (
                  <>
                    <div className="table-tools">
                      <label className="search">
                        <Search />
                        <input
                          aria-label="Szukaj umowy"
                          placeholder="Szukaj mieszkania lub najemcy…"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </label>
                      <Tabs value={filter} onValueChange={setFilter}>
                        <TabsList className="flex-wrap h-auto">
                          <TabsTrigger value="all">Wszystkie</TabsTrigger>
                          <TabsTrigger value="draft">Szkice</TabsTrigger>
                          <TabsTrigger value="sent">Do podpisu</TabsTrigger>
                          <TabsTrigger value="signed">
                            Podpisane demo
                          </TabsTrigger>
                          <TabsTrigger value="ending">Wygasające</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="panel table-wrap">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Umowa / mieszkanie</TableHead>
                            <TableHead>Najemca</TableHead>
                            <TableHead>Okres najmu</TableHead>
                            <TableHead>Czynsz</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>
                              <span className="sr-only">Akcje</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>
                                <strong>{c.property.name}</strong>
                                <small>
                                  {c.number} ·{" "}
                                  {c.terms.kind === "ordinary"
                                    ? "Zwykła"
                                    : "Okazjonalna"}
                                  {c.renewalOf ? " · Przedłużenie" : ""}
                                </small>
                              </TableCell>
                              <TableCell>{c.tenant.name}</TableCell>
                              <TableCell>
                                {fmtDate(c.terms.start)}
                                <small>do {fmtDate(c.terms.end)}</small>
                              </TableCell>
                              <TableCell>{money(c.terms.rent)}</TableCell>
                              <TableCell>
                                <span className={"status " + c.status}>
                                  {statusLabel(c)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <button
                                  className="btn ghost"
                                  onClick={() => setSelected(c.id)}
                                >
                                  Otwórz
                                  <ChevronRight size={15} />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {!filtered.length && (
                        <div className="empty-state">
                          <FileText className="mx-auto" />
                          <h3>Nie znaleziono umów</h3>
                          <p>Zmień filtr lub utwórz nową umowę.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {view === "Podpisy i integracje" && <Integrations />}
              </>
            )
          )}
          <p className="footer-note">
            Najem Flow · Podpisy demonstracyjne nie wywołują skutków prawnych.{" "}
            <a className="underline" href="/privacy">
              Prywatność i ograniczenia
            </a>
          </p>
        </main>
      </SidebarInset>
      {entity && (
        <EntityDialog
          kind={entity.kind}
          initial={entity.initial}
          onClose={() => setEntity(null)}
          onSave={async (a) => {
            const result = await action(a);
            toast.success("Zapisano dane.");
            return result;
          }}
        />
      )}
      {wizard && (
        <ContractWizard
          data={data}
          initial={wizard.initial}
          renewal={wizard.renewal}
          onClose={() => setWizard(null)}
          onAdd={(kind) => setEntity({ kind })}
          onSave={async (a) => {
            const result = await action(a);
            setSelected(result.contractId);
            toast.success("Szkic umowy został zapisany.");
            return result;
          }}
        />
      )}
      {contract && !wizard && (
        <ContractDetail
          key={contract.id}
          contract={contract}
          demo={demo}
          onClose={() => setSelected(null)}
          onAction={action}
          onEdit={() => guarded(() => setWizard({ initial: contract }))}
          onRenew={() => renew(contract)}
        />
      )}
    </SidebarProvider>
  );
}
function Integrations() {
  return (
    <>
      <div className="panel p-6 mb-6">
        <div className="flex justify-between gap-4">
          <div>
            <h2>Autenti — obieg demonstracyjny</h2>
            <p className="muted small mt-2">
              Wynajmujący → link dla najemcy → akceptacja → zakończenie obiegu
            </p>
          </div>
          <span className="status signed h-fit">Symulacja włączona</span>
        </div>
        <p className="small mt-5">
          Możesz podpisać w trybie demo zarówno zwykłą umowę najmu, jak i umowę
          okazjonalną. Rzeczywiste połączenie z Autenti zostanie dodane w
          kolejnej wersji po uzyskaniu konta, dostępu API i konfiguracji
          podpisów.
        </p>
        <div className="notice mt-5">
          Najem okazjonalny wymaga formy pisemnej pod rygorem nieważności. QES
          może zachować tę formę, ale oświadczenie najemcy o poddaniu się
          egzekucji nadal wymaga aktu notarialnego. Dla najmu zwykłego na okres
          dłuższy niż rok brak formy pisemnej oznacza traktowanie umowy jako
          zawartej na czas nieoznaczony.{" "}
          <a
            className="underline"
            href="https://eli.gov.pl/api/acts/DU/2023/725/text.html"
            target="_blank"
            rel="noreferrer"
          >
            Ustawa
          </a>{" "}
          ·{" "}
          <a
            className="underline"
            href="https://eli.gov.pl/api/acts/DU/2023/1610/text.html"
            target="_blank"
            rel="noreferrer"
          >
            Kodeks cywilny
          </a>
        </div>
      </div>
      <div className="integration-grid">
        {[
          [
            "Autenti",
            "Platforma do obiegu dokumentów i różnych poziomów podpisu, w tym QES. Wymaga umowy API, danych dostępowych i konfiguracji wybranego procesu.",
            "https://developers.autenti.com/",
            "Wybrany kierunek integracji",
          ],
          [
            "SIGNIUS",
            "REST API, kolejność podpisujących, powiadomienia o statusie i pobranie podpisanego PDF. Dostępne podpisy kwalifikowane.",
            "https://docs.signius.eu/api",
            "Alternatywa",
          ],
          [
            "Certum SimplySign",
            "Kwalifikowany podpis w chmurze z możliwością integracji API. Zakres integracji i proces certyfikacji należy uzgodnić z Certum.",
            "https://www.certum.pl/pl/simplysign/",
            "Alternatywa",
          ],
          [
            "KIR mSzafir",
            "Mobilny podpis kwalifikowany. Warunki integracji i obsługę wielostronnego obiegu trzeba potwierdzić z KIR.",
            "https://www.mszafir.pl/",
            "Do uzgodnienia z dostawcą",
          ],
          [
            "Yousign / Youtrust",
            "API podpisów elektronicznych, w tym kwalifikowanych. Przed wyborem sprawdź dostępność identyfikacji podpisujących i warunki dla Polski.",
            "https://developers.youtrust.com/docs/qualified-signature",
            "Alternatywa",
          ],
        ].map(([name, description, url, status]) => (
          <div key={name} className="integration-card">
            <div className="flex justify-between gap-3">
              <h2>{name}</h2>
              <Plug size={21} className="muted" />
            </div>
            <span className="status">{status}</span>
            <p>{description}</p>
            <a
              className="btn ghost"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              Informacje dostawcy
              <ArrowUpRight size={16} />
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
