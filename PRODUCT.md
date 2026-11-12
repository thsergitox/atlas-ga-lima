# Atlas GA · Lima
<!-- impeccable:product-schema 1 -->
## Platform
web
## Users
Estudiantes que exponen Computación Evolutiva y su profesor. Se usa en proyector para revisar cada paso del código de un algoritmo genético.
## Product Purpose
Explicar el paper de Şehab y Turan (2024) y el port Python de Arbues mediante diapositivas, fórmulas, código y mapas animados, con dos casos seleccionables: veinte museos de Lima y los doce destinos originales de Estambul.
## Operating Context
Navegación manual por diapositivas, demostraciones repetibles de operadores, notas del expositor y enlaces al código fuente. El usuario pidió crear un repositorio y desplegar con Vercel CLI.
## Capabilities and Constraints
Conservar la paleta azul existente. No ejecutar builds. Distinguir paper, implementación y adaptación. Lima usa380 recorridos de openrouteservice con distancias viales, tiempos estimados y geometrías; costo y presupuesto siguen siendo hipótesis académicas explícitas. Sin tráfico en vivo. Estambul conserva coordenadas, matrices y población inicial del repositorio; sus resultados visibles son de una nueva ejecución, no la tabla del paper. No afirmar optimalidad global del GA. Preservar la web anterior.
## Brand Commitments
Atlas GA. Español claro, matemáticas verificables y mapa como objeto central.
## Evidence on Hand
Paper local ../proyecto/peerj-cs-10-2340.pdf; Python clonado en ../ga-itinerary-planning-pc3, commit e84 ed98 c8 ecd65 bf269 da847 ee26147 f1 f282 d70; implementación MATLAB ../GA-for-Itinerary-Planning.
## Product Principles
Cada animación representa una operación real. Cada fragmento apunta a su fuente. El algoritmo completo se ofrece al final y sus datos descargables dependen del caso elegido. Los supuestos del caso local son visibles. La exposición funciona sin servicios externos en tiempo de presentación.
