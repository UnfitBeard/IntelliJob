import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { Company } from "./Company";
import { Application } from "./Application";
import { Recruiter } from "./Recruiter";

export enum JobStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    DRAFT = 'draft'
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  job_id!: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @Column({ name: 'company_id' })
  company_id!: number;

  @ManyToOne(() => Recruiter, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recruiter_id' })
  recruiter!: Recruiter;

  @Column({ name: 'recruiter_id', nullable: true })
  recruiter_id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ type: 'int4range', nullable: true })
  salary_range!: string;

  @Column({ name: 'job_type', nullable: true })
  job_type!: string;

  @Column({ name: 'posted_date', default: () => 'CURRENT_DATE' })
  posted_date!: Date;

  @Column({ name: 'expiration_date', nullable: true })
  expiration_date!: Date;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.OPEN })
  status!: JobStatus;
  
  @Column({ name: 'experience_required', nullable: true })
  experience_required!: string;

  @Column({ type: 'text', array: true, nullable: true })
  skills!: string[];

  @Column({ name: 'experience_level', nullable: true })
  experience_level!: string;

  @Column({ nullable: true })
  education!: string;

  @Column({ name: 'min_salary', type: 'integer', nullable: true })
  min_salary!: number;

  @Column({ name: 'max_salary', type: 'integer', nullable: true })
  max_salary!: number;

  @OneToMany(() => Application, application => application.job, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  applications!: Application[];
}
