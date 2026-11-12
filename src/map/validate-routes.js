export function validateRoutes(collection, n, matrices) {
  if (collection.type !== 'FeatureCollection' || collection.features.length !== n * (n - 1)) {
    throw new Error('Los recorridos dirigidos están incompletos');
  }
  const pairs = new Set();
  for (const feature of collection.features) {
    const { originId: a, destinationId: b, distanceMeters: distance, durationSeconds: time } = feature.properties;
    const key = `${a}:${b}`;
    const validId = id => Number.isInteger(id) && id >= 1 && id <= n;
    if (!validId(a) || !validId(b) || a === b || pairs.has(key)) throw new Error('Par vial inválido o duplicado');
    if (![distance, time].every(x => Number.isFinite(x) && x > 0)) throw new Error('Métrica vial inválida');
    if (Math.abs(distance / 1000 - matrices.distance[a - 1][b - 1]) > 1e-8 ||
        Math.abs(time / 60 - matrices.time[a - 1][b - 1]) > 1e-8) throw new Error('Las matrices no corresponden a los recorridos');
    const geometry = feature.geometry;
    if (geometry.type !== 'LineString' || geometry.coordinates.length < 2 ||
        !geometry.coordinates.every(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat) && Math.abs(lon) <= 180 && Math.abs(lat) < 85)) {
      throw new Error('Coordenadas del trazado vial inválidas');
    }
    pairs.add(key);
  }
}
