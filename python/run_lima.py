"""Ejecutar: python3 python/run_lima.py. No requiere instalar bibliotecas."""
import csv
import json
from pathlib import Path

from evolution import execute
from operators import mutate
from routing.dataset import matrices
from routing.provenance import provenance

ROOT = Path(__file__).resolve().parents[1]


def export_csv(name, rows):
    with (ROOT / 'data' / name).open('w', newline='') as output:
        writer = csv.writer(output, lineterminator='\n')
        writer.writerow(['id'] + list(range(1, len(rows) + 1)))
        for i, row in enumerate(rows, 1):
            writer.writerow([i] + row)


def main():
    places = json.loads((ROOT / 'data/museums.json').read_text())['places']
    raw = (ROOT / 'data/routes.geojson').read_bytes()
    routes = json.loads(raw)
    data = matrices(places, routes['features'])
    source = provenance(places, routes, raw)
    run = execute(data)
    # A recorded demonstration of the original diversification setting.
    _, demonstration = mutate(run['crossover']['children'][0], 0.9)
    payload = {'model': 'Distancias y tiempos de openrouteservice, driving-car, sin tráfico en vivo. Costos simulados max(8,4+2.5D) soles por tramo. Ruta abierta; sin entradas, visitas ni accesos peatonales.', 'provenance': source, 'matrices': data, 'run': run, 'mutation': demonstration}
    (ROOT / 'data/experiment.json').write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')))
    (ROOT / 'data/provenance.json').write_text(json.dumps(source, ensure_ascii=False, indent=2))
    for metric, matrix in data.items():
        export_csv(metric + '.csv', matrix)
    with (ROOT / 'data/museums.csv').open('w', newline='') as output:
        writer = csv.DictWriter(output, fieldnames=list(places[0]))
        writer.writeheader()
        writer.writerows(places)
    final = run['history'][-1]
    print(json.dumps({'initialFitness': run['initial']['fitness'], 'final': final, 'recordedSwaps': len(demonstration['steps'])}, indent=2))


if __name__ == '__main__':
    main()
