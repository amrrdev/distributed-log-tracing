import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  DAG_BUILDER_DB,
  LOG_INGESTION_DB,
} from '../../../libs/db/src/constants';
import {
  Dag,
  DagList,
  Empty,
  LogList,
  Log,
  QueryServiceController,
  TraceIdRequest,
} from '../../../libs/proto/src/query';
import { logs } from '../../../libs/db/src/log-ingestion-db/log-ingestion.schema';
import { dags } from '../../../libs/db/src/dag-builder-db/dag-builder-db.schema';
import { eq } from 'drizzle-orm';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { tryCatch } from '../../../libs/types/error';

@Injectable()
export class QueryService implements QueryServiceController {
  constructor(
    @Inject(LOG_INGESTION_DB) private readonly logIngestionDB: NodePgDatabase,
    @Inject(DAG_BUILDER_DB) private readonly dagBuilderDB: NodePgDatabase,
  ) {}

  async getLogs(request: Empty): Promise<LogList> {
    const { data, error } = await tryCatch(this._getLogs(request));
    if (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to fetch logs.',
      });
    }

    return data;
  }

  async getDags(request: Empty): Promise<DagList> {
    const { data, error } = await tryCatch(this._getDags(request));
    if (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to fetch dags',
      });
    }

    return data;
  }

  async getLogsByTraceId(request: TraceIdRequest): Promise<LogList> {
    const { data, error } = await tryCatch(this._getLogsByTraceId(request));
    if (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to fetch logs by trace id',
      });
    }
    return data;
  }

  async getDagByTraceId(request: TraceIdRequest): Promise<Dag> {
    const { data, error } = await tryCatch(this._getDagByTraceId(request));
    if (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to fetch dags',
      });
    }

    return data;
  }

  private async _getLogs(request: Empty): Promise<LogList> {
    console.log('amr');
    const logResults = await this.logIngestionDB
      .select({
        traceId: logs.traceId,
        parentId: logs.parentId,
        spanId: logs.spanId,
        service: logs.service,
        message: logs.message,
        level: logs.level,
        timestamp: logs.timestamp,
      })
      .from(logs);
    return {
      logs: logResults.map((log) => {
        return {
          ...log,
          timestamp: String(log.timestamp),
        };
      }),
    };
  }

  private async _getDags(request: Empty): Promise<DagList> {
    const dagResult = await this.dagBuilderDB
      .select({
        traceId: dags.traceId,
        rootSpanId: dags.traceId,
        dagJson: dags.dagJson as Record<string, any>,
      })
      .from(dags);
    return { dags: dagResult };
  }

  private async _getLogsByTraceId(request: TraceIdRequest): Promise<LogList> {
    const logResult = await this.logIngestionDB
      .select({
        traceId: logs.traceId,
        parentId: logs.parentId,
        spanId: logs.spanId,
        service: logs.service,
        message: logs.message,
        level: logs.level,
        timestamp: logs.timestamp,
      })
      .from(logs)
      .where(eq(logs.traceId, request.traceId));
    return {
      logs: logResult.map((log) => {
        return {
          ...log,
          timestamp: String(log.timestamp),
        };
      }),
    };
  }

  private async _getDagByTraceId(request: TraceIdRequest): Promise<Dag> {
    const dagResult = await this.dagBuilderDB
      .select({
        traceId: dags.traceId,
        rootSpanId: dags.rootSpanId,
        dagJson: dags.dagJson as Record<string, any>,
      })
      .from(dags)
      .where(eq(dags.traceId, request.traceId))
      .limit(1);

    return dagResult[0];
  }
}
