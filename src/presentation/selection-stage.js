import { shuffle, totals } from '../algorithm/operators.js';
import { genes, format, announce } from './components.js';

export function selection(ctx) {
  const { stage, map, experiment } = ctx;
  let candidates = experiment.run.selection.candidates;
  const score = route => totals(route, experiment.matrices, ctx.profile.budget).fitness;
  stage.innerHTML = `<div class="selection-panel"><div class="panel-heading"><span>Torneo: 20 de 100 rutas</span><button id="draw-tournament" class="text-button">Sortear otro torneo</button></div><div id="tournament-list" class="tournament-list"></div><div id="selected-parents"></div><p class="panel-footnote">Los seis mejores del torneo. Barras reescaladas para comparar aptitudes, incluidas las negativas.</p></div>`;
  const render = () => {
    const p1 = candidates[0];
    const p2 = [...candidates.slice(1), ...experiment.run.selection.pool].find(r => r.some((v, i) => v !== p1[i]));
    const secondIndex = candidates.indexOf(p2);
    const max = Math.max(...candidates.map(score));
    const min = Math.min(0, ...candidates.map(score));
    const width = route => max === min ? 100 : 100 * (score(route) - min) / (max - min);
    stage.querySelector('#tournament-list').innerHTML = candidates.slice(0, 6).map((route, i) => `<button data-candidate="${i}" class="tournament-candidate ${i === 0 || i === secondIndex ? 'winner' : ''}"><span>${i === 0 ? 'Padre 1' : i === secondIndex ? 'Padre 2' : `Ruta ${i + 1}`}</span><div class="fitness-track"><span style="width:${width(route)}%"></span></div><strong>${format(score(route), 4)}</strong></button>`).join('');
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
