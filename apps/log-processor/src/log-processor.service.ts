import { Injectable } from '@nestjs/common';

@Injectable()
export class LogProcessorService {
  getHello(): string {
    return 'Hello World!';
  }
}
