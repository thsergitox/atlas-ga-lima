# Caso de veinte museos de Lima

Consulta realizada el 11 de noviembre de 2026: `https://nominatim.openstreetmap.org/search?q=museo+Lima+Peru&format=json&limit=40`. Se seleccionaron veinte objetos identificados por nombre; el JSON conserva coordenadas y enlace OSM por registro. Las coordenadas corresponden a objetos cartográficos (punto o centroide); no garantizan la ubicación exacta de una puerta de ingreso. No se consultaron horarios, precios de entrada ni disponibilidad.

| ID | Museo | Zona descriptiva |
|---|---|---|
| 1 | Museo de Arte de Lima (MALI) | Centro |
| 2 | Museo Larco | Pueblo Libre |
| 3 | Museo Nacional de Arqueología, Antropología e Historia del Perú | Pueblo Libre |
| 4 | Museo de Arte Italiano | Centro |
| 5 | Museo Metropolitano de Lima | Centro |
| 6 | Museo de Historia Natural (UNMSM) | Jesús María / entorno de Santa Beatriz |
| 7 | Museo Central (MUCEN) | Centro |
| 8 | Museo de Arte Contemporáneo de Lima | Barranco |
| 9 | Museo de la Electricidad | Barranco |
| 10 | Museo Pedro de Osma | Barranco |
| 11 | Museo de la Nación | San Borja |
| 12 | Museo Oro del Perú | Surco |
| 13 | Museo de la Inmigración Japonesa | Jesús María |
| 14 | Museo de Arte de San Marcos (UNMSM) | Centro |
| 15 | Museo Nacional de la Cultura Peruana | Centro |
| 16 | Casa Museo José Carlos Mariátegui | Centro |
| 17 | Museo de Neuropatología | Barrios Altos |
| 18 | Museo de Sitio El Mirador del Cerro San Cristóbal | Rímac |
| 19 | Museo Señor de los Milagros | Centro |
| 20 | Museo del Palacio Arzobispal de Lima | Centro |

Las etiquetas de zona son orientativas para lectura, no un levantamiento de límites administrativos. La visita a veinte museos se usa como problema de ordenamiento, no como itinerario realizable en una sola jornada.

## Tres matrices 20 × 20

La versión actual usa380 consultas dirigidas a openrouteservice (ORS), perfil `driving-car`. Cada consulta devuelve distancia, duración y una polilínea GeoJSON. Se adquieren solo los pares i≠j; las veinte diagonales se definen en cero localmente. El mismo recorrido proporciona la métrica y el trazado. Los sentidos de circulación hacen que D[i][j] y D[j][i] puedan diferir; no se copian ni promedian los viajes inversos.

`D[i][j] = distanceMeters / 1000`: kilómetros por la red vial, no distancia geodésica.

`T[i][j] = durationSeconds / 60`: minutos estimados por ORS. El perfil no usa tráfico en vivo; una matriz fija permite comparar todas las rutas en la misma corrida. Las conexiones se modelan en automóvil, también entre museos cercanos.

`C[i][j] = max(8, 4 + 2.5D[i][j])` si i≠j; cero en diagonal. Los parámetros (8 soles mínimos,4de base,2.5por km) siguen siendo supuestos académicos. No son tarifas de taxi, precios de ORS ni cotizaciones comerciales. Se retiró el umbral de caminar gratis para no mezclar tiempos de automóvil con un costo peatonal.

Los resultados originales de ORS se conservan en `data/routes.geojson`:380features LineString, coordenadas [longitud,latitud], metros y segundos. `data/provenance.json` registra fecha de adquisición, perfil, hash y distancia entre los puntos de museo y los extremos de la red vial. Esos pequeños accesos pueden quedar fuera del recorrido del automóvil: no se dibujan como calles inventadas ni se suman como tiempos conocidos.

El endpoint vigente es `api.heigit.org/openrouteservice/v2/directions/driving-car/geojson`. Los primeros200 pares se obtuvieron del dominio anterior y se conservaron después de comprobar que un control coincidía exactamente en distancia, duración, geometría y motor. La procedencia de cada par conserva su endpoint original.

La adquisición se hace una vez con `python3 python/fetch_routes.py`, leyendo ORS_API_KEY del `.env` ignorado. Pausas de2s mantienen el ritmo por debajo de40solicitudes/min del plan gratuito verificado. La caché local permite reanudar sin repetir los pares completados y no se publica. La web carga archivos locales y no necesita clave ni solicitudes al proveedor durante la exposición. Resultados ORS y derivados bajo CC BY-SA4.0, atribución visible y detalles en `data/LICENSE.md`.

La versión anterior Haversine y sus matrices/experimento se preservan en `data/archive/haversine/`. Eran distancias geodésicas, tiempos y costos modelados, con matrices simétricas. El archivo no se presenta como dato vial actual.

Presupuesto B=360 soles de traslados, elegido para este ejemplo. No incluye entradas ni comidas. La interfaz de fitness permite explorar B=30…600; ese control no modifica la corrida guardada, cuyo B es siempre 360.

## Ejecución

100 rutas, 100 generaciones, 100 descendientes por generación. Inicio fijo en MALI. Ruta abierta de veinte paradas y diecinueve tramos. Permutaciones posibles: 19!=121645100408832000. La inicialización excluye el ID 1 antes de permutar los otros IDs.

