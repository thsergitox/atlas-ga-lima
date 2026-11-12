---
name: Atlas GA · Lima
description: Laboratorio cartográfico para explicar algoritmos genéticos con rutas de museos.
colors:
  blue: "#204ed5"
  deep: "#142c49"
  ink: "#172c43"
  muted: "#526579"
  bg: "#f7f8fa"
  white: "#fff"
  line: "#d5dde6"
  green: "#176556"
  gold: "#e4aa40"
  tint: "#eaf0fc"
  blue-light: "#cad8f6"
  blue-hover: "#173fae"
  tint-hover: "#dce6fc"
  map-ground: "#edf1f5"
  gene-ink: "#2045b0"
  segment-bg: "#fbefcf"
  segment-ink: "#6d4d13"
  swapped-ink: "#4e3406"
  case-line: "#b4c4df"
  code-text: "#f2f6ff"
  code-muted: "#c6d5ed"
  code-line: "#39506d"
  code-action: "#2b466c"
  code-section: "#243d5d"
  code-section-text: "#d5e3ff"
  code-highlight: "#365281"
typography:
  display:
    fontFamily: "Bricolage, Georgia, serif"
    fontSize: "clamp(35px, 3.4vw, 64px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Bricolage, Georgia, serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-.02em"
  title:
    fontFamily: "Bricolage, Georgia, serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Source, 'Segoe UI', sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  code:
    fontFamily: "ui-monospace, 'SFMono-Regular', Consolas, monospace"
    fontSize: "12px"
    lineHeight: 1.65
  button:
    fontFamily: "Source, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  field: "5px"
  button: "7px"
  tooltip: "8px"
  code: "10px"
  panel: "12px"
spacing:
  compact: "8px"
  control-gap: "12px"
  inset: "16px"
  panel-y: "18px"
  action-x: "20px"
  stage-x: "22px"
  section: "24px"
  stage-bottom: "28px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "14px 20px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
  button-secondary:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.blue}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "14px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.tint-hover}"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    width: "42px"
    height: "42px"
  field-select:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "6px 9px"
  field-case-select:
    backgroundColor: "{colors.white}"
    textColor: "{colors.blue}"
    rounded: "{rounded.field}"
    padding: "6px 9px"
    height: "40px"
  stage-panel:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.panel}"
    padding: "18px 22px"
  gene:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.gene-ink}"
    rounded: "{rounded.field}"
    height: "33px"
  gene-long:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.gene-ink}"
    rounded: "{rounded.field}"
    height: "24px"
  gene-fixed:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
  gene-middle:
    backgroundColor: "{colors.segment-bg}"
    textColor: "{colors.segment-ink}"
  gene-swapped:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.swapped-ink}"
  code-panel:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.code-text}"
    rounded: "{rounded.code}"
  complete-code:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.code-text}"
    rounded: "0"
    padding: "0"
    height: "100%"
  code-section:
    backgroundColor: "{colors.code-section}"
    textColor: "{colors.code-section-text}"
    rounded: "{rounded.button}"
    padding: "6px 9px"
---

# Design System: Atlas GA · Lima

## Overview

**Creative North Star: "Laboratorio cartográfico"**

Atlas GA conserva su identidad azul y sitúa el mapa en el centro de la explicación. La presentación combina titulares amplios, lectura sobria y controles compactos para relacionar rutas, matemática y código. El fondo frío mantiene continuidad entre cabecera, contenido y navegación; las superficies blancas reúnen las operaciones.

La geografía permanece estable mientras cambia el recorrido. Las señales de color identifican estados concretos del algoritmo, con números, etiquetas y controles que conservan el significado durante la exposición.

**Key Characteristics:**

- Azul como señal de ruta y acción activa.
- Tipografía expresiva en títulos y sobria en explicación.
- Mapa geográfico con marcadores numerados y rutas superpuestas.
- Paneles blancos compactos para operaciones, métricas y cromosomas.

## Colors

