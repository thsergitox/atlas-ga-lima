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

### ¿Cómo validó el paper su fitness con la entropía de barrios?

El artículo compara ejemplos de itinerarios agrupados por barrios con otros más fragmentados. En su tabla 3 reporta entropía 2.2213 para R1–R5 y 3.5850 para R6–R10; \(\log_2 12\approx3.5850\). Lo utiliza como evidencia de relación entre fitness y agrupación en esos ejemplos, no como una demostración de optimalidad global. Nuestra corrida no incorpora una nueva función de entropía ni la usa como término adicional del fitness.

### ¿La tarifa del PDF coincide exactamente con los archivos originales?

Hay diferencias que deben separarse. El artículo escribe costo cero para \(d\le1\), pero la matriz publicada contiene costo 40 TL para tramos de 1 km. La fórmula ilustrativa da 55.20 TL para 5 km; las celdas originales de esa distancia guardan 55 TL. El algoritmo lee la matriz histórica intacta. No corregimos ni recalculamos sus celdas para hacerlas coincidir con el modelo escrito.

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
