CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('job_seeker', 'recruiter', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_picture_url VARCHAR(512)
);

CREATE TABLE JobSeekers (
    job_seeker_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    bio TEXT,
    resume_url VARCHAR(512),
    linkedin_url VARCHAR(512),
    github_url VARCHAR(512),
);

CREATE TABLE Companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50),
    website VARCHAR(512),
    logo_url VARCHAR(512),
    description TEXT,
    headquarters VARCHAR(100),
    founded_year INT,
    company_type VARCHAR(50)
);

CREATE TABLE Recruiters (
    recruiter_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    company_id INT REFERENCES Companies(company_id),
    position VARCHAR(100),
    phone VARCHAR(20),
    hiring_volume VARCHAR(50),
    average_time_to_hire VARCHAR(50),
    specialization VARCHAR(100)
);

CREATE TABLE Jobs (
    job_id SERIAL PRIMARY KEY,
    company_id INT REFERENCES Companies(company_id),
    recruiter_id INT REFERENCES Recruiters(recruiter_id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    salary_range INT4RANGE,
    job_type VARCHAR(50),
    posted_date DATE DEFAULT CURRENT_DATE,
    expiration_date DATE,
    status VARCHAR(20) DEFAULT 'open',
    experience_required VARCHAR(50),
    application_count INT DEFAULT 0
);
CREATE TABLE Applications (
    application_id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES JobSeekers(job_seeker_id),
    job_id INT REFERENCES Jobs(job_id),
    application_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'interviewing', 'offered', 'rejected')),
    cover_letter TEXT,
    resume_version VARCHAR(50),
    match_score DECIMAL(5,2),
    feedback TEXT,
    applied_via VARCHAR(20)
);

CREATE TABLE Interviews (
    interview_id SERIAL PRIMARY KEY,
    application_id INT REFERENCES Applications(application_id),
    date_time TIMESTAMP,
    duration INTERVAL,
    interview_type VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('scheduled', 'completed')),
    interviewer_notes TEXT,
    candidate_rating SMALLINT CHECK (candidate_rating BETWEEN 1 AND 5),
    feedback TEXT,
    video_call_link VARCHAR(512)
);

CREATE TABLE Skills (
    skill_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(20) CHECK (category IN ('tech', 'soft', 'tools')),
    ai_weight DECIMAL(3,2) DEFAULT 1.00,
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE JobSeekerSkills (
    job_seeker_id INT REFERENCES JobSeekers(job_seeker_id),
    skill_id INT REFERENCES Skills(skill_id),
    experience_level VARCHAR(50),
    years_experience DECIMAL(3,1),
    last_used DATE,
    ai_certified BOOLEAN DEFAULT FALSE,
    projects_count INT DEFAULT 0,
    PRIMARY KEY (job_seeker_id, skill_id)
);

CREATE TABLE JobRequiredSkills (
    job_id INT REFERENCES Jobs(job_id),
    skill_id INT REFERENCES Skills(skill_id),
    required_level VARCHAR(50),
    importance_weight DECIMAL(3,2) DEFAULT 1.00,
    PRIMARY KEY (job_id, skill_id)
);

CREATE TABLE Projects (
    project_id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES JobSeekers(job_seeker_id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    skills_used TEXT,
    project_url VARCHAR(512),
    is_current BOOLEAN,
    team_size SMALLINT,
    role VARCHAR(100)
);

CREATE TABLE Matches (
    match_id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES JobSeekers(job_seeker_id),
    job_id INT REFERENCES Jobs(job_id),
    match_score DECIMAL(5,2),
    matched_on DATE DEFAULT CURRENT_DATE,
    ai_version VARCHAR(50),
    recruiter_rating SMALLINT CHECK (recruiter_rating BETWEEN 1 AND 5),
    seeker_rating SMALLINT CHECK (seeker_rating BETWEEN 1 AND 5)
);

CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES Users(user_id),
    receiver_id INT REFERENCES Users(user_id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    message_type VARCHAR(50),
    related_job_id INT REFERENCES Jobs(job_id)
);

CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    content TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('application', 'message', 'interview', 'match')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE,
    related_entity_id INT,
    priority SMALLINT DEFAULT 1
);

CREATE TABLE UserActivities (
    activity_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    activity_type VARCHAR(20) CHECK (activity_type IN ('search', 'apply', 'view', 'message', 'profile_update')),
    target_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_info JSONB,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

CREATE TABLE AI_Models (
    model_id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    trained_date DATE,
    accuracy DECIMAL(5,2),
    purpose VARCHAR(50),
    active_status BOOLEAN DEFAULT TRUE,
    training_data_range DATERANGE
);





