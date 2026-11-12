# ZIKEY · Progress review speaking script

อ้างอิงไฟล์ W16157093_Lin_ProgressReview.pptx จำนวน 9 สไลด์
บทพูดภาษาอังกฤษพร้อมคิวภาษาไทย เตรียมสำหรับประมาณ 7–9 นาทีรวมเดโม
ข้อมูลตรวจจากโค้ดและรายงานใน repository วันที่ 12 พฤศจิกายน 2026

## สถานะเว็บที่ตรวจรอบนี้

- เว็บสาธารณะ https://zikey-library.streamlit.app/
- โค้ดแอปล่าสุด 6ad02f0 และ deployment refresh 5496843
- หลัง deploy พบ bundle เก่ายังไม่โหลด createLibraryOverview จึง refresh runtime และตรวจใหม่จนผ่าน
- ตรวจเว็บจริงด้วย Full library → เปิด 青 → เลือก 請 → หน้ากระดาษที่แสดง 請問 และกด Back to book กลับได้
- ชุดทดสอบ 32 รายการผ่านก่อน deploy การตรวจเว็บจริงเป็น smoke test ของเส้นทางนี้
- บทพูดจัดเป็นภาษาอังกฤษตามภาษาของสไลด์ พร้อมคิวไทย ไฟล์ PPT ต้นฉบับยังเป็นเนื้อหาที่ผู้ใช้ส่งมา

## ก่อนขึ้นนำเสนอ

สไลด์บันทึกสถานะก่อนการพัฒนา 3D ล่าสุด บทพูดด้านล่างแยกสถานะในสไลด์กับสถานะปัจจุบันแล้ว

- Slide 1 ระบุ local prototype ปัจจุบันมีเว็บ Streamlit สาธารณะแล้ว
- Slide 2 และ 5 ระบุ Ollama / local AI บนเว็บสาธารณะตั้งต้นเป็น template ตามข้อมูลที่คำนวณ ไม่มีการเรียกโมเดลในโหมดนี้ โค้ดมีตัวเลือก Ollama เมื่อมีเซอร์วิสเข้าถึงได้
- Slide 3 ระบุขาดคำแปล 6 รายการ และต้องทบทวน 84 รายการ รายงานปัจจุบันระบุ 0 และ 11 รายการตามลำดับ ส่วน origin records ที่ขาดยังเป็น 30 รายการ ตัวเลขนี้สะท้อนกฎในรายงาน ไม่ใช่ผลตรวจภาษาโดยผู้เชี่ยวชาญครบทุกคำ
- Slide 4 การใช้สีและขนาดตามข้อความในสไลด์อธิบายกราฟ 2D ส่วนหนังสือ 3D ใช้ปกแยกกลุ่มและตำแหน่งเพื่อจัดพื้นที่ ห้ามอธิบายว่าสีปกหรือความลึกเป็นระดับภาษาหรือความยาก
- Slide 7 ระบุ 22 tests ปัจจุบันผ่าน 32 tests เวลา AI 5.5–13.6 วินาทีและ 5 local-AI checks เป็นผลที่บันทึกในสไลด์ครั้งก่อน ยังไม่ได้วัดใหม่รอบนี้
- Slide 8 ระบุ cloud hosting อยู่ในงานเลื่อนออกไป ปัจจุบัน deploy แล้ว ส่วน ALS บัญชีผู้ใช้ และกราฟ 10,000 โหนดยังเป็นงานอนาคต
- Slide 9 เพิ่มการเปิดเผยว่าฉากห้องสมุดโดมเป็นภาพสร้างด้วย AI ส่วนหนังสือ โหนด และเส้นเชื่อมเป็นวัตถุและปฏิสัมพันธ์ใน Three.js
- ตัวเลข coverage บน Slide 7 เป็นผลของสถานะผู้เรียนและอักษรที่เลือกในครั้งนั้น ให้รายงานตัวเลขบนเว็บจริงขณะเดโม ห้ามสัญญาว่าเพิ่มอักษรใดก็จะได้ 5.6%

## บทพูดหลักฉบับกระชับ 7–8 นาที แล้ว Q&A 2–3 นาที

ใช้ส่วนนี้เป็นสคริปต์หลักในการนำเสนอ ส่วนบทพูดรายละเอียดด้านล่างเก็บไว้ตอบคำถาม

### คำอ่านที่ใช้ระหว่างพูด

- 青 `qīng` ประมาณ “ชิง” เสียงสูงคงที่
- 清 `qīng` ประมาณ “ชิง” เสียงสูงคงที่
- 晴 `qíng` ประมาณ “ชิง” เสียงไต่ขึ้น
- 請 `qǐng` ประมาณ “ฉิ่ง” เสียงต่ำแล้วกลับขึ้น
- 情 `qíng` ประมาณ “ชิง” เสียงไต่ขึ้น
- 睛 `jīng` ประมาณ “จิง” เสียงสูงคงที่
- 問 `wèn` ประมาณ “เวิ่น” เสียงตก
- 請問 `qǐngwèn` ประมาณ “ฉิ่งเวิ่น” หมายถึง “excuse me” หรือ “may I ask”

### Slide 1 — 40 วินาที

“Hello, I’m Lin. ZIKEY is an interactive learning tool for Traditional Chinese. It helps answer one practical question. Which character should I learn next, and why?

