export function bindPan(svg, pan, zoomIn, zoomOut, reset) {
  const controller = new AbortController(), options = { signal: controller.signal };
  let drag;
  svg.tabIndex = 0;
  svg.setAttribute('aria-description', 'Arrastra para desplazar. Usa + y − para zoom, flechas para mover y 0 para encuadrar.');
  svg.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('.museum-marker')) return;
    drag = { x: event.clientX, y: event.clientY, id: event.pointerId };
    svg.setPointerCapture(event.pointerId);
    svg.classList.add('dragging');
  }, options);
  svg.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    pan(drag.x - event.clientX, drag.y - event.clientY);
    drag.x = event.clientX; drag.y = event.clientY;
  }, options);
  const release = () => { drag = null; svg.classList.remove('dragging'); };
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) svg.addEventListener(type, release, options);
  svg.addEventListener('keydown', event => {
    if (event.target !== svg) return;
    const moves = { ArrowLeft: [-65, 0], ArrowRight: [65, 0], ArrowUp: [0, -65], ArrowDown: [0, 65] };
    const action = moves[event.key];
    if (action) pan(...action);
    else if (['+', '='].includes(event.key)) zoomIn();
    else if (event.key === '-') zoomOut();
    else if (event.key === '0') reset();
    else return;
    event.preventDefault(); event.stopPropagation();
  }, options);
  return () => controller.abort();
}
