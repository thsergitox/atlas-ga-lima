## Persona 1 · Problema, datos y representación

**Responsabilidad:** abrir la exposición y explicar de dónde salen los insumos. Diapositivas 1–4. Usar Estambul original para los ejemplos numéricos y alternar Lima u ORS cuando se indique.

### Diapositiva 1 · El problema

**En pantalla.** Marcadores, ruta candidata, métricas y botón Comparar otra ruta. Cada tramo actual tiene un color distinto; los anteriores son grises discontinuos. Al señalar una línea aparece el par de destinos. Los colores ayudan a seguir la secuencia, no representan costos ni calidad.

**Decir.** “Estudiamos el algoritmo genético de itinerarios de Şehab y Turan y su port a Python. El algoritmo decide el orden de visita de un conjunto fijo de museos considerando distancia, tiempo y costo frente a un presupuesto. La presentación conecta código, fórmulas y cambios del recorrido. Conservamos el caso original de Estambul, adquirimos rutas ORS para las mismas coordenadas y adaptamos el procedimiento a veinte museos de Lima.”

“Los museos no se mueven. Si visitamos 6, 9 y 5, usamos los tramos 6→9 y 9→5. Otro orden combina otras conexiones. Comparar otra ruta permite observar ese cambio manteniendo los puntos geográficos fijos.”

**Fórmula y ejemplo.** Una ruta abierta suma únicamente tramos consecutivos:

\[
D(I)=\sum_{k=1}^{n-1}D_{i_k,i_{k+1}}.
\]

Con inicio fijo quedan \((n-1)!\) órdenes: \(11!=39\,916\,800\) en Estambul y \(19!\approx1.216\times10^{17}\) en Lima. Cien rutas representan aproximadamente \(0.00025\,\%\) de los órdenes de Estambul. La población es una muestra que evoluciona; el espacio combinatorio no se reduce a cien soluciones.

**Cuidado.** Se decide el orden, no un subconjunto de museos. Los tiempos son de traslado; no validan una jornada con visitas, entradas y horarios. Decir “mejor encontrada”, no “óptimo demostrado”.

### Diapositiva 2 · Paper y código

**En pantalla.** Referencia del paper, cadena Datos → Población → Fitness → Selección → COX → Mutación → Reemplazo y fragmento del ciclo.

**Decir.** “Primero preparamos matrices y geometrías. Después el algoritmo consulta esas tablas para evaluar muchas rutas. No llama a una API cada vez que cruza o muta. Python genera una corrida real y guarda su traza; la web la reproduce y permite explorar operadores por separado.”

“La configuración corresponde al ciclo equivalente a S6: cien individuos, cien generaciones, torneo modificado y COX. En cada generación se eligen padres, se crean y mutan hijos, y padres e hijos compiten para formar la siguiente población.”

**Fórmula y ejemplo.** Datos → evaluación → selección → cruce → mutación → reemplazo, repetidos cien veces. ORS resuelve los recorridos entre pares; el genético busca el orden global. Preparar datos y optimizar son trabajos distintos.

**Cuidado.** Es una adaptación de un escenario del artículo, no una réplica de todos sus experimentos. Las curvas visibles corresponden a nuevas corridas guardadas, no a la tabla de resultados publicada por los autores.

### Diapositiva 3 · Dataset y matrices

**En pantalla.** Museos/Matriz, selector de métrica, origen y destino e Invertir recorrido. Mostrar una celda y luego su dirección inversa.

**Decir.** “Fila significa origen y columna destino. D guarda kilómetros, T minutos y C costo. La ruta suma solo las celdas de sus tramos. Guardamos los dos sentidos porque calles y accesos pueden producir valores diferentes.”

“El paper declara Bing Maps con Excel/Visual Basic. Nuestra versión actual obtiene de ORS distancia, tiempo y coordenadas de un mismo recorrido. Es longitud vial del trayecto devuelto: no calculamos distancia euclidiana, Manhattan ni Haversine entre los museos.”

**Fórmula y ejemplo.** En los datos originales, \(6\to9\to5\to4\) suma \(31+4+9=44\) km. La dirección \(9\to6\) mide 32 km, frente a los 31 km de \(6\to9\).

\[
N_{\mathrm{pares}}=n(n-1),\qquad
D_{ij}=\frac{d_{ij}^{\mathrm{metros}}}{1000},\qquad
T_{ij}=\frac{t_{ij}^{\mathrm{segundos}}}{60}.
\]

Hay 144 celdas y 132 pares fuera de la diagonal en Estambul; 400 celdas y 380 pares en Lima. Las diagonales se fijan en cero sin consultar. Usamos Directions y construimos las matrices a partir de sus respuestas, conservando también las geometrías.

**Ejemplo de costo del PDF.** El artículo propone caminar si \(d\le1\) km y, para un taxi, una tarifa de apertura, una parte por kilómetro y un mínimo:

\[
C_{\mathrm{articulo}}(d)=
\begin{cases}
0,&d\le1,\\
\max(8.51d+12.65,40),&d>1.
\end{cases}
\]

La expresión da 40 TL para 2 km y 55.20 TL para 5 km. **Hay una diferencia con los archivos:** las celdas originales de 1 km cuestan 40 TL y las de 5 km, 55 TL. El PDF usa el umbral efectivo \(d<1\); al exponer distinguimos la regla escrita del artículo, la fórmula ilustrativa y los valores históricos realmente leídos. No reescribimos la matriz para forzar coincidencia.

Lima utiliza \(C_{ij}=\max(8,4+2.5D_{ij})\) soles fuera de la diagonal, como hipótesis didáctica. Estambul ORS conserva el costo histórico: ORS no nos entrega precios de taxi.

**Cuidado.** Las rectas del caso original son esquemáticas, no evidencia de Haversine. Los tiempos ORS son de automóvil sin tráfico en vivo; el acceso peatonal desde la vía al museo queda excluido.

### Diapositiva 4 · Población y cromosoma

**En pantalla.** Elegir una fila de la población y relacionar sus IDs con la ruta del mapa.

**Decir.** “Un individuo es una permutación: cada destino aparece una vez y el inicio está fijo. La población contiene cien rutas, no cien museos. El valor del gen identifica el destino y su posición indica cuándo se visita. Los dos casos de Estambul parten de las mismas cien rutas; Lima baraja la cola sin repetir el inicio.”

**Fórmula y ejemplo.** \(x=(6,\pi_2,\ldots,\pi_{12})\), con la cola una permutación de \(\{1,\ldots,12\}\setminus\{6\}\). Copiar mitades sin cuidado puede producir una ruta inválida: de [1,2,3,4] y [1,4,2,3], unir [1,2] con [2,3] genera [1,2,2,3], repite 2 y omite 4. Por eso necesitaremos operadores que conserven la validez.

**Transición.** “Ya conocemos los datos y cómo se representa una ruta. Ahora veremos cómo calificarla y elegir padres para producir candidatos nuevos.”
