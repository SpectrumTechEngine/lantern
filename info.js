// Lantern: the groups, official meeting finders, helplines and topics.
// Shared by the app (index.html) and the town/help pages (tools/build-pages.mjs).

const FELLOW = {
  // w = what the meeting is for, in plain words (shown on every meeting)
  aa:   { n: "Alcoholics Anonymous", s: "AA", w: "Alcohol", c: "#3d6fb6" },
  na:   { n: "Narcotics Anonymous", s: "NA", w: "Drugs", c: "#2e8b57" },
  cma:  { n: "Crystal Meth Anonymous", s: "CMA", w: "Crystal meth", c: "#8e5bb5" },
  slaa: { n: "Sex and Love Addicts Anonymous", s: "SLAA", w: "Sex and love", c: "#c0507a" },
  coda: { n: "Co-Dependents Anonymous", s: "CoDA", w: "Relationships", c: "#b4702a" },
};
// Official meeting finders (groups whose lists Lantern can't show itself)
const L = {
  aaIE: ["Alcoholics Anonymous Ireland", "Ireland and Northern Ireland", "https://www.alcoholicsanonymous.ie/find-meeting/"],
  aaGB: ["Alcoholics Anonymous Great Britain", "England, Scotland and Wales, plus online", "https://www.alcoholics-anonymous.org.uk/find-a-meeting/"],
  oiaa: ["AA online meetings", "Online, every hour of the day", "https://aa-intergroup.org/meetings/"],
  smartUK: ["SMART Recovery UK", "Any addiction · in person and online", "https://smartrecovery.org.uk/meetings"],
  smartIE: ["SMART Recovery Ireland", "Any addiction · in person and online", "https://smartrecovery.ie/meetings/"],
  naIE: ["Narcotics Anonymous Ireland", "Ireland and Northern Ireland", "https://www.na-ireland.org/"],
  ukna: ["UK Narcotics Anonymous", "England, Scotland and Wales", "https://meetings.ukna.org/meeting/search"],
  vna: ["Virtual NA", "Online", "https://virtual-na.org/"],
  caUK: ["Cocaine Anonymous UK", "UK including Northern Ireland, plus online", "https://meetings.cocaineanonymous.org.uk/meetings"],
  caIE: ["Cocaine Anonymous Ireland", "Ireland", "https://caireland.live/meeting-schedule"],
  cma: ["Crystal Meth Anonymous", "UK, Ireland and online", "https://www.crystalmeth.org/meetings"],
  ma: ["Marijuana Anonymous", "Mostly online", "https://marijuana-anonymous.org/find-a-meeting"],
  gaUK: ["Gamblers Anonymous UK", "UK including Northern Ireland", "https://gamblersanonymous.org.uk/meeting/"],
  gaIE: ["Gamblers Anonymous Ireland", "Ireland", "https://gamblersanonymous.ie/meetings"],
  oaGB: ["Overeaters Anonymous GB", "Great Britain, plus online", "https://oagb.org.uk/find-a-meeting/"],
  oaIE: ["Overeaters Anonymous Ireland", "Ireland, plus online", "https://overeatersanonymous.ie/find-a-meeting/"],
  bodywhys: ["Bodywhys support groups", "Eating disorders · Ireland · online and in person, plus family support", "https://www.bodywhys.ie/supports-services/support-groups/"],
  beat: ["Beat online support groups", "Eating disorders · UK · online", "https://www.beateatingdisorders.org.uk/support-services/online-groups/"],
  eda: ["Eating Disorders Anonymous", "12-step meetings for eating disorders · mostly online", "https://eatingdisordersanonymous.org/meetings/"],
  slaa: ["Sex and Love Addicts Anonymous UK", "UK, plus online", "https://slaauk.org/"],
  saa: ["Sex Addicts Anonymous UK", "UK", "https://saauk.info/meetings/"],
  sa: ["Sexaholics Anonymous UK", "UK including Belfast", "https://sauk.org/activities/sexaholics-anonymous-meetings/"],
  coda: ["Co-Dependents Anonymous UK", "Relationships · UK, plus online", "https://codauk.org/"],
  alanon: ["Al-Anon and Alateen", "Someone's drinking · UK and Ireland", "https://al-anonuk.org.uk/find-a-meeting/"],
  aca: ["Adult Children of Alcoholics UK", "Grew up around drinking or other harm", "https://www.adultchildrenofalcoholics.co.uk/meetings/"],
  naranon: ["Nar-Anon", "Someone's drug use · online and worldwide", "https://nar-anon.org/find-a-meeting"],
  gamanonUK: ["Gam-Anon UK", "Someone's gambling", "https://gamanon.org.uk/meetings/"],
  gamanonIE: ["Gam-Anon Ireland", "Someone's gambling", "https://gamblersanonymous.ie/gam-anon-meetings"],
  fa: ["Families Anonymous UK", "Someone's drug or alcohol use", "https://famanon.org.uk/meetings/meetings-in-the-uk/"],
  sanon: ["S-Anon UK", "Someone's sexual behaviour", "https://s-anonuk.org/"],
  da: ["Debtors Anonymous UK", "Money and debt", "https://debtorsanonymous.org.uk/meetings-list/"],
  itaa: ["Internet and Technology Addicts Anonymous", "Screens, gaming, phones · online, some UK groups", "https://internetaddictsanonymous.org/online-meetings/"],
  // Added 13 Oct 2026 (all links checked that day)
  gaa: ["Gaming Addicts Anonymous", "Gaming · online, some local groups", "https://www.gamingaddictsanonymous.org/online-meetings/"],
  ua: ["Underearners Anonymous", "Money · online, phone and London", "https://underearnersanonymous.org/meetings-underearners-anonymous/"],
  pills: ["Pills Anonymous", "Prescription drugs · online meetings", "https://www.pillsanonymous.org/find-a-virtual-meeting"],
  rd: ["Recovery Dharma", "Any addiction · mindfulness-based · London and online", "https://recoverydharma.org/meetings/"],
  clubsoda: ["Club Soda", "Drinking less or not at all · UK events and community", "https://joinclubsoda.com/events/"],
  wfs: ["Women for Sobriety", "Alcohol · women only · online", "https://meetings.womenforsobriety.org/meetings/"],
  lifering: ["LifeRing", "Alcohol and drugs · non-12-step · online", "https://lifering.org/meeting-menu/online-meetings/"],
  cr: ["Celebrate Recovery UK", "Any hurt or habit · church-based · UK incl. Northern Ireland, plus online", "https://www.celebraterecovery.co.uk/find-a-group/"],
  gamcareGroups: ["GamCare support", "Gambling · Great Britain · online and local groups", "https://www.gamcare.org.uk/get-support/online-support-services/"],
  gtherapy: ["Gambling Therapy", "Gambling · online support groups, any country", "https://gamblingtherapy.org/support/support-forums/"],
  paa: ["Porn Addicts Anonymous", "Porn · online meetings", "https://pornaddictsanonymous.org/meetings"],
  laa: ["Love Addicts Anonymous", "Love and relationships · online and in person", "https://loveaddictsanonymous.org/meetings/online/"],
  nicA: ["Nicotine Anonymous", "Smoking and vaping · online, phone and in person", "https://nicotine-anonymous.org/find-a-meeting"],
  hseQuit: ["HSE QUIT", "Free stop-smoking support · Ireland", "https://www2.hse.ie/living-well/quit-smoking/"],
  quitNI: ["Stop Smoking NI", "Free stop-smoking support · Northern Ireland", "https://www.stopsmokingni.info/"],
  nhsQuit: ["NHS Stop Smoking Services", "Free stop-smoking support · England", "https://www.nhs.uk/live-well/quit-smoking/nhs-stop-smoking-services-help-you-quit/"],
  quitScot: ["Quit Your Way Scotland", "Free stop-smoking support · Scotland", "https://www.nhsinform.scot/quit-your-way-scotland/"],
  quitWales: ["Help Me Quit", "Free stop-smoking support · Wales", "https://www.helpmequit.wales/"],
  ea: ["Emotions Anonymous UK", "Feelings · online and in person", "https://www.emotionsanonymous.org.uk/find-a-meeting"],
  dda: ["Dual Diagnosis Anonymous", "Addiction and mental health · online", "https://ddainc.org/online-dda-meetings/"],
  adfam: ["Adfam", "Family support · UK · local groups and online", "https://adfam.org.uk/find-support/"],
  fasn: ["Family Addiction Support Network", "Family support · Cavan, Monaghan, Louth and Meath", "https://fasn.ie/"],
  // Treatment and local services (not meetings)
  hseMap: ["HSE drug and alcohol services map", "Treatment and family support · Ireland", "https://www.drugsandalcohol.ie/services_map"],
  niServices: ["Drug and alcohol services near you", "Treatment · Northern Ireland", "https://drugsandalcoholni.info/services-near-you/"],
  nhsAlcohol: ["NHS alcohol support services", "Treatment · England", "https://www.nhs.uk/nhs-services/find-alcohol-addiction-support-services/"],
  frankFind: ["FRANK: find drug support near you", "Treatment · England", "https://www.talktofrank.com/get-help/find-support-near-you"],
  scotServices: ["Scottish drug and alcohol services", "Treatment · Scotland", "https://drugandalcoholservices.scot/"],
  dan: ["DAN 24/7", "Drug and alcohol help · Wales", "https://dan247.org.uk/"],
  // Canada, Australia, New Zealand: drugs and alcohol (added 19 Oct 2026, links checked that day)
  aaCA: ["Alcoholics Anonymous: find AA near you", "Canada and the USA", "https://www.aa.org/find-aa"],
  aaAU: ["Alcoholics Anonymous Australia", "Australia, plus online", "https://meetings.aa.org.au/"],
  aaNZ: ["Alcoholics Anonymous New Zealand", "Aotearoa New Zealand, plus online", "https://aa.org.nz/meetings/"],
  naCA: ["Narcotics Anonymous Canada", "Canada", "https://canaacna.org/"],
  naAU: ["Narcotics Anonymous Australia", "Australia", "https://www.na.org.au/multi/meetings/"],
  naNZ: ["Narcotics Anonymous Aotearoa New Zealand", "New Zealand", "https://www.nzna.org/meetings/"],
};
// Countries outside Ireland and the UK (m.k on a meeting). No k = Ireland and the UK.
const COUNTRY = { ca: "Canada", au: "Australia", nz: "New Zealand" };
// Online meetings carry the time zone they're held in (m.z). Move one to another zone (default: this phone's).
const TZ_OFF = {};
function tzOff(z) {
  if (z in TZ_OFF) return TZ_OFF[z];
  try {
    const now = Math.floor(Date.now() / 60000) * 60000, p = {};
    for (const x of new Intl.DateTimeFormat("en-US", { timeZone: z, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).formatToParts(now)) p[x.type] = +x.value;
    return (TZ_OFF[z] = (Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute) - now) / 60000);
  } catch (e) { return (TZ_OFF[z] = null); }
}
function moveTZ(m, to) {
  if (!m.z) return m;
  const a = tzOff(m.z), b = tzOff(to || Intl.DateTimeFormat().resolvedOptions().timeZone);
  if (a == null || b == null || a === b) return m;
  const at = (t) => { const [h, mi] = t.split(":").map(Number); return ((m.d * 1440 + h * 60 + mi + b - a) % 10080 + 10080) % 10080; };
  const hm = (v) => String(Math.floor(v % 1440 / 60)).padStart(2, "0") + ":" + String(v % 60).padStart(2, "0");
  const s = at(m.t);
  return { ...m, d: Math.floor(s / 1440), t: hm(s), e: m.e ? hm(at(m.e)) : "" };
}
// Helplines: [name, detail, number, area]
const H = {
  emergency: ["Emergency services", "If someone is in danger", "112 or 999", "all"],
  samaritans: ["Samaritans", "Any time, about anything · 24/7", "116 123", "all"],
  lifeline: ["Lifeline", "Northern Ireland · 24/7", "0808 808 8000", "ni"],
  hse: ["HSE Drugs and Alcohol Helpline", "Ireland · Mon–Fri 9:30–5:30", "1800 459 459", "ie"],
  frank: ["FRANK", "Drugs · UK · 24/7", "0300 123 6600", "uk"],
  drinkline: ["Drinkline", "Alcohol · UK · weekdays 9–8, weekends 11–4", "0300 123 1110", "uk"],
  ukna: ["NA helpline", "UK · 10am to midnight", "0300 999 1212", "uk"],
  gamcare: ["National Gambling Helpline", "Great Britain · 24/7", "0808 8020 133", "uk"],
  gamIE: ["Gambling Care Ireland", "Ireland", "1800 936 725", "ie"],
  externIE: ["Extern Problem Gambling", "Ireland", "089 241 5401", "ie"],
  externNI: ["Extern Problem Gambling", "Northern Ireland", "07537 188 575", "ni"],
  alanonUK: ["Al-Anon helpline", "UK · for families and friends", "0800 0086 811", "uk"],
  alanonIE: ["Al-Anon helpline", "Ireland · for families and friends", "01 873 2699", "ie"],
  nacoa: ["Nacoa", "For children of parents who drink · UK", "0800 358 3456", "uk"],
  bodywhys: ["Bodywhys helpline", "Eating disorders · Ireland · open most days, times vary", "01 210 7906", "ie"],
  beatNI: ["Beat helpline", "Eating disorders · Northern Ireland · Mon–Fri 3–8pm", "0808 801 0434", "ni"],
  beat: ["Beat helpline", "Eating disorders · England · Mon–Fri 3–8pm", "0808 801 0677", "uk"],
  beatSC: ["Beat helpline", "Eating disorders · Scotland · Mon–Fri 3–8pm", "0808 801 0432", "uk"],
  beatWA: ["Beat helpline", "Eating disorders · Wales · Mon–Fri 3–8pm", "0808 801 0433", "uk"],
  pieta: ["Pieta", "Suicide and self-harm · Ireland · 24/7", "1800 247 247", "ie"],
  shout: ["Shout", "Text support · UK · 24/7, free", "Text 85258", "uk"],
  dan: ["DAN 24/7", "Drugs and alcohol · Wales · 24/7", "0808 808 2234", "uk"],
  quitIE: ["HSE QUIT", "Stop smoking · Ireland · freephone", "1800 201 203", "ie"],
  smokefree: ["National Smokefree Helpline", "Stop smoking · England", "0300 123 1044", "uk"],
  quitSC: ["Quit Your Way Scotland", "Stop smoking · Mon–Fri 9am–5pm", "0800 84 84 84", "uk"],
  quitWA: ["Help Me Quit", "Stop smoking · Wales", "0800 085 2219", "uk"],
  mabs: ["MABS", "Money and debt · Ireland · Mon–Fri 9am–8pm", "0818 07 2000", "ie"],
  adviceNI: ["Advice NI", "Money and debt · Northern Ireland", "0800 915 4604", "ni"],
  stepchange: ["StepChange", "Debt · UK · Mon–Fri 8am–8pm, Sat 9am–2pm", "0800 138 1111", "uk"],
  natdebt: ["National Debtline", "Debt · Great Britain · Mon–Fri 9am–8pm, Sat 9:30am–1pm", "0808 808 4000", "uk"],
  // Canada, Australia, New Zealand (numbers checked 19 Oct 2026)
  emergencyCA: ["Emergency services", "Canada · if someone is in danger", "911", "ca"],
  crisisCA: ["9-8-8 Suicide Crisis Helpline", "Canada · call or text · 24/7", "988", "ca"],
  emergencyAU: ["Emergency services", "Australia · if someone is in danger", "000", "au"],
  lifelineAU: ["Lifeline", "Australia · any crisis · 24/7", "13 11 14", "au"],
  adhAU: ["National Alcohol and Other Drug Hotline", "Australia · 24/7", "1800 250 015", "au"],
  emergencyNZ: ["Emergency services", "New Zealand · if someone is in danger", "111", "nz"],
  needToTalk: ["Need to talk? 1737", "New Zealand · call or text · 24/7", "1737", "nz"],
  adhNZ: ["Alcohol Drug Helpline", "New Zealand · 24/7", "0800 787 797", "nz"],
};
const CATS = {
  all:     { e: "🌍", t: "All meetings", f: Object.keys(FELLOW), intro: "Every group Lantern can show, near you and online.",
             links: Object.keys(L), help: Object.keys(H) },
  alcohol: { e: "🍃", t: "Alcohol", f: ["aa"], intro: "Alcoholics Anonymous (AA) meets in almost every town. Lantern shows AA meetings in Australia and New Zealand, and online. In Ireland, the UK and Canada, tap an official finder below for meetings near you.",
             links: ["aaIE", "aaGB", "aaCA", "aaAU", "aaNZ", "oiaa", "smartIE", "smartUK", "clubsoda", "wfs", "lifering", "rd", "cr", "hseMap", "niServices", "nhsAlcohol", "scotServices", "dan"],
             help: ["hse", "drinkline", "dan", "samaritans", "lifeline", "crisisCA", "adhAU", "lifelineAU", "adhNZ", "needToTalk"] },
  drugs:   { e: "🌱", t: "Drugs", f: ["na", "cma"], intro: "Narcotics Anonymous (NA) welcomes anyone who wants to stop using any drug.",
             links: ["naIE", "ukna", "naCA", "naAU", "naNZ", "vna", "caIE", "caUK", "cma", "ma", "pills", "smartIE", "smartUK", "lifering", "rd", "cr", "hseMap", "niServices", "frankFind", "scotServices", "dan"],
             help: ["hse", "frank", "ukna", "dan", "samaritans", "lifeline", "crisisCA", "adhAU", "lifelineAU", "adhNZ", "needToTalk"] },
  gambling:{ e: "🎲", t: "Gambling", f: [], intro: "Gamblers Anonymous meets across Ireland and the UK. Tap below to see their meetings near you.",
             links: ["gaIE", "gaUK", "gamcareGroups", "gtherapy", "smartIE", "smartUK"], help: ["gamcare", "gamIE", "externIE", "externNI", "samaritans"] },
  food:    { e: "🍎", t: "Food and eating", f: [], intro: "For any struggle with food or eating, including eating disorders like anorexia, bulimia and binge eating. Bodywhys (Ireland) and Beat (UK) run free support groups and helplines, for you or someone you love.",
             links: ["bodywhys", "beat", "eda", "oaIE", "oaGB"], help: ["bodywhys", "beatNI", "beat", "beatSC", "beatWA", "samaritans"] },
  sex:     { e: "💞", t: "Sex and relationships", f: ["slaa", "coda"], intro: "Groups for sex, love, porn and relationship patterns that have become painful.",
             links: ["slaa", "saa", "sa", "paa", "laa", "coda"], help: ["samaritans", "lifeline"] },
  smoking: { e: "🚭", t: "Smoking and vaping", f: [], intro: "Free stop-smoking services give you one-to-one support to quit, and Nicotine Anonymous runs meetings online, by phone and in person.",
             links: ["hseQuit", "quitNI", "nhsQuit", "quitScot", "quitWales", "nicA"], help: ["quitIE", "smokefree", "quitSC", "quitWA", "samaritans"] },
  gaming:  { e: "🎮", t: "Gaming and screens", f: [], intro: "For when gaming, your phone, social media or the internet has taken over. These groups meet online, with some local groups too.",
             links: ["gaa", "itaa"], help: ["samaritans", "lifeline", "shout"] },
  money:   { e: "💷", t: "Money and spending", f: [], intro: "For debt, compulsive spending or shopping, or struggling to earn enough. Free money advice services can help you take back control too.",
             links: ["da", "ua"], help: ["mabs", "adviceNI", "stepchange", "natdebt", "samaritans"] },
  feelings:{ e: "🧠", t: "Feelings and mental health", f: [], intro: "For feelings that have become hard to manage, or addiction alongside mental health struggles. If you're in crisis, please talk to someone now.",
             links: ["ea", "dda", "rd"], help: ["samaritans", "pieta", "lifeline", "shout"] },
  worried: { e: "🤝", t: "I'm worried about someone", f: ["coda"], intro: "Someone else's drinking, drug use or gambling affects you too. These groups are for family and friends.",
             links: ["alanon", "fa", "adfam", "fasn", "naranon", "gamanonIE", "gamanonUK", "aca", "sanon", "coda", "hseMap"], help: ["alanonIE", "alanonUK", "nacoa", "samaritans"] },
};
const MORE = {};
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TAG = { open: "Open to all", closed: "Closed", newcomers: "Newcomers welcome", women: "Women", men: "Men", lgbtq: "LGBTQ+", wheelchair: "Wheelchair access", speaker: "Speaker", discussion: "Discussion" };
