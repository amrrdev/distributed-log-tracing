import { Module } from '@nestjs/common';
import { LogProcessorController } from './log-processor.controller';
import { LogProcessorService } from './log-processor.service';
import { LogIngestionDBModule } from '../../../libs/db/src/log-ingestion-db/log-ingestion-db.module';
import { DagBuilderDBModule } from '../../../libs/db/src/dag-builder-db/dag-builder-db.module';

@Module({
  imports: [LogIngestionDBModule, DagBuilderDBModule],
  controllers: [LogProcessorController],
  providers: [LogProcessorService],
})
export class LogProcessorModule {}
