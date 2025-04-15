import { NestFactory } from '@nestjs/core';
import { AppModule } from './logs/log.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { LOGS } from '@app/proto/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const grpcServer = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: LOGS,
      protoPath: join(__dirname, '../../../libs/proto/src/log.proto'),
      url: 'localhost:50051',
    },
  });
  await grpcServer.listen();
  console.log('gRPC server listening on localhost:50051');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
