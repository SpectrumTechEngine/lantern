// Lantern: collects meetings from the fellowships' open meeting lists into data/meetings.json.
// Run once a day by .github/workflows/meetings.yml (or by hand: node tools/fetch-meetings.mjs).
// The app only ever reads that one file, so a person's location never leaves their phone.
// If one source fails, its meetings from the last good run are kept.
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1"));
const OUT = path.resolve(here, "..", "data", "meetings.json");
const LOCAL_TZ = /^Europe\/(London|Dublin|Belfast)$/; // online meetings: only ones held on Irish/UK time
// AA and NA online meetings: also ones held on Canadian, Australian and New Zealand time
const WIDE_TZ = /^(Europe\/(London|Dublin|Belfast)|America\/(Toronto|Montreal|Vancouver|Edmonton|Winnipeg|Regina|Halifax|St_Johns|Moncton|Glace_Bay|Whitehorse|Dawson|Yellowknife|Iqaluit)|Australia\/\w+|Pacific\/Auckland)$/;
// Countries outside Ireland and the UK (k on each in-person meeting), and a rough box around each
const BOX = {
  ca: (la, lo) => la > 41.6 && la < 84 && lo > -141.1 && lo < -52,
  au: (la, lo) => la > -44 && la < -9 && lo > 112 && lo < 154,
  nz: (la, lo) => la > -48 && la < -34 && lo > 165 && lo < 179,
};
// Town from an address like "57 Tabilban St, Burleigh Heads QLD 4220, Australia" -> "Burleigh Heads"
const townFrom = (a) => {
  const p = (a || "").split(",").map((x) => x.trim()).filter((x) => x && !/^(australia|new zealand|canada)$/i.test(x));
  return (p[p.length - 1] || "").replace(/\s+\d{4}$/, "").replace(/\s+(NSW|VIC|QLD|SA|WA|TAS|NT|ACT)$/i, "").trim();
};
const UA = { "User-Agent": "Lantern meeting finder (lanternrooms.org)" };

