// Research window engine: window_end = min(now, meeting_start); window_start = window_end - 30 calendar days (meeting tz).
const WINDOW_DAYS = 30;

export function assertTimezone(tz) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function partsInZone(date, tz) {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const o = {};
  for (const p of f.formatToParts(date)) o[p.type] = p.value;
  return { y: +o.year, mo: +o.month, d: +o.day, h: +o.hour, mi: +o.minute, s: +o.second };
}

/** Convert wall-clock time in an IANA zone to a UTC instant (DST-safe via offset iteration). */
export function zonedToUtc({ y, mo, d, h = 0, mi = 0, s = 0 }, tz) {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  let ts = guess;
  for (let i = 0; i < 3; i++) {
    const p = partsInZone(new Date(ts), tz);
    const asUtc = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s);
    ts = guess - (asUtc - ts);
  }
  return new Date(ts);
}

const iso = (p) => `${p.y}-${String(p.mo).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;

export function computeWindow({ meetingDate, meetingTime = '09:00', timezone, now = new Date() }) {
  if (!assertTimezone(timezone)) throw new Error('INVALID_TIMEZONE');
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(meetingDate || '');
  const tm = /^(\d{2}):(\d{2})$/.exec(meetingTime || '');
  if (!dm || !tm) throw new Error('INVALID_MEETING_DATETIME');
  const meeting = zonedToUtc({ y: +dm[1], mo: +dm[2], d: +dm[3], h: +tm[1], mi: +tm[2] }, timezone);
  if (Number.isNaN(meeting.getTime())) throw new Error('INVALID_MEETING_DATETIME');

  const end = meeting < now ? meeting : now;
  const endLocal = partsInZone(end, timezone);
  const back = new Date(Date.UTC(endLocal.y, endLocal.mo - 1, endLocal.d - WINDOW_DAYS));
  const start = zonedToUtc(
    { y: back.getUTCFullYear(), mo: back.getUTCMonth() + 1, d: back.getUTCDate(), h: endLocal.h, mi: endLocal.mi, s: endLocal.s },
    timezone,
  );
  const startLocal = partsInZone(start, timezone);
  return {
    timezone,
    meetingUtc: meeting.toISOString(),
    startUtc: start.toISOString(),
    endUtc: end.toISOString(),
    startLocalDate: iso(startLocal),
    endLocalDate: iso(endLocal),
    meetingInPast: meeting < now,
    meetingMoreThan30DaysAhead: meeting.getTime() - now.getTime() > WINDOW_DAYS * 864e5,
    asOf: now.toISOString(),
  };
}

/** Inclusive check on instants. Date-only strings are treated as the full UTC day. */
export function inWindow(dateStr, win) {
  if (!dateStr) return false;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  const t = Date.parse(dateOnly ? `${dateStr}T12:00:00Z` : dateStr);
  if (Number.isNaN(t)) return false;
  return t >= Date.parse(win.startUtc) - (dateOnly ? 864e5 / 2 : 0) && t <= Date.parse(win.endUtc) + (dateOnly ? 864e5 / 2 : 0);
}

/** Padded dates for Tavily; strict local filtering stays authoritative. */
export function paddedRange(win) {
  const pad = (s, days) => new Date(Date.parse(s) + days * 864e5).toISOString().slice(0, 10);
  return { start_date: pad(win.startUtc, -1), end_date: pad(win.endUtc, 1) };
}
