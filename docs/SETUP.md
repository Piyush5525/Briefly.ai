# Briefly.ai setup

1. `npm install`
2. Edit `.env`: set `TAVILY_API_KEY` and `ANTHROPIC_API_KEY` (optional `FALLBACK_*`).
3. `./start.ps1` (Windows) or `npm run dev`, then open http://localhost:5173 (API on :8787).
4. Production: `npm start` serves the built UI and API on :8787.

## Bifrost
Default `BIFROST_ENABLED=false` (direct Anthropic). To use the gateway: run it (`npx -y @maximhq/bifrost`, port 8080), add your provider key in its UI, set `BIFROST_ENABLED=true`. If it is unreachable the app falls back to direct providers and the receipt reports the route actually used. Semantic caching is never enabled.

## Status
- Tested with mocks/golden replay (`npm test`): window math, DST, spans, origin clustering, status rules, injection exclusion, citation validation, total-failure state.
- NOT yet validated live against Tavily, Anthropic or Bifrost (no keys supplied). Model IDs in `.env.example` must be checked against provider docs.
- Not built yet: record/replay to disk, evaluation cases 1-24 beyond the golden test, semantic contradiction LLM check, Bifrost auto-install, the full Docs set from the directive.
