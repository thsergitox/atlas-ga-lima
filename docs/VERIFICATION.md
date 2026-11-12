# Verificación de la actualización

11 de noviembre de 2026. Sin builds locales, semillas ni un entorno de tests creado para esta tarea.

## Dos datasets

- Lima: 20 registros OSM, tres matrices 20×20, inicio 1/MALI y presupuesto didáctico 360 soles.
- Estambul: 12 registros, tres matrices 12×12 originales, inicio 6/Pelit, presupuesto 2000 TL. Los cinco .mat (incluido ind.mat) son byte a byte idénticos al port de Arbues; sus hashes están publicados. SciPy confirma que las matrices JSON coinciden exactamente y conservan la asimetría.
- Ambas poblaciones iniciales contienen 100permutaciones válidas y ambas trazas contienen 100 generaciones. Cada ruta conserva el inicio y contiene todos los IDs una sola vez. Fitness recalculado coincidente y mejor histórico no decreciente.
- JavaScript recalcula distancia, tiempo, costo y fitness de los 200 estados Python: error máximo absoluto cero.

## Operadores y código completo

Para n=20 y n=12 se compararon 1980 casos COX (diez pares por tamaño, todos los cortes válidos) y 80 mutaciones contra las copias originales NumPy, suministrando los mismos cortes o uniformes a ambos métodos. Se conservaron permutación e inicio.

`data/algorithm.py` contiene todas las funciones y el punto de entrada, generado desde los módulos que producen las trazas. Se ejecutó con el JSON de Lima y el de Estambul, completando 100 generaciones válidas para cada uno, usando únicamente biblioteca estándar. Copia al portapapeles, descarga .py, descarga de datos del caso y navegación interna a funciones comprobadas. El teclado en el editor desplaza el código sin cambiar de diapositiva.

## Navegador y revisión

Se recorrieron 78 combinaciones: 13 diapositivas × 2 casos × 3 tamaños (1440×900,1280×720,390px). Sin errores de carga ni desbordes horizontales. Un desborde interno de 12 px del COX de veinte genes en portátil se resolvió con un ajuste local de altura; comprobación final: 372 px de contenido en 372 px de panel. También se comprobó ancho 360 px.

El selector conserva la diapositiva y actualiza mapa, cantidad de genes, fórmulas, indicadores de mutación, moneda y presupuesto. Alternancias Lima→Estambul→Lima muestran respectivamente 400/144/400 indicadores, sin acumular mapas. μ=.9 muestra 12.16 % por fila para Lima y 28.24 % para Estambul; μ=.1 da explícitamente sorteo sin cambios cuando corresponde. La primera posición permanece fija.

Capturas asentadas de escritorio, portátil y móvil inspeccionadas. Revisor independiente: ship, sin problemas materiales. Identidad azul conservada; veinte genes en dos filas y código completo después de Resultado. La consola normal de la revisión no mostró errores.

El detector se ejecutó una vez y señaló diferencias informativas con tokens incompletos del DESIGN.md anterior (colores tonales, tamaños pequeños y radios). Se conservaron los valores existentes; la documentación de los componentes nuevos se actualizó al final. No se reparó el diseño previo por efectos secundarios. Las 80 teselas PNG tienen origen incrustado; escaneo: cero sin procedencia. Los repositorios fuente originales permanecen intactos.

## Publicación de la actualización

Vercel CLI: https://atlas-ga-lima.vercel.app, deployment dpl_57w3W1daguPcVx2XxVwFwEDp1WZe, estado READY. En producción se comprobaron 20 marcadores/13 diapositivas para Lima; el cambio a Estambul conservó Mutación y mostró 12 marcadores/144 indicadores; código completo, JSON y .mat devolvieron HTTP 200. Descarga de datos del editor apunta al caso seleccionado.


## Rutas viales de Lima · 12 de noviembre de 2026

Se adquirieron380 pares dirigidos con geometría:50.267 vértices en `data/routes.geojson`. Las veinte diagonales son ceros locales. Las tres matrices20×20 y los CSV coinciden numéricamente; D está enkm yT enmin. Distancia y duración de cada celda coinciden con la respuesta que aporta su polilínea. Las geometrías quedan cubiertas por las teselas ya disponibles: no se descargaron más mapas.

Se corrigió un error del endpoint de adquisición: `api.openrouteservice.org` está deprecado y limita la cuota al10%del plan. El panel del usuario muestra la cuota de `api.heigit.org`. La migración oficial está en https://ask.openrouteservice.org/t/deprecating-api-openrouteservice-org-in-favour-of-api-heigit-org/7912/ . Se conservaron200 pares del dominio anterior y se adquirieron180del actual; una consulta adicional de control1→2 coincidió exactamente en distancia, duración, geometría y motor. Los380 registros conservan una sola versión del motor y su endpoint original, sin guardar claves. El hash del GeoJSON coincide con la procedencia.

