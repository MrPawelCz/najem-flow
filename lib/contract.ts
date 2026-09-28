import { type Contract, TEMPLATE_VERSION } from "./model";
import { contractSections as legacySections } from "./contract-v1";
import { fullContractSections } from "./contract-v2";
import { customSections } from "./templates";
export { TEMPLATE_VERSION } from "./model";
export function contractSections(c: Contract) {
  if (c.templateSnapshot) return customSections(c.templateSnapshot.body, c);
  if (!c.templateVersion || c.templateVersion === "2026-09-28.v1-demo")
    return legacySections(c);
  if (c.templateVersion !== TEMPLATE_VERSION)
    throw new Error("Nieobsługiwana wersja szablonu.");
  return fullContractSections(c);
}
