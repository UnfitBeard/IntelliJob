import { DataSource, In, Not } from "typeorm";
import { Application } from "../Models/Application";
import { Company } from "../Models/Company";
import { Interview } from "../Models/Interview";
import { Job } from "../Models/Job";
import { JobRequiredSkill } from "../Models/JobRequiredSkill";
import { JobSeeker } from "../Models/JobSeeker";
import { JobSeekerSkill } from "../Models/JobSeekerSkill";
import { Match } from "../Models/Match";
import { Message } from "../Models/Message";
import { Project } from "../Models/Project";
import { Recruiter } from "../Models/Recruiter";
import { Skill } from "../Models/Skill";
import { User } from "../Models/User";
import { UserActivity } from "../Models/UserActivity";
import { Notification } from "../Models/Notifications";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "skillsmatch2.cm3sy866c0qr.us-east-1.rds.amazonaws.com",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "SkillsMatchAI",
    synchronize: true,
    logging: false,
    ssl: {
      rejectUnauthorized: false, // disables CA check (ok for dev)
    },
    entities: [User, Company, Skill, Application, Interview, Job, JobSeeker, Recruiter, JobRequiredSkill, Interview, Message, Notification, UserActivity, JobSeekerSkill, Match, Project ],
    migrations: ["migration/*.ts"],
    subscribers: [],
  });