La separación máxima entre punto OSM de museo y extremo vial es107,9m. Se documenta como acceso no incluido; no se inventa una geometría o duración peatonal. Perfil driving-car, sin tráfico en vivo. C=max(8,4+2.5D) sigue siendo simulado para todos los tramos de automóvil; B=360es una hipótesis.

La corrida conserva100 individuos iniciales,100 generaciones y todas las rutas como permutaciones con inicio1. Se recalcularon101 estados de Lima: coinciden sus métricas y el mejor histórico no decrece. Los202 estados distribuidos entre Lima y Estambul coinciden exactamente entre Python y JavaScript (error máximo0). El archivo descargable se ejecutó para ambos casos con100 generaciones válidas cada uno, sin dependencias ni semillas. Los cinco.mat originales de Estambul son idénticos al commit base.

En esta corrida, la mejor ruta inicial tiene116,091km,188,962min y costo simulado367,2465 soles: supera B y su fitness esnegativo. El resultado tiene74,9886km,139,0067min y273,1685 soles; fitness0,02752816. La presentación compara Δfitness absoluto cuando la base no es positiva; el torneo reescala correctamente valores negativos y el gráfico usa límites que los contienen. No se cambia el presupuesto ni la corrida para ocultar esos casos.

Se recorrieron78 combinaciones (13 diapositivas×2 casos×3 tamaños:1440×900,1280×720,390×844), sin errores de carga, mapas duplicados, desbordes horizontales ni consultas a la API desde el navegador. Marcadores20/12 y celdas400/144 correctos. Se comprobó selección, dos hijosCOX, mutación, reinicio, transición interrumpida y reproducción de generaciones. Una mutación registrada cambia tres pares manteniendo idénticas las posiciones de los marcadores. Las polilíneas de sus19 tramos contienen24–270 vértices cada una, no dos extremos rectos. Las animaciones concluyen y limpian sus atributos; movimiento reducido dibuja el estado final sin animaciones de ruta.

La tabla admite selección y flechas sin cambiar de diapositiva. La inversión1→2/2→1 muestra5,188km/10,005min frente a5,7151km/9,745min. Diagonal sin desplazamiento. Los costos de Paper se rotulan como datos del dataset, sin llamarlos simulados por esta adaptación. La descarga del código completo respeta el caso seleccionado y ya no incluye el generador Haversine como parte del algoritmo actual.

Se inspeccionaron capturas reales de escritorio, portátil y móvil. En móvil la región visual crece con el contenido para separar atribuciones y panel; en Dataset/matriz se midieron26,8px libres entre panel y créditos. No se presentan todos los resultados como una visita realizable en una jornada: se excluyen entradas, horarios y tiempos de visita.

Revisión independiente del código: PASS sin Critical/Important. Sus dos observaciones factuales de Paper (conteo de celdas/diagonales y nombre accesible del costo) se corrigieron y verificaron. El detector se ejecutó una vez:106 avisos de tokens y una advertencia por un borde3px en la leyenda. Ese borde representa la línea de la ruta, no un acento de tarjeta; se conserva. No se regeneró el sidecar de diseño fuera de alcance.

Sintaxis Python/ES y `git diff --check` correctos. CSV modificados con finalesLF. Escaneo de todos los archivos publicables: la clave está ausente. `.env*` y `.cache/` están excluidos deGit y Vercel. Sin builds locales ni nuevas suites/entornos.


### Publicación y comprobación de producción

Vercel CLI publicó el commit `8ea2260` en https://atlas-ga-lima.vercel.app con estado READY, deployment `dpl_GhXKUvo4vj5BKKo5WuJiPrSHTaMq`. Sin build local: framework nulo y comando de compilación vacío.

En producción, Lima/Mutación muestra 20 marcadores, 19 tramos viales y tres conexiones añadidas/retiradas en el paso registrado, sin solicitudes a ORS. Cambiar a Paper conserva la diapositiva y muestra 12 marcadores y 144 indicadores; su código completo descarga el JSON de Estambul. Consola sin errores. GeoJSON, experimento, procedencia, algoritmo, CSV de distancia y experimento de Paper devolvieron HTTP 200 y son byte a byte iguales a los archivos verificados. `.env`, `.cache/ors-control.json` y `python/routing/credentials.py` devolvieron HTTP 404. La clave se mantiene local.

## Fichas, cámara y Estambul ORS

Se verificaron 117 combinaciones: 13 diapositivas × tres casos × 1440×900, 1280×720 y 390×844. Sin errores de ejecución, desbordes horizontales, fichas duplicadas ni atributos SVG NaN/Infinity. En mapas de altura menor a 260 px, la botonera se hace horizontal para no invadir el panel. Ocultar el mapa en Código completo conserva la cámara y evita recalcular con dimensiones cero.

