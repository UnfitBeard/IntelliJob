import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { User } from "./User";

// Notifications
@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ nullable: true })
  type!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ default: false })
  read_status!: boolean;

  @Column({ nullable: true })
  related_entity_id!: number;

  @Column({ type: 'smallint', default: 1 })
  priority!: number;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user!: User;

}