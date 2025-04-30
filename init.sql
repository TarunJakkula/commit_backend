SELECT 'CREATE DATABASE commit' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'commit');

CREATE TABLE IF NOT EXISTS users (
    _id SERIAL PRIMARY KEY,
    f_name VARCHAR(30) NOT NULL,
    l_name VARCHAR(30),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_pic BYTEA
);

CREATE TABLE IF NOT EXISTS commits (
    _id SERIAL PRIMARY KEY,
    commit TEXT NOT NULL,
    time_created TIMESTAMP NOT NULL,
    tag VARCHAR(20),
    mutated_to INTEGER,
    mutation_level INTEGER NOT NULL,
    tag_color VARCHAR(9) NOT NULL,
    user_id INTEGER NOT NULL,
    group_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS useridsearch ON commits USING hash (user_id);

CREATE TABLE IF NOT EXISTS active_commits (
    _id SERIAL PRIMARY KEY,
    commit_id INTEGER NOT NULL,
    FOREIGN KEY (commit_id) REFERENCES commits(_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS archived_commits (
    _id SERIAL PRIMARY KEY,
    commit_id INTEGER NOT NULL,
    reason_for TEXT NOT NULL,
    FOREIGN KEY (commit_id) REFERENCES commits(_id) ON DELETE CASCADE
);

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
