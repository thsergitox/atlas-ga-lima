"""Convertir el guion Markdown a una página de lectura; no compila la aplicación."""
from pathlib import Path
from html import escape
import re
import markdown

ROOT = Path(__file__).resolve().parents[1]


MATH = r'\\\[.*?\\\]|\\\(.*?\\\)'


def assemble_guide():
    parts = [(ROOT / f'docs/guide-person-{i}.md').read_text() for i in range(1, 4)]
    table = ['| Persona | Diapositivas | Texto del bloque | Lectura orientativa |',
             '|---|---|---|---|']
    for index, (part, slides) in enumerate(zip(parts, ['1–4', '5–7', '8–13']), 1):
        words = len(re.findall(r'\b\w+\b', re.sub(MATH, '', part, flags=re.S)))
        table.append(f'| Persona {index} | {slides} | {words} palabras | {words / 130:.1f} min |')
    opening = (ROOT / 'docs/guide-opening.md').read_text().replace('{{PRESENTER_LOAD}}', '\n'.join(table))
    questions = (ROOT / 'docs/guide-questions.md').read_text()
    return '\n\n'.join([opening, *parts, questions])


def protect_math(source):
    expressions = []

    def remember(match):
        expressions.append(match.group())
        return f'MATHEXPRESSIONTOKEN{len(expressions) - 1}END'

    return re.sub(MATH, remember, source, flags=re.S), expressions


def restore_math(body, expressions):
    for index, expression in enumerate(expressions):
        token = f'MATHEXPRESSIONTOKEN{index}END'
        if expression.startswith(r'\['):
            body = body.replace(f'<p>{token}</p>', f'<div class="math-display" tabindex="0" role="region" aria-label="Fórmula; desplazarse si excede el ancho">{escape(expression)}</div>')
        else:
            body = body.replace(token, f'<span class="math-inline">{escape(expression)}</span>')
    return body


def render_guide(source):
    protected, expressions = protect_math(source)
    renderer = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc'])
    body = restore_math(renderer.convert(protected), expressions)
    body = body.replace('<table>', '<div class="guide-table" tabindex="0" role="region" aria-label="Tabla comparativa desplazable"><table>').replace('</table>', '</table></div>')
    chapters = renderer.toc_tokens[0]['children']
    links = ''.join(f'<a href="#{item["id"]}">{item["name"]}</a>' for item in chapters)
    template = (ROOT / 'docs/guion-template.html').read_text()
    (ROOT / 'guion.html').write_text(template.replace('{{INDEX}}', links).replace('{{CONTENT}}', body))


if __name__ == '__main__':
    source = assemble_guide()
    (ROOT / 'guion.md').write_text(source)
    render_guide(source)
