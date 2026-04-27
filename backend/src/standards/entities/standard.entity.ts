import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('standards')
export class Standard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  source: 'MSHA' | 'OSHA';

  @Column()
  titleNumber: string;

  @Column({ nullable: true })
  part: string;

  @Column({ nullable: true })
  section: string;

  @Column({ unique: true })
  citation: string;

  @Column()
  heading: string;

  @Column('text')
  standardText: string;

  @Column('text', { nullable: true })
  summaryPlainLanguage: string;

  @Column('simple-array', { nullable: true })
  keywords: string[];

  @Column({ type: 'timestamp', nullable: true })
  effectiveDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
