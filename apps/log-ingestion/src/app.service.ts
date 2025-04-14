import { Inject, Injectable } from '@nestjs/common';
import { LOG_INGESTION_DB } from '../../../libs/db/src/constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { logs } from '../../../libs/db/src/log-ingestion-db/log-ingestion.schema';

@Injectable()
export class AppService {
  constructor(
    @Inject(LOG_INGESTION_DB)
    private readonly logIngestionDB: NodePgDatabase,
  ) {}
  async getHello() {
    const res = await this.logIngestionDB.select().from(logs);
    console.log(res);
  }
}
