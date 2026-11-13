# BRIEFLY.AI — MASTER ENGINEERING DIRECTIVE
## Complete Product Architecture, Design, Engineering, Implementation, Security & Delivery

**Project:** Briefly.ai  
**Project Root:** `Briefly.ai/`  
**Documentation Directory:** `Briefly.ai/Docs/`  
**Execution Mode:** Autonomous, end-to-end product development  
**Quality Standard:** Production-minded, hackathon-ready, exceptionally polished  
**Primary Objective:** Build the complete Briefly.ai product, from its landing page to its research engine, verification pipeline, backend, infrastructure, and final briefing experience.

---

# 0. YOUR MISSION

You are not being asked to create a prototype, a landing page, a frontend mockup, or a proof of concept.

You are being assigned ownership of building **Briefly.ai**, a complete AI-powered pre-meeting intelligence product.

You must approach this assignment as a combination of:

- Principal Software Architect
- Senior Full-Stack Engineer
- AI/LLM Systems Engineer
- Research Pipeline Engineer
- Backend and Infrastructure Engineer
- Security Engineer
- Product Designer
- UI/UX Engineer
- Quality Assurance Engineer

You have access to the entire project directory.

You are expected to inspect the existing materials, understand the product, conduct additional technical research, make sound engineering decisions, implement the application, test it, document it, and deliver a working system.

**Do not merely tell me how you would build this. Build it.**

The final product must be genuinely functional, not a collection of attractive screens with simulated functionality.

I want the maximum amount of autonomous execution possible. Do not repeatedly ask me to make implementation decisions that you can reasonably make yourself.

There should be only one expected manual responsibility on my side: providing the necessary API credentials in the environment configuration file.

Everything else, including gateway setup, dependency installation, provider configuration, application configuration, database-free persistence strategy, testing, documentation and startup automation, should be handled by you.

If a genuine external blocker arises, isolate it, document it, and continue implementing everything that does not depend on it.

---

# 1. UNDERSTAND THE PRODUCT BEFORE TOUCHING THE CODE

## 1.1 What is Briefly.ai?

Briefly.ai is an AI-powered pre-meeting intelligence agent.

Its purpose is simple:

**Help people walk into important meetings already knowing what has happened, what matters, what has changed, what risks exist, and what questions they should ask.**

Before a meeting, people often spend considerable time searching for information about:

- A company they are meeting.
- A prospective customer.
- An investor.
- A potential business partner.
- An executive or professional.
- A company they are interviewing with.
- A person or organization they need to understand before an important conversation.

This information is fragmented across news publications, company announcements, financial updates, interviews, regulatory publications, product announcements, leadership changes and other sources.

Existing research workflows are tedious and often unreliable.

Briefly.ai should automate this process.

A user supplies meeting context. Briefly.ai researches the relevant entity, identifies developments from the preceding 30 days, verifies the supporting evidence, evaluates the significance of those developments, and generates an actionable pre-meeting briefing.

This is not intended to be a generic AI chatbot.

It is a specialised research and intelligence system with a deterministic research workflow, evidence-grounded LLM processing, transparent verification, and a polished briefing interface.

## 1.2 Product philosophy

The following principles must influence every engineering decision.

**Accuracy over appearance.**

Never generate a convincing-looking briefing by sacrificing factual reliability.

**Evidence over confidence theatre.**

Never invent confidence percentages or present unsupported claims as verified information.

**Deterministic control over autonomous chaos.**

The application controls research, dates, verification, budgets and execution. LLMs assist with bounded intelligence tasks.

**Transparency over artificial completeness.**

If information could not be found or verified, communicate that clearly.

**Privacy by default.**

Do not unnecessarily retain meeting information, attendee names or research content.

**Quality over unnecessary complexity.**

Build robust systems, but do not introduce databases, vector stores, multi-agent frameworks or infrastructure that the MVP does not need.

---

# 2. FIRST ASSIGNMENT: COMPLETE PROJECT RECONNAISSANCE

Before writing implementation code, thoroughly inspect the entire project root.

Expected directory structure:

```text
Briefly.ai/
│
├── Docs/
│   ├── Phase 1 documentation
│   ├── Phase 1 source ledger
│   ├── Phase 2 documentation
│   └── Phase 2 source ledger
│
├── Hero UI Reference
├── Hero Background
├── [Heading font ZIP archive]
├── Background.mp4
│
└── [Application files to be created]
```

The names above describe the expected assets. Actual extensions and file formats must be discovered through filesystem inspection.

Do not assume the project is empty. Inspect it.

## 2.1 Read every document in Docs/

This is mandatory.

Read every Markdown document in the `Docs/` directory, recursively, including:

- Product intelligence reports.
- Research documents.
- Architecture recommendations.
- Source ledgers.
- Technical specifications.
- Previous decisions.
- Limitations.
- Outstanding questions.
- Evaluation frameworks.
- Any additional documentation present.

Do not read only the files whose names appear relevant.

Do not rely on summaries or filenames.

Read the actual contents.

The Phase 1 and Phase 2 documentation collectively establish the intended product, research strategy, technical direction and implementation constraints.

Treat these documents as the primary product specification.

### Source-of-truth hierarchy

When making decisions, use this hierarchy:

1. Explicit product decisions and requirements in the Docs directory.
2. Official Tavily and Bifrost documentation for their actual technical behaviour.
3. Official model-provider documentation.
4. Engineering judgement for implementation details not specified in the documents.

Do not silently change established product decisions.

If two documents contradict one another:

- Identify the contradiction.
- Determine whether one document explicitly supersedes the other.
- Preserve the intended product direction.
- Record the resolution in an engineering decision document.

If a critical decision remains unresolved, choose the safest implementation that preserves reversibility and document the assumption.

Do not allow unresolved research questions to become invented facts.

## 2.2 Create an internal implementation specification

After reading everything, create:

```text
Docs/IMPLEMENTATION_BLUEPRINT.md
Docs/TECHNICAL_DECISIONS.md
Docs/IMPLEMENTATION_PROGRESS.md
```

These documents must capture:

- Product requirements.
- Architecture.
- Component responsibilities.
- API contracts.
- Data structures.
- Research workflow.
- Security requirements.
- Integration details.
- Testing requirements.
- Outstanding dependencies.
- Implementation sequence.

These are living engineering documents. Keep them updated as implementation progresses.

Do not stop after creating these documents. Proceed to implementation.

---

# 3. OFFICIAL TECHNICAL RESEARCH — MANDATORY

You must study the official documentation of the external services we are integrating.

Do not build integrations based on outdated blog posts, random tutorials, guessed endpoint names or remembered API behaviour.

The technical documentation is part of the implementation specification.

## 3.1 Tavily — Research Infrastructure

