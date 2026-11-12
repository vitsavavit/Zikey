import unittest

from core import Dataset
from workflow import apply_action, initial_state


class NavigationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = Dataset.load()

    def test_back_restores_one_view_without_undoing_learning(self):
        state = initial_state(self.data)
        for character in ('請', '人', '介'):
            apply_action(state, self.data, {'type': 'select', 'character': character})
        apply_action(state, self.data, {'type': 'mark'})
        learned = list(state['known'])
        apply_action(state, self.data, {'type': 'back'})
        self.assertEqual(state['selected'], '人')
        self.assertEqual(state['known'], learned)
        apply_action(state, self.data, {'type': 'back'})
        self.assertEqual(state['selected'], '請')
        self.assertEqual(len(state['history']), 1)

    def test_duplicate_selection_does_not_add_history(self):
        state = initial_state(self.data)
        for _ in range(3):
            apply_action(state, self.data, {'type': 'select', 'character': '請'})
        self.assertEqual(len(state['history']), 1)

    def test_jump_discards_only_navigation_after_destination(self):
        state = initial_state(self.data)
        for character in ('請', '人', '介'):
            apply_action(state, self.data, {'type': 'select', 'character': character})
        apply_action(state, self.data, {'type': 'back', 'index': 1})
        self.assertEqual(state['selected'], '請')
        self.assertEqual(len(state['history']), 1)
        apply_action(state, self.data, {'type': 'select', 'character': '女'})
        self.assertEqual(state['history'][-1]['selected'], '請')
        with self.assertRaises(ValueError):
            apply_action(state, self.data, {'type': 'back', 'index': 8})

    def test_invalid_navigation_does_not_pollute_history(self):
        state = initial_state(self.data)
        with self.assertRaises(ValueError):
            apply_action(state, self.data, {'type': 'select', 'character': 'missing'})
        self.assertEqual(state['history'], [])


if __name__ == '__main__':
    unittest.main()
