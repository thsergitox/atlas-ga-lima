"""Procedencia, fechas y accesos ajustados a la red vial."""
import hashlib

from dataset import haversine


def provenance(places, routes, raw, *, budget=360, currency='PEN', cost_model='Cii=0; Cij=max(8,4+2.5*Dij) soles. Hipótesis, no tarifa comercial.'):
    by_id = {p['id']: p for p in places}
    gaps = []
    for feature in routes['features']:
        p, coordinates = feature['properties'], feature['geometry']['coordinates']
        distances = []
        for identifier, coordinate in [(p['originId'], coordinates[0]), (p['destinationId'], coordinates[-1])]:
            distances.append(1000 * haversine(by_id[identifier], {'lon': coordinate[0], 'lat': coordinate[1]}))
        gaps.append({'originId': p['originId'], 'destinationId': p['destinationId'],
                     'originGapMeters': round(distances[0], 1), 'destinationGapMeters': round(distances[1], 1)})
    dates = sorted(f['properties']['acquiredAt'] for f in routes['features'])
    endpoints = {}
    for feature in routes['features']:
        endpoint = feature['properties']['sourceEndpoint']
        endpoints[endpoint] = endpoints.get(endpoint, 0) + 1
    return {'provider': 'openrouteservice by HeiGIT', 'profile': routes['profile'],
        'liveTraffic': False, 'coordinates': 'GeoJSON [longitude, latitude]',
        'acquiredFrom': dates[0], 'acquiredUntil': dates[-1], 'directedPairs': len(gaps),
        'diagonal': f'{len(places)} valores cero locales; no se consulta i→i',
        'routesSha256': hashlib.sha256(raw).hexdigest(),
        'sourceEndpoints': endpoints,
        'migrationNote': 'Cada par conserva el endpoint original de adquisición; sourceEndpoints cuenta los pares de cada dominio del mismo servicio ORS.',
        'routesLicense': 'CC-BY-SA-4.0', 'licenseUrl': routes['licenseUrl'],
        'termsUrl': 'https://account.heigit.org/info/tos',
        'attribution': routes['attribution'],
        'snapRadiusMeters': routes.get('snapRadiusMeters', 350),
        'costModel': cost_model,
        'budget': budget, 'units': {'distance': 'km', 'time': 'min', 'cost': currency},
        'accessNote': 'La polilínea empieza/termina en la red accesible en automóvil. No se inventa un tramo hasta el punto OSM del museo; esos accesos no están incluidos en D/T.',
        'accessGaps': gaps}
