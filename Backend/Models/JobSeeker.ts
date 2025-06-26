import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { Application } from "./Application";
import { JobSeekerSkill } from "./JobSeekerSkill";
import { Match } from "./Match";
import { Project } from "./Project";
import { User } from "./User";

// Job Seekers
@Entity()
export class JobSeeker {
  @PrimaryGeneratedColumn()
  job_seeker_id!: number;

  @ManyToOne(() => User, user => user.jobSeekers)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({ nullable: true })
  phone!: string; // New field

  @Column({ nullable: true })
  location!: string; // New field

  @Column({ nullable: true })
  bio!: string; // New field

  @Column({ name: 'linkedin_url', nullable: true })
  linkedin_url!: string; // New field

  @Column({ name: 'experience_level', nullable: true })
  experience_level!: string; // New field

  @Column({ nullable: true })
  postal_address!: string; // New field

  @OneToMany(() => Application, application => application.jobSeeker)
  applications!: Application[];

  @OneToMany(() => JobSeekerSkill, jobSeekerSkill => jobSeekerSkill.jobSeeker)
  skills!: JobSeekerSkill[];

  @OneToMany(() => Match, match => match.jobSeeker)
  matches!: Match[];

  @OneToMany(() => Project, project => project.jobSeeker)
  projects!: Project[];
}