La paleta combina azul cobalto, tinta profunda y neutrales fríos, con oro y verde para estados de las demostraciones. Los valores normativos están en el frontmatter y corresponden al CSS implementado.

### Primary

- **Azul cobalto** (`blue`): ruta activa, acción principal, navegación seleccionada, fórmulas y métricas destacadas.
- **Azul profundo** (`deep`): superficie del código fuente.
- **Azul pálido** (`tint`, `blue-light`): acciones secundarias, genes y conexiones del proceso.
- **Estados de interacción** (`blue-hover`, `tint-hover`): fondos de botones al pasar el puntero.

### Secondary

- **Oro de operación** (`gold`): genes intercambiados, museos afectados y foco de teclado. El segmento de cruce usa su propio fondo y texto (`segment-bg`, `segment-ink`).
- **Verde de resultado** (`green`): resultados señalados, recuento de descendientes y filas completas de la matriz de mutación.

### Neutral

- **Tinta** (`ink`) y **texto secundario** (`muted`): jerarquía de lectura.
- **Fondo frío** (`bg`), **blanco** (`white`) y **suelo del mapa** (`map-ground`): separación tonal de regiones.
- **Línea fría** (`line`): divisores y bordes de controles.
- **Texto de genes** (`gene-ink`, `swapped-ink`): contraste sobre sus fondos respectivos.
- **Lectura de código** (`code-text`, `code-muted`, `code-line`): texto, acciones y divisores sobre azul profundo; `code-action` distingue la copia y `code-section`/`code-section-text` los saltos de sección. `code-highlight` señala la definición elegida.
- **Borde del selector de caso** (`case-line`): delimita el campo blanco de cabecera.

**The State Meaning Rule.** El color de una operación representa el estado mostrado; no atribuye una procedencia individual que los datos no registran.

## Typography

Los archivos locales de Bricolage Grotesque se exponen mediante la familia CSS `Bricolage`; Source Sans 3 mediante `Source`. Ambas se cargan localmente. El código usa la pila monoespaciada del sistema.

La jerarquía del frontmatter corresponde a los estilos base. El título de apertura tiene una escala propia (`clamp(48px, 5.15vw, 88px)`, interlineado `1.05`) y un ancho máximo de `12ch`. La explicación inicial tiene una escala fluida y un ancho de `43ch`; el bloque de lectura admite `66ch`. Los números de genes, métricas y navegación usan cifras tabulares cuando lo establece su componente.

Los tamaños se reducen por ancho o altura de pantalla. En móvil el cuerpo pasa a `17px`; el código llega a `10px` y conserva desplazamiento horizontal. Las etiquetas de operación permanecen compactas para convivir con el mapa.

## Layout

El escritorio usa dos columnas: explicación a la izquierda y mapa con demostración a la derecha, con proporción `.83fr / 1.17fr` y primera columna mínima de `370px`. El contenedor admite hasta `2000px`. La cabecera mide `78px` y la navegación inferior `84px`; la zona central ocupa la altura disponible y permite desplazamiento independiente en la explicación.

Los paneles de demostración se apoyan en el borde inferior del mapa; su altura máxima habitual es `61%`. El contenido no tapa las atribuciones cartográficas. La matriz, los genes y las métricas se agrupan según la operación; la cuadrícula de métricas tiene cuatro columnas.

A partir de `1550px` crecen los márgenes, el texto y los paneles. Entre `901px` y `1100px` se compactan controles y se ocultan etiquetas secundarias. Con altura máxima de `760px` en escritorio se reducen cabecera, pie y densidad interna. Hasta `900px`, explicación y mapa se apilan, el documento fluye y el pie queda adherido al borde inferior. Hasta `520px` desaparece la línea de pasos, siguen visibles el índice y las flechas, y los controles de operación pueden envolver a otra fila.

El código completo ocupa toda la región visual, sin mapa ni panel flotante. Conserva cabecera y comando a ambos extremos y desplaza el listado en ambos ejes. En el diseño apilado la región mide `820px` de alto; hasta `520px`, `900px`, con cabecera de acciones apilada y saltos de sección en varias filas.

