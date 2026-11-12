# Atlas GA · Lima
<!-- impeccable:product-schema 1 -->
## Platform
web
## Users
Estudiantes que exponen Computación Evolutiva y su profesor. Se usa en proyector para revisar cada paso del código de un algoritmo genético.
## Product Purpose
Explicar el paper de Şehab y Turan (2024) y el port Python de Arbues mediante diapositivas, fórmulas, código y mapas animados, con tres casos seleccionables: veinte museos de Lima, los doce destinos originales de Estambul y su adaptación vial con ORS.
## Operating Context
Navegación manual por diapositivas, demostraciones repetibles de operadores, notas del expositor y enlaces al código fuente. El usuario pidió crear un repositorio y desplegar con Vercel CLI.
## Capabilities and Constraints
Conservar la paleta azul existente. No ejecutar builds. Distinguir paper, implementación y adaptación. Lima usa380 recorridos de openrouteservice con distancias viales, tiempos estimados y geometrías; costo y presupuesto siguen siendo hipótesis académicas explícitas. Sin tráfico en vivo. El caso Paper conserva coordenadas, matrices y población inicial del repositorio; sus resultados visibles son de una nueva ejecución, no la tabla del paper. Estambul ORS conserva coordenadas, población inicial y C histórica, sustituyendo solo D/T; ambas mejores rutas se comparan sobre matrices ORS comunes. Fichas de museo con fuentes y visor Leaflet 1.9.4 con zoom/pan nativos. No afirmar optimalidad global del GA. Preservar la web anterior.
## Brand Commitments
Atlas GA. Español claro, matemáticas verificables y mapa como objeto central.
## Evidence on Hand
Paper local ../proyecto/peerj-cs-10-2340.pdf; Python clonado en ../ga-itinerary-planning-pc3, commit e84ed98c8ecd65bf269da847ee26147f1f282d70; implementación MATLAB ../GA-for-Itinerary-Planning.
## Product Principles
Cada animación representa una operación real. Cada fragmento apunta a su fuente. El algoritmo completo se ofrece al final y sus datos descargables dependen del caso elegido. Los supuestos del caso local son visibles. Las rutas y trazas funcionan sin nuevas consultas a ORS. Leaflet y las fórmulas son locales; las nuevas teselas de calles requieren conexión, con una base local previa como respaldo.
