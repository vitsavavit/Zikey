import unittest

from core import PRESETS, Dataset, normalize_pinyin


class RecommendationTests(unittest.TestCase):
    def setUp(self):
        self.data = Dataset(
            characters={c: {"character": c, "pinyin": [p]} for c, p in
                        [("請", "qǐng"), ("清", "qīng"), ("青", "qīng"),
                         ("情", "qíng"), ("問", "wèn"), ("人", "rén")]},
            words=[{"word": w} for w in ["請問", "人人", "人", "清", "情"]],
            edges=[("青", "請"), ("青", "清"), ("青", "情")],
            baseline=list("請問人清情青"),
        )

    def test_unlock_requires_all_other_characters(self):
        self.assertEqual(self.data.unlocks("請", set()), [])
        self.assertEqual(self.data.unlocks("請", {"問"}), ["請問"])

    def test_repeated_character_is_only_one_requirement(self):
        self.assertEqual(set(self.data.unlocks("人", set())), {"人", "人人"})
        self.assertEqual(self.data.coverage({"人"}), 40.0)

    def test_search_handles_tones_numbers_and_multiple_readings(self):
        self.assertEqual(normalize_pinyin("QǏNG"), "qing")
        self.assertEqual(normalize_pinyin("qing3"), "qing")
        self.assertEqual(set(self.data.search("qing")), set("請清青情"))
        self.assertEqual(self.data.search("請"), ["請"])
        self.assertEqual(self.data.search("not-a-syllable"), [])

    def test_known_characters_excluded_and_parts_sum(self):
        ranked = self.data.rank({"人"}, PRESETS["Default"])
        self.assertNotIn("人", [r["character"] for r in ranked])
        for row in ranked:
            self.assertAlmostEqual(row["score"], sum(row["parts"].values()))
            self.assertTrue(all(0 <= v <= 1 for v in row["normalized"].values()))
            self.assertEqual(row["raw"]["heat"], 0)

    def test_zero_weights_fall_back_and_invalid_weights_rejected(self):
        self.assertEqual(self.data.rank(set(), [0, 0, 0, 0]),
                         self.data.rank(set(), PRESETS["Default"]))
        for weights in [[-1, 1, 1, 1], [float("nan"), 1, 1, 1], [1, 2]]:
            with self.assertRaises(ValueError):
                self.data.rank(set(), weights)

    def test_goal_can_change_ranking(self):
        self.assertEqual(self.data.rank(set(), PRESETS["See structure"])[0]["character"], "青")
        self.assertEqual(self.data.rank(set(), PRESETS["Read more"])[0]["character"], "人")

    def test_curves_share_start_and_are_monotone(self):
        curves = self.data.compare({"問"}, PRESETS["Read more"], limit=100)
        for points in curves.values():
            self.assertEqual(points[0], self.data.coverage({"問"}))
            self.assertTrue(all(a <= b for a, b in zip(points, points[1:])))
            self.assertEqual(points[-1], 100.0)
        self.assertEqual(len({len(p) for p in curves.values()}), 1)

    def test_empty_data_and_all_known(self):
        empty = Dataset({}, [], [], [])
        self.assertEqual(empty.coverage(set()), 0)
        self.assertEqual(empty.rank(set(), [1, 1, 1, 1]), [])
        self.assertEqual(self.data.rank(set(self.data.characters), [1, 1, 1, 1]), [])


if __name__ == "__main__":
    unittest.main()
