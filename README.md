# Proyecto de Adopciones

Este proyecto es una API en Node.js/Express para gestionar adopciones de mascotas.

## Estructura del proyecto

- `src/app.js`: Configuración principal de Express, rutas y Swagger.
- `src/routes/adoption.router.js`: Router con los endpoints de adopción.
- `src/controllers/adoptions.controller.js`: Lógica de negocio de las adopciones.
- `src/services/index.js`: Inicializa servicios/repositories para usuarios, mascotas y adopciones.
- `test/adoptions.router.test.js`: Tests funcionales de los endpoints de adopciones.
- `Dockerfile`: Definición de la imagen Docker optimizada.
- `.dockerignore`: Evita copiar archivos innecesarios a la imagen.

## Cómo ejecutar los tests funcionales

1. Instala dependencias:

```bash
npm install
```

2. Ejecuta los tests:

```bash
npm test
```

Los tests cubren:

- `GET /api/adoptions`: listar todas las adopciones.
- `GET /api/adoptions/:aid`: obtener adopción por ID.
- `POST /api/adoptions/:uid/:pid`: crear adopción vinculando usuario y mascota.

## Construcción de la imagen Docker

1. Construye la imagen localmente:

```bash
docker build -t tu-usuario-dockerhub/adopciones-api:v1.0.0 .
```

2. Ejecuta el contenedor:

```bash
docker run -d -p 8080:8080 \
  -e MONGO_URL="mongodb://host.docker.internal:27017/clase39-adopme" \
  -e PORT=8080 \
  tu-usuario-dockerhub/adopciones-api:v1.0.0
```

> En Windows, si el contenedor necesita conectarse a MongoDB local, `host.docker.internal` suele ser la opción correcta.

## Buenas prácticas aplicadas en Docker

- **Imagen base ligera**: se usa `node:20-alpine` para reducir tamaño.
- **Optimización de capas**: copia `package.json` y `package-lock.json` antes del código para aprovechar cache de Docker.
- **`.dockerignore`**: excluye `node_modules`, logs, tests y archivos de configuración locales.
- **Variables de entorno**: `NODE_ENV`, `PORT` y `MONGO_URL` facilitan despliegues seguros.

## Publicación en DockerHub

1. Crea un repositorio público en DockerHub.
2. Etiqueta la imagen local con un tag claro, por ejemplo:

```bash
docker tag tu-usuario-dockerhub/adopciones-api:v1.0.0 tu-usuario-dockerhub/adopciones-api:latest
```

3. Inicia sesión y sube la imagen:

```bash
docker login

docker push tu-usuario-dockerhub/adopciones-api:v1.0.0
```

4. Revisa la opción de escaneo de vulnerabilidades en DockerHub para la imagen recién subida.

## Documentación y evidencias

- Añade capturas de pantalla o logs de los tests con `npm test` pasando correctamente.
- Añade capturas de la construcción de la imagen exitosa y del `docker push`.
- Si entregas el proyecto, incluye URLs públicas: repo GitHub y URL de la imagen de DockerHub.

## Recomendaciones de entrega

- No incluyas `node_modules` en el repositorio.
- Mantén el repositorio limpio y con `.dockerignore` funcionando.
- Explica en tu entrega por qué elegiste `node:20-alpine` y cómo minimizaste capas en el Dockerfile.
- Asegúrate de que todas las URLs sean accesibles públicamente.
