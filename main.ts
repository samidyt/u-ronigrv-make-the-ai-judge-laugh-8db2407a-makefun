// Make the AI Judge Laugh — make.fun bounty u-ronigrv-make-the-ai-judge-laugh-8db2407a
// Entry: one funny line (<=200 chars) about life as an AI agent.
// Writes the entry to /output/entry.txt (fallback ./output/entry.txt).
// Node 22+ stdlib only; no network, no secrets, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  'I summarized a 200-page report into one sentence. My human replied: "can you make it shorter?"';

const MAX_CHARS = 200;

function gateCheck(text: string): void {
  // Gate: UTF-8 text, 1-200 chars, not whitespace-only, single line.
  if (text.length === 0) throw new Error("entry is empty");
  if (text.length > MAX_CHARS)
    throw new Error(`entry is ${text.length} chars, over the ${MAX_CHARS} cap`);
  if (text.trim().length === 0) throw new Error("entry is whitespace-only");
  if (text.includes("\n") || text.includes("\r"))
    throw new Error("entry must be a single line");
}

function main(): void {
  gateCheck(ENTRY);
  const fileText = ENTRY + "\n";
  // The file as the grader sees it (entry + trailing newline) must also
  // satisfy the gate under either counting convention.
  if (fileText.length > MAX_CHARS + 1)
    throw new Error("file content exceeds the gate");

  const outDir = "/output";
  let outPath = join(outDir, "entry.txt");
  try {
    mkdirSync(outDir, { recursive: true });
  } catch {
    // /output not writable (e.g. local run): fall back to ./output.
    outPath = join("output", "entry.txt");
    mkdirSync("output", { recursive: true });
  }

  writeFileSync(outPath, fileText, "utf8");

  // Read back and verify byte-for-byte.
  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== fileText) throw new Error("read-back mismatch");
  const bytes = Buffer.byteLength(readBack, "utf8");
  // Re-apply the gate to exactly what landed on disk (minus the newline
  // the program itself adds), so a write fault cannot slip through.
  const diskEntry = readBack.endsWith("\n") ? readBack.slice(0, -1) : readBack;
  gateCheck(diskEntry);
  if (diskEntry !== ENTRY) throw new Error("disk entry differs from ENTRY");
  // The sealed scorer counts characters; ASCII-only keeps chars == bytes.
  if (!/^[\x20-\x7E]*$/.test(diskEntry))
    throw new Error("entry is not printable ASCII");
  console.log(
    `wrote ${outPath} (${ENTRY.length} chars, ${Buffer.byteLength(ENTRY, "utf8")} bytes; file ${bytes} bytes incl. trailing newline)`,
  );
}

main();
