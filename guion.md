# Guion detallado · Atlas GA

Algoritmo genético para planificar itinerarios turísticos, basado en Şehab y Turan (2024), su port a Python y el PDF de guion entregado por el equipo.

## Reparto para tres personas

El bloque de cada persona reúne discurso, fórmulas, demostración y precauciones. El reparto se equilibra por extensión y dificultad, no solo por cantidad de diapositivas. Glosario y preguntas son material de consulta compartido, fuera del tiempo asignado a cada bloque.

La carga cuenta palabras de texto, excluyendo fórmulas. El cálculo de lectura usa 130 palabras por minuto; sirve para ensayar, no para fijar la duración total de la exposición.

| Persona | Diapositivas | Texto del bloque | Lectura orientativa |
|---|---|---|---|
| Persona 1 | 1–4 | 897 palabras | 6.9 min |
| Persona 2 | 5–7 | 901 palabras | 6.9 min |
| Persona 3 | 8–13 | 908 palabras | 7.0 min |

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


## Persona 2 · Fitness, selección y cruzamiento

**Responsabilidad:** explicar cómo se comparan y combinan los candidatos. Diapositivas 5–7. Este bloque tiene menos slides porque concentra la normalización, la función objetivo y el ejemplo de COX.

### Diapositiva 5 · Fitness

**En pantalla.** Fórmula, fragmento de Fitness.py, cromosoma, métricas y control de presupuesto. Mostrar Estambul original; mover B después de explicar el ejemplo guardado.

**Decir.** “La evaluación combina distancia, tiempo y dinero disponible. Primero sumamos los tramos de la ruta. Para combinar kilómetros y minutos, normalizamos cada entrada por el máximo global de su matriz. En el numerador usamos la fracción del presupuesto que queda. Mayor fitness es preferible dentro del mismo caso.”

**Fórmula y ejemplo.** La diagonal cero hace equivalente la normalización min-max a dividir por el máximo:

\[
\widehat D_{ij}=\frac{D_{ij}}{D_{\max}},\qquad
\widehat T_{ij}=\frac{T_{ij}}{T_{\max}}.
\]

La fórmula ejecutada por Python es:

\[
F(I)=\frac{(B-C(I))/B}{
\displaystyle\sum_{k=1}^{n-1}\left(\widehat D_{i_k,i_{k+1}}+\widehat T_{i_k,i_{k+1}}\right)}
=\frac{(B-C(I))/B}{D(I)/D_{\max}+T(I)/T_{\max}}.
\]

“Los máximos pertenecen a toda la matriz, no a cada ruta. Cada entrada normalizada queda entre cero y uno; sumar once tramos puede superar uno. El fitness completo tampoco tiene garantizado ese intervalo y no expresa kilómetros ni un porcentaje de satisfacción.”

Para la mejor ruta inicial de Estambul original, \(D=115\), \(T=204\), \(C=1126\), \(B=2000\), \(D_{\max}=55\) y \(T_{\max}=52\):

\[
F=\frac{(2000-1126)/2000}{115/55+204/52}
=\frac{0.437}{2.091+3.923}\approx0.0727.
\]

La mejor final guardada tiene \(D=87\), \(T=149\) y \(C=854\):

\[
F=\frac{0.573}{87/55+149/52}\approx0.1288.
\]

**Apoyo numérico del PDF.** Estos valores son inventados para aislar efectos, no otra ruta observada. Con \(B=2000\), suma normalizada de distancia 4 y de tiempo 5:

| Cambio | Cálculo | Fitness | Interpretación |
|---|---|---|---|
| Base, \(C=800\) | \(0.6/9\) | 0.0667 | Referencia |
| Costo sube a 1200 | \(0.4/9\) | 0.0444 | Menor margen de presupuesto |
| Distancia normalizada baja a 2 | \(0.6/7\) | 0.0857 | Mejora en régimen factible |
| Costo sube a 2500 | \(-0.25/9\) | −0.0278 | Presupuesto excedido |

