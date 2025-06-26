import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { JobSeeker } from "./JobSeeker";

// Projects
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  project_id!: number;

  @ManyToOne(() => JobSeeker, jobSeeker => jobSeeker.projects)
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker!: JobSeeker;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true })
  start_date!: Date;

  @Column({ nullable: true })
  end_date!: Date;

  @Column({ type: 'text', nullable: true })
  skills_used!: string;

  @Column({ nullable: true })
  project_url!: string;

  @Column({ nullable: true })
  is_current!: boolean;

  @Column({ type: 'smallint', nullable: true })
  team_size!: number;

  @Column({ nullable: true })
  role!: string;
}