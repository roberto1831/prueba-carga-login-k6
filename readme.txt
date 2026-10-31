PRUEBA DE CARGA DEL SERVICIO DE LOGIN CON K6
============================================

1. OBJETIVO
-----------
Realizar una prueba de carga sobre el servicio de autenticación
POST https://fakestoreapi.com/auth/login utilizando credenciales
almacenadas en un archivo CSV.

La prueba debe garantizar:

- Un throughput mínimo de 20 TPS.
- Un tiempo de respuesta p(95) menor a 1,5 segundos.
- Una tasa de errores inferior al 3 %.
- Una tasa de validaciones exitosas superior al 97 %.

2. VERSIONES UTILIZADAS
-----------------------
- k6: v2.2.0 (go1.26.5, windows/amd64)
- Git: 2.55.0.windows.5
- Sistema operativo: Windows
- Terminal: PowerShell
- IDE: WebStorm

3. ESTRUCTURA DEL REPOSITORIO
-----------------------------

data/users.csv
    Credenciales de entrada (user,passwd)

scripts/login-load-test.js
    Script principal de la prueba de carga

reports/
    report.html
    summary.json
    resumen-consola.txt

readme.txt
    Documentación del proyecto

conclusiones.txt
    Hallazgos y conclusiones finales

4. PASOS DE EJECUCIÓN
---------------------

1) Instalar K6:

   winget install k6 --source winget

2) Verificar la instalación:

   k6 version

3) Clonar el repositorio:

   git clone https://github.com/roberto1831/prueba-carga-login-k6.git

4) Ingresar al proyecto:

   cd prueba-carga-login-k6

5) Abrir el proyecto en WebStorm.

6) Ejecutar una prueba rápida de validación
   (2 TPS durante 20 segundos):

   k6 run -e TPS=2 -e DURATION=20s scripts\login-load-test.js

7) Ejecutar la prueba completa
   (20 TPS durante 3 minutos):

   mkdir reports

   k6 run --quiet --no-color --summary-export=reports/summary.json scripts\login-load-test.js

8) Revisar los resultados:

   - Verificar que el throughput sea cercano a 20 req/s.
   - Verificar que p(95) sea menor a 1500 ms.
   - Verificar que la tasa de errores sea menor al 3 %.
   - Verificar que la tasa de checks sea superior al 97 %.

5. PARÁMETROS CONFIGURABLES
---------------------------

TPS
    Peticiones por segundo.
    Valor por defecto: 20

DURATION
    Duración de la prueba.
    Valor por defecto: 3m

BASE_URL
    URL base del servicio.
    Valor por defecto:
    https://fakestoreapi.com

Ejemplo:

   k6 run -e TPS=30 -e DURATION=5m scripts\login-load-test.js

6. CRITERIOS DE ACEPTACIÓN
--------------------------

- http_req_duration:
  p(95) < 1500 ms

- http_req_failed:
  tasa < 3 %

- checks:
  tasa > 97 %

7. RESULTADOS ESPERADOS
-----------------------

- El throughput debe mantenerse cercano a 20 req/s.
- El percentil 95 debe ser menor a 1500 ms.
- La tasa de errores debe ser menor al 3 %.
- La tasa de checks exitosos debe ser superior al 97 %.

8. NOTAS
---------

- El proyecto fue desarrollado utilizando WebStorm como entorno de desarrollo integrado (IDE).

- La ejecución de las pruebas se realizó desde PowerShell en Windows.

- El escenario utiliza el executor constant-arrival-rate.

- K6 inicia 20 iteraciones por segundo sin esperar que finalice la iteración anterior.

- Cada iteración genera una solicitud HTTP, por lo que 20 iteraciones por segundo equivalen aproximadamente a 20 TPS.

- Los cinco usuarios definidos en el archivo CSV se utilizan de forma rotativa durante la prueba.

- El servicio responde con HTTP 201 (Created) devolviendo un token de autenticación.

- El script acepta como válidas las respuestas HTTP 200 y HTTP 201.

- Los archivos report.html, summary.json y resumen-consola.txt contienen la evidencia de ejecución de la prueba.

9. AUTOR
--------

Ing. Roberto Fernando Toapanta Valencia

Prueba técnica de Performance Testing desarrollada con K6.

Proyecto implementado utilizando WebStorm, PowerShell y Git.