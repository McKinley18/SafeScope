import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hazard: string;

  @Column()
  citation: string;

  @Column()
  action: string; // accept | reject | change

  @Column({ nullable: true })
  replacementCitation: string;

  @CreateDateColumn()
  createdAt: Date;
}
