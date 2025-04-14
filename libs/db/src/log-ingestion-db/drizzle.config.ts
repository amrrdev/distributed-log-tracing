import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './libs/db/src/log-ingestion-db/log-ingestion.schema.ts', // path relative to root
  dbCredentials: {
    url: process.env.LOG_INGESTION_DATABASE as string,
  },
});
