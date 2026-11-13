import { config } from './config.js';
import { redact } from './security.js';

export class TavilyError extends Error {
  constructor(kind, status, message) {
    super(message);
    this.kind = kind; // AUTH | RATE_LIMIT | PLAN_LIMIT | TIMEOUT | BAD_REQUEST | UPSTREAM
    this.status = status;
  }
}

function classify(status) {
  if (status === 401 || status === 403) return 'AUTH';
  if (status === 429 || status === 434) return 'RATE_LIMIT';
  if (status === 432 || status === 433) return 'PLAN_LIMIT';
  if (status === 400) return 'BAD_REQUEST';
  return 'UPSTREAM';
}

async function call(path, body, { signal } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), config.tavily.timeoutMs);
  const onAbort = () => ctl.abort();
  signal?.addEventListener('abort', onAbort);
  try {
    const res = await fetch(config.tavily.base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.tavily.key}` },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    if (!res.ok) throw new TavilyError(classify(res.status), res.status, `Tavily ${path} failed (${res.status})`);
    return await res.json();
  } catch (e) {
    if (e instanceof TavilyError) throw e;
    if (e.name === 'AbortError') throw new TavilyError('TIMEOUT', 0, `Tavily ${path} timed out`);
    throw new TavilyError('UPSTREAM', 0, redact(e.message, [config.tavily.key]));
  } finally {
    clearTimeout(t);
    signal?.removeEventListener('abort', onAbort);
  }
}

export function searchCredits(depth) {
  return depth === 'advanced' ? config.tavily.searchAdvancedCredits : config.tavily.searchBasicCredits;
}

/** Search. Date params are discovery aids only; the caller applies strict filtering. */
export async function tavilySearch({ query, depth = 'basic', maxResults = 6, range, exactMatch, signal }) {
  const body = {
    query, search_depth: depth, max_results: maxResults, topic: 'news',
    include_answer: false, include_raw_content: false,
    ...(range || {}),
    ...(exactMatch ? { exact_match: true } : {}),
  };
  const json = await call('/search', body, { signal });
  const results = (json.results || []).map((r) => ({
    url: r.url, title: r.title || '', snippet: r.content || '', score: r.score ?? 0,
    publishedDate: r.published_date || r.publishedDate || null,
  }));
  return { results, credits: searchCredits(depth), raw: json };
}

/** Extract in batches of 20. `results` and `failed_results` are inspected independently. */
export async function tavilyExtract({ urls, query, signal }) {
  const out = { results: [], failed: [], credits: 0 };
  for (let i = 0; i < urls.length; i += 20) {
    const batch = urls.slice(i, i + 20);
    try {
      const json = await call('/extract', {
        urls: batch, extract_depth: 'basic', format: 'text',
        ...(query ? { query, chunks_per_source: 3 } : {}),
      }, { signal });
      for (const r of json.results || []) out.results.push({ url: r.url, text: r.raw_content || '' });
      for (const f of json.failed_results || []) out.failed.push({ url: f.url, error: f.error || 'extract failed' });
      out.credits += Math.ceil((json.results || []).length / 5) * config.tavily.extractCreditsPer5;
    } catch (e) {
      if (e.kind === 'AUTH' || e.kind === 'PLAN_LIMIT') throw e;
      for (const u of batch) out.failed.push({ url: u, error: e.kind || 'error' });
    }
  }
  return out;
}
