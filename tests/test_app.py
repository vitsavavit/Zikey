import unittest
from pathlib import Path
from core import Dataset, PRESETS
from workflow import initial_state, apply_action, heat_for
from streamlit.testing.v1 import AppTest

class AppTests(unittest.TestCase):
    def test_workspace_boots_without_exception(self):
        app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'),default_timeout=30).run()
        self.assertFalse(app.exception)
        self.assertEqual(app.session_state['workspace']['mode'],'overview')

    def test_repeated_navigation_and_reset_acknowledge_every_action(self):
        data=Dataset.load();state=initial_state(data)
        for revision,action in enumerate([{'type':'overview'},{'type':'overview'},
                                          {'type':'reset'},{'type':'reset'}],1):
            apply_action(state,data,action)
            self.assertEqual(state['revision'],revision)
        with self.assertRaises(ValueError):apply_action(state,data,{'type':'invalid'})
        self.assertEqual(state['revision'],5)

    def test_learning_flow_and_missing_family(self):
        data=Dataset.load();state=initial_state(data)
        apply_action(state,data,{'type':'radical','radical':'言'})
        self.assertEqual((state['mode'],state['scope']),('radical','Overall'))
        apply_action(state,data,{'type':'search','query':'qing'})
        self.assertEqual((state['selected'],state['scope']),('青','This family'))
        apply_action(state,data,{'type':'select','character':'請'})
        before=data.coverage(set(state['known']))
        apply_action(state,data,{'type':'mark'})
        self.assertGreater(data.coverage(set(state['known'])),before)
        apply_action(state,data,{'type':'mark'})
        self.assertEqual(data.coverage(set(state['known'])),before)
        apply_action(state,data,{'type':'goal','goal':'See structure'})
        self.assertEqual(state['weights'],list(PRESETS['See structure']))
        apply_action(state,data,{'type':'select','character':'我'})
        self.assertEqual(state['scope'],'Overall')
        with self.assertRaises(ValueError):apply_action(state,data,{'type':'scope','scope':'This family'})

    def test_search_empty_multi_family_and_heat_separation(self):
        data=Dataset.load();state=initial_state(data)
        apply_action(state,data,{'type':'search','query':'shi'})
        self.assertEqual(state['mode'],'search')
        apply_action(state,data,{'type':'search','query':'invalidquery'})
        self.assertEqual(state['matches'],[])
        self.assertFalse(heat_for(state,data))
        apply_action(state,data,{'type':'logging','enabled':True})
        apply_action(state,data,{'type':'select','character':'請'})
        self.assertEqual(heat_for(state,data),{'請':1})
        apply_action(state,data,{'type':'heat','enabled':True})
        self.assertEqual(heat_for(state,data)['請'],(ord('請')*17)%83)
        apply_action(state,data,{'type':'heat','enabled':False})
        self.assertEqual(heat_for(state,data),{'請':1})
        apply_action(state,data,{'type':'logging','enabled':False})
        self.assertEqual(heat_for(state,data),{})

if __name__=='__main__':unittest.main()
