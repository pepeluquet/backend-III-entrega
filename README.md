# Proyecto de Adopciones — Entrega Final Backend III

API en Node.js/Express para gestionar adopciones de mascotas.

## Enlaces de entrega

| Recurso | URL |
|--------|-----|
| **Repositorio GitHub** (código, tests, Dockerfile) | https://github.com/pepeluquet/backend-III-entrega |
| **Docker Hub (usuario)** | https://hub.docker.com/u/pepeluquet |
| **Imagen Docker pública** | https://hub.docker.com/r/pepeluquet/adopciones-api |
| **Tests de adopciones** | https://github.com/pepeluquet/backend-III-entrega/blob/main/test/adoptions.router.test.js |

Imagen publicada en Docker Hub con tags `v1.0.0` y `latest`.

## Estructura del proyecto

- `src/app.js`: Configuración principal de Express, rutas y Swagger.
- `src/routes/adoption.router.js`: Endpoints de adopción.
- `src/controllers/adoptions.controller.js`: Lógica de negocio.
- `src/services/index.js`: Servicios/repositories (mockeados en tests).
- `test/adoptions.router.test.js`: Tests funcionales con **Sinon** (mocks) y **Supertest**.
- `Dockerfile`: Imagen optimizada (`node:20-alpine`, capas en caché, usuario no root).
- `.dockerignore`: Excluye `node_modules`, tests y archivos locales.

### Endpoints cubiertos por tests

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/adoptions` | Listar adopciones |
| `GET` | `/api/adoptions/:aid` | Obtener adopción por ID |
| `POST` | `/api/adoptions/:uid/:pid` | Crear adopción (usuario + mascota) |

Los tests aíslan MongoDB y la base de datos mediante stubs de `adoptionsService`, `usersService` y `petsService`.

## Tests funcionales

### Requisitos

- Node.js 18+ recomendado
- `npm install` en la raíz del proyecto

### Ejecutar

```bash
npm test
```

Salida esperada (resumen): **12 passing** — casos de éxito, validación (400), no encontrado (404) y error de servidor (500).

### Evidencia de tests

Salida verificada en [`docs/evidencias/tests-output.txt`](docs/evidencias/tests-output.txt) (**12 passing**). Puedes añadir una captura en `docs/evidencias/tests.png` si lo pide la entrega. Ejemplo de salida exitosa:

```
Adoption router - functional tests
  GET /api/adoptions
    √ returns 200 and all adoptions on success
    √ returns 500 when the service throws
  GET /api/adoptions/:aid
    √ returns 200 and the adoption when found
    √ returns 400 for an invalid adoption id
    √ returns 404 when the adoption does not exist
    √ returns 500 when the service throws
  POST /api/adoptions/:uid/:pid
    √ returns 201 when adoption is created successfully
    ...
12 passing
```

## Variables de entorno y MongoDB

La API lee `MONGO_URL` desde el entorno (`src/app.js`). Si no la defines, usa por defecto MongoDB local: `mongodb://localhost:27017/backend-iii-adopciones`. Para Atlas u otra URI, define `MONGO_URL` en `.env` (ver `.env.example`).

| Escenario | Formato de `MONGO_URL` | Base de datos sugerida (entrega final) |
|-----------|------------------------|----------------------------------------|
| **Mongo local** (`mongod` en tu PC) | `mongodb://localhost:27017/...` | `backend-iii-adopciones` |
| **Docker → Mongo en el host** | `mongodb://host.docker.internal:27017/...` | `backend-iii-adopciones` |
| **MongoDB Atlas** | `mongodb+srv://usuario:contraseña@cluster....mongodb.net/adopme?retryWrites=true&w=majority` | `adopme` |

Plantilla sin secretos: copia `.env.example` a `.env` y pega tu URI de Atlas. **No commitees `.env`** (está en `.gitignore`).

**Atlas (ejemplo de formato, sin credenciales reales):**

```
mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/adopme?retryWrites=true&w=majority
```

> Importante: si usas PowerShell, envía la variable con comillas dobles y evita incluir comillas simples dentro del valor. Si el valor recibe comillas adicionales, el proyecto las elimina al iniciar.

En Docker usas la **misma** cadena Atlas con `-e MONGO_URL="..."` (no hace falta `host.docker.internal` para Atlas).

## Docker

### Construir imagen local

```bash
docker build -t pepeluquet/adopciones-api:v1.0.0 .
```

### Ejecutar contenedor

La API necesita MongoDB en ejecución (local, Atlas o contenedor). Sin Mongo verás el contenedor **Up** pero la API no escuchará en el puerto hasta conectar.

#### Mongo local en el host (PowerShell)

Cuando `mongod` corre en Windows y el contenedor debe llegar al puerto 27017 del PC:

```powershell
docker run --rm -p 8080:8080 `
  -e MONGO_URL="mongodb://host.docker.internal:27017/backend-iii-adopciones?retryWrites=true&w=majority" `
  -e PORT=8080 `
  pepeluquet/adopciones-api:v1.0.0
