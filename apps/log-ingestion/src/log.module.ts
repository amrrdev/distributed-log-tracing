import { Module } from '@nestjs/common';
import { LogsController } from './log.controller';
import { LogsService } from './log.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '../src/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          producerOnlyMode: true,
          client: {
            brokers: ['localhost:9092'],
            clientId: 'log-producer',
          },
          consumer: {
            groupId: 'log-consumer-group', // Must be unique for each app instance
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogModule {}
