import React, { useEffect, useState } from 'react';

const chipClass = (s) => ({ VERIFIED: 'chip-verified', 'COMPANY-STATED': 'chip-company', 'SINGLE SOURCE': 'chip-single', CONFLICTING: 'chip-conflict', UNVERIFIED: 'chip-unv' }[s] || '');
export const Chip = ({ s }) => <span className={`chip ${chipClass(s)}`}>{s}</span>;

const fmtDate = (d) => (d && d !== 'unknown' ? new Date(d.length === 10 ? `${d}T12:00:00Z` : d).toLocaleDateString(undefined, { dateStyle: 'medium', timeZone: 'UTC' }) : 'date unclear');

function Cites({ ids, brief }) {
  const nums = [...new Set((ids || []).flatMap((id) => brief.claimIndex[id]?.sourceIds || []))].map((sid) => brief.sources.find((s) => s.id === sid)?.n).filter(Boolean).sort((a, b) => a - b);
  return nums.length ? <sup className="cites">{nums.map((n) => <a key={n} href={`#src-${n}`}>[{n}]</a>)}</sup> : null;
}

/** Splits text around evidence spans using React nodes only (no HTML injection). */
function Highlighted({ text, spans }) {
  const lower = text.toLowerCase();
  const ranges = spans.map((s) => { const i = lower.indexOf(s.toLowerCase()); return i < 0 ? null : [i, i + s.length]; }).filter(Boolean).sort((a, b) => a[0] - b[0]);
  const out = [];
  let pos = 0;
  ranges.forEach(([a, b], k) => {
    if (a < pos) return;
    out.push(text.slice(pos, a), <mark key={k}>{text.slice(a, b)}</mark>);
    pos = b;
  });
  out.push(text.slice(pos));
  return <>{out}</>;
}

