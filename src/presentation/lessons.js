const upstream = 'https://github.com/Arbues/ga-itinerary-planning-pc3/blob/e84ed98c8ecd65bf269da847ee26147f1f282d70/Turism_Istanbul/';

export function getLessons(p) {
  const { n, start, startName, budget, currency } = p;
  const paper = p.id === 'paper';
  const istanbul = p.id !== 'lima';
  const source = (file, lines) => ({ file, source: upstream + file + '#L' + lines });
  const local = file => ({ file: 'python/' + file, local: 'python/' + file });
  const context = p.id === 'istanbul'
    ? 'Estambul ORS conserva las doce coordenadas de Places.mat, las cien rutas iniciales de ind.mat, el inicio 6 y B=2000 TL. Se adquieren 132 pares dirigidos con driving-car: D en km y T estimado en minutos, sin tráfico en vivo. La matriz C se copia intacta de Travel_Costs.mat: es histórica y no representa tarifas actuales. ORS no estima ese costo. El radio de búsqueda vial es 1000 metros; la procedencia publica la separación real entre cada coordenada y su acceso vial. Estos accesos peatonales no se dibujan como calles ni se incluyen en D/T. Resultado permite evaluar las rutas finales de ambas corridas con las mismas matrices ORS y C histórica. Una única corrida aleatoria no prueba superioridad causal. No se inventan los nombres ausentes de Places.mat.'
    : paper
    ? 'Este caso usa las coordenadas Places.mat, matrices Travel_Dis.mat, Travel_Times.mat y Travel_Costs.mat y los cien individuos de ind.mat del repositorio original, sin sustituirlos por valores simulados. El presupuesto es 2000 TL, como el ejemplo del port. Las matrices son históricas y pueden ser asimétricas. La traza es una nueva ejecución Python del ciclo equivalente al escenario S6; no se atribuye a los resultados numéricos publicados del paper. El archivo Places.mat solo contiene IDs y coordenadas; se mantienen los IDs sin inventar nombres para los otros destinos.'
    : 'Lima conserva veinte museos con coordenadas OSM verificables. Se adquirieron 380 pares dirigidos de openrouteservice con el perfil driving-car. Cada respuesta proporciona distancia vial en metros, duración estimada en segundos y la geometría del mismo recorrido. Convertimos D a kilómetros y T a minutos; la diagonal se fija en cero sin consultar. No hay tráfico en vivo. C=max(8,4+2.5D) soles por tramo es una hipótesis académica, no una tarifa comercial; todos los tramos se modelan en automóvil. B=360 soles es el presupuesto didáctico, sin entradas ni visitas. Los datos y las rutas se guardaron antes de exponer: los operadores no consultan la API. La polilínea puede empezar en un acceso vial cercano al punto del museo; los accesos peatonales no se incluyen en D/T.';
  return [
    { id: 'problema', label: 'El problema', title: `${n} ${istanbul ? 'destinos' : 'museos'}.\n¿En qué orden?`,
      lead: 'Los mismos lugares. Millones de órdenes posibles. Un algoritmo que aprende a combinarlos.',
      insight: p.dataNote,
      notes: `Cambiar la ruta y señalar los saltos geográficos. El mapa cambia conexiones; las ubicaciones siguen fijas. Hay ${n} lugares, ${n - 1} tramos y un inicio fijo: ${startName}, ID ${start}. No hay retorno al inicio. El espacio tiene (${n}−1)! permutaciones. ${context}` },
    { id: 'pipeline', label: 'Paper y código', title: 'Una ruta recorre\ntodo el programa.',
      lead: 'Datos, representación, evaluación y operadores: el mismo pipeline para los tres casos.', insight: p.dataNote,
      ...source('GA.py', '59-L150'),
      code: 'ind = _load_initial_population()\nfor g in range(nGen):\n    # selección → COX → mutación\n    ind = SortPop(ind + indoff)\n    ind = ind[:nRoute]',
      notes: `Şehab y Turan (2024), PeerJ Computer Science 10:e2340, DOI 10.7717/peerj-cs.2340. El artículo obtuvo distancias y tiempos con Bing Maps API mediante Excel y Visual Basic, pp. 8–9. Aquí se repite el pipeline con openrouteservice para Lima y Estambul. El artículo compara doce escenarios: S6 usa 100 generaciones, 100 rutas, torneo modificado y COX. Los datos disponibles parten de 98 destinos y el caso turístico elegido usa doce. El selector conserva el paso actual para comparar el mismo concepto entre Lima y Estambul. ${context}` },
    { id: 'dataset', label: 'Dataset', title: 'Primero los datos.\nDespués la ruta.',
      lead: `${n} registros y tres matrices ${n} × ${n}: distancia, tiempo y costo para cada par de destinos.`, insight: p.dataNote,
      formula: paper ? String.raw`D,T,C\in\mathbb{R}^{12\times12},\quad D_{ij}\ne D_{ji}\;\text{en general}` : String.raw`D_{ij}=\frac{d^{\mathrm{ORS}}_{ij}}{1000},\quad T_{ij}=\frac{t^{\mathrm{ORS}}_{ij}}{60},\quad D_{ij}\ne D_{ji}`,
      ...local(paper ? 'export_paper.py' : 'routing/dataset.py'),
      code: paper ? 'Places = loadmat("Places.mat")["Places"]\nD = loadmat("Travel_Dis.mat")["Travel_Dis"]\nT = loadmat("Travel_Times.mat")["Travel_Times"]\nC = loadmat("Travel_Costs.mat")["Travel_Costs"]' : p.id === 'istanbul' ? 'distance = p["distanceMeters"] / 1000\nduration = p["durationSeconds"] / 60\ndata["distance"][i][j] = distance\ndata["time"][i][j] = duration\ndata["cost"][i][j] = historical_cost[i][j]' : 'distance = p["distanceMeters"] / 1000\nduration = p["durationSeconds"] / 60\ndata["distance"][i][j] = distance\ndata["time"][i][j] = duration\ndata["cost"][i][j] = max(8, 4 + 2.5 * distance)',
      notes: `${context} Las unidades son km, minutos y ${currency}. Seleccionar origen y destino dibuja ese par; invertirlo permite comprobar la asimetría. Ver matriz permite explorar las ${n * n} celdas, incluidas las ${n} diagonales. Las matrices originales de Estambul también son viales según el artículo, pero no contienen las geometrías: allí mostramos conexiones esquemáticas. Los casos Lima y Estambul ORS dibujan las coordenadas viales adquiridas.` },
    { id: 'poblacion', label: 'Población inicial', title: 'Un cromosoma\nes un itinerario.',
      lead: `Cada gen identifica un lugar. Son ${n} genes distintos y el ID ${start} permanece primero.`,
      insight: istanbul ? 'Cargamos las mismas 100 rutas distribuidas en ind.mat. Conservamos exactamente los IDs originales.' : 'Generamos 100 permutaciones válidas; se excluye MALI de la cola antes de mezclarla.',
      formula: String.raw`x=(${start},\pi_2,\ldots,\pi_{${n}}),\quad |\Omega|=${n - 1}!`,
      ...local(istanbul ? 'export_paper.py' : 'operators.py'),
      code: istanbul ? 'raw = loadmat("ind.mat")["ind"]\ninitial = [row["Plan"].ravel().astype(int).tolist()\n           for row in raw.flat]\n# 100 rutas, inicio 6' : 'tail = [i for i in range(1, n + 1)\n        if i != start]\nrandom.shuffle(tail)\npopulation.append([start] + tail)',
      notes: `Cada ruta tiene exactamente una visita a cada ID de 1 a ${n}. El inicio es ${startName}. Mantener cien candidatos no reduce el espacio combinatorio a cien: es el tamaño de la población exploradora. El initial_pop.py original puede repetir el inicio6 al anteponerlo a una permutación que lo contiene; el ind.mat distribuido sí es válido. Lima evita ese problema excluyendo el inicio de la cola. Estambul carga directamente la población distribuida, comprobada sin duplicados.` },
    { id: 'fitness', label: 'Fitness', title: '¿Qué hace buena\na una ruta?',
      lead: 'Menor distancia y tiempo, con más presupuesto restante. Una aptitud común compara las rutas.',
      insight: `B = ${budget} ${currency}. Normalizamos las matrices completas; el costo se descuenta como fracción del presupuesto.`,
      formula: String.raw`f(x)=\frac{(B-C(x))/B}{\sum_{k=1}^{${n - 1}}\left(\widehat D_{x_k,x_{k+1}}+\widehat T_{x_k,x_{k+1}}\right)}`,
      ...source('Fitness.py', '24-L39'),
      code: 'n = TravelCost(x)\nd = 0\nfor i in range(x.size - 1):\n    d += Ndmat[x[i]-1, x[i+1]-1] \\\n       + Ntmat[x[i]-1, x[i+1]-1]\nf = ((budget - n) / budget) / d',
      notes: `Norm(A)=(A−min(A))/(max(A)−min(A)) se aplica sobre todos los elementos, no por fila ni a los totales de cada individuo. Ambas matrices tienen diagonal cero, por lo que min=0. El código implementa ((B−C)/B)/sum(Dhat+That), mientras la ecuación11 del artículo se escribe (B−C)/(D+T) junto a su discusión de normalización. La web explica el código ejecutable. Si C>B, fitness es negativo; no hay descarte automático. Cambiar B en este laboratorio no altera la corrida guardada. La moneda de este caso es ${currency}.` },
    { id: 'seleccion', label: 'Selección', title: 'Dos buenos padres.\nDos rutas distintas.',
      lead: 'Sorteamos el 20 % de la población y ordenamos por fitness. El primer padre gana el torneo.', insight: 'El segundo padre se busca con un plan distinto. Si el torneo no basta, se recorre la población.',
      formula: String.raw`k=\lfloor0.2N\rfloor=20,\quad p_1=\arg\max_{x\in S} f(x)`,
      ...source('GA.py', '95-L120'),
      code: 'tournamentSize = math.floor(nRoute * 0.2)\ntournament = np.random.permutation(nRoute)[:tournamentSize]\ncand = SortPop(c)\np1, p2 = cand[0], cand[1]\nwhile np.array_equal(p1["Plan"], p2["Plan"]):\n    # buscar otro plan en torneo y población',
      notes: 'El muestreo es sin reemplazo dentro de un torneo, pero un individuo puede volver a competir en torneos posteriores. No es ruleta. Se toman los dos mejores de un torneo; si coinciden, se intenta otro padre. Si toda la población coincide, se intenta mutar con μ=.9 y esa tasa se mantiene. Incluso esa mutación puede no cambiar la ruta: no garantiza diversidad. Se muestran los seis mejores de los veinte sorteados; el mapa sigue el padre elegido.' },
    { id: 'cruce', label: 'Cruce COX', title: 'Conservar el centro.\nHeredar el orden.',
      lead: 'Dos cortes separan tres bloques. El centro se copia; cada extremo se ordena como aparece en el otro padre.', insight: 'Los mismos cortes producen DOS hijos. Cada uno sigue siendo una permutación válida.',
      formula: String.raw`h_1=\operatorname{ord}_{p_2}(L_1)\;\Vert\;M_1\;\Vert\;\operatorname{ord}_{p_2}(R_1)`,
      ...source('COX.py', '12-L56'),
      code: '# Equivalente legible a COX.py\nleft = sorted(p1[:a], key=p2.index)\nright = sorted(p1[b:], key=p2.index)\nh1 = left + p1[a:b] + right\nh2 = copy_order(p2, p1, a, b)',
      notes: 'El oro marca el centro heredado de su propio padre. El extremo izquierdo de p1 conserva sus IDs, pero se ordena según su aparición en p2; el derecho se trata por separado. El hijo2 invierte los padres. No se mezclan los extremos ni se intercambian centros: eso sería otro operador. Los cortes son índices de slicing Python y el centro es [a:b]. Como ambos padres tienen el mismo inicio, este se conserva. Un hijo puede mejorar, empeorar o quedar igual. La notación ord es explicativa y no una ecuación numerada del paper.' },
    { id: 'mutacion', label: 'Mutación', title: 'Un intercambio.\nOtro recorrido.',
      lead: 'Una fila activa intercambia dos genes vecinos. Los lugares no se mueven; cambian las conexiones.',
      insight: `La matriz es ${n} × ${n}. Cada una de las ${n - 2} filas candidatas necesita todos sus indicadores verdaderos.`,
      formula: String.raw`P(\text{swap en }i)=\mu^{${n}},\qquad (x_i,x_{i+1})\leftarrow(x_{i+1},x_i)`,
      ...source('Mutation.py', '4-L22'),
      code: 'flag = np.random.rand(n, n) < mu\nfor i in range(1, n - 1):\n    if np.all(flag[i, :] == 1):\n        x[i], x[i+1] = x[i+1], x[i]',
      notes: `Hay ${n - 2} swaps candidatos. La fila tiene ${n} Bernoulli independientes, por eso P=μ^${n}, no μ. E[swaps]=(${n}−2)μ^${n}. El primer gen no se mueve. Se recorren filas en orden y un mismo gen puede moverse varias veces. Un intercambio interior cambia hasta tres pares dirigidos: los tramos compartidos permanecen, los anteriores son grises y los nuevos se dibujan sobre sus coordenadas. El modo visible inicia en μ=.9 para mostrar la diversificación original; la corrida inicia en .1. La demostración guardada es un sorteo adicional, separado de la traza evolutiva. Cada sorteo nuevo en navegador usa ${n * n} uniformes y puede dar cero cambios. Mutar no implica mejorar.` },
    { id: 'reemplazo', label: 'Reemplazo', title: 'Compiten los padres\ny sus descendientes.',
      lead: 'Evaluamos los hijos, unimos las poblaciones y conservamos las 100 mejores rutas.', insight: 'Elitismo: los padres siguen compitiendo. La mejor aptitud histórica no disminuye.',
      formula: String.raw`P_{t+1}=\operatorname{Top}_{100}(P_t\cup O_t),\quad f^*_{t+1}\geq f^*_t`,
      ...source('GA.py', '130-L150'), code: 'indoff[M]["Fit"] = ObjectFunction(\n    indoff[M]["Plan"], budget)\nind = SortPop(ind + indoff)\nind = ind[:nRoute]',
      notes: 'Cien padres y cien hijos producen doscientos candidatos, de los cuales sobreviven cien. Los bloques son cien rutas, sin atribuirles procedencia no registrada. La curva del mejor histórico es monótona por el elitismo, no porque todos los hijos mejoren. El reemplazo puede reducir diversidad; el algoritmo no elimina automáticamente duplicados.' },
    { id: 'evolucion', label: 'Evolución', title: 'Cien generaciones.\nUna traza real.',
      lead: `Recorre una ejecución Python del caso ${p.shortCity}. El mapa y la curva muestran la misma generación.`, insight: paper ? 'Matrices y población originales; resultados de una nueva ejecución, no los de la tabla 7 del artículo.' : `La curva corresponde a una ejecución real con ${n} destinos y presupuesto de ${budget} ${currency}.`,
      formula: String.raw`f^*_t=\max_{0\leq s\leq t}\max_{x\in P_s}f(x)`, ...local('evolution.py'),
      code: 'population = sorted(\n    population + mutated,\n    key=score, reverse=True)[:size]\nbest = population[0].copy()\nhistory.append({"route": best,\n    **evaluate(best, data, budget)})',
      notes: `Cien rutas y cien generaciones, pOff=1, μ inicial=.1 y diversificación=.9 al no encontrar planes distintos. La curva muestra fitness, no porcentajes de distancia. Una meseta no prueba un óptimo global. Los controles reproducen la traza guardada; reiniciar la reproducción no ejecuta otra corrida. ${context}` },
    { id: 'resultado', label: 'Resultado', title: 'Los mismos lugares.\nUn orden más eficiente.',
      lead: 'Compara la mejor ruta de la población inicial con la mejor encontrada al terminar esta ejecución.', insight: p.dataNote,
      ...local('evolution.py'), code: 'initial = population[0].copy()\n# ejecutar 100 generaciones\nfinal = history[-1]\n# comparar la misma función objetivo',
      notes: `La mejora compara fitness con la mejor ruta inicial, no con una ruta arbitraria. Distancia, minutos y costo son magnitudes diferentes; una mejora porcentual de fitness no equivale a reducción de distancia. El algoritmo entrega la mejor ruta encontrada bajo sus datos, sin prueba de óptimo global. Son ${n} paradas, ${n - 1} tramos y presupuesto ${budget} ${currency}. ${context}` },
    { id: 'codigo', label: 'Código completo', title: 'Todo el algoritmo.\nUna sola lectura.',
      lead: 'El código completo conecta inicialización, fitness, torneo, COX, mutación y reemplazo.', insight: 'Archivo Python ejecutable con la biblioteca estándar. Puedes copiarlo o descargarlo junto con los datos del caso seleccionado.',
      notes: 'Esta diapositiva muestra el archivo completo sin puntos suspensivos ni funciones ocultas: incluye importaciones, todas las funciones del algoritmo y el punto de entrada. Es una versión legible equivalente al port, compartida por los tres casos. Se genera desde los mismos módulos que producen las trazas. Ejecutar python algorithm.py experiment.json inicia una nueva corrida con las matrices y la población inicial guardadas en el JSON del caso; no exige SciPy ni instalación. La conversión original de los .mat sí usa SciPy, pero ya se distribuyen los JSON. El botón de descarga de datos respeta el caso activo, incluido Estambul ORS.' },
    { id: 'fuentes', label: 'Fuentes y límites', title: 'Paper, código\ny adaptación.',
      lead: 'Cada caso tiene sus datos, su moneda y sus supuestos. La comparación necesita esa distinción.', insight: p.dataNote,
      notes: `Se conserva el paper de Şehab y Turan, el port de Arbues y sus licencias. Los datos originales .mat y sus hashes están disponibles en Estambul. Lima usa veinte objetos OSM y 380 trayectos de ORS; el costo sigue siendo simulado. Los resultados ORS se distribuyen bajo CC BY-SA 4.0 y su atribución está visible. El GeoJSON permite revisar todas las coordenadas de los trayectos; provenance.json registra fechas, perfil, hash y separaciones entre los puntos de museo y los accesos viales. Las teselas, las fuentes y KaTeX se sirven localmente. ${context}` }
  ];
}
