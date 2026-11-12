# Fichas, zoom y Estambul ORS

**Objetivo:** explorar cada museo y el mapa sin salir de la exposición; comparar el dataset histórico con recorridos ORS para las mismas doce coordenadas.

**Diseño:** conservar SVG, tipografía y paleta. Ficha flotante blanca con nombre, descripción verificada, ubicación y fuente; cierre, Escape y teclado. Controles +/−, encuadrar y desplazamiento; marcadores de tamaño constante. Sin dependencia nueva.

**Comparación:** tercer caso Estambul ORS. Preservar intacto `data/paper/`. Sustituir solamente D/T con 132 pares dirigidos, mantener C histórica y las 100 rutas iniciales originales. Evaluar las dos mejores rutas sobre las mismas matrices ORS; no comparar directamente fitness de matrices distintas ni atribuir diferencias causales a una única corrida aleatoria.

**Restricciones:** sin builds, semillas ni nuevos entornos/suites. Clave solo local. Información adicional en archivo independiente para no invalidar la caché de rutas. Sin horarios, precios ni identidades no verificados.

- [x] Generalizar adquisición por caso, recoger 132 pares con caché y procedencia; exportar experimento y comparación reproducible desde trazas guardadas.
- [x] Crear fichas accesibles e información con fuentes, separadas del controlador de presentación.
- [x] Añadir cámara SVG con zoom, encuadre y pan; conservar geometría y controles de teclado.
- [x] Integrar tercer caso y comparación en Resultado; revisar notas, fórmulas y descargas.
- [x] Verificar datos/sintaxis y navegador desktop/móvil/reduced motion; revisión independiente y despliegue autorizado.

**Foco de revisión:** esquinas de pantalla/fichas largas; zoom durante mutación y cambio de slide/caso; teclado sin avanzar accidentalmente; rutas asimétricas completas; costos y métricas de comparación honestos.
