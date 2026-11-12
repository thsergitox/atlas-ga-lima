import { format, announce } from './components.js';
import { matrixTable, bindMatrix } from './matrix-table.js';

export function dataset(ctx) {
  const { stage, museums, map, experiment, profile } = ctx;
  let metric = 'distance';
  let matrixVisible = false;
  const options = museums.map(p => `<option value="${p.id}">${p.id} · ${p.short}</option>`).join('');
  stage.innerHTML = `<div class="dataset-panel"><div class="panel-heading"><span>${museums.length} ${profile.id === 'paper' ? 'destinos' : 'museos'} · matrices ${museums.length} × ${museums.length}</span><button id="toggle-dataset" class="text-button" aria-pressed="false">Ver matriz</button></div><div id="dataset-museums" class="museum-list">${museums.map(p => `<button data-museum="${p.id}"><b>${p.id}</b><span>${p.short}</span><small>${p.district}</small></button>`).join('')}</div><div id="dataset-matrix" hidden><label class="matrix-metric">Mostrar <select id="matrix-metric"><option value="distance">Distancia · km</option><option value="time">Tiempo · min</option><option value="cost">${profile.id === 'paper' ? 'Costo' : 'Costo simulado'} · ${profile.currency}</option></select></label><div id="matrix-table" class="matrix-scroll"></div></div><div class="matrix-inspector"><label>Origen <select id="origin">${options}</select></label><label>Destino <select id="destination">${options}</select></label><button id="reverse-pair" class="text-button">Invertir recorrido</button><output id="matrix-values" aria-live="polite"></output></div><p id="pair-source" class="panel-footnote"></p></div>`;
  stage.querySelector('#destination').value = '2';

  function renderTable() {
    const host = stage.querySelector('#matrix-table');
    host.innerHTML = matrixTable(museums, experiment.matrices[metric], metric, profile.currency, profile.costLabel);
    bindMatrix(host, museums.length, (origin, destination) => {
      stage.querySelector('#origin').value = origin;
      stage.querySelector('#destination').value = destination;
      inspect();
    });
  }

  function inspect() {
    const origin = +stage.querySelector('#origin').value;
    const destination = +stage.querySelector('#destination').value;
    const a = origin - 1, b = destination - 1;
    stage.querySelector('#matrix-values').textContent = `${origin} → ${destination}: ${format(experiment.matrices.distance[a][b])} km · ${format(experiment.matrices.time[a][b], 1)} min · ${profile.currency} ${format(experiment.matrices.cost[a][b])}`;
    map.show(origin === destination ? [origin] : [origin, destination]);
    map.highlight(destination);
    stage.querySelectorAll('[data-cell]').forEach(cell => {
      const selected = +cell.dataset.origin === origin && +cell.dataset.destination === destination;
      cell.setAttribute('aria-pressed', selected);
      cell.tabIndex = selected ? 0 : -1;
    });
    stage.querySelector('#pair-source').textContent = origin === destination ? 'Diagonal: cero local, sin consulta ni desplazamiento.' : ctx.routes
      ? 'D y T del recorrido azul de ORS. El costo es simulado. La red vial puede separar el acceso del punto del museo.'
      : 'D, T y C de las matrices originales. La línea del mapa es esquemática; no se dispone de su geometría vial.';
  }

  stage.querySelector('#toggle-dataset').onclick = event => {
    matrixVisible = !matrixVisible;
    stage.querySelector('#dataset-museums').hidden = matrixVisible;
    stage.querySelector('#dataset-matrix').hidden = !matrixVisible;
    event.target.setAttribute('aria-pressed', matrixVisible);
    event.target.textContent = matrixVisible ? 'Ver museos' : 'Ver matriz';
    if (matrixVisible) { renderTable(); inspect(); }
  };
  stage.querySelector('#matrix-metric').onchange = event => { metric = event.target.value; renderTable(); inspect(); };
  stage.querySelectorAll('#origin,#destination').forEach(el => el.onchange = inspect);
  stage.querySelectorAll('[data-museum]').forEach(button => button.onclick = () => {
    stage.querySelector('#destination').value = button.dataset.museum; inspect();
  });
  stage.querySelector('#reverse-pair').onclick = () => {
    const a = stage.querySelector('#origin'), b = stage.querySelector('#destination');
    [a.value, b.value] = [b.value, a.value]; inspect();
    announce(`Recorrido invertido: ${a.value} a ${b.value}.`);
  };
  inspect();
}
