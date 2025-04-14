import { PROPERTY_DEPS_METADATA } from '@nestjs/common/constants';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './libs/db/src/log-ingestion-db/dag-builder-db.schema.ts', // path relative to root
  dbCredentials: {
    url: process.env.DAG_DATABASE as string,
  },
});
