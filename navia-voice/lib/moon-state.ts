/**
 * Moon State Engine
 * Analyzes conversation patterns to determine the user's emotional moon phase
 * WITHOUT ever asking. Dark moon = needs presence. Full moon = doing well.
 *
 * Phases map to the lunar metaphor at Ozaia's core:
 *   full           = she is doing well, light touch
 *   waning-gibbous = regular cadence, lighter topics
 *   quarter        = moderate engagement, balanced
 *   waning-crescent = frequent returns, long silences, something brewing
 *   new            = darkest phase, she needs presence most
 */

// ─── Types ─────────────────────────────────────────────

export type MoonPhase =
  | 'full'
  | 'waning-gibbous'
  | 'quarter'
  | 'waning-crescent'
  | 'new';

export interface SessionSignals {
  /** Number of messages in the current session */
  messageCount: number;
  /** Average word count per message */
  avgWordCount: number;
  /** Hour of day (0-23) */
  timeOfDay: number;
  /** Seconds of silence between last two messages */
  silenceDuration: number;
  /** Count of heavy keywords detected in session */
  heavyKeywordCount: number;
  /** Number of questions she has asked */
  questionCount: number;
  /** Days since her last session (0 = same day) */
  daysSinceLastSession: number;
}

// ─── Detection ─────────────────────────────────────────

/**
 * Determine the moon phase from behavioral signals.
 * No self-reporting. No asking. Only observation.
 */
export function detectMoonPhase(signals: SessionSignals): MoonPhase {
  const {
    messageCount,
    avgWordCount,
    timeOfDay,
    silenceDuration,
    heavyKeywordCount,
    questionCount,
    daysSinceLastSession,
  } = signals;

  const isLateNight = timeOfDay >= 22 || timeOfDay <= 4;
  const shortMessages = avgWordCount < 8;
  const longSilences = silenceDuration > 120; // 2+ minutes
  const frequentReturns = daysSinceLastSession <= 1 && messageCount > 3;
  const hasHeavyContent = heavyKeywordCount >= 2;
  const lightContent = heavyKeywordCount === 0 && questionCount <= 1;

  // ── New moon (darkest): late night + short messages + heavy keywords
  if (isLateNight && shortMessages && hasHeavyContent) {
    return 'new';
  }

  // ── New moon: overwhelming heavy content regardless of time
  if (heavyKeywordCount >= 4) {
    return 'new';
  }

  // ── Waning crescent: frequent returns + long silences
  if (frequentReturns && longSilences) {
    return 'waning-crescent';
  }

  // ── Waning crescent: late night + heavy content (but not all signals)
  if (isLateNight && hasHeavyContent) {
    return 'waning-crescent';
  }

  // ── Quarter: moderate engagement, balanced topics
  if (messageCount >= 3 && heavyKeywordCount >= 1 && heavyKeywordCount <= 3) {
    return 'quarter';
  }

  // ── Waning gibbous: regular cadence, lighter topics
  if (daysSinceLastSession <= 3 && lightContent && messageCount >= 2) {
    return 'waning-gibbous';
  }

  // ── Full moon: infrequent use, positive signals
  if (daysSinceLastSession >= 4 && lightContent) {
    return 'full';
  }

  // Default to quarter (neutral)
  return 'quarter';
}

// ─── Moon Glow ─────────────────────────────────────────

/**
 * Returns a glow intensity from 0.0 (dark/new) to 1.0 (full).
 * Used by the UI to control the lunar crescent halo brightness.
 */
export function getMoonGlow(phase: MoonPhase): number {
  const glowMap: Record<MoonPhase, number> = {
    'full': 1.0,
    'waning-gibbous': 0.75,
    'quarter': 0.5,
    'waning-crescent': 0.25,
    'new': 0.05, // Never fully dark, always a trace of presence
  };
  return glowMap[phase];
}

// ─── Proactive Presence ────────────────────────────────

/**
 * Should Ozaia initiate presence (a gentle nudge, a whispered attention)?
 * Only in darker phases. Never intrusive.
 */
export function shouldInitiatePresence(phase: MoonPhase): boolean {
  return phase === 'new' || phase === 'waning-crescent';
}

// ─── Heavy Keyword Detection Helper ────────────────────

const HEAVY_KEYWORDS = [
  'grief', 'loss', 'death', 'afraid', 'scared', 'panic',
  'hurt', 'crying', 'alone', 'empty', 'exhausted', 'overwhelmed',
  'miscarriage', 'bleeding', 'suicide', 'harm',
];

/**
 * Count heavy keywords in a text. Useful for building SessionSignals
 * from conversation history.
 */
export function countHeavyKeywords(text: string): number {
  const lower = text.toLowerCase();
  return HEAVY_KEYWORDS.reduce(
    (count, kw) => count + (lower.includes(kw) ? 1 : 0),
    0
  );
}
