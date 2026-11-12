import { totals } from '../algorithm/operators.js';
export const format = (value, digits = 2) => new Intl.NumberFormat('es-PE', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
export const icon = name => ({ play: '<path d="m8 5 11 7-11 7z"/>', pause: '<path d="M8 5v14m8-14v14"/>', replay: '<path d="M4 8a8 8 0 1 1 0 9M4 3v5h5"/>', arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>', code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>' }[name] || '');
export const svgIcon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icon(name)}</svg>`;
export function genes(route, { middle = [], active = [], label = '', row = '' } = {}) {
  return `<div class="gene-row" ${row ? `data-row="${row}"` : ''}>${label ? `<span class="gene-label">${label}</span>` : ''}<div class="genes ${route.length > 12 ? 'long' : ''}" role="img" aria-label="Ruta: ${route.join(', ')}">${route.map((id, i) => `<span data-gene="${id}" class="gene ${i === 0 ? 'fixed' : ''} ${i >= middle[0] && i < middle[1] ? 'middle' : ''} ${active.includes(i) ? 'swapped' : ''}">${id}</span>`).join('')}</div></div>`;
}
export function animateGenes(container, route, options = {}) {
  const old = new Map([...container.querySelectorAll('[data-gene]')].map(el => [Number(el.dataset.gene), el.getBoundingClientRect()]));
  container.innerHTML = genes(route, options);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  container.querySelectorAll('[data-gene]').forEach(el => {
    const a = old.get(Number(el.dataset.gene));
    if (!a) return;
    const b = el.getBoundingClientRect();
    el.animate([{ transform: `translate(${a.x - b.x}px,${a.y - b.y}px)` }, { transform: 'translate(0,0)' }], { duration: 850, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
}
export function metricsFor(ctx, route, budget = ctx.profile.budget) {
  const { experiment: { matrices }, profile } = ctx;
  const m = totals(route, matrices, budget);
  return `<div class="metrics"><div><strong>${format(m.distance, 1)}<small> km</small></strong><span>Distancia</span></div><div><strong>${format(m.time, 0)}<small> min</small></strong><span>${profile.timeLabel}</span></div><div><strong><small>${profile.currency} </small>${format(m.cost, 1)}</strong><span>${profile.costLabel}</span></div><div><strong>${format(m.fitness, 4)}</strong><span>Fitness</span></div></div>`;
}
export function announce(text) { document.querySelector('#announcement').textContent = text; }
export function escape(text) { return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
export function codeBlock(lesson) {
  const source = lesson.source || `https://github.com/thsergitox/atlas-ga-lima/blob/main/${lesson.local}`;
  return `<div class="code-panel"><div class="code-header"><span>${svgIcon('code')} ${lesson.file}</span><a href="${source}" target="_blank" rel="noreferrer">Ver fuente ${lesson.source ? '↗' : '↗'}</a></div><pre tabindex="0" aria-label="Fragmento Python de ${lesson.file}"><code>${lesson.code.split('\n').map((line, i) => `<span class="code-line"><span class="line-number" aria-hidden="true">${i + 1}</span><span class="${line.trim().startsWith('#') ? 'code-comment' : ''}">${escape(line)}</span></span>`).join('')}</code></pre></div>`;
}
