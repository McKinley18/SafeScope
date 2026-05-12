import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Organization, org => org.sites)
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
