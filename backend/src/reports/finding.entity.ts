import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class Finding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hazard: string;

  @Column('int')
  severity: number;

  @Column('int')
  likelihood: number;

  // store standards as JSON snapshot
  @Column({ type: 'jsonb', nullable: true })
  standards: any[];

  @ManyToOne(() => Report, (report) => report.findings)
  report: Report;
}
