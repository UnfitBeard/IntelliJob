import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Job } from "./Job";
import { JobSeeker } from "./JobSeeker";

// Matches
@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  match_id!: number;

  @ManyToOne(() => JobSeeker, jobSeeker => jobSeeker.matches)
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker!: JobSeeker;

  @ManyToOne(() => Job, job => job.job_id)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column({ type: 'numeric' })
  match_score!: number;

  @Column({ default: () => 'CURRENT_DATE' })
  matched_on!: Date;

  @Column({ nullable: true })
  ai_version!: string;

  @Column({ type: 'smallint', nullable: true })
  recruiter_rating!: number;

  @Column({ type: 'smallint', nullable: true })
  seeker_rating!: number;
}