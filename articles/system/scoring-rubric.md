# Ozaia Article Scoring Rubric

Every article must score above 90/100 before publication. Each criterion is scored out of 20.

---

## 1. SEO (20 points)

| Criteria | Points | How to Evaluate |
|---|---|---|
| Primary keyword in H1 title | 3 | Exact or close-match keyword in the main title |
| Primary keyword in first 100 words | 2 | Natural inclusion, not forced |
| H2 headings contain secondary keywords | 3 | At least 2 of 4+ H2s include relevant keywords |
| Meta title under 60 characters with keyword | 2 | Check character count and keyword presence |
| Meta description 150-160 chars with keyword | 2 | Compelling, includes primary keyword |
| Internal links: 1 to pillar + 1 cross-cluster + 1 sibling | 3 | All three link types present with descriptive anchor text |
| External authority link (Tier 1 or 2 source) | 2 | At least 1 outbound link to PMC, Mayo, Harvard, etc. |
| URL slug is keyword-rich and clean | 1 | e.g., /articles/silent-anxiety-pregnancy not /articles/article-2 |
| Image alt text (when images present) | 1 | Descriptive, keyword-relevant |
| Schema markup complete (Article + Author + FAQ if applicable) | 1 | JSON-LD blocks verified |

---

## 2. GEO (20 points)

| Criteria | Points | How to Evaluate |
|---|---|---|
| 3+ quotable statements per 500 words | 4 | Self-contained sentences an LLM could extract and cite |
| Statistics density: 3+ per 500 words | 4 | Named source + specific number in same sentence |
| Each H2 readable as a standalone claim | 3 | Headings are descriptive, not vague ("The Problem") |
| Source institutions named in prose | 3 | "According to Harvard Health" or "research published in PMC" woven naturally |
| FAQ section with 3-5 questions (long articles) | 3 | Questions match real LLM queries; answers are concise |
| Clear author attribution in schema | 2 | Author name, URL, description in JSON-LD |
| Freshness signals (datePublished, dateModified) | 1 | Present in schema markup |

---

## 3. Human Text / Non-AI (20 points)

| Criteria | Points | How to Evaluate |
|---|---|---|
| No em-dashes or en-dashes | 3 | grep for -- and - |
| No AI signature phrases | 3 | Check: "In today's world", "It's important to note", "Let's dive in", "In conclusion", "Moreover", "Furthermore", "Delve" |
| Varied sentence length and rhythm | 3 | Mix of 5-word and 25-word sentences. No uniform cadence. |
| No symmetric triple structures | 2 | Avoid "A, B, and C" pattern repeated across paragraphs |
| Varied paragraph openings | 3 | No two consecutive paragraphs start with same word |
| Emotional specificity over generality | 3 | "She lies awake calculating unlikely catastrophes" not "She feels anxious" |
| Read-aloud test | 3 | Does it sound like a person wrote it, or a language model? |

---

## 4. Viral Potential (20 points)

| Criteria | Points | How to Evaluate |
|---|---|---|
| Hook in first 2 sentences | 4 | First lines create curiosity, emotion, or recognition. Would she keep reading? |
| Headline shareable and emotional | 4 | Would a woman screenshot this title and send it to her sister? |
| At least 1 "I feel seen" moment | 4 | A passage so specific it feels personal. The moment she thinks "how does she know?" |
| Emotional arc (not flat) | 4 | The article moves: recognition > understanding > relief or solidarity |
| Closing line that lingers | 4 | Last sentence stays in the mind. Not a summary. Not a CTA. A resonance. |

---

## 5. Branded (20 points)

| Criteria | Points | How to Evaluate |
|---|---|---|
| Voice matches author profile | 4 | Ozaia = literary, intimate, unhurried. Sebastien = grounded, warm, body-aware. |
| No competitor mention or comparison | 3 | Zero references to Calm, Flo, Headspace, Clue, or any other brand |
| "Presence" not "companion" | 2 | grep for "companion" = 0 results |
| No banned phrases (full list) | 3 | Check against all 20 banned phrases from dangerous-responses |
| No functional language ("helps you", "track") | 2 | grep for functional framing |
| Philosophy embedded naturally | 3 | Preventive presence, "understood before having to ask" woven in without being preachy |
| Consistent with improvement log | 3 | No repeated statistics, no contradicted positions, no recycled openings |

---

## Scoring Process

Before sending any article:

1. Run automated checks (grep for dashes, banned phrases, competitor names, functional language)
2. Score each criterion manually
3. Total must be > 90/100
4. If < 90, identify weakest criterion and rewrite those sections
5. Record final score in the article's frontmatter

## Score Recording Format

At the top of each article markdown file:

```
<!--
SCORE: 94/100
SEO: 19 | GEO: 19 | Human: 18 | Viral: 19 | Brand: 19
Scored: 2026-04-21
Reviewer: Claude
Notes: [any specific notes]
-->
```
