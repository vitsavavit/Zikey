# ZIKEY — Library × sketchbook layout draft

Status: proposed layout; only the visible galaxy-to-library naming is implemented.

## Direction

A working reference library annotated by its reader: the library gives the page its
navigation and catalogue structure; the sketchbook gives controls, notes and real
relationships their pen-and-paper character. Preserve the existing A/B/C architecture.

## Desktop wireframe

```text
ZIKEY 字鑰     [Search a character or pinyin       Search]   Goal ▾   21 known
───────────────────────────────────────────────────────────────────────────
Your Learning Library                         │ Why this next?       Expand
All characters / 青 family / 請       Expand  │ 5 ranked characters
                                              │ Actual score contributions
A · CHARACTER NETWORK                         │ Reason + Explain recommendation
Existing radical clusters → selected family    │ Template/AI status stays explicit
Existing sound/meaning edges and word nodes    │ Advanced weights ▾
                                              ├────────────────────────────
Legend · zoom · fit                            │ Coverage compare     Expand
──────────────────────────────────────────────│ Current coverage
請   qǐng   to ask; to invite; please          │ Existing comparison chart
Sound 青 · Meaning 言          Mark as known   │ Starting knowledge + denominator
3 related words · dictionary/source details   │
───────────────────────────────────────────────────────────────────────────
290 characters · 450 entries                         Data & methods
```

## Library details to add in a later implementation

- Header: small serif wordmark on warm paper, a thin walnut rule suggesting a
  bound cover, handwritten controls already in use. Keep search prominent.
- A: one breadcrumb doubles as location and navigation. “All characters” returns
  to overview; family is clickable only when that view exists. Radical groups
  remain the real grouping, explained in plain language beside the map.
- Character entry: a ruled catalogue record beneath the graph, with a large
  Chinese glyph, precise pinyin, definition, documented components and sources.
  A known-state mark behaves like a reading annotation, with explicit button text.
- B: a reader's recommendation note. Keep five scan-friendly ranked rows and
  quantitative bars; green identifies selection, blue the explanation action.
- C: a reading record on a clean page. Keep straight axes, accurate data and
  legible labels. Paper texture is quieter here than behind the network.

Use ivory paper, walnut ink, muted forest green, ochre, blue and burgundy accents.
Preserve existing band/signal colour meanings; any new accent is non-data decoration.
Keep handwriting for headings and short actions, with clear body type for definitions,
Chinese readings, sources and numerical evidence. Avoid a shelf photograph behind text.

## Responsive and interaction boundaries

On mobile: search → A network → selected entry → B recommendations → C coverage.
Expand/Restore and Escape remain available, with selection and knowledge preserved.
No extra permanent sidebar, book-opening animation, fake book counts, borrowing
workflow, or proximity-based similarity claim. No change to recommendation math.

## Review criteria

Find search, definition and Mark as known without opening another section. A click
selects the same character across A/B/C. The interface must explain why a recommendation
helps, show vocabulary coverage honestly, and distinguish unavailable source data from
missing definitions. Compare narrow and desktop layouts with actual long definitions.
