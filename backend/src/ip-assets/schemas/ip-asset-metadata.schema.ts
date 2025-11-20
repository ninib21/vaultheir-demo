import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IPAssetMetadataDocument = IPAssetMetadata & Document;

@Schema({ timestamps: true })
export class IPAssetMetadata {
  @Prop({ required: true })
  assetId: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  aiValuation: number;

  @Prop()
  tags: string[];

  @Prop()
  category: string;
}

export const IPAssetMetadataSchema = SchemaFactory.createForClass(IPAssetMetadata);

