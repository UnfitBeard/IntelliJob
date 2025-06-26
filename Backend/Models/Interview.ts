import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Application } from "./Application";
import { Job } from "./Job";
import { JobSeeker } from "./JobSeeker";

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  interview_id!: number;

  @ManyToOne(() => Application, application => application.application_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application!: Application;

  @ManyToOne(() => JobSeeker)
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker!: JobSeeker;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column({ type: 'timestamp' })
  date_time!: Date;

  @Column()
  interview_type!: string;
}
