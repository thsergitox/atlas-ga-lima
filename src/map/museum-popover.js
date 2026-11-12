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

export function createMuseumCard(place, info, start, close) {
  const card = element('section', 'museum-card');
  card.setAttribute('aria-labelledby', 'museum-card-title');
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
  return card;
}
