const NS = 'http://www.w3.org/2000/svg';
const node = (tag, attrs = {}) => {
  const element = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  return element;
};
const tilePoint = (lon, lat, z) => [
  (lon + 180) / 360 * 2 ** z * 256,
  (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * 2 ** z * 256
];

export function createMap(host, museums, basemap) {
  const center = tilePoint(-77.038, -12.099, basemap.zoom);
  const point = museum => {
    const p = tilePoint(museum.lon, museum.lat, basemap.zoom);
    return [p[0] - center[0] + 480, p[1] - center[1] + 515];
  };
  const svg = node('svg', { viewBox: '0 0 960 1030', role: 'img', 'aria-label': 'Mapa geográfico de diez museos de Lima y la ruta que los conecta' });
  const base = node('g', { class: 'basemap' });
  for (const tile of basemap.tiles) {
    base.append(node('image', { href: tile.file, x: tile.x * 256 - center[0] + 480, y: tile.y * 256 - center[1] + 515, width: 256.5, height: 256.5 }));
  }
  svg.append(base);
  const districtLabels = [
    ['Pueblo Libre', -77.074, -12.082], ['Centro de Lima', -77.048, -12.041],
    ['Jesús María', -77.054, -12.075], ['Miraflores', -77.046, -12.118],
    ['Barranco', -77.012, -12.144]
  ];
  const labels = node('g', { class: 'district-labels' });
  for (const [name, lon, lat] of districtLabels) {
    const [x, y] = point({ lon, lat });
    const t = node('text', { x, y }); t.textContent = name; labels.append(t);
  }
  const ocean = node('text', { x: 115, y: 690, class: 'ocean-label', transform: 'rotate(-24 115 690)' });
  ocean.textContent = 'Océano Pacífico'; labels.append(ocean); svg.append(labels);
  const before = node('path', { class: 'route-before', fill: 'none' });
  const route = node('path', { class: 'route-active', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const changed = node('g', { class: 'changed-edges' });
  svg.append(before, route, changed);
  const markerLayer = node('g', { class: 'museum-markers' });
  museums.forEach(museum => {
    const [x, y] = point(museum);
    const offset = { 1: [-25, 0], 4: [10, -32], 5: [10, 24] }[museum.id] || [0, 0];
    if (offset.some(Boolean)) markerLayer.append(node('path', { d: `M${x},${y}l${offset[0]},${offset[1]}`, class: 'marker-leader' }));
    const marker = node('g', { transform: `translate(${x + offset[0]} ${y + offset[1]})`, class: 'museum-marker', tabindex: '0', role: 'button', 'aria-label': `${museum.id}. ${museum.name}`, 'data-id': museum.id });
    const title = node('title'); title.textContent = `${museum.id}. ${museum.name}`;
    marker.append(title, node('circle', { r: museum.id === 1 ? 26 : 24 }));
    const text = node('text', { 'text-anchor': 'middle', dy: '.35em' }); text.textContent = museum.id; marker.append(text);
    const label = node('text', { x: 32, y: 5, class: 'museum-label' }); label.textContent = museum.short; marker.append(label);
    const activate = () => {
      markerLayer.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      marker.classList.add('highlighted');
      host.dispatchEvent(new CustomEvent('museum-select', { detail: museum, bubbles: true }));
    };
    marker.addEventListener('click', activate);
    marker.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
    });
    markerLayer.append(marker);
  });
  svg.append(markerLayer);
  const compass = node('g', { transform: 'translate(860 98)', class: 'compass' });
  compass.append(node('path', { d: 'M0 40V0m-8 13L0 0l8 13' }));
  const north = node('text', { x: 0, y: -13, 'text-anchor': 'middle' }); north.textContent = 'N'; compass.append(north); svg.append(compass);
  host.replaceChildren(svg);
  const resize = new ResizeObserver(([entry]) => {
    const width = Math.max(720, entry.contentRect.width / Math.max(1, entry.contentRect.height) * 1030);
    svg.setAttribute('viewBox', `${480 - width / 2} 0 ${width} 1030`);
  });
  resize.observe(host);
  let current = [];
  let animation = 0;
  const coordinates = ids => ids.map(id => point(museums[id - 1]));
  const path = coords => coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  function show(ids, { compare = null, animate = true, affected = [] } = {}) {
    cancelAnimationFrame(animation);
    const start = current.length ? current.map(p => [...p]) : coordinates(ids);
    const target = coordinates(ids);
    before.setAttribute('d', compare ? path(coordinates(compare)) : '');
    markerLayer.querySelectorAll('.affected').forEach(el => el.classList.remove('affected'));
    affected.forEach(id => markerLayer.querySelector(`[data-id="${id}"]`)?.classList.add('affected'));
    changed.replaceChildren();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = animate && !reduced ? 850 : 0;
    const began = performance.now();
    const frame = now => {
      const t = duration ? Math.min(1, (now - began) / duration) : 1;
      const eased = 1 - (1 - t) ** 4;
      current = target.map((p, i) => p.map((v, axis) => start[i][axis] + (v - start[i][axis]) * eased));
      route.setAttribute('d', path(current));
      if (t < 1) animation = requestAnimationFrame(frame);
    };
    animation = requestAnimationFrame(frame);
    svg.setAttribute('aria-label', `Ruta abierta por los museos ${ids.join(', ')}. Nueve tramos, sin retorno al inicio.`);
  }
  return {
    show,
    labels(visible) { svg.classList.toggle('show-labels', visible); },
    highlight(id) {
      markerLayer.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      markerLayer.querySelector(`[data-id="${id}"]`)?.classList.add('highlighted');
    }
  };
}
