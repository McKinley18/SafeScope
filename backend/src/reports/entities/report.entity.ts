import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Finding } from './finding.entity';
import { ReportAttachment } from './attachment.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  site: string;

  @Column({ nullable: true })
  inspector: string;

  @Column({ nullable: true })
  type: string;

  @Column({ default: false })
  confidential: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Finding, (finding) => finding.report, {
    cascade: true,
    eager: true,
  })
  findings: Finding[];

  @OneToMany(() => ReportAttachment, (attachment) => attachment.report)
  attachments: ReportAttachment[];
}
