import { genes, format, announce } from './components.js';

export function compareIstanbul(ctx, panel) {
  const { comparison: c } = ctx.experiment;
  const before = c.historicalUnderOriginalData;
  panel.innerHTML = `<div class="comparison-panel"><p class="comparison-caption">Las dos rutas, evaluadas con <strong>las mismas matrices ORS</strong> y el costo histórico.</p><div class="comparison-table"><table><caption class="sr-only">Resultados bajo D/T de ORS y costo histórico del dataset</caption><thead><tr><th scope="col">Ruta encontrada con</th><th scope="col">km</th><th scope="col">min</th><th scope="col">TL históricos</th><th scope="col">Fitness</th></tr></thead><tbody>${[['historical', 'Datos originales'], ['ors', 'ORS']].map(([key, label]) => `<tr data-comparison="${key}"><th scope="row"><button aria-pressed="${key === 'ors'}" data-compare-route="${key}">${label}</button></th><td>${format(c[key].distance, 1)}</td><td>${format(c[key].time, 1)}</td><td>${format(c[key].cost, 1)}</td><td>${format(c[key].fitness, 4)}</td></tr>`).join('')}</tbody></table></div><div id="comparison-genes"></div><p class="panel-footnote">La ruta histórica medía ${format(before.distance, 1)} km y ${format(before.time, 1)} min en sus datos. Esa misma ruta mide ${format(c.historical.distance, 1)} km y ${format(c.historical.time, 1)} min con ORS.</p><p class="panel-footnote">Mismas coordenadas, inicio, población inicial y presupuesto. Son dos corridas aleatorias; proveedor y fecha difieren. No prueba superioridad ni un óptimo.</p></div>`;
  const show = key => {
    const selected = c[key], other = c[key === 'ors' ? 'historical' : 'ors'];
    ctx.map.show(selected.route, { compare: other.route });
    panel.querySelector('#comparison-genes').innerHTML = genes(selected.route);
    panel.querySelectorAll('[data-compare-route]').forEach(button => {
      const active = button.dataset.compareRoute === key;
      button.setAttribute('aria-pressed', active);
      button.closest('tr').classList.toggle('selected', active);
    });
    announce(`Ruta ${key === 'ors' ? 'ORS' : 'de los datos originales'} representada sobre las calles de ORS.`);
  };
  panel.querySelectorAll('[data-compare-route]').forEach(button => { button.onclick = () => show(button.dataset.compareRoute); });
  show('ors');
}
