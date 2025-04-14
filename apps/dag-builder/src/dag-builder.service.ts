import { Injectable } from '@nestjs/common';

@Injectable()
export class DagBuilderService {
  getHello(): string {
    return 'Hello World!';
  }
}
