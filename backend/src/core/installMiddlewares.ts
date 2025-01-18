import type { Express } from 'express';
import bodyParser from 'body-parser';
import config from 'config';
import cors from 'cors';
import { loggingMiddleware } from './loggingMiddleware';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from '../../swagger.config';

const corsOptions = {
  origin: config.get<string[]>('cors.origins'),
  optionsSuccessStatus: 200,
};

export default function installMiddlewares(app: Express) {
  const specs = swaggerJsdoc(swaggerOptions);
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(loggingMiddleware);
  app.use(bodyParser.json());
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

}
 