import { shuffle, totals } from '../algorithm/operators.js';
import { genes, format, announce } from './components.js';

export function selection(ctx) {
  const { stage, map, experiment } = ctx;
  let candidates = experiment.run.selection.candidates;
  const score = route => totals(route, experiment.matrices).fitness;
  stage.innerHTML = `<div class="selection-panel"><div class="panel-heading"><span>Torneo: 20 de 100 rutas</span><button id="draw-tournament" class="text-button">Sortear otro torneo</button></div><div id="tournament-list" class="tournament-list"></div><div id="selected-parents"></div><p class="panel-footnote">Se muestran los seis mejores de los veinte sorteados. La longitud de cada barra indica fitness.</p></div>`;
  const render = () => {
    const p1 = candidates[0];
    const p2 = [...candidates.slice(1), ...experiment.run.selection.pool].find(r => r.some((v, i) => v !== p1[i]));
    const max = Math.max(...candidates.map(score));
    stage.querySelector('#tournament-list').innerHTML = candidates.slice(0, 6).map((route, i) => `<button data-candidate="${i}" class="tournament-candidate ${i < 2 ? 'winner' : ''}"><span>${i === 0 ? 'Padre 1' : i === 1 ? 'Padre 2' : `Ruta ${i + 1}`}</span><div class="fitness-track"><span style="width:${Math.max(0, score(route) / max * 100)}%"></span></div><strong>${format(score(route), 4)}</strong></button>`).join('');
    stage.querySelector('#selected-parents').innerHTML = genes(p1, { label: 'Padre 1' }) + genes(p2, { label: 'Padre 2' });
    map.show(p1, { compare: p2 });
    stage.querySelectorAll('[data-candidate]').forEach(button => button.onclick = () => map.show(candidates[+button.dataset.candidate]));
  };
  stage.querySelector('#draw-tournament').onclick = () => {
    candidates = shuffle(experiment.run.selection.pool).slice(0, 20).sort((a, b) => score(b) - score(a));
    render(); announce('Nuevo torneo de veinte rutas. Se muestran los seis mejores.');
  };
  render();
}