For example, I start with the sound family `qing`. 青 is `qīng`, 清 is also `qīng`, 晴 is `qíng`, 請 is `qǐng`, and 情 is `qíng`. They look related, but their readings and tones are not identical. ZIKEY makes those connections and differences visible, then recommends a next step from the learner’s current knowledge.”

### Slide 2 — 45 วินาที

“The pipeline is Data to AI to Visualization to Human feedback. I combine TOCFL vocabulary levels, Make Me a Hanzi character structures, and CC-CEDICT English senses. Python and NetworkX turn them into a character and word graph.

For the word 請問, pronounced `qǐngwèn`, the system stores the two distinct characters 請 `qǐng` and 問 `wèn`. It can then test whether a learner knows both characters, rather than assuming the whole word is readable.”

### Slide 3 — 35 วินาที

“This proof of concept uses 290 characters, 450 vocabulary entries, and 556 component edges. It is deliberately a pilot dataset, not a claim of full Chinese coverage.

The data quality report is visible. The current processing report has zero missing word glosses, eleven senses needing review, and thirty characters without origin records. Missing evidence stays missing. The system does not invent it.”

### Slide 4 — 45 วินาที

“The learner can explore a 2D graph or an immersive 3D library. In the 2D graph, colour is a vocabulary band and size is vocabulary prevalence in this pilot set.

In the 3D library, a book is a sound family or a radical group. For example, 青 `qīng` connects to 請 `qǐng` through a documented component relationship. The library is for exploration. The edges and source data remain the evidence.”

### Slide 5 — 45 วินาที

“The recommendation is not a black box. It combines vocabulary prevalence, component reuse, unlock gain, and heat. For the default goal, the weights are 35, 25, 40, and 0 percent.

The important rule is unlock gain. Learning 請 `qǐng` does not unlock 請問 `qǐngwèn` unless 問 `wèn` is already known. Changing the goal changes the weights, and marking a character known recalculates the ranking and coverage.”

### Slide 6 — 2 นาทีเดโม

“Now I will show one complete task. I search `qing`. The result separates same-looking sound families from the exact current reading. I select 青 `qīng`, then inspect 清 `qīng`, 晴 `qíng`, 請 `qǐng`, and 情 `qíng`.

I open 請 `qǐng` and show its component and related words. The system shows that 請問 `qǐngwèn` still needs 問 `wèn`. Next, I change the learning goal and select Mark as known. The recommendation list and coverage update from the same learner state.

In the 3D view, I can open the related book, inspect a character on the paper spread, then close it or step back through the navigation history. This is interactive exploration, not a static chart.”

### Slide 7 — 35 วินาที

“The current codebase has 32 automated tests passing. They cover scoring, unlock logic, coverage monotonicity, and navigation history. I also tested the core browser path.

The coverage value is the share of pilot vocabulary whose distinct characters are all known. It is not a percentage of all Chinese text a learner can read.”

### Slide 8 — 35 วินาที

“The main limitation is that this is a 290-character pilot and not evidence that users learn faster. The public deployment uses a clearly labelled template explanation, not a paid cloud LLM. Ollama remains an optional local experiment.

Next, I will expand and review the data, measure interaction latency on devices, and run task-based tests with learners. ALS, accounts, and a 10,000-node graph are intentionally deferred.”

### Slide 9 — 25 วินาที

“The data sources are TOCFL, Make Me a Hanzi, and CC-CEDICT. The library background is AI-generated visual material. The book objects, graph links, scoring, and learner interactions are implemented in the prototype.

ZIKEY’s contribution is not claiming that AI knows the best answer. It shows the learner the data-backed reasons for a recommendation. Thank you. I welcome questions.”

### Q&A — กันเวลา 2–3 นาที

ถ้าเวลาสั้น ให้ข้ามคำอธิบาย 3D เพิ่มเติมใน Slide 4 และลดเดโมเหลือค้น `qing` → เปิด 請 `qǐng` → mark as known → ดูคำแนะนำเปลี่ยน

## Slide 1 — Which character should I learn next and why?

“Hello, I’m Lin. My project is ZIKEY, a visual learning tool for Traditional Chinese.

The question I want to address is, ‘Which character should I learn next, and why?’ Learners can look up an individual character, but deciding what to study next also requires understanding its components, related characters, and the words it can help them read.

ZIKEY connects those pieces and makes the recommendation evidence visible. Today I’ll show the functioning data pipeline, the interactive prototype, and the parts that still need validation.”

คิวชี้ 青、清、晴、請、情 ในสไลด์ แล้วไป pipeline

## Slide 2 — Data, AI, visualization and learner feedback

“The pipeline starts with preserved snapshots from TOCFL, Make Me a Hanzi, and CC-CEDICT. I combine vocabulary levels, character structure, readings, and English dictionary senses into one dataset.

Python and NetworkX compute the graph and recommendation signals. Streamlit manages the learner state, while D3 and Plotly provide the linked visual views. The latest prototype also uses Three.js for library exploration.

The example here is 請問. The system retains its source row, normalizes its reading, and records the distinct characters 請 and 問. This lets us calculate whether the learner knows every character needed for that word.

For the hosted demo, explanations use a labelled template generated from computed evidence. The code also supports a local Ollama model for constrained explanation selection.”

คิวเน้นว่า scoring กับคำอธิบายเป็นคนละขั้น และ template บน cloud ไม่ใช่การเรียก LLM

## Slide 3 — Real data, with visible quality limits

“The pilot contains 290 learning characters, 450 vocabulary entries, and 556 IDS leaf-component edges.

