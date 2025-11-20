import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPAsset } from './entities/ip-asset.entity';
import { IPAssetMetadata, IPAssetMetadataDocument } from './schemas/ip-asset-metadata.schema';
import { HederaService } from '../hedera/hedera.service';

@Injectable()
export class IPAssetsService {
  constructor(
    @InjectRepository(IPAsset)
    private ipAssetRepository: Repository<IPAsset>,
    @InjectModel(IPAssetMetadata.name)
    private metadataModel: Model<IPAssetMetadataDocument>,
    private hederaService: HederaService,
  ) {}

  async create(createDto: Partial<IPAsset>) {
    const asset = this.ipAssetRepository.create(createDto);
    return this.ipAssetRepository.save(asset);
  }

  async findAll(userId: string) {
    return this.ipAssetRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.ipAssetRepository.findOne({ where: { id } });
  }

  async notarize(id: string, content: string) {
    const asset = await this.findOne(id);
    if (!asset) {
      throw new Error('IP asset not found');
    }

    try {
      const response = await this.hederaService.notarizeIPAsset(content);
      
      asset.hederaTransactionId = response.transactionId.toString();
      asset.status = 'notarized';
      
      await this.ipAssetRepository.save(asset);

      return {
        success: true,
        transactionId: response.transactionId.toString(),
        asset,
      };
    } catch (error) {
      throw error;
    }
  }

  async addMetadata(assetId: string, metadata: Record<string, any>) {
    const existing = await this.metadataModel.findOne({ assetId });
    
    if (existing) {
      existing.metadata = { ...existing.metadata, ...metadata };
      return existing.save();
    }

    const newMetadata = new this.metadataModel({ assetId, metadata });
    return newMetadata.save();
  }
}