## Elevation & Depth

La estructura usa fondos y divisores finos. Los paneles de operación son planos; el código se distingue por su superficie profunda. Solo los elementos flotantes reciben sombra: los cajones usan `-12px 8px 40px #172c4324` y el detalle de museo usa `0 5px 18px #172c431a`. La ruta activa lleva un filtro leve `drop-shadow(0 3px 3px #204ed51c)` sobre la cartografía desaturada.

## Shapes

Los controles son rectángulos suavizados y los paneles tienen esquinas más amplias. Los genes repiten la forma compacta de los campos. Los marcadores y nodos del proceso son círculos; las etiquetas numéricas refuerzan su identidad. El mapa se recorta dentro de su región mientras las rutas y sus trazos permanecen legibles.

## Components

### Buttons

Las acciones principales usan cobalto y texto blanco; las secundarias, fondo azul pálido y texto cobalto. Comparten peso `600`, altura mínima de `48px` y las medidas del frontmatter. La variante pequeña reduce la altura mínima a `38px`, el texto a `13px` y el relleno a `8px 12px`. Los botones de icono son cuadrados con borde fino; la flecha siguiente adopta el fondo principal. Los botones deshabilitados bajan a opacidad `.4`.

Los cambios de fondo y texto duran `.2s`. El foco visible común es un contorno de oro de `3px`, separado `4px` del elemento.

### Inputs / Fields

La selección usa fondo frío, borde de línea y esquinas de campo. Los rangos conservan el control nativo con acento cobalto y altura de `24px`. Sus etiquetas y salidas numéricas acompañan el dato que modifican; las salidas destacan en azul.

El selector de caso en cabecera usa superficie blanca, texto cobalto de `14px` y peso `600`, ancho mínimo de `220px` y altura mínima de `40px`. Hasta `1100px` se oculta su etiqueta visible; hasta `900px` el mínimo pasa a `190px` y el texto a `13px`. Hasta `520px` mide `148px` de ancho, altura mínima de `36px`, texto de `11px` y relleno de `5px`. Mantiene el nombre accesible del campo.

### Navigation

La navegación inferior mantiene el paso activo en azul y subraya su número. En escritorio solo el paso activo expone su título. El índice abre una superficie flotante de dos columnas; el paso seleccionado usa fondo azul pálido. El progreso se representa mediante una línea de `3px` y una transición de ancho de `.5s` con la curva `cubic-bezier(.16,1,.3,1)`.

### Cards / Containers

Los paneles blancos reúnen una operación y sus controles. Mantienen relleno y radio del frontmatter, sin sombra. Los cajones de notas e índice son superficies flotantes; el primero entra por la derecha y admite hasta `460px` de ancho. El código usa un contenedor azul profundo con cabecera de fuente, números de línea y desplazamiento horizontal.

### Genes and Map

Los genes son celdas flexibles y numeradas. Las rutas de más de doce genes usan diez columnas de ancho flexible, separación de `3px` y texto de `12px`: Lima se lee en dos filas de diez. Las celdas largas miden `24px` de alto en escritorio y `27px` hasta `900px`; en cruce y escritorio de altura reducida miden `22px`. El inicio fijo usa azul sólido; el segmento y los genes intercambiados emplean estados distintos de oro. En las filas compactas de población se reducen las alturas y el inicio fijo adopta un azul más claro.

Los museos mantienen su posición geográfica. El encuadre se calcula para cada conjunto de coordenadas. Cuando las burbujas numeradas se separan para evitar colisiones, una línea guía las conecta con el punto geográfico real; la ruta sigue este último. El punto inicial tiene relleno azul; los demás, blanco con borde azul. Puntero, foco y selección resaltan el museo en oro y permiten mostrar su nombre. La ruta actual es azul continua; la ruta anterior es gris discontinua. El control de nombres muestra su estado presionado con el mismo azul de acción.

