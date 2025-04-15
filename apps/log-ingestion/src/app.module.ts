import { Module } from '@nestjs/common';
import { LogIngestionDBModule } from '../../../libs/db/src/log-ingestion-db/log-ingestion-db.module';
import { LogsController } from './logs/log.controller';
import { LogsService } from './logs/log.service';

@Module({
  imports: [LogIngestionDBModule],
  controllers: [LogsController],
  providers: [LogsService],
})
export class AppModule {}
