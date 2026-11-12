"""Recuperar los veinte registros OSM elegidos para esta exposición."""
import datetime
import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

TERMS = [
    ('Museo de Arte de Lima', 'MALI', 'Centro'),
    ('Museo Larco', 'Larco', 'Pueblo Libre'),
    ('Museo Nacional de Arqueología', 'MNAAHP', 'Pueblo Libre'),
    ('Museo de Arte Italiano', 'Arte Italiano', 'Centro'),
    ('Museo Metropolitano de Lima', 'Metropolitano', 'Centro'),
    ('Museo de Historia Natural', 'Historia Natural', 'Jesús María'),
    ('Museo Central', 'MUCEN', 'Centro'),
    ('Museo de Arte Contemporaneo', 'MAC Lima', 'Barranco'),
    ('Museo de La Electricidad', 'Electricidad', 'Barranco'),
    ('Museo Pedro de Osma', 'Pedro de Osma', 'Barranco'),
    ('Museo de la Nación', 'Museo de la Nación', 'San Borja'),
    ('Museo Oro del Perú', 'Oro del Perú', 'Surco'),
    ('Museo de la Inmigración Japonesa', 'Inmigración Japonesa', 'Jesús María'),
    ('Museo de Arte de San Marcos', 'Arte San Marcos', 'Centro'),
    ('Museo Nacional de la Cultura Peruana', 'Cultura Peruana', 'Centro'),
    ('Casa Museo José Carlos Mariátegui', 'Casa Mariátegui', 'Centro'),
    ('Museo de Neuropatología', 'Neuropatología', 'Barrios Altos'),
    ('Museo de Sitio El Mirador del Cerro San Cristóbal', 'San Cristóbal', 'Rímac'),
    ('Museo Señor de los Milagros', 'Señor de los Milagros', 'Centro'),
    ('Museo del Palacio Arzobispal', 'Palacio Arzobispal', 'Centro'),
]


def fetch():
    query = urlencode({'q': 'museo Lima Peru', 'format': 'json', 'limit': 40})
    request = Request('https://nominatim.openstreetmap.org/search?' + query,
                      headers={'User-Agent': 'AtlasGA-Lima/1.0 (https://github.com/thsergitox/atlas-ga-lima)'})
    with urlopen(request, timeout=30) as response:
        return json.load(response)


def select_places(records):
    places = []
    for i, (term, short, district) in enumerate(TERMS, 1):
        match = next((p for p in records if p['display_name'].startswith(term)), None)
        if match is None:
            raise ValueError('No se encontró ' + term + '; revisar la fuente antes de cambiar el dataset.')
        places.append({'id': i, 'name': match.get('name', match['display_name'].split(',')[0]),
                       'short': short, 'district': district, 'lat': float(match['lat']), 'lon': float(match['lon']),
                       'source': f"https://www.openstreetmap.org/{match['osm_type']}/{match['osm_id']}"})
    return places


if __name__ == '__main__':
    places = select_places(fetch())
    payload = {'retrieved': datetime.date.today().isoformat(),
               'source': 'OpenStreetMap vía Nominatim: búsqueda museo Lima Peru',
               'license': 'ODbL 1.0', 'places': places}
    target = Path(__file__).resolve().parents[1] / 'data/museums.json'
    target.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    print('Dataset actualizado. Ejecutar python3 python/run_lima.py para recalcular matrices y traza.')
