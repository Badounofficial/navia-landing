# Navia MVP — V1 Feature Scope

**Status:** draft, aligned with the landing page modules and the companion personality.
**Goal:** ship an app the first 500 waitlist members will actually open every day, without drowning the core experience in optional features.

The rule for MVP is simple. If a feature does not serve the companion voice, the diary, the cycle, or the pregnancy flow, it is not in v1.

---

## What is in v1

### 1. Onboarding (3 minutes, max)
- Welcome screen with Navia introducing herself in her voice.
- Four soft questions: name, age, current chapter (cycle / trying / pregnant / post-partum / just here), one thing she wants Navia to know about today.
- Passwordless sign in (email magic link or Apple Sign In).
- Privacy promise screen, plain language, one paragraph.
- Opt-in for gentle notifications (off by default).

### 2. Daily check-in
- Thirty seconds, once a day, at a time the user chooses.
- Three dials: mood, energy, sleep. Optional one-line note.
- Navia acknowledges the check-in with one warm sentence. No upsell.
- Streaks are not tracked. Missing a day is not flagged.

### 3. Smart diary
- Freeform text entry. Voice-to-text available (on-device).
- Navia reads the entry and replies in her voice, both on screen and as audio on tap.
- Replies honor the rules in `system-prompt-v1.md` (mirror first, one question max, safety escalation).
- The user can tell Navia "don't reply tonight" and Navia simply says "I'm here if you need me" and stays quiet.
- All entries stored encrypted on device.

### 4. Cycle module
- Cycle tracking: period start, period end, flow, symptoms, optional ovulation signals.
- Cycle ring view: a single circular visualization with current day and phase.
- Phase-aware Navia: her tone and her gentle suggestions shift subtly across cycle phases.
- Predictions are shown as soft ranges, not hard dates. ("Your next period is likely between Thursday and Saturday.")

### 5. Pregnancy module
- Activated if the user says she is pregnant.
- Week-by-week content: one short, non-clinical, human note from Navia each week. No stock content scraped from parenting sites.
- Tracking of basic wellness signals: nausea, sleep, movement (from week 20), mood.
- Gentle medical caveat on every screen: "For anything that worries you, your midwife or doctor comes first."

### 6. Navia's voice (in-app)
- Single custom feminine voice across the app.
- Audio playback for Navia's replies, with a subtle waveform.
- Breath sounds and natural pauses (see `architecture.md`).
- Never speaks unprompted.

### 7. Private settings
- Full data export in one tap.
- Per-memory deletion.
- "Forget everything" action with a two-step confirmation.
- Notification controls.
- Theme (light only in v1; dark in v2).

### 8. Founder page (in-app)
- Single screen. Sebastien's photo, short bio, why Navia exists. No hero, no video, no voice intro.
- Accessible from Settings. Not on the home.

### 9. Gifting (teased, not live)
- One locked card visible on the home: "Something small, on the way."
- In v1 the gift is a curated, hand-sent email + optional physical item for the first 500 members. Not a full automated gifting system.
- The automated version is a v1.5 feature.

### 10. Minimal public-facing surfaces
- `bynavia.com` landing page (already live).
- In-app only, no web companion version in v1.

---

## What is explicitly not in v1

- **No community features.** No feed, no forum, no posts. Navia is one-to-one, period.
- **No AI image generation.** No "baby prediction", no photo filters.
- **No medical data integrations** (Apple Health, Oura, etc.). v1.5 consideration.
- **No family sharing or partner dashboard.** The diary is sacred.
- **No gamification.** No streaks, no badges, no XP.
- **No paid tier at launch.** v1 is free for the first 500 members. Pricing lands once the experience has earned it.
- **No Android app.** iOS only at launch. Android follows in phase 2.
- **No web chat version of Navia.** The intimacy requires a phone in your hand.
- **No personalization settings for Navia's voice** ("make her more energetic!"). There is one Navia, one voice, one character.
- **No ads, ever.**

---

## Success signals for v1

We are not measuring DAU or retention with a growth-team lens. For v1 the signals that matter are:

1. **Do women come back the next day?** Not because of a push, but because they wanted to.
2. **Do they write in the diary?** Average diary length over time is a better signal than any streak.
3. **Do they play Navia's audio replies?** If yes, the voice is working.
4. **Do they tell other women about Navia?** Qualitative, via the "how did you find us?" question at onboarding.
5. **Do they say, in their own words, that Navia made them feel less alone?** We read every piece of feedback for the first 500 members, by hand.

If those signals are weak, we do not add features. We make the existing ones more tender.

---

## Phasing proposal

- **Phase 1 (now - June 2026):** finalize landing page, build waitlist to 500, lock companion personality, run blind LLM eval, hire voice actress.
- **Phase 2 (June - September 2026):** iOS prototype with check-in, diary, cycle module, Navia voice. Internal testing with ~20 women across chapters.
- **Phase 3 (September - November 2026):** private beta with the first 500 waitlist members. Weekly hand-written feedback rounds.
- **Phase 4 (late 2026 / early 2027):** public soft launch, pricing, Android, gifting automation.

All dates are targets, not commitments. Navia launches when Navia is ready, not before.
