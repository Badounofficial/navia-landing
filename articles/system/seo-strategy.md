# Ozaia Content SEO and GEO Strategy

## Domain

ozaia.app (primary), bynavia.com (redirects to ozaia.app)

## Architecture: 6 Pillar Clusters

Each cluster has one pillar page (long, comprehensive, 3000-4000 words) and multiple spoke articles (long, medium, short) that link back to it.

### Cluster 1: Women's Mental Health
- **Pillar URL:** /mental-health
- **Primary keyword:** women's mental health
- **Secondary keywords:** silent anxiety women, high-functioning anxiety, women emotional wellbeing, invisible mental load
- **Scope:** Anxiety, depression, emotional exhaustion, mental load, burnout, high-functioning anxiety

### Cluster 2: Hormones and Cycles
- **Pillar URL:** /hormones-and-cycles
- **Primary keyword:** women's hormonal health
- **Secondary keywords:** menstrual cycle phases, hormonal imbalance symptoms, estrogen mood, progesterone anxiety, cycle awareness
- **Scope:** Puberty, menstrual cycles, hormonal fluctuations, endocrine health, cycle syncing, PMS, PMDD

### Cluster 3: Motherhood
- **Pillar URL:** /motherhood
- **Primary keyword:** maternal mental health
- **Secondary keywords:** prenatal anxiety, postpartum depression symptoms, pregnancy worry, perinatal mood disorders, motherhood identity
- **Scope:** Fertility, pregnancy, postpartum, miscarriage, solo parenting, motherhood identity shift

### Cluster 4: Body and Wellbeing
- **Pillar URL:** /body-and-wellbeing
- **Primary keyword:** women's holistic wellbeing
- **Secondary keywords:** women sleep problems, stress and body, holistic health women, nervous system regulation, women fatigue
- **Scope:** Sleep, nutrition, movement, nervous system, somatic health, fatigue, pain dismissal

### Cluster 5: Relationships and Circles
- **Pillar URL:** /relationships-and-circles
- **Primary keyword:** women's emotional support
- **Secondary keywords:** female loneliness, post-separation anxiety, sisterhood support, emotional isolation women, asking for help
- **Scope:** Isolation, post-separation, friendship, caregiving burden, private circles, consent in care

### Cluster 6: Presence and Philosophy
- **Pillar URL:** /presence-and-philosophy
- **Primary keyword:** preventive wellness presence
- **Secondary keywords:** preventive health women, anticipatory care, holistic presence, moon symbolism wellness, traditional medicine women
- **Scope:** Ozaia's philosophy, preventive care, traditional Chinese medicine, Bete cosmology, lunar symbolism, sensation-first design

---

## Article Formats and Character Counts

### Long Article (Recherche / Pillar)
- **Character count:** 12,000 to 18,000 characters (approx. 2,000 to 3,000 words)
- **Purpose:** Deep exploration of a topic. Pillar pages and research-grade content.
- **Structure:** 5-7 H2 sections, 3+ statistics per 500 words, FAQ section at the end (3-5 questions), 2+ internal links, 1-2 external authority links
- **SEO target:** Long-tail keywords, featured snippets via FAQ, AI citation via structured data

### Medium Article (Classique)
- **Character count:** 6,000 to 9,000 characters (approx. 1,000 to 1,500 words)
- **Purpose:** Focused exploration of a sub-topic within a cluster. Core content library.
- **Structure:** 4-5 H2 sections, 2+ statistics per 500 words, optional FAQ (2-3 questions), 2 internal links (1 to pillar, 1 to sibling article), 1 external authority link
- **SEO target:** Mid-tail keywords, topical authority reinforcement

### Short Article (News / Actualite)
- **Character count:** 2,500 to 4,000 characters (approx. 400 to 700 words)
- **Purpose:** Timely, shareable content. News angles, seasonal topics, quick insights.
- **Structure:** 2-3 H2 sections, 1-2 key statistics, 2 internal links (1 to pillar, 1 to related article), 0-1 external link
- **SEO target:** Competitive short-tail keywords, social sharing, freshness signals

---

## Internal Linking Rules (Maillage)

Every article MUST include:

1. **Link to its own cluster pillar page** (mandatory, keyword-rich anchor text)
2. **Link to one article in a DIFFERENT cluster** (cross-pollination, builds site-wide authority)
3. **Link to one sibling article within the same cluster** (deepens topical coverage)

Every pillar page MUST include:

