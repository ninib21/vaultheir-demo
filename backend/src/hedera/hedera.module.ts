import { Module } from '@nestjs/common';
import { HederaService } from './hedera.service';
import { HederaController } from './hedera.controller';

@Module({
  providers: [HederaService],
  controllers: [HederaController],
  exports: [HederaService],
})
export class HederaModule {}

