import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Finding } from './finding.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: string;

  @Column()
  site: string;

  @Column()
  inspector: string;

  @Column()
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
}

