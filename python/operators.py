"""Operadores equivalentes al port de Arbues; IDs 1-based, índices 0-based."""
import random


def initial_population(size, n):
    population = []
    for _ in range(size):
        tail = list(range(2, n + 1))
        random.shuffle(tail)
        population.append([1] + tail)
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
