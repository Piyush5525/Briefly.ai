import { canonicalUrl, rootDomain } from './security.js';
import { inWindow } from './window.js';

// ---------- Source tiers (per Phase 2: tier is about the source, claim-type aware at use) ----------
const WIRE = ['reuters.com', 'apnews.com', 'bloomberg.com', 'wsj.com', 'ft.com', 'cnbc.com', 'nytimes.com', 'economist.com', 'sec.gov'];
const TRADE = ['techcrunch.com', 'theverge.com', 'axios.com', 'forbes.com', 'businessinsider.com', 'fortune.com', 'wired.com', 'venturebeat.com', 'theinformation.com', 'livemint.com', 'economictimes.indiatimes.com'];
const RELEASE = ['prnewswire.com', 'businesswire.com', 'globenewswire.com', 'accesswire.com'];

export function sourceTier(url, entityDomain) {
  const d = rootDomain(url);
  if (entityDomain && d === rootDomain(`https://${entityDomain}`)) return { tier: 'T1', label: 'Company-owned', owned: true };
  if (/\.(gov|gov\.[a-z]{2})$/.test(d)) return { tier: 'T1', label: 'Regulator / government', owned: false };
  if (WIRE.includes(d)) return { tier: 'T2', label: 'Major news / wire', owned: false };
  if (TRADE.includes(d)) return { tier: 'T3', label: 'Trade / business press', owned: false };
  if (RELEASE.includes(d)) return { tier: 'T4', label: 'Press-release distribution', owned: true, release: true };
  return { tier: 'T5', label: 'Other publication', owned: false };
}

// ---------- Origin clustering (conservative) ----------
const shingles = (t) => {
  const w = t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i < w.length - 4; i++) s.add(w.slice(i, i + 5).join(' '));
  return s;
};
export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let i = 0;
  for (const x of a) if (b.has(x)) i++;
  return i / (a.size + b.size - i);
}

/** Group sources into origin clusters. Same canonical URL, same root domain, or near-duplicate text => same origin. */
export function clusterOrigins(sources) {
  const parent = sources.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a, b) => { parent[find(a)] = find(b); };
  const sh = sources.map((s) => shingles(s.text || s.snippet || ''));
  for (let i = 0; i < sources.length; i++) {
    for (let j = i + 1; j < sources.length; j++) {
      const a = sources[i], b = sources[j];
      if (canonicalUrl(a.url) === canonicalUrl(b.url)) union(i, j);
      else if (a.domain && a.domain === b.domain) union(i, j);
      else if (jaccard(sh[i], sh[j]) > 0.5) union(i, j);
      else if (/(press release|prnewswire|businesswire|globenewswire)/i.test(`${a.title} ${b.title}`) && jaccard(sh[i], sh[j]) > 0.3) union(i, j);
    }
  }
  const ids = {};
  let n = 0;
  return sources.map((_, i) => {
    const r = find(i);
    if (!(r in ids)) ids[r] = `O${++n}`;
    return ids[r];
  });
}

// ---------- Evidence validation ----------
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();

/** Evidence spans must be verbatim substrings of the retrieved text (whitespace/quote-normalised). */
export function validateSpans(spans, text) {
  const hay = norm(text || '');
  const good = (spans || []).filter((s) => s && s.length >= 12 && hay.includes(norm(s)));
  return good;
}

// ---------- Temporal classification ----------
export function classifyTemporal(claim, source, win) {
  const ev = claim.eventDate;
  const pub = source.publishedDate;
  if (ev && ev !== 'unknown') {
    return inWindow(ev, win)
      ? { status: 'IN_WINDOW', basis: 'event' }
      : { status: Date.parse(ev) < Date.parse(win.startUtc) ? 'BACKGROUND' : 'OUT_OF_WINDOW', basis: 'event' };
  }
  if (pub && inWindow(pub, win)) {
    return claim.eventTiming === 'recent' ? { status: 'IN_WINDOW', basis: 'publication' } : { status: 'DATE_UNCERTAIN', basis: 'publication-only' };
  }
  return { status: 'DATE_UNCERTAIN', basis: 'none' };
}

