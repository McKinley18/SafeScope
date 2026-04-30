import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AgencyCode = 'OSHA' | 'MSHA';
export type StandardScope = 'general_industry' | 'construction' | 'mining' | 'mixed';

@Entity('standards_master')
@Index(['agencyCode', 'citation'], { unique: true })
export class Standard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'agency_code' })
  agencyCode: AgencyCode;

  @Column()
  citation: string;

  @Column({ name: 'part_number', nullable: true })
  partNumber?: string;

  @Column({ name: 'subpart', nullable: true })
  subpart?: string;

  @Column()
  title: string;

  @Column({ name: 'standard_text', type: 'text' })
  standardText: string;

  @Column({ name: 'plain_language_summary', type: 'text', nullable: true })
  plainLanguageSummary?: string;

  @Column({ name: 'scope_code' })
  scopeCode: StandardScope;

  @Column({ name: 'hazard_codes', type: 'simple-array', nullable: true })
  hazardCodes?: string[];

  @Column({ name: 'keywords', type: 'simple-array', nullable: true })
  keywords?: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
