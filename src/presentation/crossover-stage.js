import { crossover } from '../algorithm/operators.js';
import { genes, animateGenes, metrics, announce } from './components.js';

export function crossing(ctx) {
  const { stage, map, experiment } = ctx;
  const [p1, p2] = experiment.run.crossover.parents;
  let [a, b] = experiment.run.crossover.cuts;
  let child = 0;
  let applied = false;
  stage.innerHTML = `<div class="crossover-panel"><div class="panel-heading"><span>Dos padres, dos descendientes</span><span class="segment-key"><i></i> Centro conservado</span></div><div id="parent-one"></div><div id="parent-two"></div><div class="cut-controls"><label>Primer corte <input id="cut-a" type="range" min="2" max="8" value="${a}"><output id="cut-a-value">${a}</output></label><label>Segundo corte <input id="cut-b" type="range" min="3" max="9" value="${b}"><output id="cut-b-value">${b}</output></label><button id="apply-cross" class="primary small">Aplicar COX</button></div><div class="child-switch"><button id="child-one" aria-pressed="true" class="active">Hijo 1</button><button id="child-two" aria-pressed="false">Hijo 2</button><span id="cross-status">Antes del cruce</span></div><div id="child-genes"></div><div id="cross-metrics"></div></div>`;
  function renderParents() {
    stage.querySelector('#parent-one').innerHTML = genes(p1, { label: 'Padre 1', middle: [a, b] });
    stage.querySelector('#parent-two').innerHTML = genes(p2, { label: 'Padre 2', middle: [a, b] });
  }
  function renderChild(animate = true) {
    const parents = [p1, p2];
    const routes = applied ? crossover(p1, p2, a, b) : parents;
    const route = routes[child];
    animateGenes(stage.querySelector('#child-genes'), route, { label: `Hijo ${child + 1}`, middle: [a, b] });
    map.show(route, { compare: parents[child], animate });
    stage.querySelector('#cross-metrics').innerHTML = metrics(route, experiment.matrices);
    stage.querySelector('#cross-status').textContent = applied ? 'Extremos reordenados; centro intacto' : 'Antes del cruce';
    stage.querySelectorAll('.child-switch button').forEach((el, i) => { el.classList.toggle('active', i === child); el.setAttribute('aria-pressed', i === child); });
  }
  stage.querySelector('#cut-a').oninput = event => {
    a = +event.target.value;
    if (a >= b) { b = a + 1; stage.querySelector('#cut-b').value = b; }
    stage.querySelector('#cut-a-value').textContent = a;
    stage.querySelector('#cut-b-value').textContent = b;
    applied = false;
    stage.querySelector('#apply-cross').textContent = 'Aplicar COX';
    renderParents(); renderChild(false);
  };
  stage.querySelector('#cut-b').oninput = event => {
    b = +event.target.value;
    if (b <= a) { a = b - 1; stage.querySelector('#cut-a').value = a; }
    stage.querySelector('#cut-a-value').textContent = a;
    stage.querySelector('#cut-b-value').textContent = b;
    applied = false;
    stage.querySelector('#apply-cross').textContent = 'Aplicar COX';
    renderParents(); renderChild(false);
  };
  stage.querySelector('#apply-cross').onclick = () => {
    applied = !applied;
    stage.querySelector('#apply-cross').textContent = applied ? 'Ver padres' : 'Aplicar COX';
    renderChild(); announce(applied ? 'COX aplicado. Se conservan los centros de ambos hijos.' : 'Se muestran los cromosomas antes del cruce.');
  };
  stage.querySelector('#child-one').onclick = () => { child = 0; renderChild(); };
  stage.querySelector('#child-two').onclick = () => { child = 1; renderChild(); };
  renderParents(); renderChild(false);
}
