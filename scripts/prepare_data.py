"""Build a bounded Traditional Chinese pilot from preserved upstream snapshots."""

import gzip
import hashlib
import io
import json
import re
import sys
import zipfile
import unicodedata
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import openpyxl
import requests

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data/raw"
OUT = ROOT / "data/processed"
SOURCES = {
    "tocfl.zip": "https://tocfl.edu.tw/tocfl/assets/files/vocabulary/8000zhuyin_202409.zip",
    "makemeahanzi.jsonl": "https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt",
    "makemeahanzi-COPYING": "https://raw.githubusercontent.com/skishore/makemeahanzi/master/COPYING",
    "cedict.gz": "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz",
}


def cjk(text):
    return bool(re.fullmatch(r"[\u3400-\u9fff]+", text))


def reading_signature(text):
    tones = {'\u0304': '1', '\u0301': '2', '\u030c': '3', '\u0306': '3', '\u0300': '4'}
    decomposed = unicodedata.normalize('NFD', text.lower().replace('u:', 'ü').replace('v', 'ü'))
    letters = ''.join(c for c in decomposed if c.isalpha() or c == '\u0308')
    return letters, ''.join(tones.get(c, c if c in '1234' else '') for c in decomposed)


def standard_pinyin(text):
    return text.translate(str.maketrans('ăĕĭŏŭĂĔĬŎŬ', 'ǎěǐǒǔǍĚǏǑǓ'))


def choose_sense(word, pinyin, senses):
    options = [reading_signature(p.strip()) for p in re.split(r'[/／]', pinyin) if p.strip()]
    matches = [s for s in senses if reading_signature(s['pinyin']) in options]
    variant = False
    if not matches:
        for sense in senses:
            letters, _ = reading_signature(sense['pinyin'])
            tones = re.findall(r'[1-5]', sense['pinyin'])
            if '5' in tones and any(letters == a and len(b) == len(tones) and
                                    all(t == '5' or t == v for t, v in zip(tones, b))
                                    for a, b in options):
                matches.append(sense)
        variant = bool(matches)
    common = [s for s in matches if s['pinyin'][:1].islower()]
    candidates = common or matches
    # These corrections select existing snapshot entries, not generated definitions.
    reviewed = {'青': 'green/blue', '清': '(of water etc) clear; clean'}
    if word in reviewed:
        found = next((s for s in candidates if s['meaning'].startswith(reviewed[word])), None)
        if found:
            return found['meaning'], 'Reviewed demo sense'
    if len(candidates) == 1:
        return candidates[0]['meaning'], 'Reading variant — check pronunciation' if variant else 'Reading matched'
    if not senses:
        return 'Not available', 'Missing dictionary entry'
    return 'Multiple or unmatched readings — open dictionary senses', 'Needs review'


