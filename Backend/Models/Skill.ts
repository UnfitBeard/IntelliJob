import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { JobRequiredSkill } from "./JobRequiredSkill";

// Skills
@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  skill_id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  category!: string;

  @Column({ type: 'numeric', default: 1.0 })
  ai_weight!: number;

  @Column({ default: false })
  verified!: boolean;

  @OneToMany(() => JobRequiredSkill, jobRequiredSkill => jobRequiredSkill.skill)
  jobRequiredSkills!: JobRequiredSkill[];
}
