import { NestFactory } from '@nestjs/core';
import { DagBuilderModule } from './dag-builder.module';

async function bootstrap() {
  const app = await NestFactory.create(DagBuilderModule);
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
