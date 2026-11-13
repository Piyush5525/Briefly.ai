# BRIEFLY.AI — PHASE 2 SOURCE LEDGER

All access dates: **2026-11-13**. "Read" = full page content retrieved. "Snippet" = search-result excerpt only. Publication dates are given only where the source showed one; otherwise "not shown".
Evidence classes: **DOC** = official vendor documentation; **3P** = third party (blog, repo README, aggregator, forum, event listing); **LOCAL** = the project's own Phase 1 files.

## A. Local inputs
| ID | Item | Class | Used for |
|---|---|---|---|
| L1 | `BRIEFLY_AI_PRODUCT_INTELLIGENCE_REPORT.md` (Phase 1) | LOCAL | Audit baseline (§2); Section 0 limitations carried forward |
| L2 | `BRIEFLY_AI_SOURCE_LEDGER.md` (Phase 1) | LOCAL | Source IDs T1–T20, P1–P6 referenced as "Phase 1 Tn" |

## B. Official documentation (Tavily, Bifrost)
| ID | URL | Publisher | Class | Read? | Pub. date | Supports |
|---|---|---|---|---|---|---|
| L3 | https://docs.tavily.com/documentation/api-reference/endpoint/search.md | Tavily | DOC | Read | not shown | All Search parameters; `time_range` relative to today; `start_date`/`end_date` date-only, inclusivity unstated; `published_date` best-estimate (GMT format example); undated results kept by default; `filter_by_published_date`; `max_age_hours`; error codes 400/401/422/429/432/433/434/500; depth credit costs |
| L4 | https://docs.tavily.com/documentation/api-reference/endpoint/extract.md | Tavily | DOC | Read | not shown | Extract request/response: ≤20 URLs; `query`, `chunks_per_source` 1–5; `extract_depth`; `timeout` 1–60 s; `results` + `failed_results` on HTTP 200; **no date field**; 1 credit/5 URLs basic, 2/5 advanced |
| L5 | https://docs.tavily.com/documentation/api-credits | Tavily | DOC | Read | not shown | Plan ladder (Researcher/Project/Bootstrap/Startup/Growth), PAYG $0.008, Map/Crawl cost formulas, Research credit bounds (mini 4–110, pro 15–250) |
| L6 | https://docs.tavily.com/documentation/api-reference/endpoint/research.md | Tavily | DOC | Read | not shown | Research parameters: `input`, `model`, `stream`, `output_schema`, `citation_format`, `include_domains` (soft), `exclude_domains` (hard), `output_length`, `files`; **no date-window parameters**; async 201 response |
| L7 | https://docs.getbifrost.ai/features/fallbacks (resolved to …/features/retries-and-fallbacks.md) | Bifrost / Maxim AI | DOC | Read | not shown | Retries default 0; backoff formula; per-key rotation; failure classes; fallbacks array; per-provider retry budgets (3+2 fallbacks ⇒ up to 12 attempts); `routing_info`; timeout vs deadline semantics; typo'd-model cost warning |
| L11 | https://docs.tavily.com/skill.md and https://docs.tavily.com/.well-known/agent-skills/tavilyai/skill.md | Tavily | DOC | Snippet | not shown | Endpoint list, keyless access header, Research credit ranges (cross-check of L5) |

## C. Bifrost repository and articles
| ID | URL | Publisher | Class | Read? | Supports |
|---|---|---|---|---|---|
| L8 | https://github.com/maximhq/bifrost | Maxim AI (GitHub) | DOC/3P | Snippet | Quick start (`npx -y @maximhq/bifrost`, Docker), web UI, features list, governance/MCP/semantic cache listed; some features described as enterprise |
| L9 | https://github.com/mvanhorn/bifrost and https://github.com/z23cc/bifrost (mirrors/forks of README) | GitHub users | 3P | Snippet | Vendor benchmark figures (≈11 µs overhead at 5k RPS); enterprise-gated feature wording. **Mirrors of the README; treat as 3P** |
| L10 | https://dev.to/pranay_batta/automatic-failover-when-your-primary-llm-provider-goes-down-1p4o | DEV Community author | 3P | Snippet | Retry vs fallback explanation consistent with L7 |
| L12 | https://www.getmaxim.ai/articles/what-is-an-llm-gateway-architecture-features-use-cases/ and https://www.getmaxim.ai/resources/buyers-guide.md | Maxim AI | MC (vendor marketing) | Snippet | Gateway feature framing; vendor-authored |