Las veinte fichas de Lima permanecen dentro de la región visual en escritorio y móvil, incluida la denominación larga del MNAAHP. Cierre explícito y Escape restablecen aria-expanded y devuelven el foco al marcador; clic fuera cierra. Las fichas indican fuentes y accesos excluidos. No se inventan nombres de Estambul. Zoom 1×–7,59375×, tamaño de marcador de unos 24 px, pan con ratón y teclado, encuadre, límites y cambio de caso/diapositiva comprobados. Se corrigió y volvió a comprobar la interrupción del zoom con pan: el indicador 1,5× coincide con la escala real. Movimiento reducido: cero animaciones activas en mapa/ficha tras la actualización.

Los 512 pares públicos (380 Lima + 132 Estambul) son completos y únicos; D/T coinciden con sus GeoJSON. C de Estambul ORS es idéntica a la histórica, así como sus coordenadas y el multiconjunto de cien rutas iniciales. Los 303 estados de las tres trazas coinciden entre Python y JavaScript; son permutaciones válidas, métricas finitas y mejor fitness no decreciente. Ambas rutas comparadas se recalcularon con las matrices ORS comunes. Máximo acceso de Estambul 354,8 m; hash y procedencia correctos. El caso Paper y la traza Lima no cambiaron. La mutación de Estambul conserva posiciones de marcadores y dibuja once polilíneas de 4–485 vértices en el paso comprobado.

Revisión independiente: PASS tras corregir la interrupción del zoom. Detector Impeccable ejecutado una vez: 118 avisos informativos de tokens y una advertencia por la línea de leyenda, que representa una ruta y se conserva. Se sustituyó el nuevo color literal del control deshabilitado por el token existente. No se cambió la identidad ni se regeneró el índice auxiliar de diseño. Sin builds, nuevas suites ni entornos. Consola sin errores y cero llamadas a ORS desde el navegador.


### Publicación de fichas y Estambul ORS

Commit funcional `30660be`, Vercel CLI, deployment `dpl_Fjq1bTgvUq5AKXRY2ZNbeY4XTkny` READY. Alias https://atlas-ga-lima.vercel.app. Los trece archivos públicos comprobados (HTML, cámara/ficha/casos, información cultural, rutas, traza, procedencia y matrices) devolvieron HTTP 200 y son byte a byte idénticos a los verificados. `.env`, caché de control y script de credenciales devolvieron 404. Consola sin errores; no hay consultas a ORS desde la web. El selector muestra los tres casos, la comparación de Estambul dibuja once tramos, y las fichas de Pelit/MALI, zoom, encuadre y cierre con Escape funcionan en producción. Sin build local ni compilación de aplicación; Vercel empaqueta los archivos estáticos con buildCommand vacío.


## Migración Leaflet

Leaflet 1.9.4 estable local (ESM, CSS y licencia sin compilación). Se comprobaron 117 combinaciones de caso/slide/tamaño sin errores, desbordes, duplicación de mapas ni SVG inválido. QA masiva interceptó las teselas remotas con una imagen transparente para evitar descargas automatizadas; inspección puntual del mapa real confirmó teselas OSM válidas y legibles. Se conservaron exactamente las 512 polilíneas y todos los datos/trazas originales. Marcadores Leaflet coinciden con lat/lon de los registros y no cambian al mutar. Comparación Paper vs ORS sigue mostrando sus métricas y once tramos.

Diez cambios rápidos de caso durante zoom no generan excepciones. Se corrigió un callback CSS tardío de Leaflet 1.9: cada instancia usa su propio canvas y se espera zoomend antes de remove cuando hay zoom pendiente; fit inicial sin animación. ResizeObserver ignora dimensiones cero y llama invalidateSize al reaparecer. Revisión independiente PASS, incluida esa corrección. Fallos parciales de teselas se rastrean por z/x/y. Popups móviles se ajustan al mapa tras autopan, Escape restaura foco, rueda y gestos táctiles están habilitados; movimiento reducido no produce animaciones de mapa. Las teselas nuevas requieren red; no se promete detalle nuevo offline. Sin builds, suites nuevas ni consultas ORS.

El reencuadre se repite cuando cambia el espacio útil del mapa, para no cortar museos al abrir un panel alto. Si hay zoom en curso, se difiere a zoomend y se agrupa en una sola actualización; el cierre invalida callbacks pendientes. Se volvieron a verificar las 117 vistas incluyendo todos los marcadores dentro de sus límites. La versión de proveedor solo normaliza finales de línea a LF. Detector: 113 avisos informativos y el borde de la leyenda de ruta; revisión independiente final PASS.

Producción Leaflet: commit funcional 7ec7acc, deployment dpl_FLuvbibt56XwFQ3iD7Mi8axvxsjU READY, alias https://atlas-ga-lima.vercel.app. Diez archivos comprobados HTTP200 y byte-idénticos; .env, caché y lector de credenciales404. Navegador confirma Leaflet1.9.4, teselas reales,20marcadoresLima, zoom/encuadre, popupMNAAHP y Escape sin errores. Estambul conserva12marcadores,11tramos y tabla comparativa; ningún marcador cortado. No hay llamadas aORS desde el visor.