TOCFL provides the vocabulary and level information. Make Me a Hanzi provides radicals, decomposition, and available origin information. CC-CEDICT provides English senses and readings.

The slide shows an earlier quality report. The current report lists zero missing word glosses, eleven entries requiring sense review, and thirty characters without origin records. Those counts do not establish linguistic correctness across the whole dataset. Human review of readings and senses is still needed.

The vocabulary bands are derived from the pilot words containing each character. Prevalence counts words in this pilot dataset.”

## Slide 4 — Explore the overview, then focus on learning

“The original interface lets learners explore an overview and then focus on a character. In the 2D graph, colour represents the derived vocabulary band, size represents pilot vocabulary prevalence, and the ring and check indicate recommendation and known status.

Since preparing these slides, I have added an interactive 3D library. Each book represents a sound family or radical group. Connections between books come from shared characters.

Learners can rotate the library, move across it, open a book, and explore the characters inside. Character details appear on a paper spread. The 2D view remains available through an explicit mode switch.”

คิวเปิดเว็บหลังจบประโยคนี้ หรือใช้เดโมช่วง Slide 6

## Slide 5 — Recommendations expose their evidence

“The recommendation score combines four normalized signals. The default weights are thirty-five percent vocabulary prevalence, twenty-five percent component reuse, forty percent unlock gain, and zero percent heat.

Unlock gain depends on the learner’s current knowledge. Learning 請 makes 請問 readable only when 問 is already known. If 問 is still unknown, learning 請 alone does not unlock the word.

Changing the learning goal changes the weights, and marking a character as known updates the recommendations and vocabulary coverage.

The visible formula determines the ranking. The explanation layer presents supporting evidence. On the public website, that explanation currently uses the template mode.”

## Slide 6 — Live task

“I’ll demonstrate one task, starting from a pronunciation the learner can type.

First, I search for ‘qing’ and select 請. The pronunciation search can return different tones, so the actual readings stay visible.

Next, I inspect its sound and meaning components and open 請問 to see the word’s reading, meaning, and missing-character status.

Then I request an explanation and change the learning goal. The recommendations update from the same learner state.

Finally, I mark 請 as known and show how the word status and coverage change. I can also unmark it to reverse the change.”

### คิวเดโมประมาณ 90 วินาที

1. ใช้เซสชันเดโมหรือ Reset demo เพื่อเริ่มจากสถานะตัวอย่างที่รู้ 問
2. ค้น qing แล้วเลือก 請 โหมด 3D จะยังแสดงกราฟ 3D
3. ชี้ 請 พินอิน ส่วนประกอบ และคำ 請問 กดคำเพื่อดูรายละเอียดแล้วปิด
4. กด Explain recommendation และชี้ป้าย template
5. เปลี่ยน Default เป็น Read more แล้วชี้อันดับหรือส่วนคะแนนที่เปลี่ยน
6. Mark as known แล้วชี้สถานะ Readable now และ coverage จริงบนจอ
7. ถ้ามีเวลา กลับ Overview → Full library → เปิดเล่ม 青 → เลือก 請 → Back to book
8. หลีกเลี่ยงการพูดว่าทุกอักษรที่ค้นเจออ่าน qīng เหมือนกัน

ถ้าเว็บยังเริ่มระบบ ให้พูด “The hosted application is starting. I’ll continue with the validation results while it loads.” แล้วไป Slide 7

## Slide 7 — What has been verified

“The current automated suite passes thirty-two tests. These check the computational behaviour, including recommendation and coverage logic.

Browser checks have also covered linked interactions such as selecting a character, changing its known status, switching between 2D and 3D, and navigating back from character details.

The slide’s local-model checks and latency range are measurements recorded at the earlier stage. I have not repeated that timing experiment for this update. The hosted demo uses the template explanation.

Coverage measures the percentage of these pilot vocabulary entries whose distinct characters are all known. It still needs evaluation against learner tasks and a broader dataset.”

คิวอย่าอ้าง 32 tests ว่าครอบคลุมคุณภาพภาพ 3D ทุกมุม หรือมือถือจริง

## Slide 8 — Roadblocks, decisions and next work

“There are three main issues I still need to investigate.

First, dictionary ambiguity and missing origin data require linguistic review. Second, 3D layouts need more testing for readability, overlap, and navigation on different devices. Third, the current coverage measure is based on a curated vocabulary subset.

Since this slide was made, cloud deployment and the 3D prototype have been implemented. The next evaluation is to give three to five learners concrete tasks and record completion, time, and confusion.

I would like feedback on whether the book groups and cross-group links are understandable, and whether the 3D overview helps learners find a useful character to study.”

## Slide 9 — References and AI disclosure

“These are the data sources and visual references used in the project.

Codex assisted with development, tests, presentation preparation, and visual assets. The rotunda background is an AI-generated image. The interactive books, nodes, and connections are rendered by Three.js.

The runtime explanation mode is disclosed in the interface. The hosted version uses computed template explanations, while the local model integration is optional.

Thank you. I’d welcome feedback on the grouping, the recommendation evidence, and the learning task.”

## บทพูดเพิ่มสำหรับความคืบหน้าหลังทำสไลด์ ประมาณ 45–60 วินาที

“Since preparing the slides, I have deployed the project to Streamlit and added the 3D learning library.

The current library contains twenty-four displayed books representing real sound families and radical groups drawn from the 290-character pilot. Books connect through shared characters. Users can rotate with momentum, pan, zoom, enter a library-only view, and open a book.

