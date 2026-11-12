# Lectura del paper y del port Python

Referencia: Şehab, M. y Turan, M. (2024). An enhanced genetic algorithm solution for itinerary recommendation considering various constraints. PeerJ Computer Science 10:e2340. DOI: https://doi.org/10.7717/peerj-cs.2340.

Fuentes inspeccionadas: PDF local de 41 páginas, port Arbues revisión e84ed98c8ecd65bf269da847ee26147f1f282d70 y código MATLAB local. No se modifican las fuentes originales.

| Paso | Evidencia | Decisión en Lima |
|---|---|---|
| Matrices | Paper pp. 8–10, ecuaciones 8–10: Bing Maps, kilómetros/minutos y modelo de tarifa de taxi. 98 destinos disponibles y caso de 12 museos. | Veinte registros OSM; versión actual con 380 recorridos ORS y D/T del mismo trazado vial. Costo simulado max(8,4+2.5D). Haversine fue el modelo preliminar, sustituido en run_lima.py por routing.dataset. |
| Cromosoma | Paper p. 10, figura 5: cada lugar una vez. initial_pop.py antepone 6 pero su permutación puede volver a incluirlo. | Se excluye el inicio de la cola antes de permutar. No se vuelve a generar ni sobrescribir ind.mat original. |
| Fitness | Paper p. 11, ec. 11: (B−C)/(D+T), con discusión de normalización; ec. 12: min-max global. Fitness.py implementa ((B−C)/B)/sum(D_hat+T_hat). | Se muestra y ejecuta la fórmula del código, y se explica la diferencia con la expresión del artículo. |
| Selección | Paper pp. 16–17; GA.py: torneo del 20 %, dos mejores y búsqueda adicional de planes distintos. | N=100, torneo=20, muestreo sin reemplazo dentro de cada torneo. No se convierte a ruleta. |
| Diversificación | GA.py aumenta pMut a 0.9 cuando no encuentra un plan distinto tras buscar en torneo y población. | Se conserva el aumento persistente. La mutación de rescate puede no cambiar nada: no se garantiza diversidad. |
| Cruce | Paper pp. 17–20, tabla 5 y algoritmo 2; COX.py. | Cada extremo se reordena por separado según el otro padre. Centro propio intacto. Dos hijos y mismos cortes. |
| Mutación | Paper pp. 20–21; Mutation.py: matriz n×n y np.all en la fila. | Para veinte genes la probabilidad por swap es μ^20, dieciocho filas candidatas. Swaps vecinos secuenciales, inicio fijo. |
| Reemplazo | GA.py: SortPop(ind+indoff), conservar nRoute. | 100+100 candidatos, 100 supervivientes. Elitismo explícito, sin añadir eliminación de duplicados. |
| Resultados | El port registra bestfit, bestcost, bestdistance y besttime. | JSON producido por una ejecución Python local, no resultados reportados por el paper ni de Estambul. |

## Qué implica COX

Con p1=[1,7,2,4,3,6,5], p2=[1,5,3,2,6,4,7] y cortes de slicing a=3,b=5, los hijos son [1,2,7,4,3,5,6] y [1,3,5,2,6,7,4]. Coinciden con la tabla 5 del artículo. En el primero, [4,3] se copia sin alteraciones; [1,7,2] se ordena como [1,2,7] según p2 y [6,5] como [5,6]. No se unen ambos extremos para ordenarlos como un solo conjunto: eso sería otra operación.

## Qué implica μ^n

Cada entrada de flag es una Bernoulli de probabilidad μ, independiente. Una fila tiene n entradas y solo activa el swap si todas son verdaderas: P=μ^n. El bucle i=1,…,n−2 tiene n−2 candidatos, por lo que E[swaps]=(n−2)μ^n y P(al menos uno)=1−(1−μ^n)^(n−2).

Para Lima (n=20), hay 18 candidatos; con μ=.1, cada fila se activa con probabilidad 10^-20, y con μ=.9, con 0.1215766546. Para Estambul (n=12), hay diez candidatos y con μ=.9 la probabilidad por fila es 0.2824295365. No son probabilidades por bit: este cromosoma es una permutación.

## Alcance de las afirmaciones

Un hijo no tiene por qué superar a sus padres. Mutar no tiene por qué mejorar. La mejor aptitud histórica no decrece por el reemplazo elitista. Una meseta no prueba un óptimo global. Mantener 100 candidatos no cambia los espacios combinatorios de 19! rutas (Lima) y 11! (Estambul): se explora una muestra evolutiva de él. Optimizar este modelo no valida tiempos reales ni una jornada turística viable.

La adaptación Python conserva el orden de aplanado del port: todos los primeros hijos, luego todos los segundos. Las funciones de Lima usan listas y biblioteca estándar para que el procedimiento sea legible; los archivos COX.py y Mutation.py de referencia se conservan sin cambios en python/upstream. La selección y evaluación se verifican mediante invariantes y comparación numérica. No se fija semilla ni se ejecuta una compilación del sitio.

## Referencias de la interfaz

[Web Animations API, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API): movimiento de genes con posiciones inicial/final.

[prefers-reduced-motion, MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): alternativa inmediata para usuarios que solicitan menos movimiento.

Las rutas interpolan coordenadas con requestAnimationFrame; la duración es 850 ms con salida suave. Los puntos geográficos se mantienen fijos. Las burbujas de ID se separan mediante desplazamientos deterministas para evitar superposición, con líneas guía a las ubicaciones reales. Esas ubicaciones permanecen fijas durante los operadores. Todos los controles operan por clic y teclado; no se navega automáticamente a otra diapositiva.


## Actualización: dos casos y código completo

Lima pasa a veinte museos. El modo Paper importa exactamente las matrices y coordenadas originales de Estambul (12 destinos) y la población ind.mat; se han verificado byte a byte y contra sus JSON. La normalización usa estas matrices con diagonal cero. Sus entradas dirigidas se conservan. Presupuesto 2000 TL e inicio 6; nueva corrida del ciclo S6, no reproducción atribuida de la tabla 7. Para n=20, la mutación activa cada fila con μ^20 y hay 18 candidatos; para n=12, μ^12 y diez candidatos. Las fórmulas y unidades visibles dependen del caso.

La diapositiva Código completo se coloca después de Resultado y antes de Fuentes. Su archivo algorithm.py se genera mediante inspect.getsource desde las funciones ejecutadas por ambos exportadores. Incluye todas las funciones y el punto de entrada. Copiar/descargar y saltar a funciones no altera el dataset; la descarga del JSON usa el caso activo.