```

#### MongoDB Atlas (PowerShell)

Pega **tu** URI desde Atlas (Connect → Drivers → Node). No la subas al repo; puedes guardarla solo en `.env` local.

```powershell
# Opción recomendada: variable de entorno en la sesión (evita pegar la URL en el historial del README)
$env:MONGO_URL = "mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/backend-iii-adopciones?retryWrites=true&w=majority"

docker run --rm -p 8080:8080 `
  -e MONGO_URL="$env:MONGO_URL" `
  -e PORT=8080 `
  pepeluquet/adopciones-api:v1.0.0
```

Comprueba en el navegador: `http://localhost:8080/api/docs` (Swagger). En los logs del contenedor debe aparecer `Listening on 8080`.

| Variable | Obligatoria | Ejemplo local (Docker) | Ejemplo Atlas |
|----------|-------------|------------------------|---------------|
| `MONGO_URL` | Sí (en Docker) | `mongodb://host.docker.internal:27017/backend-iii-adopciones?retryWrites=true&w=majority` | `mongodb+srv://usuario:pass@cluster....mongodb.net/backend-iii-adopciones?retryWrites=true&w=majority` |
| `PORT` | No (default 8080) | `8080` | `8080` |
| `NODE_ENV` | No | `production` (Dockerfile) | `production` (Dockerfile) |

### Limpieza local (empezar de cero)

Si antes probaste con nombres de plantilla, elimina contenedores e imágenes incorrectos. **No borres** `pepeluquet/adopciones-api:v1.0.0` si acabas de construirla bien.

**Contenedores a eliminar** (nombres de ejemplo vistos con imagen incorrecta):

- `recursing_kare`, `musing_panini`, `ecstatic_shirley` (o cualquier contenedor basado en `tu-usuario-dockerhub/...`)

**Imágenes a eliminar:**

| Imagen incorrecta | Motivo |
|-------------------|--------|
| `tu-usuario-dockerhub/adopciones-api:v1.0.0` | Placeholder del curso, no tu usuario Hub |
| `create/aws:latest` | Imagen de ejemplo/tutorial, no es tu API |

**PowerShell:**

```powershell
# Ver qué hay
docker ps -a
docker images

# Parar y borrar contenedores viejos (ajusta los NAMES si difieren)
docker rm -f recursing_kare musing_panini ecstatic_shirley

# Borrar imágenes incorrectas
docker rmi tu-usuario-dockerhub/adopciones-api:v1.0.0
docker rmi create/aws:latest

# Reconstruir la imagen correcta desde la raíz del proyecto
docker build -t pepeluquet/adopciones-api:v1.0.0 .
```

### Buenas prácticas aplicadas

- Imagen base **Alpine** (`node:20-alpine`) para menor tamaño.
- **Capas en caché**: `package.json` + `package-lock.json` antes del código.
- **`npm ci --omit=dev`**: instalación reproducible solo de producción.
- **`.dockerignore`**: sin `node_modules` ni carpeta `test` en la imagen.
- **Usuario no root** (`USER node`) en runtime.
- Variables: `NODE_ENV`, `PORT`, `MONGO_URL`.

## Publicación en Docker Hub

Repositorio sugerido: `pepeluquet/adopciones-api` (público).

```bash
# 1. Build local
docker build -t pepeluquet/adopciones-api:v1.0.0 .

# 2. Tag latest (opcional)
docker tag pepeluquet/adopciones-api:v1.0.0 pepeluquet/adopciones-api:latest

# 3. Login (credenciales de https://hub.docker.com/u/pepeluquet)
docker login

# 4. Push
docker push pepeluquet/adopciones-api:v1.0.0
docker push pepeluquet/adopciones-api:latest
```

### Escaneo de seguridad en Docker Hub

1. Entra a https://hub.docker.com/r/pepeluquet/adopciones-api
2. Abre la pestaña **Tags** → selecciona `v1.0.0` o `latest`
3. Usa **Scan** / **View scan results** (análisis de vulnerabilidades de la imagen)

Alternativa local (Docker Scout, si está instalado):

```bash
docker scout quickview pepeluquet/adopciones-api:v1.0.0
```

## Documentación API

Swagger UI: `http://localhost:8080/api/docs` (con el servidor o contenedor en ejecución).

## Checklist de entrega final

| # | Requisito | Cómo verificar |
|---|-----------|----------------|
| 1 | Repo GitHub público con código, tests y Dockerfile | https://github.com/pepeluquet/backend-III-entrega |
| 2 | Tests funcionales con mocks (Sinon + Supertest) | `npm test` → **12 passing** |
| 3 | `supertest` en `devDependencies` | `package.json` |
| 4 | Dockerfile + `.dockerignore` optimizados | Build local sin errores |
| 5 | Imagen en Docker Hub: `pepeluquet/adopciones-api:v1.0.0` | Tag visible en https://hub.docker.com/r/pepeluquet/adopciones-api |
| 6 | Escaneo de seguridad en Hub (pestaña Tags → Scan) | Captura del resultado |
| 7 | README con instrucciones build/run/push | Este archivo |
