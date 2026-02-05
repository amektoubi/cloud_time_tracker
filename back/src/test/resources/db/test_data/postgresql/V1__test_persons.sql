-- Create table with UUID primary key
CREATE TABLE persons (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data using native UUID generation
INSERT INTO persons (id, name, age) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'John Doe', 30),
    ('b5f3c922-11b2-4d22-8c11-92f750d56567', 'Jane Smith', 25);
