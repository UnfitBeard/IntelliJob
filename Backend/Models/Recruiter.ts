import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Column } from "typeorm";
import { Company } from "./Company";
import { Job } from "./Job";
import { User } from "./User";

@Entity()
export class Recruiter {
  @PrimaryGeneratedColumn()
  recruiter_id!: number;

  @ManyToOne(() => User, user => user.recruiters)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Company, company => company.company_id)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @OneToMany(() => Job, job => job.recruiter)
  jobs!: Job[];

  // New Fields
  @Column({ type: 'varchar', length: 100 })
  firstname!: string;

  @Column({ type: 'varchar', length: 100 })
  lastname!: string;

  @Column({ type: 'varchar', length: 100 })
  position!: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone!: string;

  @Column({ type: 'varchar', nullable: true })
  avatar!: string;

  @Column({ type: 'boolean', default: false })
  verified!: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating!: number;

  @Column({ type: 'int', nullable: true })
  hires!: number;

  @Column({ type: 'int', nullable: true })
  hiring_volume!: number;

  @Column({ type: 'int', nullable: true })
  average_time_to_hire!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  specialization!: string;
}
