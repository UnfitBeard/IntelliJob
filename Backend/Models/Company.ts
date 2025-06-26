import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Job } from "./Job";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  company_id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  industry!: string;

  @Column({ nullable: true })
  size!: string;

  @Column({ nullable: true })
  website!: string;

  @Column({ nullable: true })
  logo_url!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @OneToMany(() => Job, job => job.company)
  jobs!: Job[];
}