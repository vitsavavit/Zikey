---
name: ZIKEY 字鑰
description: A contemporary linguistic atlas for character learning.
colors:
  paper: "#f7f5ee"
  inspector: "#f0f0e8"
  control: "#fcfbf7"
  binding: "#203c50"
  binding-hover: "#35576d"
  ink: "#25303b"
  muted: "#5d666a"
  rule: "#d3d6cf"
  ochre: "#94651e"
  green: "#43776c"
  blue: "#526f91"
  violet: "#81708f"
  novice: "#a5c8b8"
  band-a: "#aac6da"
  band-b: "#dfc080"
  band-c: "#c7b9dc"
  unknown: "#c7ccc5"
  active-row: "#e3e9e5"
  control-border: "#afb8b7"
  shell: "#e7eae4"
typography:
  headline:
    fontFamily: 'Baskerville, "Iowan Old Style", Georgia, serif'
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: 'Baskerville, "Iowan Old Style", Georgia, serif'
    fontSize: "23px"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: '"Avenir Next", "Helvetica Neue", "PingFang TC", sans-serif'
    fontSize: "14px"
    lineHeight: 1.5
  evidence:
    fontFamily: '"Avenir Next", "Helvetica Neue", "PingFang TC", sans-serif'
    fontSize: "12px"
    lineHeight: 1.5
  character:
    fontFamily: '"Songti TC", "Songti SC", serif'
    fontSize: "58px"
    lineHeight: 1.1
rounded:
  surface: "2px"
  control: "3px"
  dialog: "4px"
  popover: "10px"
spacing:
  compact: "6px"
  small: "8px"
  standard: "12px"
  section: "18px"
  gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.binding}"
    textColor: "{colors.control}"
    rounded: "{rounded.control}"
    padding: "7px 11px"
  button-primary-hover:
    backgroundColor: "{colors.binding-hover}"
  button-secondary:
    backgroundColor: "{colors.control}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 11px"
  field:
    backgroundColor: "{colors.control}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 11px"
  recommendation:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "6px 4px"
  recommendation-active:
    backgroundColor: "{colors.active-row}"
  inspector:
    backgroundColor: "{colors.inspector}"
    rounded: "0"
---

# Design System: ZIKEY 字鑰

## Overview

**Creative North Star: "The Contemporary Linguistic Atlas"**

A contemporary linguistic atlas on warm paper. Baskerville headings and Songti character entries give the workspace a reference-book character; native sans-serif controls keep search, learner state and evidence practical. Quiet rules organize a dense learning tool, with a navy binding header and restrained data colour.

The visual system supports the existing connected-character workspace. Its material is typography, paper tone and documented graph marks; decorative imagery, page curls, grain and ornamental stamps are excluded by the confirmed direction.

**Key Characteristics:**
- Warm paper with an ink-blue binding header.
- Serif editorial hierarchy, Ming character glyphs and sans-serif controls.
- Flat divided regions and explicit data encodings.

## Colors

### Primary

Binding navy anchors the toolbar, the explicit known-state action and selected/focused graph marks. Ochre identifies recommendations and sound edges; green identifies meaning edges and readable-word outlines.

### Secondary

Green, blue, ochre and violet encode Prevalence, Reuse, Unlock and Heat contributions respectively. Coverage compares muted grey, green and blue lines; the Default line is dashed.

### Neutral

Paper is the main reading surface; the subtly darker inspector separates evidence, while control paper lifts fields and dialogs. Ink carries text, muted ink carries supporting evidence and the rule tone divides regions. The outer Streamlit shell is a cooler neutral.

### Data bands

Novice, A, B and C use muted green, blue, ochre and violet fills; Unknown is grey. These are pilot-word-derived bands. Known uses a check, recommendation uses an ochre ring, selected uses a navy outline and structural components use diamonds. When selection and recommendation coincide, an additional navy ring preserves both states.

**The Evidence Rule.** Colour and marks describe real learner or source data; layout proximity is never a similarity claim.

## Typography

