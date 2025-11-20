import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const descriptors = [
  "Atlantic",
  "Azure",
  "Beacon",
  "Blue",
  "Coral",
  "Emerald",
  "Harbor",
  "Mariner",
  "Palm",
  "Sand"
];

const sectors = [
  "Bridge",
  "Capital",
  "Channel",
  "Coast",
  "Crest",
  "Harbor",
  "Horizon",
  "Ledger",
  "Maritime",
  "Summit"
];

const suffixes = ["Advisors", "Associates", "Consulting", "Holdings", "Investments", "Markets", "Partners", "Services", "Trust", "Ventures"];

const categories = [
  "Retail FX Brokerage",
  "Institutional FX Brokerage",
  "Multi-Asset Dealing Desk",
  "FX Liquidity Provision",
  "Commodities Brokerage",
  "Derivatives Advisory",
  "Wealth Management Services",
  "Payment and Remittance Services",
  "Treasury Outsourcing",
  "Corporate FX Risk Advisory"
];

const notes = [
  "Maintains quarterly compliance updates with the Boa Vista Financial Authority.",
  "Underwent enhanced due diligence during the most recent supervisory cycle.",
  "Submitted revised capital adequacy statement in the last reporting period.",
  "Implements mandatory client asset segregation with monthly reconciliations.",
  "Participates in cross-border information sharing with Lusophone regulators.",
  "Filed updated disaster recovery plan incorporating offshore redundancy.",
  "Completed independent AML/CTF audit with satisfactory findings.",
  "Subject to annual prudential assessment focusing on liquidity buffers.",
  "Maintains bilingual client disclosures in Portuguese and English.",
  "Operates under conditional approval pending technology platform migration."
];

const descriptions = [
  "delivers currency execution and settlement solutions to the Cape Verdean hospitality and tourism sector",
  "supports regional exporters with hedging strategies against Euro and USD volatility",
  "specialises in low-latency order routing for diaspora remittance channels",
  "partners with local banks to provide treasury outsourcing and liquidity management",
  "offers portfolio diversification tools for high-net-worth investors across West Africa",
  "focuses on sustainable finance instruments linked to island infrastructure projects",
  "implements disciplined risk management tailored to maritime shipping clients",
  "provides onboarding support for fintech entrants expanding into Lusophone markets",
  "operates bespoke FX solutions for renewable energy initiatives throughout Boa Vista",
  "maintains correspondent networks facilitating cross-border commodity trades"
];

const firstNames = [
  "Ana",
  "Bruno",
  "Carla",
  "Daniel",
  "Elisa",
  "Fabio",
  "Helena",
  "Igor",
  "Joana",
  "Luis",
  "Marta",
  "Nuno",
  "Olivia",
  "Paulo",
  "Rita",
  "Sergio",
  "Teresa",
  "Vasco",
  "Wilma",
  "Yuri"
];

const lastNames = [
  "Almeida",
  "Barbosa",
  "Cardoso",
  "Delgado",
  "Esteves",
  "Fernandes",
  "Gomes",
  "Henriques",
  "Lima",
  "Macedo",
  "Neves",
  "Oliveira",
  "Pereira",
  "Quintino",
  "Ramos",
  "Silva",
  "Tavares",
  "Vidal",
  "Xavier",
  "Zamora"
];

const extendedRoles = [
  "Managing Director",
  "Chief Compliance Officer",
  "Head of Trading",
  "Risk Management Lead",
  "Operations Supervisor",
  "Client Relations Principal",
  "Chief Technology Officer",
  "Treasury Controller",
  "AML Programme Lead",
  "Market Surveillance Officer",
  "Institutional Liaison",
  "Settlement Supervisor",
];

const categoryCodeMap = {
  "Retail FX Brokerage": "FX",
  "Institutional FX Brokerage": "IX",
  "Multi-Asset Dealing Desk": "MD",
  "FX Liquidity Provision": "LP",
  "Commodities Brokerage": "CB",
  "Derivatives Advisory": "DA",
  "Wealth Management Services": "WM",
  "Payment and Remittance Services": "PR",
  "Treasury Outsourcing": "TO",
  "Corporate FX Risk Advisory": "CR",
};

const bureauPrefix = "BVP";
const checkSuffixChars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomBlock(seed) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = seed;
  let block = "";
  for (let i = 0; i < 4; i++) {
    value = (value * 9301 + 49297) % 233280;
    block += chars.charAt(value % chars.length);
  }
  return block;
}

