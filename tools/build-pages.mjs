// Lantern: builds simple pages Google can read, from data/meetings.json and info.js.
//   meetings/            every town, A to Z
//   meetings/<town>/     that town's meetings, by day
//   meetings/online/     online meetings, by day
//   help/<topic>/        support for alcohol, drugs, gambling... (finders + helplines)
//   sitemap.xml, robots.txt
// Run after tools/fetch-meetings.mjs (the nightly workflow does both). Pages carry no dates,
// so they only change when the meetings change.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1"));
const ROOT = path.resolve(here, "..");
const SITE = "https://lanternrooms.org";
const MIN_MEETINGS = 2; // a town needs at least this many in-person meetings a week to get a page

const ctx = vm.createContext({});
const { FELLOW, L, H, CATS, DAYS, TAG, COUNTRY, moveTZ } = vm.runInContext(fs.readFileSync(path.join(ROOT, "info.js"), "utf8") + ";({FELLOW,L,H,CATS,DAYS,TAG,COUNTRY,moveTZ})", ctx);
const { meetings } = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "meetings.json"), "utf8"));

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const nice = (t) => { if (!t) return ""; let [h, m] = t.split(":").map(Number); const ap = h < 12 ? "am" : "pm"; h = h % 12 || 12; return h + (m ? ":" + String(m).padStart(2, "0") : "") + ap; };
const km = (a, b, c, d) => { const r = Math.PI / 180, x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };
const WEEK = [1, 2, 3, 4, 5, 6, 0]; // Monday first
const onIreland = (la, lo) => lo < -5.4 && la > 51.2 && la < 55.5; // island of Ireland (incl. Northern Ireland)

// Group the many ways towns are written into one page each ("Rialto, Dublin 8" -> Dublin)
// Outside Ireland and the UK the country goes on the end: "Perth, Australia" (not Perth in Scotland)
const pageTown = (m) => m.k ? `${m.c.split(",")[0].trim()}, ${COUNTRY[m.k]}`
  : /\bDublin\b/i.test(m.c) ? "Dublin" : /^London\b/i.test(m.c) ? "London" : m.c.split(",")[0].trim();
// Finders and helplines on a town page, by country
const LOCAL = {
  ie: { aa: ["aaIE", "caIE", "gaIE", "oaIE", "smartIE", "alanon", "gamanonIE"], help: ["samaritans", "hse", "lifeline", "gamIE"] },
  uk: { aa: ["aaGB", "caUK", "gaUK", "oaGB", "smartUK", "alanon", "gamanonUK"], help: ["samaritans", "frank", "drinkline", "gamcare"] },
  ca: { aa: ["aaCA", "naCA", "vna", "oiaa"], help: ["emergencyCA", "crisisCA"] },
  au: { aa: ["aaAU", "naAU", "vna", "oiaa"], help: ["emergencyAU", "lifelineAU", "adhAU"] },
  nz: { aa: ["aaNZ", "naNZ", "vna", "oiaa"], help: ["emergencyNZ", "needToTalk", "adhNZ"] },
};

