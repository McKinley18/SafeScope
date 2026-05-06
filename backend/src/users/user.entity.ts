import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'Worker' | 'Supervisor' | 'Manager' | 'Admin';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'Worker' })
  role: UserRole;
}
