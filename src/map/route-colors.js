// Each color contrasts at least 4.5:1 against the white stroke beneath the route.
export const routePalette = [
  '#1b52c0', '#c01b22', '#138831', '#751bc0', '#887513', '#158191', '#c01b7b',
  '#348613', '#1c1bc0', '#c04c1b', '#138656', '#ac1bc0', '#6b7d12', '#1b74c0',
  '#c01b44', '#138819', '#531bc0', '#9e6c17', '#13847b', '#c01b9d'
];

export function createRouteColors() {
  let current = new Map();
  return edges => {
    if (edges.length > routePalette.length) throw new Error('La paleta no cubre todos los tramos.');
    const colors = new Map(edges.filter(edge => current.has(edge.key)).map(edge => [edge.key, current.get(edge.key)]));
    const used = new Set(colors.values());
    for (const edge of edges) {
      if (colors.has(edge.key)) continue;
      const color = routePalette.find(value => !used.has(value));
      colors.set(edge.key, color); used.add(color);
    }
    current = colors;
    return colors;
  };
}
