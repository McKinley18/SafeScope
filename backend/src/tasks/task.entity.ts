import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hazardType: string;

  @Column()
  description: string;

  @Column({ default: 'Open' })
  status: string;

  @ManyToOne(() => User, { eager: true })
  assignedTo: User;
}
