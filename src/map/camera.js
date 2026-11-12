import { viewport } from './geography.js';
import { bindPan } from './pan.js';

export function createCamera(host, svg, extent, layout) {
  let base, current, level = 0, frame;
  const controls = document.createElement('div');
  controls.className = 'map-zoom';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Zoom del mapa');
  controls.innerHTML = `<button data-zoom="in" aria-label="Acercar mapa" title="Acercar (+)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg></button><output aria-label="Nivel de zoom">1×</output><button data-zoom="out" aria-label="Alejar mapa" title="Alejar (−)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button><button data-zoom="reset" aria-label="Encuadrar todos los destinos" title="Encuadrar destinos"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/></svg></button>`;
  host.append(controls);
  const buttons = controls.querySelectorAll('button');
  function paint(box) {
    if (!host.clientWidth || !host.clientHeight) return;
    current = { ...box, scale: host.clientWidth / box.w };
    svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`);
    layout(current.scale);
    host.dispatchEvent(new Event('map-viewchange'));
  }
  function constrain(box) {
    return { ...box, x: Math.max(base.x, Math.min(base.x + base.w - box.w, box.x)),
      y: Math.max(base.y, Math.min(base.y + base.h - box.h, box.y)) };
  }
  function move(target, animate) {
    cancelAnimationFrame(frame);
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { paint(target); return; }
    const from = current, start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / 260), eased = 1 - (1 - t) ** 4;
      paint(Object.fromEntries(['x', 'y', 'w', 'h', 'scale'].map(key => [key, from[key] + (target[key] - from[key]) * eased])));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }
  function zoom(next) {
    if (!base) return;
    level = Math.max(0, Math.min(5, next));
    const factor = 1.5 ** level, w = base.w / factor, h = base.h / factor;
    const target = level ? constrain({ x: current.x + (current.w - w) / 2,
      y: current.y + (current.h - h) / 2, w, h, scale: base.scale * factor }) : base;
    buttons[0].disabled = level === 5; buttons[1].disabled = level === 0;
    controls.querySelector('output').textContent = `${factor.toLocaleString('es', { maximumFractionDigits: 1 })}×`;
    move(target, true);
  }
  controls.onclick = event => {
    const action = event.target.closest('[data-zoom]')?.dataset.zoom;
    if (action) zoom(action === 'reset' ? 0 : level + (action === 'in' ? 1 : -1));
  };
  const pan = (dx, dy) => {
    if (!current || level === 0) return;
    const factor = 1.5 ** level, w = base.w / factor, h = base.h / factor, scale = base.scale * factor;
    move(constrain({ x: current.x + (current.w - w) / 2 + dx / scale,
      y: current.y + (current.h - h) / 2 + dy / scale, w, h, scale }), false);
  };
  const unbind = bindPan(svg, pan, () => zoom(level + 1), () => zoom(level - 1), () => zoom(0));
  const resize = new ResizeObserver(([entry]) => {
    if (!entry.contentRect.width || !entry.contentRect.height) { cancelAnimationFrame(frame); return; }
    host.classList.toggle('map-compact', entry.contentRect.height < 260);
    const previous = base;
    base = viewport(extent, entry.contentRect.width, entry.contentRect.height);
    const factor = 1.5 ** level, w = base.w / factor, h = base.h / factor;
    const cx = previous ? (current.x + current.w / 2 - previous.x) / previous.w : .5;
    const cy = previous ? (current.y + current.h / 2 - previous.y) / previous.h : .5;
    move(constrain({ x: base.x + base.w * cx - w / 2, y: base.y + base.h * cy - h / 2, w, h, scale: base.scale * factor }), false);
  });
  buttons[1].disabled = true;
  resize.observe(host);
  return { destroy() { cancelAnimationFrame(frame); resize.disconnect(); unbind(); controls.remove(); } };
}
