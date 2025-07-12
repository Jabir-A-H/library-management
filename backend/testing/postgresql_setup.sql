-- PostgreSQL setup script for Library Management System
-- Run this script as a PostgreSQL superuser

-- Create database
CREATE DATABASE library_db;

-- Create user (replace with your desired username and password)
CREATE USER library_user WITH ENCRYPTED PASSWORD 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE library_db TO library_user;

-- Connect to the database
\c library_db;

-- Grant additional privileges on schema
GRANT ALL ON SCHEMA public TO library_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO library_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO library_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO library_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO library_user;
