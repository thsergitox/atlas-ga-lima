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

Se calculan para TODOS los pares, con diagonal cero. Distancias en kilómetros, tiempos en minutos y costos en soles simulados. Matrices simétricas por construcción; el modelo no incluye sentidos de circulación.

`D[i][j]`: Haversine con radio R=6371 km. Es distancia geodésica, NO distancia vial. El mapa usa segmentos rectos entre ubicaciones para mostrar orden y conexiones; no proporciona instrucciones de navegación.

`T[i][j]`: si D≤1 km, se camina a 4.5 km/h: T=60D/4.5. En otro caso, T=4+60D/18. Se eligieron 18 km/h y cuatro minutos fijos únicamente para mostrar cómo crear una matriz temporal distinta de la distancia normalizada. No son mediciones ni predicciones de tráfico. El salto en el umbral refleja el cambio de modelo, no datos observados.

`C[i][j]`: cero si D≤1; si D>1, max(8,4+2.5D). Los parámetros (8 soles mínimos, 4 soles de base, 2.5 soles/km) son supuestos didácticos. NO son tarifas vigentes ni cotizaciones. Siguen el patrón conceptual del paper (caminar o traslado con base, tarifa por km y mínimo), pero no trasladan liras turcas a soles.

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
