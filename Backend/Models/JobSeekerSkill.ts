import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Skill } from "./Skill";
import { JobSeeker } from "./JobSeeker";

@Entity()
export class JobSeekerSkill {
  @PrimaryColumn()
  job_seeker_id!: number;

  @PrimaryColumn()
  skill_id!: number;

  @ManyToOne(() => JobSeeker, jobSeeker => jobSeeker.skills)
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker!: JobSeeker;

  @ManyToOne(() => Skill, skill => skill.skill_id)
  @JoinColumn({ name: 'skill_id' })
  skill!: Skill;

  @Column({ nullable: true })
  experience_level!: string;

  @Column({ type: 'numeric', nullable: true })
  years_experience!: number;

  @Column({ nullable: true })
  last_used!: Date;

  @Column({ default: false })
  ai_certified!: boolean;

  @Column({ default: 0 })
  projects_count!: number;
}