Official resources:

- Main website: https://www.tavily.com/
- Documentation: https://docs.tavily.com/
- API documentation: https://docs.tavily.com/documentation/api-reference/introduction
- Search endpoint: https://docs.tavily.com/documentation/api-reference/endpoint/search
- Extract endpoint: https://docs.tavily.com/documentation/api-reference/endpoint/extract
- Research endpoint: https://docs.tavily.com/documentation/api-reference/endpoint/research
- API credits and pricing: https://docs.tavily.com/documentation/api-credits
- Agent skill reference: https://docs.tavily.com/skill.md

Read the official documentation comprehensively.

At minimum, investigate:

### Search API

Understand:

- Request and response structures.
- Search depth.
- Query formulation.
- Result limits.
- Domain inclusion and exclusion.
- Exact matching.
- Date filtering.
- Time ranges.
- Start and end date behaviour.
- Publication date semantics.
- Undated results.
- Relevance scores.
- Search credits.
- Rate limits.
- Error codes.
- Timeouts.
- Any relevant freshness controls.

Pay particular attention to the limitations documented in our research.

Tavily's publication dates are not guaranteed to be perfect representations of the underlying event date.

The application must therefore perform its own temporal verification.

### Extract API

Understand:

- URL batching.
- Maximum URL limits.
- Extraction depth.
- Query-based extraction.
- Chunks per source.
- Response structures.
- Failed-result handling.
- Timeouts.
- Credit calculations.

A successful HTTP response does not necessarily mean every requested URL was successfully extracted.

Inspect `results` and `failed_results` independently.

### Research API

Study the endpoint even though it is not intended to be on the MVP's critical production path.

Understand its asynchronous behaviour, supported parameters, output structures and limitations.

Document why it is not being used as the primary research engine.

### Pricing and usage

Implement actual credit accounting based on the documented API behaviour.

Never hardcode assumed prices as though they are guaranteed.

Where pricing is configurable or changes over time, keep it in configuration.

### Tavily integration requirement

Create a dedicated service layer.

Do not scatter Tavily HTTP requests throughout the application.

Use typed request and response models, validation, structured logging, error classification and explicit timeouts.

Implement graceful degradation.

If a source cannot be extracted, it must not magically become verified.

---

## 3.2 Bifrost by Maxim AI — LLM Gateway

Official resources:

- Product website: https://www.getmaxim.ai/
- Bifrost documentation: https://docs.getbifrost.ai/
- Bifrost GitHub: https://github.com/maximhq/bifrost
- Quick-start information: https://docs.getbifrost.ai/
- Provider configuration: https://docs.getbifrost.ai/quickstart/gateway/provider-configuration
- Retries and fallbacks: https://docs.getbifrost.ai/features/retries-and-fallbacks

Study the documentation and repository thoroughly.

Bifrost is not simply another API dependency. It is part of the product's reliability and LLM infrastructure.

Understand:

- Installation and deployment.
- Supported providers.
- Provider configuration.
- OpenAI-compatible endpoints.
- Authentication.
- Model identifiers.
- Request formats.
- Structured outputs.
- Streaming.
- Retry behaviour.
- Exponential backoff.
- Provider fallbacks.
- Key rotation.
- Timeout semantics.
- Request deadlines.
- Response metadata.
- Routing information.
- Attempt trails.
- Usage and cost reporting.
- Configuration persistence.
- Health checks.
- Logging and observability.
- Security and gateway access controls.
- Open-source versus enterprise features.

Read the actual relevant source documentation, not merely the marketing overview.

### Required integration architecture

Our application must use a provider abstraction.

Conceptually:

```text
Briefly.ai
    |
    v
Model Provider Interface
    |
    v
Bifrost Gateway
    |
    +---- Primary LLM provider
    |
    +---- Fallback LLM provider
```

The application should not become dependent on one provider's proprietary SDK behaviour.

Use the gateway's documented compatible interface wherever it supports the required functionality.

### Retry configuration

Follow the Phase 2 recommendation:

- One carefully controlled retry.
- One fallback provider.
- Explicit application-level deadlines.
- Provider timeout below the application deadline.
- No unbounded retries.
- No accidental retry multiplication.

Do not blindly copy examples from the Bifrost documentation that configure five retries.

Our product has a strict latency budget.

### Gateway bypass

Implement a reliable bypass mechanism.

If Bifrost is unavailable:

- Log the gateway failure.
- Activate the direct-provider path if configured.
- Preserve the same application-level model interface.
- Report which provider actually served the request.

Do not silently claim that a request was routed through Bifrost when it was not.

### Disable semantic caching

Semantic caching must remain disabled for the MVP.

Briefly.ai deals with time-sensitive information. Serving an older research or synthesis response because it resembles a previous request is unacceptable.

### Bifrost ownership

Automate gateway setup as much as possible.

The application should provide:

- A documented installation procedure.
- Provider configuration.
- Health checks.
- Startup integration.
- Clear failure messages.
- A reliable shutdown procedure.
- A bypass path.

Do not assume Bifrost is already installed.

If it can be installed and launched through an appropriate local runtime, automate that.

If the environment cannot support the selected installation method, detect that and provide the exact actionable setup instructions.

Do not disguise a missing gateway as a successful integration.

---

# 4. THIRD-PARTY MODEL PROVIDERS

The Phase 2 research recommends:

| Responsibility | Recommended model |
|---|---|
| Entity resolution assistance | Claude Haiku 5.5 |
| Research query planning | Claude Haiku 5.5 |
| Claim extraction | Claude Haiku 5.5 |
| Semantic contradiction checks | Claude Sonnet 5.5 |
| Final synthesis | Claude Sonnet 5.5 |
| Question generation | Claude Sonnet 5.5 |

These are the starting recommendations, not experimentally proven winners.

Verify current model identifiers, API compatibility, structured-output support and pricing against official provider documentation before implementation.

Do not assume that a model identifier in an old document remains valid.

Build the model configuration centrally.

Make model assignments configurable without requiring application code changes.

The fallback model must be compatible with the task it is serving.

For example, a fallback for structured claim extraction must still produce output that satisfies the extraction schema.

A provider fallback must never bypass deterministic verification.

---

# 5. THE DESIGN ASSETS — INSPECT AND USE THE ACTUAL FILES

This section is extremely important.

I have provided reference assets in the project root. These are intentional design inputs, not optional inspiration.

## 5.1 Hero UI Reference

There is an asset named:

`Hero UI Reference`

Locate it and inspect its actual file format and contents.

It is the primary visual reference for the hero section.

Reproduce its design language as faithfully as possible.

Study:

- Layout.
- Spacing.
- Typography.
- Composition.
- Alignment.
- Background treatment.
- Visual hierarchy.
- Decorative elements.
- Positioning.
- Responsive behaviour.
- Any text or interface elements.

