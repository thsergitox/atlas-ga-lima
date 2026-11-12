# Qué hicimos y cómo explicarlo

Guion de apoyo para presentar Atlas GA. Primero puede leerse el recorrido de las diapositivas; después, estudiar las preguntas. Las cifras corresponden a los archivos distribuidos con esta web. Otra ejecución aleatoria puede producir otros resultados.

## La explicación en un minuto

“Estudiamos el algoritmo genético de itinerarios de Şehab y Turan y su port a Python. Construimos una presentación que conecta cada operación del código con sus fórmulas, cromosomas y cambios de recorrido. El algoritmo decide el orden de visita de un conjunto fijo de lugares, considerando distancia, tiempo y costo respecto de un presupuesto.

Trabajamos con tres casos. Conservamos los datos originales de doce destinos de Estambul; después consultamos openrouteservice para obtener nuevas distancias, tiempos y geometrías sobre esas mismas coordenadas. Además, adaptamos el procedimiento a veinte museos de Lima. Así podemos explicar la metodología original y mostrar cómo cambia la evaluación cuando cambia la fuente de datos. Las corridas están guardadas para exponerlas; no presentamos sus resultados como los publicados por los autores ni como una garantía de óptimo global.”

## Qué significa cada caso

| Caso en el selector | Lugares e inicio | Distancia y tiempo | Costo y presupuesto | Qué muestra el mapa |
|---|---|---|---|---|
| Lima · ORS (20 museos) | Veinte museos; inicio 1, MALI | Recorridos de openrouteservice (ORS), perfil automóvil | Costo simulado en soles; B = 360 | Polilíneas viales guardadas de ORS |
| Estambul · datos del paper (12) | Coordenadas originales; inicio 6, Pelit | Matrices originales del repositorio | Matriz histórica en liras turcas; B = 2000 | Conexiones esquemáticas entre los puntos |
| Estambul · ORS (12) | Las mismas doce coordenadas e inicio | Nuevas D/T de ORS, perfil automóvil | La misma matriz histórica y B = 2000 | Polilíneas viales guardadas de ORS |

**Paper significa artículo científico; Estambul es la ciudad del estudio.** No son dos algoritmos diferentes. Los dos casos de Estambul permiten contrastar fuentes de datos conservando coordenadas, inicio, presupuesto y las cien rutas iniciales. En ambos se hizo una nueva ejecución Python del ciclo equivalente al escenario S6.

