import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class Finding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hazard: string;

  @Column()
  severity: number;

  @Column()
  likelihood: number;

  @Column('jsonb', { nullable: true })
  standards: any;

  @ManyToOne(() => Report, (r) => r.findings, { onDelete: 'CASCADE' })
  report: Report;
}
