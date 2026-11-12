import { separateMarkers } from './geography.js';
export const node = (tag, attrs = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  return element;
};

export function createMarkers(museums, points, host, start) {
  const layer = node('g', { class: 'museum-markers' });
  const leaders = node('g'), locations = node('g'), bubbles = node('g');
  layer.append(leaders, locations, bubbles);
  const elements = museums.map((museum, i) => {
    const leader = node('path', { class: 'marker-leader' });
    const location = node('circle', { class: 'museum-location', cx: points[i][0], cy: points[i][1] });
    const marker = node('g', { class: 'museum-marker', tabindex: '0', role: 'button', 'aria-label': `${museum.id}. ${museum.name}`, 'aria-controls': 'museum-card', 'aria-expanded': 'false', 'data-id': museum.id, 'data-start': museum.id === start });
    const title = node('title'); title.textContent = `${museum.id}. ${museum.name}`;
    const circle = node('circle');
    const text = node('text', { 'text-anchor': 'middle', dy: '.35em' }); text.textContent = museum.id;
    const label = node('text', { class: 'museum-label' }); label.textContent = museum.short;
    marker.append(title, circle, text, label);
    const activate = () => {
      layer.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      marker.classList.add('highlighted');
      host.dispatchEvent(new CustomEvent('museum-select', { detail: museum, bubbles: true }));
    };
    marker.addEventListener('click', activate);
    marker.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
    });
    leaders.append(leader); locations.append(location); bubbles.append(marker);
    return { marker, circle, text, label, leader, location };
  });
  function layout(scale) {
    const separated = separateMarkers(points, scale);
    elements.forEach((el, i) => {
      const [x, y] = separated[i];
      el.marker.setAttribute('transform', `translate(${x} ${y})`);
      el.circle.setAttribute('r', 12 / scale);
      el.text.style.fontSize = `${12 / scale}px`;
      el.label.setAttribute('x', 17 / scale); el.label.setAttribute('y', 4 / scale);
      el.label.style.fontSize = `${12 / scale}px`;
      el.label.style.strokeWidth = `${4 / scale}px`;
      el.leader.setAttribute('d', `M${points[i][0]},${points[i][1]}L${x},${y}`);
      el.leader.style.strokeWidth = `${1 / scale}px`;
      el.location.setAttribute('r', 2.3 / scale);
      el.circle.style.strokeWidth = `${1.8 / scale}px`;
    });
  }
  return { layer, layout };
}
