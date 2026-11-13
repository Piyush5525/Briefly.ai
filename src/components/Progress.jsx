import React from 'react';

// Every row is rendered from an actual backend event; nothing is simulated.
const LABEL = {
  'run.started': (d) => `Research window set: ${d.window.startLocalDate} → ${d.window.endLocalDate}`,
  'entity.resolved': (d) => `Identity ${d.status.toLowerCase()}: ${d.entity.name}${d.entity.domain ? ` (${d.entity.domain})` : ''}`,
  'research.planned': (d) => `Planned ${d.categories.length} research categories${d.dynamicQueries ? ` + ${d.dynamicQueries} tailored queries` : ''}`,
  'search.started': (d) => `Searching: ${d.category}${d.kind === 'attendee' ? ' (attendee)' : ''}`,
  'search.completed': (d) => `${d.category}: ${d.error ? `search failed (${d.error})` : `${d.found} results, ${d.kept} in window`}`,
  'extract.started': (d) => `Reading ${d.urls} selected sources`,
  'extract.completed': (d) => `Read ${d.ok} sources${d.failed ? `, ${d.failed} could not be read` : ''}`,
  'claims.extracted': (d) => `Extracted claims so far: ${d.total}`,
  'verification.completed': (d) => `Verified ${d.claims} claims, ${d.conflicts} conflicts detected`,
  'gap.round_started': (d) => `Gap round ${d.round}: ${d.categories.join(', ')}`,
  'synthesis.started': () => 'Preparing the briefing',
};

export default function Progress({ events, onCancel, failed, onRetry, onBack }) {
  return (
    <div className="page narrow">
      <div className="panel">
        <h2>{failed ? 'We couldn’t finish this briefing' : 'Researching…'}</h2>
        {failed ? (
          <>
            <p className="err banner" role="alert">{failed}</p>
            <p className="muted">Nothing was fabricated. Your inputs are preserved.</p>
            <div className="cta-row"><button className="btn btn-dark" onClick={onRetry}>Edit and retry</button><button className="btn btn-ghost" onClick={onBack}>Home</button></div>
          </>
        ) : <p className="muted">Live from the research pipeline. Steps appear as they actually happen.</p>}
        <ol className="timeline" aria-live="polite">
          {events.filter((e) => LABEL[e.type]).map((e, i, arr) => (
            <li key={i} className={i === arr.length - 1 && !failed ? 'active' : 'done'}>
              <span className="dot" />{LABEL[e.type](e.data)}
            </li>
          ))}
        </ol>
        {!failed && <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
