import dotenv from 'dotenv';

dotenv.config();

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT ?? 3000,
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}
