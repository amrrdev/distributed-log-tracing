import { NestFactory } from '@nestjs/core';
import { QueryModule } from './query-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUERY } from '@app/proto/constants';
import path, { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    QueryModule,
    {
      transport: Transport.GRPC,
      options: {
        package: QUERY,
        protoPath: join(__dirname, '../../../libs/proto/src/query.proto'),
        url: 'localhost:50052',
      },
    },
  );
  await app.listen();
}
bootstrap();