El paper indica Bing Maps API y Excel/Visual Basic como procedimiento de obtención de sus matrices, en la sección de preparación de datos, página 8. En esta web, el caso original lee los archivos publicados; no hace una nueva consulta a Bing. Sus rectas en el mapa son una representación esquemática porque los archivos importados no contienen las geometrías de cada recorrido. **Una recta dibujada NO demuestra que la matriz se calculó con Haversine.** [Artículo, sección “Setting-up information matrices”](https://pmc.ncbi.nlm.nih.gov/articles/PMC11623113/).

## Guion por diapositiva

### 1. Problema: mismos museos, distinto orden

“El problema no consiste en mover los museos ni decidir dónde están. Sus coordenadas son fijas. Lo que cambia es el orden de visita. Si una ruta pasa por 1, 3 y 8, utiliza los recorridos dirigidos 1→3 y 3→8. Otro orden combina otros tramos y puede tener otra distancia, duración y costo.”

Mostrar “Comparar otra ruta”: los marcadores permanecen en su sitio y cambian las conexiones. Con veinte lugares e inicio fijo quedan 19! órdenes posibles. Mantener una población de cien individuos limita cuántos exploramos simultáneamente, pero no reduce el número matemático de soluciones posibles.

### 2. Pipeline: datos primero, optimización después

“Separamos dos trabajos. Primero preparamos los lugares, recorridos y matrices. Después el algoritmo consulta esas matrices muchas veces para evaluar rutas. No llama a una API cada vez que cruza o muta. La web añade una tercera capa: representar y explicar las operaciones.”

El flujo es: coordenadas → adquisición de recorridos → matrices D/T/C → población inicial → evaluación → selección → COX → mutación → reemplazo → repetición. Python genera la corrida y su traza; JavaScript permite explorar operadores y reproduce la evolución guardada.

### 3. Dataset y matrices

“Cada fila representa un origen y cada columna un destino. D[i,j] guarda kilómetros; T[i,j], minutos; C[i,j], costo monetario. Conservamos ambas direcciones porque ir de A a B puede diferir de volver de B a A.”

En Lima hay 20×20 = 400 celdas por matriz. La diagonal contiene veinte ceros: quedarse en el mismo lugar no necesita una consulta. Se necesitan 20×19 = **380 pares dirigidos**, no 400 consultas útiles. Estambul tiene 12×11 = **132 pares**. Cada respuesta Directions aporta distancia, duración y una geometría del mismo recorrido; esos valores alimentan las matrices y el mapa. D y T se convierten de metros a kilómetros y de segundos a minutos. No adquirimos estos archivos mediante el endpoint Matrix: construimos las matrices a partir de Directions para disponer también del trazado.

Abrir una celda y después invertir el par. La geometría se guarda como una lista de coordenadas, no como una sola recta entre museos. ORS puede ajustar el acceso al punto vial cercano; el tramo peatonal entre ese acceso y la puerta no se añade a D/T.

### 4. Población y cromosoma

“Un individuo es una permutación de los IDs: cada destino aparece una vez. El inicio está fijo, y los demás IDs cambian de orden. La población contiene cien rutas candidatas; cien individuos no significa cien museos.”

Lima genera su población inicial permutando la cola sin repetir el inicio. Los dos casos de Estambul parten del mismo conjunto de cien rutas de ind.mat. La posición del gen determina cuándo se visita el destino; su valor identifica qué destino es.

### 5. Fitness: cómo se compara una ruta

“Sumamos los valores de los tramos consecutivos para obtener D(r), T(r) y C(r). La evaluación implementada combina el margen relativo de presupuesto con la distancia y el tiempo normalizados. Un mayor fitness es preferible dentro del mismo caso y configuración.”

La fórmula ejecutada es:

`F(r) = ((B − C(r)) / B) / (D(r) / Dmáx + T(r) / Tmáx)`.

Dmáx y Tmáx son los máximos globales de las matrices correspondientes, no los máximos de cada individuo. Al tener diagonal cero, normalizar cada entrada mediante min-max equivale a dividirla por el máximo. La suma normalizada de una ruta puede superar uno: normalizar las entradas no obliga a que su suma quede entre cero y uno.

Mover B en la demostración cambia el fitness; no recalcula ni altera las calles. Si C supera B, el numerador es negativo. El código penaliza esa ruta mediante fitness negativo; no la elimina automáticamente. El artículo presenta una expresión general y trata la normalización; para defender esta implementación debemos explicar la fórmula realmente ejecutada, sin ocultar esa diferencia de presentación.

### 6. Selección: torneo modificado

“De los cien individuos se toman veinte candidatos al azar, sin reemplazo dentro del torneo. Se ordenan por fitness y se elige el mejor como primer padre. Para el segundo se busca un plan diferente, primero en los candidatos y luego en la población.”

Si no aparece uno distinto, se usa una mutación de rescate con μ = 0.9 y ese nivel se mantiene en el ciclo. Es una búsqueda de diversidad, no una garantía: la mutación también puede dejar intacta la ruta. Este procedimiento es selección por torneo modificado, no ruleta proporcional.

### 7. Cruzamiento COX

“Copy Order Crossover produce dos hijos a partir de dos padres y los mismos dos cortes. Cada hijo conserva el segmento central de su propio padre. Reordena por separado su extremo izquierdo y su extremo derecho según el orden en que esos genes aparecen en el otro padre.”

Con cortes de Python a = 3 y b = 5, el intervalo central incluye los índices 3 y 4, y excluye el 5. Para P1 = [1,7,2,4,3,6,5] y P2 = [1,5,3,2,6,4,7], los hijos son [1,2,7,4,3,5,6] y [1,3,5,2,6,7,4]. Los IDs se conservan sin duplicarlos. Un hijo puede mejorar, empeorar o empatar: el operador crea candidatos y el fitness los evalúa.

Cambiar los cortes y alternar los dos hijos. Señalar el bloque central y cómo cambia el recorrido del mapa. No confundir este COX con cruzar cadenas binarias ni con ordenar ambos extremos juntos.

### 8. Mutación y mapa

“La mutación implementada crea una matriz n×n de indicadores aleatorios. Cada entrada es verdadera con probabilidad μ. Un intercambio vecino se activa cuando TODA su fila es verdadera. Se recorren los índices 1 hasta n−2; el primer gen queda fijo.”

Por independencia, la probabilidad por fila es `μ^n`. Hay n−2 intercambios candidatos, de modo que el número esperado de swaps es `(n−2)μ^n`. Para Lima con μ = 0.9, cada fila se activa con probabilidad aproximada 12.16 %; para Estambul, 28.24 %. No debe afirmarse “cada gen muta con 90 %”. Con μ = 0.1 y n = 20, la probabilidad por fila es 10⁻²⁰, extremadamente pequeña. Es una particularidad heredada del código revisado, no una tasa que hayamos corregido silenciosamente.

Usar la demostración con μ = 0.9 y avanzar por los swaps registrados. Cambia la secuencia de IDs y se sustituyen conexiones; los puntos geográficos no se desplazan. Algunos swaps comparten genes y se aplican secuencialmente. El mapa anima el trazado de los tramos, no una supuesta mudanza de museos.

### 9. Reemplazo

“Se producen cien descendientes. Juntamos los cien padres con los cien hijos mutados, ordenamos los doscientos candidatos y conservamos los cien mejores. Esto introduce elitismo.”

Así, el mejor fitness no empeora entre generaciones bajo la misma evaluación. No implica que todos los hijos sean buenos ni que la población siga siendo diversa. El ciclo no elimina duplicados de manera general.

### 10. Evolución

“Observamos cien generaciones de una ejecución Python real guardada. La gráfica representa el mejor individuo de cada generación; sus mesetas indican que no encontramos una mejora durante esos pasos.”

Una meseta no demuestra que alcanzamos el óptimo. Los controles de reproducción recorren esa traza; no vuelven a consultar ORS ni ejecutan una investigación estadística en el navegador. Las demostraciones interactivas de operadores sirven para entenderlos y pueden generar ejemplos distintos de la corrida guardada.

### 11. Resultado y comparación

“Comparamos el mejor individuo inicial con el mejor encontrado en esta corrida, usando las mismas matrices. En Estambul también comparamos dos rutas procedentes de corridas distintas: una optimizada con datos originales y otra con ORS. Para medirlas de forma comparable, reevaluamos ambas bajo D/T de ORS y la misma C histórica.”

En esa evaluación común, la primera mide aproximadamente **83.34 km y 111.94 min**; la segunda, **81.98 km y 108.51 min**. Son resultados descriptivos de dos rutas guardadas. No prueban que ORS sea un mejor proveedor ni que cambiar de fuente haya causado una mejora: también hay aleatoriedad y fechas distintas. Las monedas, presupuestos, cantidades de lugares y normalizadores impiden comparar directamente el fitness de Lima con el de Estambul.

### 12. Código completo

“El archivo descargable contiene la evaluación, la población, los operadores y el ciclo. El JSON aporta las matrices y la población inicial del caso. Puede ejecutarse con `python3 algorithm.py experiment.json`, sin instalar bibliotecas para ese archivo exportado.”

Relacionar las funciones con las diapositivas: evaluate, initial_population, tournament, crossover, mutate y execute. El código completo se exporta desde las funciones utilizadas en Python. No fijamos semilla; una nueva ejecución puede recorrer otros candidatos y obtener otra ruta. La traza guardada permite repetir la exposición exactamente.

### 13. Fuentes y cierre

“Nuestro aporte es una implementación explicable y una adaptación de datos: conectamos el artículo y el port Python con matrices verificables, geometrías y demostraciones visuales. Conservamos el caso original y hacemos explícitos los cambios de fuente y los supuestos. No proponemos un operador genético nuevo ni afirmamos que ya resolvimos todos los detalles de una jornada turística.”

Mostrar procedencia, CSV, GeoJSON y repositorio. Cerrar distinguiendo tiempos de traslado de tiempos de visita, costos simulados de tarifas observadas y mejor solución encontrada de óptimo demostrado.

## Preguntas para defender los datos y las distancias

### ¿El paper usa Haversine?

Para sus matrices de itinerarios de Estambul, declara Bing Maps API con Excel/Visual Basic. Haversine apareció en una versión preliminar de nuestro caso Lima; la versión actual toma D/T de ORS. La función antigua sigue en el código de apoyo, pero run_lima.py importa la construcción de matrices de `routing.dataset`, no la función Haversine. Verificar qué función se llama es más sólido que deducir el método por una recta en el mapa.

### ¿Qué diferencia hay entre Haversine, euclidiana, Manhattan y nuestra distancia?

Haversine aproxima la distancia de círculo máximo entre dos coordenadas sobre una Tierra esférica. La euclidiana mide el segmento recto en un plano; Manhattan suma desplazamientos sobre dos ejes. Ninguna de esas fórmulas, aplicada directamente a dos museos, reproduce por sí sola sentidos de circulación, accesos o restricciones de una ciudad.

Aquí usamos **la longitud del recorrido vial devuelto por ORS con perfil automóvil**. Se interpreta como distancia de una ruta sobre una red de calles. No debemos llamarla “distancia Manhattan” por contener giros ni “euclidiana” por estar dibujada en un mapa. Tampoco afirmamos que sea el camino de menor kilometraje entre todos los posibles: es la ruta entregada bajo la configuración del proveedor.

### ¿El servicio se llama OpenRouteMap, OpenRouter u OpenStreetMap?

En este proyecto, el enrutamiento lo hace **openrouteservice (ORS)**. OpenStreetMap es la fuente geográfica de la red y las teselas del fondo. Leaflet es la biblioteca que permite ver e interactuar con el mapa. OpenRouter no interviene. Distinguir esas funciones evita atribuir una matriz a la biblioteca que solo la dibuja.

### ¿Usamos la misma metodología que los autores?

Conservamos el flujo y los operadores del ciclo equivalente a S6: cien individuos, cien generaciones, torneo modificado, COX, mutación y reemplazo elitista. Conservamos además los datos publicados en un caso independiente. Al usar ORS sustituimos el proveedor de D/T; en Lima cambiamos lugares, tamaño, presupuesto y modelo de costo. Es una adaptación y una nueva ejecución del procedimiento, no una reproducción numérica íntegra de todos los experimentos del artículo.

### ¿Por qué hay dos casos de Estambul?

Uno permite estudiar el algoritmo con las matrices originales. El otro muestra la misma selección de lugares con D/T y geometrías adquiridas mediante ORS. Conservar el primero evita sobrescribir la referencia y permite distinguir qué cambió. Una línea esquemática del caso original no significa distancia recta en su matriz.

### ¿La matriz debe ser simétrica?

No imponemos simetría. Calles de un solo sentido y accesos pueden producir A→B diferente de B→A. Por eso adquirimos todos los pares dirigidos y no copiamos el triángulo superior al inferior. La diagonal se fija en cero. Para calcular una ruta se respeta siempre el orden fila-origen, columna-destino.

### ¿Por qué 380 consultas y no 400? ¿Se repiten al mutar?

Hay 400 celdas, pero veinte son diagonales y quedan en cero. Los 380 pares restantes se adquieren durante la preparación del dataset. Una respuesta aporta D, T y geometría; no son tres consultas por par. Estambul añade 132 pares. Reintentos o pilotos de adquisición pueden incrementar el consumo total: el número de pares únicos no pretende ser un registro de facturación. Durante la exposición no hay nuevas llamadas de enrutamiento; cargar teselas del mapa es otro tipo de solicitud.

### ¿Tiempo, distancia y dibujo corresponden al mismo camino?

Sí: tomamos distancia y duración del resumen de la misma respuesta Directions cuya LineString guardamos. Después construimos D/T con esas propiedades. No usamos el kilometraje de una ruta y la geometría de otra. Las polilíneas no son posiciones GPS observadas de un viaje: son el recorrido calculado por el servicio.

### ¿Por qué una ruta empieza algo alejada del museo?

La coordenada del lugar puede estar dentro de un edificio, parque o predio sin acceso directo para automóviles. El motor encuentra una vía accesible cercana. Publicamos esa separación en la procedencia y la ficha. En Estambul el mayor acceso guardado ronda 354.8 m; se permitió un radio de búsqueda de hasta 1000 m. Esa distancia de acceso no se suma a los tiempos ni kilómetros de traslado, y debe mencionarse como limitación.

### ¿ORS también devuelve el precio del taxi?

No en nuestra adquisición. Para Lima usamos por tramo fuera de la diagonal `C = max(8, 4 + 2.5D)` soles: es una hipótesis didáctica, no una tarifa comercial. En Estambul ORS conservamos Travel_Costs.mat para aislar el cambio de D/T. Por eso su costo es histórico y no se recalcula desde la nueva distancia. El paper describe un modelo de taxi basado en distancia y cargos de su época; no debemos presentarlo como tarifa vigente.

### ¿Los tiempos incluyen tráfico, visitas, entradas y horarios?

No. Son estimaciones de traslado del perfil automóvil, sin tráfico en vivo en este dataset. No agregamos estacionamiento, accesos peatonales, tiempo dentro del museo, colas ni horarios de apertura. Visitar veinte museos en una jornada no queda validado por optimizar sus traslados.

## Preguntas para defender el algoritmo y los resultados

### ¿ORS ya optimiza todo el tour? ¿Para qué sirve el genético?

ORS resuelve cada tramo entre un origen y un destino. Nuestro algoritmo genético decide el orden completo de visita usando los pesos de esos tramos. Son dos niveles: recorrido vial entre pares y combinación global de los destinos. No usamos el endpoint Optimization de ORS para sustituir el ciclo genético.

### ¿Es exactamente el problema clásico del viajante?

Comparte la representación por permutación y la visita única de cada destino. Esta implementación evalúa una **ruta abierta**, suma n−1 tramos y no agrega retorno al inicio. Además combina distancia, tiempo y costo relativo al presupuesto. Añadir el regreso requeriría cambiar y verificar la evaluación y su visualización; no basta con dibujar una línea más. El artículo también presenta una formulación mediante restricciones de entrada/salida: al exponer diferenciamos esa formulación general del código abierto efectivamente ejecutado.

### ¿El algoritmo elige cuáles museos visitar?

No en esta implementación. Visita todos los lugares del caso una vez y optimiza el orden. Seleccionar un subconjunto, premiar preferencias o respetar ventanas horarias requeriría otra representación, evaluación o restricciones.

### ¿El presupuesto se respeta obligatoriamente?

El código no contiene un filtro de factibilidad que descarte C > B. Esa situación produce fitness negativo y empeora la evaluación. Se debe comprobar el costo de la ruta devuelta antes de afirmar que es viable. Decir “penaliza exceder el presupuesto” describe el programa con más precisión que “garantiza el presupuesto”.

### ¿Un fitness mayor siempre significa menos kilómetros?

No necesariamente. Es una función escalar que combina tres aspectos; una ruta puede compensar mayor distancia con menos tiempo o menor costo. No calculamos un frente de Pareto. La comparación directa de fitness exige el mismo presupuesto, matrices y normalizadores; no se mezclan valores de distintos casos.

### ¿Por qué no probamos todas las rutas?

Con veinte destinos e inicio fijo hay 19! órdenes. La búsqueda exhaustiva crece factorialmente. El genético explora candidatos mediante selección y variación; sacrifica la garantía de enumerar todo a cambio de una búsqueda acotada. Cien generaciones no garantizan encontrar la mejor ruta existente. Para un caso pequeño podría contrastarse con un método exacto, pero esa validación no se ha incorporado a esta exposición.

### ¿Por qué COX y no cruzamiento de un punto normal?

Un corte simple que concatena partes de permutaciones puede repetir y omitir destinos. COX reordena genes existentes de cada padre y conserva una permutación válida. Lo usamos para estudiar el operador propuesto en el trabajo y el port, no porque esta demostración pruebe que supera a todos los demás operadores.

### ¿Por qué a veces no pasa nada al mutar?

Porque se requieren n indicadores verdaderos en una fila; la probabilidad es μ^n. Incluso μ = 0.9 no garantiza un swap. La demostración permite inspeccionar los indicadores y los pasos efectivos. No debemos fabricar un cambio para aparentar que el operador siempre actúa.

### ¿La gráfica que siempre mejora demuestra aprendizaje u óptimo?

El mejor fitness no decrece por el reemplazo elitista: los padres compiten con los hijos y los mejores se conservan. Es optimización evolutiva; no entrenamos una red neuronal. La gráfica muestra progreso de esa corrida, no una prueba de óptimo ni evidencia estadística de superioridad.

### ¿Podemos decir que nuestra versión mejoró el paper?

Podemos afirmar que añadimos explicación visual, una adaptación a Lima y recorridos ORS verificables. Las cifras guardadas permiten describir diferencias entre rutas. Para sostener superioridad del algoritmo o del proveedor harían falta corridas repetidas, condiciones controladas, criterios comunes y análisis de variabilidad. Dos ejecuciones aleatorias con distintas fuentes no bastan.

### ¿Cómo se haría una comparación más rigurosa?

Mantener constantes lugares, población inicial, presupuesto y costo; medir ambas rutas con matrices comunes; repetir las corridas; reportar mejor, promedio, dispersión y tiempo de ejecución; contrastar con una referencia exacta cuando sea viable. Para estudiar solo el efecto de D/T habría que controlar también la aleatoriedad experimental. Eso es una propuesta de evaluación futura, no un resultado realizado aquí.

### ¿Qué parte es original de nuestro trabajo?

La presentación, el vínculo entre código y visualización, el dataset adaptado de Lima, la adquisición y validación de geometrías y la comparación de fuentes. Los operadores y la idea del modelo se atribuyen al paper y al port Python. No adjudicamos COX, el torneo modificado ni la función objetivo como invenciones nuestras.

### ¿Se puede reproducir? ¿Por qué cambia al volver a ejecutar?

Los CSV, JSON, GeoJSON, matrices originales y procedencia permiten inspeccionar los insumos. La traza guardada reproduce la exposición. Una ejecución nueva del genético es aleatoria y no fija semilla en este proyecto, por lo que puede variar. Reproducir la visualización guardada y obtener el mismo resultado en una nueva corrida son dos afirmaciones distintas.

## Frases que conviene corregir al exponer

| Evitar | Formulación precisa |
|---|---|
| “El paper usa Haversine porque dibuja rectas.” | “El paper declara Bing Maps; nuestro caso original no incluye las geometrías.” |
| “OpenStreetMap calcula el fitness.” | “ORS aporta D/T; Python evalúa los cromosomas; Leaflet los muestra.” |
| “Calculamos una distancia Manhattan.” | “Usamos la longitud vial del recorrido devuelto por ORS.” |
| “Las mutaciones mueven los museos.” | “Cambian el orden y las conexiones entre ubicaciones fijas.” |
| “μ = 0.9 implica 90 % de swaps.” | “Cada fila requiere n éxitos: probabilidad μ^n.” |
| “Encontramos la ruta óptima.” | “Encontramos esta mejor ruta en la corrida guardada.” |
| “Cien individuos reducen el espacio a cien soluciones.” | “Mantenemos cien candidatos simultáneos dentro del espacio original.” |
| “La nueva ruta cuesta una tarifa actual.” | “Lima usa costo simulado; Estambul conserva costos históricos.” |
| “Los tiempos demuestran que se visitan todos en un día.” | “Solo modelamos traslados; faltan visitas, accesos y horarios.” |

## Evidencia para consultar

- [Paper de Şehab y Turan (2024), texto completo](https://pmc.ncbi.nlm.nih.gov/articles/PMC11623113/): preparación de matrices, p. 8; costo, pp. 9–10; fitness y normalización, p. 11; operadores, pp. 16–21; escenario S6 en tabla 6. [DOI](https://doi.org/10.7717/peerj-cs.2340).
- [Código original MATLAB y datos](https://github.com/MuhammedSehab/GA-for-Itinerary-Planning) y [port Python de Arbues](https://github.com/Arbues/ga-itinerary-planning-pc3).
- [Directions de ORS: respuestas y unidades](https://giscience.github.io/openrouteservice/api-reference/endpoints/directions/requests-and-return-types): resumen en metros/segundos y geometría LineString en GeoJSON.
- [Repositorio de esta presentación](https://github.com/thsergitox/atlas-ga-lima): `python/routing/client.py` adquiere recorridos; `routing/dataset.py` crea matrices; `dataset.py:evaluate` evalúa; `operators.py` contiene selección/COX/mutación; `evolution.py` ejecuta el ciclo; `run_istanbul.py` reevalúa las dos rutas con matrices comunes.
- Datos descargables: [Lima](data/experiment.json), [Estambul original](data/paper/experiment.json), [Estambul ORS](data/istanbul/experiment.json); procedencia [Lima](data/provenance.json) y [Estambul ORS](data/istanbul/provenance.json).