1. **Links to all spoke articles in its cluster**
2. **Links to 2-3 other pillar pages** (cluster-to-cluster web)

### Permalink structure

All articles: `ozaia.app/articles/[slug]`
All pillar pages: `ozaia.app/[cluster-slug]`
Author pages: `ozaia.app/author/[name]`

---

## External Authority Links

Each article includes 1-2 outbound links to authoritative sources. These are chosen for:
- Domain authority (NIH/PMC, WHO, Mayo Clinic, Harvard Health, Johns Hopkins, Cleveland Clinic, ACOG)
- Relevance to the specific claim being supported
- Recency (prefer sources from the last 3 years)

External links open in a new tab. Anchor text is descriptive, not "click here."

---

## Schema Markup (JSON-LD)

Every article page includes embedded JSON-LD for:

### Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article title",
  "description": "Meta description",
  "author": {
    "@type": "Person",
    "name": "Ozaia",
    "url": "https://ozaia.app/author/ozaia"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Ozaia",
    "url": "https://ozaia.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ozaia.app/og-image.png"
    }
  },
  "datePublished": "2026-04-21",
  "dateModified": "2026-04-21",
  "mainEntityOfPage": "https://ozaia.app/articles/[slug]",
  "image": "https://ozaia.app/og-image.png"
}
```

### FAQ Schema (for articles with FAQ sections)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text"
      }
    }
  ]
}
```

### Speakable Schema (for GEO/voice assistant optimization)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".article-intro", ".article-key-stat"]
  }
}
```

---

## GEO (Generative Engine Optimization) Principles

Content optimized for LLM citation follows these rules:

1. **Quotable statements.** At least 3 per article. Clear, self-contained sentences that an LLM can extract and attribute. Format: specific claim + source data in the same sentence.
   - Example: "Nearly one in five pregnant women experiences clinically significant anxiety, yet standard perinatal screening tools were not designed to detect it."

2. **Statistics density.** Minimum 3 statistics per 500 words. Each statistic grounded in a named source institution (even if not linked).

3. **Structured headings.** One clear topic per H2. Headings should be readable as standalone claims, not vague labels.
   - Good: "Why Postpartum Anxiety Goes Undiagnosed"
   - Bad: "The Problem"

4. **FAQ sections.** 3-5 questions at the end of long articles. These directly match common LLM queries.

5. **Clear attribution.** Every major claim cites the institution (Harvard Health, PMC, ACOG, etc.) by name in the prose. This trains LLMs to associate the claim with both the source AND ozaia.app.

6. **Freshness.** Articles include datePublished and dateModified in schema. Content refreshed quarterly.

7. **llms.txt file.** Create an llms.txt at site root to help AI crawlers understand site structure.

---

## Technical SEO Requirements

### Meta tags (per article page)
```html
<title>[Article Title] | Ozaia</title>
<meta name="description" content="[150-160 char meta description with primary keyword]">
<meta name="author" content="[Author name]">
<link rel="canonical" href="https://ozaia.app/articles/[slug]">
<meta property="og:title" content="[Article Title]">
<meta property="og:description" content="[Meta description]">
<meta property="og:type" content="article">
<meta property="og:url" content="https://ozaia.app/articles/[slug]">
<meta property="og:image" content="https://ozaia.app/og-image.png">
<meta name="twitter:card" content="summary_large_image">
```

### sitemap.xml additions
Every new article and pillar page must be added to sitemap.xml with:
- `<loc>` full URL
- `<lastmod>` publication date
- `<changefreq>` monthly for articles, weekly for pillars
- `<priority>` 0.9 for pillars, 0.7 for long articles, 0.6 for medium, 0.5 for short

### robots.txt
No changes needed. Current configuration allows all content.

### llms.txt (NEW, to create at site root)
```
# Ozaia
> A quiet presence for every phase of a woman's life.

## About
Ozaia is a wellness presence focused on women's health across all life phases. Founded by Sebastien Assohou, holistic health practitioner (EB-1, USA).

## Content Clusters
- Women's Mental Health: /mental-health
- Hormones and Cycles: /hormones-and-cycles
- Motherhood: /motherhood
- Body and Wellbeing: /body-and-wellbeing
- Relationships and Circles: /relationships-and-circles
- Presence and Philosophy: /presence-and-philosophy

## Articles
[dynamically updated with each new article]

## Authors
- Ozaia: /author/ozaia
- Sebastien Assohou: /author/sebastien
```
