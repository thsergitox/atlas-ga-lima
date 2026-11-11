const upstream = 'https://github.com/Arbues/ga-itinerary-planning-pc3/blob/e84ed98c8ecd65bf269da847ee26147f1f282d70/Turism_Istanbul/';
export const lessons = [
  {
    id: 'problema', label: 'El problema', title: 'Diez museos.\n¿En qué orden?',
    lead: 'Los mismos lugares. Miles de rutas posibles. Un algoritmo que aprende a combinarlas.',
    insight: 'Una exposición del algoritmo genético de Şehab y Turan, llevada a Lima.',
    notes: 'Abrir con una pregunta a la audiencia: si visitamos los mismos museos, ¿por qué importa el orden? Cambiar la ruta y señalar los saltos entre distritos. El mapa no mueve edificios: cambia el orden de las visitas. La primera parada es MALI. Con diez lugares y un inicio fijo hay 9! = 362 880 permutaciones. Es una ruta abierta: nueve tramos, sin retorno al inicio.'
  },
  {
    id: 'pipeline', label: 'Paper y código', title: 'Una ruta recorre\ntodo el programa.',
    lead: 'El paper plantea el problema. El código concreta sus decisiones. Lima nos permite observar cada paso.',
    insight: 'La implementación combina torneo modificado, Copy Order Crossover y mutación por intercambios vecinos.',
    source: upstream + 'GA.py#L59-L150', file: 'GA.py', lines: '59–150',
    code: 'ind = _load_initial_population()\nfor g in range(nGen):\n    # selección → COX → mutación\n    ind = SortPop(ind + indoff)\n    ind = ind[:nRoute]',
    notes: 'Artículo: An enhanced genetic algorithm solution for itinerary recommendation considering various constraints, Şehab y Turan, PeerJ Computer Science 10:e2340, 2024, DOI 10.7717/peerj-cs.2340. Las matrices del artículo parten de 98 destinos en Estambul; el caso seleccionado usa 12 museos. El port de Arbues conserva archivos MATLAB y los operadores. Esta web agrega una adaptación local de diez museos, sin presentar sus datos como resultados del artículo. Se conserva la web anterior.'
  },
  {
    id: 'dataset', label: 'Dataset', title: 'Primero los datos.\nDespués la ruta.',
    lead: 'Cada museo tiene un ID y una coordenada. De cada par construimos distancia, tiempo y costo.',
    insight: 'Coordenadas de OpenStreetMap. Distancias geodésicas y tiempos y costos de un modelo académico, sin tráfico real.',
    formula: String.raw`D_{ij}=2R\arcsin\sqrt{\sin^2\frac{\Delta\varphi}{2}+\cos\varphi_i\cos\varphi_j\sin^2\frac{\Delta\lambda}{2}}`,
    file: 'python/dataset.py', lines: 'matrices', local: 'python/dataset.py',
    code: 'for origin in places:\n    for destination in places:\n        d = haversine(origin, destination)\n        # guardar D[i][j], T[i][j], C[i][j]',
    notes: 'Se consultó Nominatim/OpenStreetMap el 11 de noviembre de 2026. Los registros conservan enlaces al objeto OSM de origen. R=6371 km. Cada matriz es 10×10 y su diagonal es cero. Diferencia respecto al paper: allí Bing Maps entrega distancias y tiempos viales; aquí Haversine entrega distancia en línea geodésica, no por calles. Para d≤1 km: caminar a 4.5 km/h y costo cero. Para d>1: tiempo=4+60d/18 minutos; costo=max(8,4+2.5d) soles simulados. Los parámetros son supuestos didácticos, no tarifas de Lima. El mapa muestra conexiones rectas entre paradas. No se modelan entradas, horarios ni duración de visitas.'
  },
  {
    id: 'poblacion', label: 'Población inicial', title: 'Un cromosoma\nes un itinerario.',
    lead: 'Un gen representa un museo. Cambiar el orden de los genes cambia las conexiones del mapa.',
    insight: 'Creamos 100 permutaciones. MALI permanece primero; los otros nueve museos aparecen exactamente una vez.',
    formula: String.raw`x=(1,\pi_2,\ldots,\pi_{10}),\quad |\Omega|=9!=362\,880`,
    file: 'python/operators.py', lines: 'initial_population', local: 'python/operators.py',
    code: 'tail = list(range(2, n + 1))\nrandom.shuffle(tail)\npopulation.append([1] + tail)',
    notes: 'Esta adaptación excluye el inicio de la cola antes de permutar. El archivo initial_pop.py del port original elige n−1 lugares entre 1…n y antepone 6: puede repetir 6 y omitir otro museo. El ind.mat distribuido sí contiene rutas válidas. La modificación de Lima es explícita, no se cambia silenciosamente el código original. Las 100 rutas son candidatas del GA; esto no reduce el espacio matemático a 100, sino el número de soluciones que se mantienen en cada generación. Pulsar un individuo y seguir su ruta.'
  },
  {
    id: 'fitness', label: 'Fitness', title: '¿Qué hace buena\na una ruta?',
    lead: 'Menor distancia y tiempo, con más presupuesto restante. Una sola aptitud permite comparar itinerarios.',
    insight: 'Se normalizan las matrices completas. El numerador es la fracción de presupuesto restante del código Python.',
    formula: String.raw`f(x)=\frac{(B-C(x))/B}{\sum_{k=1}^{9}\left(\widehat D_{x_k,x_{k+1}}+\widehat T_{x_k,x_{k+1}}\right)}`,
    source: upstream + 'Fitness.py#L24-L39', file: 'Fitness.py', lines: '24–39',
    code: 'n = TravelCost(x)\nd = 0\nfor i in range(x.size - 1):\n    d += Ndmat[x[i]-1, x[i+1]-1] \\\n       + Ntmat[x[i]-1, x[i+1]-1]\nf = ((budget - n) / budget) / d',
    notes: 'Primero explicar unidades: D en km, T en minutos, C y B en soles en Lima. Norm(A)=(A−min(A))/(max(A)−min(A)), aplicada sobre todos los elementos de cada matriz, no a cada ruta ni a cada fila. La diagonal cero hace min=0 en estas matrices. La ecuación 11 del paper se escribe (B−C)/(D+T), junto con una discusión de normalización. El código ejecutable usa (B−C)/B y suma entradas de D y T ya normalizadas; mostramos esta última versión. Si C>B, el fitness es negativo: el port no descarta automáticamente la ruta. El presupuesto es solo de traslados, no de una jornada de visitas. Cambiar B y leer el resultado sin confundir penalización con restricción dura.'
  },
  {
    id: 'seleccion', label: 'Selección', title: 'Dos buenos padres.\nDos rutas distintas.',
    lead: 'Sorteamos el 20 % de la población y ordenamos por fitness. El primer padre gana el torneo.',
    insight: 'Para el segundo padre se busca una ruta diferente; si el torneo no basta, se recorre la población.',
    formula: String.raw`k=\lfloor0.2N\rfloor=20,\quad p_1=\arg\max_{x\in S} f(x)`,
    source: upstream + 'GA.py#L95-L120', file: 'GA.py', lines: '95–120',
    code: 'tournamentSize = math.floor(nRoute * 0.2)\ntournament = np.random.permutation(nRoute)[:tournamentSize]\ncand = SortPop(c)\np1, p2 = cand[0], cand[1]\nwhile np.array_equal(p1["Plan"], p2["Plan"]):\n    # buscar otro plan en torneo y población',
    notes: 'El muestreo del torneo es sin reemplazo dentro de un torneo; un individuo puede participar en torneos posteriores. No es selección por ruleta: no se usa f/sum(f). El port toma los dos mejores de un mismo torneo y modifica la búsqueda si sus planes coinciden. Si toda la población es idéntica, intenta mutar con μ=0.9 y mantiene esa tasa para las siguientes mutaciones. Aun así, una mutación puede no cambiar nada: el mecanismo intenta diversificar y no garantiza padres distintos en ese caso extremo. La lista visible muestra los seis mejores de los veinte sorteados. El mapa sigue el padre seleccionado.'
  },
  {
    id: 'cruce', label: 'Cruce COX', title: 'Conservar el centro.\nHeredar el orden.',
    lead: 'Dos cortes separan cada padre en tres bloques. El centro se copia; cada extremo se ordena como aparece en el otro padre.',
    insight: 'Se producen DOS hijos. Los cortes son comunes, no se mezclan IDs ni se repiten museos.',
    formula: String.raw`h_1=\operatorname{ord}_{p_2}(L_1)\;\Vert\;M_1\;\Vert\;\operatorname{ord}_{p_2}(R_1)`,
    source: upstream + 'COX.py#L12-L56', file: 'COX.py', lines: '12–56',
    code: '# Equivalente legible a COX.py\nleft = sorted(p1[:a], key=p2.index)\nright = sorted(p1[b:], key=p2.index)\nh1 = left + p1[a:b] + right\nh2 = copy_order(p2, p1, a, b)',
    notes: 'Mostrar primero ambos padres. El color oro marca el bloque central que se queda en su propio hijo. Para el hijo 1, tomar los IDs del extremo izquierdo de p1 y buscarlos en p2: solo se cambia su orden, no su pertenencia. Repetir para el extremo derecho, separado del izquierdo. El hijo 2 invierte el papel de los padres. Esta operación es COX, no OX ni un cruce binario de un punto. La fórmula es notación explicativa equivalente al código, no una ecuación numerada del paper. Los cortes a,b se interpretan como índices de slicing de Python: el centro es [a:b]. El primer ID se conserva porque ambos padres parten del mismo museo. El cruce puede dar un hijo igual o peor; después hay que evaluar.'
  },
  {
    id: 'mutacion', label: 'Mutación', title: 'Un intercambio.\nOtro recorrido.',
    lead: 'Cada fila activa intercambia dos genes vecinos. Los museos permanecen donde están; las rutas cambian suavemente.',
    insight: 'El código genera una matriz 10 × 10. Solo una fila completamente verdadera activa su intercambio.',
    formula: String.raw`P(\text{swap en }i)=\mu^{10},\qquad (x_i,x_{i+1})\leftarrow(x_{i+1},x_i)`,
    source: upstream + 'Mutation.py#L4-L22', file: 'Mutation.py', lines: '4–22',
    code: 'flag = np.random.rand(n, n) < mu\nfor i in range(1, n - 1):\n    if np.all(flag[i, :] == 1):\n        x[i], x[i+1] = x[i+1], x[i]',
    notes: 'La primera posición nunca se muta. Para n=10 se comprueban i=1…8, es decir, ocho posibles swaps. La probabilidad por fila es μ^10, NO μ. Con μ=0.1 da 10^-10; con μ=0.9 da 0.3486784401. El número esperado de swaps es 8μ^10. El control arranca en μ=0.9 para hacer visible la diversificación que usa el propio port, no como tasa inicial de la corrida. Cada sorteo genera realmente 100 uniformes. Si no hay filas activas, se muestra explícitamente que no ocurrió mutación. Se recorren los intercambios en orden ascendente: un gen puede moverse más de una posición. Mostrar cada paso, comparar fitness antes/después, y explicar que mutar no implica mejorar.'
  },
  {
    id: 'reemplazo', label: 'Reemplazo', title: 'Compiten los padres\ny sus descendientes.',
    lead: 'Se evalúan los hijos, se unen ambas poblaciones y se conservan las 100 mejores rutas.',
    insight: 'Es reemplazo elitista (μ + λ). La mejor aptitud no baja porque los padres siguen siendo candidatos.',
    formula: String.raw`P_{t+1}=\operatorname{Top}_{100}(P_t\cup O_t),\quad f^*_{t+1}\geq f^*_t`,
    source: upstream + 'GA.py#L130-L150', file: 'GA.py', lines: '130–150',
    code: 'indoff[M]["Fit"] = ObjectFunction(\n    indoff[M]["Plan"], budget)\nind = SortPop(ind + indoff)\nind = ind[:nRoute]',
    notes: 'N=100 padres, pOff=1 produce 100 hijos, por lo que se ordenan 200 candidatos y se retienen 100. En la notación (μ+λ), μ es tamaño parental y NO la tasa de mutación; esta coincidencia de letras se explica para evitar confusión. La curva monótona es consecuencia del reemplazo elitista y del registro del mejor histórico, no de que cada mutación mejore. El elitismo puede reducir diversidad: es la razón de la búsqueda de padres distintos y el aumento de μ de mutación. El port no elimina duplicados de la población.'
  },
  {
    id: 'evolucion', label: 'Evolución', title: 'Cien generaciones.\nUna traza real.',
    lead: 'Avanza por una ejecución Python de la adaptación. El mapa y la curva corresponden a la misma generación.',
    insight: 'La gráfica usa valores exportados por el algoritmo; no es una curva inventada para ilustrar convergencia.',
    formula: String.raw`f^*_t=\max_{0\leq s\leq t}\max_{x\in P_s} f(x)`,
    file: 'python/run_lima.py', lines: 'execute', local: 'python/run_lima.py',
    code: 'population = sorted(\n    population + mutated,\n    key=score, reverse=True)[:size]\nbest = population[0].copy()\nhistory.append({"route": best,\n    **evaluate(best, data, budget)})',
    notes: 'Esta es una ejecución real de la adaptación en Python, guardada en data/experiment.json. No se fijó semilla. Los parámetros se mantienen en 100 rutas, 100 generaciones, pOff=1, tasa inicial 0.1 y diversificación a 0.9 al detectar homogeneidad, como el port. El presupuesto local 180 soles es una elección didáctica explícita. El mapa muestra el mejor histórico. Una meseta puede corresponder al mejor encontrado o a convergencia prematura; la curva sola no demuestra optimalidad global. Los controles reproducen la traza guardada para que la exposición sea estable. Reiniciar la reproducción no ejecuta otra corrida; el comando Python de fuentes sí lo hace.'
  },
  {
    id: 'resultado', label: 'Resultado', title: 'La misma Lima.\nUna ruta más eficiente.',
    lead: 'Comparamos la mejor ruta inicial con la mejor encontrada al terminar esta ejecución.',
    insight: 'Mejor encontrada bajo nuestro modelo. No equivale a una recomendación vial ni a una prueba de óptimo global.',
    file: 'python/run_lima.py', lines: 'resultado', local: 'python/run_lima.py',
    code: 'initial = population[0].copy()\n# ejecutar 100 generaciones\nfinal = history[-1]\n# comparar la misma función objetivo',
    notes: 'Comparar fitness de forma explícita y leer unidades de distancia, tiempo y costo. La mejora respecto a la mejor ruta de la población inicial es una comparación más exigente que contra una ruta arbitraria. Menor fitness no se interpreta como porcentaje de distancia: son magnitudes distintas. El resultado depende del dataset, las fórmulas de tiempo/costo, presupuesto y aleatoriedad. No contempla horarios, entradas ni visitas. Conectar la conclusión con la pregunta inicial: el orden de exactamente los mismos diez museos cambia el costo de los nueve tramos.'
  },
  {
    id: 'fuentes', label: 'Fuentes y límites', title: 'Qué viene del paper.\nQué hicimos en Lima.',
    lead: 'Una exposición defendible distingue el artículo, el código ejecutable y las decisiones del caso local.',
    insight: 'Paper y código enlazados por paso; dataset, matrices y traza disponibles para descargar.',
    notes: 'Cerrar con tres niveles. Paper: problema, normalización, torneo modificado y COX. Port Python: implementación exacta, incluidas peculiaridades de inicialización y μ^n. Lima: diez coordenadas OSM, inicio MALI, matrices Haversine y modelo de tiempo/costo, presupuesto didáctico, adaptación legible equivalente y traza registrada. Citar la diferencia entre ecuación del artículo y Fitness.py. Mostrar licencias MIT del port y ODbL de OpenStreetMap. La cartografía base es © OpenStreetMap contributors. El sitio sirve fuentes, fórmulas y teselas localmente para no depender de la red durante la exposición.'
  }
];
