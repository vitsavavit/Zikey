"""ZIKEY local data → score/LLM → linked galaxy workspace."""
import json
from collections import defaultdict
from pathlib import Path

import streamlit as st

from core import Dataset, SIGNALS
from explain import evidence_for, explain, explanation_backend
from workflow import initial_state, apply_action, heat_for
from component_assets import workspace_assets

ROOT = Path(__file__).parent
st.set_page_config(page_title='ZIKEY 字鑰', page_icon='字', layout='wide')
st.html('''<style>
[data-testid="stHeader"]{display:none}
.stMainBlockContainer{max-width:1800px;padding:12px!important}
.stApp{background:#30271f}
@media(max-width:600px){.stMainBlockContainer{padding:4px!important}}
</style>''')


@st.cache_resource
def load_data(data_version):
    return Dataset.load()


@st.cache_resource
def workspace_component(asset_version):
    html, css, js = workspace_assets(ROOT/'static')
    return st.components.v2.component('zikey_learning_workspace',
        html=html, css=css, js=js)


@st.cache_data(show_spinner=False)
def compare(known, weights, heat_items):
    return data.compare(set(known), weights, dict(heat_items))


data = load_data((ROOT/'data/processed/pilot.json').stat().st_mtime_ns)
if 'workspace' not in st.session_state:
    st.session_state.workspace = initial_state(data)
state = st.session_state.workspace


def on_action():
    action = st.session_state.get('galaxy_workspace', {}).get('action')
    if not isinstance(action, dict):
        return
    try:
        apply_action(state, data, action)
        if action.get('type') == 'explain':
            if state['selected'] not in data.characters:
                raise ValueError('Select a character before requesting an explanation.')
            state['explanation'] = explain(data, state['selected'], set(state['known']),
                                           state['weights'], heat_for(state, data))
    except (ValueError, TypeError, KeyError) as error:
        state['error'] = str(error)


known = set(state['known'])
heat = heat_for(state, data)
ranked = data.rank(known, state['weights'], heat)
selected = state['selected']
family = data.family(selected) if selected else None
family_ids = set(family[1]) if family else set()
scoped = [r for r in ranked if r['character'] in family_ids] if state['scope'] == 'This family' else ranked
selected_score = next((r for r in ranked if r['character'] == selected), None)

if state['mode'] == 'overview':
    ids = set(data.characters)
    graph_key = 'overview'
elif state['mode'] == 'radical':
    ids = {c for c, e in data.characters.items() if e['radical'] == state['radical']}
    graph_key = 'radical:' + state['radical']
elif state['mode'] == 'search':
    ids = set(state['matches'])
    graph_key = 'search:' + state['query']
else:
    ids = set(family_ids) | {selected} if family else {selected}
    if family:
        ids.add(family[0])
    selected_relations = [r for r in data.display_relations if r['target'] == selected]
    ids.update(r['source'] for r in selected_relations[:10])
    graph_key = 'family:' + family[0] if family else 'character:' + selected

nodes = []
for char in sorted(ids):
    e = data.characters.get(char, {})
    nodes.append(dict(id=char, pinyin=' / '.join(e.get('pinyin', [])),
                      radical=e.get('radical', '?'), band=e.get('band', 'Unknown'),
                      band_evidence=e.get('band_evidence'), prevalence=data.prevalence[char],
                      known=char in known, component=char not in data.characters,
                      recommended=bool(scoped and scoped[0]['character'] == char), heat=heat.get(char, 0)))
links = defaultdict(set)
if state['mode'] == 'focus':
    for relation in data.display_relations:
        a, b = relation['source'], relation['target']
        if a in ids and b in ids:
            links[(a, b)].add(relation['kind'])

related = [w for w in data.words if selected and selected in w['word']]
ring = []
for word in related:
    missing = sorted(set(word['word']) - known)
    if len(missing) <= 1:
        ring.append(dict(word=word['word'], missing=missing))
    if len(ring) == 6:
        break

explanation = state['explanation']
if explanation:
    rationale = ' '.join(explanation['sentences'])
    ai_status = explanation['mode'] + (' · cached' if explanation.get('cached') else '')
elif selected:
    rationale = evidence_for(data, selected, known, state['weights'], heat)[0]
    ai_status = ('Computed evidence · local LLM available on request' if explanation_backend() == 'ollama'
                 else 'Template mode · computed evidence · no AI request')
else:
    rationale = 'Choose a character to see why it is useful for your current knowledge.'
    ai_status = ('Local inference · no paid API' if explanation_backend() == 'ollama'
                 else 'Template mode · no paid API or model request')
if selected_score and not selected_score['score']:
    rationale = 'No active signal contributes to this score. Adjust weights or collect lookup data.'

payload = {**{k: v for k, v in state.items() if k not in ('events', 'explanation')},
           'family': {'root': family[0], 'members': family[1]} if family else None,
           'characters': data.characters, 'words': data.words, 'ranked': scoped[:5],
           'rank_count': len(scoped), 'global_next': ranked[0]['character'] if ranked else None,
           'selected_score': selected_score, 'selected_known': selected in known,
           'nodes': nodes, 'links': [{'source': a, 'target': b, 'kinds': sorted(k)} for (a, b), k in links.items()],
           'graph_key': graph_key, 'ring_words': ring, 'related_count': len(related),
           'unlocks': data.unlocks(selected, known) if selected else [],
           'rationale': rationale, 'ai_status': ai_status, 'explanation_backend': explanation_backend(),
           'coverage': data.coverage(known),
           'curves': compare(tuple(sorted(known)), tuple(state['weights']), tuple(sorted(heat.items()))),
           'quality': json.loads((ROOT/'data/processed/quality_report.json').read_text()),
           'radical_count': len({e['radical'] for e in data.characters.values()}),
           'heat_active': bool(state['simulated'] or state['logging']),
           'max_heat': max(heat.values(), default=1), 'event_count': len(state['events'])}
asset_version = tuple((ROOT/'static'/name).stat().st_mtime_ns for name in ('workspace.html', 'workspace.css', 'workspace.js'))
workspace_component(asset_version)(key='galaxy_workspace', data=payload, on_action_change=on_action)
