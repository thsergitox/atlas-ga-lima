"""Ciclo evolutivo compartido por Lima y los datos originales de Estambul."""
from dataset import evaluate
from operators import crossover, initial_population, mutate, tournament


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

