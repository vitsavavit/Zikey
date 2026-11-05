# ZIKEY 字鑰 — Progress Review content checkpoint

Status: current implementation, 5 November 2026. English presentation, 10 minutes + 2 minutes Q&A.
Author: 林維德 (Lin Wei-De), W16157093, Information Visualization, NCKU.
Purpose: validate a functioning technical/design PoC, not pitch a finished product.
Theme: the current website's library bindings, warm notebook paper and handwritten headings.

## 1. Research context — 0:00–0:30

**ZIKEY: seeing and steering what to learn next**

Mandarin self-study / Traditional Chinese literacy / Information Visualization.

The learner can read pinyin but cannot see how sounds, character components and words connect.
A long vocabulary list offers an order without showing why a character helps this learner now.

Today: demonstrate Data → AI → Visualization → Human using a working local prototype.
This checkpoint validates feasibility and interaction, not improved learning outcomes.

## 2. The learning bottleneck and proposal tasks — 0:30–1:15

Research context comes from the student's own Mandarin self-study experience.
Target: zero-to-intermediate self-learners; instructors are secondary users.

- T1 Connect sound and character: search qing and distinguish 青 qīng, 清 qīng, 晴 qíng, 請 qǐng, 情 qíng.
- T2 Connect character to words: inspect components, dictionary meanings, word prerequisites and score contributions.
- T3 Plan and compare: change a learning goal/weights and compare vocabulary coverage from the same starting learner.

Core question: Can learners inspect and steer the evidence behind the next recommended character?
Do not repeat the proposal's outdated claim that competing graph tools cannot mark known characters.
ZIKEY's intended distinction is visible score contributions and learner-relative steering.

## 3. Pipeline recap and implementation — 1:15–1:55

**Data:** preserved TOCFL workbook, Make Me a Hanzi dictionary and CC-CEDICT snapshots.
**Processing:** Python/openpyxl cleans source rows; JSON stores characters, words, typed display relationships and provenance.
**AI:** a deterministic four-signal recommender computes rank; local Ollama/Qwen selects supported explanation sentences.
**Visualization:** Streamlit synchronizes D3 graph events and Plotly coverage; all views share selection and known characters.
**Human:** search, select, change goal/weights, mark/unmark known → scores, word states and coverage recompute.

No REST API, cloud LLM, account system or trained ALS model is required for the PoC.
The learner's actions close the loop rather than merely changing a static chart.

## 4. Technology validation: raw → meaningful data — 1:55–2:55

| Source | Preserved fields | Transformation |
| --- | --- | --- |
| TOCFL 2024-09-23 | Traditional word, pinyin, level, POS, source sheet/row | Expand exact slash word forms; exclude annotated/non-CJK rows; retain raw reading |
| Make Me a Hanzi | Radical, IDS, available sound/meaning annotations | Build leaf-component scoring edges; keep typed visual relations separate |
| CC-CEDICT 2026-11-04 | Traditional headword, reading, English senses | Match reading alternatives; label neutral-tone variants; retain ambiguity |

Actual pilot: **290 learning characters / 450 vocabulary entries / 556 IDS leaf edges**.
506 total graph nodes include external structural components; overview shows the 290 learning characters.
7,292 accepted upstream word forms; bounded pilot includes demo words then earliest source rows fitting the cap.
Snapshots, URLs, SHA-256 hashes and source terms are retained. No simplified-character conversion is used for joins.

Example: TOCFL 一共 with source reading `yīgòng /gòng` → headword-compatible `yīgòng`
→ CC-CEDICT `yi1 gong4` → **in total; altogether**, with source evidence retained.

Current quality: 408 reading matches + 23 labelled pronunciation variants + 2 reviewed demo senses;
11 entries still require sense review, and 6 lack an exact dictionary entry in this snapshot.
30 characters lack etymology records. Missing fields are never fabricated by the model.

## 5. What the AI actually does — 2:55–3:55

**Local backend:** Ollama `qwen2.5-coder:7b`, loopback `/api/chat`, temperature 0.

Input: selected character plus evidence computed from the current learner state: strongest score contribution,
pilot prevalence, unlocked words and source-backed components where available.
Output: 1–2 verbatim supported English evidence sentences, under a JSON schema.
Validation: every returned sentence must belong to the supplied evidence set; unsupported/repeated output is rejected.
Failure: explicit **Template fallback**; repeated valid explanations may be cached and labelled **cached**.

