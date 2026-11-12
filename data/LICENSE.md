# Licencias de los datos

## Resultados viales de Lima

`routes.geojson` contiene resultados de openrouteservice by HeiGIT, calculados sobre datos de OpenStreetMap. Se distribuyen bajo **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** según los términos de HeiGIT consultados el12de noviembre de2026.

- Atribución: © openrouteservice by HeiGIT | © OpenStreetMap contributors.
- Licencia: https://creativecommons.org/licenses/by-sa/4.0/
- Términos: https://account.heigit.org/info/tos
- Datos de origen: https://www.openstreetmap.org/copyright

Las matrices de distancia y tiempo de Lima (`distance.csv`, `time.csv`) y sus valores incorporados a `experiment.json` son conversiones de metros a kilómetros y de segundos a minutos. `cost.csv` aplica una fórmula académica a esas distancias. Estos archivos derivados de Lima también se ofrecen bajo CC BY-SA 4.0. Se deben conservar la atribución, la licencia y la identificación de modificaciones al redistribuirlos.

`provenance.json` identifica perfil, fechas, hash del GeoJSON y separaciones entre puntos de museo y accesos a la red vial. No contiene credenciales. Los costos son supuestos; las duraciones son estimaciones sin tráfico en vivo, no mediciones de viajes.

## Coordenadas, mapas y datos anteriores

Las ubicaciones de museos y las teselas proceden de OpenStreetMap, con atribución y condiciones de sus datos ODbL. Los enlaces de procedencia se conservan en `museums.json` y `basemap.json`. El histórico en `archive/haversine/` identifica la aproximación anterior; no contiene rutas adquiridas de ORS.

`paper/` conserva los archivos originales y la procedencia del repositorio de Arbues. No se sustituyen sus matrices ni se atribuyen a ORS.

## Código

El código del proyecto mantiene su licencia MIT. La licencia de los resultados cartográficos no se presenta como licencia del código de la interfaz.