The character graph stays in the selected mode when a recommendation book is clicked. The 3D detail graph includes related characters, structural components, vocabulary links, and readable or missing-character states. Character details use a paper spread with a visible back button.

I also reduced repeated interface work by moving template explanations into the browser, avoiding unchanged chart redraws, and separating the static dictionary from per-action state updates.

These are implemented prototype functions. Device performance, general layout readability, and learner effectiveness still need evaluation.”

## ความคืบหน้าที่ใช้ตอบคำถาม

| ส่วน | สิ่งที่ทำเพิ่ม | ขอบเขตหลักฐาน |
| --- | --- | --- |
| Deployment | GitHub repository และ Streamlit public app | เปิดเว็บตรวจการทำงานหลัง deploy |
| Recommendation shelf | หนังสือ 3D ตามอันดับจริง เลือกแล้วเชื่อมกราฟ | มี browser checks ก่อนหน้า |
| Overview 3D | 24 เล่มจาก 6 sound families และ 18 radical groups มี shared-character links | เป็นส่วนที่แสดงจากชุด pilot ไม่ใช่ dataset ที่ขยายเป็น 24 กลุ่มทั้งหมด |
| Camera and interaction | จุดหมุนกลาง กล้องเข้าหาเล่ม แรงเฉื่อย Pan ปิดเริ่มต้น และปิดเล่มก่อนคืนมุมเดิม | ทดสอบปฏิสัมพันธ์ใน browser มีภาพซ้อนที่บางมุมยังต้องตรวจต่อ |
| Library-only view | Full library และ mode switch 2D/3D | ใช้ dialog เต็มพื้นที่แสดงเว็บ |
| 3D detail graph | แชร์ nodes, links และ word-status data กับ 2D รวม component nodes | ตรวจตัวอย่าง qing, 請 และ 口 |
| Paper view | กระดาษสองหน้า ปุ่ม Back to book / Back to library บนกระดาษ | ตรวจเส้นทางย้อนกลับใน browser |
| Performance | Template Explain ทำใน browser และข้ามการวาดกราฟที่ข้อมูลไม่เปลี่ยน | มีการทดสอบเชิงการทำงาน ยังไม่มี benchmark มือถือใหม่ |
| Verification | ชุดทดสอบ Python 32 รายการผ่าน | ไม่เท่ากับการทดสอบ UX หรือความถูกต้องเชิงภาษาครบชุด |



## บทพูดไทยแบบละเอียดสำหรับเข้าใจโปรเจกต์ก่อนซ้อม

ส่วนนี้ใช้เล่าเป็นภาษาไทยได้ประมาณ 12–15 นาทีรวมเดโม หากนำเสนอเป็นอังกฤษ ให้อ่านส่วนนี้ทำความเข้าใจก่อน แล้วใช้บทพูดอังกฤษรายสไลด์ด้านล่าง เวลาเป็นประมาณการ ยังไม่ได้จับเวลาซ้อมจริง

### Slide 1 — ZIKEY คืออะไร ทำให้ใคร และช่วยเรื่องอะไร

“สวัสดีครับ ผม Lin วันนี้จะนำเสนอความคืบหน้าของ ZIKEY 字鑰 ซึ่งเป็นเว็บต้นแบบสำหรับผู้เรียนภาษาจีนตัวเต็ม โดยเฉพาะคนที่กำลังตัดสินใจว่าจะเรียนตัวอักษรตัวไหนต่อ และอยากเข้าใจเหตุผลของคำแนะนำนั้นครับ

ปัญหาที่ผมสนใจเกิดขึ้นเวลาที่เราเรียนตัวอักษรแยกทีละตัว เราอาจจำเสียงหรือความหมายของตัวนั้นได้ แต่ยังต้องเชื่อมโยงเองว่าตัวนี้เกี่ยวข้องกับตัวอื่นอย่างไร และถ้าจำได้เพิ่มอีกตัว จะช่วยให้อ่านคำอะไรได้บ้าง

ตัวอย่างเช่น ถ้าผู้เรียนรู้ 問 อ่านว่า wèn ประมาณ ‘เวิ่น’ ซึ่งหมายถึงถามอยู่แล้ว การเรียน 請 อ่านว่า qǐng ประมาณ ‘ฉิ่ง’ จะทำให้ผู้เรียนรู้ตัวอักษรครบสำหรับคำว่า 請問 อ่านว่า qǐngwèn ประมาณ ‘ฉิ่ง–เวิ่น’ ใช้ขึ้นต้นถามอย่างสุภาพได้ครับ

ZIKEY จึงเก็บสถานะว่าเรารู้ตัวอักษรใดแล้ว นำไปคำนวณว่าตัวไหนควรเรียนต่อ และแสดงความสัมพันธ์กับหลักฐานให้ผู้เรียนตรวจสอบได้ เป้าหมายของต้นแบบคือช่วยสำรวจและวางลำดับการเรียนผ่านภาพครับ”

คิวพูดชื่อแอปเป็น “ZIKEY” ได้ โดยไม่จำเป็นต้องอ่านชื่อจีน ชื่อจีน 字鑰 อ่าน zì yào ประมาณ “จื้อ–เย่า”

### Slide 2 — หลักการทำงานจากข้อมูลจนถึงผู้เรียน

“ระบบแบ่งกระบวนการทำงานเป็นสี่ส่วน คือ Data, AI, Visualization และ Human ครับ