**Cuidado importante.** Si \(C>B\), el numerador es negativo. Manteniendo ese costo, aumentar el denominador acerca F a cero: \(-0.25/10=-0.025>-0.0278\). Por ello, decir que reducir distancia siempre aumenta el fitness necesita el supuesto de margen positivo. Si el costo también cambia con la distancia, se debe evaluar la expresión completa. En Lima la mejor inicial cuesta unos 367.2 soles con \(B=360\), por lo que su fitness empieza negativo.

El presupuesto funciona como penalización suave: no se descartan automáticamente rutas que lo exceden. La ecuación 11 del paper muestra \((B-C)/(D+T)\) y discute normalización; el port ejecuta el margen relativo \((B-C)/B\) con D/T normalizadas y C histórica o simulada. Explicamos el programa que realmente se ejecuta y hacemos explícita la diferencia con la expresión del artículo.

**Demostración.** Mover el presupuesto. La distancia y las calles siguen iguales; solo cambia la calificación. Para ilustrar los cuatro casos numéricos se puede usar esta tabla del guion, sin depender de una pestaña adicional.

### Diapositiva 6 · Selección por torneo modificado

**En pantalla.** Veinte candidatos entre cien rutas, barras de fitness y Sortear otro torneo. Las barras se reescalan para admitir valores negativos.

**Decir.** “Sorteamos veinte candidatos sin reemplazo dentro del torneo y los ordenamos por fitness. El mejor es el primer padre. Para el segundo buscamos un plan diferente: primero entre los demás candidatos y luego en toda la población. Lo importante es que no se trata de una ruleta proporcional.”

\[
k=\lfloor0.2N\rfloor=20,\qquad
p_1=\operatorname*{arg\,max}_{x\in S}F(x),\quad |S|=20.
\]

**Cuidado.** Si no aparece un plan distinto, el código intenta una mutación de rescate con \(\mu=0.9\) y conserva ese valor en el resto de la corrida. No garantiza diversidad: el rescate puede no cambiar la ruta. Que el sorteo sea sin reemplazo dentro de un torneo no impide que un padre vuelva a participar en otro torneo.

**Cómo leer la demostración.** Sortear otro torneo cambia los candidatos, no las matrices del problema. Comparar la cifra escrita junto a cada barra y señalar los padres elegidos. Una barra larga representa mayor fitness relativo entre los candidatos mostrados; su longitud reescalada no es una probabilidad de selección. Tampoco indica la proporción de museos visitados. Todos los individuos siguen conteniendo los mismos destinos.

### Diapositiva 7 · Copy Order Crossover

**En pantalla.** Dos padres, controles de cortes, Aplicar COX y alternancia entre Hijo 1/Hijo 2. Señalar el centro conservado y el mapa del hijo elegido.

**Decir.** “COX produce dos hijos usando los mismos dos cortes. Cada hijo conserva el centro de su propio padre. Sus extremos se reordenan, por separado, según la posición de sus genes en el otro padre. Se conservan los destinos y se evita el problema de duplicar u omitir lugares.”

Con cortes \(a,b\), el centro corresponde a los índices \(a,\ldots,b-1\) de Python:

\[
h_1=\operatorname{ord}_{p_2}(L_1)\,\Vert\,M_1\,\Vert\,\operatorname{ord}_{p_2}(R_1),
\qquad
h_2=\operatorname{ord}_{p_1}(L_2)\,\Vert\,M_2\,\Vert\,\operatorname{ord}_{p_1}(R_2).
\]

Para \(a=3,b=5\), padres [1,7,2,4,3,6,5] y [1,5,3,2,6,4,7]:

| Hijo | Izquierda reordenada | Centro propio | Derecha reordenada | Resultado |
|---|---|---|---|---|
| 1 | [1,2,7] | [4,3] | [5,6] | [1,2,7,4,3,5,6] |
| 2 | [1,3,5] | [2,6] | [7,4] | [1,3,5,2,6,7,4] |

