import { lessons } from './lessons.js';
import { codeBlock, announce, svgIcon } from './components.js';
import { createMap } from '../map/route-map.js';
import { intro, pipeline, dataset, population, fitness, replacement, result } from './basic-stages.js';
import { selection } from './selection-stage.js';
import { crossing } from './crossover-stage.js';
import { mutation } from './mutation-stage.js';
import { evolution } from './evolution-stage.js';
import { sources } from './sources-stage.js';

const $ = selector => document.querySelector(selector);
const stages = [intro, pipeline, dataset, population, fitness, selection, crossing, mutation, replacement, evolution, result, sources];
let index = 0;
let cleanup = () => {};
let context;

function renderFormula(lesson) {
  if (!lesson.formula) return '';
  return `<div class="formula-panel"><div id="formula"></div></div>`;
}

function renderCopy(lesson) {
  $('#slide-title').innerHTML = lesson.title.replace('\n', '<br>');
  $('#slide-lead').textContent = lesson.lead;
  $('#lesson-detail').innerHTML = index === 0
    ? `<div class="hero-actions"><button class="primary" data-go="1">Comenzar exposición ${svgIcon('arrow')}</button><span>12 diapositivas<br> Un algoritmo, paso a paso</span></div><p class="hero-fact">9! = 362 880 <span>órdenes posibles con MALI como inicio</span></p>`
    : `<p class="insight">${lesson.insight}</p>${renderFormula(lesson)}`;
  $('#lesson-bottom').innerHTML = lesson.code ? codeBlock(lesson) : `<div class="hero-reference"><span>Basado en Şehab y Turan (2024)</span><a href="https://doi.org/10.7717/peerj-cs.2340" target="_blank" rel="noreferrer">PeerJ Computer Science · e2340 ↗</a></div>`;
  if (lesson.formula && window.katex) {
    window.katex.render(lesson.formula, $('#formula'), { displayMode: true, throwOnError: true });
  }
}

function renderNavigation() {
  $('#slide-count').textContent = `${String(index + 1).padStart(2, '0')} / ${lessons.length}`;
  $('#previous').disabled = index === 0;
  $('#next').disabled = index === lessons.length - 1;
  $('#progress').style.width = `${(index + 1) / lessons.length * 100}%`;
  for (const button of document.querySelectorAll('[data-slide]')) {
    const current = +button.dataset.slide === index;
    button.classList.toggle('active', current);
    if (current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
  }
  document.title = `${lessons[index].label} · Atlas GA Lima`;
}

function renderNotes() {
  $('#notes-slide').textContent = `${String(index + 1).padStart(2, '0')} · ${lessons[index].label}`;
  const sentences = lessons[index].notes.split(/(?<=\.) (?=[A-ZÁÉÍÓÚ])/);
  $('#notes-copy').replaceChildren(...sentences.map(text => {
    const p = document.createElement('p'); p.textContent = text; return p;
  }));
}

function go(nextIndex, focus = false) {
  if (!context) return;
  cleanup();
  index = Math.max(0, Math.min(lessons.length - 1, nextIndex));
  $('#presentation').className = `presentation slide-${lessons[index].id}`;
  $('#map-title').textContent = index === 0 ? 'Lima, Perú' : lessons[index].label + ' · Lima';
  renderCopy(lessons[index]); renderNavigation(); renderNotes();
  cleanup = stages[index](context) || (() => {});
  history.replaceState(null, '', `#${lessons[index].id}`);
  $('#map-tooltip').hidden = true;
  context.map.highlight(null);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $('.lesson').animate([{ opacity: 0.7, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
  if (focus) $('#slide-title').focus({ preventScroll: true });
  announce(`Diapositiva ${index + 1} de ${lessons.length}: ${lessons[index].label}`);
}

function toggleNotes(open = $('#notes').hidden) {
  $('#notes').hidden = !open;
  $('#notes-button').setAttribute('aria-expanded', open);
  if (open) { toggleContents(false); $('#close-notes').focus(); } else $('#notes-button').focus();
}
function toggleContents(open = $('#contents').hidden) {
  $('#contents').hidden = !open;
  $('#contents-button').setAttribute('aria-expanded', open);
  if (open) { $('#notes').hidden = true; $('#notes-button').setAttribute('aria-expanded', 'false'); $('#contents-list button').focus(); }
}
async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { announce('La pantalla completa no está disponible en este navegador.'); }
}

function bindControls() {
  $('#previous').onclick = () => go(index - 1, true);
  $('#next').onclick = () => go(index + 1, true);
  $('#notes-button').onclick = () => toggleNotes();
  $('#close-notes').onclick = () => toggleNotes(false);
  $('#contents-button').onclick = () => toggleContents();
  $('#close-contents').onclick = () => { toggleContents(false); $('#contents-button').focus(); };
  $('#fullscreen').onclick = fullscreen;
  $('#map-labels').onclick = event => {
    const show = event.target.getAttribute('aria-pressed') !== 'true';
    event.target.setAttribute('aria-pressed', show); context.map.labels(show);
  };
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go], [data-slide]');
    if (!target) return;
    toggleContents(false);
    go(+(target.dataset.go ?? target.dataset.slide), true);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!$('#notes').hidden) toggleNotes(false);
      if (!$('#contents').hidden) { toggleContents(false); $('#contents-button').focus(); }
      $('#map-tooltip').hidden = true; return;
    }
    if (event.target.closest('input,select,textarea,[contenteditable]') || event.ctrlKey || event.altKey || event.metaKey) return;
    if (['ArrowRight', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.target.closest('button,a,[role="button"]'))) { event.preventDefault(); go(index + 1, true); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); go(index - 1, true); }
    if (event.key === 'Home') go(0, true);
    if (event.key === 'End') go(lessons.length - 1, true);
    if (event.key.toLowerCase() === 'n') toggleNotes();
    if (event.key.toLowerCase() === 'f') fullscreen();
  });
  window.addEventListener('hashchange', () => {
    const found = lessons.findIndex(lesson => `#${lesson.id}` === location.hash);
    if (found >= 0) go(found);
  });
  $('#map').addEventListener('museum-select', event => {
    const p = event.detail;
    const tooltip = $('#map-tooltip');
    tooltip.replaceChildren();
    const title = document.createElement('strong'); title.textContent = `${p.id}. ${p.name}`;
    const detail = document.createElement('span'); detail.textContent = `${p.district} · ${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}`;
    tooltip.append(title, detail); tooltip.hidden = false;
  });
}

async function start() {
  try {
    const [museums, basemap, experiment] = await Promise.all(['data/museums.json', 'data/basemap.json', 'data/experiment.json'].map(async path => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
      return response.json();
    }));
    context = { museums: museums.places, experiment, stage: $('#stage'), map: createMap($('#map'), museums.places, basemap) };
    $('#timeline').innerHTML = lessons.map((lesson, i) => `<button data-slide="${i}" title="${i + 1}. ${lesson.label}" aria-label="Ir a ${lesson.label}"><span>${String(i + 1).padStart(2, '0')}</span><span class="timeline-label">${lesson.label}</span></button>`).join('');
    $('#contents-list').innerHTML = lessons.map((lesson, i) => `<button data-slide="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${lesson.label}</button>`).join('');
    bindControls();
    const requested = lessons.findIndex(lesson => `#${lesson.id}` === location.hash);
    go(requested >= 0 ? requested : 0);
  } catch (error) {
    console.error(error); $('#load-error').hidden = false;
  }
}
start();
