"""Convertir el guion Markdown a una página de lectura; no compila la aplicación."""
from pathlib import Path
import markdown

ROOT = Path(__file__).resolve().parents[1]


def render_guide():
    source = (ROOT / 'guion.md').read_text()
    renderer = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc'])
    body = renderer.convert(source)
    body = body.replace('<table>', '<div class="guide-table" tabindex="0" role="region" aria-label="Tabla comparativa desplazable"><table>').replace('</table>', '</table></div>')
    chapters = renderer.toc_tokens[0]['children']
    links = ''.join(f'<a href="#{item["id"]}">{item["name"]}</a>' for item in chapters)
    template = (ROOT / 'docs/guion-template.html').read_text()
    (ROOT / 'guion.html').write_text(template.replace('{{INDEX}}', links).replace('{{CONTENT}}', body))


if __name__ == '__main__':
    render_guide()