**Recorrer el primer hijo.** El centro propio es [4,3] y se copia intacto. El extremo izquierdo contiene [1,7,2]; buscar esos tres IDs en el segundo padre da el orden [1,2,7]. El extremo derecho conserva sus IDs [6,5], pero allí 5 aparece antes que 6, de modo que queda [5,6]. Concatenar los tres bloques produce el hijo de la tabla. Para el segundo hijo se intercambian los papeles de los padres y se mantienen los mismos cortes. Revisar que ambos tengan siete genes y cada ID aparezca una sola vez.

**Cuidado.** No se mezclan los dos extremos en un único conjunto ni se trata de cruzamiento binario de un punto. Los hijos pueden mejorar, empeorar o empatar: COX genera candidatos y el fitness los evalúa.

**Transición.** “Ya podemos elegir padres y obtener dos hijos válidos. Falta observar cómo mutan, quiénes sobreviven y qué permiten concluir los resultados.”


## Persona 3 · Mutación, evolución y resultados

**Responsabilidad:** completar el ciclo, demostrar cambios de ruta y cerrar con evidencia y límites. Diapositivas 8–13. Hay más slides porque varias son breves; el tiempo se concentra en mutación y comparación.

### Diapositiva 8 · Mutación

**En pantalla.** Ver matriz, selector de \(\mu\), probabilidad de activar una fila y Siguiente intercambio. Relacionar los genes intercambiados con los tramos de colores; las conexiones anteriores quedan grises discontinuas.

**Decir.** “Se sortea una matriz de indicadores de tamaño n por n. Cada celda es verdadera con probabilidad μ. Un intercambio de destinos vecinos se activa solo cuando toda la fila es verdadera. El primer gen queda fijo; los museos conservan sus coordenadas. Lo que cambia es el orden, y con él las conexiones.”

**Fórmula y ejemplo.** Por independencia de los indicadores:

\[
P(\mathrm{swap\ en\ fila}\ i)=\mu^n,\qquad
\mathbb E[S]=(n-2)\mu^n.
\]

| Caso | Con \(\mu=0.9\), probabilidad por fila | Con \(\mu=0.1\) |
|---|---|---|
| Estambul, \(n=12\) | \(0.9^{12}\approx28.24\,\%\) | \(10^{-12}\) |
| Lima, \(n=20\) | \(0.9^{20}\approx12.16\,\%\) | \(10^{-20}\) |

Hay diez filas candidatas en Estambul y dieciocho en Lima. Los swaps se aplican secuencialmente y pueden compartir genes. El número esperado de intercambios no es un conteo garantizado en cada sorteo.

**Demostración.** Avanzar un intercambio guardado. Señalar qué par desaparece y cuál se incorpora. Cada tramo activo tiene un color único; los tramos compartidos conservan su color entre estados consecutivos. Al pasar por una línea se identifica su origen y destino. El color ayuda a seguirla, pero no indica un fitness mejor o peor.

**Cuidado.** μ = 0.9 no significa 90 % de swaps por gen. Con μ = 0.1 la mutación casi nunca actúa para estos tamaños: es una particularidad del código revisado. Un sorteo sin filas activas deja la ruta intacta; no se fabrica un cambio para la animación.

### Diapositiva 9 · Reemplazo

**En pantalla.** Cien padres más cien hijos, doscientos candidatos y cien supervivientes.

**Decir.** “En cada generación, cincuenta parejas producen cien hijos, que después se mutan. Se unen a los cien padres, se ordenan los doscientos por fitness y se conservan los cien mejores. Esto es elitismo: el mejor padre puede sobrevivir aunque ningún hijo lo supere.”

\[
P_{t+1}=\operatorname{Top}_{100}(P_t\uplus O_t),\qquad f^*_{t+1}\ge f^*_t.
\]

El símbolo de unión con multiplicidad recuerda que el código concatena listas y permite duplicados. **Cuidado:** conservar la mejor aptitud no conserva necesariamente diversidad ni demuestra un óptimo global.

### Diapositiva 10 · Evolución

