import React, { useEffect, useRef, useState } from 'react';
import Hero3D from './Hero3D.jsx';
import Tilt from './Tilt.jsx';

const Logo = () => (
  <span className="logo">
    <img className="logo-mark" src="/logo.svg" width="40" height="40" alt="" />
    <span className="logo-word">briefly<b>.ai</b></span>
  </span>
);

const FEATURES = [
  ['Recent developments', 'Funding, leadership, launches, legal and risk signals from the 30 days before your meeting, nothing older passed off as new.'],
  ['Source-backed', 'Every line cites the exact passage it came from. Syndicated copies never count as independent confirmation.'],
  ['Relevant questions', 'Discussion points tied to your meeting type and goal, grounded in verified claims and honest gaps.'],
  ['Concise & actionable', 'One page. Three to six developments, ranked by a transparent formula rather than model opinion.'],
];
const STEPS = [
  ['01', 'Tell us the meeting', 'Company or person, date, timezone, meeting type and goal. We show the exact research window before you start.'],
  ['02', 'We research live', 'Planned searches across nine categories, sources read in full, claims extracted and checked against the text.'],
  ['03', 'Verify, don’t trust', 'Dates, entities, independence of sources and conflicts are checked by code. Unverified claims stay out.'],
  ['04', 'Walk in prepared', 'A one-page briefing with an evidence drawer, ready to print, copy as Markdown or download as JSON.'],
];
const USES = [
  ['Sales', 'Know the trigger events, hires and launches behind the account before the call.'],
  ['Investors', 'See funding, leadership moves and regulatory signals, with conflicting numbers shown side by side.'],
  ['Partnerships', 'Understand their product direction, deals and acquisitions before you talk terms.'],
  ['Recruiting', 'Check hiring momentum, funding and risk signals before the interview.'],
];

export default function Landing({ onStart }) {
  const stack = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Give the fixed nav a solid backdrop once it leaves the top of the hero.
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Scroll-driven 3D rotation of the preview stack.
  useEffect(() => {
    const el = stack.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf;
    const upd = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight));
      el.style.setProperty('--sx', `${p * 18}deg`);
      el.style.setProperty('--sy', `${-18 + p * -14}deg`);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    window.addEventListener('scroll', on, { passive: true });
    upd();
    return () => { window.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const go = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <>
      <header className={`nav ${scrolled ? 'nav-solid' : ''}`}>
        <a href="#top" className="nav-logo" onClick={go('top')} aria-label="Briefly.ai home"><Logo /></a>
        <nav aria-label="Primary">
          <a href="#product" onClick={go('product')}>Product</a>
          <a href="#how" onClick={go('how')}>How It Works</a>
          <a href="#use" onClick={go('use')}>Use Cases</a>
          <a href="#pricing" onClick={go('pricing')}>Pricing</a>
        </nav>
        <button className="btn btn-dark" onClick={onStart}>Get Started <span aria-hidden="true">→</span></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-bg" />
        <Hero3D />
        <div className="hero-copy">
          <p className="eyebrow"><span />Meeting intelligence<span /></p>
          <h1>Walk into every meeting <em>prepared.</em></h1>
          <p className="lede">Research the people, track recent developments and get a concise, source-backed briefing — before the conversation begins.</p>
          <div className="cta-row">
            <button className="btn btn-dark btn-lg" onClick={onStart}>Get Started <span aria-hidden="true">→</span></button>
            <button className="btn btn-ghost btn-lg" onClick={go('how')}>See How It Works <span aria-hidden="true">▷</span></button>
          </div>
        </div>
        <ul className="hero-strip">
          {FEATURES.map(([t]) => <li key={t}>{t}</li>)}
        </ul>
      </section>

      <main className="after-hero">
        <section id="product" className="section">
          <h2>Built for one thing: a briefing you can trust</h2>
          <div className="grid4">
            {FEATURES.map(([t, d]) => (
              <Tilt key={t} className="card"><h3>{t}</h3><p>{d}</p></Tilt>
            ))}
          </div>
        </section>

        <section className="section split">
          <div className="stack-wrap">
            <div className="stack" ref={stack} aria-hidden="true">
              {['Questions', 'Evidence', 'What changed'].map((t, i) => (
                <div key={t} className={`sheet sheet-${i}`}>
                  <b>{t}</b>
                  {i === 2 && <span className="chip chip-verified">VERIFIED</span>}
                  {i === 1 && <span className="chip chip-company">COMPANY-STATED</span>}
                  <i /><i /><i /><i className="short" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>Evidence you can open</h2>
            <p className="big">Click any development to see the original claim, the highlighted passage, the publisher, source tier and how many independent origins stand behind it. No made-up confidence scores — just clear statuses and the reasons for them.</p>
            <ul className="status-list">
              <li><span className="chip chip-verified">VERIFIED</span> independent origins agree</li>
              <li><span className="chip chip-company">COMPANY-STATED</span> the organisation says so</li>
              <li><span className="chip chip-single">SINGLE SOURCE</span> one independent report</li>
              <li><span className="chip chip-conflict">CONFLICTING</span> credible sources disagree</li>
            </ul>
          </div>
        </section>

        <section id="how" className="section">
          <h2>How it works</h2>
          <div className="grid4">
            {STEPS.map(([n, t, d]) => (
              <Tilt key={n} className="card step"><span className="num">{n}</span><h3>{t}</h3><p>{d}</p></Tilt>
            ))}
          </div>
        </section>

        <section id="use" className="section">
          <h2>Use cases</h2>
          <div className="grid4">
            {USES.map(([t, d]) => <Tilt key={t} className="card"><h3>{t}</h3><p>{d}</p></Tilt>)}
          </div>
        </section>

        <section id="pricing" className="section center">
          <Tilt className="card wide" max={5}>
            <h2>Free while in preview</h2>
            <p className="big">Briefly.ai is an early preview and has no paid plans yet. Each briefing is generated on demand and nothing about your meeting is stored on our servers.</p>
            <button className="btn btn-dark btn-lg" onClick={onStart}>Prepare a briefing <span aria-hidden="true">→</span></button>
          </Tilt>
        </section>

        <footer className="foot"><Logo /><span>Accuracy over appearance. Evidence over confidence theatre.</span></footer>
      </main>
    </>
  );
}

export { Logo };
