import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { User } from "./User";

// User Activities
@Entity()
export class UserActivity {
  @PrimaryGeneratedColumn()
  activity_id!: number;

  @ManyToOne(() => User, user => user.activities)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ nullable: true })
  activity_type!: string;

  @Column({ nullable: true })
  target_id!: number;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ type: 'jsonb', nullable: true })
  device_info!: object;

  @Column({ type: 'numeric', nullable: true })
  latitude!: number;

  @Column({ type: 'numeric', nullable: true })
  longitude!: number;
}