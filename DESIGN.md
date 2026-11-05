---
name: ZIKEY 字鑰
description: A contemporary linguistic atlas for character learning.
colors:
  walnut: "#51311d"
  shelf-edge: "#795535"
  leather-green: "#334734"
  leather-blue: "#34495b"
  leather-red: "#693c39"
  leather-ochre: "#805726"
  book-gold: "#e8d398"
  sketch-pen: "#413c34"
  marker-yellow: "#f4df94"
  marker-green: "#d9e8bd"
  marker-blue: "#d6e7ef"
  toolbar-paper: "#eee4cf"
  paper: "#f5efdf"
  inspector: "#eee5d2"
  control: "#fffaf0"
  binding: "#4a3524"
  binding-hover: "#65472d"
  ink: "#332e27"
  muted: "#675f52"
  rule: "#d1c3a9"
  ochre: "#916228"
  green: "#4d7254"
  blue: "#526982"
  violet: "#81708f"
  novice: "#b7c9a7"
  band-a: "#b9cfd8"
  band-b: "#e6ca8b"
  band-c: "#d3bfca"
  unknown: "#c7c4b7"
  active-row: "#e4e9d8"
  control-border: "#b1a58c"
  shell: "#30271f"
typography:
  wordmark:
    fontFamily: 'Baskerville, "Iowan Old Style", Georgia, serif'
    fontSize: "25px"
    fontWeight: 600
    lineHeight: 1.5
  headline:
    fontFamily: '"Patrick Hand", "Avenir Next", sans-serif'
    fontSize: "31px"
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: '"Patrick Hand", "Avenir Next", sans-serif'
    fontSize: "27px"
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

## Approved walnut library — current direction

### User correction, 2026-11-06 — compact paper and physical books

The latest supplied mockup is the visual target. Header spacing is compact; the
photograph is a narrow framing band rather than a tall hero. Outer paper surfaces
use `rag-paper.jpg`, while the network, ranking list, coverage plot and character
record retain their notebook grid. The outer network page sizes to its content.
The recommended-book controls use a generated transparent leather-cover sprite,
with source-free labels rendered from the real ranked characters. A 3D spine,
page block and hinged cover replace flat rectangular controls. At rest, the volume
turns 78 degrees to expose its spine. Hover, focus or selection pulls it forward
34px, lifts it 6px and turns it toward the reader over 550ms; the cover opens
25 degrees with a 100ms delay. Reduced motion removes these transitions and leaves
a legible static book angle. Stable recommendation DOM is retained across selection
changes so touch selection can animate. Mobile uses a two-row toolbar and stacked
panels, with 44px minimum book hit areas. This correction supersedes the 240ms
flat-cover motion and full-page grid/background treatment described below.

User selected preview B on 2026-11-05. A photographic-style generated walnut bookcase
frames the paper toolbar and right inspector. The left network stays on the sketchbook
surface; recommendations and coverage stay legible on ivory paper. A shelf of up to five
real recommended characters appears above Why this next?. These native buttons select
the same character as the ranked list, with explicit accessible labels and pressed state.
Leather cover colours are decorative, not an additional vocabulary or score encoding.
Hover, keyboard focus and selection pull a book out by 5px with a 14-degree cover angle,
over 240ms. Reduced-motion preferences disable this transform and transition. Mobile
stacks A, the book shelf, B and C. Expand mode hides the shelf to focus on B or C.
`static/walnut-library.jpg` is bundled as an embedded JPEG for cloud compatibility.
This amendment supersedes earlier descriptions of the header and right inspector.

## Overview

**Creative North Star: "The Contemporary Linguistic Atlas"**

A contemporary linguistic atlas on warm paper. Noteworthy headings, the Baskerville wordmark and Songti character entries give the workspace a reference-book character; native sans-serif controls keep search, learner state and evidence practical. Quiet rules organize a dense learning tool, with a navy binding header and restrained data colour.

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

Latest user-directed library/notebook revision: Noteworthy with Segoe Print/cursive fallbacks
is intentional for section headings and handwritten graph annotations. Native controls, scores
and pinyin labels retain the readable sans-serif stack; Chinese glyphs retain Songti.
This supersedes the earlier Baskerville section-heading guidance below.

Baskerville with Iowan Old Style and Georgia fallbacks supplies only the wordmark; Noteworthy supplies section headings. Body and native controls use Avenir Next, Helvetica Neue and PingFang TC. Songti TC / Songti SC supplies large selected characters and recommendation glyphs; no web font is downloaded.

The headline and section-title roles are defined in the frontmatter. Reading text is (17px); recommendation glyphs are (26px), with reading and score at (13px). Supporting evidence is generally (12px), while dense legends and plot labels are smaller. Chart text uses the sans-serif stack. Graph label sizes adapt to the focus framing scale rather than inheriting the selected-entry size.

**The Readable Atlas Rule.** Keep the reading surface quiet and preserve the hierarchy between headings, character glyphs, controls and evidence.

## Layout

The host container has a maximum width of (1800px), with (12px) padding, reduced to (4px) at widths up to (600px). The toolbar sits above A's flexible network and B/C's (355px) inspector, widened to (390px) at (1450px). Exploration has horizontal gutters of (20px); inspector sections use (18px).

At widths up to (900px), exploration stacks above a two-column inspector. At widths up to (600px), B and C stack, toolbar search gets its own row and selected-character content wraps. At desktop widths of at least (1000px) and heights up to (830px), the graph and coverage chart compact to (306px) and (166px). The graph otherwise uses a viewport-relative height clamped between (330px) and (480px), with explicit tablet (440px) and phone (400px) heights.

Zoom buttons sit inside the map; the map hint occupies normal flow below it. The selected character entry follows the legend, separated by a rule. Focus-mode SVG framing measures label and pill extents, while overview grouping keeps its existing camera model. These are implementation facts, not a claim of exhaustive device validation.

## Elevation & Depth

Main reading regions are flat, separated by rules and tonal shifts. Only the known-character popover uses an ambient shadow (`0 12px 35px #4a352426`). Native dialogs use a navy translucent backdrop (`#4a352466`). No decorative lighting or layered card system is used.

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


## Coloured sketch UI amendment

Latest user-supplied sketches supersede the photographic toolbar. The toolbar is pale paper
#eee4cf with ink#413c34 outlines. Real native controls use double-stroke SVG border images,
not rotated hit areas or illustrated buttons. Patrick Hand is bundled and registered through
FontFace for shadow-root/cloud support (SIL OFL in static/PatrickHand-OFL.txt). Headings and
button labels use this face; Chinese, pinyin, numbers and plot axes retain their readable faces.
Marker yellow#f4df94 identifies map heading/search emphasis; green#d9e8bd identifies the active
recommendation and known action; blue#d6e7ef identifies explanation actions. These do not replace
the four quantitative signal colours or vocabulary bands. Node contours are pointer-transparent
ellipses following real circles. No data geometry or score changes. Existing paper texture retained.
No new screenshot validation: local browser API reports disabled; rendered verification is pending.
