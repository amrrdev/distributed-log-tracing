import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  DAG_BUILDER_DB,
  LOG_INGESTION_DB,
} from '../../../libs/db/src/constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Log, LogLevel } from '../../../libs/proto/src';
import { logs } from '../../../libs/db/src/log-ingestion-db/log-ingestion.schema';
import { eq } from 'drizzle-orm';
import { dags } from '../../../libs/db/src/dag-builder-db/dag-builder-db.schema';
import { tryCatch } from '../../../libs/types/error';

type LogNode = {
  spanId: string;
  parentId: string | null;
  service: string;
  message: string;
  children: LogNode[];
};

@Injectable()
export class LogProcessorService {
  private readonly logger = new Logger(LogProcessorService.name);
  constructor(
    @Inject(LOG_INGESTION_DB) private readonly logIngestionDB: NodePgDatabase,
    @Inject(DAG_BUILDER_DB) private readonly dagBuilderDB: NodePgDatabase,
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

  private mapEnumToNums(logLevel: LogLevel) {
    switch (logLevel) {
      case LogLevel.LOG_LEVEL_INFO:
        return 0;
      case LogLevel.LOG_LEVEL_DEBUG:
        return 1;
      case LogLevel.LOG_LEVEL_WARN:
        return 2;
      case LogLevel.LOG_LEVEL_ERROR:
        return 3;
      case LogLevel.LOG_LEVEL_FATAL:
        return 4;
      default:
        return -1;
    }
  }

  private async buildDag(traceId: string) {
    const result = await this.logIngestionDB
      .select()
      .from(logs)
      .where(eq(logs.traceId, traceId));

    const nodesMap = new Map<string, LogNode>();

    for (const log of result) {
      nodesMap.set(log.spanId, {
        spanId: log.spanId,
        parentId: log.parentId,
        service: log.service,
        message: log.message,
        children: [],
      });
    }

    const roots: LogNode[] = [];

    for (const node of nodesMap.values()) {
      if (node.parentId && nodesMap.has(node.parentId)) {
        nodesMap.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    const rootSpanId = roots[0].spanId;
    try {
      await this.dagBuilderDB.insert(dags).values({
        traceId,
        rootSpanId,
        dagJson: Object.fromEntries(nodesMap),
      });
    } catch (err) {
      this.logger.error(`Failed to save DAG for traceId ${traceId}`, err);
    }
  }

  async handleLogMessages(log: Log) {
    const { data, error } = await tryCatch(this._handleLogMessages(log));
    if (error) {
      this.logger.error('Could not write log to DB', error);
    }
    return data;
  }

  async _handleLogMessages(log: Log) {
    await this.logIngestionDB.insert(logs).values({
      traceId: log.traceId,
      parentId: log.parentId || null,
      spanId: log.spanId,
      service: log.service,
      level: this.mapEnum(log.level),
      message: log.message,
    });

    if (Number(log.level) === this.mapEnumToNums(LogLevel.LOG_LEVEL_ERROR)) {
      await this.buildDag(log.traceId);
    }
  }
}