// ---------- Conflict detection (numeric attribute disagreement on same attribute) ----------
export function detectConflicts(claims) {
  const groups = new Map();
  for (const c of claims) {
    if (c.claimType !== 'metric' || !c.attribute || c.value == null) continue;
    const key = `${c.category}|${c.attribute.toLowerCase().trim()}`;
    (groups.get(key) || groups.set(key, []).get(key)).push(c);
  }
  const conflicts = [];
  for (const [key, list] of groups) {
    const origins = new Set(list.map((c) => c.originIds.join()));
    const values = new Set(list.map((c) => String(c.value).toLowerCase().replace(/[\s,]/g, '')));
    if (list.length > 1 && values.size > 1 && origins.size > 1) {
      conflicts.push({ attribute: key.split('|')[1], claimIds: list.map((c) => c.id), values: [...values] });
    }
  }
  return conflicts;
}

// ---------- Status assignment (deterministic) ----------
export function assignStatus(claim, ctx) {
  const reasons = [];
  if (!claim.validSpans.length) return { status: 'UNVERIFIED', reasons: ['NO_VALID_EVIDENCE_SPAN'] };
  if (claim.entityMatch === 'mismatch') return { status: 'UNVERIFIED', reasons: ['ENTITY_MISMATCH'] };
  if (ctx.conflictedIds.has(claim.id)) return { status: 'CONFLICTING', reasons: ['SOURCES_DISAGREE_ON_ATTRIBUTE'] };
  const srcs = claim.sourceIds.map((id) => ctx.sourcesById[id]).filter(Boolean);
  const independent = new Set(srcs.filter((s) => !s.tier.owned).map((s) => s.originId));
  const ownedOnly = srcs.length > 0 && srcs.every((s) => s.tier.owned);
  // Plans, evaluations and anonymous-source reports can never be established as fact.
  const neverFact = ['planned', 'evaluative', 'anonymous'].includes(claim.claimType);
  const statementLike = neverFact || claim.claimType === 'statement';

  if (neverFact || (statementLike && independent.size < 2)) {
    reasons.push(`CLAIM_TYPE_${claim.claimType.toUpperCase()}`);
    return ownedOnly ? { status: 'COMPANY-STATED', reasons } : { status: 'SINGLE SOURCE', reasons };
  }
  if (independent.size >= 2) return { status: 'VERIFIED', reasons: [`INDEPENDENT_ORIGINS_${independent.size}`] };
  if (ownedOnly) return { status: 'COMPANY-STATED', reasons: ['ONLY_COMPANY_OR_RELEASE_SOURCES'] };
  if (independent.size === 1) {
    const only = srcs.find((s) => !s.tier.owned);
    reasons.push('ONE_INDEPENDENT_ORIGIN');
    if (['T1', 'T2'].includes(only.tier.tier) && claim.claimType === 'action' && srcs.some((s) => s.tier.owned)) {
      return { status: 'VERIFIED', reasons: ['TIER_1_2_PLUS_COMPANY_CONFIRMATION'] };
    }
    return { status: 'SINGLE SOURCE', reasons };
  }
  return { status: 'UNVERIFIED', reasons: ['NO_INDEPENDENT_SOURCE'] };
}

export const STATUS_EXPLAIN = {
  VERIFIED: 'Two or more independent origins support this claim.',
  'COMPANY-STATED': 'Supported by the organisation’s own announcement or a press release, with no independent confirmation yet.',
  'SINGLE SOURCE': 'Reported by one independent origin only.',
  CONFLICTING: 'Credible sources disagree on a key detail. Both versions are preserved.',
  UNVERIFIED: 'Insufficient evidence to present this as fact.',
};

// ---------- Ranking (deterministic; the LLM never ranks) ----------
export function rankClaims(claims, win, categoryWeights, statusWeights, now = Date.now()) {
  const seen = new Map();
  return claims
    .map((c) => {
      const ref = Date.parse(c.eventDate && c.eventDate !== 'unknown' ? c.eventDate : c.publishedDate || win.endUtc);
      const ageDays = Math.max(0, (Date.parse(win.endUtc) - ref) / 864e5);
      const recency = Math.exp(-ageDays / 20);
      const n = (seen.get(c.category) || 0) + 1;
      seen.set(c.category, n);
      const novelty = 1 / n;
      const rank = (categoryWeights[c.category] ?? 1) * recency * novelty * (statusWeights[c.status] ?? 0);
      return { ...c, rank };
    })
    .sort((a, b) => b.rank - a.rank);
}