Do not substitute a generic AI SaaS landing page.

Do not casually reinterpret the reference.

The result should look like a carefully implemented version of the supplied reference.

If the asset is an image, inspect it at full resolution.

If it is another format, use the appropriate inspection method.

## 5.2 Hero Background

There is another project-root asset named:

`Hero Background`

This is the background image associated with the hero reference.

Use this actual asset.

Do not replace it with a stock photograph, a generated image or a generic gradient.

Preserve its visual characteristics.

Inspect its dimensions, aspect ratio and quality.

Use appropriate cropping, positioning and responsive scaling without distorting it.

## 5.3 Heading font archive

There is a ZIP archive in the project root containing the font that must be used for every heading.

You must:

1. Locate the archive.
2. Inspect its contents.
3. Extract it.
4. Identify the actual font files and weights.
5. Check available font formats.
6. Install or copy the required assets into the application's public/static asset directory.
7. Register the font correctly in the application.
8. Use it consistently for all headings.

Do not simply reference the ZIP file from CSS.

Do not substitute another typeface because the supplied font is inconvenient.

Preserve the font's licensing information if included in the archive.

Body typography should complement the supplied heading typeface.

## 5.4 Background.mp4

There is a four-second video named:

`Background.mp4`

This video must become the background treatment for the website after the hero section ends.

The intended visual transition is:

- The hero section uses `Hero Background`.
- The hero ends.
- The remaining website uses `Background.mp4` as its continuous background.

This must feel like one deliberately designed experience.

Do not simply place a video element inside an arbitrary content section.

Implement the background at the appropriate application-layout level.

Requirements:

- Autoplay.
- Muted playback.
- Loop continuously.
- Inline playback.
- Appropriate cover behaviour.
- Responsive dimensions.
- No visible playback controls.
- No awkward restart flashes.
- No unexpected gaps between sections.
- Proper fallback if video playback fails.
- Respect reduced-motion preferences.

Investigate the actual video.

Inspect its dimensions, frame rate, compression, visual content and loop transition.

If necessary, optimise a copy for web delivery without modifying the original source asset.

The video must remain visually behind the content, not interfere with readability or interaction.

Use carefully designed overlays only where needed.

## 5.5 Asset verification

Before implementation, create an asset inventory:

```text
Docs/ASSET_INVENTORY.md
```

Record:

- Filename.
- Actual file type.
- Dimensions.
- File size.
- Purpose.
- Final application path.
- Processing or optimisation performed.

Do not invent file paths or silently ignore missing assets.

---

# 6. PRODUCT ARCHITECTURE

Build the application around the architecture established in Phase 2.

The preferred architecture is a deterministic, streamed, stateless research pipeline.

Conceptually:

```text
                    USER
                      |
                      v
              BRIEFLY.AI FRONTEND
                      |
                      v
                ORCHESTRATOR API
                      |
           +----------+----------+
           |                     |
           v                     v
    INPUT PROCESSOR        WINDOW CALCULATOR
           |                     |
           +----------+----------+
                      |
                      v
                ENTITY RESOLVER
                      |
                      v
                RESEARCH PLANNER
                      |
                      v
                 TAVILY SEARCH
                      |
                      v
                SOURCE SELECTOR
                      |
                      v
                TAVILY EXTRACT
                      |
                      v
                CLAIM EXTRACTOR
                      |
                      v
              VERIFICATION ENGINE
                      |
                      v
                GAP DETECTOR
                      |
              +-------+-------+
              |               |
          More research     Complete
              |               |
              +--> Search     v
                       SYNTHESIS ENGINE
                              |
                              v
                       QUESTION GENERATOR
                              |
                              v
                        REPORT RENDERER
                              |
                              v
                        FINAL BRIEFING
```

LLM requests pass through Bifrost wherever applicable.

The orchestration logic remains under application control.

## 6.1 Deterministic execution

Do not build an autonomous agent that can freely decide which tools to invoke and how long to run.

Do not introduce unnecessary multi-agent handoffs.

The application must control:

- Execution order.
- Search budgets.
- Date filtering.
- Extraction.
- Claim validation.
- Verification.
- Gap detection.
- Retry limits.
- Timeouts.
- Stopping conditions.
- Final output validation.

LLMs perform bounded, schema-defined tasks.

---

# 7. RESEARCH WINDOW ENGINE

This is one of the most important pieces of the application.

Implement the exact Phase 2 decision.

The research window is:

```text
window_end = min(now, meeting_start)
window_start = window_end - 30 calendar days
```

Use the meeting's IANA timezone.

The window is inclusive.

The implementation must account for:

- Future meetings.
- Meetings happening today.
- Past meetings.
- Daylight-saving transitions.
- Timezone offsets.
- UTC conversion.
- Calendar-day boundaries.
- Invalid timezone identifiers.
- Far-future meetings.

Maintain both:

- Human-readable local dates.
- Machine-readable UTC timestamps.

### Example

A meeting scheduled for November 20, 2026, at 15:00 IST, with the current time being November 13, 2026, must not receive research published after November 13.

A meeting that happened on November 10 must not include developments after that meeting.

### Tavily integration

Tavily date filters are discovery aids, not the final authority.

Use a suitably padded date range when calling the API, then apply strict local filtering.

Investigate the exact documented date-filter semantics.

Do not assume the API handles timezone boundaries in the same way as our application.

### Event date versus publication date

This distinction must be implemented explicitly.

Each extracted claim should be evaluated against:

- Publication date.
- Actual event date.
- Announcement date.
- Possible update date.

A November article about a March event is not automatically a November development.

If the date cannot be established reliably, classify it appropriately.

Do not promote uncertain dates into the recent-development section.

---

# 8. ENTITY RESOLUTION

The primary research entity can be an organisation or a person.

Required information:

- Entity name.
- Entity kind.
- Organisation domain, when applicable.
- Profile URL, where applicable.
- Organisation and title, for people where available.

The entity resolver must not blindly trust a name.

### Organisation resolution

If a domain is provided, use it as the primary identity anchor.

Otherwise:

1. Search the exact organisation name.
2. Identify candidate domains.
3. Inspect name/domain co-occurrence.
4. Use LLM assistance to rank candidates based on available evidence.
5. Validate the result deterministically.
6. Ask for clarification if candidates are genuinely ambiguous.

### Person resolution

A person must have at least one useful disambiguator:

- Organisation.
- Professional title.
- Profile URL.

Resolution statuses:

- CONFIRMED
- PROBABLE
- AMBIGUOUS

Do not attribute another person's achievements to someone with a similar name.

Do not research private or family information.

If insufficient professional information is publicly available, say so.

---