const getJSON = async (url) => {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
};
const hm = (s) => (s || "").slice(0, 5);                      // "19:30:00" -> "19:30"
const secs = (n) => n == null ? "" : String(Math.floor(n / 3600)).padStart(2, "0") + ":" + String(Math.floor(n % 3600 / 60)).padStart(2, "0");
const num = (x) => { const v = parseFloat(x); return Number.isFinite(v) && v !== 0 ? Math.round(v * 1e5) / 1e5 : null; };
const join = (...p) => p.map((x) => (x || "").trim()).filter(Boolean).join(", ");
const url = (u) => (typeof u === "string" && /^https?:\/\//i.test(u.trim()) ? u.trim() : "");

// Meeting labels people care about. Everything else is left out (the official page has full details).
const TAGS = [
  ["open", /^(o|open)$/i], ["closed", /^(c|closed)$/i], ["newcomers", /^(be|nc|beg|newcomers?|beginners?)$/i],
  ["women", /^(w|women)$/i], ["men", /^(m|men)$/i], ["lgbtq", /^(lgbtq?|gl|lgbt|lgbtqia\+?)$/i],
  ["wheelchair", /^(x|wc|wheelchair( access(ible)?)?)$/i], ["speaker", /^(sp|speaker)$/i], ["discussion", /^(d|disc|discussion)$/i],
];
const tags = (list) => [...new Set((list || []).flatMap((t) => TAGS.filter(([, re]) => re.test(String(t).trim())).map(([k]) => k)))];

// mode: 0 in person, 1 online, 2 both
const meeting = (o) => ({
  f: o.f, n: (o.n || "Meeting").trim(), d: o.d, t: o.t, e: o.e || "",
  m: o.m, la: o.m === 1 ? null : o.la, lo: o.m === 1 ? null : o.lo,
  a: o.m === 1 ? "" : (o.a || ""), c: o.m === 1 ? "" : tidyTown(o.c),
  u: o.m === 0 ? "" : url(o.u), g: tags(o.g), s: o.s, l: url(o.l),
  // z: the time zone an online meeting's times are in (the app shows them in the phone's own time)
  ...(o.m !== 0 && o.z ? { z: o.z } : {}), ...(o.m !== 1 && o.k ? { k: o.k } : {}),
});
// Town names: "D 10" / "Dub 2" -> "Dublin 10", "LONDON" -> "London"; null = the list says the meeting has closed
function tidyTown(s) {
  s = (s || "").trim().replace(/\s+/g, " ");
  if (/^(folded|cancelled|canceled|closed)$/i.test(s)) return null;
  s = s.replace(/\b(?:D|Dub)\.?\s?(\d{1,2}w?)\b/gi, (_, n) => "Dublin " + n.toUpperCase());
  if (s === s.toUpperCase() && /[A-Z]{3}/.test(s)) s = s.toLowerCase().replace(/(^|[\s\-'(])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
  return s;
}
const valid = (m) => m.c !== null && m.d >= 0 && m.d <= 6 && /^\d\d:\d\d$/.test(m.t) && (m.m === 1 ? m.u || m.l : m.la != null);

// ---------- BMLT (NA Ireland, Virtual NA, NA Canada/Australia/New Zealand) ----------
// k: a country's own server. Keeps only meetings in that country (NZ's also lists Asia);
// online ones only when their time zone is known, hybrid ones count as in person.
const BMLT_FIELDS = "meeting_name,weekday_tinyint,start_time,duration_time,time_zone,latitude,longitude,location_text,location_street,location_municipality,location_postal_code_1,venue_type,virtual_meeting_link,formats,published";
async function bmlt(src, base, query, online, k) {
  const rows = await getJSON(`${base}/client_interface/json/?switcher=GetSearchResults&${query}&data_field_key=${BMLT_FIELDS}`);
  return rows.filter((r) => r.published === "1" && (!online || WIDE_TZ.test(r.time_zone)) &&
    (!k || (r.venue_type === "2" ? WIDE_TZ.test(r.time_zone) : BOX[k](+r.latitude, +r.longitude)))).map((r) => {
    const m = online || r.venue_type === "2" ? 1 : r.venue_type === "3" && !k ? 2 : 0;
    const [dh, dm] = (r.duration_time || "").split(":").map(Number);
    const [sh, sm] = r.start_time.split(":").map(Number);
    const end = dh || dm ? (sh * 60 + sm + dh * 60 + dm) % 1440 : null;
    return meeting({
      f: "na", n: r.meeting_name.replace(/^NA Group\s*\|\s*/i, ""), d: +r.weekday_tinyint - 1, t: hm(r.start_time),
      e: end == null ? "" : String(Math.floor(end / 60)).padStart(2, "0") + ":" + String(end % 60).padStart(2, "0"),
      m, la: num(r.latitude), lo: num(r.longitude),
      a: join(r.location_text, r.location_street, r.location_postal_code_1), c: r.location_municipality,
      u: r.virtual_meeting_link, g: (r.formats || "").split(","), s: src,
      z: WIDE_TZ.test(r.time_zone) ? r.time_zone : "", k,
    });
  });
}

// ---------- UKNA (Drupal JSON:API) ----------
async function ukna() {
  const out = [];
  let next = "https://meetings.ukna.org/jsonapi/node/meeting?page[limit]=50&filter[field_meeting_folded]=0&filter[status]=1";
  for (let i = 0; next && i < 100; i++) {
    const j = await getJSON(next);
    for (const { attributes: a } of j.data) {
      const co = a.field_meeting_coordinates, link = a.field_meeting_online_link?.uri;
      const t = a.field_meeting_times;
      if (!t || !a.field_meeting_day) continue;
      const m = co?.lat && link ? 2 : co?.lat ? 0 : 1;
      const g = [a.field_meeting_open, ...(a.field_meeting_uk_format || []), ...(a.field_meeting_naws_format || [])];
      if (a.field_meeting_wheelchair === true || /^yes$/i.test(a.field_meeting_wheelchair || "")) g.push("wheelchair");
      out.push(meeting({
        f: "na", n: a.title, d: +a.field_meeting_day - 1, t: secs(t.from), e: secs(t.to), m,
        la: num(co?.lat), lo: num(co?.lon),
        a: join(a.field_meeting_venue_name, a.field_meeting_street, a.field_meeting_postcode), c: a.field_meeting_town,
        u: link, g, s: "ukna", l: "https://meetings.ukna.org" + (a.path?.alias || ""),
      }));
    }
    next = j.links?.next?.href;
  }
  return out;
}

// ---------- Meeting Guide / 12 Step Meeting List feeds ----------
// k: a country's own list (AA Australia, AA New Zealand): towns come from the address
async function guide(src, f, feed, keep = () => true, k) {
  const rows = await getJSON(feed);
  return rows.filter((r) => r.day != null && r.day !== "" && keep(r)).flatMap((r) => {
    const att = r.attendance_option;
    if (att === "inactive") return [];
    const types = Array.isArray(r.types) ? r.types : [];
    const conf = url(r.conference_url);
    const approx = r.approximate === "yes" || /^(united kingdom|ireland|uk|australia|new zealand|canada)$/i.test((r.formatted_address || "").trim());
    const hasPlace = num(r.latitude) != null && !approx && !types.includes("TC") && (!k || BOX[k](+r.latitude, +r.longitude));
    const m = att === "online" ? 1 : att === "hybrid" ? 2 : att === "in_person" ? 0
      : hasPlace && conf ? 2 : hasPlace ? 0 : 1;
    if (m !== 1 && !hasPlace) return conf ? [meeting({ ...base(r, src, f, types, k), m: 1, u: conf })] : [];
    return [meeting({ ...base(r, src, f, types, k), m, u: conf })];
  });
}
const base = (r, src, f, types, k) => ({
  f, n: r.name, d: +r.day, t: hm(r.time), e: hm(r.end_time),
  la: num(r.latitude), lo: num(r.longitude),
  a: join(r.location, r.formatted_address || r.address), c: k ? townFrom(r.formatted_address) : r.city || r.region || "",
  g: types, s: src, l: r.url, z: r.timezone || "Europe/London", k,
});
const localTZ = (r) => LOCAL_TZ.test(r.timezone || "");

// ---------- Sources ----------
// Each has: id, fellowship, name, where the details live, and how to read it.
const SOURCES = [
  { id: "na-ie", name: "Narcotics Anonymous Ireland", site: "https://www.na-ireland.org/",
    get: () => bmlt("na-ie", "https://bmlt.nasouth.ie/main_server", "lat_val=53.6&long_val=-7.3&geo_width_km=320", false) },
  { id: "ukna", name: "UK Narcotics Anonymous", site: "https://meetings.ukna.org/meeting/search", get: ukna },
  { id: "vna", name: "Virtual NA", site: "https://virtual-na.org/",
    get: () => bmlt("vna", "https://bmlt.virtual-na.org/main_server", "services[]=0&recursive=1", true).catch(() =>
      bmlt("vna", "https://bmlt.virtual-na.org/main_server", "", true)) },
  { id: "oiaa", name: "Online Intergroup of AA", site: "https://aa-intergroup.org/meetings/",
    get: () => guide("oiaa", "aa", "https://data.aa-intergroup.org/6436f5a3f03fdecef8459055.json", (r) => WIDE_TZ.test(r.timezone || "")) },
  // Added 19 Oct 2026: Canada, Australia, New Zealand (drugs and alcohol only)
  { id: "na-ca", name: "Narcotics Anonymous Canada", site: "https://canaacna.org/",
    get: () => bmlt("na-ca", "https://canaacna.org/meetings/main_server", "", false, "ca") },
  { id: "na-au", name: "Narcotics Anonymous Australia", site: "https://www.na.org.au/multi/meetings/",
    get: () => bmlt("na-au", "https://www.na.org.au/main_server", "", false, "au") },
  { id: "na-nz", name: "Narcotics Anonymous Aotearoa New Zealand", site: "https://www.nzna.org/meetings/",
    get: () => bmlt("na-nz", "https://bmlt.nzna.org/main_server", "", false, "nz") },
  { id: "aa-au", name: "Alcoholics Anonymous Australia", site: "https://meetings.aa.org.au/",
    get: () => guide("aa-au", "aa", "https://meetings.aa.org.au/wp-admin/admin-ajax.php?action=meetings", undefined, "au") },
  { id: "aa-nz", name: "Alcoholics Anonymous New Zealand", site: "https://aa.org.nz/meetings/",
    get: () => guide("aa-nz", "aa", "https://aa.org.nz/wp-admin/admin-ajax.php?action=meetings", undefined, "nz") },
  { id: "cma", name: "Crystal Meth Anonymous", site: "https://www.crystalmeth.org/meetings",
    get: () => guide("cma", "cma", "https://www.crystalmeth.org/wp-admin/admin-ajax.php?action=meetings", localTZ) },
  { id: "slaa", name: "SLAA UK", site: "https://slaauk.org/",
    get: () => guide("slaa", "slaa", "https://slaauk.org/wp-json/meeting-guide/v1/meetings", (r) => !r.timezone || localTZ(r)) },
  { id: "coda", name: "CoDA UK", site: "https://codauk.org/",
    get: () => guide("coda", "coda", "https://codauk.org/wp-admin/admin-ajax.php?action=meetings", (r) => !r.timezone || localTZ(r)) },
];

let old = { sources: [], meetings: [] };
try { old = JSON.parse(fs.readFileSync(OUT, "utf8")); } catch {}

const meetings = [], sources = [];
for (const s of SOURCES) {
  let list, ok = true;
  try { list = (await s.get()).filter(valid); if (!list.length) throw new Error("no meetings"); }
  catch (e) {
    ok = false;
    list = old.meetings.filter((m) => m.s === s.id);
    console.warn(`! ${s.id}: ${e.message} (kept ${list.length} from last time)`);
  }
  const prev = old.sources.find((x) => x.id === s.id);
  sources.push({ id: s.id, name: s.name, site: s.site, updated: ok ? new Date().toISOString().slice(0, 10) : prev?.updated || "" });
  meetings.push(...list);
  console.log(`${s.id}: ${list.length}${ok ? "" : " (old)"}`);
}

// The same online meeting can be listed by two sources: keep one
const seen = new Set();
const unique = meetings.filter((m) => {
  const k = [m.f, m.n.toLowerCase().replace(/\W/g, ""), m.d, m.t, m.m === 1 ? "on" : m.la].join("|");
  return !seen.has(k) && seen.add(k);
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), sources, meetings: unique }));
console.log(`Saved ${unique.length} meetings (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
