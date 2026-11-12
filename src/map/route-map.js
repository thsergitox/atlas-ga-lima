import { tilePoint, viewport } from './geography.js';
import { node, createMarkers } from './markers.js';
import { createRouteGeometry } from './route-geometry.js';
import { createRouteLayers } from './route-layers.js';

export function createMap(host, museums, basemap, profile, collection = null) {
  const point = museum => tilePoint(museum.lon, museum.lat, basemap.zoom);
  const geometry = createRouteGeometry(museums, basemap.zoom, collection);
  const points = geometry.points;
  const svg = node('svg', { role: 'group', 'aria-label': `Mapa de ${museums.length} destinos de ${profile.shortCity}` });
  const base = node('g', { class: 'basemap' });
  for (const tile of basemap.tiles) {
    base.append(node('image', { href: tile.file, x: tile.x * 256, y: tile.y * 256, width: 256.5, height: 256.5 }));
  }
  const labels = node('g', { class: 'district-labels' });
  for (const [name, lon, lat] of profile.districtLabels) {
    const [x, y] = point({ lon, lat });
    const text = node('text', { x, y }); text.textContent = name; labels.append(text);
  }
  const layers = createRouteLayers();
  const markers = createMarkers(museums, points, host, profile.start);
  svg.append(base, labels, layers.previous, layers.active, markers.layer);
  host.replaceChildren(svg);
  const resize = new ResizeObserver(([entry]) => {
    const box = viewport(geometry.extent, entry.contentRect.width, entry.contentRect.height);
    svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`);
    labels.querySelectorAll('text').forEach(el => { el.style.fontSize = `${12 / box.scale}px`; });
    markers.layout(box.scale);
  });
  resize.observe(host);
  function show(ids, { compare = null, animate = true, affected = [] } = {}) {
    const counts = layers.show(geometry.edges(ids), { compare: compare ? geometry.edges(compare) : undefined, animate });
    markers.layer.querySelectorAll('.affected').forEach(el => el.classList.remove('affected'));
    affected.forEach(id => markers.layer.querySelector(`[data-id="${id}"]`)?.classList.add('affected'));
    const status = document.querySelector('#map-route-status');
    if (status) {
      const kind = geometry.routed ? (counts.count === 1 ? 'vial' : 'viales') : (counts.count === 1 ? 'esquemático' : 'esquemáticos');
      const change = counts.added || counts.removed ? ` · ${counts.added} ${counts.added === 1 ? 'nuevo' : 'nuevos'} · ${counts.removed} ${counts.removed === 1 ? 'retirado' : 'retirados'}` : '';
      status.textContent = counts.count ? `${counts.count} ${counts.count === 1 ? 'tramo' : 'tramos'} ${kind}${change}` : 'Mismo destino · sin desplazamiento';
    }
    svg.setAttribute('aria-label', `Ruta abierta por ${ids.join(', ')}. ${counts.count} tramos ${geometry.routed ? 'por calles' : 'esquemáticos'}, sin retorno al inicio.`);
  }
  return {
    show,
    destroy() { resize.disconnect(); layers.destroy(); },
    labels(visible) { svg.classList.toggle('show-labels', visible); },
    highlight(id) {
      markers.layer.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      markers.layer.querySelector(`[data-id="${id}"]`)?.classList.add('highlighted');
    }
  };
}
