# Atlas GA · Dos casos, un algoritmo

Presentación interactiva en español del algoritmo genético de Şehab y Turan (2024), contrastado con el port Python de Arbues.

**Web:** https://atlas-ga-lima.vercel.app

- [Lima: veinte museos](https://atlas-ga-lima.vercel.app/?caso=lima)
- [Paper: doce destinos originales de Estambul](https://atlas-ga-lima.vercel.app/?caso=paper)
- [Código completo al final del algoritmo](https://atlas-ga-lima.vercel.app/?caso=lima#codigo)

## Presentar

El selector superior cambia el caso sin perder la diapositiva. Actualiza mapa, dataset, fórmulas, cromosomas, presupuesto, moneda y descargas. Trece diapositivas: problema, pipeline, datos, población, fitness, selección, COX, mutación, reemplazo, evolución, resultado, código completo y fuentes.

Flechas: navegar. `F`: pantalla completa. `N`: notas. `Esc`: cerrar notas/índice. En el editor de código, las teclas de navegación desplazan el código.

COX permite elegir cortes y ver sus dos hijos. Mutación muestra los intercambios y su matriz de indicadores (20×20 o 12×12); μ=.9 es la demostración de diversificación, mientras la corrida inicia en .1. Evolución reproduce cien generaciones Python guardadas, sin fabricar curvas. El código completo permite copiar/descargar un archivo ejecutable con todas las funciones y el punto de entrada.

## Abrir localmente

```sh
python3 -m http.server 8766
```

Abrir http://localhost:8766. HTML/CSS/módulos ES sin framework ni compilación. Fórmulas, fuentes y mapas se sirven localmente.

## Pipeline Lima

Python 3, solo biblioteca estándar:

```sh
# Opcional: actualizar los veinte registros OSM (una solicitud de red)
python3 python/fetch_museums.py
# Crear matrices, ejecutar cien generaciones y exportar CSV/JSON
python3 python/run_lima.py
# Exportar el algoritmo completo a partir de las mismas funciones
python3 python/export_code.py
```

Lima usa coordenadas OSM, distancias Haversine y tiempo/costo didácticos. Presupuesto supuesto: 360 soles de traslados para veinte paradas. No son datos viales, tarifas reales ni una jornada de visitas validada.

## Datos originales del paper

`data/paper/original/` contiene copias byte a byte de Places.mat, Travel_Dis.mat, Travel_Times.mat, Travel_Costs.mat e ind.mat. Procedencia y hashes en `data/paper/provenance.json`. El dataset de Estambul tiene doce destinos y cien rutas iniciales con inicio 6. Sus matrices son asimétricas y el presupuesto es 2000 TL, como el ejemplo del port. El archivo de lugares solo contiene IDs y coordenadas; no se inventan nombres ausentes.

La conversión desde las fuentes clonadas usa SciPy (necesaria para .mat):

```sh
uv run --with scipy python python/export_paper.py
```

Los resultados visibles son de una NUEVA ejecución Python del ciclo equivalente a S6 sobre esos datos originales. No se atribuyen a los resultados numéricos de la tabla 7 del artículo. Los controles y las comparaciones respetan el mismo caso.

## Código completo, ejecutable sin instalaciones

Descargar `algorithm.py` y el `experiment.json` del caso elegido. Después:

```sh
python3 algorithm.py experiment.json
```

Ejecuta cien generaciones con sus matrices y población inicial guardadas, sin SciPy. No fija semilla. La traza distribuida permite repetir la exposición; volver a ejecutar puede cambiar los resultados. `python/evolution.py` y `operators.py` son compartidos por ambos casos.

## Fuentes y verificación

- [Paper, DOI 10.7717/peerj-cs.2340](https://doi.org/10.7717/peerj-cs.2340).
- [Port de Arbues](https://github.com/Arbues/ga-itinerary-planning-pc3), revisión e84ed98c8ecd65bf269da847ee26147f1f282d70.
- [MATLAB original](https://github.com/MuhammedSehab/GA-for-Itinerary-Planning).
- `docs/AUDIT.md`, `docs/DATA.md`, `docs/VERIFICATION.md`: correspondencia, supuestos y evidencia.

El repositorio clonado permanece intacto como carpeta hermana. `python/upstream/` conserva COX.py y Mutation.py originales con su licencia.

## Publicar

```sh
vercel deploy --prod --yes --scope pezosergios-projects
```

`vercel.json` usa framework nulo y comando de compilación vacío. No ejecutar builds. `.vercelignore` excluye documentación, scripts de desarrollo y configuración local. `.env*` y `.vercel/` no se versionan.

Código MIT; atribuciones originales en `python/upstream/LICENSE`. Coordenadas y mapas: © OpenStreetMap contributors, ODbL; teselas locales con procedencia. KaTeX y fuentes incluyen sus licencias en `assets/`.
