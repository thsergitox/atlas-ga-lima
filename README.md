# Atlas GA · Diez museos, una ruta

Presentación interactiva en español del algoritmo genético de Şehab y Turan (2024), contrastado con el port Python de Arbues y adaptado a diez museos de Lima.

**Web:** https://atlas-ga-lima.vercel.app

## Usar la presentación

- Flechas izquierda/derecha o botones inferiores: cambiar diapositiva.
- `F`: pantalla completa; `N`: notas del expositor; `Esc`: cerrar notas o índice.
- «Diapositivas»: índice. Cada diapositiva tiene URL propia, por ejemplo `/#mutacion`.
- COX: ajustar cortes, aplicar y alternar entre los DOS hijos.
- Mutación: reproducir intercambios individuales, sortear una matriz nueva o ver sus 100 indicadores. El modo inicial visible usa μ=0.9 para mostrar diversificación, con μ=0.1 disponible.
- Evolución: reproducir o recorrer las 100 generaciones de una corrida Python guardada. El botón reproduce esa traza; no simula una curva ni ejecuta otra corrida.
- Fuentes: descargar museos, matrices y traza.

## Abrir localmente

```sh
python3 -m http.server 8766
```

Abrir http://localhost:8766. Se sirven módulos ES, por lo que se requiere HTTP en vez de abrir `index.html` como archivo. HTML, CSS y JavaScript sin framework, instalación ni compilación. Fórmulas, fuentes y cartografía se sirven localmente.

## Reproducir el pipeline Python

La adaptación usa solo la biblioteca estándar de Python 3. No requiere crear un entorno ni instalar paquetes.

```sh
# Opcional: actualizar la consulta OSM (una solicitud; necesita internet)
python3 python/fetch_museums.py
# Crear matrices, ejecutar 100 generaciones y exportar CSV/JSON
python3 python/run_lima.py
```

La corrida no fija semilla. Actualiza `data/experiment.json` y los CSV, por lo que sus resultados pueden cambiar. Conservar el JSON distribuido permite repetir exactamente la exposición. Los operadores numéricos de la web son equivalentes; las demos interactivas muestrean en el navegador. La evolución usa la traza Python.

## Fuentes y alcance

- [Paper, DOI 10.7717/peerj-cs.2340](https://doi.org/10.7717/peerj-cs.2340).
- [Port Python de Arbues](https://github.com/Arbues/ga-itinerary-planning-pc3), revisión `e84ed98c8ecd65bf269da847ee26147f1f282d70`.
- [MATLAB original de MuhammedSehab](https://github.com/MuhammedSehab/GA-for-Itinerary-Planning).
- `docs/AUDIT.md`: correspondencia entre artículo, código y adaptación, y limitaciones.
- `docs/DATA.md`: dataset y modelos con unidades.

El repositorio Python se clonó como carpeta hermana `../ga-itinerary-planning-pc3`; se conserva intacto. `python/upstream/` conserva copias literales de COX.py y Mutation.py con su licencia, como referencia auditable. El código ejecutable de Lima está en `python/dataset.py`, `operators.py` y `run_lima.py`.

## Publicar

Con Vercel CLI autenticado, desde esta carpeta:

```sh
vercel deploy --prod --yes
```

`vercel.json` declara framework nulo y comando de compilación vacío. No ejecutar builds. `.vercelignore` excluye documentación, scripts y archivos locales de desarrollo. Nunca versionar `.env*` ni `.vercel/`.

## Licencias

Código de esta web: MIT. Copias de Arbues/MuhammedSehab: licencia MIT y atribuciones intactas en `python/upstream/LICENSE`. Coordenadas y cartografía: © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright). Las teselas se almacenan localmente; enlaces de origen en `data/basemap.json`. KaTeX y fuentes incluyen sus licencias en `assets/`.
