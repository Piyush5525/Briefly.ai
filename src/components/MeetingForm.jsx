import React, { useEffect, useMemo, useState } from 'react';
import { getWindow } from '../api.js';

const TYPES = [['general', 'General'], ['sales', 'Sales'], ['investor', 'Investor'], ['partnership', 'Partnership'], ['recruiting', 'Recruiting']];
const blankAtt = { name: '', title: '', organization: '', profileUrl: '' };

function zones() {
  try { return Intl.supportedValuesOf('timeZone'); } catch { return ['UTC', 'Asia/Kolkata', 'America/New_York', 'Europe/London']; }
}

export default function MeetingForm({ initial, onSubmit, onBack, error }) {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  const [f, setF] = useState(initial || {
    name: '', kind: 'organization', domain: '', title: '', organization: '', profileUrl: '',
    meetingDate: tomorrow, meetingTime: '10:00', timezone: localTz, meetingType: 'general', goal: '', attendees: [],
  });
  const [win, setWin] = useState(null);
  const [winErr, setWinErr] = useState('');
  const tzList = useMemo(() => zones(), []);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    const t = setTimeout(() => {
      getWindow({ meetingDate: f.meetingDate, meetingTime: f.meetingTime, timezone: f.timezone })
        .then((w) => { setWin(w); setWinErr(''); })
        .catch((e) => { setWin(null); setWinErr(e.message); });
    }, 250);
    return () => clearTimeout(t);
  }, [f.meetingDate, f.meetingTime, f.timezone]);

  const fmt = (iso) => new Date(iso).toLocaleString(undefined, { timeZone: f.timezone, dateStyle: 'medium', timeStyle: 'short' });

  const [localErr, setLocalErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (f.kind === 'person' && !f.title.trim() && !f.organization.trim() && !f.profileUrl.trim()) {
      setLocalErr('Add a title, organisation or profile URL so we can identify the right person.');
      return;
    }
    setLocalErr('');
    onSubmit({
      entity: { name: f.name, kind: f.kind, domain: f.domain, title: f.title, organization: f.organization, profileUrl: f.profileUrl },
      meetingDate: f.meetingDate, meetingTime: f.meetingTime, timezone: f.timezone, meetingType: f.meetingType, goal: f.goal,
      attendees: f.attendees.filter((a) => a.name.trim()),
    }, f);
  };

  const setAtt = (i, k, v) => setF((p) => ({ ...p, attendees: p.attendees.map((a, j) => (j === i ? { ...a, [k]: v } : a)) }));

  return (
    <div className="page">
      <button className="link-back" onClick={onBack}>← Back</button>
      <form className="panel form" onSubmit={submit}>
        <h2>Prepare a briefing</h2>
        <p className="muted">Tell us who you’re meeting and when. We’ll research the 30 days leading up to it.</p>

        <fieldset>
          <legend>Who or what are you researching?</legend>
          <div className="seg" role="radiogroup" aria-label="Entity type">
            {[['organization', 'Organisation'], ['person', 'Person']].map(([v, l]) => (
              <button type="button" key={v} role="radio" aria-checked={f.kind === v} className={f.kind === v ? 'on' : ''} onClick={() => setF((p) => ({ ...p, kind: v }))}>{l}</button>
            ))}
          </div>
          <label>Name<input required minLength={2} maxLength={120} value={f.name} onChange={set('name')} placeholder={f.kind === 'person' ? 'e.g. Jane Doe' : 'e.g. Acme Technologies'} /></label>
          {f.kind === 'organization' ? (
            <label>Website domain <small>(optional, recommended)</small><input value={f.domain} onChange={set('domain')} placeholder="acme.com" /></label>
          ) : (
            <div className="row3">
              <label>Title<input value={f.title} onChange={set('title')} placeholder="CEO" /></label>
              <label>Organisation<input value={f.organization} onChange={set('organization')} placeholder="Acme" /></label>
              <label>Profile URL<input type="url" value={f.profileUrl} onChange={set('profileUrl')} placeholder="https://…" /></label>
            </div>
          )}
          {f.kind === 'person' && <p className="hint">Add at least one of title, organisation or profile URL so we don’t mix up similarly named people.</p>}
        </fieldset>

        <fieldset>
          <legend>The meeting</legend>
          <div className="row3">
            <label>Date<input type="date" required value={f.meetingDate} onChange={set('meetingDate')} /></label>
            <label>Time<input type="time" required value={f.meetingTime} onChange={set('meetingTime')} /></label>
            <label>Timezone
              <select value={f.timezone} onChange={set('timezone')}>{!tzList.includes(f.timezone) && <option>{f.timezone}</option>}{tzList.map((z) => <option key={z}>{z}</option>)}</select>
            </label>
          </div>
          <div className="window" aria-live="polite">
            {winErr ? <span className="err">{winErr}</span> : win ? (
              <>
                <b>Research window</b> {fmt(win.startUtc)} → {fmt(win.endUtc)} <small>({f.timezone})</small>
                {win.meetingInPast && <p className="hint">This meeting is in the past; nothing after it will be included.</p>}
                {win.meetingMoreThan30DaysAhead && <p className="hint">The meeting is more than 30 days away, so research covers the 30 days ending now.</p>}
              </>
            ) : 'Calculating window…'}
          </div>
          <div className="row2">
            <label>Meeting type
              <select value={f.meetingType} onChange={set('meetingType')}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
            <label>Goal <small>(optional)</small><input maxLength={400} value={f.goal} onChange={set('goal')} placeholder="e.g. Explore a data partnership" /></label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Attendees <small>(optional, up to 3)</small></legend>
          {f.attendees.map((a, i) => (
            <div className="att" key={i}>
              <input aria-label="Attendee name" placeholder="Name" value={a.name} onChange={(e) => setAtt(i, 'name', e.target.value)} maxLength={100} />
              <input aria-label="Attendee title" placeholder="Title" value={a.title} onChange={(e) => setAtt(i, 'title', e.target.value)} maxLength={100} />
              <input aria-label="Attendee organisation" placeholder="Organisation" value={a.organization} onChange={(e) => setAtt(i, 'organization', e.target.value)} maxLength={100} />
              <button type="button" className="x" aria-label="Remove attendee" onClick={() => setF((p) => ({ ...p, attendees: p.attendees.filter((_, j) => j !== i) }))}>×</button>
            </div>
          ))}
          {f.attendees.length < 3 && <button type="button" className="btn btn-ghost" onClick={() => setF((p) => ({ ...p, attendees: [...p.attendees, { ...blankAtt }] }))}>+ Add attendee</button>}
        </fieldset>

        {(localErr || error) && <p className="err banner" role="alert">{localErr || error}</p>}
        <button className="btn btn-dark btn-lg" disabled={!win}>Start research →</button>
      </form>
    </div>
  );
}