เริ่มจากข้อมูล เรานำรายการคำศัพท์ ตัวอักษร ส่วนประกอบ เสียงอ่าน และความหมายจากแหล่งต่าง ๆ มาเชื่อมกัน จากนั้นทำความสะอาดข้อมูลและเก็บที่มาของแต่ละรายการไว้ เช่น คำว่า 請問 หรือ qǐngwèn จะถูกเก็บทั้งคำ อ่านอย่างไร อยู่ระดับใด และมาจากแถวไหนของไฟล์ต้นฉบับ

ขั้นคำนวณ ระบบจะแยกตัวอักษรที่ไม่ซ้ำในคำออกมาเป็นชุด สำหรับ 請問 คือ 請 กับ 問 แล้วเปรียบเทียบกับชุดอักษรที่ผู้เรียนรู้ หากรู้ครบทั้งสองตัว ระบบจะนับคำนี้อยู่ในกลุ่มที่มีอักษรครบสำหรับอ่าน

Python กับ NetworkX ใช้จัดโครงสร้างกราฟและคำนวณคะแนน ส่วน Streamlit เก็บสถานะการใช้งาน กราฟ 2D ใช้ D3 กราฟเปรียบเทียบ Coverage ใช้ Plotly และห้องสมุด 3D ที่เพิ่มล่าสุดใช้ Three.js ครับ

เมื่อผู้เรียนค้นหา เลือกอักษร เปลี่ยนเป้าหมาย หรือกดว่ารู้แล้ว สถานะเดียวกันจะถูกใช้ปรับทั้งคำแนะนำ กราฟ และ Coverage จึงตรวจการเปลี่ยนแปลงข้ามมุมมองได้”

### Slide 3 — ข้อมูลมีอะไร และมากพอสำหรับอะไร

“ข้อมูลนำร่องตอนนี้มีตัวอักษรสำหรับเรียน 290 ตัว คำศัพท์ 450 รายการ และความสัมพันธ์ส่วนประกอบแบบ IDS leaf 556 เส้นครับ

TOCFL ให้รายการคำและระดับ Make Me a Hanzi ให้โครงสร้าง รากอักษร และคำอธิบายที่มีอยู่ ส่วน CC-CEDICT ให้ความหมายอังกฤษและเสียงอ่าน เราเชื่อมโดยใช้อักษรตัวเต็มและตรวจการอ่านที่เกี่ยวข้อง

ในสไลด์เป็นรายงานช่วงก่อนหน้า ส่วนรายงานล่าสุดมีคำที่ขาดความหมายศูนย์รายการ มี 11 รายการที่ต้องทบทวนความหมาย และยังขาดข้อมูลที่มาของอักษร 30 รายการ การมีข้อความความหมายอยู่ครบยังต้องตามด้วยการตรวจว่าความหมายนั้นเหมาะกับคำและการอ่านที่ใช้จริงครับ

ชุดข้อมูลนี้ใช้สาธิตกระบวนการคำนวณและปฏิสัมพันธ์ให้ทำงานครบวงจร ก่อนจะขยายข้อมูลและประเมินกับผู้เรียนต่อไป”

### Slide 4 — ทำไมเลือก qing และห้องสมุดแต่ละเล่มหมายถึงอะไร

“ผมเลือกเริ่มเดโมที่ qing เพราะเป็นตัวอย่างสั้นที่ผู้เรียนพิมพ์จากแป้นอังกฤษได้ และเห็นความสัมพันธ์หลายด้านในกลุ่มเดียวครับ

เมื่อค้น qing แบบไม่ใส่วรรณยุกต์ ระบบพบ 青 qīng หมายถึงกลุ่มสีธรรมชาติ เช่น น้ำเงินหรือเขียว, 清 qīng หมายถึงใสหรือสะอาด, 晴 qíng หมายถึงอากาศแจ่มใส, 請 qǐng ใช้ขอหรือเชื้อเชิญ และ 情 qíng หมายถึงความรู้สึกครับ

ตัวอย่างนี้ทำให้เห็นว่าผลค้นเสียงพื้นฐานเดียวกันยังมีวรรณยุกต์ต่างกัน และการมีส่วนประกอบร่วมกันก็ต้องแยกออกจากการอ่านปัจจุบัน เช่น 睛 อ่าน jīng ประมาณ ‘จิง’ หมายถึงลูกตา อยู่ในตระกูลโครงสร้าง 青 แต่ไม่ได้อยู่ในผลค้นเสียง qing ของแอป

ในมุมมอง 3D หนังสือหนึ่งเล่มแทนหนึ่งกลุ่ม กลุ่มมีทั้งตระกูลเสียงและรากอักษร เส้นระหว่างหนังสือเกิดจากอักษรที่ใช้ร่วมกัน เช่น 請 qǐng อยู่ในตระกูล 青 และอยู่ในกลุ่มราก 言 ซึ่งเกี่ยวกับคำพูด จึงมีทางเชื่อมระหว่างสองเล่ม

เมื่อเปิดหนังสือจะเห็นสมาชิกของกลุ่ม แล้วเลือกอักษรเพื่อเข้าสู่หน้ากระดาษที่แสดงรายละเอียด กราฟอักษร ส่วนประกอบ และคำศัพท์ที่เกี่ยวข้องครับ”

คิวระหว่างพูดชี้หนังสือ 青 และเส้น via 請 จากนั้นเปิดเล่ม
เหตุผลที่ใช้ qing เป็นการเลือกกรณีสาธิตที่อธิบายได้ง่าย ไม่ใช่ผลทดลองว่ากลุ่มนี้เป็นจุดเริ่มเรียนที่ดีที่สุด
TOCFL เป็นแหล่งคำศัพท์และระดับ ส่วนการจัดกลุ่มในแอปใช้โครงสร้างจากข้อมูลอักษร

