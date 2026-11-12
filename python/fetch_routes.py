"""Adquirir una vez los 380 trayectos; reanuda desde la caché local."""
import argparse
import json
from pathlib import Path

from routing.collection import collect
from routing.client import ENDPOINT
from routing.credentials import api_key

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--limit', type=int, help='Piloto: primeros pares, sin exportar dataset parcial.')
    arguments = parser.parse_args()
    places = json.loads((ROOT / 'data/museums.json').read_text())['places']
    if len(places) != 20 or [p['id'] for p in places] != list(range(1, 21)):
        raise SystemExit('Se requieren los veinte museos confirmados, con IDs 1…20.')
    features = collect(places, api_key(ROOT), ROOT / '.cache/ors', arguments.limit)
    if arguments.limit is not None:
        print('Piloto conservado en caché; los archivos públicos siguen completos.')
        return
    payload = {'type': 'FeatureCollection', 'name': 'Lima · 380 trayectos dirigidos',
        'attribution': '© openrouteservice by HeiGIT | © OpenStreetMap contributors',
        'license': 'CC-BY-SA-4.0', 'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'provider': 'openrouteservice', 'profile': 'driving-car', 'liveTraffic': False,
        'endpoint': ENDPOINT,
        'features': features}
    output = ROOT / 'data/routes.geojson'
    temporary = output.with_suffix('.tmp')
    temporary.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')))
    temporary.replace(output)
    print('Dataset completo exportado: data/routes.geojson; 380 pares. Sin credenciales.')


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, ValueError) as error:
        raise SystemExit(str(error)) from None
