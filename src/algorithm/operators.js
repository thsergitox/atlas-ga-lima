export function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function copyOrder(parent, other, a, b) {
  const order = values => [...values].sort((x, y) => other.indexOf(x) - other.indexOf(y));
  return [...order(parent.slice(0, a)), ...parent.slice(a, b), ...order(parent.slice(b))];
}

export function crossover(p1, p2, a, b) {
  return [copyOrder(p1, p2, a, b), copyOrder(p2, p1, a, b)];
}

export function mutate(route, mu) {
  const flags = route.map(() => route.map(() => Math.random() < mu));
  const current = [...route];
  const steps = [];
  for (let i = 1; i < route.length - 1; i++) {
    if (flags[i].every(Boolean)) {
      const before = [...current];
      [current[i], current[i + 1]] = [current[i + 1], current[i]];
      steps.push({ index: i, before, after: [...current] });
    }
  }
  return { mu, flags, before: [...route], after: current, steps };
}

export function totals(route, matrices, budget) {
  const result = { distance: 0, time: 0, cost: 0 };
  for (let i = 0; i < route.length - 1; i++) {
    for (const key of ['distance', 'time', 'cost']) {
      result[key] += matrices[key][route[i] - 1][route[i + 1] - 1];
    }
  }
  const dmax = Math.max(...matrices.distance.flat());
  const tmax = Math.max(...matrices.time.flat());
  result.fitness = ((budget - result.cost) / budget) / (result.distance / dmax + result.time / tmax);
  return result;
}
