import * as L from '../../assets/vendor/leaflet/leaflet-src.esm.js';

export function createMapExpansion(host, map, city, routed) {
  const controller = new AbortController(), options = { signal: controller.signal };
  const dialog = document.createElement('dialog'); dialog.className = 'map-expansion'; dialog.id = 'expanded-map';
  dialog.setAttribute('aria-labelledby', 'expanded-map-title');
  dialog.innerHTML = '<section class="map-expansion-window"><header><h2 id="expanded-map-title"></h2><button class="map-return">Volver a diapositiva</button></header></section>';
  const surface = dialog.querySelector('section'), back = dialog.querySelector('.map-return');
  const credit = document.createElement('footer'); credit.className = 'map-expansion-credit';
  credit.innerHTML = routed
    ? 'Rutas © <a href="https://openrouteservice.org/" target="_blank" rel="noreferrer">openrouteservice by HeiGIT</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>'
    : 'Conexiones esquemáticas · matrices originales del paper';
  surface.append(credit);
  dialog.querySelector('h2').textContent = `Mapa de ${city}`;
  document.body.append(dialog);
  let placeholder, opener, pendingView, disposed = false;
  const capture = () => ({ center: map.getCenter(), zoom: map.getZoom() });
  const control = L.control({ position: 'topleft' });
  const actions = document.createElement('div'); actions.className = 'map-view-actions';
  actions.innerHTML = '<button data-map-view="expand" aria-haspopup="dialog" aria-controls="expanded-map" aria-expanded="false">Ampliar mapa</button>';
  control.onAdd = () => { L.DomEvent.disableClickPropagation(actions); return actions; };
  control.addTo(map);
  const expandButton = actions.querySelector('[data-map-view="expand"]');
  function sync() {
    expandButton.textContent = dialog.open ? 'Reducir mapa' : 'Ampliar mapa';
    expandButton.setAttribute('aria-expanded', dialog.open);
  }
  function open() {
    if (dialog.open || disposed) return;
    pendingView = capture(); opener = document.activeElement;
    placeholder = document.createElement('div'); placeholder.className = 'map-host';
    placeholder.style.flex = `0 0 ${host.getBoundingClientRect().height}px`;
    placeholder.setAttribute('aria-hidden', 'true'); host.replaceWith(placeholder);
    surface.insertBefore(host, credit); dialog.showModal(); document.body.classList.add('map-is-expanded');
    sync(); back.focus({ preventScroll: true });
  }
  function restore(focus = true) {
    if (!dialog.open) return;
    pendingView = capture(); placeholder.replaceWith(host); placeholder = null;
    dialog.close(); document.body.classList.remove('map-is-expanded'); sync();
    if (focus && opener?.isConnected) opener.focus({ preventScroll: true });
  }
  function close() {
    if (!disposed) restore();
  }
  expandButton.onclick = () => dialog.open ? close() : open();
  back.onclick = close;
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); }, options);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); }, options);
  return {
    resizeView() {
      const view = pendingView || (dialog.open ? capture() : null);
      pendingView = null; return view;
    },
    destroy() {
      disposed = true; controller.abort();
      restore(false); control.remove(); dialog.remove();
    }
  };
}
