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