**The Stable Geography Rule.** Las transformaciones cambian el orden de la ruta, mientras los marcadores conservan sus coordenadas.

### Complete Code

El listado integral extiende la superficie azul profunda del código hasta los bordes de la región visual, sin radio ni relleno exterior. La cabecera reúne recuento de líneas, descargas y copia; los saltos a Fitness, Población, COX, Mutación, Torneo y Ciclo completo forman una segunda franja. El comando ocupa la franja inferior. Cabecera y secciones usan divisores finos; los botones de sección tienen texto de `11px`, altura mínima de `32px` y relleno de `6px 9px`. El listado conserva números de línea, texto monoespaciado y desplazamiento propio. El salto resalta la definición seleccionada; copia comunica éxito o alternativa de descarga. El foco mantiene el contorno de oro común.

La preferencia de movimiento reducido limita animaciones y transiciones a `.01ms` y una sola iteración.

## Do's and Don'ts

### Do:

- **Do** conservar el cobalto para la ruta y la acción activa.
- **Do** acompañar los estados de operación con números, etiquetas o métricas.
- **Do** mantener el foco de oro visible en controles operables.
- **Do** permitir lectura y navegación cuando la presentación se apila en móvil.

### Don't:

- **Don't** mover los museos para ilustrar un cambio de orden de visita.
- **Don't** colorear supervivientes por un origen individual que la traza no contiene.
- **Don't** aplicar sombras a todos los paneles de operación.
- **Don't** depender de fuentes remotas durante la exposición.


## Recorridos viales y matrices · 12 de noviembre de 2026

Lima representa las polilíneas de cada par dirigido de openrouteservice, sin interpolar sus vértices a través de edificios. Los lugares conservan sus puntos geográficos. Una transición de850ms dibuja los tramos nuevos en oro hacia cobalto; los compartidos permanecen y los anteriores se distinguen en gris discontinuo. La comparación explícita mantiene las conexiones anteriores para explicarlas. Al reducir movimiento, el estado cambia de inmediato. La leyenda identifica actual/anterior y cuenta las conexiones nuevas y retiradas; no se consultan servicios durante las animaciones.

La misma interfaz de mapa sirve al caso Estambul con conexiones esquemáticas explícitamente rotuladas: sus matrices originales no incluyen geometrías. No se atribuye trazado vial a esas rectas.

Dataset alterna lista de destinos y tabla desplazable. La celda elegida usa cobalto y el par se dibuja en el mapa. Selectores nativos e inversión de recorrido ofrecen una alternativa a las celdas densas; en la tabla solo la celda activa entra al orden de tabulación y las flechas cambian de celda sin navegar la exposición. Sus coordenadas y unidades se comunican también como texto. La atribución ORS/OSM y la licencia quedan al pie fuera del panel de operación.


## Visor Leaflet · 12 de noviembre de 2026

El usuario sustituyó expresamente el mapa SVG propio por Leaflet 1.9.4 estable. Navegación nativa con rueda, doble clic, arrastre, teclado y pinch; +/− localizados y encuadre. Se eliminan la cámara, la proyección y la separación artificial de marcadores. Los divIcon numerados permanecen en coordenadas exactas; las fichas son popups nativos con contenido DOM seguro y altura desplazable. Las rutas son L.polyline sobre coordenadas ORS sin cambios, con transiciones por conexiones compartidas/nuevas/retiradas.

El fondo de calles conserva color y contraste, sin desaturación. El mapa tiene al menos 240 px útiles en escritorio y 380 px en móvil, con cabecera/leyenda fuera de su superficie. Leaflet, CSS y licencia BSD-2-Clause son locales; las teselas detalladas OSM se solicitan solo al navegar. La atribución nativa y la escala permanecen visibles. Las imágenes previas de base quedan como respaldo; un aviso señala fallos parciales sin ocultarse cuando carga otra tesela. No se regeneran datos ni se consulta ORS desde la exposición.