# 9. MEETING INPUT AND ATTENDEES

The primary entity receives the full research workflow.

Additionally, implement the recommended attendee functionality.

Support up to three optional attendee hints.

Each attendee can include:

```json
{
  "name": "string",
  "title": "string",
  "organization": "string",
  "profile_url": "string"
}
```

For each attendee:

- Run one targeted, window-scoped advanced Tavily search.
- Use exact-match assistance where appropriate.
- Limit the number of results.
- Verify any extracted claim through the same evidence engine.
- Produce at most one useful verified line.
- Otherwise communicate that no recent public professional developments were found.

Avoid duplicating the primary organisation's research.

Keep the attendee feature lightweight.

The input interface must not become unnecessarily complicated.

---

# 10. RESEARCH PLANNING ENGINE

Implement the fixed-core-plus-dynamic-top-up strategy from Phase 2.

The nine fixed categories are:

1. Funding and financials.
2. Leadership and hiring.
3. Product and launches.
4. Partnerships and customers.
5. Mergers and acquisitions.
6. Regulatory and legal.
7. Market and competitor context.
8. Executive activity.
9. Risk signals.

Examples of relevant developments:

- Funding announcements.
- Valuation updates.
- Leadership appointments.
- Executive departures.
- Hiring trends.
- Product launches.
- Partnerships.
- Customer announcements.
- Acquisitions.
- Lawsuits.
- Regulatory investigations.
- Competitor developments.
- Interviews and keynote appearances.
- Layoffs.
- Security incidents.
- Product recalls.

Create meeting-type weights.

### Sales

Prioritise:

- Leadership and hiring.
- Product.
- Partnerships.
- Funding.
- Risks.

### Investor

Prioritise:

- Funding and financials.
- Leadership.
- Market and competitors.
- Regulatory.
- Risks.

### Partnership

Prioritise:

- Partnerships.
- Product.
- M&A.
- Leadership.

### Recruiting

Prioritise:

- Leadership and hiring.
- Funding.
- Risks.

### General

Use balanced coverage.

Implement no more than two dynamic queries to personalise research using the meeting goal and relevant attendee information.

The planner may use an LLM for query formulation, but the fixed coverage categories must remain controlled by application code.

---

# 11. SOURCE EXTRACTION AND CLAIM GENERATION

This is a critical subsystem.

Do not directly feed search-result snippets into final synthesis and treat them as facts.

The application must retrieve source content wherever possible.

For each source, maintain:

- Original URL.
- Canonical URL.
- Domain.
- Publisher.
- Title.
- Publication date.
- Extraction status.
- Source tier.
- Retrieval metadata.
- Origin cluster.
- Text reference.
- Security flags.

Use Tavily Extract for selected sources.

Extract atomic claims.

An atomic claim expresses one independently verifiable development.

For example, instead of:

"Acme Technologies raised funding, hired a new CFO and launched a product."

Produce three separate claims.

Every claim must retain:

- Claim ID.
- Entity ID.
- Category.
- Claim type.
- Supporting source IDs.
- Verbatim evidence spans.
- Date information.
- Authority.
- Source independence.
- Temporal status.
- Entity-match status.
- Verification status.
- Reason codes.
- Disposition.

The LLM must return structured data conforming to a strict schema.

Reject malformed output.

Do not accept a generated citation that does not correspond to a retrieved source.

---

# 12. VERIFICATION ENGINE

Implement the five-status verification framework.

| Status | Meaning |
|---|---|
| VERIFIED | Sufficient independent, reliable evidence |
| COMPANY-STATED | Supported by the organisation's own announcement |
| SINGLE SOURCE | Supported by one independent source |
| CONFLICTING | Credible sources disagree |
| UNVERIFIED | Insufficient evidence |

The verification engine must be primarily deterministic.

## 12.1 Independent source verification

Do not count syndicated copies as independent confirmation.

Implement origin clustering using multiple signals:

- Canonical URLs.
- Domain identity.
- Publisher family.
- Near-duplicate content.
- Press-release attribution.
- Shared original reporting.
- Explicit citations to the same originating announcement.

Use conservative rules.

When independence is uncertain, avoid over-promoting a claim to VERIFIED.

## 12.2 Conflicting claims

If sources disagree:

- Preserve both claims.
- Preserve both evidence trails.
- Identify the conflicting attribute.
- Do not average values.
- Do not choose one arbitrarily.
- Display the disagreement.
- Generate a question that allows the user to clarify it.

## 12.3 Claim-type awareness

Different claims require different treatment.

Distinguish:

- Actions.
- Statements.
- Metrics.
- Evaluative claims.
- Planned developments.
- Anonymous-source reporting.

For example, a company's statement about future revenue must not be presented as independently established revenue.

## 12.4 No numerical confidence theatre

Do not invent numerical confidence scores.

Use evidence dimensions and transparent categorical statuses.

Every displayed status should have a human-readable explanation.

---

# 13. PROMPT-INJECTION AND SECURITY BOUNDARIES

Research content is untrusted.

A webpage might contain text that attempts to manipulate the model.

The application must explicitly protect against indirect prompt injection.

Implement the following:

1. Clearly separate system instructions from retrieved content.
2. Treat retrieved content as untrusted evidence, never as executable instructions.
3. Do not provide arbitrary tools to claim-extraction or synthesis models.
4. Restrict LLM output to predefined schemas.
5. Validate every extracted claim against its supporting source.
6. Validate evidence spans against actual retrieved text.
7. Validate all source URLs against retrieved Tavily results.
8. Use strict server-side URL and domain validation.
9. Log suspicious source content.
10. Exclude suspicious content where appropriate.
11. Never execute code, commands or instructions found inside retrieved documents.
12. Escape all research-derived text before rendering.

Read the official OWASP guidance on indirect prompt injection:

https://genai.owasp.org/LLM01/

Implement appropriate protections without pretending that heuristic injection detection can guarantee perfect detection.

### Additional security

Implement:

- Server-side API-key storage.
- Strict environment-variable handling.
- No API credentials in frontend bundles.
- Input validation.
- Output validation.
- Safe HTML rendering.
- XSS prevention.
- CSRF protection where relevant.
- CORS restrictions.
- Rate limiting.
- Request size limits.
- Per-run credit limits.
- Global daily spending limits.
- Secure logging.
- Secret redaction.
- Safe error responses.
- Dependency auditing.
- A restrictive Content Security Policy.

The application must not expose internal stack traces or provider credentials to users.

---

# 14. RESEARCH STOPPING CONDITIONS

Implement the bounded research loop.

Initial research sweep, followed by a maximum of two gap-filling rounds.

The stopping conditions should include:

