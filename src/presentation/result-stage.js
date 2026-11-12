import { genes, metricsFor, format } from './components.js';
import { compareIstanbul } from './comparison-stage.js';

export function result(ctx) {
  const { experiment, stage, map } = ctx;
  const initial = experiment.run.initial, final = experiment.run.history.at(-1);
  const delta = final.fitness - initial.fitness;
  const gain = initial.fitness > 0 ? `+${format(100 * delta / initial.fitness, 1)} % de fitness` : `Δ fitness +${format(delta, 4)}`;
  const explanation = initial.fitness > 0 ? 'frente al mejor individuo inicial de esta corrida.' : 'frente al mejor inicial. Una base no positiva se compara con diferencia absoluta.';
  stage.innerHTML = `<div class="result-panel"><div class="result-switch"><button data-result="initial" aria-pressed="false">Mejor inicial</button><button data-result="final" class="active" aria-pressed="true">Mejor encontrada</button>${experiment.comparison ? '<button data-result="comparison" aria-pressed="false">Paper vs ORS</button>' : ''}</div><div id="result-content"></div>${ctx.profile.id === 'paper' ? '<a class="result-comparison-link" href="?caso=istanbul#resultado">Comparar estas rutas con ORS ↗</a>' : ''}</div>`;
  const show = mode => {
    stage.querySelectorAll('[data-result]').forEach(button => {
      const active = button.dataset.result === mode;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', active);
    });
    const panel = stage.querySelector('#result-content');
    if (mode === 'comparison') { compareIstanbul(ctx, panel); return; }
    const selected = mode === 'final' ? final : initial;
    panel.innerHTML = `${genes(selected.route)}${metricsFor(ctx, selected.route)}<p><strong>${gain}</strong> ${explanation}</p><p class="panel-footnote">${ctx.profile.currency} ${ctx.profile.budget} de presupuesto · 100 rutas · 100 generaciones · sin retorno al inicio</p>`;
    map.show(selected.route, { compare: mode === 'final' ? initial.route : final.route });
  };
  stage.querySelectorAll('[data-result]').forEach(button => { button.onclick = () => show(button.dataset.result); });
  show('final');
}
