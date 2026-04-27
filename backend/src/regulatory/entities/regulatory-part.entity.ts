import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(['agencyCode', 'titleNumber', 'part'])
export class RegulatoryPart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agencyCode: string;

  @Column()
  titleNumber: string;

  @Column({ nullable: true })
  chapter: string;

  @Column({ nullable: true })
  subchapter: string;

  @Column()
  part: string;

  @Column()
  heading: string;

  @Column({ nullable: true })
  sourceUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
