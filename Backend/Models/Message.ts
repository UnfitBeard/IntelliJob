import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Job } from "./Job";
import { User } from "./User";

// Messages
@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  message_id!: number;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender!: User;

  @ManyToOne(() => User, user => user.receivedMessages)
  @JoinColumn({ name: 'receiver_id' })
  receiver!: User;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  sent_at!: Date;

  @Column({ nullable: true })
  read_at!: Date;

  @Column({ nullable: true })
  message_type!: string;

  @ManyToOne(() => Job, job => job.job_id)
  @JoinColumn({ name: 'related_job_id' })
  relatedJob!: Job;
}
