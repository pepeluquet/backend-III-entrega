# Proyecto de Adopciones — Entrega Final Backend III

API en Node.js/Express para gestionar adopciones de mascotas.

## Enlaces de entrega

| Recurso | URL |
|--------|-----|
| **Repositorio GitHub** (código, tests, Dockerfile) | https://github.com/pepeluquet/backend-III-entrega |
| **Docker Hub (usuario)** | https://hub.docker.com/u/pepeluquet |
| **Imagen Docker pública** | https://hub.docker.com/r/pepeluquet/adopciones-api |

> Si la imagen aún no está publicada, sigue la sección [Publicación en Docker Hub](#publicación-en-docker-hub) y actualiza el tag `v1.0.0` / `latest` en tu cuenta.

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

Guarda la salida completa del comando anterior o una captura en `docs/evidencias/tests.png` (opcional). Ejemplo de salida exitosa:

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

## Docker

### Construir imagen local

```bash
docker build -t pepeluquet/adopciones-api:v1.0.0 .
```

### Ejecutar contenedor

La API necesita MongoDB. Ejemplo con Mongo en el host (Windows):

```bash
docker run --rm -p 8080:8080 ^
  -e MONGO_URL="mongodb://host.docker.internal:27017/clase39-adopme?retryWrites=true&w=majority" ^
  -e PORT=8080 ^
  pepeluquet/adopciones-api:v1.0.0
```

Comprueba: `http://localhost:8080/api/docs` (Swagger).

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

## Recomendaciones de entrega

- No subir `node_modules` ni archivos `.env` con secretos.
- Incluir en la entrega: URL del repo, URL de la imagen en Docker Hub, captura o log de `npm test` y de `docker build` / `docker push`.
- Verificar que el repositorio y la imagen sean **públicos** antes de enviar.