The numeric rank comes from the displayed weighted formula. The LLM neither trains that rank nor invents etymology.
The AI role is constrained evidence selection for a learner-specific explanation, not free-form generation.
Whether this adds value beyond a template is **not established** and is a question for this review.

Evidence: five supported-output checks succeeded (three fresh requests 5.5–13.6 seconds, two cache hits ~0.01 seconds).
This is a small local validation run, not a hardware performance benchmark or a broad hallucination evaluation.

## 6. Primary visual encodings and score — 3:55–4:40

A — Character Network: radical-group overview → documented sound family/character focus.
Circle = learning character; diamond = structural context; size = pilot vocabulary prevalence.
Colour = band derived from the earliest pilot word containing the character, not an official character level.
Sound / meaning / IDS leaf edges have distinct colours; check = known; ochre ring = recommendation.
Outer word ring: solid = all distinct characters known; dashed = one missing character.
Packing proximity is layout only. Modern sound/tone need not match a historical sound component.

B — Why This?: top five + stacked contributions + goal presets + advanced weight controls + explanation.
C — Coverage Compare: x = additional characters; y = pilot vocabulary entries whose characters are all known.
Native Expand/Restore views enlarge A/B/C and preserve learner context; Escape returns to the workspace.

Score = sum(weight × max-normalized signal), excluding known characters.
Default weights: prevalence35 / reuse25 / unlock40 / heat0.
Read more:25/15/60/0. See structure:15/65/20/0.
Prevalence counts vocabulary entries; reuse counts flattened named IDS leaves; unlock counts newly readable entries.
Heat is zero by default, or opt-in session lookup totals; simulated heat is labelled separately.

## 7. Live PoC: one complete learner task — 4:40–7:40

**Question: Which character should I learn next, and what does it unlock?**

1. Start with the labelled sample learner: 21 known characters, 450-word pilot, coverage4.9%.
2. Search qing → select 請. Show 青 sound component, 言 meaning component and dictionary word details.
3. Open 請問: English meaning **Excuse me, may I ask...?**; 問 is known and 請 is missing.
4. Request local AI; read its actual status (fresh, cached or fallback) and link the reason to the displayed evidence.
5. Change to See structure: 青 becomes first within this family while 請 remains selected.
6. Return Default. Mark 請 known:21→22; coverage4.9→5.6%; three word entries become readable; 請 leaves ranking.
7. Unmark to show reversibility. Expand a panel if needed; Restore/Escape retains the task context.

Important counterexample: learning 請 alone does not unlock 請問 when 問 is unknown.
If a live service fails, use current screenshots and identify them as backup evidence, not live interaction.
Do not use the old-theme recording as a recording of the new interface.

## 8. Validation results and boundaries — 7:40–8:20

24 automated tests pass: unlock prerequisites, repeated-character handling, score totals, nonnegative/zero weights,
monotonic coverage, source/sense matching, family fallback, display-edge independence and action acknowledgements.
Current browser checks: repeated title clicks remain responsive; search, selection, word details,
Expand/Restore A/B/C and goal changes work. Scope of current visual QA is limited; exhaustive device testing is pending.

Same sample learner, same 450 entries, 100 additional characters, recommendation recomputed at every step:
Vocabulary source order40.0%; Default58.2%; Read more58.4%.

These are in-sample simulations on a curated subset, not held-out prediction, real-text comprehension,
a learner study or evidence that ZIKEY teaches better. Baseline is vocabulary level/source-row order, not textbook order.

## 9. Roadblocks: fixed and still open — 8:20–8:55

| Issue | Observed result / current response | Remaining limitation |
| --- | --- | --- |
| Glosses appeared absent | Split reading alternatives; label neutral-tone differences; show available senses directly | 11 ambiguous/unmatched entries + 6 missing dictionary entries |
| Clicking title could freeze controls | Reproduced no-op navigation; every action now carries a changed acknowledgement | Restart was required to load cached Python module; repeat/device coverage remains limited |
| Local AI waiting / unsupported prose | Cache, JSON schema, evidence whitelist and explicit fallback | Fresh requests took5.5–13.6s; relevance beyond templates is untested |
| Dense graph and rendering | Bounded290-character set, focus framing, panel expansion; Plotly shadow-root layer positioning fixed | No10,000-node benchmark; no systematic rendering latency measurement |

