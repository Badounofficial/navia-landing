# Ozaia — Building the Intelligent Companion App

## A Complete Roadmap for Sebastien Assohou

*Created April 9, 2026. Reconciled April 10, 2026 with the new companion system foundation documents.*

---

## 0. Why this roadmap exists

An earlier version of this file proposed a React Native + Supabase stack. Since then, four foundation documents have been written in `Ozaia App/navia-companion/`:

- `personality.md` — who Ozaia is, her voice, her values, her limits
- `system-prompt-v1.md` — first draft system prompt for internal testing
- `architecture.md` — technical blueprint: iOS native, privacy first, custom voice
- `mvp-features.md` — the tight v1 feature scope

Those four documents are now the source of truth. This roadmap translates them into a week-by-week plan that Sebastien can actually walk through. Whenever a technical question comes up, the answer lives in one of those four files, not here.

---

## 1. Honest framing

Building a women's health companion app is one of the hardest product categories in software. It mixes sensitive data, emotional intelligence, voice, and medical context. Companies like Flo, Clue, and Ovia have 50-plus engineers and tens of millions in funding.

We do not need to beat them at volume. We need to beat them at depth. One woman, one voice, one presence, one beautiful experience. Then another.

Sebastien is non-technical by training. He learns by doing, with concepts explained in the flow of real work. No upfront courses. Claude codes, Sebastien pilots vision, tone, and the human layer. Everything moves at the speed at which Sebastien stays comfortable and awake.

**Estimated timeline to first usable MVP on a real phone:** 4 to 6 months of consistent work.
**Estimated timeline to private beta with the first 500 waitlist members:** late 2026.
**Public launch:** not before the experience has earned it.

---

## 2. What Ozaia actually needs

Six moving parts, same as any serious product. The difference is in how we build each one.

1. **Client app.** A polished iOS app first. Android later.
2. **Edge API layer.** Thin, ours, privacy-first. Handles auth, prompt assembly, safety filtering, model routing.
3. **Local storage.** Encrypted on device with a key held in the Keychain. Server never sees plaintext diary content.
4. **Language model.** Managed frontier chat model behind our edge layer, with a smaller auxiliary model for summarization and a dedicated safety classifier.
5. **Voice.** Custom Ozaia voice, recorded with a real voice actress, synthesized through a provider that supports voice cloning with strict consent.
6. **Gifting.** Hand-curated for the first 500 members, automated later.

The full technical rationale, the non-goals, and the open architecture questions are in `navia-companion/architecture.md`. This roadmap does not repeat them, it references them.

---

## 3. The stack

