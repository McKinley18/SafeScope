import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  displayId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  passwordResetTokenHash: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpiresAt: Date;

  @Column({ default: 'default' })
  tenantId: string;

  @Column({ default: 'individual' })
  workspaceType: 'individual' | 'company';

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: 1 })
  workspaceSeatLimit: number;

  @Column({ default: 'inspector' })
  role: 'owner' | 'admin' | 'manager' | 'inspector' | 'viewer';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
