# Guion detallado · Atlas GA

Algoritmo genético para planificar itinerarios turísticos, basado en Şehab y Turan (2024), su port a Python y el PDF de guion entregado por el equipo.

## Reparto para tres personas

El bloque de cada persona reúne discurso, fórmulas, demostración y precauciones. El reparto se equilibra por extensión y dificultad, no solo por cantidad de diapositivas. Glosario y preguntas son material de consulta compartido, fuera del tiempo asignado a cada bloque.

La carga cuenta palabras de texto, excluyendo fórmulas. El cálculo de lectura usa 130 palabras por minuto; sirve para ensayar, no para fijar la duración total de la exposición.

{{PRESENTER_LOAD}}

En cada paso, **En pantalla** indica qué señalar; **Decir** propone el discurso; **Fórmula y ejemplo** desarrolla el razonamiento; **Cuidado** delimita lo que puede afirmarse. Ensayen también las transiciones entre personas. Los tiempos de lectura son orientativos: las demostraciones y las preguntas requieren tiempo adicional.

El PDF menciona pestañas de una rama local —Suma de celdas, Costo, Paper vs port y Demo numérica—. Sus explicaciones se incorporan aquí como ejemplos de apoyo. Las indicaciones “En pantalla” corresponden a los controles de la web publicada; no dependen de tener esas pestañas adicionales.

## Glosario para preparar la exposición

| Término | Significado en este trabajo |
|---|---|
| Destino o lugar | Un museo con coordenadas fijas. |
| Itinerario o ruta | Orden de visita \(I=(i_1,\ldots,i_n)\). |
| Ruta abierta | No vuelve al inicio: tiene \(n-1\) traslados. |
| Permutación | Cada destino aparece exactamente una vez. |
| Tramo \(i\to j\) | Traslado entre dos destinos; importa el sentido. |
| Matrices \(D,T,C\) | Fila = origen, columna = destino; kilómetros, minutos y costo local. |
| Asimetría | Puede cumplirse \(D_{ij}\ne D_{ji}\); se guardan ambas direcciones. |
| Diagonal | \(D_{ii}=T_{ii}=C_{ii}=0\): no hay traslado. |
| Presupuesto \(B\) | Dinero disponible para los traslados modelados. |
| Normalizar | Escalar entradas: \(\widehat D_{ij}=D_{ij}/D_{\max}\), con diagonal cero. |
| Fitness \(F\) | Calificación de una ruta; mayor es preferible dentro del mismo caso. |
| Algoritmo genético (GA) | Búsqueda que mantiene, selecciona y modifica una población de candidatos. |
| Gen e individuo | Gen = ID de un destino; individuo o cromosoma = ruta completa. |
| Población y generación | Aquí, cien rutas; una generación completa selección, cruce, mutación y reemplazo. |
| Padres e hijos | Rutas seleccionadas y candidatos producidos a partir de ellas. |
| Torneo modificado | Selección entre candidatos sorteados, buscando dos planes distintos. |
| COX | Copy Order Crossover: combina orden sin duplicar ni omitir destinos. |
| Mutación y \(\mu\) | Intercambios vecinos gobernados por una matriz de indicadores. |
| Elitismo | Padres e hijos compiten y se conservan los mejores. |
| Meseta | Intervalo sin mejora del mejor fitness guardado. |
| Bing Maps | Servicio que el paper declara para adquirir distancias y tiempos. |
| ORS | openrouteservice: devuelve recorridos viales, distancia, duración y geometría. |
| OpenStreetMap y Leaflet | OSM aporta datos geográficos y teselas; Leaflet muestra el mapa. |

## Los tres casos

| Caso | Lugares e inicio | Distancia y tiempo | Costo y presupuesto | Mapa |
|---|---|---|---|---|
| Estambul · datos del paper | Doce destinos; inicio 6, Pelit | Matrices originales; el artículo declara Bing Maps | Histórico, \(B=2000\) TL | Conexiones esquemáticas |
| Estambul · ORS | Las mismas doce coordenadas | ORS automóvil; 132 pares dirigidos | Misma matriz histórica y presupuesto | Geometrías viales guardadas |
| Lima · ORS | Veinte museos; inicio 1, MALI | ORS automóvil; 380 pares dirigidos | Simulado en soles, \(B=360\) | Geometrías viales guardadas |

Paper significa artículo científico; Estambul es la ciudad del caso original. Los dos casos de Estambul usan el mismo conjunto de cien rutas iniciales. Cambiar de proveedor sustituye D/T, mientras que la evolución sigue siendo aleatoria: no atribuir toda diferencia de resultados únicamente a la fuente.
