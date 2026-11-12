"""Nueva corrida ORS; preserva coordenadas, población y C del caso histórico."""
import json
import shutil
from pathlib import Path

from dataset import evaluate
from evolution import execute
from operators import mutate
from routing.dataset import matrices
from routing.provenance import provenance

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data/paper'
TARGET = ROOT / 'data/istanbul'


def comparison(paper, run, data):
    old_route = paper['run']['history'][-1]['route']
    new_route = run['history'][-1]['route']
    return {
        'note': 'Dos corridas aleatorias guardadas. Comparación descriptiva, sin prueba de superioridad causal ni de óptimo. Ambas rutas se evalúan con D/T ORS y C histórica.',
        'historical': {'route': old_route, **evaluate(old_route, data, 2000)},
        'ors': {'route': new_route, **evaluate(new_route, data, 2000)},
        'historicalUnderOriginalData': evaluate(old_route, paper['matrices'], 2000)
    }


def main():
    paper = json.loads((SOURCE / 'experiment.json').read_text())
    places = json.loads((SOURCE / 'museums.json').read_text())['places']
    raw = (TARGET / 'routes.geojson').read_bytes()
    routes = json.loads(raw)
    data = matrices(places, routes['features'], historical_cost=paper['matrices']['cost'])
    initial = paper['run']['selection']['pool']
    run = execute(data, budget=2000, start=6, initial=initial)
    _, demonstration = mutate(run['crossover']['children'][0], 0.9)
    source = provenance(places, routes, raw, budget=2000, currency='TRY',
        cost_model='Travel_Costs.mat original, sin recalcular. Costo histórico en TL, no tarifa actual de ORS.')
    source['originalData'] = '../paper/provenance.json'
    source['comparisonControls'] = 'Mismas doce coordenadas, cien rutas iniciales, inicio 6 y B=2000 TL. D/T se sustituyen por ORS; C se conserva. Corridas sin semilla, no experimento causal.'
    payload = {'model': 'Estambul: D/T y geometría ORS driving-car, sin tráfico. C histórica intacta; sin entradas, visitas ni accesos peatonales.',
        'provenance': source, 'matrices': data, 'run': run, 'mutation': demonstration,
        'comparison': comparison(paper, run, data)}
    (TARGET / 'experiment.json').write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')))
    (TARGET / 'provenance.json').write_text(json.dumps(source, ensure_ascii=False, indent=2))
    for name in ['museums.json', 'museums.csv', 'basemap.json']:
        shutil.copyfile(SOURCE / name, TARGET / name)
    for metric, rows in data.items():
        content = ['id,' + ','.join(str(i) for i in range(1, len(rows) + 1))]
        content.extend(str(i) + ',' + ','.join(str(value) for value in row) for i, row in enumerate(rows, 1))
        (TARGET / (metric + '.csv')).write_text('\n'.join(content) + '\n')
    print(json.dumps({'pairs': len(routes['features']), 'comparison': payload['comparison'],
        'maxAccessGapMeters': max(max(g['originGapMeters'], g['destinationGapMeters']) for g in source['accessGaps'])}, indent=2))


if __name__ == '__main__':
    main()
