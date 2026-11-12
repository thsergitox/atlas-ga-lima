const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

function sourceLink(text, url) {
  const link = element('a', '', text);
  if (!/^https:\/\//.test(url)) return link;
  link.href = url; link.target = '_blank'; link.rel = 'noreferrer';
  return link;
}

function renderCard(card, place, info, start, close) {
  card.replaceChildren();
  const heading = element('div', 'museum-card-heading');
  const number = element('span', 'museum-card-number', String(place.id).padStart(2, '0'));
  const title = element('h2', '', place.name); title.id = 'museum-card-title';
  const dismiss = element('button', 'museum-card-close');
  dismiss.type = 'button'; dismiss.setAttribute('aria-label', 'Cerrar ficha');
  dismiss.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';
  dismiss.onclick = () => close(true);
  heading.append(number, title, dismiss);
  const meta = element('p', 'museum-card-meta', [info?.category, place.district, place.id === start ? 'Inicio fijo' : null].filter(Boolean).join(' · '));
  const description = element('p', 'museum-card-description', info?.description || 'El archivo original conserva el ID y las coordenadas de este destino, pero no incluye su nombre. Se mantiene esa identificación para no atribuirle una identidad sin verificar.');
  const coordinates = element('p', 'museum-card-coordinates', `${place.lat.toFixed(5)}, ${place.lon.toFixed(5)}`);
  const links = element('div', 'museum-card-links');
  links.append(sourceLink(info?.description ? 'Conocer el museo ↗' : 'Ver dato original ↗', info?.source || place.source),
    sourceLink('Ver ubicación ↗', `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`));
  card.append(heading, meta, description, coordinates, links);
  if (info?.access) {
    const [min, max] = info.access.map(value => Math.round(value));
    card.append(element('p', 'museum-card-access', `Acceso en auto a ${min === max ? min : `${min}–${max}`} m del punto, según el tramo. Esa separación no se incluye en la distancia ni en el tiempo vial.`));
  }
}

export function createMuseumPopover(host, information, start) {
  const card = element('aside', 'museum-card');
  card.id = 'museum-card'; card.hidden = true;
  card.setAttribute('role', 'region'); card.setAttribute('aria-labelledby', 'museum-card-title');
  host.parentElement.append(card);
  const controller = new AbortController(), options = { signal: controller.signal };
  let anchor;
  function close(restore = false) {
    card.hidden = true;
    anchor?.setAttribute('aria-expanded', 'false');
    anchor?.classList.remove('highlighted');
    if (restore) anchor?.focus({ preventScroll: true });
    anchor = null;
  }
  function position() {
    if (!anchor || card.hidden) return;
    const parent = host.parentElement.getBoundingClientRect(), marker = anchor.getBoundingClientRect();
    const width = card.offsetWidth, height = card.offsetHeight;
    const preferred = marker.right - parent.left + 16;
    card.style.left = `${Math.max(12, Math.min(parent.width - width - 12, preferred + width < parent.width - 12 ? preferred : marker.left - parent.left - width - 16))}px`;
    card.style.top = `${Math.max(74, Math.min(parent.height - height - 44, marker.top - parent.top - 20))}px`;
  }
  host.addEventListener('museum-select', event => {
    const place = event.detail;
    close();
    anchor = host.querySelector(`.museum-marker[data-id="${place.id}"]`);
    renderCard(card, place, information[place.id], start, close);
    card.hidden = false;
    anchor?.setAttribute('aria-expanded', 'true'); anchor?.classList.add('highlighted');
    position();
    card.querySelector('button').focus({ preventScroll: true });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) card.animate(
      [{ opacity: .4, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' });
  }, options);
  document.addEventListener('pointerdown', event => {
    if (!card.contains(event.target) && !event.target.closest('.museum-marker,.map-zoom')) close();
  }, options);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || card.hidden) return;
    event.preventDefault(); event.stopImmediatePropagation(); close(true);
  }, { ...options, capture: true });
  host.addEventListener('map-viewchange', position, options);
  return { close, destroy() { controller.abort(); card.remove(); } };
}
