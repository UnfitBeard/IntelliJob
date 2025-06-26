import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, OneToOne, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { JobSeeker } from './JobSeeker';
import { Message } from './Message';
import { Recruiter } from './Recruiter';
import { UserActivity } from './UserActivity';
import { Notification } from './Notifications';

export enum UserType {
  ADMIN = "admin",
  RECRUITER = "recruiter",
  JOB_SEEKER = "job_seeker",
}
// Users
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({enum: UserType})
  user_type!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ nullable: true })
  last_login!: Date;

  @Column({ default: false })
  is_verified!: boolean;

  @Column({ nullable: true })
  profile_picture_url!: string;

  @OneToMany(() => JobSeeker, jobSeeker => jobSeeker.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  jobSeekers!: JobSeeker[];

  @OneToMany(() => Recruiter, recruiter => recruiter.user,{
    cascade: true,
    onDelete: 'CASCADE',
  })
  recruiters!: Recruiter[];


  @OneToMany(() => Message, message => message.sender, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sentMessages!: Message[];

  @OneToMany(() => Message, message => message.receiver)
  receivedMessages!: Message[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications!: Notification[];

  @OneToMany(() => UserActivity, activity => activity.user)
  activities!: UserActivity[];
}














