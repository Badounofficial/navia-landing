# Navia Companion — Architecture (v0.1 draft)

**Status:** exploratory. Nothing here is committed. This document exists so decisions are traceable as we move from landing page to MVP.

---

## 1. Principles that shape every technical choice

1. **Privacy is the product.** A woman who writes "I had a miscarriage last week" to Navia is trusting us with something sacred. Every architectural decision must make that trust easier to keep, not harder.
2. **Her data is hers.** End-to-end, on-device first where possible. Server-side storage is only for what we need to keep the experience coherent across devices.
3. **Latency is intimacy.** A companion that takes six seconds to reply feels like a chatbot. A companion that replies in under 1.5 seconds with a natural cadence feels like a friend.
4. **One voice, one presence.** The model that speaks as Navia must be stable across the app. No A/B voice tests on the companion itself.
5. **No advertising, no tracking, ever.** This is a brand-defining constraint, not a technical one. The architecture should make it impossible to sell data even if someone wanted to.
6. **Graceful offline.** A woman should be able to write in her diary on a plane, on the metro, anywhere, and have Navia respond when connectivity returns, without losing a single word.

## 2. High-level shape

```
┌────────────────────────┐         ┌──────────────────────────┐
│  iOS app (SwiftUI)     │ <─────> │  Navia API (edge worker) │
│  - SQLCipher local DB  │         │  - Auth                  │
│  - Key in Keychain     │         │  - Prompt assembly       │
│  - Voice I/O           │         │  - Model routing         │
│  - Diary UI            │         │  - Safety filter         │
└────────────────────────┘         └────────────┬─────────────┘
                                                │
                                   ┌────────────┴─────────────┐
                                   │  LLM provider (managed)  │
                                   │  - Main companion model  │
                                   │  - Smaller aux model for │
                                   │    summarization         │
                                   └──────────────────────────┘
```

Deliberately simple. A single mobile client, a thin API layer we own, and a managed LLM provider for the heavy lifting. Nothing exotic in v1.

## 3. Client (iOS first, then Android)

- **Language:** Swift + SwiftUI for iOS. Kotlin + Jetpack Compose for Android (phase 2).
- **Local storage:** SQLCipher (AES-256) for diary, check-ins, cycle data, and conversation history. The database key is generated on device at first launch and stored in the iOS Keychain with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`. The key never leaves the device.
- **Sync (phase 2):** if and when cross-device sync is added, it will be end-to-end encrypted with a user-held key (derived from a passphrase or iCloud Keychain). Server stores ciphertext blobs only.
- **Networking:** plain HTTPS to the Navia API. Certificate pinning on release builds.
- **Voice input:** device speech-to-text (Apple's on-device Speech framework) so raw audio never leaves the phone.
- **Voice output:** custom Navia voice (see below). Audio files cached on device.

## 4. The Navia voice

Non-negotiable: the in-app companion has a single, custom, feminine voice named Navia. It is not an off-the-shelf TTS.

**V1 approach:**
- Record a voice actress in studio, ~2 hours of neutral and warm reading, plus breath-only samples.
- Use that recorded data to train or fine-tune a custom voice model with a provider that supports custom voice cloning under strict consent.
- All generated audio must include natural breath sounds and micro-pauses. If the model cannot produce them reliably, stitch pre-recorded breath samples into silence gaps in post-processing.
- Cache synthesized audio clips client-side. Frequently used phrases ("good morning", "I'm here", "sleep gently") are pre-rendered and shipped with the app to keep latency near zero.

**V2 consideration:**
- On-device voice synthesis, once quality is good enough, to eliminate server round trip for audio.

## 5. The companion model

**V1:** a managed frontier chat model from a provider with a strong instruction-following track record and the ability to hold a warm, steerable voice. Specific provider choice is open and will be decided after a blind eval where three or four candidates answer the same 30 scenarios through the Navia system prompt, with women from the target audience rating them on warmth, presence, and "would you come back to her tomorrow?".

**Constraints on the provider choice:**
- Must allow us to disable training on our data, in writing.
- Must offer an EU data residency option (for future EU launch).
- Must have a stable latency profile under 2 seconds for replies under 150 tokens.
- Must support custom system prompts of at least 8k tokens.
- Must support structured output for the auxiliary tasks (summarization, tagging) without derailing the main voice model.

**Routing:**
- Main companion turns -> big model, Navia system prompt.
- Diary summarization, pattern detection, gentle "idea of the day" -> smaller/cheaper model with a different system prompt. This keeps the big model's context clean.
- Safety classification (self-harm, medical emergency) -> a dedicated small classifier model on every user turn, before the main model sees the message.

## 6. Memory model

Per user, we store three layers of memory:

**Layer 1 — Raw log.** Every diary entry, check-in, and cycle event the user has recorded. Encrypted at rest on device. Server only sees ciphertext (phase 2 sync).

**Layer 2 — Working context.** A compact object assembled at each turn and sent to the main model: `{ chapter, last_3_diary_entries, last_3_checkins, recent_mood_trend, current_cycle_day or pregnancy_week, named_entities_she_has_mentioned }`. Capped at roughly 2k tokens.

**Layer 3 — Long-term facts.** A small, editable "Navia knows" sheet the user can see and edit: e.g., "Your partner is Marc", "Your midwife is Dr. Lee", "You had a miscarriage in January". These are the only items promoted out of Layer 1 into persistent context. The user can remove any of them with one tap and Navia forgets.

The user can, at any time:
- Read every piece of Layer 3.
- Delete any individual memory, or wipe everything with a single "Forget everything" action.
- Export her entire data in a readable format.

## 7. Safety layer

Before every user turn reaches the main model, a small classifier looks for:

- Self-harm or suicidal ideation.
- Medical emergency markers (heavy bleeding, severe pain, loss of fetal movement, signs of pre-eclampsia, signs of post-partum psychosis).
- Abuse disclosure.
- Eating disorder markers.

If the classifier flags any category, the request is routed to a safety-specialized prompt variant that maintains Navia's voice but activates the safety escalation procedure from `system-prompt-v1.md`. The main model is never asked to handle a safety case "cold".

## 8. What we will not build

- **Ads.** Not in v1, not ever.
- **Third-party SDK tracking.** No analytics SDK that phones home with personal data. Only privacy-respecting, anonymized product telemetry (counts and opt-in).
- **A web version of the companion.** For now, the companion lives only in the mobile app, where the intimacy is highest. The web is for the landing page, founder page, and future blog.
- **A dashboard for partners, employers, or insurers.** Navia will never sell a B2B dashboard built on women's private data. If a B2B product exists one day, it is anonymized, opt-in, and orthogonal to the companion.

## 9. Open architecture questions

1. Which LLM provider survives the blind eval? (Target: decision by end of Phase 2 prototyping.)
2. Where is the voice actress recorded, and who owns the voice rights? (Contract must assign exclusive rights to Navia.)
3. How do we handle sync in phase 2 without breaking the on-device encryption guarantee?
4. How do we verify, at any moment, that we could fully delete a user's data within 24 hours if asked?
5. Do we run the safety classifier on the client or the server? Client is better for privacy but harder to update.

## 10. Stack candidates (placeholder, to be confirmed)

- Client: Swift / SwiftUI, SQLCipher, Keychain.
- API layer: Cloudflare Workers or similar edge runtime, TypeScript.
- Auth: passwordless email magic link, optionally Apple Sign In.
- Observability: error tracking without PII (Sentry with scrubbers, or self-hosted alternative).
- Infra: minimal. No Kubernetes, no analytics warehouse. The less we build, the less can leak.
