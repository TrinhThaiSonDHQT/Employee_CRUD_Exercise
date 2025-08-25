-- Drop and recreate the database
DROP DATABASE IF EXISTS employee_crud;
CREATE DATABASE employee_crud;
USE employee_crud;

-- Create tables
CREATE TABLE employee (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    hashed_password VARCHAR(255)
);

-- Insert some sample data (optional)
INSERT INTO employee (full_name, email, date_of_birth, gender, phone_number, active, hashed_password)
VALUES 
('John Doe', 'john.doe@example.com', '1990-01-15', 'Male', '123-456-7890', 1, 'password123'),
('Jane Smith', 'jane.smith@example.com', '1992-05-20', 'Female', '987-654-3210', 1, 'password456');

-- Show the newly created tables
SHOW TABLES;
