import { Controller } from '@nestjs/common';
import { QueryService } from './query-service.service';
import {
  Dag,
  DagList,
  Empty,
  LogList,
  QueryServiceController,
  QueryServiceControllerMethods,
  TraceIdRequest,
} from '../../../libs/proto/src/query';
import { Observable } from 'rxjs';

@Controller()
@QueryServiceControllerMethods()
export class QueryController implements QueryServiceController {
  constructor(private readonly queryService: QueryService) {}

  async getLogs(request: Empty) {
    return await this.queryService.getLogs(request);
  }
  async getDags(request: Empty): Promise<DagList> {
    return await this.queryService.getDags(request);
  }
  getLogsByTraceId(
    request: TraceIdRequest,
  ): Promise<LogList> | Observable<LogList> | LogList {
    return this.queryService.getLogsByTraceId(request);
  }
  getDagByTraceId(
    request: TraceIdRequest,
  ): Promise<Dag> | Observable<Dag> | Dag {
    return this.queryService.getDagByTraceId(request);
  }
}