function checkSuffix(seed) {
  let value = seed;
  let suffix = "";
  for (let i = 0; i < 2; i++) {
    value = (value * 241 + 37) % 127;
    suffix += checkSuffixChars.charAt(value % checkSuffixChars.length);
  }
  return suffix;
}

function createRng(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad(num, size) {
  return num.toString().padStart(size, "0");
}

function formatDate(year, month, day) {
  return `${year}-${pad(month, 2)}-${pad(day, 2)}`;
}

const licenses = Array.from({ length: 100 }, (_, index) => {
  const desc = descriptors[index % descriptors.length];
  const sector = sectors[Math.floor(index / descriptors.length) % sectors.length];
  const suffix = suffixes[(index * 3) % suffixes.length];
  const name = `${desc} ${sector} ${suffix}`;
  const slug = toSlug(name);

  const year = 2014 + (index % 10);
  const month = ((index * 3) % 12) + 1;
  const day = ((index * 7) % 28) + 1;
  const issueDate = formatDate(year, month, day);
  const expiryDate = index % 7 === 0 ? "N/A" : formatDate(year + 5, month, day);

  const statusPool = ["Active", "Active", "Active", "Active", "Under Review", "Suspended", "Lapsed"];
  const status = statusPool[index % statusPool.length];

  const domain = slug || `entity-${index + 1}`;
  const contactEmail = `licensing@${domain}.cv`;

  const category = categories[index % categories.length];
  const note = notes[index % notes.length];
  const description = `Founded in ${year}, ${name} ${descriptions[index % descriptions.length]}.`;

  const rng = createRng((index + 1) * 9187);
  const registeredAddress = "Boa Vista, Republic of Cabo Verde";

  const personCount = 2 + Math.floor(rng() * 3);
  const selectedPersons = Array.from({ length: personCount }, () => {
    const first = firstNames[Math.floor(rng() * firstNames.length)];
    const last = lastNames[Math.floor(rng() * lastNames.length)];
    const role = extendedRoles[Math.floor(rng() * extendedRoles.length)];
    return { name: `${first} ${last}`, role };
  });

  const quarter = Math.floor((month - 1) / 3) + 1;
  const categoryCode = categoryCodeMap[category] ?? "FX";
  const randomSegmentSeed = (index + 1) * 7919;
  const randomSegment = randomBlock(randomSegmentSeed);
  const suffixSeed = randomSegmentSeed + quarter * 31;
  const suffixCode = checkSuffix(suffixSeed);
  const licenseNumber = `${bureauPrefix}-${categoryCode}-${String(year).slice(-2)}Q${quarter}-${randomSegment}-${suffixCode}`;

  return {
    id: index + 1,
    slug,
    companyName: name,
    licenseNumber,
    issueDate,
    expiryDate,
    status,
    registeredAddress,
    contactEmail,
    contactPhone: "",
    businessCategory: category,
    complianceNotes: note,
    description,
    keyPersons: selectedPersons
  };
});

const header = `// Auto-generated by scripts/generate-licenses.mjs\n// Do not edit directly. Update the generator if changes are required.\n\n`;

const interfaceDef = `export interface LicenseRecord {\n  id: number;\n  slug: string;\n  companyName: string;\n  licenseNumber: string;\n  issueDate: string;\n  expiryDate: string;\n  status: string;\n  registeredAddress: string;\n  contactEmail: string;\n  contactPhone: string;\n  businessCategory: string;\n  complianceNotes: string;\n  description: string;\n  keyPersons: { name: string; role: string }[];\n}\n\n`;

const dataString = JSON.stringify(licenses, null, 2);

const fileContents = `${header}${interfaceDef}export const licenses = ${dataString} satisfies LicenseRecord[];\n\nexport function getLicenseBySlug(slug: string) {\n  return licenses.find((entry) => entry.slug === slug);\n}\n\nexport function searchLicenses(query: string) {\n  const normalized = query.trim().toLowerCase();\n  if (!normalized) return licenses;\n  return licenses.filter((entry) => {\n    return (\n      entry.companyName.toLowerCase().includes(normalized) ||\n      entry.licenseNumber.toLowerCase().includes(normalized) ||\n      entry.businessCategory.toLowerCase().includes(normalized) ||\n      entry.description.toLowerCase().includes(normalized)\n    );\n  });\n}\n`;

const outputDir = join(__dirname, "../src/data");
mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, "licenses.ts");

writeFileSync(outputPath, fileContents, "utf8");

console.log(`Generated ${licenses.length} license records at ${outputPath}`);