// ---------- Shared page frame ----------
const page = ({ url, title, desc, h1, body, crumbs = [] }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${url}">
<meta name="theme-color" content="#1d2238">
<link rel="icon" href="/lantern-192.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${url}">
<meta property="og:image" content="${SITE}/share-card.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/pages.css">
</head>
<body>
<header><a class="brand" href="/">🏮 Lantern</a><a class="open" href="/">Open the app</a></header>
<main>
${crumbs.length ? `<nav class="crumbs">${crumbs.map(([t, u]) => u ? `<a href="${u}">${esc(t)}</a>` : esc(t)).join(" › ")}</nav>` : ""}
<h1>${esc(h1)}</h1>
${body}
</main>
<footer>
<p><b>Lantern is free and always will be.</b> Private, no sign-up.</p>
<p><a href="/meetings/">Meetings by town</a> · <a href="/meetings/online/">Online meetings</a> · ${Object.keys(CATS).filter((k) => k !== "all").map((k) => `<a href="/help/${k}/">${esc(CATS[k].t)}</a>`).join(" · ")}</p>
<p>Lantern isn't part of, or endorsed by, any fellowship. Meeting details come from each fellowship's public list and are checked daily. Always check the official listing before you travel.</p>
</footer>
</body>
</html>
`;

const label = (m) => { const F = FELLOW[m.f]; return `<span class="badge" style="background:${F.c}">${esc(F.w)} · ${esc(F.s)}</span>`; };
const tags = (m) => m.g.filter((t) => TAG[t]).map((t) => `<span class="tag">${esc(TAG[t])}</span>`).join("");
const meetingRow = (m, online) => {
  const maps = !online && m.la ? `<a href="https://www.google.com/maps/search/?api=1&amp;query=${m.la},${m.lo}" rel="nofollow noopener" target="_blank">Directions</a>` : "";
  const join = online && m.u ? `<a href="${esc(m.u)}" rel="nofollow noopener" target="_blank">Join</a>` : "";
  const more = m.l ? `<a href="${esc(m.l)}" rel="nofollow noopener" target="_blank">Official listing</a>` : "";
  return `<li><div class="when">${nice(m.t)}${m.e ? "–" + nice(m.e) : ""}</div><div class="what"><b>${esc(m.n)}</b> ${label(m)}${m.m === 2 ? '<span class="tag">Also online</span>' : ""}${tags(m)}
<div class="where">${online ? "Online" : esc(m.a)}</div><div class="links">${[maps, join, more].filter(Boolean).join(" · ")}</div></div></li>`;
};
const byDay = (list, online) => WEEK.map((d) => {
  const day = list.filter((m) => m.d === d).sort((a, b) => a.t.localeCompare(b.t) || a.n.localeCompare(b.n));
  return day.length ? `<h2>${DAYS[d]}</h2><ul class="meetings">${day.map((m) => meetingRow(m, online)).join("")}</ul>` : "";
}).join("");
const helplines = (keys) => `<ul class="tels">${keys.map((k) => { const [n, d, num] = H[k]; return `<li><a href="${/^text/i.test(num) ? "sms:" + num.replace(/\D/g, "") : "tel:" + num.split(" or ")[0].replace(/\s/g, "")}"><b>${esc(n)}</b> <span>${esc(num)}</span></a><small>${esc(d)}</small></li>`; }).join("")}</ul>`;
const finders = (keys) => `<ul class="finders">${keys.map((k) => { const [n, d, u] = L[k]; return `<li><a href="${u}" rel="noopener" target="_blank"><b>${esc(n)}</b></a><small>${esc(d)}</small></li>`; }).join("")}</ul>`;
const listNames = (fs_) => [...new Set(fs_.map((f) => FELLOW[f].n))];

// ---------- Build ----------
const out = new Map(); // path -> html
const urls = ["/", "/meetings/", "/meetings/online/", "/poster/"];

// Towns
const towns = new Map();
for (const m of meetings) {
  if (m.m === 1 || !m.c || m.la == null) continue;
  const name = pageTown(m), key = slug(name);
  if (!key) continue;
  if (!towns.has(key)) towns.set(key, { name, key, list: [], la: 0, lo: 0, k: m.k });
  const t = towns.get(key); t.list.push(m); t.la += m.la; t.lo += m.lo;
}
const kept = [...towns.values()].filter((t) => t.list.length >= MIN_MEETINGS);
for (const t of kept) { t.la /= t.list.length; t.lo /= t.list.length; t.ie = !t.k && onIreland(t.la, t.lo); t.area = t.k || (t.ie ? "ie" : "uk"); }

for (const t of kept) {
  const groups = listNames([...new Set(t.list.map((m) => m.f))]);
  const near = kept.filter((o) => o !== t).map((o) => [o, km(t.la, t.lo, o.la, o.lo)]).sort((a, b) => a[1] - b[1]).slice(0, 8);
  const { help, aa } = LOCAL[t.area];
  const url = `/meetings/${t.key}/`;
  urls.push(url);
  out.set(`meetings/${t.key}/index.html`, page({
    url, title: `Recovery meetings in ${t.name} | Lantern`,
    desc: `${t.list.length} recovery meetings a week in and around ${t.name}: ${groups.join(", ")}. Times, addresses and directions. Free, private, no sign-up.`,
    h1: `Recovery meetings in ${t.name}`,
    crumbs: [["Lantern", "/"], ["Meetings by town", "/meetings/"], [t.name]],
    body: `<p class="lead">${t.list.length} meetings a week in and around ${esc(t.name)}, from ${esc(groups.join(", "))}. You're welcome to just sit and listen.</p>
<p><a class="btn" href="/?town=${encodeURIComponent(t.name)}">See what's on today in the Lantern app →</a></p>
${byDay(t.list, false)}
<h2>Other groups near ${esc(t.name)}</h2>
<p>These groups keep their own meeting lists. Each link opens their official meeting finder.</p>
${finders(aa)}
<h2>Talk to someone now</h2>
${helplines(help)}
<h2>Nearby towns</h2>
<p class="near">${near.map(([o, d]) => `<a href="/meetings/${o.key}/">${esc(o.name)}</a> <small>(${Math.round(d)} km)</small>`).join(" · ")}</p>`,
  }));
}

// Online meetings (times moved to Irish and UK time)
const online = meetings.filter((m) => m.m !== 0 && m.u).map((m) => moveTZ(m, "Europe/London"));
out.set("meetings/online/index.html", page({
  url: "/meetings/online/", title: "Online recovery meetings on Irish and UK time | Lantern",
  desc: `${online.length} online recovery meetings a week on Irish and UK time: AA, NA, CoDA, SLAA and more. Join from anywhere. Free, private, no sign-up.`,
  h1: "Online recovery meetings",
  crumbs: [["Lantern", "/"], ["Online meetings"]],
  body: `<p class="lead">${online.length} meetings a week you can join from home, on Irish and UK time. Many people start with their camera off.</p>
<p><a class="btn" href="/?mode=online">See what's on now in the Lantern app →</a></p>
${byDay(online, true)}`,
}));

// Town index
const az = (list) => list.sort((a, b) => a.name.localeCompare(b.name)).map((t) => `<a href="/meetings/${t.key}/">${esc(t.name)}</a>`).join(" · ");
out.set("meetings/index.html", page({
  url: "/meetings/", title: "Recovery meetings by town in Ireland, the UK, Canada, Australia and New Zealand | Lantern",
  desc: `Find recovery meetings in ${kept.length} towns and cities: NA, CoDA, SLAA and CMA across Ireland and the UK, NA in Canada, and AA and NA in Australia and New Zealand. Free, private, no sign-up.`,
  h1: "Recovery meetings by town",
  crumbs: [["Lantern", "/"], ["Meetings by town"]],
  body: `<p class="lead">Pick a town to see its meetings by day. For meetings near you right now, <a href="/">open the Lantern app</a>.</p>
<h2>Ireland and Northern Ireland</h2><p class="az">${az(kept.filter((t) => t.ie))}</p>
<h2>England, Scotland and Wales</h2><p class="az">${az(kept.filter((t) => t.area === "uk"))}</p>
${Object.entries(COUNTRY).map(([k, n]) => `<h2>${n}</h2><p class="az">${az(kept.filter((t) => t.k === k))}</p>`).join("\n")}
<h2>Online</h2><p><a href="/meetings/online/">Online meetings on Irish and UK time</a></p>`,
}));

// Help pages, one per topic
const FIRST = `<h2>Going to your first meeting</h2>
<p>You don't need to be sure of anything, and you don't have to say a word. Meetings are free, and nobody asks for your full name. <b>Open</b> meetings welcome anyone, including family and friends; <b>closed</b> meetings are for people who want help themselves.</p>`;
const WHERE = (k) => k === "alcohol" || k === "drugs" ? "Ireland, the UK, Canada, Australia and New Zealand" : "Ireland and the UK";
for (const [k, c] of Object.entries(CATS)) {
  if (k === "all") continue;
  const url = `/help/${k}/`;
  urls.push(url);
  const ours = c.f.length ? `<p>Lantern also lists ${esc(listNames(c.f).join(" and "))} meetings itself: <a href="/meetings/">by town</a> or <a href="/meetings/online/">online</a>.</p>` : "";
  out.set(`help/${k}/index.html`, page({
    url, title: `${k === "worried" ? "Worried about someone's drinking, drugs or gambling?" : `Support for ${k === "food" ? "food and eating disorders" : c.t.toLowerCase()}`}: meetings and helplines in ${WHERE(k)} | Lantern`,
    desc: `${c.intro} Free meetings near you and online, plus helplines, across ${WHERE(k)}.`,
    h1: k === "worried" ? "Worried about someone?" : `Support for ${k === "food" ? "food and eating disorders" : c.t.toLowerCase()}`,
    crumbs: [["Lantern", "/"], [c.t]],
    body: `<p class="lead">${esc(c.intro)}</p>
<p><a class="btn" href="/?topic=${k}">Find a meeting in the Lantern app →</a></p>
<h2>Find a meeting</h2>
${finders(c.links)}
${ours}
<h2>Talk to someone now</h2>
${helplines(c.help)}
${FIRST}`,
  }));
}

// ---------- Write ----------
for (const d of ["meetings", "help"]) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });
for (const [p, html] of out) {
  fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, p), html);
}
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${kept.length} town pages, ${Object.keys(CATS).length - 1} help pages, online page, index, sitemap (${urls.length} addresses)`);
