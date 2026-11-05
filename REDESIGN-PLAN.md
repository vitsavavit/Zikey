# ZIKEY: Galaxy learning redesign

Status: implementation authorized, 5 November 2026. QA corrections below are binding.
Confirmed user decision: hybrid entry, with a galaxy overview that zooms into a focused learning
view after search or group selection. Returning to Overview restores the previous camera position.
The user explicitly selected this entry flow and authorized implementation for the progress review.

## Progress review delivery contract

The supplied Week6_ProgressReview_Instruction.pdf is headed Week 9. Follow its actual requirements:
submission by 5 November, 11:59 AM; an English .pptx or .pdf named
W16157093_Lin_ProgressReview; 10 minutes presentation plus 2 minutes Q&A; APA 7 references.
Prove Data → AI → Visualization → Human, show raw-to-processed transformation, demonstrate one
core task live, and state real roadblocks and next steps. Use nine slides with a timed 10-minute
script; the previous six-slide deck is an earlier iteration, not the final submission.

## Resolved QA decisions

- Radical clicks enter radical focus and keep Overall recommendations. A selected character uses
  its documented phonetic parent, or itself when it has documented phonetic children. Otherwise
  show character structure/words and disable This family. Families contain one named root and its
  direct documented children only. External roots are context, not learnable candidates. Pinyin
  results may span families; result selection determines the family. Empty/known families show an
  explicit empty state. Overview restores its own saved camera.
- Name node colour **Vocabulary band — derived from pilot words** and retain the earliest pilot
  word and source level as evidence. This is not an official character level. No new level filter
  is required for this progress milestone.
- Preserve TOCFL POS/context, but do not claim a structured POS join with CC-CEDICT. Match readings
  with tones for sense selection, prefer a unique common-use sense, retain alternatives, and use
  source-checked corrections for 青/清. Ambiguous or missing matches remain labelled for review.
- Preserve the original IDS edge pairs for scoring. Store typed display relations separately;
  multiple kinds on the same pair never increase scoring degree. Add regression tests for this.
- These decisions override less specific wording in the original sections below.

## 1. Product purpose and evidence

Preserve the proposal's T1–T3 and three linked views: connect sound to characters, understand
which words a character unlocks and why it is recommended, then steer and compare learning orders.
Primary users remain Mandarin self-learners from zero to intermediate. UI and explanations remain
English with Traditional Chinese. Run locally with the existing Python/Streamlit/D3/Plotly/Ollama stack.

Sources reviewed:

- W16157093_Lin_ProjectProposal.pptx, especially slides 2 and 4–7.
- The supplied Claude chat and galaxy reference image.
- https://hanzi-constellation.app/explore?c=青 and https://hanzi-constellation.app/sky,
  inspected on 4 November 2026.
- Existing ZIKEY app, processed data, screenshots and verification records.

The inspected reference already supports learned-character marks, word unlocks, a learning plan
and displayed coverage. Do not claim those features alone distinguish ZIKEY, or repeat the old
proposal's blanket claim that the reference does not adapt to known characters. Its inspected
screens did not expose ZIKEY-style four-signal contribution bars and adjustable weights. Position
ZIKEY around inspectable, learner-relative recommendations and interactive steering. Do not claim
worldwide novelty from this limited comparison.

Use the supplied image's hierarchy and overview-to-detail behavior as inspiration. Every star
represents real data. Cluster proximity is layout, not measured linguistic similarity. Do not
add decorative star particles that viewers could mistake for additional characters.

## 2. Proposal alignment and necessary corrections

| Proposal element | Revised implementation target |
| --- | --- |
| A: Heat Network | Galaxy overview plus focused character/component network, with the proposed outer word ring |
| B: Why This? | Five compact ranked rows, four-part scores, clear candidate scope, goal presets and Advanced weights |
| C: Coverage Compare | Visible next to the network, rather than far down the page; three honestly computed orders |
| Sound and structure | Separate documented phonetic relationships from exact modern-pinyin search matches |
| Character-to-word learning | Word status and missing characters visible directly in the focus view |
| AI explanation | Retain local evidence selection, labelled as such, rather than claiming Claude Haiku/free-form generation |
| Frequency, heat and ALS | Label prevalence as a proxy; keep heat absent or visibly simulated; ALS remains unimplemented |

Keep learner level and learning goal separate. TOCFL level is a filter/encoding; Read more and
See structure are scoring goals. Do not replace goals with Beginner/Intermediate/Advanced.
Do not restore a Speak preset without an appropriate speaking-oriented signal.

Coverage remains the percentage of complete entries readable in the same pilot vocabulary.
The x-axis counts additional learned characters, with a reference at 100. Use grey for vocabulary
order, green for Default and blue for My goal. The vocabulary-order baseline is not a textbook order.
Never position curves to guarantee an AI win. Replace these labels only when the actual corpus
or textbook sequence is supplied and implemented.

