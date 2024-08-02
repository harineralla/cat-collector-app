CREATE DATABASE cat_collector;

\c cat_collector;

CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(50),
    url TEXT,
    favorite BOOLEAN DEFAULT FALSE,
    custom_name TEXT,
    description TEXT
);