Baskerville with Iowan Old Style and Georgia fallbacks supplies headings and the wordmark. Body and native controls use Avenir Next, Helvetica Neue and PingFang TC. Songti TC / Songti SC supplies large selected characters and recommendation glyphs; no web font is downloaded.

The headline and section-title roles are defined in the frontmatter. Reading text is (17px); recommendation glyphs are (26px), with reading and score at (13px). Supporting evidence is generally (12px), while dense legends and plot labels are smaller. Chart text uses the sans-serif stack. Graph label sizes adapt to the focus framing scale rather than inheriting the selected-entry size.

**The Readable Atlas Rule.** Keep the reading surface quiet and preserve the hierarchy between headings, character glyphs, controls and evidence.

## Layout

The host container has a maximum width of (1800px), with (12px) padding, reduced to (4px) at widths up to (600px). The toolbar sits above A's flexible network and B/C's (355px) inspector, widened to (390px) at (1450px). Exploration has horizontal gutters of (20px); inspector sections use (18px).

At widths up to (900px), exploration stacks above a two-column inspector. At widths up to (600px), B and C stack, toolbar search gets its own row and selected-character content wraps. At desktop widths of at least (1000px) and heights up to (830px), the graph and coverage chart compact to (306px) and (166px). The graph otherwise uses a viewport-relative height clamped between (330px) and (480px), with explicit tablet (440px) and phone (400px) heights.

Zoom buttons sit inside the map; the map hint occupies normal flow below it. The selected character entry follows the legend, separated by a rule. Focus-mode SVG framing measures label and pill extents, while overview grouping keeps its existing camera model. These are implementation facts, not a claim of exhaustive device validation.

## Elevation & Depth

Main reading regions are flat, separated by rules and tonal shifts. Only the known-character popover uses an ambient shadow (`0 12px 35px #203c5026`). Native dialogs use a navy translucent backdrop (`#203c5066`). No decorative lighting or layered card system is used.

## Shapes

The outer workspace and graph word pills have gently squared corners; native controls and score bars are slightly rounded. Dialogs remain restrained; the known-character popover retains softer corners. Circles, diamonds, checks and solid/dashed word outlines are functional graph encodings rather than decorative shape motifs.

## Components

### Buttons and fields

Primary action styling is reserved for the selected character's known-state action. Secondary buttons and fields share control paper, a quiet border and compact padding. Secondary hover shifts to a pale green-grey with a stronger border. Focus uses a navy (2px) outline offset by (3px); toolbar focus switches to pale gold against navy. Disabled controls reduce opacity to (.55). Pending component actions lock native controls until the response returns.

### Toolbar and navigation

The binding header holds the wordmark, search, learning goal and known-character disclosure. The wordmark returns to overview; native controls retain their established meanings. The small-screen wordmark becomes (18px). Search results use compact text buttons, not a separate navigation rail.

### Recommendations and evidence

Five rule-separated rows share character, reading, tabular score and a segmented contribution bar. Hover and active state share the pale active-row tone. Explanation, advanced weights and coverage remain within the inspector; there is no generic card component.

### Character entry and graph words

The selected entry combines the large Songti glyph, reading, definition, component/source evidence, related-word action and known-state action. Graph word pills use a thin green solid outline for readable entries and a dashed neutral outline for one missing character. Clicking a word inspects it; it does not mark it known.

### Dialogs and disclosures

Native dialogs show word/source details and methods. Native details reveal known-character editing and advanced controls. A muted footer provides data context and the methods action. Reduced-motion preference disables transitions and smooth scrolling.

## Do's and Don'ts

### Do:
- Do preserve the native search, selects, details and dialog vocabulary.
- Do keep vocabulary bands, recommendation rings and score signals consistent between legends and dynamic graphics.
- Do preserve the A network / B explanation / C coverage structure and responsive stacking.
- Do keep selected-character reading, definition and source evidence together.

### Don't:
- Don't add decorative imagery, grain, page curls, gradients or ornamental stamps.
- Don't turn the atlas into a literal book prop or replace the workspace with a hero or card grid.
- Don't imply that graph proximity is linguistic similarity or that pilot vocabulary bands are official character levels.
