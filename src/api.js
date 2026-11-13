export async function getWindow(body) {
  const r = await fetch('/api/window', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'Invalid date');
  return j;
}

export async function health() {
  const r = await fetch('/api/health');
  return r.json();
}

/** POST + parse Server-Sent Events from the response stream. */
export async function streamBrief(payload, onEvent, signal) {
  const r = await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal });
  if (!r.ok) {
    let msg = 'Request failed';
    try { msg = (await r.json()).error?.message || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n\n')) >= 0) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const ev = /event: (.+)/.exec(chunk)?.[1];
      const data = /data: (.+)/s.exec(chunk)?.[1];
      if (ev && data) onEvent(ev, JSON.parse(data));
    }
  }
}
