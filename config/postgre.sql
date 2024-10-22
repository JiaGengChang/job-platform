CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    date_posted TIMESTAMP NOT NULL,
    original_link TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    UNIQUE (job_title, job_description, company_name, original_link, location)
);

CREATE SCHEMA auth;
CREATE TABLE auth.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE auth.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);
CREATE TABLE auth.user_roles (
    user_id INTEGER NOT NULL REFERENCES auth.users(id),
    role_id INTEGER NOT NULL REFERENCES auth.roles(id),
    PRIMARY KEY (user_id, role_id)
);

/*optional - auto delete user info from other tables*/
/*
ALTER TABLE auth.user_roles
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;
*/

CREATE TABLE auth.permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);
CREATE TABLE auth.role_permissions (
    role_id INTEGER NOT NULL REFERENCES auth.roles(id),
    permission_id INTEGER NOT NULL REFERENCES auth.permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

INSERT INTO auth.roles (name, description) VALUES
    ('admin', 'System administrator'),  --developer
    ('moderator', 'Content Moderator'), --recruiter
    ('user', 'Regular user');           --job seeker

INSERT INTO auth.permissions (name, description) VALUES
    ('create_job', 'Create new job postings'),
    ('edit_job', 'Edit existing job postings'),
    ('delete_job', 'Delete job postings'),
    ('apply_job', 'Apply to job postings');

INSERT INTO auth.role_permissions (role_id, permission_id) VALUES
    (1, 1),  -- admin can create jobs
    (1, 2),  -- admin can edit jobs
    (1, 3),  -- admin can delete jobs
    (1, 4),  -- admin can apply to jobs
    (2, 1),  -- moderator can create jobs
    (2, 2),  -- moderator can edit jobs
    (2, 3),  -- moderator can delete jobs
    (3, 4);  -- user can apply to jobs

CREATE TABLE auth.token_blacklist (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    expiry TIMESTAMP NOT NULL
);