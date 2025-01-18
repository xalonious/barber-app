import { PrismaClient } from '@prisma/client';
import { getLogger } from '../core/logging';

const logger = getLogger();
export const prisma = new PrismaClient();

export async function initializeData() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Failed to connect to the database:', error);
  }
}

export async function shutdownData() {
  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected successfully');
  } catch (error) {
    logger.error('❌ Error disconnecting the database:', error);
  }
}
