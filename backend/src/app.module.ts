import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HederaModule } from './hedera/hedera.module';
import { PricingModule } from './pricing/pricing.module';
import { IPAssetsModule } from './ip-assets/ip-assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'vaultheir',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'vaultheir',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:27017/vaultheir'
    ),
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    HederaModule,
    PricingModule,
    IPAssetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