### Slide 5 — ทำไมระบบแนะนำอักษรนี้

“ระบบคำนวณจากสัญญาณสี่อย่างครับ

อย่างแรกคือ Vocabulary prevalence นับว่าตัวอักษรนั้นอยู่ในคำศัพท์นำร่องกี่คำ หากอยู่ในหลายคำก็มีโอกาสเกี่ยวข้องกับคำที่เราเจอในชุดนี้มากขึ้น

อย่างที่สองคือ Component reuse ดูว่าตัวอักษรนั้นปรากฏเป็นส่วนประกอบในโครงสร้างอักษรอื่นกี่ตัว โดยการคำนวณปัจจุบันนับจากใบของโครงสร้าง IDS ที่เตรียมไว้

อย่างที่สามคือ Unlock gain นับว่าถ้าเรียนอักษรนี้เพิ่มเพียงตัวเดียว จะทำให้รู้ตัวอักษรครบสำหรับคำใหม่กี่คำ สัญญาณนี้เปลี่ยนตามชุดอักษรที่ผู้เรียนรู้อยู่แล้ว

อย่างที่สี่คือ Heat มาจากข้อมูลการค้นหาหรือคลิกที่เลือกเก็บ ในค่าเริ่มต้นน้ำหนักส่วนนี้เป็นศูนย์ และข้อมูลจำลองจะมีป้ายแยกครับ

ระบบปรับแต่ละสัญญาณให้อยู่ในช่วงศูนย์ถึงหนึ่ง แล้วคูณน้ำหนัก ค่า Default คือ prevalence 35 เปอร์เซ็นต์ reuse 25 เปอร์เซ็นต์ unlock 40 เปอร์เซ็นต์ และ heat ศูนย์เปอร์เซ็นต์ จากนั้นรวมเป็นคะแนน ตัดอักษรที่รู้แล้วออก และเรียงอันดับ

เราดูแท่งคะแนนแยกส่วนเพื่อถามต่อได้ว่าตัวนี้ขึ้นอันดับสูงเพราะอยู่ในหลายคำ เพราะเป็นส่วนประกอบที่ใช้ซ้ำ หรือเพราะปลดล็อกคำใหม่ได้มากครับ”

คิวเสริมเรื่อง AI หากอาจารย์ถาม

“สูตรที่แสดงเป็นผู้กำหนดอันดับ ส่วนโมเดลภาษาที่มีในโค้ดใช้เลือกประโยคอธิบายจากหลักฐานที่ส่งให้ และต้องผ่านการตรวจว่าคำตอบเป็นประโยคในหลักฐานนั้นจริง ปัจจุบันเว็บสาธารณะใช้ template explanation จากหลักฐานที่คำนวณไว้ ส่วน local Ollama ต้องมีเซอร์วิสที่เรียกได้ จึงยังต้องรายงานแยกว่าการตรวจ LLM เป็นผลของ local prototype ครับ”

หากถามว่า cloud มี LLM ทำงานอยู่หรือไม่ ให้ตอบตรง ๆ ว่าโหมดสาธารณะที่ใช้อยู่เป็น template การบูรณาการ LLM มีใน local implementation ซึ่งต้องสาธิตแยกเมื่อเซอร์วิสพร้อม

### Slide 6 — เดโมทีละขั้นและพูดตามการเปลี่ยนแปลง

“เริ่มจากผมพิมพ์ qing แล้วเลือก 請 หรือ qǐng ครับ ตอนนี้เราจะดูทั้งตัวอักษรที่เกี่ยวข้องและคำศัพท์ เช่น 請問 หรือ qǐngwèn

ผมกดคำนี้เพื่อดูความหมายกับสถานะว่าเรายังขาดตัวไหน ชุดผู้เรียนตัวอย่างเริ่มจากรู้ 問 wèn อยู่แล้ว ดังนั้นคำนี้จึงยังต้องเรียน 請 qǐng เพิ่มเพียงตัวเดียว

ถ้าผมเลือกตัวอักษรลึกลงไป แถบประวัติด้านบนจะเก็บทางที่เดินเข้ามา การกดย้อนกลับจะย้อนทีละหน้า และยังรักษาสถานะอักษรที่เรียนแล้วไว้

ใน Full library ผมกดตัวที่เลือกซ้ำเพื่อเปิดแผงรายละเอียด แผงนี้มีเสียงอ่าน ความหมาย เหตุผลของคำแนะนำ และปุ่ม Mark as known เราจึงทำรายการจากในห้องสมุดได้เลยครับ

ต่อไปผมกด Mark as known ที่ 請 จะเห็นสถานะของ 請問 เปลี่ยนเป็น Readable now เพราะรู้ตัวอักษรครบทั้งคำแล้ว อันดับคำแนะนำและ Coverage ก็ปรับตาม ผมจะชี้ตัวเลขจริงที่ปรากฏบนจอ และกด Unmark เพื่อทดสอบย้อนกลับได้

สุดท้ายผมเปลี่ยนเป้าหมายเป็น Read more ซึ่งให้น้ำหนักกับการปลดล็อกคำมากขึ้น แล้วเปรียบเทียบเหตุผลและอันดับกับค่า Default ครับ”

คิวใช้ประโยคตามสถานการณ์จริง

