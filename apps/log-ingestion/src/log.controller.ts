import { Controller } from '@nestjs/common';
import {
  Log,
  LogAck,
  LogIngestionServiceController,
  LogIngestionServiceControllerMethods,
} from '@app/proto';
import { Observable } from 'rxjs';
import { LogsService } from './log.service';

@Controller()
@LogIngestionServiceControllerMethods()
export class LogsController implements LogIngestionServiceController {
  constructor(private readonly logsService: LogsService) {}

  sendLog(request: Log): Promise<LogAck> | Observable<LogAck> | LogAck {
    return this.logsService.sendLogs(request);
  }
}
