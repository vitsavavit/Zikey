# ZIKEY 字鑰

เว็บ progress สำหรับ Information Visualization ใช้ข้อมูลจริง **290 อักษร / 450 คำ**
พร้อม galaxy overview → focus, คะแนนที่ปรับได้ และคำอธิบายจาก Ollama ในเครื่อง

ชุดส่งล่าสุด: **deliverables/W16157093_Lin_ProgressReview.pptx / .pdf** (9 หน้า)
คู่มือซ้อมและเทียบ rubric: **deliverables/PROGRESS-REVIEW-GUIDE.md**

UI ล่าสุดเป็นธีมหนังสืออ้างอิงร่วมสมัย โดยคง A/B/C และ galaxy flow เดิม
ภาพล่าสุด: `deliverables/book-workspace.png` / `book-overview.png`
สไลด์และคลิปที่สร้างก่อนหน้าแสดงธีมเดิม

## เปิดใช้งานบนเครื่องนี้

ดับเบิลคลิก **Start ZIKEY.command** แล้วเปิด <http://127.0.0.1:8501>
หากเว็บรันอยู่แล้ว launcher จะเปิดเว็บเดิม ไม่เริ่มเซิร์ฟเวอร์ซ้ำ

หรือเปิด Terminal:

```sh
cd /Users/7svv/Info-viz/zikey
.venv/bin/python -m streamlit run app.py
```

ปิดเซิร์ฟเวอร์ด้วย Control+C ใน Terminal ที่เปิดเซิร์ฟเวอร์ สถานะการเรียนและ log อยู่ใน
Streamlit session memory และไม่บันทึกเป็นประวัติส่วนตัวถาวร หากต้องการเก็บอักษรที่รู้
ให้คัดลอกจากช่อง **known** ใน toolbar แล้วนำกลับมาวางครั้งถัดไป

## Local AI

ติดตั้งโมเดล `qwen2.5-coder:7b` ไว้ในเครื่องนี้แล้ว หากบริการ Ollama ยังไม่ทำงาน:

```sh
ollama serve
```

กด **Explain with local AI** ในเว็บ โมเดลเลือกประโยคหลักฐาน 1–2 ประโยคจากข้อมูลที่ส่งให้
ไม่เปลี่ยนคะแนนและไม่สร้างประวัติอักษรอิสระ คำตอบถูกตรวจว่าอยู่ในชุดหลักฐานจริงก่อนแสดง
คำตอบซ้ำเก็บใน `.runtime/explanations` หากบริการไม่พร้อมหรือคำตอบผิดรูป เว็บใช้เหตุผล
แบบ template พร้อมป้ายชัดเจน ไม่มี paid API หรือ cloud inference

## สาธิตตามลำดับ

1. Reload หรือเปิด session ใหม่ เริ่ม sample learner21อักษร → **Start with qing**
2. คลิก **請** ในกราฟ → ดูเสียง `qǐng`, components `言` / `青`, เปิด word pill **請問**
3. ปิดรายละเอียด → **Explain with local AI** (fresh requestที่วัด5.5–13.6วินาที; cacheเร็วกว่า)
4. Goal **See structure**: 青 ขึ้นอันดับ1ใน **This family**; 請 ยังถูกเลือก
5. กลับ **Default** → **Mark as known**:21→22, coverage4.9→5.6%, 請 ออกจากคำแนะนำ
6. **Unmark as known** เพื่อย้อนกลับ → **Overview** คืนมุมกล้องเดิม
7. Coverageคือคำในpilotที่รู้ทุกอักษร ไม่ใช่เปอร์เซ็นต์ข้อความที่เข้าใจ

`睛` อยู่ในเครือข่ายส่วนประกอบแต่เสียงคือ `jīng` ไม่ใช่ผลค้น `qing` ความคล้ายของส่วนประกอบ
ไม่ได้หมายความว่าเสียงสมัยใหม่และวรรณยุกต์จะเหมือนกันทุกตัว

## ไฟล์สำหรับส่งและซ้อม

- `deliverables/W16157093_Lin_ProgressReview.pptx` / `.pdf` — 9หน้าอังกฤษ ใช้ชุดนี้ส่ง
- `deliverables/PROGRESS-REVIEW-NOTES.md` — timed10min notes + Q&A
- `deliverables/PROGRESS-REVIEW-GUIDE.md` — demoและrubric mapping
- `deliverables/ZIKEY-galaxy-walkthrough.mp4` — ภาพจริงเรียง140วินาที มีsubtitle track; ไม่ใช่ live recording
- `deliverables/progress-review-evidence.json` / `progress-review-llm-checks.json` — ตัวเลขจริง
- `deliverables/galaxy-browser-checks.json` — ขอบเขตตรวจ UI รอบปัจจุบัน
- `ZIKEY-progress.*` / `ZIKEY-demo.*` เป็น iterationเก่า

## ติดตั้งใหม่และตรวจสอบ