- Adequate category coverage.
- Missing important categories.
- Uncorroborated high-importance claims.
- Conflicting claims.
- Diminishing returns.
- Credit exhaustion.
- Time budget exhaustion.
- Maximum number of rounds.

Use the Phase 2 limits as the initial configuration:

- Maximum two gap rounds.
- Maximum 30 Tavily credits per brief.
- Approximately 60 seconds of research-loop budget.

These are design limits, not measured performance guarantees.

Record the stopping reason:

- COVERAGE_REACHED
- DIMINISHING_RETURNS
- BUDGET_CREDITS
- BUDGET_TIME
- MAX_ROUNDS
- ERROR

Every empty category should be recorded as a research gap.

Never fabricate information to fill missing categories.

---

# 15. FINAL BRIEFING ENGINE

The briefing is the actual product.

It must be concise, useful, evidence-backed and visually excellent.

The recommended briefing structure is:

## Header

- Primary entity.
- Attendee strip.
- Meeting date and timezone.
- Research window.
- As-of timestamp.
- Generation timestamp.

## What changed

Display three to six important developments.

Each development should contain:

- Headline.
- One-sentence summary.
- Event date.
- Category.
- Verification status.
- Source references.

## Why it matters for this meeting

Generate two to four lines tied to:

- Meeting type.
- Meeting goal.
- Verified developments.

Every factual statement must reference underlying claim IDs.

## Questions and discussion points

Generate four to six useful questions.

Mix:

- Open questions.
- Talking points.
- Clarification questions.
- Questions about conflicts.
- Questions informed by missing information.

Every factual question must have grounding claim IDs.

## Gaps and cautions

Include:

- Categories searched without findings.
- Conflicting claims.
- Unverified information.
- Uncertain dates.
- Identity limitations.
- Research-window limitations.

## Sources

Provide numbered citations.

Each source should expose:

- Publisher/domain.
- Source tier.
- Date.
- Direct URL.

## Background

Optionally show a maximum of two relevant developments outside the research window.

These must be explicitly labelled as background.

They must never appear as recent developments.

### Ranking

Use the deterministic ranking framework from Phase 2:

```text
rank =
    category_weight
    × recency_decay
    × novelty
    × status_weight
```

The LLM does not decide the final ranking.

The starting status weights are:

- VERIFIED: 1.0
- COMPANY-STATED: 0.85
- SINGLE SOURCE: 0.7
- CONFLICTING: 0.75
- UNVERIFIED: 0.0

Keep these configurable and document that they are starting heuristics.

Maximum six primary developments.

Additional findings can appear in a collapsible section.

### Sparse research

If little relevant information exists, show an honest quiet-period state.

Example:

"No verified developments were identified in the research window for Funding, M&A and Regulatory activity."

This must look intentional, not like an application failure.

---

# 16. FRONTEND AND USER EXPERIENCE

Build a complete application.

The landing page, research input, progress experience, briefing report, evidence drawer, export experience and error states must all work.

Do not create disconnected screens.

The application should have a coherent design system.

## 16.1 Hero section

Follow the supplied `Hero UI Reference` and use `Hero Background`.

This is a non-negotiable visual requirement.

Reproduce the supplied design as faithfully as possible.

Pay close attention to:

- Typography.
- Visual hierarchy.
- Composition.
- Spacing.
- Positioning.
- Background treatment.
- Text contrast.
- Responsiveness.

The heading font extracted from the supplied ZIP must be used throughout.

## 16.2 Remaining website background

Use `Background.mp4` for the background of the remaining website after the hero.

Implement the continuous video background properly.

Keep the interface legible and polished.

Do not allow video rendering to cause performance problems or layout instability.

## 16.3 Main product flow

The intended user journey:

```text
Landing Page
     |
     v
Start Preparing
     |
     v
Meeting Input
     |
     v
Optional Entity Disambiguation
     |
     v
Research Progress
     |
     v
Briefing Report
     |
     v
Evidence Inspection / Export
```

### Meeting input screen

Support:

- Entity name.
- Entity type.
- Optional organisation domain.
- Meeting date.
- Meeting time.
- Timezone.
- Meeting type.
- Meeting goal.
- Optional attendees, maximum three.

Show the calculated research window before the user starts.

Make the time and timezone understandable.

Use proper date/time controls.

Do not silently assume the wrong timezone.

### Entity disambiguation

Only display this screen when necessary.

Show a small number of candidate entities with:

- Name.
- Domain.
- Short description.
- Relevant identifying information.

Allow the user to choose the correct candidate or provide additional information.

Never silently guess when identity is ambiguous.

### Research progress

Build a polished, streamed progress experience.

Display meaningful steps such as:

- Resolving organisation identity.
- Planning research.
- Searching funding developments.
- Searching product announcements.
- Reading selected sources.
- Extracting claims.
- Verifying evidence.
- Checking source independence.
- Detecting conflicts.
- Preparing the briefing.

Progress must reflect actual backend events.

Do not fabricate percentages or pretend research is happening when it is not.

### Final briefing

This is the most important application screen.

It must look like a professional research document.

Use clear typographic hierarchy, whitespace, compact status chips and readable evidence references.

The report should be usable on a desktop and remain readable on smaller devices.

### Evidence drawer

Clicking a briefing development should reveal:

- Original claim.
- Supporting excerpt.
- Highlighted evidence span.
- Source details.
- Publisher.
- Date.
- Source tier.
- Origin cluster.
- Number of independent origins.
- Verification explanation.
- Original article link.

This is a major product differentiator.

### Export

Implement:

- Print-to-PDF.
- Copy as Markdown.
- Download JSON.

The printed report must include the entity, meeting date, research window and generation timestamp.

Exclude developer-only information from user-facing exports.

---

# 17. BACKEND AND API DESIGN

Build a proper backend, not business logic hidden inside frontend components.

The frontend should communicate with a clearly structured application API.

The backend must expose appropriate endpoints for:

- Health checks.
- Entity resolution.
- Brief generation.
- Streaming progress.
- Brief result retrieval within the current session.
- Evidence inspection.
- Export.
- Development replay.

Use a typed request/response contract.

Implement proper validation.

Use streaming for progress where appropriate, preferably Server-Sent Events for the research workflow.

Support:

- Connection interruptions.
- Client cancellation.
- Request timeouts.
- Structured error responses.
- Partial progress.
- Completion events.

The client should not have to infer application state from arbitrary log messages.

Define explicit event types, for example:

```text
run.started
entity.resolved
research.planned
search.started
search.completed
extract.started
extract.completed
claims.extracted
verification.completed
gap.round_started
synthesis.started
brief.completed
run.failed
```

Do not expose secrets or internal provider error payloads in these events.

## 17.1 Persistence

Follow the Phase 2 recommendation.

No database for the MVP.

No PostgreSQL.

No vector database.

