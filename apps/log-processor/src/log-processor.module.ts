import { Module } from '@nestjs/common';
import { LogProcessorController } from './log-processor.controller';
import { LogProcessorService } from './log-processor.service';

@Module({
  imports: [],
  controllers: [LogProcessorController],
  providers: [LogProcessorService],
})
export class LogProcessorModule {}
