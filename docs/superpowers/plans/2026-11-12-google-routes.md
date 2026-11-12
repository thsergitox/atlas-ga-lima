# Google Routes para Atlas GA — plan de implementación

> Para ejecutar: usar `superpowers:executing-plans`, por tareas. Este documento planifica; no autoriza ni realiza consultas ahora. No iniciar la adquisición hasta recibir la configuración y resolver la lista de lugares.

**Goal:** obtener distancia, duración y geometría vial de los 380 pares dirigidos entre veinte lugares, y explicar el algoritmo genético con recorridos sobre calles.

**Architecture:** consultar Compute Routes por par y construir las matrices a partir de la misma respuesta que proporciona la polilínea. Propuesta para Google: sesión online, datos de trabajo en memoria y mapa de Google; publicar el código sin convertir respuestas de Google en archivos públicos permanentes. Mantener el núcleo genético Python y los casos docentes existentes.

**Tech Stack:** Python estándar, JavaScript con módulos ES, Maps JavaScript API, Routes API REST y el proyecto Vercel existente. Funciones Python pequeñas para la modalidad online; sin framework frontend nuevo ni base de datos inicial.

**Spec:** requisitos y decisiones de este documento, contrastados con `docs/DATA.md`, `PRODUCT.md`, el código actual y las fuentes oficiales enlazadas abajo.

## Global Constraints

- Solo planificación en esta fase. No claves en el chat, llamadas pagadas, builds ni despliegue ahora.
- No introducir semillas ni modificar operadores para mejorar artificialmente el resultado.
- Son veinte ubicaciones, pero la identidad está pendiente: el repositorio tiene veinte **museos**, mientras el último mensaje dice **cafeterías**.
- Google estima tiempos; no mide una duración observada ni entrega una tarifa comercial de taxi.
- Separar datos originales del paper, aproximación Haversine y datos nuevos Google en nombres y procedencia.
- La excepción de caché de coordenadas de treinta días NO se interpreta como permiso general para guardar matrices, tiempos y respuestas completas treinta días.
- Las propuestas de arquitectura siguientes requieren comprobar el uso concreto frente a los términos aplicables a la cuenta antes de adquirir datos. No se promete un dataset Google descargable permanente.

## Review Focus

1. Un par no encontrado, una respuesta vacía o un error de cuota no pueden convertirse en distancia cero.
2. El sentido A→B no se puede sustituir por B→A, aunque visualmente parezcan próximos.
3. Cambiar de caso durante una carga debe cancelar sus solicitudes pendientes y evitar mezclar matrices.
4. Una sesión incompleta o una recarga no deben disparar llamadas silenciosas ni evaluar un cromosoma con datos parciales.
5. Las animaciones no deben desplazar lugares, atravesar edificios por interpolación ni ocultar las atribuciones.

## 1. Conteo y costos comprobados

Fecha de revisión: 12 de noviembre de 2026. Precios globales en USD; sin impuestos ni conversión de moneda. La factura depende también del uso mensual de otros proyectos de la misma cuenta de facturación.

Para N=20: N²=400 celdas; N diagonales se definen localmente como cero; N(N−1)=380 trayectos útiles. Las calles y restricciones de circulación permiten matrices asimétricas.

| Alternativa | Uso para una adquisición completa | Importe con tarifa inicial, sin franquicia disponible |
| --- | --- | ---: |
| Solo matriz Essentials | 400 elementos Compute Route Matrix | US$2,00 |
| Matriz y todos los trazados Essentials | 400 elementos + 380 Compute Routes | US$3,90 |
| **Distancia, tiempo y trazado juntos — recomendada** | **380 Compute Routes Essentials** | **US$1,90** |
| La anterior considerando tráfico | 380 Compute Routes Pro | US$3,80 |

