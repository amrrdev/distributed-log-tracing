import { sql } from 'drizzle-orm';
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const logLevelEnum = pgEnum('log_level', [
  'info',
  'warn',
  'error',
  'debug',
  'fatel',
]);

export const logs = pgTable(
  'logs',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    traceId: text('trace_id').notNull(),
    parentId: text('parent_id'),
    spanId: text('span_id').notNull(),
    service: text().notNull(),
    level: logLevelEnum('level'),
    message: text('message').notNull(),
    timestamp: timestamp('timestamp').defaultNow(),
  },
  (table) => [
    index('trace_id_idx').on(table.traceId),
    index('parent_id_idx').on(table.parentId),
    index('span_id_idx').on(table.spanId),
    index('level_idx').on(table.level),
  ],
);
