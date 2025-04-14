import { Controller, Get } from '@nestjs/common';
import { LogProcessorService } from './log-processor.service';

@Controller()
export class LogProcessorController {
  constructor(private readonly logProcessorService: LogProcessorService) {}

  @Get()
  getHello(): string {
    return this.logProcessorService.getHello();
  }
}
