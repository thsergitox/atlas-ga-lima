import { genes, metricsFor, format, svgIcon, announce } from './components.js';
import { shuffle, totals } from '../algorithm/operators.js';

export function intro(ctx) {
  const { stage, map, experiment } = ctx;
  let route = [...experiment.run.initial.route];
  stage.innerHTML = `<div class="route-panel"><div class="panel-heading"><span>Una ruta candidata</span><button id="another-route" class="text-button">Comparar otra ruta ${svgIcon('replay')}</button></div><div id="hero-genes">${genes(route)}</div><div id="hero-metrics">${metricsFor(ctx, route)}</div></div>`;
  map.show(route);
  stage.querySelector('#another-route').onclick = () => {
    const before = route;
    route = [ctx.profile.start, ...shuffle(ctx.museums.map(p => p.id).filter(id => id !== ctx.profile.start))];
    map.show(route, { compare: before });
    stage.querySelector('#hero-genes').innerHTML = genes(route);
    stage.querySelector('#hero-metrics').innerHTML = metricsFor(ctx, route);
    announce('Nueva ruta candidata. Los puntos del mapa conservan su ubicación.');
  };
}

export function pipeline(ctx) {
  ctx.map.show(ctx.experiment.run.history.at(-1).route);
  ctx.stage.innerHTML = `<div class="pipeline-panel"><div class="pipeline-origin"><span>Şehab y Turan · 2024</span><a href="https://doi.org/10.7717/peerj-cs.2340" target="_blank" rel="noreferrer">PeerJ Computer Science · e2340 ↗</a></div><div class="pipeline-track">${['Datos', 'Población', 'Fitness', 'Selección', 'COX', 'Mutación', 'Reemplazo'].map((label, i) => `<button data-go="${[2, 3, 4, 5, 6, 7, 8][i]}"><span>${i + 1}</span>${label}</button>`).join('')}</div><p>Port Python de Arbues · ${ctx.profile.shortCity}: ${ctx.museums.length} destinos · 100 rutas × 100 generaciones</p></div>`;
}

export function population(ctx) {
  const { stage, map, experiment } = ctx;
  const pool = experiment.run.selection.pool;
  stage.innerHTML = `<div class="population-panel"><div class="panel-heading"><span>La población contiene 100 rutas</span><span>Explora ${ctx.museums.length > 12 ? 4 : 8} individuos reales</span></div><div class="route-list">${pool.slice(0, ctx.museums.length > 12 ? 4 : 8).map((route, i) => `<button data-route="${i}" class="population-route ${i === 0 ? 'selected' : ''}"><span class="route-number">${String(i + 1).padStart(2, '0')}</span>${genes(route)}<span class="route-fitness">${format(totals(route, experiment.matrices, ctx.profile.budget).fitness, 4)}</span></button>`).join('')}</div><p class="panel-footnote">Inicio fijo: ${ctx.profile.start} = ${ctx.profile.startName}. IDs 1…${ctx.museums.length}, sin duplicados.</p></div>`;
  map.show(pool[0]);
  stage.querySelectorAll('[data-route]').forEach(button => button.onclick = () => {
    stage.querySelector('.selected')?.classList.remove('selected'); button.classList.add('selected');
    map.show(pool[+button.dataset.route]);
  });
}

export function fitness(ctx) {
  const { stage, map, experiment } = ctx;
  const route = experiment.run.initial.route;
  stage.innerHTML = `<div class="route-panel"><div class="panel-heading"><span>Evaluamos el mismo cromosoma</span><span>Norm(A) = (A − min A) / (max A − min A)</span></div>${genes(route)}<div id="fitness-metrics"></div><div class="budget-control"><label for="budget">Presupuesto de traslado</label><input id="budget" type="range" min="${ctx.profile.budgetMin}" max="${ctx.profile.budgetMax}" step="${ctx.profile.budgetStep}" value="${ctx.profile.budget}"><output id="budget-value">${ctx.profile.currency} ${ctx.profile.budget}</output></div><p id="budget-note" class="panel-footnote"></p></div>`;
  map.show(route);
  const update = () => {
    const budget = +stage.querySelector('#budget').value;
    stage.querySelector('#budget-value').textContent = `${ctx.profile.currency} ${budget}`;
    stage.querySelector('#fitness-metrics').innerHTML = metricsFor(ctx, route, budget);
    const cost = totals(route, experiment.matrices, budget).cost;
    stage.querySelector('#budget-note').textContent = cost > budget ? 'C > B: el fitness es negativo. El port penaliza; no descarta automáticamente.' : `Queda el ${format(100 * (budget - cost) / budget, 1)} % del presupuesto. Distancia y tiempo no cambian al mover B.`;
  };
  stage.querySelector('#budget').oninput = update; update();
}

export function replacement(ctx) {
  ctx.map.show(ctx.experiment.run.history[0].route);
  ctx.stage.innerHTML = `<div class="replacement-panel"><div class="survivors"><div><strong>100</strong><span>padres</span></div><span>+</span><div class="offspring-count"><strong>100</strong><span>hijos</span></div><span>=</span><div><strong>200</strong><span>candidatos</span></div></div><div class="survival-track">${Array.from({ length: 100 }, () => '<i></i>').join('')}</div><div class="panel-heading"><span>Ordenar por fitness descendente</span><strong>Conservar los mejores 100</strong></div><p>El mejor histórico sobrevive. La diversidad puede disminuir.</p></div>`;
}