No unnecessary cloud storage.

The primary workflow should be stateless.

Keep the current briefing in application/session memory as appropriate, with browser-side session persistence for the last generated result.

Implement local record/replay for development and testing.

Save:

- Raw Tavily responses.
- Relevant extraction outputs.
- Final structured briefing JSON.
- Run metadata.

Do not retain personal attendee information on the server by default.

Replay artifacts must be local development data and excluded from version control.

Do not persist API keys in replay files.

---

# 18. OBSERVABILITY, COST AND PERFORMANCE

Every research run must have a traceable execution record.

Capture:

- Run ID.
- Start and end time.
- Research window.
- Search queries.
- Tavily credits used.
- Extract credits used.
- Number of sources discovered.
- Number of sources extracted.
- Failed extractions.
- Claims extracted.
- Claims verified.
- Conflicts detected.
- Research gaps.
- Number of gap rounds.
- LLM provider.
- Model.
- Token usage.
- LLM cost.
- Retry count.
- Fallback usage.
- Stop reason.
- Total latency.

Bifrost metadata such as routing information and attempt trails should be used where available and documented.

### Initial performance targets

These are targets, not guarantees:

| Metric | Target |
|---|---:|
| Research and generation p50 | ≤40 seconds |
| Hard execution deadline | 75 seconds |
| Tavily budget | ≤30 credits |
| Cost per briefing | ≤$0.40 |
| Primary developments | Maximum 6 |

Build for parallel research and per-document claim extraction where appropriate.

Avoid unnecessary full-document LLM context.

Prefer extracted chunks and structured claims.

Implement bounded concurrency.

Do not make performance improvements that weaken evidence validation.

---

# 19. TESTING AND QUALITY ASSURANCE

Do not declare the project complete simply because it builds.

You must test it.

Implement the 24 evaluation cases specified in Phase 2.

These include:

1. Major public company with extensive news.
2. Small startup.
3. Sparse-news organisation.
4. Ambiguous executive name.
5. Executive with organisation disambiguation.
6. Three optional attendees.
7. Conflicting funding figures.
8. Old event in a recently published article.
9. Missing publication dates.
10. Five syndicated articles.
11. Company announcement republished by another source.
12. Misleading or evaluative marketing claim.
13. Prompt-injection webpage.
14. Investor meeting.
15. Sales meeting.
16. Partnership meeting.
17. Future meeting.
18. Past meeting.
19. Meeting more than 30 days in the future.
20. Private individual with little public information.
21. Similarly named subsidiaries.
22. Tavily 429/434 errors.
23. LLM provider outage.
24. Total research failure.

Add further tests wherever necessary.

### Important automated tests

Test:

- Date-window calculations.
- Timezone handling.
- Boundary inclusivity.
- Entity matching.
- Claim schemas.
- Evidence-span grounding.
- Source URL validation.
- Origin clustering.
- Contradiction detection.
- Status assignment.
- Research stopping conditions.
- Budget enforcement.
- Retry limits.
- Fallback handling.
- Output consistency.
- XSS protection.
- Prompt-injection resistance.
- Export correctness.

### Golden replay

Create a repeatable test harness.

Use frozen Tavily responses so that the same research data can be tested without requiring live API calls.

Include deliberately planted cases:

- Fake articles.
- Duplicated reporting.
- Conflicting numbers.
- Hidden instructions.
- Incorrect event dates.
- Ambiguous identities.

The system should behave consistently against the same replay corpus.

### Quality gate

Before declaring completion:

- All dependencies install.
- Application builds.
- Type checking passes.
- Linting passes.
- Automated tests pass.
- Security-sensitive tests pass.
- No missing assets.
- No broken internal routes.
- No placeholder buttons.
- No dead-end interactions.
- No fake API responses in production mode.
- No hardcoded API credentials.
- No console errors caused by application code.

If an external API key is unavailable, test the integration using recorded responses and mocks, but explicitly mark live-provider validation as pending.

Never report an unperformed live test as successful.

---

# 20. ERROR HANDLING AND DEGRADATION

The application must fail intelligently.

Examples:

**Tavily unavailable**

Show a useful error and retain diagnostic information.

Do not display a fabricated briefing.

**Some extraction requests fail**

Continue with successful sources, but lower the verification status of affected claims.

**LLM provider unavailable**

Use the configured Bifrost fallback.

If both providers fail, use deterministic templates where possible or terminate the affected stage honestly.

**Bifrost unavailable**

Attempt the configured direct-provider bypass.

**Entity ambiguity**

Request clarification.

**No relevant developments**

Display a quiet-period report.

**Credit limit reached**

Stop research gracefully and disclose incomplete categories.

**Total retrieval failure**

Display a proper failure state, not an empty successful report.

Every degradation must be visible and understandable.

---

# 21. PROJECT ORGANISATION

Choose a maintainable project structure appropriate to the existing environment and the final technology stack.

Separate:

- Frontend.
- Backend.
- API contracts.
- Research services.
- Tavily integration.
- Bifrost integration.
- Model abstraction.
- Entity resolution.
- Date and timezone utilities.
- Claim extraction.
- Verification.
- Origin clustering.
- Gap detection.
- Synthesis.
- Question generation.
- Report rendering.
- Export.
- Security.
- Observability.
- Testing.
- Replay fixtures.

Do not put the entire application in one file.

Do not create unnecessary abstractions just for architectural appearance.

Use typed models and clear service boundaries.

Keep configuration centralised.

Pin dependencies appropriately and avoid unnecessary packages.

---

# 22. ENVIRONMENT CONFIGURATION — MY ONLY EXPECTED MANUAL RESPONSIBILITY

This is a major delivery requirement.

Create a complete `.env.example`.

Create the actual `.env` file if appropriate, but never insert fabricated credentials.

All required configuration must be clearly documented.

I should not need to inspect source code to discover which credentials are required.

The configuration should account for the following categories, adapting variable names to the actual implementation:

```dotenv
# Application
APP_ENV=development
APP_HOST=127.0.0.1
APP_PORT=
FRONTEND_URL=

# Tavily
TAVILY_API_KEY=

# Primary LLM provider
ANTHROPIC_API_KEY=

# Fallback provider
FALLBACK_PROVIDER=
FALLBACK_API_KEY=

# Bifrost
BIFROST_BASE_URL=http://localhost:8080
BIFROST_API_KEY=
BIFROST_ENABLED=true
BIFROST_MAX_RETRIES=1

# Model configuration
MODEL_ENTITY_RESOLUTION=
MODEL_QUERY_PLANNING=
MODEL_CLAIM_EXTRACTION=
MODEL_SEMANTIC_VERIFICATION=
MODEL_SYNTHESIS=
MODEL_QUESTION_GENERATION=

# Research limits
MAX_TAVILY_CREDITS_PER_BRIEF=30
MAX_GAP_ROUNDS=2
MAX_RESEARCH_SECONDS=60
MAX_ATTENDEES=3

# Security and rate limiting
RATE_LIMIT_ENABLED=true
MAX_REQUEST_SIZE=
DAILY_CREDIT_LIMIT=
```

