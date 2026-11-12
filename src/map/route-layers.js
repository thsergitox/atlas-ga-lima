import * as L from '../../assets/vendor/leaflet/leaflet-src.esm.js';
import { createRouteColors } from './route-colors.js';

export function createRouteLayers(map) {
  const previous = L.layerGroup().addTo(map), active = L.layerGroup().addTo(map);
  const outlines = L.layerGroup().addTo(map), assignColors = createRouteColors();
  const paths = new Map(), animations = new Set();
  let current = [];
  function stop() {
    for (const animation of animations) animation.cancel();
    animations.clear();
  }
  function animatePath(path, frames, duration, finish) {
    const animation = path.animate(frames, { duration, easing: 'cubic-bezier(.16,1,.3,1)' });
    animations.add(animation);
    animation.onfinish = () => { animations.delete(animation); finish?.(); };
  }
  function show(edges, { compare, animate = true } = {}) {
    stop(); previous.clearLayers();
    const old = compare ?? current, oldKeys = new Set(old.map(e => e.key)), keys = new Set(edges.map(e => e.key));
    const removed = old.filter(e => !keys.has(e.key)), added = edges.filter(e => !oldKeys.has(e.key));
    const motion = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colors = assignColors(edges);
    for (const edge of removed) {
      const line = L.polyline(edge.coordinates, { pane: 'previous-routes', className: 'route-before',
        color: '#526579', weight: 2, opacity: .7, dashArray: '5 6', interactive: false }).addTo(previous);
      line.getElement().dataset.edge = edge.key;
      if (motion && !compare) animatePath(line.getElement(), [{ opacity: .7 }, { opacity: 0 }], 500, () => previous.removeLayer(line));
      else if (!compare) previous.removeLayer(line);
    }
    for (const [key, segment] of paths) if (!keys.has(key)) {
      active.removeLayer(segment.line); outlines.removeLayer(segment.outline); paths.delete(key);
    }
    for (const [index, edge] of edges.entries()) {
      const color = colors.get(edge.key);
      let segment = paths.get(edge.key);
      if (!segment) {
        const outline = L.polyline(edge.coordinates, { pane: 'route-outlines', className: 'route-outline',
          color: '#ffffff', weight: 7, opacity: .95, interactive: false, smoothFactor: .5 }).addTo(outlines);
        const line = L.polyline(edge.coordinates, { pane: 'active-routes', className: 'route-active',
          color, weight: 4, opacity: 1, smoothFactor: .5 }).addTo(active).bindTooltip('', { sticky: true });
        segment = { line, outline }; paths.set(edge.key, segment);
      }
      const { line } = segment;
      line.setStyle({ color });
      line.setTooltipContent(`Tramo ${index + 1}: ${edge.origin} → ${edge.destination}`);
      const path = line.getElement(); path.dataset.edge = edge.key;
      path.setAttribute('aria-label', `Tramo ${index + 1}: ${edge.origin} a ${edge.destination}`);
      path.removeAttribute('pathLength'); path.style.removeProperty('stroke-dasharray');
      if (motion && !oldKeys.has(edge.key)) {
        path.setAttribute('pathLength', '1'); path.style.strokeDasharray = '1';
        animatePath(path, [{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }], 850, () => {
          path.removeAttribute('pathLength'); path.style.removeProperty('stroke-dasharray');
        });
      }
    }
    current = edges;
    return { count: edges.length, added: old.length ? added.length : 0, removed: removed.length };
  }
  return { show, destroy() { stop(); previous.clearLayers(); active.clearLayers(); outlines.clearLayers(); } };
}
