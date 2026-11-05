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
- Expanded coverage also resizes while the network is hidden: 231px drawn/container
  width at 320px viewport, and 301px drawn/container width after widening to 390px.
- Live book state exposes a 34px forward pull and separate 25-degree cover hinge;
  hover, focus and selected styles share this state. CSS provides reduced motion.

The 320px check reproduced stale Plotly width (317px in a 247px container). The
resize observer now watches both the network and coverage containers and invokes
the shared graph/chart resize function;
the same browser check passed after the fix.

27 Python tests and JavaScript syntax validation passed. A separate read-only code
review found no confirmed bugs in keyed shelf state, pending controls, bundling or
expanded-panel selector priority. The design detector reported no warnings and
98 advisory token/style findings; no new suppressions were added in this refinement.

Limits: no physical mobile-device or cross-browser matrix test; reduced motion
was checked in CSS, not by changing the operating-system preference. No scoring,
learner data, presentation or paid-API changes.

## Click-to-open shelf follow-up

- At 1440px, five closed spines stayed about 57.6px wide. Opening the middle
  book produced a centered 184px spread; both pairs of neighbors moved aside
  without stretching. Selecting 點 from Overall retained all five books.
- The one-book scope rendered one centered 57.6px spine. Marking it known
  hid the shelf when there were no recommendations. The shelf backdrop uses
  only the bare wood crop so it does not suggest extra selectable books.
- Opening begins with the 76px intact cover, holds that cover, then opens the
  two paper leaves. The browser reported the 1.12s animation and hidden text
  at activation; the settled spread showed Chinese left and pinyin right.
- At 320px, the initial introduction used 233px of its 257px card instead of
  the glyph column. The first and last books both opened fully in the shelf
  with no page-wide horizontal overflow. At 390px the spread fit without
  internal scrolling. Enter opened a book and focus was restored on response.
- Independent code QA found a scope change that replaced neighbors mid-motion
  and a delayed closing fade. Both were corrected; the scope regression test
  failed before the fix and passed afterward. Total: 28 Python tests.
