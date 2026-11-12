import { validateRoutes } from '../map/validate-routes.js';

export const cases = {
  lima: {
    id: 'lima', label: 'Lima · 20 museos', city: 'Lima, Perú', shortCity: 'Lima', n: 20,
    start: 1, startName: 'MALI', budget: 360, currency: 'S/', budgetMin: 30, budgetMax: 600, budgetStep: 10,
    path: 'data/', searchSpace: '19! ≈ 1.216 × 10¹⁷',
    information: 'data/museum-info.json',
    timeLabel: 'Tiempo estimado', costLabel: 'Costo simulado', geometry: 'routes.geojson',
    dataNote: '380 trayectos de openrouteservice: distancia, tiempo estimado y calles del mismo recorrido. Automóvil, sin tráfico en vivo; costo simulado.',
    districtLabels: [['Pueblo Libre', -77.074, -12.082], ['Centro de Lima', -77.048, -12.041], ['Miraflores', -77.046, -12.118], ['Barranco', -77.012, -12.144], ['San Borja', -77.005, -12.09]],
    ocean: 'Océano Pacífico'
  },
  paper: {
    id: 'paper', label: 'Paper · Estambul (12)', city: 'Estambul, Turquía', shortCity: 'Estambul', n: 12,
    start: 6, startName: 'Pelit Chocolate Museum', budget: 2000, currency: 'TL', budgetMin: 100, budgetMax: 3000, budgetStep: 100,
    path: 'data/paper/', searchSpace: '11! = 39 916 800',
    information: 'data/istanbul-info.json',
    timeLabel: 'Tiempo del dataset', costLabel: 'Costo del dataset',
    dataNote: 'Matrices y población inicial originales del repositorio. Nueva ejecución Python; no son los resultados publicados del paper.',
    districtLabels: [['Estambul', 28.92, 41.12], ['Bósforo', 29.06, 41.06]],
    ocean: ''
  },
  istanbul: {
    id: 'istanbul', label: 'Estambul · ORS (12)', city: 'Estambul, Turquía', shortCity: 'Estambul', n: 12,
    start: 6, startName: 'Pelit Chocolate Museum', budget: 2000, currency: 'TL', budgetMin: 100, budgetMax: 3000, budgetStep: 100,
    path: 'data/istanbul/', searchSpace: '11! = 39 916 800', information: 'data/istanbul-info.json',
    timeLabel: 'Tiempo estimado', costLabel: 'Costo histórico', geometry: 'routes.geojson',
    dataNote: '132 recorridos ORS sobre las doce coordenadas originales. Distancia y tiempo nuevos; costo histórico conservado, sin tarifa actual. Compara las rutas en Resultado.',
    districtLabels: [['Estambul', 28.92, 41.12], ['Bósforo', 29.06, 41.06]], ocean: ''
  }
};

export async function loadCase(id) {
  const profile = cases[id] || cases.lima;
  const [museums, basemap, experiment, algorithm, routes, information] = await Promise.all([
    ...['museums.json', 'basemap.json', 'experiment.json'].map(async file => {
      const response = await fetch(profile.path + file);
      if (!response.ok) throw new Error(`No se pudo cargar ${file}`);
      return response.json();
    }),
    fetch('data/algorithm.py').then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el código completo');
      return response.text();
    }),
    profile.geometry ? fetch(profile.path + profile.geometry).then(response => {
      if (!response.ok) throw new Error('No se pudieron cargar los recorridos viales');
      return response.json();
    }) : null,
    fetch(profile.information).then(response => {
      if (!response.ok) throw new Error('No se pudieron cargar las fichas de los museos');
      return response.json();
    })
  ]);
  if (museums.places.length !== profile.n || experiment.run.initial.route.length !== profile.n) throw new Error('El tamaño del dataset no coincide con el caso');
  if (routes) validateRoutes(routes, profile.n, experiment.matrices);
  for (const place of museums.places) {
    const gaps = (experiment.provenance?.accessGaps || []).flatMap(gap => [
      ...(gap.originId === place.id ? [gap.originGapMeters] : []),
      ...(gap.destinationId === place.id ? [gap.destinationGapMeters] : [])
    ]);
    if (gaps.length) information.places[place.id] = { ...information.places[place.id],
      access: [Math.min(...gaps), Math.max(...gaps)] };
  }
  return { profile, museums: museums.places, basemap, experiment, algorithm, routes, information: information.places };
}
