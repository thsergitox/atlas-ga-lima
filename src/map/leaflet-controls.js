import * as L from '../../assets/vendor/leaflet/leaflet-src.esm.js';

export function addMapControls(map, fit) {
  L.control.zoom({ position: 'topright', zoomInTitle: 'Acercar mapa', zoomOutTitle: 'Alejar mapa' }).addTo(map);
  const control = L.control({ position: 'topright' });
  control.onAdd = () => {
    const host = L.DomUtil.create('div', 'leaflet-bar map-fit');
    const button = document.createElement('button');
    button.type = 'button'; button.title = 'Encuadrar todos los destinos'; button.setAttribute('aria-label', button.title);
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/></svg>';
    button.onclick = fit; host.append(button); L.DomEvent.disableClickPropagation(host);
    return host;
  };
  control.addTo(map);
  L.control.scale({ imperial: false, position: 'bottomleft', maxWidth: 110 }).addTo(map);
}