Fitness equivalente a Fitness.py: se normaliza globalmente cada matriz D y T por min-max, se suman sus entradas por los diecinueve tramos y se divide la fracción de presupuesto restante por esa suma. La diagonal cero hace min(D)=min(T)=0; por eso esta adaptación suma D total / max(D) y T total / max(T), que es algebraicamente equivalente aquí. No se normalizan los totales de la población. C>B produce fitness negativo, sin descarte automático.

La corrida exporta el mejor de la población inicial, toda la población inicial, un torneo real, un cruce real que cambia ambos hijos, cien estados del mejor histórico y una demostración adicional de Mutation con μ=0.9. Esa demostración adicional NO se presenta como un evento de la corrida evolutiva. Cada paso conserva la ruta antes/después y el índice intercambiado. Las demostraciones nuevas en la web son sorteos del navegador y se rotulan como tales.

## Cartografía y tipografía

Teselas estándar de OpenStreetMap, zoom 13, almacenadas una sola vez para esta presentación sin peticiones durante la exposición. Se aplicó desaturación en CSS para dar contraste a los itinerarios. Origen de cada PNG en `data/basemap.json` y metadatos de procedencia de los archivos. Atribución visible al pie de cada mapa.

Bricolage Grotesque y Source Sans 3, obtenidas desde Google Fonts y alojadas localmente con sus licencias OFL. KaTeX 0.19.1 se hereda de Atlas GA y conserva su licencia MIT.


## Ampliación a veinte y modo Estambul

Se añadieron los IDs 11–20: Museo de la Nación, Oro del Perú, Inmigración Japonesa, Arte de San Marcos, Cultura Peruana, Casa Mariátegui, Neuropatología, San Cristóbal, Señor de los Milagros y Palacio Arzobispal. Todos proceden de la misma consulta OSM conservada. El presupuesto didáctico pasa de 180 a 360 soles al duplicar el número de paradas, como una nueva hipótesis explícita, no un precio estimado de mercado.

El selector Paper usa `data/paper/`: doce coordenadas originales y tres matrices 12×12 de .mat, junto con los cien individuos de ind.mat. ID 6 es Pelit Chocolate Museum; el presupuesto es 2000 TL. Las matrices pueden ser asimétricas. Los cinco .mat se incluyen intactos y sus hashes se publican en provenance.json. No se sustituyen por Haversine ni se convierten a soles. La curva es una nueva ejecución Python, separada de los resultados reportados en el artículo. La conversión usa SciPy; la ejecución del archivo descargable algorithm.py solo requiere la biblioteca estándar.

## Estambul ORS y comparación (12 de noviembre de 2026)

`data/istanbul/` añade 132 pares dirigidos sin alterar `data/paper/`. Conserva las doce coordenadas, el multiconjunto completo de cien rutas de ind.mat, inicio 6, presupuesto 2000 TL y C histórica. D/T se obtienen de la misma respuesta que la geometría driving-car; no hay tráfico en vivo. La matriz de costo NO se recalcula con una tarifa inventada ni representa precios actuales.

La primera adquisición con radio predeterminado conservó ocho pares en caché y se detuvo en 1→10: ORS respondió 404 por no encontrar vía a 350 m. Se adquirió el conjunto completo con `--snap-radius 1000`, con identidad de caché separada por las opciones de la petición. La API documenta `radiuses` y un máximo de 2 km; el radio elegido solo permite buscar una vía, no añade 1000 m a cada recorrido. La mayor separación realmente observada es 354,8 m. No se mueve el destino original ni se inventan conectores peatonales. Cada par conserva opciones, geometría, motor, fecha y endpoint; la procedencia publica hash y separaciones por extremo. Son 132 respuestas públicas completas; hubo nueve consultas iniciales separadas, incluida la rechazada, antes de ampliar el radio.

Fuentes técnicas: [API Directions](https://giscience.github.io/openrouteservice/api-reference/endpoints/directions/), [parámetro de radio](https://ask.openrouteservice.org/t/point-not-within-a-radius-of-350-0-meters/1156/9) y [restricciones del servicio](https://openrouteservice.org/restrictions/).

Resultado → Paper vs ORS evalúa las rutas finales guardadas de ambas corridas bajo D/T ORS y la misma C histórica. Ruta histórica: 83,3387 km / 111,9383 min / 854 TL históricos / fitness 0,13915445. Nueva ruta: 81,9766 km / 108,5133 min / 829 TL históricos / fitness 0,14587259. La misma ruta histórica en sus matrices originales medía 87 km / 149 min; esos valores se presentan aparte, sin comparar directamente fitness con normalizadores distintos. Una corrida sin semilla por caso no demuestra superioridad causal; proveedores y fechas difieren.

## Fichas de destinos

`museum-info.json` contiene veinte reseñas de Lima, con fuente individual y fecha de verificación. `istanbul-info.json` describe Dolmabahçe y Pelit; los otros IDs conservan explícitamente la falta de nombre en Places.mat. La información se mantiene separada de los registros usados para adquirir rutas: enriquecer una reseña no cambia el fingerprint de la caché. No se publican horarios, disponibilidad ni precios de visita. Las fichas de casos ORS incluyen el intervalo de separación entre el punto original y sus extremos viales.