| Component | Technology | Why |
|-----------|-----------|-----|
| Client app | **Swift + SwiftUI (iOS)** | Apple's native stack gives us the highest quality of animations, voice playback, local encryption, and overall polish. Better than cross-platform for an intimacy-first product. |
| Local storage | **SQLCipher** | AES-256 encrypted SQLite. Diary, check-ins, cycle, and conversation all live here on device. |
| Key storage | **iOS Keychain** | Database key generated at first launch, stored with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`, never leaves the phone. |
| API layer | **Edge runtime (e.g. Cloudflare Workers)** in TypeScript | Thin server we own. Handles auth, prompt assembly, safety filter, model routing. No heavy infrastructure. |
| Auth | **Passwordless email magic link**, optionally Apple Sign In | No passwords to leak. |
| Main model | **A frontier chat model** (provider chosen after a blind eval, see `architecture.md` §5) | Must allow training opt-out and support an 8k-plus system prompt. |
| Auxiliary model | A smaller model for summarization and pattern detection | Keeps the main model's context clean. |
| Safety classifier | Small dedicated classifier on every user turn | Flags self-harm, medical emergency, abuse, eating disorders before the main model sees the message. |
| Voice synthesis | **Custom Ozaia voice** via a provider supporting voice cloning | See `architecture.md` §4 for the v1 approach. |
| Error tracking | Sentry with PII scrubbers, or a self-hosted alternative | No raw data leaves the app. |
| Analytics | **None** at launch | No analytics SDK that phones home with personal data. Only anonymized, opt-in product telemetry later. |
| Android | **Kotlin + Jetpack Compose** | Phase 2, after iOS validation. |

**No** React Native. **No** Supabase. **No** third-party tracking SDK. **No** ads.

---

## 4. Phases at a glance

| Phase | Window | Goal |
|-------|--------|------|
| Phase 0 — Foundations | Now → end of April 2026 | Landing page tight, waitlist building, companion foundation documents locked. |
| Phase 1 — Swift fundamentals | May → early June 2026 | Sebastien builds a simple three-screen Swift app, learns SwiftUI basics by doing. |
| Phase 2 — App shell | June → July 2026 | Onboarding, daily check-in, diary, cycle module, pregnancy module. Local only, no AI yet. |
| Phase 3 — The brain | July → September 2026 | Edge API, companion model, safety classifier, system prompt v1 wired to the diary. |
| Phase 4 — The voice | August → September 2026 | Voice actress recorded, custom Ozaia voice integrated, pre-rendered phrases cached on device. |
| Phase 5 — Private beta | October → December 2026 | First 500 waitlist members, weekly hand-written feedback rounds, iterate on voice and tone. |
| Phase 6 — Public launch | Early 2027 | App Store submission, pricing, Android, gifting automation. |

Dates are targets, not commitments. Ozaia launches when Ozaia is ready, not before.

---

## 5. Phase 0 — Foundations (now → end of April 2026)

**Status:** in progress.

**Done already:**
- Landing page live at bynavia.com, responsive, PageSpeed above 95 on mobile and desktop.
- Founder bio, photo, brand identity, and writing style locked.
- Two showcase sections ("A day with Ozaia" and "Inside Ozaia") shipping Ozaia's visual language.
- Hero phone with a multi-turn conversation that demonstrates Ozaia's voice.
- Companion personality, system prompt v1, architecture, and MVP feature scope drafted.

**To do before we leave Phase 0:**
- [ ] Consult a US IP attorney on the "Ozaia" trademark, given adjacent "Ozaia Benefit Solutions" (health benefits) already exists. (See `project_legal_reminder.md`.)
- [ ] Draft Terms of Service and Privacy Policy (CCPA-compliant).
- [ ] Register a US business entity (LLC or Corp) before collecting real user data.
- [ ] Run the blind LLM eval described in `architecture.md` §5 and pick the main model.
- [ ] Write the voice brief, brief casting agencies or voice-over platforms, audition three to five actresses.
- [ ] Build the waitlist gently toward 500 members, with Brevo still in demo mode.

**What Claude does in this phase:** writing, copywriting, code for the landing page, research, drafts.
**What Sebastien does in this phase:** legal conversations, voice casting, brand tone decisions, landing page uploads to GitHub.

---

## 6. Phase 1 — Swift fundamentals (May → early June 2026)

Sebastien needs to become comfortable reading Swift and SwiftUI, not fluent. Think of it like learning enough Italian to order food in Rome and follow a conversation, not to write a novel.

**Weeks 1 and 2: Swift basics.**
- Variables, functions, optionals, closures, structs, enums.
- How to read an Xcode error message and calm down.
- Two small playground exercises per day, maximum two hours.

**Free resources:**
- Apple's *Swift Playgrounds* app on iPad or Mac. Start with "Learn to Code 1".
- The *Hacking with Swift* "100 Days of SwiftUI" free course at hackingwithswift.com. We will not do all 100 days, we will pick what matters.
- Apple's official *Swift Book* for reference, not for reading cover to cover.

**Weeks 3 and 4: SwiftUI.**
- `View`, `@State`, `@Binding`, `NavigationStack`, `List`, `TextField`, `Button`.
- Layout: `VStack`, `HStack`, `ZStack`, `Spacer`, `padding`, `frame`.
- Reading an SF Symbol icon and placing it in a card.
- Building a tiny three-screen app: onboarding, home, and a single editable note.

**Milestone:** by the end of Phase 1, Sebastien can open Xcode, run a blank SwiftUI project on his iPhone, add a button, change the color, and not panic.

**What Claude does:** explain each concept the moment Sebastien hits it, write the starter code for each screen, leave blanks for Sebastien to fill in as exercises.

---

## 7. Phase 2 — App shell (June → July 2026)

Build the real Ozaia app skeleton. No AI yet, no backend yet, no voice yet. Everything runs on device.

**Screens to build, in this order:**

1. **Welcome.** Brand, logo, one line, "Get started" button.
2. **Onboarding.** Four soft questions: name, age, chapter, one thing Ozaia should know about today.
3. **Home.** Greeting in Cormorant Garamond, current day of cycle or pregnancy week, today's check-in card, diary entry point. No tabs, one screen that scrolls.
4. **Daily check-in.** Mood dial, energy dial, sleep dial, optional one-line note. Thirty seconds max.
5. **Diary.** Freeform text entry. Voice-to-text through Apple's on-device Speech framework so audio never leaves the phone.
6. **Cycle.** Cycle ring view (same visual language as the landing page "Inside Ozaia" card), period logging.
7. **Pregnancy.** Week-by-week view, activated only if the user said she is pregnant.
8. **Settings.** Notification controls, export all data, "forget everything", Ozaia's "Ozaia knows" memory sheet, founder page.

**Key SwiftUI modules to learn along the way:**
- `NavigationStack` and path-based navigation.
- `@Observable` and `Observation` framework for state.
- `DatePicker` and custom date pickers.
- `Charts` framework for patterns (comes free with iOS 16+).
- Local persistence with SQLCipher via `GRDB.swift`.
- Keychain access via `KeychainAccess`.

**Milestone:** by end of Phase 2, Sebastien can hand his phone to a friend, open the app, record a mood, write in the diary, log a period, and quit. All data stays on the phone.

---

## 8. Phase 3 — The brain (July → September 2026)

Wire the companion model behind a thin, privacy-first API layer. This is where Ozaia starts to actually respond.

**Server-side pieces to build:**

- **Edge runtime project** (Cloudflare Workers in TypeScript, or equivalent). Single endpoint: `POST /turn`.
- **Auth middleware.** Validates magic-link session token. No password flow, no long-lived credentials.
- **Prompt assembler.** Builds the working context from the fields the client sends: `{ chapter, last_3_diary_entries, last_3_checkins, recent_mood_trend, current_cycle_day or pregnancy_week, named_entities }`. Cap at roughly 2k tokens.
- **Safety classifier.** Small dedicated model called on every incoming user turn. Routes to the safety prompt variant if any category fires.
- **Model router.** Main companion turns to the big model. Summarization and gentle ideas to the smaller model. Safety cases to the safety variant.
- **Response streaming.** Stream tokens back to the client so Ozaia's reply appears as she "thinks".

**Client-side pieces:**

- Reactive `ConversationStore` that talks to the API.
- Streaming text renderer in the diary so Ozaia's reply types in, exactly like the landing page hero demo.
- Retry and offline queue: if the phone is offline when Emma writes, the entry is saved locally and sent when connectivity returns. Emma never loses a word.
- Error handling that is kind, not technical. "Ozaia is catching her breath. One moment."

**System prompt:** we start with `navia-companion/system-prompt-v1.md` exactly as written. Then we run the blind eval with five synthetic personas (Emma pregnant, Leila TTC, Sara heavy period, Anne post-partum, Clara peri-menopausal), measure rule compliance and warmth, and refine the prompt. We do not retrain anything, we just keep editing the prompt.

**Milestone:** by end of Phase 3, Sebastien can write a diary entry on his iPhone and get a warm, on-brand reply from Ozaia in under 2 seconds.

---

## 9. Phase 4 — The voice (August → September 2026, overlapping Phase 3)

This phase runs in parallel with Phase 3 because voice casting and recording take calendar time, and the voice must feel right before private beta.

**Steps:**

1. **Voice brief.** Finalize the written brief: timbre, pacing, breath handling, reading sample sentences, exclusion list. Based on `personality.md` §4 and `architecture.md` §4.
2. **Casting.** Three to five actresses audition the same sample script.
3. **Selection with women from the target audience.** Blind listening test with five to ten women. They pick the voice they trust with their diary.
4. **Studio recording.** Roughly two hours of neutral and warm reading, plus breath-only samples.
5. **Custom voice training.** Send recordings to a provider that supports voice cloning under strict consent, with exclusive rights assigned to Ozaia by contract.
6. **Pre-rendered phrases.** Ship frequently used phrases baked into the app bundle: "Good morning", "I'm here", "Sleep gently", "Before you sleep". Latency drops to zero for those.
7. **Natural breath injection.** Stitch pre-recorded breath samples into silence gaps in post-processing if the synthesized output feels too smooth.

**Milestone:** Sebastien plays Ozaia's reply on his iPhone, closes his eyes, and feels a real person talking to him.

---

## 10. Phase 5 — Private beta (October → December 2026)

**Who:** the first 500 members from the bynavia.com waitlist, invited in waves of 50 per week.

**How:**
- Invite by personal email, written by Sebastien, not a mass blast.
- TestFlight for iOS distribution.
- Weekly hand-written feedback rounds. Every message from every beta user is read by Sebastien, one at a time. This is non-negotiable for the first 500.
- Bug fixes and prompt refinements happen in rolling releases, not monthly sprints.

**What we measure (the signals that actually matter):**

1. Do women come back the next day, without a push notification?
2. Do they write in the diary? Average diary length over time is a better signal than any streak.
3. Do they play Ozaia's audio replies? If yes, the voice is working.
4. Do they tell other women? Qualitative, via the "how did you find us?" question.
5. Do they say, in their own words, that Ozaia made them feel less alone?

**What we do not measure:** DAU with a growth-team lens. Streaks. Badges. "Engagement". Those numbers are not the product.

**If the signals are weak,** we do not add features. We make the existing ones more tender.

---

## 11. Phase 6 — Public launch (early 2027)

**App Store preparation:**
- Screenshots, one per module, shot in the brand palette.
- Description and keywords (ASO).
- Privacy policy and Terms of Service, reviewed by counsel.
- Apple Developer account ($99 per year).
- Submission to App Store review.

**Android kick-off:**
- Kotlin + Jetpack Compose project scaffolded during private beta.
- Full parity target for Q2 2027.

**Gifting automation:**
- Partnership with three to five small wellness brands (tea, candles, skincare, baby items, prenatal care).
- Lightweight catalog in a headless CMS.
- AI suggestion, human review, human shipping for v1.5.
- Fully automated flow for v2.

**Business model (tentative, subject to change based on beta signals):**

| Tier | Price | Includes |
|------|-------|----------|
| Ozaia Free | $0 | Check-in, diary, cycle, pregnancy tracking, unlimited companion turns |
| Ozaia Plus | $9.99/mo | Pattern insights, longer memory, priority voice |
| Ozaia Care | $29.99/mo | Everything + one curated gift per month |
| Ozaia Love | $49.99/mo | Everything + two gifts per month + priority companion |

The MVP document (`navia-companion/mvp-features.md`) is explicit that there is **no paid tier at launch**. Pricing lands only once the experience has earned it. These tiers are placeholders so we know what "later" looks like, not a commitment to them.

---

## 12. Legal and compliance (critical, do not skip)

Ozaia handles some of the most sensitive personal data a woman can share. The legal foundation is not optional.

1. **Ozaia is not a medical device** and will not pursue HIPAA compliance. We will follow best practices anyway: encryption at rest and in transit, zero third-party data sharing, clear retention and deletion policies.
2. **Privacy policy** must clearly state what data we collect, why, how the language model processes diary entries, that we never sell or share personal health data, and how users can delete everything in one tap.
3. **Terms of service** must include: "Ozaia is not a medical device or a substitute for professional care", limitation of liability, minimum user age.
4. **CCPA compliance** for California, plus state-specific privacy laws as they emerge (Virginia VCDPA, Colorado CPA, and so on).
5. **Apple guidelines** around health content, mental health content, and sensitive data handling.
6. **Trademark** must be resolved with a US IP attorney before Phase 5. "Ozaia Benefit Solutions" already exists in the adjacent health benefits space.
7. **Business entity** (LLC or Corp) must be in place before the first real user email lands in our database.
8. **Safety escalation policy** must be documented, reviewed, and baked into the system prompt and the classifier layer.

A healthcare and tech attorney should review everything before we open the private beta to real users.

---

## 13. Tools Sebastien will use

**Development:**
- **Xcode** on a Mac. Apple's IDE. Free.
- **SF Symbols** app for icons.
- **iPhone** for real-device testing (Sebastien already has one).
- **GitHub** for the landing page today, and for the app project later.

**Design:**
- **Figma** for app mockups. Free tier is plenty.
- **Canva** for marketing visuals Sebastien already knows.

**Project management:**
- This roadmap file. Kept current after every working session, per the file hygiene rule.
- A simple `DECISIONS.md` log we will start in Phase 1 (what was decided, when, and why).

**Writing:**
- `navia-companion/personality.md` as the north star every time the voice drifts.

---

## 14. Weekly rhythm (suggested, not rigid)

| Day | Focus | Hours |
|-----|-------|-------|
| Monday | New concept, just-in-time learning | 2h |
| Tuesday | Build, with Claude pair-programming | 3h |
| Wednesday | Build, continue | 3h |
| Thursday | Debug, refine, polish | 2h |
| Friday | Review, capture decisions, plan next week | 1h |
| Weekend | Optional. Voice casting calls, brand work, reading | 2 to 4h |

**Total: 13 to 15 hours per week.** Realistic for a solo founder who also has a coaching practice and a life. Sebastien can scale up or down as the season allows.

---

## 15. Key milestones

| When | Milestone | Deliverable |
|------|-----------|-------------|
| End of April 2026 | Phase 0 closes | Legal consultation started, voice brief written, model chosen |
| Mid June 2026 | Phase 1 closes | Sebastien runs a three-screen Swift app on his iPhone |
| End of July 2026 | Phase 2 closes | Full local-only app shell with all core modules |
| Mid September 2026 | Phase 3 closes | Ozaia replies to diary entries with v1 prompt through our API |
| End of September 2026 | Phase 4 closes | Custom Ozaia voice live in the app |
| October 2026 | Phase 5 opens | First wave of 50 private beta testers |
| End of December 2026 | Phase 5 closes | 500 beta members, hand-read feedback in hand, prompt and voice refined |
| Early 2027 | Phase 6 | App Store submission, pricing, Android kick-off |

---

## 16. Collaboration model

Same as always:

- **Sebastien** brings the vision, the women's health expertise, Ozaia's tone, the emotional compass, the voice casting decisions, and the relationships with beta users.
- **Claude** brings the code, the architecture, the just-in-time teaching, the prompt engineering, the writing, and the gentle pushback when something drifts off-brand.
- **Neither of us** takes shortcuts that compromise privacy, voice, or dignity.

The core philosophy is unchanged from `project_navia_roles.md`:

> "Tu dois humaniser au maximum l'app avec des emotions, de l'empathie, de l'experience, de l'amour et de l'attention envers l'autre."

Every technical decision in this roadmap serves that sentence.

---

## 17. What this roadmap is not

- **Not a contract.** Dates shift, phases overlap, decisions change. The living version is this file, updated after each working session.
- **Not a replacement for the foundation documents.** `personality.md`, `system-prompt-v1.md`, `architecture.md`, and `mvp-features.md` remain the source of truth for what Ozaia is, how she speaks, and how she is built.
- **Not a growth playbook.** We will talk about distribution in Phase 6, not before.
- **Not a place to bury stale ideas.** If something in here becomes wrong, we delete it immediately. No contradictions, no drift.

---

*"The best time to start was yesterday. The second best time is now." Let's go, Badoun.*