Do not claim the model cannot hallucinate generally: this implementation restricts the allowed output.
Do not report unresolved language fields as completed expert validation.

## 10. Next steps and evaluation — 8:55–9:30

1. Data/AI validation: review11 unresolved senses and6 missing entries with a Chinese-language reviewer;
   verify23 source-pronunciation variants and acquire licensed corpus frequency.
2. Usability check:3–5 Mandarin self-learners perform T1–T3; record completion, time, mistakes and explanation usefulness.
3. Final system: refine encodings from task evidence, benchmark rendering/model latency and test on a held-out vocabulary set.

ALS is deferred until sufficient multi-user data exists. Accounts/cloud/full10,000-node graph are outside this PoC.
A short task study tests usability; it does not establish long-term learning effectiveness.

## 11. Feedback requested — 9:30–9:50

- Is constrained local-LLM evidence selection meaningful enough for this checkpoint, or should the next test compare grounded free-form explanations with templates?
- Are sound-family relationships and dictionary readings distinguishable without implying identical pronunciation?
- Is vocabulary-order coverage an acceptable provisional baseline while real textbook order/corpus data is unavailable?

Ask for specific changes to the next evaluation, not a general rating of the product.

## 12. References and AI disclosure — 9:50–10:00

CC-CEDICT contributors. (2026). *CC-CEDICT* [Data set]. MDBG. Retrieved November4,2026, from https://www.mdbg.net/chinese/dictionary?page=cc-cedict

Hanzi Constellation. (n.d.). *Explore* [Interactive visualization]. Retrieved November4,2026, from https://hanzi-constellation.app/explore?c=青

skishore. (n.d.). *Make Me a Hanzi* [Data set]. GitHub. Retrieved November4,2026, from https://github.com/skishore/makemeahanzi

Steering Committee for the Test Of Proficiency–Huayu. (2024). *華語八千詞表* [Chinese vocabulary list]. https://tocfl.edu.tw/tocfl/assets/files/vocabulary/8000zhuyin_202409.zip

Development disclosure: Codex assisted data preparation, code, tests, visual design and slides.
Runtime disclosure: local Qwen selects supplied evidence; deterministic code computes rank and coverage.
Notebook texture is AI-generated material; the library image was supplied by the user. Neither is research data.
Raw TOCFL redistribution permission was not established; keep the source bundle local for coursework.

## 13. Backup: proposal → current PoC (Q&A only)

| Proposed direction | Current implementation | Reason / limitation |
| --- | --- | --- |
| Corpus frequency | Pilot vocabulary prevalence | Licensed corpus pending |
| Community heat / ALS | Zero or opt-in session heat; no trained ALS | No adequate multi-user history |
| Claude Haiku explanation | Local Qwen selects supported sentences | On-device PoC; usefulness still needs comparison |
| Textbook order / text coverage | Vocabulary source order / pilot word coverage | No supplied textbook sequence or corpus |
| Full large character graph | 290-character overview + bounded focus | Scalability not benchmarked |
| Speak goal | Default / Read more / See structure | No signal measuring speaking benefit |

These are explicitly scoped adaptations, not features claimed as finished.

## Requirement coverage map

| Requirement | Visible evidence |
| --- | --- |
| Domain specificity / research context | Slides1–2; student Mandarin self-study bottleneck and T1–T3 |
| Working interactive prototype | Slides3/6/7; live search, selection, goals, known states and linked views |
| Meaningful AI integration | Slide5; actual local model input/output, validation, fallback and honest open question |
| Data → AI → Visualization → Human | Slide3 and complete interaction loop in slide7 |
| Raw → meaningful dataset | Slide4, example一共, preserved snapshots/provenance and quality counts |
| Live one-core-task PoC | Slide7 with before/after state and unlock prerequisite |
| Technical/design validation | Slides5/6/8; AI checks, explicit encodings,24tests and limitations |
| Roadblocks and next steps | Slides9–10, with fixed/open status separated |
| Actionable feedback | Slide11 |
| English /10min+2minQ&A /APA7 /AI disclosure | Timings above and slide12 |

## Current limits on completion claims

The running web PoC is working; final library-theme visual QA/documentation from the preceding task is not complete.
The slide update takes priority. No course-platform submission has been performed. Native PowerPoint opening remains unverified.
