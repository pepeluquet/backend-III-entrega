import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express'

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();
const PORT = process.env.PORT || 8080;
const rawMongoUrl = process.env.MONGO_URL?.trim();
const defaultMongoUrl = 'mongodb://localhost:27017/backend-iii-adopciones?retryWrites=true&w=majority';
const MONGO_URL = rawMongoUrl && rawMongoUrl !== '""' && rawMongoUrl !== "''"
  ? rawMongoUrl.replace(/^['"]|['"]$/g, '')
  : defaultMongoUrl;

mongoose.set('strictQuery', false);

if (!/^mongodb(?:\+srv)?:\/\//.test(MONGO_URL)) {
  console.error('Invalid MONGO_URL scheme. Use mongodb:// or mongodb+srv://.');
  console.error('MONGO_URL actual:', MONGO_URL);
  process.exit(1);
}

// Documentacion
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'AdopMe API',
            description: 'API para la gestion de adopciones de mascotas',
            version: '1.0.0'
        }
    },
    apis: ['./src/docs/**/*.yaml']
}
const specs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(MONGO_URL)
        .then(() => app.listen(PORT, () => console.log(`Listening on ${PORT}`)))
        .catch(err => console.error('Database connection failed', err));
}

export default app;