- ก่อนเริ่ม ให้ตรวจว่ากำลังเลือก 請 และรู้ 問 แต่ยังไม่รู้ 請
- หากกดอักษรเดิมแล้วแผงเปิด ให้พูดว่า “This opens the details panel without changing the selected character.”
- ถ้าเปิดแผงบังกราฟ ให้กด Close หรือแตะพื้นที่นอกแผงเพื่อย่อ
- อย่าอ้างว่าการรู้ตัวอักษรครบรับประกันว่ารู้ความหมายหรือไวยากรณ์ของคำแล้ว คำว่า Readable now เป็นสถานะตามกติกานับอักษรของต้นแบบ

### Slide 7 — Coverage และสิ่งที่ทดสอบแล้ว

“Coverage ในแอปคำนวณโดยนับคำที่ผู้เรียนรู้ตัวอักษรทุกตัวแล้ว หารด้วยคำทั้งหมด 450 รายการในชุดเดียวกัน แล้วคูณร้อยครับ ตัวอักษรซ้ำในคำจะนับเป็นตัวที่ต้องรู้เพียงครั้งเดียว

กราฟเปรียบเทียบเริ่มจากชุดอักษรที่รู้เหมือนกันทุกเส้น เส้น Vocabulary order ใช้ระดับและลำดับรายการจากคำศัพท์ เส้น Default ใช้น้ำหนักเริ่มต้น ส่วน My goal ใช้น้ำหนักเป้าหมายที่เลือก ระบบคำนวณคำแนะนำใหม่เมื่อเพิ่มอักษรแต่ละขั้น

ตอนเตรียมสไลด์มี 22 tests ปัจจุบันเพิ่มเป็น 32 tests โดยมีการทดสอบประวัติย้อนหลัง การกลับทีละขั้น การข้ามกลับไปตำแหน่งก่อนหน้า และการรักษารายการอักษรที่รู้ไว้ด้วย

ส่วนเวลา local AI ในสไลด์เป็นตัวเลขที่วัดในช่วงก่อนหน้า รอบนี้ยังไม่ได้วัดซ้ำ ประสิทธิผลการเรียนจริงก็ยังต้องทดสอบกับผู้เรียนครับ”

คิวเช็กจำนวน tests อีกครั้งหากมีการแก้โค้ดหลังเอกสารนี้

### Slide 8 — ข้อจำกัดและสิ่งที่จะทำต่อ

“งานที่ทำเพิ่มจากสไลด์คือ deploy เว็บ เพิ่มห้องสมุด 3D เชื่อมกราฟ 2D กับ 3D ใช้สถานะผู้เรียนเดียวกัน เพิ่มหน้ากระดาษและประวัติการย้อนกลับ รวมถึงทำรายการรู้ตัวอักษรผ่านแผงใน Full library ได้

สิ่งที่ยังต้องตรวจมีทั้งความหมายกับเสียงอ่านบางรายการ ความง่ายในการอ่านกราฟเมื่อข้อมูลมากขึ้น และความลื่นบนอุปกรณ์หลายประเภท อีกส่วนคือประเมินว่าผู้เรียนเข้าใจเหตุผลของคำแนะนำจริงหรือไม่

ขั้นต่อไปคือให้ผู้เรียน 3–5 คนทำภารกิจ เช่น ค้นหาตัวอักษร บอกว่าคำหนึ่งยังขาดตัวไหน และอธิบายว่าทำไมระบบแนะนำตัวนั้น โดยบันทึกความสำเร็จ เวลา และจุดที่สับสน

คำถามที่ผมอยากได้ feedback คือหนังสือแต่ละกลุ่มและเส้นข้ามกลุ่มเข้าใจง่ายหรือไม่ และผู้เรียนแยกความต่างระหว่างเสียง ส่วนประกอบ และสถานะคำศัพท์ได้หรือไม่ครับ”

### Slide 9 — แหล่งข้อมูลและการเปิดเผย AI

“ข้อมูลมาจาก TOCFL, Make Me a Hanzi และ CC-CEDICT ตามแหล่งอ้างอิงในสไลด์ครับ

ผมใช้ Codex ช่วยพัฒนาโค้ด ตรวจงาน และเตรียมการนำเสนอ ฉากโดมห้องสมุดเป็นภาพที่สร้างด้วย AI ส่วนหนังสือ โหนด เส้นเชื่อม และปฏิสัมพันธ์ถูกเรนเดอร์ใน Three.js

ผมแยกการใช้ AI ช่วยพัฒนาระบบออกจาก AI ขณะผู้เรียนใช้งาน โดยในเว็บสาธารณะตอนนี้ใช้คำอธิบายแบบ template และมีตัวเลือกโมเดล local ในโค้ด ขอบคุณครับ”

## คู่มือออกเสียงและความหมายสำหรับผู้พูด

คำอ่านไทยเป็นตัวช่วยโดยประมาณ ให้ยึดพินอินและวรรณยุกต์เป็นหลัก อักษร q ในพินอินและเสียงสระบางเสียงไม่มีตัวแทนตรงในภาษาไทย

