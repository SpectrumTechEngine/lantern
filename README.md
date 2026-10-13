# Lantern: Find the Light

Free recovery meetings across Ireland and the UK, in person and online, all in one place.
Live at https://thespectrumtechengine.com/lantern/

- `index.html`: the whole app.
- `data/meetings.json`: the meeting list. It's refreshed every night by `.github/workflows/meetings.yml`, which runs `tools/fetch-meetings.mjs`.
- Groups without an open meeting list are shown as links to their official meeting finders (the `L` list in `index.html`).
- Helpline numbers are in the `H` list in `index.html`. They were checked in October 2026.
- `android-app/`: builds the Android APK (see its README).

Lantern isn't part of, or endorsed by, any fellowship.