## 3. Layout and learning flow

Desktop composition, targeting 1440×900 and 1280×800:

```text
+------------------------------------------------------------------+
| ZIKEY   Search character / pinyin    Goal     Known characters     |
+------------------------------------------+-----------------------+
| A · Learning galaxy                      | B · Why this next?    |
|                                          | Overall / This family |
| Overview: radical groups                 | Five compact ranks    |
| Focus: sound family and component links  | Score contributions   |
| Selected character with an outer         | Supported explanation |
| ring of related words                    +-----------------------+
|                                          | C · Coverage compare  |
| Selected reading, meaning, missing parts  | Three learning orders |
| and Mark as known in a compact footer    | Same starting learner |
+------------------------------------------+-----------------------+
```

Reserve approximately 70% of content width for A and 30% for B/C. Remove the large introductory
hero and tall metrics row from the operating screen. Keep search and goal accessible while
exploring. At desktop sizes, the graph, recommendation rationale and coverage comparison must
be visible together without scrolling through character tables. Advanced controls stay collapsed.
On mobile, stack A, B and C with a collapsible control drawer and a selected-character summary.

Three states of the same page:

1. **Overview:** show the 290 learning characters grouped by their documented dictionary radical.
   Label large groups at low zoom and reveal smaller group labels with zoom/hover. Every character
   has a radical in the current data. Avoid drawing every relationship at this scale.
2. **Family focus:** search `qing` or select a character, then zoom into the documented phonetic
   family. Show the root and related characters, their actual pronunciations and selected links.
   Keep a visible Overview return control and retain the previous overview camera position.
3. **Learning focus:** select 請 to see 青 as its sound component, 言 as its meaning component,
   its English gloss, word ring, unlock preview and rationale. The explicit Mark as known action
   commits the change; simply opening a character or word never marks it known.

Radical groups are dictionary groupings, not guaranteed semantic categories. Current data has
documented phonetic fields for 111/290 characters across 98 named phonetic parents, so phonetic
families alone would create many sparse or unsupported overview groups. Use them in focus mode,
where the source provides the relation. Missing phonetic information stays unknown, not inferred
from similar spelling or supplied by the LLM.

## 4. Visual encodings and interactions

User-approved style amendment (5 November): use a contemporary reference-book surface with
warm paper, ink text, a navy toolbar and subtle rules. Use Ming-style Chinese glyphs and restrained
serif headings; controls remain readable sans serif. No glow, faux grain or book ornaments.
Preserve the existing A/B/C layout, data, scoring and learning flow. The galaxy effect comes from
real clustered nodes and zoom, without continuous rotation or animated orbital motion.

| Visual feature | Meaning |
| --- | --- |
| Enclosing group | Source dictionary radical, with explicit group label |
| Character circle | A learning character; components outside the vocabulary use a different shape |
| Circle size | Current vocabulary prevalence proxy; later corpus frequency only when available |
| Circle colour | Band derived from pilot words, including Novice and Unknown legend entries |
| Fill intensity | Heat only when real session data or explicitly labelled simulation is active |
| White selection halo | Currently selected character |
| Gold outer ring | Best recommendation within the displayed recommendation scope |
| Small check mark | Already known; do not reuse heat brightness for this state |
| Typed edge | Source-backed phonetic, semantic or decomposition relation |

Keep existing IDS leaf relations labelled as leaf relations. They are not necessarily immediate
top-level components. Use documented etymology fields for sound/meaning highlights. Show only
selected relations in focus mode and retain source details in a compact information panel.

The outer ring displays up to six related words in level/source order, with remaining entries
available through a count-labelled list. A solid word pill means readable now; a dashed pill
means exactly one distinct character is missing. Other blocked words remain available in the list
with their exact missing-character count. Each state also has a text label. Clicking a word shows
its meaning, reading and missing characters; selecting a missing character navigates to it.

`qing` search matches modern pronunciations without tone filtering, while preserving tones in
the labels. 睛 can appear through the 青 phonetic family but is labelled jīng and is not reported
as an exact qing match. Similar components do not guarantee identical modern pronunciation.

Zoom reveals detail progressively. Include visible zoom/reset controls, keyboard node selection
and a list alternative. Keep labels readable and respect reduced-motion settings. Selecting a node
does not rearrange the entire map. Weight changes update ranking and highlights without losing
selection, search or camera position.

## 5. Recommendation scope and differentiating moment

The current app searches qing while showing global recommendations such as 點 and 學. This is
computed correctly but confusing during a family-learning task.

