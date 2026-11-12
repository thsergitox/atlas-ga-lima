# Atlas GA · Lima y Estambul

Presentación interactiva en español del algoritmo genético de Şehab y Turan (2024), contrastado con el port Python de Arbues.

**Web:** https://atlas-ga-lima.vercel.app

- [Lima: veinte museos](https://atlas-ga-lima.vercel.app/?caso=lima)
- [Paper: doce destinos originales de Estambul](https://atlas-ga-lima.vercel.app/?caso=paper)
- [Estambul ORS: rutas viales y comparación](https://atlas-ga-lima.vercel.app/?caso=istanbul#resultado)
- [Código completo al final del algoritmo](https://atlas-ga-lima.vercel.app/?caso=lima#codigo)

## Presentar

El selector superior cambia el caso sin perder la diapositiva. Actualiza mapa, dataset, fórmulas, cromosomas, presupuesto, moneda y descargas. Trece diapositivas: problema, pipeline, datos, población, fitness, selección, COX, mutación, reemplazo, evolución, resultado, código completo y fuentes.

Flechas: navegar. `F`: pantalla completa. `N`: notas. `Esc`: cerrar notas/índice. En el editor de código, las teclas de navegación desplazan el código.

Cada marcador abre una ficha con reseña, ubicación y fuente. El mapa tiene +/−, encuadre y desplazamiento al arrastrar. Leaflet ofrece rueda, doble clic y gestos táctiles, además de +/− y encuadre. Con el mapa enfocado, las flechas desplazan y +/− cambian el zoom; esas teclas no cambian de diapositiva. Escape cierra la ficha y devuelve el foco al marcador.

**Ampliar mapa** abre una vista casi completa y **Pantalla completa** usa la pantalla del navegador. Ambas conservan el zoom, las rutas y las fichas del mismo mapa. **Volver a diapositiva** restaura su posición; Escape permite salir de la vista ampliada. Si el navegador no permite pantalla completa, queda disponible la ampliación. La atribución de rutas y mapa permanece visible.

COX permite elegir cortes y ver sus dos hijos. Mutación muestra los intercambios y su matriz de indicadores (20×20 o 12×12); μ=.9 es la demostración de diversificación, mientras la corrida inicia en .1. Evolución reproduce cien generaciones Python guardadas, sin fabricar curvas. El código completo permite copiar/descargar un archivo ejecutable con todas las funciones y el punto de entrada.

## Abrir localmente

```sh
python3 -m http.server 8766
```

Abrir http://localhost:8766. HTML/CSS/módulos ES sin framework ni compilación. Fórmulas, fuentes y Leaflet 1.9.4 se sirven localmente. El detalle de calles usa teselas OpenStreetMap solicitadas al navegar; requiere conexión. Las imágenes de base ya disponibles sirven de respaldo sin nuevos niveles de detalle.

## Pipeline Lima

Python 3, solo biblioteca estándar:

```sh
# Opcional: actualizar los veinte registros OSM (una solicitud de red)
python3 python/fetch_museums.py
# Adquirir los 380 trayectos (solo al preparar/actualizar el dataset)
# Requiere ORS_API_KEY en .env; admite --limit 6 para el piloto
python3 python/fetch_routes.py
# Crear matrices, ejecutar cien generaciones y exportar CSV/JSON
python3 python/run_lima.py
# Exportar el algoritmo completo a partir de las mismas funciones
python3 python/export_code.py
```

Lima usa coordenadas OSM y380 recorridos dirigidos de openrouteservice: distancias viales, tiempos estimados y geometrías GeoJSON del mismo recorrido. Perfil driving-car, sin tráfico en vivo. Los costos `max(8,4+2.5D)` y el presupuesto de360 soles son hipótesis académicas, no tarifas comerciales ni una jornada de visitas validada. El histórico Haversine queda en `data/archive/haversine/`.

El endpoint vigente es `https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson`. El dominio anterior tiene una cuota reducida y ya no corresponde al panel. La adquisición se limita a menos de40 consultas/min y conserva progreso en `.cache/ors/`. La clave solo se usa localmente, nunca en la web. Una vez preparado, el sitio reproduce las rutas y operadores sin consultar la API de ORS. Leaflet solicita solo las teselas del mapa al navegar, con atribución y caché del navegador. En Dataset se exploran las matrices y se invierte cualquier par; Fuentes permite descargar los380trazados y su procedencia.

## Datos originales del paper

`data/paper/original/` contiene copias byte a byte de Places.mat, Travel_Dis.mat, Travel_Times.mat, Travel_Costs.mat e ind.mat. Procedencia y hashes en `data/paper/provenance.json`. El dataset de Estambul tiene doce destinos y cien rutas iniciales con inicio 6. Sus matrices son asimétricas y el presupuesto es 2000 TL, como el ejemplo del port. El archivo de lugares solo contiene IDs y coordenadas; no se inventan nombres ausentes.

La conversión desde las fuentes clonadas usa SciPy (necesaria para .mat):

```sh
uv run --with scipy python python/export_paper.py
```

Los resultados visibles son de una NUEVA ejecución Python del ciclo equivalente a S6 sobre esos datos originales. No se atribuyen a los resultados numéricos de la tabla 7 del artículo. Los controles y las comparaciones respetan el mismo caso.

## Estambul con openrouteservice

```sh
python3 python/fetch_routes.py --case istanbul --snap-radius 1000
python3 python/run_istanbul.py
```

Son 132 pares dirigidos de las mismas doce coordenadas. Se conservan las cien rutas iniciales, inicio 6, B=2000 TL y C histórica; solo se sustituyen D/T. El destino 10 no tenía vía accesible dentro del radio predeterminado de 350 m: se amplió a 1000 m sin mover su coordenada. La máxima separación real es 354,8 m, publicada en la procedencia y visible en la ficha. Esos accesos peatonales no se cuentan en D/T.

En Resultado → Paper vs ORS, las dos mejores rutas guardadas se evalúan bajo las MISMAS matrices ORS y C histórica. La ruta histórica resulta en 83,3387 km / 111,9383 min; la nueva, 81,9766 km / 108,5133 min estimados. No se comparan fitness con normalizadores distintos ni se interpreta una sola corrida como prueba causal de superioridad. Los proveedores y fechas difieren, los costos son históricos y no se incorporan tráfico, visitas, entradas ni horarios. El caso Paper permanece intacto.

## Código completo, ejecutable sin instalaciones

Descargar `algorithm.py` y el `experiment.json` del caso elegido. Después:

```sh
python3 algorithm.py experiment.json
```

Ejecuta cien generaciones con sus matrices y población inicial guardadas, sin SciPy. No fija semilla. La traza distribuida permite repetir la exposición; volver a ejecutar puede cambiar los resultados. `python/evolution.py` y `operators.py` son compartidos por los tres casos.

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

Código MIT; atribuciones originales en `python/upstream/LICENSE`. Resultados ORS y matrices derivadas: CC BY-SA4.0, ver `data/LICENSE.md`. Coordenadas y mapas: © OpenStreetMap contributors, ODbL; teselas locales con procedencia. KaTeX y fuentes incluyen sus licencias en `assets/`.
