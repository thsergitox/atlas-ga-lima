"""uv run --with scipy python python/export_paper.py"""
import csv
import hashlib
import json
from pathlib import Path

from scipy.io import loadmat

from evolution import execute
from operators import mutate

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'ga-itinerary-planning-pc3/Turism_Istanbul'
TARGET = ROOT / 'data/paper'
UPSTREAM = 'https://github.com/Arbues/ga-itinerary-planning-pc3/blob/e84ed98c8ecd65bf269da847ee26147f1f282d70/Turism_Istanbul/'


def read(name):
    return loadmat(SOURCE / (name + '.mat'), mat_dtype=True)[name]


def export_csv(name, matrix):
    with (TARGET / name).open('w', newline='') as output:
        writer = csv.writer(output)
        writer.writerow(['id'] + list(range(1, len(matrix) + 1)))
        for i, row in enumerate(matrix, 1):
            writer.writerow([i] + row)


def main():
    TARGET.mkdir(exist_ok=True)
    places = []
    for row in read('Places'):
        i = int(row[0])
        name = {1: 'Dolmabahçe Palace', 6: 'Pelit Chocolate Museum'}.get(i, f'Destino {i} del dataset')
        places.append({'id': i, 'name': name, 'short': name if i in (1, 6) else f'Destino {i}',
                       'district': 'Estambul', 'lon': float(row[1]), 'lat': float(row[2]),
                       'source': UPSTREAM + 'Places.mat'})
    data = {key: read(name).tolist() for key, name in [('distance', 'Travel_Dis'), ('time', 'Travel_Times'), ('cost', 'Travel_Costs')]}
    initial = [row['Plan'].ravel().astype(int).tolist() for row in read('ind').flat]
    assert len(initial) == 100 and all(route[0] == 6 and sorted(route) == list(range(1, 13)) for route in initial)
    run = execute(data, budget=2000, start=6, initial=initial)
    _, demonstration = mutate(run['crossover']['children'][0], 0.9)
    payload = {'model': 'Matrices y población inicial originales de Estambul. Nueva ejecución Python del ciclo equivalente a S6; no son los resultados numéricos publicados en la tabla 7.', 'matrices': data, 'run': run, 'mutation': demonstration}
    (TARGET / 'experiment.json').write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')))
    (TARGET / 'museums.json').write_text(json.dumps({'source': UPSTREAM + 'Places.mat', 'places': places}, ensure_ascii=False, indent=2))
    for metric, matrix in data.items():
        export_csv(metric + '.csv', matrix)
    with (TARGET / 'museums.csv').open('w', newline='') as output:
        writer = csv.DictWriter(output, fieldnames=list(places[0]))
        writer.writeheader()
        writer.writerows(places)
    provenance = []
    original = TARGET / 'original'
    original.mkdir(exist_ok=True)
    for name in ['Places', 'Travel_Dis', 'Travel_Times', 'Travel_Costs', 'ind']:
        content = (SOURCE / (name + '.mat')).read_bytes()
        (original / (name + '.mat')).write_bytes(content)
        provenance.append({'file': name + '.mat', 'source': UPSTREAM + name + '.mat', 'sha256': hashlib.sha256(content).hexdigest()})
    (TARGET / 'provenance.json').write_text(json.dumps(provenance, indent=2))
    print(json.dumps({'places': len(places), 'initialFitness': run['initial']['fitness'], 'final': run['history'][-1]}, indent=2))


if __name__ == '__main__':
    main()