| ตัวอักษร / คำ | พินอิน | คำอ่านไทยโดยประมาณ | ความหมายที่ใช้ในเดโม |
| --- | --- | --- | --- |
| 字鑰 | zì yào | จื้อ–เย่า | ชื่อจีนของ ZIKEY ใช้อักษร ‘ตัวอักษร’ กับ ‘กุญแจ’ |
| 青 | qīng | ชิง เสียงสูงราบ | สีธรรมชาติในช่วงน้ำเงิน เขียว หรือดำ แล้วแต่บริบท |
| 清 | qīng | ชิง เสียงสูงราบ | ใส สะอาด บริสุทธิ์ |
| 晴 | qíng | ฉิง เสียงไต่ขึ้น | อากาศแจ่มใส |
| 請 | qǐng | ฉิ่ง เสียงต่ำแล้วไต่ขึ้นเมื่อออกเดี่ยว | ขอ เชื้อเชิญ กรุณา |
| 情 | qíng | ฉิง เสียงไต่ขึ้น | อารมณ์ ความรู้สึก |
| 睛 | jīng | จิง เสียงสูงราบ | ลูกตา |
| 問 | wèn | เวิ่น เสียงตก | ถาม |
| 請問 | qǐngwèn | ฉิ่ง–เวิ่น | ขอถามหน่อย ใช้ถามอย่างสุภาพ |
| 門 | mén | เหมิน เสียงไต่ขึ้น | ประตู |
| 們 | men | เมิน เบาและสั้น | เครื่องหมายพหูพจน์ที่ใช้กับสรรพนามและคำนามบางคำ |
| 我們 | wǒmen | หว่อ–เมิน | พวกเรา |
| 你們 | nǐmen | หนี่–เมิน | พวกคุณ |
| 人 | rén | เหริน เสียงไต่ขึ้น | คน |
| 介 | jiè | เจี้ย เสียงตก | แนะนำ ตัวกลาง หรือความหมายอื่นตามบริบท |
| 口 | kǒu | โข่ว | ปาก ช่องเปิด |
| 點 | diǎn | เตี่ยน | จุด |
| 學 | xué | เสวีย เสียงไต่ขึ้น | เรียน การเรียนรู้ |
| 心 | xīn | ซิน เสียงสูงราบ | หัวใจ จิตใจ |

อย่าอ่าน qing ทุกตัวด้วยเสียงเดียวกัน ในเดโมอ่านทีละตัวตามตาราง ส่วนรากอย่าง 亻 หรือ 氵 เป็นรูปส่วนประกอบ ไม่จำเป็นต้องฝืนอ่านเหมือนอักษรเดี่ยว ให้พูดว่า “ส่วนประกอบรูปคน” หรือ “รากน้ำ” และตรวจข้อมูลที่แสดง

## คำอธิบายการทำงานแบบสั้นที่ใช้ตอบอาจารย์ได้

### ถ้าถามว่า “ระบบเรียนรู้ความชอบของผู้ใช้เองหรือยัง”

“ตอนนี้ผู้เรียนกำหนดเป้าหมายและชุดอักษรที่รู้ครับ ระบบคำนวณอันดับใหม่ตามข้อมูลเหล่านี้ ส่วน heat ใช้ได้เมื่อเปิด logging หรือข้อมูลจำลอง และยังไม่ได้ฝึก ALS จากผู้ใช้หลายคน”

### ถ้าถามว่า “ทำไมคำแนะนำเปลี่ยนเมื่อกดว่ารู้แล้ว”

“อักษรนั้นจะถูกตัดออกจากผู้สมัคร และบางคำอาจเหลืออักษรที่ต้องรู้อีกเพียงตัวเดียว ทำให้ Unlock gain ของอักษรอื่นเปลี่ยนตามครับ”

### ถ้าถามว่า “3D ช่วยการเรียนอย่างไร”

“ผมใช้หนังสือแทนกลุ่มเพื่อให้เริ่มสำรวจจากภาพรวม แล้วเปิดกลุ่มเพื่อดูสมาชิกและคำที่สัมพันธ์กัน ปัจจุบันสาธิตว่าการนำทางทำงานได้แล้ว แต่ประโยชน์ต่อการเรียนต้องประเมินกับผู้เรียนและเทียบการทำภารกิจต่อครับ”

### ถ้าถามว่า “ทำไมมีแค่ 24 เล่ม”

“24 คือจำนวนกลุ่มที่เลือกแสดงในภาพรวมปัจจุบัน มีทั้งตระกูลเสียงและกลุ่มราก จากข้อมูลนำร่อง 290 ตัว มีทั้งกลุ่มทับซ้อนกันและกลุ่มอื่นที่ยังไม่ได้แสดงเป็นเล่ม จึงไม่ควรอ่านว่าเป็น 24 ตัวอักษรหรือครอบคลุมอักษรทั้งหมดครับ”

### ถ้าถามว่า “การอยู่ใกล้กันใน 3D หมายถึงคล้ายกันมากหรือไม่”

“ตำแหน่งและความลึกใช้จัดพื้นที่ในการสำรวจครับ ความสัมพันธ์ทางข้อมูลให้อ่านจากชนิดกลุ่มและเส้นที่มีหลักฐาน ไม่ได้คำนวณความคล้ายทางภาษาออกมาเป็นระยะทางในห้อง”

### ถ้าถามว่า “ทำไมกดแล้วบางครั้งต้องรอ”

“การเปิดแผงหรือหมุนฉากทำใน browser ได้ทันที ส่วนการเลือกอักษรใหม่และเปลี่ยนชุดที่รู้ยังส่งสถานะไปคำนวณที่ Streamlit แล้วส่งผลกลับมา ตอนนี้ลดคำสั่งซ้ำและงานวาดที่ไม่เปลี่ยนไปแล้ว แต่ยังต้องวัด latency บนอุปกรณ์จริงครับ”
