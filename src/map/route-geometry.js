export function createRouteGeometry(museums, collection) {
  const points = new Map(museums.map(p => [p.id, [p.lat, p.lon]]));
  const routes = new Map((collection?.features || []).map(feature => {
    const { originId, destinationId } = feature.properties;
    return [`${originId}:${destinationId}`, feature.geometry.coordinates.map(([lon, lat]) => [lat, lon])];
  }));
  const extent = [...points.values(), ...[...routes.values()].flat()];
  function edges(ids) {
    return ids.slice(0, -1).flatMap((origin, i) => {
      const destination = ids[i + 1];
      if (origin === destination) return [];
      const key = `${origin}:${destination}`;
      const coordinates = collection ? routes.get(key) : [points.get(origin), points.get(destination)];
      if (!coordinates) throw new Error(`Falta el trazado vial ${origin}→${destination}`);
      return [{ key, origin, destination, coordinates }];
    });
  }
  return { extent, edges, routed: !!collection };
}
