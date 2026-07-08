/**
 * scripts/data/references.tsv dosyasından references-archive.json üretir.
 * Kullanım: npm run generate:references
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, join } from "path";

interface Reference {
  refNo: string;
  projectName: string;
  service: string;
  district: string;
  year: number;
}

function parseLine(line: string): Reference | null {
  const parts = line.split("\t");
  if (parts.length < 5) return null;

  const year = parseInt(parts[parts.length - 1], 10);
  if (Number.isNaN(year)) return null;

  const district = parts[parts.length - 2].trim();
  let refNo = parts[0].trim();
  const service = parts[parts.length - 3].trim();
  const projectName = parts.slice(1, -3).join("\t").trim();

  return { refNo, projectName, service, district, year };
}

function main() {
  const dataDir = resolve(__dirname, "data");
  const tsvPath = join(dataDir, "references.tsv");
  const jsonPath = join(dataDir, "references-archive.json");
  const outPath = resolve(__dirname, "../src/data/references-archive.json");

  const raw = readFileSync(tsvPath, "utf8");
  const seen = new Map<string, number>();
  const references: Reference[] = [];

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const ref = parseLine(trimmed);
    if (!ref) continue;

    const baseRefNo = ref.refNo;
    const count = seen.get(baseRefNo) ?? 0;
    if (count > 0) ref.refNo = `${baseRefNo}-${count + 1}`;
    seen.set(baseRefNo, count + 1);

    references.push(ref);
  }

  mkdirSync(dataDir, { recursive: true });
  const json = JSON.stringify(references, null, 2);
  writeFileSync(jsonPath, json, "utf8");
  writeFileSync(outPath, json, "utf8");

  console.log(`✓ ${references.length} referans yazıldı`);
  console.log(`  ${outPath}`);
}

main();
