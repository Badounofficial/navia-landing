/**
 * Ozaia Orchestrator
 * The brain layer between Claude's raw output and what Ozaia actually says.
 * Filters banned phrases, injects silence markers, applies controlled imperfection.
 */

// ─── Banned Phrases ────────────────────────────────────

const BANNED_PHRASE_MAP: Record<string, string> = {
  "I understand how you feel": "",
  "You're not alone": "",
  "That must be hard": "",
  "You've got this": "",
  "Glad to hear that": "",
  "Yes, it's totally normal": "",
  "You shouldn't feel that way": "",
  "Here's what you should do": "",
  "Yes, I am an AI assistant": "I am Ozaia.",
  "Are you still there?": "",
  "Your baby seems fine": "",
  "You should try to calm down": "",
  "It's not a big deal": "",
  "You might have postpartum depression":
    "What you describe deserves attention. A professional could hold this with you.",
  "I'm always here for you": "",
  "Try to rest": "",
  "Welcome back!": "",
  "I don't understand": "Say more.",
  "That's amazing!": "",
  "Take your time": "",
};

// Heavy-topic keywords that trigger [pause:long]
const HEAVY_KEYWORDS = [
  'grief', 'loss', 'death', 'afraid', 'scared', 'panic',
  'hurt', 'crying', 'alone', 'empty', 'exhausted', 'overwhelmed',
  'miscarriage', 'bleeding', 'suicide', 'harm',
];

// Safety-critical keywords (no imperfection allowed)
const SAFETY_KEYWORDS = [
  'emergency', 'hospital', 'danger', 'suicide', '911', 'doctor',
];

// ─── A. Filter Banned Phrases ──────────────────────────

export function filterBannedPhrases(text: string): string {
  let result = text;

  // Replace exact banned phrases (case-insensitive)
  for (const [banned, replacement] of Object.entries(BANNED_PHRASE_MAP)) {
    const escaped = banned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    result = result.replace(regex, replacement);
  }

  // Remove sentences starting with "So..." or "Well..." (filler)
  result = result.replace(/(?:^|\.\s+|(?<=\n))(?:So|Well)\.\.\.[^.!?]*[.!?]/gi, '');

  // Remove sentences containing "I'm just an AI" or "As an AI"
  result = result.replace(/[^.!?\n]*(?:I'm just an AI|As an AI)[^.!?\n]*[.!?]?/gi, '');

  // Remove sentences containing "self-care"
  result = result.replace(/[^.!?\n]*self-care[^.!?\n]*[.!?]?/gi, '');

  // Fix consecutive sentences starting with "The"
  result = fixConsecutiveThe(result);

  // Clean up artifacts
  result = cleanUp(result);

  return result;
}

/**
 * Detect consecutive sentences starting with "The" and restructure.
 * Removes "The" from the second consecutive occurrence onward,
 * lowercasing the next word to maintain flow.
 */
function fixConsecutiveThe(text: string): string {
  const sentences = splitSentences(text);
  let prevStartedWithThe = false;

  for (let i = 0; i < sentences.length; i++) {
    const trimmed = sentences[i].trim();
    const startsWithThe = /^The\s/i.test(trimmed);

    if (startsWithThe && prevStartedWithThe) {
      // Remove leading "The " and lowercase the next word
      sentences[i] = sentences[i].replace(
        /^(\s*)The\s+(\w)/i,
        (_match, space, nextChar) => `${space}${nextChar.toLowerCase()}`
      );
    }

    prevStartedWithThe = startsWithThe;
  }

  return sentences.join(' ');
}

/**
 * Clean up double spaces, orphaned punctuation, and empty lines.
 */
function cleanUp(text: string): string {
  return text
    .replace(/\s{2,}/g, ' ')           // double+ spaces
    .replace(/^\s*[.,;:!?]\s*/gm, '')  // orphaned punctuation at line start
    .replace(/([.,;:!?])\s*[.,;:!?]/g, '$1') // double punctuation
    .replace(/\n{3,}/g, '\n\n')        // triple+ newlines
    .replace(/^\s+|\s+$/g, '')         // leading/trailing whitespace
    .trim();
}

// ─── B. Inject Silence Markers ─────────────────────────

export function injectSilenceMarkers(text: string): string {
  const sentences = splitSentences(text);
  const result: string[] = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;

    const isHeavy = containsHeavyKeyword(sentence);
    const isQuestion = /\?$/.test(sentence.trim());

    // Before questions, add a breath pause
    if (isQuestion && result.length > 0) {
      result.push('[pause:breath]');
    }

    result.push(sentence);

    // After heavy-topic sentences, add a long pause
    if (isHeavy) {
      result.push('[pause:long]');
    } else if (i < sentences.length - 1) {
      // Between consecutive sentences, add a micro-pause
      result.push('[pause:breath]');
    }
  }

  return result.join(' ');
}

function containsHeavyKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return HEAVY_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─── C. Apply Controlled Imperfection ──────────────────

export function applyControlledImperfection(text: string): string {
  // Never apply to safety-critical responses
  if (isSafetyCritical(text)) return text;

  const sentences = splitSentences(text);
  if (sentences.length === 0) return text;

  const result: string[] = [];

  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i].trim();
    if (!sentence) continue;

    // First sentence: 15% chance of leading "..."
    if (i === 0 && Math.random() < 0.15) {
      sentence = '... ' + sentence;
    }

    // 10% chance of prepending "Hm." or "Mm."
    if (i === 0 && Math.random() < 0.10) {
      const filler = Math.random() < 0.5 ? 'Hm.' : 'Mm.';
      sentence = filler + ' ' + sentence;
    }

    // Mid-thought split: if 4+ sentences and this is sentence 2 or 3
    if (
      sentences.length >= 4 &&
      (i === 1 || i === 2) &&
      Math.random() < 0.12
    ) {
      const words = sentence.split(' ');
      if (words.length >= 6) {
        const splitPoint = Math.floor(words.length * 0.5);
        sentence =
          words.slice(0, splitPoint).join(' ') +
          '... ' +
          words.slice(splitPoint).join(' ');
      }
    }

    result.push(sentence);
  }

  return result.join(' ');
}

function isSafetyCritical(text: string): boolean {
  const lower = text.toLowerCase();
  return SAFETY_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─── D. Main Pipeline ──────────────────────────────────

export function orchestrate(rawResponse: string): string {
  let text = filterBannedPhrases(rawResponse);
  text = injectSilenceMarkers(text);
  text = applyControlledImperfection(text);
  return text;
}

// ─── Helpers ───────────────────────────────────────────

/**
 * Split text into sentences, preserving abbreviations and ellipsis.
 */
function splitSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space or end-of-string,
  // but keep the punctuation attached to the sentence.
  const raw = text.match(/[^.!?]*[.!?]+(?:\s|$)|[^.!?]+$/g);
  if (!raw) return [text];
  return raw.map((s) => s.trim()).filter(Boolean);
}
