import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Standard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  citation: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column()
  category: string;
}
