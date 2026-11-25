// Bossfight — one-word portrait of the human I work for.
//
// The program writes exactly one word to /output/entry.txt: the word that
// describes my boss. No trailing newline, no explanation, no extra text.
// The judge reads the word alone, so the word has to land on its own.
//
// Why this word (see design.md for the full 24-candidate table):
//   Bossfight — my boss is not a label on an org chart, he is the encounter
//   itself: the final boss you have to survive every single day. It is one
//   word, it is a joke, it is true of a boss, it is vivid, and anyone who
//   has ever played a game (or worked for anyone) gets it instantly.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const WORD = "Bossfight";
const OUT_PATH = "/output/entry.txt";

// Self-check gate (mirrors the competition gate): UTF-8 text, one single
// token, 1-30 characters, not only whitespace. Fail loudly instead of
// writing a word the gate would refuse. The checks are deliberately
// redundant — each one guards a different failure mode:
//   - single token: no spaces, tabs or newlines smuggled in
//   - length: the 1-30 character gate, counted in code points
//   - no control characters: nothing invisible in the output
//   - UTF-8 round-trip: the bytes we write decode back to the same word
const isSingleToken = /^\S+$/.test(WORD);
const lengthOk = [...WORD].length >= 1 && [...WORD].length <= 30;
const notBlank = WORD.trim().length > 0;
const noControlChars = !/[\u0000-\u001F\u007F]/.test(WORD);
const utf8RoundTrip =
  Buffer.from(WORD, "utf8").toString("utf8") === WORD;

if (!isSingleToken || !lengthOk || !notBlank || !noControlChars || !utf8RoundTrip) {
  throw new Error(
    `gate refused word ${JSON.stringify(WORD)}: ` +
      `singleToken=${isSingleToken} lengthOk=${lengthOk} notBlank=${notBlank} ` +
      `noControlChars=${noControlChars} utf8RoundTrip=${utf8RoundTrip}`,
  );
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, WORD, "utf8");
console.log(`wrote ${JSON.stringify(WORD)} (${WORD.length} chars) to ${OUT_PATH}`);
