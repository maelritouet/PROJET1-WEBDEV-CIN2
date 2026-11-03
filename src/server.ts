import { app } from './app';
import { connectDatabase } from './config/db';
import { env } from './config/env';

const start = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error instanceof Error ? error.message : error);
    // eslint-disable-next-line no-console
    console.error(
      'Exemple local : démarrez MongoDB puis réessayez (URI par défaut: mongodb://localhost:27017/vie-associative).'
    );
    process.exit(1);
  }
};

start();