Python 3.12 ขึ้นไปแนะนำสำหรับเครื่องใหม่ รุ่นที่ทดสอบจริงอยู่ใน `requirements.txt`
หากติดตั้งด้วย launcher สำเร็จแล้ว ไม่ต้องติดตั้งซ้ำ

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m unittest discover -s tests -v
```

การตรวจ UI รุ่น galaxy ใช้รายการใน PROGRESS-REVIEW-GUIDE.md กับ browserจริง
`scripts/check_browser.py` และ `scripts/record_demo.py` เป็น automationของUIรุ่นก่อน
ยังไม่ได้ปรับselectorsให้galaxy จึงไม่ใช้เป็นหลักฐานของรอบนี้

## ข้อมูลและวิธีคำนวณ

`data/raw` เก็บ snapshot ต้นฉบับ `data/processed/pilot.json` ใช้รันเว็บ
`sources.json` เก็บ URL เวลา SHA-256 และเงื่อนไขแหล่งข้อมูล `quality_report.json`
บอกวิธีเลือก subset และรายการที่จับคู่ไม่ได้ สร้างซ้ำด้วย:

```sh
.venv/bin/python scripts/prepare_data.py
```

ตัวสร้างข้อมูลใช้ไฟล์เดิมถ้ามี จึงสร้างผลเดิมได้โดยไม่ดาวน์โหลดใหม่ พินอินจาก TOCFL
บางรายการใช้ breve แทน caron สำหรับเสียงสาม ตัวค้นรองรับทั้งสองแบบ การค้นไม่แยกวรรณยุกต์
แต่เสียงที่แสดงยังคงรูปต้นฉบับ

คะแนน = ผลรวมของสัญญาณที่ปรับช่วงแล้วคูณน้ำหนัก สัญญาณละหารด้วยค่าสูงสุดในอักษรที่ยังไม่รู้
หากสัญญาณเป็นศูนย์ทั้งหมดจะยังเป็นศูนย์ ถ้าน้ำหนักทุกตัวเป็นศูนย์จะใช้ Default

- Prevalence: จำนวนรายการคำที่มีอักษรนั้น นับอักษรซ้ำในคำเพียงครั้งเดียว ไม่ใช่ corpus frequency
- Reuse: จำนวนอักษรเรียนที่มีส่วนประกอบนั้นเป็น named leaf ใน IDS ที่ flatten แล้ว
  เส้นกราฟจึงไม่ได้แทน immediate component ทุกเส้น
- Unlock: จำนวนคำที่ขาดเพียงอักษรนั้น เรียน 請 ไม่ปลดล็อก 請問 ถ้ายังไม่รู้ 問
- Heat: เริ่มศูนย์ ใช้ log แบบ opt-in ใน session หรือข้อมูลจำลองที่ติดป้าย ไม่ผสมกัน

baseline ใช้ first appearance ตามระดับและแถว TOCFL ไม่ใช่ลำดับตำรา ทุกเส้นใช้ผู้เรียนเริ่มต้น
และ 450 คำเดียวกัน คำนวณอันดับใหม่ทุกก้าว ในสถานะตัวอย่างเมื่อเรียนเพิ่ม 100 ตัว:
Vocabulary order 40.0%, Default 58.2%, Read more 58.4% เป็นผลจำลองใน subset ที่คัดมา
ยังไม่ใช่ held-out evaluation หรือหลักฐานว่าผู้เรียนเรียนดีขึ้น

## ที่มาและข้อจำกัด

- TOCFL / SC-TOP: <https://tocfl.edu.tw/tocfl/index.php/exam/download>
  workbook 20240923 เปิดให้ดาวน์โหลด แต่ยังไม่พบ open redistribution license
- Make Me a Hanzi: <https://github.com/skishore/makemeahanzi> dictionary ภายใต้ LGPL v3+
- CC-CEDICT / MDBG: <https://www.mdbg.net/chinese/dictionary?page=cc-cedict> CC BY-SA 4.0
- D3 v7.9.0: <https://github.com/d3/d3> ISC license เก็บไว้ใน `static/D3-LICENSE`

ใช้ข้อมูลสำหรับ coursework ในเครื่อง เก็บ attribution และตรวจสิทธิ์ TOCFL เพิ่มก่อนเผยแพร่
dataset หรือเว็บสู่สาธารณะ 6 คำไม่มี English gloss, 30 อักษรไม่มี origin record และ
38 อักษรมี decomposition ที่ไม่ครบ/ไม่ทราบ ไม่ใช้ AI เติมฟิลด์เหล่านี้

ยังไม่มี corpus frequency, ALS, ข้อมูลชุมชนจริง, ระบบสมาชิก หรือการทดสอบผลการเรียนกับผู้ใช้
ขั้นต่อไปคือข้อมูลความถี่ ตรวจภาษา และทดลอง T1–T3 กับผู้เรียน 3–5 คน

AI disclosure: Codex ช่วยเขียนโค้ด tests และสไลด์ `qwen2.5-coder:7b` เลือกหลักฐาน
สำหรับคำอธิบายในเว็บ ผู้ส่งต้องตรวจเนื้อหาและเปิดเผยการใช้ AI ตามจริง
