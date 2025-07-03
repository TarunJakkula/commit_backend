SELECT 'CREATE DATABASE commit' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'commit');

CREATE TABLE IF NOT EXISTS users (
    _id SERIAL PRIMARY KEY,
    f_name VARCHAR(30) NOT NULL,
    l_name VARCHAR(30),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_pic TEXT
);

CREATE TYPE valid_status AS ENUM ('Active', 'Inactive');

CREATE TABLE IF NOT EXISTS branches (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status valid_status NOT NULL,
    latest_commit INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS commits (
    _id SERIAL PRIMARY KEY,
    commit TEXT NOT NULL,
    time_created TIMESTAMP NOT NULL,
    tag VARCHAR(20),
    mutated_to INTEGER,
    mutation_level INTEGER NOT NULL,
    tag_color VARCHAR(9) NOT NULL,
    branch_id INTEGER NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS branchidsearch ON commits USING hash (branch_id);

CREATE TABLE IF NOT EXISTS reset_codes (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    code INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(_id)
);

CREATE TABLE IF NOT EXISTS verification_codes (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    code INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(_id)
);
