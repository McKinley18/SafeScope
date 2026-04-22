import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ReportAttachment } from './attachment.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ... rest of the fields
  @OneToMany(() => ReportAttachment, (attachment) => attachment.report)
  attachments: ReportAttachment[];

  siteId: string;

  @Column({ nullable: true })
  sourceType: string;

  @Column({ type: 'timestamp' })
  eventDatetime: Date;

  @Column({ type: 'timestamp' })
  reportedDatetime: Date;

  @Column()
  eventTypeCode: string;

  @Column()
  title: string;

  @Column('text')
  narrative: string;

  @Column({ default: 'received' })
  intakeStatus: string;

  @Column({ nullable: true })
  aiStatus: string;

  @Column({ default: 'open' })
  reportStatus: string;

  @Column({ type: 'float', nullable: true })
  confidenceScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
