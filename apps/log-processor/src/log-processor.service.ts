import { Inject, Injectable, Logger } from '@nestjs/common';
import { LOG_INGESTION_DB } from '../../../libs/db/src/constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Log, LogLevel } from '../../../libs/proto/src';
import { logs } from '../../../libs/db/src/log-ingestion-db/log-ingestion.schema';

@Injectable()
export class LogProcessorService {
  private readonly logger = new Logger(LogProcessorService.name);
  constructor(
    @Inject(LOG_INGESTION_DB) private readonly logIngestionDB: NodePgDatabase,
  ) {}

  private mapEnum(logLevel: LogLevel) {
    switch (logLevel) {
      case LogLevel.LOG_LEVEL_INFO:
        return 'info';
      case LogLevel.LOG_LEVEL_WARN:
        return 'warn';
      case LogLevel.LOG_LEVEL_ERROR:
        return 'error';
      case LogLevel.LOG_LEVEL_DEBUG:
        return 'debug';
      case LogLevel.LOG_LEVEL_FATAL:
        return 'fatel';
      default:
        return 'info';
    }
  }

  async handleLogMessages(log: Log) {
    try {
      return await this.logIngestionDB.insert(logs).values({
        traceId: log.traceId,
        parentId: log.parentId || null,
        spanId: log.spanId,
        service: log.service,
        level: this.mapEnum(log.level),
        message: log.message,
      });
    } catch (err) {
      this.logger.warn('could not write log to db');
    }
  }
}
