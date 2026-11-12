"""Matrices del mismo recorrido vial que se representa en el mapa."""
import math


def matrices(places, features):
    n = len(places)
    expected = {(a['id'], b['id']) for a in places for b in places if a['id'] != b['id']}
    pairs = {(f['properties']['originId'], f['properties']['destinationId']) for f in features}
    if len(features) != n * (n - 1) or pairs != expected:
        raise ValueError('Faltan pares dirigidos o hay duplicados en los recorridos.')
    data = {metric: [[0.0] * n for _ in places] for metric in ('distance', 'time', 'cost')}
    indices = {place['id']: i for i, place in enumerate(places)}
    for feature in features:
        p = feature['properties']
        i, j = indices[p['originId']], indices[p['destinationId']]
        distance, duration = p['distanceMeters'] / 1000, p['durationSeconds'] / 60
        if not all(math.isfinite(x) and x > 0 for x in (distance, duration)):
            raise ValueError(f'Trayecto no válido: {p["originId"]}→{p["destinationId"]}')
        data['distance'][i][j] = distance
        data['time'][i][j] = duration
        data['cost'][i][j] = max(8, 4 + 2.5 * distance)
    return data
