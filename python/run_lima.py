"""Ejecutar: python3 python/run_lima.py. No requiere instalar bibliotecas."""
import csv
import json
from pathlib import Path

from dataset import evaluate, matrices
from operators import crossover, initial_population, mutate, tournament

ROOT = Path(__file__).resolve().parents[1]


def execute(data, budget=180, size=100, generations=100):
    score = lambda route: evaluate(route, data, budget)['fitness']
    population = sorted(initial_population(size, 10), key=score, reverse=True)
    initial = population[0].copy()
    initial_pool = [r.copy() for r in population]
    history = []
    mu = 0.1
    selection = None
    crossover_example = None
    for generation in range(generations):
        first_children = []
        second_children = []
        for _ in range(size // 2):
            p1, p2, mu, candidates = tournament(population, score, mu)
            child1, child2, cuts = crossover(p1, p2)
            first_children.append(child1)
            second_children.append(child2)
            if selection is None:
                selection = {'pool': initial_pool, 'candidates': candidates, 'parents': [p1, p2]}
            if crossover_example is None and child1 != p1 and child2 != p2:
                crossover_example = {'parents': [p1, p2], 'children': [child1, child2], 'cuts': cuts}
        offspring = first_children + second_children
        mutated = [mutate(child, mu)[0] for child in offspring]
        population = sorted(population + mutated, key=score, reverse=True)[:size]
        best = population[0].copy()
        history.append({'generation': generation + 1, 'route': best, 'mu': mu, **evaluate(best, data, budget)})
    return {'parameters': {'population': size, 'generations': generations, 'budget': budget, 'initialMu': 0.1}, 'initial': {'route': initial, **evaluate(initial, data, budget)}, 'selection': selection, 'crossover': crossover_example, 'history': history}


def export_csv(name, rows):
    with (ROOT / 'data' / name).open('w', newline='') as output:
        writer = csv.writer(output)
        writer.writerow(['id'] + list(range(1, 11)))
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
