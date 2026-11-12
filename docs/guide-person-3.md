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
