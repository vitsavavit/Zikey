# ชุดส่ง Progress Review — 5 พฤศจิกายน 2026

## ไฟล์ที่ใช้

- ส่ง `W16157093_Lin_ProgressReview.pptx` หรือ `.pdf` (9 หน้า ภาษาอังกฤษ)
- ซ้อมจาก `PROGRESS-REVIEW-NOTES.md`: 10 นาที รวม live demo 2 นาที45วินาที + Q&A 2 นาที
- เปิดเว็บด้วย `../Start ZIKEY.command` หรือ Terminal ตาม README
- คลิป `ZIKEY-galaxy-walkthrough.mp4` เป็นภาพหน้าจอจริงเรียงพร้อมคำบรรยาย ไม่ใช่บันทึก live interaction; เปิด subtitle track หากไม่เห็นคำบรรยาย (มี .srt สำรอง)
- ไฟล์ `ZIKEY-progress.*` และ `ZIKEY-demo.*` คือ iteration เก่า ไม่ใช้เป็นชุดส่งใหม่

เอกสารแนบชื่อ Week6 แต่หัวเอกสารเขียน Week9: ชุดนี้ยึดข้อกำหนดในเอกสาร ได้แก่
ชื่อไฟล์ตามรหัสนักศึกษา/ชื่อ, ส่ง5พ.ย.ก่อน11:59AM, English, APA7, 10min+2minQ&A
ยังไม่ได้อัปโหลดส่งระบบรายวิชา

## ซ้อมเดโม

1. เปิดเว็บใหม่ หรือ Reload เพื่อเริ่ม sample learner21อักษร (ระบุว่าเป็นตัวอย่าง)
2. Start with qing → คลิก 請 ในกราฟ → เปิด 請問: ขาด 請 และรู้ 問 แล้ว
3. ปิดหน้าต่าง → Explain with local AI (ป้าย cached/fallback ต้องอ่านตามจริง)
4. Goal See structure: 青 ขึ้นอันดับ1ใน This family; selected character ยังเป็น 請
5. กลับ Default → Mark as known:21→22; coverage4.9→5.6%; 請 ออกจากคำแนะนำ
6. Unmark → กลับ Overview; การค้นหาหรือคลิกไม่ทำให้กลายเป็น known เอง

หาก Ollamaไม่ทำงาน เปิด `ollama serve`; template fallback ยังสาธิตสูตรได้
หาก live demoมีปัญหา ใช้ screenshot/คลิปสำรองและบอกชัดว่าเป็น backup

## หลักฐานเทียบเกณฑ์

| เกณฑ์ | หลักฐานที่ใช้ |
| --- | --- |
| Data → AI → Visualization → Human | หน้า2และ live demo หน้า6 |
| Raw → processed | หน้า2ตัวอย่าง 請問; raw snapshots + source hashes; prepare_data.py |
| Technical25% | เว็บทำงานจริง;22tests;5LLMchecks; scoring/coverage |
| Design/Encoding30% | หน้า4; overview→focus; typedlines/legend; sharedselection |
| Presentation25% | English9slides;10minute notes;liveonecoretask;APA7 |
| Reflection20% | หน้า3/8;84senses review; no corpusfrequency; futureT1–T3 study |

## ข้อจำกัดที่ต้องพูดตามจริง

290อักษร/450คำเป็น curated pilot; prevalenceไม่ใช่ corpus frequency;
coverageวัดคำในชุดนี้ที่รู้ทุกอักษร ไม่ใช่เปอร์เซ็นต์ข้อความที่เข้าใจหรือผลการเรียนรู้
ยังไม่ได้ทดสอบกับผู้เรียนจริง/ผู้เชี่ยวชาญภาษา และยังไม่ทำALS
โมเดลเลือก1–2ประโยคจากหลักฐานที่ระบบเตรียม ไม่ได้ฝึกโมเดลจัดอันดับหรือสร้างนิรุกติศาสตร์
อย่าใช้คำว่า textbook order; baselineคือ vocabulary orderตามระดับและแถวต้นฉบับ
