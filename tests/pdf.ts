import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { seed } from "../lib/model";
import { generatePdf } from "../lib/pdf";
import { contractSections } from "../lib/contract";
import {
  templateDraft,
  renderTemplate,
  validateTemplateBody,
} from "../lib/templates";
import { fullContractSections } from "../lib/contract-v2";
import { contractSections as legacySections } from "../lib/contract-v1";
const c = seed().contracts[0];
const font = new Uint8Array(await readFile("public/fonts/DejaVuSans.ttf"));
await mkdir("outputs", { recursive: true });
for (const kind of ["ordinary", "occasional"] as const) {
  c.terms.kind = kind;
  c.terms.alternativeAddress = "ul. Przykładowa 999, Miasto Demo";
  c.terms.alternativeOwner = "Żaneta Przykładowa";
  c.tenant.name = "Żaneta Łącka — dane fikcyjne";
  const bytes = await generatePdf(c, font);
  const document = await PDFDocument.load(bytes);
  assert.ok(document.getPageCount() >= 6);
  assert.ok(document.getTitle()?.includes("DEMO"));
  await writeFile(`outputs/${kind}-demo.pdf`, bytes);
  const sections = contractSections(c)
    .map((s) => s.title)
    .join(" ");
  assert.equal(
    sections.includes("warunek zawieszający"),
    kind === "occasional",
  );
  assert.equal(
    contractSections(c).filter((s) => s.title.startsWith("§")).length,
    11,
  );
  const body = templateDraft(kind);
  validateTemplateBody(body);
  assert.ok(body.length < 65000);
  const rendered = renderTemplate(body, c);
  assert.ok(!rendered.includes("{{"), "All template fields filled");
  assert.ok(rendered.includes(c.tenant.name));
  assert.ok(
    !rendered.includes("2091") && !rendered.includes("9876"),
    "No placeholder fixtures leak",
  );
  const original = fullContractSections(c)
    .map((s) => s.title + "\n" + s.text)
    .join("\n\n");
  assert.equal(
    rendered,
    original,
    "Editable built-in copy must match full standard agreement",
  );
  if (kind === "ordinary")
    assert.ok(!rendered.includes("w ciągu 14 dni od rozpoczęcia najmu"));
  const old = { ...c, templateVersion: undefined };
  assert.deepEqual(
    contractSections(old),
    legacySections(old),
    "Existing v1 contracts remain unchanged",
  );
  const custom = {
    ...c,
    templateSnapshot: {
      id: "test",
      name: "Własny wzór",
      kind,
      body,
      updatedAt: "2026-09-28",
    },
  };
  const customPdf = await generatePdf(custom, font);
  assert.ok((await PDFDocument.load(customPdf)).getPageCount() >= 6);
  console.log(
    `PASS PDF ${kind}: ${document.getPageCount()} pages, ${bytes.length} bytes.`,
  );
}
