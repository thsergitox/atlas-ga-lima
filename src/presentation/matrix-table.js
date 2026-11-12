import { format } from './components.js';

export function matrixTable(museums, values, metric, currency, costLabel) {
  const units = { distance: 'km', time: 'min', cost: currency };
  return `<table aria-label="Matriz ${metric === 'distance' ? 'de distancia' : metric === 'time' ? 'de tiempo' : 'de ' + costLabel.toLowerCase()}"><thead><tr><th scope="col">De / a</th>${museums.map(p => `<th scope="col">${p.id}</th>`).join('')}</tr></thead><tbody>${museums.map((origin, i) => `<tr><th scope="row">${origin.id}</th>${museums.map((destination, j) => `<td><button data-cell data-origin="${origin.id}" data-destination="${destination.id}" tabindex="-1" aria-pressed="false" aria-label="${origin.short} a ${destination.short}: ${format(values[i][j], 1)} ${units[metric]}">${format(values[i][j], 1)}</button></td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

export function bindMatrix(host, n, select) {
  host.onclick = event => {
    const cell = event.target.closest('[data-cell]');
    if (cell) select(cell.dataset.origin, cell.dataset.destination);
  };
  host.onkeydown = event => {
    const cell = event.target.closest('[data-cell]');
    const direction = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[event.key];
    if (!cell || !direction) return;
    event.preventDefault(); event.stopPropagation();
    const origin = Math.max(1, Math.min(n, +cell.dataset.origin + direction[0]));
    const destination = Math.max(1, Math.min(n, +cell.dataset.destination + direction[1]));
    select(origin, destination);
    host.querySelector(`[data-origin="${origin}"][data-destination="${destination}"]`).focus();
  };
}
