"""Adquirir los trayectos dirigidos de un caso; reanuda desde la caché local."""
import argparse
import json
from pathlib import Path

from routing.collection import collect
from routing.client import ENDPOINT
from routing.credentials import api_key

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--case', choices=['lima', 'istanbul'], default='lima')
    parser.add_argument('--snap-radius', type=int, choices=range(1, 2001), metavar='METROS',
                        help='Radio máximo de búsqueda de vía, separado en la caché.')
    parser.add_argument('--limit', type=int, help='Piloto: primeros pares, sin exportar dataset parcial.')
    arguments = parser.parse_args()
    source = ROOT / ('data/' if arguments.case == 'lima' else 'data/paper/')
    target = ROOT / ('data/' if arguments.case == 'lima' else 'data/istanbul/')
    places = json.loads((source / 'museums.json').read_text())['places']
    expected = 20 if arguments.case == 'lima' else 12
    if len(places) != expected or [p['id'] for p in places] != list(range(1, expected + 1)):
        raise SystemExit(f'Se requieren {expected} destinos con IDs consecutivos.')
    features = collect(places, api_key(ROOT), ROOT / '.cache/ors', arguments.limit, arguments.snap_radius)
    if arguments.limit is not None:
        print('Piloto conservado en caché; los archivos públicos siguen completos.')
        return
    city = 'Lima' if arguments.case == 'lima' else 'Estambul'
    payload = {'type': 'FeatureCollection', 'name': f'{city} · {len(features)} trayectos dirigidos',
        'attribution': '© openrouteservice by HeiGIT | © OpenStreetMap contributors',
        'license': 'CC-BY-SA-4.0', 'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'provider': 'openrouteservice', 'profile': 'driving-car', 'liveTraffic': False,
        'endpoint': ENDPOINT,
        'snapRadiusMeters': arguments.snap_radius or 350,
        'features': features}
    target.mkdir(exist_ok=True)
    output = target / 'routes.geojson'
    temporary = output.with_suffix('.tmp')
    temporary.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')))
    temporary.replace(output)
    print(f'Dataset completo exportado: {output.relative_to(ROOT)}; {len(features)} pares. Sin credenciales.')


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, ValueError) as error:
        raise SystemExit(str(error)) from None
