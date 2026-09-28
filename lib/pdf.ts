import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { contractSections } from "./contract";
import type { Contract } from "./model";
export async function generatePdf(c: Contract, fontBytes: Uint8Array) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(fontBytes, { subset: true });
  doc.setTitle(`${c.number} — umowa najmu (DEMO)`);
  doc.setAuthor("Najem Flow");
  doc.setSubject("Projekt demonstracyjny bez podpisów elektronicznych");
  let page: PDFPage;
  let y = 0;
  const width = 495;
  const left = 50;
  function newPage() {
    page = doc.addPage([595.28, 841.89]);
    y = 773;
    page.drawText("NAJEM FLOW  /  PROJEKT DEMONSTRACYJNY", {
      x: left,
      y: 805,
      size: 8,
      font,
      color: rgb(0.35, 0.46, 0.49),
    });
  }
  function lines(text: string, size: number, f: PDFFont) {
    const out: string[] = [];
    for (const paragraph of text
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
      .split("\n")) {
      let line = "";
      for (const word of paragraph.split(/\s+/)) {
        if (f.widthOfTextAtSize(word, size) > width) {
          if (line) out.push(line);
          line = "";
          for (const ch of word) {
            if (f.widthOfTextAtSize(line + ch, size) > width) {
              out.push(line);
              line = "";
            }
            line += ch;
          }
          continue;
        }
        const next = line ? line + " " + word : word;
        if (f.widthOfTextAtSize(next, size) > width) {
          out.push(line);
          line = word;
        } else line = next;
      }
      out.push(line);
    }
    return out;
  }
  function draw(text: string, size: number, heading = false) {
    const wrapped = lines(text, size, font);
    if (heading && y < 110) newPage();
    for (const line of wrapped) {
      if (y < 65) newPage();
      page.drawText(line, {
        x: left,
        y,
        size,
        font,
        color: heading ? rgb(0.08, 0.3, 0.29) : rgb(0.12, 0.17, 0.21),
      });
      y -= size * 1.5;
    }
    y -= heading ? 5 : 13;
  }
  newPage();
  for (const [i, s] of contractSections(c).entries()) {
    draw(s.title, i === 0 ? 17 : 11.5, true);
    draw(s.text, 10);
  }
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawLine({
      start: { x: 50, y: 45 },
      end: { x: 545, y: 45 },
      color: rgb(0.8, 0.85, 0.86),
      thickness: 0.5,
    });
    p.drawText(
      `${c.number}  |  DEMO — brak podpisu elektronicznego  |  ${i + 1}/${pages.length}`,
      { x: 50, y: 30, size: 8, font, color: rgb(0.4, 0.46, 0.5) },
    );
  });
  return await doc.save();
}
export async function downloadPdf(c: Contract) {
  const response = await fetch("/fonts/DejaVuSans.ttf");
  if (!response.ok)
    throw new Error("Nie udało się wczytać czcionki PDF. Spróbuj ponownie.");
  const bytes = await generatePdf(
    c,
    new Uint8Array(await response.arrayBuffer()),
  );
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${c.number.replaceAll("/", "-")}-DEMO.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 20000);
}
