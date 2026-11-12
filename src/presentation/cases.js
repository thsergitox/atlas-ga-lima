export const cases = {
  lima: {
    id: 'lima', label: 'Lima · 20 museos', city: 'Lima, Perú', shortCity: 'Lima', n: 20,
    start: 1, startName: 'MALI', budget: 360, currency: 'S/', budgetMin: 30, budgetMax: 600, budgetStep: 10,
    path: 'data/', searchSpace: '19! ≈ 1.216 × 10¹⁷',
    timeLabel: 'Tiempo modelado', costLabel: 'Costo simulado',
    dataNote: 'Coordenadas OSM. Distancias geodésicas; tiempos y costos de un modelo académico, sin tráfico real.',
    districtLabels: [['Pueblo Libre', -77.074, -12.082], ['Centro de Lima', -77.048, -12.041], ['Miraflores', -77.046, -12.118], ['Barranco', -77.012, -12.144], ['San Borja', -77.005, -12.09]],
    ocean: 'Océano Pacífico'
  },
  paper: {
    id: 'paper', label: 'Paper · Estambul (12)', city: 'Estambul, Turquía', shortCity: 'Estambul', n: 12,
    start: 6, startName: 'Pelit Chocolate Museum', budget: 2000, currency: 'TL', budgetMin: 100, budgetMax: 3000, budgetStep: 100,
    path: 'data/paper/', searchSpace: '11! = 39 916 800',
    timeLabel: 'Tiempo del dataset', costLabel: 'Costo del dataset',
    dataNote: 'Matrices y población inicial originales del repositorio. Nueva ejecución Python; no son los resultados publicados del paper.',
    districtLabels: [['Estambul', 28.92, 41.12], ['Bósforo', 29.06, 41.06]],
    ocean: ''
  }
};

export async function loadCase(id) {
  const profile = cases[id] || cases.lima;
  const [museums, basemap, experiment, algorithm] = await Promise.all([
    ...['museums.json', 'basemap.json', 'experiment.json'].map(async file => {
      const response = await fetch(profile.path + file);
      if (!response.ok) throw new Error(`No se pudo cargar ${file}`);
      return response.json();
    }),
    fetch('data/algorithm.py').then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el código completo');
      return response.text();
    })
  ]);
  if (museums.places.length !== profile.n || experiment.run.initial.route.length !== profile.n) throw new Error('El tamaño del dataset no coincide con el caso');
  return { profile, museums: museums.places, basemap, experiment, algorithm };
}
