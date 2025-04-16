import { sql } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const dags = pgTable('dags', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  traceId: text('trace_id').notNull(),
  rootSpanId: text('root_span_id').notNull(),
  dagJson: jsonb('dag_json').notNull(),
  timestamp: timestamp().defaultNow(),
});
