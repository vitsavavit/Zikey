"""Deterministic, inspectable recommendation and vocabulary coverage calculations."""

import json
import math
import unicodedata
from collections import Counter
from pathlib import Path

import networkx as nx

SIGNALS = ("prevalence", "reuse", "unlock", "heat")
PRESETS = {
    "Default": (35, 25, 40, 0),
    "Read more": (25, 15, 60, 0),
    "See structure": (15, 65, 20, 0),
}
SEED_KNOWN = set("我你他她是的一不有人大小中日月水木口問客天好")


def normalize_pinyin(value):
    value = value.lower().strip().replace("u:", "ü").replace("v", "ü")
    # Retain ü while removing only tone marks, including TOCFL's breve for tone 3.
    return "".join(c for c in unicodedata.normalize("NFD", value)
                   if c not in "12345\u0304\u0301\u030c\u0300\u0306" and not c.isspace())


class Dataset:
    def __init__(self, characters, words, edges, baseline, display_relations=None):
        self.characters = characters
        self.words = words
        self.wordsets = [(w["word"], set(w["word"])) for w in words]
        self.graph = nx.DiGraph()
        self.graph.add_nodes_from(characters)
        self.graph.add_edges_from(edges)
        self.baseline = list(dict.fromkeys(c for c in baseline if c in characters))
        self.baseline.extend(sorted(set(characters) - set(self.baseline)))
        self.order = {c: i for i, c in enumerate(self.baseline)}
        self.prevalence = Counter(c for _, chars in self.wordsets for c in chars)
        self.reuse = {c: self.graph.out_degree(c) for c in characters}
        self.display_relations = display_relations or []

    @classmethod
    def load(cls, path=None):
        path = path or Path(__file__).parent / "data/processed/pilot.json"
        data = json.loads(Path(path).read_text())
        return cls(data["characters"], data["words"], data["edges"], data["baseline"], data.get('display_relations'))

    def family(self, character):
        parent = (self.characters.get(character, {}).get('etymology') or {}).get('phonetic')
        roots = {((e.get('etymology') or {}).get('phonetic')) for e in self.characters.values()}
        root = parent or (character if character in roots else None)
        if not root:
            return None
        members = {c for c, e in self.characters.items()
                   if (e.get('etymology') or {}).get('phonetic') == root}
        if root in self.characters:
            members.add(root)
        return root, sorted(members, key=self.order.get)

    def search(self, query):
        query = query.strip()
        if not query:
            return []
        if query in self.characters:
            return [query]
        normalized = normalize_pinyin(query)
        return [c for c, entry in self.characters.items()
                if any(normalize_pinyin(p) == normalized for p in entry.get("pinyin", []))]

    def unlocks(self, character, known):
        return [word for word, chars in self.wordsets if chars - known == {character}]

    def coverage(self, known):
        if not self.wordsets:
            return 0.0
        return 100 * sum(chars <= known for _, chars in self.wordsets) / len(self.wordsets)

    def rank(self, known, weights, heat=None):
        if len(weights) != 4 or any(not math.isfinite(w) or w < 0 for w in weights):
            raise ValueError("Four finite, nonnegative weights are required.")
        weights = weights if sum(weights) else PRESETS["Default"]
        weights = [w / sum(weights) for w in weights]
        heat = heat or {}
        if any(not math.isfinite(v) or v < 0 for v in heat.values()):
            raise ValueError("Heat must contain finite, nonnegative counts.")
        unlocked = Counter()
        for _, chars in self.wordsets:
            missing = chars - known
            if len(missing) == 1:
                unlocked.update(missing)
        raw = {c: dict(zip(SIGNALS, (self.prevalence[c], self.reuse[c],
                                    unlocked[c], heat.get(c, 0))))
               for c in self.characters if c not in known}
        # Max scaling keeps an absent signal at zero and preserves visible magnitudes.
        maxima = {s: max((r[s] for r in raw.values()), default=0) or 1 for s in SIGNALS}
        ranked = []
        for c, values in raw.items():
            normalized = {s: values[s] / maxima[s] for s in SIGNALS}
            parts = {s: normalized[s] * w for s, w in zip(SIGNALS, weights)}
            ranked.append({"character": c, "raw": values, "normalized": normalized,
                           "parts": parts, "score": sum(parts.values())})
        return sorted(ranked, key=lambda r: (-r["score"], self.order[r["character"]]))

    def compare(self, known, weights, heat=None, limit=100):
        curves = {}
        count = min(limit, len(set(self.characters) - known))
        for name, current_weights in [("Vocabulary order", None),
                                      ("Default", PRESETS["Default"]), ("My goal", weights)]:
            current = set(known)
            values = [self.coverage(current)]
            for _ in range(count):
                if current_weights is None:
                    next_char = next(c for c in self.baseline if c not in current)
                else:
                    next_char = self.rank(current, current_weights, heat)[0]["character"]
                current.add(next_char)
                values.append(self.coverage(current))
            curves[name] = values
        return curves
