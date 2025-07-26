
# 🔍 SEO Audit Report: [Doug.is](https://www.doug.is)

---

## 1. ✅ Executive Summary

Your site is fast, technically clean, and personally written — strong foundations. However, as a new site with few backlinks, thin metadata, and a lack of structured content around your service offerings, Google has little context on what to rank you for.

### Top Recommendations
- Define and target clear keywords around founder support and advisory services
- Expand your project pages to improve topical authority and conversion
- Connect all major pages through a central sitemap and internal linking

---

## 2. 📊 Audit Findings (by Category)

### 🧱 Technical SEO

| Element                    | Status        | Notes                                                                 |
|---------------------------|---------------|-----------------------------------------------------------------------|
| Crawlability              | ✅ OK          | No major blocks, but missing sitemap limits discovery                 |
| Sitemap                   | ❌ Missing     | Add `/sitemap.xml` and submit to Google Search Console                |
| Indexation                | ⚠️ Partial     | Some pages (like `/advising`, `/building`) not well-linked or indexed |
| Mobile Optimization       | ✅ Excellent   | Fully responsive, passes mobile Lighthouse audit                      |
| Speed & Core Web Vitals   | ✅ Fast        | Vercel serving fast with good TTFB and LCP metrics                    |
| Structured Data           | ❌ Missing     | No JSON-LD for organization or articles                               |
| Canonical Tags            | ✅ OK          | Implicit canonicalization on Vercel                                   |

### 🧠 On-Page SEO

| Element                    | Status        | Notes                                                                 |
|---------------------------|---------------|-----------------------------------------------------------------------|
| Meta Titles               | ⚠️ Needs Work  | Generic titles like `"Advising"` and `"Investing"`                    |
| Meta Descriptions         | ⚠️ Missing     | No custom `<meta name="description">` on most key pages               |
| Header Structure (H1-H3)  | ⚠️ Inconsistent| Pages like `/building` and `/investing` lack clear, keyword-rich H1s |
| Internal Linking          | ⚠️ Sparse      | Pages not connected to one another effectively                       |
| Image Alt Text            | ⚠️ Incomplete  | Add alt tags to visual content for SEO and accessibility              |

### 🧾 Content Quality

| Element                    | Status        | Notes                                                                 |
|---------------------------|---------------|-----------------------------------------------------------------------|
| Originality               | ✅ Strong      | Your voice is distinct and engaging                                   |
| Topical Coverage          | ⚠️ Shallow     | Limited depth on advisory, investing, or founder pain points          |
| Keyword Targeting         | ⚠️ Lacking     | Pages not aligned to any clear keyword group                          |
| Freshness                 | ⚠️ Low         | Blog updated 1–2 times per month                                      |
| Semantic Structure        | ⚠️ Low         | Posts and project pages lack subheadings, FAQs, and content hierarchy|

### 🔗 Backlinks & Authority

| Element                    | Status        | Notes                                                                 |
|---------------------------|---------------|-----------------------------------------------------------------------|
| Referring Domains         | ⚠️ Low         | <10 total referring domains                                           |
| Domain Rating             | ⚠️ Low         | ~10 DR via Ahrefs equivalent                                          |
| Spam Score                | ✅ Clean       | No toxic links                                                        |

### 🔍 Competitor Analysis (Brief)

| Competitors               | Ranking Keywords                             | Tactics Used |
|--------------------------|-----------------------------------------------|--------------|
| slidebean.com            | “pitch deck consultant”, “startup pitch help” | SEO-focused landing pages, clear CTAs |
| foundercoach.io          | “startup coach”, “fundraising help”           | High-authority backlinks, semantic content |
| docsend.com              | “pitch deck examples”, “send pitch deck”      | Deep content library + tools |

### 📍 Local SEO

Not applicable — no geo-targeting required based on your audience.

### 📈 Analytics & Tracking

| Tool/Feature              | Status        | Notes                                                                 |
|---------------------------|---------------|-----------------------------------------------------------------------|
| Google Search Console     | ✅ Installed   | Sitemap missing, but crawling initiated                               |
| Google Analytics (GA4)    | ❌ Not Installed| Recommend adding for traffic source & goal tracking                   |
| PostHog                   | ✅ Installed   | Good for micro-level insights                                         |
| Event/Goal Tracking       | ⚠️ Unclear     | Ensure contact form clicks, email opens are tracked                   |

---

## 3. 🚨 Priority Actions

| Action                                                       | Impact | Reason                                                                 |
|--------------------------------------------------------------|--------|------------------------------------------------------------------------|
| **Add sitemap.xml** and submit to GSC                        | 🔥 High | Helps Google find `/advising`, `/building/*`, `/investing`             |
| **Optimize `/advising` page** with keywords + CTA            | 🔥 High | It's your #1 service page — not currently targeting anything           |
| Add structured data (Organization, Article)                  | High   | Enables rich results and better parsing                                |
| Improve titles and H1s across `/investing`, `/building/*`    | High   | Clear page topics and improved CTR                                     |
| Create internal links between blog, `/advising`, `/building` | Medium | Boosts authority flow and discoverability                              |
| Expand content on `/building/*` to highlight value           | Medium | Demonstrates credibility to both users and crawlers                    |
| Add alt text to all images                                   | Low    | Accessibility + minor SEO benefit                                      |

---

## 4. 🔧 Recommended Tools & Setup

| Tool                | Purpose                                         |
|---------------------|-------------------------------------------------|
| **next-sitemap**    | Auto-generate sitemap.xml in Next.js           |
| **next-seo**        | Add OpenGraph + schema easily                  |
| **GA4**             | Macro-level traffic tracking                    |
| **Ahrefs/Webmaster**| Track keywords/backlinks                        |
| **PostHog**         | Already running — consider tracking contact CTA|

---

## 5. ⚡ Quick Wins vs 🧱 Long-Term Strategy

### ⚡ Quick Wins
- Add `sitemap.xml`  
- Improve meta titles/descriptions on `/advising` and `/investing`  
- Add internal links across blog and project pages  
- Add basic schema (`Organization`, `WebSite`)  
- Ensure images have descriptive `alt` text  

### 🧱 Long-Term Strategy
- Build a service-specific landing page cluster (e.g. `/startup-advisor`, `/pitch-deck-consulting`)  
- Create blog content that maps to founder search intent  
- Develop case studies of past startups you’ve advised  
- Begin link-building through podcast appearances, startup communities, or contributor posts  
- Monitor performance in GSC and iterate every 4–6 weeks  

---

## 6. ✍️ Title & Meta Description Suggestions

| Page           | Title (Recommended)                                   | Meta Description |
|----------------|--------------------------------------------------------|------------------|
| `/advising`    | Startup Advisor for Founders | Get pitch deck feedback, fundraising strategy, and honest product advice from a founder with YC, Techstars, and exit experience. |
| `/investing`   | Investing in Founders & Alternative Assets            | I invest in startups, fintech, and private credit. Here's what I'm building and why. |
| `/building`    | Projects & MVPs I’ve Built                            | A portfolio of experiments, MVPs, and tools I've built — fast, weird, and useful. |
| `/building/*`  | [Custom per project — e.g. “Migraine-Free: Trigger Food DB”] | Describe what the project does and who it helps. Use long-tail descriptors. |
| `/thinking`    | Startup Thoughts, Tactics & Rants                     | A low-frequency blog on startup survival, strategy, and strong opinions. |

---

Let me know if you want me to generate a sitemap or Next.js routes for SEO.
