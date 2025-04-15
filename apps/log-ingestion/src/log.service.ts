import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Log, LogAck } from '@app/proto';
import { Observable } from 'rxjs';
import { KAFKA_CLIENT } from './constants';
import { ClientKafka, ClientKafkaProxy } from '@nestjs/microservices';

@Injectable()
export class LogsService {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafkaProxy,
  ) {}

  sendLogs(request: Log): Promise<LogAck> | Observable<LogAck> | LogAck {
    this.kafkaClient.emit('logs', {
      key: request.traceId,
      value: request,
    });
    return Promise.resolve({ status: 'ok' });
  }
}
