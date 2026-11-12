import { pathFor } from './geography.js';
import { node } from './markers.js';

const EASING = 'cubic-bezier(.16,1,.3,1)';

export function createRouteLayers() {
  const previous = node('g', { class: 'previous-routes', 'aria-hidden': 'true' });
  const active = node('g', { class: 'active-routes', 'aria-hidden': 'true' });
  const animations = new Set();
  let current = [];

  function stop() {
    for (const animation of animations) animation.cancel();
    animations.clear();
  }

  function animatePath(path, frames, duration, finish) {
    const animation = path.animate(frames, { duration, easing: EASING });
    animations.add(animation);
    animation.onfinish = () => { animations.delete(animation); finish?.(); };
  }

  function show(edges, { compare, animate = true } = {}) {
    stop();
    const old = compare ?? current;
    const oldKeys = new Set(old.map(edge => edge.key));
    const keys = new Set(edges.map(edge => edge.key));
    const removed = old.filter(edge => !keys.has(edge.key));
    const added = edges.filter(edge => !oldKeys.has(edge.key));
    const existing = new Map([...active.children].map(path => [path.dataset.edge, path]));
    previous.replaceChildren();
    const motion = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (const edge of removed) {
      const path = node('path', { d: pathFor(edge.coordinates), class: 'route-before', 'data-edge': edge.key });
      previous.append(path);
      if (motion && !compare) animatePath(path, [{ opacity: .65 }, { opacity: 0 }], 500, () => path.remove());
      else if (!compare) path.remove();
    }
    for (const [key, path] of existing) if (!keys.has(key)) path.remove();
    for (const edge of edges) {
      const path = existing.get(edge.key) || node('path', { class: 'route-active', 'data-edge': edge.key });
      path.setAttribute('d', pathFor(edge.coordinates));
      path.removeAttribute('pathLength');
      path.style.removeProperty('stroke-dasharray');
      if (!path.parentNode) active.append(path);
      if (motion && !oldKeys.has(edge.key)) {
        path.setAttribute('pathLength', '1');
        path.style.strokeDasharray = '1';
        animatePath(path, [{ strokeDashoffset: '1', stroke: old.length ? '#e4aa40' : '#204ed5' },
          { strokeDashoffset: '0', stroke: '#204ed5' }], 850, () => {
          path.removeAttribute('pathLength');
          path.style.removeProperty('stroke-dasharray');
        });
      }
    }
    current = edges;
    return { count: edges.length, added: old.length ? added.length : 0, removed: removed.length };
  }
  return { previous, active, show, destroy: stop };
}
