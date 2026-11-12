# Rutas de openrouteservice para veinte museos

Implementación autorizada el12de noviembre de2026. Sustituye la propuesta Google del documento anterior. El usuario confirmó que son los20 museos existentes y configuró ORS_API_KEY en `.env`.

## Diseño

Adquisición local única, reanudable, con petición GeoJSON por cada par dirigido.20×19=380 consultas Directions, dentro de2000/día y40/min del plan Standard verificado. Pausa2s entre solicitudes; no llamadas durante la exposición. Clave local excluida de Git y Vercel. Sin nuevo backend, dependencias, builds ni semillas.

Los resultados ORS se guardan bajo CC BY-SA4.0, con atribución y metadatos. D enkm yT enmin de la misma respuesta que dibuja cada geometría. C=max(8,4+2.5D) soles por tramo fuera de diagonal sigue siendo una hipótesis; todas las conexiones se modelan en automóvil, sin tráfico en vivo. Se mantiene el presupuesto didáctico B=360 y se señala cualquier fitness negativo, sin manipular el algoritmo.

El foco visual son los tramos de calle que cambian: desaparecen los retirados, se dibujan los nuevos y permanecen los compartidos. Los museos no se desplazan. Azul para actual, gris discontinuo para anterior, oro para cambio. Una transición de850ms, con estado inmediato al reducir movimiento; sin interpolación de vértices a través de edificios. Papel/Estambul conserva sus datos y rectas esquemáticas, con etiqueta explícita.

## Tareas y verificación

- [x] Adquisición: `python/routing/{credentials,client,collection}.py`, `python/fetch_routes.py`; piloto,380 pares, caché ignorada, errores sin ceros, reanudación sin repetir.
- [x] Dataset y GA: `python/routing/dataset.py`, `python/run_lima.py`; matrices20×20, geometrías dirigidas, unidades, diagonal0,100permutaciones/100 generaciones y fitness coherente.
- [x] Mapa: `src/map/route-geometry.js`, `route-layers.js`, `route-map.js`; trazados ORS, transiciones por arista, inspección de un par, cancelación y movimiento reducido.
- [x] Explicación: casos, lecciones, fuentes, atribución y descargas de matriz/GeoJSON; distinguir Bing del paper, ORS y costos simulados.
- [x] Verificación de sintaxis y cálculos puntuales, navegador en escritorio/móvil, ambos casos y operadores; revisión independiente y despliegue Vercel CLI.

No crear suites de pruebas o entornos por defecto. Preservar originales y la aproximación previa en una carpeta histórica sin clave. La comprobación de red debe confirmar cero consultas a ORS desde la web publicada.

Fuentes: https://account.heigit.org/info/plans ; https://account.heigit.org/info/tos ; https://giscience.github.io/openrouteservice/api-reference/endpoints/directions/requests-and-return-types .

Implementación y verificación completadas. Publicado y comprobado en https://atlas-ga-lima.vercel.app. Evidencia final en docs/VERIFICATION.md.
