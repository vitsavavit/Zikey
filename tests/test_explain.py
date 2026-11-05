import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

import requests

from core import PRESETS, SEED_KNOWN, Dataset
from explain import evidence_for, explain


class ExplanationTests(unittest.TestCase):
    def setUp(self):
        self.backend_patch = patch.dict('os.environ', {'ZIKEY_EXPLANATION_BACKEND': 'ollama'})
        self.backend_patch.start()
        self.addCleanup(self.backend_patch.stop)
        self.data = Dataset.load()
        self.known = SEED_KNOWN & set(self.data.characters)
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.cache_patch = patch("explain.CACHE", Path(self.tmp.name))
        self.cache_patch.start()
        self.addCleanup(self.cache_patch.stop)

    @patch('explain.requests.post')
    def test_template_mode_never_calls_model_or_reads_cached_ai_output(self, post):
        explain(self.data, '請', self.known, PRESETS['Default'])
        with patch.dict('os.environ', {'ZIKEY_EXPLANATION_BACKEND': 'template'}):
            post.reset_mock()
            result = explain(self.data, '請', self.known, PRESETS['Default'])
            post.assert_not_called()
            self.assertIn('no AI request', result['mode'])
            self.assertIsNone(result['model'])
            self.assertFalse(result['cached'])

    @patch("explain.requests.post")
    def test_unsupported_model_output_uses_labelled_fallback(self, post):
        post.return_value = Mock(json=lambda: {"message": {"content": '{"sentences": ["This character was invented in 2026."]}'}})
        result = explain(self.data, "請", self.known, PRESETS["Default"])
        self.assertIn("Template fallback", result["mode"])
        self.assertNotIn("invented", " ".join(result["sentences"]))

    @patch("explain.requests.post", side_effect=requests.ConnectionError("offline"))
    def test_offline_model_keeps_explanation_and_ranking_usable(self, post):
        result = explain(self.data, "青", self.known, PRESETS["Default"])
        self.assertIn("Template fallback", result["mode"])
        self.assertTrue(result["sentences"])

    @patch("explain.requests.post")
    def test_non_object_json_uses_labelled_fallback(self, post):
        for content in ["[]", "null", '"hello"', '{"sentences": {}}']:
            with self.subTest(content=content):
                post.return_value = Mock(json=lambda: {"message": {"content": content}})
                result = explain(self.data, "青", self.known, PRESETS["Default"])
                self.assertIn("Template fallback", result["mode"])

    @patch("explain.requests.post", side_effect=requests.ConnectionError("offline"))
    def test_interrupted_cache_write_does_not_crash(self, post):
        import hashlib
        import json
        from explain import MODEL
        facts = evidence_for(self.data, "青", self.known, PRESETS["Default"])
        key = hashlib.sha256(json.dumps([MODEL, facts], ensure_ascii=False).encode()).hexdigest()
        for content in ['{"sentences":', 'null', '{"sentences": "x"}']:
            Path(self.tmp.name, key + ".json").write_text(content)
            result = explain(self.data, "青", self.known, PRESETS["Default"])
            self.assertIn("Template fallback", result["mode"])

    @patch("explain.requests.post")
    def test_valid_evidence_cached_but_known_set_changes_key(self, post):
        import json
        facts = evidence_for(self.data, "請", self.known, PRESETS["Default"])
        post.return_value = Mock(json=lambda: {"message": {"content": json.dumps({"sentences": facts[:2]})}})
        result = explain(self.data, "請", self.known, PRESETS["Default"])
        self.assertIn("Local LLM", result["mode"])
        self.assertTrue(explain(self.data, "請", self.known, PRESETS["Default"])["cached"])
        self.assertEqual(post.call_count, 1)
        explain(self.data, "請", self.known - {"問"}, PRESETS["Default"])
        self.assertEqual(post.call_count, 2)


if __name__ == "__main__":
    unittest.main()
