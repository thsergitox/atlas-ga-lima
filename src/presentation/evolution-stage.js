import { genes, metricsFor, svgIcon, format } from './components.js';

export function evolution(ctx) {
  const { stage, map, experiment } = ctx;
  const history = experiment.run.history;
  let generation = 0;
  let timer = 0;
  let playing = false;
  const values = [experiment.run.initial.fitness, ...history.map(h => h.fitness)];
  const minimum = Math.min(...values), maximum = Math.max(...values);
  const span = maximum - minimum || Math.abs(maximum) || 1;
  const lo = minimum - span * 0.05;
  const hi = maximum + span * 0.04;
  const x = i => 40 + i / 99 * 630;
  const y = value => 115 - (value - lo) / (hi - lo) * 95;
  const points = history.map((h, i) => `${x(i)},${y(h.fitness)}`).join(' ');
  stage.innerHTML = `<div class="evolution-panel"><div class="panel-heading"><span>Mejor fitness histórico</span><span>Traza Python guardada · no nueva corrida</span></div><svg class="evolution-chart" viewBox="0 0 700 145" role="img" aria-label="Mejor fitness histórico de cien generaciones"><path class="chart-axis" d="M40 15V115H675"/><text x="37" y="138">1</text><text x="650" y="138">100</text><text x="47" y="27">${format(hi, 3)}</text><text x="47" y="111">${format(lo, 3)}</text><polyline class="chart-full" points="${points}"/><polyline id="chart-active" points=""/><circle id="chart-cursor" r="5"/></svg><div class="generation-controls"><button id="evolution-play" class="primary small">${svgIcon('play')} Reproducir</button><label for="generation">Generación <output id="generation-value">1 / 100</output></label><input id="generation" type="range" min="1" max="100" value="1"><button id="evolution-reset" class="icon-button" aria-label="Volver a generación uno">${svgIcon('replay')}</button></div><div id="evolution-genes"></div><div id="evolution-metrics"></div></div>`;
  function stop() { clearTimeout(timer); playing = false; stage.querySelector('#evolution-play').innerHTML = `${svgIcon('play')} Reproducir`; }
  function render() {
    const state = history[generation];
    map.show(state.route);
    stage.querySelector('#chart-active').setAttribute('points', history.slice(0, generation + 1).map((h, i) => `${x(i)},${y(h.fitness)}`).join(' '));
    stage.querySelector('#chart-cursor').setAttribute('cx', x(generation));
    stage.querySelector('#chart-cursor').setAttribute('cy', y(state.fitness));
    stage.querySelector('#generation-value').textContent = `${generation + 1} / 100`;
    stage.querySelector('#generation').value = generation + 1;
    stage.querySelector('#evolution-genes').innerHTML = genes(state.route);
    stage.querySelector('#evolution-metrics').innerHTML = metricsFor(ctx, state.route);
  }
  function tick() { if (generation >= 99) { stop(); return; } generation++; render(); timer = setTimeout(tick, 900); }
  stage.querySelector('#evolution-play').onclick = () => {
    if (playing) { stop(); return; }
    if (generation >= 99) generation = 0;
    playing = true; stage.querySelector('#evolution-play').innerHTML = `${svgIcon('pause')} Pausar`; tick();
  };
  stage.querySelector('#generation').oninput = event => { stop(); generation = +event.target.value - 1; render(); };
  stage.querySelector('#evolution-reset').onclick = () => { stop(); generation = 0; render(); };
  render(); return stop;
}
