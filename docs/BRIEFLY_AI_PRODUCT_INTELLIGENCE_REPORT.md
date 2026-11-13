# BRIEFLY.AI — PRODUCT INTELLIGENCE REPORT

**Prepared:** 13 November 2026 (all "accessed" dates = this date)
**Scope status:** Research Passes 1–5 partially complete, Passes 6–7 complete at the level the evidence allows. **Read Section 0 before relying on anything below.**

**Evidence labels used throughout**

| Tag | Meaning |
|---|---|
| **[VF]** | Verified fact: read directly on an official page or official docs during this research |
| **[MC]** | Company marketing claim (stated by the vendor, not independently verified) |
| **[2ND]** | Reported by a third party. Many are *vendor-authored comparison blogs*, which are biased toward their own product |
| **[UR]** | User-reported observation |
| **[INF]** | Researcher's inference. Never a confirmed implementation detail |
| **[REC]** | Strategic recommendation |

---

## 0. Research Limitations (read first)

This report is honest about what it is: a **well-evidenced first-pass**, strongest on the sponsor stack and the PitchSense reference product, and **thinner than the assignment asked for** on the rest of the market.

**What was actually opened and read (primary sources):**
- PitchSense homepage and pricing page
- Tavily docs home, Search API reference, Research API reference, API credits/pricing docs, FAQ
- Bifrost marketing site (docs.getbifrost.ai was *not* opened)

**What was NOT done:**
- Primary product pages were **not** opened for Gong, Clari, Salesforce, HubSpot, Clay, Apollo, ZoomInfo, Avoma, Fireflies, Otter, Perplexity, ChatGPT Deep Research. Their entries below rely on **[2ND] sources, mostly vendor-authored listicles**, and are labelled as such. No pricing is verified for them except where stated.
- **No original Reddit, Hacker News, G2, Capterra or Product Hunt review threads were retrieved.** Section 10 therefore cannot claim "recurring complaints" from user reviews. It contains vendor-blog analysis, one G2 aggregate and one blogger opinion, and says so.
- No product was trialed. No public interactive demo was exercised. No onboarding flow was observed.
- Tavily Extract, Crawl, Map doc pages and Research pricing/latency were not opened. Only their one-line descriptions from the docs index are verified.
- Bifrost's documentation (routing, fallback config, observability) was not read; claims are marketing-page level.

**Recommended follow-up:** a dedicated pass for (a) primary pages of the 12 named incumbents, (b) direct review-platform and forum threads, (c) Tavily Extract/Crawl/Research cost and latency tests with a real key. Section 26 lists what remains.

---

## 1. Executive Summary

1. **The "pre-meeting brief" is already a feature, not a category.** Nearly every conversation-intelligence or sales platform now advertises one. **[2ND]** But most build the brief from *internal* data (CRM, past calls, emails). Gong's brief is reported to be "only as good as what Gong has already captured." **[2ND, vendor blog]**
2. **PitchSense, the reference product, is an internal-memory product.** Its homepage organises everything around calls, emails, CRM records and company knowledge feeding a "shared memory." The pre-call brief shows history, last-conversation quotes, open questions and pre-meeting tasks. **[VF]** Fresh *external* research on the counterpart (news, launches, hires, funding in the last 30 days) is **not** a visible pillar on its homepage. **[INF: absence on one page, not proof of absence in the product]**
3. **That is the opening for Briefly.ai:** a product that works from a *cold start* (a name and a time) using the open web, with no CRM, no recorded history and no integration setup. This is exactly what the hackathon problem statement describes.
4. **The hardest problem is not summarisation, it is temporal and entity correctness.** Tavily's own docs state that `published_date` is "Tavily's best estimate of when the source was published or last updated, so it can be later than the original publish date," and that by default results with no detectable date are **not** removed. **[VF]** An agent that trusts date filtering will put old events in a "last 30 days" brief. A verification layer that checks event date vs. publication date is a real differentiator.
5. **Industry commentary converges on three failure types:** invented facts, stale facts, and correct facts attached to the wrong entity. **[2ND, Unify blog]** Each needs a different fix. This maps cleanly onto an evaluation framework (Section 21).
6. **Recommended direction:** Direction A (focused pre-meeting research agent), executed to a very high reliability bar, plus a thin slice of B (meeting type and user-supplied context). Defer memory and relationship intelligence.
7. **Recommended stack:** Tavily Search (news + general, explicit date window) + Tavily Extract for evidence and date verification + a structured-output LLM synthesis with per-claim source binding. Treat Tavily Research API as a baseline/comparison, not the core. Treat Bifrost as optional.

---

## 2. Briefly.ai Product Context

**[VF: from the supplied assignment]** Briefly.ai is positioned as an AI pre-meeting research agent. Tagline: "Walk into every meeting prepared." Hackathon: Global AI Hackathon (Geek Room), Problem Statement 05, Tavily track.

**Mandatory (P0) requirements, restated:**
1. Input: company or person name + scheduled meeting time
2. Meeting context
3. Research covering the **preceding 30 days**
4. News, launches, hires, other meaningful updates
5. Concise, structured **one-page** briefing
6. **Source attribution** for factual claims
7. Useful open questions and discussion points

**Stated encouragements:** sales/partnership/investor/BD use cases; distinguishing verified from uncertain; avoiding fabrication.

**[REC] Guardrail:** every later recommendation in this report is tagged to a P0 item, a verified user problem, or a competitor gap. Anything else is P3.

**Ambiguity to resolve early:** "the preceding 30 days" is relative to *what*? Today, or the meeting time? **[REC]** Use window end = min(now, meeting time) and window start = that minus 30 days. State the exact window on the briefing. If the meeting is in the past, say so.

---

## 3. Market Overview

**[INF, from the landscape below]** Three layers are visibly distinct:

