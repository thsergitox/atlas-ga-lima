"""Publicar el código completo desde las mismas funciones que ejecutan el GA."""
import inspect
from pathlib import Path

from dataset import evaluate
from evolution import execute
from operators import initial_population, copy_order, crossover, mutate, tournament

ROOT = Path(__file__).resolve().parents[1]
HEADER = '''"""Algoritmo genético completo de la exposición Atlas GA.
Uso: python algorithm.py experiment.json
Lima: matrices viales ORS (20). Estambul: matrices del port (12).
Adquisición separada del algoritmo; nueva ejecución sin semilla.
COX, mutación por filas y torneo equivalentes al port de Arbues (MIT).
"""
import json
import random
import sys
from pathlib import Path

'''
MAIN = '''

if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Uso: python algorithm.py experiment.json')
    data = json.loads(Path(sys.argv[1]).read_text())
    parameters = data['run']['parameters']
    initial = data['run']['selection']['pool']
    output = execute(data['matrices'], budget=parameters['budget'],
                     size=parameters['population'],
                     generations=parameters['generations'],
                     start=initial[0][0], initial=initial)
    print(json.dumps(output, ensure_ascii=False, indent=2))
'''


def main():
    functions = [evaluate, initial_population, copy_order,
                 crossover, mutate, tournament, execute]
    code = HEADER + '\n\n'.join(inspect.getsource(f).rstrip() for f in functions) + MAIN
    compile(code, 'algorithm.py', 'exec')
    (ROOT / 'data/algorithm.py').write_text(code)
    print('Código completo exportado:', len(code.splitlines()), 'líneas')


if __name__ == '__main__':
    main()