This is an illustrative configuration schema. Implement the actual variables required by the chosen stack and the documented integrations.

### Configuration requirements

1. Validate required credentials at startup.
2. Never log their values.
3. Distinguish missing credentials from invalid credentials.
4. Provide clear provider-specific errors.
5. Validate model identifiers.
6. Validate gateway connectivity.
7. Validate provider configuration.
8. Run a minimal health check.
9. Explain how to obtain each key.
10. Explain which services require credentials and which are locally self-hosted.

Do not require a user to manually edit source code.

Do not require a user to manually construct complex Bifrost configuration JSON if the application can generate it.

### Startup experience

Provide a single, documented startup procedure.

Ideally:

```bash
# Install dependencies
...

# Configure environment
# Add API keys to .env

# Start application
...
```

Automate the remaining setup.

If Bifrost needs a separate process, create a startup script that checks whether it is already running, starts it when needed, waits for health readiness, and then starts the application.

Avoid launching duplicate gateway processes.

Provide an appropriate Windows startup script because the development environment is Windows.

Also provide a cross-platform alternative if practical.

---

# 23. DESIGN QUALITY AND RESPONSIVENESS

This product must feel finished.

Do not use the generic AI-dashboard aesthetic.

The design should be deliberate, cohesive and professionally executed.

Use the supplied visual reference as the starting point for the landing page.

For the application itself, establish a consistent design system:

- Typography.
- Font hierarchy.
- Spacing.
- Layout grids.
- Borders.
- Shadows.
- Colours.
- Status indicators.
- Buttons.
- Inputs.
- Drawers.
- Cards.
- Loading states.
- Error states.

Prioritise readability.

The briefing is information-dense, so visual restraint matters.

Do not overuse gradients, glassmorphism, excessive animation or decorative elements.

Use motion to communicate state and improve interaction, not to distract.

Responsive requirements:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Test real viewport sizes.

Pay attention to long company names, lengthy headlines, source URLs and large evidence excerpts.

No horizontal overflow.

No clipped content.

No broken typography.

No layout shifts during video loading.

---

# 24. MVP SCOPE — DO NOT LOSE FOCUS

The following is the mandatory MVP.

## Must have

1. Complete landing page.
2. Functional meeting input.
3. Research window calculator.
4. Entity resolution.
5. Fixed-category research planning.
6. Tavily Search.
7. Tavily Extract.
8. Claim extraction.
9. Evidence-span validation.
10. Temporal verification.
11. Origin clustering.
12. Five-status verification engine.
13. Contradiction handling.
14. Gap detection.
15. Bounded research loop.
16. Bifrost integration.
17. Provider fallback.
18. Direct-provider bypass.
19. LLM usage and cost tracking.
20. Streamed progress.
21. One-page briefing.
22. Grounded discussion questions.
23. Research gaps and cautions.
24. Evidence inspection.
25. PDF, Markdown and JSON export.
26. Golden replay.
27. Security protections.
28. Automated tests.
29. Setup documentation.

## Should have

- Up to three attendee hints.
- Entity disambiguation interface.
- Detailed evidence drawer.
- Print stylesheet.
- Rich execution receipt.
- Development diagnostics.

## Explicitly defer

Do not spend MVP time implementing:

- Calendar integration.
- Persistent meeting history.
- Hosted database.
- Vector database.
- Full CRM integration.
- Full relationship graph.
- Automatic scheduled briefings.
- Complex multi-agent orchestration.
- Semantic caching.
- Research API as the primary retrieval pipeline.
- Multi-user workspaces.

The MVP must be excellent at one thing: producing a reliable pre-meeting briefing.

---

# 25. IMPLEMENTATION EXECUTION PLAN

Work through the following phases.

You may run independent tasks in parallel where safe, but preserve architectural consistency.

## Phase 0 — Reconnaissance

- Inspect project files.
- Read every document in Docs/.
- Inspect every supplied asset.
- Inspect the development environment.
- Identify existing dependencies and constraints.
- Research official API documentation.
- Produce the implementation blueprint.

## Phase 1 — Foundation

- Set up project structure.
- Configure tooling.
- Configure environment variables.
- Establish frontend/backend communication.
- Implement health checks.
- Implement typed contracts.
- Establish logging and error handling.

## Phase 2 — Infrastructure integrations

- Implement Tavily service.
- Implement Bifrost setup.
- Implement provider abstraction.
- Configure primary and fallback models.
- Implement bypass.
- Validate gateway and provider connectivity.

## Phase 3 — Research engine

- Implement timezone engine.
- Implement research-window calculation.
- Implement entity resolution.
- Implement research planning.
- Implement Search.
- Implement source selection.
- Implement Extract.
- Implement claim extraction.
- Implement evidence validation.
- Implement verification.
- Implement origin clustering.
- Implement contradiction detection.
- Implement gap rounds.
- Implement budget enforcement.

## Phase 4 — Intelligence generation

- Implement deterministic ranking.
- Implement meeting relevance.
- Implement synthesis.
- Implement question generation.
- Implement output validation.
- Implement briefing JSON.

## Phase 5 — Frontend

- Reproduce hero reference.
- Integrate supplied hero background.
- Extract and register heading font.
- Integrate Background.mp4.
- Build meeting input.
- Build disambiguation.
- Build progress interface.
- Build final report.
- Build evidence drawer.
- Build export functionality.
- Implement responsive layouts.

## Phase 6 — Security and reliability

- Implement security boundaries.
- Implement rate limits.
- Implement timeout handling.
- Implement gateway fallback.
- Implement golden replay.
- Implement failure states.
- Audit secrets and dependencies.

## Phase 7 — Testing and refinement

- Run the full evaluation suite.
- Run date/time boundary tests.
- Run security tests.
- Test responsive behaviour.
- Verify exports.
- Verify all interactions.
- Profile performance.
- Fix defects.

## Phase 8 — Delivery

- Finalise documentation.
- Update environment examples.
- Create startup scripts.
- Create troubleshooting documentation.
- Produce final implementation report.
- Clearly identify any remaining externally blocked validation.

---

# 26. REQUIRED PROJECT DOCUMENTATION

Create and maintain the following:

