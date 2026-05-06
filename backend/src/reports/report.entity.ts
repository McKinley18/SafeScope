import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hazardType: string;

  @Column()
  description: string;

  @Column()
  environment: string;

  @Column()
  equipment: string;

  @Column()
  risk: string;

  @Column('json')
  matches: any;

  @CreateDateColumn()
  createdAt: Date;
}
