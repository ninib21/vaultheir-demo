import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ip_assets')
export class IPAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // 'patent', 'trademark', 'copyright', etc.

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  hederaFileId: string;

  @Column({ nullable: true })
  hederaTransactionId: string;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'notarized', 'verified'

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