## D. Hackathon evidence (none is the official rules page — see "Not accessed")
| ID | URL | Publisher / author type | Class | Read? | Date | Supports |
|---|---|---|---|---|---|---|
| L21 | https://github.com/b7405974-creator/premeeting-briefing-agent | Hackathon participant | 3P | Snippet | not shown | Peer PS05 entry: 30-day window `[meeting−30d, min(now, meeting)]`, parallel Tavily angles, citations, gaps list; states live mode does not require Bifrost/LLM |
| L22 | https://github.com/sidharth-cs/freshguard | Hackathon participant | 3P | Snippet | Nov 2026 | Peer pattern: evidence-only judge; cited URLs not in results dropped; Bifrost plugin; "Primary problem statement #4" |
| L23 | https://github.com/tareq7/sellerpilot-ai/issues/2 | Hackathon participant (issue tracker quoting organiser email 2026-10-31) | 3P | Snippet | ~12 days old | "Every team must select one problem statement from each Bifrost and Tavily tracks (one integrated solution allowed)"; Bifrost title track $1,000; Tavily credits "$8,000" aggregate; Nov 15 deadline; $60,000 "credits for top 3" noted as competitive pool, not guaranteed. **Key claim for Decision 5; unconfirmed officially** |
| L24 | https://github.com/whybhvi-stack/stale-answer-detector | Hackathon participant | 3P | Snippet | not shown | Peer uses Tavily + Bifrost; "two different websites" corroboration rule; Tavily problem statement numbered 06 |
| L25 | https://github.com/hassaanraja282-lgtm/stalebench | Hackathon participant | 3P | Snippet | not shown | Primary Bifrost-track statement + integrated Tavily statement pattern; Bifrost v2.4.0 self-hosted binary |
| L26 | https://github.com/setiani/DiscoveryBrief | Hackathon participant | 3P | Snippet | not shown | Peer PS05-style entry: meeting date + IANA timezone, optional participants/notes, source identity/date/duplicate checks, Bifrost fallback |
| L27 | https://github.com/Pritahi/freshcheck | Hackathon participant | 3P | Snippet | not shown | "All LLM calls route through Bifrost" |
| L28 | https://github.com/HeyJudo/Assay-research | Hackathon participant | 3P | **Read** | in active development | "Primary: Bifrost PS02 / Integration: Tavily PS05"; build window Nov 1–15; official page link `hackculture.io/hackathons/ai-global-hackathon`; frozen-web, planted-trap methodology; cites an arXiv item (2603.00801) on a single planted article collapsing agent accuracy (cited second-hand; not verified by us) |
| L29 | https://github.com/MadhusudhanM23/bifrost-fresh-cache | Hackathon participant | 3P | Snippet | not shown | "Track A, Problem 04" Bifrost-track example |
| L30 | https://github.com/sansukumar57-dev/globhack | Hackathon participant | 3P | Snippet | not shown | Dual-track portfolio: Tavily (stale-answer detector) + Bifrost tracks; "Bifrost/Maxim AI (Title Partner)" |
| L31 | https://geekroom-mu.vercel.app/event/global-ai-hackathon | Geek Room (event listing site) | 3P-organiser | Snippet | not shown | 9 Oct–29 Nov 2026; problem statements live 1 Nov; prototypes due 15 Nov; judging 29 Nov; $11.5K pool incl. $1,000 cash; Bifrost title partner, Tavily track partner; teams 1–4 |
| L32 | https://x.com/geek__room_/status/2114766654831788101 | Geek Room (X post) | 3P-organiser | Snippet | ~17 days old | 1,000+ registrations; "$10,000 worth of Tavily credits" |
| L33 | https://that.promo/geek-room-global-ai-hackathon | Promo aggregator | 3P | Snippet | ~11 days old | Deadline "15 Nov 2026 11:59 PM IST"; Tavily credits $65 (capped at 100 recipients); says verified against official page Oct 29 |
| L34 | https://web3voyager.com/event/geek-room-global-ai-hackathon | Event listing | 3P | Snippet | not shown | Judging criteria list; submission contents; judging 29 Nov 19:00–23:59; teams ≤4 |
| L35 | https://x.com/geek__room_/status/2116054643952496692 | Geek Room (X post) | 3P-organiser | Snippet | Oct 30, 2026 | "$100 Tavily API credits" |
| L36 | https://www.competehub.dev/en/competitions/hackculture_hackathons_ai_global_hackathon | CompeteHub listing | 3P | Snippet | not shown | Criteria list; "$5K prize pool"; one final project per team |

