-- Tạo database và user
CREATE USER edu_user WITH ENCRYPTED PASSWORD 'edu_password';
ALTER USER edu_user CREATEDB;
CREATE DATABASE edu_theme_db OWNER edu_user;
GRANT ALL PRIVILEGES ON DATABASE edu_theme_db TO edu_user;
