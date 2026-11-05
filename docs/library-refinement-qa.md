# Library refinement QA — 2026-11-06

Implemented against the user's supplied B mockup and correction: warm outer paper,
grid inside data regions, compact header, physical spine-first book motion.

Verified locally in the in-app browser:

- 1440px viewport: 94px header, embedded JPEG paper and WebP cover assets, grid
  retained inside the map, no horizontal workspace or shelf overflow.
- 390px viewport: book selection changes the linked character definition and score.
- 320px viewport: workspace client/scroll widths 299/299px; toolbar 283/283px;
  shelf 271/271px; coverage plot 247/247px after resizing from a wider viewport.
- Known-character editor stays inside the 320px viewport (left 9px, right 289px).
- Expanded coverage is 530px high, hides the shelf and restores with Escape.
- Live book state exposes a 34px forward pull and separate 25-degree cover hinge;
  hover, focus and selected styles share this state. CSS provides reduced motion.

The 320px check reproduced stale Plotly width (317px in a 247px container). The
container resize observer now invokes the shared graph/chart resize function;
the same browser check passed after the fix.

27 Python tests and JavaScript syntax validation passed. A separate read-only code
review found no confirmed bugs in keyed shelf state, pending controls, bundling or
expanded-panel selector priority. The design detector reported no warnings and
98 advisory token/style findings; no new suppressions were added in this refinement.

Limits: no physical mobile-device or cross-browser matrix test; reduced motion
was checked in CSS, not by changing the operating-system preference. No scoring,
learner data, presentation or paid-API changes.
