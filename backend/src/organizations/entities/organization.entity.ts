import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Site } from '../../sites/entities/site.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Site, site => site.organization)
  sites: Site[];

  @CreateDateColumn()
  createdAt: Date;
}
