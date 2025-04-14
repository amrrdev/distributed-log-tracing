import { Controller, Get } from '@nestjs/common';
import { DagBuilderService } from './dag-builder.service';

@Controller()
export class DagBuilderController {
  constructor(private readonly dagBuilderService: DagBuilderService) {}

  @Get()
  getHello(): string {
    return this.dagBuilderService.getHello();
  }
}
