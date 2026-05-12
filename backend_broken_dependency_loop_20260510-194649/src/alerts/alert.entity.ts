import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column()
  severity: string;

  @Column()
  reportId: string;

  @Column({ default: false })
  acknowledged: boolean;

  @Column({ nullable: true })
  acknowledgedAt: string;
}
