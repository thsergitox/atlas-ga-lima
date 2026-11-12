"""Adquisición reanudable, con menos de cuarenta solicitudes por minuto."""
import json
import time

from routing.client import fetch_pair
from routing.cache import cache_folder


def collect(places, key, cache, limit=None, snap_radius=None):
    folder = cache_folder(cache, places, snap_radius)
    pairs = [(a, b) for a in places for b in places if a['id'] != b['id']]
    if limit is not None:
        pairs = pairs[:limit]
    features, attempts = [], 0
    for origin, destination in pairs:
        path = folder / f'{origin["id"]}-{destination["id"]}.json'
        if not path.exists():
            if attempts >= 420:
                raise SystemExit('Límite de intentos alcanzado. Se conserva el progreso local.')
            attempts += 1
            feature = fetch_pair(origin, destination, key, snap_radius)
            temporary = path.with_suffix('.tmp')
            temporary.write_text(json.dumps(feature, separators=(',', ':')))
            temporary.replace(path)
            time.sleep(2)
        features.append(json.loads(path.read_text()))
        if len(features) == 1 or len(features) % 20 == 0 or len(features) == len(pairs):
            print(f'ORS: {len(features)}/{len(pairs)} pares listos; {attempts} consultas en esta ejecución.', flush=True)
    return features
