## Prime Hospital V2 implementation note

The V2 enhancement assets are now in the main branch:
- `v2-ui.css` — low-glare dark clinical theme with colourful restrained outlines.
- `prime-v2-enhancements.js` — keyboard-first consultation navigation, offline/online status indicator, and a local free seed drug bank.

The local drug bank is a starter clinical library and is not represented as a comprehensive authoritative interaction database. It is editable/extendable by the application in future iterations.

Next integration stages: wire the V2 assets into the consultation shell, expand IndexedDB entities and sync queue, add patient timeline/old prescription print, then queue/billing/reports.
