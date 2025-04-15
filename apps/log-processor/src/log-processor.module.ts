import { Module } from '@nestjs/common';
import { LogProcessorController } from './log-processor.controller';
import { LogProcessorService } from './log-processor.service';
import { LogIngestionDBModule } from '../../../libs/db/src/log-ingestion-db/log-ingestion-db.module';

@Module({
  imports: [LogIngestionDBModule],
  controllers: [LogProcessorController],
  providers: [LogProcessorService],
})
export class LogProcessorModule {}
