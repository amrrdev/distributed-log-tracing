import { Module } from '@nestjs/common';
import { DagBuilderController } from './dag-builder.controller';
import { DagBuilderService } from './dag-builder.service';

@Module({
  imports: [],
  controllers: [DagBuilderController],
  providers: [DagBuilderService],
})
export class DagBuilderModule {}
