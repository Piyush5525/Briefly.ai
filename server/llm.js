import { config } from './config.js';
import { redact } from './security.js';

/**
 * Model provider interface. Route order:
 *  1. Bifrost (OpenAI-compatible endpoint; Bifrost owns the single retry + provider fallback)
 *  2. Direct Anthropic bypass (if Bifrost is down/disabled)
 *  3. Direct fallback provider (OpenAI-compatible) if configured
 * `meta.route` always reports what actually served the request.
 */
export class LlmError extends Error {}

const secrets = () => [config.llm.anthropicKey, config.llm.fallbackKey, config.llm.bifrostKey];

async function post(url, headers, body, timeoutMs) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal: ctl.signal });
    if (!res.ok) throw new LlmError(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError') throw new LlmError('timeout');
    throw new LlmError(redact(e.message, secrets()));
  } finally {
    clearTimeout(t);
  }
}

const openAiText = (j) => j.choices?.[0]?.message?.content ?? '';
const usageOf = (j) => ({ in: j.usage?.prompt_tokens ?? j.usage?.input_tokens ?? 0, out: j.usage?.completion_tokens ?? j.usage?.output_tokens ?? 0 });

async function viaBifrost({ model, system, user }) {
  const l = config.llm;
  const fallbacks = l.fallbackProvider && l.fallbackKey && l.fallbackModel ? [`${l.fallbackProvider}/${l.fallbackModel}`] : undefined;
  const j = await post(`${l.bifrostUrl}/v1/chat/completions`, l.bifrostKey ? { Authorization: `Bearer ${l.bifrostKey}` } : {}, {
    model: model.includes('/') ? model : `anthropic/${model}`,
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    temperature: 0, max_tokens: 2500,
    ...(fallbacks ? { fallbacks } : {}),
  }, l.providerTimeoutMs);
  return { text: openAiText(j), usage: usageOf(j), served: j.model || model, route: 'bifrost' };
}

async function viaCompat({ model, system, user }) {
  const c = config.llm.compat;
  const j = await post(`${c.baseUrl}/chat/completions`, { Authorization: `Bearer ${c.key}` }, {
    model: c.model || model, temperature: 0,
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
  }, config.llm.providerTimeoutMs);
  return { text: openAiText(j), usage: usageOf(j), served: j.model || c.model || model, route: 'direct-compat' };
}

async function viaAnthropic({ model, system, user }) {
  const j = await post('https://api.anthropic.com/v1/messages', { 'x-api-key': config.llm.anthropicKey, 'anthropic-version': '2023-06-01' }, {
    model: model.replace(/^anthropic\//, ''), system, max_tokens: 2500, temperature: 0,
    messages: [{ role: 'user', content: user }],
  }, config.llm.providerTimeoutMs);
  return { text: j.content?.map((c) => c.text || '').join('') ?? '', usage: usageOf(j), served: j.model || model, route: 'direct-anthropic' };
}

async function viaFallback({ system, user }) {
  const l = config.llm;
  if (l.fallbackProvider === 'anthropic') return viaAnthropic({ model: l.fallbackModel, system, user });
  const j = await post('https://api.openai.com/v1/chat/completions', { Authorization: `Bearer ${l.fallbackKey}` }, {
    model: l.fallbackModel, temperature: 0,
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    response_format: { type: 'json_object' },
  }, l.providerTimeoutMs);
  return { text: openAiText(j), usage: usageOf(j), served: j.model || l.fallbackModel, route: 'direct-fallback' };
}

export function extractJson(text) {
  const s = text.indexOf('{');
  const e = text.lastIndexOf('}');
  if (s < 0 || e < s) throw new LlmError('no JSON in model output');
  return JSON.parse(text.slice(s, e + 1));
}

/** Calls the model for a bounded, schema-defined task. Throws if output fails the schema. */
export async function complete({ task, system, user, schema, trace }) {
  const l = config.llm;
  const model = l.models[task];
  const attempts = [];
  const routes = [];
  if (l.bifrostEnabled) routes.push(viaBifrost);
  if (l.compat.key && l.compat.baseUrl) routes.push(viaCompat);
  if (l.anthropicKey) routes.push(viaAnthropic);
  if (l.fallbackKey && l.fallbackModel) routes.push(viaFallback);
  if (!routes.length) throw new LlmError('No LLM route configured (set LLM_BASE_URL + LLM_API_KEY, or ANTHROPIC_API_KEY, or enable Bifrost).');

  for (const route of routes) {
    try {
      const r = await route({ model, system, user });
      const data = schema.parse(extractJson(r.text)); // reject malformed output
      trace?.llm({ task, ...r, attempts });
      return { data, meta: { route: r.route, model: r.served, usage: r.usage, failedRoutes: attempts } };
    } catch (e) {
      attempts.push({ route: route.name, error: redact(e.message, secrets()).slice(0, 120) });
    }
  }
  throw new LlmError(`All LLM routes failed for ${task}`);
}

export async function gatewayHealth() {
  const l = config.llm;
  if (!l.bifrostEnabled) return { enabled: false, status: 'disabled' };
  try {
    const ctl = new AbortController();
    setTimeout(() => ctl.abort(), 2500);
    const r = await fetch(`${l.bifrostUrl}/health`, { signal: ctl.signal });
    return { enabled: true, status: r.ok ? 'up' : 'unhealthy' };
  } catch {
    return { enabled: true, status: 'unreachable' };
  }
}
