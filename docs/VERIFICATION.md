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
