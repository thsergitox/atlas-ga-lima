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

export function dataset(ctx) {
  const { stage, museums, map, experiment } = ctx;
  map.show(experiment.run.initial.route);
  stage.innerHTML = `<div class="dataset-panel"><div class="panel-heading"><span>${museums.length} registros, tres matrices ${museums.length} × ${museums.length}</span><a href="${ctx.profile.path}museums.csv" download>Descargar CSV ↧</a></div><div class="museum-list">${museums.map(p => `<button data-museum="${p.id}"><b>${p.id}</b><span>${p.short}</span><small>${p.district}</small></button>`).join('')}</div><div class="matrix-inspector"><label>Origen <select id="origin">${museums.map(p => `<option value="${p.id}">${p.id} · ${p.short}</option>`).join('')}</select></label><label>Destino <select id="destination">${museums.map(p => `<option value="${p.id}" ${p.id === 2 ? 'selected' : ''}>${p.id} · ${p.short}</option>`).join('')}</select></label><output id="matrix-values"></output></div></div>`;
  const inspect = () => {
    const a = +stage.querySelector('#origin').value - 1;
    const b = +stage.querySelector('#destination').value - 1;
    stage.querySelector('#matrix-values').textContent = `${format(experiment.matrices.distance[a][b])} km · ${format(experiment.matrices.time[a][b], 1)} min · ${ctx.profile.currency} ${format(experiment.matrices.cost[a][b])}`;
    map.highlight(b + 1);
  };
  stage.querySelectorAll('[data-museum]').forEach(button => button.onclick = () => {
    stage.querySelector('#destination').value = button.dataset.museum;
    inspect();
  });
  stage.querySelectorAll('select').forEach(el => el.onchange = inspect);
  inspect();
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

export function result(ctx) {
  const { experiment, stage, map } = ctx;
  const initial = experiment.run.initial;
  const final = experiment.run.history.at(-1);
  const gain = (final.fitness / initial.fitness - 1) * 100;
  stage.innerHTML = `<div class="result-panel"><div class="result-switch"><button id="show-initial" aria-pressed="false">Mejor inicial</button><button id="show-final" class="active" aria-pressed="true">Mejor encontrada</button></div><div id="result-genes">${genes(final.route)}</div><div id="result-metrics">${metricsFor(ctx, final.route)}</div><p><strong>+${format(gain, 1)} % de fitness</strong> frente al mejor individuo inicial de esta corrida.</p><p class="panel-footnote">${ctx.profile.currency} ${ctx.profile.budget} de presupuesto · 100 rutas · 100 generaciones · sin retorno al inicio</p></div>`;
  const show = finalVisible => {
    const selected = finalVisible ? final : initial;
    map.show(selected.route, { compare: finalVisible ? initial.route : final.route });
    stage.querySelector('#result-genes').innerHTML = genes(selected.route);
    stage.querySelector('#result-metrics').innerHTML = metricsFor(ctx, selected.route);
    stage.querySelectorAll('.result-switch button').forEach((el, i) => {
      el.classList.toggle('active', !!i === finalVisible); el.setAttribute('aria-pressed', !!i === finalVisible);
    });
  };
  stage.querySelector('#show-initial').onclick = () => show(false);
  stage.querySelector('#show-final').onclick = () => show(true); show(true);
}
