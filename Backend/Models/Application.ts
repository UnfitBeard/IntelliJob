import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { JobSeeker } from './JobSeeker'; // Assuming you have the JobSeeker entity
import { Job } from './Job'; // Assuming you have the Job entity

export enum ApplicationStatus {
  APPLIED = 'applied',
  VIEWED = 'viewed',
  INTERVIEWING = 'interviewing',
  OFFERED = 'offered',
  REJECTED = 'rejected',
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  application_id!: number;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.applications)
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker!: JobSeeker;

  @ManyToOne(() => Job, (job) => job.applications,)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  application_date!: Date;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED,
  })
  status!: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  cover_letter?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  match_score?: number;
}
