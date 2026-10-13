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
  itaa: ["Internet and Technology Addicts Anonymous", "Screens, gaming, phones · online", "https://internetaddictsanonymous.org/"],
};
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
};
const CATS = {
  all:     { e: "🌍", t: "All meetings", f: Object.keys(FELLOW), intro: "Every group Lantern can show, near you and online.",
             links: Object.keys(L), help: Object.keys(H) },
  alcohol: { e: "🍃", t: "Alcohol", f: ["aa"], intro: "Alcoholics Anonymous (AA) meets in almost every town. For meetings near you, tap an official finder below. Here are AA meetings online, on Irish and UK time.",
             links: ["aaIE", "aaGB", "oiaa", "smartIE", "smartUK"], help: ["hse", "drinkline", "samaritans", "lifeline"] },
  drugs:   { e: "🌱", t: "Drugs", f: ["na", "cma"], intro: "Narcotics Anonymous (NA) welcomes anyone who wants to stop using any drug.",
             links: ["naIE", "ukna", "vna", "caIE", "caUK", "cma", "ma", "smartIE", "smartUK"], help: ["hse", "frank", "ukna", "samaritans", "lifeline"] },
  gambling:{ e: "🎲", t: "Gambling", f: [], intro: "Gamblers Anonymous meets across Ireland and the UK. Tap below to see their meetings near you.",
             links: ["gaIE", "gaUK", "smartIE", "smartUK"], help: ["gamcare", "gamIE", "externIE", "externNI", "samaritans"] },
  food:    { e: "🍎", t: "Food", f: [], intro: "Overeaters Anonymous is for any kind of struggle with food: eating too much, too little, or bingeing.",
             links: ["oaIE", "oaGB"], help: ["samaritans", "lifeline"] },
  sex:     { e: "💞", t: "Sex and relationships", f: ["slaa", "coda"], intro: "Groups for sex, love, porn and relationship patterns that have become painful.",
             links: ["slaa", "saa", "sa", "coda"], help: ["samaritans", "lifeline"] },
  worried: { e: "🤝", t: "I'm worried about someone", f: ["coda"], intro: "Someone else's drinking, drug use or gambling affects you too. These groups are for family and friends.",
             links: ["alanon", "fa", "naranon", "gamanonIE", "gamanonUK", "aca", "sanon", "coda"], help: ["alanonIE", "alanonUK", "nacoa", "samaritans"] },
};
const MORE = {};
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TAG = { open: "Open to all", closed: "Closed", newcomers: "Newcomers welcome", women: "Women", men: "Men", lgbtq: "LGBTQ+", wheelchair: "Wheelchair access", speaker: "Speaker", discussion: "Discussion" };