def build():
    RAW.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    for name, url in SOURCES.items():
        target = RAW / name
        if not target.exists():
            response = requests.get(url, timeout=90)
            response.raise_for_status()
            target.write_bytes(response.content)

    mmh = {r["character"]: r for line in (RAW / "makemeahanzi.jsonl").read_text().splitlines()
           if (r := json.loads(line))}
    cedict = {}
    cedict_version = "unknown"
    for line in gzip.open(RAW / "cedict.gz", "rt", encoding="utf-8"):
        if line.startswith("#! date="):
            cedict_version = line.strip().split("=", 1)[1]
        match = re.match(r"(\S+) (\S+) \[([^]]+)\] /(.*)/", line)
        if match:
            traditional, simplified, pinyin, meaning = match.groups()
            cedict.setdefault(traditional, []).append({"pinyin": pinyin, "meaning": meaning,
                                                      "simplified": simplified})
    archive = zipfile.ZipFile(RAW / "tocfl.zip")
    filename = next(n for n in archive.namelist() if n.endswith(".xlsx"))
    workbook = openpyxl.load_workbook(io.BytesIO(archive.read(filename)), read_only=True, data_only=True)
    levels = ["Novice 1", "Novice 2", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"]
    band = ["Novice", "Novice", "A", "A", "B", "B", "C"]
    all_words, seen, skipped = [], set(), Counter()
    for level, sheet in enumerate(workbook.worksheets[:7]):
        offset = 1 if level < 4 else 0
        for rownum, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), 2):
            if not row[offset]:
                continue
            # Retain exact Chinese alternatives. Annotated entries are excluded, not guessed.
            for word in re.split(r"[/／]", str(row[offset]).strip()):
                word = word.strip()
                if not cjk(word):
                    skipped["annotated_or_non_cjk"] += 1
                    continue
                if word in seen:
                    continue
                seen.add(word)
                pinyin = str(row[offset + 1] or '').strip()
                meaning, sense_status = choose_sense(word, pinyin, cedict.get(word, []))
                alternatives = [p.strip() for p in re.split(r'[/／]', pinyin) if p.strip()]
                head_readings = {reading_signature(s['pinyin'])[0] for s in cedict.get(word, [])}
                matched = [p for p in alternatives if reading_signature(p)[0] in head_readings]
                display_pinyin = ' / '.join(dict.fromkeys(matched or alternatives))
                all_words.append({"word": word, "pinyin": standard_pinyin(display_pinyin), "source_pinyin": pinyin,
                                  "level": levels[level], "level_index": level, "band": band[level],
                                  "sheet": sheet.title, "row": rownum,
                                  "meaning": meaning, "sense_status": sense_status,
                                  "part_of_speech": str(row[offset + 2] or '').strip(),
                                  "context": str(row[0] or '').strip() if offset else None,
                                  "dictionary_readings": cedict.get(word, []),
                                  "source": "TOCFL 20240923; CC-CEDICT for English gloss"})

    family = set("青清晴請情睛")
    wanted = {"請", "請問", "請客", "清楚", "晴天", "心情", "眼睛", "青", "清", "晴", "情"}
    forced = [w for w in all_words if w["word"] in wanted]
    chosen = {w["word"]: w for w in forced}
    chars = set("".join(chosen)) | family
    # A reproducible cap: use earliest official rows that fit 290 learning characters.
    for word in all_words:
        new = chars | set(word["word"])
        if len(new) <= 290:
            chosen[word["word"]] = word
            chars = new
        if len(chosen) >= 450:
            break
    words = sorted(chosen.values(), key=lambda w: (w["level_index"], w["row"], w["word"]))
    baseline = list(dict.fromkeys("".join(w["word"] for w in words)))
    baseline += sorted(chars - set(baseline))
    characters = {}
    standalone = {w['word']: w for w in all_words if len(w['word']) == 1}
    for char in baseline:
        entry = mmh.get(char, {})
        used = [w for w in words if char in w["word"]]
        word_reading = standalone.get(char, {}).get('pinyin')
        if word_reading:
            # TOCFL sometimes includes a reduplicated word beside the single-character reading.
            word_reading = min((p.strip() for p in word_reading.split('/') if p.strip()),
                               key=lambda p: len(reading_signature(p)[0]))
        readings = [word_reading] if word_reading else entry.get('pinyin', []).copy()
        signatures = {reading_signature(s['pinyin']) for s in cedict.get(char, [])}
        for reading in entry.get('pinyin', []):
            if reading_signature(reading) not in {reading_signature(p) for p in readings} and reading_signature(reading) in signatures:
                readings.append(reading)
        characters[char] = {"character": char, "pinyin": readings,
                            "pinyin_source": 'TOCFL primary; CC-CEDICT-verified MMH alternatives' if word_reading else 'Make Me a Hanzi',
                            "alternate_source_pinyin": entry.get('pinyin', []),
                            "definition": entry.get("definition") or cedict.get(char, [{}])[0].get("meaning"),
                            "radical": entry.get("radical"), "decomposition": entry.get("decomposition"),
                            "etymology": entry.get("etymology"),
                            "band": used[0]["band"] if used else "Unknown",
                            "band_evidence": {"word": used[0]['word'], "level": used[0]['level'],
                                              "sheet": used[0]['sheet'], "row": used[0]['row']} if used else None,
                            "source": "Make Me a Hanzi; CC-CEDICT for missing gloss"}
    edges = sorted({(part, char) for char, entry in characters.items()
                    for part in (entry.get("decomposition") or "")
                    if cjk(part) and part != char})
    relations = [{'source': a, 'target': b, 'kind': 'IDS leaf', 'source_name': 'Make Me a Hanzi'} for a, b in edges]
    for char, entry in characters.items():
        etym = entry.get('etymology') or {}
        for field, kind in [('phonetic', 'Sound'), ('semantic', 'Meaning')]:
            if etym.get(field):
                relations.append({'source': etym[field], 'target': char, 'kind': kind,
                                  'source_name': 'Make Me a Hanzi etymology'})
    dataset = {"characters": characters, "words": words, "edges": edges, "baseline": baseline,
               "display_relations": relations}
    (OUT / "pilot.json").write_text(json.dumps(dataset, ensure_ascii=False, indent=2))
    report = {"learning_characters": len(characters), "words": len(words), "component_edges": len(edges),
              "graph_nodes": len(set(characters) | {a for a, _ in edges}),
              "upstream_parsed_words": len(all_words), "excluded_entries": dict(skipped),
              "missing_character_definition": [c for c, e in characters.items() if not e["definition"]],
              "missing_character_pinyin": [c for c, e in characters.items() if not e["pinyin"]],
              "missing_word_meaning": [w["word"] for w in words if w["meaning"] == "Not available"],
              "missing_etymology": sum(not e["etymology"] for e in characters.values()),
              "sense_review_needed": [w['word'] for w in words if w['sense_status'] == 'Needs review'],
              "reviewed_demo_senses": [w['word'] for w in words if w['sense_status'] == 'Reviewed demo sense'],
              "radical_groups": len({e['radical'] for e in characters.values()}),
              "display_relations": len(relations),
              "unknown_decomposition": [c for c, e in characters.items()
                                        if not e["decomposition"] or "？" in e["decomposition"]],
              "family": {c: characters[c]["pinyin"] for c in sorted(family)},
              "selection": "Forced TOCFL demo words, then earliest level/row entries fitting 290 characters, stop at 450 words. Exact slash alternatives expanded; annotated/non-CJK entries excluded."}
    (OUT / "quality_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
    licenses = {"tocfl.zip": "SC-TOP copyright; public download, no open redistribution license identified. Local coursework use; retain source URL.",
                "makemeahanzi.jsonl": "LGPL v3 or later; see retained COPYING and upstream LGPL.",
                "makemeahanzi-COPYING": "Upstream license notice.",
                "cedict.gz": "CC BY-SA 4.0; derived English gloss data retains attribution and ShareAlike."}
    sources = [{"file": name, "url": url,
                "downloaded_at": datetime.fromtimestamp((RAW / name).stat().st_mtime, timezone.utc).isoformat(),
                "sha256": hashlib.sha256((RAW / name).read_bytes()).hexdigest(), "license": licenses[name]}
               for name, url in SOURCES.items()]
    (OUT / "sources.json").write_text(json.dumps({"tocfl_workbook": filename, "sources": sources,
        "cedict_version": cedict_version,
        "makemeahanzi_version": "master snapshot identified by SHA-256",
        "derived_data": "Original source terms apply to respective fields. Do not publish the bundled TOCFL snapshot without checking permission."}, ensure_ascii=False, indent=2))
    assert 150 <= len(characters) <= 300 and 300 <= len(words) <= 600
    assert all(set(w["word"]) <= set(characters) for w in words)
    assert family <= set(characters)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    build()
