"""Algoritmo genético completo de la exposición Atlas GA.
Uso: python algorithm.py experiment.json
Lima: matrices viales ORS (20). Estambul: matrices del port (12).
Adquisición separada del algoritmo; nueva ejecución sin semilla.
COX, mutación por filas y torneo equivalentes al port de Arbues (MIT).
"""
import json
import random
import sys
from pathlib import Path

def evaluate(route, data, budget):
    totals = {}
    for metric, matrix in data.items():
        total = 0
        for i in range(len(route) - 1):
            total += matrix[route[i] - 1][route[i + 1] - 1]
        totals[metric] = total
    maximum_distance = max(max(row) for row in data['distance'])
    maximum_time = max(max(row) for row in data['time'])
    denominator = totals['distance'] / maximum_distance + totals['time'] / maximum_time
    totals['fitness'] = ((budget - totals['cost']) / budget) / denominator
    return totals

def initial_population(size, n, start=1):
    population = []
    for _ in range(size):
        tail = [place for place in range(1, n + 1) if place != start]
        random.shuffle(tail)
        population.append([start] + tail)
    return population

def copy_order(parent, other, a, b):
    left = sorted(parent[:a], key=other.index)
    right = sorted(parent[b:], key=other.index)
    return left + parent[a:b] + right

def crossover(p1, p2, cuts=None):
    a = random.randint(2, len(p1) - 2) if cuts is None else cuts[0]
    b = random.randint(a + 1, len(p1) - 1) if cuts is None else cuts[1]
    return copy_order(p1, p2, a, b), copy_order(p2, p1, a, b), [a, b]

def mutate(route, mu):
    current = route.copy()
    flags = [[random.random() < mu for _ in route] for _ in route]
    steps = []
    for i in range(1, len(route) - 1):
        if all(flags[i]):
            before = current.copy()
            current[i], current[i + 1] = current[i + 1], current[i]
            steps.append({'index': i, 'before': before, 'after': current.copy()})
    return current, {'mu': mu, 'flags': flags, 'before': route.copy(), 'after': current.copy(), 'steps': steps}

def tournament(population, score, mu):
    candidates = sorted(random.sample(population, len(population) // 5), key=score, reverse=True)
    p1 = candidates[0]
    for route in candidates[1:] + population:
        if route != p1:
            return p1, route, mu, candidates
    p2, _ = mutate(p1, 0.9)
    return p1, p2, 0.9, candidates

def execute(data, budget=360, size=100, generations=100, start=1, initial=None):
    score = lambda route: evaluate(route, data, budget)['fitness']
    n = len(data["distance"])
    population = sorted(initial if initial is not None else initial_population(size, n, start), key=score, reverse=True)
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

if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Uso: python algorithm.py experiment.json')
    data = json.loads(Path(sys.argv[1]).read_text())
    parameters = data['run']['parameters']
    initial = data['run']['selection']['pool']
    output = execute(data['matrices'], budget=parameters['budget'],
                     size=parameters['population'],
                     generations=parameters['generations'],
                     start=initial[0][0], initial=initial)
    print(json.dumps(output, ensure_ascii=False, indent=2))