function Drawer({ claim, brief, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  if (!claim) return null;
  return (
    <aside className="drawer" role="dialog" aria-label="Evidence" aria-modal="false">
      <button className="x" onClick={onClose} aria-label="Close evidence">×</button>
      <Chip s={claim.status} />
      <h3>{claim.text}</h3>
      <p className="muted">{claim.statusExplanation}</p>
      <dl>
        <dt>Category</dt><dd>{claim.category}</dd>
        <dt>Event date</dt><dd>{fmtDate(claim.eventDate)}</dd>
        <dt>Claim type</dt><dd>{claim.claimType}</dd>
        <dt>Independent origins</dt><dd>{claim.independentOrigins}</dd>
        <dt>Reasons</dt><dd>{(claim.reasons || []).join(', ') || '—'}</dd>
      </dl>
      {claim.evidence.map((ev) => {
        const s = brief.sources.find((x) => x.id === ev.sourceId);
        if (!s) return null;
        return (
          <div className="evid" key={ev.sourceId}>
            <div className="evid-h"><b>[{s.n}] {s.domain}</b> <span className="chip chip-tier">{s.tier} · {s.tierLabel}</span></div>
            <small>{fmtDate(s.publishedDate)} · origin {s.originId} · {s.extraction === 'ok' ? 'full text read' : 'snippet only'}</small>
            <blockquote><Highlighted text={s.excerpt} spans={ev.spans} /></blockquote>
            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">Open original article ↗</a>
          </div>
        );
      })}
    </aside>
  );
}

export function toMarkdown(b) {
  const L = [];
  L.push(`# Briefing: ${b.entity.name}`, '', `Meeting: ${b.meeting.date} ${b.meeting.time} (${b.meeting.timezone}) · ${b.meeting.type}`, `Research window: ${b.window.startLocalDate} to ${b.window.endLocalDate}`, `Generated: ${b.generatedAt}`, '');
  L.push('## What changed');
  if (!b.developments.length) L.push('_No verified developments were identified in the research window._');
  b.developments.forEach((d) => L.push(`- **${d.headline}** [${d.status}] (${fmtDate(d.eventDate)}, ${d.category}) — ${d.summary}`));
  L.push('', '## Why it matters');
  b.why.forEach((w) => L.push(`- ${w.text}`));
  L.push('', '## Questions');
  b.questions.forEach((q) => L.push(`- ${q.text}`));
  L.push('', '## Gaps and cautions');
  if (b.gaps.categories.length) L.push(`- No verified developments found for: ${b.gaps.categories.join(', ')}`);
  b.gaps.conflicts.forEach((c) => L.push(`- Conflict on ${c.attribute}: ${c.values.join(' vs ')}`));
  L.push('', '## Sources');
  b.sources.forEach((s) => L.push(`${s.n}. ${s.domain} (${s.tier}) ${s.publishedDate || 'undated'} — ${s.url}`));
  return L.join('\n');
}

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function Report({ brief: b, onNew }) {
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(false);
  const [more, setMore] = useState(false);
  const publicJson = () => { const { receipt, ...rest } = b; return JSON.stringify(rest, null, 2); };

  const copy = async () => { try { await navigator.clipboard.writeText(toMarkdown(b)); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { download('briefing.md', toMarkdown(b), 'text/markdown'); } };
  const slug = b.entity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const gapCats = b.gaps.categories;

  return (
    <div className={`report-wrap ${open ? 'with-drawer' : ''}`}>
      <div className="page report">
        <div className="toolbar no-print">
          <button className="link-back" onClick={onNew}>← New briefing</button>
          <div className="tools">
            <button className="btn btn-ghost" onClick={() => window.print()}>Print / PDF</button>
            <button className="btn btn-ghost" onClick={copy}>{copied ? 'Copied ✓' : 'Copy Markdown'}</button>
            <button className="btn btn-ghost" onClick={() => download(`briefing-${slug}.json`, publicJson(), 'application/json')}>Download JSON</button>
          </div>
        </div>

        <article className="doc">
          <header className="doc-head">
            <p className="eyebrow-sm">Pre-meeting briefing</p>
            <h1>{b.entity.name}</h1>
            <p className="meta">
              Meeting {b.meeting.date} {b.meeting.time} · {b.meeting.timezone} · {b.meeting.type}<br />
              Research window {b.window.startLocalDate} → {b.window.endLocalDate} · As of {new Date(b.window.asOf).toLocaleString()} · Generated {new Date(b.generatedAt).toLocaleString()}
            </p>
            {b.attendees.length > 0 && (
              <ul className="att-strip">
                {b.attendees.map((a) => (
                  <li key={a.name}><b>{a.name}</b>{(a.title || a.organization) && <small> {a.title}{a.title && a.organization ? ', ' : ''}{a.organization}</small>}
                    <p>{a.line ? <button className="linkish" onClick={() => setOpen(b.claimIndex[a.line.claimId])}>{a.line.text}</button> : 'No recent public professional developments found.'}</p></li>
                ))}
              </ul>
            )}
            {b.gaps.identity && <p className="note">{b.gaps.identity}</p>}
            {b.gaps.windowNote && <p className="note">{b.gaps.windowNote}</p>}
          </header>

          <section>
            <h2>What changed</h2>
            {b.quiet ? (
              <div className="quiet">
                <b>A quiet period.</b> No verified developments were identified in the research window{gapCats.length ? ` for ${gapCats.slice(0, 4).join(', ')}${gapCats.length > 4 ? ' and others' : ''}` : ''}. This is a finding, not a failure.
              </div>
            ) : (
              <ol className="devs">
                {b.developments.map((d) => (
                  <li key={d.id}>
                    <button className="dev" onClick={() => setOpen(d)} aria-label={`Open evidence for ${d.headline}`}>
                      <div className="dev-top"><Chip s={d.status} /><span>{d.category}</span><span>{fmtDate(d.eventDate)}</span></div>
                      <h3>{d.headline}<Cites ids={[d.id]} brief={b} /></h3>
                      <p>{d.summary}</p>
                    </button>
                  </li>
                ))}
              </ol>
            )}
            {b.moreFindings.length > 0 && (
              <>
                <button className="linkish no-print" onClick={() => setMore(!more)}>{more ? 'Hide' : 'Show'} {b.moreFindings.length} additional findings</button>
                {more && <ul className="more">{b.moreFindings.map((d) => <li key={d.id}><Chip s={d.status} /> <button className="linkish" onClick={() => setOpen(d)}>{d.text}</button></li>)}</ul>}
              </>
            )}
          </section>

          {b.why.length > 0 && (
            <section>
              <h2>Why it matters for this meeting</h2>
              <ul>{b.why.map((w, i) => <li key={i}>{w.text}<Cites ids={w.claimIds} brief={b} /></li>)}</ul>
            </section>
          )}

          <section>
            <h2>Questions and discussion points</h2>
            <ol>{b.questions.map((q, i) => <li key={i}><span className="qkind">{q.kind}</span> {q.text}<Cites ids={q.claimIds} brief={b} /></li>)}</ol>
          </section>

          <section>
            <h2>Gaps and cautions</h2>
            <ul>
              {gapCats.length > 0 && <li>Searched without verified findings: {gapCats.join(', ')}.</li>}
              {b.gaps.conflicts.map((c, i) => <li key={i}><b>Conflict on {c.attribute}:</b> {c.values.join(' vs ')}. Both versions are preserved in the evidence.</li>)}
              {b.gaps.unverified > 0 && <li>{b.gaps.unverified} claim(s) were excluded as unverified.</li>}
              {b.gaps.uncertainDates > 0 && <li>{b.gaps.uncertainDates} claim(s) had unclear event dates and are not shown as recent.</li>}
              {b.gaps.degradations.map((d, i) => <li key={i}>{d}</li>)}
              <li>Research window is {b.window.startLocalDate} to {b.window.endLocalDate}. Anything outside it is not reported as recent.</li>
            </ul>
          </section>

          {b.background.length > 0 && (
            <section>
              <h2>Background <small>(outside the research window)</small></h2>
              <ul>{b.background.map((c) => <li key={c.id}><span className="chip chip-tier">BACKGROUND</span> {c.text} <small>({fmtDate(c.eventDate)})</small></li>)}</ul>
            </section>
          )}

          <section>
            <h2>Sources</h2>
            <ol className="sources">
              {b.sources.map((s) => (
                <li id={`src-${s.n}`} key={s.id}>
                  <b>{s.domain}</b> <span className="chip chip-tier">{s.tier}</span> <small>{fmtDate(s.publishedDate)}</small><br />
                  <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">{s.title || s.url}</a>
                </li>
              ))}
            </ol>
          </section>

          <footer className="receipt no-print">
            <details>
              <summary>Execution receipt</summary>
              <p>
                {b.receipt.credits} Tavily credits · {b.receipt.searches} searches · {b.receipt.sourcesDiscovered} sources found, {b.receipt.sourcesExtracted} read in full ({b.receipt.failedExtractions} failed) · {b.receipt.claims} claims, {b.receipt.verified} verified · {b.receipt.gapRounds} gap rounds · stop: {b.receipt.stopReason} · {(b.receipt.latencyMs / 1000).toFixed(1)}s<br />
                LLM: {b.receipt.llm.calls} calls via {b.receipt.llm.routes.join(', ') || 'n/a'} · {b.receipt.llm.models.join(', ')} · {b.receipt.llm.tokensIn}/{b.receipt.llm.tokensOut} tokens · fallback used: {String(b.receipt.llm.fallbackUsed)} · suspicious sources excluded: {b.receipt.suspiciousSourcesExcluded}
              </p>
            </details>
          </footer>
        </article>
      </div>
      <Drawer claim={open} brief={b} onClose={() => setOpen(null)} />
    </div>
  );
}
