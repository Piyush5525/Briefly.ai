import React, { useRef, useState, useEffect } from 'react';
import Landing, { Logo } from './components/Landing.jsx';
import MeetingForm from './components/MeetingForm.jsx';
import Progress from './components/Progress.jsx';
import Report from './components/Report.jsx';
import { streamBrief } from './api.js';

const KEY = 'briefly:last-brief';
const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; } };

export default function App() {
  const [view, setView] = useState('landing');
  const [form, setForm] = useState(null);
  const [events, setEvents] = useState([]);
  const [brief, setBrief] = useState(load);
  const [failed, setFailed] = useState('');
  const [formError, setFormError] = useState('');
  const [candidates, setCandidates] = useState(null);
  const ctl = useRef(null);
  const payloadRef = useRef(null);
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  // Background video: paused for reduced motion, resilient to autoplay failure.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.pause(); return; }
    v.play().catch(() => setVideoOk(false));
  }, []);

  const run = async (payload, formState) => {
    payloadRef.current = payload;
    if (formState) setForm(formState);
    setEvents([]); setFailed(''); setFormError(''); setCandidates(null); setView('progress');
    ctl.current = new AbortController();
    let done = false;
    try {
      await streamBrief(payload, (type, data) => {
        if (type === 'brief.completed') {
          done = true;
          setBrief(data.brief);
          try { sessionStorage.setItem(KEY, JSON.stringify(data.brief)); } catch { /* storage full or blocked */ }
          setView('report');
        } else if (type === 'run.failed') {
          done = true;
          if (data.code === 'ENTITY_AMBIGUOUS') { setCandidates(data.candidates || []); setView('disambiguate'); } else setFailed(data.message);
        } else setEvents((e) => [...e, { type, data }]);
      }, ctl.current.signal);
      if (!done) setFailed('The connection ended before the briefing was complete.');
    } catch (e) {
      if (e.name === 'AbortError') { setView('form'); return; }
      if (view !== 'progress') setView('form');
      setFormError(e.message);
      setFailed(e.message);
    }
  };

  const cancel = () => ctl.current?.abort();
  const choose = (c) => {
    const p = { ...payloadRef.current, entity: { ...payloadRef.current.entity, domain: c.domain } };
    run(p, form && { ...form, domain: c.domain });
  };

  return (
    <>
      {/* Page-level continuous background: sits behind everything; the hero paints over it with its own image. */}
      <div className="bg-video" aria-hidden="true">
        {videoOk && <video ref={videoRef} src="/assets/background.mp4" autoPlay muted loop playsInline preload="auto" onError={() => setVideoOk(false)} />}
        <div className="bg-veil" />
      </div>

      {view === 'landing' && <Landing onStart={() => setView('form')} />}
      {view !== 'landing' && (
        <header className="nav app-nav no-print">
          <a className="nav-logo" href="/" onClick={(e) => { e.preventDefault(); setView('landing'); }} aria-label="Briefly.ai home"><Logo /></a>
          {brief && view !== 'report' && <button className="btn btn-ghost" onClick={() => setView('report')}>Last briefing</button>}
        </header>
      )}
      {view === 'form' && <MeetingForm initial={form} error={formError} onBack={() => setView('landing')} onSubmit={run} />}
      {view === 'progress' && <Progress events={events} failed={failed} onCancel={cancel} onRetry={() => setView('form')} onBack={() => setView('landing')} />}
      {view === 'disambiguate' && (
        <div className="page narrow">
          <div className="panel">
            <h2>Which organisation did you mean?</h2>
            <p className="muted">We found more than one match and won’t guess.</p>
            <ul className="cands">
              {(candidates || []).map((c) => (
                <li key={c.domain}><button className="cand" onClick={() => choose(c)}><b>{c.domain}</b><span>{c.description || 'No description available'}</span></button></li>
              ))}
            </ul>
            <button className="btn btn-ghost" onClick={() => setView('form')}>None of these — add a domain</button>
          </div>
        </div>
      )}
      {view === 'report' && brief && <Report brief={brief} onNew={() => setView('form')} />}
    </>
  );
}
