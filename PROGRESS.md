# ZIKEY implementation ledger

Authorized spec: the implementation plan approved in this chat, 4 November 2026.

## 5 November: galaxy progress review

- Updated REDESIGN-PLAN.md against the supplied progress-review instructions and independent QA.
- Delivered hybrid radical overview → documented family focus, word ring, shared scoring/coverage.
- Kept display edge types separate from original IDS scoring; preserved source/band/sense evidence.
- Fixed opt-out heat, reading alternatives, pending event locking and Plotly shadow-root positioning.
- Current automated suite:22/22 pass; five real local-AI checks (3 fresh,2 cached).
- Independent final QA: READY for progress demo; screenshot evidence1440×1000 shows A/B/C.
- Actual browser: qing, keyboard graph selection, word details, mark/unmark, goal change, localAI,
  radical Overall scope, no-family fallback, overview camera restore;390/320 widths no horizontal overflow.
- Current submission:9-slide W16157093_Lin_ProgressReview, timed10min notes, English references,
  PPTX/PDF and140-second actual-screenshot walkthrough. Older six-slide/video files are historical.
- Still pending: learner/expert language evaluation, full device/accessibility testing, corpus frequency, ALS.

## 4 November: previous iteration tasks

- [x] Acquire real data, retain provenance and produce a bounded pilot dataset.
- [x] Test and implement ranking, search, unlock gain and coverage simulation.
- [x] Build linked Streamlit / D3 / Plotly views and local learner state.
- [x] Connect and verify local Ollama explanations, with labelled fallback.
- [x] Browser verification, demo recording, six-slide English deck and handoff.

## Decisions

- Work in a new `Info-viz/zikey` directory, preserving all existing coursework.
- UI, model explanations and slides use English with Traditional Chinese.
- Counts in the slides will come from the processed dataset, not target estimates.
- Dependencies between tasks: processed JSON feeds core and UI; core results feed explanations,
  coverage charts, tests and slides. The same word set and known-character set apply to every order.
- No textbook order or corpus frequency is available. Use explicitly labelled vocabulary-order
  baseline and vocabulary prevalence, with no claim of text coverage or learning effectiveness.
- Ruling: preserve named leaf parts from nested IDS, rather than inventing missing composite glyphs.
  Label edges and reuse as leaf-component occurrences, not immediate top-level relationships.
  Risk: this is a structural proxy and is not a full hierarchical decomposition model.
- Ruling: use a constrained, extractive local LLM explanation. The model selects 1–2 supported
  sentences; generated claims outside that evidence are rejected. This reduces language flexibility
  but prevents fabricated facts. The recommender remains deterministic and separately inspectable.
- Verified: 290 learning characters, 450 words, 506 graph nodes, 556 leaf-component edges.
- Verified: 14 automated tests pass. Five real local-model calls succeeded with supported output.
- Browser D3 keyboard selection successfully updated linked Python state and selected-character views.
- Final review fixes: non-object model JSON and interrupted cache writes now use the labelled fallback.
  New regression tests were observed failing before the fixes, then the entire 14-test suite passed.
- Browser suite: keyboard node selection, linked details, local LLM display, mark/unmark, goal changes,
  simulated-heat disclosure and 320/768/1024/1440px checks passed. No page errors or failed requests.
- Six English slides exported to editable PowerPoint and rendered PDF. Every final slide was visually
  inspected; package, layout, chart workbooks and first-party import validators passed. Native
  PowerPoint itself was not opened. Charts use original computed values rounded to six decimals
  for Excel compatibility; original full-precision results are retained in presentation-evidence.json.
- A captioned recording of actual UI interactions is delivered as ZIKEY-demo.mp4 (approximately 151s).
- README.md includes startup, sample learner, demo sequence, methods, sources and remaining work.
  PRESENTATION-NOTES.md includes English speaker notes, likely questions and an honest AI disclosure.
- Deferred: corpus frequency, hierarchical IDS reconstruction, ALS, community inference, expert
  linguistic review, held-out evaluation and learner study. These are recorded as future work.

Final handoff verified: nine-slide PPTX passed package/layout/font/native-chart/import checks;
all exact final slides rendered and visually inspected. PDF9pages compressed to1.68MB.
Walkthrough140s H.264 with default subtitle track decoded without errors. Final22tests pass.
Native PowerPoint application was not opened; no course-system upload performed.


## Contemporary book UI — user-approved follow-up

- Replaced dark rounded-dashboard skin with warm paper, navy toolbar, Baskerville headings and
  Songti glyphs; preserved proposal A/B/C, data, ranking and coverage definitions.
- Added measured focus framing and label sizing with resize handling; separated zoom controls and
  hint strip, and kept selected entry visible at1280×720.
- Impeccable used; UI/UX Pro Max and unslop were not installed and were not represented as used.
- Final fresh finish review disposition: ship for the listed readability and collision fixes.
- Final22tests pass. Actual browser verified mark/unmark4.9↔5.6%, goal steering, word details,
  keyboard selection, cached local explanation and overview camera restoration.
- DESIGN.md and .impeccable/design.json describe the built system. No new UI images or dependencies.
- Existing presentation/video retain the previous theme; current captures are book-workspace.png
  and book-overview.png. This follow-up changes the web UI, not the submitted deck.

## Hosted follow-up — presentation paused

- Explicit template backend by default; no AI request or paid API. Ollama opt-in environment variable.
-6missing exact word entries now use named dictionary variants;11sense reviews still open.
-27tests pass; original ranking/coverage unchanged.
-Production browser verification remains blocked: CUA still reports disabled after user enabled it.
-No claim that rendered cloud PoC has passed live testing. No presentation files touched.

## Coloured sketch UI —5November

User-directed pen-outlined controls, marker highlights and bundled Patrick Hand(OFL).
Precise CJK/pinyin/numerals and quantitative values preserved; A/B/C and Expand unchanged.
27tests pass, bundled module syntax checked. No new screenshot verification: browser disabled.
Detector's score-legend3px rule is a data key, not a card; older palette drift is documented
in current tokens. Full rendered finish review remains pending. Presentation untouched.
