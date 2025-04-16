import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './libs/db/src/dag-builder-db/dag-builder-db.schema.ts', // path relative to root
  dbCredentials: {
    url: process.env.DAG_DATABASE as string,
  },
});
