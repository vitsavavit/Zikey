# ZIKEY redesign plan QA

Review date: 5 November 2026 (Asia/Taipei).
Verdict: **READY WITH FIXES**. The direction supports proposal tasks T1–T3, but four decisions
must be added before treating the plan as a complete implementation handoff.

This is an independent review of the plan, cross-checked against the original proposal,
current code and pilot data. It does not certify the unbuilt galaxy UI or learner comprehension.
The source plan and application code were not changed by this review.

## What is sound

- The confirmed hybrid entry preserves overview-to-detail learning and a return to the prior camera.
- A/B/C remain linked, with visible scoring and steering rather than a decorative galaxy alone.
- Global and family recommendations are distinguished; coverage uses the same starting learner.
- Frequency proxies, missing fields, simulated heat and local AI are disclosed instead of overstated.
- Baseline and AI curves must show computed results. Competitor comparisons avoid unsupported novelty.

## Findings and minimum resolutions

### QA-01 · P2 · Missing navigation and family-membership rules

Plan: [lines starting at 87](/Users/7svv/Info-viz/zikey/REDESIGN-PLAN.md:87), also 142–149.

Selecting a radical group does not identify a phonetic family. Of the 290 pilot characters,
179 lack an etymology.phonetic value; some can still be roots for documented children. A phonetic
root can also be outside the learning vocabulary. The current plan does not define all these paths.

Minimum resolution:

- A radical-group click enters radical-group focus while keeping recommendation scope Overall.
- For a selected character, use its documented phonetic parent when available; otherwise use the
  character itself when it has documented phonetic children. If neither exists, show its structure
  and words with This family unavailable and an explanatory label.
- Family membership is the named root plus characters whose documented phonetic field names that
  root, restricted to one hop. Structural roots outside the pilot are contextual nodes, not candidates
  for recommendation, known-character marking or coverage.
- Tone-insensitive search can produce characters from several families. Show matching results and
  let the selected character determine family context, rather than assuming a syllable is one family.

Close when tests cover a radical-group click, 青 as a root, 請 as a child, a character without a
documented family, an external root, and a multi-family pinyin result. Overview return must restore
the stored camera. An entirely known family must have an explicit empty recommendation state.

### QA-02 · P2 · Character colour overstates the source level

Plan: [line 111](/Users/7svv/Info-viz/zikey/REDESIGN-PLAN.md:111).
Code evidence: [prepare_data.py line 105](/Users/7svv/Info-viz/zikey/scripts/prepare_data.py:105).

Current character colour comes from the earliest selected pilot word containing the character.
It is not an official character-level syllabus, and it is not necessarily the earliest occurrence
in the complete upstream vocabulary. For example, 青 is B because its selected standalone pilot
entry is Level 4. The plan's unqualified TOCFL-band label hides this derivation.

Minimum resolution: retain the current derivation for this PoC and label it
**Vocabulary band — derived from pilot words**. Preserve and display the source word/level in
the tooltip or details. Keep Unknown for characters with no supporting vocabulary entry. Do not
call it an official character level without obtaining an appropriate source.

Close when the plan states this derivation and legend, tooltip and processed-data provenance agree.
Changing colour metadata alone must not change ranking or coverage.

### QA-03 · P2 · Sense selection assumes a POS join that is unavailable

Plan: [lines starting at 176](/Users/7svv/Info-viz/zikey/REDESIGN-PLAN.md:176).
Code evidence: [prepare_data.py line 74](/Users/7svv/Info-viz/zikey/scripts/prepare_data.py:74).

TOCFL POS/context can be retained from the source, but parsed CC-CEDICT senses contain only
pinyin, meaning and simplified form. There is no structured POS field to join automatically.
The wrong first-sense choices for 青 and 清 are existing implementation defects already correctly
recognized in the plan; the remaining gap is a feasible selection rule.

Minimum resolution:

- Preserve TOCFL POS/context as context, without claiming a structured dictionary POS match.
- Compare readings with tones retained for sense selection. This is distinct from tone-insensitive
  user search. Proper-name capitalization and candidate definitions must remain available for review.
- Use explicitly reviewed, source-referenced corrections for the demo entries. Keep alternative
  senses; when ambiguous, show alternatives or Needs review instead of silently choosing the first.
- Do not generate missing meanings with the LLM.

Close when 青/清 ordinary senses are correct in the learning view, alternative proper-name senses
remain available, and tests cover ambiguous readings and absent dictionary entries.

### QA-04 · P2 · Typed display relations need a stable scoring contract

Plan: [lines starting at 199](/Users/7svv/Info-viz/zikey/REDESIGN-PLAN.md:199).
Code evidence: [core.py line 39](/Users/7svv/Info-viz/zikey/core.py:39).

The current core consumes source/target pairs and calculates reuse from IDS-graph out-degree.
One pair, such as 青 → 請, can carry both a decomposition relation and a phonetic relation.
Adding typed relations without a contract could break the input schema or count/display relations
inconsistently. This is a future integration risk, not evidence that current pilot scores are wrong.

Minimum resolution: keep the original IDS edge set as the scoring input. Store typed display
relations separately, allowing multiple relation kinds on a pair without creating extra scoring
neighbors. Explain that sound/meaning highlights and IDS leaf relations have different provenance.

Close when adding display metadata leaves all raw reuse counts, scores, rankings and coverage
curves unchanged for a fixed known set, weight vector and heat input. Include a multiple-kinds-per-pair
test and verify the existing core suite still passes.

## Supporting observations, not extra scope

- The pilot contains 114 radical groups, including 57 single-character groups. Capture the real
  overview before judging readability; large clusters in the reference image are not evidence
  that the pilot will have the same distribution.
- A current 100-step comparison took about 0.295 seconds in one local run. This supports feasibility,
  but does not establish end-to-end UI latency. Keep LLM calls outside the steering update path.
- Current network.js replaces the SVG on rendering. The planned stable camera/selection behavior
  requires an implementation change and browser checks; it is not already provided by the prototype.
- Existing passing tests verify the existing prototype, not the new galaxy, word ring or scoped UI.

## Release boundaries

The plan can be handed to implementation after QA-01 through QA-04 are explicitly resolved in
the plan. The resulting UI still needs the planned desktop, mobile, keyboard and failure-state
checks, with real screenshots and a fresh demo. Learner comprehension remains a separate,
human-evaluated criterion. No new dependencies, model training or cloud service are required by
these plan corrections.


## Final implementation re-review — 5 November 2026

Independent agent verdict: READY for progress demo. All four plan decisions implemented;
22/22 Python tests pass. Additional fixes verified: logging opt-out removes heat, search preserves
verified reading alternatives, horizon label uses actual curve length. Browser DOM diagnosed three
Plotly SVG layers stacking outside the shadow component; local positioning CSS fixed it.
Final screenshots Overview/Focus/Known/Steering/AI were independently visually re-reviewed at
1440×1000: complete header/footer, all A/B/C, coverage legend/axis inside panel.
No material finding remains in the reviewed scope. Not a learner study or exhaustive viewport audit.
