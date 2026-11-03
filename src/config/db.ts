import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Connexion MongoDB impossible (${message}). Vérifiez que MongoDB est démarré et que MONGODB_URI est correcte.`
    );
  }
};
