import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { IPAssetsService } from './ip-assets.service';
import { IPAssetsController } from './ip-assets.controller';
import { IPAsset } from './entities/ip-asset.entity';
import { IPAssetMetadata, IPAssetMetadataSchema } from './schemas/ip-asset-metadata.schema';
import { HederaModule } from '../hedera/hedera.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IPAsset]),
    MongooseModule.forFeature([
      { name: IPAssetMetadata.name, schema: IPAssetMetadataSchema },
    ]),
    HederaModule,
  ],
  providers: [IPAssetsService],
  controllers: [IPAssetsController],
  exports: [IPAssetsService],
})
export class IPAssetsModule {}

