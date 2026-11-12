import { mutate, totals } from '../algorithm/operators.js';
import { genes, animateGenes, metricsFor, format, announce, svgIcon } from './components.js';

export function mutation(ctx) {
  const { stage, map, experiment } = ctx;
  const original = [...experiment.mutation.before];
  let draw = experiment.mutation;
  let step = 0;
  let playing = false;
  let timer = 0;
  stage.innerHTML = `<div class="mutation-panel"><div class="panel-heading"><span>Intercambios vecinos, en orden</span><button id="toggle-flags" class="text-button" aria-expanded="false">Ver matriz ${original.length} × ${original.length}</button></div><div class="mutation-top"><div><span class="panel-title">La matriz que decide el cambio</span><div id="flag-matrix" class="flag-matrix" style="--flag-size:${original.length}" aria-label="Matriz de indicadores de mutación"></div></div><div class="mutation-tools"><label for="mu">Tasa del código μ</label><select id="mu"><option value="0.1">0.1 · inicial</option><option value="0.9" selected>0.9 · diversificación</option></select><div class="effective-rate"><strong id="effective-rate">34.87 %</strong><span>de activar cada fila</span></div><button id="draw-mutation" class="secondary small">Sortear matriz</button></div></div><div class="panel-heading"><span id="mutation-status"></span><span id="mutation-delta"></span></div><div id="mutation-genes">${genes(original)}</div><div class="play-controls"><button id="mutation-play" class="primary small">${svgIcon('play')} Animar cambios</button><button id="mutation-step" class="secondary small">Siguiente intercambio</button><button id="mutation-reset" class="icon-button" aria-label="Reiniciar los intercambios">${svgIcon('replay')}</button><span id="mutation-counter"></span></div><div id="mutation-metrics"></div></div>`;
  function stop() {
    playing = false; clearTimeout(timer);
    stage.querySelector('#mutation-play').innerHTML = `${svgIcon('play')} Animar cambios`;
  }
  function renderMatrix() {
    stage.querySelector('#flag-matrix').innerHTML = draw.flags.map((row, i) => `<div class="flag-row ${i === 0 || i === original.length - 1 ? 'ignored' : row.every(Boolean) ? 'all-active' : ''}" data-flag-row="${i}"><span>${i + 1}</span>${row.map(active => `<i class="${active ? 'true' : ''}"></i>`).join('')}</div>`).join('');
    stage.querySelector('#effective-rate').textContent = 100 * draw.mu ** original.length < 0.00001 ? `${(100 * draw.mu ** original.length).toExponential(2)} %` : `${format(100 * draw.mu ** original.length)} %`;
  }
  function show() {
    const route = step ? draw.steps[step - 1].after : original;
    const before = step ? draw.steps[step - 1].before : null;
    const index = step ? draw.steps[step - 1].index : -1;
    animateGenes(stage.querySelector('#mutation-genes'), route, { active: index < 0 ? [] : [index, index + 1] });
    map.show(route, { compare: before, affected: index < 0 ? [] : [route[index], route[index + 1]] });
    stage.querySelectorAll('.current-row').forEach(el => el.classList.remove('current-row'));
    if (index >= 0) stage.querySelector(`[data-flag-row="${index}"]`).classList.add('current-row');
    stage.querySelector('#mutation-status').textContent = !draw.steps.length ? 'Ninguna fila activa: la ruta no cambia.' : step ? `Intercambio de posiciones ${index + 1} y ${index + 2}` : `${draw.steps.length} filas activas; listas para recorrer`;
    stage.querySelector('#mutation-counter').textContent = `${step} / ${draw.steps.length}`;
    const delta = totals(route, experiment.matrices, ctx.profile.budget).fitness - totals(original, experiment.matrices, ctx.profile.budget).fitness;
    stage.querySelector('#mutation-delta').textContent = step ? `Δ fitness ${delta >= 0 ? '+' : ''}${format(delta, 4)}` : 'Sorteo registrado en Python';
    stage.querySelector('#mutation-metrics').innerHTML = metricsFor(ctx, route);
    stage.querySelector('#mutation-step').disabled = step >= draw.steps.length;
    stage.querySelector('#mutation-play').disabled = !draw.steps.length;
  }
  function advance() {
    if (step >= draw.steps.length) { stop(); return; }
    step++; show();
    announce(stage.querySelector('#mutation-status').textContent);
    if (playing && step < draw.steps.length) timer = setTimeout(advance, 1300);
    else stop();
  }
  stage.querySelector('#toggle-flags').onclick = event => {
    const open = stage.querySelector('.mutation-panel').classList.toggle('matrix-open');
    event.target.setAttribute('aria-expanded', open);
    event.target.textContent = open ? 'Ocultar matriz' : `Ver matriz ${original.length} × ${original.length}`;
  };
  stage.querySelector('#mutation-play').onclick = () => {
    if (playing) { stop(); return; }
    if (step >= draw.steps.length) { step = 0; show(); }
    playing = true;
    stage.querySelector('#mutation-play').innerHTML = `${svgIcon('pause')} Pausar`;
    timer = setTimeout(advance, 450);
  };
  stage.querySelector('#mutation-step').onclick = () => { stop(); advance(); };
  stage.querySelector('#mutation-reset').onclick = () => { stop(); step = 0; show(); };
  const redraw = () => {
    stop(); draw = mutate(original, +stage.querySelector('#mu').value); step = 0;
    renderMatrix(); show();
    stage.querySelector('#mutation-delta').textContent = 'Nuevo sorteo en el navegador';
    announce(`${draw.steps.length} intercambios en el nuevo sorteo.`);
  };
  stage.querySelector('#draw-mutation').onclick = redraw;
  stage.querySelector('#mu').onchange = redraw;
  renderMatrix(); show();
  return stop;
}
