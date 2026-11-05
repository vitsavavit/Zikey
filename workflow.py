"""Validated UI transitions for the local learning workspace."""
from collections import Counter

from core import PRESETS, SEED_KNOWN


def initial_state(data):
    return dict(mode='overview', selected=None, radical=None, scope='Overall', query='',
                matches=[], known=sorted(SEED_KNOWN & set(data.characters)), goal='Default',
                weights=list(PRESETS['Default']), simulated=False, logging=False, events=[],
                explanation=None, error=None, revision=0)


def select(state, data, char):
    if char not in data.characters:
        raise ValueError('Choose a character from the learning vocabulary.')
    state.update(selected=char, mode='focus', radical=None,
                 scope='This family' if data.family(char) else 'Overall', explanation=None)
    if state['logging']:
        state['events'].append({'character': char, 'action': 'lookup'})


def apply_action(state, data, action):
    # Acknowledge no-op actions too: an identical payload leaves client controls locked.
    revision = state.get('revision', 0) + 1
    state['revision'] = revision
    state['error'] = None
    kind = action.get('type')
    if kind in ('select', 'select_book'):
        keep_overall = kind == 'select_book' and state['scope'] == 'Overall'
        select(state, data, action.get('character'))
        if keep_overall:
            state['scope'] = 'Overall'
    elif kind == 'search':
        query = str(action.get('query', ''))[:80].strip()
        matches = data.search(query)
        state.update(query=query, matches=matches, explanation=None)
        families = {data.family(c)[0] if data.family(c) else c for c in matches}
        if len(families) == 1 and matches:
            root = next(iter(families))
            select(state, data, root if root in matches else matches[0])
        else:
            state.update(mode='search', selected=None, radical=None, scope='Overall')
    elif kind == 'overview':
        state.update(mode='overview', selected=None, radical=None, matches=[], query='', scope='Overall', explanation=None)
    elif kind == 'radical':
        radical = action.get('radical')
        if not any(e.get('radical') == radical for e in data.characters.values()):
            raise ValueError('Unknown radical group.')
        state.update(mode='radical', radical=radical, selected=None, scope='Overall', matches=[], query='', explanation=None)
    elif kind == 'scope':
        scope = action.get('scope')
        if scope not in ('Overall', 'This family') or (scope == 'This family' and not data.family(state['selected'])):
            raise ValueError('No documented sound family for this selection.')
        state.update(scope=scope, explanation=None)
    elif kind == 'goal':
        goal = action.get('goal')
        if goal not in PRESETS:
            raise ValueError('Choose a listed goal.')
        state.update(goal=goal, weights=list(PRESETS[goal]), explanation=None)
    elif kind == 'weights':
        values = action.get('weights', [])
        data.rank(set(state['known']), values)
        state.update(weights=values, explanation=None)
    elif kind == 'mark':
        char = state['selected']
        if char not in data.characters:
            raise ValueError('Select a learning character first.')
        state.update(known=sorted(set(state['known']) ^ {char}), explanation=None)
    elif kind == 'known':
        state.update(known=sorted(set(str(action.get('characters', ''))) & set(data.characters)), explanation=None)
    elif kind == 'heat':
        state.update(simulated=bool(action.get('enabled')), explanation=None)
    elif kind == 'logging':
        state.update(logging=bool(action.get('enabled')), explanation=None)
    elif kind == 'reset':
        state.update(initial_state(data))
        state['revision'] = revision
    elif kind != 'explain':
        raise ValueError('Unknown workspace action.')


def heat_for(state, data):
    if state['simulated']:
        return {c: (ord(c) * 17) % 83 for c in data.characters}
    return dict(Counter(e['character'] for e in state['events'])) if state['logging'] else {}