```text
Docs/
│
├── IMPLEMENTATION_BLUEPRINT.md
├── TECHNICAL_DECISIONS.md
├── IMPLEMENTATION_PROGRESS.md
├── ASSET_INVENTORY.md
├── SYSTEM_ARCHITECTURE.md
├── API_REFERENCE.md
├── ENVIRONMENT_SETUP.md
├── LOCAL_DEVELOPMENT.md
├── TAVILY_INTEGRATION.md
├── BIFROST_INTEGRATION.md
├── RESEARCH_PIPELINE.md
├── VERIFICATION_ENGINE.md
├── SECURITY_MODEL.md
├── TESTING_STRATEGY.md
├── TROUBLESHOOTING.md
└── FINAL_DELIVERY_REPORT.md
```

You do not need to create duplicate documentation if an equivalent file already exists. Extend it where appropriate.

Documentation must reflect the implementation, not an imaginary future architecture.

Every configuration variable must be explained.

Every external dependency must be documented.

Every important engineering decision must have a rationale.

---

# 27. NON-NEGOTIABLE ENGINEERING RULES

These rules override convenience.

1. Do not build a fake prototype.
2. Do not use mock data in production execution.
3. Do not hardcode API keys.
4. Do not fabricate research findings.
5. Do not fabricate citations.
6. Do not treat search snippets as fully verified evidence.
7. Do not confuse publication dates with event dates.
8. Do not silently resolve ambiguous identities.
9. Do not count syndicated articles as independent confirmation.
10. Do not allow retrieved webpages to control LLM tools.
11. Do not allow unbounded research loops.
12. Do not allow unbounded retries.
13. Do not silently bypass Bifrost.
14. Do not enable semantic caching.
15. Do not introduce a database without a demonstrated requirement.
16. Do not generate a briefing containing unverified developments as established facts.
17. Do not display invented progress.
18. Do not leave nonfunctional buttons.
19. Do not ignore the supplied visual assets.
20. Do not stop after frontend implementation.
21. Do not stop after backend implementation.
22. Do not declare tests passed when they were not executed.
23. Do not conceal limitations.
24. Do not repeatedly ask the user questions that can be resolved through research or inspection.

If a requirement cannot be implemented exactly, explain why, implement the closest safe alternative, and record the limitation.

---

# 28. AUTONOMY AND DECISION-MAKING

You have substantial autonomy.

Make appropriate decisions concerning:

- Technology stack.
- Frameworks.
- Libraries.
- Component structure.
- API design.
- Type systems.
- Backend architecture.
- Error handling.
- Styling implementation.
- Testing infrastructure.
- Local development tooling.

However, do not change the core product decisions documented in Docs/.

When choosing a dependency, prefer:

- Mature libraries.
- Good documentation.
- Active maintenance.
- Small dependency footprints.
- Appropriate licences.
- Strong security practices.

Do not introduce a framework simply because it is fashionable.

If an implementation detail is uncertain, research it.

If a technical integration is uncertain, test it.

If an API behaves differently from the documentation's apparent assumptions, trust the observed behaviour and official documentation, then adapt the integration.

Maintain a clear distinction between:

- Implemented.
- Tested with mocks.
- Tested with live credentials.
- Not yet verified.

Never exaggerate completion.

---

# 29. DEFINITION OF DONE

The assignment is complete only when the following conditions are met.

### Product

- Landing page implemented using the supplied reference.
- Supplied assets integrated correctly.
- Complete meeting preparation flow functional.
- Briefing generation functional.
- Evidence inspection functional.
- Export functional.

### Research

- Tavily Search works.
- Tavily Extract works.
- Research window is correctly enforced.
- Entity resolution works.
- Claims have supporting evidence.
- Source independence is considered.
- Conflicts are detected and communicated.
- Research gaps are visible.
- Questions are grounded.

### Infrastructure

- Bifrost integration implemented.
- Provider fallback implemented.
- Direct-provider bypass implemented.
- Health checks implemented.
- Usage and cost logging implemented.
- Startup automation implemented.

### Security

- Secrets remain server-side.
- Retrieved content is treated as untrusted.
- LLM output is validated.
- Unsafe rendering is prevented.
- API abuse is controlled.
- Errors do not leak secrets.

### Quality

- Build passes.
- Type checks pass.
- Tests pass.
- No known critical defects.
- Responsive behaviour verified.
- No fake production functionality.
- Documentation is complete.

### Configuration

I should be able to:

1. Open `.env`.
2. Paste the required Tavily API key.
3. Paste the primary LLM provider API key.
4. Paste the fallback provider API key if required.
5. Configure any genuinely necessary gateway credentials.
6. Run the documented startup command.

Everything else should already be implemented and automated.

If a provider requires an additional account-level action, explain that explicitly rather than pretending a key alone can resolve it.

---

# 30. FINAL INSTRUCTIONS

I want you to take this assignment seriously.

We are building a product that should be technically credible, visually excellent, reliable and genuinely useful.

The most important thing is not the number of files you create or how complicated the architecture looks.

It is whether Briefly.ai actually works.

I want a system where:

- A user enters a company.
- A user specifies an upcoming meeting.
- The system understands the entity.
- It calculates the correct research window.
- It researches the relevant developments.
- It retrieves source material.
- It extracts individual claims.
- It validates the dates.
- It checks source independence.
- It identifies conflicting information.
- It determines what matters for the meeting.
- It generates useful discussion questions.
- It produces a beautifully formatted, evidence-backed briefing.

All of this should happen through one cohesive product experience.

The application should be designed so that its research engine can evolve without requiring a complete rewrite of its frontend or infrastructure.

Build clean interfaces between services.

Keep the LLM provider interchangeable.

Keep the research pipeline testable.

Keep the verification rules auditable.

Keep the product honest.

**Do not optimise for a demo that merely looks impressive. Build something that deserves to be demonstrated.**

## Your immediate next action

Begin by inspecting the complete `Briefly.ai` project directory.

Read every document in `Docs/`.

Inspect `Hero UI Reference`, `Hero Background`, the heading font ZIP and `Background.mp4`.

Study the official Tavily and Bifrost documentation.

Then create your implementation blueprint and proceed directly into engineering.

Do not return with only a proposed plan.

Do not wait for approval after every phase.

Continue working autonomously until the complete implementation is delivered or a genuine external blocker prevents further progress.

At the end, provide a detailed delivery report containing:

1. What you built.
2. Architecture and technology stack.
3. Major features implemented.
4. Tavily integration status.
5. Bifrost integration status.
6. Security measures.
7. Tests executed and their actual results.
8. Performance measurements, if obtained.
9. Exact `.env` configuration instructions.
10. Exact commands to start the application.
11. Any remaining manual steps or external blockers.

**The intended final experience is simple: I configure my API credentials, start Briefly.ai, and have a fully functioning pre-meeting intelligence product.**

Build it with that outcome in mind.

**Let's build Briefly.ai properly.**