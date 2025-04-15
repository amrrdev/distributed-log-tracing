import { NestFactory } from '@nestjs/core';
import { LogProcessorModule } from './log-processor.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LogProcessorModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'log-processor',
          brokers: ['localhost:9092'],
        },
      },
    },
  );
  await app.listen();
  console.log('Kafka log processor is running...');
}
bootstrap();
