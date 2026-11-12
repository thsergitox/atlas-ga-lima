import { escape, announce } from './components.js';

export function completeCode(ctx) {
  const { stage, algorithm, profile } = ctx;
  const lines = algorithm.split('\n');
  stage.innerHTML = `<div class="complete-code"><div class="complete-code-heading"><span>${lines.length} líneas · Python completo</span><div><a href="data/algorithm.py" download="algorithm.py">Descargar .py</a><a href="${profile.path}experiment.json" download="experiment.json">Datos de ${profile.shortCity}</a><button id="copy-algorithm" class="secondary small">Copiar código</button></div></div><nav class="code-sections" aria-label="Secciones del código"><button data-code-section="evaluate">Fitness</button><button data-code-section="initial_population">Población</button><button data-code-section="crossover">COX</button><button data-code-section="mutate">Mutación</button><button data-code-section="tournament">Torneo</button><button data-code-section="execute">Ciclo completo</button></nav><pre id="complete-python" tabindex="0" aria-label="Código Python completo"><code>${lines.map((line, i) => `<span class="code-line" id="python-line-${i}"><span class="line-number" aria-hidden="true">${i + 1}</span><span class="${line.trim().startsWith('#') || line.trim().startsWith('"""') ? 'code-comment' : ''}">${escape(line)}</span></span>`).join('')}</code></pre><div class="code-command"><span>Ejecutar con los datos seleccionados</span><code>python algorithm.py experiment.json</code></div></div>`;
  stage.querySelector('#copy-algorithm').onclick = async event => {
    try {
      await navigator.clipboard.writeText(algorithm);
      event.target.textContent = 'Código copiado';
      announce('El código Python completo se copió al portapapeles.');
    } catch {
      event.target.textContent = 'Usa Descargar .py';
      announce('No se pudo acceder al portapapeles. Usa Descargar .py.');
    }
  };
  stage.querySelectorAll('[data-code-section]').forEach(button => button.onclick = () => {
    const index = lines.findIndex(line => line.startsWith(`def ${button.dataset.codeSection}(`));
    const target = stage.querySelector(`#python-line-${index}`);
    const pre = stage.querySelector('#complete-python');
    pre.scrollTop += target.getBoundingClientRect().top - pre.getBoundingClientRect().top - 12;
    stage.querySelector('.code-highlight')?.classList.remove('code-highlight');
    target.classList.add('code-highlight');
    announce(`Código: ${button.textContent}`);
  });
  stage.querySelector('[data-code-section="execute"]').click();
}
