-- Initial database setup for Edu Theme
-- This file will be executed when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'Asia/Ho_Chi_Minh';

-- Initial database is already created via POSTGRES_DB environment variable
-- Additional setup can be added here if needed
