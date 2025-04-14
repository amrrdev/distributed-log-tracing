import { NestFactory } from '@nestjs/core';
import { LogProcessorModule } from './log-processor.module';

async function bootstrap() {
  const app = await NestFactory.create(LogProcessorModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