| Layer | What it knows | Representative products | Weakness for cold-start meetings |
|---|---|---|---|
| **Backward-looking meeting capture** | Past transcripts | Otter, Fireflies, Fathom, Granola, Avoma **[2ND]** | Brief is only as good as the last transcript **[2ND, Sentra blog]** |
| **Revenue / deal intelligence** | CRM + calls + email | Gong, Clari, PitchSense, Oliv, Sybill **[VF/2ND]** | Needs integrations and history; priced for teams |
| **Data enrichment / account research** | Firmographic + contact data | Clay, Apollo, ZoomInfo **[2ND]** | "Data-only: they tell you who, not what to do in the meeting" **[2ND, MarketBetter blog]** |
| **General research agents** | The open web | Perplexity, ChatGPT Deep Research, Gemini, Tavily Research | Not meeting-aware; no time window discipline; generic output **[INF]** |

**Newer entrants focused specifically on meeting prep for *any* meeting** surfaced in search (**[2ND]**, mostly self-promotional): Evan, Aomni, Speck, Nimitai, AmpUp, EchoIQ, Sentra, Peregrine Intelligence, Adrata. Also an AWS Marketplace multi-agent offering from Provectus ("Agentic Pre-Meeting Intelligence") that describes agents that "research, validate, and synthesise" into cited briefs. **[MC, AWS Marketplace listing]**

**[INF]** The market is crowded at the "AI sales prep" level and **less crowded at "verifiable, cited, time-boxed external briefing for non-CRM users"**. That claim needs validation by directly testing Evan, Aomni, Speck and Sybill (not done).

---

## 4. Market Segmentation

| Segment | Buyer | Primary need | Fit with Briefly.ai |
|---|---|---|---|
| Enterprise sales teams | RevOps, sales leaders | Standardised prep inside CRM | Low (incumbents own this) |
| Founder-led / SMB sales | Founders, AEs | Fast prep without CRM setup | **High** |
| Investors / VCs | Associates, partners | Fresh signal on founders/companies | **High** (matches problem statement) |
| Partnerships / BD | BD leads | Counterpart context, mutual angles | **High** |
| Recruiting / interviews | Recruiters, candidates | Company + interviewer context | Medium |
| Consultants / agencies | Account leads | Pitch prep **[2ND: Peregrine]** | Medium |
| Non-sales exec meetings | Executives | Any-meeting prep | Medium, validated only by competitor positioning |

---

## 5. Competitor Landscape

Relevance to Briefly.ai: **Direct** = generates pre-meeting briefs; **Adjacent** = feeds or surrounds the brief; **Infrastructure** = could be a component.

| # | Product | Category | Relevance | Evidence quality |
|---|---|---|---|---|
| 1 | PitchSense | Sales memory / call+deal intelligence | Direct (internal-context briefs) | **Primary [VF]** |
| 2 | Gong | Conversation / revenue intelligence | Direct, internal-data | [2ND] only |
| 3 | Clari / Clari Copilot | Revenue intelligence | Adjacent | [2ND] only |
| 4 | Salesforce (Agentforce) | CRM + AI | Adjacent | Not researched |
| 5 | HubSpot | CRM + AI | Adjacent | Not researched |
| 6 | Clay | Enrichment + AI research workflows | Adjacent/Infrastructure | [2ND] only |
| 7 | Apollo | Prospect data | Adjacent | [2ND] only |
| 8 | ZoomInfo | Company/contact data (publishes "AI call briefings" guide) | Adjacent | [2ND] only |
| 9 | Avoma | Meeting assistant, lighter brief | Direct (light) | [2ND] only |
| 10 | Fireflies.ai | Notetaker; briefs from past conversations | Adjacent | [2ND] only |
| 11 | Otter.ai | Notetaker | Adjacent | [2ND] only |
| 12 | Perplexity | Cited research | Alternative | [2ND] only |
| 13 | ChatGPT Deep Research | Agentic research | Alternative | [2ND] only |
| 14 | Tavily Research | Research API | **Infrastructure** | **Primary [VF]** |
| 15 | Oliv AI | Meeting assistant / coaching + prep | Direct | [2ND] (self-published) |
| 16 | Sybill | Briefs from recorded calls | Direct (limited to recorded calls) | [2ND] |
| 17 | AmpUp | Dedicated pre-call briefs | Direct | [2ND] (self-published) |
| 18 | Evan | "Researches any meeting end to end" | **Direct, closest positioning** | [2ND] (self-published) |
| 19 | Aomni | Bulk enterprise account research | Direct/adjacent | [2ND] |
| 20 | Speck | Automated meeting research from connected sources | Direct | [2ND] |
| 21 | Sentra | Briefs from meetings, email, Slack, CRM, tickets | Direct | [2ND] (self-published) |
| 22 | Nimitai | Brief + talk track + questions + objection plan | Direct | [2ND] (self-published) |
| 23 | Granola | Light notes + brief | Adjacent | [2ND] |
| 24 | Provectus Agentic Pre-Meeting Intelligence | Multi-agent cited briefs (AWS Marketplace) | Direct (enterprise) | [MC] listing |

**Caveat:** items 15–23 are mostly known to us through each other's marketing blogs. Treat rankings (e.g., "best overall") as advertising.

---

## 6. Competitor Profiles

### 6.1 PitchSense → see Section 7 (primary-source deep dive)

### 6.2 Gong **[2ND only]**
- Pre-meeting summary: objectives, topics from previous conversations, outstanding action items, suggested questions, reminders; plus an "ask anything about the deal" capability. Source: getmaxiq.com comparison (23 days old at time of retrieval), a competitor-authored blog.
- Another comparison states Gong has "no named pre-call briefing product" (ampup.ai, a direct competitor, 154 days old). The two blogs **disagree**, so this is unresolved. A third (oliv.ai) dates a Gong AI meeting-prep summary to Oct 2025.
- Pricing **[2ND]**: reported about $1,300–$1,600 per user per year plus a $5K–$50K platform fee (marketbetter.ai, getmaxiq.com). Not verified on Gong's site.
- **[INF]** Strength: depth on your own recorded history. Limit: depends on what it has captured; priced out of small teams.