Essentials tiene una franquicia de 10.000 eventos mensuales por SKU; Pro, 5.000. Con suficiente saldo gratuito, cualquiera de las adquisiciones anteriores puede costar US$0 de API. Son cantidades por adquisición: recargar datos en una nueva sesión consume otra vez.

El mapa es otro SKU: Dynamic Maps tiene 10.000 cargas gratuitas mensuales; después, tarifa inicial US$7/1.000 cargas. Una carga sería US$0,007 fuera de franquicia. Se conservará una única instancia de mapa durante la navegación de slides; cambiar una polilínea no necesita recalcularla en Routes.

Presupuesto conservador del colector: 380 pares y como máximo 40 intentos adicionales globales, 420 intentos. Si todos fueran facturables a Essentials, equivaldrían a US$2,10, más mapas. Es un límite del colector, no un límite de gasto de toda la cuenta. Las alertas de presupuesto no cortan automáticamente el consumo.

Compute Route Matrix factura elementos, aunque 20×20 se mande en una petición HTTP. Admite hasta 625 elementos en el caso básico; el modo TRAFFIC_AWARE_OPTIMAL reduce el máximo a100. No devuelve polilíneas. Por eso no aporta ahorro si queremos las380 geometrías completas.

Fuentes: [precios globales](https://developers.google.com/maps/billing-and-pricing/pricing), [facturación y límites Routes](https://developers.google.com/maps/documentation/routes/usage-and-billing), [disparadores de SKU](https://developers.google.com/maps/billing-and-pricing/sku-details/routes), [polilíneas](https://developers.google.com/maps/documentation/routes/traffic_on_polylines), [alertas de presupuesto](https://docs.cloud.google.com/billing/docs/how-to/budgets).

## 2. Modelo para la exposición

Se recomienda empezar con `DRIVE` y `TRAFFIC_UNAWARE`. Las distancias y duraciones proceden de la red vial de Google, pero no consideran el tráfico actual. La comparación usa una matriz fija durante toda la corrida. Pedir tráfico sería una opción Pro; además, una matriz tomada para una hora no representa la evolución del tráfico a medida que el visitante llega a cada parada.

Usar la misma configuración para todos los pares: sin alternativas, sin reordenamiento de paradas, unidades métricas y polilínea de alta calidad. Registrar configuración y ventana de consulta. Se propone permitir peajes y autopistas, como configuración explícita; no solicitar precios de peajes ni datos adicionales de tráfico.

Cada par proporciona distancia en metros, duración en segundos y una polilínea codificada que se decodifica a una secuencia de latitud/longitud. La geometría dibujada y las métricas pertenecen a la misma respuesta. La distancia usada por el fitness será la informada por la API, no una suma aproximada de puntos de la polilínea.

El paper obtiene información de desplazamiento mediante Bing y luego aplica el algoritmo. Aquí se replica ese pipeline con Google para Lima, sin atribuir esos nuevos datos al artículo.

Para el cromosoma r=(r₁,…,r₂₀), la ruta sigue siendo abierta: diecinueve tramos, sin retorno obligatorio.

    Dᵢⱼ = distanceMetersᵢⱼ / 1000          [km]
    Tᵢⱼ = durationSecondsᵢⱼ / 60          [min]
    D(r) = Σₖ₌₁¹⁹ D[rₖ,rₖ₊₁]
    T(r) = Σₖ₌₁¹⁹ T[rₖ,rₖ₊₁]

Los costos C seguirán siendo una hipótesis académica. Si todos los pares son de conducción, retirar la regla actual «gratis/caminar si D≤1km», que mezclaría modalidades con tiempos de automóvil. Propuesta explícita: Cᵢᵢ=0 y Cᵢⱼ=max(8,4+2,5Dᵢⱼ) soles para i≠j, manteniendo los parámetros didácticos actuales. No presentar esto como tarifa de Google, Uber o taxi. Mantener B=360 como hipótesis y permitir examinar su efecto, sin cambiarlo a escondidas para lograr fitness positivo.

Se conserva la fórmula actual, con normalización global de las matrices y diagonal cero:

    F(r) = ((B−C(r))/B) / (D(r)/max(D) + T(r)/max(T))

Si alguna conexión falta, detener la preparación y mostrar el par; no rellenarla con Haversine sin rotularlo. Si dos entradas duplicadas generan distancias cero fuera de la diagonal, revisar las ubicaciones antes de aceptar el dataset.

## 3. Almacenamiento y cartografía: decisión necesaria

El mapa actual es OpenStreetMap. Los términos específicos de Routes, apartado19.2, impiden usar ese contenido con un mapa ajeno a Google. La versión Google debe usar Google Maps, conservar su atribución e incorporar los avisos de uso y privacidad exigidos. Ver [términos específicos](https://cloud.google.com/maps-platform/terms/maps-service-terms) y [políticas Routes](https://developers.google.com/maps/documentation/routes/policies).

La web estática actual publica matrices y trazas como JSON/CSV. No basta con poner la clave en `.env` para poder publicar de la misma manera las respuestas Google: las restricciones de almacenamiento y redistribución afectan también a los datos. No guardar matrices Google en Git, descargas, CDN, localStorage, IndexedDB o service worker como supuesto atajo.

| Modalidad | Ventaja | Costo o limitación |
| --- | --- | --- |
| **Google online, propuesta inicial** | Consulta para una sesión explícita y visualización en Google Maps; matrices de trabajo en memoria | Necesita conexión y nueva adquisición cuando se descarta la sesión; verificar el uso concreto y los términos antes de activarla |
| Google con dataset permanente | Snapshot estable y reproducible | No asumir autorización estándar; requiere confirmar permiso o licencia aplicable |
| Motor sobre datos abiertos | Puede permitir dataset versionado y mapa OSM, según licencia elegida | Otro proveedor y red vial; investigar aparte si se prioriza exposición offline |

No afirmar que la memoria temporal resuelve por sí sola toda cuestión de licencia. Antes del primer lote, contrastar específicamente el cálculo genético, la sesión, las trazas y cualquier persistencia pretendida. Si se exige conservación permanente, resolver esa condición antes de solicitar los380 pares.

El caso paper continúa con sus matrices originales y su procedencia independiente. Evitar mostrar contenido Google junto a mapas OSM en una misma pantalla; al cambiar de caso retirar sus capas y datos activos.

## 4. Configuración que debe preparar el usuario

1. Proyecto Google Cloud con cuenta de facturación. Comprobar la franquicia restante de los SKU previstos y el país de facturación: los términos EEE son distintos.
2. Habilitar **Routes API** y **Maps JavaScript API**. No hace falta habilitar Places o Geocoding si contamos con las veinte coordenadas verificadas. Una lista nueva de cafeterías requerirá resolver primero esas ubicaciones.
3. Clave de servidor para Routes, restringida a esa API. Para ejecución local, restringir a la IP pública de salida cuando sea estable. Para Vercel, verificar la estrategia de salida/autenticación; no prometer restricción IP sobre direcciones dinámicas.
4. Clave distinta de navegador para Maps JavaScript API, restringida por sitios web: dominio exacto de producción y localhost necesario. Su visibilidad en el navegador es esperada; la clave de servidor permanece secreta.
5. Presupuesto de alerta pequeño, por ejemplo US$5, y cuota de solicitudes ajustada al lote donde la consola lo permita. Confirmar los límites reales antes de exponer el endpoint a Internet.
6. Depositar credenciales en configuración local ignorada y, posteriormente, variables de entorno de Vercel. No pegarlas en el chat ni guardarlas en el repositorio. Crear `.env.example` solo con nombres vacíos si se necesita documentación.

Nombres propuestos: `GOOGLE_ROUTES_API_KEY` (servidor), `GOOGLE_MAPS_BROWSER_KEY` (navegador), `GOOGLE_ROUTES_ENABLED` (interruptor), `ATLAS_PRESENTER_TOKEN` (acceso al cálculo). Son nombres propios del proyecto, no campos de Google.

Fuente: [seguridad de claves](https://developers.google.com/maps/api-security-best-practices). No habilitar un proxy público de rutas arbitrarias.

## 5. Contratos internos propuestos

Estos contratos son del proyecto y todavía NO están implementados.

- `Place`: `{id: number, name: string, lat: number, lon: number}`; veinte IDs únicos, mismo orden en todos los datos.
- `PairRoute`: `{originId, destinationId, distanceMeters, durationSeconds, encodedPolyline}`.
- `TravelDataset`: `{distance: number[20][20], time: number[20][20], cost: number[20][20]}`; respeta el contrato de `python/evolution.py`.
- Geometrías: diccionario en memoria `"originId:destinationId" → PairRoute`; nunca compartir la entrada inversa por defecto.
- Procedencia: proveedor, configuración, fecha de inicio/fin, huella de las veinte ubicaciones y conteos de pares/errores. Ninguna clave ni volcado íntegro en logs.

Petición Google: `POST https://routes.googleapis.com/directions/v2:computeRoutes`; cabecera `X-Goog-Api-Key` y máscara `routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline`. Cuerpo con `origin.location.latLng`, `destination.location.latLng`, `travelMode: DRIVE`, `routingPreference: TRAFFIC_UNAWARE`, `polylineQuality: HIGH_QUALITY`, `polylineEncoding: ENCODED_POLYLINE`, `computeAlternativeRoutes: false`, `optimizeWaypointOrder: false`, `languageCode: es-PE`, `units: METRIC`. No pedir campos mediante `*`.

Referencia del contrato externo: [Compute Routes REST](https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes).

## 6. Tareas de implementación

### Tarea 1: fijar lugares y validar el plan sin consultar

**Archivos:** crear `data/lima-google/places.json` y `data/lima-google/request-plan.json`; modificar `docs/DATA.md`. Estos archivos solo contienen ubicaciones de fuente permitida y parámetros propios, sin respuestas Google.

**Interfaz:** `request-plan.json` define los380 pares, la configuración anterior y su huella; no contiene credenciales.

- [ ] Resolver si son los museos actuales o una lista nueva de cafeterías; comprobar accesos y coordenadas, no solo centros aproximados de edificios.
- [ ] Generar el manifiesto:380pares únicos dirigidos, ninguna diagonal, todos losIDs válidos.
- [ ] Verificar el permiso de uso/retención elegido y documentar la modalidad; si no permite el resultado requerido, detener adquisición y presentar alternativa.
- [ ] Verificación: lectura del JSON y comprobación puntual de conteos, unicidad y cobertura; cero solicitudes de red al proveedor.

### Tarea 2: adaptador Python y colector acotado

**Archivos:** crear `python/google_routes/client.py`, `python/google_routes/collection.py` y `python/google_routes/model.py`. Usar biblioteca estándar y módulos pequeños.

**Interfaces:** `fetch_pair(origin, destination, api_key, timeout_seconds) -> PairRoute`; `collect_pairs(places, on_progress, cancel) -> list[PairRoute]`; `build_matrices(places, pair_routes) -> TravelDataset`.

- [ ] Implementar petición y parseo de duraciones decimales terminadas en `s`, metros y polilínea; timeout10s por intento.
- [ ] Empezar con un piloto de tres lugares/seis sentidos dentro de la misma sesión. Revisar ambos sentidos y los accesos; incluir esas seis respuestas en el total, sin repetirlas.
- [ ] Completar los374 pares restantes con máximo dos solicitudes simultáneas; hasta dos reintentos por par solo ante429/5xx, respetando Retry-After y un máximo global de40intentos extra.401/403 o error de facturación detienen el lote.
- [ ] Mantener progreso y pares completados en memoria. Cancelar pendientes; un intento ya recibido por Google puede consumir cuota. Reanudar solo mientras vive la misma sesión, salvo permiso explícito de persistencia.
- [ ] Verificación puntual con respuestas sintéticas en memoria: duración `3.5s`, A→B diferente de B→A, ruta vacía, timeout y límite global. Un fallo nunca produce ceros. Sin crear una suite por defecto.

### Tarea 3: endpoints de sesión y ejecución genética

**Archivos:** crear `api/google_routes.py`, `api/google_experiment.py`, `python/google_routes/access.py`, `python/google_routes/experiment.py` y `src/google/session.js`; modificar `.vercelignore` y `vercel.json` solo para empaquetar lo necesario.

**Interfaces:** `POST /api/google_routes` recibe IDs de hasta dos pares del manifiesto y devuelve `PairRoute[]`; los parámetros y coordenadas se resuelven del lado servidor. `POST /api/google_experiment` recibe las matrices completas y devuelve el payload compatible con `experiment` actual, invocando `execute(data, budget=360, size=100, generations=100, start=...)`. `prepareGoogleSession({token, onProgress, signal})` produce contexto y geometrías en memoria.

- [ ] Proteger ambos endpoints con token de presentador y un interruptor de servidor. Validar tamaño del cuerpo,20×20,IDs y configuración fija; no aceptar URLs, máscaras ni puntos arbitrarios del cliente.
- [ ] Usar funciones pequeñas por lote, evitando una petición HTTP de380rutas o un proceso en segundo plano que dependa de memoria persistente de Vercel. El coordinador de sesión permanece en el navegador.
- [ ] Establecer `Cache-Control: no-store`, no registrar respuestas/claves/tokens y excluir datos de Google de los archivos estáticos y descargas. No guardar token en localStorage.
- [ ] Reutilizar el algoritmo Python existente; resolver sus imports actuales (`from dataset`, `from operators`) con un punto de entrada controlado. No cambiar operadores ni perder los ejemplos de torneo/cruce/mutación del payload.
- [ ] Cerrar acceso al cálculo antes del despliegue público hasta comprobar cuotas. El contador del navegador y CORS NO son controles globales de gasto ni defensa contra repetición; usar cuota del proveedor y acceso privado, o añadir control duradero antes de permitir múltiples presentadores.
- [ ] Verificación: peticiones sin token/IDs ajenos se rechazan sin llamar Google; las incompletas no ejecutan GA; cancelar/cambiar caso impide inyectar resultados tardíos. Medir tiempo del GA frente al límite real del proyecto Vercel antes de habilitarlo.

Vercel documenta handlers Python por archivo para proyectos existentes sin preset; comprobar el empaquetado de módulos, actualmente excluidos por `.vercelignore`. [Referencia oficial](https://vercel.com/docs/functions/runtimes/python/api-directory). El consumo de Functions depende del plan de hosting y se comprobará aparte; los importes anteriores son de Google, no una cotización total de infraestructura.

### Tarea 4: mapa de Google y transiciones por tramos

**Archivos:** crear `src/google/map.js`, `src/google/geometry.js`, `src/google/transitions.js`; modificar `src/presentation/app.js`, `src/presentation/cases.js` y `src/map/map.css` para elegir el renderizador según el caso.

**Interfaces:** `createGoogleMap(host, places, profile, pairRoutes)` expone la misma interfaz `show`, `destroy`, `labels`, `highlight` del mapa actual. `routeEdges(ids)` devuelve los19pares; `changedEdges(before, after)` separa compartidos, retirados y añadidos.

- [ ] Cargar Maps JavaScript una vez y mantener una instancia de mapa entre diapositivas. Estilo compatible con la paleta actual, mapa y atribuciones legibles.
- [ ] Decodificar polilíneas con la precisión del formato documentado; comprobar orden latitud/longitud y conservar cada tramo separado. No unir discontinuidades de acceso como si fueran calles.
- [ ] Mantener marcadores fijos. Atenuar los tramos retirados y dibujar los nuevos sobre su trazado vial; conservar los compartidos. Duración objetivo850ms y movimiento reducido instantáneo. No interpolar vértices de trazados diferentes a través de edificios.
- [ ] Sin consultas Google durante `show`, selección, cruce, mutación o reproducción de generaciones. Si falta una geometría, informar preparación incompleta, no dibujar una recta bajo la etiqueta «ruta Google».
- [ ] Verificación visual de cada operador, zoom, anchos320/768/1440, teclado, cambio de caso y cancelación; comprobar contador de red inmóvil mientras se anima.

### Tarea 5: explicación y procedencia visibles

**Archivos:** modificar `src/presentation/lessons.js`, `basic-stages.js`, `sources-stage.js`, `code-stage.js`, `index.html` y `docs/DATA.md`; crear `privacidad.html` y `terminos.html` con los avisos requeridos.

- [ ] Añadir «Lima · Google» con preparación explícita, conteo380, estado de sesión y modalidad. Conservar el caso paper y señalar la diferencia entre el proveedor original Bing y Google en nuestra adaptación.
- [ ] Mostrar en Dataset las matrices20×20 en sesión; seleccionar celda resalta su par y métricas. En cada operador, explicar qué conexiones cambian y su efecto en D,T,C,F.
- [ ] Actualizar fragmentos y código completo para distinguir adquisición de datos y algoritmo; no ofrecer descarga permanente de respuestas Google como parte del JSON del caso. El código sí puede publicarse sin credenciales.
- [ ] Rotular «Tiempo estimado por Google · sin tráfico» y «Costo simulado». No conservar el texto de Haversine en el contexto Google.
- [ ] Verificación: pares resaltados coinciden con celdas, fórmulas conservan unidades, todas las notas son del caso activo, avisos y atribuciones se ven en pantalla completa.

### Tarea 6: comprobación y publicación

**Archivos:** actualizar `docs/VERIFICATION.md`, `README.md` y la documentación de configuración.

- [ ] Comprobar sintaxis Python/JavaScript sin build; efectuar verificaciones puntuales con datos sintéticos e inspección de cambios. No crear entornos o suites por defecto.
- [ ] Con la configuración lista, ejecutar piloto y lote, cotejar manualmente varios pares en Google Maps con igual modalidad y explicar posibles diferencias de hora/opciones. Revisar cobertura380, diagonal0, direcciones, totales y coherencia geometría/métricas.
- [ ] Confirmar que cien generaciones y sus animaciones no crean solicitudes adicionales de Routes, que una recarga explica la nueva preparación y que una sesión fallida puede descartarse limpiamente.
- [ ] Revisar que el modo paper y el caso académico siguen funcionando; no modificar los .mat originales.
- [ ] Desplegar con Vercel CLI cuando se implemente la fase y verificar el sitio y endpoints efectivos; nunca ejecutar un build local. No se despliega este documento como activación de Google.
- [ ] Revisar uso y facturación en Cloud Console al estar disponibles, distinguir intentos propios de eventos facturados y cerrar el acceso al cálculo si ya no se necesita.

## 7. Criterio de aceptación y pendientes

Listo para exponer significa: veinte lugares confirmados,380pares válidos, matrices20×20 con unidades correctas, polilíneas viales en Google Maps, operaciones genéticas explicadas sin llamadas por generación, claves separadas/restringidas y modalidad de almacenamiento compatible con los términos. Internet seguirá siendo necesario en la propuesta Google online.

Pendiente antes de adquirir: aclarar museos/cafeterías; preparar credenciales y revisar franquicia/cuotas; cerrar el uso/retención requerido. Si se quiere un dataset descargable permanente u operación offline, no dar por resuelta esa necesidad con una clave: elegir permiso de Google o una fuente con licencia adecuada.

Este plan no ha modificado la aplicación ni realizado solicitudes facturables.
