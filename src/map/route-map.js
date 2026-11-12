import { tilePoint, viewport, pathFor } from './geography.js';
import { node, createMarkers } from './markers.js';

export function createMap(host, museums, basemap, profile) {
  const point = museum => tilePoint(museum.lon, museum.lat, basemap.zoom);
  const points = museums.map(point);
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
  const before = node('path', { class: 'route-before', fill: 'none' });
  const route = node('path', { class: 'route-active', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const markers = createMarkers(museums, points, host, profile.start);
  svg.append(base, labels, before, route, markers.layer);
  host.replaceChildren(svg);
  const resize = new ResizeObserver(([entry]) => {
    const box = viewport(points, entry.contentRect.width, entry.contentRect.height);
    svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`);
    route.style.strokeWidth = `${2.6 / box.scale}px`;
    before.style.strokeWidth = `${1.4 / box.scale}px`;
    before.style.strokeDasharray = `${5 / box.scale} ${5 / box.scale}`;
    labels.querySelectorAll('text').forEach(el => { el.style.fontSize = `${12 / box.scale}px`; });
    markers.layout(box.scale);
  });
  resize.observe(host);
  let current = [];
  let animation = 0;
  const coordinates = ids => ids.map(id => points[id - 1]);
  function show(ids, { compare = null, animate = true, affected = [] } = {}) {
    cancelAnimationFrame(animation);
    const target = coordinates(ids);
    const start = current.length === target.length ? current.map(p => [...p]) : target;
    before.setAttribute('d', compare ? pathFor(coordinates(compare)) : '');
    markers.layer.querySelectorAll('.affected').forEach(el => el.classList.remove('affected'));
    affected.forEach(id => markers.layer.querySelector(`[data-id="${id}"]`)?.classList.add('affected'));
    const duration = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 850 : 0;
    const began = performance.now();
    function frame(now) {
      const t = duration ? Math.min(1, (now - began) / duration) : 1;
      const eased = 1 - (1 - t) ** 4;
      current = target.map((p, i) => p.map((v, axis) => start[i][axis] + (v - start[i][axis]) * eased));
      route.setAttribute('d', pathFor(current));
      if (t < 1) animation = requestAnimationFrame(frame);
    }
    animation = requestAnimationFrame(frame);
    svg.setAttribute('aria-label', `Ruta abierta por ${ids.join(', ')}. ${ids.length - 1} tramos, sin retorno al inicio.`);
  }
  return {
    show,
    destroy() { resize.disconnect(); cancelAnimationFrame(animation); },
    labels(visible) { svg.classList.toggle('show-labels', visible); },
    highlight(id) {
      markers.layer.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      markers.layer.querySelector(`[data-id="${id}"]`)?.classList.add('highlighted');
    }
  };
}
