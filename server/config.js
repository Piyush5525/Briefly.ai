import 'dotenv/config';

const num = (v, d) => (v === undefined || v === '' || Number.isNaN(Number(v)) ? d : Number(v));
const bool = (v, d) => (v === undefined || v === '' ? d : String(v).toLowerCase() === 'true');

const compatModel = process.env.LLM_MODEL || '';
const DEF_SMALL = compatModel || 'claude-haiku-5-5';
const DEF_BIG = compatModel || 'claude-sonnet-5-5';

export const config = {
  env: process.env.APP_ENV || 'development',
  host: process.env.APP_HOST || '127.0.0.1',
  port: num(process.env.APP_PORT, 8787),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  tavily: {
    key: process.env.TAVILY_API_KEY || '',
    base: 'https://api.tavily.com',
    // Credit costs follow Tavily's documented API credits page; kept configurable, not guaranteed.
    searchBasicCredits: num(process.env.TAVILY_SEARCH_BASIC_CREDITS, 1),
    searchAdvancedCredits: num(process.env.TAVILY_SEARCH_ADVANCED_CREDITS, 2),
    extractCreditsPer5: num(process.env.TAVILY_EXTRACT_CREDITS_PER_5, 1),
    timeoutMs: num(process.env.TAVILY_TIMEOUT_MS, 20000),
  },
  llm: {
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',
    // Any OpenAI-compatible provider (Gemini, Groq, OpenRouter free tiers...).
    compat: { baseUrl: (process.env.LLM_BASE_URL || '').replace(/\/$/, ''), key: process.env.LLM_API_KEY || '', model: process.env.LLM_MODEL || '' },
    fallbackProvider: process.env.FALLBACK_PROVIDER || '', // 'openai' | 'anthropic' | ''
    fallbackKey: process.env.FALLBACK_API_KEY || '',
    fallbackModel: process.env.FALLBACK_MODEL || '',
    bifrostUrl: (process.env.BIFROST_BASE_URL || 'http://localhost:8080').replace(/\/$/, ''),
    bifrostKey: process.env.BIFROST_API_KEY || '',
    bifrostEnabled: bool(process.env.BIFROST_ENABLED, true),
    bifrostMaxRetries: Math.min(num(process.env.BIFROST_MAX_RETRIES, 1), 1),
    providerTimeoutMs: num(process.env.LLM_PROVIDER_TIMEOUT_MS, 25000),
    models: {
      entity: process.env.MODEL_ENTITY_RESOLUTION || DEF_SMALL,
      planning: process.env.MODEL_QUERY_PLANNING || DEF_SMALL,
      claims: process.env.MODEL_CLAIM_EXTRACTION || DEF_SMALL,
      semantic: process.env.MODEL_SEMANTIC_VERIFICATION || DEF_BIG,
      synthesis: process.env.MODEL_SYNTHESIS || DEF_BIG,
      questions: process.env.MODEL_QUESTION_GENERATION || DEF_BIG,
    },
  },
  limits: {
    maxCredits: num(process.env.MAX_TAVILY_CREDITS_PER_BRIEF, 30),
    maxGapRounds: Math.min(num(process.env.MAX_GAP_ROUNDS, 2), 2),
    maxResearchSeconds: num(process.env.MAX_RESEARCH_SECONDS, 60),
    hardDeadlineSeconds: num(process.env.HARD_DEADLINE_SECONDS, 75),
    maxAttendees: num(process.env.MAX_ATTENDEES, 3),
    dailyCredits: num(process.env.DAILY_CREDIT_LIMIT, 600),
    maxBody: process.env.MAX_REQUEST_SIZE || '32kb',
    rateLimitEnabled: bool(process.env.RATE_LIMIT_ENABLED, true),
    ratePerMinute: num(process.env.RATE_LIMIT_PER_MINUTE, 6),
  },
  // Starting heuristics from the Phase 2 dossier (configurable, not measured).
  statusWeights: { VERIFIED: 1.0, 'COMPANY-STATED': 0.85, 'SINGLE SOURCE': 0.7, CONFLICTING: 0.75, UNVERIFIED: 0 },
};

export function credentialReport() {
  const l = config.llm;
  return {
    tavily: config.tavily.key ? 'configured' : 'missing',
    primaryLlm: l.compat.key || l.anthropicKey ? 'configured' : 'missing',
    fallbackLlm: l.fallbackKey ? 'configured' : 'not configured',
    bifrost: l.bifrostEnabled ? 'enabled' : 'disabled (direct provider)',
  };
}
