# Lantern: Find the Light

Free recovery meetings across Ireland and the UK, in person and online, all in one place.
Live at https://lanternrooms.org/

- `index.html`: the whole app.
- `data/meetings.json`: the meeting list. It's refreshed every night by `.github/workflows/meetings.yml`, which runs `tools/fetch-meetings.mjs`.
- Groups without an open meeting list are shown as links to their official meeting finders (the `L` list in `info.js`).
- Helpline numbers are in the `H` list in `info.js`. They were checked in October 2026.
- `info.js`: the groups, official finders, helplines and topics (shared by the app and the pages).
- `meetings/`, `help/`, `sitemap.xml`, `robots.txt`: pages for Google, rebuilt nightly by `tools/build-pages.mjs`. Don't edit them by hand.
- `poster/`: printable poster and pocket cards with a QR code.
- `android-app/`: builds the Android APK (see its README).

Lantern isn't part of, or endorsed by, any fellowship.
