"use client";
import { useRef, useState } from "react";
import { FileText, Pencil, Copy, Plus, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  type AgreementTemplate,
  type Terms,
  seed,
  agreementTemplateSchema,
  TEMPLATE_VERSION,
} from "@/lib/model";
import {
  templateDraft,
  TEMPLATE_TOKENS,
  validateTemplateBody,
} from "@/lib/templates";
import { Choice, Field, DocumentPreview } from "./forms";

export function TemplatesPanel({
  templates,
  onEdit,
}: {
  templates: AgreementTemplate[];
  onEdit: (template?: AgreementTemplate, kind?: Terms["kind"]) => void;
}) {
  return (
    <>
      <div className="notice info mb-6">
        Wybierz wzór standardowy lub zapisz własną wersję. Każdy własny wzór
        przypisujesz do rodzaju najmu. Edycja wzoru nie zmienia wcześniej
        zapisanych umów.
      </div>
      <h2 className="mb-4">Wzory na podstawie dokumentu źródłowego</h2>
      <div className="property-grid mb-8">
        {(["ordinary", "occasional"] as const).map((kind) => (
          <div className="property-card" key={kind}>
            <FileText className="mb-4" />
            <span className="status">Standardowy · 11 paragrafów</span>
            <h2 className="mt-4">
              {kind === "ordinary" ? "Zwykła umowa najmu" : "Najem okazjonalny"}
            </h2>
            <p>
              {kind === "ordinary"
                ? "Pełna umowa mieszkalna: płatności, obowiązki, naprawy i zwrot lokalu."
                : "Warunek zawieszający, dokumenty notarialne, inny lokal i obowiązki wynajmującego."}
            </p>
            <button
              className="btn ghost mt-5"
              onClick={() => onEdit(undefined, kind)}
            >
              <Copy size={16} />
              Edytuj własną kopię
            </button>
          </div>
        ))}
      </div>
      <h2 className="mb-4">Twoje wzory ({templates.length})</h2>
      {!templates.length ? (
        <div className="panel empty-state">
          <FileText className="mx-auto" />
          <h3>Tu zapiszesz własne umowy</h3>
          <p>Skopiuj pełny wzór lub wklej tekst swojej umowy z Worda.</p>
          <button className="btn primary mt-4" onClick={() => onEdit()}>
            <Plus />
            Dodaj własny wzór
          </button>
        </div>
      ) : (
        <div className="property-grid">
          {templates.map((t) => (
            <div className="property-card" key={t.id}>
              <span className="status">
                {t.kind === "ordinary" ? "Najem zwykły" : "Najem okazjonalny"}
              </span>
              <h2 className="mt-4">{t.name}</h2>
              <p>
                Aktualizacja:{" "}
                {new Date(t.updatedAt).toLocaleDateString("pl-PL")}
              </p>
              <p>
                {t.body.length.toLocaleString("pl-PL")} znaków · pola
                uzupełniane z formularza
              </p>
              <button className="btn ghost mt-5" onClick={() => onEdit(t)}>
                <Pencil />
                Edytuj wzór
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
export function TemplateEditor({
  initial,
  kind = "ordinary",
  onClose,
  onSave,
}: {
  initial?: AgreementTemplate;
  kind?: Terms["kind"];
  onClose: () => void;
  onSave: (input: unknown) => Promise<unknown>;
}) {
  const [draft, setDraft] = useState(
    () =>
      initial ?? {
        id: "",
        name:
          kind === "ordinary"
            ? "Mój wzór — najem zwykły"
            : "Mój wzór — najem okazjonalny",
        kind,
        body: templateDraft(kind),
        updatedAt: "",
      },
  );
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [token, setToken] = useState("najemca");
  const area = useRef<HTMLTextAreaElement>(null);
  const c = structuredClone(
    seed().contracts[draft.kind === "occasional" ? 2 : 0],
  );
  c.templateVersion = TEMPLATE_VERSION;
  c.templateSnapshot = draft;
  let validation = "";
  try {
    validateTemplateBody(draft.body);
  } catch (e) {
    validation = (e as Error).message;
  }
  function insert() {
    const field = area.current;
    const start = field?.selectionStart ?? draft.body.length,
      end = field?.selectionEnd ?? start;
    const value = "{{" + token + "}}";
    setDraft({
      ...draft,
      body: draft.body.slice(0, start) + value + draft.body.slice(end),
    });
    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(start + value.length, start + value.length);
    });
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[1080px]">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Edytuj wzór umowy" : "Dodaj własny wzór"}
          </DialogTitle>
          <DialogDescription>
            Treść zwykłym tekstem, bez makr i HTML. Pola w podwójnych nawiasach
            uzupełniają się danymi z kreatora umowy.
          </DialogDescription>
        </DialogHeader>
        <div className="modal-body">
          <div className="form-grid">
            <Field
              label="Nazwa wzoru"
              value={draft.name}
              required
              onChange={(name) => setDraft({ ...draft, name })}
            />
            <Choice
              label="Rodzaj najmu"
              value={draft.kind}
              onChange={(kind) =>
                setDraft({ ...draft, kind: kind as Terms["kind"] })
              }
              options={[
                ["ordinary", "Najem zwykły"],
                ["occasional", "Najem okazjonalny"],
              ]}
            />
          </div>
          <p className="small muted mb-4">
            Zmiana przypisania rodzaju nie przerabia treści. Sprawdź, czy zapisy
            umowy pasują do wybranego rodzaju najmu. Przy edycji szkicu umowy
            pobierana jest aktualna treść wybranego wzoru.
          </p>
          <Tabs defaultValue="edit">
            <TabsList>
              <TabsTrigger value="edit">Edytor treści</TabsTrigger>
              <TabsTrigger value="preview">Podgląd na danych demo</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <div className="template-tools">
                <Choice
                  label="Pole do wstawienia"
                  value={token}
                  onChange={setToken}
                  options={TEMPLATE_TOKENS.map((t) => [t, "{{" + t + "}}"])}
                />
                <button className="btn" onClick={insert}>
                  <Plus size={16} />
                  Wstaw w miejscu kursora
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    const url = URL.createObjectURL(
                      new Blob([draft.body], {
                        type: "text/plain;charset=utf-8",
                      }),
                    );
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "wzor-umowy.txt";
                    a.click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }}
                >
                  <Download size={16} />
                  Pobierz TXT
                </button>
              </div>
              <label className="field full">
                <span>Treść wzoru</span>
                <textarea
                  ref={area}
                  className="template-source"
                  maxLength={65000}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </label>
              <p className="small muted">
                Możesz zaznaczyć całą treść i wkleić własną umowę z Worda. Pola
                zaczynające się od „postanowienie_” wstawiają klauzule zgodne z
                opcjami formularza. Własny tekst zastępuje standardowe
                paragrafy.
              </p>
              <p className="small muted">
                {draft.body.length.toLocaleString("pl-PL")} / 65 000 znaków
              </p>
            </TabsContent>
            <TabsContent value="preview">
              {validation ? (
                <p className="error">{validation}</p>
              ) : (
                <DocumentPreview contract={c} />
              )}
            </TabsContent>
          </Tabs>
          {(error || validation) && (
            <p className="error" role="alert">
              {error || validation}
            </p>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn" disabled={busy} onClick={onClose}>
            Anuluj
          </button>
          <button
            className="btn primary"
            disabled={busy || !!validation}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const parsed = agreementTemplateSchema.safeParse(draft);
                if (!parsed.success)
                  throw new Error(
                    parsed.error.issues.map((i) => i.message).join(" "),
                  );
                await onSave({ action: "template", data: parsed.data });
                toast.success("Zapisano wzór w Twojej przestrzeni.");
                onClose();
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Zapisywanie…" : "Zapisz wzór"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
