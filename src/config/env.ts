import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'SESSION_SECRET'] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 3000),
  mongodbUri: process.env.MONGODB_URI as string,
  sessionSecret: process.env.SESSION_SECRET as string,
};
