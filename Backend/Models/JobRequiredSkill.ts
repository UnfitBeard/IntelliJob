import { Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Job } from "./Job";
import { Skill } from "./Skill";

// Job Required Skills (junction table)
@Entity()
export class JobRequiredSkill {
  @PrimaryGeneratedColumn()
  job_id!: number;

  @PrimaryColumn()
  skill_id!: number;

  @ManyToOne(() => Job, job => job.skills)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @ManyToOne(() => Skill, skill => skill.jobRequiredSkills)
  @JoinColumn({ name: 'skill_id' })
  skill!: Skill;

  @Column({ nullable: true })
  required_level!: string;

  @Column({ type: 'numeric', default: 1.0 })
  importance_weight!: number;
}