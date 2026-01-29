-- Test data for PostgreSQL
CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO persons (name, age) VALUES
    ('Test User 1', 25),
    ('Test User 2', 30),
    ('Test User 3', 35);