import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ReportAttachment } from './attachment.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  displayId: string;

  @OneToMany(() => ReportAttachment, (attachment) => attachment.report, { cascade: true })
  attachments: ReportAttachment[];

  @Column({ default: 'default' })
  tenantId: string;

  @Column({ nullable: true })
  createdByUserId: string;

  @Column({ nullable: true })
  siteId: string;

  @Column({ nullable: true })
  sourceType: string;

  @Column({ type: 'timestamp', nullable: true })
  eventDatetime: Date;

  @Column({ type: 'timestamp' })
  reportedDatetime: Date;

  @Column({ nullable: true })
  eventTypeCode: string;

  @Column({ nullable: true })
  title: string;

  @Column('text', { nullable: true })
  narrative: string;

  @Column({ default: 'received' })
  intakeStatus: string;

  @Column({ nullable: true })
  aiStatus: string;

  @Column({ default: 'draft' })
  reportStatus: string;

  @Column({ type: 'float', nullable: true })
  confidenceScore: number;

  @Column({ nullable: true })
  hazardDescription: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  equipment: string;

  @Column({ nullable: true })
  workActivity: string;

  @Column({ nullable: true })
  severity: string;

  @Column({ default: false })
  immediateDanger: boolean;

  @Column('text', { nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  likelyStandards: any[];

  @Column({ nullable: true })
  reviewDecision: string;

  @Column('text', { nullable: true })
  reviewDecisionNotes: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
