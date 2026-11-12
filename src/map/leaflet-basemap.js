import * as L from '../../assets/vendor/leaflet/leaflet-src.esm.js';

export function addBasemap(map, basemap) {
  map.createPane('cached-map').style.zIndex = 190;
  for (const tile of basemap.tiles) {
    const northwest = map.unproject([tile.x * 256, tile.y * 256], basemap.zoom);
    const southeast = map.unproject([(tile.x + 1) * 256, (tile.y + 1) * 256], basemap.zoom);
    L.imageOverlay(tile.file, [northwest, southeast], { pane: 'cached-map', interactive: false }).addTo(map);
  }
  const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, minZoom: 9, keepBuffer: 1, updateWhenIdle: true,
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
  }).addTo(map);
  const status = document.createElement('p');
  status.className = 'map-connection'; status.hidden = true;
  status.setAttribute('role', 'status');
  status.textContent = 'No se cargó el detalle del mapa. Se conserva la base local y las rutas.';
  map.getContainer().append(status);
  const failures = new Set();
  const key = event => `${event.coords.z}/${event.coords.x}/${event.coords.y}`;
  layer.on('tileerror', event => { failures.add(key(event)); status.hidden = false; });
  const recover = event => { failures.delete(key(event)); status.hidden = !failures.size; };
  layer.on('tileload tileunload', recover);
}
