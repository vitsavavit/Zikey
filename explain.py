"""Local LLM selects one or two supported fact sentences, never invents facts."""

import hashlib
import json
from pathlib import Path

import requests

MODEL = "qwen2.5-coder:7b"
CACHE = Path(__file__).parent / ".runtime/explanations"


def evidence_for(data, character, known, weights, heat=None):
    row = next((r for r in data.rank(known, weights, heat) if r["character"] == character), None)
    entry = data.characters[character]
    facts = []
    if row:
        dominant = max(row["parts"], key=row["parts"].get)
        label = {"prevalence": "vocabulary prevalence", "reuse": "component reuse",
                 "unlock": "new readable words", "heat": "lookup heat"}[dominant]
        facts.append(f"The largest contribution to {character}'s score comes from {label}.")
        facts.append(f"{character} occurs in {row['raw']['prevalence']} of the {len(data.words)} pilot vocabulary entries.")
        unlocked = data.unlocks(character, known)
        if unlocked:
            facts.append(f"With your current known characters, learning {character} unlocks {len(unlocked)} words, including {', '.join(unlocked[:3])}.")
        else:
            facts.append(f"Learning {character} alone unlocks no complete words from your current known-character set.")
        if row["raw"]["reuse"]:
            facts.append(f"{character} appears as a leaf component in the decompositions of {row['raw']['reuse']} learning characters in this pilot graph.")
    else:
        facts.append(f"You already know {character}, so it is excluded from the recommendation ranking.")
    etym = entry.get("etymology") or {}
    if etym.get("phonetic") and etym.get("semantic"):
        facts.append(f"Make Me a Hanzi identifies {etym['phonetic']} as the sound component and {etym['semantic']} as the meaning component of {character}.")
    return facts


def explain(data, character, known, weights, heat=None, *, model=MODEL, timeout=60):
    facts = evidence_for(data, character, known, weights, heat)
    key = hashlib.sha256(json.dumps([model, facts], ensure_ascii=False).encode()).hexdigest()
    target = CACHE / f"{key}.json"
    if target.exists():
        try:
            cached = json.loads(target.read_text())
            sentences = cached.get("sentences") if isinstance(cached, dict) else None
            if isinstance(sentences, list) and 1 <= len(sentences) <= 2 and all(s in facts for s in sentences):
                return {**cached, "cached": True}
        except (OSError, ValueError):
            pass  # An interrupted cache write must not prevent a fresh local-model call.
    schema = {"type": "object", "properties": {"sentences": {"type": "array",
              "items": {"type": "string", "enum": facts}, "minItems": 1, "maxItems": 2}},
              "required": ["sentences"], "additionalProperties": False}
    try:
        response = requests.post("http://127.0.0.1:11434/api/chat", json={
            "model": model, "stream": False, "format": schema, "keep_alive": "10m",
            "messages": [{"role": "system", "content":
                "You explain Chinese-character learning recommendations. Select exactly two distinct verbatim sentences from the supplied evidence: one about the strongest score contribution, and one about unlocked words or useful character structure. Never alter sentences. Return the JSON schema only."},
                {"role": "user", "content": json.dumps({"character": character, "evidence": facts}, ensure_ascii=False)}],
            "options": {"temperature": 0, "num_predict": 240, "num_ctx": 2048}}, timeout=(3, timeout))
        response.raise_for_status()
        result = json.loads(response.json()["message"]["content"])
        if not isinstance(result, dict):
            raise ValueError("Model response must be an object containing supported sentences.")
        sentences = result.get("sentences", [])
        if not isinstance(sentences, list) or not 1 <= len(sentences) <= 2 or not all(isinstance(s, str) and s in facts for s in sentences) or len(set(sentences)) != len(sentences):
            raise ValueError("Model response contains unsupported or repeated evidence.")
        result = {"sentences": sentences, "mode": "Local LLM · supported evidence selection", "model": model}
        CACHE.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(result, ensure_ascii=False, indent=2))
        return {**result, "cached": False}
    except (requests.RequestException, ValueError, KeyError, TypeError) as error:
        return {"sentences": facts[:1] + facts[2:3], "mode": "Template fallback · local model unavailable or invalid",
                "model": model, "error": str(error), "cached": False}
