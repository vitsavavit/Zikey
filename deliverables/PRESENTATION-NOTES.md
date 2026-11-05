# ZIKEY progress presentation notes

## Slide 1 — Problem and prototype

“My project is ZIKEY, a visual guide for choosing which Chinese character to learn next.
As a self-learner, I can read pinyin, but vocabulary lists do not explain how characters
connect or what to learn next. This progress version is a working local prototype.
I can search, inspect a character, change the learning goal, and update what I know.”

## Slide 2 — Real data

“The pilot contains 290 learning characters and 450 real vocabulary entries. TOCFL provides
the word list, pinyin and levels. Make Me a Hanzi provides structural information.
CC-CEDICT supplies English glosses. I retained the original snapshots and a quality report.
Missing information stays labelled. The subset includes the qing family for the demonstration.”

## Slide 3 — Implementation and AI

“Python prepares the data and calculates transparent scores. Streamlit holds the learner state.
A bidirectional D3 component sends graph selections back to Python. Plotly shows the scores
and coverage curves. Ollama runs the language model on my Mac. The model selects supported
evidence sentences. It does not invent the ranking or historical explanations.”

## Slide 4 — Scoring

“Each unknown character gets four signals: vocabulary prevalence, component reuse, unlock gain,
and lookup heat. I normalize and weight them. The score chart shows each contribution.
Unlock gain means a complete word becomes readable. Learning 請 unlocks 請問 only when
問 is already known. Heat starts at zero, and simulated heat is explicitly labelled.”

## Slide 5 — Live demo

1. Reset demo and search `qing`.
2. Select 請 in the graph. Show `qǐng`, sound component 青, meaning component 言.
3. Show related words and the selected character's score. 請 is not forced to rank first.
4. Click **Explain with local AI**. Explain that a cache may make repeat requests immediate.
5. Choose **See structure**, then **Read more**. The rankings and future learning curves change.
6. Mark 請 as known. Coverage rises and 請 leaves the recommendations. Unmark to reverse.

If the live demo fails, play `ZIKEY-demo.mp4`. It is a real 151-second captioned recording,
without voice narration.

## Slide 6 — Results and next work

“The system passes fourteen automated tests, including unlock rules, score arithmetic,
model failures and the known-character toggle. Five real local-model checks produced
supported output. Browser checks covered keyboard selection and several viewport widths.
The coverage comparison uses the same pilot words and the same starting learner.
It is an in-sample simulation, not proof of faster learning. Next I need richer frequency
data, linguistic review and task testing with learners.”

## Likely questions

**Is the ranking a trained ML model?**
No. It is a transparent weighted scoring recommender. The local LLM selects supporting
explanation evidence. ALS remains future work until suitable multi-learner data exists.

**Why use this LLM approach?**
It runs without paid APIs. Constraining output to source-backed sentences makes the
explanation verifiable, at the cost of free-form language flexibility.

**Do the results prove your order is better?**
No. The subset is curated and the objective includes word unlocks, which is related to
the evaluation metric. This checks implementation and explores tradeoffs. It is not a
held-out comparison, reading comprehension test or longitudinal learner study.

**Is “reuse” a complete linguistic decomposition?**
No. The pilot counts named leaf components in the source IDS. Nested hierarchies are
flattened, so some edges are indirect. The interface states this limitation.

**How much did AI help?**
Codex assisted with code, tests, data processing and presentation preparation. The local
Qwen model selects explanation evidence inside the app. Student review is still required.
Do not describe generated work as entirely handwritten or claim learner validation.

## Next milestones

- Expand data and find a suitable Taiwan Mandarin frequency source.
- Review Traditional characters, multiple readings and component labels.
- Ask 3–5 learners to attempt T1–T3 and record task completion, time and feedback.
- Revise usability, then prepare the final poster and demonstration.
