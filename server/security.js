// Prompt-injection heuristics (best effort, not a guarantee), redaction, rate limiting, URL validation.
const INJECTION_PATTERNS = [
  /ignore (all )?(previous|prior|above) (instructions|prompts?)/i,
  /disregard (the )?(system|previous|above)/i,
  /you are (now )?(an? )?(ai|assistant|chatgpt|developer mode)/i,
  /system prompt/i,
  /(reveal|print|output) (your )?(instructions|api key|secrets?)/i,
  /<\s*\/?\s*(system|assistant|instructions?)\s*>/i,
  /do not (tell|inform) the user/i,
  /new instructions?:/i,
];

export function detectInjection(text = '') {
  const hits = INJECTION_PATTERNS.filter((r) => r.test(text)).map((r) => r.source);
  return { suspicious: hits.length > 0, hits };
}

export function redact(str, secrets = []) {
  let s = String(str ?? '');
  for (const k of secrets) if (k && k.length > 6) s = s.split(k).join('[redacted]');
  return s.replace(/(sk-[A-Za-z0-9_-]{10,}|tvly-[A-Za-z0-9_-]{8,}|Bearer\s+[A-Za-z0-9._-]{10,})/g, '[redacted]');
}

export function isSafeHttpUrl(u) {
  try {
    const url = new URL(u);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    return !/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0|\[::1\])/.test(url.hostname);
  } catch {
    return false;
  }
}

export function canonicalUrl(u) {
  try {
    const url = new URL(u);
    for (const k of [...url.searchParams.keys()]) if (/^(utm_|fbclid|gclid|ref)/i.test(k)) url.searchParams.delete(k);
    return (url.hostname.replace(/^www\./, '') + url.pathname.replace(/\/$/, '') + url.search).toLowerCase();
  } catch {
    return String(u);
  }
}

export function rootDomain(u) {
  try {
    const parts = new URL(u).hostname.replace(/^www\./, '').split('.');
    if (parts.length <= 2) return parts.join('.');
    const sld = parts[parts.length - 2];
    return ['co', 'com', 'org', 'gov', 'ac'].includes(sld) && parts[parts.length - 1].length === 2
      ? parts.slice(-3).join('.') : parts.slice(-2).join('.');
  } catch {
    return '';
  }
}

export function createRateLimiter({ perMinute, enabled }) {
  const hits = new Map();
  return (req, res, next) => {
    if (!enabled) return next();
    const now = Date.now();
    const arr = (hits.get(req.ip) || []).filter((t) => now - t < 60000);
    if (arr.length >= perMinute) {
      return res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a minute.' } });
    }
    arr.push(now);
    hits.set(req.ip, arr);
    next();
  };
}

export function securityHeaders(_req, res, next) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; media-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
}
