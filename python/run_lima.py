"""Ejecutar: python3 python/run_lima.py. No requiere instalar bibliotecas."""
import csv
import json
from pathlib import Path

from dataset import evaluate, matrices
from evolution import execute
from operators import mutate

ROOT = Path(__file__).resolve().parents[1]


def export_csv(name, rows):
    with (ROOT / 'data' / name).open('w', newline='') as output:
        writer = csv.writer(output)
        writer.writerow(['id'] + list(range(1, len(rows) + 1)))
        for i, row in enumerate(rows, 1):
            writer.writerow([i] + row)


def main():
    places = json.loads((ROOT / 'data/museums.json').read_text())['places']
    data = matrices(places)
    run = execute(data)
    # A recorded demonstration of the original diversification setting.
    _, demonstration = mutate(run['crossover']['children'][0], 0.9)
    payload = {'model': 'Haversine; caminar a 4.5 km/h hasta 1 km; en otro caso traslado a 18 km/h más 4 min. Costo simulado max(8,4+2.5D), 0 si D<=1. Sin entradas ni visitas.', 'matrices': data, 'run': run, 'mutation': demonstration}
    (ROOT / 'data/experiment.json').write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')))
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
