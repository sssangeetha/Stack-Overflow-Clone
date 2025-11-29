import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000'),
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/qa_platform'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
};