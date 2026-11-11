# Verificación de la entrega

11 de noviembre de 2026. No se ejecutaron comandos de build, no se creó un entorno de pruebas ni se fijó una semilla.

## Correspondencia matemática

- 840 casos de COX: 30 pares de permutaciones y todos los 28 pares de cortes válidos para diez genes. Hijos de la adaptación Python coinciden con COX.py original, sustituyendo únicamente los sorteos de cortes para comparar el mismo caso.
- 80 casos de mutación: veinte matrices de uniformes para cada μ en {0,0.1,0.9,1}. Se suministraron los mismos uniformes a la adaptación y al Mutation.py original. Resultados idénticos, inicio fijo y permutación válida.
- El ejemplo de siete genes y cortes 3,5 coincide con ambos hijos COX de la tabla 5 del paper.
- Tres matrices 10×10, simétricas, diagonales cero.
- Cien generaciones registradas: rutas válidas, métricas recalculadas coincidentes y fitness histórico no decreciente.
- JavaScript recalcula distancia, tiempo, costo y fitness de los cien registros Python: error máximo absoluto cero.

## Navegador

Escritorio 1440×900, portátil 1280×720 y móvil de 390 px. Navegación y once diapositivas interiores comprobadas sin desborde horizontal, recortes de panel o errores de carga. Inicio revisado en todos los tamaños. Capturas inspeccionadas con mapas reales y textos asentados.

Controles comprobados: nueva ruta, nombres de museos, navegación por flechas, notas y Escape, índice, presupuesto fuera de límite, nuevo torneo, ambos hijos COX, cambios de cortes, matriz de mutación visible/oculta, siguiente intercambio, nuevo sorteo sin cambios con μ=0.1, reproducción/pausa y reinicio de evolución, generación 100, comparación inicial/final y movimiento reducido. Consola sin errores.

Correcciones de revisión independiente: restablecer «Aplicar COX» tras modificar ambos cortes, y eliminar el color por procedencia sin respaldo de los 100 supervivientes. Comprobación posterior confirmó ambas correcciones. Dictamen del revisor: ship sobre las correcciones evaluadas.

## Archivos

Once módulos JavaScript con sintaxis válida. Python analizado con ast.parse. Los operadores de referencia conservados son copias sin cambios. Detector de interfaz ejecutado una vez: cero hallazgos. Cincuenta teselas PNG incluyen origen incrustado; escaneo de procedencia: cero archivos sin origen.

Las teselas CARTO se descartaron durante desarrollo porque devolvían una imagen de requisito de API key con HTTP 200. Los PNG que se entregan son de tile.openstreetmap.org y fueron comprobados visualmente. El código y los datos originales del repositorio clonado permanecen intactos.

## Producción

Publicación por Vercel CLI en https://atlas-ga-lima.vercel.app, deployment `dpl_ArPL4fkUngvwJrCkWKoEtrsLcAyq`, estado READY. Respuesta pública HTTP 200. Verificados en la URL pública: doce diapositivas, cincuenta teselas, ausencia de errores de recursos/consola, siguiente mutación, restablecimiento COX y pantalla completa. Repositorio: https://github.com/thsergitox/atlas-ga-lima.