**Hackathon discrepancies (unresolved):** prize pool $5K (L36) vs $11.5K (L31); Tavily credits $65 (L33) vs $100 (L35) vs $8,000 (L23) vs $10,000 (L32); problem-statement numbers differ across repos (Tavily "#05" in L28 vs "#06" in L24 vs "#01" in L30). None resolved without the official dashboard/Discord.

## E. Model pricing and API notes
| ID | URL | Publisher | Class | Read? | Date | Supports |
|---|---|---|---|---|---|---|
| L40 | https://platform.claude.com/docs/ja/models/sonnet-5-5/overview | Anthropic (Japanese locale) | DOC | Snippet | not shown | Sonnet 5.5 $2/$10 per MTok; Opus 5.5 $4/$20; Haiku 4.5 $1/$5; 1M context; 128K max output; non-default temperature/top_p/top_k ⇒ 400; cache-read $0.20 at time of snippet |
| L41 | https://www.eesel.ai/blog/claude-sonnet-5-5-pricing | eesel (vendor blog) | 3P | Snippet | Sept 29, 2026 | Sonnet 5.5 pricing consistent with L40; launched Sept 28, 2026 |
| L42 | https://techenclave.com/news/items/claude-haiku-5-5-launches-with-0-10-input-pricing-for-shorter-prompts | News site | 3P | Snippet | not shown | Haiku 5.5 $0.10/$0.50 (≤100K prompt), $0.50/$2.50 above; Sonnet 5.5 cache-read cut to $0.10 |
| L43 | https://www.trendingtopics.eu/claude-haiku-5-5-anthropic-price-cut/ | News site | 3P | Snippet | not shown | Same; "figures not yet independently verified" |
| L44 | https://kiberblick.de/aktuell/2026/2026-10-08-claude-haiku-5-5/ | News site (German) | 3P | Snippet | Oct 8, 2026 | Haiku 5.5 released 2026-10-07; ≈30% more tokens for same text with new tokenizer; prefill rejected; structured outputs recommended |
| L45 | https://www.buildmvpfast.com/blog/claude-haiku-5-5-api-pricing-high-volume-agents-2026 | Blog | 3P | Snippet | not shown | Price table; 100K-token cliff; migration notes |
| L46 | https://www.developersdigest.tech/models/claude-haiku-5-5 | Aggregator | 3P | Snippet | verified Oct 9, 2026 | Model id `claude-haiku-5-5`; cache read $0.01; batch pricing |
| L47 | anotherwrapper.com (GPT-6 Luna vs Gemini 3 Flash; GPT-6 Luna pricing); intuitionlabs.ai (price comparisons); venturebeat.com (GPT-6 Sol/Luna); hashnode.com (Gemini 3.6 Flash; LLM API pricing); kingy.ai (Luna vs Gemini 3.8 Flash); orcarouter.ai (GPT-5.6/6 tiers) | Aggregators/news | 3P | Snippet | Jul–Nov 2026 | OpenAI/Google prices. **Conflicting across pages** (different model generations/dates) ⇒ treated as [UNV] in the dossier |

## F. Security guidance
| ID | URL | Publisher | Class | Read? | Supports |
|---|---|---|---|---|---|
| L48 | https://genai.owasp.org/LLM01/ | OWASP GenAI | DOC (standards body) | Snippet | Indirect prompt injection via external content; segregate external content; treat LLM as untrusted; trust boundaries |
| L49 | https://www.radware.com/cyberpedia/owasp-top-llm/ | Radware | 3P | Snippet | Mitigation list: treat retrieved content as untrusted, constrain output, deterministic validation, least privilege |

## G. Experiments log
| Item | Result |
|---|---|
| Tavily API key present in environment? | **No** |
| `api.tavily.com` reachable from sandbox? | **No** (HTTP status 000 on test request) |
| Bifrost instance run? | **No** |
| Measured results | **None.** All latency/cost figures in the dossier are labelled [INF] or [REC] |

## H. Not accessed / not done
- **Official hackathon rules/dashboard (HackCulture) and Discord:** fetch blocked (URL not in prior results at fetch time) and no search result surfaced the rules text; all hackathon statements are 3P.
- Bifrost repository LICENSE file, resource requirements, and the full docs index (only the retries/fallbacks page read in full).
- Primary pages of competitors (Gong, Clay, Evan, Aomni, etc.) and original user-review threads (carried over from Phase 1).
- Official OpenAI and Google pricing pages (only aggregators seen).
- Tavily docs pages for Crawl, Map, Research streaming and best-practices (only the credits page covers their pricing).
- Any independent evaluation of Tavily `published_date` accuracy or boundary semantics.
