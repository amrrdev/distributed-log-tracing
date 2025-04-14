import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogIngestionDBModule } from '../../../libs/db/src/log-ingestion-db/log-ingestion-db.module';

@Module({
  imports: [LogIngestionDBModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
