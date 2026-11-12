"""Un trayecto dirigido con distancia, duración y geometría de ORS."""
import json
import math
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ENDPOINT = 'https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson'
LEGACY_ENDPOINT = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson'


def fetch_pair(origin, destination, key, snap_radius=None):
    coordinates = [[p['lon'], p['lat']] for p in (origin, destination)]
    options = {} if snap_radius is None else {'radiuses': [snap_radius, snap_radius]}
    request = Request(ENDPOINT, data=json.dumps({'coordinates': coordinates, **options}).encode(),
                      headers={'Authorization': key, 'Content-Type': 'application/json',
                               'User-Agent': 'Atlas-GA-Lima/1.0 (academic presentation)'})
    try:
        with urlopen(request, timeout=30) as response:
            payload = json.load(response)
    except HTTPError as error:
        # Nunca imprimir la petición: lleva la credencial en la cabecera.
        try:
            detail = json.loads(error.read().decode()).get('error', {})
        except (json.JSONDecodeError, UnicodeDecodeError):
            detail = 'Respuesta de error sin JSON'
        message = detail.get('message', str(detail.get('code', ''))) if isinstance(detail, dict) else str(detail)
        message = message.replace(key, '[credencial omitida]')[:300]
        raise RuntimeError(f'ORS HTTP {error.code}: {message}; par {origin["id"]}→{destination["id"]}. Progreso conservado; no se reintenta un rechazo de cuota.') from None
    except (URLError, TimeoutError):
        raise RuntimeError(f'ORS no respondió; par {origin["id"]}→{destination["id"]}') from None
    features = payload.get('features', [])
    if len(features) != 1:
        raise ValueError('Se esperaba exactamente un recorrido de ORS.')
    feature = features[0]
    summary = feature['properties']['summary']
    geometry = feature['geometry']
    if geometry['type'] != 'LineString' or len(geometry['coordinates']) < 2:
        raise ValueError('Geometría vial incompleta.')
    for coordinate in geometry['coordinates']:
        if len(coordinate) != 2 or not all(math.isfinite(x) for x in coordinate):
            raise ValueError('Coordenada vial inválida.')
    if summary['distance'] <= 0 or summary['duration'] <= 0:
        raise ValueError('Distancia o tiempo no positivos fuera de la diagonal.')
    return {'type': 'Feature', 'geometry': geometry, 'properties': {
        'originId': origin['id'], 'destinationId': destination['id'],
        'distanceMeters': summary['distance'], 'durationSeconds': summary['duration'],
        'sourceEndpoint': ENDPOINT,
        'requestOptions': options,
        'acquiredAt': datetime.now(timezone.utc).isoformat(),
        'engine': payload.get('metadata', {}).get('engine', {})}}