- In Overview, B defaults to **Overall**: all unknown learning characters.
- In Family focus, B defaults to **This family**, explicitly labelled with the family name.
- Preserve the global scoring calculation and normalization. Family mode filters that ranking;
  it does not secretly change the model or rescale scores. Show fewer than five rows when needed.
- A small Overall next indicator remains available in family mode. Mark recommendations and
  displayed rank with their scope, never presenting a family winner as a global winner.
- Coverage always compares overall learning plans from the same current known set, even while
  a family is selected. State this next to C.

With the existing sample learner and Default weights, 請 already ranks first within the 青 family
(score 0.315), while 點 ranks first globally. This supports the proposal's demo without faking a
ranking. Learning 請 currently unlocks the entries 請, 請問 and 請客 because 問 and 客 are already in
the labelled sample known set. With either missing, the corresponding multi-character word must
remain blocked.

The differentiating interaction is **inspect, steer, predict, commit**:

1. Select a character and inspect its four score contributions.
2. Preview the exact words that become readable if it is learned.
3. Change a goal/weight and see the actual rank and coverage changes, including unchanged ranks.
4. Mark it known and observe the real vocabulary-state update.

Keep the local model's evidence-only contract and fallback. Call it local LLM evidence selection,
not a trained recommendation model or unrestricted historical explanation. Sliders update
deterministic calculations without waiting for a new LLM call.

## 6. Data work before visual implementation

Fix sense selection before reusing English glosses in the teaching view. Current examples:

- 青 displays the Qinghai abbreviation in the word table, despite a general green/blue/youth sense
  also existing in the dictionary snapshot.
- 清 displays a dynasty/surname gloss before its ordinary clear/clean sense.

Retain all dictionary senses and readings. Match the TOCFL entry's reading and part of speech,
prefer an appropriate common-use sense over a proper-name-only entry where the source supports
that choice, and expose alternatives when ambiguity remains. Do not blindly choose the first
CC-CEDICT record. Preserve TOCFL part of speech and source context in processed data. Do not ask
the LLM to invent a missing gloss. Add regression tests for 青 and 清 and review at least the
complete demo family and its displayed words before updating presentation claims.

Keep missing glosses, origin fields and unknown decompositions visible in the quality report.
Retain real/simulated heat separation and opt-in logging. No ALS or new corpus is required to
finish this UI revision.

## 7. Implementation sequence and deliverables

Reuse core scoring, coverage calculations, local AI integration and their regression tests.
Rework the graph component and screen composition rather than rebuilding the application stack.

| Phase | Work | Acceptance evidence |
| --- | --- | --- |
| 1 | Correct senses, retain POS/context, derive radical groups and documented relation types | Data assertions and demo vocabulary review |
| 2 | Compact A/B/C layout, paper canvas, stable overview/focus camera and family navigation | Desktop screenshots at 1440×900 and 1280×800 |
| 3 | Word ring, missing-character drill-down, scoped ranks and unlock preview | Complete qing → 請 → words → steering → mark/unmark demo |
| 4 | Browser checks, revised six-slide progress deck, rerecorded captioned demo | Passing checks and screenshots/recording of the actual revised app |

Add UI state only where needed: overview/focus mode, selected family/word, recommendation scope
and camera transform. Keep `selected_character` and the known-character set shared across A/B/C.
Add source-backed relation types to processed edges. Keep learned state and camera stable during
normal rerenders. No public API or cloud service is needed.

Update the progress presentation around: learner problem and revised reference comparison; actual
data and quality; galaxy encodings; scoped explainable recommendations; T1–T3 live interaction;
coverage evidence and remaining work. Use new real screenshots and a new 2–3 minute demo after
implementation. Preserve the submitted proposal and document PoC deviations instead of silently
rewriting its historical AI disclosure. Future Meaning Map remains explicitly future work.

## 8. Checks and limits

- Preserve all existing core and fallback tests. Add sense-selection and typed-relation checks.
- qing results and phonetic-family membership remain distinct, including 睛 jīng.
- Overall versus family rank labels agree with actual candidate scope; known characters disappear.
- Word-ring styles agree with the same unlock rules as coverage and the word list.
- Goal/weight changes preserve camera and selection. No forced ranking or curve improvement.
- A/B/C are simultaneously usable on the target desktop sizes; mobile remains usable by stacking.
- Keyboard search, node selection, words, mark/unmark and zoom controls work with visible focus.
- Local-model failure leaves ranking, word learning and coverage usable.
- Heat, frequency proxies, simulation and missing data remain truthfully labelled.
- The learner can explain why 請 was suggested and identify what is still needed to read 請問.
  Validate this last criterion with a learner; automated tests do not establish comprehension.

This revision does not claim corpus-level reading comprehension, established learning benefit or
novelty over every competing product. Linguistic review and learner task evaluation remain required.
