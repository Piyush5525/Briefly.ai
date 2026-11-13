import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config, credentialReport } from './config.js';
import { InputSchema, runBrief, resolveEntity } from './pipeline.js';
import { gatewayHealth } from './llm.js';
import { createRateLimiter, securityHeaders, redact } from './security.js';
import { computeWindow, assertTimezone } from './window.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');

app.disable('x-powered-by');
app.use(securityHeaders);
app.use(express.json({ limit: config.limits.maxBody }));

// CORS: only the configured frontend origin (dev). Production serves the UI same-origin.
app.use((req, res, next) => {
  if (req.headers.origin === config.frontendUrl) {
    res.setHeader('Access-Control-Allow-Origin', config.frontendUrl);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const limiter = createRateLimiter({ perMinute: config.limits.ratePerMinute, enabled: config.limits.rateLimitEnabled });
let dayKey = new Date().toISOString().slice(0, 10);
let dayCredits = 0;

const apiError = (res, status, code, message, extra = {}) => res.status(status).json({ error: { code, message, ...extra } });

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, credentials: credentialReport(), gateway: await gatewayHealth(), limits: { maxCredits: config.limits.maxCredits, maxGapRounds: config.limits.maxGapRounds } });
});

app.post('/api/window', (req, res) => {
  const { meetingDate, meetingTime, timezone } = req.body || {};
  if (!assertTimezone(timezone)) return apiError(res, 400, 'INVALID_TIMEZONE', 'Unknown timezone.');
  try { res.json(computeWindow({ meetingDate, meetingTime, timezone })); }
  catch (e) { apiError(res, 400, e.message, 'Invalid meeting date or time.'); }
});

function requireKeys(res) {
  if (!config.tavily.key) { apiError(res, 503, 'TAVILY_KEY_MISSING', 'TAVILY_API_KEY is not set in .env.'); return false; }
  if (!config.llm.anthropicKey && !config.llm.compat.key && !config.llm.bifrostEnabled && !config.llm.fallbackKey) { apiError(res, 503, 'LLM_KEY_MISSING', 'No LLM key configured in .env.'); return false; }
  return true;
}

app.post('/api/resolve', limiter, async (req, res) => {
  const parsed = InputSchema.shape.entity.safeParse(req.body?.entity);
  if (!parsed.success) return apiError(res, 400, 'INVALID_INPUT', 'Please check the entity details.');
  if (!requireKeys(res)) return;
  try { res.json(await resolveEntity(parsed.data)); }
  catch (e) { apiError(res, 502, 'RESOLUTION_FAILED', redact(e.message, [config.tavily.key])); }
});

// Streaming run via Server-Sent Events over POST (consumed with fetch streams).
app.post('/api/brief', limiter, async (req, res) => {
  const parsed = InputSchema.safeParse(req.body);
  if (!parsed.success) return apiError(res, 400, 'INVALID_INPUT', parsed.error.issues[0]?.message || 'Invalid input.');
  if (!requireKeys(res)) return;
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayKey) { dayKey = today; dayCredits = 0; }
  if (dayCredits >= config.limits.dailyCredits) return apiError(res, 429, 'DAILY_LIMIT', 'The daily research credit limit has been reached.');

  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  const ctl = new AbortController();
  res.on('close', () => ctl.abort());
  const send = (event, data) => { if (!res.writableEnded) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); };
  const hard = setTimeout(() => ctl.abort(), config.limits.hardDeadlineSeconds * 1000);
  try {
    const brief = await runBrief(parsed.data, send, { signal: ctl.signal });
    dayCredits += brief.receipt.credits;
  } catch (e) {
    const known = ['ENTITY_AMBIGUOUS', 'TOTAL_RETRIEVAL_FAILURE', 'TAVILY_AUTH', 'TAVILY_PLAN_LIMIT', 'CANCELLED', 'INVALID_TIMEZONE'];
    const code = e.code || e.message;
    send('run.failed', {
      code: known.includes(code) ? code : 'RUN_FAILED',
      message: known.includes(code) || e.code ? redact(e.message, [config.tavily.key, config.llm.anthropicKey, config.llm.compat.key]) : 'The briefing could not be completed. Nothing was fabricated; please try again.',
      candidates: e.candidates,
    });
    if (config.env !== 'production') console.error('[run.failed]', redact(e.stack || e.message, [config.tavily.key, config.llm.anthropicKey, config.llm.fallbackKey, config.llm.bifrostKey]));
  } finally {
    clearTimeout(hard);
    res.end();
  }
});

if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, _req, res, _next) => apiError(res, err.status || 500, 'SERVER_ERROR', 'Request could not be processed.'));

if (process.env.VITEST === undefined) {
  app.listen(config.port, config.host, () => {
    console.log(`Briefly.ai API on http://${config.host}:${config.port}`);
    const c = credentialReport();
    if (c.tavily === 'missing') console.warn('! TAVILY_API_KEY missing - add it to .env');
    if (c.primaryLlm === 'missing' && !config.llm.bifrostEnabled) console.warn('! ANTHROPIC_API_KEY missing - add it to .env');
  });
}
export { app };
