import { Entity, Column, PrimaryColumn, Index, CreateDateColumn } from 'typeorm';

@Entity('idempotency_records')
@Index(['idempotencyKey'])
@Index(['processingDate'])
@Index(['createdAt'])
export class IdempotencyRecord {
  @PrimaryColumn('varchar', { length: 255 })
  contextHash: string;

  @Column('varchar', { length: 255 })
  @Index()
  idempotencyKey: string;

  @Column('varchar', { length: 10 })
  processingDate: string; // YYYY-MM-DD format for determinism

  @Column('bigint')
  logicalTimestamp: number;

  @Column('jsonb')
  requestData: any;

  @Column('jsonb')
  responseData: any;

  @Column('varchar', { length: 100 })
  endpoint: string;

  @Column('varchar', { length: 10 })
  method: string;

  @Column('varchar', { length: 50 })
  status: string; // 'success', 'error', 'processing'

  @Column('text', { nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  expiresAt: Date;
}
