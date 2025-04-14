import { Module } from '@nestjs/common';
import { ProtoService } from './proto.service';

@Module({
  providers: [ProtoService],
  exports: [ProtoService],
})
export class ProtoModule {}
