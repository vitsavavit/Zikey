import json
import unittest
from pathlib import Path

from core import Dataset, PRESETS, SEED_KNOWN
from scripts.prepare_data import reading_signature, choose_sense, dictionary_senses


class RedesignTests(unittest.TestCase):
    def test_sense_matching_keeps_tone_unlike_search(self):
        self.assertEqual(reading_signature('qĭngwèn'), reading_signature('qing3 wen4'))
        self.assertNotEqual(reading_signature('qīng'), reading_signature('qing3'))
        self.assertEqual(reading_signature('kànjiɑn'), reading_signature('kan4 jian5'))

    def test_dictionary_variants_are_explicit_and_do_not_replace_exact_entries(self):
        source = {'週末': [{'pinyin': 'zhou1 mo4', 'meaning': 'weekend'}]}
        self.assertEqual(dictionary_senses('周末', source), ('週末', source['週末']))
        source['周末'] = [{'pinyin': 'zhou1 mo4', 'meaning': 'exact entry'}]
        self.assertEqual(dictionary_senses('周末', source)[1][0]['meaning'], 'exact entry')
        self.assertEqual(dictionary_senses('無資料', source), ('無資料', []))

    def test_alternative_readings_and_neutral_tone_differences_keep_glosses(self):
        senses=[{'pinyin':'yi1 gong4','meaning':'in total; altogether'}]
        self.assertEqual(choose_sense('一共','yīgòng /gòng',senses)[0],'in total; altogether')
        meaning,status=choose_sense('早上','zǎoshàng',[
            {'pinyin':'zao3 shang5','meaning':'early morning'}])
        self.assertEqual(meaning,'early morning')
        self.assertEqual(status,'Reading variant — check pronunciation')
        meaning,status=choose_sense('例','lì',[
            {'pinyin':'li3','meaning':'different tone sense'}])
        self.assertEqual(status,'Needs review')

    def test_common_sense_over_name_and_ambiguity_is_visible(self):
        senses = [{'pinyin': 'Qing1', 'meaning': 'surname Qing'},
                  {'pinyin': 'qing1', 'meaning': 'green/blue'}]
        meaning, status = choose_sense('青', 'qīng', senses)
        self.assertEqual(meaning, 'green/blue')
        self.assertEqual(status, 'Reviewed demo sense')
        meaning, status = choose_sense('例', 'lì', [
            {'pinyin': 'li4', 'meaning': 'one sense'}, {'pinyin': 'li4', 'meaning': 'another sense'}])
        self.assertEqual(status, 'Needs review')
        self.assertNotIn(meaning, ['one sense', 'another sense'])

    def test_family_root_child_missing_and_external(self):
        data = Dataset.load()
        self.assertEqual(data.family('請')[0], '青')
        self.assertEqual(set(data.family('青')[1]), set('青請清晴情睛'))
        self.assertIsNone(data.family('我'))
        root, members = data.family('灣')
        self.assertEqual(root, '彎')
        self.assertNotIn('彎', members)

    def test_display_relations_preserve_all_scores_and_curves(self):
        pilot = json.loads((Path(__file__).resolve().parents[1] / 'data/processed/pilot.json').read_text())
        original = Dataset(pilot['characters'], pilot['words'], pilot['edges'], pilot['baseline'])
        enriched = Dataset.load()
        known = SEED_KNOWN & set(original.characters)
        self.assertEqual(original.rank(known, PRESETS['Default']), enriched.rank(known, PRESETS['Default']))
        self.assertEqual(original.compare(known, PRESETS['Read more']), enriched.compare(known, PRESETS['Read more']))

    def test_processed_sense_and_band_provenance(self):
        data = Dataset.load()
        for char in '青清':
            word = next(w for w in data.words if w['word'] == char)
            self.assertEqual(word['sense_status'], 'Reviewed demo sense')
            self.assertTrue(word['part_of_speech'])
            self.assertNotIn('surname', word['meaning'])
            self.assertNotIn('dynasty', word['meaning'])
        self.assertEqual(data.characters['青']['band_evidence']['word'], '青')

    def test_tocfl_standalone_reading_preferred_to_legacy_character_reading(self):
        data=Dataset.load()
        self.assertEqual(reading_signature(data.characters['妳']['pinyin'][0]),reading_signature('ni3'))
        self.assertIn('了', data.search('liao'))
        self.assertIn('句', data.search('gou'))


if __name__ == '__main__':
    unittest.main()
