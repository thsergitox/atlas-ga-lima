import * as L from '../../assets/vendor/leaflet/leaflet-src.esm.js';
import { addBasemap } from './leaflet-basemap.js';
import { addMapControls } from './leaflet-controls.js';
import { createMarkers } from './markers.js';
import { createRouteGeometry } from './route-geometry.js';
import { createRouteLayers } from './route-layers.js';
import { createMapExpansion } from './map-expansion.js';

export function createMap(host, museums, basemap, profile, collection = null, information = {}) {
  host.replaceChildren();
  host.setAttribute('role', 'region'); host.setAttribute('aria-label', `Mapa interactivo de ${profile.shortCity}`);
  const canvas = document.createElement('div'); canvas.className = 'leaflet-frame'; host.append(canvas);
  const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map = L.map(canvas, { zoomControl: false, zoomSnap: .25, zoomDelta: 1, minZoom: 9, maxZoom: 19,
    zoomAnimation: motion, fadeAnimation: motion, markerZoomAnimation: motion, inertia: motion });
  const geometry = createRouteGeometry(museums, collection);
  const bounds = L.latLngBounds(geometry.extent);
  map.setView(bounds.getCenter(), basemap.zoom);
  let zooming = false;
  map.on('zoomstart', () => { zooming = true; });
  map.on('zoomend', () => { zooming = false; });
  map.createPane('previous-routes').style.zIndex = 390;
  map.createPane('active-routes').style.zIndex = 400;
  addBasemap(map, basemap);
  const fit = (animate = motion) => map.fitBounds(bounds, { paddingTopLeft: [35, 30], paddingBottomRight: [65, 35], animate, maxZoom: 15 });
  addMapControls(map, () => fit());
  const expansion = createMapExpansion(host, map, profile.shortCity, geometry.routed);
  const markers = createMarkers(map, museums, information, profile.start);
  const layers = createRouteLayers(map);
  let disposed = false, resizePending = false;
  const refresh = () => {
    if (disposed || !host.clientWidth || !host.clientHeight) return;
    const view = expansion.resizeView();
    map.invalidateSize({ animate: false, pan: false });
    if (view) map.setView(view.center, view.zoom, { animate: false }); else fit(false);
  };
  const resize = new ResizeObserver(() => {
    if (!host.clientWidth || !host.clientHeight) return;
    if (!zooming) { refresh(); return; }
    if (resizePending) return;
    resizePending = true;
    map.once('zoomend', () => { resizePending = false; refresh(); });
  });
  resize.observe(host);
  function show(ids, { compare = null, animate = true, affected = [] } = {}) {
    const counts = layers.show(geometry.edges(ids), { compare: compare ? geometry.edges(compare) : undefined, animate });
    markers.affected(affected);
    const kind = geometry.routed ? (counts.count === 1 ? 'vial' : 'viales') : (counts.count === 1 ? 'esquemático' : 'esquemáticos');
    const change = counts.added || counts.removed ? ` · ${counts.added} nuevos · ${counts.removed} retirados` : '';
    document.querySelector('#map-route-status').textContent = counts.count
      ? `${counts.count} ${counts.count === 1 ? 'tramo' : 'tramos'} ${kind}${change}` : 'Mismo destino · sin desplazamiento';
  }
  return { show, dismiss() { markers.close(); }, labels: markers.labels, highlight: markers.highlight,
    destroy() {
      disposed = true;
      expansion.destroy();
      resize.disconnect(); markers.destroy(); layers.destroy();
      // Leaflet 1.9 finishes CSS zoom with a delayed callback; keep its detached pane alive until zoomend.
      if (zooming) map.once('zoomend', () => map.remove()); else map.remove();
    } };
}