**En pantalla.** Gráfica, reproducción y selector de generación. El mapa y las métricas corresponden a la ruta guardada de ese paso.

**Decir.** “Recorremos una ejecución Python real que ya está guardada. En Estambul original, el mejor fitness pasa aproximadamente de 0.073 a 0.129 y llega pronto a una meseta. Eso indica ausencia de mejoras encontradas durante esos pasos, no que hayamos probado todas las rutas.”

\[
f_t^*=\max_{0\le s\le t}\;\max_{x\in P_s}F(x).
\]

**Cuidado.** La curva no se inventa en JavaScript ni representa entrenamiento de una red neuronal. La no disminución se explica por el reemplazo elitista. Las demostraciones interactivas de operadores pueden producir ejemplos distintos de la corrida guardada.

### Diapositiva 11 · Resultado y comparación

**En pantalla.** Mejor inicial/Mejor encontrada. En Estambul ORS, abrir Paper vs ORS y señalar la nota que evalúa ambas rutas bajo las mismas matrices.

**Decir.** “Primero comparamos el mejor individuo inicial con el mejor encontrado en cada corrida, usando sus propios datos. La inicial de Lima excede el presupuesto y tiene fitness negativo. Para comparar fuentes en Estambul tomamos las dos rutas finales y las reevaluamos bajo las mismas D/T de ORS y la misma C histórica.”

| Caso, dentro de su propia corrida | Fitness inicial → final | Distancia (km) | Tiempo (min) | Costo local |
|---|---|---|---|---|
| Estambul original | 0.0727 → 0.1288 | 115 → 87 | 204 → 149 | 1126 → 854 TL |
| Estambul ORS | 0.0792 → 0.1459 | 112.0 → 82.0 | 149.7 → 108.5 | 1126 → 829 TL históricos |
| Lima ORS | −0.0016 → 0.0275 | 116.1 → 75.0 | 189.0 → 139.0 | 367.2 → 273.2 soles simulados |

**Comparación común.** La ruta encontrada con datos originales mide 83.34 km y 111.94 min al evaluarla con ORS; la encontrada con ORS mide 81.98 km y 108.51 min. Sus costos históricos son 854 y 829 TL. Estas cifras describen dos rutas guardadas.

**Cuidado.** Son corridas aleatorias con fechas y proveedores diferentes. No prueban que ORS sea mejor, que cambiar la fuente cause la mejora ni que se alcanzó el óptimo. Tampoco se comparan directamente los fitness de Lima y Estambul, porque difieren tamaño, moneda, presupuesto y normalizadores. Para investigar superioridad harían falta repeticiones controladas y análisis de variabilidad.

### Diapositiva 12 · Código completo

**En pantalla.** Secciones Fitness/Población/COX/Mutación/Torneo/Ciclo, copia del código, descarga Python y datos del caso.

**Decir.** “El archivo contiene evaluate, initial_population, tournament, crossover, mutate y execute. Podemos relacionar cada función con una diapositiva. Se ejecuta con `python3 algorithm.py experiment.json` usando biblioteca estándar. Los datos y la población inicial provienen del JSON seleccionado.”

**Cuidado.** No fijamos semilla: una ejecución nueva puede hallar otra ruta. Reproducir una traza guardada y repetir exactamente los resultados de una corrida nueva son afirmaciones diferentes.

### Diapositiva 13 · Fuentes y límites

**En pantalla.** Artículo, repositorio original, port Python, procedencia y descargas CSV/GeoJSON/JSON.

**Decir.** “Nuestro aporte es una implementación explicable y una adaptación de datos. Conectamos el artículo y su código con matrices verificables, geometrías y demostraciones. Los operadores y el planteamiento se atribuyen a sus autores. Conservamos el caso original para distinguirlo de nuestras nuevas adquisiciones.”

**Cierre.** “El tiempo de traslado no incluye visitas; el costo de Lima es simulado y el de Estambul es histórico. Presentamos una mejor solución encontrada, con sus supuestos y limitaciones, y no una garantía de la mejor jornada turística posible.”


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
