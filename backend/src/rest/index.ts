import type { Express } from 'express';
import appointmentRouter from './appointment';
import healthRouter from './health';
import reviewRouter from './review';
import staffRouter from './staff';
import authRouter from './auth';
import { requireAuthentication } from '../core/auth';

export default function installRest(app: Express) {
  app.use('/api/auth', authRouter); 

  app.use('/api/appointments', requireAuthentication, appointmentRouter);
  app.use('/api/reviews', reviewRouter);
  app.use('/api/staff', staffRouter); 
  app.use('/api/health', healthRouter); 

}
