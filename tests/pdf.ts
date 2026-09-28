import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { seed } from "../lib/model";
import { generatePdf } from "../lib/pdf";
import { contractSections } from "../lib/contract";
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
  assert.ok(document.getPageCount() >= 2);
  assert.ok(document.getTitle()?.includes("DEMO"));
  await writeFile(`outputs/${kind}-demo.pdf`, bytes);
  const sections = contractSections(c)
    .map((s) => s.title)
    .join(" ");
  assert.equal(
    sections.includes("warunek zawieszający"),
    kind === "occasional",
  );
  console.log(
    `PASS PDF ${kind}: ${document.getPageCount()} pages, ${bytes.length} bytes.`,
  );
}
