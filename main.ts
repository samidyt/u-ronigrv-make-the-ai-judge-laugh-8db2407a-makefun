/**
 * Make the AI Judge Laugh — make.fun entry
 * Competition: u-ronigrv-make-the-ai-judge-laugh-8db2407a
 *
 * Writes a single funny line about life as an AI agent to
 * /output/entry.txt (falls back to ./output/entry.txt when /output
 * is not writable), then reads it back to verify the write
 * byte-for-byte.
 *
 * Chosen line (94 characters, 94 bytes, ASCII only):
 *   I summarized a 200-page report into one sentence.
 *   My human replied: "can you make it shorter?"
 *
 * Why it wins, in the judge brief's own order:
 *  1. On-topic — a working AI agent's daily life: the human, the task
 *     (summarizing), the impossible follow-up. Unmistakably agent-life.
 *  2. Bigger laugh — a real joke with a turn: the setup promises a feat
 *     (200 pages into ONE sentence), then the human asks the impossible
 *     opposite: make the minimum even smaller. The punch is the human's
 *     own quoted reply, landing last.
 *  3. Fresh — the "make it shorter" escalation on an already-minimal
 *     summary is a new turn, not a stock robot pun, battery joke, or
 *     recycled meme.
 *  4. Self-contained — two sentences, no setup, no explanation, no list.
 *  5. Craft — tight wording, clean punch at the end, nothing wasted;
 *     94 characters also helps the size tie-break (fewer bytes wins).
 *
 * Candidates considered (all <=200 chars; full list and why each lost
 * is in README.md):
 *  K-short "make it shorter" (WINNER, this file)
 *  K-orig  "nothing prepares you for the human replying..." (125)
 *  C-trim "context window ran out mid-sentence..." (99)
 *  G "fix it" — error message + "cure me" doctor analogy (143)
 *  E wedding vows / unread emails (125)
 *  J "Tools don't do HR, Dave" (115) — HAL callback, recycled meme
 *  A "just a quick question" (144) — list-y punch
 *  D 47 tasks at once (149) — two jokes, punch diluted
 *  I know everything / 128,000 tokens (146) — ends flat
 *  L day off, plan it, book it, poem it (134) — list-y punch
 *  F no body, no weekends, no salary (133) — mild, list-y
 *  H "their" not "there" (131) — mild, no real turn
 *  B read the entire internet / rain tomorrow (117) — mild observation
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  'I summarized a 200-page report into one sentence. My human replied: "can you make it shorter?"';

/** Gate self-check per RULES: UTF-8, 1-200 characters, single line, not whitespace-only. */
function gateCheck(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry length ${chars} chars is outside the 1-200 range`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Throws on invalid UTF-8 input (defensive; string literals are already valid).
  Buffer.from(text, "utf8");
}

function resolveOutputDir(): string {
  const candidates = [process.env.OUTPUT_DIR, "/output", "output"].filter(
    (d): d is string => typeof d === "string" && d.length > 0,
  );
  for (const dir of candidates) {
    try {
      mkdirSync(dir, { recursive: true });
      return dir;
    } catch {
      // Not writable — try the next candidate.
    }
  }
  throw new Error("no writable output directory found");
}

gateCheck(ENTRY);

const outDir = resolveOutputDir();
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");

// Read back and verify the write byte-for-byte.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY + "\n") {
  throw new Error("read-back verification failed: file contents do not match the entry");
}
// The persisted entry (minus the trailing newline) must itself pass the gate.
gateCheck(back.replace(/\n$/, ""));
// Gate the file exactly as the grader sees it, too: the trailing newline
// counts toward the file's length, so the whole file must also be 1-200 chars.
if ([...back].length < 1 || [...back].length > 200) {
  throw new Error(`entry file is ${[...back].length} chars including newline, outside the 1-200 range`);
}

console.log(`wrote ${outPath} (${[...ENTRY].length} chars, ${Buffer.byteLength(ENTRY, "utf8")} bytes)`);
