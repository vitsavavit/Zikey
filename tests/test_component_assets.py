import unittest
from pathlib import Path
from component_assets import workspace_assets


class ComponentAssetTests(unittest.TestCase):
    def test_component_is_self_contained_for_cloud(self):
        html, css, js = workspace_assets(Path(__file__).resolve().parents[1]/'static')
        self.assertIn('id="workspace"', html)
        self.assertNotIn('/app/static/', css)
        self.assertIn('data:image/png;base64,', css)
        self.assertIn('data:font/ttf;base64,', css)
        self.assertIn('font-family:"Patrick Hand"', css)
        self.assertIn("new FontFace('Patrick Hand'", js)
        self.assertNotIn("import(new URL('/app/static/", js)
        self.assertIn('export default async function(component)', js)
        self.assertGreater(len(js), 1_000_000)
