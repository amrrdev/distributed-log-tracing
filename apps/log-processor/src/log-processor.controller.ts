import { Controller, Logger } from '@nestjs/common';
import { LogProcessorService } from './log-processor.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Log } from '@app/proto';

@Controller()
export class LogProcessorController {
  private readonly logger = new Logger(LogProcessorController.name);
  constructor(private readonly logProcessorService: LogProcessorService) {}

  @EventPattern('logs')
  async handleLogMessages(@Payload() log: Log) {
    console.log('finaly, log consumed from kafka\n', log);
    const res = await this.logProcessorService.handleLogMessages(log);
  }
}
