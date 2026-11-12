import * as L from '../../assets/vendor/leaflet/leaflet-src.esm.js';
import { createMuseumCard } from './museum-popover.js';

export function createMarkers(map, museums, information, start) {
  const markers = new Map(), tooltips = new Map();
  const controller = new AbortController();
  let selected;
  function close(restore = false) {
    const marker = selected; selected = null;
    map.closePopup();
    if (restore) marker?.getElement()?.focus({ preventScroll: true });
  }
  for (const place of museums) {
    const content = document.createElement('span'); content.textContent = place.id;
    const marker = L.marker([place.lat, place.lon], { title: `${place.id}. ${place.name}`, alt: place.name,
      icon: L.divIcon({ className: 'museum-marker', html: content, iconSize: [28, 28], iconAnchor: [14, 14] }),
      riseOnHover: true }).addTo(map);
    const icon = marker.getElement();
    icon.dataset.id = place.id; icon.dataset.start = place.id === start;
    icon.setAttribute('aria-label', `${place.id}. ${place.name}`); icon.setAttribute('aria-expanded', 'false');
    icon.setAttribute('aria-haspopup', 'dialog');
    const label = document.createElement('span'); label.textContent = place.short;
    const tooltip = L.tooltip({ permanent: true, direction: 'right', offset: [15, 0], className: 'museum-label' })
      .setLatLng(marker.getLatLng()).setContent(label);
    tooltips.set(place.id, tooltip);
    const card = createMuseumCard(place, information[place.id], start, () => close(true));
    marker.bindPopup(card, { className: 'museum-popover', closeButton: false, maxWidth: 330, minWidth: 230,
      maxHeight: 240, autoPanPadding: [15, 15], offset: [0, -8] });
    marker.on('popupopen', () => {
      const popup = marker.getPopup();
      popup.options.maxHeight = Math.max(100, Math.min(260, map.getSize().y - 90));
      popup.update();
      selected = marker;
      icon.setAttribute('aria-expanded', 'true'); icon.classList.add('highlighted');
      card.closest('.leaflet-popup').setAttribute('role', 'dialog');
      card.closest('.leaflet-popup').setAttribute('aria-labelledby', 'museum-card-title');
      card.querySelector('button').focus({ preventScroll: true });
    });
    marker.on('popupclose', () => {
      icon.setAttribute('aria-expanded', 'false'); icon.classList.remove('highlighted');
      if (selected === marker) selected = null;
    });
    icon.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); marker.openPopup(); }
    }, { signal: controller.signal });
    markers.set(place.id, marker);
  }
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !selected) return;
    event.preventDefault(); event.stopImmediatePropagation(); close(true);
  }, { capture: true, signal: controller.signal });
  return {
    close,
    labels(visible) { for (const tooltip of tooltips.values()) visible ? tooltip.addTo(map) : tooltip.remove(); },
    highlight(id) {
      for (const [key, marker] of markers) {
        marker.getElement().classList.toggle('highlighted', key === id);
        marker.setZIndexOffset(key === id ? 1000 : 0);
      }
    },
    affected(ids) { for (const [id, marker] of markers) marker.getElement().classList.toggle('affected', ids.includes(id)); },
    destroy() { controller.abort(); close(); }
  };
}
