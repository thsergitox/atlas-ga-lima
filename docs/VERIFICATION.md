# Verificación de la actualización

11 de noviembre de 2026. Sin builds locales, semillas ni un entorno de tests creado para esta tarea.

## Dos datasets

- Lima: 20 registros OSM, tres matrices 20×20, inicio 1/MALI y presupuesto didáctico 360 soles.
- Estambul: 12 registros, tres matrices 12×12 originales, inicio 6/Pelit, presupuesto 2000 TL. Los cinco .mat (incluido ind.mat) son byte a byte idénticos al port de Arbues; sus hashes están publicados. SciPy confirma que las matrices JSON coinciden exactamente y conservan la asimetría.
- Ambas poblaciones iniciales contienen 100permutaciones válidas y ambas trazas contienen 100generaciones. Cada ruta conserva el inicio y contiene todos los IDs una sola vez. Fitness recalculado coincidente y mejor histórico no decreciente.
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
