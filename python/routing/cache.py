"""Identidad del dataset independiente del dominio migrado por HeiGIT."""
import hashlib
import json

from routing.client import LEGACY_ENDPOINT


def cache_folder(cache, places, snap_radius=None):
    signature = {'provider': 'openrouteservice', 'profile': 'driving-car',
                 'format': 'geojson', 'requestVersion': 1, 'places': places}
    if snap_radius is not None:
        signature['radiuses'] = [snap_radius, snap_radius]
    fingerprint = hashlib.sha256(json.dumps(signature, sort_keys=True).encode()).hexdigest()
    folder = cache / fingerprint
    folder.mkdir(parents=True, exist_ok=True)
    old_signature = {'endpoint': LEGACY_ENDPOINT, 'places': places}
    old_hash = hashlib.sha256(json.dumps(old_signature, sort_keys=True).encode()).hexdigest()
    for path in (cache / old_hash).glob('*.json') if snap_radius is None else []:
        target = folder / path.name
        if not target.exists():
            feature = json.loads(path.read_text())
            feature['properties']['sourceEndpoint'] = LEGACY_ENDPOINT
            target.write_text(json.dumps(feature, separators=(',', ':')))
    return folder