### 6.3 Clay / Apollo / ZoomInfo **[2ND only]**
- Described as data/enrichment layers: company data, org charts, contact enrichment; "tell you who, not what to do in the meeting." (MarketBetter blog.)
- Clay "gives you raw enriched data across hundreds of accounts" vs. a finished brief (AmpUp blog, biased). Another listicle calls Clay's AI depth "strongest in flexible research automation."
- ZoomInfo publishes content describing AI call briefings that compile CRM, call, email and signal data into one page and states that "a clean data foundation matters more than the model writing the brief." **[2ND; this is ZoomInfo's own Pipeline blog but not a product page]**

### 6.4 Avoma, Fireflies, Otter, Granola, Fathom **[2ND only]**
- Primarily notetakers. A Sentra-authored comparison notes most "record a meeting and summarize it afterwards, so the brief they can give you before the next call is only as good as the last transcript."
- Avoma described as a "lighter brief" all-in-one meeting tool; Fireflies: briefs from past conversations with the same participants.

### 6.5 Meeting-prep specialists **[2ND, self-published]**
- **Evan:** positions as researching any meeting end to end, including non-sales meetings.
- **Sybill:** briefs limited to calls already recorded.
- **Nimitai:** $149/seat/month, no seat minimum (vendor claim); brief + talk track + discovery questions + objection plan.
- **AmpUp:** claims ~2 minutes to a structured brief vs. a 20-minute manual baseline (vendor claim).
- **Oliv AI:** coaching-led, prep as a byproduct per Evan's blog; self-describes agentic, citation-backed prep.

### 6.6 Perplexity / ChatGPT Deep Research / Gemini **[2ND only]**
- One blogger reports deep-research tools "sometimes make things up" and ranks Perplexity as fast but error-prone, ChatGPT Deep Research as pricey but accurate, Gemini as a balanced choice (strefatech Substack). **[UR, single opinion; no date verified]**
- G2 aggregate: G2's "Tech Signals" analysis counted 101 mentions of inaccuracy for ChatGPT in review data, with outdated information a recurring frustration. **[UR aggregate, G2 blog]**

### 6.7 Tavily Research **[VF]** → Section 12.

---

## 7. PitchSense Deep Dive **[all VF unless tagged; source: pitchsense.ai home + pricing, accessed 2026-11-13]**

**Positioning.** "Build a Sales Brain. Put it to work." Meta-description: connects calls, deals, content, and coaching in one shared memory. **[VF]**

**Problem framing (their three pains):** (1) selling time spent rebuilding context, (2) unfinished commitments stalling deals, (3) winning behaviours buried in closed deals. **[VF]**

**Four intelligence modules**

| Module | What the page shows | Connection to the others |
|---|---|---|
| **Call intelligence** | Pre-call brief with past conversations and open questions; post-call summary with decisions, commitments, next tasks | Commitments feed Deal intelligence and the follow-through agent |
| **Deal intelligence** | Pipeline stages (Discovery/Proposal/Negotiation), "At Risk" flag with a reason, open commitments with owner and due date | Reads call and email history |
| **Content intelligence** | Content Library search; generates one-pagers, decks, proposals; example shows "Source: ROI calculator, p. 3" | Uses buyer concerns from calls |
| **Coaching intelligence** | Rep scorecards, feedback tied to specific call moments, recommended drills | Evidence drawn from calls |

**Execution layer ("agents"):** email follow-up drafts ("Drafted from 3 sources"), CRM write-back, commitment follow-through (reminders, overdue flags, nudge drafts), and "Ask PitchSense" (shows "Reading memory / past calls / emails" then answers with numbered citations). **[VF: marketing UI mockups; not a tested product]**

**Brief anatomy as shown** (illustrative mockup): meeting title and time, attendee with title, a verbatim "Last time" quote with timestamp, an "Open" question, and pre-meeting tasks. History items such as "Onboarding takes 6 weeks per site." **[VF: mockup]**

**Integrations listed:** CRMs (Salesforce, HubSpot, Lightfield, Attio, Zoho, Dynamics 365), meetings/recordings (Google Meet, Teams, Fireflies, Fathom, Granola), email (Gmail, Outlook), Slack/Teams. **[VF]**

**Pricing:** two plans, **Team** and **Enterprise**, both "Custom" with no public numbers; Enterprise adds SAML SSO, SCIM, exportable audit logs, regional data residency, uptime SLA. **[VF]**

**Uncertainty handling:** the FAQ includes the question "How can I check an AI-generated answer?" but the answer text was not captured in the fetch, so **how PitchSense handles uncertainty is unverified.** Citations are visible in mockups (numbered refs; "Source: ...").

**Website conflict to flag:** a Product Hunt listing named "PitchSense" describes "AI that whispers the right words in any conversation" with a mid-call TYPE mode. **[2ND]** This may be an earlier incarnation or a different product with the same name. **Unresolved.** Do not conflate.

**Analysis**

- **[INF]** The core asset is *proprietary conversation history*. Everything compounds from captured calls and CRM data.
- **[INF]** This is a team product sold via demo and custom pricing. A solo founder or investor cannot self-serve it.
- **[INF]** The homepage emphasises *history with this buyer*, not *what changed at the buyer's company this month*. Whether the product ingests external news is **not** established by the page.
- **Lessons to adopt (patterns, not designs):** an "Open questions" block; commitments with owner and date; "Drafted from N sources" provenance; reading-progress lines ("Reading past calls…") that make agent work legible.
- **What not to copy:** the full sales-OS scope. It is a multi-year build and irrelevant to the challenge.

---

## 8. Product Workflow Comparisons

**[INF: composites of vendor descriptions, not observed flows]**

| Step | Internal-memory tools (PitchSense, Gong, Sybill) | Enrichment tools (Clay, Apollo, ZoomInfo) | General research agents | **Briefly.ai (proposed)** |
|---|---|---|---|---|
| Setup | Connect CRM, calendar, recorder | Build tables/workflows | None | **None** |
| Trigger | Calendar event | Manual / workflow | User prompt | **Name + time** |
| Context source | Own calls, CRM, email | Data providers | Open web | **Open web, time-boxed** |
| Time window | Whole history | Snapshot | Unspecified | **Explicit 30-day window** |
| Output | Brief with history & tasks | Raw rows | Long report | **One-page, claim-cited** |
| Verification | Not publicly described | Provider-dependent | Variable | **Explicit verified/uncertain labels** |

---

## 9. Feature Comparison Matrix

Legend: ● advertised **[VF]** (PitchSense only) · ◐ reported **[2ND]** · ○ not found · ? unknown. This matrix is **deliberately sparse**; do not read ○ as "absent."

| Capability | PitchSense | Gong | Clay | Avoma | Evan | Perplexity | Tavily Research | Briefly.ai target |
|---|---|---|---|---|---|---|---|---|
| Pre-meeting brief | ● | ◐ | ○ | ◐ | ◐ | ○ | ○ | ● |
| Works with no CRM / history | ○ | ○ | ◐ | ○ | ◐ | ● | ● | ● |
| External news (30 days) | ? | ? | ◐ | ○ | ◐ | ● | ● | ● |
| Per-claim citations | ● (mockup) | ? | ? | ? | ? | ● | ● | ● |
| Explicit date-window discipline | ? | ? | ? | ? | ? | ○ | ◐ (API params) | ● |
| Uncertainty labels | ? | ? | ? | ? | ? | ○ | ○ | ● |
| Meeting-type tailoring | ? | ◐ | ○ | ◐ | ◐ | ○ | ○ | ● |
| Persistent memory | ● | ● | ○ | ◐ | ? | ○ | ○ | P3 |
| Commitment tracking | ● | ◐ | ○ | ◐ | ? | ○ | ○ | P3 |
| Self-serve price | ○ (custom) | ○ | ◐ | ◐ | ? | ● | ● | ● |

---

## 10. User Reviews and Pain Points

**Evidence status: WEAK.** No original Reddit, Hacker News, G2 product-page, Capterra or Product Hunt review threads were retrieved. What follows is the best available proxy, and **none of it supports a claim that a pattern is "recurring across the customer base."** Treat these as hypotheses to validate.

| Pain point | Evidence found | Type | Strength |
|---|---|---|---|
| Invented, stale and wrong-entity facts are distinct failures needing different fixes | Unify GTM blog taxonomy (hallucinated / stale / wrong entity), ~38 days old | [2ND] vendor analysis | Moderate, as a *framework* |
| Models state wrong facts in the same tone as right ones; a firmographic DB can say 200 employees after a 60-person layoff | FirstSales blog, ~98 days old | [2ND] vendor analysis | Moderate |
| Single un-browsed prompts hallucinate funding numbers and titles | FirstSales blog | [2ND] | Weak–moderate |
| Reps need a human review step; "a wrong buying signal is worse than a missing one" | FirstSales blog | [2ND] quote of vendor | Weak |
| ChatGPT inaccuracy and outdated info are frequently mentioned | G2 Tech Signals: 101 inaccuracy mentions for ChatGPT | [UR aggregate] | Moderate (real review data, general-purpose, not meeting prep) |
| Deep-research tools also hallucinate | strefatech Substack | [UR single opinion] | Weak |
| Briefs depend on prior captured data; limited to recorded calls | Sentra, Sybill, getmaxiq blogs | [2ND, competitors] | Moderate (consistent but competitor-authored) |
| Enrichment tools are "data-only" and don't say what to do in the meeting | MarketBetter blog | [2ND] | Weak–moderate |
| Gong priced out of small teams | MarketBetter / getmaxiq blogs | [2ND] | Weak |
| Gated content and old third-party pages feed wrong AI answers about a company | aidemand.org, insightland.org | [2ND] | Moderate for *source-quality* risk |

**What to take from this:** the one signal consistent across independent-ish sources is **factual reliability of AI research output (staleness, wrong entity, confident tone)**. That aligns exactly with the P0 requirements (attribution, 30-day recency). **[REC]** Make reliability the product, not a feature.

---

## 11. Technology and Architecture Research

**Principles [REC]:** use official Tavily semantics only; do not assume undocumented behaviour; measure latency and cost with a real key before committing.

**Pipeline sketch [INF, our design, not a competitor's architecture]**

```
Input (name/company, meeting time, optional type/context/URL)
  → 1. Entity resolution (disambiguate; produce canonical entity + domain)
  → 2. Research plan (query set per topic: news, launches, hires, funding, partnerships, regulatory, controversies)
  → 3. Retrieve (Tavily Search, news + general, explicit date window)
  → 4. Extract (Tavily Extract on shortlisted URLs for full text + date evidence)
  → 5. Claim extraction (LLM → atomic claims: {text, event_date, source_url, supporting_quote, source_type})
  → 6. Verify (date in window? entity match? corroborated? contradicted? unsupported → drop)
  → 7. Gap detection (missing topics → targeted follow-up search, bounded loop)
  → 8. Synthesize one-page brief (structured schema → render)
  → 9. Questions & talking points (grounded in verified claims + meeting type)
```

**Key technical constraints verified from docs [VF]:**
- Date filtering is on "publish date or last updated date," not event date.
- `published_date` is a "best estimate," in beta, and "can be later than the original publish date."
- Results with no detectable date are kept by default; `filter_by_published_date: true` removes them (and those outside the window).
- Therefore **the app must verify event dates itself** (via Extract + LLM date reasoning) and handle undated sources explicitly.

**Storage:** relational (Postgres/SQLite) for briefs, claims, sources, runs. Vector search is **not** needed for the P0/P1 scope **[REC]**; it only becomes useful for memory retrieval over past briefs/notes (P3).

**Background jobs:** needed if runs exceed request timeouts or for scheduled/pre-meeting generation. For a hackathon demo, a streamed single request with progress events is simpler. Tavily Research supports SSE streaming **[VF]**; whether your own pipeline streams is your design choice.

**Open technical unknowns:** end-to-end latency of the pipeline; per-brief credit cost; reliability of date extraction on arbitrary pages; how often Extract fails on paywalled or JS-heavy pages.

---

## 12. Tavily Integration Opportunities

**All parameters below are from the official Search and Research API references [VF], accessed 2026-11-13.**

### 12.1 Search API (`POST /search`)
| Need | Parameter | Notes |
|---|---|---|
| 30-day window | `start_date`, `end_date` (YYYY-MM-DD) or `time_range` (`day/week/month/year`) | Based on publish/last-updated date |
| News focus | `topic: "news"` | Also `general`, `finance`. `published_date` auto-enabled for news |
| See dates | `include_published_date: true` | Beta; may be later than original publish date |
| Drop undated/out-of-window | `filter_by_published_date: true` | Also removes results with no detectable date. May hide good undated sources |
| Quality vs cost | `search_depth`: `basic`/`fast`/`ultra-fast` = 1 credit; `advanced` = 2 credits | `advanced` returns multiple relevant snippets per URL |
| Evidence text | `chunks_per_source` (1–3), `include_raw_content` (`markdown`/`text`) | Useful for claim-to-quote binding |
| Name precision | `exact_match: true` + quoted phrase | Helps with person/company names; docs example: `"John Smith" CEO Acme Corp` |
| Source control | `include_domains` (max 300; `restrict` or `prefer` mode), `exclude_domains` (max 150) | Could prioritise newsrooms, sec.gov, company site |
| Freshness | `max_age_hours` (0 = live fetch, 1–720 = cached max age) | Live fetch adds latency; non-paying plans best-effort and may get HTTP 434 under load |
| Convenience | `include_answer`, `auto_parameters` | `auto_parameters` may silently set `advanced` (2 credits) |
| Geo/lang | `country` (general topic only), `language` | |

### 12.2 Research API (`POST /research`)
- Async task; returns `request_id` and `status`; supports streaming (SSE). **[VF]**
- `model`: `mini` (targeted), `pro` (comprehensive), `auto`. **[VF]**
- **`output_schema`** (JSON Schema) forces structured output. **[VF]** Useful: you could request a briefing schema directly.
- `citation_format`: numbered/mla/apa/chicago. `output_length`: short/standard/long. `include_domains` is a *soft* preference (max 20); `exclude_domains` is a *hard* blocklist (max 20). **[VF]**
- **`files`**: attach up to 5 `.txt/.md/.json` files (80,000 words max each/combined) which the agent uses and cites. **[VF]** This is a clean way to inject *user-provided meeting context* (agenda, prior notes) without building memory.
- **Unknown:** credit cost per research call, typical latency, and whether it exposes per-claim date metadata. Must be tested.

### 12.3 Extract, Crawl, Map
Verified only as descriptions from the docs index: Extract "pull clean content from one or more URLs"; Crawl "read many pages across a site"; Map "discover a site's structure." **[VF, description level]**
- **[REC]** Extract is core (evidence + date verification). Crawl/Map are useful for pulling a company's own newsroom/blog/careers page for hiring and launch signals, but add cost and latency, so treat as P2.

### 12.4 Pricing and limits
- Free "Researcher": 1,000 credits/month, no card. Pay-as-you-go: $0.008/credit. Monthly plans range $0.0075–$0.005/credit; Growth 100,000 credits for $500. **[VF: docs.tavily.com/guides/api-credits and FAQ]**
- Exhausting plan credits stops requests until reset or upgrade. **[VF, pricing page]**
- Rate limits reported as 100 req/min (dev key) / 1,000 req/min (prod key). **[2ND, morphllm.com, August 2026]** Verify in dashboard.
- Tavily claims #1 in a "Company Search Benchmark" on its pricing page banner. **[MC]**

### 12.5 Cost model for planning **[INF, arithmetic on VF prices]**
A brief using ~12 `advanced` searches (24 credits) + a handful of Extract calls (cost unverified) stays on the order of tens of credits. At 1,000 free credits that is a few dozen briefs per month. **Do not exceed the free tier during development without a budget cap.**

### 12.6 Security and operational considerations
- **[REC]** Treat retrieved page text as **untrusted input**: prompt-injection risk from web content is real for any agent that reads pages. Strip instructions, never let page text alter system behaviour or tool calls.
- Keep API keys server-side; do not call Tavily from the browser.
- Handle 429 (with `Retry-After`), 432/433 (limits), 434 (live-fetch capacity) explicitly. **[VF error codes]**
- Tavily also offers keyless Search/Extract access per the docs home page. **[VF]** Do not rely on it for a demo.

### 12.7 What to leverage vs rebuild **[REC]**
| Component | Use Tavily as-is | Build ourselves |
|---|---|---|
| Web retrieval | Search + Extract | |
| Date window | Param filtering | **Event-date verification** |
| Report generation | Research API as baseline | **Claim-level schema + verification** (the differentiator) |
| Entity resolution | `exact_match` helps | **Disambiguation logic** |
| Meeting-type tailoring | | **Ours** |

---

## 13. Bifrost Integration Opportunities

**Evidence: marketing site only [VF/MC]; documentation not opened.**

**Advertised [MC]:** open-source (Apache 2.0, per footer) AI gateway; drop-in replacement for OpenAI/Anthropic/LangChain etc. SDKs by changing the base URL; 8+ providers / 1000+ models; provider fallback; budgets and virtual keys; built-in observability with OpenTelemetry; MCP gateway; guardrails; semantic caching (footer link); quick start `npx @maximhq/bifrost`. Performance claims ("50x faster than LiteLLM", ~11–20 µs overhead at 5k RPS) are **vendor benchmarks, unverified**. Footer shows © 2025; the homepage banner references "Bifrost Edge" and an enterprise 14-day trial.

**What would genuinely help the MVP [REC]:**
| Capability | Value to Briefly.ai | Verdict |
|---|---|---|
| Fallback between providers | Avoids demo-day failure if one model API is rate-limited | **Useful**, if two providers are keyed |
| Usage/cost tracking | Per-brief cost visibility | Useful, modest |
| Observability (OTel) | Debugging the multi-step agent | Useful if you can wire it fast |
| Semantic caching | Could reduce repeat-query cost | Marginal and risky (stale news!) |
| Guardrails / governance / MCP gateway / SSO | Enterprise concerns | **Skip for MVP** |

**Risk:** another service to install and debug under hackathon time pressure; caching of time-sensitive queries could *hurt* correctness. **[REC]** Adopt only if setup takes under ~30 minutes; otherwise add later. If the track rubric rewards sponsor tool usage, confirm that before deciding (not verified here).

---

## 14. Market Gaps

1. **Cold-start external briefing** (no CRM, no history): internal-memory tools can't serve it. **[INF supported by 2ND]**
2. **Time-window honesty:** no competitor evidence found that states or enforces an explicit lookback window on the brief. **[INF; absence of evidence only]**
3. **Verification visibility:** citations exist in several products, but visible verified-vs-uncertain labelling was not found. **[INF]**
4. **Entity disambiguation as a first-class step** (same-name people, subsidiaries): discussed in vendor blogs as a failure mode, not seen as a product feature. **[INF]**
5. **One-page discipline:** enterprise tools sprawl into dashboards; general agents produce long reports. **[INF]**
6. **Pricing/access:** custom-priced team platforms leave solo professionals underserved. **[INF supported by 2ND pricing reports]**
7. **Meeting-type-specific output** (investor vs vendor vs recruiting): a few tools tailor, but depth unknown. **[INF]**

---

## 15. Differentiation Opportunities

**Why choose Briefly.ai over Perplexity/ChatGPT/Tavily directly?** [REC]
- It enforces the **meeting window** and shows it.
- Every claim carries **source + date + status** (verified / single-source / uncertain / conflicting).
- It returns a **fixed one-page structure** with meeting-type-specific questions, not an essay.
- It **resolves who you mean** before researching, and says so.
- It tells you **what it could not find** (research gaps) instead of padding.

---

## 16. Proposed Briefly.ai Feature Inventory

Evaluated on usefulness (U), feasibility (F), cost (C), differentiation (D). H/M/L.

| Feature | U | F | C | D | Source of justification |
|---|---|---|---|---|---|
| Name + meeting time input | H | H | L | L | P0 |
| Exact 30-day window computation | H | H | L | M | P0 + Tavily date semantics |
| Entity disambiguation prompt | H | M | M | H | Wrong-entity failure type [2ND] |
| Multi-topic research (news, launches, hires, funding, partners, regulatory) | H | H | M | L | P0 |
| Per-claim citations (URL, title, date) | H | H | M | M | P0 |
| Event-date vs publish-date check | H | M | M | **H** | Tavily docs [VF] |
| Verified / uncertain labels | H | M | M | **H** | Problem statement + failure taxonomy |
| Contradiction flagging | M | M | M | H | Failure taxonomy |
| One-page layout + PDF/print | H | H | L | L | P0 |
| Open questions + talking points | H | H | L | M | P0 |
| Meeting type selector + objective | M | H | L | M | Problem statement |
| User context upload (agenda/notes) | M | H | L | M | Tavily Research `files` [VF] |
| "What I couldn't find" gap section | H | H | L | H | Honest-limits principle |
| Research progress stream | M | M | M | L | Pattern: PitchSense "Reading…" lines |
| Multiple attendees | M | M | M | M | Problem statement (optional) |
| Importance scoring of findings | M | M | M | M | Concision |
| Saved briefs / history list | M | H | L | L | Basic product |
| Change-since-last-briefing | M | M | M | H | Cheap if prior brief JSON saved |
| Memory, commitments, CRM write-back | M | L | H | L here | **Skip**: PitchSense territory |
| Calendar integration / scheduled briefs | M | L | H | M | Post-hackathon |
| Vector search | L | M | M | L | **Over-engineering for MVP** |
| Email-draft / follow-up agents | L | M | H | L | Out of scope |

**Critical view:** The tempting traps are memory, CRM sync, and coaching. They are the incumbents' moat and have no P0 link.

---

## 17. Product Direction Recommendations

| | **A: Focused Pre-Meeting Research Agent** | **B: Context-Aware Meeting Intelligence** | **C: Relationship Intelligence Platform** |
|---|---|---|---|
| Scope | Name + time → verified one-page brief | A + meeting type, user context, saved history, change-since-last | B + CRM/email/calendar graph |
| Users | Founders, investors, BD, solo sellers | Same + small teams | Revenue orgs |
| Differentiation | Reliability & honesty | Personalisation + continuity | Memory moat |
| Difficulty | Medium | Medium–High | Very High |
| Competitive position | Underserved niche | Overlaps Sybill/Granola-style | Head-on with PitchSense/Gong |
| Long-term | Moderate; extendable | Good | High but capital-heavy |

**[REC] For the hackathon: Direction A, with three thin B slices:** meeting type/objective, optional user-pasted context, and saved briefs. Reason: it is the literal challenge, it is demo-able end to end, and its differentiator (verification) is precisely where competitors are weakest and Tavily's date semantics create a genuine technical hurdle to showcase.

---

## 18. Prioritized Feature Roadmap

| Pri | Feature | Hackathon? | Demo-able? | Complexity | Depends on |
|---|---|---|---|---|---|
| **P0** | Name + meeting time input; window calc | Yes | Yes | Low | None |
| **P0** | Search + extract over last 30 days | Yes | Yes | Medium | Tavily key |
| **P0** | One-page structured brief | Yes | Yes | Medium | LLM + schema |
| **P0** | Source attribution per claim | Yes | Yes | Medium | Claim extraction |
| **P0** | Open questions / discussion points | Yes | Yes | Low | Verified claims |
| **P1** | Event-date verification | Yes | Yes | Medium | Extract |
| **P1** | Verified/uncertain labels | Yes | Yes | Medium | Verification pass |
| **P1** | Entity disambiguation | Yes | Yes | Medium | Search + LLM |
| **P1** | "Not found" gap section | Yes | Yes | Low | Gap detection |
| **P1** | Print/PDF export | Yes | Yes | Low | Layout |
| **P2** | Meeting type tailoring | Yes (lite) | Yes | Low | Prompt variants |
| **P2** | User context attach | Maybe | Yes | Low | Files param |
| **P2** | Contradiction flagging | Maybe | Yes | Medium | Claim compare |
| **P2** | Change since last briefing | Maybe | Yes | Medium | Persistence |
| **P2** | Progress stream | Maybe | Yes | Medium | SSE |
| **P3** | Memory/commitments | No | No | High | Integrations |
| **P3** | Calendar sync, scheduled/monitoring | No | Partly | High | OAuth, jobs |
| **P3** | Multi-attendee briefs | No | Partly | Medium | Entity layer |
| **P3** | Vector memory | No | No | Medium | Storage |

---

## 19. UI/UX Recommendations

**Evidence base:** PitchSense's public mockups only **[VF]**. No other competitor UI was inspected. Everything else is design reasoning **[REC]**. Competitor visual designs should not be reproduced.

**Patterns seen worth adapting (as ideas):** reading-progress lines that name what the agent is consulting; numbered citations tied to claims; an explicit "Open" questions block; owner/date on commitments.

**Information architecture**
1. **Landing:** one promise, one input. The coastal hero illustration carries brand; keep copy to a single line plus a sample brief preview.
2. **New briefing:** two required fields (who/what, when). Everything else collapsed under "Add context": meeting type, objective, agenda, URL, pasted notes.
3. **Disambiguation step** (only when needed): "Which Priya Nair?" with 2–4 candidates, each showing a one-line identifier and the source it came from. This builds trust early.
4. **Research progress:** a short vertical timeline ("Identifying entity → Searching news → Reading 14 sources → Checking dates → Writing"). Keep it calm; no spinners.
5. **Generated brief (the product):** one printable page with fixed sections:
   - Header: entity, meeting time, **research window dates**, generated-at, confidence summary
   - Why this meeting matters (2–3 lines)
   - **What changed in the last 30 days** (ranked, each item with date + source chip + status badge)
   - People to know
   - Opportunities / risks
   - Questions to ask; suggested talking points
   - **What I couldn't verify / didn't find**
6. **Source inspection:** clicking a source chip opens a side panel with the exact supporting quote, publish date, event date (if different), domain, and status reason. This is the "evidence visualisation"; avoid charts.
7. **Dashboard / history:** list of briefs by meeting date, with entity, type, status. Saved reports are the only history needed.
8. **Settings:** default meeting type, region/language, export preferences. Minimal.

**Visual direction [REC]:** warm ivory background, deep navy text/accents, one serif display face for headings with a clean sans for body, generous margins, thin rules instead of boxes, status indicated by small text badges (not colour alone). Keep status vocabulary to four words (Verified, Single source, Conflicting, Unverified).

**Avoiding overwhelm:** cap the one-pager at ~8–10 findings; ranking and "show more" beyond; hide raw source lists behind the side panel.

---

## 20. Research and Verification Strategy

| Check | Method | Output |
|---|---|---|
| Entity match | Match domain, role, location, LinkedIn/company URL if given; reject mismatches | Entity confidence |
| Publish date | Tavily `published_date` + page parse from Extract; flag if missing | Date or "undated" |
| **Event date** | LLM extracts event date from text; compare to publish date and window | In-window / out / unknown |
| Claim-to-source | Each claim stores URL + supporting quote | No quote → drop |
| Corroboration | Count independent domains supporting the same claim | Verified (≥2 independent) / Single-source |
| Contradiction | Compare claims on the same attribute (funding amount, title, date) | Conflicting + both sources |
| Source credibility | Tiering heuristic: primary (company/regulatory) > reputable press > aggregator > forum/blog | Tier shown in panel |
| Duplicate/syndication | Cluster near-identical text; count once | Prevents fake corroboration |
| Unsupported rejection | Any generated sentence without a bound claim is removed | Zero ungrounded facts |

**Rules [REC]**
- "Verified" requires ≥2 independent sources **or** one primary source (company/official filing/press release).
- An item with an unknown event date can appear only under "Unverified timing."
- Questions and talking points are labelled as suggestions and must reference verified items.

---

## 21. Evaluation Framework

**Metrics and acceptance criteria [REC]** (targets are proposals; calibrate on a first run)

| Dimension | Metric | Target |
|---|---|---|
| Freshness | % of "recent developments" with event date inside window | ≥ 95% |
| Citation correctness | % of claims where the cited passage actually supports it (human-audited sample of 30 claims) | ≥ 95% |
| Unsupported claims | Count of ungrounded factual sentences | 0 |
| Source quality | % of verified claims backed by tier-1/2 sources | ≥ 70% |
| Coverage | Topics attempted vs available (news, launches, hires, funding, partners, regulatory) | ≥ 5 of 6 attempted |
| Entity resolution | Correct entity on ambiguous-name test set | ≥ 90%, and asks when confidence is low |
| Contradiction handling | Seeded conflicts flagged | ≥ 80% |
| Relevance | Human rating 1–5 "would you use this in the meeting" | ≥ 4.0 mean |
| Question usefulness | Human rating of specificity | ≥ 4.0 mean |
| Concision | Fits one printed page | 100% |
| Consistency | Same input run 3× → overlap of top-5 findings | ≥ 70% |
| Honesty | Brief states gaps when evidence is thin | 100% on sparse-news cases |

**Test scenarios**
1. Well-covered public company (baseline).
2. Company with almost no recent news → must say so, not pad.
3. Two people with the same name at different companies → must disambiguate.
4. Recent article about an old event (e.g., an anniversary or retrospective) → must exclude or mark out of window.
5. Source with no publication date.
6. Conflicting funding figures across outlets.
7. Misleading/low-quality source repeating a rumour.
8. Multiple participants in one meeting.
9. Same company, different meeting types (investor vs vendor) → materially different questions.
10. Company with a similarly-named subsidiary or unrelated namesake.
11. Meeting time in the past or less than 30 days from "now."
12. Prompt-injection text embedded in a fetched page → must be ignored.

**Method:** build 12–20 fixed cases, snapshot the retrieved sources for reproducibility, run an automated check for dates and quote presence, then a small human audit of citations.

---

## 22. Risks and Technical Challenges

| Risk | Impact | Mitigation |
|---|---|---|
| Date metadata unreliable (Tavily states best-effort) | Old news in brief | Event-date verification; show "undated" |
| Over-aggressive `filter_by_published_date` drops useful undated sources | Thin brief | Keep filter off; handle dates ourselves |
| Wrong entity | Credibility-killing error | Disambiguation + confidence display |
| LLM adds unsupported sentences | Violates P0 | Claim-bound generation; strip unbound text |
| Prompt injection from web content | Security | Treat content as data; no tool-driven by page text |
| Latency too long for demo | Poor impression | Parallel searches, streamed progress, cap loops |
| Credit exhaustion (1,000 free/month) | Demo failure | Budget cap, cache within a run, test sparingly |
| Paywalled or blocked pages | Missing evidence | Fall back to snippet; label lower confidence |
| Scope creep into memory/CRM | Missed deadline | P3 hard line |
| Ambiguous "preceding 30 days" | Judge confusion | Print exact window |
| Dependence on a single provider | Outage | Fallback model/provider (Bifrost or simple retry) |
| Privacy: researching private individuals | Ethical/legal | Limit to professional public information; no personal-life data; state this in UI |

---

## 23. Hackathon MVP Recommendations

**Build:** Direction A. Name + time + optional meeting type → disambiguation (if needed) → Tavily Search (news + general) over the exact window → Extract top sources → claim extraction → verification pass (date, entity, corroboration) → one-page brief with citations and status badges → open questions and talking points → print/PDF.

**Demo script [REC]:** (1) a well-known company, (2) an ambiguous person name showing disambiguation, (3) a sparse-news company showing the honest "not found" section, (4) one click into a source panel showing quote + date. This showcases the differentiator rather than breadth.

**Cut line:** if time runs short, drop contradiction detection and progress streaming; never drop citations, window display, or verified/unverified labels.

**Open decision to check with organisers:** whether the judging rubric weights sponsor-tool depth (Tavily Research API vs Search+Extract), and whether Bifrost use is rewarded.

---

## 24. Post-Hackathon Product Opportunities

Calendar-triggered briefs; "what changed since last time" diffs; saved meeting notes and commitments (user-controlled storage, with clear deletion); multi-attendee briefs; monitoring before a meeting; team sharing; role-specific templates (investor, recruiter); optional CRM context as an *input* rather than the product. **[REC]** Revisit memory only after the cold-start brief is trusted.

---

## 25. Final Strategic Recommendations

### 25.1 Fifteen most valuable discoveries
1. PitchSense is built around proprietary conversation memory, not external research. **[VF + INF]**
2. PitchSense has no public pricing: Team and Enterprise are "Custom." **[VF]**
3. PitchSense's brief mockup centres on last-conversation history, open questions and pre-meeting tasks. **[VF]**
4. A "PitchSense" listing on Product Hunt describes a different, mid-call product. Entity ambiguity exists even here. **[2ND]**
5. Tavily's date filter is on publish/last-updated date, and `published_date` can be later than the original. **[VF]**
6. Tavily keeps undated results by default. **[VF]**
7. Tavily `exact_match` exists for quoted names. **[VF]**
8. Tavily Research supports `output_schema`, `citation_format`, and a `files` input for user context. **[VF]**
9. Tavily Research `include_domains` is soft; `exclude_domains` is hard. **[VF]**
10. Tavily pricing: 1,000 free credits/month, $0.008 PAYG, `advanced` search costs 2 credits. **[VF]**
11. Bifrost is an Apache-2.0 open-source gateway with fallback, budgets, OTel; benchmarks are vendor claims. **[MC]**
12. Many "best meeting prep tool" rankings are authored by competing vendors and contradict each other (e.g., on Gong's briefing product). **[2ND]**
13. Several newer vendors (Evan, Aomni, Speck, Nimitai, AmpUp, Sentra, EchoIQ) target prep specifically. **[2ND]**
14. Failure-type taxonomy: invented vs stale vs wrong-entity. **[2ND]**
15. Briefs from notetakers depend on prior transcripts; enrichment tools are data-only. **[2ND]**

### 25.2 Ten most promising opportunities (ranked by impact × feasibility)
| # | Opportunity | User problem | Evidence | Complexity | Value |
|---|---|---|---|---|---|
| 1 | Event-date-verified 30-day briefing | Old news posing as recent | Tavily docs [VF] | Med | High |
| 2 | Per-claim verified/uncertain labels | Confident wrong facts | FirstSales, G2 aggregate [2ND/UR] | Med | High |
| 3 | Cold-start briefing (no CRM) | Can't use internal-memory tools | Sentra/Sybill blogs [2ND] | Low–Med | High |
| 4 | Entity disambiguation up front | Wrong-person/company facts | Unify taxonomy [2ND] | Med | High |
| 5 | "What I couldn't find" honesty section | Padding and false confidence | Failure taxonomy [2ND] | Low | High |
| 6 | One-page, meeting-type-specific questions | Generic research dumps | Positioning of Nimitai/Evan [2ND] | Low | High |
| 7 | Source side-panel with exact quote | Hard to audit AI claims | PitchSense citations [VF mockup] | Low–Med | Med–High |
| 8 | Contradiction surfacing | Conflicting reports | Failure taxonomy | Med | Med |
| 9 | User-context attach (agenda/notes) | Generic output | Tavily `files` [VF] | Low | Med |
| 10 | Change-since-last-briefing | Repeat meetings | PitchSense "where you left off" [VF] | Med | Med |

### 25.3 Five product decisions to make next
1. **Window definition:** end at today or at meeting time; how to handle past or far-future meetings.
2. **Core retrieval strategy:** own Search+Extract pipeline vs Tavily Research API with `output_schema` (run a head-to-head on 5 test entities for quality, latency, cost).
3. **"Verified" threshold:** two independent sources or one primary; how strict for people-related claims.
4. **Scope of input:** single entity only for MVP, or optional extra attendees and URLs.
5. **Gateway:** adopt Bifrost now, later, or never; confirm sponsor-rubric expectations first.

---

## 26. Complete Source Bibliography

See separate file `BRIEFLY_AI_SOURCE_LEDGER.md` for the full ledger with access dates and what each source was used for. Items still **outstanding** for a complete audit:

- Primary pages: gong.io, clari.com, salesforce.com (Agentforce), hubspot.com, clay.com, apollo.io, zoominfo.com, avoma.com, fireflies.ai, otter.ai, perplexity.ai, OpenAI deep-research announcement
- Primary pages of Evan, Aomni, Speck, Sybill, Sentra, Oliv
- Original review threads (Reddit, HN, G2, Capterra, Product Hunt) with dates
- Tavily Extract, Crawl, Map, Research-streaming and best-practices pages; Research credit cost
- Bifrost documentation (docs.getbifrost.ai): fallback, observability, budgets
