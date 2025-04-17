import { Module } from '@nestjs/common';
import { QueryController } from './query-service.controller';
import { QueryService } from './query-service.service';
import { LogIngestionDBModule } from '../../../libs/db/src/log-ingestion-db/log-ingestion-db.module';
import { DagBuilderDBModule } from '../../../libs/db/src/dag-builder-db/dag-builder-db.module';

@Module({
  imports: [LogIngestionDBModule, DagBuilderDBModule],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
